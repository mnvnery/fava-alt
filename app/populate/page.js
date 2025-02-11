"use client";

import { useState } from "react";

export default function FetchRecommendations() {
  const [status, setStatus] = useState("Idle");
  const [selectedPair, setSelectedPair] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // List of gene-drug pairs
  const geneDrugPairs = [
    { gene: "CYP2B6", drug: "efavirenz", class: "Antiviral", ti: "Infectious disease" },
    { gene: "CYP2C19", drug: "amitriptyline", class: "Tricyclic Antidepressant", ti: "Mental health" },
    { gene: "CYP2C19", drug: "citalopram", class: "Selective Serotonin Reuptake Inhibitor (SSRI) antidepressant", ti: "Mental health" },
    { gene: "CYP2C19", drug: "clopidogrel", class: "Antiplatelet", ti: "Heart and blood vessel health" },
    { gene: "CYP2C19", drug: "escitalopram", class: "Selective Serotonin Reuptake Inhibitor (SSRI) antidepressant", ti: "Mental health" },
    { gene: "CYP2C19", drug: "lansoprazole", class: "Proton Pump Inhibitor (PPI)", ti: "Heartburn" },
    { gene: "CYP2C19", drug: "omeprazole", class: "Proton Pump Inhibitor (PPI)", ti: "Heartburn" },
    { gene: "CYP2C19", drug: "pantoprazole", class: "Proton Pump Inhibitor (PPI)", ti: "Heartburn" },
    { gene: "CYP2C19", drug: "sertraline", class: "Selective Serotonin Reuptake Inhibitor (SSRI) antidepressant", ti: "Mental health" },
    { gene: "CYP2C19", drug: "voriconazole", class: "Antifungal", ti: "Infectious disease" },
    { gene: "CYP2C9", drug: "celecoxib", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "flurbiprofen", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "fluvastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "CYP2C9", drug: "fosphenytoin", class: "Anticonvulsant", ti: "Neurology" },
    { gene: "CYP2C9", drug: "ibuprofen", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "lornoxicam", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "meloxicam", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "phenytoin", class: "Anticonvulsant", ti: "Neurology" },
    { gene: "CYP2C9", drug: "piroxicam", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "siponimod", class: null, ti: null },
    { gene: "CYP2C9", drug: "tenoxicam", class: "Non-Steroidal Anti-Inflammatory Drug (NSAID)", ti: "Pain relief" },
    { gene: "CYP2C9", drug: "warfarin", class: "Anticoagulant", ti: "Heart and blood vessel health" },
    { gene: "CYP2D6", drug: "amitriptyline", class: "Tricyclic Antidepressant", ti: "Mental health" },
    { gene: "CYP2D6", drug: "atomoxetine", class: "Selective Norepinephrine Reuptake Inhibitor (SNRI)", ti: "Mental health" },
    { gene: "CYP2D6", drug: "codeine", class: "Opioid", ti: "Pain relief" },
    { gene: "CYP2D6", drug: "nortriptyline", class: "Tricyclic Antidepressant", ti: "Mental health" },
    { gene: "CYP2D6", drug: "ondansetron", class: "Antiemetic", ti: "Nausea and vomiting" },
    { gene: "CYP2D6", drug: "paroxetine", class: "Selective Serotonin Reuptake Inhibitor (SSRI) antidepressant", ti: "Mental health" },
    { gene: "CYP2D6", drug: "pitolisant", class: "H3 Blocker", ti: "Neurology" },
    { gene: "CYP2D6", drug: "tamoxifen", class: "Antiestrogen", ti: "Cancer treatment" },
    { gene: "CYP2D6", drug: "tramadol", class: "Opioid", ti: "Pain relief" },
    { gene: "CYP2D6", drug: "tropisetron", class: "Antiemetic", ti: "Nausea and vomiting" },
    { gene: "CYP2D6", drug: "vortioxetine", class: "Selective Serotonin Reuptake Inhibitor (SSRI) antidepressant", ti: "Mental health" },
    { gene: "CYP3A5", drug: "tacrolimus", class: "Immunosuppressant", ti: "Transplant medicine" },
    { gene: "SLCO1B1", drug: "atorvastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "SLCO1B1", drug: "fluvastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "SLCO1B1", drug: "lovastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "SLCO1B1", drug: "pitavastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "SLCO1B1", drug: "pravastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "SLCO1B1", drug: "rosuvastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "SLCO1B1", drug: "simvastatin", class: "Statin", ti: "Heart and blood vessel health" },
    { gene: "VKORC1", drug: "warfarin", class: "Anticoagulant", ti: "Heart and blood vessel health" }
];


  async function fetchDrugId(drug) {
    const response = await fetch(
      `https://api.cpicpgx.org/v1/drug?name=eq.${encodeURIComponent(drug)}`
    );
    if (!response.ok) throw new Error(`Error fetching drugId for ${drug}`);
    const data = await response.json();
    if (data.length === 0) throw new Error(`No drugId found for ${drug}`);
    return data[0].drugid;
  }

  function deduplicateLookupKeys(lookupKeys) {
    // console.log(lookupKeys)
    const uniquePhenotypes = new Set();
    return lookupKeys.filter(({ phenotype }) => {
      if (uniquePhenotypes.has(phenotype)) return false;
      uniquePhenotypes.add(phenotype);
      return true;
    });
  }

  async function fetchLookupKeys(gene) {
    const response = await fetch(
      `https://api.cpicpgx.org/v1/diplotype?genesymbol=eq.${gene}&select=lookupkey,generesult`
    );
    if (!response.ok) throw new Error(`Error fetching lookupKeys for ${gene}`);
    const data = await response.json();
    if (data.length === 0) throw new Error(`No lookupKeys found for ${gene}`);
    return deduplicateLookupKeys(
      data.map((item) => ({ phenotype: item.generesult, lookupKey: item.lookupkey }))
    );
  }

  async function fetchRecommendations(drugId, lookupKey) {
    const lookupKeyJSON = encodeURIComponent(JSON.stringify(lookupKey));
    const response = await fetch(
      `https://api.cpicpgx.org/v1/recommendation?select=drug(name),guideline(name),implications,drugrecommendation,classification,comments,phenotypes,lookupkey&drugid=eq.${drugId}&lookupkey=cs.${lookupKeyJSON}`
    );
    if (!response.ok) throw new Error("Error fetching recommendations");
    return response.json();
  }

  async function fetchAndDisplayResults() {
    if (!selectedPair) return;
    setStatus("Fetching...");
    try {
      const { gene, drug } = selectedPair;
      const drugId = await fetchDrugId(drug);
      const lookupKeys = await fetchLookupKeys(gene);
      let allRecommendations = [];
      for (const { phenotype, lookupKey } of lookupKeys) {
        const recs = await fetchRecommendations(drugId, lookupKey);
        console.log(
        `Recommendations for ${gene} - ${drug} - ${phenotype}:`,
        recs
        );
        allRecommendations.push(...recs.map(rec => ({ ...rec, phenotype, lookupKey })));
      }
      //console.log(Object.keys(recommendations[0].phenotypes))
      setRecommendations(allRecommendations);
      setStatus("Completed");
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error");
    }
  }

  return (
    <main className="flex flex-col justify-center items-center h-full mt-20">
      <select onChange={(e) => setSelectedPair(JSON.parse(e.target.value))} className="border border-black rounded-full px-2 py-1">
        <option value="">Select a Gene-Drug Pair</option>
        {geneDrugPairs.map((pair, index) => (
          <option key={index} value={JSON.stringify(pair)}>
            {pair.gene} - {pair.drug}
          </option>
        ))}
      </select>
      <button onClick={fetchAndDisplayResults} className="my-5 bg-black text-white rounded-full px-4 py-1">Fetch Recommendations</button>
      {status === "Feching..." && <div>{status}</div>}
      {recommendations.length > 0 && (
        <div className="h-full w-full py-4">
            <div className="grid grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_1.5fr_1.5fr_1.5fr]">
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Drug</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">T.Indication</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Medicine Class</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Gene Symbol</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Phenotype</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Recommendation</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Comments</div>
                <div className="text-xs bg-black text-white border-y-2 border-x border-slate-800 p-1.5">Implications</div>
            </div>
            <div>
              {recommendations.map((rec, index) => (
                <div key={index} className="grid grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_1.5fr_1.5fr_1.5fr]">
                  <div className="text-sm border border-slate-200 p-1.5">{rec.drug?.name || "n/a"}</div>
                  <div className="text-sm border border-slate-200 p-1.5">{selectedPair.ti}</div>
                  <div className="text-sm border border-slate-200 p-1.5">{selectedPair.class}</div>
                  <div className="text-sm border border-slate-200 p-1.5">{Object.keys(rec.phenotypes).join(", ")}</div> 
                  <div className="text-sm border border-slate-200 p-1.5">{Object.values(rec.phenotypes).join(", ")}</div>
                  <div className="text-sm border border-slate-200 p-1.5">{rec.drugrecommendation || "n/a"}</div>
                  <div className="text-sm border border-slate-200 p-1.5">{rec.comments || "n/a"}</div>
                  <div className="text-sm border border-slate-200 p-1.5">{Object.values(rec.implications).join(", ") || "n/a"}</div>
                </div>
              ))}
            </div>
        </div>
      )}
    </main>
  );
}
