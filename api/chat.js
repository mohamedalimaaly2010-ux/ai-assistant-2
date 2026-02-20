export default async function handler(req, res) {
  const message = req.body?.message;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}

export const config = {
  api: {
    bodyParser: true
  }
};
