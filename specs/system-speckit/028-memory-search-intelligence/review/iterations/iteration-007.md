# Iteration 007

## Dimension

Traceability: `ENV_REFERENCE.md` feature-flag and operational-variable claims against their runtime read sites.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:121-130,162-167,217-218,433,470-504`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2050-2058`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:340-360`
- `.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:95-100`
- `.opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh:56-62`
- `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh:65,146-164`

## Findings by Severity

### P0

None.

### P1

#### R7-P1-001: Archived vector inclusion has conflicting documented defaults

- File: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:122`
- Claim: The reference identifies `SPECKIT_INCLUDE_ARCHIVED_VECTOR` as graduated ON, but the startup path describes the same flag as opt-in and default-off.
- Evidence: `ENV_REFERENCE.md:122` says the vector inclusion flag is ON and uses a graduated kill-switch; `context-server.ts:2050-2052` calls the behavior opt-in/default-off and self-gated.
- Counterevidence sought: The implementation paths for orphan sweep budgets, graduated enforcement flags, evaluation logging, and consumption logging were checked for comparable default mismatches; the reviewed reads agree with their corresponding reference rows.
- Alternative explanation: The startup comment could be stale rather than the reference row. Either way, one of the two operator-facing contracts is false, leaving unset-variable behavior ambiguous.
- Finding class: instance-only
- Scope proof: Exact search located the conflicting `SPECKIT_INCLUDE_ARCHIVED_VECTOR` references; this finding makes no claim about other archive flags.
- Recommendation: Reconcile the feature-table row and the startup-path contract against the flag evaluator, then retain one explicit unset-default statement.
- Final severity: P1
- Confidence: 0.90
- Downgrade trigger: Direct evaluation of the flag resolver demonstrates default-on behavior and the startup comment is corrected as stale in the same change.

### P2

None.

## Traceability Checks

- `spec_code`: FAIL for the archived-vector default claim; the documentation and runtime startup contract conflict.
- `checklist_evidence`: NOT_APPLICABLE; this code-folder reference slice has no delivery checklist that governs its claims.
- `skill_agent`: PASS; narrative, evidence citations, and severity handling follow the loaded deep-review and review-core contracts.
- `agent_cross_runtime`: NOT_APPLICABLE; no runtime-agent artifact produces a claim in this slice.
- `feature_catalog_code`: NOT_APPLICABLE; no feature catalog is in scope.
- `playbook_capability`: NOT_APPLICABLE; no manual-testing playbook is in scope.

## Scope Violations

None. The contradiction requires a documentation or comment correction outside the permitted review-artifact paths; no reviewed file was modified.

## Verdict

CONDITIONAL. The environment-variable reference needs one required default-semantics correction before its archive-vector guidance is trustworthy.

## Next Dimension

Maintainability: system-spec-kit skill and reference alignment for the touched drift-marker and generated-metadata surfaces.

Review verdict: CONDITIONAL
