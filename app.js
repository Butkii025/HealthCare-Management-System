
        // Database simulation using localStorage
        const Database = {
            users: JSON.parse(localStorage.getItem('health_users')) || [],
            doctors: JSON.parse(localStorage.getItem('health_doctors')) || [],
            currentUser: null,
            currentDoctor: null,
            
            init: function() {
                if (!localStorage.getItem('health_users')) {
                    // Updated demo user with requested details
                    this.users = [
                        {
                            id: 1,
                            phone: '9876543210',
                            password: 'ps-83',
                            name: 'P-Vijay',
                            bloodGroup: 'O+',
                            allergies: 'None',
                            conditions: 'None',
                            lastCheckup: '2025-09-07'
                        }
                    ];
                    this.saveUsers();
                }
                
                if (!localStorage.getItem('health_doctors')) {
                    // Add a demo doctor
                    this.doctors = [
                        {
                            id: 1,
                            phone: '9876543211',
                            doctorId: 'DOC123XYZ',
                            name: 'Dr. Anjali Menon',
                            hospital: 'General Hospital Trivandrum',
                            address: 'Medical College PO, Trivandrum, Kerala'
                        }
                    ];
                    this.saveDoctors();
                }
            },
            
            saveUsers: function() {
                localStorage.setItem('health_users', JSON.stringify(this.users));
            },
            
            saveDoctors: function() {
                localStorage.setItem('health_doctors', JSON.stringify(this.doctors));
            },
            
            findUser: function(phone) {
                return this.users.find(user => user.phone === phone);
            },
            
            findDoctor: function(phone, doctorId) {
                return this.doctors.find(doctor => doctor.phone === phone && doctor.doctorId === doctorId);
            },
            
            addUser: function(user) {
                user.id = this.users.length + 1;
                this.users.push(user);
                this.saveUsers();
                return user;
            },
            
            addDoctor: function(doctor) {
                doctor.id = this.doctors.length + 1;
                // Generate a unique doctor ID if not provided
                if (!doctor.doctorId) {
                    doctor.doctorId = 'DOC' + Math.floor(100 + Math.random() * 900) + 'XYZ';
                }
                this.doctors.push(doctor);
                this.saveDoctors();
                return doctor;
            },
            
            updateUser: function(updatedUser) {
                const index = this.users.findIndex(user => user.id === updatedUser.id);
                if (index !== -1) {
                    this.users[index] = {...this.users[index], ...updatedUser};
                    this.saveUsers();
                    return this.users[index];
                }
                return null;
            }
        };

        // Auth simulation
        const Auth = {
            loginUser: function(phone, password) {
                const user = Database.findUser(phone);
                if (user && user.password === password) {
                    Database.currentUser = user;
                    Database.currentDoctor = null;
                    localStorage.setItem('currentHealthUser', JSON.stringify(user));
                    return user;
                }
                return null;
            },
            
            loginDoctor: function(phone, doctorId) {
                const doctor = Database.findDoctor(phone, doctorId);
                if (doctor) {
                    Database.currentDoctor = doctor;
                    Database.currentUser = null;
                    localStorage.setItem('currentHealthDoctor', JSON.stringify(doctor));
                    return doctor;
                }
                return null;
            },
            
            registerUser: function(userData) {
                if (Database.findUser(userData.phone)) {
                    return {error: 'User already exists with this phone number'};
                }
                
                const user = Database.addUser(userData);
                Database.currentUser = user;
                localStorage.setItem('currentHealthUser', JSON.stringify(user));
                return user;
            },
            
            registerDoctor: function(doctorData) {
                if (Database.doctors.find(d => d.phone === doctorData.phone)) {
                    return {error: 'Doctor already exists with this phone number'};
                }
                
                const doctor = Database.addDoctor(doctorData);
                Database.currentDoctor = doctor;
                localStorage.setItem('currentHealthDoctor', JSON.stringify(doctor));
                return doctor;
            },
            
            logout: function() {
                Database.currentUser = null;
                Database.currentDoctor = null;
                localStorage.removeItem('currentHealthUser');
                localStorage.removeItem('currentHealthDoctor');
            },
            
            getCurrentUser: function() {
                if (!Database.currentUser) {
                    const stored = localStorage.getItem('currentHealthUser');
                    if (stored) {
                        Database.currentUser = JSON.parse(stored);
                    }
                }
                return Database.currentUser;
            },
            
            getCurrentDoctor: function() {
                if (!Database.currentDoctor) {
                    const stored = localStorage.getItem('currentHealthDoctor');
                    if (stored) {
                        Database.currentDoctor = JSON.parse(stored);
                    }
                }
                return Database.currentDoctor;
            }
        };

        // UI Controller
        const UI = {
            currentRole: 'user', // 'user' or 'doctor'
            
            init: function() {
                Database.init();
                
                // Check if user or doctor is logged in
                const user = Auth.getCurrentUser();
                const doctor = Auth.getCurrentDoctor();
                
                if (user) {
                    this.showDashboard();
                    this.loadUserData(user);
                } else if (doctor) {
                    this.showDoctorDashboard();
                    this.loadDoctorData(doctor);
                } else {
                    this.showLoginSelection();
                }
                
                this.bindEvents();
            },
            
            bindEvents: function() {
                // Login selection
                document.querySelectorAll('.login-option').forEach(option => {
                    option.addEventListener('click', () => {
                        document.querySelectorAll('.login-option').forEach(opt => {
                            opt.classList.remove('active');
                        });
                        option.classList.add('active');
                        this.currentRole = option.getAttribute('data-role');
                    });
                });
                
                document.getElementById('proceed-login-btn').addEventListener('click', () => {
                    if (this.currentRole === 'user') {
                        this.showUserLogin();
                    } else {
                        this.showDoctorLogin();
                    }
                });
                
                // Back buttons
                document.getElementById('back-to-selection').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLoginSelection();
                });
                
                document.getElementById('doctor-back-to-selection').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLoginSelection();
                });
                
                document.getElementById('user-back-to-login').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showUserLogin();
                });
                
                document.getElementById('doctor-back-to-login').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showDoctorLogin();
                });
                
                // Show registration forms
                document.getElementById('show-user-register').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showUserRegister();
                });
                
                document.getElementById('show-doctor-register').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showDoctorRegister();
                });
                
                // Login buttons
                document.getElementById('user-login-btn').addEventListener('click', () => this.handleUserLogin());
                document.getElementById('doctor-login-btn').addEventListener('click', () => this.handleDoctorLogin());
                
                // Registration buttons
                document.getElementById('register-btn').addEventListener('click', () => this.handleUserRegister());
                document.getElementById('doctor-register-btn').addEventListener('click', () => this.handleDoctorRegister());
                
                // Other buttons
                document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
                document.getElementById('save-profile-btn').addEventListener('click', () => this.saveProfile());
                document.getElementById('quick-qr-btn').addEventListener('click', () => this.showQRCode());
                document.getElementById('download-qr-btn').addEventListener('click', () => this.downloadQR());
                
                // Sidebar navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    if (item.id !== 'logout-btn') {
                        item.addEventListener('click', (e) => {
                            e.preventDefault();
                            const page = item.getAttribute('data-page');
                            this.showPage(page);
                            
                            // Update active state
                            document.querySelectorAll('.nav-item').forEach(nav => {
                                nav.classList.remove('active');
                            });
                            item.classList.add('active');
                        });
                    }
                });
            },

            
            
            showPage: function(pageId) {
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById(`${pageId}-page`).classList.add('active');
            },
            
            showLoginSelection: function() {
                this.showPage('login-selection');
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
            },
            
            showUserLogin: function() {
                this.showPage('user-login');
            },
            
            showDoctorLogin: function() {
                this.showPage('doctor-login');
            },
            
            showUserRegister: function() {
                this.showPage('user-register');
            },
            
            showDoctorRegister: function() {
                this.showPage('doctor-register');
            },
            
            showDashboard: function() {
                this.showPage('dashboard');
                const user = Auth.getCurrentUser();
                if (user) {
                    this.loadUserData(user);
                }
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                document.querySelector('[data-page="dashboard"]').classList.add('active');
            },
            
            showDoctorDashboard: function() {
                this.showPage('doctor-dashboard');
                const doctor = Auth.getCurrentDoctor();
                if (doctor) {
                    this.loadDoctorData(doctor);
                }
            },
            
            showQRCode: function() {
                this.showPage('qr');
                const user = Auth.getCurrentUser();
                if (user) {
                    document.getElementById('emergency-name').textContent = user.name || 'User Name';
                    document.getElementById('emergency-blood').textContent = user.bloodGroup || 'Not specified';
                    document.getElementById('emergency-contact').textContent = user.phone || 'Not specified';
                    document.getElementById('emergency-allergies').textContent = user.allergies || 'None';
                }
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                document.querySelector('[data-page="qr"]').classList.add('active');
            },
            
            handleUserLogin: function() {
                const phone = document.getElementById('phone').value;
                const password = document.getElementById('password').value;
                
                if (!phone || !password) {
                    alert('Please enter both mobile number and password');
                    return;
                }
                
                const user = Auth.loginUser(phone, password);
                if (user) {
                    this.showDashboard();
                    this.loadUserData(user);
                } else {
                    alert('Invalid credentials. Please try again.');
                }
            },
            
            handleDoctorLogin: function() {
                const phone = document.getElementById('doctor-phone').value;
                const doctorId = document.getElementById('doctor-id').value;
                
                if (!phone || !doctorId) {
                    alert('Please enter both mobile number and Doctor ID');
                    return;
                }
                
                const doctor = Auth.loginDoctor(phone, doctorId);
                if (doctor) {
                    this.showDoctorDashboard();
                    this.loadDoctorData(doctor);
                } else {
                    alert('Invalid credentials. Please try again.');
                }
            },
            
            handleUserRegister: function() {
                const name = document.getElementById('reg-name').value;
                const phone = document.getElementById('reg-phone').value;
                const password = document.getElementById('reg-password').value;
                const confirmPassword = document.getElementById('reg-confirm-password').value;
                
                if (!name || !phone || !password) {
                    alert('Please fill all fields');
                    return;
                }
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                const result = Auth.registerUser({
                    name,
                    phone,
                    password,
                    bloodGroup: '',
                    allergies: '',
                    conditions: '',
                    lastCheckup: new Date().toISOString().split('T')[0]
                });
                
                if (result.error) {
                    alert(result.error);
                } else {
                    this.showDashboard();
                    this.loadUserData(result);
                }
            },
            
            handleDoctorRegister: function() {
                const name = document.getElementById('doctor-name').value;
                const phone = document.getElementById('doctor-reg-phone').value;
                const doctorId = document.getElementById('doctor-reg-id').value;
                const hospital = document.getElementById('hospital-name').value;
                const address = document.getElementById('hospital-address').value;
                
                if (!name || !phone || !hospital || !address) {
                    alert('Please fill all required fields');
                    return;
                }
                
                const result = Auth.registerDoctor({
                    name,
                    phone,
                    doctorId,
                    hospital,
                    address
                });
                
                if (result.error) {
                    alert(result.error);
                } else {
                    // Show the generated doctor ID
                    document.getElementById('doctor-id-value').textContent = result.doctorId;
                    document.getElementById('generated-doctor-id').style.display = 'block';
                    alert('Registration successful! Your Doctor ID is: ' + result.doctorId);
                    
                    // Auto-fill login form
                    document.getElementById('doctor-phone').value = phone;
                    document.getElementById('doctor-id').value = result.doctorId;
                    
                    this.showDoctorLogin();
                }
            },
            
            handleLogout: function() {
                Auth.logout();
                this.showLoginSelection();
            },
            
            loadUserData: function(user) {
                // Update dashboard
                document.getElementById('user-name').textContent = user.name;
                document.getElementById('info-blood').textContent = user.bloodGroup || 'Not specified';
                document.getElementById('info-checkup').textContent = user.lastCheckup ? new Date(user.lastCheckup).toLocaleDateString() : 'Not specified';
                document.getElementById('info-allergies').textContent = user.allergies || 'None';
                document.getElementById('info-conditions').textContent = user.conditions || 'None';
                
                // Update profile form
                document.getElementById('profile-name').value = user.name || '';
                document.getElementById('profile-phone').value = user.phone || '';
                document.getElementById('profile-dob').value = user.dob || '';
                document.getElementById('profile-blood').value = user.bloodGroup || '';
                document.getElementById('profile-allergies').value = user.allergies || '';
                document.getElementById('profile-conditions').value = user.conditions || '';
            },
            
            loadDoctorData: function(doctor) {
                document.getElementById('doctor-display-name').textContent = doctor.name;
                document.getElementById('doctor-info-id').textContent = doctor.doctorId;
                document.getElementById('doctor-info-hospital').textContent = doctor.hospital;
                document.getElementById('doctor-info-phone').textContent = doctor.phone;
            },
            
            saveProfile: function() {
                const user = Auth.getCurrentUser();
                if (!user) return;
                
                const updatedUser = {
                    ...user,
                    name: document.getElementById('profile-name').value,
                    dob: document.getElementById('profile-dob').value,
                    bloodGroup: document.getElementById('profile-blood').value,
                    allergies: document.getElementById('profile-allergies').value,
                    conditions: document.getElementById('profile-conditions').value
                };
                
                Database.updateUser(updatedUser);
                Auth.getCurrentUser(); // Refresh current user
                
                alert('Profile updated successfully!');
                this.showDashboard();
            },
            
            downloadQR: function() {
                alert('In a real application, this would download your QR code. This is a simulation.');
            }
        };

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            UI.init();
        });
    



        