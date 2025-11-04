import React, { useState, useEffect } from 'react'
import { SearchIcon } from 'lucide-react'

// Define the structure for search form data
interface SearchData {
  location: string;
  crop: string;
}

// Define the structure for prediction results
interface PredictionResults {
  yieldPrediction: number | string; // Allow string for potential placeholders
  recommendedPlantingDate: string;
  wateringSchedule: string;
  pestRisks: string[];
  fertilizer: string;
  soilHealth: string;
  // Add fields to potentially hold data from the backend if needed
  stationName?: string;
  stationLocation?: string;
  weatherDate?: string;
  weatherTemp?: number | string;
  weatherPrecip?: number | string;
  soilDate?: string;
  soilMaxTemp?: number | string;
  soilMinTemp?: number | string;
}

export const HomeScreen = () => {
  const [searchData, setSearchData] = useState<SearchData>({
    location: '',
    crop: '',
  })
  const [predictionResults, setPredictionResults] = useState<PredictionResults | null>(null)
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [regions, setRegions] = useState<string[]>([]); // State for regions
  const [loadingRegions, setLoadingRegions] = useState<boolean>(true); // Loading state for regions
  const [crops, setCrops] = useState<string[]>([]); // State for crops
  const [loadingCrops, setLoadingCrops] = useState<boolean>(true); // Reset initial state to true

  // Fetch regions and crops on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Regions (keep this logic)
      setLoadingRegions(true);
      try {
        const regionsResponse = await fetch('http://127.0.0.1:5000/api/regions');
        if (!regionsResponse.ok) throw new Error('Failed to fetch regions');
        const regionsData = await regionsResponse.json();
        if (Array.isArray(regionsData)) setRegions(regionsData);
      } catch (err) {
        console.error("Error fetching regions:", err);
      } finally {
        setLoadingRegions(false);
      }

      // Fetch Crops (fetch immediately, no region dependency)
      setLoadingCrops(true);
      try {
        const cropsResponse = await fetch('http://127.0.0.1:5000/api/crops'); // No query param needed
        if (!cropsResponse.ok) throw new Error('Failed to fetch crops');
        const cropsData = await cropsResponse.json();
        if (Array.isArray(cropsData)) setCrops(cropsData);
      } catch (err) {
        console.error("Error fetching crops:", err);
      } finally {
        setLoadingCrops(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // No longer need to reset crop when region changes
    const { name, value } = e.target;
    setSearchData(prevData => ({ ...prevData, [name]: value }));
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Make async
    e.preventDefault()
    setLoading(true);
    setError(null);
    setPredictionResults(null); // Clear previous results

    const formData = new FormData();
    formData.append('region', searchData.location); // Map location to region
    if (searchData.crop) {
      formData.append('crop', searchData.crop);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/get_random_station', { // Use FULL backend URL
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // --- Map backend data (station, weather, soil) to PredictionResults --- 
      // This part is an interpretation based on the old index.html 
      // and the current PredictionResults structure. Adjust as needed.
      const mappedResults: PredictionResults = {
        // Keep some dummy/placeholder values for fields not directly provided
        yieldPrediction: data.station?.name ? `Data for ${data.station.name}` : 'N/A', 
        recommendedPlantingDate: data.weather?.date || 'N/A', 
        wateringSchedule: data.weather?.precipitation !== undefined ? `${data.weather.precipitation}mm precipitation` : 'N/A',
        pestRisks: data.crop ? [`Risk info for ${data.crop}`] : ['N/A'],
        fertilizer: 'Check soil data', 
        soilHealth: data.soil?.max_soil_temp !== undefined ? `Soil Temp: ${data.soil.max_soil_temp}°C` : 'N/A',
        
        // Optionally store raw data if needed for display
        stationName: data.station?.name,
        stationLocation: data.station?.location,
        weatherDate: data.weather?.date, 
        weatherTemp: data.weather?.avg_temp, 
        weatherPrecip: data.weather?.precipitation,
        soilDate: data.soil?.date,
        soilMaxTemp: data.soil?.max_soil_temp,
        soilMinTemp: data.soil?.min_soil_temp,
      };
      setPredictionResults(mappedResults);
      // --- End of mapping --- 

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Maximize Your Farm's Yield
        </h1>
        <p className="text-gray-600">
          Enter your farm details to get personalized predictions and
          recommendations
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location/Region
              </label>
              <select
                name="location"
                value={searchData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                required
                disabled={loadingRegions}
              >
                <option value="" disabled={!loadingRegions}>
                  {loadingRegions ? 'Loading regions...' : '-- Select a Region --'}
                </option>
                {!loadingRegions && regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Type
              </label>
              <select
                name="crop"
                value={searchData.crop}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                required
                disabled={loadingCrops}
              >
                <option value="" disabled>
                  {loadingCrops 
                    ? 'Loading crops...' 
                    : '-- Select Crop --'
                  }
                </option>
                {!loadingCrops && crops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition flex items-center justify-center gap-2"
          >
            <SearchIcon size={18} />
            Get Predictions
          </button>
        </form>
      </div>

      {/* Loading Indicator */} 
      {loading && (
        <div className="text-center py-4">
           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Error Message */} 
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {predictionResults && !loading && !error && ( // Display results only if not loading and no error
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            {/* Display station name if available */} 
            {predictionResults.stationName 
              ? `Data for ${predictionResults.stationName}` 
              : "Yield Predictions & Recommendations"
            }
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Yield Prediction / Status</h3>
              <div className="text-3xl font-bold text-green-700">
                {predictionResults.yieldPrediction}{/* Example */} 
                 {/* <span className="text-lg font-normal">bu/acre</span> */} 
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {/* Based on historical data and current conditions */}
                {predictionResults.stationLocation || 'Location details unavailable'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Planting Schedule</h3>
              <p>
                <strong>Recommended planting date:</strong>{' '}
                {predictionResults.recommendedPlantingDate}
              </p>
              <p>
                <strong>Watering schedule:</strong>{' '}
                {predictionResults.wateringSchedule}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Soil & Fertilizer</h3>
              <p>
                <strong>Soil health:</strong> {predictionResults.soilHealth}
              </p>
              <p>
                <strong>Recommended fertilizer:</strong>{' '}
                {predictionResults.fertilizer}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Pest & Disease Risks</h3>
              <ul className="list-disc list-inside">
                {predictionResults.pestRisks.map((risk: string, index: number) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg text-blue-800 mb-2">
              Recommendation Summary
            </h3>
            <p>
              Based on your inputs and our prediction models, we recommend
              focusing on proper irrigation timing and monitoring for{' '}
              {predictionResults.pestRisks.join(' and ')}. Apply the suggested
              fertilizer in early spring for optimal results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
