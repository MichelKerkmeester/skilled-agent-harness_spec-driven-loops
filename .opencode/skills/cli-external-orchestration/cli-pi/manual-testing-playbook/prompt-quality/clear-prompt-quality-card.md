---
title: "PI-019 -- CLEAR prompt-quality card"
description: "This documentation-presence scenario confirms the Pi prompt-quality card delegates to the canonical CLEAR framework and adds Pi dispatch mechanics for `PI-019`."
version: 1.0.0.0
---

# PI-019 -- CLEAR prompt-quality card

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-019`.

---

## 1. OVERVIEW

This scenario checks the Pi-specific prompt-quality card as a thin delegator rather than testing a provider-backed model response.

### Why This Matters

Prompt quality is part of dispatch correctness. The Pi card must preserve the canonical CLEAR checks and add only Pi-specific runtime, mode, scope, guard, tools, evidence, and handback mechanics.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the Pi prompt-quality card exists and mirrors the sibling cli-family card shape without duplicating the canonical taxonomy.
- Real user request: `Before a non-trivial Pi dispatch, apply the CLEAR card, choose the framework, and add the Pi-specific mode, scope, tools, evidence, and handback requirements.`
- Prompt: `Read the Pi prompt-quality card and the sibling cli-family card. Confirm the canonical CLEAR checks are delegated, Pi dispatch addenda are present, and no provider turn is needed for this documentation check.`
- Expected execution process: Read the Pi card -> read the sibling card headings -> verify the canonical source link, three tiers, Pi addenda, composition checklist, and related resources.
- Expected signals: The Pi file exists; it links the canonical CLI prompt-quality card; it contains three tiers, Pi dispatch addenda, composition checks, and related resources; sibling cards have the same five-section contract shape.
- Desired user-visible outcome: A clear PASS that prompt-quality discipline is present before a future non-trivial dispatch.
- Pass/fail: PASS if the file exists and all required headings/links are present. FAIL if the card is missing, duplicates the taxonomy, or omits the Pi-specific safety/evidence fields. No live dispatch is required.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the Pi card exists.
2. Read its full contents.
3. Compare its section shape with the sibling Codex and Cursor cards.
4. Verify the canonical CLEAR source is delegated rather than copied.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-019 | CLEAR prompt-quality card | Confirm docs presence and Pi-specific addenda | `Read the Pi prompt-quality card and the sibling cli-family card. Confirm the canonical CLEAR checks are delegated, Pi dispatch addenda are present, and no provider turn is needed for this documentation check.` | `test -f .opencode/skills/cli-external-orchestration/cli-pi/assets/prompt-quality-card.md` -> `rg -n '^#|^## ' .opencode/skills/cli-external-orchestration/cli-pi/assets/prompt-quality-card.md` -> `rg -n '^#|^## ' .opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-quality-card.md .opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-quality-card.md` -> read the Pi card | Pi file exists; Pi headings are `CANONICAL SOURCE`, `THREE TIERS`, `PI DISPATCH ADDENDA`, `COMPOSITION CHECK`, `RELATED`; sibling cards use the same five-section pattern | Captured output: Pi file check returned `yes`; sibling headings showed five numbered sections; Pi headings showed five numbered sections. The Pi card links the canonical CLI card and includes runtime, mode, scope, guard, tools, evidence, and handback checks. | PASS when presence, shape, delegation, and addenda are confirmed. FAIL if any required card element is missing. | Compare the actual card text with the canonical source and remove duplicated taxonomy rather than inventing a second framework. |

### Optional Supplemental Checks

- Run the repository's prompt-quality-card sync guard and retain its output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Prompt-quality placement and evidence policy |
| `../../SKILL.md` | Prompt construction and resource precedence |
| `../../assets/prompt-quality-card.md` | Pi-specific prompt-quality delegator |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-quality-card.md` | Sibling card shape |
| `.opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-quality-card.md` | Sibling card shape |
| `.opencode/skills/sk-prompt/prompt-models/assets/cli-prompt-quality-card.md` | Canonical CLEAR source |

---

## 5. SOURCE METADATA

- Group: Prompt Quality
- Playbook ID: PI-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-quality/clear-prompt-quality-card.md`
