---
title: "Feature Specification: 118/005 — YAML Workflow Update (MCP → bash script)"
description: "Phase 005 of 118 FULL_ISOLATE_NO_MCP. Updates the 4 deep-* workflow YAMLs to replace mcp_tool: mcp__mk_spec_memory__deep_loop_graph_* invocations with bash calls to the deep-loop-runtime .cjs script shims authored in phase 003. Preserves every input parameter, output binding, JSONL emission, and skip condition currently attached to each call site so reducer/state-machine semantics stay byte-identical."
trigger_phrases:
  - "118 yaml workflow update"
  - "deep-loop graph mcp removal yaml"
  - "deep-review yaml bash shim"
  - "deep-research yaml bash shim"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 2 spec docs for phase 005."
    next_safe_action: "Wait for phase 004 (MCP tool surface removal) to complete; then implement YAML rewrites."
    blockers:
      - "Phase 004 must delete the 4 mcp__mk_spec_memory__deep_loop_graph_* tools first so YAMLs do not reference an unavailable surface."
      - "Phase 003 must ship convergence.cjs + upsert.cjs at .opencode/skills/deep-loop-runtime/scripts/."
    completion_pct: 5
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180051180051180051180051180051180051180051180051180051180050000"
      session_id: "118-005-yaml-workflow-update-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 118/005 — YAML Workflow Update (MCP → bash script)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (gates phase 006 + 007) |
| **Status** | Scaffolded |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Packet** | `..` (131-deep-skill-evolution/003-deep-loop-runtime) |
| **Depends On** | 003-script-shim-and-db-relocation (.cjs scripts must exist), 004-mcp-tool-surface-removal (tools deleted) |
| **Blocks** | 006-collateral-doctor-playbook, 007-test-migration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The four `spec_kit_deep-{review,research}_{auto,confirm}.yaml` workflow files invoke graph convergence and graph upsert via the `mcp_tool:` block targeting `mcp__mk_spec_memory__deep_loop_graph_convergence` and `mcp__mk_spec_memory__deep_loop_graph_upsert`. Phase 004 removes those MCP handlers and tool schema entries from the spec-kit MCP server, so any remaining YAML reference would dispatch to an unavailable tool name and fail every deep-loop run.

Phase 003 ships canonical `.cjs` script entry points (`convergence.cjs`, `upsert.cjs`) under `.opencode/skills/deep-loop-runtime/scripts/` that accept the same input arguments and return the same JSON output shape. The YAMLs must switch from `mcp_tool:` blocks to `bash:` invocations of those scripts, preserving every existing input binding, output capture, JSONL append, and skip/if-present condition.

### Purpose

Rewrite the 10 call sites across the 4 workflow YAMLs to consume the new bash shims while keeping the reducer/state-machine surface byte-equivalent. Every named output variable (`graph_decision`, `graph_signals_json`, `graph_blockers_json`, `graph_blockers_csv`, `graph_stop_blocked`, `graph_decision_json`, `graph_trace_json`, `graph_convergence_score`, `graph_nodes_json`, `graph_edges_json`, `graph_upsert_event_count`) must continue to populate from the script's stdout in the same field positions the prior MCP response provided.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite all `mcp_tool: mcp__mk_spec_memory__deep_loop_graph_convergence` blocks to `bash:` invocations of `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.
- Rewrite all `mcp_tool: mcp__mk_spec_memory__deep_loop_graph_upsert` blocks to `bash:` invocations of `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`.
- Preserve every input binding (`specFolder`, `loopType`, `sessionId`, `nodes`, `edges`) as `--spec-folder`, `--loop-type`, `--session-id`, `--nodes`, `--edges` CLI args.
- Preserve every `outputs:` block exactly as authored; the script's stdout is parsed into the same named variables.
- Preserve every `append_jsonl:` / `append_to_jsonl:` template line attached to each step.
- Preserve every `skip_conditions:` / `if_graph_events_present:` / `if_graph_events_missing:` guard.
- Preserve every `note:` field where present (helpful operator context). Edit prose only where it explicitly says "Call directly - NEVER through Code Mode" — rewrite to reflect bash invocation.
- Confirm via grep that `mcp__mk_spec_memory__deep_loop_graph` returns 0 hits across all 4 YAMLs after the implementation.

### Out of Scope

