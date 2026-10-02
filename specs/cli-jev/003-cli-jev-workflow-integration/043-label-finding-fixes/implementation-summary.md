---
title: "Implementation Summary: Phase 43: label-finding-fixes"
description: "The three label-finding fixes have landed: 027's gold counts every cited file, goal-core's verifier judges the tail of long evidence, and 006's scorer has its Jev and Deem arms. Three cross-family reviews ran, and the session fixed every P0 and P1 they found."
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
    recent_action: "Closed the phase after three cross-family reviews"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes/goal.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-043-label-finding-fixes"
      parent_session_id: null
    completion_pct: 100
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
| **Completed** | 2026-10-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

027's gold now counts every file a finding cites, goal-core's verifier no longer marks every long turn as truncated, and 006's scorer can ask Jev or the local Deem server about each labeled criterion.

### Phase 43: label-finding-fixes

027's stop rater read only a finding's singular `source` string, so it missed citations kept in `sources` and `evidence` arrays and counted a new line range as a new source. It now counts files from all three, and its lineage filter reads `convergenceMode` under `antiConvergence` too. That changed the sample: 25 lineages instead of 16, and the two read lineages still in it now agree with their reads.

goal-core's heuristic verifier kept the first 1,200 characters of a transcript, appended `...` and read that as truncation. It now judges the last 1,200 characters, where a turn's completion proof sits. Pi's adapter puts the assistant message after tool output so the message lands in that window, and the blocking words now include a bare `fail` count.

006's scorer gained `--jev` and `--deem`. Each checks its backend first and prints one skip line when the check fails, asks two questions per labeled row, and gives a keep or kill verdict per rule. A run that measured under nine of every ten questions it asked stops for coverage instead. Without either switch its output is byte-identical to before.

The first review also tightened 027's source rule. An entry is cut at its first line reference or delimiter, a cut holding a space counts only when it is a tracked path, and an extension must hold a letter, so free text no longer counts as a source.

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
| `.skilled/hooks/goal/pi/goal-context.ts` | Modified | Tool output first, then the message |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Modified | The order case |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Modified | The Jev and Deem arms and the coverage stop |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | Modified | Stub-backend cases, 8 to 25 |
| `.skilled/skills/sk-doc/sk-create-goal/` docs | Modified | README, scripts README, catalog entry, changelog v1.4.0.0, `SKILL.md` 1.4.0.0 and its Hermes copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix went to one worker with a short brief: Luna 6 max on cli-codex for 027, SWE 2 max on cli-devin for 003. The session reran each suite and its neighbors from the changed state, reran 027's census and the 003 scorer on real data, updated the doc that describes the behavior and committed each fix alone. Fixes: `499e6dc28d`, `67b2262e64`, `ce372a4404`, `09a051589c` and docs `097c1d68ca`. DeepSeek V4.1 Flash on cli-pi then reviewed three times, read-only. The session reproduced every P0 and P1 before a worker fixed it: `82bf342dae`, `2022ba3e91`, `72d28bb9c2`, `81b3315624` and `419607ba19`. The session made the third review's one-word P1 fix itself, `c6d09396dd`, and two other small changes, recorded in `goal.md`: a `maxBuffer` the real tree needed, and removing a URL rule its own brief had wrongly asked for.
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
| 027 suite | PASS, 59 tests (36 before), 0 failing. Census `no gold 73`, `sampled 25`, the same five reads as before the second-round fix |
| goal suites | PASS: goal-core 81 (74 before), goal-slice 24, labeled-set 12, fixture builder 5, nudge counter 3, goal-pi 23 (22 before), goal 8, cursor 15, devin 3, 0 failing |
| goal-core on the real labeled set | `met` on 0 of 50 rows, none of the 47 `not_met` rows |
| 006 suites | PASS: score-goal-lint 25 (8 before), lint-goal-criteria 12, check-goal 16, template-parity 4, default output byte-identical |
| Reviews | Three DeepSeek V4.1 Flash rounds, each P0 and P1 reproduced then fixed, every P2 in `goal.md`'s log. Round three confirmed the second round's fixes and found one P1, fixed in `c6d09396dd` |
| Closure gates | PASS: `validate.sh --strict` `RESULT: PASSED` with 0 errors and 0 warnings on this phase, all 44 folders under the parent with `--recursive`, and `check-goal.cjs` 5/5 on each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **027's label gate needs three new reads.** The fixed sample holds three lineages with no read, so a `--jev` or `--deem` run stops at the gate until they are labeled.
2. **The OpenCode plugin still has the clamp defect.** `.opencode/plugins/opencode-goal.js:2215` keeps its own copy, and the 003 scorer still counts `clamp_defects: 11` there.
3. **The recorded P2s stay open.** `goal.md`'s log lists them. One is that `build-verifier-fixture.cjs` still joins the message first, so labeled rows no longer match what Pi's adapter sends.
4. **The Deem arm is unmeasured on the local server.** All 196 calls of the one local run failed because `cli-deem` read `noul` from a `value` field the server never sends, not because of the server. Phase 044 fixed the client, and a measured run still needs the operator's yes. The coverage stop ends a run like that one without a verdict.
<!-- /ANCHOR:limitations -->

---
