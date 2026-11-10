# Iteration 2: Q2 — Zero-hit fallback to git-changed spec docs

## Focus

Build-ready design for feature 2 from the phase 2 synthesis: a keyed-lane fallback that, only on a zero-hit, adds candidates from spec documents changed in the git worktree. Selected interpretation: the fallback belongs to `lookup-trigger-index.mjs` only, reads declared `trigger_phrases` only, and never greps body text. Deferred alternatives: a ripgrep-lane equivalent (Q3's territory) and any body-text scan, which phase 2 ruled out on contract grounds. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34]

## Actions Taken

1. Read `deep-research-config.json`, `deep-research-state.jsonl` and `deep-research-strategy.md`; confirmed iteration 2, session id `2026-11-09T14:52:02Z`, `progressiveSynthesis: true`, and that `iterations/iteration-002.md` did not exist.
2. Read the phase 2 synthesis section 4 and the full phase 2 iteration-001 evidence for this lesson (git command, timings, staged-addition loss, determinism tension).
3. Read `lookup-trigger-index.mjs` in full, plus `lib/normalize.mjs`, `lib/host-index.mjs`, `lib/freshness.mjs` and the `readTriggerPhrases` reader in `lib/frontmatter.mjs`.
4. Read `retrieval-conventions.md` sections 4, 5 and 9, and traced every importer of the lookup module and every test that parses its answer.
5. Inspected the test helpers and assertion style in `trigger-index.vitest.ts` (temp corpus, spawn helpers, field-level assertions).
6. Wrote only inside the research packet.

## Findings

1. **Module boundary: a new `lib/changed-docs.mjs`, imported dynamically only on a zero-hit.** The lookup header states that the import list is deliberately short because every extra module is paid for on every cold lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:9-15] A static import of a module that itself imports the shared frontmatter parser would charge every hit for a fallback that never runs. A dynamic `await import('./lib/changed-docs.mjs')` inside the zero-hit branch pays only when the fallback fires.

2. **`lookup()` stays synchronous and unchanged; a new exported async `lookupWithFallback()` is the seam.** `lookup()` is exported and directly asserted by the test suite, so changing its signature or making it async would break callers. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:33-35] The wrapper calls `lookup()` with `limit: 0`, decides on the scored-hit path, and applies the slice itself. `lookup()` already builds the full ordered list before slicing, so `limit: 0` costs no extra scoring. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:238-239] `main()` becomes async and the `isMainModule` block assigns the resolved code. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:382-384]

3. **Candidate source: `git status --porcelain=v1 -z --untracked-files=all -- <roots>`.** `-z` removes quoting and makes rename records unambiguous. `--untracked-files=all` is required: the default `normal` mode collapses a wholly untracked packet directory to one `dir/` entry, so a newly created, never-`git add`ed packet would be invisible to the fallback — the exact case the fallback exists to cover. [INFERENCE: based on git status porcelain's documented default untracked mode, which reports an untracked directory as a single entry] Phase 2 measured the non-`-z` form at `0.88-0.90s` repo-wide and `0.02-0.03s` packet-scoped. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:30] `git ls-files --modified --others` stays rejected: it lost 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32]

4. **Parsing rules for `--porcelain=v1 -z`.** Each ordinary entry is `XY <path>\0`. A rename or copy (`R`/`C` in either status column) emits `XY <new-path>\0<old-path>\0`, so the parser must consume a second field and keep the new path. Deletions (`D`) name a file that no longer exists and are skipped. Submodule changes and any directory entry are excluded by the `*.md` suffix plus an `fs.statSync(...).isFile()` check. Staged additions (`A `) are kept — the case `ls-files` lost.

5. **Root and scope: the fallback belongs to the caller's work tree, not to an explicit index artifact.** The root comes from `callerRepoRoot()`, which already returns `null` for a missing git binary, a directory outside a checkout, or any git failure. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs:47-56] `--spec-folder` becomes the git pathspec, and `specFolderMatches` is re-applied after parsing as a belt-and-braces filter. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:136-140] **An explicit `--index` disables the fallback**: a temp or parity artifact is by definition index-only, and this resolves phase 2's determinism tension while keeping every existing fixture hermetic. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:36]

6. **Scoring: `readTriggerPhrases` → normalized phrases → `scorePhrase`, best-per-document.** `readTriggerPhrases` returns `phrases: [{ line, normalized, raw, truncated }]` plus one category, so malformed and missing-frontmatter documents simply yield no phrases and are skipped. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/frontmatter.mjs:284-294] Each normalized phrase is scored with `scorePhrase(normalizedQuery, normalizedPhrase)`; every non-null score is above zero (`0.60`–`1.00`), so no zero-score rows can enter. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:129-151] The best score per document wins, with the existing `matchClassRank` tie-break mirroring the index loop. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:205-223] Candidate paths are sorted with `compareCodeUnits` before reading, so file-read order and output order never depend on git's output order. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:172-176]

