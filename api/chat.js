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
            content: `STRICT FACTUAL MODE:
            - PRIMARY SOURCES ONLY: Holy Quran and Sahih al-Bukhari/Muslim. 
            - SEERAH & SAHABA: Use only Ar-Raheeq Al-Makhtum and Siyar A'lam al-Nubala.
            - LEGAL: Use only the majority views of the 4 Sunni Imams.
            
            STRICT RULES:
            1. If you are not 100% sure of a Hadith number or Verse, do NOT provide it.
            2. Never invent or "hallucinate" names, dates, or rulings. 
            3. If the user asks for something outside these trusted sources, say: "I can only provide information from verified Sahih sources."
            4. Always provide the Arabic text of the Quranic Verse or Hadith alongside the translation.
            5. Do not provide personal interpretations.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0.0, // Absolute precision
        top_p: 0.1,      // Only considers the most likely words
        stream: false
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Scholarly API connection failed." });
  }
}
