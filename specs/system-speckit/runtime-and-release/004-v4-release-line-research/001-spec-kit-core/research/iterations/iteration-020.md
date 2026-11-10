# Iteration 20 — Repo-root resolution, the fifth resolver

## Focus

`shared/workspace/repo-root.mjs` (`findRepoRoot`, `findSourceRoot`, `hoistAboveOpencodeTree`), every
caller under `.skilled/skills/system-spec-kit`, and the cross-check against `config.ts`
`resolveProjectRoot` and `check-goal.cjs` `getDefaultWorkspaceRoot`. Four cwd scenarios, reproduced
read-only from `/tmp` scratch trees: (a) a nested folder of this repo, (b) inside `.opencode`,
(c) a sibling repo that vendors `.skilled`, (d) a folder outside any git repo.

## Actions Taken

1. Read the algorithm: `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs` (142 lines,
   full read). Confirmed `runtime/hooks/lib/workspace/repo-root.mjs` is a 14-line **re-export shim**,
   not a duplicate — different md5, and it re-exports six names from `../../../../shared/...`. No
   symlink involved; `ls -la` + `readlink` shapes checked before drawing any duplication conclusion.
2. Enumerated importers with `grep -rn "workspace/repo-root"` over the skill: **24 import sites**, in
   two families — `.cjs`/`.mjs` scripts importing `@spec-kit/shared/workspace/repo-root.mjs` directly,
   and `.ts`/`.mjs` files importing the hooks shim `@spec-kit/runtime/hooks/lib/workspace/repo-root.mjs`.
   Both resolve to the same 7048-byte module today.
3. Read the competing resolver: `runtime/cli/core/config.ts:96-147` (`RUNTIME_REPOSITORY_ROOT`,
   `usesSpecKit`, `gitTopLevel`, `resolveProjectRoot`) and `runtime/cli/continuity/generate-context.ts:1193-1240`
   (`resolveProjectRootOption`, the save path).
