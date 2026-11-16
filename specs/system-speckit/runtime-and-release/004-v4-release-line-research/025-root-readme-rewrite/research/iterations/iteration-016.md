# Iteration 16: Count and Citation Contradictions the Rewrite Would Inherit

## Focus

All five key questions are answered and strategy §11 reads "[All tracked questions are resolved]", so no dispatch focus was supplied. The narrowest evidence-backed interpretation was chosen: reconcile the numeric and citation claims that the packet's own documents disagree on, because a rewrite built from the synthesis inherits whichever number it reads first.

Three specific collisions exist between `research.md` (which covers iterations 1-5) and the iteration files (6-15):

1. Skill count — `research.md` §5D says the root catalog "undercounts by one" and implies 15 skills; iteration 15 says 14 is correct because `local-webflow` is an external symlink.
2. Command count — `research.md` §5C says 44; `README.md:1174` says 45.
3. Citation lines — §5D cites README line 15 for the six-runtime sentence and line 805 for the "14 skills" sentence.

Deferred alternatives: a broad Q4 re-audit (blocked since iteration 10) and an independent re-count of skills and templates (blocked in iterations 6, 11 and 14). The counts below were read as a by-product of the tracking check that resolves collision 1, not as a fresh count for its own sake.

## Actions Taken

1. Read `deep-research-config.json`, the 15 iteration records in `deep-research-state.jsonl`, `deep-research-strategy.md` and the top-level keys of `findings-registry.json` (no open questions, no conflict list).
2. `ls -ld` on `.skilled/skills/local-webflow` and `.skilled/skills/sk-design`; `git ls-files` over `.skilled/skills` and over `local-webflow`; per-directory `README.md` and `ROUTER.md` existence tests.
3. Depth-banded `git ls-files` over `.skilled/commands` (`NF-2` = 1, 2, 7-11) plus `.opencode/commands`, to separate command documents from deeper reference markdown.
4. Read `README.md` lines 13-17, 182-186, 800-810 and 1170-1176; located the `Node.js` and `45 commands` lines.
5. Compared the measured numbers against `research.md` §5B, §5C and §5D.

## Findings

### F1 (P1) — The shipped skill count is 14; §5D's undercount conclusion is superseded

`README.md:801` says "14 skills in `.skilled/skills/`" and that number is correct for the shipped tree. `git ls-files .skilled/skills` resolves to exactly 14 skill directories plus `.state` and `README.txt`. The fifteenth directory, `local-webflow`, is a symlink to an absolute path outside the repository and contributes zero tracked files. `research.md` §5D's conclusion that the catalog "undercounts by one" counted the working tree, not the shipped tree, and must not be propagated into the rewrite. [SOURCE: README.md:801] [SOURCE: .skilled/skills] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:154]

### F2 (P2) — §5D's README line citations are wrong

The six-runtime sentence is `README.md:16`; line 15 is blank. The "14 skills" sentence is `README.md:801`; line 805 is the `#### SYSTEM` heading. The Node-version citation carried in strategy §9 (`README.md:164`) does match, so this is citation drift specific to §5D, not a uniform offset. A rewrite brief must re-derive README line numbers rather than quote §5D's. [SOURCE: README.md:16] [SOURCE: README.md:801] [SOURCE: README.md:805] [SOURCE: README.md:164] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:148]

### F3 (P1) — The 45-command total is correct only at total scope

45 command documents are tracked: 44 markdown files at depth 2 under `.skilled/commands/` (doctor 17, create 13, speckit 8, design 3, deep 2, prompt 1) plus the tracked `.opencode/commands/goal-opencode.md`. `README.md:1174`'s total of 45 is therefore correct, and §5C's "44 total" is the `.skilled/commands/` scope rather than a contradiction. The prose split "43 in six groups plus two utilities" is not reproducible by folder arithmetic — the six group folders hold 44 — so the rewrite should state 45 and name the two utilities rather than restate 43 + 2. [SOURCE: .skilled/commands] [SOURCE: .opencode/commands/goal-opencode.md] [SOURCE: README.md:1174] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:118]

### F4 (P2) — Recursive markdown counts overstate the command surface

`git ls-files '.skilled/commands/**/*.md'` returns 89, not 44, because 45 additional markdown files sit at depth 7-11 inside command subfolders (references and assets). Command documents exist only at depth 2. A rewrite that counts markdown recursively would roughly double the stated command surface. [SOURCE: .skilled/commands]

