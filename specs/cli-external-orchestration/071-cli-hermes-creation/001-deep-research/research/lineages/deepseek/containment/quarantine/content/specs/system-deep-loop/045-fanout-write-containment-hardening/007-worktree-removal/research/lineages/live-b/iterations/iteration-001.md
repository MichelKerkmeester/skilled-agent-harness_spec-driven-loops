# Iteration 1: Exhaustive exported-surface inventory of write-containment.ts

## Focus

Enumerate every exported function of
`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
(1391 lines, sha256 `45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`), give each a
one-line purpose, and anchor every claim to `file:line`. Secondary goal: test each stated purpose
against the implementation body and against a real caller, so the one-liners are usage-grounded
rather than name-derived.

## Findings

### 1.1 The exported-function set is eight symbols (the asked class)

Primary answer. Line anchors point at each declaration; the bracketed range is the body span read.

| # | Exported function | `file:line` | One-line purpose |
|---|-------------------|-------------|------------------|
| 1 | `drainGitContentionWarnings` | `write-containment.ts:312` | Drains and returns the module-level list of git calls that lost to a neighbour's `.git/index.lock`, so a caller can report the contention exactly once instead of losing it in the fail-open empty result that every git wrapper returns. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:304-314] |
| 2 | `classifyViolation` | `write-containment.ts:511` | Maps a raw `git status --porcelain` XY status code onto the violation kind union — `??`→untracked, then `D`→deleted, `A`→added, `M`→modified, everything else→other. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:511-517] |
| 3 | `snapshotOutOfScopeDirtyPaths` | `write-containment.ts:772` | Pre-dispatch baseline: collects every dirty path outside `artifactDir` (minus `unattributableDirs`/`unattributablePaths`), hashing each on disk and optionally copying its current bytes under `captureContentDir`, deduped and path-sorted; returns `[]` when git, the worktree, or the artifact scope cannot be reasoned about. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:759-808] |
| 4 | `detectNewOutOfScopeViolations` | `write-containment.ts:814` | Post-dispatch detection: computes current out-of-scope dirty paths minus the pre-dispatch baseline (skipping entries whose hash is unchanged), throwing when `artifactDir` lies outside the worktree and returning `[]` when there is no worktree to read. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:810-844] |
| 5 | `quarantineViolations` | `write-containment.ts:1065` | Writes the durable record of what each guarded path left behind under `<artifactDir>/containment/quarantine/` — `manifest.json`, current bytes in `content/`, diff-vs-HEAD patches in `patch-head/`, diff-vs-baseline patches in `patch-baseline/` — and never throws, keeping a per-path failure on that entry instead. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1050-1118] |
| 6 | `revertOutOfScopeViolations` | `write-containment.ts:1146` | Applies the configured remedy without ever deleting irreversibly: `restore` puts an in-HEAD path back to HEAD or to the captured baseline bytes, `preserve` (the default) leaves the working tree untouched, and a not-in-HEAD path is preserved in both modes and merely reported. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1121-1210] |
| 7 | `buildContainmentViolationEvent` | `write-containment.ts:1214` | Builds the `containment_violation` JSONL event payload for the loop state log — violations, revert actions, patch path/error, and a `dataLossPossible` block naming the paths a HEAD rollback destroyed and where to recover them. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1213-1248] |
| 8 | `enforceWriteContainment` | `write-containment.ts:1267` | The high-level post-dispatch guard: detect new violations, split regenerable-runtime-state from guarded paths, capture the revert patch, quarantine, apply the remedy, partition the result into fatal `violations` versus `advisories`, and append the event when a `stateLogPath` is supplied. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1259-1379] |

Count check: `grep -c "^export function"` over the file returns `8`, and the eight declarations
above are exactly those lines (312, 511, 772, 814, 1065, 1146, 1214, 1267). No other
`export function` exists, and no exported arrow-function constant exists — the module has no
nested `export` statements. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:40-1391]

### 1.2 Three further exported constants (not functions, listed so the class boundary is explicit)

| Exported symbol | `file:line` | Purpose |
|-----------------|-------------|---------|
| `BASELINE_MAX_FILE_BYTES` | `write-containment.ts:707` | Largest single dirty file whose bytes the baseline capture will copy (2 MiB); anything larger is recorded as truncated so one large blob cannot spend the lane budget. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:700-707] |
| `BASELINE_MAX_LANE_BYTES` | `write-containment.ts:716` | Total baseline bytes one snapshot call may copy (64 MiB); once spent, remaining entries are marked truncated so the shortfall stays visible. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:709-716] |
| `__internals` | `write-containment.ts:1382` | A bundled export of eight otherwise-private helpers (`resolveGitToplevel`, `resolveArtifactScope`, `parseStatusPorcelain`, `isInsideArtifact`, `isContainedInArtifact`, `canonicalPath`, `isRegenerableRuntimeState`, `isSubpath`) under a comment reading "Exported for tests / diagnostics" — it is an object, not a function. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1381-1391] |

### 1.3 Twelve exported type/interface declarations (shape of the contract, not callables)

`ContainmentViolationKind` (`:40`), `ContainmentViolation` (`:47`), `ContainmentRevertAction`
(`:57`), `ContainmentRevertResult` (`:64`), `ContainmentOptions` (`:68`), `DirtyPathEntry`
(`:120`), `DetectOptions` (`:140`, extends `ContainmentOptions`), `ContainmentViolationEvent`
(`:145`), `EnforceInput` (`:181`, extends `DetectOptions`), `EnforceResult` (`:200`),
`QuarantineEntry` (`:224`), `QuarantineResult` (`:243`).
[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:40-250]

### 1.4 Purpose claims survive a caller check, with one caveat

The only production consumer in the repository is the fan-out runner, which imports four names
from the module: `snapshotOutOfScopeDirtyPaths`, `enforceWriteContainment`,
`drainGitContentionWarnings`, and `__internals.resolveGitToplevel`.
[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2776]

The runner's call site matches the one-liners above: it passes `artifactDir: lineageDir`,
`mode: containmentMode`, `iteration: attempt`, `label: lineage.label`, plus sibling/foreign
directories as `unattributableDirs` and orchestrator-owned files as `unattributablePaths`, then
consumes `advisories` as a `containment_advisory` warning and the fatal `violations` with the
returned `event` as the error path.
[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3436-3476]

Caveat: `quarantineViolations`, `revertOutOfScopeViolations`, `buildContainmentViolationEvent`,
and `classifyViolation` have no caller outside the module besides
`runtime/tests/unit/write-containment.vitest.ts` — the first three are reached only through
`enforceWriteContainment` (`:1310`, `:1319`, `:1367`), and `classifyViolation` is called once
inside detection at `:839`. Their purposes are therefore grounded in the module body plus unit
tests, not in an independent production call site.
[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:839]
[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:18-25]

Direct behavioral evidence for two of them is explicit in the tests: `classifyViolation('??')`
is asserted as `untracked`, `' M'` as `modified`, `' D'` as `deleted`, `'A '` as `added`, and
`drainGitContentionWarnings()` is asserted empty before and after a drain.
[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1021-1024]

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (primary; header `:1-37`, types `:38-250`, body `:300-1391`)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (production caller, import at `:2776`, enforce call at `:3436`)
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` (import map `:18-25`, behavior assertions `:1021-1024`)
- `.opencode/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md` (checked, then ruled out as an inventory cross-check — see Reflection)
- `grep -c "^export function"` and `grep -n "^export"` over the module (mechanical count check)
- `git rev-parse --short HEAD` → `cbb1e4ae53` (tree state the line numbers are anchored to)

