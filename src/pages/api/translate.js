export default async function handler(req, res) {
  try {
    const { text } = req.body;
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_KEY}`,
      },
      body: JSON.stringify({
        text: [text],
        target_lang: 'KO'
      })
    });
    const data = await response.json();
    res.status(200).json({ translated: data.translations[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}