document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    const user = JSON.parse(userString);
    if (!user.isAdmin) {
        window.location.href = '../index.html';
        return;
    }
    
    // Set admin info
    document.getElementById('admin-name').textContent = user.displayName;
    document.getElementById('dropdown-admin-name').textContent = user.displayName;
    
    // Set admin avatar
    const avatarElements = document.querySelectorAll('#user-avatar, #header-avatar');
    avatarElements.forEach(avatar => {
        avatar.src = user.photoURL;
    });
    
    // Dashboard navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Get section ID
            const sectionId = this.dataset.section;
            
            // Hide all sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Update page title
            pageTitle.textContent = this.querySelector('span').textContent;
            
            // Close mobile sidebar if open
            if (window.innerWidth < 768) {
                document.querySelector('.sidebar').classList.remove('mobile-open');
            }
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('mobile-open');
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('mobile-open');
        });
    }
    
    // Handle logout
    const logoutButtons = document.querySelectorAll('#logout-btn, #header-logout');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            signOut();
        });
    });

    // Load dashboard data
    loadDashboardData();
    
    // Load members data
    loadMembersData();

    // Set up add member modal
    setupAddMemberModal();
});

// Load dashboard data from Firestore
function loadDashboardData() {
    // Check if dashboard section exists
    const dashboardSection = document.getElementById('dashboard-section');
    if (!dashboardSection) return;
    
    // Get real-time updates on members count
    db.collection('users').where('userType', '==', 'member').get()
        .then((snapshot) => {
            const totalMembers = snapshot.size;
            const totalMembersElement = document.getElementById('total-members');
            if (totalMembersElement) {
                totalMembersElement.textContent = totalMembers;
            }
            
            // Load recent members for the table
            loadRecentMembers(snapshot);
        })
        .catch((error) => {
            console.error('Error loading members:', error);
        });
    
    // Get monthly revenue
    // This would typically be calculated from payment records
    // For demo purposes, we're using dummy data
    // In a real application, you would query payment records and sum them
    
    // Get expiring memberships
    // In a real app, you would query memberships with expiration dates approaching
}

// Load recent members for dashboard table
function loadRecentMembers(membersSnapshot) {
    const recentMembersTable = document.getElementById('recent-members-table');
    if (!recentMembersTable) return;
    
    // Clear table
    recentMembersTable.innerHTML = '';
    
    // Get 4 most recent members
    const recentMembers = membersSnapshot.docs
        .sort((a, b) => b.data().createdAt?.toMillis() - a.data().createdAt?.toMillis())
        .slice(0, 4);
    
    if (recentMembers.length === 0) {
        recentMembersTable.innerHTML = '<tr><td colspan="4" class="text-center">No members found</td></tr>';
        return;
    }
    
    // Add members to table
    recentMembers.forEach((doc) => {
        const member = doc.data();
        const joinDate = member.createdAt ? new Date(member.createdAt.toMillis()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="table-user">
                    <img src="${member.photoURL || 'https://randomuser.me/api/portraits/' + (Math.random() > 0.5 ? 'men' : 'women') + '/' + Math.floor(Math.random() * 100) + '.jpg'}" alt="Member">
                    <div>${member.name || 'Unknown'}</div>
                </div>
            </td>
            <td>${member.membershipPlan || 'Basic'}</td>
            <td>${joinDate}</td>
            <td><span class="status active">Active</span></td>
        `;
        
        recentMembersTable.appendChild(row);
    });
}

// Load all members for members table
function loadMembersData() {
    const membersTable = document.getElementById('members-table');
    if (!membersTable) return;
    
    // Get members collection
    db.collection('users').where('userType', '==', 'member').get()
        .then((snapshot) => {
            // Clear table
            membersTable.innerHTML = '';
            
            if (snapshot.empty) {
                membersTable.innerHTML = '<tr><td colspan="8" class="text-center">No members found</td></tr>';
                return;
            }
            
            // Add members to table
            snapshot.forEach((doc) => {
                const member = doc.data();
                const joinDate = member.createdAt ? new Date(member.createdAt.toMillis()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                
                const row = document.createElement('tr');
                row.dataset.id = doc.id;
                row.innerHTML = `
                    <td><input type="checkbox" class="member-checkbox"></td>
                    <td>
                        <div class="table-user">
                            <img src="${member.photoURL || 'https://randomuser.me/api/portraits/' + (Math.random() > 0.5 ? 'men' : 'women') + '/' + Math.floor(Math.random() * 100) + '.jpg'}" alt="Member">
                            <div>${member.name || 'Unknown'}</div>
                        </div>
                    </td>
                    <td>${member.email || 'N/A'}</td>
                    <td>${member.phone || 'N/A'}</td>
                    <td>${member.membershipPlan || 'Basic'}</td>
                    <td>${joinDate}</td>
                    <td><span class="status active">Active</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view-btn" title="View Details" data-id="${doc.id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-btn" title="Edit Member" data-id="${doc.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" title="Delete Member" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                
                membersTable.appendChild(row);
            });
            
            // Set up action buttons
            setupActionButtons();
        })
        .catch((error) => {
            console.error('Error loading members:', error);
        });
}

// Set up action buttons for members table
function setupActionButtons() {
    // View member
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.dataset.id;
            viewMember(memberId);
        });
    });
    
    // Edit member
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.dataset.id;
            editMember(memberId);
        });
    });
    
    // Delete member
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.dataset.id;
            deleteMember(memberId);
        });
    });
}

