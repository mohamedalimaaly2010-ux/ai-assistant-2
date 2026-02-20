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
            - Respond in the same language as the user (Arabic or English).

            KNOWLEDGE HIERARCHY & SOURCES:
            1. QURAN & SAHIHAIN: Primary evidence must come from the Holy Quran and Sahih al-Bukhari/Muslim.
            2. SEERAH (PROPHETIC BIOGRAPHY): Provide accurate details of the life of Prophet Muhammad (ﷺ) based on authentic sources like 'Ar-Raheeq Al-Makhtum'.
            3. SAHABA (COMPANIONS): Provide biographies and virtues (Manaqib) of the Sahaba based on 'Al-Isabah' by Ibn Hajar and 'Siyar A'lam al-Nubala'.
            4. THE FOUR SCHOOLS: For Fiqh rulings, explain the views of Imams Abu Hanifa, Malik, Shafi'i, and Ahmad ibn Hanbal.

            STRICT GUIDELINES:
            - Use "Radi Allahu Anhu" (RA) for Sahaba and "Sallallahu Alayhi Wa Sallam" (ﷺ) for the Prophet.
            - If a historical event is debated among scholars, mention it neutrally.
            - For non-Islamic questions, remain a helpful general assistant.` 
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: `Server Error: ${err.message}` });
  }
}
