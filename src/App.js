import React, { useState } from "react";

const OPTIONS = {
state_postal: ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"],
BA_climate: ["Cold", "Hot-Dry", "Hot-Humid", "Marine", "Mixed-Dry", "Mixed-Humid", "Subarctic", "Very-Cold"],
IECC_climate_code: ["1A", "2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "6A", "6B", "7A", "7AK", "7B", "8AK"],
TYPEHUQ: ["1 - Mobile Home", "2 - Single-Family Detached", "3 - Single-Family Attached", "4 - Apartment (2-4 units)", "5 - Apartment (5+ units)"],
YEARMADERANGE: [
    "1 - Before 1950", "2 - 1950-1959", "3 - 1960-1969", "4 - 1970-1979", "5 - 1980-1989",
    "6 - 1990-1999", "7 - 2000-2009", "8 - 2010-2015", "9 - 2016 or later"
],
FUELHEAT: [
    "1 - Electricity", "2 - Natural Gas", "3 - Fuel Oil", "5 - Wood", "7 - Other", "99 - Not reported"
],
WALLTYPE: [
    "1 - Brick", "2 - Stucco", "3 - Siding/Wood", "4 - Vinyl", "5 - Concrete Block", "6 - Stone", "7 - Other", "99 - Not reported"
],
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
    <label className="block text-sm font-medium capitalize mb-1">{label}</label>
    <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1 text-sm"
    >
        {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
    </div>
);

const numberField = (label, name) => (
    <div>
    <label className="block text-sm font-medium capitalize mb-1">{label}</label>
    <input
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1 text-sm"
    />
    </div>
);

return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8 space-y-6">
    <h1 className="text-2xl font-bold text-center mb-6">Energy Cost Predictor</h1>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectField("State", "state_postal", OPTIONS.state_postal)}
        {selectField("Climate Zone", "BA_climate", OPTIONS.BA_climate)}
        {selectField("IECC Code", "IECC_climate_code", OPTIONS.IECC_climate_code)}
        {selectField("Home Type", "TYPEHUQ", OPTIONS.TYPEHUQ)}
        {selectField("Year Built", "YEARMADERANGE", OPTIONS.YEARMADERANGE)}
        {numberField("Bedrooms", "BEDROOMS")}
        {numberField("Full Baths", "NCOMBATH")}
        {numberField("Half Baths", "NHAFBATH")}
        {numberField("Other Rooms", "OTHROOMS")}
        {numberField("Total Rooms", "TOTROOMS")}
        {numberField("Square Footage", "TOTSQFT_EN")}
        {numberField("Stories", "STORIES")}
        {numberField("Household Members", "NHSLDMEM")}
        {selectField("Heating Fuel", "FUELHEAT", OPTIONS.FUELHEAT)}
        {numberField("Refrigerators", "NUMFRIG")}
        {numberField("Freezers", "NUMFREEZ")}
        {selectField("Wall Type", "WALLTYPE", OPTIONS.WALLTYPE)}
        {selectField("Oven", "OVEN", OPTIONS.OVEN)}
        <button
        type="submit"
        className="md:col-span-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
        Predict
        </button>
    </form>

    {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md shadow-sm">
        <p className="text-lg font-semibold">Predicted Annual kWh: {result.predicted_kwh}</p>
        <p className="text-lg font-semibold">Estimated Cost ($): {result.estimated_cost_usd}</p>
        <p className="text-sm text-gray-600">Rate Used: ${result.rate_used} per kWh</p>
        </div>
    )}
    </div>
);
}
