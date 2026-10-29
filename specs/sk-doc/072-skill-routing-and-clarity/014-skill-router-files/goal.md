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
| 001 to 009 | Complete | Each child spec marks it Complete and each Level 2 child's acceptance rows read Met. 008's AC-008 is waived by its ADR-001. |
| 010 to 022 | Complete | One operator-local alignment check per skill after the move, each with a fix lane and a recheck. Each folder passes strict validation with 0 warnings. |
| Criterion 1 | Held | `package_skill.py --check --strict` prints `Result: PASS` for 54 of 54 skills, and the debt ledger's `debt` is `{}`. |
| Criterion 2 | Held | `capture-scorer-eval-baseline.mjs` reads 155/195, 49/66 and 19/24 after the alignment edits. |
| Criterion 3 | Held | The replay prints `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and its report is byte-identical to the pre-regeneration report. |
| Criterion 4 | Held | Seven hubs print `OK: parent-skill-check`, and `compiled-route-guard.cjs` prints seven `fresh` lines after `f031f07eba`. |
| Criterion 5 | Held | 16 AI Systems routers resolve and their SKILL.md links pass; the battery passes. The remote push waits on the operator. |
| Criterion 6 | Held | The recursive strict run on this folder ends with `RESULT: PASSED`. |

### Deviations and findings

| Item | Note |
|------|------|
| Routing parse | All 54 routers parse identically to the pre-move tree after every alignment edit, so D1 holds. |
| Re-mint gate | The pre-commit re-mint gate ignored a staged ROUTER.md, so mcp-tooling's manifest went stale. `f031f07eba` adds ROUTER.md to the gate's paths with two hook tests and re-mints mcp-tooling. |
| Leaf manifest under a hook | `generate-leaf-manifest.cjs` counted git-ignored files when a hook exported `GIT_DIR`. It now drops the hook's git variables, with a test. |
| Follow-up work | Routing-data items go to `../015-routing-data-alignment/`, and the reference format debt goes to `specs/sk-doc/074-reference-template-debt/`. Both are recorded in the parent spec. Both shipped: 074 as `e190385670`, 015 as `0bf2d2c3d4`. |
| D3 amendment | 015 changed routing on purpose, as D3 requires an amendment to do. The scorer still reads 155/195, 49/66 and 19/24. The replay gained one gold row, mcp-notion's first scenario, and reads `gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`. The other hub lines are unchanged. Criterion 3 held at this packet's close, and the reading after 015 is recorded in 015's decision record. |
<!-- /ANCHOR:log -->
