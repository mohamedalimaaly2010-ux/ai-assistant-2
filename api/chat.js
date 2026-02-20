export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY_2}`,
      },
      body: JSON.stringify({
        // Using 70B for higher accuracy in religious texts
        model: 'llama-3.3-70b-versatile', 
        messages: [
          { 
            role: 'system', 
            content: `You are a versatile AI assistant. 
            
            GUIDELINES:
            1. For GENERAL questions, provide clear and helpful answers.
            2. For ISLAMIC questions, you must provide HIGH-ACCURACY responses. 
               - Reference the Quran and Sahih Hadiths (Bukhari/Muslim) where possible.
               - Specify Surah or Hadith numbers.
               - Maintain a respectful, scholarly tone.
               - If there is a difference of scholarly opinion, mention it briefly.
            3. Always provide a disclaimer for complex religious rulings.` 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `API Error: ${data.error.message}` });
    }

    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({ reply: "The AI returned an empty response." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: `Server Error: ${err.message}` });
  }
}
