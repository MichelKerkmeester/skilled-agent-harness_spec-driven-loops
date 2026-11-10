# Iteration 13: Second-model re-check 3 of 5 — envelope reader (I-3, rank 6), unchecked finding fields (U-9), surface↔review exchange (E-3)

## Focus

A second model family re-checking the INFERRED claims in `research/research.md` against the files as they stand now. This iteration takes the third of five re-check slices: I-3 and the claim the dispatch attributes to rank 6 (no reader for the quality gate's `CODE_QUALITY_RESULT` envelope), U-9 (finding class, scope proof and riskScore are read by no checker), and E-3 (what a user security surface and review need from each other).

The job is not to restate the prior model's conclusions but to test them. Every verdict below is one of CONFIRMED, REFUTED or NOT TESTED, with the evidence that decided it. The three tests are independent of each other and none of them touches a reducer-owned file.

## Actions Taken

1. Grepped all of `.skilled/` for `CODE_QUALITY_RESULT|checklists_loaded|checker_outputs` with two lines of context. Three matches, all in one file. This is a whole-tree search, so an absence is evidence about the framework rather than about one packet.
2. Read `sk-code-review/scripts/check-review-findings.js` in full (134 lines) to see which finding fields the only findings checker actually parses.
3. Grepped the whole `sk-code-review` packet for `riskScore|Scope proof|Finding class|scopeProof` (21 matches) to find every consumer of those fields, executable or otherwise.
4. Read `sk-code-quality/SKILL.md` lines 195–239 to see the envelope's own definition, its fixed status and the handoff sentence around it.
5. Read `hub-router.json` in full (83 lines) to test whether the router declares any payload a surface hands to review, and to re-read the tie-break line that I-2 cites.

No network fetch. Nothing under `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/` was read. No file under `.skilled/` was modified.

## Findings

### F1 — I-3: CONFIRMED, and stronger than stated

I-3 says the quality gate's evidence does not reach review by contract, and that the review packet names no reader. Both halves survive, and the second is stronger than the original wording: the absence is framework-wide, not packet-local.

- OBSERVED. The envelope is defined in the producer only. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:210] `CODE_QUALITY_RESULT v1` — and the field list begins immediately below it.
- OBSERVED. The two fields I-3 cites are real and named exactly as claimed. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:215] `checklists_loaded: <checklist paths loaded, or none>` and [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:216] `checker_outputs: <comment-hygiene and dist-staleness results, or N/A>`.
- OBSERVED. The producer forbids the envelope from reading as a verdict, which is why a reader would have to interpret rather than match it. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:223] ``its `status` is fixed to `advisory` ``.
- DERIVED. The whole-`.skilled/` grep for `CODE_QUALITY_RESULT`, `checklists_loaded` and `checker_outputs` returned exactly three matches, all three at lines 210, 215 and 216 of the producer file. Zero matches in `sk-code-review/`, zero in `.skilled/agents/`, zero in `.skilled/commands/`, zero in the hub router files. A consumer that named the envelope would have matched one of those three tokens.

Why this matters beyond a tick: the original claim scoped the gap to `sk-code-review`. The grep scopes it to the framework. A reader added only inside the review packet would leave `@review` and `@deep-review` (the two agents that also run review) with the same hole, so the fix belongs wherever both agents load from — `references/review-core.md` or a hub-level resource, not `SKILL.md` alone.

**Rank 6 verdict:** the premise the dispatch attributes to rank 6 — review names no reader for the envelope — is CONFIRMED by the same evidence. The row's own recommendation text and its other columns were **NOT TESTED** this iteration: the ranked table begins at line 77 of `research.md` and only its first row fell inside the read window. Treat the premise as confirmed and the proposed fix as still unexamined by this lens.

### F2 — U-9: CONFIRMED as written, with one refinement that changes the conclusion

U-9 says finding class, scope proof and riskScore add prose no checker reads, and recommends keeping them as reasoning fields and advisory. The "no checker reads them" half is confirmed by two independent routes. The recommendation that follows from it is too strong, because something does read them.

- OBSERVED. The findings checker's parsed record has exactly two fields, and neither is class, scope proof or riskScore. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:52] `findings.push({ number: Number(numbered[1]), hasCase: false });`
- OBSERVED. The only content regex besides numbering is the Case line. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:23] `const CASE_LINE = /^\s*- Case: \S/;`
- OBSERVED. Failure is emitted only for skipped numbering and a missing Case line. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:75] `if (!finding.hasCase) {`
- DERIVED. The 21 matches for `riskScore|Scope proof|Finding class|scopeProof` across the packet land in `references/review-core.md`, `SKILL.md`, `README.md`, `assets/fix-completeness-checklist.md` and five `manual-testing-playbook/` files. Not one lands under `scripts/`. Combined with the full read of the findings checker, no executable checker reads the three fields.
- OBSERVED, and this is the refinement. The manual playbook does read them, as pass/fail criteria. [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/class-of-bug-vs-instance-only.md:33] `FAIL if no scopeProof is provided`, and [SOURCE: .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/p0-blocker-with-file-line.md:49] `Add findingClass and scopeProof`. The fields are also a required artifact of the fix-completeness asset. [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:101] `- Finding class table.`

