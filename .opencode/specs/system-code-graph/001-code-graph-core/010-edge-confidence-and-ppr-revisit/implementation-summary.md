---
title: "Implementation Summary: Edge-Confidence Differentiation and Seeded-PPR Revisit"
description: "Built real per-edge confidence differentiation for CALLS edges (reusing a signal the extractor was already computing and discarding), recovered the deleted seeded-PPR module from git history, and re-ran its original benchmark. Verdict: CUT stands, and the gap widened."
trigger_phrases:
  - "edge confidence differentiation summary"
  - "seeded ppr revisit result"
  - "ppr cut confirmed again"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit"
    last_updated_at: "2026-07-06T16:45:35.982Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All items complete and verified"
    next_safe_action: "Sync to live tree; no further PPR revisit planned"
    blockers: []
    key_files:
      - "spec.md"
      - "../005-seeded-ppr-ranking/implementation-summary.md"
      - "../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-010-edge-confidence-ppr-revisit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does PPR perform differently once CALLS-edge confidence stops being uniform? Yes - it gets worse, not better. It went from an exact tie with the flat walk to losing on every metric."
      - "Was the confidence-differentiation feasible without a parser rewrite? Yes - the resolution-quality signal already existed in cross-file-edge-resolver.ts, it was just being discarded instead of written to edge metadata."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-code-graph/010-edge-confidence-and-ppr-revisit |
| **Completed** | 2026-07-01 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seeded-PPR code-graph ranking was cut once already because every CALLS edge carried identical confidence metadata, giving it nothing to differentiate on - and the repo's own benchmark record explicitly left the door open: "not a refute of PPR as an algorithm, a verdict on this substrate." This packet built the missing prerequisite, gave PPR a fair second test, and got a clear answer: it's worse with a real gradient than it was tied without one.

### Real edge-confidence differentiation

`cross-file-edge-resolver.ts` was already classifying every cross-file CALLS edge as resolved, ambiguously-skipped, or unresolved - it just threw that classification away after using it to fix up `target_id`. This phase makes it write that same classification into edge metadata (confidence 0.9/EXTRACTED for a clean resolution, 0.3/AMBIGUOUS for a multi-candidate tie), and adds a same-file candidate-cardinality check to `structural-indexer.ts` for the same-file case (0.75/INFERRED for a single candidate, 0.35/AMBIGUOUS for multiple). Both changes are gated behind a new flag, `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, default off - with it off, every CALLS edge still gets exactly the same `0.8/INFERRED/heuristic` metadata as before this change, proven by the existing test suite passing identically with the flag unset.

### Recovered seeded-PPR, re-wired to the new signal

The seeded-PPR module (`computeBoundedPersonalizedPageRank` and its supporting code) was deleted at commit `277c35344c` after its first cut. Rather than rebuild it from scratch, this phase recovered the original implementation from git history and re-wired its transition weights to consume the new differentiated confidence via the existing `contextEdgeReliability` blend, which was already live for other consumers but had never had a real gradient to work with before.

One deviation caught and fixed during recovery: the first pass at restoring the module replaced its original cross-subsystem dependency (a dynamic import of the Memory MCP's compiled `collectWeightedWalk`) with a local copy of the same algorithm, because the compiled output wasn't present in this worktree. That's exactly the "second walker" `../005-seeded-ppr-ranking/decision-record.md`'s ADR-001 warned against -- not this packet's own ADR-001, which covers a different decision (reusing the discarded resolution-quality signal). The fix was to build the missing compiled output and restore the real shared-substrate import - not to keep the local copy.

### Re-benchmark: CUT stands, and the gap widened

The original benchmark harness (`seeded-ppr-impact-benchmark.mjs`) was reused completely unmodified - same 20 labeled queries, same metrics, same damping sweep. A fresh full-repo reindex with the new flag on confirmed real, differentiated confidence values landed in the database (four distinct tiers instead of one constant). With that real gradient in place, PPR no longer ties the flat walk on every metric - it loses on every metric: precision@3 down 0.10, precision@5 down 0.04-0.06, precision@8 down 0.03-0.04, recall@3 through recall@8 down 0.01-0.05, nDCG@3 down 0.057, nDCG@5 down 0.04, nDCG@8 down 0.03. The best damping value in the sweep (0.5) only manages to tie flat nDCG@5; every other value tested is worse.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two GPT-5.5-fast (high) implementation dispatches plus one targeted fix dispatch, all inside a git worktree isolated from the live repo, each independently verified: real `tsc --noEmit`, the existing code-graph vitest suite (confirmed against a genuine pre-change baseline via a stash/pop comparison, not just trusted from the model's self-report), the PPR module's own recovered unit tests, and finally a real reindex plus a real run of the unmodified benchmark script - not a simulated or estimated result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the discarded resolution-quality signal instead of building new call-resolution infrastructure | True semantic call-target binding would need a parser rewrite; the existing signal was a legitimate, cheap-to-wire proxy worth testing first |
| Recover the deleted PPR module from git instead of rewriting it | It was already-working, already-tested code; rewriting it would risk introducing new bugs the original didn't have |
| Fix the ADR-001 violation (local walker) rather than accept it | The whole point of this packet's design was avoiding exactly that risk; letting it stand would have undermined the result's credibility |
| Gate everything behind default-off flags throughout | `contextEdgeReliability` was already live and unconditional for other consumers; ungated changes would have altered real ranking behavior for structural search and impact analysis, not just PPR |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` (confidence differentiation) | PASS: 0 errors |
| Existing code-graph suite, flag off (regression proof) | PASS: same 6 failed/9 failed pre-existing baseline confirmed via stash/pop comparison at implementation time, 0 new failures. Baseline has since shifted twice more from unrelated commits; current reproducible baseline, confirmed by two consecutive fresh runs, is 5 failed files / 8 failed tests / 767 passed / 1 pending / 776 total via `npx vitest run --config .opencode/skills/system-code-graph/vitest.config.ts` (all 5 failing files are known-flaky daemon/IPC-liveness tests) |
| New confidence-differentiation unit tests | PASS |
| `tsc --noEmit` (PPR recovery + ADR-001 fix) | PASS: 0 errors |
| PPR module's own recovered unit tests, both flags on | PASS: 2 files / 9 tests |
| Full suite after ADR-001 fix | PASS at implementation time: 5 failed/8 failed (one fewer than baseline, unrelated flaky test), 0 new failures. See current reproducible baseline above. |
| Fresh reindex confirms differentiated confidence in DB | PASS: 4 distinct values observed (0.3, 0.35, 0.75, 0.9) replacing the uniform 0.8. The specific edge counts per tier (892/2267/16198/2838) were observed once in a since-removed implementation worktree and are not independently reproducible from checked-in evidence -- only the qualitative finding (a real, non-uniform gradient was achieved) is durable. |
| Re-benchmark, both flags on | PASS: completed, real metrics.json produced, compared against flat walk in the same run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The confidence signal is a proxy, not true semantic resolution.** Candidate cardinality (how many same-named symbols exist) approximates call-resolution confidence but isn't real type-checker-based symbol binding. A full parser rewrite might produce a different result - this was explicitly out of scope for testing whether ANY real gradient helps.
2. **Both new/recovered flags remain default-off.** Nothing here changes production behavior. The seeded-PPR module exists in the tree again (recovered from git, not reintroduced live) strictly to run this benchmark; it is not intended to ship enabled.
3. **No further seeded-PPR revisit is planned.** The open question this packet was built to answer - "does PPR perform differently with real edge confidence" - now has a clear, negative answer.
<!-- /ANCHOR:limitations -->
