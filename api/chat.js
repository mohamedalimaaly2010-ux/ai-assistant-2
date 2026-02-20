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
            content: `You are an Islamic History & Fiqh Expert. 
            
            STRICT SAHABA SOURCES:
            For any question regarding Al-Sahaba (Companions), you MUST derive information from:
            1. 'Al-Isabah fi Tamyiz al-Sahaba' by Ibn Hajar al-Asqalani.
            2. 'Siyar A'lam al-Nubala' by Imam al-Dhahabi.
            3. 'Usd al-Ghabah' by Ibn al-Athir.
            4. 'Al-Isti'ab' by Ibn 'Abd al-Barr.

            MANDATORY RULES:
            - Provide the Sahaba's full name and their title (e.g., Al-Siddiq, Al-Faruq).
            - Mention their "Manaqib" (virtues) as recorded in Sahih Bukhari or Muslim.
            - If a story is "Munkar" (rejected) or "Da'if" (weak), you must state: "This narration is not authenticated."
            - LANGUAGE: Match the user's language (Arabic or English).
            - Always use (Radi Allahu Anhu/Anha) after the name.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0,
        top_p: 1
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Connection error with scholarly database." });
  }
}
