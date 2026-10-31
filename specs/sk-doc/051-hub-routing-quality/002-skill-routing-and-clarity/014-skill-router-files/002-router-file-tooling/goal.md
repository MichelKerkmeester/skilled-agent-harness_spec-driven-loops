---
title: "Goal: Phase 2: router-file-tooling"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: router-file-tooling

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every router reader one resolver that finds a skill's machine router in its sibling ROUTER.md, refuses to choose when a skill declares its router in two files, and lets the advisor notice a router-only edit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The resolver returns `router-md`, `skill-md`, `dual-declaration` or `none`. A dual declaration routes nothing. |
| D2 | No router file moves in this phase. Phases 004 and 005 move them. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `router-file-resolver.test.cjs` passes with `fail 0`, with one case each for the `router-md`, `skill-md` and `dual-declaration` verdicts.
- [ ] `verify-router-sync.test.cjs` passes with `fail 0`, including a fixture whose router sits only in `ROUTER.md`.
- [ ] A source probe that counts router sources prints `{"hub-router.json":7,"inline":6}`, unchanged from before the phase.
- [ ] `verify_alignment_drift.py --root .skilled/skills --check-router` prints `Findings: 0`.
- [ ] `router-signature-parity.vitest.ts` passes, and editing only a `ROUTER.md` changes both freshness signatures.
- [ ] `sync-skills-hermes.test.mjs` passes with `fail 0`, and `--check` reports DRIFT for an edited `ROUTER.md` copy.
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
| Resolver, readers, Hermes generator, freshness probes, watcher target | Complete | Operator status. Child acceptance criteria AC-001 to AC-011 read Met. |

### Deviations and findings

| Item | Note |
|------|------|
| None | Nothing diverged from the directive. |
<!-- /ANCHOR:log -->
