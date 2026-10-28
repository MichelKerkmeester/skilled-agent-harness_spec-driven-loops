# Baseline: Standalone skills

Recorded on 2026-10-28 from the worktree at `9fdae0b7d4` (main after the sk-design and system-deep-loop hub move), before any phase edit.

## 1. Gates

All 39 gates exit 0: seven `parent-skill-check` runs, the compiled-route guard and sync check, `verify-router-sync`, fourteen `package_skill.py --check --strict` runs, the rule-copies canary, router vocabulary reach, the Hermes mirror check, the sk-code setup battery, root metadata, leaf-manifest freshness, the router test files, routing accuracy, recursive strict validation of the parent packet, contract drift, the advisor routing suites, the feature-catalog package validator, the sk-doc script tests, the cite-drift gate and the skill-graph freshness check.

One line per gate, name, exit and last output line, is in `.scratch-dc90/072-009/baseline.txt`.

## 2. Routing accuracy

| Corpus | Top-1 |
|---|---|
| Full corpus | 155 / 195 |
| Holdout | 49 / 66 |
| Ambiguity | 19 / 24 |

## 3. Routing shape

The ledger holds one entry for each of the six standalone skills this phase restructures, all reported as known debt by `package_skill.py`:

| Key | Lines | Words | Machine blocks | Codes |
|---|---|---|---|---|
| `cli-orca` | 103 | 714 | 1 | RS-001, RS-002 |
| `mcp-code-mode` | 129 | 773 | 1 | RS-001, RS-002 |
| `sk-git` | 135 | 639 | 1 | RS-001, RS-002 |
| `sk-prompt` | 174 | 1019 | 1 | RS-001, RS-002 |
| `system-skill-advisor` | 226 | 1987 | 1 | RS-001, RS-002 |
| `system-spec-kit` | 312 | 1712 | 1 | RS-001, RS-002 |

The six routing sections run from 103 to 312 lines and 639 to 1,987 words. The canon allows 12 lines and 180 words, so every one of them is over on both counts.

`sk-vision` carries a seventh entry, 63 lines and 336 words, and stays on the ledger: another session is deprecating that skill, so this phase does not touch it.

## 4. Machine lines at the baseline

Counted by the canon's own names, the lines each file must keep unchanged:

| File | Machine lines |
|---|---|
| `cli-orca` | 9 |
| `mcp-code-mode` | 8 |
| `sk-git` | 9 |
| `sk-prompt` | 6 |
| `system-skill-advisor` | 7 |
| `system-spec-kit` | 9 |

## 5. What the baseline settles before any edit

- **The standalone generator path reads no scopes.** `collectStandaloneLeaves(skillDir, cfg)` walks every configured leaf root with no look at `leaf-scopes.json`. The hub path reads that file; the standalone path never did, which is why the requirement that limits `hooks/` to Markdown needs code rather than an edit to a JSON file.
- **`hooks/` hands the router non-Markdown leaves.** `system-skill-advisor/leaf-manifest.json` lists 136 leaves, and nine of them sit under `hooks/` as `.ts`, `.py` or `.json` files. Its `leaf-aliases.json` carries the same nine pairs.
- **`sk-git` is exactly at the word ceiling.** `SKILL.md` measures 5,000 words by `wc -w` against `MAX_SKILL_MD_WORDS = 5000` in `package_skill.py`, which returns a failure above that number. The canon shape cannot add prose to this file without cutting prose somewhere else.
- **No hub shape applies.** The class contract forbids hub files for a standalone skill, so there is no `ROUTER.md` to move the machine blocks into. The machine block has to stay in `SKILL.md`, at the end of it.
