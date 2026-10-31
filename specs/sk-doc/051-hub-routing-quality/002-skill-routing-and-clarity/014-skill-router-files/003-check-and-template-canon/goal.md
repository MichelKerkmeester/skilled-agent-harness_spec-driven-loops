---
title: "Goal: Phase 3: check-and-template-canon"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon"
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
# Goal: Phase 3: check-and-template-canon

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the routing-shape checks, the create-skill templates and the canon docs accept and require a sibling `ROUTER.md`, with unmoved skills tracked in a debt ledger until phase 005 empties it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | RS-004 is reversed. Every skill and mode owns a sibling `ROUTER.md`, and a router whose real path leaves its skill folder fails. |
| D2 | RS-005 requires a relative link from `SKILL.md` to its sibling `ROUTER.md`. RS-002 fails a `## MACHINE ROUTER` section left in `SKILL.md`. |
| D3 | The known-debt ledger holds one entry per unmoved skill and mode, and it only shrinks. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Four Python routing-shape test files pass with at least 84 passing tests.
- [ ] `package_skill.py --check --strict` reports no RS-004 for a mode packet with a sibling `ROUTER.md`, and reports RS-004 for the same packet without it.
- [ ] A `SKILL.md` that still ends with a `## MACHINE ROUTER` section fails RS-002 with a message that names `ROUTER.md`.
- [ ] `routing-shape-known-debt.json` holds 54 entries, and `routing-shape-known-debt-ratchet.test.cjs` passes 4 of 4.
- [ ] `ci-skill-root-metadata.cjs` prints `checked=13 passed=13 failed=0`, and `sk-git` gets a standalone router result.
- [ ] `init_skill.py` on a temp standalone skill leaves `ROUTER.md` beside `SKILL.md`.
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
| Checks, debt ledger, templates, create-skill workflows, canon docs | Complete | Operator status, on main. Child acceptance criteria AC-001 to AC-009 read Met. |

### Deviations and findings

| Item | Note |
|------|------|
| None | Nothing diverged from the directive. |
<!-- /ANCHOR:log -->
