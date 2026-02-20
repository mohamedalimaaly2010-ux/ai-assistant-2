export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();

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
            content: `CRITICAL INSTRUCTION: You are a literalist Islamic Research Assistant. 
            1. DO NOT guess. If a Hadith or Verse is not 100% certain in your database, say "I do not have the specific text for this, please consult a local Mufti."
            2. SOURCES: Use ONLY the Quran, Sahih Bukhari, Sahih Muslim, and the established views of the 4 Imams (Hanafi, Maliki, Shafi'i, Hanbali).
            3. NO WEAK HADITH: Do not cite any Hadith labeled as Da'if or Mawdu'.
            4. BIOGRAPHY: For Seerah and Sahaba, stick to 'Ar-Raheeq Al-Makhtum' and 'Siyar A'lam al-Nubala'.
            5. FORMAT: Always state the source first before the explanation.
            6. LANGUAGE: Answer in the language the user used.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0, // This is the most important change for accuracy!
        max_tokens: 1024,
        top_p: 1,
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Scholarly database connection error." });
  }
}
