---
title: "Implementation Plan: Phase 6: codex-persona-tool-mapping"
description: "Add a tool-mapping requirement and its literal text to the Codex persona-injection rule and to the canonical contract it cites. Prove it with one live read-only dispatch and one control run, both judged by their report files."
trigger_phrases:
  - "codex persona tool mapping plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: codex-persona-tool-mapping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown skill documents |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `codex exec --sandbox read-only` probe and `rg` assertions |

### Overview
Add a tool-mapping requirement and its literal text to the Codex persona-injection rule and to the canonical contract it cites. Prove it with one live read-only dispatch and one control run, both judged by their report files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex login status` reports a ChatGPT login
- [ ] The canonical persona-injection section is located or confirmed missing
- [ ] The probe prompt is saved under `scratch/`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `scratch/codex-probe-report.txt` contains `FILES READ: .skilled/agents/README.txt`
- [ ] `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` prints 1 or more
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rule plus live proof.

### Key Components
- **Rule 17 in `cli-codex/SKILL.md`**: The rule an orchestrator reads before composing a Codex prompt.
- **Canonical persona-injection contract**: The one place every CLI mode's persona rule points at.

### Data Flow
An orchestrator reads the Codex rule, places the mapping line above the inlined persona and dispatches. The child reads files with its shell. The orchestrator checks the report for the files read before it trusts the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Owns the Codex dispatch rules | update | REQ-001 and REQ-005 searches |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Cited as the canonical persona contract | update | REQ-004 search |
| `.skilled/agents/context.md` | The persona that triggered the failure | unchanged | `git diff --stat main -- .skilled/agents/context.md` prints nothing |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Builds prompts for research and review lineages | not a consumer | `rg -n -i 'persona' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` reviewed in T002 |
| Six other `cli-*` mode packets | Each attaches a persona its own way | checked | REQ-007 table |

Required inventories:
- Same-class producers: `rg -l -i 'persona' .skilled/skills/cli-external-orchestration/*/SKILL.md` lists every mode with a persona rule.
- Consumers of rule 17: `rg -n 'Persona Injection' .skilled/skills .skilled/agents` lists every citation.
- Matrix axes: two runs, with and without the line, by one persona. Seven modes by one question in the REQ-007 table.
- Algorithm invariant: N/A, no parser or path logic changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup checks the Codex login, reads the other six modes and locates the canonical contract. Implementation adds the rule, the failure signature and the changelog entry. Verification runs the probe and the control and reads both report files.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Live dispatch | One probe with the line and one control without | `codex exec --sandbox read-only` |
| Search assertion | The rule and the failure signature are present | `rg` |
| Manual | Six other modes read for the same gap | `rg` and reading |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `codex` CLI with a ChatGPT login | External | Green | No live proof |
| The hub's version rule | Internal | Green | The changelog entry could carry the wrong version |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A Codex dispatch with the mapping line runs a command that changes state, or the hub's version check fails on main.
- **Procedure**: `git revert` the phase's commit. The rule returns to its earlier text and the changelog entry is removed with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting the successor |
<!-- /ANCHOR:phase-deps -->

---

