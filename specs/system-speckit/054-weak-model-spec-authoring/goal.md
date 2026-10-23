---
title: "Goal: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm"
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
    packet_pointer: "system-speckit/054-weak-model-spec-authoring"
    last_updated_at: "2026-10-23T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A DeepSeek V4.1 Flash swarm authors valid, filled spec packets from the system-spec-kit templates, proved by a measured before and after, with no change to the verdict of any existing packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Nine phases, 001 to 009 in folder order, plus one write-recipe child under `041-write-recipe-fixes`. All logic lives in system-spec-kit, never in sk-prompt. |
| D2 | The placeholder gate applies to new docs only, through the v2.3 template marker. An existing or external packet never gets a new failure. |
| D3 | At most 3 parallel DeepSeek lanes, and never two lanes on the same file. |
| D4 | Every phase closes on scripted gates plus one read-only frontier review (cli-codex, gpt-6-luna). |
| D5 | Phase 008 runs the playbooks in a disposable sk-git worktree. |
| D6 | Every phase is Level 3 with its own goal, bound below. |
| D7 | The conductor is a DeepSeek session outside OpenCode, because cli-opencode refuses self-dispatch. |
| D8 | Cli-opencode rule 15 L4 prefers a Copilot gpt-6-sol executor. The operator chose DeepSeek, so keep L1 to L3: banned operations and allowed write paths in each prompt, a fresh worktree and a baseline commit. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-template-drift-census-and-baseline | `001-template-drift-census-and-baseline/goal.md` |
| 002-template-and-example-defect-repair | `002-template-and-example-defect-repair/goal.md` |
| 003-versioned-placeholder-gate | `003-versioned-placeholder-gate/goal.md` |
| 004-template-section-fill-guidance | `004-template-section-fill-guidance/goal.md` |
| 005-weak-model-authoring-card | `005-weak-model-authoring-card/goal.md` |
| 006-speckit-command-and-agent-alignment | `006-speckit-command-and-agent-alignment/goal.md` |
| 007-playbook-catalog-readme-alignment | `007-playbook-catalog-readme-alignment/goal.md` |
| 008-playbook-run-in-worktree | `008-playbook-run-in-worktree/goal.md` |
| 009-authoring-benchmark-and-closeout | `009-authoring-benchmark-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`
- [ ] A new v2.3 core doc with an unfilled `[YOUR_VALUE_HERE: ...]` token passes strict validation while its status is Draft and fails it at any other status, and a v2.2 doc validates as it did before
- [ ] Recursive strict validation over `specs/` gives the same pass and fail counts before phase 003 and after phase 009
- [ ] `check-example-drift.sh` and `check-card-sync.sh` both exit 0 on the final tree
- [ ] The phase 009 report lists min and max for five metrics over 3 baseline and 3 final runs, and the final runs' lowest `leftover_hints` is below the baseline's lowest
- [ ] Every playbook scenario this packet added has a recorded PASS in the phase 008 report, or a FAIL named in the log with its escalation
- [ ] The swarm commits only on the build worktree and never pushes
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
| Launch precondition 1: workspace chosen (A worktree or B branch) | Pending | |
| Launch precondition 2: provider login lists `llmgateway/deepseek-v4.1-flash-1017` | Pending | |
| Launch precondition 3: three-lane authorization | Done | Given by the operator before planning |
| Launch precondition 4: conductor runs outside OpenCode | Pending | |
| WORKTREE path | Pending | |
| Start commit | Pending | |
| BASE_REF | Pending | The git ref phase 008 builds its disposable worktree from. It must contain the phase 002 to 007 changes. Replace Pending with the ref |

### Deviations and findings

| Item | Note |
|------|------|
| Cli-opencode rule 15 L4 | The operator chose DeepSeek over a Copilot gpt-6-sol executor. See D8 |
<!-- /ANCHOR:log -->
