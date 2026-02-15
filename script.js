// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDvtZJhIN850tU7cETuiqRyCyjCBdlFt-Y",
    authDomain: "fynora-81313.firebaseapp.com",
    projectId: "fynora-81313",
    appId: "1:593306264446:web:da476d4c77ae4ede6b492f"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const tg = window.Telegram.WebApp;

let currentUserData = null;

// Initialize App
window.onload = () => {
    checkAuthStatus();
    renderContactForm();
};

function checkAuthStatus() {
    // Check if user manually logged out from TG
    const isLoggedOut = localStorage.getItem('loggedOut');

    if (tg.initDataUnsafe && tg.initDataUnsafe.user && isLoggedOut !== 'true') {
        loginAsTelegram(tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUserData = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL || "https://ui-avatars.com/api/?name=" + user.email,
                    type: 'firebase'
                };
                updateUI(currentUserData);
            } else {
                renderLoggedOutUI();
            }
        });
    }
}

function loginAsTelegram(user) {
    currentUserData = {
        name: user.first_name + (user.last_name ? " " + user.last_name : ""),
        username: user.username || "N/A",
        id: user.id,
        photo: "https://t.me/i/userpic/320/" + (user.username || user.id) + ".jpg",
        type: 'telegram'
    };
    localStorage.setItem('loggedOut', 'false');
    updateUI(currentUserData);
}

function updateUI(user) {
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('user-avatar').src = user.photo;
    document.getElementById('auth-status').innerHTML = `<button onclick="logout()" class="logout-btn">Logout</button>`;
    renderContactForm();
}

function renderLoggedOutUI() {
    document.getElementById('auth-status').innerHTML = `<button onclick="showLoginModal()" class="login-trigger">Login / Register</button>`;
    renderContactForm();
}

// Auth Actions
function showLoginModal() { document.getElementById('login-modal').style.display = 'flex'; }
function hideLoginModal() { document.getElementById('login-modal').style.display = 'none'; }

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => hideLoginModal());
}

function loginWithTelegram() {
    localStorage.setItem('loggedOut', 'false');
    location.reload(); // Re-trigger auto login
}

function logout() {
    auth.signOut();
    localStorage.setItem('loggedOut', 'true');
    currentUserData = null;
    location.reload();
}

// Contact Form Logic
function renderContactForm() {
    const container = document.getElementById('contact-form-container');
    if (!currentUserData) {
        container.innerHTML = `
            <input type="text" id="c-name" placeholder="Full Name">
            <input type="email" id="c-email" placeholder="Email Address">
            <textarea id="c-msg" placeholder="Your Message"></textarea>
            <button onclick="sendMessage()" class="primary-btn">Send Message</button>
        `;
    } else if (currentUserData.type === 'telegram') {
        container.innerHTML = `
            <p>Logged in as <b>${currentUserData.name}</b></p>
            <textarea id="c-msg" placeholder="Write your message..."></textarea>
            <button onclick="sendMessage()" class="primary-btn">Send to RKX</button>
        `;
    } else {
        container.innerHTML = `
            <input type="text" value="${currentUserData.name}" disabled>
            <input type="email" value="${currentUserData.email}" disabled>
            <textarea id="c-msg" placeholder="Your Message"></textarea>
            <button onclick="sendMessage()" class="primary-btn">Send Message</button>
        `;
    }
}

async function sendMessage() {
    const msg = document.getElementById('c-msg').value;
    if(!msg) return alert("Please type a message");

    let payload = { message: msg };

    if (currentUserData && currentUserData.type === 'telegram') {
        payload.tg_name = currentUserData.name;
        payload.tg_id = currentUserData.id;
        payload.tg_username = currentUserData.username;
        payload.photo = currentUserData.photo;
    } else {
        payload.name = currentUserData ? currentUserData.name : document.getElementById('c-name').value;
        payload.email = currentUserData ? currentUserData.email : document.getElementById('c-email').value;
    }

    // Replace with your actual Bot API URL
    console.log("Sending to Bot:", payload);
    alert("Message Sent to RKX Rakib!");
}

// Image Zoom Animation
function zoomImage(el) {
    const imgSrc = el.querySelector('img').src;
    document.getElementById('zoomed-img').src = imgSrc;
    document.getElementById('zoom-overlay').classList.add('show-zoom');
}

function closeZoom() {
    document.getElementById('zoom-overlay').classList.remove('show-zoom');
}
