---
title: "Goal: Phase 17: overlay alignment follow-ups"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "overlay alignment follow ups goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/017-overlay-alignment-follow-ups"
    last_updated_at: "2026-11-21T00:41:48Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "overlay-alignment-follow-ups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: overlay alignment follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The two flaws the overlay alignment work found in code Barter shares with Skilled are fixed in Skilled, and everything phases 014 to 017 put on main passes a review with no P0 or P1.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A flaw in code identical to upstream is fixed in Skilled too. |
| D2 | The router-sync README skip uses the exact text of Barter's overlay copy, so a re-pin brings no difference. |
| D3 | The engine skips Python bytecode caches by name on both sides of every directory-entry reader, not what git ignores, because an overlay folder may sit in no repository and a `.gitignore` is not pinned. |
| D4 | `canary-router.cjs` stays skipped, as phase 016 recorded. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] Each fix has a test that failed on the unfixed script and passes on merged main.
- [x] The final `@review` round approves with no P0 or P1, recorded in `implementation-summary.md`.
- [x] `validate.sh` on the 007 parent with `--recursive --strict` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Router-sync README skip | Done | commit `251edb80d4c`, router-sync suite 56 of 56 |
| Engine cache skip | Done | commits `5485069871f`, `d8b2ef4e23e` and `7332be12cd2`, engine suite 362 of 362 |
| Final review | Done | round 1 APPROVED in two halves, round 2 REQUESTED_CHANGES on one P1, round 3 APPROVED with no P0 or P1 |

### Deviations and findings

| Item | Note |
|------|------|
| Review round 1 P2s | Two side effects of the cache rule were fixed in `d8b2ef4e23e`. The third, a `retained` README counted as shipping, belongs to phase 014's contract and stays open |
| Review round 2 P1 | A repin rollback lost a pruned cache. Fixed on the first attempt in `7332be12cd2` |
<!-- /ANCHOR:log -->
