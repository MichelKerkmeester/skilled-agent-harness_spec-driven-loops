---
title: "Implementation Plan: CLI Devin Code Graph Hook"
description: "Phase A research is complete; Phase B synthesizes docs; Phase C implements the mk-code-graph rename and Devin SessionStart hook; Phase D verifies; Phase E checks cross-packet integration."
trigger_phrases:
  - "cli-devin"
  - "code-graph"
  - "phase b"
  - "code graph plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/018-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T17:35:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "plan.md"
      - "decision-record.md"
      - "tasks.md"
      - "resource-map.md"
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Phase A findings F001-F010 incorporated into implementation plan."
---

# Implementation Plan: CLI Devin Code Graph Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase A produced 10 code-graph findings across Devin SessionStart compatibility, hook source ownership, startup payload contract, freshness handling, plugin/bridge rename, naming asymmetry, post-extraction audit, and doc gaps. The implementation plan is intentionally conservative: add Devin where the current hook system already builds and loads hooks, instead of migrating source for symmetry.

Phase B synthesizes those findings into accepted ADRs, a task list, checklist, and resource map. It does not implement source/config changes. The research directory remains frozen.

Phase C belongs to cli-opencode + deepseek-v4-pro. Phase D verifies with strict validation, typecheck, vitest, DQI, MCP boot smoke, 5-runtime SessionStart parity, and live Devin `/hooks`. Phase E reconciles `.devin/hooks.v1.json` with packet 025 so both hooks coexist.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Phase | Command or Evidence | Pass Condition |
|------|-------|---------------------|----------------|
| Spec strict validation | B, D, E | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | Exit 0; frozen research warnings recorded as issues if validator refuses clean output. |
| sk-code typecheck | D | `tsc --noEmit` over hook/build surfaces | Exit 0. |
| Vitest scoped tests | D | `vitest run` on touched code-graph/session-start tests | Exit 0. |
| Runtime parity | D | 5-runtime SessionStart fixture | Structural-context block equivalent. |
| MCP boot smoke | D | Code-graph MCP server boot plus public tool smoke | 10 public tools respond. |
| sk-doc DQI | D | sk-doc DQI scorer over touched docs | DQI >= 4.0 each. |
| Devin live smoke | D | `/hooks` and startup smoke | Devin lists hook and emits/fail-opens startup brief. |
| Grep cleanup | D | Case-insensitive grep excluding history | No current legacy plugin/bridge refs. |
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```text
Devin SessionStart
  |
  v
.devin/hooks.v1.json
  |
  v
bash -c 'cd "${DEVIN_PROJECT_DIR}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js'
  |
  v
.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts
  |
  v
getStartupBriefFromMarker()
  |
  +--> kind=startup
  +--> provenance
  +--> sectionKeys=[structural-context]
  +--> stale warning without inline refresh

OpenCode plugin rename
  |
  v
.opencode/plugins/mk-code-graph.js
  |
  v
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs
  |
  v
mk-code-index MCP server (stable)
```
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Owner | Entry Criteria | Work | Exit Criteria |
|-------|-------|----------------|------|---------------|
| Phase A - Research | cli-devin SWE-1.6 | Phase 0 scaffold exists. | 10 iterations over Q1-Q10. | `research/research.md` and `findings.json` complete. DONE. |
| Phase B - Synthesis | cli-codex | Phase A complete. | Update packet docs and create `resource-map.md`. | Docs ready for implementation; validation issues recorded. CURRENT. |
| Phase C - Implementation | cli-opencode + deepseek-v4-pro | Phase B docs accepted. | Rename plugin/bridge, add Devin hook in system-spec-kit, update docs/tests/config. | Scoped implementation present; no commits. |
| Phase D - Verification | cli-codex | Phase C returns changes. | Run typecheck, vitest, MCP smoke, DQI, strict validate, `/hooks`, grep cleanup. | Checklist evidence filled. |
| Phase E - Integration | cli-codex | Both packets verified. | Reconcile shared `.devin/hooks.v1.json`, cross-packet smoke. | Ready for final completion summary. |
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. **5-runtime parity smoke**: Exercise Claude, Gemini, Codex, OpenCode, and Devin SessionStart variants with the same readiness marker fixture. Assert the structural-context block and startup metadata match.
2. **Live Devin `/hooks` test**: Verify Devin lists the explicit SessionStart entry and record whether inherited Claude SessionStart also fires.
3. **MCP server boot smoke**: Start code-graph MCP server and verify the 10 public tools across `code_graph_*`, `detect_changes`, `ccc_*`, and `code_graph_apply` surfaces.
4. **Plugin/bridge smoke**: Cold-start OpenCode plugin loading after `mk-code-graph` rename and run bridge tests.
5. **Doc validation**: Rescore touched code-graph docs with sk-doc DQI target >= 4.0.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase A cli-devin research is complete and verified by `research/findings.json`.
- `.devin` binary auth was verified in the approved plan; Phase C must not self-invoke cli-devin from inside Devin.
- cli-opencode with `deepseek/deepseek-v4-pro` or `deepseek-v4-pro-max` must be available for Phase C dispatch.
- `main` is the baseline branch; no Phase B branch or commit is created.
- `.devin/hooks.v1.json` is a shared final merge file with packet 025.
- `.devin/config.json` must keep or explicitly evaluate `read_config_from.claude=true`.
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

