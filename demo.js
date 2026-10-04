const instances = {
  "2018": {
    title: "Summer 2018 — NE Atlantic / Connemara",
    blurb: "Strong regional warming. Local bloom pressure present (not a silent heatwave).",
    metrics: [
      ["MHW intensity (local)", "strong / extreme days present"],
      ["Dinophysis (local)", "above quiet baseline in places"],
      ["Closures", "local pressure, not a national story week"]
    ],
    note: "Use as the 'warm + some bloom' contrast to 2023."
  },
  "2023": {
    title: "June 2023 — Irish shelf flagship",
    blurb: "Severe shelf MHW. National Dinophysis / closures stayed below climatology.",
    metrics: [
      ["MHW", "severe, longest modern Irish-shelf event"],
      ["Dinophysis national 2023", "well below 2014–22 summer mean"],
      ["MI closures 2023", "DSP ~7k tonnes — below the 2014–22 mean"]
    ],
    note: "Headline honesty slide: heatwave ≠ automatic bloom."
  },
  "2022": {
    title: "2022 — Galway / Connemara contrast",
    blurb: "Local Connemara/Galway context for bay-scale replication into Cork.",
    metrics: [
      ["Focus", "Galway / Connemara growers + Mace Head / Lehanagh"],
      ["Ask", "Can the same briefing pack be retargeted to Cork sites?"],
      ["Data", "BIM / MI closure + MI HAB + OISST + Met Éireann narrative"]
    ],
    note: "Pitch C: Galway deep-dive, then Cork replication path."
  }
};

function render(key) {
  const el = document.getElementById("panel");
  const d = instances[key];
  el.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">${d.title}</h2>
      <p>${d.blurb}</p>
      <div class="metrics">
        ${d.metrics.map(([k,v]) => `<div class="metric"><span>${k}</span><b>${v}</b></div>`).join("")}
      </div>
      <p style="color:var(--muted)">${d.note}</p>
    </div>`;
  document.querySelectorAll(".tabs button").forEach(b => {
    b.classList.toggle("active", b.dataset.key === key);
  });
}

document.querySelectorAll(".tabs button").forEach(b => {
  b.addEventListener("click", () => render(b.dataset.key));
});
render("2023");
