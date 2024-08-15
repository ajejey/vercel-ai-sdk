'use client';

import { useState } from 'react';
import { filterSalesData } from './actions';

const prompts = [
    'Filter sales data by region',
    'Show sales data for the South region',
    "Filter sales for product Laptop",
    "Show all data for Tablets",
    "Filter data for the date 2024-08-15",
    "Show sales on 2024-08-10",
    "Show all Laptop sales in the North region",
    "Filter data for 2024-08-09 in the North region",
    "Sort data by sales in ascending order",
    "Sort the data by date in descending order",
    "Show data where sales are less than 200",
    "Show all data before 2024-08-12",
    "Show data with sales greater than 150",
    "Filter by region East and product Smartphone",
    "Filter by region South and sales less than 100"

];

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [input, setInput] = useState('');

  const handleFilter = async (input) => {
    const { messages } = await filterSalesData([...history, { role: 'user', content: input }]);
    console.log("messages ", messages);
    const newFilteredData = messages[messages.length - 1].content;
    console.log("newFilteredData ", newFilteredData, typeof newFilteredData);
    setHistory(messages);
    setFilteredData(JSON.parse(newFilteredData));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Sales Dashboard</h1>
      <input
        type="text"
        placeholder="Describe how you want to filter data (e.g., 'Filter by region North')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            await handleFilter(e.target.value);
            e.target.value = '';
          }
        }}
      />
      <div className="flex flex-wrap mb-4 h-24 overflow-auto">
        {prompts.map((prompt, index) => (
          <div key={index} onClick={() => setInput(prompt)} className="mr-2 mb-2 px-4 py-2 bg-gray-200 rounded-full cursor-pointer">
            {prompt}
          </div>
        ))}
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Filtered Sales Data</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Sales</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{item.region}</td>
                <td className="px-4 py-2 border">{item.product}</td>
                <td className="px-4 py-2 border">{item.sales}</td>
                <td className="px-4 py-2 border">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
