# Deep Review Iteration 007

## Dimension

Security - Target 2 severity-resolution regression check for `resolveGeneratedMetadataIntegrity` and `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` rollout wiring.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28-49` - severity and evidence requirements loaded before final severity call.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:86-117` - graph metadata violation producers for parse/schema/path/fingerprint paths.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:179-233` - new `STATUS_COMPLETE_EVIDENCE_MISMATCH` producer.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:235-307` - description metadata violation producers and missing counterpart checks.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364` - severity resolution logic under grandfather and status-completion enforcement options.
- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220` - `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` default/report-mode flag helper.
- `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:78-101` - `validate.sh` bridge reads both flags and exits hard only on resolved `error` in strict mode.
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:841-891` - strict shell validation invokes the generated-metadata bridge and maps `fail` to an error.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:12-23` - orchestrator imports generated-metadata resolver and only the grandfather/drift flags.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563-568` - orchestrator calls `resolveGeneratedMetadataIntegrity` without `statusCompletionConsistencyEnforced`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:598-633` - `validateFolder` includes the orchestrator integrity entry in pass/fail accounting.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-232` - resolver-level report/enforced behavior covered for the new status-completion code.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310` - flag helper default/true/1/false behavior covered.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:132-143` - REQ-001..REQ-005 acceptance criteria, especially REQ-004 explicit enforced-mode exception.

## Findings by Severity

### P0

None.

### P1

#### T2-P1-002 [P1] MCP validation orchestrator ignores the explicit status-completion enforcement flag

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563`
- Claim: `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true` is not wired end-to-end through the MCP validation orchestrator path, so `STATUS_COMPLETE_EVIDENCE_MISMATCH` remains non-blocking there even when the operator explicitly opts into enforcement.
- Evidence: The flag helper itself is report-mode by default and returns true only for `true`/`1` at `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:218-220`. The CLI bridge correctly passes that helper into `resolveGeneratedMetadataIntegrity` at `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:82-85`, and `validate.sh` invokes that bridge at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:851-864`. The MCP orchestrator path imports only `isGeneratedMetadataDriftGateEnabled` and `isGeneratedMetadataGrandfatherEnabled` from capability flags at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:20-23`, then calls `resolveGeneratedMetadataIntegrity(report, { grandfather: isGeneratedMetadataGrandfatherEnabled() })` without `statusCompletionConsistencyEnforced` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563-568`. The resolver defaults a missing `statusCompletionConsistencyEnforced` option to `false` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:348`, so the new mismatch code is never blocking through this orchestrator entry.
- Counterevidence sought: The shell `validate.sh --strict` path was checked and is correctly wired through the bridge at `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:82-85`; resolver-level tests cover the helper and direct enforced option at `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-232` and `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310`. No orchestrator test or caller evidence was found that supplies the missing option on behalf of `validateFolder`.
- Alternative explanation: If `mcp_server/lib/validation/orchestrator.ts` is proven to be a non-shipping diagnostic surface that is never used by MCP validation or automation, this becomes a lower-priority parity cleanup rather than a release-blocking gate issue.
- Final severity: P1. This is a must-fix validation gate mismatch against REQ-004's "unless the new flag is explicitly opted into enforced mode" acceptance criterion at `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:141-143`.
- Confidence: 0.87.
- Downgrade trigger: Downgrade to P2 if maintainers confirm the orchestrator path is deprecated/unreachable and all supported validation entrypoints go through `scripts/validation/generated-metadata-integrity.ts`.

### P2

None.

## Severity-Resolution Regression Matrix

- `STATUS_NOT_IN_ENUM`: Unchanged. The code is produced only when a graph schema issue path is `derived.status` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:99-104`. `isBlockingViolation` special-cases only `STATUS_COMPLETE_EVIDENCE_MISMATCH` and otherwise returns `!opts.grandfather` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`, so this code remains governed only by the blanket grandfather flag.
- `SPEC_FOLDER_PREFIXED`: Unchanged. The code is produced for graph `spec_folder` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:107-113` and description `specFolder` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:255-261`; neither path matches the sole status-completion special case at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`.
- `SOURCE_FINGERPRINT_MISSING`: Unchanged. The code is produced when hardening/fingerprint expectations require a persisted fingerprint and none exists at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:151-156`; resolver severity still falls through to `!opts.grandfather` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`.
- `SOURCE_FINGERPRINT_MISMATCH`: Unchanged. The code is produced when the stored fingerprint differs from the re-derived current-doc fingerprint at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:160-165`; resolver severity still falls through to `!opts.grandfather` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`.
- `FILE_UNPARSEABLE`: Unchanged. The code is produced from graph JSON parse failure at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:88-93` and description JSON parse failure at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:236-242`; resolver severity still falls through to `!opts.grandfather` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`.
- `FILE_MISSING`: Unchanged. The code is produced when either generated counterpart is absent at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:291-305`; resolver severity still falls through to `!opts.grandfather` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`.
- `SCHEMA_INVALID`: Unchanged. The code is produced for non-status graph schema issues at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:99-104` and description schema issues at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:247-252`; resolver severity still falls through to `!opts.grandfather` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:349-354`.

## Traceability Checks

- `spec_code`: CONDITIONAL. The resolver-level implementation satisfies the intended split: only `STATUS_COMPLETE_EVIDENCE_MISMATCH` uses `statusCompletionConsistencyEnforced`, and the seven legacy codes remain under `!opts.grandfather`. End-to-end wiring is incomplete because the MCP orchestrator path omits the new option.
- `checklist_evidence`: N/A for this iteration. This pass audited validator severity and rollout wiring, not checklist completion evidence.
- `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before the severity decision.
- `agent_cross_runtime`: N/A. No executor parity behavior was under review.
- `feature_catalog_code`: N/A. No feature-catalog surface was under review.
- `playbook_capability`: N/A. No playbook capability claim was under review.

## SCOPE VIOLATIONS

None. Reviewed target files remained read-only; writes were limited to this review packet.

## Verdict

CONDITIONAL. The per-code resolver logic does not regress the seven legacy violation codes, but the explicit enforcement flag is not wired through the MCP orchestrator validation surface.

## Next Dimension

Iteration 8 should continue with Target 2 traceability/maintainability test-suite gap analysis, including whether an orchestrator-level enforced-mode regression test should be added.

Review verdict: CONDITIONAL
