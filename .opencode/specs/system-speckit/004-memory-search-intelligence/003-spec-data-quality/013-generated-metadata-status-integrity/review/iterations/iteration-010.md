# Deep Review Iteration 010

## Dimension

Adversarial wrap-up - both targets. This pass re-read the prior iteration narratives, the findings registry, and the source evidence for every active P1 finding. No new ground was opened except a narrow test-tree search for the downgrade trigger on `T2-P1-003`.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28-49` - severity and evidence contract.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166-176` - iteration artifact contract.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:357-383` - claim-adjudication packet contract.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl:1-10` - prior state through iteration 9.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-findings-registry.json:9-212` - active findings registry.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:21-24` - target statements.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-001.md:34-67` - Target 1 root-cause finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-002.md:45-59` - Target 1 determinism finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-003.md:31-55` - Target 1 blast-radius finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-004.md:49-81` - Target 1 minimal-fix and repair findings.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-005.md:30-58` - Target 2 requirement-by-requirement finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-006.md:18-48` - Target 2 edge-case advisory.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-007.md:32-41` - Target 2 orchestrator flag-wiring finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-008.md:33-42` - Target 2 orchestrator regression-test finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-009.md:64-79` - cross-target coupling and coverage-gap check.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046-1062` - append mode sets `FEATURE_DIR` to the existing parent.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310-1317` - parent `description.json` generator call.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351-1357` - separate child `description.json` generator call.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77-90` - generated `specFolder` and `parentChain` construction.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108` - generated description persistence call.
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:38-51` - phase-parent classification from direct child folders.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3` - basename-only tracked `specFolder`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20` - empty tracked `parentChain`.
- `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3` - basename-only legacy-root `specFolder`.
- `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20` - empty legacy-root `parentChain`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41-66` - affected packet is parent-level.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:132-143` - REQ-001 through REQ-005.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1185-1195` - explicit status precedence.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1215-1239` - patched no-checklist completion-evidence fallback.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1280` - completion_pct and task parsing helpers.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:179-233` - status/completion mismatch producer.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364` - status-completion enforcement resolver.
- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220` - default-off status-completion gate helper.
- `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:81-85` - shell validation bridge passes the new option.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:12-23` - orchestrator imports only grandfather/drift flag helpers.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563-568` - orchestrator omits `statusCompletionConsistencyEnforced`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:598-633` - folder validation includes the generated-metadata integrity entry.
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:383-439` - main deriveStatus completion-evidence tests.
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:496-520` - explicit-status precedence tests.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:7-19` - scoped test imports exclude the orchestrator.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-232` - resolver-level report/enforced test.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310` - flag helper tests.
- `grep:mcp_server/tests/*.ts:validateFolder|statusCompletionConsistencyEnforced|SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` - only direct resolver option occurrence found at `generated-metadata-integrity.vitest.ts:231`.

## Findings by Severity

### P0

None.

### P1

#### T1-P1-001 [P1] Append-mode phase scaffolding overwrites an existing parent packet's `description.json`

- claim: In append mode, `create.sh --phase --phase-parent <existing-parent>` rebinds `FEATURE_DIR` to the existing parent and still invokes the parent description generator with the append request's description, so the parent `description.json` identity and description fields are overwritten.
- evidenceRefs: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046-1062`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310-1317`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77-90`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108`.
- counterevidenceSought: Re-read the child generation path and confirmed it passes `_child_path`, not the parent, at `create.sh:1351-1357`. Re-read the append-mode branch and found no guard around the parent generator block.
- alternativeExplanation: A separate metadata repair process could also rewrite parent metadata, but the reviewed code still contains a direct parent write path that explains the reported corruption without another process.
- finalSeverity: P1.
- confidence: 0.97.
- downgradeTrigger: Downgrade only if a runtime wrapper outside these files consistently prevents the parent generator block from running in append mode, or if deployments omit the built description generator so the write cannot occur.

#### T1-P1-002 [P1] Existing phase-parent metadata is already stored under basename-only identity in both metadata roots

- claim: The `system-speckit/004-memory-search-intelligence/001-speckit-memory` phase parent currently has `description.json.specFolder` collapsed to `001-speckit-memory` and `parentChain` set to `[]` in both mirrored metadata roots.
- evidenceRefs: `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20`, `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3`, `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41-66`.
- counterevidenceSought: Re-read the parent `spec.md` and confirmed the authored packet is a parent-level phase parent, not a child phase whose basename-only identity would be expected. Prior scan evidence classified 4918 description files and found two physical files representing one logical high-confidence packet.
- alternativeExplanation: The duplicate roots may be an intentional mirror, but mirroring does not make the basename-only `specFolder` or empty `parentChain` correct for the logical packet path.
- finalSeverity: P1.
- confidence: 0.91.
- downgradeTrigger: Downgrade only if both metadata roots are proven unreachable by every active metadata scanner/indexer, or if the runtime contract is changed to ignore `description.json.specFolder` and `parentChain` entirely.

#### T1-P1-003 [P1] Already-corrupted phase-parent metadata needs a scoped dry-run repair pass after the writer fix

- claim: The minimal code fix prevents future parent overwrites, but it cannot repair the already-persisted `001-speckit-memory` basename-only metadata; a separate scoped, dry-run-first repair is required.
- evidenceRefs: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-003.md:31-55`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20`, `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:38-51`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310-1317`.
- counterevidenceSought: Re-read the proposed minimal fix boundary and phase-parent classifier. Skipping the parent generator in append mode leaves child creation and direct-child phase-parent classification intact, but no reviewed code path rewrites the already-bad metadata.
- alternativeExplanation: A broader metadata migration might already be planned elsewhere, but no evidence in this review packet shows it will run before or with the writer fix.
- finalSeverity: P1.
- confidence: 0.86.
- downgradeTrigger: Downgrade if an already-approved repair workflow is confirmed to regenerate the affected logical packet before the writer fix ships, or if both mirrored files are proven non-indexed and operationally unreachable.

#### T2-P1-001 [P1] Explicit complete statuses bypass the new completion-evidence gate

- claim: `deriveStatus` can still return `complete` without `completion_pct >= 100` and without checking open tasks because explicit normalized statuses are returned before the patched no-checklist fallback runs.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1185-1195`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1215-1239`, `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:510-520`, `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:132-143`.
- counterevidenceSought: Re-read the patched fallback and validator. The fallback is correctly gated when reached, and the validator can report persisted mismatches, but neither prevents the earlier frontmatter/table status branch from returning `complete`.
- alternativeExplanation: Maintainers may intend explicit `status: Done` as authoritative completion evidence. That is not the current phase contract because REQ-001, REQ-002, and REQ-005 name `completion_pct` and open task state as the evidence gate.
- finalSeverity: P1.
- confidence: 0.86.
- downgradeTrigger: Downgrade if the spec is amended to define explicit complete-like status frontmatter as sufficient evidence, or if `deriveStatus` gates complete-like explicit statuses through the same completion evidence check.

#### T2-P1-002 [P1] MCP validation orchestrator ignores the explicit status-completion enforcement flag

- claim: `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true` is not wired through the MCP validation orchestrator, so `STATUS_COMPLETE_EVIDENCE_MISMATCH` remains non-blocking there even when explicitly enforced.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts:193-220`, `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts:81-85`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:12-23`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563-568`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts:323-364`, `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md:141-143`.
- counterevidenceSought: Re-read the shell bridge and confirmed it passes `statusCompletionConsistencyEnforced`; re-read orchestrator imports and call site and found only `grandfather` is passed to the resolver. The resolver defaults an absent status-completion option to false.
- alternativeExplanation: If `mcp_server/lib/validation/orchestrator.ts` is deprecated or unreachable for supported MCP validation, this becomes lower-priority parity cleanup rather than a release gate mismatch.
- finalSeverity: P1.
- confidence: 0.88.
- downgradeTrigger: Downgrade to P2 if maintainers confirm the orchestrator path is deprecated/unreachable and all supported validation entrypoints go through `scripts/validation/generated-metadata-integrity.ts`.

#### T2-P1-003 [P1] No orchestrator-level regression test covers the explicit status-completion enforcement flag

- claim: The existing tests cover resolver-level enforced mode and the flag helper, but not the MCP validation orchestrator path that omits `statusCompletionConsistencyEnforced`.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:7-19`, `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:221-232`, `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:296-310`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563-568`, `grep:mcp_server/tests/*.ts:validateFolder|statusCompletionConsistencyEnforced|SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`.
- counterevidenceSought: Ran a narrow test-tree search for `validateFolder`, `statusCompletionConsistencyEnforced`, and `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`; the only occurrence was the direct resolver option in `generated-metadata-integrity.vitest.ts:231`, not an orchestrator-level test.
- alternativeExplanation: If orchestrator validation is not a supported shipping path, then the missing end-to-end test is only parity hardening.
- finalSeverity: P1.
- confidence: 0.90.
- downgradeTrigger: Downgrade to P2 if the orchestrator path is confirmed unsupported or if a future test directly exercises `validateFolder`/orchestrator with the env flag enabled and a status/completion mismatch fixture.

### P2

#### T2-P2-001 [P2] Edge-case completion-evidence behavior lacks direct parser regression tests

- claim: The parser behavior for malformed pct, quoted pct, comments-only tasks, whitespace-only implementation summary, and derive-only concurrency is supported by code reading but not pinned directly in parser tests.
- evidenceRefs: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-006.md:18-48`, `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-008.md:46-53`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1262-1280`, `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:383-439`.
- finalSeverity: P2.
- confidence: 0.82.
- downgradeTrigger: Close if direct tests are added or maintainers explicitly accept the current branch-level coverage as sufficient.

## Adversarial Verdicts

- Target 1 deterministic bug verdict: CONFIRMED. For every successful append-mode invocation with an existing parent, non-empty feature description, present dist generator, and successful node execution, the current code reaches the parent `description.json` writer with `FEATURE_DIR` set to the existing parent.
- Target 1 affected-packet count: CONFIRMED current blast radius is 1 logical packet represented by 2 physical files, from the prior path-aware scan. Future blast radius is per append invocation against any existing phase parent until the parent-generation guard lands.
- Target 1 proposed fix verdict: CORRECT AND MINIMAL. Guarding the parent generation call when `APPEND_TO_EXISTING_PARENT=true` addresses the wrong-target write while preserving new-parent scaffolding and child `description.json` generation. A separate dry-run repair pass remains required for already-corrupted metadata.
- Target 2 correctness-gap verdict: CONDITIONAL. The shipped fallback and validator are real improvements, but three genuine P1 gaps remain: explicit complete-like status bypass, missing MCP orchestrator flag wiring, and missing orchestrator-level enforced-mode regression coverage.
- Target 2 P2-only gaps: Parser edge-case direct tests for malformed/quoted pct, comments-only tasks, whitespace-only summaries, and derive-only concurrency are useful but advisory because the code-path review found the shipped behavior correct for those cases.
- Target 2 non-issues: The no-checklist fallback gates `complete` on `completion_pct >= 100` and no open tasks when reached; null/malformed pct through that fallback does not become fresh complete; the mismatch producer exists; resolver-level report/enforced behavior works; the flag helper name/defaults are correct; the shell validation bridge passes the flag; the seven legacy violation codes remain governed by the blanket grandfather path; no Target 1/Target 2 cross-coupling was found.

## Traceability Checks

- `spec_code`: CONDITIONAL. Target 1 code path and Target 2 code path were re-read. Active P1 findings remain tied to cited source lines.
- `checklist_evidence`: NOT APPLICABLE. This pass audited code/spec/test claims, not checklist completion evidence.
- `skill_agent`: PASS. `deep-review` and `sk-code-review/references/review_core.md` were loaded before final severity calls.
- `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime agent parity behavior was under review.
- `feature_catalog_code`: NOT APPLICABLE. No feature catalog surface was under review.
- `playbook_capability`: NOT APPLICABLE. No playbook capability claim was under review.
- `claim_adjudication`: PASS. Six active P1 findings across both targets received typed Hunter/Skeptic/Referee adjudication fields.

## SCOPE VIOLATIONS

None. Reviewed source files and metadata files remained read-only. Writes were limited to the allowed review iteration narrative, delta file, and state-log append.

## Verdict

CONDITIONAL. No P0 findings are active. Six active P1 findings remain after adversarial adjudication, plus one active P2 advisory.

## Next Dimension

No next review dimension. Proceed to synthesis/remediation planning: implement the Target 1 append-mode guard; perform scoped dry-run metadata repair; gate or spec-amend explicit complete-like statuses; wire `statusCompletionConsistencyEnforced` through the MCP orchestrator; add orchestrator-level enforced-mode test coverage; optionally add parser edge-case tests.

Review verdict: CONDITIONAL
