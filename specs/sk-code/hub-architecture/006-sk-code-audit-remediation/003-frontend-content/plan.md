---
title: "Implementation Plan: Phase 3: frontend-content"
description: "Edit the frontend packet's documents so they state what its router does. Move duplicated rules to their owning files without rewording them. Prove it with the playbook validator and a rule-id count."
trigger_phrases:
  - "frontend content plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: frontend-content

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown, CSS custom properties, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The playbook package validator and `rg` counts |

### Overview
Edit the frontend packet's documents so they state what its router does. Move duplicated rules to their owning files without rewording them. Prove it with the playbook validator and a rule-id count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` section 2 states the problem and section 3 lists the files to change
- [ ] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] The predecessor phase's handoff criteria are met, or this is phase 1

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] The playbook package validator exits 0 with 11 scenarios
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/003-frontend-content --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-owner reference files

### Key Components
- **`sk-code-frontend/ROUTER.md`**: The load rule every other document must repeat
- **`web-motion-and-interaction.md`**: Loses the rules another topic file owns

### Data Flow
The router picks an intent. The intent's resource list names the files to load. `SKILL.md` and `frontend-practice.md` describe that same list in words.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `sk-code-frontend/ROUTER.md` `RESOURCE_MAP` | Owns what each intent loads | unchanged | Playbook replay |
| `SKILL.md` section 4 and `frontend-practice.md` section 6 | Describe the load rule in words | update | REQ-001 `rg` counts |
| Hub `ROUTER.md` Frontend Map | Mirrors the packet map | unchanged | `run-all-drift-guards.sh` router legs pass |
| `mode-registry.json` `quality.checklists` | Tells `sk-code-quality` which checklist to load | update | `quality-checklist-map.test.cjs` passes |

Required inventories:
- Same-class producers: every ledger row this phase owns is one producer, listed by id in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: the ledger verdict (`Confirmed`, `Changed`, `Refuted`, `Judgment`) is the one input axis, and each task states which verdicts it acts on.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads row `F7` and records the `M` rule count. Implementation rewrites the load rule, moves the rules, adds the scenarios and the registry row. Verification runs the playbook validator, the rule-id count and the drift guards.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The checklist map | `node --test` |
| Integration | 11 playbook scenarios | `validate-playbook-package.cjs` |
| Manual | Rule-id and line counts | `rg`, `wc` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 row `F7` | Internal | Yellow | The move list is unknown |
| Phase 002 | Internal | Yellow | Both phases edit the packet router |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The `M` rule count differs from 57, or the playbook validator fails.
- **Procedure**: Revert the phase commit with `git revert <sha>`. The moved rules return to the motion reference with it.
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
| Setup | The predecessor phase's handoff criteria | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting `004-vocabulary-single-source` |
<!-- /ANCHOR:phase-deps -->

---

