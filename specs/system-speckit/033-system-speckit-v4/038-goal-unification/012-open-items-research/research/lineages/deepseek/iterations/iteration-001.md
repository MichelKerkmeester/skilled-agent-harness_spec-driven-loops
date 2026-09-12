# Iteration 1: Line length, measured repo-wide

## Focus

Ring 1 of the packet strategy: measure the real line-length distribution across the repository,
not just the goal files, and decide whether the 100-character limit is a live standard, a dead
one, or one that needs a stated exemption. The recommendation must be enforce, exempt, or retire,
with the change that implements it.

## Findings

**F1. No prose line-length rule exists anywhere in the repository.** A search for markdown-lint
configuration finds no `.markdownlint*` file outside `node_modules`, no MD013 setting, and no
prose-width rule in `.opencode/skills/sk-doc/` or `repo-rules/`. The only declared 100-character
maxima in the tree are language style guides for code, and they govern source, not markdown:
`.opencode/skills/sk-code/sk-code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md:77`
(`- **Maximum**: 100 characters`),
`.opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:278`, and
`.opencode/skills/sk-code/sk-code-opencode/references/python/style-guide.md:447` (88-100 target).
The sk-doc family carries no style-guide file at all. **CLAIM:** the "style guide's 100-character
limit" the packet strategy cites for four markdown goal files does not exist as a prose rule; the
number was borrowed from a code-style guide that does not govern the artifact class it was applied
to. [SOURCE: measured by `find`/`rg` over the tree, 2026-09-12]

**F2. The markdown corpus wraps near 100 characters but does not honor 100 as a limit.** Measured
by counting lines longer than 100 characters in every markdown file in each class:

