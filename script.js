// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDvtZJhIN850tU7cETuiqRyCyjCBdlFt-Y",
    authDomain: "fynora-81313.firebaseapp.com",
    databaseURL: "https://fynora-81313-default-rtdb.firebaseio.com",
    projectId: "fynora-81313",
    storageBucket: "fynora-81313.firebasestorage.app",
    messagingSenderId: "593306264446",
    appId: "1:593306264446:web:da476d4c77ae4ede6b492f"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Telegram WebApp Initialization
const tg = window.Telegram.WebApp;
tg.expand(); // ফুল স্ক্রিন করার জন্য

// টেলিগ্রাম অটো লগইন চেক
window.onload = () => {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('portfolio-screen').classList.remove('hidden');
        document.getElementById('display-name').innerText = user.first_name + (user.last_name ? " " + user.last_name : "");
        console.log("Auto-login via Telegram:", user.id);
    }
};

// Google Login
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
}

// Auth State
auth.onAuthStateChanged(user => {
    if (user && !tg.initDataUnsafe.user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('portfolio-screen').classList.remove('hidden');
        document.getElementById('display-name').innerText = user.displayName;
    }
});

function logout() { auth.signOut(); location.reload(); }

// Send Message to Bot
document.getElementById('contactForm').onsubmit = async (e) => {
    e.preventDefault();
    
    // টেলিগ্রাম ইউজার ডাটা (যদি থাকে)
    const tgUser = tg.initDataUnsafe.user || {};
    
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        message: document.getElementById('contact-msg').value,
        tg_id: tgUser.id || "N/A",
        tg_username: tgUser.username || "N/A"
    };

    const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (res.ok) alert("Message sent successfully!");
};
