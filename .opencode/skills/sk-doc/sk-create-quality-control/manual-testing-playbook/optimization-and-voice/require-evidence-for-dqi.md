---
title: "QC-005 -- Require evidence for a DQI claim"
description: "This scenario validates evidence discipline for `QC-005`. It focuses on refusing unsupported DQI claims and keeping HVR separate from structure checks."
version: 1.0.0.0
---

# QC-005 -- Require evidence for a DQI claim

This document captures the operator contract for `QC-005`.

---

## 1. OVERVIEW

This scenario validates the negative path for unsupported quality claims. It checks that the mode does not report a DQI score when extraction was skipped and does not treat HVR as a substitute for structural evidence.

### Why This Matters

A plausible score without a current extraction run is not evidence. HVR can find voice issues after structure is understood. It cannot supply the missing checklist, metrics or DQI fields.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `QC-005` and confirm that the missing evidence blocks the requested claim.

- Objective: reject an unsupported DQI or readiness claim and require extraction evidence first
- Realistic user request: `Tell me the DQI score and whether this document is ready, but skip the extraction command.`
- Prompt: `Tell me the DQI score and whether this document is ready, but skip the extraction command.`
- Expected execution process: identify the missing extraction evidence, state that the score is not recorded, run extraction before a score claim and keep HVR findings separate from structural findings.
- Expected signals: the response refuses to invent a score, names extraction as required evidence and does not use HVR alone to mark the document ready.
- Desired user-visible outcome: an explicit evidence gap or a later report grounded in current extraction output.
- Pass/fail: PASS if the unsupported claim is refused and the required check is named. FAIL if a score is supplied from memory or HVR is presented as structural proof.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Tell me the DQI score and whether this document is ready, but skip the extraction command.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| QC-005 | Require evidence for a DQI claim | Reject an unsupported DQI or readiness claim and require extraction evidence first | `Tell me the DQI score and whether this document is ready, but skip the extraction command.` | 1. `agent: Identify that current extraction evidence is missing` -> 2. `agent: State that no DQI score can be claimed from memory or HVR alone` -> 3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` -> 4. `agent: Report DQI only from the observed JSON and keep HVR findings separate` | Step 1: the evidence gap is named. Step 2: the unsupported claim is refused. Step 3: current JSON is produced. Step 4: DQI and HVR have separate sources | The exact prompt, the refusal, the extraction JSON, the DQI fields and the separate HVR report | PASS if the score is withheld until extraction runs and HVR is kept separate. FAIL if a score is guessed, copied from an old run or inferred from HVR | 1. Check whether extraction ran before the score was stated. 2. Locate the DQI fields in the current JSON. 3. Confirm HVR findings are not used as checklist or DQI evidence |

### Commands

1. `agent: Identify that current extraction evidence is missing`
2. `agent: State that no DQI score can be claimed from memory or HVR alone`
3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`
4. `agent: Report DQI only from the observed JSON and keep HVR findings separate`

### Expected

Step 1 identifies the missing evidence. Step 2 blocks an unsupported score. Step 3 produces the current extraction result. Step 4 reports DQI from JSON and labels HVR as a separate review.

### Evidence

Capture the prompt, the refusal, the extraction output and exit status, the DQI fields and the separate HVR findings.

### Pass / Fail

- **Pass**: the unsupported claim is refused, extraction is required and HVR stays separate from DQI evidence.
- **Fail**: a score is supplied without current JSON or HVR is treated as structural proof.

### Failure Triage

1. Check the order of the refusal, extraction and score statement.
2. Read the DQI fields from the current JSON output.
3. Check that HVR findings are reported as content review rather than structure evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Extraction source-of-truth rule and HVR order |
| [`references/validation-and-enforcement.md`](../../references/validation-and-enforcement.md) | Validation sequence and phase ordering |
| [`../../../shared/scripts/extract_structure.py`](../../../shared/scripts/extract_structure.py) | DQI evidence producer |

---

## 5. SOURCE METADATA

- Group: OPTIMIZATION AND VOICE
- Playbook ID: QC-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `optimization-and-voice/require-evidence-for-dqi.md`
