import React, { useState } from 'react'
import { Navbar } from './components/Navbar'
import { HomeScreen } from './components/HomeScreen'
import { DataEntryScreen, FormData } from './components/DataEntryScreen'
import { ContributionsScreen, Contribution } from './components/ContributionsScreen'

export function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('home')
  const [contributions, setContributions] = useState<Contribution[]>([])

  const addContribution = (contribution: FormData) => {
    const newContribution: Contribution = {
      ...contribution,
      avgTemp: Number(contribution.avgTemp),
      avgWindSpeed: Number(contribution.avgWindSpeed),
      avgSoilTemp: Number(contribution.avgSoilTemp),
      precipitation: Number(contribution.precipitation),
      id: Date.now(),
    }
    setContributions([...contributions, newContribution])
  }

  const updateContribution = (id: string | number, updatedData: Partial<Contribution>) => {
    setContributions(
      contributions.map((item: Contribution) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              avgTemp: updatedData.avgTemp !== undefined ? Number(updatedData.avgTemp) : item.avgTemp,
              avgWindSpeed: updatedData.avgWindSpeed !== undefined ? Number(updatedData.avgWindSpeed) : item.avgWindSpeed,
              avgSoilTemp: updatedData.avgSoilTemp !== undefined ? Number(updatedData.avgSoilTemp) : item.avgSoilTemp,
              precipitation: updatedData.precipitation !== undefined ? Number(updatedData.precipitation) : item.precipitation,
            }
          : item
      )
    )
  }

  const deleteContribution = (id: string | number) => {
    setContributions(contributions.filter((item: Contribution) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar
        setCurrentScreen={setCurrentScreen}
        currentScreen={currentScreen}
      />
      <main className="container mx-auto px-4 py-8">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'data-entry' && (
          <DataEntryScreen
            addContribution={addContribution}
            setCurrentScreen={setCurrentScreen}
          />
        )}
        {currentScreen === 'contributions' && (
          <ContributionsScreen
            contributions={contributions}
            updateContribution={updateContribution}
            deleteContribution={deleteContribution}
            setCurrentScreen={setCurrentScreen}
          />
        )}
      </main>
    </div>
  )
}