| Class | Files | Lines | Lines >100 | Share |
|---|---|---|---|---|
| Root docs (`README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `PUBLIC-RELEASE.md`, `REPO RULES.md`, `BARTER.md`) | 6 | 2,778 | 749 | 27.0% |
| `repo-rules/*.md` | 11 | 1,884 | 72 | 3.8% |
| `.opencode/hooks/*.md` (root + goal) | 5 | 1,006 | 299 | 29.7% |
| `.opencode/plugins/**/*.md` | 3 | 385 | 87 | 22.6% |
| `.opencode/skills/system-spec-kit/references/**/*.md` | 41 | 13,009 | 1,264 | 9.7% |
| All `.opencode/skills/**/*.md` (excl. changelog/node_modules) | 4,000 | 518,400 | 74,051 | 14.3% |
| `specs/**/*.md` (excl. lineages) | 2,983 | 609,634 | 141,744 | 23.3% |

The repository's actual prose habit is to wrap at roughly 100 columns and let tables, links,
checklists and code spans exceed it, so a hard limit at exactly 100 flags between 4% and 30% of
every class. [SOURCE: `awk 'length($0)>100'` over each class, 2026-09-12]

**F3. The goal documents sit at or above the corpus rate.** Per file, lines over 100 / total:

| Document | Over 100 | Total | Share |
|---|---|---|---|
| `.opencode/hooks/goal/goal-plugin.md` | 72 | 177 | 40.7% |
| `.opencode/hooks/README.md` | 71 | 257 | 27.6% |
| `.opencode/hooks/injection-contract.md` | 77 | 279 | 27.6% |
| `.opencode/hooks/goal/README.md` | 52 | 196 | 26.5% |
| `.opencode/plugins/README.md` | 43 | 153 | 28.1% |
| `.opencode/skills/.state/goal/README.md` | 35 | 124 | 28.2% |
| `specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md` | 35 | 138 | 25.4% |
| `.opencode/hooks/shared/README.md` | 35 | 139 | 25.2% |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | 13 | 150 | 8.7% |
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | 1 | 125 | 0.8% |

So the strategy's observation that the goal files are long-lined is true, but the rate is ordinary
for this repository, not an outlier. [SOURCE: per-file counts, 2026-09-12]

**F4. The strategy's "365 lines across the four goal files" does not reproduce.** No natural
four-file set sums to 365: the four goal-engine documents (engine README 52 + `goal-plugin.md` 72
+ `.state/goal/README.md` 35 + playbook 13) are 172; the four worst of the seven documents the
contract test pins (`goal-plugin.md` 72 + advisor playbook 55 + cli-opencode playbook 46 +
spec-kit playbook 29) are 202; all thirteen `goal.md` files in the 036 tree are 118; the four worst
goal-named documents anywhere in `.opencode` are 225. **UNKNOWN** which four files the author
measured and why the count is 365; the count may predate shortening in the remediation commits
(`dfb4aee666`, `2f91a9362b`). Settling action: ask the strategy author for the file set, or
recover it from that session's own record. The unreproducibility is itself evidence for the ring's
thesis: a prose budget nobody can re-measure is not a standard. [SOURCE: `python3` combination
search over the measured per-file counts, 2026-09-12]

**F5. Code long lines are consistent across the shipped plugins, not drifted.** `.opencode/plugins/*.js`
lines over 100: `sk-vision.js` 629/13,911 (4.5%), `opencode-goal.js` 210/3,385 (6.2%),
`system-skill-advisor.js` 48/1,476 (3.3%), `system-dist-freshness-guard.js` 19/236 (8.1%),
`sk-communication-projection.js` 17/389 (4.4%). Every plugin has some, none has none, and none is
an order-of-magnitude outlier; the same holds for the goal engine sources (`goal-core.cjs`
109/1,636, `bin/goal.cjs` 33/440, `goal-slice.cjs` 13/360). The unpublished 100-character code
maxima are treated as an aspiration the whole codebase shares, evenly. [SOURCE: per-file counts
over `.opencode/plugins/*.js` and `.opencode/hooks/goal/**`, 2026-09-12]

**F6. Enforcing the limit repo-wide is a mass rewrite, not a cleanup.** The measured walkable
classes alone hold about 216,500 lines over 100 characters (skills 74,051 + specs 141,744 + root
docs 749 + hooks 299 + plugins 87). Any gate added at 100 fails on the first run in every class
measured, and the remediation would be a mechanical rewrap of roughly a third of a million lines,
including tables and link rules that cannot be rewrapped without changing rendering. [SOURCE:
summed from the counts in F2, 2026-09-12]

## Sources Consulted

- `.opencode/skills/sk-code/sk-code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md:77`
- `.opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:278`
- `.opencode/skills/sk-code/sk-code-opencode/references/python/style-guide.md:447`
- `find . -maxdepth 3 -name '.markdownlint*'` and `rg -n "MD013"` — no hits outside `node_modules`
- Class-wide line counts over root docs, `repo-rules/`, `.opencode/hooks/`, `.opencode/plugins/`, `.opencode/skills/`, `specs/`
- Per-file counts for the goal engine documents, the contract-test document set, and all `goal.md` files in the 036 tree
- Combination search (`python3`) over per-file counts to test the 365 claim
- `.opencode/hooks/goal/goal-plugin.md`, `.opencode/hooks/goal/README.md`, `.opencode/skills/.state/goal/README.md`, `.opencode/hooks/README.md`, `.opencode/hooks/injection-contract.md`

## Assessment

**newInfoRatio: 1.0.** First iteration against an empty lineage registry; every finding is new,
and two of the six correct the premise rather than extend it: the cited standard does not govern
prose (F1), and the cited count does not reproduce (F4).

**Novelty justification:** the ring had never been measured in this repository. The prior
repo-wide lineage recorded the long-line observation as a premise in §4 of its synthesis, never as
a measurement.

**Confidence:** F1, F2, F3, F5 and F6 are observed command output (counts and greps, exit 0).
F4's non-reproduction is observed; the reason is UNKNOWN and named. The judgement that a
100-character prose limit is not worth enforcing is a CLAIM built on F1, F2 and F6.

## Reflection

**What worked.** Counting the whole class rather than the named files moved the finding from
"these files are long" to "the repository has no prose width standard and behaves as if it has
none". The premise check — searching for the rule before measuring against it — found that the
rule does not exist in prose form at all; measuring first and searching later would have produced
a survey of files that fail a rule nothing states.

**What failed.** Testing the strategy's 365 against candidate four-file sets was a guess stacked
on a guess. The result disproved the number but could not recover its provenance, because the
strategy records no file list. A claim with no file list cannot be checked, and that is now a
finding instead of a nuisance.

**Ruled out.** (a) A repo-wide 100-character lint: 216,500 failing lines, including tables and
link lines that cannot be rewrapped safely — the cost lands on prose maintenance and buys nothing
observable. (b) A goal-docs-only line budget: nothing breaks when a goal line is 104 characters,
so the check would fail for no reason an operator cares about. (c) An exemption note in the goal
documents: it would give standing to a rule nobody enforces and that no other document cites.

## Recommended Next Focus

Ring 2 — the unowned surfaces: verify the eight-item inventory from the prior synthesis against
the current tree, name an owner, a deletion or a generator for each, and separate duplication that
is cheap and consistent from duplication that has already drifted.

---

## Recommendation (ring 1)

**Retire the 100-character limit as a prose standard.**

- **What it means.** Keep the code-style maxima where they are, as declared guidance for source
  files. Do not add a markdown lint, a goal-document budget, or an exemption clause. Treat line
  width in prose as a wrapping habit around 100 columns, not a rule.
- **Cost.** Zero file changes. The only artefact this ring needs is the decision recorded; if the
  operator wants it discoverable in the goal surface rather than only in this research packet, the
  smallest edit is one sentence in `.opencode/hooks/goal/README.md`, and this research recommends
  against even that: the document would then carry a rule it does not need.
- **Blast radius.** None today — nothing in the repository enforces, cites or tests a prose width
  rule, so retiring it changes no behaviour and no test. It prevents a future one: without this
  decision the next session that reads the 365 figure has no way to re-measure it.
