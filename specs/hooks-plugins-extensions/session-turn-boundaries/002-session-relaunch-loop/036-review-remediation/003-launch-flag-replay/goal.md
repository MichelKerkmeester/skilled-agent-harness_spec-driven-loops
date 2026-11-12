---
title: "Goal: Phase 3: launch-flag-replay"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "launch flag replay goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/003-launch-flag-replay"
    last_updated_at: "2026-11-12T12:05:30Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after five fix passes and an SWE review"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: launch-flag-replay

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replay the first launch's full argument list on every relaunch hop, so a launch restriction or an unattended setting survives until the loop ends.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A hop replays the first launch's full argument list. |
| D2 | Only two things are replaced on a hop: the start prompt, which becomes the claim seed, and the settings the relaunch record overrides (model, effort, name, provider and Pi extensions). |
| D3 | One deny list in `.skilled/bin/skilled-loop` names every flag that must not repeat on a hop, and the carried-arguments paragraph in `.skilled/hooks/session-relaunch/README.md` documents that list. |
| D4 | When the wrapper cannot tell an option's value from the start prompt, it starts no session and prints the manual claim command. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test --test-name-pattern 'replayed with --permission-mode' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing case, so `--permission-mode plan` survives a hop.
- [x] `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports six passing cases, one per runtime arm.
- [x] `node --test --test-name-pattern 'deny list' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing case.
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with no failing case.
- [x] `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1.
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
| Planning documents authored | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay --strict --quiet` prints `RESULT: PASSED` |
| Build, six passes | Done | `scratch/red-2.txt` to `scratch/red-7.txt` hold the failing runs, `scratch/green.txt` the passing wrapper file (181 tests, 181 pass, 0 fail) |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: CONDITIONAL with four P1 and four P2. All four P1 and three P2 confirmed and fixed, one P2 recorded as a limitation |
| Suites | Done | Relaunch suite 846 of 846, OpenCode plugin 65 of 65, Pi 59 of 59, each exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Replay placement | The plan first copied the first launch's list in order. The built rule keeps today's list and appends the other options after the seed, so a repeating option cannot take the seed as a value. |
| Decline on ambiguity | D4 was added before the build: the wrapper needs option tables to find the start prompt, and an option outside them followed by a bare word cannot be classed. |
| Review input classes | REQ-007 records five input classes the first build missed. One verification command in the documents could not be parsed by node and was reworded. |

Open question, answered 2026-11-12: the deny list per runtime is in `plan.md` section 3, built from the six saved help texts.
<!-- /ANCHOR:log -->
