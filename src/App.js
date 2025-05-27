import React, { useState } from "react";

export default function EnergyPredictor() {
const [formData, setFormData] = useState({
    state_postal: "MA",
    BA_climate: "Mixed-Humid",
    IECC_climate_code: "4A",
    TYPEHUQ: "Single-Family Detached",
    YEARMADERANGE: "2000 to 2009",
    BEDROOMS: 3,
    NCOMBATH: 2,
    NHAFBATH: 1,
    OTHROOMS: 3,
    TOTROOMS: 8,
    TOTSQFT_EN: 1800,
    STORIES: 2,
    NHSLDMEM: 4,
    FUELHEAT: "Electric",
    NUMFRIG: 1,
    NUMFREEZ: 1,
    WALLTYPE: "Brick",
    OVEN: "Yes"
});

const [result, setResult] = useState(null);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://energy-cost-backend.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data);
};

return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow-md">
    <h1 className="text-xl font-bold mb-4">Energy Cost Predictor</h1>
    <form onSubmit={handleSubmit} className="space-y-2">
        {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
            <label className="block text-sm font-medium capitalize">{key}</label>
            <input
            name={key}
            value={value}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            />
        </div>
        ))}
        <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
        Predict
        </button>
    </form>
    {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
        <p><strong>Predicted Annual kWh:</strong> {result.predicted_kwh}</p>
        <p><strong>Estimated Cost ($):</strong> {result.estimated_cost_usd}</p>
        <p><strong>Rate Used:</strong> ${result.rate_used} per kWh</p>
        </div>
    )}
    </div>
);
}
