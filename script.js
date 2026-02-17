// --- Overlay Controls ---
function toggleLogin(show) {
    const overlay = document.getElementById('login-overlay');
    if (show) {
        overlay.classList.remove('hidden');
        initYeti();
    } else {
        overlay.classList.add('hidden');
    }
}

// --- Yeti Animation Logic ---
function initYeti() {
    const email = document.querySelector('#loginEmail');
    const password = document.querySelector('#loginPassword');
    const showPass = document.querySelector('#showPasswordCheck');
    const armL = document.querySelector('.armL');
    const armR = document.querySelector('.armR');
    const eyeL = document.querySelector('.eyeL');
    const eyeR = document.querySelector('.eyeR');
    const fingers = document.querySelector('.twoFingers');

    // Initial State
    gsap.set([armL, armR], { visibility: "visible" });
    gsap.set(armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
    gsap.set(armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });

    // 1. Email Typing (Eyes look around)
    email.addEventListener('input', (e) => {
        let val = e.target.value.length;
        let moveX = Math.min(val * 0.8, 15) - 7;
        gsap.to([eyeL, eyeR], { x: moveX, duration: 0.2 });
    });

    // 2. Password Focus (Close Eyes)
    password.addEventListener('focus', () => {
        if (!showPass.checked) {
            gsap.to(armL, { x: -93, y: 10, rotation: 0, duration: 0.45 });
            gsap.to(armR, { x: -93, y: 10, rotation: 0, duration: 0.45 });
        }
    });

    // 3. Password Blur (Open Eyes)
    password.addEventListener('blur', () => {
        gsap.to(armL, { y: 220, rotation: 105, duration: 0.5 });
        gsap.to(armR, { y: 220, rotation: -105, duration: 0.5 });
    });

    // 4. Show Password (Peek / উঁকি মারা)
    showPass.addEventListener('change', (e) => {
        if (e.target.checked) {
            password.type = "text";
            // আঙুল ফাঁক করে উঁকি দিবে
            gsap.to(fingers, { rotation: 35, x: -10, duration: 0.3, transformOrigin: "bottom left" });
        } else {
            password.type = "password";
            // আঙুল আবার বন্ধ করবে
            gsap.to(fingers, { rotation: 0, x: 0, duration: 0.3 });
        }
    });
}
