---
title: "Goal: Phase 1: removal-plan"
description: "Name every live Deem reference with the phase that removes it, and record the removal decisions, before any file outside this phase changes."
trigger_phrases:
  - "deem removal inventory"
  - "deem reference owner"
  - "removal decision record"
  - "one-mode hub rule"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase with the inventory and four decisions"
    next_safe_action: "Run phases 002 and 003 from inventory.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-001-removal-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: removal-plan

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Name every live Deem reference with the phase that removes it, and record the removal decisions, before any file outside this phase changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The inventory covers every file `git grep -l -i -P '\bdeem(\b|[-_])' -- ':!specs' ':!*/changelog/*'` prints, 209 on 2026-10-02 |
| D2 | Each row names one owner and one action. 002 owns the scorers with their tests and docs. 003 owns the `cli-deem` packet, the hub, routing, the advisor graph and the Hermes mirror. 004 owns the rest. The action is remove, rewrite or keep, and keep is only for the English word |
| D3 | This phase changes no file outside its own folder |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. DeepSeek drafts the inventory and the session checks every row against the file |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `inventory.md` in this folder has one row per file that `git grep -l -i -P '\bdeem(\b|[-_])' -- ':!specs' ':!*/changelog/*'` prints, and each row names an owner of 002, 003 or 004 and an action
- [x] `decision-record.md` in this folder holds ADR-001 to ADR-004, each Accepted: remove rather than mark, `cli-classifier` as a one-mode hub, `--deem` as an unknown flag, and `specs/`, released changelog entries and the Deem server left as they are
- [x] `inventory.md` cites the `file:line` of each `parent-skill-check.cjs` and compiled-routing rule that bounds a hub's mode count, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0 on the unchanged hub
- [x] `inventory.md` names every test suite that covers a file in its rows, with the baseline pass and fail count of each
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
| Inventory | Done | 209 files, DeepSeek V4.1 Flash max draft (OpenCode Go after a Cline 429), rows and file list match one for one. By owner 002: 99, 003: 60, 004: 50. By action delete 28, remove 167, rewrite 12, keep 2 |
| Decisions | Done | ADR-001 to ADR-004 Accepted in `decision-record.md` |
| Hub rules | Done | `parent-skill-check.cjs:354` and the classifier compiler (`registry-compiler.cjs:153`) need only one mode, and the router clarifies only on a tie between modes (`router.cjs:205`). The check exits 0 on the unchanged hub |
| Baselines | Done | 25 suites. `score-jev-tiebreak.vitest.ts` 58 pass 1 fail and `test_hvr_reader_lens.py` 1 fail, both Deem tests that 002 removes |

### Deviations and findings

| Item | Note |
|------|------|
| Owner moves | The draft put the injection-screen scorer under 003 by location. The session moved its six own files to 002, since it is a scorer, and moved the playbook fail-closed allowlist to 003, since it must change with the packet's deletion |
<!-- /ANCHOR:log -->