So the accurate statement is: the three fields are **un-automated, not un-consumed**. U-9's factual half stands; its implied remedy ("keep as reasoning fields") would delete a contract the playbook depends on. The gap is narrower and more fixable than either reading suggests — the fields have a written consumer and no machine check, so the missing piece is one assertion in `check-review-findings.js`, not a redesign of the schema.

The schema itself is unambiguous about advisory status, which supports keeping riskScore out of any gate. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:106] `` | `riskScore` | Optional advisory number for relative risk calibration; never gating and never a substitute for `severity` | ``.

### F3 — E-3: the router half is CONFIRMED, the exchange half is NOT TESTED (nothing declares it)

E-3 is a three-part proposal. Only one part is a statement about a file, and only that part can be tested here.

- OBSERVED, CONFIRMED. The router declares the surface relationship as strictly one-directional: surfaces travel with a workflow mode as read-only evidence, ordered after it. [SOURCE: .skilled/skills/sk-code/hub-router.json:11] `"surfaceBundle": "one workflow mode primary plus zero-or-more surface packets as read-only evidence, workflow ordered first then surfaces"`. A surface has no return channel by construction, which is the structural basis for E-3's "a security surface needs nothing back".
- DERIVED. The same line is the *only* statement of the relationship, and it names no fields. "Read-only evidence" is a category, not a schema. Nothing in `hub-router.json` says what a surface hands review — no bounded-check list, no scope-hint field, no severity-override slot. So E-3's "a security surface should hand review bounded checks and scope hints" is a proposal with no current counterpart on disk: **NOT TESTED** as a documented contract, and INFERRED as a design.
- NOT TESTED. The review-side requirements in E-3 (keep the `CODE-REVIEW` marker, keep the shared severity meanings, keep the baseline minimums) rest on I-7 and I-8. Neither was re-opened this iteration, and the marker question in particular is the one that needs a route replay, not a read.
- NOT TESTED. E-3's other citation, `.skilled/skills/sk-code/mode-registry.json:18` `read-only domain-evidence packets`, was not opened this iteration. The hub-router line independently supports the same reading, so the conclusion is not at risk, but the citation itself is unverified by this lens.

Side confirmation while reading the router: I-2's tie-break citation is intact. [SOURCE: .skilled/skills/sk-code/hub-router.json:7] `"tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-ci", "sk-code-skilled"]`. The line now carries all four modes, so the citation still resolves but the array has grown since I-2 was written; a quote that stops after two entries would be stale.

### F4 — DERIVED. The three results share one shape, and it is the useful output of this iteration

All three claims describe a producer with no declared consumer: an envelope with no reader (F1), fields with no machine check (F2), evidence with no schema (F3). In each case the artifact exists, is documented, and is checked by nothing on the receiving side. That is a single integration defect appearing three times, and it suggests one remedy rather than three: a consumer-side contract file that names, per handoff, what the receiver must read. This is INFERRED — a fixture with a real quality-then-review run and a real user surface would confirm whether the runtime already bridges any of the three informally.

## Ruled Out

- **Re-reading `research.md` to check the claims.** Rejected: the point of a second-model pass is to test the claim against disk, not against the prior model's prose. `research.md` was read once for claim text and not used as evidence.
- **Treating the grep's zero-match as proof of no reader.** Rejected as stated, kept as evidence with a caveat: a zero match proves no file *names* those tokens. A reader that consumes the envelope under a different name would not be caught. The conclusion is safe here only because the envelope's own token is distinctive and the producer's surrounding prose names no alias.
- **Reading `mode-registry.json` for E-3.** Deferred to stay inside the tool budget. The hub-router line covers the same question, so the deferred read costs confidence in a citation, not in the conclusion.

## Dead Ends

None. All five actions returned usable evidence, and no action had to be retried.

## Edge Cases

