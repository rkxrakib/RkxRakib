// আপনার Firebase কনফিগ
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

// Firebase ইনিশিয়ালাইজ করা
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// গুগোল দিয়ে লগইন
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            console.log("Logged in successfully");
        })
        .catch(err => alert("Error: " + err.message));
}

// লগইন স্টেট চেক করা এবং রাউটিং (/#/main)
auth.onAuthStateChanged(user => {
    const loginScreen = document.getElementById('login-screen');
    const portfolioScreen = document.getElementById('portfolio-screen');

    if (user) {
        // লগইন থাকলে মেইন পেজে নিয়ে যাবে
        window.location.hash = "/main";
        loginScreen.classList.add('hidden');
        portfolioScreen.classList.remove('hidden');
        document.getElementById('user-name').innerText = user.displayName || "User";
    } else {
        // লগইন না থাকলে হোম পেজে
        window.location.hash = "/";
        loginScreen.classList.remove('hidden');
        portfolioScreen.classList.add('hidden');
    }
});

// লগআউট ফাংশন
function logout() {
    auth.signOut();
}

// টেলিগ্রামে মেসেজ পাঠানো (Vercel API ব্যবহার করে)
document.getElementById('contactForm').onsubmit = async (e) => {
    e.preventDefault();
    const sendBtn = e.target.querySelector('button');
    sendBtn.innerText = "EXECUTING_SEND...";

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email-contact').value,
        message: document.getElementById('message').value
    };

    try {
        const res = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            document.getElementById('status').innerText = "> Success: Packet delivered to Admin.";
            e.target.reset();
        } else {
            document.getElementById('status').innerText = "> Error: Signal Lost.";
        }
    } catch (err) {
        document.getElementById('status').innerText = "> Critical: Network Failure.";
    }
    sendBtn.innerText = "SEND_MESSAGE";
};
