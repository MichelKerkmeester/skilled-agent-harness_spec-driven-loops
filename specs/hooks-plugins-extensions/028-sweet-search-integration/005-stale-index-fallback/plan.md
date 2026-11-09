---
title: "Implementation Plan: Phase 5: zero-hit fallback to git-changed spec docs"
description: "When the committed trigger index returns no scored candidate, score the declared trigger phrases of spec docs that git reports as changed, so a newly created or edited packet is findable before the next index rebuild."
trigger_phrases:
  - "stale index fallback plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: zero-hit fallback to git-changed spec docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), git CLI, Vitest |
| **Framework** | system-spec-kit retrieval CLI |
| **Storage** | None (reads the committed trigger index and the worktree only) |
| **Testing** | Vitest under `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
When the committed trigger index returns no scored candidate, score the declared trigger phrases of spec docs that git reports as changed, so a newly created or edited packet is findable before the next index rebuild. The exact edits, output strings and test cases come from the phase 3 design. About 420-530 lines: a 110-140 line module, about 40 lines of wiring, 26 lines of docs, 250-320 lines of tests.
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
- [ ] Catalog entry, scenario 490, READMEs and changelog written
- [ ] `/local-skilled-alignment` recheck shows 0 open P0 and P1 findings
- [ ] After benchmark captured and `benchmark/results.md` written
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Zero-hit-only fallback behind a wrapper function.

### Key Components
- **`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/changed-docs.mjs`**: Git candidate list, frontmatter phrase read, scoring, `MAX_FALLBACK_FILES = 200`
- **`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`**: Usage (17-31), JSDoc (148-159), comparator extraction and `lookupWithFallback()` (before 242), `parseArgs` (264-316), `formatAnswer` (323-338), async `main` (354-384)

### Data Flow
`main` calls `lookupWithFallback`; on no scored result it dynamically imports `changed-docs.mjs`, lists changed docs via git, scores their declared phrases, merges by path under the existing rank tuple, then applies `--limit`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Five steps, each gated by the one before:

1. **Before.** Record the test-suite baseline and run the before benchmark on the current code.
2. **Build.** Make the code and test edits from the phase 3 design.
3. **Document.** Write the catalog entry, scenario 490, the README updates and the changelog entry.
4. **Align.** Run `/local-skilled-alignment :auto` on the uncommitted change and fix what it finds, then `--recheck` until nothing P0 or P1 is open.
5. **After.** Rerun the suite and the benchmark, write `benchmark/results.md`, then validate this folder.

### Alignment step

`/local-skilled-alignment` checks a change against every surface it touches and writes a findings report outside the checkout. It is report-only by default, never commits, and with target `HEAD` it includes uncommitted and untracked work.

| Surface | Standard | Fires here because |
|---------|----------|--------------------|
| S1 Code | sk-code (quality gate, comment hygiene, package check) | `.mjs` and test files change |
| S2 Skill docs | sk-doc create-skill | `references/` and READMEs under the skill change |
| S3 Feature catalog | sk-doc create-feature-catalog | New catalog entry |
| S4 Playbook | sk-doc create-manual-testing-playbook | New scenario 490 |
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

- **Queries:** 25 lookup queries: 10 phrases declared only by docs changed since the last index build, 10 phrases the index already matches, 5 phrases nobody declared. Stored in `benchmark/queries.txt` before the first run, and never edited after.
- **Runner:** `node benchmark/run.mjs <before|after>` runs each query 5 times with `--json`, keeps the median wall time, and writes one JSON row per query: query, exit code, result count, the new fields, and time.
- **Fixed state:** both JSON files record the `trigger-index.json` sha256 and the `git status --porcelain | wc -l` count. The sha256 must match between runs; the count is a record only, since the build edits are uncommitted during the after run.
- **Display:** `benchmark/results.md` holds this table, filled with measured values, plus the per-query rows:

| Metric | Before | After target |
|--------|--------|--------------|
| Stale phrases found | 0/10 (measured today: exit 1) | 10/10 |
| Already-matching queries with identical output | n/a | 10/10 |
| Undeclared phrases still exit 1 | 5/5 | 5/5 |
| Median time, matching queries | record | within 10% of before |
| Cold-lookup p95 over `fixtures/prompt-set.json` | record | at or under 200 ms, the `/doctor:speckit` budget |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package or dependency. Uses Node, ripgrep and git that the retrieval CLI already requires.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:executors -->
## EXECUTORS

The conductor is the session running the goal. It writes briefs, reviews diffs and runs the final gates itself. Workers never commit.

| Role | Executor | Use for |
|------|----------|---------|
| Worker (default) | cli-codex `gpt-6-luna`, `model_reasoning_effort="xhigh"`, `service_tier="fast"`, `--sandbox workspace-write` | Code, test, doc and README edits, one change per brief |
| Complex worker | cli-devin `deepseek-v4-1-flash-max`, `--permission-mode dangerous` | T003 (`changed-docs.mjs`) and T004 (`lookupWithFallback()` merge), and any task Luna failed twice |
| Testing orchestrator | cli-devin `deepseek-v4-1-flash-max` | T002 baseline, both benchmark runs, scenario walk-through, suite reruns |
| Fallback 1 | cli-devin `deepseek-v4-1-flash-max` | Any Luna task when codex is down or out of quota |
| Fallback 2 | cli-pi `opencode-go/deepseek-v4.1-flash`, `--thinking max`, `</dev/null`, `AI_SESSION_CHILD=1` | Any DeepSeek task when devin is down |
| Alignment lanes | `/local-skilled-alignment --lanes=codex`, then `--lanes=opencode-go` | T030 and T032 |

- Luna runs only through cli-codex. When codex fails, the task moves to DeepSeek; it never moves Luna to another provider.
- Codex's `workspace-write` sandbox blocks `tsx` IPC, so codex workers never run the test suite; the testing orchestrator or the conductor does.
- The conductor reruns every final gate itself: suite, benchmark comparison, alignment recheck and `validate.sh`. A worker's pass is a claim until then.
- Briefs stay short: one change, literal old and new text at `file:line`, and a stated accept check.
<!-- /ANCHOR:executors -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit, or run with `--no-stale-fallback` to restore index-only behavior without a revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lookup-trigger-index.mjs` `main` and the new `lookupWithFallback()` | Producer of the CLI answer and exit code | update | `stale-fallback.vitest.ts` 18-case matrix |
| `lib/changed-docs.mjs` | New git and frontmatter reader | update (new) | Unit tests on temp git repos |
| `runtime/cli/core/workflow.ts:287` | Imports `lookup()` directly | unchanged: `lookup()` keeps its behavior; the fallback lives only in the CLI path | Existing `lookup` tests pass unchanged |
| `doctor-speckit-retrieval.yaml` (exit-class probe and 200 ms p95 budget) | Runs the CLI over `fixtures/prompt-set.json` | unchanged if the budget holds; stop and ask if it does not | Benchmark p95 row and the doctor probe |
| AGENTS.md Gate 1, `/speckit:search`, `/speckit:resume` YAMLs | Read exit 1 as a clean no-hit | unchanged: exit 1 still means nothing found in either source | Grep each for `exit 1` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Before ──► Build ──► Document ──► Align ──► After
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Before (baseline and before benchmark) | Predecessor phase complete | Build |
| Build (code and tests) | Before | Document, Align |
| Document (catalog, scenario, READMEs, changelog) | Build | Align |
| Align (`/local-skilled-alignment` and recheck) | Build, Document | After |
| After (suite, after benchmark, validate) | Align | Phase close |
<!-- /ANCHOR:phase-deps -->

---
