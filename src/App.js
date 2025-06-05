import React, { useState } from "react";
import OPTIONS from "./options";
import "./App.css";

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
    <div className="page-container dark-theme">
    <header className="header">
        <h1>Electricity Bill Estimator</h1>
        <p>Answer a few questions about your home to estimate your annual electricity usage and cost.</p>
    </header>
    <main className="main-content">
        {!result ? (
        <div className="question-card animate-in">
            <div className="progress-wrapper">
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <div className="progress-text">
                    Step {step + 1} of {steps.length}
                </div>
            </div>

            <h2>{current.label}</h2>
            <p className="description">{current.description}</p>

            {current.type === "select" ? (
            <select
                value={formData[current.key] || ""}
                onChange={handleChange}
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
            />
            )}

            <div className="button-group">
            <button onClick={handleBack} disabled={step === 0}>⬅ Back</button>
            <button onClick={handleRestart}>⏮ Start Over</button>
            <button onClick={handleNext} disabled={!formData[current.key]}>{step === steps.length - 1 ? "Submit" : "Next →"}</button>
            </div>

            {loading && <p className="loading">⏳ Predicting...</p>}
        </div>
        ) : (
        <div className="result-card animate-in">
            <h2>Prediction Results</h2>
            <p><strong>Predicted Annual kWh:</strong> {result.predicted_kwh}</p>
            <p><strong>Estimated Cost:</strong> ${result.estimated_cost_usd}</p>
            <p className="rate-note">Rate Used: ${result.rate_used}/kWh</p>
            <button onClick={handleRestart}>🔁 Start New Prediction</button>
        </div>
        )}
    </main>

    <footer className="footer">
        <a href="https://tplawton.github.io/website/" target="_blank" rel="noopener noreferrer">
        Built by Thomas Lawton
        </a>
    </footer>
    </div>
);
}