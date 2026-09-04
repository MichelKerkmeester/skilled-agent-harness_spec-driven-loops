# Iteration 9: Release-evidence environment boundary

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Inspect the shared model-server verification evidence and the parent’s unresolved host dependency note.

## Files Reviewed

- `.opencode/specs/system-speckit/049-memory-decommission/goal.md`
- `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md`
- `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/implementation-summary.md`
- `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/goal.md`

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | conditional | Phase 003 records live worktree evidence, but the parent separately records a main-checkout dependency gap. |
| Security | pass | The caveat concerns package availability and model startup, not a new trust or path boundary. |
| Traceability | conditional | The phase’s Met evidence and the parent’s unresolved host note need an explicit release-environment handoff. |
| Maintainability | conditional | F006 is a bounded P2 deployment-readiness item, not a source-code defect. |

## Findings - New

### P0

None.

### P1

None new. F001 through F004 remain active.

### P2

- **F006 — Main-checkout model-server dependency remains an explicit release-readiness caveat.** The
  parent says the main checkout lacks `onnxruntime-common` even though the lockfile lists it, so the
  spawned server cannot load until that checkout is reinstalled [SOURCE:
  .opencode/specs/system-speckit/049-memory-decommission/goal.md:141-142]. Phase 003’s acceptance
  document records live advisor/model-server evidence as Met, but that evidence was gathered from the
  worktree environment [SOURCE:
  .opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:62-70].

## Findings Existing/Refined

- **F001** remains the malformed-posting reader contract P1.
- **F002**, **F003**, and **F004** remain unresolved traceability P1s.
- **F005** remains P2 exception-debt ownership/expiry debt.
- F006 is explicitly environment-scoped. Phase 003 itself records that the shared model server and
  advisor path work in the proof environment, while the parent has not closed the main-checkout
  dependency remediation [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:66-70]
  [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:141].

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `live-model-server-evidence` | pass | Phase 003 records a scored advisor recommendation and shared socket evidence. |
| `host-environment-parity` | fail | The parent explicitly records a missing runtime dependency in the main checkout. |
| `release-handoff` | partial | The remediation is named (reinstall), but no completion receipt or owner/date is recorded. |
| `source-vs-environment-boundary` | pass | The evidence supports environment skew rather than a source-code deletion defect. |
| `security-boundary` | pass | No new security boundary or credential claim was found. |
| `agent-cross-runtime` | not-applicable | No cross-runtime agent contract is asserted. |

## Assessment

The parent log records a concrete remaining host item: the main checkout’s installed dependencies do not
contain `onnxruntime-common`, so a spawned shared model server cannot load until an operator reinstalls
there [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:141]. Phase 003 separately
records a successful live advisor recommendation and shared socket test as acceptance evidence [SOURCE:
.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:66-70].
The two statements are compatible when treated as different environments, but the packet does not show
the main-checkout remediation complete. F006 is therefore a P2 release-readiness caveat that should be
closed with a reinstall and a repeat of the live check; it does not change the source review’s P1 count.

## Counterevidence Sought

- A main-checkout install receipt showing the dependency present and the spawned server loading would close F006.
- A release procedure that proves the shipped environment is always the tested worktree would downgrade it.

## Recommended Next Focus

Run the final adversarial replay across all findings, dimensions, search-ledger rows, and completion
conditions. Do not synthesize early; iteration 10 is required by the max-iterations policy.

Review verdict: CONDITIONAL
