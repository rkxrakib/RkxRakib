// Firebase Auth setup
const auth = firebase.auth();
const tg = window.Telegram.WebApp;

// Phone Auth persistence
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible'
});

function initApp() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
    } else {
        auth.onAuthStateChanged(user => {
            if (user) processLogin('firebase', user);
            else renderContact(); 
        });
    }
    // Browser এ থাকলে Telegram Login Widget লোড করার লজিক এখানে দিতে পারেন
}

// --- 1. Email Login ---
function loginWithEmail() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    
    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            hideLoginOptions();
        })
        .catch(err => alert(err.message));
}

// --- 2. Forgot Password ---
function forgotPassword() {
    const email = document.getElementById('auth-email').value;
    if(!email) return alert("Please enter your email first.");
    
    auth.sendPasswordResetEmail(email)
        .then(() => alert("Password reset link sent to your email!"))
        .catch(err => alert(err.message));
}

// --- 3. Phone Login (OTP) ---
function loginWithPhone() {
    const phoneNumber = document.getElementById('auth-phone').value;
    if(!phoneNumber.startsWith('+')) return alert("Enter number with country code (e.g. +880)");

    const appVerifier = window.recaptchaVerifier;
    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(confirmationResult => {
            const code = prompt("Enter the OTP sent to your phone:");
            if(code) {
                confirmationResult.confirm(code)
                    .then(() => hideLoginOptions())
                    .catch(err => alert("Invalid OTP"));
            }
        }).catch(err => alert(err.message));
}

// --- 4. Telegram Login (Browser & WebApp Support) ---
function reEnableTGLogin() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        processLogin('telegram', tg.initDataUnsafe.user);
        hideLoginOptions();
    } else {
        // Browser এ থাকলে Telegram Login Widget দেখানোর নিয়ম:
        // আপনাকে আপনার বটের জন্য "Domain" সেট করতে হবে Telegram @BotFather এ গিয়ে।
        alert("Redirecting to Telegram Login...");
        window.open(`https://t.me/YOUR_BOT_USERNAME?start=login`, '_blank');
        // অথবা এখানে Telegram official Widget script inject করতে পারেন।
    }
}

// আপডেট হওয়া processLogin Function
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
            name: user.displayName || user.email.split('@')[0] || user.phoneNumber,
            email: user.email || "No Email",
            phone: user.phoneNumber || "No Phone",
            photo: user.photoURL || "https://t.me/i/userpic/320/rkxrakib_69.svg",
            type: 'firebase'
        };
    }
    updateAuthUI();
}
