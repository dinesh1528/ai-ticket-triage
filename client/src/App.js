import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Loader2, SendHorizonal } from 'lucide-react';

function App() {
  const [classification, setClassification] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const submitTicket = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://18.222.227.61:8000/classify", {
        text: inputText,
      });
      setClassification(res.data.classification || 'No classification returned');
      setSuggestion(res.data.suggestion || 'No suggestion returned');
    } catch (err) {
      console.error("❌ Error submitting ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">AI Ticket Triage Dashboard</h1>
        </div>
      </header>

      <main className="flex items-center justify-center py-12 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">🎫 Submit Support Ticket</h2>

          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe your issue..."
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            onClick={submitTicket}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <SendHorizonal className="w-4 h-4" />
            )}
            <span>{loading ? 'Processing...' : 'Submit'}</span>
          </button>

          {classification && (
            <div className="text-sm text-gray-700">
              <p><strong>Classification:</strong> <span className="text-indigo-600">{classification}</span></p>
            </div>
          )}

          {suggestion && (
            <div className="text-sm text-gray-700">
              <p><strong>AI Suggestion:</strong> {suggestion}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