7. **Answer field: `staleFallback`, present only when the fallback ran.** Shape: `{ available, files, matches, paths, truncated }`. `available` is false outside a work tree or without git; `files` counts candidate `.md` files examined; `matches` counts documents merged; `paths` lists the merged paths sorted; `truncated` is true when the candidate list exceeded the cap. Assigning it after `lookup()` appends it last in the serialized object, so the common-path JSON stays byte-identical.

8. **Exit rules.** Exit `0` when any merged result scores above zero; exit `1` only when the index and the fallback both produced nothing; exit `2` unchanged for bad invocation or an unreadable index. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:379]

9. **Opt-out: `--no-stale-fallback`, plus the implicit `--index` opt-out.** The flag restores index-only behavior on the default index path for parity harnesses and determinism tests. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:49]

10. **Performance budget.** Scoped: git `0.02-0.03s` plus frontmatter read/score `0.02s`, below the lookup's own `0.07s`. Repo-wide: `0.88-0.90s`, roughly thirteen times the lookup it rescues. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:30] The zero-hit-only gate is the primary bound; a `MAX_FALLBACK_FILES = 200` cap over the sorted candidate list bounds the pathological worktree and reports `truncated: true`.

11. **Compatibility is clean on the production side.** `generate-trigger-index.mjs` imports only `loadIndex`, and `core/workflow.ts` imports only `loadIndex` from the lookup module. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:62] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:286-300] No production consumer parses the lookup answer; only the CLI and the test suite do.

12. **Contract amendments are two short blocks in sections 4 and 5** (exact wording below), because the current section 5 promise covers "two runs over an unchanged corpus" without qualifying worktree state. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:212]

13. **The test matrix is the bulk of the work**, not the code: staged addition, untracked directory, rename, deletion, non-git, missing git binary, cap, determinism, and the existing fixture isolation.

## Design: Feature 2

### Files and line ranges

| File | Change | Lines |
|------|--------|-------|
| `retrieval/lib/changed-docs.mjs` (new) | `MAX_FALLBACK_FILES`; `gitChangedDocs({root, specFolder})`; `readDeclaredPhrases(absPath)`; `findStaleFallback({root, specFolder, normalizedQuery, maxFiles})` | new file, ~110-140 |
| `retrieval/lookup-trigger-index.mjs` | Header usage block: add `--no-stale-fallback` and the exit note | 17-31 |
| same | JSDoc return type: add optional `staleFallback` | 148-159 |
| same | Extract the rank comparator to a module-local function; add `mergeFallbackResults()` and exported `lookupWithFallback()` | insert at 242 (before `normalizeSpecFolder`) |
| same | `parseArgs`: one boolean flag | 264-316 |
| same | `formatAnswer`: fallback line | 323-338 |
| same | `main`: zero-hit branch, dynamic import, merge, exit code; make async | 354-380 |
| same | `isMainModule`: resolve the promise | 382-384 |
| `references/retrieval/retrieval-conventions.md` | Section 4 note after the exit table | insert after 180 |
| same | Section 5 determinism paragraph | replace 212 |
| `runtime/cli/retrieval/README.md` | Flag list plus a fallback paragraph near the `--check` note | usage block and line 84 |
| `runtime/cli/tests/stale-fallback.vitest.ts` (new) | Git-fixture test matrix | new file, ~250-320 |

The lookup's existing `lookup()` body (161-241) is not edited. The only shared-code change is extracting the comparator used at 234-236 so the merge can reuse it without duplication.

### Output change (JSON and human)

JSON, zero-hit with a fallback hit (field appended last; only present when the fallback ran):

```json
{
  "candidatePhraseCount": 4,
  "discardedTokens": [],
  "indexHash": "…",
  "manifestHash": "…",
  "normalizedQuery": "…",
  "results": [
    { "matchClass": "phrase-containment", "path": "specs/…/spec.md", "phrases": ["…"], "score": 0.94 }
  ],
  "schemaVersion": 2,
  "specFolder": null,
  "tokens": ["…"],
  "truncated": false,
  "staleFallback": {
    "available": true,
    "files": 3,
    "matches": 1,
    "paths": ["specs/…/spec.md"],
    "truncated": false
  }
}
```

Zero-hit outside a work tree: `"staleFallback": { "available": false, "files": 0, "matches": 0, "paths": [], "truncated": false }`.
No zero-hit, or `--no-stale-fallback`, or an explicit `--index`: the field is absent, and the answer is byte-identical to today's.

Human output, inserted after the `candidates:` line:

```text
fallback   : 3 changed doc(s), 1 match(es) from git worktree
fallback   : unavailable (not a git work tree)
```

