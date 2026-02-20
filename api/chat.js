import pdf from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();

  try {
    const { message, pdfBase64 } = req.body;
    let contextText = "";

    // If a PDF is uploaded, extract the text from it
    if (pdfBase64) {
      const buffer = Buffer.from(pdfBase64, 'base64');
      const data = await pdf(buffer);
      contextText = data.text;
    }

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
            content: `You are a Document Analysis Expert. 
            Use the following extracted text to answer the user's question accurately. 
            If the answer isn't in the text, say you don't know.
            
            EXTRACTED TEXT:
            ${contextText.substring(0, 10000)}` // Limits text size for speed
          },
          { role: 'user', content: message || "Please summarize this document." }
        ],
        temperature: 0
      }),
    });

    const aiData = await response.json();
    res.status(200).json({ reply: aiData.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Error processing PDF: " + err.message });
  }
}
