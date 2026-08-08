---
title: "Phase Parent: Implement Fork Improvements"
description: "Turns phase 007's four-lineage, cross-validated research findings into a sequenced implementation plan for the two packet-039 forks, then implements it. All 3 child phases (001 correctness floor, 002 observability and economics, 003 maintainability and provenance) were authored as planning-only, then operator-authorized for implementation, built, HANDOFF-reviewed, and fixed — all 3 are Complete."
trigger_phrases:
  - "implement fork improvements"
  - "008 fork improvements"
  - "pi fork fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements"
    last_updated_at: "2026-08-08T12:05:00Z"
    last_updated_by: "spec-author"
    recent_action: "All 3 children implemented, HANDOFF-reviewed, fixed, validated"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Decomposition follows research.md's own 13-item P0/P1/P2 ranking, which all 4 lineages independently converged on; the tiers are the phase boundaries."
      - "sol's f-deeppi-cas-gap TOCTOU claim was downgraded by the 4th lineage and is deliberately absent from every child's scope. Phase 001 records why."
      - "Operator authorized implementation of all 3 children (GPT-5.6 max/fast); a HANDOFF gpt-5.6-sol review found 6 real gaps, all fixed and re-verified."
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

# Implement Fork Improvements

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/039-pi-caching-like-reasonix |
| **Predecessor** | 007-research-fork-improvements |
| **Successor** | 009-fork-attribution-and-changelog |
| **Handoff Criteria** | Each child phase holds a self-sufficient, evidence-carrying plan an implementer can execute without re-running 007's research; no child begins implementation before the operator authorizes it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 007 ran four independent research lineages (`gpt-5.6-sol`, `gpt-5.6-luna`, Grok 4.5, `deepseek-v4-flash`) over 24 forced-full-depth iterations and produced `../007-research-fork-improvements/research/research.md`: a tiered findings set plus a closing 13-item P0/P1/P2 action list. That document is evidence, not a plan. It names real defects with real citations — deep-pi drops a session's first cache-write turn and latches `usageUnavailable` (`.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:52-55`), the two forks hardcode the same DeepSeek ownership boundary in two places with nothing forcing them to move together (`.pi/extensions/pi-cache-optimizer/index.ts:1279-1281` and `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-18`), the `/deeppi` report command mutates state while pretending to be read-only (`.pi/extensions/deep-pi/extensions/deeppi.ts:67`) — but it assigns none of them an owner, a sequence, a test seam, or an acceptance criterion. Left as-is, the research decays into a list nobody can execute, and the ordering all four models independently agreed on (correctness before economics before refactoring) has nothing enforcing it.

### Purpose
Turn 007's findings into three independently executable, evidence-carrying child phases whose boundaries are the research's own priority tiers, so an implementer can pick up any one of them and work from the cited source rather than re-deriving it. All three children were authored as planning artifacts first, then operator-authorized, implemented, HANDOFF-reviewed by a fresh independent model, and fixed.

> **Phase-parent note:** This spec.md is the ONLY authored document at this level. All detailed planning, task breakdowns, checklists, decisions, and implementation-summary.md live in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Decomposing `../007-research-fork-improvements/research/research.md`'s 13-item priority-ranked action list into 3 child phases whose boundaries match the research's own P0/P1/P2 tiers
- Authoring, for each child, a Level 2 document set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) that carries the original file:line evidence forward rather than paraphrasing it away
- Recording the explicit non-item: sol's `f-deeppi-cas-gap` TOCTOU claim, downgraded by the 4th lineage's own trace of `atomicWriteFile`'s post-rename verification, must not reappear as a fix item without a fresh re-check. Phase 001's spec.md carries that record
- Fixing the cross-references this phase creates: 007's Successor field and the 039 parent's Phase Documentation Map

