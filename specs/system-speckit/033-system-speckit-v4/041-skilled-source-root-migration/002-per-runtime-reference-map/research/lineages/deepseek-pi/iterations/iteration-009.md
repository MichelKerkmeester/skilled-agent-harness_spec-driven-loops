# Iteration 9: Verification sweep — live re-measurement, citation checks, class totals

## Focus

Close the loop: re-measure the seed counts against the live tree, verify the load-bearing citations the synthesis will use, add the one file that appeared after the seed was generated, and record the class totals for all three maps. This iteration tests whether a further pass would add rows.

## Findings

- **Finding 1 — the symlink census re-measures exactly.** Live per-root counts: `.claude` 57, `.codex` 19, `.cursor` 65, `.devin` 34, `.hermes` 2, `.pi` 19, `specs` 29, root-level 2 — each identical to the seed. `.opencode` measures 258 live, of which 208 are outside `node_modules` and 50 are dependency-vendored links inside `node_modules`; the seed's 208 is the non-`node_modules` set, and the two path lists diff to empty. Phase 001's older figure of 207 is explained by the one link it did not yet see; no link is missing from Map A. **Classification:** `none` (reconciliation only). **Consequence:** Map A's 435 rows are the complete live set.

- **Finding 2 — one tracked file appeared after the seed was generated, and it is a Map C row.** `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` is a new executable script whose first path construct is `path.join(REPO_ROOT, '.opencode', 'skills')` at line 48 (second at line 52, `.opencode/bin/skill-advisor.cjs`). Live `git grep -l .opencode -- ':!specs'` returns 4,259 tracked files against the seed's 4,258. The seed has no file that is now missing. **Classification:** `mechanical`. **Consequence:** the seed is stale by exactly this one file; the map adds it and the reconciliation total becomes 4,259 tracked files, with the seed's 4,258 an exact subset.

- **Finding 3 — the load-bearing citations verify against the live tree.** Each claim opened: `pre-commit:49` (comment-hygiene blocks only while `.opencode/skills/sk-code` exists), `pre-commit:95` (staged-agent filter matches `^\.(opencode|claude)/agents/`), `pre-commit:97-104` (mirror-checker skip warning), `pre-commit:114-182` (six mirror-parity checks), `pre-push:121-123` (diffs `.opencode/skills`), `mcp-code-mode-launcher.cjs:22` (literal `'.opencode',` segment), `opencode.json:15` (launcher path), `PUBLIC-RELEASE.md:10-36` (consumer `.opencode` tree and legacy `specs` compat note), `~/.config/git/hooks/*` (seven absolute symlinks into the main checkout). All resolved; none contradicted the map.

- **Finding 4 — the live runtime file set matches Map B exactly.** Non-symlink tracked files under the six runtime roots naming `.opencode`: `.claude` 17, `.codex` 50, `.cursor` 7, `.devin` 4, `.hermes` 103, `.pi` 50 — 231 total, identical to the seed and to Map B's rows.

- **Finding 5 — class totals across the three maps.** Map A (435 links): `regenerate` 147, `mechanical` 231, `none` 28, `freeze` 29. Map B (231 files): `regenerate` 197, `mechanical` 27, `manual` 7. Map C (4,027 non-runtime tracked files): `mechanical` 2,873, `freeze` 1,008, `manual` 120, `regenerate` 26. Combined tracked-file universe: 4,258 seed files + 1 new file = 4,259, all classified. **Classification:** complete.

- **Finding 6 — the convergence test.** The only new row since iteration 8 is the single script from Finding 2, plus reconciliation facts that change no row. A further iteration over the same seed would add no rows; the map is complete at 87.5% of iterations used. **Classification:** `none`. **Consequence:** the loop can stop on convergence rather than the cap; the synthesis can rely on the maps as complete against the seed plus the one-file delta.

- **Finding 7 — UNKNOWN register (consolidated; every UNKNOWN names what would settle it).** (1) Whether each runtime CLI can be pointed at a root other than its own directory name — settles with version-specific loader documentation or source for each installed CLI. (2) Whether OpenCode's flat plugin glob and Devin's native skill scan follow a symlinked directory — settles with a per-runtime probe in a scratch checkout. (3) Whether a dangling hook under `core.hooksPath` makes git fail or skip silently — settles with a one-line probe in a scratch repository. (4) Whether gate scripts execute while their staged-path filters miss `.skilled` changes — settles with a probe commit in a disposable checkout. (5) Whether the `.opencode` compatibility surface will cover `hooks/`, `changelog/`, `install-guides/` as well as `skills/`, `commands/`, `agents/`, `bin/` — settles in phase 003's layout decision; both answers are given per row. (6) Whether an external bootstrap owner exists for the hand-made whole-directory links — settles with a machine-level search outside this repository. (7) Whether the 129 `system-spec-kit` test files assert absolute repository paths or path fragments — settles by reading the assertions. (8) Whether benchmark artifacts are consumed by live tooling — settles by reading the benchmark scripts' inputs. (9) Whether the `.state` telemetry README's recorded `.opencode/skill` bug is still live — settles with a one-command matcher probe; it is recorded, not corrected.

- **Finding 8 — seed-vs-map discrepancies ledger.** (a) The seed is stale by one tracked file (Finding 2). (b) `.claude/SYNC.md` lists `specs` and `changelog` links that do not exist and a hook count of 18 against the tree's 21 (iteration 1). (c) `.cursor/SYNC.md` says 13 agents/36 commands/15 hooks against the tree's 12/35/18, and calls `mcp.json` a symlink when it is a real file (iterations 2, 4). (d) `.devin/SYNC.md` says 13 agents against 12 (iteration 2). (e) `.claude/SYNC.md` and `.codex/SYNC.md` call `settings.json`/`hooks.json` hand-authored when `sync-hook-registrations.cjs` renders them (iteration 1). (f) Phase 001's internal-link count of 207 against the current 208 (Finding 1). Each names both sources; the tree wins.

## Reconciliation against the seed

| Population | Seed | Live | Mapped | Delta |
|---|---:|---:|---:|---|
| Symlinks (all roots) | 435 | 435 | 435 | 0 |
| Symlinks in `.opencode` (non-`node_modules`) | 208 | 208 | 208 | 0 |
| Tracked files naming `.opencode` outside `specs/` | 4,258 | 4,259 | 4,259 | +1 new file (Finding 2) |
| Runtime non-symlink files (Map B) | 231 | 231 | 231 | 0 |
| Map C tracked files | 4,027 | 4,028 | 4,028 | +1 new file |

## Classification summary

Map A: regenerate 147, mechanical 231, none 28, freeze 29. Map B: regenerate 197, mechanical 27, manual 7. Map C: mechanical 2,873, freeze 1,008, manual 120, regenerate 26. No row is unclassified; no UNKNOWN is dropped, and each carries its settling evidence.

## What worked

- Re-measuring live and diffing path lists caught the one-file drift mechanically; nothing relied on the seed's age.
- Opening each synthesis-critical citation against the live tree confirmed the generator lines, filter lines and contract lines rather than trusting phase 001's line numbers.

## What failed

- Nothing failed in this pass; the only surprise was the one-file drift, which is recorded rather than normalized away.

## Assessment

The maps are complete against the seed plus the one-file delta. New-row yield on the last pass was one file, and no further pass over the same evidence would add rows; convergence is reached.
