// --- YETI FORM LOGIC ---
function showLoginOptions() {
    document.getElementById('login-overlay').classList.remove('hidden');
    initLoginForm(); // Initialize animation when shown
}

function hideLoginOptions() {
    document.getElementById('login-overlay').classList.add('hidden');
}

// Register GSAP Plugin
gsap.registerPlugin(MorphSVGPlugin);

function initLoginForm() {
    const email = document.querySelector('#loginEmail');
    const password = document.querySelector('#loginPassword');
    const armL = document.querySelector('.armL');
    const armR = document.querySelector('.armR');
    const eyeL = document.querySelector('.eyeL');
    const eyeR = document.querySelector('.eyeR');
    const showPasswordCheck = document.querySelector('#showPasswordCheck');

    // Initial Positions
    gsap.set(armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left", visibility: "visible" });
    gsap.set(armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right", visibility: "visible" });

    // Cover Eyes on Password Focus
    password.addEventListener('focus', () => {
        gsap.to(armL, 0.45, { x: -93, y: 10, rotation: 0, ease: "quad.out" });
        gsap.to(armR, 0.45, { x: -93, y: 10, rotation: 0, ease: "quad.out", delay: 0.1 });
    });

    password.addEventListener('blur', () => {
        gsap.to(armL, 0.7, { y: 220, rotation: 105, ease: "quad.inOut" });
        gsap.to(armR, 0.7, { y: 220, rotation: -105, ease: "quad.inOut" });
    });

    // Toggle Show Password
    showPasswordCheck.addEventListener('change', (e) => {
        password.type = e.target.checked ? "text" : "password";
        if(e.target.checked) {
            // Spread fingers slightly if you want extra effect
            gsap.to(armL, 0.3, { x: -105 }); 
        } else {
            gsap.to(armL, 0.3, { x: -93 });
        }
    });

    // Follow Cursor logic for Email
    email.addEventListener('input', () => {
        let val = email.value.length;
        let moveX = Math.min(val * 2, 25);
        gsap.to([eyeL, eyeR], 0.2, { x: moveX - 10 });
    });
}
