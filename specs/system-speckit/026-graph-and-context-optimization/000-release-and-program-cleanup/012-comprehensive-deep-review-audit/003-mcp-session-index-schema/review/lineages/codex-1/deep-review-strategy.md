# Deep Review Strategy

## Topic

MCP session lifecycle, indexing, ingest, embedders, context-server entrypoint, and schema-to-handler parity.

## Review Dimensions

- [x] Correctness - iteration 002 found scoped scan cleanup mutating globally.
- [x] Security - iteration 001 found an active P0 in governed bulk indexing scope propagation.
- [x] Traceability - iteration 003 found a missing executable evidence trail for this slice.
- [x] Maintainability - iteration 004 found no additional P0/P1/P2 issues.

## Completed Dimensions

| Iteration | Dimension | Verdict | Notes |
|---|---|---|---|
| 001 | Security | FAIL | Governed metadata is accepted and validated on bulk indexing surfaces, but not carried into indexed rows. |
| 002 | Correctness | FAIL | `memory_index_scan.specFolder` scopes discovery, but stale/orphan delete maintenance still queries the whole index. |
| 003 | Traceability | FAIL | The slice declares Level 1 and P0 review requirements, but only `spec.md` exists for evidence reconciliation. |
| 004 | Maintainability | PASS_WITH_EXISTING_FINDINGS | Session/bootstrap/health/learning and embedder handlers did not add a new finding in this pass. |
| 005 | Stabilization | FAIL | No new findings; active P0 keeps release readiness blocked. |

## Running Findings

| Severity | Count |
|---|---:|
| P0 | 1 |
| P1 | 1 |
| P2 | 1 |

## What Worked

- Cross-checking Zod schemas, public tool definitions, MCP dispatch, handlers, and lower-level save wrappers exposed a handler-to-wrapper propagation gap.
- Separating runtime validation schemas from public tool definitions prevented false negatives in the schema parity pass.
- Checking scoped discovery separately from scoped cleanup exposed a side-effect boundary issue.

## What Failed

- Public tool definition parity alone was insufficient because the actual runtime validation schema accepts more fields than the JSON tool definitions advertise.
- The target review packet lacks the usual executable evidence files, so final traceability depends on this lineage's artifacts.

## Exhausted Approaches

- Treating `tool-schemas.ts` as the only source of truth for runtime inputs is exhausted; `TOOL_SCHEMAS` is the enforcement layer.
- Treating `specFolder` as only an indexing discovery filter is exhausted; the public contract says "Limit scan" and callers can reasonably expect mutation side effects to stay scoped.

## Ruled-Out Directions

- Session resume authorization mismatch is not currently a finding; explicit session IDs are checked against caller context when the transport provides one.
- The scoped scan cleanup issue is not a P0 because the stale/orphan paths delete index rows only when the backing files are already absent.
- Embedder list/set/status did not show an accepted-option drift in this pass.

## Next Focus

Synthesis complete. Fix P0-001 before release; P1-002 and P2-003 are follow-up blockers for clean release readiness.

## Known Context

- The target spec folder contains only `spec.md` at max depth 1.
- `resource-map.md not present. Skipping coverage gate`.
- Code Graph was unavailable in the session context; review uses grep and direct reads.

## Cross-Reference Status

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| spec_code | core | pass_with_findings | Spec scope loaded; listed files covered by the lineage with three active findings. |
| checklist_evidence | core | not_applicable_missing | No `checklist.md` exists in the target spec folder. |
| feature_catalog_code | overlay | pass_with_findings | Tool schema to handler parity was checked; runtime governed fields reveal P0-001 and scan scope cleanup reveals P1-002. |
| playbook_capability | overlay | not_applicable_missing | No playbook artifact exists in the target spec folder. |

## Files Under Review

| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md` | reviewed |

## Review Boundaries

- Read-only review of target implementation files and directly supporting modules.
- Outputs constrained to this lineage artifact directory.
- No code fixes are implemented during review.

## Non-Goals

- Do not modify reviewed files.
- Do not mutate the parent spec metadata.
- Do not run `resolveArtifactRoot`; artifact directory is bound from the fan-out override.

## Stop Conditions

- All four configured dimensions covered.
- Core traceability protocols either pass or are marked not applicable with evidence.
- At least one stabilization pass after full coverage.
- Active P0 findings keep final verdict at FAIL even if convergence reaches saturation.