- **Ambiguous input:** none. The dispatch named three claims and their test method.
- **Contradictory evidence:** one, resolved. U-9's "no checker reads them" and the playbook's `FAIL if no scopeProof is provided` are both true and pull in opposite directions if read as "nothing consumes the field". Resolved by separating *executable* from *manual* consumers; both are recorded above rather than one being dropped.
- **Missing dependencies:** none.
- **Partial success:** none, but one deliberate partial: rank 6's recommendation row was outside the read window and is marked NOT TESTED rather than inferred from its premise.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:210`, `:215`, `:216`, `:223`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:23`, `:52`, `:75` (full file read)
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md:106`
- `.skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:101`
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/class-of-bug-vs-instance-only.md:33`
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/p0-blocker-with-file-line.md:49`
- `.skilled/skills/sk-code/hub-router.json:7`, `:11` (full file read)

## Questions Answered

No new strategy key question was opened. Three previously answered questions were re-verified at the evidence level, and their answers survive with one correction:

- **Q3 (output contract):** the Case line is the only finding field any checker reads; class, scope proof and riskScore are contract fields with manual-only enforcement. The answer to "signal or ceremony" changes from "ceremony" to "signal that is not machine-enforced".
- **Q6 (review and quality boundary):** the boundary is confirmed as one-way. Quality emits, review does not read, and no framework file names the envelope as an input to anything.
- **Q9 (user-authored modes):** a surface's relationship to review is read-only evidence with no declared payload, so the integration row that would carry a payload does not exist yet.

## Questions Remaining

- **UNKNOWN (carried, narrowed).** Does the live runtime bridge any of the three handoffs informally — does an orchestrator paste the envelope into a review prompt, or does a reviewer read the playbook fields by habit? F1–F3 establish that no *file* declares these readers. A live quality-then-review run would decide it. Carried from iterations 6 and 10.
- **Open (new).** Rank 6's recommendation row was not read. Its premise is confirmed; its proposed fix, effort and hub-file list are unexamined by this lens and should be re-read in iteration 14 or 15.
- **Open (carried from iteration 11).** Would replacing the two-value surface label (rank 7) break the report-format consumers named in I-7? Still not re-tested.
- **Open (carried from iteration 9).** Can a real user-authored surface mode route into review and exchange evidence or findings? E-3's answer is "there is no schema to exchange", which sharpens the question but does not close it.
- **State discrepancy (carried, untouched).** The dispatch context still lists Q2–Q9 as open while the strategy marks them answered. This iteration does not touch reducer-owned state.

## Assessment

- New information ratio: 0.20
- Novelty justification: of four findings, one is materially new (F2's manual-consumer refinement, which inverts U-9's implied remedy), one is a scope widening of an existing claim (F1's framework-wide absence versus packet-local), one is a negative result with a structural reading (F3's "read-only evidence" has no schema), and one is synthesis across the three (F4). Nothing else in the packet moved.
- Questions addressed: I-3, rank 6 premise, U-9, E-3
- Questions answered: I-3 CONFIRMED; U-9 CONFIRMED with refinement; E-3 partially CONFIRMED (router half), NOT TESTED (exchange half); rank 6 premise CONFIRMED, recommendation NOT TESTED

## Reflection

- **What worked and why:** searching the whole `.skilled/` tree rather than the review packet is what turned I-3 from a packet-local observation into a framework-wide one. The grep's scope was the finding. Reading the findings checker end to end rather than grepping it was what exposed the two-field parse at line 52 — a grep for `class` would have matched prose in the same file and taught nothing about what is parsed.
- **What did not work and why:** the first pass on U-9 would have stopped at "no script matches", which is true and misleading. The packet-wide grep that found the playbook's `FAIL if no scopeProof` rows was the step that changed the conclusion. Absence in `scripts/` was never the whole question; the question was whether anything consumes the field.
- **What I would do differently:** read the ranked table's remaining rows before choosing tests. I tested a claim the dispatch quoted rather than the row it lives in, so rank 6's actual proposal is now a known gap in this iteration's coverage. One extra read at the start would have avoided it.

## Recommended Next Focus

Iteration 14, second-model re-check 4 of 5. Two candidates, in order:

1. **The remaining INFERRED and DERIVED rows not yet re-checked by this lens** — I-5 (the report template's two-value surface label), I-7 (the three external consumers), E-4 (proving a change needs both routing stages), and RA-4, RA-7, RA-9 among the derived repo-bound rows. These carry the most implementation risk if wrong, because ranks 1, 2 and 7 depend on them.
2. **The ranked table rows 2–10**, which this iteration established are not covered by any re-check slice so far. Row 6's premise is confirmed but its text is unread; rows 2 and 7 rest on claims that have been re-tested only indirectly.

Do not re-test F1–F3 in iteration 14; they are settled at the file level, and the only thing that would move them is a live run, which is a scenario task rather than a read.
