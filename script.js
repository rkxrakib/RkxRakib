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

// BOT INFO
const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI";
const CHAT_ID = "7475964655";

let currentUser = null;

window.onload = () => {
    tg.expand();
    initApp();
};

function initApp() {
    const manualExit = localStorage.getItem('manualExit');

    if (tg.initDataUnsafe && tg.initDataUnsafe.user && manualExit !== 'true') {
        processLogin('telegram', tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) processLogin('firebase', user);
            else showScreen('login');
        });
    }
}

function processLogin(type, user) {
    if (type === 'telegram') {
        currentUser = {
            name: user.first_name + " " + (user.last_name || ""),
            id: user.id,
            username: user.username || "none",
            photo: "https://t.me/i/userpic/320/rkxrakib_69.svg",
            type: 'telegram'
        };
    } else {
        currentUser = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL || "https://t.me/i/userpic/320/rkxrakib_69.svg",
            type: 'firebase'
        };
    }
    showScreen('portfolio');
    updateProfileUI();
}

function showScreen(screenId) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('portfolio-screen').classList.add('hidden');
    document.getElementById(screenId + '-screen').classList.remove('hidden');
}

function updateProfileUI() {
    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.photo;
    renderContact();
}

// Telegram Re-login Fix
function reEnableTGLogin() {
    localStorage.setItem('manualExit', 'false');
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
    } else {
        alert("Telegram Web App detected no user. Open inside Telegram.");
    }
}

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => localStorage.setItem('manualExit', 'false'));
}

function handleLogout() {
    auth.signOut();
    localStorage.setItem('manualExit', 'true');
    location.reload();
}

// Zoom Logic
function zoomToggle(card) {
    const isZoomed = card.classList.contains('zoomed');
    document.querySelectorAll('.p-card').forEach(c => c.classList.remove('zoomed'));
    if (!isZoomed) card.classList.add('zoomed');
}

window.onscroll = () => document.querySelectorAll('.p-card').forEach(c => c.classList.remove('zoomed'));

// Bot Message System
function renderContact() {
    const box = document.getElementById('contact-form');
    if (currentUser.type === 'telegram') {
        box.innerHTML = `<textarea id="msg" placeholder="Message to RKX..."></textarea>
                         <button onclick="send()" class="btn-primary">Send via Telegram</button>`;
    } else {
        box.innerHTML = `<input type="text" value="${currentUser.name}" disabled>
                         <textarea id="msg" placeholder="Your Message..."></textarea>
                         <button onclick="send()" class="btn-primary">Send Message</button>`;
    }
}

async function send() {
    const text = document.getElementById('msg').value;
    if (!text) return alert("Write something first!");

    let report = `📢 *NEW PORTFOLIO MESSAGE*\n\n`;
    report += `👤 Name: ${currentUser.name}\n`;
    if (currentUser.type === 'telegram') {
        report += `🆔 ID: ${currentUser.id}\n🔗 User: @${currentUser.username}\n`;
    } else {
        report += `📧 Email: ${currentUser.email}\n`;
    }
    report += `\n💬 Message: ${text}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: report, parse_mode: 'Markdown' })
    });
    alert("Message sent successfully!");
}
