import React, { useMemo, useState } from 'react'
import { ArrowLeftIcon, PencilIcon, XIcon, SearchIcon } from 'lucide-react'

// Define the structure of a contribution object
export interface Contribution {
  id: string | number; // Assuming ID can be string or number
  region: string;
  date: string; // Keep as string, assuming ISO format 'YYYY-MM-DD'
  avgTemp: number;
  avgWindSpeed: number;
  avgSoilTemp: number;
  precipitation: number;
}

// Define the types for the component's props
interface ContributionsScreenProps {
  contributions: Contribution[];
  updateContribution: (id: string | number, data: Partial<Contribution>) => void;
  deleteContribution: (id: string | number) => void;
  setCurrentScreen: (screen: string) => void; // Assuming screen name is a string
}

export const ContributionsScreen: React.FC<ContributionsScreenProps> = ({
  contributions,
  updateContribution,
  deleteContribution,
  setCurrentScreen,
}) => {
  const [editId, setEditId] = useState<string | number | null>(null)
  const [editData, setEditData] = useState<Partial<Contribution>>({}) // Use Partial<Contribution> for edit state
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  })
  const filteredContributions = useMemo(() => {
    return contributions.filter((contribution: Contribution) => { // Add type to contribution
      if (!dateRange.startDate && !dateRange.endDate) return true
      const contributionDate = new Date(contribution.date)
      const start = dateRange.startDate ? new Date(dateRange.startDate) : null
      const end = dateRange.endDate ? new Date(dateRange.endDate) : null
      if (start && end) {
        return contributionDate >= start && contributionDate <= end
      } else if (start) {
        return contributionDate >= start
      } else if (end) {
        return contributionDate <= end
      }
      return true
    })
  }, [contributions, dateRange])
  const startEdit = (contribution: Contribution) => { // Add type to contribution
    setEditId(contribution.id)
    setEditData({
      ...contribution,
    })
  }
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Add type to event
    const { name, value, type } = e.target;
    setEditData({
      ...editData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value, // Handle number conversion
    });
  }
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Add type to event
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    })
  }
  const saveEdit = () => {
    if (editId !== null) { // Check if editId is not null before updating
      updateContribution(editId, editData)
    }
    setEditId(null)
  }
  const cancelEdit = () => {
    setEditId(null)
  }
  const clearDateRange = () => {
    setDateRange({
      startDate: '',
      endDate: '',
    })
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center text-green-700 hover:text-green-900 mr-3"
        >
          <ArrowLeftIcon size={18} />
          <span className="ml-1">Back to home</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Your Contributions</h1>
      </div>
      {contributions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">
            You haven't submitted any farming data yet.
          </p>
          <button
            onClick={() => setCurrentScreen('data-entry')}
            className="mt-4 bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition"
          >
            Add Your First Data
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {(dateRange.startDate || dateRange.endDate) && (
                <button
                  onClick={clearDateRange}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Showing {filteredContributions.length} of {contributions.length}{' '}
              contributions
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredContributions.map((contribution: Contribution) => ( // Add type to contribution
              <div
                key={contribution.id}
                className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600"
              >
                {editId === contribution.id ? (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Region
                        </label>
                        <input
                          type="text"
                          name="region"
                          value={editData.region || ''} // Add fallback for potentially undefined value
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={editData.date || ''} // Add fallback
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Avg Temp (°F)
                        </label>
                        <input
                          type="number"
                          name="avgTemp"
                          value={editData.avgTemp || 0} // Add fallback
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Wind Speed (mph)
                        </label>
                        <input
                          type="number"
                          name="avgWindSpeed"
                          value={editData.avgWindSpeed || 0} // Add fallback
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Soil Temp (°F)
                        </label>
                        <input
                          type="number"
                          name="avgSoilTemp"
                          value={editData.avgSoilTemp || 0} // Add fallback
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precipitation (in)
                        </label>
                        <input
                          type="number"
                          name="precipitation"
                          value={editData.precipitation || 0} // Add fallback
                          onChange={handleEditChange}
                          step="0.1"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-green-800">
                        {contribution.region}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(contribution)}
                          className="p-1 text-gray-500 hover:text-green-700"
                          title="Edit"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          onClick={() => deleteContribution(contribution.id)}
                          className="p-1 text-gray-500 hover:text-red-700"
                          title="Delete"
                        >
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {contribution.date}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <span className="ml-1 font-medium">
                          {contribution.avgTemp}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Wind Speed:</span>
                        <span className="ml-1 font-medium">
                          {contribution.avgWindSpeed} mph
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Soil Temp:</span>
                        <span className="ml-1 font-medium">
                          {contribution.avgSoilTemp}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Precipitation:</span>
                        <span className="ml-1 font-medium">
                          {contribution.precipitation}"
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
