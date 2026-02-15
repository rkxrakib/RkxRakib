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

// Google Login
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
}

// Email Auth
function registerWithEmail() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    auth.createUserWithEmailAndPassword(email, pass).catch(e => alert(e.message));
}

function loginWithEmail() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    auth.signInWithEmailAndPassword(email, pass).catch(e => alert(e.message));
}

// UI Toggles
function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

// Auth State
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('portfolio-screen').classList.remove('hidden');
        window.location.hash = "/main";
    } else {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('portfolio-screen').classList.add('hidden');
        window.location.hash = "/";
    }
});

function logout() { auth.signOut(); }

// Message to Telegram
document.getElementById('contactForm').onsubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const data = {
        name: document.getElementById('sender-name').value,
        email: document.getElementById('sender-email').value,
        msg: document.getElementById('sender-msg').value,
        fb_uid: user ? user.uid : "Not logged in"
    };

    const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) alert("Message sent to Rakib's Terminal!");
};
