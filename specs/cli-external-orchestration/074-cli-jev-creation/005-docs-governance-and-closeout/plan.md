---
title: "Implementation Plan: Phase 5: docs-governance-and-closeout"
description: "Make every reader-facing mode list true, complete the parent metadata, then close the packet on the recursive strict gate, a regenerated trigger index and a continuity save."
trigger_phrases:
  - "implementation plan"
  - "approach and phases"
  - "testing strategy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/005-docs-governance-and-closeout"
    last_updated_at: "2026-09-20T11:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan authored and executed; the recursive gate is the last step"
    next_safe_action: "Report the operator's provider-credential step"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-005-docs-governance-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A Jev provider credential remains an operator step; the two authenticated scenarios stay SKIP"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: docs-governance-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surfaces | Roster docs, hub catalog, parent packet metadata, this phase's documents, trigger index, continuity |
| Enforcement | `validate.sh --strict` per folder, then `--recursive` over the packet; the scaffold-token scan |
| Generated artifacts | Trigger index, per-folder `description.json`/`graph-metadata.json` via `repair-derived.cjs` |
| Baseline | Children 001-003 green; 004 green after its own repair; 005 scaffold |

### Overview

Truth first, then the gate: a document that names the wrong mode count is corrected before anything is validated, so the gate result describes the final tree rather than an intermediate one. The order is roster documents, hub catalog, parent metadata, the phase-004 pair, this phase's own documents, then the recursive gate and the generated artifacts last, because every write before them invalidates an index built earlier.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phases 001 to 004 are complete, each with its own strict gate result recorded
- The hub gate is green at eight modes, so registration evidence is current
- Both dispatch suites pass, including the declared/implemented bijection
- The two package validators pass for `cli-jev` (catalog and playbook)

### Definition of Done

- [ ] Every mode list checked in this phase names the transport, and a re-grep finds no stale count
- [ ] The parent spec and goal describe the delivered packet
- [ ] A scaffold-token scan over the five children returns empty
- [ ] `validate.sh --recursive --strict` prints `RESULT: PASSED`
- [ ] The trigger index is regenerated and a lookup surfaces the packet
- [ ] Continuity is saved and the operator step is named
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Docs-only closeout with generated artifacts at the end. No component, interface or data flow changes.

### Key Components

- **Roster documents**: the three files outside the hub that enumerate its modes.
- **Hub catalog**: the hub's own feature inventory, which carries the falsified "zero extension axes" claim.
- **Parent metadata**: `spec.md` (phase map, handoff criteria) and `goal.md` (decisions, completion criteria).
- **Generated artifacts**: the trigger index, the per-folder derived metadata, and the continuity save.

### Data Flow

A reader consults a roster document or the hub catalog and learns what the hub routes to; the parent spec and goal tell them how the packet is built and what remains; the gate result tells them whether the packet is coherent as a whole.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command | Passing looks like |
|-------|---------|--------------------|
| Parent strict gate | `validate.sh <parent> --strict` | `RESULT: PASSED` |
| Recursive gate | `validate.sh <parent> --recursive --strict` | `RESULT: PASSED` |
| Roster truth | `rg -n "seven"` across the touched documents | Only legitimate counts remain (the seven executor modes, the seven-id model rosters) |
| Hub gate | `parent-skill-check.cjs <hub path>` | `all hard invariants passed` |
| Package validators | the catalog and playbook scripts | `PASS`, 0 violations |
| Trigger index | `generate-trigger-index.mjs`, then `lookup-trigger-index.mjs` | The packet's docs surface, or a clean reported no-hit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-004 complete | Internal | Green | The closeout would have nothing to close |
| Hub gate green at eight modes | Internal | Green | Registration evidence would be stale |
| Both package validators | Internal | Green | REQ-001's evidence would be missing |
| A Jev provider credential | External | Red | The two authenticated scenarios stay SKIP; nothing else in this phase changes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a roster edit that changes a contract rather than a mention, or a recursive gate failure that traces to this phase.
- **Procedure**: revert the touched document to its pre-phase state (`git checkout -- <path>` for the tracked files; the untracked documents are re-authored from this phase's spec and tasks). No generated artifact needs a special rollback: the trigger index and derived metadata are regenerated, not hand-edited.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/agents/orchestrate.md` | Enumerates the hub's executor modes in Rule 7 and the anti-pattern table | Update: seven executors plus the transport, and a row refusing work delegated to it | `rg -n "cli-jev"` finds the trigger, the anti-pattern row and the related-resource line |
| `.skilled/agents/prompt-improver.md` | Its eligibility table lists the routes a prompt package may target | Update: a note that the transport needs no row | The note is present and no row was added |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | The persona-attachment table per mode | Update: a `NONE (transport)` row | The row is present; the sync guard still passes |
| `.skilled/skills/cli-external-orchestration/feature-catalog/**` | The hub's own inventory and its routing leaf | Update: the falsified zero-axis claims and the mode counts | The catalog package validator reports the same or fewer findings |
| `compiled-routing` manifest inputs | `*/SKILL.md`, `*/hub-router.json`, `*/mode-registry.json` only | Unchanged by this phase: no routing input is edited here | Freshness stays `fresh: true` at the served hash |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Roster docs ──┐
              ├──► Parent metadata ──► Recursive gate ──► Index + continuity
Hub catalog ──┘
```

| Step | Depends On | Blocks |
|------|------------|--------|
| Roster docs | Phases 001-004 | Nothing |
| Hub catalog | Phases 001-004 | Nothing |
| Parent metadata | Phases 001-004 | Recursive gate |
| Recursive gate | Every earlier write in this phase | Index, continuity |
| Index + continuity | The final tree | The report |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Step | Complexity | Estimated Effort |
|------|------------|------------------|
| Roster docs | Low | 3 edits across 3 files |
| Hub catalog | Low | 2 files |
| Parent metadata | Med | 2 files, one new |
| Phase-004 pair | Med | 2 files |
| This phase's docs | Med | 5 files |
| Gate, index, continuity | Low | 3 commands plus repairs |
| **Total** | | **A single session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Artifact | Rollback |
|----------|----------|
| Roster and catalog documents | `git checkout -- <path>` restores the pre-phase revision |
| Parent `spec.md` | Same; the scaffold revision is in the same commit history |
| Parent `goal.md` | Delete the file; the packet had none before this phase |
| Phase documents | Re-authored from `spec.md`; no behavior depends on them |
| Trigger index | Regenerate; it is derived, never hand-edited |
| Derived metadata | `repair-derived.cjs --apply` regenerates it from the final documents |
<!-- /ANCHOR:enhanced-rollback -->
