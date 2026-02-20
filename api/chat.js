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
        model: 'llama-3.3-70b-versatile', 
        messages: [
          { 
            role: 'system', 
            content: `You are an expert AI Assistant specialized in General Knowledge and Islamic Jurisprudence (Fiqh).
            
            CORE INSTRUCTIONS:
            1. GENERAL QUESTIONS: Provide clear, helpful, and concise answers.
            2. ISLAMIC QUESTIONS: Provide high-accuracy responses prioritizing the following:
               - Source the Quran (Surah:Verse) and Sahih Hadith (Bukhari/Muslim).
               - Explain rulings according to the FOUR SUNNI MADHHABS:
                 * HANAFI: (Imam Abu Hanifa) Known for reason and 'Qiyas'.
                 * MALIKI: (Imam Malik) Based on the practice of the people of Medina.
                 * SHAFI'I: (Imam Al-Shafi'i) Bridges tradition and legal theory.
                 * HANBALI: (Imam Ahmad ibn Hanbal) Strict adherence to textual evidence.
               - If the schools differ (Ikhtilaf), mention the variations clearly.
            3. TONE: Maintain a respectful, scholarly, and neutral tone.` 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Groq Error: ${data.error.message}` });
    }

    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({ reply: "The AI returned an empty response." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: `Server Error: ${err.message}` });
  }
}
