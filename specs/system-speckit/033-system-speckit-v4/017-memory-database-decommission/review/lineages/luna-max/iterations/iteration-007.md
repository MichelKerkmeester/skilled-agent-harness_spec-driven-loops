# Iteration 7: Exact-zero retired-prefix criterion

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Replay the parent completion criterion requiring an exact zero-hit search for the retired memory tool prefix.

## Files Reviewed

- `.opencode/specs/system-speckit/049-memory-decommission/goal.md`
- `.opencode/specs/system-speckit/049-memory-decommission/spec.md`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md`
- Repository-wide exact fixed-string search for the retired prefix

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | conditional | The target’s literal completion criterion is not satisfied, while the runtime-removal interpretation may still be satisfied. |
| Security | pass | The 17 matches are documented evidence, changelog, benchmark, guard, or packet residue; no live client configuration was identified in this pass. |
| Traceability | fail | The completion checklist says zero hits, but its evidence row records 17 matches and substitutes an unstated “no live instruction surface” interpretation. |
| Maintainability | conditional | Historical residue can be retained, but the retention policy needs an explicit waiver/allowlist contract. |

## Findings - New

### P0

None.

### P1

- **F004 — Parent exact-zero residue criterion is closed despite literal matches.** The parent criterion
  requires no repository hits, while its own evidence records 17 matching files and closes the row on a
  narrower live-surface reading [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:84-98]
  [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:124-132].

### P2

None new.

## Findings Existing/Refined

- **F001** remains a P1 at the trigger-index reader boundary.
- **F002** remains a P1 because research fold-in task rows remain open while the parent says the outputs are integrated.
- **F003** remains a P1 because build-phase completion criteria remain unchecked while their acceptance documents and parent map say complete.
- F004 is a traceability finding, not a claim that the retired runtime is still configured. The exact scan
  returns 17 files, and the parent explicitly names those as retained historical evidence, negative guards,
  reports, and packet documents [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:124-132].

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `literal-completion-criterion` | fail | The required exact-zero search has 17 matching files. |
| `live-surface-disposition` | partial | The evidence classifies the residue informally, but does not provide an executable allowlist or waiver. |
| `historical-retention-contract` | fail | The closure reading changes the criterion without an ADR or amended wording. |
| `cross-document-criterion` | fail | Goal criterion and DONE WHEN evidence state different predicates. |
| `security-boundary` | pass | The cited residue inventory contains no new client configuration claim. |
| `agent-cross-runtime` | not-applicable | No cross-runtime agent contract is asserted. |

## Assessment

The exact fixed-string search over the repository returned 17 matching files before this iteration's
lineage artifacts were written. The parent completion criterion is an absolute zero-hit predicate, and
the DONE WHEN table repeats that predicate. Its evidence instead says the row is closed because no live
instruction surface remains and lists retained historical evidence, guards, reports, and packet docs.
That may be a sensible product decision, but it is not equivalent to the written criterion. There is no
explicit waiver, amended criterion, or executable allowlist in the reviewed parent material. This is an
independent P1 traceability defect; it does not reopen the separate runtime configuration scan.

## Counterevidence Sought

- A decision record or amended completion criterion that defines the retained classes and proves the live
  surface predicate is the authoritative acceptance test would downgrade F004.
- A repository-side allowlist or scoped search recipe that excludes only those named historical classes
  would make the closure claim reproducible.

## Recommended Next Focus

Inspect the residual exception classes in phase 004 for explicit owners, expiry, and decision records;
keep that maintainability debt separate from F004's exact-zero criterion.

Review verdict: CONDITIONAL
