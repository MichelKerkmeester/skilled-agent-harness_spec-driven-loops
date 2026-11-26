# Review Iteration 004

## Dispatcher

- Mode: review; dimension `traceability` (iteration 4 of 7), second pass, completing the core protocol `checklist_evidence`.
- Operator review focus: finish `checklist_evidence` — every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree.
- How this iteration addressed the focus: it read the verification cell of every AC row not read in iteration 3 (AC-001..AC-029 and AC-050..AC-060), verified four of them against the recorded probe output rather than the cell's prose, and then checked all 138 ticked boxes in `tasks.md` — their cited repo-relative paths, their `Observed`/`Verify` clauses, and the three that stay unticked.

## Files Reviewed

- `acceptance-criteria.md` AC-001..AC-029 and AC-050..AC-060 verification cells
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (69 rows, read programmatically)
- `tasks.md` — all 138 `[x]` boxes, the three `[ ]` boxes, the Verification Checklist and the Verification Summary
- `plan.md` (`## 4` heading)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `lib/scorer/fusion.ts`, `skill-advisor-cli.ts`, `lib/subprocess.ts`, `handlers/advisor-recommend.ts`, `lib/scorer/lanes/explicit.ts` (ephemeral-label sweep)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | `pass` | Carried complete from iteration 3: all 52 REQs resolve to code, a decision, or the artifact that records the measurement. This iteration re-read two of them against the recording rather than the requirement text: REQ-001's five gain lines and REQ-002's two no-gain clauses resolve exactly in `scratch/probes/results-after.json` — `V6`, `H1a` and `E3` each carry `top.skill=system-deep-loop`, `command=/deep:review`, `policy=ask`; `H1b` and `E1` each carry `/deep:research` with `policy=ask`; `R7` and `N9` carry no command; `V5` carries `top.skill=sk-code` with `modes="sk-code-review"`, which is REQ-002's wording for it. Every sampled row also reads `freshness=live`, which is REQ-006's `dist` clause. |
| `checklist_evidence` | `pass` | Two independent passes hold. **Acceptance matrix:** 119 `file:line` anchors (98 repo-relative, 21 packet-relative) all resolve to an existing file with the cited line in range; the content of the cited line was read for AC-030..AC-049 and AC-059, and the cell text was read for all 60 rows. **Task list:** of 138 ticked boxes, 115 cite a backticked path or an `Observed`/`Verify` clause, the 33 repo-relative paths among them all exist, and 4 ticked boxes name neither — `CHK-002`, `CHK-FIX-001`, `CHK-FIX-006` and `CHK-032` — each of which is a structural or `N/A` row that needs none. The 3 unticked boxes are `T084`, the `All tasks marked [x]` rollup and `CHK-020`; all three state the same open item, the traceability rerun that AC-040 scores. |

## Integration Evidence

- **The Verification Summary reproduces from the boxes behind it.** `tasks.md:338` reads `P0 Items 12 / 11 of 12`, `P1 Items 13 / 13 of 13`, `P2 Items 1 / 1 of 1`. The file holds exactly 12 `[P0]` check rows (9 `CHK-0xx` plus 3 `CHK-FIX-0xx`), and exactly one of them, `CHK-020`, is unticked — which is the `11 of 12`. That is REQ-034's "tasks.md checklist evidence and Verification Summary agree with the boxes they count", checked by counting rather than by trusting the summary.
- **The three unticked boxes agree with the matrix.** `T084` (`:166`), the rollup (`:226`) and `CHK-020` (`:286`) each say the rerun is a follow-up run and not part of the build, and each points at AC-040. The matrix's single `Unmet` row is AC-040. No doc in the packet claims the rerun happened.
- **Comment hygiene holds on the changed code.** `CHK-011` claims a sweep for `D<digit>`, `P<digit>`, `REQ-` and `specs/` in the changed comments prints nothing. Re-run over the six changed files (`command-attach.ts`, `fusion.ts`, `skill-advisor-cli.ts`, `subprocess.ts`, `advisor-recommend.ts`, `explicit.ts`) it prints nothing, so the durable comments carry the why and no artifact label.

## Edge Cases

- **`checklist_evidence: pass` is a claim about location and about the cells read, not about re-running every gate.** The three `Waived` rows and the `Superseded` row were read for their waiver's presence (`ADR-001`, `ADR-002`, `ADR-003`, `ADR-009` all exist in `decision-record.md`), not for whether the measurement behind each waiver still holds. That limit is stated here so synthesis does not read `pass` as a fresh measurement of nine probe rows.
- **The probe file's `freshness` field is a recording, not a live probe.** Every sampled row reads `live`, which is what REQ-006's `dist` clause asks the recording to show; this lineage cannot make the advisor answer a prompt to confirm it today.
- **Four ticked boxes cite no path.** All four are structural or `N/A` (`CHK-002` reads `plan.md`, which resolves via one `## 4` heading; `CHK-FIX-001` records classes in prose; `CHK-FIX-006` and `CHK-032` are `N/A` rows confirmed by reading). None is a task whose evidence should exist and does not.

## Confirmed-Clean Surfaces

- Every AC row names its owning REQ, and every REQ-001..REQ-052 is owned by at least one row.
- The probe recording reproduces every REQ-001 and REQ-002 clause sampled, including the no-gain rows that must carry no command and the one row that must keep `sk-code` on `sk-code-review`.
- `plan.md` holds exactly one `## 4` heading, which is `CHK-002`'s claim.
- No changed file under review carries an ephemeral artifact label in its comments, which is `CHK-011`'s claim and the repository's hard comment rule.

## Ruled Out

- *A ticked box whose cited path does not exist.* All 33 repo-relative paths cited by a `[x]` box resolve.
- *A Verification Summary count that does not match its boxes.* The `P0` count matches exactly, and the single unverified item is the unticked `CHK-020`.
- *A packet that quietly claims its coverage gate passed.* `T084`, `CHK-020`, AC-040 and the closure statement all say it has not, which is consistent.
- *A waiver named in a row but absent from `decision-record.md`.* ADR-001, ADR-002, ADR-003 and ADR-009 are all present.

## Next Focus

- Dimension: `maintainability`
- Focus area: pattern compliance and safe follow-on change cost across the gate's own structure — the vocabulary-as-data convention, the duplicated native/Python grammar and how a reader changes one safely, and the reducer's `refinesSameLocation` seam (REQ-032, REQ-046, REQ-048, REQ-052); plus the two overlay protocols that apply to a spec-folder target.
- Reason: iteration 5 of 7; the two core protocols are complete, and maintainability is the last uncovered dimension.
- Rotation status: `correctness`, `security`, `traceability` (twice) reviewed; `maintainability` remains.
- Blocked/productive carry-forward: productive — counting rows against a summary is cheap and it turns a prose claim into a reproducible number.
- Required evidence: `command-attach.ts` vocabulary structure, `skill_advisor.py` tuple mirrors, `reduce-state.cjs` strategy and Next Focus seams, `.skilled/skills/system-deep-loop/SKILL.md` and `ROUTER.md` for the overlay protocols.

Review verdict: PASS
