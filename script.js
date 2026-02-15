const firebaseConfig = {
    apiKey: "AIzaSyDvtZJhIN850tU7cETuiqRyCyjCBdlFt-Y",
    authDomain: "fynora-81313.firebaseapp.com",
    databaseURL: "https://fynora-81313-default-rtdb.firebaseio.com",
    projectId: "fynora-81313",
    storageBucket: "fynora-81313.firebasestorage.app",
    messagingSenderId: "593306264446",
    appId: "1:593306264446:web:da476d4c77ae4ede6b492f",
    measurementId: "G-BX0FWR2YMT"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Toggle between Login and Register
function toggleAuth() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const title = document.getElementById('auth-title');
    const toggleLink = document.getElementById('toggle-link');
    const toggleMsg = document.getElementById('toggle-msg');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        title.innerText = "Welcome Back";
        toggleMsg.innerText = "Don't have an account?";
        toggleLink.innerText = "Sign Up";
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        title.innerText = "Create Account";
        toggleMsg.innerText = "Already have an account?";
        toggleLink.innerText = "Login";
    }
}

// Google Login
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert(err.message));
}

// Email Registration
function registerWithEmail() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const name = document.getElementById('reg-name').value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            userCredential.user.updateProfile({ displayName: name });
            alert("Account Created!");
        })
        .catch(err => alert(err.message));
}

// Email Login
function loginWithEmail() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .catch(err => alert(err.message));
}

// Auth Observer
auth.onAuthStateChanged(user => {
    const authScreen = document.getElementById('auth-container');
    const portfolioScreen = document.getElementById('portfolio-screen');
    
    if (user) {
        authScreen.classList.add('hidden');
        portfolioScreen.classList.remove('hidden');
        document.getElementById('user-display-name').innerText = user.displayName || user.email;
        window.location.hash = "/main";
    } else {
        authScreen.classList.remove('hidden');
        portfolioScreen.classList.add('hidden');
        window.location.hash = "/";
    }
});

function logout() { auth.signOut(); }
