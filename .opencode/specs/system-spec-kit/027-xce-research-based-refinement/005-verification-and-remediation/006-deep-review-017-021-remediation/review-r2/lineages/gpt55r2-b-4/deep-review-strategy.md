# Deep Review Strategy

## Topic

Audit Scope B-rest-of-002: Memory Store / Index / Lifecycle (002 non-search).

## Review Dimensions

- [x] correctness
- [x] security
- [ ] traceability
- [ ] maintainability

## Completed Dimensions

- Iteration 1: correctness/security sampled destructive write lifecycle paths; verdict CONDITIONAL due to F001.

## Running Findings

- Active P0: 0
- Active P1: 1
- Active P2: 0

## What Worked

- Iteration 1: comparing public tool/schema contract against the handler path found a destructive-mode ambiguity quickly.

## What Failed

- One-iteration cap prevented full traceability and maintainability coverage of the entire scoped 002 non-search surface.

## Exhausted Approaches

- Retention-edge orphaning checked and ruled out via shared delete primitive evidence.
- Background scan lease leak checked and ruled out via `finally` lease release evidence.

## Ruled Out Directions

None yet.

## Next Focus

- Dimension: traceability / maintainability if another iteration is run
- Files: continue through remaining 002 non-search handler/lib surfaces not fully covered by iteration 1.

## Known Context

- Scope manifest states this is a review-only pass over the 002 non-search memory store, index, and lifecycle surface.
- `resource-map.md` not present in scope folder. Skipping coverage gate.
- The supplied artifact root is bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not run.

## Cross-Reference Status

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| spec_code | core | partial | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:3-14` | One-iteration sample covered destructive write lifecycle paths, not full scoped surface. |
| checklist_evidence | core | pass | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17` | No checklist exists; no checked claims to verify. |
| feature_catalog_code | overlay | partial | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-464` | Delete contract drift found between schema prose and handler behavior. |
| playbook_capability | overlay | partial | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-128` | Destructive delete playbook should reject ambiguous mode inputs. |

## Files Under Review

| File/Pattern | Status | Notes |
|--------------|--------|-------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md` | sampled | Scope manifest. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | sampled | Memory write/index/scan handlers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/**` | sampled | Storage/index maintenance, retention. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/**` | sampled | Job store, batch processor, scan orchestration, cancellation. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/**` | queued | 002 non-search write lifecycle handlers only. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/**` | queued | 002 non-search lifecycle helpers only. |

## Review Boundaries

- Max iterations: 1
- Convergence threshold: 0.10
- Scope: read-only review of memory store/index/lifecycle code; exclude search/retrieval pipeline and 017-021 fixes.
- Writes: only under the bound lineage artifact directory.

## Non-Goals

- Do not implement fixes.
- Do not modify reviewed source files.
- Do not review the search/retrieval pipeline covered by scope A except where needed to avoid false positives.

## Stop Conditions

- Stop after one iteration because `config.maxIterations` is 1.
- Synthesize a lineage report with any confirmed findings and explicit coverage limits.