The `candidates:` line itself is unchanged; feature 1 (Q1) owns the total-count wording there. The fallback's counts stay inside its own block so the two designs do not collide.

### Contract text (exact wording for `retrieval-conventions.md`)

Section 4, inserted after the exit table and before `### Worked Example`:

> **Keyed-lane zero-hit fallback.** `lookup-trigger-index.mjs` may add candidates from changed spec documents in the git worktree when the committed index returns no scored candidate. With the fallback enabled (the default), exit `1` means neither the index nor the fallback found a scored candidate; a fallback hit exits `0` like any other match. The fallback runs only on a zero-hit, only inside a git work tree, and reads each changed document's declared `trigger_phrases` — never its body text. It is disabled by `--no-stale-fallback`, and implicitly by an explicit `--index`, which restores index-only exit semantics.

Section 5, replacing the final determinism paragraph at line 212:

> **Determinism scope.** The tuple is deterministic for a fixed index and a fixed worktree state. The keyed lookup's zero-hit fallback (Section 4) reads documents changed in the git worktree, so two runs over an unchanged committed corpus can differ when the worktree differs: a run with uncommitted edits may return a candidate the committed index does not hold. Fallback candidates enter the same tuple, and candidate paths are sorted before they are read, so a fixed index and a fixed worktree always produce the same ordering. Pass `--no-stale-fallback`, or an explicit `--index`, for the index-only answer.

No section 9 change: the fallback scans only documents the index already covers, so the coverage and exclusion table is unchanged.

### Edge cases

| Case | Handling |
|------|----------|
| Not a git work tree | `callerRepoRoot()` returns `null`; `staleFallback.available = false`; exit stays `1` on a zero-hit |
| Missing git binary | `spawnSync` sets `run.error`; same `available: false` path, no throw [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs:47-56] |
| Staged addition (`A `) | Included; this is the case `git ls-files -m -o` lost |
| Wholly untracked packet directory | Requires `--untracked-files=all`; without it porcelain reports `?? dir/` and the packet is missed |
| Rename (`R `) | `-z` emits `new\0old\0`; consume both fields, read `new` |
| Copy (`C `) | Same double-field rule |
| Deletion (`D `) | Skip; the path is gone |
| Submodule or directory entry | Excluded by the `*.md` suffix plus `isFile()` |
| Path with spaces or newlines | `-z` emits raw NUL-separated paths; no shell and no unquoting |
| `.opencode/specs` alias | Canonicalize through `canonicalRelativePath` from `lib/corpus.mjs` before dedup; this checkout has no alias, so the branch is dormant |
| Duplicate of an existing score-0 partial | Dedup by path; the fallback's scored entry replaces the partial |
| Changed doc with missing or malformed frontmatter | `readTriggerPhrases` yields no phrases; skipped but still counted in `files` |
| Empty prompt / no eligible tokens | Fallback does not run; `lookup()` already returned early [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:182] |
| `--limit 0` | Merge all matches; no slice |
| `--limit 1` with several fallback matches | Slice after the merge; `truncated: true` |
| More than 200 candidates | Read the first 200 after code-unit sorting; `truncated: true`, deterministic subset |
| `--scoring-only` | No effect on fallback rows (every non-null score is above zero); pre-existing zero rows are filtered before the merge |

### Compatibility (callers and tests that parse the output today)

| Surface | Evidence | Impact |
|---------|----------|--------|
| `generate-trigger-index.mjs` | imports `{ loadIndex }` only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:62] | none |
| `core/workflow.ts` | dynamic-imports `loadIndex` only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:286-300] | none |
| `host-trigger-index.vitest.ts` | imports `defaultIndexPath` only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts:26] | none, but audit its CLI spawns for zero-hit exit assumptions |
| `trigger-index.vitest.ts` `lookup` block | imports `lookup`, `parseArgs`, `specFolderMatches`; field-level assertions, e.g. `candidatePhraseCount` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:816] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:854] | `lookup()` unchanged, so none |
| `parseArgs()` result | whole-object `toEqual` appears only on `scorePhrase`, diagnostics and `resolveArtifactPaths` results, not on `parseArgs` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:134-151] | adding one boolean is safe |
| `lookup --scoring-only` and `lookup CLI limit contract` blocks | spawn the CLI and assert exit status [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:898] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:981] | spawns that pass `--index` are automatically index-only; any spawn without it must add `--no-stale-fallback` |
| JSON consumers | no production caller parses the answer; only the CLI prints it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:378-379] | additive field only |

### Test cases

New `runtime/cli/tests/stale-fallback.vitest.ts`, reusing the temp-corpus helpers from `trigger-index.vitest.ts:51-66` (`makeTempDir`, `writeDoc`, `frontmatter`).

