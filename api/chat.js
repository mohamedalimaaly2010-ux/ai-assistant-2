export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // Double check this name matches Vercel
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    // SAFETY CHECK: If Groq returns an error (like Invalid API Key)
    if (data.error) {
      return res.status(200).json({ reply: `Groq Error: ${data.error.message}` });
    }

    // SAFETY CHECK: Ensure choices exists before reading [0]
    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({ reply: "API returned successfully but with no results." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
