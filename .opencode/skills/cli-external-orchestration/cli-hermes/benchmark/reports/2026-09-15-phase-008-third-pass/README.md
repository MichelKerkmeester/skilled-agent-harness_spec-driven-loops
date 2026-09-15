# 2026-09-15-phase-008-third-pass

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live and hermetic · cli-pi orchestrator on llmgateway/deepseek-v4.1-flash (--thinking high) · sessions on glm-5.3-flash · phase-008-third-pass

**Verdict: PASS**

## 1. OVERVIEW

| Field | Value |
|---|---|
| Target skill | cli-hermes |
| Scoring method | not-recorded |
| Trace mode | live (30) and hermetic (14) |
| Orchestrator | cli-pi, three parallel workers on `llmgateway/deepseek-v4.1-flash` at `--thinking high` |
| Session model | glm-5.3-flash (llmgateway) |
| CLI version | Hermes Agent v0.21.1 (2026.9.7) · upstream dc90a75a |
| Supersedes | `2026-09-14-phase-008-second-pass` |
| Scenarios | 44: 30 live, 14 hermetic |
| Outcome tally | 43 PASS, 1 FAIL |

Every live scenario was executed by a Pi worker reading the scenario file and running its §3 command sequence; the fourteen hermetic cells ran in the runtime stress suite, which reported 18 of 18 including the opt-in live transport probe. Four scenarios failed on their first attempt and were re-run after the cause was isolated; two of those isolations found real defects in the plugin and one found two stale claims in the packet's own documentation.

The single remaining FAIL is `HERMES-010`, where the two roster models disagreed about a Hermes flag. The scenario exists to surface exactly that, and the transport was healthy on both sides, so the failure is a model signal rather than a product defect.

---

## 2. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`results.csv`](./results.csv) | One row per checked behavior, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | The one FAIL, and the four first-attempt failures with their causes |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | What this pass changed in the product and in the scenarios |
| [`source.md`](./source.md) | Where the packet, playbook, prior run and raw evidence live |

---

## 3. READING THIS FOLDER

This is a curated report. Raw execution evidence stays in the session that produced it, named in `source.md`, with each scenario file's Recorded Result carrying the load-bearing lines for that scenario.
