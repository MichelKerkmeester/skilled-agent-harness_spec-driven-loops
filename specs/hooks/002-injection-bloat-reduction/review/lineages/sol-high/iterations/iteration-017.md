# Iteration 17: Lifecycle adapter coverage

## Dimension

correctness

## Files Reviewed

- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:204]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/spec.md:85]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/spec.md:4]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/tasks.md:47]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/implementation-summary.md:4]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/implementation-summary.md:73]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/implementation-summary.md:127]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:346]
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:229]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:166]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:66]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:82]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:344]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/guardrail-negative-controls.test.mjs:271]

## Findings by Severity

### P0

- None.

### P1

- **F003: Parent and phase completion metadata contradict shipped implementation evidence.** The parent phase map and phase 001-006 specs/tasks still report planned or no-code states although their implementation summaries and verification evidence report shipped work. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/spec.md:85]
- **F001: Rendered policy receipts are discarded instead of entering the promised observation stream.** observeRenderedAdvisorPolicy constructs a delivery receipt but exposes no sink, so phase 001 cannot collect the receipts required to measure configured-versus-observed delivery before activation. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729]
- **F002: Configured-but-unobserved delivery is treated as confirmed across policy and Gate 3 state machines.** Both delivery confirmation predicates accept hostReceiptStatus configured, allowing a future activation to suppress or compact content without proof that the host observed the prior payload. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:346]
- **F004: Phase 006 implementation executes a serializer candidate that its frozen scope says to design only.** The phase spec excludes executing or shipping the compact serializer, but prompt-advisor computes the shadow candidate on each eligible input and the summary claims executed candidate measurements. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:66]

### P2

- **F005: Guardrail negative control assumes temporary fixture paths are outside a spec tree.** The nominally well-formed fixture becomes invalid when TMPDIR is inside a repository spec tree because its generated folder name and metadata paths inherit the outer packet context. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/guardrail-negative-controls.test.mjs:271]
- **F006: Public delivery-state inspection can advance lifecycle state once per block for direct callers.** DeliveryStateMachine.inspect advances from supplied lifecycle signals; renderPolicyPlan strips those signals after its first block, but direct callers have no equivalent one-advance guard. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:346]

## Claim Adjudication

- No new P0/P1 claim in this iteration.

## Traceability Checks

- `spec_code`: checked.
- `checklist_evidence`: checked.
- No out-of-scope write was attempted.

## Search Ledger

- SL-017: The direction was covered once and marked saturated to prevent repetition. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:204]

## Verdict

CONDITIONAL

## Next Dimension

Public state-machine consumer contract

Review verdict: CONDITIONAL
