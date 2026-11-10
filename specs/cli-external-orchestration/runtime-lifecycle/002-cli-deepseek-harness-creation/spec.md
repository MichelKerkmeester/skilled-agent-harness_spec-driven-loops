---
title: "Feature Specification: DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi"
description: "Coordinate the phased integration of DeepSeek Harness (dsh, npm @deepseek-ai/dsh 0.2.2-rc.1) as cli-deepseek-harness, the eighth cli-external-orchestration runtime, mirroring cli-pi: a research phase, an offline contract pin, the skill packet, the .dsh/ runtime folder with route patches and generated mirrors, a deep-loop executor kind, dispatch and stress coverage, a repo-guards plugin, opt-in Code Mode MCP, hub and deep-loop routing, a keyed live pin and a governance closeout."
trigger_phrases:
  - "cli deepseek harness creation phase parent spec"
  - "cli-deepseek-harness"
  - "deepseek harness integration"
  - "dsh headless executor"
  - "eighth cli runtime"
  - ".dsh folder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation"
    last_updated_at: "2026-11-06T00:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase 001 research complete and synthesized; phases 002 to 014 scaffolded with nested goals"
    next_safe_action: "Start phase 002 offline contract pin"
    blockers: []
    key_files:
      - "goal.md"
      - "001-deep-research/research/research.md"
      - "001-deep-research/research/phase-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-cli-deepseek-harness-creation"
      parent_session_id: null
    completion_pct: 7
    open_questions:
      - "Which OpenCode Go endpoint authenticates for the harness: /inference/go/openai/v1 or /zen/go/v1?"
      - "Does the bash tool spawn after npm skipped the koffi and node-pty install scripts?"
      - "Does workspace-write confine file tools, shell, MCP and plugin effects on macOS?"
    answered_questions:
      - "Mode id is cli-deepseek-harness, binary dsh, repo folder .dsh/"
      - "Headless dispatch is dsh --profile headless --json with the prompt on stdin via a trailing dash"
      - "A relative plugin path inside a --patch file resolves next to that file, so no dsh plugin add is needed"
      - "Headless mode disables the credential store and reads the environment, then <cwd>/.env, then $DSH_HOME/.env"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation |
| **Predecessor** | `071-cli-hermes-creation` |
| **Successor** | None |
| **Handoff Criteria** | Every child passes strict validation and the parent passes `validate.sh --strict --recursive` with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
DeepSeek Harness is installed on this machine (`dsh` 0.2.2-rc.1) but the repository cannot dispatch to it. No skill packet, executor kind, runtime folder, guard plugin or routing entry exists, so a deep-loop run, a council seat or a hand-written dispatch has no governed path to the harness, and the operator's two DeepSeek V4.1 Flash routes (LLM Gateway and OpenCode Go) are reachable only through other runtimes.

