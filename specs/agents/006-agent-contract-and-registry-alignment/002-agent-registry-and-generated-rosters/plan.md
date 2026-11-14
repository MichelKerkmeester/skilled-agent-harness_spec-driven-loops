---
title: "Implementation Plan: Phase 2: agent-registry-and-generated-rosters"
description: "Add one JSON registry of the eleven agents and one Node script that writes the roster blocks in `orchestrate.md` and `README.txt` from it. The script's check mode runs in CI and fails on any drift."
trigger_phrases:
  - "agent registry and generated rosters plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: agent-registry-and-generated-rosters

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
Add one JSON registry of the eleven agents and one Node script that writes the roster blocks in `orchestrate.md` and `README.txt` from it. The script's check mode runs in CI and fails on any drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 1 is closed, so the council tier wording is final
- [ ] `scratch/row-parity.md` lists every current roster row
- [ ] The operator has answered the first open question in `spec.md`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0
- [ ] `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single source, generated views.

### Key Components
- **`agent-registry.json`**: Holds the four facts no frontmatter field carries. Without it, tier and dispatcher stay typed by hand in four places.
- **`sync-agent-roster.cjs`**: Writes the blocks and checks them. Without it the registry is one more list to forget.
- **Generated blocks**: The three tables in `orchestrate.md` and the roster in `README.txt`, bounded by comment markers.

### Data Flow
A maintainer adds an agent file and a registry record. The write mode rewrites the four blocks. CI runs the check mode, which compares the directory, the registry and the blocks, and fails on any difference.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/agents/orchestrate.md` | Hand-written rosters at lines 78-90, 101 and 165-178 | update | REQ-002 searches |
| `.skilled/agents/README.txt` | Hand-written roster | update | REQ-005 test case |
| `.skilled/bin/check-agent-mirror-sync.cjs` | Compares runtime copies with canonical files | unchanged | Exits 0 after regeneration |
| `.github/workflows/agent-mirror-sync.yml` | Runs the mirror check in CI | update | REQ-006 search |
| `.skilled/commands/` | Dispatch agents directly from workflow files | not a consumer | `rg -l 'agent-registry' .skilled/commands` prints nothing |

Required inventories:
- Same-class producers: `rg -n -e '@context' -e '@review' .skilled/agents/README.txt .skilled/agents/orchestrate.md AGENTS.md` lists every hand-written roster.
- Consumers of the roster tables: `rg -n 'Agent Selection' .skilled .opencode --glob '*.md' --glob '*.yaml'`.
- Matrix axes: eleven agents by four rosters, forty-four cells, listed in `scratch/row-parity.md`.
- Algorithm invariant: the set of names in the directory, the registry and each block is identical.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records every current roster row and gets the operator's answer on the cheaper design. Implementation adds the registry and the script, then converts the four rosters one at a time. Verification runs the check, the tests and the mirror check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The script's write and check modes | `vitest` |
| Search assertion | Both missing agents appear in each roster | `rg` |
| Mirror parity | Copies of `orchestrate.md` | `.skilled/bin/check-agent-mirror-sync.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 1 closed | Internal | Yellow | The council tier in the registry could be written against wording that then changes |
| `vitest` in `.skilled` | Internal | Green | No automated proof for the script |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The check fails on main for a tree that is correct, or a generated table loses a rule a hand-written row carried.
- **Procedure**: `git revert` the phase's commits. The hand-written tables return with the revert, then rerun the mirror generators.
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
| Setup | Phase 1 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting the successor |
<!-- /ANCHOR:phase-deps -->

---

