const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const localLLM = {
  generate: async (prompt: string) => {
    const res = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data.text;
  }
};