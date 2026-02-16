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

let currentUser = null;

window.onload = () => {
    tg.expand();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    initApp();
};

function initApp() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) processLogin('firebase', user);
            else renderContact(); 
        });
    }
}

// --- Login Functions ---

async function loginWithEmail() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    if(!email || !pass) return alert("Fill all fields");
    try {
        await auth.signInWithEmailAndPassword(email, pass);
        hideLoginOptions();
    } catch (e) { alert(e.message); }
}

async function forgotPassword() {
    const email = document.getElementById('auth-email').value;
    if(!email) return alert("Enter email first");
    try {
        await auth.sendPasswordResetEmail(email);
        alert("Reset link sent to email!");
    } catch (e) { alert(e.message); }
}

async function loginWithPhone() {
    const phone = document.getElementById('auth-phone').value;
    if(!phone.startsWith('+')) return alert("Enter with country code (ex: +880)");
    try {
        const confirmation = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
        const code = prompt("Enter OTP:");
        if(code) {
            await confirmation.confirm(code);
            hideLoginOptions();
        }
    } catch (e) { alert(e.message); }
}

function processLogin(type, user) {
    if (type === 'telegram') {
        currentUser = {
            name: user.first_name + " " + (user.last_name || ""),
            id: user.id,
            photo: user.photo_url || "https://t.me/i/userpic/320/rkxrakib_69.svg",
            type: 'telegram'
        };
    } else {
        currentUser = {
            name: user.displayName || user.email || user.phoneNumber,
            email: user.email || user.phoneNumber,
            photo: user.photoURL || "https://t.me/i/userpic/320/rkxrakib_69.svg",
            type: 'firebase'
        };
    }
    updateAuthUI();
}

function updateAuthUI() {
    const authBox = document.getElementById('auth-actions');
    authBox.innerHTML = `<button onclick="handleLogout()" class="guest-btn" style="background:#ff4d4d">Logout</button>`;
    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.photo;
    renderContact();
}

function renderContact() {
    const box = document.getElementById('contact-form');
    if (!currentUser) {
        box.innerHTML = `
            <input type="text" id="g-name" placeholder="Full Name">
            <input type="email" id="g-email" placeholder="Email Address">
            <textarea id="msg" placeholder="Write your message..."></textarea>
            <button onclick="send()" class="btn-send">Send Message</button>
        `;
    } else {
        box.innerHTML = `
            <p style="font-size:12px; color:#888;">Logged in as: <b>${currentUser.name}</b></p>
            <textarea id="msg" placeholder="Write your message..."></textarea>
            <button onclick="send()" class="btn-send">Send Message</button>
        `;
    }
}

// --- SEND MESSAGE USING YOUR API ---
async function send() {
    const msgText = document.getElementById('msg').value;
    if (!msgText) return alert("Please type a message!");

    let name, email;
    if (!currentUser) {
        name = document.getElementById('g-name').value || "Guest";
        email = document.getElementById('g-email').value || "No Email";
    } else {
        name = currentUser.name;
        email = currentUser.email || "User Logged In";
    }

    try {
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message: msgText })
        });

        if (response.ok) {
            alert("Message sent successfully!");
            document.getElementById('msg').value = "";
        } else {
            alert("Error sending message.");
        }
    } catch (e) { alert("Server error!"); }
}

function showLoginOptions() { document.getElementById('login-overlay').classList.remove('hidden'); }
function hideLoginOptions() { document.getElementById('login-overlay').classList.add('hidden'); }
function loginWithGoogle() { auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => hideLoginOptions()); }
function reEnableTGLogin() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
        hideLoginOptions();
    } else {
        alert("Use Phone Login for browser or open in Telegram.");
    }
}
function handleLogout() { auth.signOut(); location.reload(); }
function zoomToggle(card) { card.classList.toggle('zoomed'); }
