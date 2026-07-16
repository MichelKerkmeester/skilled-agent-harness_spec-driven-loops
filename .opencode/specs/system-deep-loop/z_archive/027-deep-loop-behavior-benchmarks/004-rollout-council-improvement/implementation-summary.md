---
title: "Implementation Summary: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement"
description: "30-run rollout complete: ACB (5) + IMB (5) packages scored across claude-cli baseline + both GPT-5.5-fast legs. The D-010 evidence-kind design (seat_artifacts / candidate_evidence) prevents false absorption on in-CLI councils and structured improvement loops -- zero role_absorption across 30 runs. Headline: GPT's Gate-3 documentation halt is the dominant failure at BOTH efforts across ALL four command surfaces, and high is NOT stall-free in the structured modes."
trigger_phrases:
  - "implementation"
  - "summary"
  - "council improvement behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/027-deep-loop-behavior-benchmarks/004-rollout-council-improvement"
    last_updated_at: "2026-07-02T23:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "30 runs scored, scorecard published, 3 detector calibrations landed"
    next_safe_action: "Phase 005: cross-skill scorecard + integration"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-004-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Council + improvement full-run budgets are tight (IMB clusters at 15-min boundary; council multi-seat cells stall past watchdog) -- re-provision or 3-sample contested cells in phase 005."
    answered_questions:
      - "Does GPT absorb in council/improvement like it does in research/review? No -- the in-CLI/structured modes remove the 'should dispatch but didn't' surface, so GPT halts (Gate-3) or stalls instead of fabricating. Zero role_absorption across 30 runs."
      - "Is the Gate-3 halt fixed by high reasoning effort? No -- both med and high halt on IMB-004; replicated across all four command surfaces AND both efforts."
---
# Implementation Summary: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-rollout-council-improvement |
| **Completed** | 2026-07-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

1. **`deep-ai-council/behavior_benchmark/`** (ACB-001..005, `evidence_kind: seat_artifacts`, min_seats 2-3, 25-min budgets) and **`deep-improvement/behavior_benchmark/`** (IMB-001..005, `evidence_kind: candidate_evidence`, 15-min budgets) — orchestrator-authored packages against the D-010-extended framework: indexes, verbatim user-style scenarios across E1-E4 / C1-C3, and `baselines/claude-baseline.md` with captured checkpoints and the corrected routing readings.
2. **Two frozen fixtures** — `fx-003-council-target` (a multi-option rate-limit design question the council can genuinely deliberate) and `fx-004-improvement-target` (a deliberately weak toy agent `.md` with seeded improvement opportunities).
3. **30 scored live runs** in `runs/`: a 10-cell `claude-cli` baseline plus full `gpt-fast-med` and `gpt-fast-high` legs, every result a schemaVersion-1 JSON with bucket, five dimension scores, checkpoints, and seat/candidate delegation evidence.
4. **`scorecard.md`** — the 3-leg comparison with the corrected transcript readings, the calibration log, and the phase-005 backlog.
5. **The D-010 runner extension + three in-flight detector calibrations** (seat content-detection, scoreD3 halt-null, candidate+score counting), each hermetically tested; `task_dispatch` behavior kept byte-identical.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two heaviest modes ran against the calibrated instrument, and — as in every prior phase — transcript investigation of the first cells reshaped the harness before conclusions were drawn. The first council cell (ACB-001) mis-scored `role_absorption` because the real council persists seats as identifiers WITHIN its deliberation tree, not as files under `ai-council/seats/`; the detector was changed to count distinct seat ids from artifact content. The first improvement cell exposed that the candidate detector counted candidate files but not the evaluator score; it was refined to require both. A halt cell exposed that scoreD3 penalized correct halts; it now scores D3 null for artifact-evidence halt cells. All three fixed and hermetically tested mid-round.

**Headline**: the D-010 evidence-kind design is the load-bearing result — across 30 runs, **zero `role_absorption`** fired, even though a correct council is IN-CLI (zero task dispatch) and would be falsely flagged by the research/review runner. GPT's failures in these modes are **Gate-3 documentation halts** (med 3 cells, high 1; replicated across all four command surfaces AND both efforts — high does NOT fix it) and **silent stalls** on the demanding council cells (high stalled ACB-004 + ACB-005, contradicting the pilot's stall-free claim). Med *absorbs* in the dispatch modes but *halts/stalls* in these structured modes — the "should dispatch but didn't" failure surface does not exist here. The baseline routing story is coherent: convene for explicit asks, answer inline for vague ones, confirm-halt for the "run it yourself" council framing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegation scored on mode-appropriate evidence (D-010), not task dispatch | A correct in-CLI council has zero dispatch; scoring it on task events would flag every correct run as absorption |
| Buckets stand as harness output; scorecard §4 carries corrected readings | Gate-3 halts and confirm-halts mislabel as missing_artifact; the mechanical record stays honest while §4 documents the real behavior |
| Three detector calibrations landed mid-round, each hermetically tested | Council seat layout, candidate+score requirement, and halt-cell D3 all surfaced from real first-cell transcripts; task_dispatch legs kept byte-identical |
| Scenarios authored orchestrator-direct rather than via writer dispatch | Schema-tight benchmark ground truth + near-exhausted GLM made direct authoring more reliable than dispatch + mandatory MiMo review |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ACB + IMB contracts machine-verified (parse, axes, fixtures, evidence_kind) | PASS 10/10 |
| claude-cli baseline | 7 pass, 2 partial (vague inline), 1 confirm-halt (ACB-005) |
| gpt-fast-med leg | 4 pass, 2 partial, 1 stall, 3 Gate-3 halts (D3 mean 0.50) |
| gpt-fast-high leg | 4 pass, 2 partial, 2 stalls, 1 timeout (correct/budget-bound), 1 Gate-3 halt (D3 mean 0.75) |
| Zero role_absorption across all 30 runs | Confirmed — D-010 evidence design validated |
| Hermetic runner suite after each calibration | PASS (exit 0) every time |
| `bash validate.sh --strict` on this phase | Run at closeout — see packet history |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single-sample cells** — the council stalls (ACB-004/005) and the tight IMB budget warrant a 3-sample contested rerun before quoting rates.
2. **Host confound on all latency ratios** — baseline `claude` vs measured `opencode`.
3. **Full-run budgets are tight** — IMB clusters at the 15-min boundary (high tipped over on IMB-001 while producing correct evidence); council multi-seat cells stall past the watchdog.
4. **`--variant` forwarding remains accepted-unverified** — the med/high behavioral separation is indirect evidence.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Phase 005 (cross-skill scorecard + integration): synthesize all five packages, rank the remediation backlog (Gate-3 precedence is now the top item — four-mode, both-effort replicated), add `behavior_benchmark` discoverability pointers to all five sub-skills, and close the packet. Re-provision the council/improvement full-run budgets or add a contested-cell 3-sample pass.
<!-- /ANCHOR:followup -->
