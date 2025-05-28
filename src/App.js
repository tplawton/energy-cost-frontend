import React, { useState, useEffect } from "react";

const OPTIONS = {
state_postal: ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"],
BA_climate: ["Cold", "Hot-Dry", "Hot-Humid", "Marine", "Mixed-Dry", "Mixed-Humid", "Subarctic", "Very-Cold"],
IECC_climate_code: ["1A", "2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "6A", "6B", "7A", "7AK", "7B", "8AK"],
TYPEHUQ: ["1 - Mobile Home", "2 - Single-Family Detached", "3 - Single-Family Attached", "4 - Apartment (2-4 units)", "5 - Apartment (5+ units)"],
YEARMADERANGE: ["1 - Before 1950", "2 - 1950-1959", "3 - 1960-1969", "4 - 1970-1979", "5 - 1980-1989", "6 - 1990-1999", "7 - 2000-2009", "8 - 2010-2015", "9 - 2016 or later"],
FUELHEAT: ["1 - Electricity", "2 - Natural Gas", "3 - Fuel Oil", "5 - Wood", "7 - Other", "99 - Not reported"],
WALLTYPE: ["1 - Brick", "2 - Stucco", "3 - Siding/Wood", "4 - Vinyl", "5 - Concrete Block", "6 - Stone", "7 - Other", "99 - Not reported"],
OVEN: ["0 - None", "1 - Electric", "2 - Gas", "3 - Other"]
};

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-800">🔌 Energy Cost Predictor</h1>
        <p className="text-center text-gray-600">Estimate your annual electricity cost based on your home's characteristics.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 p-4 rounded-xl">
            <legend className="text-lg font-semibold text-blue-700">Location & Climate</legend>
            {selectField("State", "state_postal", OPTIONS.state_postal)}
            {selectField("Climate Zone", "BA_climate", OPTIONS.BA_climate)}
            {selectField("IECC Code", "IECC_climate_code", OPTIONS.IECC_climate_code)}
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 p-4 rounded-xl">
            <legend className="text-lg font-semibold text-blue-700">Property Details</legend>
            {selectField("Home Type", "TYPEHUQ", OPTIONS.TYPEHUQ)}
            {selectField("Year Built", "YEARMADERANGE", OPTIONS.YEARMADERANGE)}
            {numberField("Square Footage", "TOTSQFT_EN")}
            {numberField("Stories", "STORIES")}
            {selectField("Wall Type", "WALLTYPE", OPTIONS.WALLTYPE)}
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 p-4 rounded-xl">
            <legend className="text-lg font-semibold text-blue-700">Household & Rooms</legend>
            {numberField("Bedrooms", "BEDROOMS")}
            {numberField("Full Baths", "NCOMBATH")}
            {numberField("Half Baths", "NHAFBATH")}
            {numberField("Other Rooms", "OTHROOMS")}
            <div className="md:col-span-2 text-sm text-gray-600 font-medium">
            Total Rooms: <span className="font-semibold">{formData.TOTROOMS}</span>
            </div>
            {numberField("Household Members", "NHSLDMEM")}
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 p-4 rounded-xl">
            <legend className="text-lg font-semibold text-blue-700">Appliances</legend>
            {selectField("Heating Fuel", "FUELHEAT", OPTIONS.FUELHEAT)}
            {numberField("Refrigerators", "NUMFRIG")}
            {numberField("Freezers", "NUMFREEZ")}
            {selectField("Oven", "OVEN", OPTIONS.OVEN)}
        </fieldset>

        <div className="text-center">
            <button
            type="submit"
            className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
            🔍 Predict
            </button>
        </div>
        </form>

        {result && (
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
