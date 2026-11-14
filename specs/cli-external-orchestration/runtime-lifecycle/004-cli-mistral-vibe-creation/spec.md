---
title: "Feature Specification: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode"
description: "Coordinate the phased Mistral integration: research Mistral Vibe as a runtime mode with feature parity against cli-opencode, add Mistral's DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash routes to the cli-opencode and cli-pi rosters, and add a Mistral route to DeepSeek Harness."
trigger_phrases:
  - "cli mistral vibe creation phase parent spec"
  - "cli-mistral-vibe"
  - "mistral vibe integration"
  - "mistral support"
  - "mistral subscription routes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation"
    last_updated_at: "2026-11-14T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase 002 complete; phases 001 and 003 planned"
    next_safe_action: "Scaffold children 004 to 012 from 001-deep-research/research/phase-plan.md"
    blockers:
      - "MISTRAL_API_KEY is not exported for dsh"
    key_files:
      - "002-mistral-provider-roster/evidence/probes.md"
      - "001-deep-research/research-angles.md"
      - "003-dsh-mistral-route/scratch/draft-route-mistral-deepseek.patch.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Does a turn on a Mistral route draw on the subscription pool or on pay-as-you-go?"
    answered_questions:
      - "Mistral hosts deepseek-v4-1-flash-1017 and zai-glm-5-3-flash, and both answer on OpenCode 2.3.0 and Pi 1.5.2"
      - "Mistral rejects the DeepSeek thinking field with 422 and accepts reasoning_effort"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation |
| **Predecessor** | `002-cli-deepseek-harness-creation` |
| **Successor** | None |
| **Handoff Criteria** | Every child passes strict validation and the parent passes `validate.sh --strict --recursive` with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator subscribed to Mistral, whose plan serves DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash beside Mistral's own models and its Vibe coding agent. No runtime in this repository can use any of it under governance: the cli-opencode and cli-pi rosters list no Mistral route, DeepSeek Harness's closed roster has two routes and neither is Mistral, and no mode exists for Vibe.

### Purpose
Make the Mistral subscription usable from every runtime that can reach it, and make Mistral Vibe a runtime mode carrying as much of cli-opencode's extension, hook and plugin surface as Vibe allows.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research Vibe's headless contract, configuration, hooks and fan-out fit, with a parity table against cli-opencode.
- Add Mistral's DeepSeek and GLM routes to the cli-opencode and cli-pi rosters.
- Add a Mistral DeepSeek route to DeepSeek Harness.
- Build the `cli-mistral-vibe` mode in the phases the research plan names.

### Out of Scope
- Changing any default model. DevPass stays the default on every runtime.
- Mistral's own models (Devstral, Mistral Large and others) on the existing rosters. The operator named DeepSeek and GLM.
- Reading, copying or printing a provider key into the repository. The operator enters keys.

