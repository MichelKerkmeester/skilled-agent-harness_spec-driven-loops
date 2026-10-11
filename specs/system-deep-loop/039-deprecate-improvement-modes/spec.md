---
title: "Feature Specification: Deprecate and delete the agent-improvement and model-benchmark deep-loop modes"
description: "Remove the agent-improvement and model-benchmark modes from system-deep-loop together with every reference, cross-skill integration, runtime mirror and README mention, planned from two forced-depth research inventories."
trigger_phrases:
  - "deprecate improvement modes phase parent spec"
  - "remove agent-improvement mode"
  - "remove model-benchmark mode"
  - "delete deep-improvement packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes"
    last_updated_at: "2026-10-11T03:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All ten phases complete in worktree 097; every gate matches or beats baseline; recursive strict validation passed"
    next_safe_action: "Operator: review the branch, then push to main"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "039-deprecate-improvement-modes-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Deprecate and delete the agent-improvement and model-benchmark deep-loop modes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `main` |
| **Parent Spec** | None (track root `specs/system-deep-loop/`) |
| **Parent Packet** | system-deep-loop/039-deprecate-improvement-modes |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | A repo-wide search outside `specs/` finds no live reference to either mode, and every affected gate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`system-deep-loop` registers five modes. Two of them, `agent-improvement` and `model-benchmark`, run on the shared `deep-improvement` packet and loop host rather than the runtime convergence loop, and the operator has decided to retire both. Their wiring reaches the hub registry and router, the advisor's projection maps and drift guard, the `/deep:*` commands, the `deep-improvement` agent and its copies in every CLI runtime, other skills such as `sk-doc` and `cli-external-orchestration`, and many READMEs. More than 550 files outside `specs/` mention one of the two modes or the packet.

### Purpose
Remove both modes completely, so that no route, command, agent, mirror, test or document still points at them, and the hub, the advisor and every runtime keep passing their gates afterwards.

> **Phase-parent note:** This spec.md is the only authored document at the parent level. All planning, task breakdowns, checklists and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `agent-improvement` and `model-benchmark` modes, their `/deep:*` commands, YAML and presentation assets and compiled contracts
- The `deep-improvement` agent and packet, once no remaining mode uses them
- Hub wiring, advisor wiring, cross-skill references, hooks, `bin/` helpers and env examples
- Agent, command, prompt and skill mirrors in `.claude`, `.opencode`, `.codex`, `.cursor`, `.pi`, `.devin` and `.hermes`
- READMEs, catalogs, playbooks, index files and the root `README.md`

### Out of Scope
- The `research`, `review` and `ai-council` modes, except where their shared files mention the removed modes
- Rewriting history in archived spec folders under `specs/`
- Removing `sk-create-benchmark` or other benchmark tooling that does not depend on the removed modes. Phase 002 decides this from the research

### Files to Change
Each phase owns an exact file list in its `scratch/files.txt`; this table summarizes them.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/` | Create (move) | 003 | Agent mirror checker, lib, tests and crosswalk |
| `.skilled/commands/deep/`, `.skilled/agents/` and runtime copies | Delete/Modify | 004 | The two commands, their assets, the agent and its mirrors |
| `.skilled/skills/system-deep-loop/` | Delete/Modify | 005 | The `deep-improvement` packet and hub wiring |
| `.skilled/skills/system-deep-loop/runtime/`, `.opencode/plugins/tests/` | Delete/Modify | 006 | Lane libraries, gateway, tests, plugin guards |
| `.skilled/skills/system-skill-advisor/`, `sk-doc`, CLI skills, `sk-code`, `system-spec-kit` | Modify/Delete | 007 | Advisor routing and cross-skill wiring |
| Root `README.md`, env examples, benchmark READMEs, `BARTER.md` | Modify | 008 | Remaining live mentions |
| `sk-doc/shared/scripts/classifier-cite-drift-scan.mjs`, cli-opencode provider doc | Modify | 009 | Existing defects |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder. Phase 002 holds the program, the decisions and each phase's file list.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-removal-research/ | Two parallel 10-iteration DeepSeek research runs that inventory every reference, one per mode | Complete |
| 2 | 002-removal-plan/ | Merge the inventories into one ordered removal program with five decisions and per-phase file lists | Complete |
| 3 | 003-agent-mirror-checker-relocation/ | Move the agent mirror checker out of the packet to `.skilled/bin/` and repoint its callers | Complete |
| 4 | 004-commands-and-runtime-mirrors/ | Delete both commands, their assets, the agent and every runtime copy | Complete |
| 5 | 005-skill-packet-and-registry/ | Delete the `deep-improvement` packet and remove both modes from the hub | Complete |
| 6 | 006-runtime-libraries-and-tests/ | Delete the lane runtime libraries and edit the gateway, authority order, tests and plugin guards | Complete |
| 7 | 007-advisor-and-cross-skill-wiring/ | Remove advisor routing and every cross-skill integration | Complete |
| 8 | 008-docs-and-readmes/ | Remove or rewrite every remaining live doc mention, including `BARTER.md` | Complete |
| 9 | 009-existing-issue-fixes/ | Fix the `+` citation pattern bug and the stale Cline fan-out doc note | Complete |
| 10 | 010-verification-and-closeout/ | Regenerate derived surfaces, run every gate and prove zero live references | Complete |
| 11 | 011-pre-existing-gate-failures/ | Fix the gate failures that predate the removal | Complete |
| 12 | 012-residual-reference-sweep/ | Remove leftovers the name-based search missed | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phase 009 is independent and may run at any point before 010
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-removal-research | 002-removal-plan | Both inventories exist, each from 10 iterations | Iteration counts, stop reasons and citation spot checks |
| 002-removal-plan | 003-agent-mirror-checker-relocation | Every file has one owning phase; ADRs recorded | No file in two lists |
| 003-agent-mirror-checker-relocation | 004-commands-and-runtime-mirrors | Checker runs from `.skilled/bin/` | Git-hook tests and broken-move drill |
| 004-commands-and-runtime-mirrors | 005-skill-packet-and-registry | No command, prompt or agent reaches the removed modes | Runtime-mirror doctor |
| 005-skill-packet-and-registry | 006-runtime-libraries-and-tests | Hub registers three modes; packet gone | Hub checks and canaries |
| 006-runtime-libraries-and-tests | 007-advisor-and-cross-skill-wiring | Runtime knows three loop types only | Runtime suite and validators |
| 007-advisor-and-cross-skill-wiring | 008-docs-and-readmes | Advisor routes nothing to the removed modes | Advisor suites and drift guard |
| 008-docs-and-readmes | 010-verification-and-closeout | No live doc names a removed mode | Repo-wide search |
| 009-existing-issue-fixes | 010-verification-and-closeout | Both defects fixed with tests | cite-drift and SOURCE_TAGS tests |
| 010-verification-and-closeout | 011-pre-existing-gate-failures | Baseline gate runs recorded | Phase 010 gate logs |
| 011-pre-existing-gate-failures | 012-residual-reference-sweep | Gates green, `origin/main` merged | Phase 011 gate logs |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. ADR-001 to ADR-005 in `002-removal-plan/decision-record.md` answer the earlier questions; no outside consumer was found.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: the seven `[0-9][0-9][0-9]-*/` folders
- **Graph Metadata**: `graph-metadata.json`