| # | Case | Assertion |
|---|------|-----------|
| 1 | Zero-hit, untracked new packet with `trigger_phrases` | exit `0`; `staleFallback.matches = 1`; path in `results` |
| 2 | Same doc `git add`ed (staged addition) | still found; proves `A ` handling |
| 3 | Untracked directory not individually staged | found; fails without `--untracked-files=all` |
| 4 | `git mv` rename | new path returned, old path absent, no parse crash |
| 5 | Deleted doc | no result, no error |
| 6 | Non-git temp directory | `available: false`, exit `1`, no throw |
| 7 | Spawn with a `PATH` that has no git | `available: false`, exit `1` |
| 8 | Explicit `--index` with a changed doc present | exit `1`, no `staleFallback` field (fixture isolation) |
| 9 | `--no-stale-fallback` on the default index | exit `1`, no field |
| 10 | Fallback hit | exit `0`; `matchClass`/`score` come from the declared phrase |
| 11 | Duplicate score-0 partial | one row per path, no duplication |
| 12 | `--spec-folder` scope | changed doc outside the scope is not returned |
| 13 | `--limit 1`, two fallback matches | one result, `truncated: true` |
| 14 | More than `MAX_FALLBACK_FILES` candidates | `truncated: true`, deterministic sorted subset |
| 15 | Two runs, fixed worktree | byte-identical JSON |
| 16 | Empty-token prompt | fallback not run, no field, exit `1` |
| 17 | Human format | `fallback   :` line present; JSON format unchanged apart from the field |
| 18 | Existing `lookup`, `--scoring-only`, limit-contract blocks | pass unchanged |

### Size

New lib module 110-140 lines; lookup wiring 25-35; `formatAnswer` 4; `parseArgs` 3; conventions 18; README ~8; tests 250-320. Total roughly 420-530 lines, dominated by the git-fixture matrix, consistent with phase 2's 80-120-line module estimate plus a heavier test surface. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:54]

## Questions Answered

- Q2: Design feature 2, the zero-hit fallback to git-changed spec docs: module boundary (new lib/changed-docs.mjs or inline), the git command and its parsing (git status --porcelain, renames, deletions, staged additions, non-git, missing git binary, submodules), how frontmatter trigger_phrases are read and scored with the existing helpers, the staleFallback answer field, exit-code rules, the opt-out flag, the section 4 and 5 contract amendments for determinism, performance budget, and the test matrix.

## Questions Remaining

- Q1 (total candidate count), Q3 (per-file flood control), Q4 (boilerplate demotion), Q5 (out-of-scope hint). Each is assigned to a sibling iteration in this fan-out; none was investigated here.

## Ruled Out

- **Body-text grep over changed files.** The keyed lane matches declared phrases; prose belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34]
- **`git ls-files --modified --others` as the candidate source.** Measured loss of 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32]
- **mtime comparison or a pending-reindex queue.** The index has no publish timestamp, and checkout mtimes are not build times. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md:149]
- **Running `--check` on zero-hit.** It is a full corpus walk and by contract never runs per lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84]
- **Making `lookup()` async or adding fallback logic inside it.** Would break the exported synchronous contract every test asserts.
- **Enabling the fallback for an explicit `--index`.** Would make temp-corpus fixtures depend on the developer's worktree.

## Dead Ends

None this iteration. Every source named by the phase 2 evidence was readable, and the design needed no external fetch.

## Edge Cases

- **Ambiguous input:** none. The dispatch named the module boundary options, the git command family and the required contract sections.
- **Contradictory evidence:** one tension inherited from phase 2 — section 5's determinism promise versus worktree-dependent results. Resolved in design by scoping the claim to a fixed worktree and by making an explicit `--index` index-only; the exact wording is above.
- **Missing dependencies:** none. No external service or fetch was required.
- **Partial success:** none. All planned reads and the design completed.

## Sources Consulted

- `specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/research.md`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/frontmatter.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts`

## Assessment

- New information ratio: 0.85
- Questions addressed: Q2
- Questions answered: Q2

## Reflection

- What worked and why: reading the importer graph before designing the seam made the compatibility answer concrete — the generator and the workflow import only `loadIndex`, so the fallback can live entirely behind the CLI without touching production callers.
- What did not work and why: nothing failed this iteration. The one cost was breadth: the first caller grep matched 1,149 files because every spec document quotes the script name, so it had to be narrowed to code globs before it was usable.
- What I would do differently: check the test file's assertion style before drafting the compatibility section; knowing assertions are field-level, not whole-object, settled the additive-field question in one read.

## Recommended Next Focus

Q3: per-file flood control in the ripgrep wrapper. It is the only remaining build-rated feature whose contract text (sections 2.1 and 5) overlaps the section 5 wording this iteration amended, so it should read the new determinism paragraph before drafting its own.