## Assessment

- **newInfoRatio: 1.0**
- **Novelty justification:** First iteration of a fresh lineage; nothing about this module
  existed in the packet before, so all 8 function entries, 3 constant entries, 12 type entries,
  and the caller map are new information.
- **Confidence:** High (≈95%) for the enumeration itself — the eight names come from a
  mechanical `^export function` count that agrees with a line-by-line read of the file, and the
  file is small enough to read in full. High (≈90%) for the purpose one-liners, which are read
  off each function's own doc comment plus its body and, for four of the eight, its production
  call site. Medium-high (≈80%) for the claim that no other exported callable exists, which
  rests on the `^export` grep matching every declaration in the file; a re-export added later
  elsewhere would not be visible here.
- Interpretation note: the "one-line purpose" is intentionally a compression, so it drops
  qualifiers the source carries (for example `preserve` being the default remedy, or the
  fail-open branches). The `file:line` anchor is the escape hatch: a reader who needs the
  qualifier reads the cited body span.

## Reflection

What worked:

- A mechanical `grep -c "^export function"` next to a full-file read made the count claim
  falsifiable instead of asserted; the two agree at eight.
- Following the import graph one step out (`fanout-run.cjs:2776`) turned "what it does" into
  "what it is used to do", which is what caught the caller-coverage caveat in 1.4.
- Reading the doc comments as primary evidence kept each one-liner attributable to the author's
  own statement of intent rather than to an inference from the identifier.

What failed:

- The feature-catalog document for this subsystem was a dead end as a cross-check: it does not
  name any of the eight exported functions, so it could not corroborate the inventory.
- Name-derived guessing was tried first for `classifyViolation` and `__internals` and was wrong
  in both cases — `classifyViolation` is not merely a status labeler exposed for callers (its
  only in-module use is at `:839`), and `__internals` is not a function at all. Both were
  corrected by reading the declarations.

Ruled out:

- Treating `__internals` as an exported function: it is a plain object literal of private
  helpers, and the post-dispatch gate's `assert_jsonl_fields`/route-proof checks are unrelated
  to it. Counting it in the asked class would inflate the answer from 8 to 9.
  [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1381-1391]
- Citing per-function line anchors without the body span: a bare declaration line cannot support
  a purpose claim, so each row carries both the declaration line and the read range.

## Recommended Next Focus

Sibling-verification pass: have an independent lineage enumerate the same exports from the
`^export` grep alone and diff the two sets, then spot-check two of the four purpose one-liners
whose only support is a doc comment plus unit tests (`quarantineViolations`,
`revertOutOfScopeViolations`) against a live fan-out run's quarantine directory contents.
