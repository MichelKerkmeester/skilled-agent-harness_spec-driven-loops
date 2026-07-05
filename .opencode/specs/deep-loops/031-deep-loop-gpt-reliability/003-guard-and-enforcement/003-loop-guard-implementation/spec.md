---
title: "Feature Specification: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening"
description: "Implement phase 016's recommended Option B: extend mk-deep-loop-guard.js with session-scoped, iteration-aware loop-repeat detection for orchestrate-to-command-owned-loop-executor dispatches, and fix the independently-verified subagent_type=\"general\" identity-resolution gap in the existing mode-mismatch check."
trigger_phrases:
  - "mk-deep-loop-guard hardening implementation"
  - "loop-repeat detection plugin"
  - "subagent_type general identity fix"
importance_tier: "high"
contextType: "implementation"
predecessor_research: "../016-mk-deep-loop-guard-hardening/implementation-summary.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/003-loop-guard-implementation"
    last_updated_at: "2026-07-01T21:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; hermetic + live verification passing"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - "../016-mk-deep-loop-guard-hardening/implementation-summary.md"
      - ".opencode/plugins/mk-deep-loop-guard.js"
      - ".opencode/plugins/tests/mk-deep-loop-guard.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-017-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Design Option B (external per-session state + iteration-aware counting) selected per both research lineages' primary recommendation, following mk-goal.js's atomic-write precedent."
      - "The subagent_type=\"general\" identity-resolution gap flagged in phase 016 is fixed by the same prompt-text-parsing change this phase needed anyway (resolveTargetIdentity())."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `031-deep-loop-gpt-reliability` |
| **Predecessor** | `../016-mk-deep-loop-guard-hardening/` (research + design options) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 016's research confirmed two real gaps in the phase-011 `mk-deep-loop-guard.js` plugin: (1) it has no mechanism to detect loop-like repeated `orchestrate`-to-command-owned-loop-executor dispatches within a session (phase 012's benchmark measured GPT-5.5 inconsistently refusing one direct dispatch while allowing an identical one); (2) its existing mode-mismatch check resolves the dispatch target via `registry.get(args.subagent_type)`, but `orchestrate.md`'s own dispatch convention sets `subagent_type: "general"` on every Task call (independently re-verified against `orchestrate.md`'s real content, not trusted from research alone) — meaning the shipped check silently no-ops on real `orchestrate`-routed dispatches, the exact path it was built to guard.

### Purpose

