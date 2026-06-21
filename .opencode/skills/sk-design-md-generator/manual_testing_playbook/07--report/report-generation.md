---
title: "REPORT-001 -- Report And Preview Generation"
description: "This scenario validates report, preview, and proof generation for REPORT-001. It focuses on confirming report-gen.ts, preview-gen.ts, and proof.ts each run and emit their HTML/visual artifacts from a DESIGN.md + tokens.json pair."
---

# REPORT-001 -- Report And Preview Generation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `REPORT-001`.

---

## 1. OVERVIEW

This scenario validates report, preview, and proof generation for `REPORT-001`. It focuses on confirming `report-gen.ts`, `preview-gen.ts`, and `proof.ts` each accept a `tokens.json` (and where applicable a `DESIGN.md` or source URL) as input and produce valid HTML/visual artifacts with no errors. The three scripts cover distinct review needs: a token-to-section HTML report for provenance auditing, a CSS visual preview that renders the design system as styled HTML, and a fidelity proof that compares live extraction against the token set.

### Why This Matters

Report generation is Phase 4 of the pipeline. It produces the artifacts that humans review before signing off on an extraction -- the HTML report shows exactly which tokens flow into which DESIGN.md sections, the visual preview confirms the tokens render as a real design system, and the fidelity proof catches any drift between the live site and the captured token set. If any of these scripts crashes silently or writes empty output, the operator may approve a DESIGN.md that misrepresents the source site.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `REPORT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm all three report-generation scripts run successfully against a tokens.json + DESIGN.md pair and produce valid artifacts
- Real user request: `Generate a visual report of the extracted design system.`
- Prompt: `Generate a visual report of the extracted design system.`
- Expected execution process: detect the REPORT phase from the request, verify tool readiness, confirm an existing `<--output>/tokens.json` and `<--output>/DESIGN.md` (or `design.md`) are present, run `report-gen.ts` with tokens.json as first arg, `preview-gen.ts` with tokens.json as first arg, and `proof.ts` with source URL + tokens.json, then confirm each emits its artifact file
- Expected signals: `report-gen.ts` exits 0 and writes `report.html` with HTML content > 1 KB; `preview-gen.ts` exits 0 and writes `preview.html` with HTML content > 1 KB; `proof.ts` exits 0 and writes `proof.html` and `proof-data.json`; no script writes an empty file or crashes with an uncaught error
- Desired user-visible outcome: the agent reports that three artifacts were generated, lists their output paths, and summarizes the report contents (token counts, quality score if validation data is present, fidelity coverage percentage)
- Pass/fail: PASS if all three scripts exit 0 AND each writes a non-empty artifact file; FAIL if any script exits non-zero OR writes an empty/missing artifact OR reports fabricated metrics

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Report generation stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. The `tool/node_modules/` directory must exist and `npx playwright install chromium` must have completed. An existing `tokens.json` and `DESIGN.md` from a prior extraction are required; extract from `https://example.com --fast` first if they do not exist.

1. agent detects REPORT phase  # -> phase detection output
2. verify tool readiness: `bash: node --version`, glob `tool/node_modules/`  # -> Node >= 18, node_modules exists
3. verify input files exist: glob `<--output>/tokens.json` and glob `<--output>/DESIGN.md` (or `design.md`)  # -> both files present
4. `cd .opencode/skills/sk-design-md-generator/tool && npx ts-node scripts/report-gen.ts <--output>/tokens.json <--output>/ <--output>/DESIGN.md`  # -> exits 0, writes report.html
5. `bash: ls -la <--output>/report.html`  # -> file exists, > 1 KB
6. `cd .opencode/skills/sk-design-md-generator/tool && npx ts-node scripts/preview-gen.ts <--output>/tokens.json <--output>/`  # -> exits 0, writes preview.html
7. `bash: ls -la <--output>/preview.html`  # -> file exists, > 1 KB
8. `cd .opencode/skills/sk-design-md-generator/tool && npx ts-node scripts/proof.ts https://example.com <--output>/tokens.json <--output>/`  # -> exits 0, writes proof.html + proof-data.json
9. `bash: ls -la <--output>/proof.html <--output>/proof-data.json`  # -> both files exist, proof-data.json is valid JSON
10. agent reports artifact paths and summary

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| REPORT-001 | Report and preview generation | Verify all three report-generation scripts run and emit valid HTML/visual artifacts | `Generate a visual report of the extracted design system.` | 1. agent detects REPORT phase -> 2. verify tool readiness (`node --version`, check `tool/node_modules/`) -> 3. confirm `tokens.json` and `DESIGN.md` exist -> 4. `cd tool && npx ts-node scripts/report-gen.ts <--output>/tokens.json <--output>/ <--output>/DESIGN.md` -> 5. `ls -la <--output>/report.html` -> 6. `cd tool && npx ts-node scripts/preview-gen.ts <--output>/tokens.json <--output>/` -> 7. `ls -la <--output>/preview.html` -> 8. `cd tool && npx ts-node scripts/proof.ts https://example.com <--output>/tokens.json <--output>/` -> 9. `ls -la <--output>/proof.html <--output>/proof-data.json` -> 10. agent reports artifact paths and summary | Step 3: tokens.json and DESIGN.md found. Step 4: report-gen exits 0, writes report.html with HTML content > 1 KB. Step 6: preview-gen exits 0, writes preview.html with HTML content > 1 KB. Step 8: proof exits 0, writes proof.html and proof-data.json. Step 10: agent reports counts, score, and fidelity coverage from the artifacts. | Transcript of each script run, `ls -la` of output directory, artifact file size checks, proof-data.json parse validation | PASS if all three scripts exit 0 AND each writes a non-empty artifact file. FAIL if any script exits non-zero OR writes an empty/missing artifact OR agent reports fabricated metrics | 1. Confirm `tokens.json` is valid JSON with non-empty token arrays. 2. Confirm `DESIGN.md` exists and is readable. 3. Check script stderr for parse errors or missing dependency messages. 4. Run `npx ts-node scripts/proof.ts` last since it depends on `preview.html` generated by preview-gen. 5. If the source URL is unreachable (403/429), skip proof.ts with a blocker note and route to ESCALATE-001. |

### Optional Supplemental Checks

If the user wants to confirm the report embeds validation data, run `validate.ts` against the DESIGN.md + tokens.json pair first, then re-run `report-gen.ts` with the DESIGN.md argument so the report includes the quality score ring and per-check pass/fail detail. If the source site has changed since extraction, the proof fidelity percentage may drop below 85%; note the coverage percentage but do not fail the scenario since the scripts themselves ran correctly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../tool/scripts/report-gen.ts` | Token-to-section HTML report generator -- takes tokens.json as first arg, optional output dir and DESIGN.md |
| `../../tool/scripts/preview-gen.ts` | Visual CSS preview renderer -- takes tokens.json as first arg, optional output dir |
| `../../tool/scripts/proof.ts` | Fidelity proof generator -- takes URL as first arg, tokens.json as second arg, optional output dir and preview.html |
| `../../tool/scripts/validate.ts` | DESIGN.md validator -- consumed by report-gen to embed quality score and per-check results |
| `../../SKILL.md` | SS3 HOW IT WORKS -- the four-phase pipeline with REPORT as optional Phase 4 |

---

## 5. SOURCE METADATA

- Group: Report
- Playbook ID: REPORT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--report/report-generation.md`
