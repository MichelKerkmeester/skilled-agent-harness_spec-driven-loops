---
title: "Goal: Phase 13: fix-review-findings-in-json-entry-set-restore"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix review findings in json entry set restore goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/013-fix-review-findings-in-json-entry-set-restore"
    last_updated_at: "2026-11-16T19:46:47Z"
    last_updated_by: "scaffold"
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
# Goal: Phase 13: fix-review-findings-in-json-entry-set-restore

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A dropped json-entry `set` returns the pin's value at the same item, or the engine refuses before it writes anything, with advice that clears the refusal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix all seven findings of the fresh review. The operator chose this on 2026-11-16. |
| D2 | Each engine change starts with a test that fails first, paired with a test that the nearest person-edit case still refuses or still restores. |
| D3 | The build runs from literal briefs on GPT-6 Luna at max effort, fast tier, through cli-codex, and every result is compared byte for byte with the prototype. The operator switched from DeepSeek on Vibe on 2026-11-16. |
| D4 | Nested dropped sets restore outer first. Deepest first was prototyped and still refused. |
| D5 | A re-pin plans the json-entry files its copy leaves in place against the new commit before its backup, and refuses with exit 2. |
| D6 | An entry set the engine cannot apply to an untouched file is reported as `cannot-apply`. |
| D7 | The overlay reference documents the silent cases that remain. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints tests 1214, fail 0.
- [ ] `rg -c 'cannot-apply' .skilled/skills/system-skilled-doctor/references/overlays.md` prints 2.
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`.
- [ ] The commit is on origin/main, and the vendoring project is told which commit to re-pin to.
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
| Prototype | Done | Doctor test folder printed tests 1214, pass 1214, fail 0 |
| Luna briefs 01 to 07 | Done | All nine files matched the prototype byte for byte. Doctor tests 1214, fail 0 |
| Fresh Opus review | Done | 2 P1 and 2 P2, all reproduced. The operator chose to fix all four |
| Second Opus review | Done | 3 P1 and 2 P2, all reproduced. The operator chose to fix the P1s and document the P2s |
| Round two, briefs 08 to 10 | Done | All four files matched prototype 2 byte for byte. Doctor tests 1217, pass 1217, fail 0 |
| Round three and third review | Done | briefs 11-13 matched; doctor tests 1220 pass 0 fail; third Opus review APPROVED |

### Deviations and findings

| Item | Note |
|------|------|
| The handoff said deepest path first | p01 still refused in both orders under that sort. Outer first was built (D4) |
| Fable 5.2 harden and UX question | Asked through `claude2`, read-only, after the operator ruled out Fable sub-agents. Ten items, in `scratch/fable-harden-ux-answer.md`. The operator chose all four groups for a follow-up phase after this one ships |
| The hand swap of two items, listed as silent | The item check now refuses it. The doc names two silent cases, not three |
<!-- /ANCHOR:log -->
