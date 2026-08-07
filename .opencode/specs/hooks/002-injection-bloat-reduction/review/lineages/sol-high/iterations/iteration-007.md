# Iteration 7: Pi phase scope conformance

## Dimension

traceability

## Files Reviewed

- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:66]
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
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:82]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:344]

## Findings by Severity

### P0

- None.

### P1

- **F003: Parent and phase completion metadata contradict shipped implementation evidence.** The parent phase map and phase 001-006 specs/tasks still report planned or no-code states although their implementation summaries and verification evidence report shipped work. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/spec.md:85]
- **F001: Rendered policy receipts are discarded instead of entering the promised observation stream.** observeRenderedAdvisorPolicy constructs a delivery receipt but exposes no sink, so phase 001 cannot collect the receipts required to measure configured-versus-observed delivery before activation. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729]
- **F002: Configured-but-unobserved delivery is treated as confirmed across policy and Gate 3 state machines.** Both delivery confirmation predicates accept hostReceiptStatus configured, allowing a future activation to suppress or compact content without proof that the host observed the prior payload. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:346]
- **F004: Phase 006 implementation executes a serializer candidate that its frozen scope says to design only.** The phase spec excludes executing or shipping the compact serializer, but prompt-advisor computes the shadow candidate on each eligible input and the summary claims executed candidate measurements. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:66]

### P2

- None.

## Claim Adjudication

`{"claim":"Phase 006 implementation executes a serializer candidate that its frozen scope says to design only","evidenceRefs":[".opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:66",".opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:82",".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209",".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:344"],"counterevidenceSought":["passing focused tests","shadow-only defaults","consumer-side signal stripping"],"alternativeExplanation":"documentation or shadow behavior may intentionally lag, but no explicit exception reconciles the frozen requirement","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"evidence that the host emits an independent observed receipt before suppression"}`

## Traceability Checks

- `spec_code`: checked.
- `checklist_evidence`: checked.
- No out-of-scope write was attempted.

## Search Ledger

- SL-007: The phase-006 frozen scope and its exact implementation consumer are both explicit review targets. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/spec.md:66]

## Verdict

CONDITIONAL

## Next Dimension

Activation guardrail test isolation

Review verdict: CONDITIONAL
