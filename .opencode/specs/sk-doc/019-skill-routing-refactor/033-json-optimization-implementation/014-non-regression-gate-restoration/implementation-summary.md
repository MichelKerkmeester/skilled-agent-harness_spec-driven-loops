---
title: "Implementation Summary: Restore and Wire the Non-Regression Gate"
description: "The scorer-eval baseline ratchet was re-pinned to phase 013's restored figures, its review-bucket minimum lowered to match the frozen corpus, and the suite wired into the routing CI workflow; it passes 7/7 locally and was observed failing under a deliberate, reverted mutation."
trigger_phrases:
  - "non-regression gate restoration summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/014-non-regression-gate-restoration"
    last_updated_at: "2026-07-30T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored and CI-wired the ratchet"
    next_safe_action: "Proceed to phase 015"
    blockers: []
    key_files:
      - "evidence/ratchet-mutation-proof.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/014-non-regression-gate-restoration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Review bucket minimum lowered 32->31"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Restore and Wire the Non-Regression Gate

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 2 |
| **Completion** | 100% — ratchet 7/7, wired, mutation-proven; live CI run operator-gated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The scorer-eval baseline ratchet — the only test pinning holdout accuracy exactly and enforcing the release floors — was repaired to run green against a decided baseline and wired into the routing CI workflow, closing the hole that let the phase 013 regression ship undetected. The scorer was not touched.

### Baseline re-pin, bound to 013's disposition

Phase 013's disposition was fix, so the ratchet baseline was re-pinned to the restored figures by capturing against the 013-fixed build (`capturedAtSha f0a9574664`): `holdout_top1` 53/72, `full_corpus_top1` 151/195, delegation 10/11, review 24/31, memory_save 27/32, ambiguity 17/24. This was not a blind regeneration — it records the decided, healthy state, and the corpus hash pin now matches the live corpus.

### Corpus hash pin resolved, prior hashes recorded

The old baseline was pinned to a stale 200/78/25-row corpus. The new pin is corpus `sha256:9f30cc..`, holdout `sha256:88a7f7..`, ambiguity `sha256:07cd2c..`. The **prior** hashes are recorded here so a corpus change stays distinguishable from a scorer change: corpus `sha256:529f658f..`, holdout `sha256:90dbee17..`, ambiguity `sha256:e07cacdf..`, captured 2026-07-17 at sha `37ebd31720`.

### Review-bucket minimum

`REVIEW_MIN_N` was lowered from 32 to 31 with a rationale comment at the constant. Growing the corpus is out of scope; the frozen corpus holds exactly 31 read-only prompts; the ratchet's real signal is the exact pinned count, not the marginal 32nd sample.

### CI wiring

A "Scorer-eval baseline ratchet" step was added to the `golden-prompt-gate` job in `.github/workflows/routing-registry-drift.yml`, after the golden-prompt suite. That job already installs the full advisor scorer and builds the shared dist the ratchet imports, so no new install was needed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | Re-pinned to the 013-restored figures and live corpus hashes |
| `mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Modified | `REVIEW_MIN_N` 32→31 with rationale |
| `.github/workflows/routing-registry-drift.yml` | Modified | Added the ratchet step to the golden-prompt-gate job |
| `014-non-regression-gate-restoration/evidence/*.txt` | Created | Green, mutation-fail, and restored-green ratchet outputs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Record the failure modes → re-pin the baseline from the upstream disposition → resolve the corpus pin and the bucket minimum → wire the suite → prove it by mutation. The ratchet passes 7/7 locally (`vitest run`, exit 0). The gate was then proven adversarially: reverting the fix in the scorer source drove the ratchet to fail `holdout_top1` (51 vs 53) and delegation (8 vs 10), exit 1; the fix was restored via `git checkout` and the suite re-run green. Both floors (`FULL_CORPUS_FLOOR` 0.75, `HOLDOUT_FLOOR` 0.725) were left at their values and hold — the restored holdout 0.7361 and full 0.7744 clear them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-pin to the restored figures, not the drifted ones | Phase 013 fixed the regression, so the decided state is the healthy one; pinning it makes the ratchet enforce the restored numbers |
| Lower `REVIEW_MIN_N` to 31 rather than add a prompt | Growing the corpus is explicitly out of scope; 31 is the frozen review-slice size and the exact count is the real signal |
| Wire into the existing full-install job | The `golden-prompt-gate` job already provides zod/sqlite/shared-dist; a new job would duplicate a heavy install |
| Prove by re-introducing the exact fixed bug | The most direct demonstration that the gate catches this class of regression is to watch it fail on that regression, then revert |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ratchet green after re-pin + minN | `vitest run` exit 0, 7/7 passed (`evidence/ratchet-green-baseline.txt`) |
| Mutation trips the gate | reverting the fix → exit 1, 2 failed: holdout 51≠53, delegation 8≠10 (`evidence/ratchet-mutation-proof.txt`) |
| Fix restored, gate green again | `git checkout` + `vitest run` exit 0, 7/7 (`evidence/ratchet-restored-green.txt`) |
| Corpus pin matches live | new hashes equal the live corpus files and the 002-baseline pin |
| Floors held | `FULL_CORPUS_FLOOR` 0.75 / `HOLDOUT_FLOOR` 0.725 unchanged; restored metrics clear both |
| Workflow YAML valid | `yaml.safe_load` parses `routing-registry-drift.yml` cleanly |
| `validate.sh <folder> --strict` | Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live CI run is operator-gated.** REQ-004/T-09 asks for a real CI run showing the job fail; a GitHub Actions run requires a push this program forbids. The wiring is landed and correct, the suite passes locally by exit code, and the mutation proof shows it failing on cue — but the actual pipeline execution is left for the operator after the branch is pushed. Recorded as spec Amendment A-001.
2. **The ratchet runs in the no-sqlite fallback regime.** Like the capture it re-scores, it runs with an empty `MK_SKILL_ADVISOR_DB_DIR`, so its numbers are the filesystem-projection baseline, not the graph-boosted live-daemon numbers. This matches the workflow's existing corpus gate and is the correct, reproducible regime for CI.
<!-- /ANCHOR:limitations -->
