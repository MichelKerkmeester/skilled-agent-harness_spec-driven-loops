# Iteration 3: Research fold-in and phase handoff

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Verify the research-phase completion gates and whether the parent’s claim that research was folded into the build phases is supported by the research task records and handoff criteria.

## Files Reviewed

- `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md`
- `.opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md`
- `.opencode/specs/system-speckit/049-memory-decommission/spec.md`
- `.opencode/specs/system-speckit/049-memory-decommission/goal.md`
- `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md`

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | conditional | The parent progress state treats integration as done despite open fold-in rows. |
| Security | pass | No security boundary is introduced by the research handoff itself. |
| Traceability | fail | Both research task documents leave their required fold-in task unchecked. |
| Maintainability | conditional | The packet does not expose a single authoritative source for research integration status. |

## Findings - New

### P0

None.

### P1

- **F002** Research fold-in gates remain open while the parent declares the research integrated: phase 005 marks its research iterations and synthesis complete but leaves T013, “fold the amendments into phases 001 and 004”, in progress [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:46-62]. Its completion criteria explicitly say T013 closes only when both build phases cite the research [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:67-73]. Phase 006 has the same open T013 for folding worklists and the preserve set into phases 002 and 003 [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md:61-73]. In contrast, the parent progress table says research was folded into phases 001 to 004 and marks both research phases Done [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:113-118], while the phase map calls both research phases complete and says their outputs are folded into the build phases [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:156-164].

#### F002 claim-adjudication packet

- findingId: `F002`
- claim: The parent’s integrated-completion claim is not supported by the research phases’ own required fold-in gates.
- evidenceRefs: `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73`; `.opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md:61-73`; `.opencode/specs/system-speckit/049-memory-decommission/spec.md:175-184`.
- counterevidenceSought: The build-phase specs and plans were inspected for citations to the research synthesis and for the worklist/preserve-set material named by the parent handoff criteria.
- alternativeExplanation: The research task T013 rows may be stale because the build agents completed the fold-in outside the research packet and did not update its task ledger.
- finalSeverity: `P1`
- confidence: `0.94`
- downgradeTrigger: Downgrade to P2 if both research task ledgers are closed or the parent names an authoritative fold-in receipt that supersedes those rows.

## Findings Existing/Refined

- **F003** reaffirmed: the research contradiction is distinct from the build-phase checklist mismatch because it concerns integration evidence, not generic child closure rows.

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `spec_code` | fail | Parent phase map claims research outputs are folded while research T013 rows remain open. |
| `checklist_evidence` | fail | Both research completion sections retain an unchecked fold-in condition. |
| `research-fold-in` | fail | The handoff criteria require citations and worklist assignment that the task records do not close. |
| `security-boundary` | pass | No runtime security claim depends on the research packet’s open row. |
| `skill_agent` | not-applicable | No skill-library claim is needed. |
| `agent_cross_runtime` | not-applicable | No cross-runtime agent contract is asserted. |

## Assessment

Dimensions addressed: traceability, correctness, maintainability. This is a confirmed target-local state contradiction. It does not prove that the implementation omitted every research amendment; it proves that the packet does not close the evidence chain required to demonstrate the fold-in.

## Ruled Out

- The research artifacts themselves are not absent: phase 005 records five iterations and a synthesis, and phase 006 records five iterations, a synthesis, and an inventory [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:113-114].
- No P0 runtime or security consequence is established by the open documentation gate alone [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:175-184].

## Recommended Next Focus

Inspect phase 004’s residual and exception accounting to determine whether its all-Met closure is supported by its own status rules and whether report-only debt has an owner or waiver.

Review verdict: CONDITIONAL
