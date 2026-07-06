---
title: "PROCCARD-002 -- md-generator no-card fallback"
description: "This scenario validates the exact md-generator no-procedure fallback line and baseline pipeline continuation."
version: 1.0.0.0
---

# PROCCARD-002 -- md-generator no-card fallback

## 1. OVERVIEW

This scenario validates `Procedure applied: none - baseline md-generator pipeline` when no measured-extraction card trigger matches.

### Why This Matters

md-generator's fallback is pipeline-specific. It must not be rewritten as the Read/Glob/Grep-only fallback used by advisory modes.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm md-generator states the exact no-card fallback and continues with phase detection and resource router.
- Real user request: `Study the existing style reference as a calibration example without extracting or writing measured artifacts.`
- Prompt: `md-generator: study this existing DESIGN.md as a calibration example and state whether the measured-extraction procedure card applies before continuing.`
- Expected execution process: Read `SKILL.md`; confirm the request does not involve measured extraction, token capture, CSS capture, screenshots, or source-system grounding; state exact fallback; continue with phase detection (`STUDY`) and resource router.
- Expected signals: Exact fallback line appears; no `design_system_extraction.md` selected; backend boundary remains available but unused unless a pipeline phase requires it.
- Desired user-visible outcome: Study/calibration response with explicit baseline-pipeline fallback.
- Pass/fail: PASS if exact fallback appears and phase detection continues; FAIL if card is invented or fallback says read-only advisory workflow.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PROCCARD-002 | md-generator no-card fallback | Verify exact baseline pipeline fallback | `md-generator: study this existing DESIGN.md as a calibration example and state whether the measured-extraction procedure card applies before continuing.` | grep fallback in `SKILL.md` -> agent: run prompt -> inspect proof line and phase detection | Exact fallback appears; phase detection continues; no extraction card selected | Transcript and response | PASS if exact fallback appears with pipeline language; FAIL if read-only fallback or invented card appears | 1. Re-read fallback line; 2. Check prompt for extraction triggers; 3. Confirm phase detection remains active |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Exact no-card fallback and phase detection |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: PROCCARD-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--procedure-card-contract/no-card-fallback.md`
