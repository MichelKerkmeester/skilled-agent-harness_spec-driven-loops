---
title: "cli-hermes Benchmark Artifacts"
description: "Benchmark tree for cli-hermes holding playbook-derived validation reports, indexed by run label, newest first."
trigger_phrases:
  - "cli-hermes benchmark"
  - "cli-hermes validation report"
  - "cli-hermes manual testing playbook benchmark"
importance_tier: "normal"
contextType: "general"
---

# cli-hermes Benchmark Artifacts

> Curated, derived-after-the-fact reports for cli-hermes manual-testing-playbook validation runs, kept beside the CLI they measure. This file indexes the tree; `reports/README.md` carries the per-run index.

---

## 1. OVERVIEW

This `benchmark/` tree holds reports derived from manual-testing-playbook validation runs, in the seven-file shape `create-benchmark` defines for a report package. It is not the deep-improvement Lane C skill-benchmark harness, and no dimension scoring applies. Every file inside a run-label folder carries the marker `_Derived after the fact from this run's stored record, not written at run time._`.

---

## 2. RUN-LABEL INDEX

| Run label | Trace mode | Verdict | Scenarios | Source |
|---|---|---|---|---|
| [`2026-09-15-phase-008-third-pass`](./reports/2026-09-15-phase-008-third-pass/) | live + hermetic, cli-pi on deepseek-v4.1-flash (high), sessions glm-5.3-flash | **PASS** | 30 live (29 PASS, 1 FAIL) plus 14 hermetic (14 PASS) | `specs/cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog` |
| [`2026-09-14-phase-008-second-pass`](./reports/2026-09-14-phase-008-second-pass/) | live, glm-5.3-flash via llmgateway | **PASS** | 22 live (22 PASS) plus 14 hermetic SKIP | The playbook phase of `specs/cli-external-orchestration/071-cli-hermes-creation` |
| [`2026-09-14-phase-008-first-pass`](./reports/2026-09-14-phase-008-first-pass/) | live, glm-5.3-flash via llmgateway | **FAIL** (superseded) | 19 live (17 PASS, 2 FAIL) plus 14 hermetic SKIP | The playbook phase of `specs/cli-external-orchestration/071-cli-hermes-creation` |

The third pass is the first to run all 44 in one sitting. It fixed two plugin defects (advisories staged across bounded hooks; the vision core on the fail-closed hook), corrected two false documentation claims, and rewrote two scenarios that could not fail honestly. Its one FAIL is `HERMES-010`, where the two roster models disagreed about a Hermes flag, which the scenario exists to surface.

The first pass recorded FAIL on two scenarios with located causes: `HERMES-009`, where a run exited 0 with an empty response, and `HERMES-014`, where the git preflight advisory did not reach a Hermes session. Both were fixed in the surfaces that owned them, and the second pass re-executed every live scenario against those fixes and closed all four first-pass findings. The first pass is retained unchanged: a run whose result changes gets a new folder.

---

## 3. HOW TO ADD A RUN

1. Execute the scenarios in `../manual-testing-playbook/` and keep the raw evidence with the executing session.
2. Package the run with `create-benchmark`'s report shape under `reports/<date>--manual-testing-playbook--<topic>/`.
3. Add a row above and a row in `reports/README.md`, and cite the packet phase that produced it.
