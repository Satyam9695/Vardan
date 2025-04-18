
import React, { useState, useEffect } from "react";

const App = () => {
  const [progress, setProgress] = useState(3);
  const [scannedItem, setScannedItem] = useState("");
  const [parks, setParks] = useState([]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [steps, setSteps] = useState("");
  const [sleep, setSleep] = useState("");
  const [food, setFood] = useState("");

  const goalsList = [
    "Recycle 5 plastic items",
    "Use a reusable bottle",
    "Try a plant-based meal",
    "Avoid food waste"
  ];

  const handleScan = () => {
    setScannedItem("Plastic Bottle - Recycle (Rinse and remove cap)");
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h);
      setBmi(bmiValue);

      if (bmiValue < 18.5) {
        setSteps("8k–10k steps");
        setSleep("8–9 hrs");
        setFood("High-protein plant meals (lentils, nuts, tofu)");
      } else if (bmiValue < 25) {
        setSteps("10k–12k steps");
        setSleep("7–8 hrs");
        setFood("Balanced plant-rich diet with whole grains and veggies");
      } else {
        setSteps("12k+ steps");
        setSleep("6.5–7.5 hrs");
        setFood("Low-carb, high-fiber meals with greens and fruits");
      }
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=park&key=${apiKey}`
          );
          const data = await response.json();
          setParks(data.results?.slice(0, 3) || []);
        } catch (err) {
          console.error("Failed to fetch parks", err);
        }
      });
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Vardan - Your Eco Lifestyle Assistant</h1>

      <section>
        <h2>Weekly Goal</h2>
        <p>{goalsList[0]}</p>
        <progress value={progress} max="5"></progress>
        <p>{progress}/5 items recycled</p>
      </section>

      <section>
        <h2>Scan to Sort</h2>
        <button onClick={handleScan}>Scan Item</button>
        {scannedItem && <p>{scannedItem}</p>}
      </section>

      <section>
        <h2>Suggestions</h2>
        <ul>
          <li>Unplug electronics</li>
          <li>Walk or cycle short distances</li>
          <li>Compost your food scraps</li>
        </ul>
      </section>

      <section>
        <h2>Your Impact</h2>
        <p>12 items recycled</p>
        <p>3.8 kg waste diverted</p>
        <p>4.2 kg CO₂ emissions saved</p>
      </section>

      <section>
        <h2>Nearest Green Parks</h2>
        {parks.length > 0 ? (
          <ul>
            {parks.map((park, index) => (
              <li key={index}>
                {park.name} -{" "}
                <a
                  href={`https://maps.google.com/?q=${park.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Fetching nearby parks...</p>
        )}
      </section>

      <section>
        <h2>Wellness & Sustainability</h2>
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button onClick={calculateBMI}>Get Suggestions</button>
        {bmi && (
          <div>
            <p>Your BMI: {bmi.toFixed(1)}</p>
            <ul>
              <li>Recommended steps: {steps}</li>
              <li>Sleep: {sleep}</li>
              <li>Food: {food}</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
