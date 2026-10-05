# Ledger: prevent-overengineering.md

Before 7374 B, after 7072 B, delta -302 B (-4.1%). Version 1.0.1.0 to 1.0.1.1. Stopped short of the 20-28% aim because the rest is operative: frontmatter, header, Fires when, the cost table, the signals table, the pre-write pass, the IS-NOT section and the self-check carry the norms, and the remaining prose is tests and failure statements.

| Part | Before B | After B | Action |
|------|----------|---------|--------|
| Frontmatter + title + header | 1026 | 1026 | Version bump only |
| Fires when | 398 | 398 | Kept verbatim |
| The rule | 337 | 307 | Cut one restatement from the gloss, bold sentence verbatim |
| 1. THE REVERSAL-COST ORDER | 1921 | 1793 | Cut one rationale tail and one provenance clause in the blockquote |
| 2. THE PRE-WRITE PASS | 484 | 484 | Kept |
| 3. TWO SIGNALS `AGENTS.md` DOES NOT CARRY | 401 | 401 | Kept |
| 4. SPECIFIC RESTRAINTS | 1641 | 1497 | Cut two rationale tails and one restatement |
| 5. WHAT THIS RULE IS NOT | 376 | 376 | Kept |
| 6. SELF-CHECK | 790 | 790 | Kept verbatim |

## Dropped sentences

- The rule: "The naming is the whole rule." (restatement, the norm lives in the bold binding sentence "Build the bigger thing only after naming what fails at the smaller one.")
- §1 ", because where that file sits is each repository's own business" (rationale)
- §1 "Naming a "rung 2" here would mean something different there, which is exactly the confusion this section stopped causing." shortened to "A "rung 2" named here would mean something different there." (provenance, the clause "which is exactly the confusion this section stopped causing" is the history. The failure statement is kept)
- §4 Abstraction: ", and duplication is cheaper to fix than the wrong seam" (rationale)
- §4 Defensive checks: ", and they will code around a ghost" (rationale)
- §4 Dependencies: "A new one is the costliest move in §1, needs its climbing sentence," (restatement, the cost position lives in the §1 table row "Add a dependency" and the climbing-sentence requirement in §1 "Take a costlier one only by writing the sentence that says what fails at the cheaper one")
- §4 Dependencies: "takes the `blast-radius.md` pass too, installing mutates the environment" rephrased to "also takes the `blast-radius.md` pass, because installing mutates the environment" (no content cut, rephrased around the removed restatement)
