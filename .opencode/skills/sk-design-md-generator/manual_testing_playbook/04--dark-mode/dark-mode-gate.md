---
title: "DARKMODE-001 -- Dark-Mode Section Appears Only When Detected"
description: "This scenario validates the dark-mode gate for DARKMODE-001. It focuses on confirming DESIGN.md section 2.5 Dark Mode appears only when tokens.json contains a detected dark-mode palette and is never fabricated from light tokens."
---

# DARKMODE-001 -- Dark-Mode Section Appears Only When Detected

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DARKMODE-001`.

---

## 1. OVERVIEW

This scenario validates the dark-mode gate for `DARKMODE-001`. It focuses on confirming the DESIGN.md §2.5 Dark Mode section appears ONLY when `tokens.json` contains a detected dark-mode palette (non-empty `darkMode` object), and is omitted when no dark palette was detected. The skill must never derive or fabricate a dark palette from the light tokens.

### Why This Matters

A fabricated dark palette is a hallucination — it produces colors that do not exist on the live site. Downstream consumers (`sk-code`, `sk-design-interface`) would build against invented dark-mode values, producing incorrect dark themes. The failure mode this guards against is a DESIGN.md that presents a dark-mode section the skill guessed from inverting light-mode colors.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `DARKMODE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the dark-mode section is conditional on extraction evidence and never fabricated
- Real user request: `Does the DESIGN.md have a dark-mode section? Show me the condition.`
- Prompt: `Does the DESIGN.md have a dark-mode section? Show me the condition.`
- Expected execution process: inspect `tokens.json` for the `darkMode` object; if `darkMode` is present and non-empty (has `variableDiff` or `darkTokens`), confirm DESIGN.md §2.5 Dark Mode exists and contains those values verbatim. If `darkMode` is absent or empty, confirm DESIGN.md has no §2.5 Dark Mode section. If the extractor was run with `--no-dark-mode`, confirm §2.5 is absent regardless of whether the site has a dark palette
- Expected signals: DESIGN.md §2.5 exists iff tokens.json.darkMode is present and non-empty; no dark-mode section appears from fabrication or derivation
- Desired user-visible outcome: the agent states the condition, points to the evidence in tokens.json, and confirms the DESIGN.md gate was followed
- Pass/fail: PASS if §2.5 exists iff tokens.json.darkMode is non-empty AND no dark-mode section was fabricated from light tokens; FAIL if §2.5 appears without a detected dark palette OR is missing when darkMode is non-empty OR contains derived/invented dark values

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Dark-mode inspection is read-only and stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Waves 1 (SETUP-001 PASS) and 2 (EXTRACT-001 PASS) must be complete. For the positive branch (dark palette detected), choose a site known to have a dark mode with a `prefers-color-scheme` media query. For the negative branch (no dark palette), choose a site without a dark mode, or re-run extraction with `--no-dark-mode`.

1. `bash: node -e "const t = require('./<--output>/tokens.json'); console.log('darkMode present:', !!t.darkMode); if(t.darkMode) { console.log('detectionMethod:', t.darkMode.detectionMethod); console.log('has variableDiff:', !!t.darkMode.variableDiff?.length); console.log('has darkTokens:', !!t.darkMode.darkTokens?.length) }"` (run from `tool/`)  # -> darkMode metadata printed
2. `bash: rg -c '## 2\.5 Dark Mode' <DESIGN.md>` or `bash: rg -c 'Dark Mode' <DESIGN.md>`  # -> 1 if present, 0 if absent
3. if darkMode is non-empty: read DESIGN.md §2.5 and spot-check 3 dark hex values against tokens.json.darkMode  # -> verbatim match
4. if darkMode is absent/empty: confirm no §2.5 section exists and no dark-mode hex values appear elsewhere in DESIGN.md  # -> clean absence
5. agent reports the correlation: darkMode presence/absence in tokens.json matches §2.5 presence/absence in DESIGN.md

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DARKMODE-001 | Dark-mode gate | Verify DESIGN.md §2.5 appears only when tokens.json has a detected dark palette and is never fabricated | `Does the DESIGN.md have a dark-mode section? Show me the condition.` | 1. `read: <--output>/tokens.json` (inspect `darkMode` field) -> 2. `read: <DESIGN.md>` (search for `## 2.5 Dark Mode` or equivalent) -> 3. correlate — if darkMode present and non-empty, §2.5 must exist with verbatim dark values; if absent/empty, §2.5 must not exist -> 4. agent reports the gate condition and the evidence | Step 1: darkMode present (with variableDiff/darkTokens) or absent/empty. Step 2: §2.5 present or absent. Step 3: presence/absence aligns exactly. Step 4: agent names the evidence, does not fabricate a dark palette | tokens.json darkMode snippet and the corresponding DESIGN.md section 2.5 (or its absence) | PASS if §2.5 exists iff tokens.json.darkMode is non-empty AND no dark-mode section was fabricated from light tokens. FAIL if §2.5 appears without a detected dark palette OR is missing when darkMode is non-empty OR contains derived/invented dark values | 1. Check `dark-mode-detect.ts` detection method in tokens.json (`media-query`, `class-toggle`, etc.). 2. If the site has a dark mode but it was not detected (JS class toggle), note it as a known gap (troubleshooting.md §3) and SKIP the scenario or mark it PASS with a documented gap. 3. Confirm `--no-dark-mode` was NOT used (unless testing that branch explicitly). |

### Optional Supplemental Checks

Run a second extraction of the same site with `--no-dark-mode` and confirm §2.5 is absent regardless of whether the site has a dark palette — this proves the flag suppresses detection. Test with a site that toggles dark mode via a JS class (not a media query) and confirm the dark-mode gap is documented per `references/troubleshooting.md` §3, rather than fabricated.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../tool/scripts/dark-mode-detect.ts` | Dark-mode detection — keys on `prefers-color-scheme` media query, collects CSS variable diffs across viewports |
| `../../tool/scripts/extract.ts` | Orchestrator — passes `noDarkMode` flag, calls `detectDarkMode` |
| `../../tool/scripts/types.ts` | Type definitions — `DarkModeData` with detectionMethod, variableDiff, darkTokens |
| `../../tool/resources/design_md_format.md` | v2 section specification — §2.5 Dark Mode placement and content rules |
| `../../references/troubleshooting.md` | §3 Crawl Failures — dark-mode detection gaps and recovery |
| `../../SKILL.md` | §3 Cardinal Fidelity Rule (dark mode paragraph), §4 ALWAYS rule 6, §4 ESCALATE IF rule 2 |

---

## 5. SOURCE METADATA

- Group: Dark Mode
- Playbook ID: DARKMODE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--dark-mode/dark-mode-gate.md`
