---
title: "Implementation Plan: Phase 16: handover-trigger-review"
description: "Align the /speckit:handoff doc with the sk-create-command template, then run a ten-iteration deep review of the 023 packet through one cli-codex executor, fix what it confirms and prove live hops again."
trigger_phrases:
  - "handover trigger review plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: handover-trigger-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON for Part A, the session-relaunch code for Part B |
| **Framework** | sk-doc sk-create-command, `/deep:review`, cli-codex |
| **Storage** | None |
| **Testing** | Command validators for Part A, the review loop and live hops for Part B |

### Overview
Two lanes in order. Part A edits the command doc against the template and runs the command checks. Part B dispatches a ten-iteration `/deep:review` through `fanout-run.cjs` with one cli-codex executor, verifies each finding, fixes the confirmed ones and reruns live hops on the five automatic runtimes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Part A follows the template's section set. Part B treats each reviewer finding as a hypothesis until a read or a run confirms it.

### Key Components
- **Command doc**: the REFERENCE section with "Receiving A Handoff" under it, title-case steps and the Outputs column.
- **Contract coverage note**: 34 of the 40 shipped commands, naming `/speckit:handoff` and `/doctor:setup` as outside the families.
- **Review dispatch**: `fanout-run.cjs` with one cli-codex `gpt-6-luna` executor, reasoning max, fast tier, ten iterations.
- **Fix and re-proof**: one fix per confirmed finding, then live hops on Claude, Pi, OpenCode, Codex and Hermes.

### Data Flow
Review findings flow into verification, confirmed findings into fixes, and fixes into the live-hop rerun.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/speckit/handoff.md` | Manual trigger contract | update (done) | `validate_document.py --type command`, `extract_structure.py`, `hvr_scan.py`, mirror check |
| `command-contract.json` coverage note | Lists which commands the families cover | update (done) | `generate-command-routers.cjs`, doctor-update contract test |
| Session-relaunch adapters, wrapper, killer and shim | The automatic hop path | pending, decided by the review | live hops and the session-relaunch tests |

Required inventories:
- Command coverage: 40 shipped commands, 34 in contract families.
- Review targets: the whole `specs/hooks/023-session-relaunch-loop` packet and the code it names.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | The handoff command doc | `check_authored_name_kebab`, `validate_document.py --type command`, `extract_structure.py` |
| Voice | The handoff command doc | `hvr_scan.py` |
| Routing | Command routers and mirrors | `generate-command-routers.cjs`, `sync-runtime-mirrors.cjs --check`, `doctor-update-contract.test.cjs` |
| Review | The 023 packet | `/deep:review` through `fanout-run.cjs` |
| Live | Five automatic runtimes | Live hops, including a repository that symlinks `.skilled` |
| Spec | This folder and the parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-create-command template and contract | Internal | Green | Part A has no target shape |
| `/deep:review` and `fanout-run.cjs` | Internal | Pending | Part B cannot run |
| cli-codex with `gpt-6-luna` | External | Pending | Part B cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks a live hop that passed before it.
- **Procedure**: revert that fix's commit. Part A reverts with commit `33a68750b1`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Part A ──► Review ──► Verify findings ──► Fixes ──► Live hops
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Part A | None | None |
| Review | None | Verify findings |
| Verify findings | Review | Fixes |
| Fixes | Verify findings | Live hops |
| Live hops | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the template and the cli-codex skill |
| Core Implementation | Medium | One doc now, the fixes the review names later |
| Verification | Medium | Command checks, the review and five live hops |
| **Total** | | **Depends on the review's findings** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [ ] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` stays the off switch for any fix
- [ ] Monitoring alerts set: not applicable until fixes land

### Rollback Procedure
1. Revert the commit of the fix that broke a hop.
2. Rerun the live hop on that runtime.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
