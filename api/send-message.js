const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

    const { name, email, message } = req.body;
    const BOT_TOKEN = "8163692985:AAFlEILEiEUengkF0bJPCfVIO741F5NavCI";
    const ADMIN_ID = "7475964655";

    const text = `🌑 **New Hacker Signal**\n\n👤 User: ${name}\n📧 Mail: ${email}\n💬 Msg: ${message}`;

    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: ADMIN_ID,
            text: text,
            parse_mode: 'Markdown'
        });
        res.status(200).json({ status: 'sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
