export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': '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',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
