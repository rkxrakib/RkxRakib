// --- CONFIGURATION ---
const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI"; // আপনার টেলিগ্রাম বট টোকেন দিন
const CHAT_ID = "7475964655";     // আপনার চ্যাট আইডি দিন

const firebaseConfig = {
    apiKey: "AIzaSyDvtZJhIN850tU7cETuiqRyCyjCBdlFt-Y",
    authDomain: "fynora-81313.firebaseapp.com",
    projectId: "fynora-81313",
    appId: "1:593306264446:web:da476d4c77ae4ede6b492f"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const tg = window.Telegram.WebApp;

let userData = null;

// UI Elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('main-container');

signUpButton.addEventListener('click', () => container.classList.add("right-panel-active"));
signInButton.addEventListener('click', () => container.classList.remove("right-panel-active"));

// On Load Logic
window.onload = () => {
    const isLoggedOut = localStorage.getItem('manuallyLoggedOut');

    if (tg.initDataUnsafe && tg.initDataUnsafe.user && isLoggedOut !== 'true') {
        loginAsTG(tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) {
                userData = { name: user.displayName, email: user.email, photo: user.photoURL, type: 'google' };
                showPortfolio();
            }
        });
    }
};

function loginAsTG(user) {
    userData = {
        name: user.first_name + " " + (user.last_name || ""),
        username: user.username || "no_username",
        id: user.id,
        photo: user.photo_url || "https://t.me/i/userpic/320/rkxrakib_69.svg",
        type: 'telegram'
    };
    localStorage.setItem('manuallyLoggedOut', 'false');
    showPortfolio();
}

function showPortfolio() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('portfolio-screen').classList.remove('hidden');
    document.getElementById('user-name').innerText = userData.name;
    document.getElementById('user-avatar').src = userData.photo;
    renderForm();
}

function renderForm() {
    const box = document.getElementById('contact-container');
    if (userData.type === 'telegram') {
        box.innerHTML = `<textarea id="msg" placeholder="Write message to Rakib..."></textarea>
                         <button onclick="sendBotMessage()">Send to Telegram</button>`;
    } else {
        box.innerHTML = `<input type="text" value="${userData.name}" disabled>
                         <input type="email" value="${userData.email}" disabled>
                         <textarea id="msg" placeholder="Your Message"></textarea>
                         <button onclick="sendBotMessage()">Send Message</button>`;
    }
}

async function sendBotMessage() {
    const text = document.getElementById('msg').value;
    if (!text) return alert("Write something!");

    let fullMessage = `📩 *New Message From Portfolio*\n\n`;
    if (userData.type === 'telegram') {
        fullMessage += `👤 Name: ${userData.name}\n🆔 ID: ${userData.id}\n🔗 User: @${userData.username}\n🖼 Photo: ${userData.photo}\n\n`;
    } else {
        fullMessage += `👤 Name: ${userData.name}\n📧 Email: ${userData.email}\n\n`;
    }
    fullMessage += `💬 Message: ${text}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: fullMessage, parse_mode: 'Markdown' })
    });

    if (res.ok) alert("Message sent to Rakib's Bot!");
}

function logout() {
    auth.signOut();
    localStorage.setItem('manuallyLoggedOut', 'true');
    location.reload();
}

// Google Login
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
}

function loginWithTelegram() {
    localStorage.setItem('manuallyLoggedOut', 'false');
    location.reload();
}

// Zoom Image
function zoomImage(el) {
    document.getElementById('zoomed-img').src = el.querySelector('img').src;
    document.getElementById('zoom-overlay').style.display = 'flex';
}
function closeZoom() { document.getElementById('zoom-overlay').style.display = 'none'; }
