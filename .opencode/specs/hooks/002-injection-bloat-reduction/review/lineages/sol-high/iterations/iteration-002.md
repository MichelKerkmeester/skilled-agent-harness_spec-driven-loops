# Iteration 2: Receipt producer and sink

## Dimension

correctness

## Files Reviewed

- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/spec.md:85]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/spec.md:4]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/tasks.md:47]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/implementation-summary.md:4]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/implementation-summary.md:73]
- [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/implementation-summary.md:127]

## Findings by Severity

### P0

- None.

### P1

- **F003: Parent and phase completion metadata contradict shipped implementation evidence.** The parent phase map and phase 001-006 specs/tasks still report planned or no-code states although their implementation summaries and verification evidence report shipped work. [SOURCE: .opencode/specs/hooks/002-injection-bloat-reduction/spec.md:85]
- **F001: Rendered policy receipts are discarded instead of entering the promised observation stream.** observeRenderedAdvisorPolicy constructs a delivery receipt but exposes no sink, so phase 001 cannot collect the receipts required to measure configured-versus-observed delivery before activation. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729]

### P2

- None.

## Claim Adjudication

`{"claim":"Rendered policy receipts are discarded instead of entering the promised observation stream","evidenceRefs":[".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729",".opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/implementation-summary.md:73",".opencode/specs/hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation/implementation-summary.md:127"],"counterevidenceSought":["passing focused tests","shadow-only defaults","consumer-side signal stripping"],"alternativeExplanation":"documentation or shadow behavior may intentionally lag, but no explicit exception reconciles the frozen requirement","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"evidence that the host emits an independent observed receipt before suppression"}`

## Traceability Checks

- `spec_code`: checked.
- `checklist_evidence`: checked.
- No out-of-scope write was attempted.

## Search Ledger

- SL-002: The receipt producer and the phase-001 acceptance evidence are both in the bounded review scope. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:729]

## Verdict

CONDITIONAL

## Next Dimension

OpenCode route line bounding

Review verdict: CONDITIONAL
