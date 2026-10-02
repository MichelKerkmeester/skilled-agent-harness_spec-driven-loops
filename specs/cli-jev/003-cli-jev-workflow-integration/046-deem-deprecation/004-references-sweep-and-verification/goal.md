---
title: "Goal: Phase 4: references-sweep-and-verification"
description: "Clear every remaining live Deem reference, add the changelog entries for the removal, and prove the whole removal from the final state."
trigger_phrases:
  - "deem references sweep"
  - "deem removal verification"
  - "jev only changelog"
  - "deem removal review"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-004-references-sweep-and-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: references-sweep-and-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Clear every remaining live Deem reference, add the changelog entries for the removal, and prove the whole removal from the final state.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rewritten docs describe what exists now, Jev only. They carry no note that Deem was once there. Only changelog entries tell that story |
| D2 | Each skill whose behavior or docs changed gets one new changelog entry. Released entries stay as they are |
| D3 | One cross-family review covers the whole removal: P0 and P1 fixed, P2 recorded in this goal's log |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. The trigger index is rebuilt after the docs land |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git grep -l -i -P '\bdeem(\b|[-_])' -- ':!specs' ':!*/changelog/*'` prints only files `../001-removal-plan/inventory.md` marks keep and generated index or baseline files whose every match comes from a spec folder or a changelog entry, and `git grep -n -e "--deem" -- ':!specs' ':!*/changelog/*'` prints nothing
- [x] `validate_document.py` passes on each doc this phase changed, and `parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0
- [x] Every suite named in `../001-removal-plan/inventory.md` passes with 0 failing from the final state
- [x] The cross-family review leaves no open P0 or P1, and each P2 is in this goal's log
- [x] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this folder
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
| Planned | Done | Scoped 2026-10-02 from the operator's request to remove Deem and keep Jev |
| Doc rewrites | Done | DeepSeek V4.1 Flash max in three batches: `f20ba5f446`, `a81b7def29`, `645659d5b5`. 135 changed docs pass `validate_document.py` |
| Changelogs | Done | 13 new entries, one per changed skill or packet. `cli-jev` came last in `bf2ea5e8be` |
| Generated files | Done | README baselines `5c6e7ac7cc`, trigger index and fixtures `2b2ed3d750` |
| Greps | Done | Inventory pattern: two keep files and five generated files. `--deem`: nothing |
| Suites | Done | 24 inventory suites 0 fail, the changed scorer suites 446 of 446, advisor suite 1055 passed with 0 failed |
| Review | Done | Luna on the doc commits. The P0 stale test counts were fixed in `0c1ca648e8` |

### Deviations and findings

| Item | Note |
|------|------|
| Criterion 1 amended (2026-10-02) | The trigger index, its fixtures and the README baseline are built from every tracked doc, spec folders included. Spec folders keep their Deem history, so those files always hold Deem text. Each match was traced: corpus and diagnostics hold only `specs/` paths, and every Deem phrase in the index and its variants comes from a spec folder or a changelog entry |
| Spec trigger phrase | 002's phrase `scorer --deem removal` reached the generated variants and so the `--deem` grep. It now reads `scorer deem flag removal` |
| P1 runtime changelog rejected | Luna said `runtime/changelog/v1.9.2.0.md` has no SKILL.md version to match. `runtime/` keeps its own changelog line, v1.8.0.0, v1.9.0.0 and v1.9.1.0 before this one, with no SKILL.md by design |
| No entry for two skills | `cli-external-orchestration` changed one relation string in `graph-metadata.json` and `sk-create-manual-testing-playbook` dropped the deleted packet from its fail-closed allowlist. Neither changed a doc or a behavior, which D2 asks an entry for |
| Hooks | `.skilled/hooks` tests lost their Deem cases. Hooks have no skill changelog, so the framework release notes carry that |
| P2 fanout-merge count | Kept: the deep-review playbook and runtime catalog say 10 fanout-merge tests where the suite has 61. That suite is a keep file this work did not touch |
<!-- /ANCHOR:log -->