Implement Design Option B from phase 016 (both research lineages' primary recommendation): session-scoped external state (`.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`, following `mk-goal.js`'s atomic-write pattern) with an iteration-state heuristic that exempts legitimate command-driven loop iterations from counting. Fix the `subagent_type="general"` gap as part of the same change, since both require identical prompt-text identity parsing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `resolveTargetIdentity()`: parse `Deep Route: ... target_agent=@X` / `Agent: @X` from the prompt body first; fall back to `subagent_type` only when it isn't the generic `"general"` placeholder.
- Session-scoped, atomically-persisted loop-repeat dispatch counter for command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`), excluding generic subagents and `ai-council`.
- Iteration-state heuristic (`Iteration: N of M` / `STATE SUMMARY` markers) to exempt command-driven dispatches from the loop-repeat count.
- Threshold: 1st = silent allow, 2nd = warn, 3rd+ = warn (default) or block (new `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` env var, independent of the existing `MK_DEEP_LOOP_GUARD_REJECT`).
- Extend the hermetic test suite to cover identity resolution, loop-repeat thresholds, command-driven exemption, non-loop-executor exemption, cross-session isolation, and fail-open behavior.
- Live re-verification against the real installed `opencode` host (mismatch + reject path, post-rewrite, exercising the new `resolveTargetIdentity()` fallback branch).
- Feature-catalog (F050) and manual-testing-playbook (DLR-052) entries updated for the new loop-detection capability and env var.

### Out of Scope

- Design Option C (prompt-shape companion guard requiring `execution=single_iteration`) — flagged by phase 016 as a complementary future addition, not required for this phase's fix.
- `prompt-improver`'s missing `mode-registry.json` entry (phase 016 limitation #3) — unrelated to loop-repeat detection or identity resolution; tracked separately if it becomes relevant.
- Any change to `orchestrate.md`'s own dispatch convention — this phase adapts the guard to the convention as documented, not the other way around.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Modify | Add `resolveTargetIdentity()`, session-scoped loop-repeat state + detection (Check 2), keep existing mode-mismatch check (Check 1) identity-fixed |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Modify | Extend hermetic coverage for identity resolution + loop-repeat scenarios |
| `.opencode/skills/deep-loop-runtime/feature_catalog/03--validation/mk-deep-loop-guard.md` | Modify | Document loop-detection capability + new env var |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/03--validation/mk-deep-loop-guard.md` | Modify | Document new test scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identity resolution works for real `orchestrate`-style dispatches | `resolveTargetIdentity()` correctly resolves the target agent from `Deep Route:`/`Agent:` prompt text when `subagent_type="general"`, and falls back correctly when it isn't. |
| REQ-002 | Loop-repeat detection fires on the correct threshold | 1st non-command-driven hand-off silent, 2nd warns, 3rd+ warns (default) or blocks (`MK_DEEP_LOOP_GUARD_REJECT_LOOP=1`). |
| REQ-003 | Command-driven iterations never count | A prompt carrying `Iteration: N of M` or `STATE SUMMARY` never increments the loop-repeat counter, regardless of repeat count. |
| REQ-004 | Session isolation | Loop-repeat counts do not leak across different `sessionID` values. |
| REQ-005 | Fail-open preserved | A state-directory write failure (e.g., path collision) must never block an otherwise-valid dispatch. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Hermetic test suite (`mk-deep-loop-guard.test.cjs`) passes with all original + new scenarios, 0 failures.
- **SC-002**: Live re-verification against the real installed `opencode` host confirms no regression in the mode-mismatch + reject mechanism post-rewrite.
- **SC-003**: `check-comment-hygiene.sh` and `verify_alignment_drift.py --root .opencode/plugins` both pass clean.
- **SC-004**: `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Iteration-marker heuristic false-negatives on a legitimate command-driven dispatch with unusual prompt formatting | Legitimate loop iterations spuriously counted, risking a false block at 3rd hand-off | Regex accepts both `Iteration: N of M` and `STATE SUMMARY` markers (the two real conventions confirmed by phase 016's research across 4 living docs); default mode is warn-only until `MK_DEEP_LOOP_GUARD_REJECT_LOOP` is explicitly opted into |
| Risk | Session-state persistence adds a new failure surface (disk I/O) | A write bug could throw and incorrectly block dispatches | `writeLoopStateAtomic()` catches all errors internally and no-ops (fail open), matching the existing mode-mismatch check's fail-open discipline |
| Dependency | Phase 016 (research + design options) | Provides the validated design this phase implements | Complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Loop-state persistence failure must fail open, never fail closed for unrelated dispatches (same discipline as the existing mode-mismatch check).

### Maintainability
- **NFR-M01**: Loop-executor set (`LOOP_EXECUTOR_AGENTS`) and iteration-marker regex are named constants, not inline magic values, so future additions (e.g. a 5th loop executor) are a one-line change.

### Compatibility
- **NFR-C01**: `MK_DEEP_LOOP_GUARD_REJECT_LOOP` is a new, independent env var — does not change the existing `MK_DEEP_LOOP_GUARD_REJECT` behavior or its default.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A Task dispatch to a non-loop-executor target (e.g., `ai-council`, `context`, `review`) must never be loop-counted, even when repeated many times in the same session.

### Error Scenarios
- Loop-guard state directory path collides with an existing file (not a directory): `writeLoopStateAtomic()`'s `mkdirSync` fails, caught, dispatch proceeds unblocked.
- Loop-guard state file contains malformed JSON: `readLoopState()` catches the parse error and returns an empty state, effectively resetting the count rather than throwing.

### State Transitions
- Cross-session: two different `sessionID` values dispatching to the same loop executor must maintain independent counts (separate state files, keyed by `hex(sessionID)`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Extends one existing plugin file + its test; no new files besides catalog/playbook doc updates |
| Risk | 12/25 | Fail-open by design; worst case is a missed loop-repeat detection, not a false block, unless the opt-in reject env var is set |
| Research | 18/20 | Design fully specified and cross-validated by two independent research lineages in phase 016; only wiring remained |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Research**: `../016-mk-deep-loop-guard-hardening/implementation-summary.md` (Design Option B, load-bearing `subagent_type="general"` finding)
- **Predecessor**: `../011-deep-route-guard-plugin/` (original mode-mismatch-only plugin)
- **Parent Spec**: `../spec.md`
