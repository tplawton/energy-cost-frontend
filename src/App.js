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
    const res = await fetch("https://energy-cost-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data);
};

const selectField = (label, name, options) => (
    <div className="transition-all duration-300">
    <label className="block text-sm font-medium capitalize mb-1 text-white">{label}</label>
    <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
        {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
    </div>
);

const numberField = (label, name) => (
    <div className="transition-all duration-300">
    <label className="block text-sm font-medium capitalize mb-1 text-white">{label}</label>
    <input
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
    </div>
);

return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 to-gray-800 text-white py-12 px-6 flex justify-center items-center">
    <div className="max-w-5xl w-full bg-gray-950 rounded-3xl shadow-2xl p-10 space-y-10">
        <h1 className="text-5xl font-extrabold text-center text-blue-400 drop-shadow-lg">Energy Cost Predictor</h1>
        <p className="text-center text-gray-400">Estimate your annual electricity cost based on your home's characteristics.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-700 p-6 rounded-xl">
            <legend className="text-lg font-semibold text-blue-300">Location & Climate</legend>
            {selectField("State", "state_postal", OPTIONS.state_postal)}
            {selectField("Climate Zone", "BA_climate", OPTIONS.BA_climate)}
            {selectField("IECC Code", "IECC_climate_code", OPTIONS.IECC_climate_code)}
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-700 p-6 rounded-xl">
            <legend className="text-lg font-semibold text-blue-300">Property Details</legend>
            {selectField("Home Type", "TYPEHUQ", OPTIONS.TYPEHUQ)}
            {selectField("Year Built", "YEARMADERANGE", OPTIONS.YEARMADERANGE)}
            {numberField("Square Footage", "TOTSQFT_EN")}
            {numberField("Stories", "STORIES")}
            {selectField("Wall Type", "WALLTYPE", OPTIONS.WALLTYPE)}
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-700 p-6 rounded-xl">
            <legend className="text-lg font-semibold text-blue-300">Household & Rooms</legend>
            {numberField("Bedrooms", "BEDROOMS")}
            {numberField("Full Baths", "NCOMBATH")}
            {numberField("Half Baths", "NHAFBATH")}
            {numberField("Other Rooms", "OTHROOMS")}
            <div className="md:col-span-2 text-sm text-gray-400 font-medium">
            Total Rooms: <span className="font-semibold text-white">{formData.TOTROOMS}</span>
            </div>
            {numberField("Household Members", "NHSLDMEM")}
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-700 p-6 rounded-xl">
            <legend className="text-lg font-semibold text-blue-300">Appliances</legend>
            {selectField("Heating Fuel", "FUELHEAT", OPTIONS.FUELHEAT)}
            {numberField("Refrigerators", "NUMFRIG")}
            {numberField("Freezers", "NUMFREEZ")}
            {selectField("Oven", "OVEN", OPTIONS.OVEN)}
        </fieldset>

        <div className="text-center">
            <button
            type="submit"
            className="mt-6 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
            >
            🔍 Predict
            </button>
        </div>
        </form>

        {result && (
        <div className="mt-12 p-8 bg-green-100 bg-opacity-5 border border-green-300 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-3 text-green-300">Prediction Results</h2>
            <p className="text-lg font-medium">Predicted Annual kWh: <span className="font-bold text-white">{result.predicted_kwh}</span></p>
            <p className="text-lg font-medium">Estimated Cost ($): <span className="font-bold text-white">{result.estimated_cost_usd}</span></p>
            <p className="text-sm text-gray-400">Rate Used: ${result.rate_used} per kWh</p>
        </div>
        )}
    </div>
    </div>
);
}
