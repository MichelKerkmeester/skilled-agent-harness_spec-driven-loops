# Iteration 4: Phase 004 residual and exception accounting

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Adversarially inspect phase 004's residual classes, acceptance semantics, and closure evidence.

## Files Reviewed

- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md`
- `.opencode/specs/system-speckit/049-memory-decommission/goal.md`

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | conditional | The report-only behavior is stated in the acceptance Then clauses and closure text; no separate runtime defect was confirmed. |
| Security | pass | The reviewed residuals are diagnostics and naming/frontmatter policy classes, not an unbounded execution path. |
| Traceability | conditional | F002 and F003 remain open; phase 004's Met rows record residual counts but do not resolve the parent closure contradictions. |
| Maintainability | conditional | Exception counts are visible, but ownership and expiry for accepted residual debt are not established; reserve this as a later P2 angle. |

## Findings - New

### P0

None.

### P1

None new. F001, F002, and F003 remain active.

### P2

None new. The residual classes are explicitly treated as diagnostics or design refusals in this phase;
the missing owner/expiry question is deferred to iteration 8 so it is not conflated with a closure defect.

## Findings Existing/Refined

- **F001** remains limited to the trigger-index reader contract and is not reproduced by phase 004's corpus retrofit evidence.
- **F002** and **F003** remain independently supported by their open fold-in and completion-gate rows.
- The phase 004 acceptance document reports 63 `missing` documents carried by `skippedByDesign`, 95 unmatched markers, 51 duplicate ids, and 664 naming exceptions while marking the rows `Met` [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:60-77]. Its status table defines `Met` as evidence-backed verification, while `Waived` and `Superseded` require an ADR [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:79-94].
- The closure text is candid that these residuals were diagnosed and not repaired, and that escalation is a decision rather than an omitted task [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:99-116]. That policy distinction is sufficient to avoid inventing a new P1 in this pass.

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `completion-gates` | fail | F002 and F003 still leave packet-level closure evidence contradictory. |
| `acceptance-semantics` | partial | Residuals are recorded and explained, but the acceptance rows use `Met` for report-only outcomes. |
| `body-preservation` | pass | AC-003 and AC-004 cite byte-identical preimages and a constrained diff. |
| `residual-accounting` | partial | Counts and refusal classes are named, but no owner/expiry ledger is present in the reviewed closure. |
| `security-boundary` | pass | The reviewed residual classes do not introduce a new runtime boundary or path traversal claim. |
| `agent-cross-runtime` | not-applicable | No cross-runtime agent contract is asserted by phase 004. |

## Assessment

This pass confirms a policy/evidence distinction rather than a separate correctness failure. AC-001's
Then clause asks for zero unprocessed variants, but its Verification cell explains the 63 remaining
`missing` documents as deliberate refusal classes. AC-005 likewise asks that unmatched and duplicate
markers be reported rather than silently repaired, and the closure records 95 and 51 diagnostic rows.
Those details make the phase's intended report-only semantics reviewable, even though they leave a
maintainability question about who owns the residual debt. The parent still records open decisions on
severity escalation, frontmatter authorship, vocabulary normalization, and parser alignment [SOURCE:
.opencode/specs/system-speckit/049-memory-decommission/goal.md:141-147].

## Ruled Out

- No new P1 was raised from the residual counts because the phase explicitly records their treatment and
  the status/waiver contract distinguishes verified evidence from waived or superseded work [SOURCE:
  .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:79-94].
- No security or path-scope defect was found in this documentation and reporting review; the acceptance
  evidence records archive exclusion and zero changed archived paths [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:62-63].

## Recommended Next Focus

Replay the parent criterion for an exact zero retired-tool-prefix search, separating literal repository
matches from the documented interpretation that historical evidence and negative guards may remain.

Review verdict: CONDITIONAL
