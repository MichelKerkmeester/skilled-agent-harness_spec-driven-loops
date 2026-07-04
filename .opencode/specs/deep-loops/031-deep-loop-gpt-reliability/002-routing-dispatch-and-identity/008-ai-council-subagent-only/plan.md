---
title: "Implementation Plan: ai-council Subagent-Only Conversion"
description: "Convert ai-council.md from mode: all to mode: subagent, verify both known reachability paths (orchestrate planning dispatch, /deep:ai-council) still work, and sweep for any undiscovered direct-invocation caller before landing."
trigger_phrases:
  - "implementation"
  - "plan"
  - "ai-council subagent only"
  - "ai council mode conversion"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/008-ai-council-subagent-only"
    last_updated_at: "2026-07-01T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 011"
    blockers: []
    key_files:
      - ".opencode/agents/ai-council.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-010-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: ai-council Subagent-Only Conversion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode agent frontmatter (YAML-in-Markdown) |
| **Framework** | OpenCode `mode` enum (`primary`/`subagent`/`all`) |
| **Storage** | Single file, single field |
| **Testing** | Grep sweep for direct-invocation callers, smoke test of both known reachability paths |

### Overview

A single-line frontmatter change (`.opencode/agents/ai-council.md:4`, `mode: all` → `mode: subagent`) executing an explicit operator override of research's unanimous 6/6 recommendation to keep `mode: all` (see `decision-record.md`). The risk isn't in the edit itself — it's in confirming nothing currently depends on the direct-invoke path being removed. Most of this plan's effort is verification, not implementation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 009 confirmed complete (orchestrate's Task-dispatch path to `@ai-council` proven reliable).
- [x] `decision-record.md` re-read to confirm the override rationale is still accurate and unchanged.
- [x] Repo-wide grep for direct `@ai-council` invocation examples (docs, command files, scripts) completed.

### Definition of Done
- [x] `.opencode/agents/ai-council.md:4` reads `mode: subagent`.
- [x] `/deep:ai-council` end-to-end path confirmed still reaching `@ai-council` correctly (smoke test, not assumed).
- [x] Orchestrate's direct planning-dispatch path (Priority table row 3) confirmed still reaching `@ai-council` correctly (smoke test, not assumed).
- [x] No undiscovered direct-invocation caller found broken by the grep sweep (or, if found, redirected before landing).
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-field capability reduction with pre/post reachability verification — the architectural pattern here is "prove nothing breaks" more than "build something new."

### Key Components

- **`.opencode/agents/ai-council.md:4`**: the `mode` field being changed.
- **`/deep:ai-council` → `deep_ai-council_auto.yaml` → Task dispatch**: one known reachability path, unaffected by `mode` in principle (already Task-based) but must be smoke-tested, not assumed.
- **`orchestrate.md` Priority table row 3**: the other known reachability path (direct planning dispatch via Task from orchestrate).

### Data Flow

Before: `ai-council` reachable via (a) OpenCode's top-level agent picker directly, (b) Task dispatch from orchestrate, (c) Task dispatch from `/deep:ai-council`'s workflow. After: only (b) and (c) remain; (a) is removed. This phase confirms (b) and (c) survive the removal of (a) and that nothing else depended on (a).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/ai-council.md:4` | `mode: all` (dual-reachable) | Change to `mode: subagent` | Field re-read post-edit |
| `/deep:ai-council` workflow | Task-dispatches `@ai-council` | Unchanged, but must be smoke-tested post-conversion | Live smoke test |
| `orchestrate.md` planning-dispatch path | Task-dispatches `@ai-council` for planning tasks | Unchanged, but must be smoke-tested post-conversion | Live smoke test |
| Repo-wide docs/commands/scripts | Unknown — possible direct `@ai-council` references | Grep sweep before landing | grep report |

Required inventories:
- Same-class producers: no other file needs editing for this specific change (single-field), but the grep sweep IS the producer inventory for "who currently assumes direct reachability."
- Consumers: `/deep:ai-council` and orchestrate's planning-dispatch path are the 2 known consumers; the grep sweep exists to find any unknown ones.
- Matrix axes: 2 known reachability paths x before/after conversion state.
- Algorithm invariant: every legitimate ai-council invocation must still resolve to the same agent definition file post-conversion; only the *entry point* changes, not the destination.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 009 is complete.
- [x] Re-read `decision-record.md` to confirm the override rationale still holds.
- [x] Grep the repo for direct `@ai-council` invocation examples outside orchestrate/`/deep:ai-council` (docs, README-style examples, scripts).

### Phase 2: Core Implementation
- [x] Change `.opencode/agents/ai-council.md:4` from `mode: all` to `mode: subagent`.
- [x] If the grep sweep found an undiscovered direct caller, redirect it to Task dispatch (scope permitting) or escalate to the operator per the Logic-Sync Protocol if redirection isn't straightforward.

### Phase 3: Verification
- [x] Smoke-test `/deep:ai-council` end-to-end post-conversion; confirm it still reaches `@ai-council` correctly.
- [x] Smoke-test orchestrate's direct planning-dispatch path post-conversion; confirm it still reaches `@ai-council` correctly.
- [x] Confirm `@ai-council` no longer appears as a directly-selectable top-level OpenCode agent.
- [x] Run `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static/grep | Repo-wide direct-invocation caller sweep | `rg`/`grep` |
| Smoke | `/deep:ai-council` end-to-end reachability | Live dispatch (or best available equivalent in this environment) |
| Smoke | Orchestrate planning-dispatch reachability | Live dispatch (or best available equivalent) |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 009 | Predecessor | Not yet complete | Task-dispatch path to `@ai-council` not yet proven hardened |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Either smoke test fails post-conversion, or the grep sweep reveals a caller that genuinely cannot be redirected.
- **Procedure**: Revert `.opencode/agents/ai-council.md:4` back to `mode: all`; document the failed smoke-test evidence in `decision-record.md` as a new "Consequences" entry rather than silently reverting without a trace.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 009 (orchestrate routing) -> Phase 010 (this phase) -> Phase 011 (enforcement plugin)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 009 | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 011 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small (grep sweep) |
| Core Implementation | Very Low | Trivial (1-line change) |
| Verification | Medium | Medium (2 live smoke tests, higher stakes given research's contrary unanimous finding) |
| **Total** | | **Small-Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No persisted data migration.
- [x] Grep sweep completed and documented before the field change.
- [x] Both smoke tests planned and ready to run immediately after the field change (not deferred).

### Rollback Procedure
1. Revert `.opencode/agents/ai-council.md:4` to `mode: all`.
2. Document the specific failure evidence in `decision-record.md`.
3. Re-run both smoke tests against the reverted state to confirm the revert restores prior behavior.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File revert only.
<!-- /ANCHOR:enhanced-rollback -->

---
