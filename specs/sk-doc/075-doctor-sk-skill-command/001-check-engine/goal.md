---
title: "Goal: Phase 1: check-engine"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "check engine goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/001-check-engine"
    last_updated_at: "2026-10-30T07:06:56Z"
    last_updated_by: "codex"
    recent_action: "Completed interpreter discovery and verified the phase"
    next_safe_action: "No further work is pending in this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: check-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver a read-only `sk-skill-check.cjs` that reports rows C1 to C13 for one skill or the whole fleet, so every later phase reports a delta against a recorded baseline.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `check` writes nothing and exits 0 clean, 1 with findings, 2 when it cannot run. |
| D2 | Advisor exit 75 is UNKNOWN, never a pass. |
| D3 | Fixtures use invented names; no tracked output names a `local-` prefixed path. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0 over the plain, pre-migration, canon, dual-declaration, outside-root, `local-` prefix and nested-packet fixtures
- [x] A fleet `sk-skill-check.cjs check --json` run reports the baseline verdict for every shipped root in `scratch/baseline/`
- [x] `git status --porcelain` prints the same lines before and after a fleet `check` run
- [x] With the resolver path hidden, `check` exits 2 and names the missing resolver
- [x] With `PYTHON` unset, interpreter discovery selects the first `python3` on `PATH` that imports PyYAML; with `PYTHON` set, only that interpreter is used
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
| Phase 1 verification | Complete | 22 test cases pass; fleet and named checks pass; strict validation passes |

### Deviations and findings

| Item | Note |
|------|------|
| Script names | The operator renamed the command to `/doctor:sk-skill`; scripts carry the `sk-skill-` prefix instead of the design's `skill-` prefix |
<!-- /ANCHOR:log -->
