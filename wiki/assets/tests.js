window.TESTS = [
{
"n": 1,
"date": "2026-09-01",
"test": "**Legacy STRONG_OISST baseline** (season + lat/lon + OISST lags; Irish HAB + MHW v1 pipeline)",
"result": "Test calibrated PR-AUC **0.295** (0.2953; n = 14,270, 5.2% prevalence) vs climatology 0.183",
"verdict": "history-only (easier target, superseded)",
"cat": "desc",
"theme": "Legacy baseline & inputs"
},
{
"n": 2,
"date": "2026-09-01",
"test": "Dinophysis feature screen incl. SST lags and MHW features",
"result": "MHW features: near-zero gain",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 3,
"date": "2026-09-01",
"test": "OSTIA vs OISST SST swap",
"result": "Full series 0.2345 vs 0.2933 (Δ −0.059; 8% of test rows had no OSTIA after 31 Mar 2026). Common window 0.2406 vs 0.2366 (+0.004)",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 4,
"date": "2026-09-01",
"test": "ERA5 wind (speed, along/cross-shore, rolls)",
"result": "Nowcast 0.2870 (Δ −0.0063); ahead-7 0.2178 (Δ −0.0132)",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 5,
"date": "2026-09-01",
"test": "CMEMS IBI pack: mixed-layer depth, light (rsntds/kd/zeu), SSS, currents, richer MHW",
"result": "MLD+light 0.195 vs 0.293 (Δ −0.098; null physics after the IBI product end). Coverage-matched 0.223 vs 0.235 (−0.013). MHW: rich top-3 −0.0015, full −0.0115",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 6,
"date": "2026-09-01",
"test": "DSP toxin and area-closure risk model",
"result": "Area closed: 0.315 vs climatology 0.208. DSP exceedance: 0.009 (about 19 test positives, not assessable)",
"verdict": "history-only",
"cat": "desc",
"theme": "Legacy baseline & inputs"
},
{
"n": 7,
"date": "2026-09-01",
"test": "June 2023 MHW case study",
"result": "Descriptive: a severe shelf MHW, yet Dinophysis and closures were below climatology",
"verdict": "history-only",
"cat": "desc",
"theme": "Legacy baseline & inputs"
},
{
"n": 8,
"date": "2026-09-01",
"test": "Rivers ingest (OPW river gauges)",
"result": "Ingest only; skill test in #10",
"verdict": "history-only",
"cat": "desc",
"theme": "Legacy baseline & inputs"
},
{
"n": 9,
"date": "2026-09-02",
"test": "NAO / EA / AMO indices",
"result": "NAO+EA 0.2905 (Δ −0.0048); AMO 0.2572 (−0.0381); all three 0.2711 (−0.0242)",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 10,
"date": "2026-09-02",
"test": "Climate drivers: river discharge, Met Éireann radiation, warming proxy",
"result": "River Q −0.0463; Met radiation −0.0420; Met+river −0.0549; warming −0.0012; all −0.0101. Galway gauges and point Met stations were applied nationally (unfair)",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 11,
"date": "2026-09-08",
"test": "CPR (MBA) plankton covariates per sea area",
"result": "0.2887 vs 0.2911 (Δ −0.0024); about 28% coverage; no Dinophysis taxa. MBA data are non-commercial",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 12,
"date": "2026-09-08",
"test": "Ocean-colour Chl gate + OSI SAF SST",
"result": "STRONG+CHL −0.008; STRONG+CHL+OSI −0.005; STRONG+OSI 0.2662 (−0.029, about 11% train coverage)",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 13,
"date": "2026-09-08",
"test": "ODYSSEA SST provider swap",
"result": "0.2217 vs 0.2953 (Δ −0.074). Hard block: 11.3% train coverage (product starts 2018)",
"verdict": "no lift (unfair test)",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 14,
"date": "2026-09-08",
"test": "Full-history Chl (GlobColour L4 gap-free 1 km, 1997–2026)",
"result": "STRONG+CHL 0.2809 vs 0.2953 (Δ −0.0144); Apr–Sep −0.0038",
"verdict": "no lift",
"cat": "null",
"theme": "Legacy baseline & inputs"
},
{
"n": 15,
"date": "2026-09-08",
"test": "Cork weekend lock (decision)",
"result": "STRONG_OISST kept as the spine; Chl/ODYSSEA/OSI predictive work parked",
"verdict": "history-only",
"cat": "desc",
"theme": "Legacy baseline & inputs"
},
{
"n": 16,
"date": "2026-10-03",
"test": "**Copernicus IBI back-trajectory (\"water origin\")**",
"result": "BT_ALL 0.281 vs 0.295 (Δ −0.015, CI −0.031 to +0.002); 0 of 10 seeds better. Stations moved a median 5.1 km to wet cells",
"verdict": "no lift",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 17,
"date": "2026-10-03",
"test": "Quick test: station persistence + neighbour counts (leak-free, locked protocol)",
"result": "Season+lat/lon+persistence (no SST) 0.361 (Δ +0.066, CI +0.024 to +0.104) vs STRONG 0.295; STRONG+persistence 0.363",
"verdict": "adopted (led to #19)",
"cat": "pos",
"theme": "Persistence model & v2"
},
{
"n": 18,
"date": "2026-10-03",
"test": "**Five-improvements review** (+ Mesodinium exploratory)",
"result": "Station × week 0.284 vs STRONG 0.295 (skill 0.015, CI −0.019 to +0.037). OISST: 125/207 stations had no pixel. Mesodinium Δ −0.003 (−0.012 to +0.007)",
"verdict": "history-only (review); Mesodinium no lift",
"cat": "desc",
"theme": "Persistence model & v2"
},
{
"n": 19,
"date": "2026-10-03",
"test": "**Persistence-core v1** (rolling origin, Sunday issue, weeks +1/+2)",
"result": "2022–26: **0.287** [0.224–0.354] vs station × week **0.224**; operational (week 0 known) 0.357",
"verdict": "adopted (label superseded by v2)",
"cat": "pos",
"theme": "Persistence model & v2"
},
{
"n": 20,
"date": "2026-10-04",
"test": "Model v2 stage A: up-coast propagation + wind exchange",
"result": "Upstream +0.001 (−0.014 to +0.021) in 2022–26 but +0.032 in 2016–21. Wind −0.024 (−0.037 to −0.015)",
"verdict": "no lift",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 21,
"date": "2026-10-04",
"test": "Model v2 stage C: repaired SST (nearest-ocean OSTIA + ODYSSEA) + causal MHW",
"result": "SST −0.002 (−0.020 to +0.017). SST+MHW −0.018 (−0.043 to +0.003); operational −0.029",
"verdict": "no lift",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 22,
"date": "2026-10-04",
"test": "**Model v2 stage B: target choice → v2 headline**",
"result": "T2 summed ≥100: **0.290** [0.235–0.350] vs station × week **0.231** (gain CI +0.020 to +0.095); operational 0.353. T5 *D. acuta* 0.101 vs 0.054",
"verdict": "**adopted (headline)**",
"cat": "pos",
"theme": "Persistence model & v2"
},
{
"n": 23,
"date": "2026-10-04",
"test": "Sidecar Outlook + pre-registered other-taxa skill check",
"result": "v1 reproduced exactly (0.287 / 0.357). Other taxa, 2022–26, model vs station × week: Pseudo-nitzschia 0.104 vs 0.089, Alexandrium 0.249 vs 0.267, Azadinium proxy 0.046 vs 0.079",
"verdict": "no lift (other taxa)",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 24,
"date": "2026-10-04",
"test": "**App v1**: v2 engine hindcast reproduction, 2026 pseudo-prospective replay, scoreboard",
"result": "Reproduction max \\|Δ\\| = 0 vs the frozen v2 predictions. 2026 replay (5 Apr–13 Sep, 1,157 forecasts, 121 events): 0.446 vs norm 0.473 (week 0 known: 0.574). First genuine issue 4 Oct (63 forecasts); **first scoring 25 Oct 2026**",
"verdict": "pending (genuine record)",
"cat": "pend",
"theme": "Persistence model & v2"
},
{
"n": 25,
"date": "2026-10-04",
"test": "Bloom-to-toxin lead time (association)",
"result": "SW: median 3 weeks to DSP toxin (IQR 0–6, n = 181) and median 2 weeks to closure (n = 39). All regions: 3 weeks (IQR 1–7, n = 244)",
"verdict": "history-only (association, not forecast)",
"cat": "desc",
"theme": "Persistence model & v2"
},
{
"n": 26,
"date": "2026-10-04",
"test": "**Closure-event backtest** (SW DSP closures, 2019–2026)",
"result": "v2 warned 61/62 episodes and 26/27 onsets (median lead 21 d) at a 23% alarm rate. Seasonal norm at the same rate: 54/62. At a matched 8% budget: **45 vs 46/62** for the free MI ≥100 last-week rule (diff CI −35 to +8 pp)",
"verdict": "no lift vs the free rule (tie)",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 27,
"date": "2026-10-04",
"test": "**Inputs audit + 3 cheap tests** (MI toxin results, regional presence, norm blend) on v2 T2",
"result": "vs v2 0.290: toxin −0.002 (−0.012 to +0.009); regional presence −0.017 (−0.032 to −0.003); blend −0.000 (−0.007 to +0.008), +0.014 in 2016–21. Season onsets caught 66/149 (v2) and ≤67 for every variant",
"verdict": "no lift",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 28,
"date": "2026-10-04",
"test": "MI ROMS public-data scan + CMEMS NWS 1.5 km water-origin back-trajectory (SW Kerry/West Cork + Galway/Connemara, Aug 2024–Aug 2026)",
"result": "No public multi-year MI ROMS archive (rolling windows only; 1-km CROCO 1993–2024 by request). NWS snap median 1.35 km vs IBI 5.1 km. Base refit 0.388; + counts at water origin Δ −0.002 (CI −0.024 to +0.017); + 7-day trajectory features Δ −0.032 (−0.067 to −0.006). Low power (176 positives)",
"verdict": "no lift",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 29,
"date": "2026-10-04",
"test": "Marine Heatwave Desk: toxin/closure stage (logistic on v2 p_cons + cells + DSP + status, SW, rolling Y−2/Y−1, 10% rolling budget)",
"result": "Week-level PR-AUC 0.55 vs best free 0.47 (Δ CI +0.005 to +0.106); onsets 0.24 vs 0.13. Closure episodes 41/62 vs MI ≥100 last week 46/62 (false-alarm runs 23 vs 128). Rolling redo of 45 vs 46 = **42 vs 46** (CI −45 to +7 pp)",
"verdict": "not adopted as an alarm; useful as a probability only",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 30,
"date": "2026-10-04",
"test": "Onset-only model (quiet N=4; gate / weight / feature variants) on v2",
"result": "GATE Δ −0.013 (−0.021 to −0.002) 2022–26, −0.008 2016–21; best variant (weighted) −0.000 / +0.005; onsets 63/149 vs 66",
"verdict": "no lift (fails rule)",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 31,
"date": "2026-10-04",
"test": "Spring-warming / stratification timing (8 causal features from repaired SST) on v2",
"result": "+v2 Δ −0.016 (−0.044 to +0.013) 2022–26, −0.011 2016–21; onsets 65/149 vs 66; SW +0.023 but reverses in 2016–21",
"verdict": "no lift (fails rule)",
"cat": "null",
"theme": "Persistence model & v2"
},
{
"n": 32,
"date": "2026-10-06",
"test": "Buoy vs satellite MHW audit (a reported +47%): an exposed west-coast buoy vs OSTIA/OISST, Hobday defs (i)–(iv) × 3 baselines; repeated for 23 MI coastal sensors",
"result": "exposed buoy r 0.990, bias +0.02 °C. 47% not reproduced: closest are (ii) OSTIA 1991–2020 +33% [CI +14, +47] and OISST (iii) +32–38%. Fair (iii) +25% [+8, +40] days, +10% events. Bay loggers median +82% (iii)",
"verdict": "descriptive (satellite undercounts coastal MHW days)",
"cat": "desc",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 33,
"date": "2026-10-06",
"test": "Buoy/logger features on v2 (exposed buoy T, MHW, chemistry; a bay sonde; MI coastal logger T/MHW hindcast); same rows, v2 protocol",
"result": "exposed buoy (36 pos, 6 stations): T −0.004, T+MHW +0.012, chemistry +0.018 [−0.005, +0.046] P = 0.08 (placebo +0.007 to +0.020). bay sonde 6 pos. Network: T −0.020 / −0.008; MHW −0.007 / **−0.032 [−0.050, −0.014]** (2016–21 / 2022–26)",
"verdict": "no lift",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 34,
"date": "2026-10-06",
"test": "Buoy-only MHW events → Dinophysis +1–4 wk vs climatology",
"result": "exposed buoy 1 obs vs 1.5 exp (11 events, 9 in winter). Network de-duplicated O/E 1.19 vs 1.04 (diff CI −0.10 to +0.45)",
"verdict": "descriptive, no signal",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 35,
"date": "2026-10-07",
"test": "v2 + severe-only MHW features (cat ≥2/≥3, satellite / MI coastal logger / exposed buoy; all + Apr–Sep)",
"result": "SAT Δ −0.015 [−0.032, −0.000]; NET +0.000 [−0.014, +0.012]; exposed buoy +0.001 [−0.018, +0.019] (36 pos)",
"verdict": "no lift",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 36,
"date": "2026-10-07",
"test": "v2 + degree-days above clim / thresh (1/2/4/8 wk)",
"result": "SAT Δ −0.027 [−0.043, −0.014]; NET −0.037 [−0.054, −0.024]; exposed buoy −0.008",
"verdict": "no lift (hurts)",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 37,
"date": "2026-10-07",
"test": "v2 + absolute warm-water degree-days (>15/16/17 °C, 4/8 wk)",
"result": "SAT 2022–26 +0.005 [−0.008, +0.017] p = 0.26, 2016–21 −0.005; NET −0.003; exposed buoy −0.015. Multiplicity: 30 tests, min p 0.24 vs Holm 0.0033",
"verdict": "no lift",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 38,
"date": "2026-10-07",
"test": "\"40% more blooms during MHWs\": RR of Dinophysis ≥100 during / 1–4 wk after MHW (satellite, cat ≥2/≥3, MI coastal logger, exposed buoy; extras)",
"result": "Raw 1.08 [1.00, 1.18]; station × month 0.82 [0.76, 0.90]; + year 1.00 [0.90, 1.08]; season-unmatched 1.39 [1.26, 1.51]. Cat ≥2 0.70, cat ≥3 0.69. MI coastal logger 0.90, exposed buoy 1.19 [0.83, 1.66]",
"verdict": "\"+40%\" = seasonal artefact",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 39,
"date": "2026-10-07",
"test": "v2 + short/historical neighbours (≤10/15 km, 4-wk, trend, distance-weighted)",
"result": "+0.010 [+0.001, +0.019] p = 0.008 (Holm pass; placebo 5/5) in 2022–26; −0.001 in 2016–21. Within the selection null (#56)",
"verdict": "no lift (fails both-pools rule)",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 40,
"date": "2026-10-07",
"test": "v2 + sampling intensity / species-split histories / precursors / spring–neap",
"result": "−0.001 / −0.003 / −0.005 / +0.009 (2016–21 −0.011)",
"verdict": "no lift",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 41,
"date": "2026-10-07",
"test": "Per-region models (all regions; SW only)",
"result": "−0.000 / +0.003 in 2022–26; −0.044 / −0.031 in 2016–21",
"verdict": "worse",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 42,
"date": "2026-10-07",
"test": "Logger exchange signals (real-time assumed) and perfect-future temperature ceiling",
"result": "+0.003 [−0.009, +0.015]; ceiling +0.010 [−0.002, +0.019] (157 pos)",
"verdict": "no lift; ceiling small",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 43,
"date": "2026-10-07",
"test": "Value of week-0 counts (faster turnaround)",
"result": "+0.063 [+0.038, +0.083] national; +0.084 SW; +0.050 in 2016–21 (contains issue-Sunday samples: see #45)",
"verdict": "largest lever (information)",
"cat": "pos",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 44,
"date": "2026-10-07",
"test": "5-feature logistic vs LightGBM v2 (fit ≤Y−1)",
"result": "−0.007 [−0.029, +0.017] in 2022–26; +0.013 in 2016–21; Brier 0.0344 vs 0.0318",
"verdict": "tie on ranking",
"cat": "null",
"theme": "Heatwaves, buoys & angles"
},
{
"n": 45,
"date": "2026-10-07",
"test": "**Red team P0-1: timestamp audit + turnaround rescore**",
"result": "Conservative: 0 samples <7 d before issue. Old operational 0.353 includes issue-Sunday samples (11.5% of week-0 samples). Strict (< Sun 00:00) 0.324; 3-d 0.328; 5-d 0.322; 10-d 0.266. 3–5-d variants replicate in 2016–21 (+0.040 to +0.055 vs norm, region-year CI > 0)",
"verdict": "headline clean; 0.353 retired (oracle)",
"cat": "chk",
"theme": "Red team"
},
{
"n": 46,
"date": "2026-10-07",
"test": "**Red team P0-2: verification bias** (IPW; unconditional with unverified = 0)",
"result": "IPW gain +0.060 (region-year 90% +0.009, +0.085; p 0.031). Unconditional 0.273 vs 0.220 (+0.053, p 0.038). 2016–21 +0.020 / +0.025",
"verdict": "pass",
"cat": "chk",
"theme": "Red team"
},
{
"n": 47,
"date": "2026-10-07",
"test": "Red team: future sampling intensity in label (k table, first/random sample)",
"result": "k=1 +0.032 (n.s.), k=2 +0.071, k≥3 +0.036; first-sample label +0.075; random +0.058 (+0.053 to +0.062)",
"verdict": "no alarm",
"cat": "chk",
"theme": "Red team"
},
{
"n": 48,
"date": "2026-10-07",
"test": "**Red team P0-4: block bootstraps** (region-year, year, region × week, episode, moving blocks, LOYO/LORYO; power)",
"result": "Gain +0.060: region-year 90% [+0.007, +0.084], 95% [−0.006, +0.090], p 0.034; all other 90% CIs exclude 0. 2016–21 +0.018, all include 0; power for +0.02 ≈ 50%",
"verdict": "pass at 90% (narrow)",
"cat": "chk",
"theme": "Red team"
},
{
"n": 49,
"date": "2026-10-07",
"test": "Red team: year-standardised AP, within-Sunday AP, fixed budgets, pre-Platt",
"result": "Year-macro 0.298 vs 0.269 (+0.029, 3/5 yrs); SW macro −0.002 (2/5); prevalence-std 0.253 vs 0.234; within-Sunday 0.348 vs 0.303; recall at 5/10/20% ≈ norm",
"verdict": "half the gain is between-year",
"cat": "chk",
"theme": "Red team"
},
{
"n": 50,
"date": "2026-10-07",
"test": "**Red team: baseline gauntlet** (MI rules, ranked MI, LR2/LR3/LOGIT5, L1/L2, hierarchical ridge, REV)",
"result": "v2 0.290; hier. ridge 0.280 (Δ −0.010 [−0.030, +0.010]; 2016–21 **+0.024 [+0.006, +0.050]**); LR3 0.263 / 0.278 (≤Y−1); L1/L2 0.270; MI rules 0.08–0.12; ranked MI 0.182",
"verdict": "simple models within ~0.01",
"cat": "chk",
"theme": "Red team"
},
{
"n": 51,
"date": "2026-10-07",
"test": "**Red team: closure null + fixes**",
"result": "Random warnings at v2's area × month budget: 58.8/62 (95% 56–61) vs 61 observed; MI null 45.2 vs 46. Rolling threshold 42 vs 46 confirmed; onsets 26 vs 13 (23% vs 8% alarm rate)",
"verdict": "61/62 invalid as skill claim",
"cat": "chk",
"theme": "Red team"
},
{
"n": 52,
"date": "2026-10-07",
"test": "Red team: multiplicity, BH over all logged Δ tests",
"result": "m = 72: v2 gain q 0.072 (station p) / 0.60 (region-year p); Holm 0.22. Only #17, #29 and v2 (station p) at q ≤ 0.10",
"verdict": "report both",
"cat": "chk",
"theme": "Red team"
},
{
"n": 53,
"date": "2026-10-07",
"test": "Red team: recalibration (isotonic + season-to-date prevalence, regional, oracle)",
"result": "Brier: Platt 0.0318; isotonic 0.0333; + shift 0.0353; regional 0.0364; oracle 0.0332. Expected 0.029 not reproduced",
"verdict": "keep Platt",
"cat": "chk",
"theme": "Red team"
},
{
"n": 54,
"date": "2026-10-07",
"test": "Red team: bay-axis 72-h wind + extended set (three SW bays; all SW bays)",
"result": "ax72 −0.003 [−0.015, +0.010] / −0.000; extended −0.002 / −0.011; all SW bays +0.001 / +0.002",
"verdict": "no lift",
"cat": "null",
"theme": "Red team"
},
{
"n": 55,
"date": "2026-10-07",
"test": "Red team: spatial CV (leave region out; 5 station groups) and sampling-intensity ablation",
"result": "Spatial: v2 0.248 / 0.251 vs usual norm 0.231 (+0.017 p 0.40 / +0.020 p 0.28); 2016–21 −0.120 / −0.009. Ablation: gain change −6% to +4%",
"verdict": "transfers ≈ site history; not sampling-driven",
"cat": "chk",
"theme": "Red team"
},
{
"n": 56,
"date": "2026-10-07",
"test": "Red team: selection-procedure null (label shuffled within station × year; 9 candidate sets)",
"result": "Best-of-9 null Δ +0.005 to +0.011; v2 − norm under null +0.023 to +0.032 (2016–21 +0.003 to +0.006)",
"verdict": "NBS +0.010 within null; between-year component",
"cat": "chk",
"theme": "Red team"
},
{
"n": 57,
"date": "2026-10-07",
"test": "Red team: onset vs continuation; ≥500/≥1000 targets; noise ceiling",
"result": "Onset +0.033 (region-year p 0.047), continuation +0.040 (n.s.); ≥500 +0.040 (p 0.04); ≥1000 +0.009 (n.s.); ceiling ≈ 0.85",
"verdict": "modest real onset skill",
"cat": "pos",
"theme": "Red team"
},
{
"n": 58,
"date": "2026-10-07",
"test": "Cyst-bed distance; species × toxin multi-state; Scottish transfer",
"result": "G4 not testable (Dinophysis cysts unproven; no dataset). R11/R12 logged in the ideas backlog",
"verdict": "not run",
"cat": "pend",
"theme": "Red team"
},
{
"n": 59,
"date": "2026-10-07",
"test": "**v2 freeze**",
"result": "No leakage bug found, so the model is unchanged. 2027 is the confirmatory season",
"verdict": "frozen",
"cat": "pend",
"theme": "Red team"
},
{
"n": 60,
"date": "2026-10-07",
"test": "Toxin data inventory + fresh MI ERDDAP pull (habs_biotoxin to 2 Oct 2026, habs_status to 1 Oct)",
"result": "76,340 DSP results, 56,782 samples, 151 sites; ≥ limit samples 2022–26: 12/2/0/8/4. OA/DTX2 split not published; PTX only 2012–mid-2022",
"verdict": "data",
"cat": "desc",
"theme": "Toxins"
},
{
"n": 61,
"date": "2026-10-07",
"test": "**Toxin as target** (DSP ≥ limit / ≥ 50% in weeks +1/+2, site × week; norm vs persistence vs TOX/CNT/TOXCNT LightGBM; cons + real timing)",
"result": "2016–21 ≥ limit: TOXCNT 0.650 vs persistence 0.516 vs norm 0.229. 2022–26 ≥ limit (33 pos): 0.094 vs persistence 0.114 (n.s.). ≥ 50% 2022–26 cons: 0.255 vs 0.197 (+0.011 to +0.131); real timing persistence 0.310 beats 0.279",
"verdict": "lift at ≥ 50% (cons); limit-level not assessable recently",
"cat": "pos",
"theme": "Toxins"
},
{
"n": 62,
"date": "2026-10-07",
"test": "**Closure / toxic state with toxin + counts** (SW, logistic, rolling, MI-rate thresholds; 62 closures)",
"result": "Closures: S_TOXL 49, S_TOXT 47, counts-only 54, MI 46, v2 42 (no CI). FA runs 52–56 vs 89 vs 130. Week-level 2019–26 PR-AUC 0.50 vs 0.29 counts-only (+0.02 to +0.29); 2022–26 0.113 vs 0.116",
"verdict": "toxin improves ranking / false alarms, not closures caught",
"cat": "chk",
"theme": "Toxins"
},
{
"n": 63,
"date": "2026-10-07",
"test": "Toxin trend features in v2 cell forecast (cons + real)",
"result": "2022–26 −0.004 (−0.013, +0.008) / −0.009; 2016–21 −0.011 / −0.014; SW 2022–26 −0.016 / −0.033",
"verdict": "no lift (confirms #27)",
"cat": "null",
"theme": "Toxins"
},
{
"n": 64,
"date": "2026-10-07",
"test": "Lead time: cells vs toxin trend before SW DSP closures (74 episodes)",
"result": "Cells ≥100 last week 41/74 (median 21 d); toxin rising 40/74 (14 d); toxin detected 51/74 (21 d). Either cells or toxin ≥ 50%: 54/74",
"verdict": "complementary, similar lead",
"cat": "desc",
"theme": "Toxins"
},
{
"n": 65,
"date": "2026-10-07",
"test": "Toxin data inventory II: all MI ERDDAP HAB datasets (4), full habs_phyto with PublishedDate; FSA NI + England & Wales biotoxin/phyto downloaded; REPHY/REPHYTOX blocked from box",
"result": "MI phyto 765,985 rows / 56,078 samples with publish dates; E&W ≈25.5k biotoxin + ≈22.7k phyto rows 2001–25; NI ≈2.1k + 2.1k 2021–26; 7 draft data requests to MI",
"verdict": "data",
"cat": "desc",
"theme": "Toxins"
},
{
"n": 66,
"date": "2026-10-07",
"test": "T10 real MI cell-count turnaround (habs_phyto.PublishedDate)",
"result": "Median 3.6 d since 2019 (q90 6.6–9.6 d); 78% of week-0 samples published before issue Sunday (Mon 90%, Wed 40%, Thu 2%)",
"verdict": "answers #45 timing question; v2 operational rescore = follow-up",
"cat": "desc",
"theme": "Toxins"
},
{
"n": 67,
"date": "2026-10-07",
"test": "T1 hidden-bloom / lab-priority trigger (toxin rise ≥ 50% without count ≥ 100)",
"result": "National 2016–26: 205 rises, 48% without prior count ≥ 100 (82 counted but < 100). Trigger → count ≥ 100 in 21 d 23% (15–33%) vs 5.1%; → toxin ≥ limit in 14 d 9% vs 0.35%",
"verdict": "build (zero-cost rule)",
"cat": "pos",
"theme": "Toxins"
},
{
"n": 68,
"date": "2026-10-07",
"test": "T6 species-specific accumulation (mussel vs oyster pairs)",
"result": "Oyster ≥ limit when mussel ≥ limit: 5/159 (3%, 1–7%); 2016–26 0/62. Oyster exceedances 2/7,864 samples 2016–26",
"verdict": "species-aware target needed",
"cat": "desc",
"theme": "Toxins"
},
{
"n": 69,
"date": "2026-10-07",
"test": "T2 time-to-reopen forecast (614 site episodes)",
"result": "MAE 50.2 vs 50.4 d species median (Δ −4.5 to +5.1); median closure 41 d (IQR 15–98)",
"verdict": "no lift",
"cat": "null",
"theme": "Toxins"
},
{
"n": 70,
"date": "2026-10-07",
"test": "T4 season-severity outlook (area × year, Jul–Dec weeks ≥ limit)",
"result": "National MAE 1.398 vs clim 1.394; SW 3.36 vs 4.01 (Δ −1.62 to +0.27); clim Spearman 0.52",
"verdict": "no lift; climatology suffices",
"cat": "null",
"theme": "Toxins"
},
{
"n": 71,
"date": "2026-10-07",
"test": "T3 multi-hazard: AZP / ASP / PSP toxin target with causative-taxon counts",
"result": "ASP 2016–26 0.748 vs persistence 0.443 / norm 0.479 (Δ +0.24 to +0.35); 2022–26 0.734 vs 0.407. AZP 44 / PSP 25 positives 2016–26: persistence best",
"verdict": "ASP challenger worth building",
"cat": "pos",
"theme": "Toxins"
},
{
"n": 72,
"date": "2026-10-07",
"test": "T5 neighbour toxin ablation (toxin target)",
"result": "2016–21 +0.039 (+0.016, +0.052); 2022–26 +0.010 (−0.039, +0.065)",
"verdict": "keep as feature; no claim",
"cat": "null",
"theme": "Toxins"
},
{
"n": 73,
"date": "2026-10-07",
"test": "T7 D. acuta share / toxin-per-cell as regime marker",
"result": "Acuta share adds nothing to bloom→toxin conversion (−0.015, +0.012); recent toxin does (+0.10 to +0.39, onsets 2016–26). Acuta ~ peak ρ 0.29",
"verdict": "no marker value",
"cat": "null",
"theme": "Toxins"
},
{
"n": 74,
"date": "2026-10-07",
"test": "T8 toxin-confirmed cell target (relabel non-toxic blooms)",
"result": "50% of cell positives toxin-confirmed; v2/norm 1.60× vs 1.22× (2022–26), CIs include 0",
"verdict": "descriptive; not proven",
"cat": "desc",
"theme": "Toxins"
},
{
"n": 75,
"date": "2026-10-07",
"test": "T9 combined harvest-risk (S_TOXT + acuta share + neighbour areas)",
"result": "PR-AUC 0.528 vs 0.504 (−0.016, +0.059); closures 43 vs 47 vs MI 46; FA runs 50 vs 56 vs 130; S_TOXT ECE 0.009 (over-predicts 2022–26: 2.2% vs 0.8%)",
"verdict": "S_TOXT stays the candidate",
"cat": "chk",
"theme": "Toxins"
},
{
"n": 76,
"date": "2026-10-07",
"test": "**Copilot T1: active-year empirical-Bayes norm** (norm × shrunk season-to-date station + region activity, in-fold; variants: station-only, + previous year, log-count)",
"result": "EB 0.240 vs v2 0.290: v2 − EB **+0.051** [region-year 90% +0.004, +0.075], p 0.035; EB − norm +0.009. Variants 0.240–0.259 (best log-count, v2 − EB +0.031 [−0.017, +0.060]). 2016–21 EB 0.518 ≈ v2 0.517. Between-year component not captured (G = 0.034)",
"verdict": "does not absorb the gain",
"cat": "chk",
"theme": "Copilot review"
},
{
"n": 77,
"date": "2026-10-07",
"test": "Copilot T1 context: per-season v2 vs ridge station-effect logistic, 2016–26",
"result": "Ridge beats v2 within 9 of 11 seasons (sign p 0.03); year-averaged 2022–26 ridge 0.310 vs v2 0.298; pooled v2 +0.010 [−0.007, +0.025]",
"verdict": "headline caveat; ridge = 2027 comparator",
"cat": "chk",
"theme": "Copilot review"
},
{
"n": 78,
"date": "2026-10-07",
"test": "Copilot T1 post-hoc (not pre-registered): rolling-52-week EB; k grid to 0.05",
"result": "EB_R52 0.259 (year-avg 0.301), v2 − EB_R52 +0.032 [−0.014, +0.055]; 2016–21 0.526 vs v2 0.517. k grid: 0.234",
"verdict": "exploratory; still > +0.02",
"cat": "chk",
"theme": "Copilot review"
},
{
"n": 79,
"date": "2026-10-07",
"test": "Copilot T2: species-composition attribution (acuta-only / mixed / acuminata-only positives vs all negatives)",
"result": "2022–26 v2 − norm: acuta-only +0.006 (40 pos), **mixed +0.074 [+0.010, +0.125]** (138), acuminata-only +0.030 (352). Composition-standardised 2024 −0.036, 2026 −0.026. ρ(acuta share, gain) −0.24",
"verdict": "gain is in mixed blooms; acuta decline does not explain 2024/26",
"cat": "desc",
"theme": "Copilot review"
},
{
"n": 80,
"date": "2026-10-07",
"test": "Copilot T3: prevalence-drift regression of yearly gains (OLS, year bootstrap, Bayesian with τ)",
"result": "v2 − norm on year +0.000/yr (Bayes 90% −0.009, +0.009); on prevalence −0.011 per pp (−0.018, −0.004; CI includes 0 without 2019). v2 − EB, v2 − ridge: no trend",
"verdict": "no drift; gain larger in low-prevalence years",
"cat": "chk",
"theme": "Copilot review"
},
{
"n": 81,
"date": "2026-10-07",
"test": "Copilot T4: lab-queue triage simulation (sample dates only; assumed Mon–Fri queue; capacity 50/75/100/150% of median weekly load)",
"result": "100%: v2 order finds new ≥120 episodes 2.97 d earlier than date order [2.08, 3.77]; norm order 2.87, EB 2.80 (v2 − norm +0.09 [−0.12, +0.34]); MI-rule order −0.42. 150%: +0.25 d. 2016–21 100%: +1.92",
"verdict": "rule passes; benefit = any seasonal ranking, only if backlogged",
"cat": "chk",
"theme": "Copilot review"
},
{
"n": 82,
"date": "2026-10-07",
"test": "Copilot T5: within-Sunday rank alarms (top 5/10/20%, top 10/20/30) vs prior-year probability thresholds; SW closures",
"result": "Top 10%/Sunday: alarm 9.7% (SD 0.2 pp), recall 26.6% vs prior-year threshold 5.0% alarm, recall 39.1%. Closures: top 10% 49/62 with 531 false-alarm runs vs threshold 56/62 (116) vs MI 46/62 (130)",
"verdict": "fails; do not adopt rank rules",
"cat": "null",
"theme": "Copilot review"
},
{
"n": 83,
"date": "2026-10-07",
"test": "**Operational rescore: MI publish-date audit** (7 Oct snapshot)",
"result": "All samples ≤ ~10 May 2018 carry one bulk stamp (2018-05-15 08:47–48; 29,002 samples) → backfilled, excluded. 2019–26 100% credible: median lag 3.6 d (2021 4.5), q90 6.6–9.6, max 38; none after snapshot or before sample date. Published before Sunday: Mon 90%, Tue 75%, Wed 40%, Thu 2%. 2.4% of samples not yet public when frozen v2 first uses them",
"verdict": "credible from mid-May 2018",
"cat": "desc",
"theme": "Operational rescore"
},
{
"n": 84,
"date": "2026-10-07",
"test": "**Operational v2 (published-by-Sunday features), PR-AUC 2022–26**",
"result": "**0.312 vs norm 0.231** (+0.082, region-year 90% [+0.016, +0.110], 95% [+0.002, +0.117]); year-avg 0.321 vs 0.269 (CI incl. 0). SW 0.338 vs 0.203 (year-block 90% [+0.010, +0.172]). vs frozen v2 0.290: +0.022 [−0.010, +0.038]. Ridge on PUB features 0.312",
"verdict": "**operational headline (pass)**; > v2 not shown",
"cat": "pos",
"theme": "Operational rescore"
},
{
"n": 85,
"date": "2026-10-07",
"test": "Operational v2 in credible 2019–21 and 2016–21",
"result": "2019–21: PUB 0.548 vs norm 0.529 (+0.019 [−0.019, +0.063]) vs v2 0.525 (+0.024 [+0.008, +0.037]); ridge-PUB 0.575. 2016–21 (2016–Apr 2018 imputed): +0.039 [+0.013, +0.068] vs norm; +0.022 [+0.011, +0.035] vs v2",
"verdict": "same sign; small",
"cat": "chk",
"theme": "Operational rescore"
},
{
"n": 86,
"date": "2026-10-07",
"test": "Assumed-lag check + frozen v2 fed only published data",
"result": "3-d 0.328 beats real publication by 0.016 [+0.004, +0.031] (too optimistic); 5-d 0.321 ≈ real (−0.009, CI incl. 0); zero lag 0.324. Frozen v2 with only-published inputs 0.291 (Δ +0.001)",
"verdict": "0.290 confirmed honest; real ≈ 5-day",
"cat": "chk",
"theme": "Operational rescore"
},
{
"n": 87,
"date": "2026-10-07",
"test": "Closure backtest with publish dates (rolling MI-budget thresholds)",
"result": "MI rule 46/62 (130 FA runs); **MI on published-by-Sunday data 50/62** (124; +4, none lost). Frozen v2 42 (47 FA runs); PUB 41 (41 FA runs; seeds 39–43). Models near-silent in 2021, 2023–25",
"verdict": "MI rule still wins catches; model = fewer false alarms",
"cat": "chk",
"theme": "Operational rescore"
},
{
"n": 88,
"date": "2026-10-07",
"test": "**France A: Irish v2 recipe replicated on REPHY** (Dinophysis ≥100 wk +1/+2, conservative lag 1, rolling 2005–22)",
"result": "2005–13: 0.662 vs norm 0.564 (+0.098, region-year 90% [+0.069, +0.131]); 2014–22: 0.674 vs 0.544 (+0.130 [+0.107, +0.152]). Also passes at ≥500, ≥1,000, onset; beats ridge (+0.028, +0.048)",
"verdict": "**pass** (Holm ✓); generalises",
"cat": "pos",
"theme": "France transfer"
},
{
"n": 89,
"date": "2026-10-07",
"test": "France B: Dinophysis counts → OA-group toxin ≥80 µg/kg (TOXCNT − PERS); incl. I4 mussel-only",
"result": "2012–16: 0.717 vs 0.727 (−0.010 [−0.042, +0.028]); 2017–22: 0.716 vs 0.684 (+0.032 [+0.013, +0.050]). I4 mussels −0.036 / +0.026 (CIs incl. 0). Counts add to toxin history at ≥160 (+0.062, +0.031)",
"verdict": "fails (later pool only)",
"cat": "null",
"theme": "France transfer"
},
{
"n": 90,
"date": "2026-10-07",
"test": "France C: OA/DTX/PTX profile + Dinophysis species features; C3 conversion by species",
"result": "PROF +0.007 [+0.001, +0.015] / −0.002 [−0.013, +0.008]; SPEC +0.004 / +0.002 (CIs incl. 0). C3: P(OA ≥80 after ≥100 cells) acuminata 42% vs acuta 32% vs caudata 15%; DTX2 in 56% of toxic samples in Pays de la Loire–Charente",
"verdict": "no lift",
"cat": "null",
"theme": "France transfer"
},
{
"n": 91,
"date": "2026-10-07",
"test": "**France D1: French pre-training for Irish cells, no lat/lon** (POOL12 − IE12)",
"result": "2016–21: 0.537 vs 0.507 (+0.030 [+0.009, +0.044]); 2022–26: 0.286 vs 0.256 (+0.030 [+0.006, +0.048]); seeds stable. But POOL12 − frozen v2 +0.020 / −0.004 (fails)",
"verdict": "**pass** (Holm ✓, narrowly); does not beat v2",
"cat": "pos",
"theme": "France transfer"
},
{
"n": 92,
"date": "2026-10-07",
"test": "France X1 (post-hoc, exploratory): full v2 14-feature recipe + French rows (lat/lon missing) vs IE14 (= frozen v2 exactly)",
"result": "2016–21: 0.540 vs 0.517 (+0.024 [+0.014, +0.036]); 2022–26: 0.301 vs 0.290 (+0.011 [−0.012, +0.027])",
"verdict": "no lift (candidate for 2027 prereg)",
"cat": "null",
"theme": "France transfer"
},
{
"n": 93,
"date": "2026-10-07",
"test": "France D2: French pre-training for Irish OA toxin ≥80 (POOL − IE)",
"result": "2016–21: 0.693 vs 0.687 (+0.006 [−0.002, +0.025]); 2022–26: 0.261 vs 0.237 (+0.024 [+0.008, +0.056]). French-only worse than Irish-only in 2016–21 (−0.047)",
"verdict": "fails (later pool only)",
"cat": "null",
"theme": "France transfer"
},
{
"n": 94,
"date": "2026-10-07",
"test": "France D3: UK (E&W, NI) pooling",
"result": "Not run (pre-declared: needs separate ingest + geocoding; Scotland is #58 backlog)",
"verdict": "not run",
"cat": "pend",
"theme": "France transfer"
},
{
"n": 95,
"date": "2026-10-07",
"test": "France E1: ASP ≥20 mg/kg with Pseudo-nitzschia counts (TOXCNT − PERS)",
"result": "2003–12: 0.554 vs 0.599 (−0.045 [−0.186, +0.042]); 2013–22: 0.700 vs 0.651 (+0.049 [−0.033, +0.120]); PN counts add nothing to toxin history",
"verdict": "fails",
"cat": "null",
"theme": "France transfer"
},
{
"n": 96,
"date": "2026-10-07",
"test": "France E2: French pre-training for Irish ASP (POOL − IE)",
"result": "2016–21: 0.743 vs 0.729 (+0.014 [−0.006, +0.035]); 2022–26: 0.726 vs 0.711 (+0.015 [−0.013, +0.041]). French model zero-shot beats PERS in Ireland by +0.25/+0.24 (both pools)",
"verdict": "no lift",
"cat": "null",
"theme": "France transfer"
},
{
"n": 97,
"date": "2026-10-07",
"test": "France E3: PSP ≥800 with Alexandrium counts (TOXCNT − PERS)",
"result": "1995–2007: 0.184 vs 0.347 (−0.163 [−0.299, +0.023]); 2008–21: 0.449 vs 0.466 (−0.017 [−0.147, +0.065]); 164 positives, 11 calibration fallbacks",
"verdict": "fails",
"cat": "null",
"theme": "France transfer"
},
{
"n": 98,
"date": "2026-10-07",
"test": "France F: depuration / exceedance by shellfish species (descriptive)",
"result": "KM median above limit: mussel 20 d vs oyster 8 d (+12 d, 95% [+6, +14]); P(oyster ≥ limit \\| mussel ≥ limit) 15.3% [12.6, 18.4] (Ireland 3%); exceedance rate mussel 15.7% vs oyster 3.4%",
"verdict": "history-only (descriptive)",
"cat": "desc",
"theme": "France transfer"
},
{
"n": 99,
"date": "2026-10-07",
"test": "**France G: hidden-bloom flag replication** (toxin rise with no prior ≥100 count → bloom within 21 d)",
"result": "2010–15: 60% vs 15.5% (RD +0.44 [+0.30, +0.63]); 2016–22: 65% vs 35.5% (RD +0.30 [+0.14, +0.45]); toxin ≥ limit in 14 d 42%/37% vs 2.9%/5.3%. Most hidden rises were unmonitored",
"verdict": "**replicates** (Holm ✓)",
"cat": "pos",
"theme": "France transfer"
},
{
"n": 100,
"date": "2026-10-07",
"test": "France H: phenology and trend 1987–2022 (descriptive; no causal claims)",
"result": "Median onset week FR 20 vs IE 25; onset trend 0.0 wk/decade [−0.39, +0.38] (all sites); presence trend −0.013/decade [−0.039, +0.011]; mouse-bioassay and LC-MS series not joined",
"verdict": "history-only (no clear trend)",
"cat": "desc",
"theme": "France transfer"
},
{
"n": 101,
"date": "2026-10-07",
"test": "France I1: in-situ temperature + salinity added to V2R",
"result": "+0.003 [−0.001, +0.006]; −0.002 [−0.005, +0.003]",
"verdict": "no lift",
"cat": "null",
"theme": "France transfer"
},
{
"n": 102,
"date": "2026-10-07",
"test": "France I2: bloom → first OA exceedance lead time (descriptive)",
"result": "91.5% [88.5, 93.8] preceded by ≥100 cells/L within 8 wk (≥100 = presence in FR); median lead 4 wk (IQR 2.1–6.9); Irish #25: 3 wk",
"verdict": "history-only",
"cat": "desc",
"theme": "France transfer"
},
{
"n": 103,
"date": "2026-10-07",
"test": "France I3: AZA / YTX targets",
"result": "Not run (pre-declared: 0 samples ≥ either limit)",
"verdict": "not run",
"cat": "pend",
"theme": "France transfer"
},
{
"n": 104,
"date": "2026-10-09",
"test": "**MHW ecology T1: community shift** (diatom share of diatom+dino; group abundances) during / 1–4 wk after satellite MHWs vs same station × month other years + year FE; year-block CI; Holm over 23 contrasts",
"result": "During −0.6 pp [−2.7, +1.6]; after +1.4 pp [−0.2, +3.1] (ref 76%). exposed buoy station × month −2.5 pp → +0.7 with year. Abundances Δ ≈ 0. Extends #38 3b",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 105,
"date": "2026-10-09",
"test": "MHW ecology T2: per-sample diversity (Shannon, Simpson, richness; effort-adjusted)",
"result": "Shannon during −0.039 [−0.094, +0.016], after +0.003 [−0.035, +0.035]; sign flips without year FE (−0.094 → +0.002)",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 106,
"date": "2026-10-09",
"test": "MHW ecology T3: toxin per cell (mussel DSP 7–21 d after Dinophysis ≥100 wk, given log cells); ASP/PN, PSP/Alexandrium secondary",
"result": "DSP −0.010 log10 [−0.114, +0.078] (1,541 pairs). Secondary ASP/PN +0.19 [+0.01, +0.34] (1 of ~100 secondary; raw ASP lower); PSP −0.04",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 107,
"date": "2026-10-09",
"test": "MHW ecology T4: bloom RR with in-bay MI coastal logger MHW (fair def iii, offset366), stations ≤5 km; vs satellite on same rows",
"result": "+0.25 pp [−2.5, +3.1], ratio 1.02 [0.79, 1.26] (66 stations, 765 bloom wk); ≤30 km +0.2 pp; satellite same rows −0.5 pp; exposed buoy 0.92 / 1.04. Extends #38 in-situ rows. a bay sentinel sonde too short",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 108,
"date": "2026-10-09",
"test": "MHW ecology T5: season split (Mar–Aug vs Sep–Feb) for bloom, diatom share, Shannon",
"result": "Bloom Mar–Aug ratio 1.00 [0.83, 1.22]; Sep–Feb 0.71 [0.27, 1.08]; community Δ all CI ∋ 0",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 109,
"date": "2026-10-09",
"test": "MHW ecology T6: recovery profile, weeks 1–8 after MHW end",
"result": "Diatom share k5–8 +0.1 pp [−2.3, +2.5]; profiles flat for diatom share, bloom, Shannon (no initial shift to recover from)",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 110,
"date": "2026-10-09",
"test": "MHW ecology T7: dose–response by Hobday category, duration, intensity",
"result": "Bloom −0.31 pp/category [−0.92, +0.32]; diatom share +0.07 pp/cat; no gradient by duration or intensity",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 111,
"date": "2026-10-09",
"test": "MHW ecology T8: bloom magnitude (log10 Dinophysis) and episode duration",
"result": "log10 −0.004 [−0.022, +0.015]; episode length +0.13 wk [−1.64, +1.36] (1,827 episodes); peak +0.04",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 112,
"date": "2026-10-09",
"test": "MHW ecology T9: warm-affinity taxa (pre-listed) and novel-at-station taxa after MHWs",
"result": "Warm taxa +0.08 pp [−1.2, +1.6] (ref 15.7%); novel −0.015/wk",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 113,
"date": "2026-10-09",
"test": "MHW ecology T10: regional split (SW / W / NW) bloom effect",
"result": "SW −1.1 pp [−3.8, +1.7]; W −1.1 [−2.6, +0.3]; NW −0.8 [−1.8, +0.5]",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 114,
"date": "2026-10-09",
"test": "MHW ecology T11: MHW effect in calm vs windy (ERA5) weeks; upwelling-relaxation secondary",
"result": "Calm − windy −0.2 pp [−1.7, +1.4]. Side finding (not MHW): windy weeks −1.1 pp blooms, +1.3 pp diatoms",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 115,
"date": "2026-10-09",
"test": "MHW ecology T12: MHW effect in dry vs wet 28-d rainfall (Met Éireann synoptic)",
"result": "Dry − wet +0.4 pp [−1.5, +1.9]; rain–MHW r −0.06",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 116,
"date": "2026-10-09",
"test": "MHW ecology T13: trends 2005–25 in satellite MHW days and community metrics",
"result": "MHW days **+28.9 d/decade [+5.8, +50.5]**, p 0.011, Holm 0.25 (2022–25: 82/97/59/120 d vs ~10–25 in 2008–17; fixed 2003–14 baseline). Shannon +0.08, diatom share −0.9 pp (n.s.); richness +1.9 = recording practice",
"verdict": "suggestive (MHW days); no community trend",
"cat": "desc",
"theme": "MHW ecology"
},
{
"n": 117,
"date": "2026-10-09",
"test": "MHW ecology T14: France (REPHY) warm-anomaly replication (TEMP > site × month p90 of 1995–2010)",
"result": "Dinophysis ≥100 +0.5 pp [−0.5, +1.7], ratio 1.03 (58,359 samples, 201 sites); PN, log Dino ≈ 0",
"verdict": "no effect",
"cat": "null",
"theme": "MHW ecology"
},
{
"n": 118,
"date": "2026-10-09",
"test": "MHW ecology T15: placebo, MHW calendar from a random other year (200 draws)",
"result": "Nulls centred at 0; null SD ≈ ½ bootstrap SE (CIs conservative); real vs null perm p: diatom 0.33, Shannon 0.055, bloom 0.36",
"verdict": "validity check passes",
"cat": "chk",
"theme": "MHW ecology"
},
{
"n": 119,
"date": "2026-10-09",
"test": "Karenia mikimotoi inventory (MI habs_phyto, real data) + where it occurs (SW / W / NW)",
"result": "3,524 *K. mikimotoi* records; 451 station-weeks ≥10,000 cells/L (112 stations, 24 yrs; May–Sep, peak Jul–Aug). ≥10k: SW 162 (0.90% of station-weeks), W 136 (0.84%), NW 124 (1.34%), other 29. 2022–26: SW 12, W 3, NW 0. Forecast positives 2016–26 183, **2022–26 26**",
"verdict": "data",
"cat": "desc",
"theme": "Karenia"
},
{
"n": 120,
"date": "2026-10-09",
"test": "**Karenia ≥10,000 cells/L, weeks +1/+2: v2 recipe retrained** (14 feats, LightGBM + Platt, conservative lag 1, rolling origin 2016–26) vs station × week norm and persistence; year-block 95% CI",
"result": "2016–26 (183 pos, 0.58%): model **0.048** [0.017–0.122] vs norm 0.022 [0.012–0.039] (Δ +0.026, **−0.001 to +0.093**) vs persistence **0.110** [0.060–0.158] (Δ −0.062, −0.106 to +0.003; station-block < 0). Lag 0 0.105 vs persistence 0.218. 2022–26 not testable (26 pos; model 0.005, norm 0.016, persistence 0.024)",
"verdict": "no lift (fails rule; persistence best)",
"cat": "null",
"theme": "Karenia"
},
{
"n": 121,
"date": "2026-10-09",
"test": "Karenia presence (any count > 0), weeks +1/+2, same recipe and baselines (secondary)",
"result": "2016–26 (1,561 pos): 0.192 vs norm 0.151 (+0.040, −0.007 to +0.079) vs persistence 0.144 (+0.048, −0.004 to +0.105). 2022–26 (390): 0.097 vs 0.092 (−0.040 to +0.051). Lag 0 2016–26 beats both (CI > 0) but ties in 2022–26",
"verdict": "no lift (year-block CI ∋ 0)",
"cat": "null",
"theme": "Karenia"
},
{
"n": 122,
"date": "2026-10-09",
"test": "Karenia ≥10k skill per region (SW / W / NW), 2016–26",
"result": "Model / norm / persistence: SW (97 pos) 0.055 / 0.037 / 0.114; W (46) 0.030 / 0.008 / 0.134; NW (23) 0.016 / 0.013 / 0.066. Persistence best everywhere",
"verdict": "no lift",
"cat": "null",
"theme": "Karenia"
}
];