- Changing any reducer logic, state-machine transitions, JSONL schemas, or convergence math.
- Changing the script signatures (`scripts/convergence.cjs` / `scripts/upsert.cjs` interface is owned by phase 003).
- Touching any other YAML in `.opencode/commands/` outside the 4 files listed below.
- Updating `/doctor` collateral or `system-code-graph` playbook (phase 006).
- Updating test files (phase 007).
- Bumping skill versions or writing changelogs (phase 008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | 3 call sites: graph_convergence (~L430), graph_upsert (~L1015), + any helper status-check references. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | 3 call sites: graph_convergence (~L438), graph_upsert (~L937), + helper references. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | 2 call sites: graph_convergence (~L413), graph_upsert (~L869). |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | 2 call sites: graph_convergence (~L402), graph_upsert (~L723). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero `mcp__mk_spec_memory__deep_loop_graph` references remain in the 4 YAML files | `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_" <each-file>` returns 0 |
| REQ-002 | Every call site invokes the correct bash shim | `convergence.cjs` for convergence sites, `upsert.cjs` for upsert sites |
| REQ-003 | All `outputs:` blocks are preserved verbatim per call site | Diff shows zero changes to output variable names, descriptions, or order |
| REQ-004 | All `append_jsonl:` / `append_to_jsonl:` lines are preserved | Diff shows zero changes to JSONL template strings |
| REQ-005 | All input parameters survive the rewrite as CLI args | `--spec-folder`, `--loop-type`, `--session-id`, `--nodes`, `--edges` map 1:1 to `specFolder`, `loopType`, `sessionId`, `nodes`, `edges` |
| REQ-006 | YAML parses cleanly after edits | `python3 -c "import yaml; yaml.safe_load(open(...))"` exits 0 for each file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `note:` field where present is preserved or updated truthfully | If updated, prose reflects bash invocation; if preserved, still accurate |
| REQ-008 | Skip/conditional guards (`skip_conditions`, `if_graph_events_present`, `if_graph_events_missing`) are preserved | Diff shows zero structural change to guard semantics |
| REQ-009 | The 4 files are functionally equivalent under a smoke deep-loop run | One iteration of `/spec_kit:deep-review` on a sandbox spec completes without graph-step failures |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` returns 0 across all 4 YAML files.
- **SC-002**: `python3 -c "import yaml; yaml.safe_load(open('<file>'))"` exits 0 for each of the 4 YAML files.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/006-yaml-workflow-update --strict` passes.
- **SC-004**: Every output variable referenced downstream by reducer logic (e.g., `{graph_decision}`, `{graph_signals_json}`) still resolves to a value the downstream consumer can parse.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 ships `convergence.cjs` + `upsert.cjs` | Cannot rewrite YAML without target script paths | Block phase 005 implementation until 003 lands |
| Dependency | Phase 004 deletes MCP tools | Tool-name collision if YAML still references them post-removal | Land 004 first, then 005 |
| Risk | Output stdout shape mismatch | Reducer cannot parse outputs | Phase 003 contract: scripts emit identical JSON shape to MCP response |
| Risk | Implementer edits prose outside the call sites | Scope creep into 006/008 territory | Restrict edits to call-site blocks only; diff review per file |
| Risk | YAML indent regressions | Workflow parser fails silently | Run YAML safe_load smoke test per file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Bash shim invocation latency must stay within 1.5× the prior MCP-tool latency (target < 1500ms for convergence call sites on a warm DB).
- **NFR-P02**: Cold-start latency on the first convergence call per session must stay under 3 seconds.

### Reliability

- **NFR-R01**: Script invocation must surface non-zero exit codes back to the YAML runtime so the state machine can record failure (no silent swallow).
- **NFR-R02**: Output stdout must be valid JSON; any malformed output triggers a recordable workflow error rather than an undefined-variable cascade.

### Maintainability

- **NFR-M01**: Every rewritten call site stays grep-greppable by step name (`step_graph_convergence`, `step_graph_upsert`) — no rename of the surrounding step block.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **Empty graph events**: existing `skip_conditions` / `if_graph_events_missing` blocks must continue to skip the bash invocation; no `bash:` block executes when `graphEvents` is empty.
- **Large node/edge arrays**: CLI argument length on macOS shell can exceed 256 KB; ensure scripts accept `--nodes-file <path>` / `--edges-file <path>` fallback if needed (defer decision to phase 003; document in this spec for traceability).
- **Special characters in spec folder paths**: `{spec_folder}` may contain hyphens but never spaces; quote the bash arg.

### Error Scenarios

- **Script not executable**: phase 003 must `chmod +x` the .cjs files OR YAML must invoke via `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs ...` (preferred — matches the example pattern in the parent prompt).
- **DB locked**: existing reducer error path catches non-zero exit; YAML need not add new guard.
- **Malformed JSON stdout**: YAML outputs block sees missing keys; reducer treats as graph-unavailable.

### Concurrent Operations

- **Parallel review + research runs**: each script invocation acquires its own DB connection via the runtime's lease pattern (owned by phase 003); YAML rewrite makes no additional guarantees.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the bash invocation use `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` or `./convergence.cjs` (shebang)? **Decision: `node ...` form — matches the example block in the parent dispatch and avoids relying on shebang/executable bit semantics across runtimes.**
- Should we pass JSON arrays as inline args or as files for the upsert call? **Decision: inline for now; revisit if real workloads exceed 256 KB stdin/argv limits. Phase 003 may add `--nodes-file` later if needed.**
- Should `note:` strings be rewritten to reflect bash invocation, or left as-is? **Decision: rewrite where current prose says "Call directly - NEVER through Code Mode" (no longer applicable); leave operator-meaningful context intact.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 YAML files, ~10 call sites, in-place edit only — no new files |
| Risk | 12/25 | Workflow runner consumes outputs in reducer logic; output-shape regressions silently corrupt convergence decisions until smoke run catches them |
| Research | 6/20 | Script CLI contract is owned by phase 003; this phase only mirrors the surface — minimal investigation needed beyond confirming line numbers post-edit |
| **Total** | **26/70** | **Level 2** (mechanical interface swap with output-shape sensitivity) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md`
- **Phase 003 (script contract source)**: `../003-script-shim-and-db-relocation/spec.md`
- **Phase 004 (MCP removal predecessor)**: `../004-mcp-tool-surface-removal/spec.md`
<!-- /ANCHOR:related-docs -->
