document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    const isLoginPage = window.location.pathname.includes('login.html');
    // Check if we're on register page
    const isRegisterPage = window.location.pathname.includes('register.html');
    
    // Get alert container
    const alertContainer = document.getElementById('alert-container');
    
    // Handle form submission
    if (isLoginPage) {
        const loginForm = document.getElementById('login-form');
        const googleLoginBtn = document.getElementById('google-login');
        
        // Handle login form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked || false;
            
            // Clear previous alerts
            alertContainer.innerHTML = '';
            
            // Show loading
            showAlert('Signing in...', 'info');
            
            // Set persistence based on remember me
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;
            
            // Set persistence then sign in
            auth.setPersistence(persistence)
                .then(() => {
                    return auth.signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Login successful
                            console.log('Login successful:', userCredential.user);
                            // Redirect is handled by auth state observer
                        })
                        .catch((error) => {
                            // Login failed
                            console.error('Login error:', error);
                            showAlert(getAuthErrorMessage(error), 'error');
                        });
                })
                .catch((error) => {
                    console.error('Persistence error:', error);
                    showAlert('An error occurred. Please try again.', 'error');
                });
        });
        
        // Handle Google login
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function() {
                // Clear previous alerts
                alertContainer.innerHTML = '';
                
                // Show loading
                showAlert('Signing in with Google...', 'info');
                
                signInWithGoogle()
                    .then((result) => {
                        // Google login successful
                        console.log('Google login successful:', result.user);
                        // Redirect is handled by auth state observer
                    })
                    .catch((error) => {
                        // Google login failed
                        console.error('Google login error:', error);
                        showAlert(getAuthErrorMessage(error), 'error');
                    });
            });
        }
    }
    
    if (isRegisterPage) {
        const registerForm = document.getElementById('register-form');
        const googleRegisterBtn = document.getElementById('google-register');
        
        // Handle register form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const userType = document.getElementById('user-type').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Clear previous alerts
            alertContainer.innerHTML = '';
            
            // Validate form
            if (!fullName || !email || !phone || !userType || !password || !confirmPassword) {
                showAlert('Please fill in all fields.', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match.', 'error');
                return;
            }
            
            if (!termsAccepted) {
                showAlert('Please accept the Terms of Service and Privacy Policy.', 'error');
                return;
            }
            
            // Show loading
            showAlert('Creating your account...', 'info');
            
            // Create user with email and password
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Registration successful
                    const user = userCredential.user;
                    console.log('Registration successful:', user);
                    
                    // Update profile and create user document
                    return user.updateProfile({
                        displayName: fullName
                    }).then(() => {
                        // Create user document in Firestore
                        return db.collection('users').doc(user.uid).set({
                            name: fullName,
                            email: email,
                            phone: phone,
                            userType: userType,
                            role: userType === 'member' ? 'member' : 'user',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    });
                })
                .then(() => {
                    // User document created successfully
                    showAlert('Account created successfully! Redirecting...', 'success');
                    // Redirect is handled by auth state observer
                })
                .catch((error) => {
                    // Registration failed
                    console.error('Registration error:', error);
                    showAlert(getAuthErrorMessage(error), 'error');
                });
        });
        
        // Handle Google registration
        if (googleRegisterBtn) {
            googleRegisterBtn.addEventListener('click', function() {
                // Clear previous alerts
                alertContainer.innerHTML = '';
                
                // User must select user type before continuing
                const userType = document.getElementById('user-type').value;
                if (!userType) {
                    showAlert('Please select user type before continuing.', 'error');
                    return;
                }
                
                // Show loading
                showAlert('Signing up with Google...', 'info');
                
                signInWithGoogle()
                    .then((result) => {
                        const user = result.user;
                        const isNewUser = result.additionalUserInfo.isNewUser;
                        
                        if (isNewUser) {
                            // Create user document in Firestore
                            return db.collection('users').doc(user.uid).set({
                                name: user.displayName || 'User',
                                email: user.email,
                                userType: userType,
                                role: userType === 'member' ? 'member' : 'user',
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                        } else {
                            // Update existing user's type
                            return db.collection('users').doc(user.uid).update({
                                userType: userType,
                                role: userType === 'member' ? 'member' : 'user'
                            });
                        }
                    })
                    .then(() => {
                        // User document created/updated successfully
                        showAlert('Account created successfully! Redirecting...', 'success');
                        // Redirect is handled by auth state observer
                    })
                    .catch((error) => {
                        // Google registration failed
                        console.error('Google registration error:', error);
                        showAlert(getAuthErrorMessage(error), 'error');
                    });
            });
        }
    }
    
    // Handle password toggle visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Helper function to show alerts
    function showAlert(message, type) {
        // Clear previous alerts
        alertContainer.innerHTML = '';
        
        const alert = document.createElement('div');
        alert.classList.add('alert');
        
        if (type === 'error') {
            alert.classList.add('alert-error');
        } else if (type === 'success') {
            alert.classList.add('alert-success');
        }
        
        alert.textContent = message;
        alertContainer.appendChild(alert);
    }
    
    // Helper function to get user-friendly error messages
    function getAuthErrorMessage(error) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'This email is already in use. Please use a different email or try logging in.';
            case 'auth/invalid-email':
                return 'The email address is not valid.';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please check your email or register.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again or reset your password.';
            case 'auth/weak-password':
                return 'Password is too weak. Please use a stronger password.';
            case 'auth/too-many-requests':
                return 'Too many unsuccessful login attempts. Please try again later.';
            case 'auth/popup-closed-by-user':
                return 'Sign-in popup was closed before completing the sign in. Please try again.';
            default:
                return 'An error occurred. Please try again.';
        }
    }
});