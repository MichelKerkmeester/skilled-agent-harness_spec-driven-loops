---
title: "Implementation Plan: Phase 6: one row per file in the ripgrep wrapper"
description: "Shape the ripgrep wrapper's structured results to one best-ranked row per file with a --limit cut, report hidden files and matches, and delete the unused capped recipe."
trigger_phrases:
  - "rg flood control plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: one row per file in the ripgrep wrapper

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), ripgrep, Vitest |
| **Framework** | system-spec-kit retrieval CLI |
| **Storage** | None (reads the committed trigger index and the worktree only) |
| **Testing** | Vitest under `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
Shape the ripgrep wrapper's structured results to one best-ranked row per file with a --limit cut, report hidden files and matches, and delete the unused capped recipe. The exact edits, output strings and test cases come from the phase 3 design. About 200 lines: 80-100 code lines, 90-120 test lines, about 30 doc lines.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor phase complete per `../spec.md` handoff criteria
- [ ] Cited line ranges re-read and still match the design
- [ ] Baseline run of the retrieval test suite recorded
- [ ] Before benchmark captured in `benchmark/before.json` with the index sha256

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The full retrieval suite has no new failures versus the baseline, and `validate.sh <this folder> --strict` prints `RESULT: PASSED`
- [ ] Catalog entry, scenario 491, READMEs and changelog written
- [ ] `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings
- [ ] After benchmark captured and `benchmark/results.md` written
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-rank shaping filter, no second ranker.

### Key Components
- **`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`**: `DEFAULT_LIMIT` (after 66), delete `structuredCappedRecipe` (100-112), new `shapeRankedMatches` (after 436)
- **`.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`**: Usage, imports, `SCHEMA_VERSION` 2, `search()` record and structured branch, `parseArgs` `--limit`, `main`, `formatSummary`

### Data Flow
ripgrep returns all matches; `rankMatches` sorts them by the existing tuple; `shapeRankedMatches` keeps each path's first row with its count, cuts to `--limit`, and totals what it dropped.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Five steps, each gated by the one before:

1. **Before.** Record the test-suite baseline and run the before benchmark on the current code.
2. **Build.** Make the code and test edits from the phase 3 design.
3. **Document.** Write the catalog entry, scenario 491, the README updates and the changelog entry.
4. **Align.** Run `/local-skilled-alignment :auto` on the uncommitted change and fix what it finds, then `--recheck` until nothing P0 or P1 is open.
5. **After.** Rerun the suite and the benchmark, write `benchmark/results.md`, then validate this folder.

### Alignment step

`/local-skilled-alignment` checks a change against every surface it touches and writes a findings report outside the checkout. It is report-only by default, never commits, and with target `HEAD` it includes uncommitted and untracked work.

| Surface | Standard | Fires here because |
|---------|----------|--------------------|
| S1 Code | sk-code (quality gate, comment hygiene, package check) | `.mjs` and test files change |
| S2 Skill docs | sk-doc create-skill | `references/` and READMEs under the skill change |
| S3 Feature catalog | sk-doc create-feature-catalog | New catalog entry |
| S4 Playbook | sk-doc create-manual-testing-playbook | New scenario 491 |
| S5 READMEs | sk-doc create-readme, root included | Skill and command READMEs change |
| S6 Changelog | sk-doc create-changelog | The skill version moves |
| S9 Commands | sk-doc create-command | Command assets or READMEs change, where they do |
| S14 Spec packet | changed-packet validation | This phase folder changes |
| S15 CI parity | `.github/workflows` | Any CI step that runs these tests |

Run it like this:

1. `/local-skilled-alignment :auto --base=<commit before this phase>`. The base keeps unrelated commits out of the scope. Check `scope.json` lists only this phase's files.
2. Read `report.md` and `fix-plan.md`. Fix every P0 and P1 finding by hand. Fix P2 findings or record why each stays open.
3. `/local-skilled-alignment --recheck=<run folder>` until `recheck.md` shows 0 open P0 and P1 findings.
4. Copy `report.md` and the final `recheck.md` into this folder's `alignment/`.

The default lane preset is `opencode-go`. Pass `--lanes=` only if that preset is unavailable, and say which preset ran.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

**Tests.** The cases are listed in the phase 3 design (`../003-retrieval-feature-design-research/research/iterations/`). Run the full retrieval suite before and after and report the pass and fail counts for both.

**Benchmark (before versus after).** One fixed query set, run on the code before the change and again after it, on the same worktree and index state.

- **Queries:** 8 structured ripgrep queries over fixed search roots, including the 382-row query from the spec. Stored in `benchmark/queries.txt` before the first run, and never edited after.
- **Runner:** `benchmark/run.sh <before|after>` runs each query 5 times with `--json`, keeps the median wall time, and writes one JSON row per query: query, exit code, result count, the new fields, and time.
- **Fixed state:** both JSON files record the `trigger-index.json` sha256 and the `git status --porcelain | wc -l` count. If either differs between runs, rerun before.
- **Display:** `benchmark/results.md` holds this table, filled with measured values, plus the per-query rows:

| Metric | Before | After target |
|--------|--------|--------------|
| Distinct files in the shown rows (measured query) | 2 (measured today) | 14 |
| Most rows from one file (measured query) | 19 of 20 | 1 |
| Queries that report hidden files and matches | 0/8 | 8/8 where anything was hidden |
| Median query time, 5 runs per query | record | within 10% of before |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package or dependency. Uses Node, ripgrep and git that the retrieval CLI already requires.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit; `SCHEMA_VERSION` returns to 1 and the one caller line reverts with it.
<!-- /ANCHOR:rollback -->

---
