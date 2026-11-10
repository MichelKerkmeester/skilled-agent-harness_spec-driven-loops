# Iteration 7: Review mode internal agreement

## Focus

Part 2, second slice: do the review mode's contract, checklists, references and playbook agree with one another? This iteration reads the four reference files that the mode always or conditionally loads (`review-core.md`, `review-ux-single-pass.md`, `quick-reference.md`, `pr-state-dedup.md`) and cross-checks every claim against `SKILL.md`'s output contract, then tests the one cross-skill pointer the quick reference declares.

## Actions Taken

1. Read `review-core.md`, `review-ux-single-pass.md`, `quick-reference.md` and `pr-state-dedup.md` in full.
2. Cross-checked the finding schema, severity definitions, precedence matrix and skip behaviours against `SKILL.md` §§2-4 and §9 field by field.
3. Followed `quick-reference.md`'s cross-skill pointer into `system-deep-loop/deep-review/assets/review-mode-contract.yaml` and compared ownership claims.
4. Checked the M-1 cache path against the mode's codebase-agnostic claim and swept every file that names it.
5. Compared the two status vocabularies the mode uses (assessment tokens versus the final-line strings).

## Findings

1. **The M-1 cache writes into `.skilled/`, a repository-specific brand directory, in a mode meant for any codebase.** The live contract puts the dedup cache at `.skilled/.code-review-cache/<repo-ref>.jsonl` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:491] and repeats it in the reference and the README [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:41] [SOURCE: .skilled/skills/sk-code/sk-code-review/README.md:137]. Reviewing a foreign repository therefore creates a `.skilled/` directory at that repository's root as the cache's host — a directory the target repo does not own and its maintainers did not ask for. The mode's own rationale section explains why a hidden cache is desirable but not why the host directory must be this repository's brand [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:76]. Reproducing case: run any full review with M-1 enabled against a repository without a `.skilled/` directory; the documented write path creates one. NEW, P2 (agnosticism leak with a documented side effect on the reviewed repo; a neutral cache root or OS temp path fixes it without touching the keying).
2. **Two documents each claim to be the source of truth for the deep-review taxonomy, and they do not point at each other from the other side.** `review-core.md` says it is "shared doctrine consumed by both `@review` and `@deep-review`" [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:18], while `quick-reference.md` sends readers to `system-deep-loop/deep-review/assets/review-mode-contract.yaml` as "the canonical review-mode contract manifest (source of truth for deep review taxonomy)" [SOURCE: .skilled/skills/sk-code/sk-code-review/references/quick-reference.md:61]. The contract is a real 488-line manifest with its own severity math and evidence rule [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:121], and nothing in the review mode states which document wins when the two disagree — for example on the finding fields. Reproducing case: `rg -n "source of truth|canonical" .skilled/skills/sk-code/sk-code-review/references/` prints the quick-reference row while `review-core.md` carries the other claim, and neither file mentions the other's authority. NEW, P2 (dual ownership without a reconciliation rule; the deep-review contract is an external consumer surface). The known gap between the contract's file:line-only evidence rule and the review `case` field is phase 009's in-flight amendment target and was not evaluated further.
3. **The mode uses two near-identical status vocabularies, and only one of them is the machine-parsed one.** `review-ux-single-pass.md` tells the reviewer to include `APPROVE`, `REQUEST_CHANGES`, or `COMMENT` "after the findings" [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md:64]; those are the overall-assessment tokens of the summary block [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:337]. The mandatory final line uses the different strings `Review status: APPROVED`, `Review status: REQUESTED_CHANGES`, `Review status: COMMENTED` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:369], and downstream automation exact-matches that line [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:398]. An author who follows the UX file's wording into the status line emits a near-miss the parser rejects. Reproducing case (run): a scratch review whose body ends `Not checked: nothing material` followed by `Review status: APPROVE` was fed to the mode's checker; it printed `FAIL: final line is not an exact status line: "Review status: APPROVE"` and exited 1, while the UX reference's vocabulary is what suggested the token. The scratch file was temporary inside this lineage and is not part of the packet. NEW, P2 (documentation footgun on an exact-string contract; one sentence in the UX file fixes it).
4. **The mode's schema, precedence and skip contracts agree across the four references and the SKILL.** Checked pairs: the `case` field and "a finding with no case is not reported" [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:97] against the output template [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:345]; the cross-group `id` [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:94] against the numbering rule [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:311]; the workload note [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:99]; the precedence rules [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:71] against the precedence matrix [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:107]; the M-1 signature and skip text [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:22] against §9.1 [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:485]. All agree. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- Key question 6 is answered for the references leg: the doctrine files agree with the SKILL contract; the disagreements are the two status vocabularies and the dual ownership claim, both filed. The checklists and playbook legs move to the next iterations.

## Questions Remaining

- Do the six asset checklists' severity rows match the P0/P1/P2 definitions in `review-core.md`?
- Does the playbook's scenario set still match the files it tests?

## Ruled Out

- **"File the changelog's old cache path as a contradiction."** Changelogs record history; phase 002's decision excludes them from live-contract searches, and the entry describes the predecessor design.
- **"File review-core's ordering section as missing the numbering rule."** Ordering by severity and numbering once across groups are compatible; the schema carries the numbering.
- **"Compare review-core's `case` field against the deep-review contract now."** That gap is the phase 009 amendment target (steer ruling 2); only the ownership question was filed.

## Dead Ends

- `quick-reference.md`'s reference map and supporting-checklist rows match the files on disk one for one; no orphan row.
- `pr-state-dedup.md`'s signature computation matches SKILL.md §9.1 byte for purpose; no drift.

## Edge Cases

- Ambiguous input: whether the M-1 cache is a target-repo artifact or a reviewer-side artifact. Chosen interpretation: the documented path makes it a target-repo artifact, which is why the brand-directory side effect is filed.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-code/sk-code-review/README.md`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md`
- `.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md`
- `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md`
- `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md`
- `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.88 (three fully new findings, one ALREADY-ADOPTED agreement matrix).
- Questions addressed: key question 6 (references leg).
- Questions answered: none fully.

## Reflection

- What worked and why: following the quick reference's cross-skill pointer instead of treating it as an index row. It led to a real 488-line manifest that the mode silently shares ownership of.
- What did not work and why: the first pass compared documents pairwise and found only agreement; the two vocabulary tokens and the cache path only surfaced when each document was read for what it asks the *reader* to do, not for what it states.
- What I would do differently: for every exact-string contract, grep the packet for all near-miss spellings before reading the files that mention it.

## Recommended Next Focus

The asset checklists against `review-core.md`'s severity definitions, then the review agent against the mode.
