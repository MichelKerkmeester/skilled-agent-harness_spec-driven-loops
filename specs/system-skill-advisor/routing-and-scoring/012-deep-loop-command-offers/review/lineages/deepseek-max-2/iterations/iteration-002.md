# Review Iteration 002

## Dispatcher

- Lineage `deepseek-max-2`, iteration 2 of 7, mode `review`, `AUTONOMOUS`.
- Dimension: **traceability** (`spec_code`), first half. Operator focus carried: the sixth-round requirements (REQ-023 to REQ-034) are re-read where this iteration's range touches them (`spec.md:243` REQ-031 was checked at the gate layer in iteration 1).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`).

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:31` to `:146` - problem statement, the decision this packet follows, and the measured-behaviour block (69 probe lines).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:199` to `:234` - REQ-001 to REQ-022.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56` to `:87` - AC-001 to AC-030.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` to `:120` - ADR-001 in full (context, decision, five-row replacement check, consequences).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` - all 69 rows, read mechanically against `results-spec-baseline.json`.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/probes-spec-baseline.json` - the 69 probe definitions, read for the N9 and D1 prompts.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` - 247 rows, read mechanically for the near-miss set.
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13` to `:60` - the offer section and its flag table.
- `.skilled/commands/deep/assets/deep-research-presentation.txt` and `.skilled/commands/deep/assets/deep-review-presentation.txt` - step 6, the Next Steps tables and the `--extend=N` and `/doctor:deep-loop --scope=` rows.
- `.skilled/commands/deep/research.md:86` and `.skilled/commands/deep/review.md:81` - step 0 in both command documents.
- `.skilled/commands/deep/assets/deep-research.yaml:2265` and `.skilled/commands/deep/assets/deep-review.yaml` - the `next_steps` lists.
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown` - the generated headers, with every recorded source digest recomputed.
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63` and `.skilled/skills/system-deep-loop/SKILL.md:20` - the research aliases and the doctor command.
- `.skilled/changelog/skilled/v4.2.0.0.md:212` and `:474` to `:496` - the brief-options line, the refusal, typed-on-stuck and question rules, and the suite row at `:759`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **REQ-012 still states the superseded six-row near-miss check, and its only acceptance row is `Superseded`, so a P1 requirement has no live criterion** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:224` -- REQ-012 says "N7, N9, D1, V7, H6 and A3 each appear in `command-prompts.jsonl` as a `near-miss` row, and no new guard is added for them". `command-prompts.jsonl` holds 247 rows and 31 `near-miss` rows, and none of them carries any of those six ids; the near-miss ids are `nm-<skill>-NN`. ADR-001 (`decision-record.md:33`) decided that AC-019 is `Superseded` and that D10's outcome replaces the count check with a five-row id check (N7 as `nm-system-deep-loop-02`, N9 as `-03`, V7 as `-05`, H6 as `nm-sk-code-02`, A3 as `nm-sk-code-03`, D1 as the positive `cmd-doctor-deep-loop-plain-tune-02`). That five-row check holds exactly on the tree: each named row exists, is `row_type: "near-miss"`, and carries the probe prompt it was recorded from. REQ-012 itself was never amended, unlike REQ-011 (amended in text by ADR-007) and REQ-035 (amended by ADR-008), so `spec.md` and `acceptance-criteria.md` disagree about what REQ-012 requires, and its acceptance row is wedged at `Superseded` with no requirement text saying so.
Case: a reviewer closing the packet walks the P1 table, reaches REQ-012, searches the corpus for the six ids, finds none, then finds AC-019 `Superseded`; the packet has no row that both states what REQ-012 now requires and checks it, so the requirement is either silently unverified or read as failing.
Finding class: specification-decision-divergence
Scope proof: the requirement, its acceptance row and ADR-001 are all inside the declared spec-folder target; the corpus is inside the pre-bound scope list; every cited row id was looked up and its prompt compared with the probe definition.
Affected surface hints: `spec.md` REQ-012; `acceptance-criteria.md` AC-019; `decision-record.md` ADR-001; `command-prompts.jsonl`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-001 to REQ-022 are now mapped to code, probes or decisions. REQ-001 to REQ-011, REQ-013 to REQ-022 hold; REQ-012 does not (finding 1). REQ-023 to REQ-031 were mapped in iteration 1 with REQ-031 failing there; REQ-032 to REQ-046 are not yet mapped. |
| `checklist_evidence` | partial | AC-001 to AC-030 were opened this iteration as the acceptance side of the same requirements. Their cells are checked in full in the next iteration; this pass only used AC-019 (the `Superseded` row behind finding 1) and the count cells that belong to REQ-006, REQ-021 and REQ-022. |

Observed measurements behind the `spec_code` row (read-only, run from probes under the lineage):

- **REQ-001.** `results-after.json` reads `V6 system-deep-loop cmd=/deep:review pol=ask`, `H1a` the same, `H1b` and `E1` `/deep:research pol=ask`, `E3` `/deep:review pol=ask`: five of five gain rows carry the command and policy the requirement states.
- **REQ-002.** `R7` reads `system-deep-loop cmd=- pol=-`; the thirteen no-gain ids (V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8, H9) carry no `/deep:*` command in the top row, and `V5` tops `sk-code` with mode `sk-code-review`.
- **REQ-003.** All seventeen keep rows carry the same command and policy as `results-spec-baseline.json` (`drift=0`).
- **REQ-004.** All seventeen negative rows carry the same top skill and `cmd=` value as the baseline (`drift=0`).
- **REQ-006.** Every one of the 69 probe rows reads `freshness: live` with `exit: 0`, which is the rebuilt-`dist` clause; the depth-word `it.each` at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:538` to `:545` holds one `undefined` case per depth word the problem statement lists (thorough, thoroughly, in depth, exhaustive, deep dive, everything you can, final verdict), and the shared fixture supplies the loop-ask column for both suites (347 cases, parity measured in iteration 1).
- **REQ-007.** Both compiled contracts record a `sourceDigests` header, and all 31 recorded source digests recompute to the current file contents (`deep-research` 16 sources, `deep-review` 15 sources, `stale=0`), so the contracts are regenerated from the edited sources. The mirror and command-reference gates were not run; see Edge Cases.
- **REQ-005, REQ-008 to REQ-011, REQ-022.** Each is verified against the file that carries it: the offer section and the flag table (`.skilled/commands/deep/assets/deep-review-presentation.txt:13` to `:60`), both step-0 paragraphs (`.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`), both `next_steps` lists (`.skilled/commands/deep/assets/deep-research.yaml:2268`), the question-tool and recommended-option lines in both presentation files, the absence of the council words from `command-attach.ts` and `explicit.ts`, both research aliases present in `hub-router.json:34` and `ROUTER.md:63` with no `autonomous research` anywhere, the four dropped depth phrases absent from their skill files, and the changelog's refusal, typed-on-stuck and question rules at `.skilled/changelog/skilled/v4.2.0.0.md:482` to `:486` plus the brief-options line at `:212`.
- **REQ-014.** N9's probe prompt is exactly `summarize the research.md from the last deep research run` and the same row reads `cmd=-`, so the requirement holds on its own row and not on a neighbour's.
- **REQ-015 to REQ-020.** Every quoted prompt in those six requirements resolves to a shared fixture row with the flag the requirement states: seven of seven for REQ-015, two of two for REQ-016, two of two for REQ-017, one for REQ-018, twelve of twelve for REQ-019, four of four for REQ-020.
- **REQ-013 and REQ-021.** Both carry measurement claims that this environment cannot reproduce: the holdout rows' authorship, and the 227-prompt predicate comparison. Their acceptance cells say so; see Edge Cases.

