---
title: "Goal: Phase 46: deem-deprecation"
description: "Remove cli-deem everywhere so cli-jev is the only classifier, while cli-classifier stays a parent hub ready for future classifiers."
trigger_phrases:
  - "deem deprecation"
  - "remove cli-deem"
  - "jev only classifier"
  - "one-mode classifier hub"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation"
    last_updated_at: "2026-10-02T10:30:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the durable directive and bound the four phases"
    next_safe_action: "Run phase 001's inventory and decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-deem-deprecation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 46: deem-deprecation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove `cli-deem` and every Deem arm so `cli-jev` is the only classifier, while `cli-classifier` stays a parent hub ready for a future classifier.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Remove, do not mark: the `cli-deem` packet, its Hermes copy and every scorer's `--deem` switch, arm, tests and docs go. History stays: `specs/` and released changelog entries are not edited |
| D2 | `cli-classifier` stays a parent hub with `cli-jev` as its only mode, passes its parent-hub check and keeps its routing compiled, so a later classifier is one new mode |
| D3 | Each scorer's default output and `--jev` arm stay as they are, and `--deem` becomes an unknown flag |
| D4 | The local Deem server and `~/.local/share/deem` are not touched |
| D5 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies and commits. Cross-family review: fix P0 and P1, record P2. Path-scoped commits, main only on the operator's go |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-removal-plan | `001-removal-plan/goal.md` |
| 002-scorer-deem-arms | `002-scorer-deem-arms/goal.md` |
| 003-cli-deem-mode-removal | `003-cli-deem-mode-removal/goal.md` |
| 004-references-sweep-and-verification | `004-references-sweep-and-verification/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `001-removal-plan`, `002-scorer-deem-arms`, `003-cli-deem-mode-removal` and `004-references-sweep-and-verification` each have `spec.md` Status Complete
- [ ] `.skilled/skills/cli-classifier/cli-deem/` and `.hermes/skills/cli-deem/` do not exist, and `git grep -n -e "--deem" -- ':!specs' ':!*/changelog/*'` prints nothing
- [ ] The parent-hub check on `.skilled/skills/cli-classifier` passes with `cli-jev` as its only mode, and `compiled-route-status.cjs --hub cli-classifier --no-probe` reports `compiled-serving`
- [ ] Every test suite that covered a removed `--deem` arm passes with 0 failing, and each scorer's default run prints what it printed before the removal
- [ ] `validate.sh --strict --recursive` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this phase and each child
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
| Request | Done | The operator, 2026-10-02: "Stop and deprecate deem completely", then "lets deperecate deem cli completely and only keep cli jev", "Cli classifier still needs to stay a parent hun tho" and "In case we want to support future classifiers". Workers named in "Use luna max 6 fast cli codex and deepseek v4.1 flash max cli pi opencode go and cline provider as needed" |
| Last Deem results | Done | Phase 045's runs stopped at the operator's word after 2 of 20: 002 `kill` (Deem won 7 tiebreaks, lost 29) and 006 `kill` on both rules |
| Footprint | Done | 252 files outside `specs/` match "deem", many as English words (`deems`, `Deemphasized`, `encodeEmbedding`). Phase 001 sorts the real ones |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
