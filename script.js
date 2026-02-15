document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sendBtn = document.getElementById('sendBtn');
    const status = document.getElementById('status');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI";
    const ADMIN_ID = "7475964655";

    const text = `🚀 **New Message from Portfolio**\n\n👤 Name: ${name}\n📧 Email: ${email}\n📝 Message: ${message}`;

    sendBtn.innerText = "EXECUTING...";

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_ID,
                text: text,
                parse_mode: "Markdown"
            })
        });

        if (response.ok) {
            status.innerText = "> [SUCCESS] Message sent to Admin Terminal.";
            status.style.color = "#00ff41";
            document.getElementById('contactForm').reset();
        } else {
            status.innerText = "> [ERROR] Packet loss detected. Try again.";
            status.style.color = "red";
        }
    } catch (err) {
        status.innerText = "> [CRITICAL_ERROR] Connection failed.";
        status.style.color = "red";
    }
    sendBtn.innerText = "RUN send_message.sh";
});
