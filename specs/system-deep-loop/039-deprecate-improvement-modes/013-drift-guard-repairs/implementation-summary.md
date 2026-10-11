---
title: "Implementation Summary"
description: "Records the drift-guard repairs, current evidence and pending release gates."
trigger_phrases:
  - "drift guard repairs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs"
    last_updated_at: "2026-10-11T13:46:18Z"
    last_updated_by: "generate-context"
    recent_action: "Recaptured the routing baseline and made check 1b skip ignored files"
    next_safe_action: "Commit the four changes, push to main and watch the drift guard"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - "specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json"
      - ".skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs"
      - ".skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs"
      - "specs/system-deep-loop/039-deprecate-improvement-modes/013-drift-guard-repairs/scratch/evidence/decision-ledger.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-drift-guard-repairs"
      parent_session_id: null
    completion_pct: 80
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
| **Status** | In Progress |
| **Completed** | Not set |
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
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` | Modified | Apply Git ignore rules to check 1b with the existing fallback. |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs` | Modified | Prove ignored docs are skipped and non-ignored untracked docs are reported. |
| `.github/workflows/routing-registry-drift.yml` | Modified | Read the new child baseline and trigger on its path. |
| `scripts/capture-top3.mjs` | Modified | Capture top-3 results from the advisor runtime. |
| `baseline/` (six files) | Created | Store the recaptured pins, metrics and scorer output. |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modified | Document check 1b and its regression test. |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modified | Document ignored-path filtering and the shared-doc allowlist. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both implementation lanes have local evidence. The packet remains In Progress because metadata refresh, the final strict gate, commit, push and CI on main are still open.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D6: Both trigger path filters follow the baseline repoint. | A baseline-only change must trigger the workflow. |
| D7: Add the two sk-code-opencode docs to scope. | Their check 1b guidance must match the updated behavior. |
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
| Child strict validation | RESULT: FAILED, exit 2. Errors are limited to GENERATED_METADATA_INTEGRITY and GENERATED_METADATA_DRIFT. |
| Parent strict validation | RESULT: FAILED, exit 2. Parent-level errors are the same two generated metadata codes. The recursive run also reports one FRONTMATTER_MEMORY_BLOCK warning in the parent and one in phase 012. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Temporary database directory** The capture script creates a fresh empty advisor database directory under the system temp folder and leaves it there after scoring. This prevents a pre-existing database from affecting results. See [lane-02 evidence](scratch/evidence/lane-02-baseline-recapture.txt).
2. **Alignment warnings** The full drift-guard run still reports 277 non-blocking alignment warnings. This count was unchanged in the recorded run. See [lane-01 evidence](scratch/evidence/lane-01-router-sync-ignored.txt).
<!-- /ANCHOR:limitations -->

---


