---
title: "AGV-001 -- Required agent sections"
description: "This scenario validates the required body sections for a production-ready agent and the shared structure checks that inspect them."
version: 1.0.0.0
---

# AGV-001 -- Required agent sections

This document captures the body structure and validation contract for an agent draft.

---

## 1. OVERVIEW

This scenario validates `AGV-001`. It focuses on the hard boundary, core workflow, capability scan, output verification, anti-patterns and related resources required by the mode.

### Why This Matters

Frontmatter can parse while the body still lacks the instructions that make a role safe to use. The agent template and shared validator expose that boundary before runtime use.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `AGV-001`.

- Objective: inspect an agent draft for the required body sections and validate its structure.
- Realistic user request: `Review this new agent draft and tell me whether it has every required body section before I use it.`
- Prompt: `Review this new agent draft and tell me whether it has every required body section before I use it.`
- Expected execution process: read `assets/agent-template.md`, list the required body sections, run document validation and extract the structure.
- Expected signals: each required section is named, missing headings are called out and the validator exit status is recorded.
- Desired user-visible outcome: the operator gets a section-level result that does not confuse valid frontmatter with a complete agent.
- Pass/fail: PASS if the required sections are checked and the validation commands run. FAIL if the body is accepted without the section check or the output is unverified.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this new agent draft and tell me whether it has every required body section before I use it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AGV-001 | Required agent sections | Check the six required body responsibilities and validate structure | `Review this new agent draft and tell me whether it has every required body section before I use it.` | 1. `agent: Read assets/agent-template.md and list the required body responsibilities` -> 2. `agent: Inspect the draft for boundary, workflow, capability, verification, anti-pattern and related-resource sections` -> 3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/release-note-reviewer.md --type agent` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/agents/release-note-reviewer.md` | Step 1: six responsibilities are named. Step 2: each maps to an observed heading or a missing heading. Step 3: validation output and exit status are captured. Step 4: extracted headings match the review | The prompt, required section list, draft heading inspection and both command transcripts | PASS if the body review and both checks are complete. FAIL if a missing section is ignored, frontmatter alone is accepted or a command is not run | 1. Compare the draft with the template responsibilities. 2. Check the exact heading names accepted by the validator. 3. Re-run structure extraction after any heading change |

### Commands

1. `agent: Read assets/agent-template.md and list the required body responsibilities`
2. `agent: Inspect the draft for boundary, workflow, capability, verification, anti-pattern and related-resource sections`
3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/agents/release-note-reviewer.md --type agent`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/agents/release-note-reviewer.md`

### Expected

Step 1 reads the template rather than relying on memory. Step 2 maps each body responsibility to a heading. Step 3 runs the blocking validator. Step 4 provides an independent heading view for review.

### Evidence

Capture the prompt, template section list, heading inspection and both command outputs with exit statuses.

### Pass / Fail

- **Pass**: all six body responsibilities are checked and both validation commands are shown.
- **Fail**: the draft is accepted from frontmatter alone, a missing section is not named or either command is absent.

### Failure Triage

1. Re-read `assets/agent-template.md` and compare the body section by section.
2. Run `extract_structure.py` to distinguish a missing heading from a misplaced heading.
3. Run `validate_document.py` again after the draft is corrected.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Required body shape and validation gate |
| [`../../assets/agent-template.md`](../../assets/agent-template.md) | Canonical agent scaffold |
| [`../../../shared/scripts/validate_document.py`](../../../shared/scripts/validate_document.py) | Blocking document validator |
| [`../../../shared/scripts/extract_structure.py`](../../../shared/scripts/extract_structure.py) | Structure extraction check |

---

## 5. SOURCE METADATA

- Group: BODY VALIDATION
- Playbook ID: AGV-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `body-validation/required-agent-sections.md`
