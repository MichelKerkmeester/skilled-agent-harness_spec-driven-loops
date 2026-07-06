---
title: "Implementation Summary: Deep Research Reducer-Anchor Template Fix (028/004)"
description: "The shipped deep-research strategy template now carries the 7 reducer-owned ANCHOR markers, so a freshly-copied strategy folds deterministically instead of hard-failing on the first reduce. Template-only, no runtime change. Landed in commit 738e118751."
trigger_phrases:
  - "reducer anchor fix summary"
  - "Q6 anchor implementation summary"
  - "deep research strategy template fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/001-reducer-anchor-fix"
    last_updated_at: "2026-07-06T16:24:27.982Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the DONE Q6-anchor reducer template fix against commit 738e118751"
    next_safe_action: "None, candidate COMPLETE. Sibling D2/D3/Q2 ships in separate 004 sub-phases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-001-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-deep-loop/038-deep-loop-runtime/001-reducer-anchor-fix` |
| **Completed** | 2026-06-18 |
| **Level** | 1 |
| **Shipped commit** | `738e118751` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A freshly-copied deep-research strategy file now folds its cross-iteration state cleanly instead of crashing on the first reduce. The shipped template `deep_research_strategy.md` previously carried thirteen section headings but none of the `ANCHOR:*` markers the reducer keys on, so the very first reduce after iteration 1 threw `Missing anchor section key-questions in strategy file` and the loop could not advance. The fix wraps the seven reducer-owned headings in their anchor pairs, restoring deterministic reducer behavior for every new deep-research run.

### The seven reducer anchor pairs

The reducer's `updateStrategyContent` (`reduce-state.cjs:734-745`) rewrites seven anchored sections each reduce: `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`. For each one, `replaceAnchorSection` (`:699-714`) requires a matching `ANCHOR:<id>` … `/ANCHOR:<id>` HTML-comment pair and throws if it is absent. You now get those pairs in the shipped template, so the reducer's regex matches on a clean copy and the section is rewritten in place rather than raising. This is a determinism-spine repair: a reducer that hard-fails on a fresh strategy is non-deterministic at the loop level, and this session's own driver hit the throw and hand-patched its working copy before the fix landed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modified | Added the 7 reducer-owned `ANCHOR:<id>` / `/ANCHOR:<id>` HTML-comment marker pairs (+14 marker lines) so `reduce-state.cjs` no longer hard-fails on a fresh copy. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Shipped as a single additive, template-only hunk in commit `738e118751` on the 027 branch, no runtime-code change, no dependencies. Verified by confirming the template now carries 14 `ANCHOR:` markers (the 7 pairs, at lines 39/58/66/74/82/98/106) and that each id matches the `replaceAnchorSection` regex, so a freshly-copied strategy reduces past iteration 1 without the throw.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the template, not the reducer | The reducer regex is the correct, fixed contract. The bug was the shipped template never satisfying it. Editing the template is the minimal, zero-blast-radius fix. |
| Wrap only the 7 `updateStrategyContent` headings | Those are the exact ids that throw on a fresh copy. The reducer's other anchors are written elsewhere and were never the hard-failure surface. |
| Ship this first, ahead of the rest of the deep-loop catalog | It is the only unconditional win, confirmed correctness defect, near-zero effort/risk, no dependency on the absent D2 reliability signal that gates D1/D3/Q2. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Template carries the 7 anchor pairs | PASS, grep of the open-marker comment = 14. All 7 ids present (lines 39/58/66/74/82/98/106) |
| Reducer regex matches all 7 ids on a fresh copy | PASS, 030 §14: "7 anchor pairs added, reducer regex verified (all 7 match)" |
| Template-only diff (no runtime-code change) | PASS, commit `738e118751` touches only `deep_research_strategy.md` (+14) plus the 030 scaffold. `reduce-state.cjs` unchanged |
| Independent live re-verification (first-hand) | PASS, `node --check reduce-state.cjs` OK. The deep-loop reducer suite (`deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts`) is 4/4 green. Each of the 7 `replaceAnchorSection`-target ids matches the reducer regex against the current shipped template (open=1/close=1 per id). The reducer's 8th anchor `carried-forward-open-questions` uses the non-throwing `upsertAnchorSectionBefore` path and is not part of the 7-id hard-failure surface. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope is the 7 `updateStrategyContent` anchors only.** The reducer writes other anchored sections elsewhere (`reduce-state.cjs:785+`). Those were never part of the hard-failure surface and are out of scope here.
2. **The reliability-weighted deep-loop cluster (D1/D2/D3/Q2) is unaffected and still open.** D2 is a wholly-absent net-new build (every input is `r=0.5` today), so it remains NO-GO until built and benchmarked, in sibling sub-phases of `004-deep-loop`. This fix is fully independent of that cluster.
<!-- /ANCHOR:limitations -->

---

## Related Documents

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Shipped record (Wave-0)**: Wave-0 record (commit `738e118751`)
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md`
