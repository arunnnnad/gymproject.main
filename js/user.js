document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    const user = JSON.parse(userString);
    
    // Set user info
    const nameElements = document.querySelectorAll('#user-name, #dropdown-user-name, #welcome-name');
    nameElements.forEach(el => {
        if (el) el.textContent = user.displayName;
    });
    
    if (document.getElementById('dropdown-user-email')) {
        document.getElementById('dropdown-user-email').textContent = user.email;
    }
    
    // Set user avatar
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
    
    // Load membership plans
    loadMembershipPlans();
    
    // Load trainers
    loadTrainers();
    
    // Load class schedules
    loadClassSchedules();
    
    // Setup membership plan selection
    setupPlanSelection();
});

// Load membership plans
function loadMembershipPlans() {
    // In a real application, you would fetch membership plans from Firestore
    // For demo purposes, we'll use the placeholder data already in the HTML
    
    // Example of how you might fetch membership plans:
    // db.collection('membership-plans').get()
    //     .then((snapshot) => {
    //         const plansContainer = document.querySelector('.plans-container');
    //         if (!plansContainer) return;
    //         
    //         plansContainer.innerHTML = '';
    //         
    //         snapshot.forEach((doc) => {
    //             const plan = doc.data();
    //             
    //             const planCard = document.createElement('div');
    //             planCard.classList.add('plan-card');
    //             if (plan.featured) planCard.classList.add('featured');
    //             
    //             planCard.innerHTML = `
    //                 <div class="plan-badge">${plan.badge || ''}</div>
    //                 <h3>${plan.name}</h3>
    //                 <div class="plan-price">
    //                     <span class="price">$${plan.price.toFixed(2)}</span>
    //                     <span class="period">/${plan.period}</span>
    //                 </div>
    //                 <ul class="plan-features">
    //                     ${plan.features.map(feature => `
    //                         <li>
    //                             <i class="fas ${feature.included ? 'fa-check' : 'fa-times'}"></i>
    //                             ${feature.text}
    //                         </li>
    //                     `).join('')}
    //                 </ul>
    //                 <button class="btn primary-btn btn-block choose-plan" data-id="${doc.id}">Choose Plan</button>
    //             `;
    //             
    //             plansContainer.appendChild(planCard);
    //         });
    //         
    //         // Add event listeners for plan selection
    //         document.querySelectorAll('.choose-plan').forEach(button => {
    //             button.addEventListener('click', function() {
    //                 selectPlan(this.dataset.id);
    //             });
    //         });
    //     });
}

// Load trainers
function loadTrainers() {
    // In a real application, you would fetch trainers from Firestore
    // For demo purposes, we'll implement this function without actual data fetching
    
    // Example of how you might fetch trainers:
    // db.collection('trainers').get()
    //     .then((snapshot) => {
    //         const trainersSection = document.getElementById('trainers-section');
    //         if (!trainersSection) return;
    //         
    //         const trainersGrid = document.createElement('div');
    //         trainersGrid.classList.add('trainers-grid');
    //         
    //         snapshot.forEach((doc) => {
    //             const trainer = doc.data();
    //             
    //             const trainerCard = document.createElement('div');
    //             trainerCard.classList.add('trainer-card');
    //             
    //             trainerCard.innerHTML = `
    //                 <div class="trainer-image">
    //                     <img src="${trainer.photoURL}" alt="${trainer.name}">
    //                 </div>
    //                 <div class="trainer-details">
    //                     <h3>${trainer.name}</h3>
    //                     <p class="trainer-title">${trainer.specialization}</p>
    //                     <p>${trainer.bio}</p>
    //                     <div class="trainer-social">
    //                         ${trainer.social.facebook ? `<a href="${trainer.social.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
    //                         ${trainer.social.twitter ? `<a href="${trainer.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
    //                         ${trainer.social.instagram ? `<a href="${trainer.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
    //                     </div>
    //                 </div>
    //             `;
    //             
    //             trainersGrid.appendChild(trainerCard);
    //         });
    //         
    //         trainersSection.appendChild(trainersGrid);
    //     });
}