## Integration Evidence

None recorded. The command documents, the YAML `next_steps` lists and the compiled contracts were read as the integration surface for REQ-005, REQ-007 and REQ-009, and each is named above with the line that was read.

## Edge Cases

- **Evidence outside reach, disclosed (REQ-013).** AC-020's own cell says the lane reports are not kept in the packet, so the "separate worker wrote the holdout rows" clause rests on `implementation-summary.md`. The three `-04` holdout rows do exist and the three `-01` rows are gone, which is the part the tree can show. Recorded as a disclosed limitation, not a finding.
- **Evidence outside reach, disclosed (REQ-021).** The 227-prompt predicate comparison and the full vitest run are recorded in AC-028/AC-042 and were not rerun here; this lineage proves parity on the shared fixture instead (347 cases, both copies) and says so rather than implying the larger number.
- **Not run, on purpose (REQ-007's gates).** `sync-runtime-mirrors.cjs --check` and `validate-command-references.cjs` were not executed: this lineage may not run repo-wide tooling that could write. The compiled-contract digests were recomputed instead, which proves the regeneration half of the requirement.
- **Contradiction recorded, not adjudicated (suite counts).** AC-009 and AC-030 say the Python suite prints `cases=285` and AC-028 says `184 files, 3,188 passed`, while the tree's fixture holds 347 cases, the parity test prints `cases=len(cases)`, and AC-048 plus the changelog record `186 files, 3,415 passed`. The requirement text is unaffected, so this is carried to the acceptance pass rather than raised here.

## Confirmed-Clean Surfaces

- `results-after.json` against `results-spec-baseline.json`: keep and negative groups drift 0 over 34 rows, all 69 rows live and exit 0.
- `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown`: 31 of 31 recorded source digests match the current sources.
- `command-prompts.jsonl`: the five near-miss ids ADR-001 names all exist, all are `near-miss` rows, and each carries the probe prompt it was recorded from.
- Both presentation files and both command documents: the offer section, the three options, the recommended marks and the step-0 pointer are present in each.

## Ruled Out

- **REQ-007's compiled-contract staleness.** The recorded digests could have lagged the edited command docs; all 31 recompute.
- **REQ-022's changelog omission.** The changelog could have failed to name the typed-on-stuck exception or the refusal verbs; both rules are stated at `.skilled/changelog/skilled/v4.2.0.0.md:483` and `:484`, and the brief options at `:212`.
- **REQ-014 resting on a neighbour's probe.** N9's prompt matches the requirement's quoted prompt exactly, so the row is its own evidence.

## Next Focus

- Dimension: traceability (`checklist_evidence`).
- Focus area: every `Met` row from AC-001 to AC-054, with the cited line printed and the claimed content checked; the count cells (AC-009, AC-028, AC-029, AC-030, AC-037) first, because they already disagree with each other.
- Reason: `checklist_evidence` is the second core protocol, the acceptance table is the closure gate, and iteration 1 already found three anchors that do not hold their evidence.
- Rotation status: `spec_code` has covered REQ-001 to REQ-031; REQ-032 to REQ-046 move to iteration 6.
- Blocked/productive carry-forward: productive - resolving a citation to what it actually prints is cheap and catches drift; blocked - the vitest and Python suites cannot be rerun in this lineage, so only file evidence and the committed probe/parity output count.
- Required evidence: one printed line per cited `path:line`, and the closure statement's own claims against `tasks.md`.
- Recovery note: if a citation resolves to a line whose content still supports the claim only loosely, record the looseness rather than a finding.

Review verdict: PASS
