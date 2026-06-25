let settings = {
  logoUrl: '/images/ehika-logo.svg'
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(settings);
  }

  if (req.method === 'POST') {
    const token = req.headers['x-admin-token'];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const body = req.body;
    if (body.logoUrl) settings.logoUrl = body.logoUrl;
    return res.status(200).json({ message: 'Settings updated', settings });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
