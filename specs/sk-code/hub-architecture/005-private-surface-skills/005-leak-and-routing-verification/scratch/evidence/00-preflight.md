# 00 - Preflight

Recorded on 2026-10-24 by a Claude Sonnet 5.5 sub-agent dispatched by the OpenCode 2 orchestrator, in the operator checkout on branch `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`.

## Commands

| Command | Output | Expected |
|---|---|---|
| `git log --oneline -8` | `9129007915 chore(system-spec-kit): rebuild the trigger index`<br>`af17fb7c65 docs(sk-code): close phase 4 private local skills`<br>`4925c38a42 chore(system-spec-kit): rebuild the trigger index`<br>`ff993936c7 docs(sk-code): record the private local skills restore and its review`<br>`e8256b8044 fix(system-skill-advisor): forward the private skill roots to the daemon`<br>`75ef2608d0 chore(system-spec-kit): rebuild the trigger index`<br>`113d8b56d1 docs(system-speckit): judge the CLI step limit on a five-run median`<br>`7b10ab6614 docs(system-speckit): record the cold and warm setup cache runs` | the phase 001-004 commits are present (the last eight show the phase 4 closure, `git log --oneline -40` also shows `e00fef3e76`, `e7996ea607` and `e3beac65f4` for the earlier phases) |
| `gh auth status` | `Logged in to github.com account MichelKerkmeester (keyring)`, active account `true`, token scopes `gist`, `read:org`, `repo`, `workflow` | a logged-in account |
| `sqlite3 --version` | `3.54.0 2026-04-09 12:25:13 8fa8248e303219400c646a885e36dfc52eae33d83f4412e3f369b2be5373aapl (64-bit)` | a version line |
| `jq --version` | `jq-1.7.1-apple` | a version line |
| `node --version` | `v26.8.2` | a version line |

## Baselines

The values below are the baselines the task prescribes. The tracked-path, tracked-content and bare-token rows are re-measured live in `01-head-leak-sweep.md`.

| Measure | At `42b41dd286` | At `583316d083` |
|---|---|---|
| Tracked paths naming a private skill or a removed surface | 336 | 336 |
| Tracked content lines outside the excluded paths | 1528 | 1529 |
| Trigger-index matching lines | 200 | 200 |
| Of which `.skilled/` paths | 131 | 131 |
| Of which `specs/sk-code/007-sk-code-obsidian-surface/` paths | 69 | 69 |
| Trigger-index space-normalized phrase keys | 59 | 59 |
| `corpus-manifest.json` matching lines | not measured | 260 |
| `generation-diagnostics.json` matching lines | not measured | 60 |
| `phrase-variants.json` matching lines | 58 | 59 |
| Bare `WEBFLOW` and `OBSIDIAN` token lines before and after the `WEBFLOW:` filter | not measured | 566 / 548 |
| Retained content-sweep paths under the two D6 prefixes | not measured | 8 |
| Advisor `skill_nodes` rows from the step 5 query | 1 | 1 |
| Advisor `skillCount` | not measured | 14 |

The one-line difference between the two commits is `phrase-variants.json`, which the two intervening index rebuilds extended from 58 to 59 matching lines.

<!-- evidence:end -->
