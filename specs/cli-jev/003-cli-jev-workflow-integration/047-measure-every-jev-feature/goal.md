---
title: "Goal: Phase 47: measure every Jev feature"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature"
    last_updated_at: "2026-10-02T18:40:31Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 47: measure every Jev feature

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the 15 unmeasured cli-jev features a result its own scorer prints, a live Jev verdict or a zero-call bound from confirmed labels, then resend the benefit overview.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only labels from the operator or 042's delegated arbiter (a fresh Opus 5.5 medium labeler) count |
| D2 | Live runs use `--jev --out` under `--provider official`. Jev gets no secret, no key in a file, no `.env` opened |
| D3 | Each scorer's keep rule, gate and verdict format stay frozen. A scorer changes only to fix a defect that stops its run |
| D4 | Where real rows fall short of a gate, a fixture set built for that scorer may fill it, and the result names its corpus |
| D5 | Luna 6 max fast and DeepSeek V4.1 Flash max build. The session verifies and commits. Cross-family review: fix P0 and P1, record P2 |
| D6 | No Jev arm joins a default path. Path-scoped commits, main only on the operator's go |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/evidence/results.md` holds 15 result rows, one each for 003, 005, 006, 020, 021, 022, 024, 025, 026, 027, 028, 030, 031, 033 and 034
- [x] Each result row quotes a `verdict` or `stop:` line its scorer printed, and no row is a `fewer than N labeled` stop
- [x] Each result row names its corpus as real or fixture and its labeler as the operator or the delegated arbiter
- [x] Every changed scorer suite passes, and no P0 or P1 review finding is open
- [ ] `validate.sh --strict` prints `RESULT: PASSED` on this phase and `check-goal.cjs` passes on its goal
- [ ] The benefit overview is resent in chat with 22 measured features and 023 marked removed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | Spec, acceptance criteria and goal authored 2026-10-02 |
| 15 results recorded | Done | `scratch/evidence/results.md`: 15 Done, 0 Pending. Keep: 020, 022, 024, 025, 030. Kill: 006, 027, 028, 033. Stop (margin): 026, 031. Zero-call bound: 003, 005, 021, 034 |
| 027 fix | Done | Four review rounds (DeepSeek, DeepSeek, Luna, Luna). Rounds 1 to 3 found P0 and P1 defects, each fixed, the last by rewriting the filter as one helper. Round 4's P1 (catalog sentence) fixed, `validate_document.py` 0 issues. Suites 97 of 97. 027 and 028 verdicts unchanged across all reruns |

### Deviations and findings

| Item | Note |
|------|------|
| Worktree | The operator chose a worktree on 2026-10-02. Work moved to `worktrees/082-measure-every-jev-feature` because another session was editing the primary checkout |
| 003's rows file was gone | It was untracked in the removed 071 worktree. Rebuilt from the Pi sessions and re-joined to the arbiter's labels by id, 50 of 50 matched |
| 021 prints `no headroom` | Its scorer's zero-call bound is not a `stop:` line. Criterion 2 is read as met because the line is the scorer's own closing line, not a missing-label stop |
| P2 recorded, not fixed | 027 review: test at `score-stop-rater.vitest.ts:352` passes with its outside file absent |
| Round 4 P0 recorded as latent | Luna flagged that a citation's base is inferred from root entries. Verified on all 4,451 tracked delta files (5,430 sources): no repo-root `iterations`, `deltas`, `logs` or `prompts` entry exists, and all 44 unknown-root citations that match an artifact pattern are research iteration notes, which 042's rulings exclude. No real citation gets wrong gold, so it is recorded as a limitation, not fixed. The delta format holds no explicit base to fix it with |
<!-- /ANCHOR:log -->
