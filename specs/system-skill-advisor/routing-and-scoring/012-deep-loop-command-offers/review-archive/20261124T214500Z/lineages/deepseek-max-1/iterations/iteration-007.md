# Iteration 7 - traceability

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: the last slice of the focus — ADR-001 to ADR-009 checked against the rows that own them, the changelog and timeline claims read against the tree, and the packet's open-questions section read as a closure record. This is the last iteration under the cap, and both core protocols already read `pass`.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (ADR-001)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:128` (ADR-002)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:223` (ADR-003)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:317` (ADR-004)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508` (ADR-006)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:603` (ADR-007)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:703` (ADR-008)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:796` (ADR-009)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:388` (open questions)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md:45` (generation 8 and the twelfth round)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md:57` (AC-040 milestone)
- `.skilled/changelog/skilled/v4.2.0.0.md:482` (stuck-run refusal exception)
- `.skilled/changelog/skilled/v4.2.0.0.md:484` (typed-on-stuck head)
- `.skilled/changelog/skilled/v4.2.0.0.md:759` (final suite count)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:78` (`AC-021`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The open-questions section still carries a decision the packet has since answered** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:390` -- The first open question says that if the rerun still shows `cmd=/deep:research` on N9, the operator must choose between a waiver and a narrower reading. `AC-021` records the opposite outcome — N9 prints `cmd=-` with no `/deep:*` command in any row, "so no waiver is needed" — so the contingency can no longer fire, and a release reader meets an open decision beside the row that closed it. The second bullet is an assumption the packet states as held ("The packet assumes no"), not an open question. Impact is record clarity only; no requirement, acceptance row or behaviour depends on the section.
   - Finding class: docs-drift
   - Scope proof: `spec.md` and `acceptance-criteria.md` are both on `review-scope-files.txt`; both anchors were read at this revision, and the N9 outcome is the one `AC-021` records.
   - Affected surface hints: `spec.md` §10, `AC-021`, `REQ-014`, the packet metadata's `Status` line.
   - Case: a reader opens `spec.md` §10 to see what is still undecided, finds the N9 waiver question, then opens `AC-021` and reads that the condition did not occur; nothing in §10 says the question was closed by the rerun.
   - Claim adjudication:
     - `type`: `stale_open_question`
     - `claim`: `spec.md` §10 presents the N9 waiver as an open operator decision although `AC-021` records the rerun outcome that makes the waiver unnecessary.
     - `evidenceRefs`: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:390`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:78`
     - `counterevidenceSought`: checked whether `AC-021` still reads `Met` with the no-waiver observation (it does), whether a later ADR records the waiver (none does, because none was needed), and whether the section is labelled as history (it is labelled `OPEN QUESTIONS`, and its second bullet is an assumption rather than a question).
     - `alternativeExplanation`: the section may be kept as the reasoning trail for a reader who wants to know why a waiver was considered, in which case the fix is to mark the item resolved rather than to delete it.
     - `finalSeverity`: P2
     - `confidence`: 0.8
     - `downgradeTrigger`: if the packet intends §10 to preserve decision history, the item needs a resolved marker and the severity stays a wording note.

## Traceability Checks

