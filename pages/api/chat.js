export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': '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',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
