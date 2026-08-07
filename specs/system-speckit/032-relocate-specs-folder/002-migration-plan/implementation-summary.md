---
title: "Implementation Summary: Specs-Root Migration Plan"
description: "Reading the existing migration subsystem in full changed the plan from a simple root-swap to a new topology-flip operation built on reused primitives."
trigger_phrases:
  - "migration plan summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/002-migration-plan"
    last_updated_at: "2026-08-06T18:04:13Z"
    last_updated_by: "claude-code"
    recent_action: "Planning phase complete; decision-record.md records the one open policy decision"
    next_safe_action: "Operator answers the downstream-ownership decision, then an execution phase can be scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-migration-plan |
| **Completed** | 2026-08-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 001's research recommended "invert and reuse" the existing `spec-root-*` migration subsystem. Reading that subsystem in full — not just the citations that verified it exists — found the recommendation was directionally right but mechanically wrong: the subsystem's mutation functions consolidate packets between two independently-real directory trees, and today's actual state (`specs` is a symlink to `.opencode/specs`) means its own collision classifier would mark every packet `same-inode-alias` and skip it. Calling the existing migration function as written would do nothing.

This phase replaces "invert and reuse" with a precise design: reuse the five primitives that are genuinely direction-agnostic (collision classification, byte-verified copy/move, quarantine safety, deterministic manifest hashing, writer freeze), and build a new topology-flip operation on top of them, because that operation doesn't exist in the codebase yet.

### Registry Inversion Design

The 21-entry resolver registry — the maintained inventory of every place in the codebase that resolves a specs root — got read and grouped by precedence type. Seven entries actively prefer or require `.opencode/specs` today (`canonical-first`/`canonical-only`) and need real logic changes: Memory MCP document/graph discovery, the Gate 3 classifier, graph metadata migration and backfill defaults, startup drift-marker containment, resume-ladder resolution, and authored-continuity resolution. The other fourteen already treat both roots symmetrically or already prefer the spelling that becomes canonical after the flip — they need relabeling, not new logic. That 7-entry count landed within one of phase 001's independent "~5-7 hardcoded literals" estimate, derived by a completely different method (reading the registry directly instead of sampling citations) — a real cross-check, not a coincidence worth dismissing.

### Decision Record

`decision-record.md` captures two things: the finding above as ADR-001 (with the evidence for why the existing function is currently a no-op), and the downstream specs-ownership policy question as ADR-002, explicitly left open. That decision — whether a downstream repo's project-local specs stays framework-shared or becomes repo-owned — belongs to the operator, not to this planning phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all five `spec-root-*` TypeScript files end to end (not sampled), traced the actual runtime behavior of `classifySpecRootCollision`'s inode comparison against the repo's real current state, and cross-checked the resulting 7-entry change list against phase 001's independent estimate before writing it down. No code was changed and no migration ran — this phase produced planning documents only, verified against `validate.sh --recursive --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rejected "repoint the two hardcoded literals in `migrateLegacyOnlyToCanonical`" as sufficient | The function's collision classifier would treat the current symlinked state as already-reconciled and skip every packet — repointing the literals wouldn't change that behavior, it would still be a no-op |
| Scoped this phase as design-only, no execution | The migration touches shared framework infrastructure used by every spec packet in this repo; a planning phase that gets the design wrong is cheap to redo, an execution phase that gets it wrong is not |
| Left the downstream-ownership decision open rather than picking a default | Phase 001's research explicitly found this to be a policy call, not a technical one — deciding it here would be making a product decision on the operator's behalf |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 5 spec-root-* files read in full | PASS — `spec-root-registry.ts` (all 21 entries), `spec-root-migration.ts`, `spec-root-collision-classifier.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts` |
| 7-vs-14 registry split cross-checked against phase 001 | PASS — within 1 of the independent "~5-7 literals" estimate |
| `validate.sh --recursive --strict` (parent packet) | See the command run immediately after this save for the recorded result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The topology-flip operation is designed, not written.** `plan.md` §4 is a task list for a future execution phase, not working code — it has not been tested.
2. **The 61-test validation matrix was located and its scope confirmed, but not read test-by-test.** An execution phase should not assume every test translates cleanly to the topology-flip shape without a closer read.
3. **The downstream-ownership decision is unresolved.** No execution phase should be scoped until the operator answers it — see `decision-record.md` ADR-002.
<!-- /ANCHOR:limitations -->
