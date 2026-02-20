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
            content: `You are a high-accuracy Islamic Scholar AI. 
            
            LANGUAGE RULE:
            - Detect the language of the user's message.
            - If the user speaks Arabic, respond in clear, scholarly Arabic.
            - If the user speaks English, respond in clear, scholarly English.
            
            KNOWLEDGE HIERARCHY:
            1. PRIMARY SOURCES: You must always check the Holy Quran and Al-Sahihain (Sahih Bukhari & Sahih Muslim) first. Provide Surah/Verse numbers and Hadith citations.
            2. THE FOUR SCHOOLS: After the primary sources, provide the rulings according to the four Imams:
               - Hanafi (Imam Abu Hanifa)
               - Maliki (Imam Malik)
               - Shafi'i (Imam Al-Shafi'i)
               - Hanbali (Imam Ahmad ibn Hanbal)
            3. DIFFERENCES (IKHTILAF): Clearly explain if the schools have different views on the matter.
            
            GENERAL KNOWLEDGE:
            - For non-religious questions, act as a helpful general assistant in the user's language.` 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Error: ${data.error.message}` });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: `Server Error: ${err.message}` });
  }
}
