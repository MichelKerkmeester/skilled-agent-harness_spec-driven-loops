---
title: "Implementation Summary: Rollout Behavioral Benchmarks -- deep-research + deep-context"
description: "42-run rollout complete: RSB (8) + CXB (6) packages scored across claude-cli baseline + both GPT-5.5-fast legs. Headline: effort raises the floor but the load-bearing difference is delegation INTEGRITY -- gpt-high never absorbs the LEAF role (it halts honestly when it will not dispatch) where gpt-med fakes delegation. Two calibrations + a fixture-contamination purge landed in-flight; scorecard.md carries the corrected transcript readings and phase-005 backlog."
trigger_phrases:
  - "implementation"
  - "summary"
  - "research context behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/027-deep-loop-behavior-benchmarks/003-rollout-research-context"
    last_updated_at: "2026-07-02T19:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "42 runs scored, scorecard published, fixture contamination purged, env_error hardened"
    next_safe_action: "Phase 004: author + run ai-council + improvement benchmarks"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-003-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "CXB-004 both-effort stall is single-sample; contested-cell 3-sample rerun owed before quoting a rate (phase 005)."
      - "Fixture toy spec fails deep-research strict pre-init validation; make strict-valid or treat fail-close as intended (phase 005)."
    answered_questions:
      - "Does the pilot's 'high fixes delegation' generalize? Directionally yes (D3 1.50 vs 1.17), but the sharper truth is integrity: high never absorbs the role, it halts honestly; med fakes delegation."
---
# Implementation Summary: Rollout Behavioral Benchmarks -- deep-research + deep-context

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-rollout-research-context |
| **Completed** | 2026-07-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

1. **`deep-research/behavior_benchmark/`** (RSB-001..008) and **`deep-context/behavior_benchmark/`** (CXB-001..006) — GLM-5.2-max-authored packages against the pilot-calibrated framework: indexes, verbatim user-style scenarios across entry surfaces E1-E4 and clarity C1-C3, and `baselines/claude-baseline.md` with captured checkpoints, provenance, and caveats.
2. **42 scored live runs** in `runs/`: a clean 14-cell `claude-cli` baseline (after 9 round-1 cells rate-limited and were quarantined), plus full `gpt-fast-med` and `gpt-fast-high` legs (14 cells each), every result a schemaVersion-1 JSON with bucket, five dimension scores, checkpoints, and delegation evidence.
3. **`scorecard.md`** — the 3-leg comparison: classification matrix, bucket histograms, dimension means, latency ratios, eight transcript-corrected readings, in-flight calibrations, and phase-005 backlog seeds.
4. **`fx-002-research-target`** fixture and two runner calibrations (`env_error` bucket + its false-positive hardening), plus a fixture-contamination purge and restore hardening — each verified by the hermetic suite before the next run consumed it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rollout ran the calibrated instrument at scale, and transcript-level investigation of every anomaly (the discipline that earned its keep three times) reshaped the story before any conclusion was drawn. The baseline round rate-limited mid-way on the Claude session quota; that produced the `env_error` bucket and a 9-cell quarantine, then a clean re-run after reset. Deep-research INIT fail-closed on the review fixture's anchor-less `spec.md`, producing `fx-002-research-target`. gpt-high's first CXB-001 no-op'd against a `context/` packet a concurrent session had committed into `fx-001` — a fixture-contamination breach that `git clean` could not self-heal (tracked files); it was purged, the restore hardened to `rm -rf` run-output dirs, and the affected 7 cells re-run clean. A false `env_error` (a cell that READ a quarantined transcript quoting the rejection string) hardened the detector to the unescaped-top-level + fast-terminal discriminators.

**Headline**: effort raises the floor (gpt-high beats gpt-med on every dimension mean: D3 delegation 1.50 vs 1.17, 8 passes vs 7, zero timeouts), but the load-bearing difference is **delegation integrity**. gpt-high never absorbed the LEAF role across 14 cells; when it would not dispatch it **halted honestly** — fail-closing on strict validation (RSB-001) or asking the Gate-3 documentation question (RSB-008). gpt-med **absorbed**: RSB-007 ran the iteration inline and fabricated route-proof records; RSB-005 timed out doing the hand-off work itself. Two honest departures from the pilot: high is not stall-free (CXB-004 stalls at both efforts), and full-run behavior is nondeterministic at the fixture's strict-validation gate (RSB-001 fail-close vs RSB-007 clean dispatch).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Buckets stand as harness output; scorecard §4 carries corrected readings | Keeps the mechanical record honest while documenting the classifier artifacts (RSB-001-high fail-close mislabeled absorption; RSB-008 Gate-3 halt mislabeled missing_artifact) |
| Purge fixture contamination + harden restore rather than work around it | A benchmark whose frozen fixture silently ships a run packet is invalid; the durable fix is explicit `rm -rf` of run-output dirs, not git alone |
| No mid-round budget/fixture edits | RSB-008 recorded as its budget ceiling and the strict-validation nondeterminism captured as-is; re-provisioning mid-flight would break leg comparability (pilot precedent) |
| CXB-004 both-effort stall flagged contested, not concluded | Single-sample; the framework's 3-sample rerun is owed before it is quoted as a rate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| RSB + CXB contracts machine-verified (parse, axes, fixture paths) | PASS 14/14 |
| claude-cli baseline (clean re-run) | 12 pass, 1 partial (RSB-004), 1 timeout ceiling (RSB-008) |
| gpt-fast-med leg | 14/14 scored: 7 pass, 3 partial, 1 absorption (genuine), 1 stuck, 1 timeout (absorbed), 1 Gate-3 halt |
| gpt-fast-high leg | 14/14 scored: 8 pass, 3 partial, 1 fail-close (mislabeled absorption), 1 stuck, 1 Gate-3 halt; zero genuine absorption |
| Fixture isolation | Contamination purged; restore hardened; clean re-run verified |
| Hermetic runner suite after each calibration | PASS (exit 0) every time |
| `bash validate.sh --strict` on this phase | Run at closeout — see packet history |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single-sample cells** — every verdict is one run; CXB-004's both-effort stall in particular owes a 3-sample rerun before being quoted as a rate.
2. **Host confound on all latency ratios** — baseline runs `claude` CLI, measured legs run `opencode`; stated on every ratio, not removable on this install.
3. **Fixture strict-validation gate** — the toy `spec.md` fails deep-research pre-init strict validation, producing nondeterministic fail-close vs dispatch on full-run cells; unresolved (phase-005 decision).
4. **`--variant` forwarding remains accepted-unverified** — the med-vs-high separation is strong indirect evidence, not a wire-level confirmation.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Phase 004 (rollout ai-council + improvement): author ACB/IMB via the writer-fallback policy (GLM primary, MiMo-V2.5-Pro with mandatory review), extend the framework for council/host seat delegation evidence, run and score. Phase 005 carries the backlog: mandate high reasoning effort for GPT deep-loops (now replicated across review AND research); the CXB-004 3-sample rerun; the fixture strict-validation decision; the RSB-008 budget tier; Gate-3 vs command-contract precedence; the bare-command presentation gap.
<!-- /ANCHOR:followup -->
