---
title: "Implementation Plan: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening"
description: "Implement phase 016's Design Option B (external per-session state + iteration-aware counting) and fix the subagent_type=\"general\" identity-resolution gap in the existing mode-mismatch check, via the same prompt-text-parsing change."
trigger_phrases:
  - "implementation"
  - "plan"
  - "mk-deep-loop-guard hardening implementation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/003-guard-and-enforcement/003-loop-guard-implementation"
    last_updated_at: "2026-07-01T21:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; hermetic + live verification passing"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-017-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "State location: .opencode/skills/.loop-guard-state/{hex(sessionID)}.json, mirroring mk-goal.js's .opencode/skills/.goal-state/ convention exactly."
      - "Identity resolution order: Deep Route target_agent= first, then Agent: @X line, then raw subagent_type only when it isn't the literal general placeholder."
---
# Implementation Plan: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode plugin API (`tool.execute.before` hook), JavaScript (ESM) |
| **Framework** | OpenCode plugin loader, `mode-registry.json` |
| **Storage** | `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`, atomic write (temp file + rename), mirroring `mk-goal.js` |
| **Testing** | Hermetic `node:assert/strict` suite (`.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`) + live re-verification against the installed `opencode` host |

### Overview

Extends the existing `mk-deep-loop-guard.js` (phase 011) with a second, independent check (`Check 2`) alongside the original mode-mismatch check (`Check 1`), and fixes a real identity-resolution gap common to both checks. `resolveTargetIdentity()` parses the outgoing prompt text for `Deep Route: ... target_agent=@X` or `Agent: @X` first, since `orchestrate.md`'s real dispatch convention always sends `subagent_type: "general"`; it falls back to raw `subagent_type` only when that value is not the generic placeholder (covering direct-name callers, e.g. this repo's own fan-out lineage prompts). Loop-repeat detection is session-scoped (`sessionID` keyed), counts only non-command-driven dispatches to the 4 command-owned loop executors, and persists atomically per the `mk-goal.js` precedent so a plugin-internal write bug can never accidentally block an unrelated, correctly-routed dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 016 (research + design options) complete; Option B selected as this phase's target design.
- [x] `mk-goal.js`'s atomic-write pattern read directly and confirmed viable as this phase's persistence template.

### Definition of Done
- [x] `resolveTargetIdentity()` correctly resolves real `orchestrate`-style dispatches (`subagent_type="general"` + prompt-text identity) and direct-name dispatches.
- [x] Loop-repeat counter fires at the documented thresholds (1st silent, 2nd warn, 3rd+ warn/block) for command-owned loop executors only.
- [x] Command-driven iteration markers exempt a dispatch from counting.
- [x] Cross-session isolation confirmed (no shared counts between distinct `sessionID` values).
- [x] Fail-open confirmed for a state-directory write failure.
- [x] Hermetic test suite passes: original 8 scenarios (no regression) + new identity/loop scenarios.
- [x] Live re-verification against the real installed `opencode` host confirms no regression in the mode-mismatch + reject mechanism.
- [x] `check-comment-hygiene.sh` and `verify_alignment_drift.py --root .opencode/plugins` both pass clean.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two independent, sequentially-run checks inside the same `tool.execute.before` hook, sharing one identity-resolution helper. Each check fails open independently.

### Key Components

- **`resolveTargetIdentity(subagentType, promptText)`**: shared by both checks; prompt-text-first, `subagent_type`-fallback resolution.
- **Check 1 (mode-mismatch, phase 011, identity-fixed)**: unchanged detection logic, now fed a correctly-resolved target identity instead of the raw (often-uninformative) `subagent_type`.
- **Check 2 (loop-repeat, new)**: `recordLoopDispatch()` / `readLoopState()` / `writeLoopStateAtomic()` — session-scoped JSON state, keyed by `hex(sessionID)`, atomic temp-file-then-rename write, fail-open on any I/O error.
- **Iteration-state heuristic**: `ITERATION_MARKER_REGEX` recognizes `Iteration: N of M` and `STATE SUMMARY` markers as evidence a parent `/deep:*` command (not `orchestrate` directly) owns this dispatch.

### Data Flow

A Task-tool dispatch is about to execute → `tool.execute.before` fires → `resolveTargetIdentity()` resolves the real target agent from prompt text (or `subagent_type` fallback) → **Check 1**: if the target has a registry entry and the prompt declares a disagreeing `mode=X`, warn or throw (existing behavior, now correctly identity-resolved) → **Check 2**: if the target is a command-owned loop executor, read/update its session-scoped dispatch count (skipping the increment when the prompt carries an iteration marker), and warn or throw once the non-command-driven count crosses the threshold.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Mode-mismatch-only detector (phase 011) | Add identity resolution + loop-repeat detection | Hermetic test suite + live smoke |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | 8-scenario regression suite | Extend with identity/loop scenarios | `node mk-deep-loop-guard.test.cjs` exit 0 |
| `.opencode/skills/.loop-guard-state/` | Does not exist yet | New session-state directory, created on first loop-executor dispatch | Fail-open test (path collision) |
| `feature_catalog`/`manual_testing_playbook` `validation/mk-deep-loop-guard.md` | Documents phase-011 behavior only | Add loop-detection capability + env var | Doc read-through |