// Load class schedules
function loadClassSchedules() {
    // In a real application, you would fetch class schedules from Firestore
    // For demo purposes, we'll implement this function without actual data fetching
    
    // Example of how you might fetch class schedules:
    // db.collection('classes')
    //     .where('date', '>=', new Date())
    //     .orderBy('date')
    //     .limit(10)
    //     .get()
    //     .then((snapshot) => {
    //         const schedulesSection = document.getElementById('schedules-section');
    //         if (!schedulesSection) return;
    //         
    //         const scheduleGrid = document.createElement('div');
    //         scheduleGrid.classList.add('schedule-grid');
    //         
    //         snapshot.forEach((doc) => {
    //             const classItem = doc.data();
    //             const classDate = classItem.date.toDate();
    //             
    //             const scheduleItem = document.createElement('div');
    //             scheduleItem.classList.add('schedule-item');
    //             
    //             scheduleItem.innerHTML = `
    //                 <div class="schedule-time">
    //                     <div class="day">${classDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
    //                     <div class="date">${classDate.getDate()}</div>
    //                     <div class="time">${classItem.startTime} - ${classItem.endTime}</div>
    //                 </div>
    //                 <div class="schedule-details">
    //                     <h4>${classItem.name}</h4>
    //                     <p><i class="fas fa-user"></i> ${classItem.instructor}</p>
    //                     <p><i class="fas fa-users"></i> ${classItem.capacity} spots available</p>
    //                 </div>
    //                 <div class="schedule-actions">
    //                     <button class="btn sm-btn primary-btn book-class" data-id="${doc.id}">Book Now</button>
    //                 </div>
    //             `;
    //             
    //             scheduleGrid.appendChild(scheduleItem);
    //         });
    //         
    //         schedulesSection.appendChild(scheduleGrid);
    //         
    //         // Add event listeners for booking buttons
    //         document.querySelectorAll('.book-class').forEach(button => {
    //             button.addEventListener('click', function() {
    //                 // Check if user is a member
    //                 const user = JSON.parse(sessionStorage.getItem('user'));
    //                 if (user.userType !== 'member') {
    //                     alert('You need to become a member to book classes.');
    //                     return;
    //                 }
    //                 
    //                 bookClass(this.dataset.id);
    //             });
    //         });
    //     });
}

// Setup membership plan selection
function setupPlanSelection() {
    // Add event listeners to "Choose Plan" buttons on the plans page
    document.querySelectorAll('.btn-block').forEach(button => {
        if (button.textContent.includes('Choose Plan')) {
            button.addEventListener('click', function() {
                // Get plan name from parent card
                const planName = this.closest('.plan-card').querySelector('h3').textContent;
                becomeMember(planName);
            });
        }
    });
}

// Become a member
function becomeMember(planName) {
    // Check if user is logged in
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    const user = JSON.parse(userString);
    
    // Check if already a member
    if (user.userType === 'member') {
        alert('You are already a member.');
        return;
    }
    
    // In a real application, this would open a payment page or modal
    // For demo purposes, we'll show an alert
    alert(`You have selected the ${planName} plan. In a real application, this would take you to a payment page.`);
    
    // Example of how you might update the user's membership status:
    // db.collection('users').doc(user.uid).update({
    //     userType: 'member',
    //     role: 'member',
    //     membershipPlan: planName,
    //     startDate: new Date().toISOString().split('T')[0],
    //     duration: 1, // 1 month by default
    //     endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    // })
    // .then(() => {
    //     // Update user in session storage
    //     user.userType = 'member';
    //     sessionStorage.setItem('user', JSON.stringify(user));
    //     
    //     // Redirect to member dashboard
    //     window.location.href = '../pages/member-dashboard.html';
    // })
    // .catch((error) => {
    //     console.error('Error updating user:', error);
    // });
}