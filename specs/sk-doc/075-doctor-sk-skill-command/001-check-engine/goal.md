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
    last_updated_at: "2026-10-30T06:50:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
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

- [ ] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0 over the plain, pre-migration, canon, dual-declaration, outside-root, `local-` prefix and nested-packet fixtures
- [ ] A fleet `sk-skill-check.cjs check --json` run reports the baseline verdict for every shipped root in `scratch/baseline/`
- [ ] `git status --porcelain` prints the same lines before and after a fleet `check` run
- [ ] With the resolver path hidden, `check` exits 2 and names the missing resolver
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
| Phase planned | Pending | spec.md, plan.md, tasks.md authored |

### Deviations and findings

| Item | Note |
|------|------|
| Script names | The operator renamed the command to `/doctor:sk-skill`; scripts carry the `sk-skill-` prefix instead of the design's `skill-` prefix |
<!-- /ANCHOR:log -->
