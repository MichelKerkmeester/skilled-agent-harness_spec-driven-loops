# 2026-11-21--two-stage-replay--compiled

> mcp-browser-use · two-stage routing replay · advisor plus compiled front door · policy `dd699363`, generation 1

**Verdict: PASS, 6 of 6**

---

## 1. OVERVIEW

This run replays six real browser requests through both routing stages. Stage one is the skill advisor, which must rank `mcp-browser-use` first and above its default threshold. Stage two is the hub's compiled front door, which must return `action: route`, `selectionKind: single` and the expected mode. A row passes only when both stages pass and `mcp-tooling` stays below threshold.

Three requests name their tool, one per mode. Three more name no tool and test the tie-break between modes.

---

## 2. RUN

| Field | Value |
|---|---|
| Target hub | `mcp-browser-use` |
| Stage one | `skill_advisor.py "<request>"`, default threshold |
| Stage two | `compiled-route.cjs --hub mcp-browser-use --prompt "<request>"` |
| Serving authority | compiled, policy hash `dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698`, generation 1 |
| Scenarios | 6 |
| Outcome tally | 6 PASS, 0 FAIL |
| Recorded at | 2026-11-21T15:01:47Z |

---

## 3. RESULTS

| Scenario | Kind | Request | Advisor | Front door | Verdict |
|---|---|---|---|---|---|
| MBU-R-01 | mode | debug this page with chrome devtools and take a screenshot | mcp-browser-use 0.95 | mcp-chrome-devtools | PASS |
| MBU-R-02 | mode | use aside to fill this form in my signed-in account | mcp-browser-use 0.93 | mcp-aside-devtools | PASS |
| MBU-R-03 | mode | use bladebro to attach to my open browser and finish the checkout flow | mcp-browser-use 0.92 | mcp-bladebro | PASS |
| MBU-T-01 | tie-break | replay this signed-in checkout step by step and save the evidence | mcp-browser-use 0.83 | mcp-aside-devtools | PASS |
| MBU-T-02 | tie-break | in the browser I already have open, work out how to finish this signup | mcp-browser-use 0.83 | mcp-bladebro | PASS |
| MBU-T-03 | tie-break | export a HAR of this page load | mcp-browser-use 0.92 | mcp-chrome-devtools | PASS |

### Hit rate per mode

| Mode | Hits | Rate |
|---|---|---|
| mcp-chrome-devtools | 2 of 2 | 100% |
| mcp-aside-devtools | 2 of 2 | 100% |
| mcp-bladebro | 2 of 2 | 100% |

`mcp-tooling` was below threshold on all six requests.

---

## 4. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |
| [`source.md`](./source.md) | How the run was produced and what it does not cover |
