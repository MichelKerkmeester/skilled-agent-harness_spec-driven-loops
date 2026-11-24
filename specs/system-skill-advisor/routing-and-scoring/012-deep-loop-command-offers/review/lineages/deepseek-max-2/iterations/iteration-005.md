# Review Iteration 005 - traceability (checklist_evidence, AC-001 to AC-029)

## Dispatcher

- Mode: review, lineage `deepseek-max-2`, iteration 5 of 7, dimension traceability.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- This iteration read the first half of the closure gate: `acceptance-criteria.md` AC-001 to AC-029, each `Met`, `Waived` or `Superseded` row against the artefact or computed count its `Verification` cell names, plus the earlier-round tasks T001 to T058 those rows rest on.
- Budget: 24 tool calls, used inside it.

## Files Reviewed

- `acceptance-criteria.md` AC-001 to AC-029, the status-value table and the closure statement.
- `tasks.md` T001 to T058, the Completion Criteria block, CHK-001 to CHK-051, the Verification Summary.
- `implementation-summary.md:150-180` (the closure-pass and final-rerun rows).
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-60,223,236-246,478`; `deep-review-presentation.txt:13-60,237,267-277,582-583`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (247 rows) and `command-routing-baseline.json`.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/` (probe inputs and results, `ac034-served-head.jsonl`, `fresh-review-hook.txt`), `scratch/behaviour/` (F3, F5, F6 samples).
- `decision-record.md:33-223` (ADR-001, ADR-002, ADR-003).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `checklist_evidence` | partial | AC-001 to AC-029 checked (29 of 60); T001 to T058 read beside them. The second half of the table is iteration 6. |

Row by row, the binding evidence found:

- **AC-001 to AC-005 (REQ-001 to REQ-004):** these rows rest on the two probe reruns. The inputs and outputs exist (`scratch/probes/`), the 69 probe rows exist in `probes-spec-baseline.json`, and the comparison baseline is `results-final-958fa81-worktree.json`. The rows are honest about what they rest on; the outcome itself is not re-measured here.
- **AC-006 / AC-007 (REQ-005):** `### Offer From an Advisor Brief` is the first H3 in both presentation files, with three options and A recommended; `research.md:86` and `review.md:81` carry step 0.
- **AC-008:** `Waived` with ADR-003, and ADR-003 records the 1-in-4 offer rate the row discloses; the packet does not present it as Met.
- **AC-009 / AC-010 (REQ-006):** the fixture column `asksForLoopRun` is on all 359 cases, and the depth-word negatives are one `it.each` block (`command-attach-guards.vitest.ts:534-547`) covering all seven non-ask depth prompts the requirement lists.
- **AC-011 (REQ-007):** the compiled contracts and their compiler are present and consistent; the two check scripts are named and not run from this lineage.
- **AC-012 (REQ-039):** the baseline reads `false_offer {count: 0, total: 57}` and `attachedMetrics.false_offer_attached {count: 1, total: 57}`, and `implementation-summary.md:156` records the pre-existing-row split (0 and 0 over the 35 earlier rows, one attached over the 22 new).
- **AC-013 / AC-016 / AC-021 (REQ-008, REQ-011, REQ-014):** each cites the `Closure pass: spec-baseline probe` row (`implementation-summary.md:154`), which exists and quotes the stage-one lines the rows describe.
- **AC-014 / AC-015 (REQ-009, REQ-010):** the `--extend=N`, `--restart` and `/doctor:deep-loop --scope=` strings exist in the four files the row names, and step 6, Q2 and Q-Exec carry the question-tool wording and the two `(Recommended)` markers.
- **AC-017:** `Waived` with ADR-002, which records the alias decision and the out-of-domain hit.
- **AC-018 (REQ-011):** the three searches print nothing and the hub `SKILL.md:20` names `/doctor:deep-loop`.
- **AC-019:** `Superseded` with ADR-001; the replacement check holds — N7, N9, V7, H6 and A3 are near-miss rows and D1 is the positive doctor row `cmd-doctor-deep-loop-plain-tune-02`.
- **AC-022 to AC-026:** each cites a line of `scratch/probes/fresh-review-hook.txt`; the file exists and the cited lines carry the prompts the rows describe.
- **AC-027 (REQ-020, ADR-005):** the gate layer is the row's declared scope, and the served head is explicitly left to AC-036, which is where ADR-005 puts it.
- **AC-028 (REQ-021):** the suite, fixture and probe counts it quotes are internally consistent with AC-042, AC-055 and AC-057's later rounds.
- **AC-029 (REQ-022):** the changelog states the refusal rule, names the brief options and the typed `(ask)`, and quotes 186 files / 3,518 passed for its row (`.skilled/changelog/skilled/v4.2.0.0.md:757`), which is the eleventh-round figure the packet records.