### Files to Change
Summary for audit only. Each child's plan.md holds the detail.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/` | Modify | 002 | `mistral` roster section, provider count |
| `.skilled/skills/cli-external-orchestration/cli-pi/` | Modify | 002 | `mistral` roster section, provider count |
| `.dsh/patches/`, `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/` | Create, Modify | 003 | Mistral route patch, roster, rule and preflight |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/`, `.vibe/` | Create | 004 onward | Mode packet and runtime folder, per the research plan |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Vibe as a runtime mode, parity with cli-opencode's extensions, hooks and plugins, ranked phase plan | Complete |
| 2 | 002-mistral-provider-roster/ | Mistral DeepSeek and GLM routes on the cli-opencode and cli-pi rosters | Complete |
| 3 | 003-dsh-mistral-route/ | Third DeepSeek Harness route through Mistral | In Progress: keyed proof pending |
| 4 | 004-vibe-contract-pin/ | One keyed print-mode dispatch with an isolated `VIBE_HOME` pins the export, payload, exit, stdin and process-name contract | Planned |
| 5 | 005-cli-mistral-vibe-skill-packet/ | The `cli-mistral-vibe` mode packet: `SKILL.md`, `ROUTER.md`, `hard-rules.json`, references and prompt card | Planned |
| 6 | 006-vibe-runtime-folder-and-mirrors/ | The `.vibe/` runtime folder with a closed `allowed_models` roster, generated agent, skill and prompt mirrors and `SYNC.md` | Planned |
| 7 | 007-dispatch-recognition-and-hard-rules/ | Dispatch preflight for `vibe -p` in the shared dispatch hook library | Planned |
| 8 | 008-vibe-repo-guards/ | The 21 OpenCode plugins classified, deny-capable guards ported as strict `pre_tool` hooks, post-edit quality as a strict `post_tool` hook | Planned |
| 9 | 009-deep-loop-executor-kind/ | `cli-mistral-vibe` as a deep-loop executor kind with its adapter, env allowlist, recursion guard and exit mapping | Planned |
| 10 | 010-hub-registration-and-routing/ | Mode registry, hub router, advisor vocabulary, compiled routing and agent tables | Planned |
| 11 | 011-vibe-context-and-goal-hooks/ | A `session_start` hook carrying the packet goal slice and session context | Planned |
| 12 | 012-playbook-docs-and-closeout/ | Manual-testing playbook, cross-runtime docs, feature catalog and recursive strict validation | Planned |

Phases 004 to 012 follow `001-deep-research/research/phase-plan.md`. The handoff rows below are linear, and each child's Phase Context names its real dependencies. The ACP supervisor, the session-relaunch loop, the turn-stopping guards and sandbox mode stay deferred.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-mistral-provider-roster | Independent: the roster phase needs no research output | Phase 002 validates on its own |
| 002-mistral-provider-roster | 003-dsh-mistral-route | Mistral answers the DeepSeek id with the operator's key | `002-mistral-provider-roster/evidence/probes.md` records `OK` |
| 003-dsh-mistral-route | 004-vibe-contract-pin | Independent of the dsh route; needs `MISTRAL_API_KEY` exported | `env | grep -c MISTRAL_API_KEY` prints 1 |
| 004-vibe-contract-pin | 005-cli-mistral-vibe-skill-packet | `evidence/` holds the export, both payloads and the exit code, and research open questions 1, 3, 4 and 7 are answered | `ls 004-vibe-contract-pin/evidence/` lists the export and both payloads |
| 005-cli-mistral-vibe-skill-packet | 006-vibe-runtime-folder-and-mirrors | `hard-rules.json` parses, every rule names its check, and `validate_document.py` reports 0 issues | `node -e` JSON parse and `validate_document.py` output |
| 006-vibe-runtime-folder-and-mirrors | 007-dispatch-recognition-and-hard-rules | The config validates against the schema `vibe config schema` prints, a keyed load under `--trust` with `VIBE_STRICT_CONFIG=1` exits 0, and each generator `--check` exits 0 | Schema check, strict load and generator `--check` exit codes |
| 007-dispatch-recognition-and-hard-rules | 008-vibe-repo-guards | Each hard rule refuses its own violating command and accepts the documented shape | Dispatch hook tests pass |
| 008-vibe-repo-guards | 009-deep-loop-executor-kind | The plugin classification covers 21 of 21, each ported guard blocks a crafted violation, and the hook wire format is settled | Guard fixture runs |
| 009-deep-loop-executor-kind | 010-hub-registration-and-routing | One lineage runs a research iteration end to end, exit 3 scores partial, and executor suites pass | Executor unit and stress suite output |
| 010-hub-registration-and-routing | 011-vibe-context-and-goal-hooks | The hub routes a "delegate to vibe" prompt to the mode at both routing stages | Per-hub routing gate with the hub argument |
| 011-vibe-context-and-goal-hooks | 012-playbook-docs-and-closeout | A dispatch's first turn carries the goal slice and the fixture test passes | Hook fixture test output |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does a turn on a Mistral route draw on the subscription's shared usage pool or on pay-as-you-go? Reading the Mistral console after a run decides it.
- Is a print mode or ACP the better Vibe dispatch surface? Phase 001 decides it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
