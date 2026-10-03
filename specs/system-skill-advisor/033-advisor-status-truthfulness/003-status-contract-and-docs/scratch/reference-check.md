# Re-measure of runtime/lib/scorer/lanes/explicit.ts (after the bound declaration landed)

`rg -n "^const TOKEN_BOOSTS|^};|^export const PHRASE_BOOST|review-plus-write-disambiguation|Review-plus-write intent|  git:|  readme:|'deep research'|'deep-research'|'chrome devtools'" explicit.ts`

- `TOKEN_BOOSTS` 27-107 (`git` sk-git 1 at 47, `readme` sk-doc 0.95 at 66)
- `PHRASE_BOOST_BOUND` comment and constant 108-113
- `PHRASE_BOOSTS` 115-246 (`chrome devtools` mcp-tooling 1 at 158; `deep research` system-deep-loop 1 at 185; `deep-research` system-deep-loop 1.3 at 189)
- review-plus-write block 313-322, push +3.0 at 321

Old citations in `references/scoring/advisor-scorer.md`: `:8-90`, `:92-186`, `:295-303`, plus the stale examples `deep research` to deep-research at 1.3 and `chrome devtools` to mcp-chrome-devtools. All replaced; `rg -n "mcp-chrome-devtools|explicit.ts:8-90|explicit.ts:92-186|explicit.ts:295-303" advisor-scorer.md` returns no match (exit 1).
