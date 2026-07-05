---
title: "Implementation Plan: Phase 6: JSONL Lock-Held Merge"
description: "Plan for the shipped JSONL reread-under-lock repair path with stable-identity set-union merging."
trigger_phrases:
  - "jsonl-lock-held-merge"
  - "jsonl-set-union-merge"
  - "fanout-lock-read-merge"
  - "jsonl-repair-dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/006-jsonl-lock-held-merge"
    last_updated_at: "2026-07-01T21:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped JSONL lock-held merge content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed JSONL repair merge path"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs"
    session_dedup:
      fingerprint: "sha256:006a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d9d"
      session_id: "scaffold-content-remediation-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: JSONL Lock-Held Merge

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript JSONL repair helper plus CommonJS salvage script |
| **Framework** | File-lock guarded JSONL read-merge-write repair |
| **Storage** | JSONL records merged by stable identity `(type, iteration, focus, id ?? event.id)` |
| **Testing** | Spec acceptance requires concurrent overlapping appends produce unique output, lock release on success/error, and no registry recompute in repair; no dedicated test file is named in spec.md |

### Overview
This phase shipped `mergeJsonlUnderLock(path, incomingRecords)` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` and routed `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` through it. The repair path converges concurrent JSONL writes by rereading under the file lock, merging existing and incoming records by stable identity, and writing a deduplicated result without triggering registry recomputation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: concurrent JSONL append/salvage paths could duplicate or lose records.
- [x] Success criteria measurable: overlapping concurrent calls produce one copy per stable identity and release locks on all paths.
- [x] Dependencies identified: targets `jsonl-repair.ts` and `fanout-salvage.cjs`, independent of phases 1-5.

### Definition of Done
- [x] `mergeJsonlUnderLock(path, incomingRecords)` exported from `jsonl-repair.ts`.
- [x] Stable identity set-union implemented using `(type, iteration, focus, id ?? event.id)`.
- [x] Current file is reread under lock before merged output is written.
- [x] `fanout-salvage.cjs` uses the merge helper instead of a bare append.
- [x] Registry recomputation remains outside `jsonl-repair.ts`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lock-guarded read-merge-write repair with stable-record set-union deduplication.

### Key Components
- **`mergeJsonlUnderLock`**: Repair API that combines incoming records with current file contents while holding the file lock for the final consistency-critical section.
- **Stable record identity**: Deduplication key composed from `type`, `iteration`, `focus`, and `id` or `event.id`.
- **`fanout-salvage.cjs` wiring**: Salvage caller that now delegates JSONL updates to the repair helper instead of issuing a bare append.

### Data Flow
The salvage path prepares incoming JSONL records and calls `mergeJsonlUnderLock`. The helper derives stable identities for incoming records, acquires the file lock, rereads the current JSONL, builds the union of existing and incoming identities, writes the merged file, and releases the lock even if the operation fails.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Owns JSONL repair behavior | Add lock-held read-merge-write set-union helper | Spec acceptance covers concurrent duplicate/loss prevention and lock release |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Writes salvage records | Route through `mergeJsonlUnderLock` | Spec acceptance requires no bare salvage appends |
| Registry reducers | Recompute derived registry state from JSONL | Unchanged; recompute remains downstream | Spec states registry recompute is out of scope |

Required inventories:
- Same-class producers: inspect JSONL append/repair producers before wiring salvage.
- Consumers of changed symbols: `fanout-salvage.cjs` is the caller wired in this phase.
- Matrix axes: overlapping identities, disjoint identities, concurrent writers, malformed/empty file, success path, error path, and downstream registry recompute exclusion.
- Algorithm invariant: after merge, each stable record identity appears at most once and no incoming or existing unique identity is lost.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm JSONL repair scope is `jsonl-repair.ts` plus salvage wiring.
- [x] Define stable record identity as `(type, iteration, focus, id ?? event.id)`.
- [x] Confirm registry recomputation is a downstream reducer concern, not repair scope.

### Phase 2: Core Implementation
- [x] Implemented `mergeJsonlUnderLock(path, incomingRecords)`.
- [x] Implemented stable-identity set-union over existing and incoming JSONL records.
- [x] Reread the current file under lock before writing the merged result.
- [x] Kept lock-hold work bounded by precomputing incoming identities where possible and releasing the lock in success and error paths.
- [x] Wired `fanout-salvage.cjs` to use the merge helper.

### Phase 3: Verification
- [x] Verified overlapping concurrent append scenarios converge to unique records with no losses.
- [x] Verified locks release on success and error paths.
- [x] Verified `jsonl-repair.ts` does not trigger registry recomputation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Concurrency/behavior | Concurrent overlapping `mergeJsonlUnderLock` calls produce deduplicated output | Spec acceptance criteria; no dedicated test file named |
| Error handling | Lock released on success and error paths | Spec acceptance criteria |
| Manual review | `fanout-salvage.cjs` no longer uses bare append; registry recompute remains downstream | Read changed files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| File locking primitive | Internal | Available | Required to serialize the read-merge-write critical section |
| Stable record identity fields | Data contract | Complete | Deduplication depends on records carrying `type`, `iteration`, `focus`, and `id` or `event.id` |
| Registry recompute reducers | Internal downstream | Deferred | Repair produces correct JSONL; reducers update derived registry state later |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Merge logic drops unique records, duplicates identities, leaks locks, or breaks salvage writes.
- **Procedure**: Revert `mergeJsonlUnderLock` and the `fanout-salvage.cjs` wiring to the previous append behavior, then rework the lock-held union algorithm before re-enabling salvage repair.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
