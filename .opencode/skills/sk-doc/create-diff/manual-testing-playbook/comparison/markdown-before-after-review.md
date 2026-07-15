---
title: "CMP-001 -- Markdown before/after review"
description: "This scenario validates Markdown before/after review for `CMP-001`. It focuses on producing a correct, full-fidelity before/after report from two versions of a Markdown document."
stage: routing
version: 1.0.0.0
---

# CMP-001 -- Markdown before/after review

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CMP-001`.

---

## 1. OVERVIEW

This scenario validates Markdown before/after review for `CMP-001`. It focuses on producing a correct, full-fidelity before/after report from two versions of a Markdown document.

### Why This Matters

Markdown is the native format for the guides, specs, and READMEs users edit most, and it is the one format the engine compares at full fidelity. If a full-fidelity Markdown diff miscounts additions, misses reworded sentences, or emits an unreadable report, the entire before/after value proposition fails at its strongest case. This scenario locks the deterministic baseline (`+4 -0 ~5`, `unchanged 12`) against the shipped fixtures so any regression in extraction, diff, or report generation is caught immediately.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMP-001` and confirm the expected signals without contradictory evidence.

- Objective: produce a correct, full-fidelity before/after report from two versions of a Markdown document
- Real user request: `Show me what changed between these two versions of my onboarding guide.`
- Prompt: `Show me what changed between these two versions of my onboarding guide.`
- Expected execution process: the engine extracts both Markdown files at full fidelity, runs `compare-pair` over the shipped fixtures, and writes a self-contained HTML report; the validator then confirms the report is safe.
- Expected signals: a `markdown, tier full` summary line, the deterministic counts `+4 -0 ~5 moves≈0 unchanged 12`, a written report path, and a validator `PASS`.
- Desired user-visible outcome: a self-contained HTML report the user can open offline that clearly shows the additions and the reworded sentences.
- Pass/fail: PASS if the summary reports `markdown, tier full` with `+4 -0 ~5 unchanged 12`, the report is written, and the validator returns `PASS`; FAIL if the counts differ, the tier is not `full`, no report is produced, or the validator returns `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me what changed between these two versions of my onboarding guide.`

### Commands

1. `python3 scripts/create_diff.py compare-pair --before assets/fixtures/onboarding-before.md --after assets/fixtures/onboarding-after.md --report /tmp/onboarding-review.html`
2. `python3 scripts/validate_report.py /tmp/onboarding-review.html`

### Expected

Step 1 prints `Compared onboarding-before.md → onboarding-after.md (markdown, tier full)`, then a counts line `  +4  −0  ~5  moves≈0  unchanged 12`, then `  report: /tmp/onboarding-review.html`, and exits `0`. Step 2 prints `PASS` and exits `0`.

### Evidence

Capture the full stdout of step 1 (summary + counts + report path), the exit code of step 1, the step 2 validator verdict, and the path to the generated `/tmp/onboarding-review.html`. Optionally re-run step 1 with `--json` and record the emitted object (`added`, `removed`, `changed`, `unchanged`, `fidelity_tier`).

### Pass / Fail

- **Pass**: step 1 exits `0` with a `markdown, tier full` summary and `+4 −0 ~5 unchanged 12`, a report is written, and step 2 returns `PASS`.
- **Fail**: step 1 reports different counts, a tier other than `full`, produces no report, or step 2 returns `FAIL`.

### Failure Triage

1. Confirm the working directory is the packet root `.opencode/skills/sk-doc/create-diff/` so the `assets/fixtures/` paths resolve.
2. Confirm Python 3.9+ is on `PATH` and that both fixture files exist and are byte-unchanged.
3. Re-run step 1 with `--json` to inspect the individual `added`/`removed`/`changed`/`unchanged` fields and isolate whether the drift is in extraction or in the diff.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/comparison-engine/multi-format-extraction.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: COMPARISON
- Playbook ID: CMP-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `comparison/markdown-before-after-review.md`
