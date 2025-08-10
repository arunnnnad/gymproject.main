document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is a member
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    const user = JSON.parse(userString);
    if (user.userType !== 'member') {
        window.location.href = '../index.html';
        return;
    }
    
    // Set member info
    const nameElements = document.querySelectorAll('#member-name, #dropdown-member-name, #welcome-name');
    nameElements.forEach(el => {
        if (el) el.textContent = user.displayName;
    });
    
    if (document.getElementById('dropdown-member-email')) {
        document.getElementById('dropdown-member-email').textContent = user.email;
    }
    
    // Set member avatar
    const avatarElements = document.querySelectorAll('#user-avatar, #header-avatar');
    avatarElements.forEach(avatar => {
        avatar.src = user.photoURL;
    });
    
    // Load member data
    loadMemberData(user.uid);
    
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
});

// Load member data from Firestore
function loadMemberData(memberId) {
    db.collection('users').doc(memberId).get()
        .then((doc) => {
            if (doc.exists) {
                const memberData = doc.data();
                
                // Set membership plan
                const memberPlan = document.getElementById('member-plan');
                if (memberPlan) {
                    memberPlan.textContent = `${memberData.membershipPlan || 'Basic'} Member`;
                }
                
                // Set membership expiry
                const validUntil = document.getElementById('valid-until');
                if (validUntil && memberData.endDate) {
                    const endDate = new Date(memberData.endDate);
                    validUntil.textContent = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                }
                
                // Load check-ins, workout time, classes attended if available
                loadMembershipStats(memberId);
                
                // Load payment history
                loadPaymentHistory(memberId);
                
                // Load scheduled classes
                loadScheduledClasses(memberId);
            } else {
                console.log("No member data found");
            }
        })
        .catch((error) => {
            console.error("Error getting member data:", error);
        });
}

// Load membership statistics
function loadMembershipStats(memberId) {
    // In a real application, these would be fetched from Firestore
    // For demo purposes, we'll use placeholder data
    
    // Example: Get check-ins from a collection
    // db.collection('check-ins').where('memberId', '==', memberId).get()
    //     .then((snapshot) => {
    //         const checkInsThisMonth = snapshot.docs.filter(doc => {
    //             const checkInDate = doc.data().date.toDate();
    //             const now = new Date();
    //             return checkInDate.getMonth() === now.getMonth() && 
    //                    checkInDate.getFullYear() === now.getFullYear();
    //         }).length;
    //         
    //         document.querySelector('.stat-value').textContent = checkInsThisMonth;
    //     });
    
    // Load fitness progress chart
    loadFitnessChart();
}

// Load payment history
function loadPaymentHistory(memberId) {
    // In a real application, you would fetch the member's payment history from Firestore
    // For demo purposes, we'll use the placeholder data already in the HTML
    
    // Example of how you might fetch payment history:
    // db.collection('payments')
    //     .where('memberId', '==', memberId)
    //     .orderBy('date', 'desc')
    //     .limit(3)
    //     .get()
    //     .then((snapshot) => {
    //         const tableBody = document.querySelector('#payments-table tbody');
    //         tableBody.innerHTML = '';
    //         
    //         snapshot.forEach((doc) => {
    //             const payment = doc.data();
    //             const row = document.createElement('tr');
    //             row.innerHTML = `
    //                 <td>${payment.date.toDate().toLocaleDateString()}</td>
    //                 <td>${payment.description}</td>
    //                 <td>$${payment.amount.toFixed(2)}</td>
    //                 <td><span class="status completed">Paid</span></td>
    //             `;
    //             tableBody.appendChild(row);
    //         });
    //     });
}

// Load scheduled classes
function loadScheduledClasses(memberId) {
    // In a real application, you would fetch the member's scheduled classes from Firestore
    // For demo purposes, we'll use the placeholder data already in the HTML
    
    // Example of how you might fetch scheduled classes:
    // db.collection('class-bookings')
    //     .where('memberId', '==', memberId)
    //     .where('date', '>=', new Date())
    //     .orderBy('date')
    //     .limit(3)
    //     .get()
    //     .then((snapshot) => {
    //         const classesContainer = document.querySelector('.classes-list');
    //         classesContainer.innerHTML = '';
    //         
    //         snapshot.forEach((doc) => {
    //             const booking = doc.data();
    //             const classDate = booking.date.toDate();
    //             
    //             const classCard = document.createElement('div');
    //             classCard.classList.add('class-card');
    //             classCard.innerHTML = `
    //                 <div class="class-time">
    //                     <div class="day">${classDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
    //                     <div class="date">${classDate.getDate()}</div>
    //                     <div class="time">${booking.startTime}</div>
    //                 </div>
    //                 <div class="class-details">
    //                     <h4>${booking.className}</h4>
    //                     <p>Instructor: ${booking.instructorName}</p>
    //                     <p>Duration: ${booking.duration} min</p>
    //                 </div>
    //                 <div class="class-actions">
    //                     <button class="btn sm-btn primary-btn cancel-booking" data-id="${doc.id}">Cancel</button>
    //                 </div>
    //             `;
    //             classesContainer.appendChild(classCard);
    //         });
    //         
    //         // Add event listeners for cancel buttons
    //         document.querySelectorAll('.cancel-booking').forEach(button => {
    //             button.addEventListener('click', function() {
    //                 cancelBooking(this.dataset.id);
    //             });
    //         });
    //     });
}

// Load fitness chart
function loadFitnessChart() {
    // In a real application, you would use a chart library like Chart.js to create charts
    // For demo purposes, we're using a placeholder image
    
    // Example of how you might create a chart with Chart.js:
    // const ctx = document.getElementById('fitness-chart').getContext('2d');
    // const fitnessChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //         datasets: [{
    //             label: 'Fitness Score',
    //             data: [65, 68, 70, 72, 75, 78],
    //             backgroundColor: 'rgba(255, 87, 34, 0.2)',
    //             borderColor: '#ff5722',
    //             borderWidth: 2,
    //             tension: 0.3
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: false,
    //                 min: 60,
    //                 max: 100
    //             }
    //         }
    //     }
    // });
}

// Cancel class booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this class?')) {
        // In a real application, you would delete the booking document from Firestore
        // db.collection('class-bookings').doc(bookingId).delete()
        //     .then(() => {
        //         console.log('Booking cancelled successfully');
        //         // Reload scheduled classes
        //         loadScheduledClasses(currentUserId);
        //     })
        //     .catch((error) => {
        //         console.error('Error cancelling booking:', error);
        //     });
    }
}

// Book a class
function bookClass(classId) {
    // In a real application, you would create a booking document in Firestore
    // db.collection('class-bookings').add({
    //     classId: classId,
    //     memberId: currentUserId,
    //     date: selectedClassDate,
    //     booked: firebase.firestore.FieldValue.serverTimestamp()
    // })
    // .then(() => {
    //     console.log('Class booked successfully');
    //     // Reload scheduled classes
    //     loadScheduledClasses(currentUserId);
    // })
    // .catch((error) => {
    //     console.error('Error booking class:', error);
    // });
}