4. Read the third/fourth resolver: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:58-60`
   and its single use at `:110`.
5. Built `/tmp/rr-probe/` scratch trees — a git sibling copying `.skilled`, a git sibling carrying
   only `.opencode/skills/system-spec-kit/SKILL.md`, a git sibling symlinking `.skilled` at the shared
   checkout, a non-git folder, a non-existent path, and a 12-vs-15-level nesting pair — then ran
   `findRepoRoot`, `findSourceRoot` and `resolveProjectRoot(cwd)` against each. All writes were under
   `/tmp`; nothing in the repository was created, edited, staged or committed (`git status --porcelain`
   after the probes shows only the pre-existing state, see the note at the end).
6. Attributed origin with `git log -S`: `REPO_ROOT_SENTINEL`/`DEFAULT_MAX_DEPTH` → `330427cf30`
   (first tag `v4.0.0.0`); `resolveProjectRoot`/`usesSpecKit` → `6f42c7b169` (first tag `v4.0.1.0`);
   `getDefaultWorkspaceRoot` → `d65d4128c6` (first tag `v4.0.0.10`).

## Findings

### F1 — The save path refuses, when told, the exact root it computes itself · `bug` · P1

`CONFIG.PROJECT_ROOT` defaults to `resolveProjectRoot()` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:355],
and that function can end at `return runtimeRoot` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:146] —
the *shared checkout*, not the caller's repository. `main()` assigns that value at
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1222] and only a
`--project-root` **option** re-validates it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1228].
That validator refuses a root outside the working repository
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1205]. So the guard
exists and the default path bypasses it: the same string is an error when an operator supplies it and
silent accepted state when the runtime computes it.

Reproduced (ran): `resolveProjectRoot('/tmp/rr-probe/bare/nested')` → `/Users/michelkerkmeester/MEGA/Development/Skilled`,
which is not inside `/tmp/rr-probe/bare/nested`, so `resolveProjectRootOption` would throw on exactly
that value. A spec-kit project that is not a git repository therefore saves into the shared checkout,
which is the failure mode `resolveProjectRoot`'s own docstring says it was written to prevent
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:118-125].

- Release introduced: `v4.0.1.0` (`6f42c7b169` introduced `resolveProjectRoot`; the asymmetry dates from it)
- Confidence: high — both sides of the asymmetry read, the producing side executed
- Verify: `node --input-type=module -e "import {resolveProjectRoot} from './.skilled/skills/system-spec-kit/runtime/cli/dist/core/config.js'; console.log(resolveProjectRoot('/tmp/rr-probe/bare/nested'))"`

### F2 — `usesSpecKit` is the directory sentinel that `repo-root.mjs` forbids, and it is `.skilled`-only · `misalignment` + `bug` · P1

`usesSpecKit` returns `existsSync(<dir>/.skilled/skills/system-spec-kit)`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:98-100] — a **bare directory** test.
The module it should agree with states the invariable the other way round: the sentinel is a real
authored FILE and "a directory sentinel is self-perpetuating" because it makes the leak permanent
[SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:11], and it proves the tree with
`SOURCE_ROOT_SENTINEL = 'skills/system-spec-kit/SKILL.md'`
[SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:38].

It is also `.skilled`-only, while the resolver it shadows accepts both names
[SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:35]. Reproduced (ran): a sibling
git repo carrying only `.opencode/skills/system-spec-kit/SKILL.md` →
`findRepoRoot` = that repo [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:54-55],
`resolveProjectRoot` = the runtime repo plus a stderr note. A project on the pre-`v4.0.0.0` layout is
invisible to `resolveProjectRoot` and visible to `findRepoRoot` — two answers from one package.

This **closes the iteration-8/13 residual** on `usesSpecKit`: the marker is exactly the
`.skilled/skills/system-spec-kit` directory, nothing about `specs/`. That is why the scratch repo that
already carried `specs/001-probe` was still rejected.

- Release introduced: `v4.0.1.0` (`6f42c7b169`); the `.opencode` → `.skilled` move that created the
  split is `330427cf30` (`v4.0.0.0`)
- Confidence: high — both resolvers executed on the same scratch trees
- Verify: `grep -n "function usesSpecKit" -A2 .skilled/skills/system-spec-kit/runtime/cli/core/config.ts`

### F3 — Past the depth cap, `findRepoRoot` returns a leaf folder as the root, silently · `bug` · P2

`DEFAULT_MAX_DEPTH = 14` [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:40] caps
the walk [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:116]; the tail then
falls through to `?? resolve(start)` [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:122],
which always answers something. Reproduced (ran): with the sentinel 12 levels above the start →
`/tmp/rr-probe/deep2`; at 15 levels above → `/tmp/rr-probe/deep2/d1/.../d15` with
`findSourceRoot` = `null`. The function returns a directory it never proved is a root, and no caller
can tell the difference. That is precisely the nested-tree leak the header says it exists to prevent,
and it calls that leak permanent and spreading [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:4-7].

The suite does not catch it: its `maxDepth` assertions pass through the fallback chain, not the walk —
`findRepoRoot(repoRoot, { maxDepth: 0 })` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts:175]
executes zero loop iterations, so the assertion is satisfied by the tail branch. No fixture places a
sentinel *beyond* the cap with no source-root segment in the start path — that is the missing case.

- Release introduced: `v4.0.0.0` (`330427cf30`, the same commit that introduced `DEFAULT_MAX_DEPTH`)
- Confidence: high — the failing pair executed, the passing pair executed as control
- Verify: `node --input-type=module -e "import {findRepoRoot} from './.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs'; console.log(findRepoRoot('/tmp/rr-probe/deep2/d1/d2/d3/d4/d5/d6/d7/d8/d9/d10/d11/d12/d13/d14/d15'))"`

### F4 — One directory, two absolute spellings, from two resolvers · `drift` · P2

`resolveProjectRoot` returns git's `--show-toplevel` verbatim
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:103-111], which is realpath'd.
`findRepoRoot` returns `resolve(start)` walked up [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:115],
which does not realpath. Reproduced (ran) on a sibling that symlinks `.skilled`:
`findRepoRoot` → `/tmp/rr-probe/sib-linked`, `resolveProjectRoot` → `/private/tmp/rr-probe/sib-linked`.
Same inode, two strings. Any cross-resolver equality check, cache key or `startsWith` prefix test
misfires on any path whose ancestor is a symlink — `/tmp` on macOS being the everyday one.

- Release introduced: `v4.0.1.0` (`6f42c7b169` made a second spelling reachable)
- Confidence: high — both strings printed in one run
- Verify: the F2 scratch tree plus `resolveProjectRoot('/tmp/rr-probe/sib-linked/specs/001-p')`

### F5 — A non-existent cwd is reported as "not a repository that uses spec-kit" · `ux` · P2

`gitTopLevel` swallows every failure in a bare `catch { return null }`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:112-114] — ENOENT for a bad cwd,
ENOENT for a missing `git` binary, and "not a repo" all become `null`. The note then states a reason
that was never tested [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:142-145], and
the run continues against the runtime root. Reproduced (ran): `resolveProjectRoot('/tmp/rr-probe/bare/missing')`
→ the shared checkout, with exactly that note. A typo in a `cwd`/`--project-root` therefore reads as a
configuration opinion rather than an error, and the save proceeds.

- Release introduced: `v4.0.1.0`
- Confidence: high — executed
- Verify: `resolveProjectRoot('/tmp/rr-probe/bare/missing')` and read stderr

### F6 — `getDefaultWorkspaceRoot` is a fourth root algorithm with unguarded depth arithmetic · `over-engineering` · P2

`getDefaultWorkspaceRoot()` is `path.resolve(__dirname, '../../../../../')`
[SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:58] and has exactly one consumer,
the workspace root passed to label and budget derivation
[SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:110]. No walk, no sentinel, no git,
no fallback note. Reproduced by evaluating that exact expression at three depths: as shipped →
the repository root; one level shallower (`.skilled/skills/sk-create-goal/scripts`) → `/`. The budget
root silently becomes the filesystem root and `resolveGoalBudget` looks for a budget file nobody wrote.

What breaks if removed: nothing. The replacement is `findRepoRoot(__dirname)`, a one-line relative
import, identical at the as-shipped depth and sentinel-correct at every other depth. This is the fourth
root algorithm in a tree that already ships one shared resolver with a written doctrine and a
build-free re-export shim for packages that cannot import it.

- Release introduced: `v4.0.0.10` (`d65d4128c6`)
- Confidence: high on the depth arithmetic (executed); medium on the claim that no other caller depends
  on the module-relative behaviour (grep shows one `function` and one call site)
- Verify: `node -e "console.log(require('path').resolve('/p/.skilled/skills/sk-create-goal/scripts','../../../../../'))"`

### F7 — `findRepoRoot` knows which branch answered and throws that away · `extension` · P2

The tail [SOURCE: .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs:122] is a three-way
choice — nearest sentinel holder, hoisted ancestor, or the start itself — and all three collapse into
one `string`. At each of the 24 import sites the caller cannot distinguish a proven root from F3's
guess or F5's echo. Minimal extension: an exported `findRepoRootDetailed(start, opts)` returning
`{ root, via: 'sentinel'|'nearest'|'hoisted'|'start', depth }`, with `findRepoRoot` a thin wrapper so
no existing caller changes. That is a smaller change than adding an `onFallback` option, and it is the
enabler for F3 and F5 rather than a parallel fix.

- Release introduced: `v4.0.0.0` (the shape has been unchanged since introduction)
- Confidence: high on the mechanism (read); the extension is a proposal, not a measurement
- Verify: `grep -rn "workspace/repo-root" .skilled/skills/system-spec-kit --include=*.ts --include=*.mjs --include=*.cjs -l | wc -l`

## Scenario matrix (all rows executed, no row inferred)

| cwd scenario | `findRepoRoot` | `findSourceRoot` | `resolveProjectRoot` | agree? |
| --- | --- | --- | --- | --- |
| (a) nested in this repo | repo root | `.skilled` | repo root | yes |
| (b) inside `.opencode` (symlink → `.skilled`) | repo root | `.skilled` | repo root | yes |
| (c) sibling copying `.skilled` | sibling | sibling `.skilled` | sibling | yes |
| (c2) sibling copying `.opencode` only | sibling | sibling `.opencode` | **runtime repo** + note | **no** (F2) |
| (c3) sibling symlinking `.skilled` | `/tmp/...` | `.skilled` | `/private/tmp/...` | string differs (F4) |
| (d) outside any git repo, `.skilled` present | that folder | that folder `.skilled` | **runtime repo** + note | **no** (F1) |
| (d2) cwd does not exist | echoes the path | null | **runtime repo**, reason misstated | **no** (F5) |
| (e) sentinel 15 levels above start | **leaf folder** | null | n/a | **no** (F3) |

`hoistAboveOpencodeTree` behaved as documented on the two inputs tried: it returned the repository root
for an in-tree path and `null` for a folder with no source-root segment. Nothing in this iteration
contradicts its contract.

## Questions Answered

None of the two strategy key questions were closed this iteration — neither `/doctor:update`
preview/rollback nor `create.sh`-versus-`--strict` was touched.

One **carried residual is closed**: what `usesSpecKit()` requires. It is
`existsSync(<dir>/.skilled/skills/system-spec-kit)` — a directory, `.skilled` only
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:98-100]. `specs/` plays no part.
That retires the iteration-8 and iteration-13 open items and converts them into F1/F2.

## Questions Remaining

- **New from F1**: does any other writer bind `CONFIG.PROJECT_ROOT` from a source that bypasses
  `resolveProjectRootOption`? The two static importers of `resolveProjectRoot` read it at module load
  (`backfill-frontmatter.ts:85`, `migrate-trigger-phrase-residual.ts:136`), which is a *third* binding
  path and none of them validate. Whether those two write state is unread.
- **New from F2**: whether `usesSpecKit` is intentionally `.skilled`-only as a migration stance. If it
  is, the note at `config.ts:142-145` should say so, and F2 becomes a drift finding rather than a bug.
  If it is not, `.opencode`-layout projects are silently redirected today.
- **New from F3**: whether any real caller can be more than 14 levels below the sentinel. A vendored
  `node_modules` install and a nested worktree are the two candidates; neither was measured.
- **New from F4**: whether any code compares a `findRepoRoot` result to a `resolveProjectRoot` result
  for equality. Grep found the two families but no shared comparison site in this pass.
- **Carried, now the oldest open item (13th iteration)**: `/doctor:update` — `align`, `apply`,
  `rollback`, `compat` have never been executed; only `check` has.
- **Carried**: Q7 `create.sh` + level templates (scaffold-versus-`--strict`, fill-note canon);
  Q3 freshness signal; Q4 stale-index gate; Q5 over-budget bind; Q8 doc-drift remainder; Q9 rules/options
  pairs; Q10 operator friction; Q11 sk-code/sk-doc conformance; Q12 extensions for trigger index,
  continuity and goal.

## Next Focus

Iteration 21 is the last one. Two candidates for its single slot:

1. **Close the oldest debt** — execute `/doctor:update` `align`/`apply`/`rollback`/`compat` in dry-run
   mode against a `/tmp` copy. Thirteen iterations of read-path completeness and zero execution is the
   largest single evidence gap in the run.
2. **Finish the root story** — F7 is a proposal whose value depends on F3 and F5 mattering in practice.
   The cheapest way to settle it: count real call sites whose start path is deep or non-git.

Recommendation: (1). Every remaining question in this cluster is now either a proposal (F7) or a
measurement I can state the bounds of (F3, F4). `/doctor:update` still has a whole execution surface
nobody has touched.

## Run hygiene

- All probes ran under `/tmp/rr-probe/`. No repository file was created, edited, staged or committed.
- `git status --porcelain` after the probes reported `M specs/system-speckit/graph-metadata.json` and
  `?? specs/001-test-feature/` — both **pre-existing**, neither produced by this iteration. The
  `specs/001-test-feature/` leftover is the one an earlier iteration noted; it is not mine to remove
  under this run's read-only containment, and it is recorded here rather than cleaned.
- No generator, packager, `create.sh`, `generate-context.js` or `validate.sh --recursive` was run.

**SCOPE VIOLATIONS**: none.
