---
title: "Feature Specification: Code Graph Decommission"
description: "Phase parent for the full decommission of the system-code-graph subsystem and the mk_code_index MCP server: research the touchpoints, ratify the decision, decouple every consumer across five runtimes and the skill tree, delete the subsystem, and verify on evidence."
trigger_phrases:
  - "code graph decommission"
  - "remove system-code-graph"
  - "mk_code_index removal"
  - "delete code graph skill"
  - "036 code graph decommission"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase parent and all fifteen child specs"
    next_safe_action: "Wire the cli-devin executor, then launch the touchpoint research fan-out into 001"
    blockers: []
    key_files:
      - "spec.md"
      - "001-touchpoint-research/spec.md"
      - "002-decommission-decision-record/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-code-graph-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Code Graph Decommission

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-code-graph |
| **Predecessor** | 035-rust-backend-rewrite |
| **Successor** | None |
| **Handoff Criteria** | Every child phase validates independently, and phase 015 closes on recorded evidence rather than assertion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` skill is not documentation — it is the live implementation of the `mk_code_index` MCP server, hosting all eight `code_graph_*` tools, a SQLite graph store, and a CLI. It is registered across five runtime surfaces, loaded by two OpenCode plugins, invoked by three per-runtime freshness hooks, a git post-commit hook, and two session reapers, called over a process boundary by `system-spec-kit`, listed as a routable node by the skill advisor, policed by a dedicated CI job, and diagnosed by its own `/doctor` route. Project doctrine additionally lists its tools as mandatory. Removing it is therefore a cross-cutting decommission, not a folder deletion — and doing it in the wrong order leaves runtimes that cannot start.

### Purpose
Retire the subsystem completely and safely: establish the true touchpoint inventory first, ratify the capability loss and its replacement routing as a decision, decouple every consumer before anything is deleted, remove the subsystem, and close on evidence that each runtime still starts.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The subsystem implementation, its MCP registrations, and its executable surface.
- Every live consumer: skills, commands, agents, plugins, hooks, CI, and lifecycle scripts.
- The project doctrine that currently mandates structural code search.
- A tombstone explaining the removal to future readers.

### Out of Scope
- Designing or building a replacement indexing engine.
- Editing archived spec packets, changelogs, or benchmark reports — they are the historical record.
- The spec-doc and saved-memory search path, which is a separate subsystem.
- **Every other graph subsystem in the repo.** Spec Memory's causal and knowledge graphs, the Skill Advisor's skill graph, and the deep-loop coverage and council graphs are unrelated and survive intact. Matching on the word "graph" rather than on the exact retiring identities is the fastest way to break three healthy subsystems while removing one.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| Runtime configs across five surfaces | Modify | 003 | Remove the MCP server registration |
| Plugins, hooks, lifecycle scripts | Delete/Modify | 004 | Sever load-time and lifecycle paths |
| `system-spec-kit` source and tests | Delete/Modify | 005, 006 | Remove the process boundary and its coverage |
| `system-skill-advisor` graph and lanes | Modify | 007 | Stop recommending the removed skill |
| Remaining skills, commands, agents | Modify | 008, 009, 010 | Clear grants, routes, and references |
| Root doctrine, READMEs, install guides | Delete/Modify | 011 | Stop mandating a removed tool |
| Launcher, CLI, CI workflow | Delete | 012 | Remove the executable and its guard |
| `.opencode/skills/system-code-graph/` | Delete | 013 | The subsystem itself |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-touchpoint-research/ | Multi-model research pass producing the cited touchpoint inventory, ordering graph, and per-consumer disposition | Complete |
| 2 | 002-decommission-decision-record/ | Ratify the capability loss, the replacement routing, the archival boundary, and the rollback procedure | Complete |
| 3 | 003-runtime-deregistration/ | Remove the MCP registration from all five runtime surfaces and the permission allowlist | Complete |
| 4 | 004-plugin-and-hook-removal/ | Delete the two plugins; clear freshness hooks, the post-commit hook, session reapers, and worktree rules | Complete |
| 5 | 005-spec-kit-runtime-decoupling/ | Remove the process boundary, shared contracts, mirrored schemas, and graph state from spec-kit source | Complete |
| 6 | 006-spec-kit-test-and-harness-cleanup/ | Retire or rewrite the spec-kit tests, stress harnesses, and matrix templates covering that coupling | Complete |
| 7 | 007-skill-advisor-decoupling/ | Remove the graph node, edges, signals, scorer lanes, and benches; rebuild the advisor | Complete |
| 8 | 008-deep-loop-and-skill-surface/ | Clear references from deep-loop, mcp-code-mode route guards, sk-doc, sk-code, and the skills index | Complete |
| 9 | 009-command-surface/ | Delete the doctor route, strip tool grants, and re-render the generated command contracts | Complete |
| 10 | 010-agent-definitions/ | Strip grants and graph-first prose from eight agents across three runtime mirrors | Complete |
| 11 | 011-doctrine-and-docs/ | Rewrite the Mandatory Tools table, search decision tree, server roster, READMEs, and install guides | Complete |
| 12 | 012-ci-and-binaries/ | Delete the launcher, CLI, bridge, their tests, the isolation CI job, and stale ignore rules | Complete |
| 13 | 013-skill-deletion-and-daemon-reap/ | Reap the daemon, release leases and sockets, remove the directory — gated on 003–012 | Complete |
| 14 | 014-historical-reference-policy/ | Leave archived history intact; add one tombstone at the track root | Complete |
| 15 | 015-verification-and-closeout/ | No-ignore sweep, suite deltas against baseline, clean starts in every runtime, metadata reconciliation | Complete |
| 16 | 016-deep-review/ | Two-lane external audit (Grok 4.5 High + DeepSeek v4 Pro, 5 iterations each, forced depth) of every touched surface | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phases 003 through 012 are decoupling; phase 013 is the only irreversible step and is gated on all of them
- Every sweep and verification command MUST use both `--hidden` and `--no-ignore`; `--no-ignore` alone still skips every dot-prefixed control file
- Archived surfaces are never edited, in any phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-touchpoint-research | 002-decommission-decision-record | Cited inventory with per-consumer recommendations exists | `research/research.md` present with findings |
| 002-decommission-decision-record | 003-runtime-deregistration | Capability loss, replacement routing, and rollback ratified | `decision-record.md` complete |
| 003-runtime-deregistration | 004-plugin-and-hook-removal | No config registers the server | No-ignore sweep of config files is empty |
| 004-plugin-and-hook-removal | 005-spec-kit-runtime-decoupling | No plugin or hook resolves into the skill | Plugin host starts with no load error |
| 005-spec-kit-runtime-decoupling | 006-spec-kit-test-and-harness-cleanup | Spec-kit source builds with no reference to the target | Build and typecheck pass |
| 006-spec-kit-test-and-harness-cleanup | 007-skill-advisor-decoupling | Spec-kit suite is green against a captured baseline | Before-and-after counts recorded |
| 007-skill-advisor-decoupling | 008-deep-loop-and-skill-surface | Advisor recommends no removed skill | Live recommendation query after rebuild |
| 008-deep-loop-and-skill-surface | 009-command-surface | No surviving skill references the subsystem | Skills-tree sweep is empty |
| 009-command-surface | 010-agent-definitions | Routes resolve and contracts are re-rendered | Route guard reports no drift |
| 010-agent-definitions | 011-doctrine-and-docs | No agent grants a removed tool in any runtime | Three-way mirror diff |
| 011-doctrine-and-docs | 012-ci-and-binaries | No doctrine mandates a removed tool | Decision tree routes to a live tool |
| 012-ci-and-binaries | 013-skill-deletion-and-daemon-reap | No binary or CI job targets the subsystem | Remaining CI green |
| 013-skill-deletion-and-daemon-reap | 014-historical-reference-policy | Directory gone; all runtimes start clean | Tree, index, and process checks empty |
| 014-historical-reference-policy | 015-verification-and-closeout | Tombstone exists; archived history unmodified | Diff over archived paths is empty |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does any consumer justify a degraded fallback instead of outright removal? Resolved in phase 002 from the research findings.
- Should structural search be reintroduced later by a different engine, or is the capability retired for good?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