For uncommitted work, revert only Phase C scoped paths from `main`:

```bash
git checkout main -- .opencode/plugins/mk-code-graph.js
git checkout main -- .opencode/plugins/spec-kit-compact-code-graph.js
git checkout main -- .opencode/skills/system-code-graph
git checkout main -- .opencode/skills/system-spec-kit/mcp_server/hooks/devin
git checkout main -- .devin/hooks.v1.json .devin/config.json
```

If a worktree branch is auto-created, switch back to `main`, remove the worktree with `git worktree remove <path>`, and delete the orphan branch only after wanted changes are preserved or intentionally discarded.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase A research
  -> Phase B spec synthesis
    -> Phase C implementation
      -> Phase D verification
        -> Phase E cross-packet integration
```

Packets 025 and 036 are independent until the shared `.devin/hooks.v1.json` final merge. No cycle exists. The code-graph packet must not wait on advisor implementation except for final hooks JSON reconciliation.
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Notes |
|-------|----------|-------|
| Phase A | Complete | 10 iterations already done. |
| Phase B | 45-75 minutes | Docs, ADRs, resource map, strict validation. |
| Phase C | 2-4 hours | Rename, bridge rename, Devin hook, config, tests/docs. |
| Phase D | 60-120 minutes | Typecheck, vitest, DQI, MCP boot, Devin smoke, grep cleanup. |
| Phase E | 30-60 minutes | Shared hooks JSON reconciliation and final validation. |
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record baseline SHA before Phase C:

```bash
BASELINE_SHA=$(git rev-parse HEAD)
```

Atomic rollback per packet can reset only scoped Phase C paths:

```bash
git checkout "$BASELINE_SHA" -- .opencode/plugins .opencode/skills/system-code-graph .opencode/skills/system-spec-kit/mcp_server/hooks/devin .devin/hooks.v1.json .devin/config.json
```

Do not reset the repository globally. Preserve unrelated user changes and packet 025 changes unless the shared hooks file must be reverted as one merge unit.
<!-- /ANCHOR:enhanced-rollback -->

---
<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION

| Phase | Executor | Invariants |
|-------|----------|------------|
| A | cli-devin SWE-1.6 | Complete; research frozen. |
| B | cli-codex | No SpawnAgent, no source/config writes outside packet docs. |
| C | cli-opencode + deepseek-v4-pro | Worktree-isolated implementation, no commits, no source migration to `system-code-graph/hooks/`. |
| D | cli-codex | Verify before completion claims; fill checklist evidence only after commands run. |
| E | cli-codex | Merge packet 025 and 036 registrations and reconcile final docs. |
<!-- /ANCHOR:ai-execution -->

---
<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

High-level data flow:

```text
Devin session starts
  -> SessionStart hook command
  -> system-spec-kit hook wrapper
  -> code-graph boundary
  -> readiness marker startup brief
  -> structural context in model startup
```

The plugin path stays separate:

```text
OpenCode loads mk-code-graph plugin
  -> plugin launches mk-code-graph bridge
  -> bridge starts mk-code-index MCP server
  -> code-graph tools keep stable names
```
<!-- /ANCHOR:architecture-overview -->

---
<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Finding | Mitigation | Verification |
|------|---------|------------|--------------|
| Devin SessionStart uncertain | F001/Q1 | Explicit variant + inherited safety net. | `/hooks` and startup smoke. |
| Hook migration too risky | F002/Q2 | Keep source in system-spec-kit. | Path review. |
| Startup contract drift | F004/Q4 | Assert `kind=startup`, provenance, section keys. | Parity vitest. |
| Stale handling too heavy | F005/Q5 | Warn only; recommend scan. | Source/test review. |
| Plugin rename cache break | F006/Q6 | Atomic current-ref rename and cold-start smoke. | Plugin load smoke. |
| MCP name confusion | F008/Q8 | Document asymmetry. | Doc review. |
| Doc quality gap | F010/Q10 | Update docs and rescore. | DQI >= 4.0. |
<!-- /ANCHOR:risk-mitigation -->

---
<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
F001/Q1 + F003/Q3
  -> ADR-003
  -> T2.1 Devin hook
  -> T3.1/T3.2 parity tests

F002/Q2
  -> ADR-001
  -> T2.1 path choice

F006/Q6 + F007/Q7
  -> plugin/bridge rename tasks

F008/Q8
  -> ADR-002
  -> docs update tasks
```
<!-- /ANCHOR:dependency-graph -->

---
<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Rename plugin and bridge first so tests/docs target final names.
2. Add Devin hook source under `system-spec-kit/mcp_server/hooks/devin/`.
3. Merge `.devin/hooks.v1.json` with packet 025.
4. Add startup parity tests.
5. Update docs and DQI.
6. Run verification and fill checklist.
<!-- /ANCHOR:critical-path -->

---
<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1: Phase B synthesized | Updated spec docs and `resource-map.md`. |
| M2: Rename complete | Grep cleanup and bridge tests. |
| M3: Devin hook live | `/hooks` listing and startup smoke. |
| M4: Quality gates green | Typecheck, vitest, DQI, strict validate. |
| M5: Cross-packet ready | Shared `.devin/hooks.v1.json` contains advisor and code-graph hooks. |
<!-- /ANCHOR:milestones -->

---
## RELATED DOCUMENTS

- `spec.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `resource-map.md`
- `research/research.md`
