import React, { useState } from 'react'
import { PlusIcon, UserIcon, ChevronDownIcon } from 'lucide-react'

// Define the types for the component's props
interface NavbarProps {
  setCurrentScreen: (screen: string) => void;
  currentScreen: string;
}

export const Navbar: React.FC<NavbarProps> = ({ setCurrentScreen, currentScreen }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="text-xl font-bold cursor-pointer flex items-center gap-2"
          onClick={() => setCurrentScreen('home')}
        >
          <span className="text-green-300">Agri</span>
          <span>Yield</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className={`p-2 rounded-full hover:bg-green-700 ${currentScreen === 'data-entry' ? 'bg-green-700' : ''}`}
            onClick={() => setCurrentScreen('data-entry')}
            title="Add farming data"
          >
            <PlusIcon size={20} />
          </button>
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-green-700 flex items-center gap-1"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <UserIcon size={20} />
              <ChevronDownIcon size={16} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100"
                  onClick={() => {
                    setCurrentScreen('contributions')
                    setShowDropdown(false)
                  }}
                >
                  See all contributions
                </button>
                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100">
                  Profile settings
                </button>
                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
