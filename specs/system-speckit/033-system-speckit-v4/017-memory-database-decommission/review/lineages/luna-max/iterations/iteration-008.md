# Iteration 8: Exception-debt ownership and expiry

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Inspect phase 004's accepted report-only residual classes for accountable ownership, expiry, and decision records.

## Files Reviewed

- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md`
- `.opencode/specs/system-speckit/049-memory-decommission/goal.md`

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | conditional | The residual classes are deliberately diagnostic/report-only; no execution defect was added. |
| Security | pass | No new runtime, path, or configuration boundary is created by the exception inventory. |
| Traceability | conditional | F002–F004 remain active; residual counts are traceable, but their follow-up is not assigned to a dated decision. |
| Maintainability | conditional | F005 records a P2 debt: residual warnings and refusals have no named owner or expiry/renewal point. |

## Findings - New

### P0

None.

### P1

None new. F001, F002, F003, and F004 remain active.

### P2

- **F005 — Report-only exception debt has no named owner or expiry.** Phase 004 records substantial
  residual classes and says escalation happens once their owners fix them, but no owner, due date, or
  expiry/renewal mechanism is named in the reviewed packet [SOURCE:
  .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md:203-210]
  [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:141-147].

## Findings Existing/Refined

- **F001** remains a reader-side index-contract P1.
- **F002** and **F003** remain packet traceability P1s.
- **F004** remains the mismatch between the exact-zero parent criterion and its 17-match closure evidence.
- F005 is deliberately P2: phase 004 does document the residual counts and the rationale for staged
  severity, so this is follow-up accountability debt rather than proof that the report-only behavior is
  unsafe or incorrectly implemented [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:60-77]
  [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:99-116].

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `exception-inventory` | pass | Residual categories and counts are recorded in acceptance and implementation documents. |
| `owner-assignment` | fail | “Their owners” is a future condition; no residual-class owner is named. |
| `expiry-policy` | fail | No due date, expiry, renewal, or escalation checkpoint is recorded. |
| `waiver-decision` | partial | Existing ADRs explain other design choices, but no residual-debt decision record assigns accountability. |
| `security-boundary` | pass | The review found no new runtime or path-scope risk in the reporting classes. |
| `agent-cross-runtime` | not-applicable | No cross-runtime agent contract is asserted. |

## Assessment

The implementation summary calls four classes warnings and says escalation is a one-line registry change
once their owners fix them, while the parent log leaves escalation, frontmatter authorship, vocabulary,
and parser alignment as open decisions [SOURCE:
.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md:203-210]
[SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:141-147]. The phase's acceptance
document also records 63 deliberate missing documents, 95 unmatched markers, 51 duplicate ids, and 664
naming exceptions as diagnosed residuals [SOURCE:
.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:60-77].
The packet has repository-owner sign-off rows, but they are blank role approvals rather than ownership
for a residual class [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:267-275].
Therefore F005 is a bounded maintainability finding: the residual policy is visible, but it can persist
indefinitely without an accountable next action.

## Counterevidence Sought

- A residual register naming an owner and review date for each report-only class would close F005.
- An ADR or amended acceptance row with an explicit expiry/renewal rule would also close or downgrade it.

## Recommended Next Focus

Review the documented release-evidence dependency and host caveat for the shared model-server path;
classify it as a P2 deployment-readiness item only if the packet explicitly leaves it unresolved.

Review verdict: CONDITIONAL
