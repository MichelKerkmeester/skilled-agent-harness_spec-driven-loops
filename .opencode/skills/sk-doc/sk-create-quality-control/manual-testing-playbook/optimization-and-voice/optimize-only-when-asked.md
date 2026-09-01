---
title: "QC-004 -- Optimize only when asked"
description: "This scenario validates scoped content optimization for `QC-004`. It focuses on targeted patterns, same-file edits and post-edit checks."
version: 1.0.0.0
---

# QC-004 -- Optimize only when asked

This document captures the operator contract for `QC-004`.

---

## 1. OVERVIEW

This scenario validates the explicit optimization path for an existing README. It checks a baseline, targeted transformation choices, a same-file edit, format validation, packet validation and post-edit extraction.

### Why This Matters

Optimization has a larger mutation boundary than a report-only audit. The mode must inspect the current document, choose patterns for observed gaps, preserve correct content and prove the resulting quality state with the full post-edit sequence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `QC-004` and compare the post-edit evidence with the baseline.

- Objective: improve an existing README with targeted question-focused examples and prove the result after editing
- Realistic user request: `Rewrite this existing README for AI-friendly usage examples. Keep the change narrow and validate it after editing.`
- Prompt: `Rewrite this existing README for AI-friendly usage examples. Keep the change narrow and validate it after editing.`
- Expected execution process: extract the current structure, identify import-only or API-only gaps, choose only needed transformation patterns, edit the same README, validate the README, run quick validation on the containing packet and re-extract structure.
- Expected signals: the edit answers practical questions, code examples have language tags and needed setup, validation runs after the edit and the post-edit extraction is compared with the baseline.
- Desired user-visible outcome: a focused README improvement with evidence of what changed.
- Pass/fail: PASS if the edit is authorized, targeted and followed by all required checks. FAIL if the mode rewrites unrelated content, adds unsupported claims or skips post-edit validation or extraction.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Rewrite this existing README for AI-friendly usage examples. Keep the change narrow and validate it after editing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| QC-004 | Optimize only when asked | Improve an existing README with targeted examples and prove the result after editing | `Rewrite this existing README for AI-friendly usage examples. Keep the change narrow and validate it after editing.` | 1. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py README.md` -> 2. `agent: Identify observed question-coverage and snippet gaps and choose only needed patterns` -> 3. `agent: Edit README.md narrowly and preserve supported content` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py README.md --type readme` -> 5. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .` -> 6. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py README.md` | Step 1: baseline JSON is captured. Step 2: patterns map to observed gaps. Step 3: only the target README changes. Step 4: README validation passes. Step 5: packet validation passes. Step 6: post-edit JSON is compared with baseline | The exact prompt, baseline and post-edit JSON, chosen patterns, scoped diff, all command outputs and exit statuses and the final report | PASS if the edit is authorized, targeted and all post-edit checks run. FAIL if unrelated content changes, claims are fabricated or any required check is skipped | 1. Compare the diff with the requested README scope. 2. Check every added example for imports, setup, syntax and a user question. 3. Compare pre-edit and post-edit extraction results |

### Commands

1. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py README.md`
2. `agent: Identify observed question-coverage and snippet gaps and choose only needed patterns`
3. `agent: Edit README.md narrowly and preserve supported content`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py README.md --type readme`
5. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .`
6. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py README.md`

### Expected

Step 1 captures the starting structure. Step 2 chooses transformations from the observed gaps. Step 3 changes only the requested README. Steps 4 and 5 run the format and containing-packet checks. Step 6 produces the post-edit evidence used for comparison.

### Evidence

Capture the prompt, baseline and post-edit extraction output, chosen pattern names, scoped diff, all command transcripts and exit statuses.

### Pass / Fail

- **Pass**: the edit is explicitly requested, stays on the target README, uses supported evidence and passes all post-edit checks.
- **Fail**: the mode edits without authorization, broadens the diff, fabricates claims or skips validation or extraction.

### Failure Triage

1. Compare the diff with the target named in the prompt.
2. Inspect each added example for imports, setup, language tags and a practical question.
3. Compare baseline and post-edit extraction output, including checklist results and DQI.

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
| [`SKILL.md`](../../SKILL.md) | Explicit optimization workflow and post-edit checks |
| [`references/optimization.md`](../../references/optimization.md) | Analysis workflow and quality checklist |
| [`references/transformation-patterns.md`](../../references/transformation-patterns.md) | Targeted before and after patterns |
| [`../../../shared/scripts/extract_structure.py`](../../../shared/scripts/extract_structure.py) | Pre-edit and post-edit structure evidence |

---

## 5. SOURCE METADATA

- Group: OPTIMIZATION AND VOICE
- Playbook ID: QC-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `optimization-and-voice/optimize-only-when-asked.md`
