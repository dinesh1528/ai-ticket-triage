import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState(null);

  const submitTicket = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ticket`,
      { content: text },
      { headers: { Authorization: localStorage.getItem('token') } }
    );
    setResponse(res.data);
  };

  return (
    <div className="p-4">
      <h2>Submit Support Ticket</h2>
      <textarea className="w-full h-32" onChange={(e) => setText(e.target.value)}></textarea>
      <button onClick={submitTicket} className="bg-blue-500 px-4 py-2 text-white mt-2">Submit</button>
      {response && (
        <div className="mt-4">
          <p><strong>Classification:</strong> {response.classification}</p>
          <p><strong>AI Suggestion:</strong> {response.suggestedAnswer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
