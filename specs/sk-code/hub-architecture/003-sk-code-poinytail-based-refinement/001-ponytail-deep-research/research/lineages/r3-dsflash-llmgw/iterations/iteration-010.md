# Iteration 10: Review scripts on crafted inputs

## Focus

Part 2, fifth slice: the review scripts' real behaviour on inputs, including inputs a foreign repository would produce, and whether their README's claims survive execution. This follows iteration 9's Recommended Next Focus.

## Actions Taken

1. Read `check-review-final-line.js`, `check-review-findings.js` and `scripts/README.md` in full.
2. Built four review outputs under this lineage's `scratch/` folder: the `review-core.md` suggested finding shape, the mode template's list shape, a double-space `Not checked:` line, and a trailing space on the status line.
3. Ran `check-review-findings.js` and `check-review-final-line.js` against each, reading output and exit status.
4. Compared every observed rejection and acceptance against the README's row for that checker.

## Findings

1. **The findings checker cannot see the finding shape its own doctrine prescribes, so that shape passes vacuously.** `review-core.md` §7's suggested shape writes a finding as a heading with the number inside it (`### 2 [P1] Missing authorization check`) followed by `- Case:` etc. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:110]. `check-review-findings.js` matches numbered findings only as list items (`/^(\d+)\. \S/`) [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:19]. Run against a faithful `review-core`-shaped review, the checker printed `OK: no numbered findings to check` and exited 0 [observed command output], while the same review in the mode template's list shape is checked line by line. The README's own claim — it "checks each numbered finding under `## Findings`" [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/README.md:21] — is false for one of the two shapes the packet documents, and the doctrine's example even starts at `### 2`, which the list-shape checker would reject as a skipped number if it could see it. Reproducing case: `node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <review-core-shaped-review>` prints `OK: no numbered findings to check`, exit 0. NEW, P1 (the checker's whole purpose is the `Case:`/numbering guarantee; half the documented format skips it).
2. **A double space after `Not checked:` is rejected with a message that claims the line is absent.** The checker requires the line above the blank to match `^Not checked: \S` [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:81]. A review with `Not checked:  two spaces after colon` failed with `FAIL: no "Not checked:" line above the status line` and exit 1 [observed command output], although the README describes the requirement only as "must start with `Not checked:` followed by text" [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/README.md:20]. The rejection is defensible under the exact-string contract; the message and the README's wording are not, because the reviewer is told no such line exists while it is right there. Reproducing case: the two-space sample above. NEW, P2 (strictness beyond its own documentation, with a misleading failure message).
3. **The final-line checker's documented behaviour reproduces exactly.** Trailing space on the status line failed with `final line is not an exact status line` and exit 1; the blank-line and `Not checked:` placement rules held; a skip status must be the whole output, matching the README row [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/README.md:20]. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- Key question 7 is answered for the checker leg: the scripts are repo-independent readers, and their behaviour is correct on the list shape; the defect is the uncovered doctrine shape and one over-strict message. The "what would make the logic stronger" proposal is in Finding 1's fix direction.

## Questions Remaining

- Do the review mode's shared-layer integration points and the hub's review bundling need anything beyond the surface-vocabulary fixes already filed?

## Ruled Out

- **"File the `### 2` example numbering as a checker bug."** The checker's start-at-1 rule is correct for the template shape; the defect is the shape split, filed as Finding 1.
- **"File the checker's quoted-`Not checked:` count as a new defect."** Phase 007 recorded it as a known limitation with a named cause; not re-filed.
- **"Exercise `check-rule-copies.js` against a foreign tree."** It checks this repository's files by design and is already run by the harness; running it here would only re-assert the canary's own suite.

## Dead Ends

- Both checkers handle stdin and missing files with exit 2 and a cause line; the README rows for those match the code [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:105].
- CRLF input is normalized before the final-line checks; no defect found on that path.

## Edge Cases

- Ambiguous input: whether the two documented shapes are deliberate (template for output, review-core for schema). Chosen interpretation: deliberate formats, one checker; the checker must cover both or the packet must pick one.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js`
- `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js`
- `.skilled/skills/sk-code/sk-code-review/scripts/README.md`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/scratch/{review-core-shape,template-shape,two-space,trailing-space,quoted-nc}.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.90 (two fully new findings from executed inputs, one ALREADY-ADOPTED verification).
- Questions addressed: key question 7 (checker leg).
- Questions answered: key question 7's checker leg.

## Reflection

- What worked and why: writing the two documented finding shapes as actual files and running the checker on each. The coverage gap is invisible from reading either document alone.
- What did not work and why: the first run used a wrong relative depth and failed with MODULE_NOT_FOUND; the path was corrected by counting the lineage depth, and the failed runs are recorded here rather than hidden.
- What I would do differently: resolve the repo root once per iteration (`git rev-parse --show-toplevel` is read-only) instead of counting `../` segments per command.

## Recommended Next Focus

Part 2 closes with the review mode's integration into shared and the surfaces, plus the strongest "what would make the review logic stronger" proposals.
