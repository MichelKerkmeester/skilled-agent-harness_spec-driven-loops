---
title: "Implementation Plan: Code README Coverage"
description: "Execution plan for planning code-folder READMEs across every Pi Remote source folder and realigning the four existing READMEs to the sk-create-readme code-folder template."
trigger_phrases:
  - "pi remote code readme coverage"
  - "pi mobile phase 10"
  - "code readme coverage"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/010-code-readme-coverage"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Scoped six-phase docs-and-standards uplift; authored 010 spec set as Draft"
    next_safe_action: "Approved 010 plan, then begin 011 architecture-reference drafting"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Implementation Plan: Code README Coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation over the TypeScript monorepo at `Apps/Pi Mobile/`; npm workspaces |
| **Framework** | Code README Coverage boundary within the Pi relay/PWA system |
| **Storage** | No new durable store; READMEs are the deliverable |
| **Testing** | `sk-create-readme` audit inventory; `sk-doc` document validation; link and command checks |

### Overview

Plans a current-state code-folder README in every Pi Remote source folder and realigns the four existing READMEs, all authored to the `sk-create-readme` code-folder template (`assets/readme-code-template.md`). The planned targets live under `Apps/Pi Mobile/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The full planned README inventory is confirmed against the current `Apps/Pi Mobile/` tree.
- [ ] The `sk-create-readme` code-folder template sections and the four existing READMEs are reviewed.
- [ ] Owned README paths, the phase 014 boundary, rollback, and the audit command are confirmed.

### Definition of Done
- [ ] Every planned README exists and every existing README is realigned to the code-folder template.
- [ ] The coverage inventory and `sk-doc` validation pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] The phase 014 root-README boundary, parent status, and successor handoff agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One template shape (`sk-create-readme` code-folder) applied consistently across every code folder, with the flat-folder `KEY FILES` table branch used where no subdirectories exist.

### Key Components
- **`Apps/Pi Mobile/packages/pi-rpc-protocol/`**: Protocol package READMEs for the typed envelope and guards.
- **`Apps/Pi Mobile/apps/pi-remote-relay/`**: Relay package, `migrations/`, `src/` zone map, each `src/*` module, `scripts/`, and `tests/` READMEs.
- **`Apps/Pi Mobile/apps/pi-remote-web/`**: Web package, `src/`, `public/`, and `tests/` READMEs.
- **`Apps/Pi Mobile/extensions/pi-remote-approval/`**: Extension package, `src/`, and `tests/` READMEs.
- **`Apps/Pi Mobile/deploy/`** and **`deploy/containment/`**: Realigned deployment and containment READMEs.
- **`Apps/Pi Mobile/release/`**, **`scripts/`**, and **`tests/`**: Release surface READMEs.
- **Coverage inventory**: The `sk-create-readme` `audit_readmes.py` run or an equivalent inventory recording each planned target.

### Data Flow
Confirmation enters through the current `Apps/Pi Mobile/` tree; each README documents only confirmed files and commands; the inventory and validation evidence flow to the parent and to phase 015's doc-quality gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

This table maps the planned README set to the live monorepo folders.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/pi-rpc-protocol/` + `src/` + `tests/` | Wire contracts and guards | Planned READMEs | Template and file-to-doc review |
| `apps/pi-remote-relay/` + `migrations/` + `scripts/` + `tests/` | Relay supervision and state | Planned READMEs | Template and file-to-doc review |
| `apps/pi-remote-relay/src/*` modules | Approval, auth, fixtures, http, policy, prompt, push, release, replay, rpc, sessions, store | Planned README per module | Template and file-to-doc review |
| `apps/pi-remote-web/` + `src/` + `public/` + `tests/` | Installable PWA | Planned READMEs | Template and file-to-doc review |
| `extensions/pi-remote-approval/` + `src/` + `tests/` | Final-boundary extension | Realigned plus planned READMEs | Template and file-to-doc review |
| `deploy/` + `deploy/containment/` | Serve and containment assets | Realigned READMEs | Template and command review |
| `release/`, `scripts/`, `tests/` | Release gates and drill | Planned READMEs | Template and command review |
| `README.md` | Root orientation | Deferred to phase 014 | Phase 014 handoff |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the current `Apps/Pi Mobile/` tree, workspace script names, template sections, owned paths, and the phase 014 boundary.
- [ ] Reconcile the planned README inventory with the live repository paths.

### Phase 2: Core Implementation
- [ ] Author each planned code-folder README from confirmed files, exports, and commands.
- [ ] Realign `deploy/README.md`, `deploy/containment/README.md`, and `extensions/pi-remote-approval/README.md` to the template.
- [ ] Apply the flat-folder `KEY FILES` table branch where a folder has no subdirectories.
- [ ] Run `audit_readmes.py --repo-root` and record missing, warning, and blocking findings.

### Phase 3: Verification
- [ ] Run focused template, link, and command checks during implementation.
- [ ] Run the authoritative phase gate from final state.
- [ ] Reconcile tasks, checklist, current state, parent map, and successor handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | Coverage inventory | `python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root .` |
| Integration | Link and reference validation | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <path>` |
| Evidence | Template conformance | Section-by-section review against `assets/readme-code-template.md` |
| Evidence | Command verification | Confirm each VALIDATION command from the repo root |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stable `Apps/Pi Mobile/` working tree | Internal | Pending phase preflight | Phase remains blocked |
| `sk-create-readme` code-folder template | Internal skill resource | Available | Phase remains blocked |
| `sk-doc` validation scripts | Internal skill resource | Available | Inventory and validation unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, inventory check, link check, or validation command fails.
- **Procedure**: Revert or correct the affected README while retaining the last verified operator guidance; block release until the check passes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Confirm tree --> review template --> author READMEs --> focused checks
       --> coverage inventory --> authoritative gate --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 009-release-verification-and-rollout | Implementation |
| Implementation | Setup and the live tree inventory | Verification |
| Verification | Implemented README set | 011-architecture-reference |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory | Low | 0.5-1 engineer-days |
| Core implementation | Medium | 1-4 engineer-days |
| Verification and handoff | Medium | 0.5-2 engineer-days |
| **Total** | | **2-7 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The list of existing READMEs to realign is captured before edits.
- [ ] The phase 014 root-README boundary is explicit.
- [ ] No runtime, database, or authority surface is touched by this phase.

### Rollback Procedure
1. Revert any README edit that removed verified operator guidance.
2. Remove or correct the affected planned README.
3. Re-run the coverage inventory and validation checks.
4. Record any deferred target and operator impact.

### Data Reversal
- **Has data migrations?** No migration is planned for this phase.
- **Reversal procedure**: Restore the prior README content; no other state is changed.
<!-- /ANCHOR:enhanced-rollback -->

---
