'use client';

import { useState } from 'react';
import { Message, continueConversation } from './actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col w-full max-w-lg">
        {conversation.map((message, index) => (
          <div key={index} className="my-2 flex justify-start gap-x-2">
            <span className={`font-bold ${message.role === 'user' ? 'text-blue-500' : 'text-gray-500'}`}>
              {message.role}:
            </span>{' '}
            <span>
            {message.content}
            </span>
          </div>
        ))}
      </div>


      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={event => {
            setInput(event.target.value);
          }}
          className="w-full p-2 mr-2 border border-gray-300 rounded shadow-sm"
        />
        <button
          onClick={async () => {
            const { messages } = await continueConversation([
              ...conversation,
              { role: 'user', content: input },
            ]);

            setConversation(messages);
          }}
          className="py-2 px-4 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600"
        >
          Send Message
        </button>
      </div>
    </div>
   
  );
}