Required inventories:
- Same-class producers: none — this extends the sole existing consumer of `mode-registry.json` at this hook point.
- Consumers: `orchestrate.md`-issued Task dispatches (real-world, `subagent_type="general"`) and this repo's own fan-out lineage prompts (direct-name `subagent_type`) — both paths covered by `resolveTargetIdentity()`.
- Matrix axes: 4 loop executors x (command-driven / not) x (1st / 2nd / 3rd+ dispatch) x (warn mode / reject mode) — hermetic suite covers the full matrix; live smoke covers one representative mismatch+reject cell post-rewrite.
- Algorithm invariant: a plugin-internal error (registry unreadable, state-dir write failure) must fail open for the dispatch it was checking (NFR-R01 in `spec.md`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `mk-goal.js` directly to confirm the exact atomic-write pattern (temp file + rename) this phase follows.
- [x] Re-read `orchestrate.md`'s Priority table + dispatch template directly to confirm the `subagent_type="general"` convention and the `Agent: @X` prompt-line format this phase parses.

### Phase 2: Core Implementation
- [x] Implement `resolveTargetIdentity()`.
- [x] Rewire Check 1 (mode-mismatch) to use the resolved identity instead of raw `subagent_type`.
- [x] Implement Check 2 (loop-repeat): `sessionStateKey()`, `loopStatePath()`, `readLoopState()`, `writeLoopStateAtomic()`, `recordLoopDispatch()`, `loopRepeatDetail()`.
- [x] Wire both checks into the `tool.execute.before` hook, each independently fail-open.
- [x] Self-review pass caught and fixed two real bugs before any test run: an erroneous `new Date(0)` placeholder timestamp, and a double `"mk-deep-loop-guard:"` message prefix in the loop-repeat throw path.
- [x] Comment-hygiene pass caught and fixed one violation: a JSDoc comment referencing a spec-path ("phase 016 research Open Questions") — rewritten to state the durable technical limitation directly.

### Phase 3: Verification
- [x] Confirmed all 8 original hermetic scenarios still pass unmodified (no regression from the rewrite).
- [x] Extended the hermetic suite: identity resolution (Deep Route, Agent: line, unresolvable no-op), loop-repeat thresholds (1st/2nd/3rd, warn vs. reject), command-driven exemption, non-loop-executor exemption, cross-session isolation, fail-open (state-dir path collision).
- [x] Fixed a duplicate `let warned` declaration and a stale-directory fail-open fixture bug found while getting the extended suite to pass.
- [x] Ran `check-comment-hygiene.sh` and `verify_alignment_drift.py --root .opencode/plugins`: both clean.
- [x] Live re-verification: dispatched a real mismatched Task call through the installed `opencode` host with `MK_DEEP_LOOP_GUARD_REJECT=1`; confirmed the throw-blocks-dispatch mechanism still works post-rewrite, exercising `resolveTargetIdentity()`'s `subagent_type !== "general"` fallback branch under live conditions (the calling agent set `subagent_type="ai-council"` directly rather than the literal `"general"` placeholder, a real and valid code path).
- [x] Confirmed no stray `.loop-guard-state/` file was created for the live test's `ai-council` target (correctly excluded from `LOOP_EXECUTOR_AGENTS`).
- [x] Ran `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hermetic unit | Identity resolution, loop-repeat thresholds, command-driven/non-loop-executor exemptions, cross-session isolation, fail-open | `node .opencode/plugins/tests/mk-deep-loop-guard.test.cjs` |
| Live smoke | Mode-mismatch + reject-blocks-dispatch mechanism, post-rewrite, real host | `opencode run --agent general ...` with `MK_DEEP_LOOP_GUARD_REJECT=1` |
| Static | Comment hygiene, alignment drift | `check-comment-hygiene.sh`, `verify_alignment_drift.py --root .opencode/plugins` |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 016 (research + design options) | Predecessor | Complete | Implementing without the cross-validated design would risk re-deriving a weaker heuristic |
| Phase 011 (original plugin) | Predecessor | Complete | This phase extends, not replaces, its mode-mismatch check |
| `mk-goal.js` (atomic-write precedent) | Reference | Available, read directly | Confirms the persistence pattern is proven in this exact plugin ecosystem |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop-repeat detection produces false-positive blocks on legitimate command-driven traffic in real usage, or the new identity resolution misfires on a dispatch shape not covered by this phase's testing.
- **Procedure**: Revert `mk-deep-loop-guard.js` and its test file to the phase-011 commit (`git revert` on this phase's commit); `MK_DEEP_LOOP_GUARD_REJECT_LOOP` simply stops being read once Check 2 is removed, with zero effect on the independent Check 1 (mode-mismatch) behavior or the existing `MK_DEEP_LOOP_GUARD_REJECT` env var.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 016 (research) -> Phase 017 (this phase)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 016 | Core |
| Core | Setup | Verify |
| Verify | Core | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small (re-confirm two already-read source files) |
| Core Implementation | Medium | Medium (new identity-resolution helper + session-state subsystem) |
| Verification | Medium | Medium (hermetic suite extension + one live smoke) |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No persisted data migration (new state directory starts empty).
- [x] Fail-open guard implemented and tested for both the mode-mismatch check (pre-existing) and the new loop-repeat check.
- [x] New env var (`MK_DEEP_LOOP_GUARD_REJECT_LOOP`) is independent and opt-in; default behavior for existing deployments is unchanged (warn-only).

### Rollback Procedure
1. `git revert` this phase's commit.
2. Confirm phase 011's original mode-mismatch behavior is restored and its own tests still pass.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete `.opencode/skills/.loop-guard-state/` if present; it is regenerated on demand and holds no data needed by anything else.
<!-- /ANCHOR:enhanced-rollback -->

---