- `spec_code` — pass, carried and completed. REQ-001 to REQ-053 are mapped (iterations 3 and 6), and this pass adds nothing that changes a mapping; the ADR table below confirms each amendment is the decision the requirement cites.
- `checklist_evidence` — pass, carried from iteration 5. This pass adds the ADR-side check of the four rows that name an ADR: `AC-008` (ADR-003), `AC-017` (ADR-002), `AC-019` (ADR-001) and `AC-020` (ADR-009) each read `Waived` or `Superseded` with the ADR in the last column, and each ADR states the clause it waives.

  | ADR | Recorded decision | Owning row | Tree check |
  |---|---|---|---|
  | ADR-001 | Supersede `AC-019`'s near-miss count with the five-row check | `AC-019` (`Superseded`) | 31 near-miss rows in the corpus, the count the row says supersedes 15 |
  | ADR-002 | Keep the `multi-round research` alias | `AC-017` (`Waived`) | both hub files carry the alias; the out-of-domain replay is recorded |
  | ADR-003 | Waive `AC-008` on the measured offer rate | `AC-008` (`Waived`) | F6's 1-of-4 rate is stated in the row and in `implementation-summary.md` limitation 5 |
  | ADR-004 | Narrow D2 so a loop name about the loop's own code is not an ask | `REQ-019` | `LOOP_ARTIFACT_NOUNS` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1027` and the subject rows |
  | ADR-005 | A typed deep command outranks the stuck-run diagnosis on the served head | `AC-027`, `AC-036` | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1590` and the typed-stuck fixture row |
  | ADR-006 | A bare loop name is not a loop ask | `REQ-035`'s mode-free clause | four `servedRun: "none"` fixture rows and the hub row with no command |
  | ADR-007 | Amend REQ-011 to the two research aliases the hub carries | `AC-043` | `hub-router.json` and `ROUTER.md` carry both aliases; `autonomous research` is absent from both |
  | ADR-008 | Amend REQ-035 so a mode-free plural loop serves the hub without a command | `AC-051` | `plural-deep-loops-served` reads `servedRun: "none"` |
  | ADR-009 | Waive `AC-020`'s blind-writer clause | `AC-020` (`Waived`) | the lane reports are not in the packet, which is what the ADR records |

## Integration Evidence

- Changelog surface: `.skilled/changelog/skilled/v4.2.0.0.md:482` withholds the diagnosis on a stuck complaint that also refuses a run or a fix, and `:484` names the typed-on-stuck head; `:759` quotes 186 files, 3,518 passed and 359 Python cases, which is the eleventh and twelfth-round count.
- Timeline surface: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md:45` carries generation 8 and the twelfth round, and its milestone at `:57` records AC-040 as `In Progress` with the review report as evidence, which is the state this run is closing.
- Decision surface: all nine ADRs read `Accepted` (`decision-record.md:39` and the eight section headers), and each names the requirement or acceptance row that owns its outcome.

## Edge Cases

- The timeline's AC-040 milestone points at `review/review-report.md`, which a restart moves into `review-archive/` before the new run writes its own report. The pointer is forward-looking rather than dangling: the milestone is `In Progress`, and the report this lineage feeds the merge with is written at its synthesis step.
- `ADR-009` is a waiver, not a fix. The row it waives stays `Waived` rather than `Met`, so the unverifiable clause remains visible; treating the ADR as a closure of the clause would hide it.
- The second open question is an assumption, not a question. It is folded into the one finding above rather than reported as a second item, because a reader would act on both with the same edit.

## Confirmed-Clean Surfaces

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:78` — `AC-021` reads `Met` with the N9 outcome stated and cites `implementation-summary.md:156`, whose anchor is the spec-baseline probe row.
- `.skilled/changelog/skilled/v4.2.0.0.md:759` — the suite count row quotes 186 files, 3,518 passed, 4 skipped and 359 shared cases, which matches the eleventh and twelfth-round rows in `implementation-summary.md`.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md:45` — the last entry carries the eleventh round, generation 8 and the twelfth round, so the timeline is no longer one round short, which was a generation-8 finding.

## Ruled Out

- Changelog claiming refused asks are skipped: ruled out. The chart carries the exception at `.skilled/changelog/skilled/v4.2.0.0.md:482`, which withholds the diagnosis only when the complaint also refuses a run or a fix.
- Timeline one round short: ruled out. The generation-8 entry at `timeline.md:45` names the twelfth round and the P2 set it answers.
- ADR status as drift: ruled out. Every ADR reads `Accepted`, and every waiving ADR names the row it waives.
- The timeline's report pointer as dangling: ruled out for the reason in the edge cases — the milestone is in progress and a restart archives the prior report by design.

## Next Focus

- Dimension: none remaining (all four configured dimensions are covered and both core protocols read `pass`)
- Focus area: synthesis of this lineage's findings into its own review report; the cross-lineage merge and the release verdict belong to the fan-out root.
- Reason: the iteration cap is reached, the stop policy is `max-iterations`, and the remaining work is synthesis rather than another review pass.
- Rotation status: correctness, security, traceability and maintainability all covered; `spec_code` and `checklist_evidence` at `pass`.
- Blocked/productive carry-forward: productive; no approach was blocked.
- Required evidence: the findings registry the reducer owns, and the four P2 rows this run recorded.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS
