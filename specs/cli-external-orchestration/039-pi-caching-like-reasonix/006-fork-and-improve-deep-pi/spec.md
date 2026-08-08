---
title: "Phase Parent: Fork and Improve deep-pi"
description: "Hardening pass on deep-pi (phase 004's exclusive DeepSeek-direct extension): surface three silent failure counters, add a warning-only model-drift signal, and harden unguarded telemetry cost math. Split into 3 child phases: fix-and-test, vendor-and-repoint, live-verification-and-closeout. A HANDOFF gpt-5.6-sol review's confirmed findings were all fixed and re-verified."
trigger_phrases:
  - "fork deep-pi"
  - "improve deep-pi"
  - "deep-pi hardening"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi"
    last_updated_at: "2026-08-07T20:22:03Z"
    last_updated_by: "spec-author"
    recent_action: "HANDOFF review's confirmed findings fixed across all 3 children"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "deep-pi's pinned commit 0f1cbd8124b4fb35df97f85aa943d730f4aae549 has a full vitest suite (8 files, 958 lines) NOT shipped in the npm tarball. Forking from it gives full test coverage for free."
      - "gpt-5.6-sol (xhigh) review found the proposed model-drift fallback would crash Pi's UI status path; redesigned warning-only. Detail in 001-fix-and-test-deep-pi/spec.md."
      - "Split into 3 child phases at operator request despite scoring below the system's own phase-decomposition threshold — framework treats phase count as a user choice, not a system requirement."
      - "All 3 phases implemented via gpt-5.6-luna (max, fast); every claim independently re-verified against real commands, not trusted from the dispatch's own reports."
      - "HANDOFF: a fresh gpt-5.6-sol (high, fast, read-only) review found 12 findings; 11 were independently re-confirmed against real commands, 1 was an evidentiary gap on the reviewer's own sandbox side, not a defect. All confirmed findings fixed across the 3 children (costMathErrors surfaced, a real-hook test added, diff numbers corrected, approval language made explicit, RPC mode followed up) and re-verified — 60/60 tests, validate.sh 0/0."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Fork and Improve deep-pi

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/039-pi-caching-like-reasonix |
| **Predecessor** | 005-verification-and-decision-reconciliation |
| **Successor** | 007-research-fork-improvements |
| **Handoff Criteria** | Phase 1 delivers a patched, tested fork; phase 2 vendors it in-repo; phase 3 proves it live and reconciles all docs — met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A full read of `deep-pi`'s installed source (1,299 lines across 7 files) surfaced real, source-confirmed gaps: two silent failure counters nothing ever reads, a hardcoded model allowlist with no drift signal when DeepSeek ships a new model id, and unguarded telemetry cost math. None have caused a live incident, but all are real and fixable.

### Purpose
Fork and patch `deep-pi` to close the silent-diagnostics gap and add a safe, warning-only drift signal, vendor the result in-repo, and prove it works live — matching the same rigor phases 003-005 already applied to `pi-cache-optimizer`/`deep-pi`'s original adoption.

> **Phase-parent note:** This spec.md is the ONLY authored document at this level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Patch `deep-pi`'s two required gaps (silent counters, model-drift warning) plus one optional P2 gap (cost-math hardening), each with a real fix and a real test
- Vendor the patched fork in-repo at `.pi/extensions/deep-pi/`, repoint `.pi/settings.json`
- Live verification against a real DeepSeek-direct session, with regression checks against the boundary models `pi-cache-optimizer`/`deep-pi` already correctly split

### Out of Scope
- Any change to `pi-cache-optimizer` or the phase 003/004/005 composition boundary — unrelated and already closed
- Fix #4 (`edit_lines` cannot create new files) — a deliberate design property of hash-anchored editing, documented in phase 1 but not attempted
- Committing anything to git — a separate, standing operator decision (commit only when asked)

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `extensions/deeppi.ts`, `extensions/deeppi/telemetry.ts` (fork) | Modify | 001-fix-and-test-deep-pi | Two required fixes plus one optional P2 fix |
| `.pi/extensions/deep-pi/`, `.pi/settings.json` | Create/Modify | 002-vendor-and-repoint | Vendor and repoint |
| (docs only) | Modify | 003-live-verification-and-closeout | Live proof and doc reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-fix-and-test-deep-pi/` | Fork `deep-pi` at the pinned commit, apply the silent-counter fix and the warning-only model-drift fix (redesigned after a `gpt-5.6-sol` xhigh review found the original design would crash), applied the P2 cost-math fix too, proved each with a new test. A HANDOFF `gpt-5.6-sol` review then found 4 more confirmed gaps (an unsurfaced counter the fix itself introduced, a boundary test that never exercised the real code path, discarded notification severity, an untested guard branch) — all fixed and re-verified: 60/60 tests, 2 negative controls | Complete |
| 2 | `002-vendor-and-repoint/` | Copied the patched fork into `.pi/extensions/deep-pi/`, confirmed byte-identical, repointed `.pi/settings.json` to the local path — applying phase 003's established mechanism from the start. Re-vendored a second time after phase 1's HANDOFF fixes; `diff -rq` still exits 0 | Complete |
| 3 | `003-live-verification-and-closeout/` | Real DeepSeek-direct session plus boundary-model regression checks against the vendored extension; resolved the P2 fix decision (implemented); reconciled all docs to Complete. Three real limitations disclosed: `/deeppi`'s report isn't observable via `pi --print`, `opencode/deepseek-v4-flash-free` has no live credential right now, and `pi --mode rpc` only confirms a status-bar-level signal, not the full report body. A HANDOFF review's 2 confirmed findings against this phase (implicit approval language, the RPC-mode observation path) were both closed with real follow-up | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fix-and-test-deep-pi | 002-vendor-and-repoint | Fixes implemented with passing new tests, full suite green, `tsc --noEmit` clean, diff scoped to the fixes | `npm test`/`npm run typecheck` output; `git diff` against the pinned commit |
| 002-vendor-and-repoint | 003-live-verification-and-closeout | Vendored copy byte-identical to the patched fork, `.pi/settings.json` repointed, `pi list` resolves it | `diff` output; `pi list` output |
<!-- /ANCHOR:phase-map -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Related**: `../004-adopt-deep-pi-deepseek/spec.md` (original adoption decision, unchanged by this phase)
- **Related**: `../003-fork-and-guard-cache-optimizer/spec.md` §7 (the in-repo vendoring mechanism phase 2 applies from the start)
