---
title: "Implementation Plan: Phase 1: Atomic State Serialize-Diff"
description: "Plan for the shipped compare-before-write atomic state helper that skips redundant fsync+rename cycles when serialized state is unchanged."
trigger_phrases:
  - "atomic-state-serialize-diff"
  - "write-only-on-change"
  - "atomic-state-dedup-write"
  - "state-diff-before-fsync"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/001-atomic-state-serialize-diff"
    last_updated_at: "2026-07-01T21:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped implementation content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed atomic state compare-before-write helper"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:001a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d7e"
      session_id: "scaffold-content-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: Atomic State Serialize-Diff

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
| **Language/Stack** | TypeScript deep-loop runtime library |
| **Framework** | Node.js filesystem-backed atomic state helpers |
| **Storage** | JSON state snapshots written through temp-file + fsync + rename |
| **Testing** | Spec acceptance requires first-write, unchanged-skip, changed-write behavior plus TypeScript compilation; no dedicated test file is named in spec.md |

### Overview
This phase shipped `writeStateIfChangedAtomic` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. The helper serializes incoming state, compares it to a canonical-path cache, and only invokes the durable `writeStateAtomic` temp-file/fsync/rename path when the serialized content changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: reducers and fan-out callers were doing unconditional whole-snapshot rewrites.
- [x] Success criteria measurable: first call and changed state return `true`; unchanged repeat call returns `false`.
- [x] Dependencies identified: no upstream phase dependency; this phase only extends `atomic-state.ts`.

### Definition of Done
- [x] `writeStateIfChangedAtomic(path, state, cache?)` exported with compare-before-write semantics.
- [x] Existing `writeStateAtomic` raw write path preserved for callers that require unconditional durability.
- [x] JSDoc documents the production-caller preference for the diffing helper and the bypass/cache-staleness risk.
- [x] Docs updated in this packet's spec, plan, and tasks.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Write-through atomic persistence with a serialized-state diff gate in front of the existing durable write primitive.

### Key Components
- **`writeStateIfChangedAtomic`**: Public helper that canonicalizes the path, serializes the state, checks a per-path cache, and returns whether a disk write happened.
- **Serialized state cache**: Module-level or injected `Map<string, string>` keyed by canonical path so tests can control cache state and production calls can skip unchanged snapshots.
- **`writeStateAtomic`**: Existing raw temp-file + fsync + rename writer kept intact for callers that must force a write.

### Data Flow
A caller passes a target path and state object to `writeStateIfChangedAtomic`; the helper serializes the object and compares it to the cached serialized value for the canonical path. Equal content returns `false` without touching disk; changed or unseen content delegates to `writeStateAtomic`, updates the cache, and returns `true`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Owns atomic JSON state writes | Add `writeStateIfChangedAtomic` while preserving `writeStateAtomic` | Spec acceptance criteria cover return values and unchanged-state skip behavior |
| Existing production callers of `writeStateAtomic` | Continue using raw write path until migrated separately | Unchanged in this phase | TypeScript compilation required by spec success criteria |

Required inventories:
- Same-class producers: inspect `atomic-state.ts` for existing atomic state write helpers before changing the file.
- Consumers of changed symbols: list existing callers of `writeStateAtomic`; migration is explicitly out of scope for this phase.
- Matrix axes: first write, repeated identical write, changed write, and raw-path bypass.
- Algorithm invariant: unchanged serialized snapshots must not create a temp file, fsync, or rename cycle through this helper.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the atomic-state write path and confirm `writeStateAtomic` owns the durable temp-file/fsync/rename sequence.
- [x] Confirm the new helper can be added without changing existing raw writer behavior.

### Phase 2: Core Implementation
- [x] Added serialized equality checking before durable writes.
- [x] Added canonical-path cache support with an injectable/overridable map for tests.
- [x] Exported `writeStateIfChangedAtomic` with boolean write-result semantics.
- [x] Added documentation warning that bypassing the diffing helper through the raw writer can make cache state stale.

### Phase 3: Verification
- [x] Verified expected behavior for first write, unchanged repeat write, and changed write as required by spec.md.
- [x] Confirmed existing raw-write callers are not part of this phase's migration scope.
- [x] Updated spec documentation for the completed phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | `writeStateIfChangedAtomic` returns `true` for first/changed writes and `false` for unchanged state | Spec acceptance criteria; no dedicated test file named |
| Compile | Existing callers of `writeStateAtomic` remain valid | TypeScript compilation |
| Manual review | JSDoc and cache-bypass risk documented | Read `atomic-state.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Internal | Complete | The helper must live beside the raw atomic write implementation to reuse durability semantics |
| Existing callers of `writeStateAtomic` | Internal | Unchanged | Caller migration is tracked separately, so this phase does not depend on updating them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The diff gate incorrectly skips a write for mutated state or breaks existing atomic write callers.
- **Procedure**: Revert the `writeStateIfChangedAtomic` addition and cache wiring in `atomic-state.ts`, leaving the existing `writeStateAtomic` raw path as the only supported writer.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
