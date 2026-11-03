---
title: "Feature Specification: Phase 3: conversation-adoption-research"
description: "Research which playbook scenarios across every skill and skill mode should adopt the json conversation format, which should stay single prompt and where conversation coverage is missing."
trigger_phrases:
  - "conversation adoption research"
  - "phase 3 conversation adoption research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: conversation-adoption-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-02 |
| **Branch** | `scaffold/003-conversation-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-conversation-runner |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` ranks every candidate with its deciding question, and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Audit every skill and skill mode for playbook scenarios that should adopt the json conversation format specification.

**Scope Boundary**: Read-only research over every skill, every skill mode packet and every manual testing playbook package. No playbook, skill or runner file changes in this phase.

**Dependencies**:
- The style rule in `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` §6, Choosing the Scenario Style
- The conversation runner and its format from phase 002

**Deliverables**:
- `research/research.md`: a per-skill and per-mode adoption map with a ranked candidate list
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository holds 56 manual testing playbook packages, and only four scenario files use the new `json conversation` format. Many single-prompt scenarios describe behavior that spans turns, question tools, restarts or several runtimes, which a person checks by hand today. Nobody has mapped which scenarios should move to the new format, which should stay and where a skill has no coverage a conversation would add.

### Purpose
Produce a ranked, evidence-backed adoption map that applies the style rule to every skill and skill mode, so a later phase can convert, update or add scenarios in priority order.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --no-strict | grep -c '^\(PASS\|FAIL\|SKIP\) package'
56
$ grep -rl --include='*.md' '```json conversation' .skilled | grep manual-testing-playbook/ | grep -v tests/fixtures | grep -v -e references/ -e assets/ | wc -l
4
$ ls -d .skilled/skills/*/ | wc -l
16
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory every skill and skill mode packet, and every playbook package and scenario they own
- Classify each existing scenario with the four ordered style questions: convert to conversation, keep as single prompt, or update
- Find skills and modes whose multi-turn, question-tool, restart or cross-runtime behavior has no scenario at all
- Rank the candidates by value and cost, naming the runtimes each conversation would target

### Out of Scope
- Converting or writing any scenario - this phase only researches; a later phase builds
- Changing the runner or the style rule - phase 002 owns them, and a gap found here is recorded as a finding

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/` | Create | Deep-research state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every skill and skill mode is classified | `research.md` lists all 16 skills and every mode packet, each with convert, keep, update or add verdicts or an explicit no-candidate note |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each candidate cites its evidence and deciding question | Each ranked candidate names its scenario file or missing behavior with a `[SOURCE: path:line]` tag and the style question that decides it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with a ranked candidate list and a per-skill coverage table
- **SC-002**: `validate.sh --strict` prints `RESULT: PASSED` for this phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Luna quota through cli-codex | The loop stops early | Resume from the last iteration; ask before switching executor |
| Risk | 1,451 scenario files are too many to read one by one | Med | Classify by package and pattern, then sample each category and cite the files read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---


