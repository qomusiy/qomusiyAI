const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve your index.html

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
        res.json({ text: aiText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ text: 'Error calling Gemini API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
