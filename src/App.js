import React, { useState } from "react";
import OPTIONS from "./options";

const climateMap = {
"1A": "Hot-Humid",
"2A": "Hot-Humid",
"2B": "Hot-Dry",
"3A": "Hot-Humid",
"3B": "Hot-Dry",
"3C": "Marine",
"4A": "Mixed-Humid",
"4B": "Mixed-Dry",
"4C": "Marine",
"5A": "Cold",
"5B": "Cold",
"6A": "Cold",
"6B": "Cold",
"7A": "Very-Cold",
"7AK": "Subarctic",
"7B": "Very-Cold",
"8AK": "Subarctic"
};

const steps = [
{
    key: "state_postal",
    label: "Which U.S. state is your home located in?",
    type: "select",
    options: OPTIONS.state_postal,
    description: "Your state helps us determine your local electricity rates."
},
{
    key: "IECC_climate_code",
    label: "What is your home's IECC climate code?",
    type: "select",
    options: OPTIONS.IECC_climate_code,
    description: (
    <span>
        Use this {" "}
        <a
        href="https://basc.pnnl.gov/building-assemblies/climate-zone-lookup"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
        >
        climate zone lookup tool
        </a>{" "}
        to find your code.
    </span>
    )
},
{
    key: "TYPEHUQ",
    label: "What type of housing unit do you live in?",
    type: "select",
    options: OPTIONS.TYPEHUQ,
    description: "Choose the category that best describes your home's structure."
},
{
    key: "YEARMADERANGE",
    label: "When was your home built?",
    type: "select",
    options: OPTIONS.YEARMADERANGE,
    description: "Homes built in different decades often have different insulation and efficiency levels."
},
{
    key: "TOTSQFT_EN",
    label: "What is the total square footage of your home?",
    type: "number",
    description: "Include finished basement and livable areas in this total."
},
{
    key: "STORIES",
    label: "How many stories (floors) does your home have?",
    type: "number",
    description: "For example, a single-floor ranch = 1, a two-story house = 2."
},
{
    key: "WALLTYPE",
    label: "What is the primary exterior wall type of your home?",
    type: "select",
    options: OPTIONS.WALLTYPE,
    description: "This impacts insulation and energy efficiency."
},
{
    key: "BEDROOMS",
    label: "How many bedrooms are in your home?",
    type: "number",
    description: "This helps us estimate total living space and energy demand."
},
{
    key: "NCOMBATH",
    label: "How many full bathrooms (with tub or shower) are there?",
    type: "number",
    description: "Each full bath typically increases overall water and energy use."
},
{
    key: "NHAFBATH",
    label: "How many half bathrooms (toilet only) are there?",
    type: "number",
    description: "Half bathrooms use less energy but still contribute to water use."
},
{
    key: "OTHROOMS",
    label: "How many other rooms (e.g., kitchen, living room, office)?",
    type: "number",
    description: "This helps complete our total room estimate."
},
{
    key: "NHSLDMEM",
    label: "How many people live in your home?",
    type: "number",
    description: "Household size impacts overall electricity usage."
},
{
    key: "FUELHEAT",
    label: "What type of fuel is used to heat your home?",
    type: "select",
    options: OPTIONS.FUELHEAT,
    description: "Homes that use electric heating generally consume more electricity."
},
{
    key: "NUMFRIG",
    label: "How many refrigerators do you use?",
    type: "number",
    description: "Refrigerators are always running and can significantly affect usage."
},
{
    key: "NUMFREEZ",
    label: "How many standalone freezers are there?",
    type: "number",
    description: "Standalone freezers often consume more power than fridges."
},
{
    key: "OVEN",
    label: "What type of oven do you use?",
    type: "select",
    options: OPTIONS.OVEN,
    description: "Electric ovens use more electricity than gas or other fuel types."
}
];

export default function EnergyStepForm() {
const [formData, setFormData] = useState({});
const [step, setStep] = useState(0);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const current = steps[step];

const handleChange = (e) => {
    const updatedValue = e.target.value;
    const newData = { ...formData, [current.key]: updatedValue };

    if (current.key === "IECC_climate_code") {
    newData.BA_climate = climateMap[updatedValue] || "";
    }
    setFormData(newData);
};

const handleNext = () => {
    if (step < steps.length - 1) setStep((prev) => prev + 1);
    else handleSubmit();
};

const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
};

const handleRestart = () => {
    setStep(0);
    setFormData({});
    setResult(null);
};

const handleSubmit = async () => {
    setLoading(true);
    const totals = Number(formData.BEDROOMS || 0) + Number(formData.NCOMBATH || 0) + Number(formData.OTHROOMS || 0);
    const fullData = { ...formData, TOTROOMS: totals };
    const res = await fetch("https://energy-cost-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fullData)
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
};

return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col justify-between items-center px-4 py-10 text-center">
    <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">🔋 Energy Cost Estimator</h1>
        <p className="text-md text-gray-600 max-w-xl">Answer a few questions about your home to estimate your annual electricity usage and cost.</p>
    </div>

    {!result ? (
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <div className="text-sm text-gray-500 mb-2">Step {step + 1} of {steps.length}</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{current.label}</h2>
        <div className="text-sm text-gray-500 mb-6">{current.description}</div>

        {current.type === "select" ? (
            <select
            value={formData[current.key] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring focus:ring-blue-200 mb-6"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring focus:ring-blue-200 mb-6"
            />
        )}

        <div className="flex justify-center gap-4">
            <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >⬅ Back</button>

            <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >⏮ Start Over</button>

            <button
            onClick={handleNext}
            disabled={!formData[current.key]}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >{step === steps.length - 1 ? "Submit" : "Next →"}</button>
        </div>

        {loading && <p className="mt-4 text-blue-600 animate-pulse">⏳ Predicting...</p>}
        </div>
    ) : (
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Prediction Results</h2>
        <p className="text-lg">Predicted Annual kWh: <strong>{result.predicted_kwh}</strong></p>
        <p className="text-lg">Estimated Cost: <strong>${result.estimated_cost_usd}</strong></p>
        <p className="text-sm text-gray-600 mt-2">Rate Used: ${result.rate_used}/kWh</p>
        <button
            onClick={handleRestart}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >🔁 Start New Prediction</button>
        </div>
    )}

    <footer className="w-full fixed bottom-0 left-0 py-4 bg-white shadow-inner text-center">
        <a
        href="https://tplawton.github.io/website/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
        Thomas Lawton
        </a>
    </footer>
    </div>
);
}
