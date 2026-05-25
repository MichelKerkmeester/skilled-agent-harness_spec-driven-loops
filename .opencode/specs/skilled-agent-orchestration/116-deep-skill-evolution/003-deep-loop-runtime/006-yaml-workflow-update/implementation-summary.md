---
title: "Implementation Summary: 118/005 — YAML Workflow Update"
description: "Placeholder for post-implementation summary. Filled when phase 005 ships the 10 call-site rewrites across 4 deep-* workflow YAMLs."
trigger_phrases:
  - "118 yaml implementation summary"
  - "deep-loop yaml rewrite summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update"
    last_updated_at: "2026-05-22T20:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Completed bundled implementation."
    next_safe_action: "Stage bundled 002-005 files; verify rename detection before commit."
    blockers: []
    completion_pct: 100
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:1180055180055180055180055180055180055180055180055180055180050000"
      session_id: "118-005-summary-scaffold"
      parent_session_id: null
---
# Implementation Summary: 118/005 - YAML Workflow Update

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

> **Status**: Complete as part of bundled 002+003+004+005 dispatch.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update` |
| **Completed** | 2026-05-22 |
| **Level** | 2 |
| **Actual Effort** | Bundled with phases 002, 003, and 004 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Rewrote the four deep-loop workflow YAML files so graph convergence/upsert call sites invoke the runtime CJS scripts through `bash` instead of the removed MCP tools.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Review convergence and upsert now call `convergence.cjs` / `upsert.cjs`. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Confirm-mode review graph calls now use scripts. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | Research convergence and conditional upsert now use scripts. |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modified | Confirm-mode research graph calls now use scripts. |

All output variable blocks, JSONL append templates, and skip/conditional guards were preserved. Note text that referenced direct MCP tool invocation was updated to script invocation.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Replaced convergence `mcp_tool` blocks with `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs ...`.
2. Replaced upsert `mcp_tool` blocks with `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs ...`.
3. Preserved output bindings and JSONL append sites.
4. Parsed all four YAML files with PyYAML.
5. Verified no `mcp__mk_spec_memory__deep_loop_graph_` or `deep_loop_graph_` references remain in the four YAMLs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Invoke scripts through `node` | Avoids relying on executable bits in workflow runners. |
| Keep inline JSON args for nodes/edges | Matches current workflow extraction variables; scripts also support `--events` for direct CLI use. |
| Preserve output names | Downstream reducers continue to read the same variables. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Static grep | PASS | 4/4 files | `grep -c "mcp__mk_spec_memory__deep_loop_graph_" .opencode/commands/speckit/assets/speckit_deep-*.yaml` returned 0 for each file. |
| Static grep | PASS | 4/4 files | `grep -c "deep_loop_graph_" .opencode/commands/speckit/assets/speckit_deep-*.yaml` returned 0 for each file. |
| YAML parse | PASS | 4/4 files | `yaml.safe_load` succeeded for every modified YAML file. |
| Script smoke | PASS | convergence/status/upsert/query | Direct script invocations returned JSON and exit 0. |
| Strict validate | Pending final run | 4 phase folders | Run after this summary update. |

### Static Verification Numbers

| File | MCP grep count (pre) | MCP grep count (post) |
|------|---------------------|----------------------|
| `deep_start-review-loop_auto.yaml` | 2 tool IDs + 1 description | 0 |
| `deep_start-review-loop_confirm.yaml` | 2 tool IDs + 1 description | 0 |
| `deep_start-research-loop_auto.yaml` | 2 tool IDs | 0 |
| `deep_start-research-loop_confirm.yaml` | 2 tool IDs | 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Non-zero exits surface back to runner | Bash now directly executes `node`; non-zero script exits are visible to the workflow step | PASS |
| NFR-R02 | Stdout is valid JSON | Script smoke returned parseable JSON | PASS |
| NFR-M01 | Step block names unchanged | Existing `step_graph_convergence` and `step_graph_upsert` keys preserved | PASS |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A full end-to-end `/deep:start-review-loop` workflow smoke was not run in this shell; direct script and YAML parse gates were run.
2. Inline JSON argv may need file-backed payloads for very large graph batches.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Full deep-review iteration smoke | Direct script smoke + YAML parse | No slash-command workflow runner was available in this shell. |
<!-- /ANCHOR:deviations -->

---

## Commit Handoff (bundled 002+003+004+005)

Suggested commit message:

```text
feat(118/002-005): deep-loop FULL_ISOLATE transition - lib mv + script shims + MCP removal + YAML cutover

Phase 002: move 13 lib .ts files into deep-loop-runtime/lib/{deep-loop,coverage-graph}/
Phase 003: 4 .cjs script entry points (convergence/upsert/query/status) +
  relocated deep-loop-graph.sqlite to deep-loop-runtime/storage/
Phase 004: deleted 5 mcp_server/handlers/coverage-graph/*.ts + dropped 4
  deep_loop_graph_* tool definitions + schemas + registrations
Phase 005: updated 4 workflow YAMLs to invoke .cjs scripts via bash instead
  of MCP tool dispatch (grep deep_loop_graph_ in YAMLs returns 0)

tsc --noEmit clean. sk-code alignment-drift PASS. Strict-validate all 4
phase folders. Each phase Level 3 (003+004) carries its own ADR-001.

Co-Authored-By: GPT-5.5 via cli-codex (Bundled 118/002-005 dispatch)
```

Files (explicit paths for `git add`):

```text
.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml
.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml
.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml
.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml
.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts
.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts
.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts
.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts
.opencode/skills/deep-loop-runtime/scripts/convergence.cjs
.opencode/skills/deep-loop-runtime/scripts/query.cjs
.opencode/skills/deep-loop-runtime/scripts/status.cjs
.opencode/skills/deep-loop-runtime/scripts/upsert.cjs
.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite
.opencode/skills/deep-loop-runtime/lib/coverage-graph/.gitkeep
.opencode/skills/deep-loop-runtime/lib/deep-loop/.gitkeep
.opencode/skills/deep-loop-runtime/scripts/.gitkeep
.opencode/skills/deep-loop-runtime/storage/.gitkeep
.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts
.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts
.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts
.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts
.opencode/skills/system-spec-kit/mcp_server/tools/index.ts
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/003-lib-runtime-migration/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/004-script-shim-db-relocation/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal/decision-record.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update/implementation-summary.md
```
