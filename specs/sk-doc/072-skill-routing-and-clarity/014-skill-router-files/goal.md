---
title: "Goal: Skill Router Files"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files"
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
    completion_pct: 44
    open_questions: []
    answered_questions: []
---
# Goal: Skill Router Files

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move each skill's and mode's machine router out of SKILL.md into a sibling ROUTER.md, so every SKILL.md keeps its budget for its own rules while routing accuracy holds at its baseline.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The move changes where a router lives. No skill or mode routes differently after it. |
| D2 | Every skill and mode owns a sibling `ROUTER.md`. A hub's moved prose joins its existing root `ROUTER.md`. |
| D3 | Routing baseline: advisor scorer 155/195, 49/66 and 19/24, and replay `gold=64 exact=49`. Moving either number is an amendment. |
| D4 | The AI Systems repository changes only in phase 008, and its remote push waits for operator approval. |
| D5 | Phases 007 to 009 do not wait for phases 004 to 006. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-deep-research | `001-deep-research/goal.md` |
| 002-router-file-tooling | `002-router-file-tooling/goal.md` |
| 003-check-and-template-canon | `003-check-and-template-canon/goal.md` |
| 004-hub-router-merge | `004-hub-router-merge/goal.md` |
| 005-packet-and-standalone-migration | `005-packet-and-standalone-migration/goal.md` |
| 006-regeneration-and-verification | `006-regeneration-and-verification/goal.md` |
| 007-ai-systems-research | `007-ai-systems-research/goal.md` |
| 008-ai-systems-migration | `008-ai-systems-migration/goal.md` |
| 009-ai-systems-verification | `009-ai-systems-verification/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `package_skill.py --check --strict` prints `Result: PASS` for every skill under `.skilled/skills`, and `routing-shape-known-debt.json` holds 0 debt entries.
- [ ] `capture-scorer-eval-baseline.mjs` reads 155/195, 49/66 and 19/24 after regeneration.
- [ ] `leaf-route-replay.cjs` totals read `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and its `--report` output is byte-identical before and after regeneration.
- [ ] `parent-skill-check.cjs` prints `OK` for seven hubs, and `compiled-route-guard.cjs` prints seven `fresh` lines.
- [ ] Each of the 16 AI Systems skills has a `ROUTER.md` linked from its `SKILL.md`, with checks passing in `Barter-BV/marketing-ai-systems`.
- [ ] `validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files --recursive --strict` ends with `RESULT: PASSED`.
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
| 001-deep-research | Complete | Operator status. Child spec and acceptance criteria mark it Complete. |
| 002-router-file-tooling | Complete | Operator status. Child spec and acceptance criteria mark it Complete. |
| 003-check-and-template-canon | Complete | Operator status, on main. Child spec and acceptance criteria mark it Complete. |
| 004-hub-router-merge | Committed, landing | Operator status. Child acceptance criteria still read Unmet. |
| 005-packet-and-standalone-migration | In Progress | Operator status: all 47 skills moved and verified identical in routing. Child acceptance criteria still read Unmet. |
| 006-regeneration-and-verification | Not started | Operator status. |
| 007-ai-systems-research | Complete | Operator status, on main. Child spec and acceptance criteria mark it Complete. |
| 008-ai-systems-migration | Not started | Operator status. Writes to a separate repository whose remote push needs operator approval. |
| 009-ai-systems-verification | Not started | Operator status. |

### Deviations and findings

| Item | Note |
|------|------|
| Phase map status | The spec phase map reads 003 Pending, 004 Pending, 005 Pending and 007 In Progress. The child docs and the operator report 003 and 007 Complete, 004 committed and 005 in progress. The spec was not edited, because this packet's writable scope is goal files only. |
| completion_pct | 44 is 4 of 9 phases Complete (001, 002, 003, 007). |
| Child criteria rows | Child acceptance rows for 004 and 005 still read Unmet. This goal records operator status and does not mark them Met. |
| Phases 008 and 009 | Their spec.md and acceptance-criteria.md are unfilled scaffolds. Their goals take criteria from this parent's phase map and Phase Handoff Criteria, the only filled sources. Re-derive them once the phase docs are authored. |
<!-- /ANCHOR:log -->
