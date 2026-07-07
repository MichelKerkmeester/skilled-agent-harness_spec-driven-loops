# Iteration 002: Security

## Focus

Reviewed trust boundaries and persistence guardrails in advisor provenance writes, feedback calibration shadow records, code-graph tombstones, and trace payload gates.

## Scorecard

- Dimensions covered: security
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

### P0, Blocker

- None.

### P1, Required

- None.

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | apply-graph-metadata-patch.ts:61-66; apply-graph-metadata-patch.ts:83-89; code-graph-db.ts:232-234 | Reviewed security guardrails are present in bounded pass. |

## Assessment

- New findings ratio: 0.0
- Dimensions addressed: security
- Novelty justification: No new security finding from reviewed trust-boundary paths.

## Ruled Out

- Automated edge overwrite of manual/trusted provenance: automated writes return without update when existing edge source_kind is protected [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:83-89].
- Graph metadata path traversal in apply mode: optional skillsRoot boundary requires `graph-metadata.json` under the trusted root [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:36-41] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:61-66].
- Default-on audit writes: code-graph tombstones require `SPECKIT_CODE_GRAPH_TOMBSTONES === 'true'` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:232-234].

## Dead Ends

- Feedback calibration record path is env-configurable, but the reducer is shadow/default-off and this pass found no direct untrusted input path into that env variable.

## Recommended Next Focus

Review parent/child traceability and maintainability claims.
Review verdict: PASS