### F5 (P2) — The README ownership gap belongs to `sk-design`, not to the symlink

14 of the 15 skill directories carry a `README.md`; the one that does not is `sk-design`, a tracked skill. `local-webflow` is the only directory without `ROUTER.md`. The shrink-map ownership gap is therefore a shipped-skill gap, and it is separate from the external-symlink exception. [SOURCE: .skilled/skills/sk-design] [SOURCE: .skilled/skills/local-webflow]

### F6 (P2) — The synthesis stops at iteration 5

`research.md`'s newest section is §5D (iteration 5); iterations 6-15 exist only as iteration files. A rewrite brief assembled from `research.md` alone would carry Q1, Q2 and Q5 but miss the Q3 hook map, the Q4 claim audit, the runtime matrix, the MCP registration topology, the executed install path and the link/anchor audit. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:63] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:166]

## Questions Answered

None newly. Q1-Q5 were already answered in iterations 1-8 and remain answered; this iteration resolved three contradictions among those answers rather than answering a new question.

## Questions Remaining

None tracked. Two bounded follow-ups are handed to the rewrite owner:

- Name the two utilities in the 45-command sentence, or drop the 43 + 2 partition; the tree does not declare which files are utilities.
- Fold iterations 6-15 into `research.md`; the synthesis is workflow-owned and outside this dispatch's write scope.

## Ruled Out

- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the four README regions its findings cite.
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The skill count here came from the git index during the tracking check, which is the evidence that resolves the §5D collision; it is not a second count of the catalog.

## Dead Ends

- **`ls .skilled/commands/**/*.md` without `globstar`.** It expands `**` as a single `*`, so it returned the correct 44 depth-2 command files while saying nothing about the 45 deeper markdown files. The number was right for the wrong reason.
- **`git ls-files '.skilled/commands/**/*.md'` as the command count.** Returns 89 because the pathspec recurses into reference folders.

## Edge Cases

- Ambiguous input: no dispatch focus was supplied. Selected interpretation recorded in Focus; the alternative blocked directions are listed under Ruled Out.
- Contradictory evidence: `research.md` §5D (15 skills, catalog undercounts) against iteration 15 (14 skills, symlink). Resolved in favour of the git index; both claims are cited above.
- Missing dependencies: none.
- Partial success: none for this iteration's evidence; the synthesis update is blocked by write scope, recorded under SCOPE VIOLATIONS.

## Sources Consulted

- `README.md:16`, `README.md:164`, `README.md:801`, `README.md:805`, `README.md:1174`
- `.skilled/skills` (directory listing, `git ls-files`, per-directory README/ROUTER tests)
- `.skilled/commands` (depth-banded `git ls-files`)
- `.opencode/commands/goal-opencode.md`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:63`, `:118`, `:148`, `:154`, `:166`

## Assessment

- New information ratio: 0.68
- Questions addressed: none new; three contradictions among the answers to Q2 and Q4 were resolved.
- Questions answered: none — Q1-Q5 were already answered and remain answered.

## Reflection

- What worked and why: asking which packet claim a rewrite would *copy* turned a resolved question set into a live one. The git index settled the skill count in the same call that proved the symlink, so the contradiction cost no extra evidence — a count-first pass would have produced "15 directories" and inherited §5D's error.
- What did not work and why: the first command-count read (`git ls-files` with a `**` pathspec) returned 89 and looked like a contradiction with both 44 and 45. The cause was pathspec depth, not a wrong number — the same class as the earlier `rg --files` under-count, where the counting instrument, not the tree, produced the anomaly.
- What I would do differently: band the depth before counting, every time. A count without its depth band is not a count of anything.

## Recommended Next Focus

Verify the remaining §5D line anchors the rewrite would quote — install at line 160, RELATED DOCUMENTS at line 1751, the 149-line positioning block and the 50.6% catalog share — since §5D has already produced two wrong line numbers (15 for 16, 805 for 801). The share figure sums from the same span list, so it should be re-derived rather than quoted.

## SCOPE VIOLATIONS

- **`research.md` synthesis update not executed.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-016.md` and `deltas/iter-016.jsonl`. The three contradictions resolved above are ready to fold into §5B, §5C and §5D; recorded here for the workflow owner.
