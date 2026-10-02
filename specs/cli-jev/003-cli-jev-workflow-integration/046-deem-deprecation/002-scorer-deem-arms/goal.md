---
title: "Goal: Phase 2: scorer-deem-arms"
description: "Remove every scorer's --deem arm with its tests and docs, so each scorer's default run and --jev arm behave as they did before."
trigger_phrases:
  - "remove scorer deem arm"
  - "scorer --deem removal"
  - "jev only scorer"
  - "deem arm tests"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-002-scorer-deem-arms"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: scorer-deem-arms

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove every scorer's `--deem` arm with its tests and docs, so each scorer's default run and `--jev` arm behave as they did before.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The scorers are the ones `../001-removal-plan/inventory.md` assigns to 002. A shared Deem helper goes when its last caller does |
| D2 | Each scorer's default output stays byte-identical and its `--jev` arm is unchanged. `--deem` reaches the scorer's existing unknown-flag path |
| D3 | A test that covers only the Deem arm is removed. A test that covers both arms keeps its Jev half |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. DeepSeek takes the one-arm scorers in batches and Luna takes 023 and 027, which run both arms side by side |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `git grep -n -i -P '\bdeem(\b|[-_])'` over the files `../001-removal-plan/inventory.md` assigns to 002 prints only lines that inventory marks keep
- [ ] For each scorer in that inventory, the default run's stdout on the same input before and after the removal is identical, and `scratch/default-diff.txt` records an empty `diff` per scorer
- [ ] Every suite that covered a removed arm passes with 0 failing, and `implementation-summary.md` lists each removed test by name
- [ ] Each scorer run with `--deem` exits non-zero through its unknown-flag path, and `scratch/deem-flag.txt` records the exit status per scorer
- [ ] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this folder
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

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
