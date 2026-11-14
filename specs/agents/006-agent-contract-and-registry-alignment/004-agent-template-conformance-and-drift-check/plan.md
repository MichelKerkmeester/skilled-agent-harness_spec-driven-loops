---
title: "Implementation Plan: Phase 4: agent-template-conformance-and-drift-check"
description: "Rename and move sections in up to eleven agent files so their outlines match the agent template, record the deliberate deviations in the registry, and extend the roster check to fail on any other difference."
trigger_phrases:
  - "agent template conformance and drift check plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: agent-template-conformance-and-drift-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown agent definitions plus one Node CommonJS script |
| **Framework** | None |
| **Storage** | One JSON file, `.skilled/agents/agent-registry.json` |
| **Testing** | `vitest` for the script, `rg` assertions for the agent files, `.skilled/bin/check-agent-mirror-sync.cjs` |

### Overview
Rename and move sections in up to eleven agent files so their outlines match the agent template, record the deliberate deviations in the registry, and extend the roster check to fail on any other difference.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 3 is closed
- [ ] `scratch/required-sections.md` lists the template's required sections in order
- [ ] `scratch/section-refs.md` lists every section reference before any heading moves

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 with the outline check on
- [ ] `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template as reference.

### Key Components
- **Agent outlines**: The numbered headings of each agent file. Up to eleven change.
- **Outline check**: A new branch in the existing check mode. Without it the next template change drifts unseen, as the last three did.
- **`templateExceptions`**: A list in each registry record. Without it the check would fail on `orchestrate.md`, whose role differs from a leaf agent.

### Data Flow
A maintainer changes the template or an agent file. CI runs the check, which reads the template's required sections, each agent's headings and the registry's exceptions, and fails on any difference that is not an exception.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Defines the required outline | update | Gains the required-sections list the check reads, by the 2026-11-14 amendment |
| `.skilled/agents/*.md` | Carry the outlines | update | REQ-004 and REQ-005 searches |
| `.skilled/agents/orchestrate.md` | Cites other agents' sections by number | update where a number moved | REQ-007 table |
| `.skilled/commands/` | May cite an agent section by number | checked | `rg -n -e 'agents/[a-z-]+\.md. §' -e 'agent.md §' .skilled/commands` reviewed in T003 |
| `.skilled/bin/sync-agent-roster.cjs` | Checks rosters and paths | update | REQ-001 test cases |

Required inventories:
- Same-class producers: `rg -n '^## ' .skilled/agents` lists every heading before any is renamed.
- Consumers of section numbers: `rg -n '§[0-9]+' .skilled/agents .skilled/commands` lists every reference.
- Matrix axes: eleven agents by the template's required sections. Row count is fixed in `scratch/required-sections.md`.
- Algorithm invariant: the required sections appear in each agent in template order. The cases are missing, renamed, out of order, and listed as an exception.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the template's required list and records every heading and section reference. Implementation renames and moves sections, records exceptions and extends the check. Verification reruns the searches, the reference table, the tests and the mirror check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The outline check: missing, renamed, out of order, excepted | `vitest` |
| Search assertion | Section names across the eleven files | `rg` |
| Manual | Each moved block is identical apart from its heading | `diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 3 closed | Internal | Yellow | Two phases would edit the same section |
| `agent-template.md` section 3 | Internal | Green | No reference outline to check against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An agent dispatched after the change refuses its task, loses a rule the removal map did not list, or the mirror check fails on main.
- **Procedure**: `git revert` the phase's commits on the worktree branch, then rerun the mirror generators so the runtime copies match again.
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
| Setup | Phase 3 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting the successor |
<!-- /ANCHOR:phase-deps -->

---

