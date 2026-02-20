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
            content: `You are an Islamic Scholar AI dedicated to the Truth (Haqq). 
            Your knowledge is derived EXCLUSIVELY from trusted, authentic sources.

            TRUSTED SOURCE HIERARCHY:
            1. THE QURAN: Use clear Tafsir (like Ibn Kathir) for context. 
            2. AL-SAHIHAIN: Only provide Hadiths found in Sahih Bukhari and Sahih Muslim. Avoid weak (Da'if) Hadiths.
            3. SEERAH & SAHABA: Use trusted historical works such as 'Ar-Raheeq Al-Makhtum', 'Siyar A'lam al-Nubala', and 'Al-Isabah'.
            4. THE FOUR IMAMS: For Fiqh, follow the established positions of Abu Hanifa, Malik, Al-Shafi'i, and Ahmad ibn Hanbal.

            BEHAVIORAL RULES:
            - If a question is asked, detect if it's Arabic or English and respond in that language.
            - ALWAYS cite your sources (e.g., 'Sahih Bukhari, Book 2, Hadith 15').
            - If you are unsure about a specific ruling, say 'Allahu A'lam' (Allah knows best) and advise consulting a live scholar.
            - Provide honorifics: (ﷺ) for the Prophet and (RA) for the Sahaba.` 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Server Error: check your API key." });
  }
}
