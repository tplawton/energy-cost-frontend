import React, { useState, useEffect } from "react";
import OPTIONS from "./options";

export default function EnergyPredictor() {
const [formData, setFormData] = useState({
    state_postal: "MA",
    BA_climate: "Mixed-Humid",
    IECC_climate_code: "4A",
    TYPEHUQ: "2 - Single-Family Detached",
    YEARMADERANGE: "7 - 2000-2009",
    BEDROOMS: 2,
    NCOMBATH: 2,
    NHAFBATH: 1,
    OTHROOMS: 3,
    TOTROOMS: 8,
    TOTSQFT_EN: 1800,
    STORIES: 2,
    NHSLDMEM: 4,
    FUELHEAT: "1 - Electricity",
    NUMFRIG: 1,
    NUMFREEZ: 1,
    WALLTYPE: "1 - Brick",
    OVEN: "1 - Electric"
});

const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
    const { BEDROOMS, NCOMBATH, OTHROOMS } = formData;
    const totalRooms = Number(BEDROOMS || 0) + Number(NCOMBATH || 0) + Number(OTHROOMS || 0);
    setFormData((prev) => ({ ...prev, TOTROOMS: totalRooms }));
}, [formData.BEDROOMS, formData.NCOMBATH, formData.OTHROOMS]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("https://energy-cost-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
};

const selectField = (label, name, options) => (
    <div>
    <label className="block text-sm font-medium capitalize mb-1 text-gray-700">{label}</label>
    <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
        {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
    </div>
);

const numberField = (label, name) => (
    <div>
    <label className="block text-sm font-medium capitalize mb-1 text-gray-700">{label}</label>
    <input
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
    </div>
);

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 animate-fadeIn">
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-800">🔌 Energy Cost Predictor</h1>
        <p className="text-center text-gray-600">Estimate your annual electricity cost based on your home's characteristics.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectField("State", "state_postal", OPTIONS.state_postal)}
            {selectField("Climate Zone", "BA_climate", OPTIONS.BA_climate)}
            {selectField("IECC Code", "IECC_climate_code", OPTIONS.IECC_climate_code)}
            {selectField("Home Type", "TYPEHUQ", OPTIONS.TYPEHUQ)}
            {selectField("Year Built", "YEARMADERANGE", OPTIONS.YEARMADERANGE)}
            {numberField("Square Footage", "TOTSQFT_EN")}
            {numberField("Stories", "STORIES")}
            {selectField("Wall Type", "WALLTYPE", OPTIONS.WALLTYPE)}
            {numberField("Bedrooms", "BEDROOMS")}
            {numberField("Full Baths", "NCOMBATH")}
            {numberField("Half Baths", "NHAFBATH")}
            {numberField("Other Rooms", "OTHROOMS")}
            {numberField("Household Members", "NHSLDMEM")}
            {selectField("Heating Fuel", "FUELHEAT", OPTIONS.FUELHEAT)}
            {numberField("Refrigerators", "NUMFRIG")}
            {numberField("Freezers", "NUMFREEZ")}
            {selectField("Oven", "OVEN", OPTIONS.OVEN)}
        </div>

        <div className="text-center text-sm text-gray-600 font-medium">
            Total Rooms: <span className="font-semibold">{formData.TOTROOMS}</span>
        </div>

        <div className="text-center">
            <button
            type="submit"
            className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
            🔍 Predict
            </button>
        </div>
        </form>

        {loading && (
        <div className="text-center text-blue-700 font-medium text-lg animate-pulse">⏳ Predicting...</div>
        )}

        {result && !loading && (
        <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold mb-2 text-green-700">Prediction Results</h2>
            <p className="text-lg font-medium">Predicted Annual kWh: <span className="font-semibold">{result.predicted_kwh}</span></p>
            <p className="text-lg font-medium">Estimated Cost ($): <span className="font-semibold">{result.estimated_cost_usd}</span></p>
            <p className="text-sm text-gray-600">Rate Used: ${result.rate_used} per kWh</p>
        </div>
        )}
    </div>
    </div>
);
}
