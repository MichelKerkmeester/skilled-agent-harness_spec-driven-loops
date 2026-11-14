---
title: "Feature Specification: sk-code audit remediation"
description: "Fix every finding from the 2026-11-14 audit of the sk-code hub and its five packets, starting with the frontend surface that ordinary requests cannot reach."
trigger_phrases:
  - "sk code audit remediation phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-code audit remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | None. This is a top-level packet in the `sk-code/hub-architecture` track |
| **Parent Packet** | sk-code/hub-architecture/006-sk-code-audit-remediation |
| **Predecessor** | 005-private-surface-skills |
| **Successor** | None |
| **Handoff Criteria** | Every row of `001-finding-verification/findings-ledger.md` carries fix evidence, the probe replay shows the frontend surface reached, and the sk-code setup battery prints `STATUS=PASS` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An audit of the sk-code hub on 2026-11-14 produced 61 findings. The largest is reach: an agent that asks for everyday web work gets `defer` from the hub router, so the frontend surface's references never load. 12 of 13 plainly worded frontend prompts fail to route, and 2 of 8 unrelated prompts route to the frontend surface on a bare word such as `padding`. Behind that sit drift findings. The frontend vocabulary is copied by hand into five places that no longer agree. The hub router's prose names files that do not exist. The hub's own setup battery prints `STATUS=FAIL` and exits 0. The three other packets carry statements that contradict each other, 6 of them confirmed and 36 not yet checked.

### Purpose
Every audit finding is either fixed with a command that proves it or closed with a recorded reason, so that a frontend request reaches the frontend surface and the hub's documents agree with what its router does.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level, apart from `goal.md`. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the 37 findings the audit did not check, before any fix is made.
- Make plainly worded frontend requests route to `sk-code-frontend`, and stop bare visual words from routing unrelated requests there.
- Make the frontend packet's documents agree with its router, with each rule in one file and a playbook scenario for every intent.
- Make a vocabulary mismatch between the hub's copies fail a guard.
- Bring the hub router's prose in line with its machine map and turn the setup battery green.
- Fix the confirmed findings in `sk-code-skilled`, `sk-code-review` and `sk-code-quality`.

### Out of Scope
- `sk-code-ci` content. The audit raised no finding against it. Its vocabulary copies are compared by the phase 004 guard and are not edited.
- New framework sections, a vocabulary generator and refactors of script sources over 400 lines. No current requirement needs them, and each child spec records the reason.
- The DeepSeek Harness version pin, which the audit noticed is behind the installed binary. It belongs to `cli-external-orchestration`.
- New findings noticed during the work. They go in the owning child's `goal.md` log for the operator.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` | Modify | all | Verdicts in phase 001, fix evidence in phases 002 to 008 |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | 002, 003, 004, 005 | Frontend `surfaceDetection`, aliases, checklist row, version |
| `.skilled/skills/sk-code/hub-router.json` | Modify | 002, 005 | Frontend vocabulary classes, version |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | 002, 005 | Vocabulary rows, section 4 prose, tiers, verification rows, doctrine route |
| `.skilled/skills/sk-code/SKILL.md` | Modify | 002, 005 | Surface wording, version |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | 002 | Frontend file markers |
| `.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/` | Create | 002 | Probe scenarios |
| `.skilled/skills/sk-code/sk-code-frontend/` | Modify | 002, 003, 004 | Router, entry documents, references, token file, playbook, release note |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/verify-router-sync.cjs` | Modify | 004 | Vocabulary comparison leg and its test |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Modify | 005 | Exit status follows the status line |
| `.pi/extensions/*.ts`, `.skilled/bin/skilled-loop-shell.sh` | Modify | 005 | The 23 drift-guard errors, only after the operator answers the open question |
| `.skilled/skills/sk-code/sk-code-skilled/` | Modify | 005, 006 | Confirmed `SK` rows |
| `.skilled/skills/sk-code/sk-code-review/` | Modify | 007 | Confirmed `RV` rows |
| `.skilled/skills/sk-code/sk-code-quality/` | Modify | 005, 008 | Confirmed `QL` rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-finding-verification/ | Give each of the 37 unchecked findings a verdict backed by a command, and save the router and setup baselines | Pending |
| 2 | 002-frontend-reach/ | Add frontend file markers and everyday vocabulary, remove bare-word keywords and prove reach with 22 fixed probes | Pending |
| 3 | 003-frontend-content/ | Make the frontend packet's load rule, references, playbook and checklist row agree with its router | Pending |
| 4 | 004-vocabulary-single-source/ | Remove the prose copy of the vocabulary and make the router-sync guard fail when the remaining copies differ | Pending |
| 5 | 005-hub-router-alignment/ | Align hub router prose with its map for all three surfaces, route the implement doctrine and turn the setup battery green | Pending |
| 6 | 006-skilled-packet-fixes/ | Fix the confirmed `SK` rows in `sk-code-skilled` | Pending |
| 7 | 007-review-packet-fixes/ | Fix the confirmed `RV` rows in `sk-code-review` | Pending |
| 8 | 008-quality-packet-fixes/ | Fix the confirmed `QL` rows in `sk-code-quality` | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-finding-verification | 002-frontend-reach | No ledger row is `Unverified`, and both baseline files exist | `grep -c '| Unverified |' findings-ledger.md` prints 0 |
| 002-frontend-reach | 003-frontend-content | Every `frontend` probe and the `review` probe name the frontend surface, and no `negative` probe does | The probe replay in `002-frontend-reach/plan.md` section 5 |
| 003-frontend-content | 004-vocabulary-single-source | The frontend playbook holds one scenario per intent and its validator exits 0 | `validate-playbook-package.cjs --package` on the frontend playbook |
| 004-vocabulary-single-source | 005-hub-router-alignment | A one-keyword mutation in any vocabulary copy fails the router-sync guard | `node --test` on `verify-router-sync.test.cjs` |
| 005-hub-router-alignment | 006-skilled-packet-fixes | The setup battery prints `STATUS=PASS failed=0` | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` |
| 006-skilled-packet-fixes | 007-review-packet-fixes | No `SK` ledger row has `-` as its fix evidence | `grep -c '^| SK-.*| - |$' findings-ledger.md` prints 0 |
| 007-review-packet-fixes | 008-quality-packet-fixes | No `RV` ledger row has `-` as its fix evidence | `grep -c '^| RV-.*| - |$' findings-ledger.md` prints 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should `.tsx` and `.jsx` count as frontend file markers? Default in `002-frontend-reach/spec.md`: yes.
- Should the starter type tokens move from `px` to `rem`? Default in `003-frontend-content/spec.md`: yes.
- Should the 23 drift-guard errors be fixed in `.pi/extensions/` and `skilled-loop-shell.sh`, or should the guard stop scanning them? Default in `005-hub-router-alignment/spec.md`: fix the files.
- Is exit 0 on `STATUS=FAIL` deliberate for the setup battery? Default in `005-hub-router-alignment/spec.md`: no.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Findings ledger**: See `001-finding-verification/findings-ledger.md`
- **Goal**: See `goal.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
