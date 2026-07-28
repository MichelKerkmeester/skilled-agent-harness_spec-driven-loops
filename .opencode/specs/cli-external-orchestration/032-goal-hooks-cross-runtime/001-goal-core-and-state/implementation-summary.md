---
title: "Implementation Summary: Runtime-neutral goal core + shared active-goal state + manage CLI"
description: "Phase 001 built and verified: goal-core.cjs, the manage CLI, and their co-located test suite are shipped (uncommitted) on the branch."
trigger_phrases:
  - "goal core implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state"
    last_updated_at: "2026-07-28T17:38:00Z"
    last_updated_by: "claude"
    recent_action: "Build goal core, CLI and tests; 27/27 pass"
    next_safe_action: "Run capability probes for phase 002"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/lib/goal-core.test.cjs"
      - ".opencode/hooks/goal/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-goal-core-and-state |
| **Completed** | 2026-07-28 (uncommitted on `skilled/v4.0.0.0`) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new `.opencode/hooks/goal/` concern, shipped this session (uncommitted on the branch):

- **`lib/goal-core.cjs`** (686 lines): shared-state atomic read/write (temp+rename, `0600`), the `[active_goal]` block renderer (byte-compatible with `mk-goal.js`'s template outside a parameterized Role line), ported `normalizeUserAuthoredText` hardening (NFKC normalization, bidi/zero-width stripping, marker redaction, homoglyph folding, instruction-override redaction, backtick downgrade), a ported heuristic verifier, and turn/wall-clock accounting with an honestly-labeled `usageSource`.
- **`bin/goal.cjs`** (222 lines): the manage CLI with actions `set/show/history/clear/complete/pause/resume/doctor`, mirroring `/goal:goal-opencode`'s router contract (envelope shape, `--budget` parsing, error codes including `PLUGIN_DISABLED`, and bare-text-falls-to-set behavior).
- **`lib/goal-core.test.cjs`** (304 lines, 27 tests): co-located `node --test` suite covering state roundtrip/atomicity, mode-0600, archive-on-clear/complete, byte-shape render + parameterized Role line, compact fallback, hardening cases, heuristic verdicts, and CLI envelopes/error codes.
- **`README.md`**: behavioral-style documentation; `validate_document.py` reports 0 issues.

### Files Built

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/goal/lib/goal-core.cjs` | Created (686 lines) | Shared-state I/O, block renderer, hardening, verifier, accounting. |
| `.opencode/hooks/goal/bin/goal.cjs` | Created (222 lines) | Manage CLI mirroring `/goal:goal-opencode`'s router contract. |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | Created (304 lines, 27 tests) | `node --test` coverage for the above. |
| `.opencode/hooks/goal/README.md` | Created | Behavioral documentation; `validate_document.py` 0 issues. |
| `.opencode/skills/.goal-state/active-goal.json` | Runtime-generated | Shared cross-runtime goal state; created on first `set`, overridable via `MK_GOAL_STATE_DIR` for tests. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`mk-goal.js` and `goal-opencode.md` were read in full as the reference implementation and contract target, then `goal-core.cjs` was built with the shared-state I/O, block renderer, ported hardening, ported verifier, and turn/wall-clock accounting, followed by `bin/goal.cjs` wrapping the core with the manage CLI actions. The co-located `goal-core.test.cjs` suite (27 tests) was written alongside and passes 27/27. The coordinating session independently re-ran the suite (27/27 confirmed) and performed a live CLI smoke test — set/show/clear with an isolated `MK_GOAL_STATE_DIR` — producing the correct `STATUS=`/`ACTION=` envelopes. `mk-goal.js` and `/goal:goal-opencode` were left untouched throughout. All deliverables are currently uncommitted on `skilled/v4.0.0.0`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Author the phase spec-doc set before implementation, then build against it. | The parent packet's plan calls for scaffolding all 8 phase children with spec docs before implementing 001-008 in order. |
| Scope this phase to the core + shared state + manage CLI only, no runtime adapters. | Per-runtime injection adapters (003/004/005) depend on this phase's core and on phase 002's capability probes; keeping them separate avoids building adapter code against an unstable core. |
| Record `usageSource` honestly rather than fabricating token counts for non-OpenCode runtimes. | No native token-usage feed exists outside OpenCode; the `usage:` line reports `tokens n/a/<budget>` with `(source: turn-count-estimate)` rather than fabricating a token count. |
| Status vocabulary is `active\|paused\|completed\|cleared`. | Plan-specified subset, narrower than mk-goal's larger status vocabulary — deliberate scope reduction for this phase, not an oversight. |
| Hardening pass order (role-fold before instruction-override redaction) inherited from `mk-goal.js` as-is. | Preserves parity with the reference implementation rather than re-deriving an ordering; flagged here in case a future pass wants to revisit it. |
| Per-runtime adapters intentionally NOT built in this phase. | Scoped to phases 003-005, gated on phase 002's capability probes, per `spec.md`'s Out of Scope section. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `goal-core.cjs` `node --test` suite | `node --test .opencode/hooks/goal/lib/goal-core.test.cjs` → 27/27 pass |
| `goal.cjs` `node --test` suite | Covered within the same 27-test suite (CLI envelopes, error codes, `PLUGIN_DISABLED`, bare-text-falls-to-set) — 27/27 pass |
| Independent re-run by coordinating session | 27/27 confirmed, plus a live CLI smoke test (set/show/clear with isolated `MK_GOAL_STATE_DIR`) producing correct `STATUS=`/`ACTION=` envelopes |
| Byte-diff test vs. `mk-goal.js` template | Passing — byte-shape render + parameterized Role line test in the 27-test suite |
| CLI parity test table vs. `/goal:goal-opencode` | Passing — envelope shape and error codes verified via CLI tests and the live smoke test |
| `git diff` confirms `mk-goal.js`/`goal-opencode.md` unmodified | Confirmed — zero changes under either path |
| `validate.sh --strict` on this spec folder | See closing validate run this session |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No native token feed outside OpenCode.** The `usage:` line reports `tokens n/a/<budget>` with `(source: turn-count-estimate)` rather than a real token count — this is a documented, honest constraint, not a bug.
2. **Status vocabulary is narrower than mk-goal's.** `active|paused|completed|cleared` (plan-specified) vs. mk-goal's larger status set — a deliberate scope choice for this phase.
3. **Hardening pass order (role-fold before instruction-override redaction) is inherited from `mk-goal.js` as-is**, not independently re-derived; noted here for anyone auditing the ordering later.
4. **Per-runtime adapters are intentionally not built in this phase.** Devin/Cursor/Pi injection, restore, and verify hooks are phases 003-005, gated on phase 002's capability probes.
5. **Shared single state file, not per-session.** Two concurrent non-OpenCode sessions could clobber each other's goal; atomic writes prevent corruption but not concurrent-session clobbering, a known and documented constraint of the operator-chosen shared-file model (see `spec.md` §6 Risks).
6. **All deliverables are currently uncommitted** on `skilled/v4.0.0.0`.
<!-- /ANCHOR:limitations -->