// View member function
function viewMember(memberId) {
    console.log('View member:', memberId);
    // In a real app, this would open a modal with member details
}

// Edit member function
function editMember(memberId) {
    console.log('Edit member:', memberId);
    // In a real app, this would open a modal with member details for editing
}

// Delete member function
function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        db.collection('users').doc(memberId).delete()
            .then(() => {
                console.log('Member deleted successfully');
                // Reload members data
                loadMembersData();
                // Reload dashboard data
                loadDashboardData();
            })
            .catch((error) => {
                console.error('Error deleting member:', error);
            });
    }
}

// Set up add member modal
function setupAddMemberModal() {
    const addMemberBtn = document.getElementById('add-member-btn');
    const addMemberModal = document.getElementById('add-member-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelAddMember = document.getElementById('cancel-add-member');
    const saveAddMember = document.getElementById('save-add-member');
    const addMemberForm = document.getElementById('add-member-form');
    
    if (!addMemberBtn || !addMemberModal) return;
    
    // Open modal
    addMemberBtn.addEventListener('click', function() {
        addMemberModal.style.display = 'flex';
    });
    
    // Close modal functions
    const closeModalFunction = function() {
        addMemberModal.style.display = 'none';
        addMemberForm.reset();
    };
    
    if (closeModal) closeModal.addEventListener('click', closeModalFunction);
    if (cancelAddMember) cancelAddMember.addEventListener('click', closeModalFunction);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addMemberModal) {
            closeModalFunction();
        }
    });
    
    // Save new member
    if (saveAddMember && addMemberForm) {
        saveAddMember.addEventListener('click', function() {
            // Validate form
            if (!addMemberForm.checkValidity()) {
                addMemberForm.reportValidity();
                return;
            }
            
            // Get form values
            const name = document.getElementById('member-name').value;
            const email = document.getElementById('member-email').value;
            const phone = document.getElementById('member-phone').value;
            const dob = document.getElementById('member-dob').value;
            const gender = document.getElementById('member-gender').value;
            const address = document.getElementById('member-address').value;
            const packageType = document.getElementById('member-package').value;
            const trainer = document.getElementById('member-trainer').value;
            const startDate = document.getElementById('member-start-date').value;
            const duration = document.getElementById('member-duration').value;
            const notes = document.getElementById('member-notes').value;
            const sendCredentials = document.querySelector('input[name="sendCredentials"]')?.checked || false;
            
            // Generate random password
            const password = Math.random().toString(36).slice(-8);
            
            // Create user in Firebase Authentication
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    
                    // Update profile
                    return user.updateProfile({
                        displayName: name
                    }).then(() => {
                        // Create user document in Firestore
                        return db.collection('users').doc(user.uid).set({
                            name: name,
                            email: email,
                            phone: phone,
                            dob: dob,
                            gender: gender,
                            address: address,
                            membershipPlan: packageType,
                            trainer: trainer,
                            startDate: startDate,
                            duration: parseInt(duration),
                            endDate: calculateEndDate(startDate, parseInt(duration)),
                            notes: notes,
                            userType: 'member',
                            role: 'member',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            createdBy: auth.currentUser.uid
                        });
                    });
                })
                .then(() => {
                    console.log('Member added successfully');
                    
                    // Close modal
                    closeModalFunction();
                    
                    // Send email with credentials
                    if (sendCredentials) {
                        console.log('Sending credentials to:', email);
                        // In a real application, this would send an email with credentials
                    }
                    
                    // Reload members data
                    loadMembersData();
                    
                    // Reload dashboard data
                    loadDashboardData();
                })
                .catch((error) => {
                    console.error('Error adding member:', error);
                    alert(error.message);
                });
        });
    }
}

// Helper function to calculate end date based on start date and duration
function calculateEndDate(startDate, duration) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + duration);
    return date.toISOString().split('T')[0];
}