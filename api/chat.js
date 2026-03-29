export default async function handler(req, res) {
  res.status(200).json({ message: "proxy is alive", key: "sk-ant-api03-hardcodedtest" });
}
