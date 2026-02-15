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

const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI";
const CHAT_ID = "7475964655";

let currentUser = null;

// Auth State Check
window.onload = () => {
    tg.expand();
    const manualLogout = localStorage.getItem('manualLogout');

    if (tg.initDataUnsafe && tg.initDataUnsafe.user && manualLogout !== 'true') {
        loginAsTG(tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) loginAsFirebase(user);
            else showLogin();
        });
    }
};

// Google Login Function
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => localStorage.setItem('manualLogout', 'false'))
        .catch(err => alert(err.message));
}

function loginAsFirebase(user) {
    currentUser = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        type: 'firebase'
    };
    showPortfolio();
}

function loginAsTG(user) {
    currentUser = {
        name: user.first_name + " " + (user.last_name || ""),
        id: user.id,
        username: user.username || "n/a",
        photo: "https://t.me/i/userpic/320/rkxrakib_69.svg",
        type: 'telegram'
    };
    showPortfolio();
}

function showPortfolio() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('portfolio-screen').classList.remove('hidden');
    document.getElementById('user-name').innerText = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.photo;
    renderContact();
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('portfolio-screen').classList.add('hidden');
}

function handleLogout() {
    auth.signOut();
    localStorage.setItem('manualLogout', 'true');
    location.reload();
}

// Smart Zoom Logic
function toggleZoom(card) {
    const isZoomed = card.classList.contains('zoomed');
    // Remove zoom from all other cards
    document.querySelectorAll('.project-card').forEach(c => c.classList.remove('zoomed'));
    
    // Toggle zoom for current card
    if (!isZoomed) card.classList.add('zoomed');
}

// Close zoom on scroll or clicking outside
window.addEventListener('scroll', () => {
    document.querySelectorAll('.project-card').forEach(c => c.classList.remove('zoomed'));
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card')) {
        document.querySelectorAll('.project-card').forEach(c => c.classList.remove('zoomed'));
    }
});

// Contact System
function renderContact() {
    const box = document.getElementById('contact-ui');
    if (currentUser.type === 'telegram') {
        box.innerHTML = `<textarea id="msg" placeholder="Message to RKX..."></textarea>
                         <button onclick="send()" class="btn-main">Send Telegram Message</button>`;
    } else {
        box.innerHTML = `<input type="text" value="${currentUser.name}" disabled>
                         <textarea id="msg" placeholder="Write your message..."></textarea>
                         <button onclick="send()" class="btn-main">Send Message</button>`;
    }
}

async function send() {
    const m = document.getElementById('msg').value;
    if(!m) return alert("Write something!");
    
    let text = `🚀 *New Message*\nName: ${currentUser.name}\n`;
    if(currentUser.type === 'telegram') text += `ID: ${currentUser.id}\nUser: @${currentUser.username}\n`;
    else text += `Email: ${currentUser.email}\n`;
    text += `\n💬 Msg: ${m}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' })
    });
    alert("Sent!");
}