## Integration Evidence

- Every `Met` row in this half ends in one `Evidence: path:N (anchor)` tail, and the packet's own checker (`scratch/citations/evidence-tails.py`) reports `problems=0` over all 60 rows, so the name-based citations are machine-checked rather than asserted.
- The waiver and supersession rows name ADR-001, ADR-002, ADR-003 and ADR-009, and each ADR exists with a decision, alternatives and consequences.
- The earlier-round tasks cite artefacts that exist: `scratch/behaviour/F3.md`, `F5.md`, `F6-sample-1.md` to `F6-sample-3.md`, `scratch/probes/results-after.json`, `results-ac017-ood.json`.

## Edge Cases

- AC-009's claim that `dist` is rebuilt cannot be checked from the tree, because `dist/` is gitignored (`.gitignore:60`). It is a build artefact, and the row's other claims (the fixture column and the guard block) are verifiable. Recorded as unverified-not-failed rather than as a pass.
- AC-009 to AC-011 also assert that whole suites pass and that two check scripts exit 0. Those are run-claims; this lineage does not run them, so the rows rest on their recorded evidence. That is the honest reading of a checklist pass over a tree whose gates belong to another run.
- `validate.sh --strict` (T064, T085, T093) is not run from this lineage by design; the acceptance rows do not rest on it.

## Confirmed-Clean Surfaces

- The status column is coherent across all 60 rows: three waived/superseded rows name an ADR that exists, and the one `Unmet` row (AC-040) says so in its own text and in the closure statement.
- The Verification Summary's 12 P0 / 11 verified / 13 P1 / 1 P2 counts match the checkboxes behind them, and the single unticked P0 (CHK-020) is AC-040's carrier.
- The corpus baseline's two counts are what every row and task that quotes them claims.

## Ruled Out

- **A `Met` row resting on evidence that does not exist.** Ruled out: 60 of 60 tails resolve, and the anchors named by the first 29 rows exist as files, rows or lines.
- **A waiver without a decision record.** Ruled out: AC-008/ADR-003, AC-017/ADR-002, AC-019/ADR-001 and AC-020/ADR-009 all pair correctly.
- **A checklist count that contradicts its own boxes.** Ruled out: the Verification Summary recomputes to the same figures.

## Next Focus

- Dimension: traceability (`checklist_evidence`).
- Focus area: `acceptance-criteria.md` AC-030 to AC-042, the sixth-round closure rows, plus ADR-005 and ADR-006 as the decisions they cite.
- Reason: it is the slice the operator focus names explicitly, and it carries the rows whose evidence is a recomputed count.
- Rotation status: traceability continues; `checklist_evidence` closes here and iteration 7 runs the overlay protocols and consolidates.
- Blocked / productive carry-forward: productive. Recomputing every count in a row, rather than reading it, is what found the pair-count drift in `tasks.md`.
- Required evidence: the fixture row counts, `VOCABULARY_PAIRS` and `NUMERIC_PAIRS` lengths, the `doctorWithheld` split, and the two decisions' own text.

Review verdict: PASS
