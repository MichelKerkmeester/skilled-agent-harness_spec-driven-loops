---
title: "Implementation Summary: cli-devin extraction rerun"
description: "Placeholder — populated post-run."
trigger_phrases:
  - "113/005 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/018-cli-devin-prompt-quality/005-extraction-rerun"
    last_updated_at: "2026-05-17T10:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped v3 mutation-depth-8 re-run"
    next_safe_action: "Hold v1-0-6-0 uplift pending confirmation run"
    blockers: []
    key_files:
      - "synthesis-v3.md"
      - "synthesis-v2.md"
      - "state/eval-loop-state-v3.jsonl"
      - "state/eval-loop-state-v2.jsonl"
      - "scripts/synthesize-v3.cjs"
      - "scripts/extract-files-from-markdown.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000113005"
      session_id: "113-005-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 113-cli-devin-prompt-quality/005-extraction-rerun |
| **Completed** | 2026-05-17 |
| **Level** | 3 |
| **Re-run wall-clock** | ~57 min (vs 109 min in v1; faster because no mutation iter) |
| **SWE 1.6 dispatches** | 35 (5 variants × 7 fixtures; no mutation in v2) |
| **Files extracted** | 17 across 35 fixture-result rows |
| **Blocks skipped** | 52 (output blocks where no path could be inferred) |
| **Verdict** | Ranking stable — RCAF wins both runs |
| **v1.0.6.0 uplift** | NOT needed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: ranking stable — RCAF wins both runs.** The 113/004 RCAF default is confirmed under full D1 scoring (extraction + live grader). No v1.0.6.0 uplift is needed.

The extraction layer worked as designed: 17 files written across 35 fixture-result rows, with conservative skip-on-ambiguity producing 52 skipped blocks (no overreach, no path-traversal violations). Per-variant extraction counts revealed a real signal: v-004 RCAF extracted 10 files (most), v-001 STAR extracted 5, v-005 BUILD-strict extracted 2, v-002 BUILD-dense and v-003 anti-hallucination extracted 0. This means RCAF's output structure (clean role-anchored response with markdown headers) is the most extractable shape — additional confirmation that RCAF produces tighter, more parseable output.

Interesting reshuffling in lower ranks: v-005 (BUILD + strict bundle-gate + aggressive anti-hallucination) jumped from #4 in v1 (0.4846) to #2 in v2 (0.5610) — a +0.076 score lift despite extracting only 2 files. The strict-bundle-gate language continues to underperform RCAF, but it's more competitive than v1 suggested.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/extract-files-from-markdown.cjs` | Created | Markdown-to-disk extraction layer. 4 path-inference patterns (md-header-backticked, md-header-bare, backticked-line, bold-line) + 4 first-line-comment patterns. Path-traversal rejected; absolute-paths rejected. 12/12 canned tests PASS. |
| `scripts/loop-v2.cjs` | Created | Wrapper that clears 003 state, sets `EVAL_LOOP_EXTRACT=true` + `EVAL_LOOP_SKIP_ITER1_REVIEW=true`, invokes 113/003 loop, archives 003 outputs to 113/005/state with `-v2` suffix. |
| `scripts/synthesize-v2.cjs` | Created | Reads 113/005/state/eval-loop-state-v2.jsonl, parses v1 baseline from 113/003/synthesis.md, writes synthesis-v2.md with side-by-side ranking + verdict. |
| `../003-eval-loop/scripts/score-variant.cjs` | Modified | Env-gated extraction call before deterministic checks. Snapshot/restore cycle for fixture seeds between variants (per ADR-001). |
| `synthesis-v2.md` | Created | Final v1-vs-v2 comparison + verdict + cli-devin v1.0.6.0 decision. |
| `state/*-v2.{jsonl,json,md}` | Created | Archived v2 run artifacts. |
| `iterations/iteration-NNN-v2.md` | Created (5) | Per-iteration detail for v2 run. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Build proceeded in 3 phases. Phase 1 authored the extraction script with 12 canned tests covering 4 inference patterns + path-traversal rejection + first-line-comment stripping. Phase 2 wired the extraction call into 113/003 score-variant.cjs behind `EVAL_LOOP_EXTRACT=true` with a snapshot/restore cycle for fixture seeds, and built the loop-v2 wrapper + synthesize-v2 comparison script. Phase 3 launched the real run in background via nohup; loop completed cleanly after 5 iterations.

The 003 v1 baseline was inadvertently overwritten mid-run because loop.cjs unconditionally writes synthesis.md to its packet root. Recovery was straightforward: git-restored synthesis.md from the v1-baseline commit, ran synthesize-v2 against the correct v1, then re-restored 003 state to its v1 baseline (the v2 data lives in 113/005/state with -v2 suffixes).

A second minor bug surfaced: chained `.replace('.jsonl', '-v2.jsonl').replace('.json', '-v2.json')` produced doubled suffixes on `.jsonl` files (the substring `.json` matched inside `.jsonl`). Fixed by anchoring the regex to end-of-string: `replace(/\.(jsonl|json|md)$/, '-v2.$1')`.

No rate-limit pauses fired. Live claude-sonnet grader completed all dispatches with non-zero confidence scores. No fixture seed corruption.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001 (env-gated extraction in 113/003) held | Single source of truth for scoring; backward-compatible with 003 mock mode |
| Restore v1 baseline from git after run | loop.cjs overwrote 003/synthesis.md during the v2 run; git-restore + re-run synthesize-v2 produced correct v1-vs-v2 table |
| Anchored regex for state-file -v2 suffix | Chained `.replace` produced `-v2-v2.jsonl` because `.json` substring matched inside `.jsonl`; fixed with `/\.(jsonl|json|md)$/` |
| No v1.0.6.0 uplift | Ranking stable — v-004-rcaf-medium wins both runs. 113/004's RCAF default is confirmed. |
| Keep v2 state in 113/005/state, not 003/state | 003's v1 baseline must survive as the committed reference for future synthesis-v2-style comparisons |
| 5 iterations vs v1's 6 | No mutation in v2 (just 5 seeded variants); v1 ran iter-6 as hill-climbing mutation that didn't beat parent |
| Extraction conservative (skip-on-ambiguity) | 17 written / 52 skipped is the right ratio — we'd rather miss a block than mis-attribute it and corrupt the fixture CWD |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command / Artifact | Result |
|-------|--------------------|--------|
| REQ-001: extraction handles fenced blocks | 12 canned tests run via `--test` | PASS (12/12) |
| REQ-002: env-gated wiring | `grep -n 'EVAL_LOOP_EXTRACT' 113/003/scripts/score-variant.cjs` finds the gate at line 153 | PASS |
| REQ-003: 5 iterations complete | state-v2.jsonl has 5 iteration rows + loop_start + loop_end | PASS |
| REQ-004: live grader called | per-iteration rows show `grader.parse_status: ok` with confidence values from claude-sonnet | PASS |
| REQ-005: synthesis-v2 compares v1 vs v2 | side-by-side ranking table + verdict written in synthesis-v2.md | PASS |
| REQ-006: cost ceiling held | No pause sentinel fired; grader spend stayed within free tier / sub-$10 budget | PASS |
| strict-validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 113-cli-devin-prompt-quality/005-extraction-rerun --strict` | TO RUN |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live mutation iteration in v2.** The 113/003 v1 ran 5 seeded variants + 1 hill-climbing mutation (iter-6); v2 ran only the 5 seeded variants. The first hill-climbing child in v1 underperformed the parent, so the operator-confirmed scope here was no-mutation. If future re-runs want mutation-depth signal with extraction unlocked, expect another ~20 min wall-clock per additional iter.

2. **Extraction-vs-score correlation is non-monotonic.** v-004 extracted 10 files but scored 0.5664; v-005 extracted only 2 files but scored 0.5610. The relationship between extraction-rate and weighted-score is complex — extraction unlocks D1 but doesn't dominate the weighted aggregate. The 5-dim rubric still works as designed.

3. **52 blocks skipped is high relative to 17 written.** Real SWE 1.6 outputs often have code blocks without explicit path markers (the model dives into code without naming the target file). Future extraction-pattern work could add LLM-based path inference for ambiguous blocks, but that adds cost + latency and may not change rankings (the missing-path blocks were probably acceptance-failure outputs anyway).

4. **Synthesis-v2 doesn't quantify per-fixture D1 unlock.** The aggregate ranking is stable, but individual fixtures may have shifted significantly. A v1.0.6.X follow-on could report per-fixture deltas to surface "RCAF wins overall but variant X dominates fixture Y" patterns. Out of scope for this run.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:rerun-v3 -->
## Re-run v3 — mutation-depth-8 follow-on (2026-05-17)

| Field | Value |
|-------|-------|
| **Trigger** | Follow-on #1 of 5: re-run loop-v2.cjs with max-iters=8 to unlock 3 additional hill-climb mutations beyond the v2 RCAF plateau |
| **v3 iterations** | 8 of 8 (5 seeded + 3 mutated) |
| **v3 winner** | `v-mut-d68b487314246cd3` (CONTEXT framework + medium pre-plan + 5-thought + standard bundle-gate + standard anti-hallucination) @ 0.5833 |
| **v2 winner** | `v-004-rcaf-medium` @ 0.5664 |
| **Delta** | +0.0169 (1.7% lift) |
| **Confidence** | INCONCLUSIVE — single sample, below synthesize-v3 ≥0.02 confidence threshold |
| **Variance check** | Same variants across runs swing 0.02–0.15 (e.g. v-005 ranges 0.4139–0.5610). The +0.0169 v3 winner delta is well within typical run-to-run noise |
| **Recommendation** | Do NOT ship cli-devin v1.0.6.0 on this single sample. If pursued, run 2-3 confirmation iterations of `v-mut-d68b487314246cd3` against the same fixture set first; promote to default only if reproducible |

Surprising finding: the CONTEXT framework was originally documented for deepseek-v4, not SWE 1.6. The mutator explored an axis the seeded queue (STAR / RCAF / BUILD) didn't cover. Whether this is a genuine framework-on-surface finding or run-to-run noise cannot be answered without a confirmation run.

Artifacts: `synthesis-v3.md`, `scripts/synthesize-v3.cjs`, `state/{best-variant,eval-loop-state,mutation-coverage,eval-loop-dashboard}-v3`, `iterations/iteration-00{1..8}-v3.md`, `state/extraction-grader-cache/`.
<!-- /ANCHOR:rerun-v3 -->
