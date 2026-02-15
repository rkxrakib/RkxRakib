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

// --- আপনার ডিটেইলস এখানে দিন ---
const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI"; 
const CHAT_ID = "7475964655";     

let currentUser = null;

window.onload = () => {
    tg.expand();
    initApp();
};

function initApp() {
    // টেলিগ্রাম অটো লগইন চেক
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) processLogin('firebase', user);
            else renderContact(); 
        });
    }
}

function processLogin(type, user) {
    if (type === 'telegram') {
        currentUser = {
            name: user.first_name + " " + (user.last_name || ""),
            id: user.id,
            username: user.username || "n/a",
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
        // লগআউট অবস্থায় নাম, ইমেইল, বয়স চাইবে
        box.innerHTML = `
            <input type="text" id="g-name" placeholder="Full Name">
            <input type="email" id="g-email" placeholder="Email Address">
            <input type="number" id="g-age" placeholder="Your Age">
            <textarea id="msg" placeholder="Write your message to RKX..."></textarea>
            <button onclick="send()" class="btn-send">Send Message</button>
        `;
    } else {
        // লগইন অবস্থায় শুধু মেসেজ বক্স
        box.innerHTML = `
            <p style="font-size:12px; color:#888; margin-bottom:0;">Logged in as: <b>${currentUser.name}</b></p>
            <textarea id="msg" placeholder="Write your message..."></textarea>
            <button onclick="send()" class="btn-send">Send Message</button>
        `;
    }
}

async function send() {
    const msgText = document.getElementById('msg').value;
    if (!msgText) return alert("Please type a message!");

    let report = `🚀 NEW PORTFOLIO MESSAGE\n\n`;

    if (!currentUser) {
        const gName = document.getElementById('g-name').value || "Unknown";
        const gEmail = document.getElementById('g-email').value || "No Email";
        const gAge = document.getElementById('g-age').value || "N/A";
        report += `👤 Name: ${gName}\n📧 Email: ${gEmail}\n🎂 Age: ${gAge}\n🌐 Status: Guest (Logged Out)\n`;
    } else {
        report += `👤 Name: ${currentUser.name}\n`;
        if (currentUser.type === 'telegram') {
            report += `🆔 TG ID: ${currentUser.id}\n🔗 Username: @${currentUser.username}\n🌐 Status: Telegram User\n`;
        } else {
            report += `📧 Email: ${currentUser.email}\n🌐 Status: Google/Email User\n`;
        }
    }

    report += `\n💬 MESSAGE:\n${msgText}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: report
                // Parse mode বাদ দেওয়া হয়েছে যাতে আন্ডারস্কোর (_) এর জন্য মেসেজ ফেইল না হয়
            })
        });

        if (response.ok) {
            alert("Message sent successfully!");
            document.getElementById('msg').value = "";
        } else {
            const err = await response.json();
            alert("Error: " + err.description);
        }
    } catch (e) {
        alert("Check your internet or Bot Token!");
    }
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
        alert("Please open this app inside Telegram for TG Login.");
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
