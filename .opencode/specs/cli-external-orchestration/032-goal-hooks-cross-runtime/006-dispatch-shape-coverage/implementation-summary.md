---
title: "Implementation Summary: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Not yet delivered. This document records the planned state for the dispatch-shape coverage phase; nothing described here has been built, and no verification has been run."
trigger_phrases:
  - "dispatch shape coverage summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored planned-state phase doc, nothing built yet"
    next_safe_action: "Implement per plan.md once phase is picked up"
    blockers:
      - "Not yet implemented; no code changed under this phase."
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Severity mapping decision (see spec.md Open Questions)."
      - "Whether the three missing CHECKS entries get implemented in this phase or a follow-up."
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
| **Spec Folder** | 006-dispatch-shape-coverage |
| **Completed** | Not yet completed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet delivered. This phase is Planned only. Once implemented, it will extend the shared `DISPATCH_SHAPES` registry in `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` with three new dispatch-shape regexes (`devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print`), fold Codex's locally-bolted-on `CODEX_EXEC_SHAPE` into that same shared registry (removing the local duplicate in `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`), and implement an explicit `severity: error` -> `block`/`warn` mapping decision in `evaluate()` (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`), verified against that function's real current source rather than assumed.

### Planned: `DISPATCH_SHAPES` extension

Three new entries mirroring the existing `{ test, skill, packetPath }` shape, plus the Codex entry moved in from its current adapter-local location.

### Planned: severity-mapping resolution

`evaluate()` currently maps `severity === 'block' ? 'block' : 'warn'` (confirmed by direct read this session), so a `severity: error` hard rule — the only severity value declared by `cli-devin`/`cli-cursor`/`cli-pi`/`cli-codex` today — silently falls into `warn`. This phase will make that an explicit, tested decision.

### Files Not Yet Changed

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Add 3 new shape entries + fold in the Codex shape. |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Explicit severity-mapping branch. |
| `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Modify | Remove `CODEX_EXEC_SHAPE`/`DISPATCH_SKILLS`, read `DISPATCH_SHAPES` directly. |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs` | Modify | Regression tests per new shape + severity-mapping test. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. No implementation session has run against this phase; this packet was authored ahead of implementation per the parent packet's phased-authoring convention (all children scaffolded with spec docs before implementation begins in order).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope this phase to shape-matching + severity-mapping only, not the three missing `CHECKS` function implementations. | The parent packet's plan text describes this phase as activating the hard_rules, but a direct read of `evaluate()`'s `if (!fn) continue` guard shows shape-matching alone does not cause any check to actually run until `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` exist in `CHECKS` — none do today. Scoping this phase narrowly and disclosing the gap avoids an overclaimed completion. |
| Fold Codex's shape into the shared registry rather than leaving both the shared and local copies. | Any adapter reading `DISPATCH_SHAPES` directly (e.g. the Pi preflight-lint adapter) currently cannot see the Codex shape at all; a single source of truth removes that inconsistency. |
| Treat this phase as functionally independent of phases 001-005. | It touches an unrelated hook concern (`dispatch/`, not `goal/`) with no shared state or import; ordered 006 for packet narrative only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three new shape regressions (devin/cursor/pi) | Not yet run |
| Codex fold-in, zero remaining local duplicate (`rg -n "CODEX_EXEC_SHAPE"`) | Not yet run |
| Severity-mapping test | Not yet run |
| Full dispatch-family suite re-run | Not yet run |
| `validate.sh --strict` on this spec folder | Not yet run against implementation (spec-doc authoring pass only) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing implemented yet.** This document, and the rest of this spec folder, is a planning artifact authored ahead of the actual code change. No line of `dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, or the Codex adapter has been touched under this phase.
2. **The three referenced `CHECKS` functions remain unimplemented, in scope or out.** `command-v-devin-required`, `devin-self-invocation-guard`, `command-v-cursor-agent-required`, `cursor-self-invocation-guard`, `command-v-pi-required`, `pi-self-invocation-guard`, and `deep-loop-runtime-delegation` (shared check ID across all four `cli-*` skills) do not exist in `CHECKS` as of this authoring pass, confirmed via `rg`. Shape-matching alone (this phase's actual deliverable) makes `readHardRules()` find these rules and pass them to `evaluate()`, but `evaluate()`'s `if (!fn) continue` guard means they will still be silently skipped, not violated, until those check functions are implemented — a decision explicitly left open for a follow-up phase (see spec.md Open Questions).
3. **Severity-mapping decision not yet made.** Whether `severity: error` becomes `block` or `warn` in `evaluate()` is deferred to implementation time, to be grounded in a direct read of the function's real source rather than assumed from the parent packet's plan-text description.
<!-- /ANCHOR:limitations -->
