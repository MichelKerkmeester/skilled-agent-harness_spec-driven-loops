---
title: "Goal: sk-code Quality and Review Modes Research"
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
    packet_pointer: "sk-code/014-code-modes-research"
    last_updated_at: "2026-10-25T08:50:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the executor alternation run per iteration or per child?"
    answered_questions: []
---
# Goal: sk-code Quality and Review Modes Research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce, from two independent ten-iteration research runs, ranked and evidence-labelled recommendations that make sk-code-quality and sk-code-review more repo-agnostic, more useful and better integrated with their sibling modes and with modes an outside user adds to the hub, without changing any hub file.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Findings only. No file under `.skilled/` changes. Writes land under each child's `research/` folder. |
| D2 | The subjects are sk-code-quality (phase 1) and sk-code-review (phase 2). The other two modes are read as siblings only. |
| D3 | Each run holds exactly ten iterations, one angle each. Early convergence cannot end a run before iteration ten. |
| D4 | Luna max fast via cli-codex and DeepSeek flash max 1017 via cli-pi through llmgateway alternate by iteration, odd on Luna and even on DeepSeek. |
| D5 | Every finding carries OBSERVED, DERIVED or INFERRED and a source tag with a path and line. Nothing is fetched. |
| D6 | Neither run reads the other child's `research/` folder before its own synthesis exists. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-quality-mode-research | `001-quality-mode-research/goal.md` |
| 002-review-mode-research | `002-review-mode-research/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `research/research.md` exists in both phase folders and both hold a Ranked Recommendations section of at least eight rows that carry OBSERVED, DERIVED or INFERRED.
- [ ] `research/deep-research-state.jsonl` in both phase folders holds 10 records of type iteration and one synthesis_complete record with a stopReason field.
- [ ] `git diff --stat` from the sha logged as Baseline in the Progress table below to HEAD prints no path under `.skilled/`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research --recursive --strict` prints `RESULT: PASSED`.
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
| Packet scaffolded and documents written | Done | Created 2026-10-25 with `create.sh --phase --level 2 --with-goal`, strict validation result recorded in the first close-out |
| Baseline | Pending | Write the HEAD sha here before the first iteration runs |
| 001 quality run | Pending | Not launched |
| 002 review run | Pending | Not launched |

### Deviations and findings

| Item | Note |
|------|------|
| Executor alternation unit | D4 assumes per iteration. The brief said only "alternating", so the operator confirms the unit before launch. |
<!-- /ANCHOR:log -->
