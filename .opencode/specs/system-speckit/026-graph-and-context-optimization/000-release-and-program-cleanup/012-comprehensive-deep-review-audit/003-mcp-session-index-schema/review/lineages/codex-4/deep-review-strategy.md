# Deep Review Strategy

## Topic
MCP session lifecycle, incremental index, ingest, embedder management, context-server entrypoint, and tool-schema parity.

## Review Dimensions

| Dimension | Status | Notes |
|-----------|--------|-------|
| correctness | complete | Found one active P1 in governed bulk ingest propagation |
| security | complete | Path handling and session guards reviewed; same P1 carries security impact |
| traceability | complete | Found two P2 advisories in public schema parity and stale operator docs |
| maintainability | complete | No new findings; existing drift maps to schema ownership and propagation-test gaps |

## Completed Dimensions

| Dimension | Iteration | Verdict |
|-----------|-----------|---------|
| correctness | 001 | CONDITIONAL: active P1 in bulk governed ingest propagation |
| security | 001 | CONDITIONAL: active P1 can create unscoped governed rows |
| traceability | 002 | CONDITIONAL: public schema drift and stale call-shape examples |
| maintainability | 003 | CONDITIONAL: no new findings; remediation can reuse existing test seams |
| stabilization | 004 | CONDITIONAL: no new findings; legal-stop gates pass |

## Running Findings

| Severity | Active | New This Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 2 | 0 |

## What Worked

- Iteration 001: Following handler calls into `memory-save.ts` and `job-queue.ts` exposed the actual data propagation boundary.
- Iteration 002: Comparing `ListTools` definitions with runtime schemas separated the functional P1 from client-visible contract drift.
- Iteration 003: Existing tests provide seams for parity and propagation checks; no broad rewrite is required.

## What Failed

None yet.

## Exhausted Approaches

None yet.

## Ruled-Out Directions

None yet.

## Next Focus

Complete. Phase synthesis wrote `review-report.md` and `deep-review-dashboard.md` with verdict `CONDITIONAL`.

## Known Context

The target packet contains only `spec.md`; `plan.md`, `tasks.md`, `checklist.md`, and `resource-map.md` are absent in the child packet. Resource map coverage is skipped by protocol because no map existed at init.

## Cross-Reference Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| spec_code | hard | covered | Scoped files traced from spec claims through handlers, schema files, and context-server registration |
| checklist_evidence | hard | skipped | No `checklist.md` exists in the target child packet |
| feature_catalog_code | advisory | covered_with_advisory | C4-P2-003: governed ingest catalog advertises stale `dryRun` call shape |
| playbook_capability | advisory | covered_with_advisory | C4-P2-003: session bootstrap playbook advertises stale `input` / `includeGraphStatus` args |

## Files Under Review

| File | Coverage |
|------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | reviewed; active P1 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | reviewed; active P1 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | reviewed; active P2 |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/` | reviewed; active P1/P2 |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/discovery/session-bootstrap-reader-ready-context.md` | reviewed; active P2 |
| `.opencode/skills/system-spec-kit/feature_catalog/governance/governed-ingest-cancel-lifecycle.md` | reviewed; active P2 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts` | reviewed |

## Review Boundaries

- Maximum iterations: 7
- Convergence threshold: 0.10
- Rolling stop threshold: 0.08
- Minimum stabilization passes: 1
- Target files are read-only.
- Outputs are confined to this lineage artifact directory.

## Non-Goals

- No modification of reviewed implementation files.
- No review of mutation/save path slice 001 or retrieval/causal path slice 002 except where a scoped file calls shared helpers.

## Stop Conditions

- All four dimensions are covered.
- Required traceability protocols are covered or explicitly skipped as inapplicable.
- At least one stabilization pass confirms no new P0/P1 findings.
- Evidence, scope, and coverage gates pass.

## Convergence State

- Release readiness state: converged
- Final verdict preview: CONDITIONAL
- Active findings: P0=0, P1=1, P2=2
- Stop reason: all dimensions covered and stabilization pass found no new P0/P1 findings
