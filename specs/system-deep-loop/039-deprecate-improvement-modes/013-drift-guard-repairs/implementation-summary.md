---
title: "Implementation Summary"
description: "Records the drift-guard repairs, their verification and post-push CI closure."
trigger_phrases:
  - "drift guard repairs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs"
    last_updated_at: "2026-10-11T15:02:21Z"
    last_updated_by: "generate-context"
    recent_action: "Closed on push 326f138e33 with CI green and the corpus gate passing"
    next_safe_action: "Monitor the drift guard on main and recapture when the corpus changes"
    blockers: []
    key_files:
      - "specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/scratch/evidence/post-push-ci.txt"
      - ".github/workflows/routing-registry-drift.yml"
      - "specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - "specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/scratch/evidence/decision-ledger.txt"
    session_dedup:
      fingerprint: "sha256:0845ae579d83af8647a153be2a5911a9d1eba3d43c10ec1704a924347b9718a2"
      session_id: "scaffold-013-drift-guard-repairs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-drift-guard-repairs |
| **Status** | Complete |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Check 1b now skips Git-ignored paths and still reports untracked docs that are not ignored. It keeps the full walked list when Git is missing or the hub is not a repository. The corpus baseline uses the existing workflow floors.

### Phase 13: drift-guard-repairs

The stale holdout pin stopped the workflow before corpus scoring. The recaptured baseline records the current corpus hashes and scorer output in this child. The workflow reads that baseline, and both push and pull request path filters follow it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | Apply Git ignore rules to check 1b with the existing fallback. |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modified | Prove ignored docs are skipped and non-ignored untracked docs are reported. |
| `.github/workflows/routing-registry-drift.yml` | Modified | Read the new child baseline and trigger on its path. |
| `scripts/capture-top3.mjs` | Modified | Capture top-3 results from the advisor runtime. |
| `baseline/` (six files) | Created | Store the recaptured pins, metrics and scorer output. |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/README.md` | Modified | Document check 1b and its regression test. |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md` | Modified | Document ignored-path filtering and the shared-doc allowlist. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The four implementation commits were rebased onto origin/main after main advanced by three commits. The trigger-index commit conflicted, so the index was regenerated from the merged tree. The push to main completed after a fetch showed zero commits behind. Post-push CI passed all 14 workflows, including the routing corpus gate in run 38147728254. This final documentation update stays uncommitted in the worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D6: Both trigger path filters follow the baseline repoint. | A baseline-only change must trigger the workflow. |
| D7: Add the two sk-code-skilled docs to scope. | Their check 1b guidance must match the updated behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router-sync regression test | PASS, 6 of 6, exit 0. See [lane-01 evidence](scratch/evidence/lane-01-router-sync-ignored.txt). |
| Full drift-guard wrapper | PASS, all 4 guards, 277 non-blocking alignment warnings, exit 0. See [lane-01 evidence](scratch/evidence/lane-01-router-sync-ignored.txt). |
| CI-regime corpus scorer | PASS at exact thresholds. Accuracy 0.5487, Gate 3 F1 0.9843, joint TT 104, TF 87, FT 3 and FF 1. See [ledger correction](scratch/evidence/decision-ledger.txt#L15) and [lane-02 evidence](scratch/evidence/lane-02-baseline-recapture.txt). |
| Scorer ratchet and golden prompts | PASS, 7 of 7 and 10 of 10, exit 0. See [lane-02 evidence](scratch/evidence/lane-02-baseline-recapture.txt). |
| Fresh review | No P0. The reviewer reproduced the reported metrics and edge cases. See [review-opus-high.txt](scratch/evidence/review-opus-high.txt). |
| Pre-commit final gate, lane 03 | 118 steps, 117 returned 0. The only failed step was eslint-changed-ts with an empty TypeScript file list. The changed JavaScript check passed. See [lane-03-final-gate.txt](scratch/evidence/lane-03-final-gate.txt). |
| Post-rebase final gate, lane 04 | 118 steps, 117 returned 0. The only failed step was eslint-changed-ts with an empty TypeScript file list. The changed JavaScript and routing checks passed. See [lane-04-post-rebase-gate.txt](scratch/evidence/lane-04-post-rebase-gate.txt). |
| Post-push CI on main | PASS, 14 of 14 workflows on `326f138e33`. Routing Registry Drift Guard run `38147728254` passed the corpus pin and scorer gates with no threshold failures. See [post-push-ci.txt](scratch/evidence/post-push-ci.txt). |
| Child strict validation | RESULT: PASSED, 0 errors and 0 warnings after the completion-100 save. See [decision ledger](scratch/evidence/decision-ledger.txt#L38). |
| Parent strict validation | RESULT: PASSED, 14 of 14 recursive runs after the completion-100 save. The two pre-existing recent_action warnings remain, recorded under Known Limitations. See [decision ledger](scratch/evidence/decision-ledger.txt#L38). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Temporary database directory** The capture script creates a fresh empty advisor database directory under the system temp folder and leaves it there after scoring. This prevents a pre-existing database from affecting results. See [lane-02 evidence](scratch/evidence/lane-02-baseline-recapture.txt).
2. **Alignment warnings** The full drift-guard run reports 277 non-blocking alignment warnings. This count was unchanged in the recorded run. See [lane-01 evidence](scratch/evidence/lane-01-router-sync-ignored.txt).
3. **Pre-existing recent_action warnings** Strict validation reports two existing warnings, one in the parent spec and one in phase 012 implementation-summary.md. Neither file is in this child closeout scope.
<!-- /ANCHOR:limitations -->

---


