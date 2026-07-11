# Deep Review Iteration 008

## Dimension

Traceability: TARGET 2 ONLY - test suite gap analysis for the shipped `deriveStatus` completion-evidence fix and generated-metadata integrity enforcement paths.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28-49` - severity and evidence contract loaded before final severity calls.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166-176` - iteration artifact and state update checklist.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl:1-8` - prior review state through iteration 7.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:77-80` - scheduled iteration 8 Target 2 test-suite gap focus.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-006.md:18-48` - edge-case matrix and existing parser coverage advisory.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-007.md:32-41` - active orchestrator enforcement-flag finding and downgrade trigger.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:132-143` - REQ-001..REQ-005 acceptance criteria.
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:22-37` - parser fixture shape for implementation-summary completion pct and tasks.
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:383-439` - direct derive-status tests for numeric 100, absent pct, low pct, and open tasks.
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:496-520` - explicit frontmatter precedence and completed-style status tests.
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:766-808` - atomic writer interleaving test, not derive-only concurrency.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-232` - resolver-level report/enforced behavior for `STATUS_COMPLETE_EVIDENCE_MISMATCH`.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:235-257` - validator mismatch cases for low pct, open tasks, and genuinely complete folders.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:259-265` - non-complete stored status exclusion.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310` - flag helper default/true/1/false behavior.

## Findings by Severity

### P0

None.

### P1

#### T2-P1-003 [P1] No orchestrator-level regression test covers the explicit status-completion enforcement flag

- File: `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221`
- Claim: The existing Target 2 tests do not exercise the MCP validation orchestrator path that iteration 7 found missing `statusCompletionConsistencyEnforced`, so the real P1 end-to-end flag-wiring defect can remain green while resolver-level tests pass.
- Evidence refs: `generated-metadata-integrity.vitest.ts:221-232` verifies direct `resolveGeneratedMetadataIntegrity(report, { statusCompletionConsistencyEnforced: true })`; `generated-metadata-integrity.vitest.ts:296-310` verifies only the flag helper; the test imports at `generated-metadata-integrity.vitest.ts:7-19` include `resolveGeneratedMetadataIntegrity` and `isStatusCompletionConsistencyGateEnabled`, but no validation orchestrator entrypoint; iteration 7 shows the production orchestrator call omits the new option at `iteration-007.md:17-21` and records the active P1 at `iteration-007.md:32-41`.
- Counterevidence sought: I looked for direct test evidence in the two scoped test files that a folder-level MCP validation call passes `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true` through `validateFolder`/orchestrator and fails on `STATUS_COMPLETE_EVIDENCE_MISMATCH`; none is present in the imports or test cases in the scoped files.
- Alternative explanation: If the MCP validation orchestrator is deprecated or intentionally outside the supported validation surface, this becomes a P2 parity-test gap rather than a required release-fix test gap.
- Final severity: P1. The untested path is the same path carrying active finding `T2-P1-002`; without an end-to-end orchestrator regression test, REQ-004's explicit enforced-mode exception is not protected on that validation surface.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if maintainers confirm the orchestrator path is unreachable for supported MCP validation, or if another test file outside the two scoped files already exercises the orchestrator enforced-mode path.

### P2

#### T2-P2-001 [P2, existing active] Edge-case completion-evidence behavior lacks direct parser regression tests

- File: `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:383`
- Claim: Iteration 6's malformed pct, quoted pct, comments-only tasks, whitespace-only implementation summary, and derive-only concurrency cases remain covered only indirectly or by code reading, not by direct parser tests in the scoped suite.
- Evidence refs: `graph-metadata-schema.vitest.ts:383-439` directly covers numeric pct 100, absent pct, pct below 100, and open tasks; `graph-metadata-schema.vitest.ts:22-37` types the fixture pct as `number | null`, so it cannot produce quoted or malformed scalar values through its fixture option; `graph-metadata-schema.vitest.ts:766-808` covers interleaved graph-metadata writes, not concurrent read-only derives; iteration 6 already recorded these as an aggregate P2 at `iteration-006.md:40-48`.
- Final severity: P2. This is a minor coverage hardening gap because iteration 6 found the shipped behavior correct for these cases by direct parser/code-path review, and the suite covers the main acceptance branches.
- Confidence: 0.82.
- Downgrade trigger: Close if direct tests are added for the five edge cases, or if maintainers document the current branch-level tests as intentionally sufficient.

## Test Count Claim Check

- Count method: exact search for `^\s*(it|test)\(` in the two scoped test files.
- `graph-metadata-schema.vitest.ts` contains 32 `it(...)` cases across lines `191-766`.
- `generated-metadata-integrity.vitest.ts` contains 15 `it(...)` cases across lines `77-296`.
- Total in the two scoped files: 47 cases.
- Adjudication: a bare `108/108` targeted-suite-green claim is not traceable to these two files alone. It remains plausible only if the commit-message target suite included additional files outside this iteration's requested two-file test scope.

## Traceability Checks

- `spec_code`: CONDITIONAL. REQ-005 has direct tests for the main deriveStatus and validator branches, but the active orchestrator enforced-mode defect from iteration 7 is not pinned by an end-to-end test in the scoped files.
- `checklist_evidence`: NOT APPLICABLE. This iteration audited test coverage against spec requirements, not packet checklist completion evidence.
- `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.
- `agent_cross_runtime`: NOT APPLICABLE. No executor parity behavior was under review.
- `feature_catalog_code`: NOT APPLICABLE. No feature catalog surface was under review.
- `playbook_capability`: NOT APPLICABLE. No playbook capability claim was under review.

## SCOPE VIOLATIONS

None. Reviewed target files remained read-only; writes were limited to this review packet.

## Verdict

CONDITIONAL. The two scoped test files contain useful branch coverage for the shipped parser and resolver changes, but they do not cover the MCP orchestrator enforced-mode path behind active P1 `T2-P1-002`.

## Next Dimension

Continue with the scheduled cross-cutting capability-flag rollout wiring pass for iteration 9, including whether the missing orchestrator regression test should be paired with the code wiring fix.

Review verdict: CONDITIONAL
