---
title: "Implementation Summary: Learning Feedback Loop Repair"
description: "Repaired sixteen correctness bugs across the memory learning/feedback loop — cache-hit access tracking, FSRS last_review format, learned-term expiry, batch-learning sign and idempotency, promotion/demotion hysteresis, seven bounded ledger sweeps, shadow-evaluation honesty, true-citation precision, corrections delta-undo, quality-loop pairing, prediction-error audit, and working-memory decay stability — so the loop learns from real signal instead of drifting on stale or double-counted data."
trigger_phrases:
  - "learning feedback loop repair"
  - "fsrs last_review format"
  - "ledger sweep bounds"
  - "promotion demotion hysteresis"
  - "shadow evaluation honesty"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/009-learning-feedback-loop-repair"
    last_updated_at: "2026-07-04T14:09:13.269Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated 009 (16 REQs); 767 tests green; two new gated /memory:manage maintenance tools"
    next_safe_action: "Phase 010 search-hot-path-performance"
    blockers: []
    key_files:
      - "mcp_server/lib/feedback/batch-learning.ts"
      - "mcp_server/lib/search/auto-promotion.ts"
      - "mcp_server/lib/cognitive/working-memory.ts"
      - "mcp_server/handlers/memory-learned-maintenance.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "trackAccess production enablement is deferred to an operator-controlled rollout (decision-record.md) — assess against the phase 010 search hot-path latency budget before enabling"
    answered_questions:
      - "REQ-001 access tracking is validated preventively: a fixture forces trackAccess on to prove the cached-path mechanism; production stays default-off with zero enablers"
      - "REQ-006 spare-only retention re-validation already shipped; the deliverable was the interleaving test, and the re-validation logic was left unchanged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-learning-feedback-loop-repair |
| **Completed** | 2026-07-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory learning loop had sixteen ways to learn the wrong thing, and this phase closes all of them. On the fuel side, cache-hit access tracking now updates access metadata on the cached search path when a caller opts in (the production default stays off), FSRS `last_review` is written in one ISO-8601 UTC format everywhere — the missed `datetime('now')` site in prediction-error gating was the last holdout — and an empty post-insert metadata call no longer refreshes review time. On the learning side, the learned-term cap ignores expired terms so a memory whose eight terms are all stale can still learn; batch learning aggregates in SQL instead of per-row JS, treats a `query_reformulated` signal as negative (it was inflating boost), and is idempotent so re-running a window inserts no duplicate rows; corrections retries are no-ops and undo reverses by delta instead of restoring a stale absolute; and auto-promotion gained demotion with hysteresis, a per-memory throttle, and batched negative-count fetches so sustained negative signal demotes a memory without flapping at the boundary.

On governance and evaluation: all seven feedback ledgers now have age-based sweeps that are dry-run by default and never delete rows inside an active shadow window (a MIN-timestamp guard), the retention extend-window decision sees usage beyond the current 7-day span, shadow-evaluation cycles without query-scoped labels are recorded as unlabeled instead of silently vanishing (and empty holdouts record no NDCG or promotion signal), true-citation matching stops treating "8 packets" as a citation (bare ids need ≥2 digits) while matching anchors on a two-of-three word subset with session-scoped uniqueness, the quality loop pairs a rejection's `bestContent` with that same attempt's score and stops writing `eval_run_id=0`, the prediction-error gate is initialized at server startup so audit rows actually get written, the eval dashboard reads `ablation_latency_*` as lower-is-better, and FSRS classification decay short-circuits before the hybrid no-decay branch so no memory gets both policies. The absorbed working-memory fix separates the decayed base score from the additive mention boost, so repeated scoring passes no longer re-apply full decay and re-add the boost each time — attention stays in a stable mid-range instead of degenerating to binary.

### Operator maintenance surface

Two learned-trigger maintenance operations are now invocable through `/memory:manage`: `memory_learned_expire` (dry-run by default, previews how many stale terms would be expired) and `memory_learned_clear` (requires an explicit `confirm: true` gate before clearing all learned triggers). Both are exposed as gated MCP tools, consistent with the rule that mutation runs only from the command surface, never from a prompt-time hook.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented the 16 REQs; GPT-5.5-fast (xhigh) adversarially verified each against file:line and passed 12, failing REQ-002 (a missed `last_review` write in prediction-error gating), REQ-003 (the maintenance functions existed but had no `/memory:manage` route), REQ-008 (unlabeled shadow cycles weren't recorded), and REQ-014 (the code was correct but two existing decay tests still asserted the old full-decay formula). GPT-high remediated exactly those four, and Opus 4.8 confirmed the fixes were real — including that the REQ-014 test was updated to values derived from the corrected formula with a genuine non-degeneracy assertion (`score > boost` and still monotonically decaying), not forced green. Opus integrated the 45 in-scope files (excluding an unrelated 1,841-file `description.json` churn and a concurrent session's validation WIP) and ran the full suite. The seven ledger sweeps were verified against injected aged fixtures rather than the live corpus, which holds only ~65 lifetime accesses and near-empty ledgers.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Access tracking validated preventively (fixture forces `trackAccess` on) | The corpus has ~65 lifetime accesses, so no organic strengthening exists to observe; a synthetic fixture proves the cached-path mechanism without faking data |
| `trackAccess` stays default-off; prod enablement deferred to operator | Enabling it adds a write on every search cache hit; that trade belongs with the phase 010 hot-path latency budget, not this phase (decision-record.md) |
| Ledger sweeps ship dry-run-default, proven on fixtures, not applied live | They are recurring maintenance, not a one-time correction; the live ledgers are near-empty, so there is nothing to sweep now — the mechanism is the deliverable |
| REQ-014 stale tests updated to the corrected formula, not the code | The base score decays geometrically and the mention boost is additive per pass; the old test asserted a compounding formula the fix deliberately removed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --build` (integrated main) | PASS (exit 0) |
| 009 targeted vitest (15 files) | PASS (767 passed, 13 skipped) |
| REQ-001..016 xhigh review | PASS (12/16 first pass) |
| REQ-002, 003, 008, 014 remediated + re-verified | PASS (ISO write, `/memory:manage` route, unlabeled recording, corrected decay test) |
| Seven ledger sweeps dry-run-default | PASS (proven on injected aged fixtures; MIN-timestamp shadow guard) |
| `trackAccess` production default | PASS (still off; zero new enablers — grep-confirmed) |
| Pre-existing BM25 fallback integration failure | Unrelated to 009 (touches no BM25/source-labelling file) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Code effects apply on the next daemon-lease restart.** The learning, promotion, sweep, and evaluation changes take effect when the daemon reloads the rebuilt dist (shared deployment debt with phases 001–008).
2. **No live data was migrated.** Unlike the corpus-correcting phases, 009 ships mechanisms — the seven sweeps and the two maintenance tools are dry-run/confirm-gated and operator-invoked; nothing was applied to the live corpus.
3. **`trackAccess` production enablement is an open operator decision.** Recorded as deferred in decision-record.md; it should be assessed against the phase 010 hot-path latency and write-amplification budget before enabling.
4. **The MCP tool surface grew by two** (`memory_learned_expire`, `memory_learned_clear`), so any doc that states a fixed tool count (e.g. the "39 tools" note) is now stale — a doc-alignment follow-up for phase 012.
<!-- /ANCHOR:limitations -->
