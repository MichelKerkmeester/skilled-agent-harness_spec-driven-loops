---
title: "Tasks: Deprecate Standalone Deep Context"
description: "Task breakdown for staged deprecation of standalone deep-context and integration of codebase-context snapshots into deep-research and deep-review."
trigger_phrases:
  - "deep-context deprecation tasks"
  - "context mode removal tasks"
  - "research review context snapshot tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/038-deprecate-deep-context-integrate-capabilities"
    last_updated_at: "2026-07-04T13:24:26Z"
    last_updated_by: "opencode"
    recent_action: "Completed research synthesis"
    next_safe_action: "Implement /deep:context redirect stub"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-deep-context-deprecation-plan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "Use staged deprecation and preserve context capabilities in research/review."
      - "Deep-research completed 10 iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deprecate Standalone Deep Context

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary file or surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run active-reference inventory for `/deep:context`, `deep-context`, `@deep-context`, `context-report`, and `deep_context` across `.opencode`, `.claude`, `README.md`, and `AGENTS.md`.
- [ ] T002 Classify inventory hits as active runtime, active docs, generated metadata, test/fixture, historical archive, or false positive.
- [ ] T003 Read command-contract compiler sources before changing generated `/deep:research` or `/deep:review` docs.
- [ ] T004 Capture baseline advisor routing for deep context, deep research, and deep review prompts.
- [ ] T005 Capture baseline test status for command-contract, advisor routing, and deep-loop runtime suites.
- [ ] T006 Confirm whether `.codex` deep-context mirrors exist in the active workspace.
- [ ] T007 Confirm rollback points for command, registry, advisor, and mirror changes.
- [ ] T008 Update this packet if inventory finds a live surface not named in `spec.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 Add codebase context snapshot contract to `deep-research` docs and workflow-owned artifact expectations.
- [ ] T010 Add context coverage/snapshot contract to `deep-review` docs and report expectations.
- [ ] T011 Define shared context snapshot schema: reuse candidates, integration points, conventions, dependency edges, gaps, evidence, freshness, and relevance.
- [ ] T012 Update research/review command contract source and regenerate generated command docs.
- [ ] T013 Convert `/deep:context` router into a deprecation redirect that cannot load `deep_context_auto.yaml` or `deep_context_confirm.yaml`.
- [ ] T014 Update or archive `deep_context_*` command assets after the redirect no longer references them.
- [ ] T015 Remove or mark inactive the `context` mode in `deep-loop-workflows/mode-registry.json` only after command redirect behavior is verified.
- [ ] T016 Update `deep-loop-workflows/SKILL.md` and related hub docs to describe supported modes and replacement paths.
- [ ] T017 Deprecate or remove `.opencode/agents/deep-context.md` and keep `.claude/agents/deep-context.md` in parity.
- [ ] T018 Archive or delete `.opencode/skills/deep-loop-workflows/deep-context/` after replacement behavior and routing checks pass.
- [ ] T019 Update advisor Python and TypeScript routing/projection notes and regenerate or refresh skill graph metadata/indexes.
- [ ] T020 Update `AGENTS.md`, `README.md`, deep-loop agents, orchestrator docs, and other active guidance that advertises standalone context.
- [ ] T021 Leave archived specs unchanged unless they are active fixture/index inputs.
- [ ] T022 If runtime tests still require `context`, defer internal runtime loop-type removal and record the follow-up explicitly.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Run command-contract compiler and associated tests.
- [ ] T024 Run advisor routing probes and registry drift guard tests.
- [ ] T025 Run deep-loop runtime tests that cover convergence, reducers, artifact roots, and mode registry behavior.
- [ ] T026 Run grep parity scan proving no active docs recommend standalone `/deep:context` as supported.
- [ ] T027 Run mirror parity check for OpenCode and Claude agent inventories.
- [ ] T028 Run comment hygiene checks on modified code/script files if any implementation phase edits code.
- [ ] T029 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities --strict`.
- [ ] T030 Update `implementation-summary.md` with final verification evidence after implementation completes.
- [ ] T031 Mark checklist P0/P1 items with evidence only after the corresponding verification commands pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are satisfied or explicitly scoped to a deferred internal-runtime follow-up.
- [ ] `/deep:context` no longer starts the standalone context loop.
- [ ] `deep-research` and `deep-review` provide the replacement context snapshot capability with evidence rules.
- [ ] Advisor, registry, generated commands, docs, and mirrors agree on supported modes.
- [ ] Strict validation and targeted runtime tests pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the target file immediately before editing.
- [ ] Confirm task dependencies from the phase list.
- [ ] Confirm generated files are not edited manually when a compiler owns them.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Execute Phase 1 before public deprecation edits. |
| TASK-SCOPE | Modify only files needed for standalone context deprecation and research/review capability migration. |
| TASK-EVIDENCE | Pin each completed task to a grep, read, test, or generated artifact. |
| TASK-MIRROR | Keep `.opencode` and `.claude` mirror surfaces aligned in the same task. |

### Status Reporting Format
Report `Task T### complete`, files modified, verification run, and any deferred runtime cleanup.

### Blocked Task Protocol
If an expected file is missing, a generator contract is unclear, or tests fail after one fix pass, stop and report the blocker with the command output and recommended next action.