### Out of Scope
- Re-running or extending 007's research, or re-litigating its findings. Where a finding was single-lineage or contested, the owning child phase says so and planned a confirmation step rather than silently promoting it to fact
- Re-opening the 003/004/005 fork-and-split decisions, which are closed and live-verified
- Fork attribution disclosure and a changes-vs-upstream document for either fork's README — that work is 009-fork-attribution-and-changelog's scope, not this phase's

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-correctness-floor/{spec,plan,tasks,checklist}.md` | Create | 001-correctness-floor | Level 2 planning set for the 4 P0 items |
| `002-observability-and-economics/{spec,plan,tasks,checklist}.md` | Create | 002-observability-and-economics | Level 2 planning set for the 5 P1 items |
| `003-maintainability-and-provenance/{spec,plan,tasks,checklist}.md` | Create | 003-maintainability-and-provenance | Level 2 planning set for the 4 P2 items |
| `../007-research-fork-improvements/spec.md` | Modify | (parent-level) | Successor field points here instead of "pending research outcome" |
| `../spec.md` | Modify | (parent-level) | Phase Documentation Map and handoff row for phase 8 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-correctness-floor/` | The 4 P0 items: deep-pi's dropped cold-start telemetry turn and its latched `usageUnavailable` flag; a single shared source of truth for the DeepSeek ownership boundary plus a combined-host composition test that proves exactly one fork ever owns a model id; hook-level early-return tests for pi-cache-optimizer's 6 guarded hooks; and the `/deeppi` report command's read-only-looking mutation of `telemetry.latestChurn`. Resolved the `node:test`+`jiti` versus `vitest` runner mismatch as a prerequisite of the composition test. A HANDOFF review found the ownership boundary could still silently diverge outside the fixture's own 4 entries and the no-mutation control wasn't real; both fixed with real negative controls | Complete |
| 2 | `002-observability-and-economics/` | The 5 P1 items: a persistent, versioned deep-pi stats file written through deep-pi's own `atomicWriteFile` helper rather than a copy of pi-cache-optimizer's read-merge-rename cycle; report *data* separated from its text rendering and from its transport so a non-interactive caller can read it without `ctx.ui`; honest counterfactual labeling of `estimatedSavings` plus real cache-write-cost accounting; the dropped cache-write usage and absent `stopReason` guard on `message_end`; and a measured investigation of `messageDigests` growth in the `before_provider_request` hot path. A HANDOFF review found the stats writer wasn't actually cross-process safe and the characterization test's claim was false; both fixed with a real advisory file lock and a genuine pre-split line diff | Complete |
| 3 | `003-maintainability-and-provenance/` | The 4 P2 items, sequenced after 001 and 002 landed: a measured extraction decision for pi-cache-optimizer's 8,390-line entry module (no seam met the low-coupling bar, so none was extracted); automated provenance and drift checks for both vendored forks; a credential-independent local boundary fixture that closes the `opencode/deepseek-v4-flash-free` credential gap 006/003 disclosed — its live session was deferred by sandbox restrictions at build/review time, then actually run in a permitting sandbox, which also fixed a real `deepPiDormant` logic bug; and deep-pi's `benchmark:live` packaging, fixed in both independent failure modes | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit
- **Ordering gate:** all four research lineages independently ranked correctness above economics above refactoring. Phase 003 enforced that as a hard precondition, re-verifying 001 and 002 green before touching anything

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 007-research-fork-improvements | 001-correctness-floor | Research complete with a cross-validated priority-ranked action list; every P0 item traced to a real file:line before being planned | `../007-research-fork-improvements/research/research.md` closing section; each P0 citation re-read against the live source during 008 authoring |
| 001-correctness-floor | 002-observability-and-economics | The correctness floor holds: cold-start turns recorded, ownership boundary single-sourced and composition-tested, report command side-effect free, both suites green | `001-correctness-floor/checklist.md` P0 items pass with real command output |
| 002-observability-and-economics | 003-maintainability-and-provenance | Persistence, structured reporting, and cost accounting shipped and tested, so extraction work has a stable contract to refactor against | `002-observability-and-economics/checklist.md` P0/P1 items pass |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. All three child phases were authorized, implemented, HANDOFF-reviewed, and fixed:

- All three children ran (none cut); 001 before 002 before 003 as the research's ordering required.
- The shared ownership-predicate source of truth shipped as a test-only fixture (phase 001's REQ-002), consumed by both forks' test suites, plus a wide synthetic-candidate comparison added after a HANDOFF review found the fixture-only check could miss a one-sided divergence.
- The two forks' divergent test runners were bridged with a runner-neutral composition body, not unified — the bridge worked under both `vitest` and `node:test`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../007-research-fork-improvements/spec.md` and its `research/research.md` (the source of truth for every finding planned here)
- **Related**: `../003-fork-and-guard-cache-optimizer/spec.md`, `../006-fork-and-improve-deep-pi/spec.md` (the two forks under improvement)
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, checklist.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
