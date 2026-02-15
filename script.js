// --- CONFIGURATION ---
const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI";
const CHAT_ID = "7475964655";

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
let isSignUpMode = false;

window.onload = () => {
    tg.expand();
    checkAuthLogic();
};

// --- AUTH LOGIC ---
function checkAuthLogic() {
    const manualLogout = localStorage.getItem('manualLogout');

    // টেলিগ্রাম মিনি অ্যাপ অটো লগইন চেক
    if (tg.initDataUnsafe && tg.initDataUnsafe.user && manualLogout !== 'true') {
        loginAsTelegram(tg.initDataUnsafe.user);
    } else {
        // ফায়ারবেস লগইন চেক
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`,
                    type: 'firebase'
                };
                showPortfolio();
            } else {
                showLogin();
            }
        });
    }
}

function loginAsTelegram(user) {
    currentUser = {
        name: user.first_name + (user.last_name ? " " + user.last_name : ""),
        username: user.username || "n/a",
        id: user.id,
        photo: user.photo_url || "https://t.me/i/userpic/320/rkxrakib_69.svg",
        type: 'telegram'
    };
    localStorage.setItem('manualLogout', 'false');
    showPortfolio();
}

function enableTelegramAutoLogin() {
    localStorage.setItem('manualLogout', 'false');
    location.reload(); // রিলোড দিলে আবার অটো লগইন লজিক কাজ করবে
}

function handleLogout() {
    auth.signOut();
    localStorage.setItem('manualLogout', 'true');
    location.reload();
}

// --- UI UPDATES ---
function showPortfolio() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('portfolio-screen').classList.remove('hidden');
    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.photo;
    renderContactForm();
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('portfolio-screen').classList.add('hidden');
}

function renderContactForm() {
    const container = document.getElementById('dynamic-contact-ui');
    if (currentUser.type === 'telegram') {
        container.innerHTML = `
            <p style="font-size:12px; color:#aaa">Logged in via Telegram as @${currentUser.username}</p>
            <textarea id="msg-input" placeholder="Type your message to Rakib..."></textarea>
            <button onclick="sendToBot()" class="btn-main">Send To RKX</button>
        `;
    } else {
        container.innerHTML = `
            <input type="text" value="${currentUser.name}" disabled>
            <input type="email" value="${currentUser.email}" disabled>
            <textarea id="msg-input" placeholder="Your Message..."></textarea>
            <button onclick="sendToBot()" class="btn-main">Send Message</button>
        `;
    }
}

// --- TELEGRAM BOT SENDER ---
async function sendToBot() {
    const msg = document.getElementById('msg-input').value;
    if (!msg) return alert("Please write a message!");

    let text = `🚀 *New Portfolio Message*\n\n`;
    if (currentUser.type === 'telegram') {
        text += `👤 *Name:* ${currentUser.name}\n🆔 *ID:* ${currentUser.id}\n🔗 *Username:* @${currentUser.username}\n🖼 *Photo:* [Click to view](${currentUser.photo})\n\n`;
    } else {
        text += `👤 *Name:* ${currentUser.name}\n📧 *Email:* ${currentUser.email}\n\n`;
    }
    text += `💬 *Message:* ${msg}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });
        if (response.ok) alert("Message sent successfully!");
    } catch (e) {
        alert("Error sending message!");
    }
}

// --- UTILS ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').innerText = isSignUpMode ? "Create Account" : "Welcome Back";
    document.getElementById('toggle-auth').innerHTML = isSignUpMode ? "Already have an account? <span onclick='toggleAuthMode()'>Sign In</span>" : "Don't have an account? <span onclick='toggleAuthMode()'>Sign Up</span>";
}

function openZoom(el) {
    document.getElementById('zoomed-img').src = el.querySelector('img').src;
    document.getElementById('zoom-overlay').style.display = 'flex';
}
function closeZoom() {
    document.getElementById('zoom-overlay').style.display = 'none';
}
