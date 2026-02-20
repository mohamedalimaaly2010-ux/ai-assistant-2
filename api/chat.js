export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Changed from GROQ_API_KEY to GROQ_API_KEY_2
        'Authorization': `Bearer ${process.env.GROQ_API_KEY_2}`, 
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', 
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Groq API Error: ${data.error.message}` });
    }

    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({ reply: "The API returned an empty response." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: `Server Crash: ${err.message}` });
  }
}