### Purpose
Make `cli-deepseek-harness` a full runtime mode on par with `cli-pi`: a fail-closed skill packet, a `.dsh/` folder carrying route, lineage and guard patches plus generated skill, prompt and persona mirrors, a repo-guards plugin, opt-in Code Mode MCP, a deep-loop executor kind with stress coverage, and every cross-repo reference updated.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Headless dispatch only, through `dsh --profile headless --json` with the prompt on stdin.
- A closed roster of two routes: LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`.
- The skill packet, the `.dsh/` folder, mirror generators, the repo-guards plugin and opt-in Code Mode MCP.
- The deep-loop executor kind, dispatch-audit recognition, the stress adapter and deep-loop command support.
- Hub, advisor, compiled-routing, prompt-card and agent-table registration, plus governance docs and indexes.

### Out of Scope
- The interactive profiles (`web`, `tui`, `acp`, `sdk`), the desktop app, browser-use and computer-use. The mode is headless only.
- Optional Pi parity extras such as observational memory and PDF or video tools. No requirement names them.
- A third provider route. The roster is the two named routes.
- Reading, copying or printing any provider key. The operator enters keys.

### Files to Change
Summary for audit only. Each child's plan.md holds the detail.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/` | Create | 003 | Mode skill packet with hard rules and references |
| `.dsh/` | Create | 004, 005, 008, 009, 010 | Patches, generated mirrors, repo-guards plugin, `SYNC.md` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/` | Create | 005 | Skill, prompt and persona mirror generators |
| `.skilled/skills/system-deep-loop/runtime/` | Modify | 006, 007 | Executor kind, builder, audit, unit and stress tests |
| `.skilled/hooks/dispatch/lib/` | Modify | 007 | Dispatch recognition and rule checks |
| `.skilled/skills/cli-external-orchestration/` hub files | Modify | 011 | Mode registry, router, advisor and routing fixtures |
| `.skilled/commands/deep/assets/` | Modify | 012 | Research and review command support |
| `AGENTS.md`, `README.md`, `SECURITY.md`, indexes | Modify | 014 | Governance docs and generated indexes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | 20-iteration research across two lineages, synthesis and phase plan | Complete |
| 2 | 002-dsh-offline-contract-pin/ | Credential-free pin of version, help, patch composition and failure shape | Complete |
| 3 | 003-cli-deepseek-harness-skill-packet/ | Mode skill packet with eleven hard rules | Complete |
| 4 | 004-dsh-runtime-folder-and-patches/ | `.dsh/` with route and lineage patches and `SYNC.md` | Complete |
| 5 | 005-dsh-mirror-generators/ | Skill, prompt and persona generators with `--check` in CI | Complete |
| 6 | 006-deep-loop-executor-kind/ | Executor kind, env allowlist, builder and audit, experimental | In Progress |
| 7 | 007-dispatch-recognition-and-stress-adapter/ | Dispatch-audit recognition and stress adapter shim | In Progress |
| 8 | 008-dsh-repo-guards-safety-wave/ | Repo-guards plugin carrying the eight safety guards | In Progress |
| 9 | 009-dsh-context-guards-and-goal-bridge/ | Packet goal and session-start context, later guards | In Progress |
| 10 | 010-dsh-mcp-code-mode/ | Opt-in Code Mode MCP patch and route guard (optional) | In Progress |
| 11 | 011-hub-registration-and-routing/ | Hub, advisor, compiled routing and agent tables | In Progress |
| 12 | 012-deep-loop-modes-and-commands/ | Deep research and review support, council seat decision | In Progress |
| 13 | 013-dsh-live-contract-pin/ | Keyed live pin on both routes, gated on the operator key | Planned |
| 14 | 014-playbook-docs-and-closeout/ | Playbook, docs reconciliation, recursive strict validation | In Progress |
| 15 | 015-dsh-hook-parity/ | Hook and plugin parity with OpenCode and Pi, interactive and leaf split, hook library layout | Complete |
| 16 | 016-ci-red-check-repairs/ | Repair the five CI workflows left red: the committed private DSH prompt, the dsh-on-PATH dispatch test, playbook contract violations and two stale sk-doc baselines | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-dsh-offline-contract-pin | Synthesis and phase plan written | `research/research.md` and `research/phase-plan.md` exist |
| 002-dsh-offline-contract-pin | 003-cli-deepseek-harness-skill-packet | Help text and failure shape captured | `002/evidence/headless-help.txt` exists |
| 003-cli-deepseek-harness-skill-packet | 004-dsh-runtime-folder-and-patches | Hard rules defined | `hard-rules.json` parses with eleven rule ids |
| 004-dsh-runtime-folder-and-patches | 005-dsh-mirror-generators | Route patches compose | `--dump-config` per route shows the roster model |
| 005-dsh-mirror-generators | 006-deep-loop-executor-kind | Mirrors in sync | each generator `--check` exits 0 |
| 006-deep-loop-executor-kind | 007-dispatch-recognition-and-stress-adapter | Kind and builder tested | executor unit suites pass |
| 007-dispatch-recognition-and-stress-adapter | 008-dsh-repo-guards-safety-wave | Dispatch shapes recognized | dispatch-audit tests pass |
| 008-dsh-repo-guards-safety-wave | 009-dsh-context-guards-and-goal-bridge | Safety guards boot keyless | keyless run fails only on `MISSING_CREDENTIAL` |
| 009-dsh-context-guards-and-goal-bridge | 010-dsh-mcp-code-mode | Goal slice injected | goal-context fixture test passes |
| 010-dsh-mcp-code-mode | 011-hub-registration-and-routing | MCP opt-in only | `--dump-config` shows no MCP row without the patch |
| 011-hub-registration-and-routing | 012-deep-loop-modes-and-commands | Mode routable | `mode-registry.json` counts eight modes |
| 012-deep-loop-modes-and-commands | 013-dsh-live-contract-pin | Commands accept the kind | compiled contracts regenerate clean |
| 013-dsh-live-contract-pin | 014-playbook-docs-and-closeout | Keyed routes verified or marked | route status recorded in the packet |
| 014-playbook-docs-and-closeout | 015-dsh-hook-parity | Playbook and docs reconciled for the dsh release | repo-guards, sweep, mirror and matrix suites pass, and both keyless compositions are recorded in `015/evidence/` |
| 015-dsh-hook-parity | 016-ci-red-check-repairs | Phase 015 is Complete and the five workflows name their causes | `validate.sh` on `016-ci-red-check-repairs` prints `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which OpenCode Go endpoint authenticates for the harness? Phase 013 decides it with a keyed run.
- Does the bash tool spawn without the skipped `node-pty` install script? Phase 013 decides it.
- Does the council admit a harness seat? Phase 012 records the decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Goal**: See `goal.md` for the durable directive and the binding to each child goal
