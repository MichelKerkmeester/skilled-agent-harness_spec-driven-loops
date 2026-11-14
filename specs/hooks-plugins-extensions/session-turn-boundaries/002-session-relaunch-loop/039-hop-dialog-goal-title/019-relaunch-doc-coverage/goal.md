---
title: "Goal: Phase 19: relaunch-doc-coverage"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "relaunch doc coverage goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/019-relaunch-doc-coverage"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase goal from spec.md and acceptance-criteria.md"
    next_safe_action: "Build the phase from tasks.md once phases 15 to 17 are Complete"
    blockers: []
    key_files: [".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", ".skilled/commands/speckit/handoff.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-relaunch-doc-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the advisor route troubleshooting prompts about a hand-over? Named for the advisor's owner, not decided here."
    answered_questions:
      - "Is a trigger phrase for an ended goal added? No. The mark is written with no operator action, so there is no request to route."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: relaunch-doc-coverage

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The Claude relaunch playbook, the relaunch feature catalog entry and the handoff command document say what the relaunch code does after phases 15 to 17, the moved citations of children 004 and 013 name the commit they were observed at, and the trigger phrase question has a recorded answer.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Documents only, built after phases 15, 16 and 17 are Complete. A document child, as children 009 and 014 are, so parent D1's failing-first test does not apply. |
| D2 | No trigger phrase is added for an ended goal. `prepare` and `keep` write the mark with no operator action, so there is no request to route. The wider routing gap is named for the advisor's owner. |
| D3 | The Pi and OpenCode playbook does not change. Its wrapper case runs the shared suite, and the mark and the Stop notice are Claude only. |
| D4 | A moved citation keeps its line number and gains the commit it was observed at. Only the twelve moved citations change: ten in child 013 and two in child 004. |
| D5 | Each new playbook and catalog sentence names a source line or a test read on the tree that holds phases 15 to 17. |
| D6 | Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c 'The check links that helper' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` and `rg -c 'turns the field off' .skilled/commands/speckit/handoff.md` both print nothing with exit 1.
- [ ] `rg -c 'goal_ended' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` prints a count of 1 or more for each file, and so does the same command for `wrapper-changed`.
- [ ] `rg -n ':183|line 183' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin --glob '*.md'` prints ten lines, each holding `c69f278cfc`.
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict` and `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` both exit 0.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/019-relaunch-doc-coverage --strict` prints `RESULT: PASSED`.
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
| Review findings | Done | 2026-11-14. Alignment run B-02, D-01, B-03, X-2, X-1 and X-3, deep review R10-P2-001, and review FH with the orchestrator for the moved citations. All are named in the parent goal log |
| Code and document read | Done | 2026-11-14 at `99d197475d`. The output is quoted in `spec.md` Measured Behavior. The moved citations of child 013 number seven in five files, two more than the ledger listed. A verifier later counted ten in six files, using three spellings, and two in child 004 |
| Trigger phrase decision | Done | 2026-11-14: no phrase. The advisor returned no recommendation for "After my goal ended, hand the session over without restarting that goal" and none for "hand over my session", and returned `command-speckit-handoff` at 0.8962 for "write a handoff note and relaunch the session". The mark needs no operator request, and the wider gap is the advisor owner's |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is written after the build |
| Build | Pending | Tasks T001 to T016, after phases 15 to 17 |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Citations were true when written | Child 004 cited line 1469 at commit `89e246760e`, and child 013 cited line 183 at commit `c69f278cfc`. Children 012 and 014 moved those lines later. The fix adds the commit and keeps the line |
| Other citations | Children 001 to 014 hold about 76 line citations into the wrapper, the Stop adapter and the core. Phases 15 to 17 will move more of them. Only the twelve moved ones are pinned, and the parent log records that a line citation in a closed child is as observed on its date |
<!-- /ANCHOR:log -->
