import React, { useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'

// Define the structure for the form data
export interface FormData {
  region: string;
  date: string;
  avgTemp: string | number; // Allow string for input, parse later
  avgWindSpeed: string | number;
  avgSoilTemp: string | number;
  precipitation: string | number;
}

// Define the types for the component's props
interface DataEntryScreenProps {
  addContribution: (data: FormData) => void;
  setCurrentScreen: (screen: string) => void;
}

export const DataEntryScreen: React.FC<DataEntryScreenProps> = ({ addContribution, setCurrentScreen }) => {
  const [formData, setFormData] = useState<FormData>({
    region: '',
    date: new Date().toISOString().split('T')[0],
    avgTemp: '',
    avgWindSpeed: '',
    avgSoilTemp: '',
    precipitation: '',
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Consider parsing number fields here before passing to addContribution
    const contributionData: FormData = {
      ...formData,
      avgTemp: parseFloat(formData.avgTemp as string) || 0, // Example parsing
      avgWindSpeed: parseFloat(formData.avgWindSpeed as string) || 0,
      avgSoilTemp: parseFloat(formData.avgSoilTemp as string) || 0,
      precipitation: parseFloat(formData.precipitation as string) || 0,
    };
    addContribution(contributionData)
    // Reset form
    setFormData({
      region: '',
      date: new Date().toISOString().split('T')[0],
      avgTemp: '',
      avgWindSpeed: '',
      avgSoilTemp: '',
      precipitation: '',
    })
    // Show success message or redirect
    alert('Data submitted successfully!')
  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center text-green-700 hover:text-green-900 mr-3"
        >
          <ArrowLeftIcon size={18} />
          <span className="ml-1">Back to home</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Farming Data</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4 text-gray-600">
          Contribute to our agricultural database by adding your local farming
          conditions. This helps improve predictions for all farmers in your
          region.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region/Location
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Central Iowa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Temperature (°F)
              </label>
              <input
                type="number"
                name="avgTemp"
                value={formData.avgTemp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 75"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Wind Speed (mph)
              </label>
              <input
                type="number"
                name="avgWindSpeed"
                value={formData.avgWindSpeed}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 8"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Soil Temperature (°F)
              </label>
              <input
                type="number"
                name="avgSoilTemp"
                value={formData.avgSoilTemp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 65"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precipitation (inches)
              </label>
              <input
                type="number"
                name="precipitation"
                value={formData.precipitation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 0.5"
                step="0.1"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition"
          >
            Submit Data
          </button>
        </form>
      </div>
    </div>
  )
}
