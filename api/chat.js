const https = require('https');

module.exports = async function handler(req, res) {
  const { message } = req.body;
  const body = JSON.stringify({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ]
  });
  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };
  const result = await new Promise((resolve, reject) => {
    const r = https.request(options, (res2) => {
      let data = '';
      res2.on('data', chunk => data += chunk);
      res2.on('end', () => resolve(JSON.parse(data)));
    });
    r.on('error', reject);
    r.write(body);
    r.end();
  });
  res.status(200).json({ reply: result.choices[0].message.content });
};
