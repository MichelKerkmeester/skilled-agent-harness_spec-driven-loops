---
title: "Implementation Summary: Phase 43: label-finding-fixes"
description: "Two of the three label-finding fixes have landed: 027's gold now counts every cited file, and goal-core's verifier judges the tail of long evidence. 006's model arm is being built."
trigger_phrases:
  - "label finding fixes summary"
  - "stop rater gold fixed"
  - "goal verifier clamp fixed"
  - "goal lint model arm built"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes"
    last_updated_at: "2026-10-01T19:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Landed the 027 and 003 fixes and dispatched the 006 Jev arm"
    next_safe_action: "Verify the 006 Jev arm, then dispatch the Deem half"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-043-label-finding-fixes"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 43: label-finding-fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 043-label-finding-fixes |
| **Completed** | In progress |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

027's gold now counts every file a finding cites, and goal-core's verifier no longer marks every long turn as truncated. 006's model arm is in progress.

### Phase 43: label-finding-fixes

027's stop rater read only a finding's singular `source` string, so it missed citations kept in `sources` and `evidence` arrays and counted a new line range as a new source. It now counts files from all three, and its lineage filter reads `convergenceMode` under `antiConvergence` too. That changed the sample: 25 lineages instead of 16, and the two read lineages still in it now agree with their reads.

goal-core's heuristic verifier kept the first 1,200 characters of a transcript, appended `...` and read that as truncation. It now judges the last 1,200 characters, where a turn's completion proof sits.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Modified | `findingSources()` and the `isMovable()` fallback |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Modified | Five cases for the two rules |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` | Modified | The source and filter rules |
| `.skilled/hooks/goal/lib/goal-core.cjs` | Modified | The verifier judges the tail |
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modified | Four tail cases |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | Modified | One assertion that pinned the defect |
| `.skilled/hooks/goal/README.md` | Modified | The verification paragraph |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix went to one worker with a short brief: Luna 6 max on cli-codex for 027, SWE 2 max on cli-devin for 003. The session reran each suite and its neighbors from the changed state, reran 027's census and the 003 scorer on real data, updated the doc that describes the behavior and committed each fix alone (`55c33b363e`, `5543f6861e`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `isMovable()` reads `antiConvergence.convergenceMode` | The operator chose both 027 fixes, knowing it departs from 027 REQ-002 and drops lineages from the sample |
| The clamp fix stays in goal-core | The operator scoped it there. The OpenCode plugin keeps its own copy |
| Each fix is its own commit | A fault in one can be reverted without the others |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 027 suite | PASS, 41 tests (36 before), 0 failing |
| goal suites | PASS: goal-core 78 (74 before), goal-slice 24, labeled-set 12, fixture builder 5, nudge counter 3, goal-pi 22, 0 failing |
| goal-core on the real labeled set | `met` on 0 of 50 rows, none of the 47 `not_met` rows |
| 006 arm, review, closure gates | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **027's label gate needs three new reads.** The fixed sample holds three lineages with no read, so a `--jev` or `--deem` run stops at the gate until they are labeled.
2. **The OpenCode plugin still has the clamp defect.** `.opencode/plugins/opencode-goal.js:2215` keeps its own copy, and the 003 scorer still counts `clamp_defects: 11` there.
<!-- /ANCHOR:limitations -->

---
