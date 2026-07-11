# Iteration 2 - Security

## Dimension

Security: executor trust boundaries, dispatch-receipt authenticity, command construction, and workspace write containment.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:391-582`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:730-1107`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:633-924`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts:1-445`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:1126-1301`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts:1-379`
- `.opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts:48-237`
- `.opencode/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts:88-275`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/permissions-gate.vitest.ts:1-244`
- `.opencode/skills/system-deep-loop/runtime/feature_catalog/state-safety/permissions-gate.md:19-47`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **R2-P1-001: Dispatch receipts cannot authenticate across the workflow process boundary** - `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:410` - The receipt MAC key derives from a random module-scoped secret. The auto workflow creates receipts inside a standalone Node dispatch command, then configures post-dispatch validation as a later workflow step. A validator in another process initializes a different secret and rejects an authentic receipt. The tests conceal this boundary by creating and validating receipts under one installed in-process secret. A read-only replay against the live iteration-1 intent receipt returned `freshProcessVerification:false`. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:410-427] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:879-899] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1207-1274] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1284-1299] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts:32-52]

   Finding class: cross-consumer

   Scope proof: The live receipt was produced by the configured standalone executor branch. A fresh `tsx` process derived the validator key exactly as production code does and failed MAC verification. Existing receipt tests explicitly share the same process secret and contain no cross-process positive case.

   Affected surface hints: executor wrapper, post-dispatch validator, route-proof authority, resume validation

   Recommendation: Make signing and verification occur in one long-lived trusted process, or use a protected run-scoped verification key that is intentionally shared with validators but never the executor child. Add an end-to-end test that dispatches and validates in separate processes.

   Claim adjudication: `{"type":"claim_adjudication","claim":"An authentic dispatch receipt produced by the auto workflow cannot be verified by a fresh post-dispatch validator process.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:410-427",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:879-899",".opencode/commands/deep/assets/deep_review_auto.yaml:1207-1274",".opencode/commands/deep/assets/deep_review_auto.yaml:1284-1299",".opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-receipt-validator.vitest.ts:32-52"],"counterevidenceSought":"Inspected executor branch wiring, receipt validator tests, CLI branch receipt tests, and the live iteration-1 receipt pair; no persisted or parent-process key handoff exists. A fresh-process replay returned false.","alternativeExplanation":"A workflow engine could invoke validation in the receipt-producing process, but the YAML dispatch branch is itself a standalone Node command that exits before post-dispatch validation.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if production orchestration is shown to retain the exact receipt-producing module instance through validation, or another protected key handoff is identified."}`

2. **R2-P1-002: The advertised permissions gate is not connected to executor dispatch** - `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts:428` - The catalog labels packet/repo/external pre-dispatch authorization as shipped behavior, but exact call-site search found `evaluatePreDispatchToolCalls` and `evaluateToolCall` only in their defining module and unit tests. The active review branch instead launches OpenCode with `--dangerously-skip-permissions`, and its own notes acknowledge that the write boundary is prompt-only. Consequently, untrusted reviewed content can steer a compliant executor to mutate outside the review packet without any runtime permission decision or post-dispatch workspace-diff gate. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature_catalog/state-safety/permissions-gate.md:21-31] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts:393-445] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1229-1271] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1277-1283]

   Finding class: cross-consumer

   Scope proof: Repository-wide exact-use search under `.opencode` found no production caller of either exported evaluator. Search for workspace mutation checks under the runtime found no git-diff/status or allowed-write reconciliation gate. The CLI branch passes the permission-bypass flag directly as an argv element.

   Affected surface hints: permissions gate, CLI executor branches, untrusted review targets, post-dispatch validation

   Recommendation: Enforce the permissions matrix at the actual tool/command boundary where possible and add a trusted before/after workspace mutation check that rejects writes outside the iteration allowlist. Until enforcement exists, classify the feature as non-shipped and do not treat prompt restrictions as containment.

   Claim adjudication: `{"type":"claim_adjudication","claim":"Deep-review executor dispatch has no runtime-enforced packet write boundary despite cataloguing a shipped pre-dispatch permissions gate.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/feature_catalog/state-safety/permissions-gate.md:21-31",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts:393-445",".opencode/commands/deep/assets/deep_review_auto.yaml:1229-1271",".opencode/commands/deep/assets/deep_review_auto.yaml:1277-1283"],"counterevidenceSought":"Searched all .opencode TypeScript, JavaScript, CJS, MJS, and YAML call sites for the permissions evaluators and searched runtime code for post-dispatch git-diff/status or allowed-write reconciliation; only definitions and tests were found.","alternativeExplanation":"The gate may be intended as a library for an external orchestrator, but the catalog explicitly says this is shipped behavior and the configured review branch bypasses CLI permissions.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if a production caller outside the reviewed tracked scope is demonstrated to intercept every executor tool call or a trusted workspace mutation gate is shown to reject out-of-packet writes."}`

### P2 Findings

None.

## Traceability Checks

- `spec_code`: partial, compared receipt authority and write-boundary claims with the active auto workflow and runtime implementation.
- `checklist_evidence`: pending, not part of this security slice.
- `feature_catalog_code`: fail for F009 because the catalog marks the permissions gate shipped but no production dispatch caller exists.
- `skill_agent`: partial from iteration 1; not re-entered.
- Other overlay protocols: pending.

## Confirmed-Clean Surfaces

- CLI command construction uses `spawn`/`spawnSync` argv arrays rather than a shell, ruling out shell metacharacter injection in model and prompt values at this boundary.
- The executor environment allowlist keeps the in-process receipt secret out of child argv and environment.
- Receipt MAC validation rejects malformed, forged, and intent/completion-divergent records when producer and verifier share a key.

## Ruled Out

- Shell interpolation in the active `cli-opencode` and `cli-claude-code` dispatches: arguments are passed as arrays without `shell:true`.
- Direct receipt-key disclosure to the executor child: the secret is module-scoped and the non-native environment is allowlisted.

## Verdict

CONDITIONAL: two P1 security-control defects were confirmed.

## Next Dimension

- Dimension: traceability
- Focus area: core spec/checklist evidence and cross-runtime agent/command parity
- Reason: correctness and security now have bounded coverage; required traceability gates remain partial or pending

Review verdict: CONDITIONAL
