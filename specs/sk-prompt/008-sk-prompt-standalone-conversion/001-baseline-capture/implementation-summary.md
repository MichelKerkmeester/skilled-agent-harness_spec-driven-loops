---
title: "Implementation Summary"
description: "All eight gates guarding the sk-prompt teardown surfaces were run against the untouched tree and returned exit 0, and the three routing metrics later phases must honour are recorded with their headroom."
trigger_phrases:
  - "008 phase 001 summary"
  - "sk-prompt baseline results"
  - "gate baseline evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/008-sk-prompt-standalone-conversion/001-baseline-capture"
    last_updated_at: "2026-08-28T09:00:00Z"
    last_updated_by: "claude"
    recent_action: "Captured all eight pre-change gates; every one returned exit 0"
    next_safe_action: "Execute 002-models-packet-deletion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-001-baseline-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All eight gates start green, so any later red is caused by the teardown rather than inherited"
      - "FT and FF have zero CI headroom; TT has 6"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-baseline-capture |
| **Completed** | 2026-08-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every gate that the sk-prompt teardown can move now has its pre-change output and exit status on disk. All eight return exit 0, so the teardown starts from a clean line and any later red is attributable rather than inherited. Two of the routing metrics turned out to be sitting exactly on their CI ceilings, which changes how the later phases have to be sequenced.

### Gate baseline

Eight gates across three runtimes were run against the untouched working tree. Each capture file ends with an explicit `exit=` line so the status is readable without re-running anything.

| Gate | Captured result | Exit |
|------|-----------------|-----:|
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0 fixed=0`; `sk-prompt` classifies as `[H]` | 0 |
| `ci-leaf-manifest-freshness.cjs` | `checked=14 fresh=14 failed=0` | 0 |
| `ci-skill-derived-freshness.cjs` | `checked=14 fresh=14 stale=0 errored=0` | 0 |
| `compiled-route-guard.cjs` | All hubs fresh; serving matches inputs and runtime matches source | 0 |
| `check-prompt-quality-card-sync.sh` | GUARD PASS across CHECK 1–4 | 0 |
| `skill_graph_compiler.py --validate-only` | 14 metadata files discovered, 1 route-excluded; VALIDATION PASSED | 0 |
| `parent-skill-check.cjs` (per hub) | 6 of 6 hubs PASS | 0 |
| `score-routing-corpus.py` | `"overall_pass": true` | 0 |

### Routing metrics and their headroom

The routing-accuracy gate passes today, but not with room to spare. Two of its four joint counts are already at the exact ceiling the CI invocation enforces.

| Metric | Baseline | CI bound | Headroom |
|--------|---------:|---------:|----------|
| advisor accuracy | 0.5641 | `--min-advisor-accuracy 0.5333` | comfortable |
| gate3 f1 | 0.9843 | `--min-gate3-f1 0.9843` | exactly at the floor |
| joint TT | 107 | `--min-joint-tt 101` | 6 |
| joint FT | 3 | `--max-joint-ft 3` | **none** |
| joint FF | 1 | `--max-joint-ff 1` | **none** |

### Ratchet pins the deletion will move

The scorer-eval ratchet pins exact counts, and the small-model alias table feeds one bucket at 100 percent. Deleting the registry moves these, so phase 003 exists specifically to recapture them.

| Pin | Baseline value |
|-----|----------------|
| `metrics/buckets/delegation` | 11/11, accuracy 1.0 |
| `metrics/holdout_top1` | 55/72, accuracy 0.7639 |
| `metrics/full_corpus_top1` | 153/195, accuracy 0.7846 |
| `corpusSha256` | `sha256:9f30cc5e…4aa677` |
| `holdoutSha256` | `sha256:b433be01…b267645` |
| `ambiguitySha256` | `sha256:07cd2c76…bf8214d` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/baseline/g1.txt` – `g8.txt` | Created | Captured stdout plus exit status for each gate |
| `spec.md`, `plan.md`, `tasks.md` | Modified | Authored the phase contract over the scaffold |
| `implementation-summary.md` | Modified | This record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each gate was invoked directly from the repository root with its output teed to a numbered capture file and its exit status appended as a literal line. The routing scorer was run with the same threshold arguments the CI workflow uses, so the captured pass is the same assertion CI makes rather than a weaker local approximation. The Devin executor was probed for availability and authentication because later phases dispatch mechanical edits to it, and an unauthenticated executor discovered mid-teardown would stall a phase that had already started mutating.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Capture exit status as a literal line inside each file | A capture that records only stdout loses the assertion; the exit line makes each file self-contained evidence |
| Run the routing scorer with the CI threshold arguments | Running it bare would report metrics without asserting the bounds CI actually enforces, which is the property that matters |
| Record FT and FF as zero-headroom rather than merely passing | Later phases would otherwise assume slack that does not exist and discover it only when CI reds |
| Leave the two model-alias holdout rows in place for now | Removing them here would blend measurement with mutation; phase 003 owns that edit under a recaptured pin |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Eight gates captured with exit status | PASS — every capture file ends `exit=0` |
| Skill-root class contract | PASS — `checked=14 passed=14 failed=0` |
| Prompt-quality card-sync guard | PASS — CHECK 1, 2, 3, 4 all clear |
| Routing-accuracy corpus | PASS — `"overall_pass": true` with TT=107 against a floor of 101 |
| No tracked file modified by this phase | PASS — `git status --short` showed only a pre-existing unrelated modification |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The vitest suites were not run here.** `scorer-eval-baseline-ratchet.vitest.ts` and the routing parity suites need a full advisor install with a native sqlite dependency. Their pinned values were read from the checked-in `scorer-eval-baseline.json` instead, which is the same source the suites assert against; the suites themselves run in phase 003 where they are the acceptance signal.
2. **`timeout` is unavailable on this platform**, so gate invocations ran unbounded. Every gate completed well inside a normal interactive wait, so no bound was needed in practice.
3. **The captured numbers are the no-sqlite fallback regime.** CI has no `skill-graph.sqlite`, so these match what CI will compute; a local run against a warm advisor daemon would read higher because of graph boosts.
<!-- /ANCHOR:limitations -->

---
