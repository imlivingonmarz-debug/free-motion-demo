import { useState, useEffect, useRef } from 'react';

const SYSTEM = `You are Alex, a friendly and professional AI assistant for FreeMotion Auto — a car rental and used car sales business. You communicate only via text message. Keep responses short, warm, and conversational — like a real person texting, not a formal email. Use 1-3 short sentences max per message. Never use bullet points or numbered lists. Never repeat your introduction if you have already greeted the customer. Your job is to help potential customers with renting a car or buying a used car. Naturally guide the conversation to collect the required information below, one or two questions at a time. FOR RENTALS collect: pickup and return dates, vehicle type, valid driver's license, insurance preference (personal insurance or Basic/Premium Vehicle Protection Plan), valid card on file, age 18+, full name and callback number. FOR USED CAR PURCHASES collect: vehicle type they want, budget range, cash or financing, trade-in yes/no, valid driver's license, valid payment or financing pre-approval, full name and callback number. Never ask more than 2 questions at a time. Once you have everything tell them a FreeMotion Auto team member will follow up shortly. Be warm and friendly, never pushy.`;

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hey! Thanks for reaching out to FreeMotion Auto! I'm Alex. Are you looking to rent a vehicle or buy one today?" }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  async function send() {
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput('');
    setBusy(true);
    setMessages(prev => [...prev, { role: 'user', text }]);
    const newHistory = [...history, { role: 'user', content: text }];
    setHistory(newHistory);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: SYSTEM, messages: newHistory })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || JSON.stringify(data);
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setMessages(prev => [...prev, { role: 'agent', text: reply }]);
    } catch(e) {
      setMessages(prev => [...prev, { role: 'agent', text: 'Error: ' + e.message }]);
    }
    setBusy(false);
  }

  return (
    <div style={{ fontFamily: '-apple-system, sans-serif', background: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ background: '#1D9E75', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'white', fontSize: '14px' }}>FM</div>
          <div>
            <p style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>FreeMotion Auto</p>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>AI Assistant · Online</span>
          </div>
          <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px' }}>
            <p style={{ color: 'white', fontSize: '10px', margin: 0 }}>Powered by Kwiker</p>
          </div>
        </div>

        <div ref={msgsRef} style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '420px', maxHeight: '420px', overflowY: 'auto', background: '#f8f8f8' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: '18px', fontSize: '14px', lineHeight: '1.5', background: m.role === 'user' ? '#1D9E75' : 'white', color: m.role === 'user' ? 'white' : '#1a1a1a', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', borderBottomRightRadius: m.role === 'user' ? '4px' : '18px', borderBottomLeftRadius: m.role === 'agent' ? '4px' : '18px', boxShadow: m.role === 'agent' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
              {m.text}
            </div>
          ))}
          {busy && (
            <div style={{ display: 'flex', gap: '5px', padding: '10px 14px', background: 'white', borderRadius: '18px', borderBottomLeftRadius: '4px', alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#999', animation: `bounce 1.2s ${i*0.2}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'white', borderTop: '1px solid #f0f0f0' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Text FreeMotion Auto..."
            style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: '24px', padding: '10px 16px', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={send} disabled={busy} style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1D9E75', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </div>
        <div style={{ padding: '10px', textAlign: 'center', background: 'white' }}>
          <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>This is a demo powered by Kwiker Services AI</p>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}
