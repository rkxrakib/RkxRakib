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

const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI"; // আপনার টোকেন দিন
const CHAT_ID = "7475964655";     // আপনার আইডি দিন

let currentUser = null;

window.onload = () => {
    tg.expand();
    initApp();
};

function initApp() {
    // টেলিগ্রাম অটো লগইন চেক (অপশনাল)
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) processLogin('firebase', user);
            else renderContact(); // গেস্ট হিসেবে মেসেজ বক্স রেন্ডার হবে
        });
    }
}

function processLogin(type, user) {
    if (type === 'telegram') {
        currentUser = {
            name: user.first_name + " " + (user.last_name || ""),
            id: user.id,
            username: user.username || "none",
            photo: user.photo_url || "https://t.me/i/userpic/320/rkxrakib_69.svg",
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
    updateAuthUI();
}

function updateAuthUI() {
    const authBox = document.getElementById('auth-actions');
    authBox.innerHTML = `<button onclick="handleLogout()" class="guest-btn" style="background:#ff4d4d">Logout</button>`;
    if(currentUser) {
        document.getElementById('user-display-name').innerText = currentUser.name;
        document.getElementById('user-avatar').src = currentUser.photo;
    }
    renderContact();
}

function renderContact() {
    const box = document.getElementById('contact-form');
    if (!currentUser) {
        box.innerHTML = `
            <input type="text" id="guest-name" placeholder="Your Name">
            <textarea id="msg" placeholder="Write your message to RKX..."></textarea>
            <button onclick="send()" class="btn-send">Send Message</button>
        `;
    } else {
        box.innerHTML = `
            <p style="font-size:12px; color:gray">Logged in as ${currentUser.name}</p>
            <textarea id="msg" placeholder="Write your message..."></textarea>
            <button onclick="send()" class="btn-send">Send Message</button>
        `;
    }
}

async function send() {
    const msgText = document.getElementById('msg').value;
    if (!msgText) return alert("Write something!");

    let name = currentUser ? currentUser.name : document.getElementById('guest-name').value || "Guest";
    let info = currentUser ? (currentUser.type === 'telegram' ? `@${currentUser.username} (ID: ${currentUser.id})` : currentUser.email) : "Not Logged In";

    let report = `📢 *NEW PORTFOLIO MESSAGE*\n\n`;
    report += `👤 Name: ${name}\n`;
    report += `ℹ️ Auth: ${info}\n`;
    report += `\n💬 Message: ${msgText}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: report, parse_mode: 'Markdown' })
    });
    alert("Message sent!");
}

// UI Helpers
function showLoginOptions() { document.getElementById('login-overlay').classList.remove('hidden'); }
function hideLoginOptions() { document.getElementById('login-overlay').classList.add('hidden'); }

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => hideLoginOptions());
}

function reEnableTGLogin() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
        hideLoginOptions();
    } else {
        alert("Please open this in Telegram for TG Login.");
    }
}

function handleLogout() {
    auth.signOut();
    location.reload();
}

function zoomToggle(card) {
    const isZoomed = card.classList.contains('zoomed');
    document.querySelectorAll('.p-card').forEach(c => c.classList.remove('zoomed'));
    if (!isZoomed) card.classList.add('zoomed');
}
window.onscroll = () => document.querySelectorAll('.p-card').forEach(c => c.classList.remove('zoomed'));
