'use client';

import { useState } from 'react';
import { getMeetingSchedules } from './actions';

export const maxDuration = 30;

export default function Home() {
  const [schedules, setSchedules] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Meeting Schedules</h1>

      <button
        onClick={async () => {
          const data = await getMeetingSchedules(
            'Generate meeting schedules for the next sprint.',
          );

          const { schedules } = data;
          console.log('schedules', schedules.schedules);


          setSchedules(schedules.schedules);
        }}
        className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Generate Meeting Schedules
      </button>

      <div className="w-full max-w-4xl grid gap-6">
        {schedules.length > 0 ? (
          schedules.map((schedule, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-700">{schedule.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Time:</strong> {schedule.time}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Participants:</strong> {schedule.participants.join(', ')}
              </p>
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-600">Agenda:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {schedule.agenda.map((item, i) => (
                    <li key={i}>
                      {item.topic} ({item.duration})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Click the button to generate meeting schedules.</p>
        )}
      </div>
    </div>
  );
}
