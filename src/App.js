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
    <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">{label}</label>
    <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="rounded-xl border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
    >
        {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
    </div>
);

const numberField = (label, name) => (
    <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">{label}</label>
    <input
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="rounded-xl border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
    />
    </div>
);

return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-200 p-10 font-sans">
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-6">🔌 Energy Cost Predictor</h1>
        <p className="text-center text-gray-600 mb-12">Estimate your annual electricity usage and cost based on your home's characteristics.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className="text-right text-sm text-gray-500">
            Total Rooms: <strong>{formData.TOTROOMS}</strong>
        </div>

        <div className="text-center">
            <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition duration-300"
            >
            🔍 Predict
            </button>
        </div>
        </form>

        {result && (
        <div className="mt-12 bg-green-50 border border-green-300 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Prediction Results</h2>
            <p className="text-lg">Predicted Annual kWh: <strong>{result.predicted_kwh}</strong></p>
            <p className="text-lg">Estimated Cost ($): <strong>{result.estimated_cost_usd}</strong></p>
            <p className="text-sm text-gray-600">Rate Used: ${result.rate_used} per kWh</p>
        </div>
        )}
    </div>
    </div>
);
}
