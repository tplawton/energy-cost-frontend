import React, { useState } from "react";
import OPTIONS from "./options";

const steps = [
{
    key: "state_postal",
    label: "Which U.S. state is the home in?",
    description: "This determines the local electricity rate.",
    type: "select",
    options: OPTIONS.state_postal,
},
{
    key: "BA_climate",
    label: "What is the building's climate zone?",
    description: "Select the regional climate that applies to your home.",
    type: "select",
    options: OPTIONS.BA_climate,
},
{
    key: "IECC_climate_code",
    label: "IECC Climate Code",
    description: "Used for regional energy modeling.",
    type: "select",
    options: OPTIONS.IECC_climate_code,
},
{
    key: "TYPEHUQ",
    label: "Home Type",
    description: "Choose the structure type of the building.",
    type: "select",
    options: OPTIONS.TYPEHUQ,
},
{
    key: "YEARMADERANGE",
    label: "Year Built",
    description: "When was this home built?",
    type: "select",
    options: OPTIONS.YEARMADERANGE,
},
{
    key: "TOTSQFT_EN",
    label: "Square Footage",
    description: "Total square footage of the home.",
    type: "number",
},
{
    key: "STORIES",
    label: "Number of Stories",
    description: "How many stories (floors) does the home have?",
    type: "number",
},
{
    key: "WALLTYPE",
    label: "Wall Type",
    description: "Select the predominant exterior wall material.",
    type: "select",
    options: OPTIONS.WALLTYPE,
},
{
    key: "BEDROOMS",
    label: "Number of Bedrooms",
    description: "How many bedrooms are in the home?",
    type: "number",
},
{
    key: "NCOMBATH",
    label: "Full Bathrooms",
    description: "How many full bathrooms are there?",
    type: "number",
},
{
    key: "NHAFBATH",
    label: "Half Bathrooms",
    description: "How many half bathrooms are there?",
    type: "number",
},
{
    key: "OTHROOMS",
    label: "Other Rooms",
    description: "Count of rooms that are not bedrooms or bathrooms.",
    type: "number",
},
{
    key: "NHSLDMEM",
    label: "Household Members",
    description: "Number of people currently living in the home.",
    type: "number",
},
{
    key: "FUELHEAT",
    label: "Heating Fuel",
    description: "What is the main heating fuel used?",
    type: "select",
    options: OPTIONS.FUELHEAT,
},
{
    key: "NUMFRIG",
    label: "Refrigerators",
    description: "How many refrigerators are in the home?",
    type: "number",
},
{
    key: "NUMFREEZ",
    label: "Freezers",
    description: "How many standalone freezers are there?",
    type: "number",
},
{
    key: "OVEN",
    label: "Oven Type",
    description: "What kind of oven does the home use?",
    type: "select",
    options: OPTIONS.OVEN,
},
];

export default function EnergyStepForm() {
const [formData, setFormData] = useState({});
const [step, setStep] = useState(0);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const current = steps[step];

const handleChange = (e) => {
    setFormData({ ...formData, [current.key]: e.target.value });
};

const handleNext = () => {
    if (step < steps.length - 1) setStep((prev) => prev + 1);
    else handleSubmit();
};

const handleSubmit = async () => {
    setLoading(true);
    const totals = Number(formData.BEDROOMS || 0) + Number(formData.NCOMBATH || 0) + Number(formData.OTHROOMS || 0);
    const fullData = { ...formData, TOTROOMS: totals };
    const res = await fetch("https://energy-cost-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fullData),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
};

return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 px-6 py-16 flex flex-col justify-center items-center text-center">
    {!result ? (
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl transition-all duration-500">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{current.label}</h1>
        <p className="text-sm text-gray-500 mb-6">{current.description}</p>

        {current.type === "select" ? (
            <select
            value={formData[current.key] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"
            >
            <option value="" disabled>Choose one</option>
            {current.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
            </select>
        ) : (
            <input
            type="number"
            value={formData[current.key] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"
            />
        )}

        <button
            onClick={handleNext}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            disabled={!formData[current.key]}
        >
            {step === steps.length - 1 ? "Submit" : "Next →"}
        </button>

        {loading && <p className="mt-4 text-blue-600 animate-pulse">⏳ Predicting...</p>}
        </div>
    ) : (
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Prediction Results</h2>
        <p className="text-lg">Predicted Annual kWh: <strong>{result.predicted_kwh}</strong></p>
        <p className="text-lg">Estimated Cost: <strong>${result.estimated_cost_usd}</strong></p>
        <p className="text-sm text-gray-600 mt-2">Rate Used: ${result.rate_used}/kWh</p>
        </div>
    )}
    </div>
);
}
