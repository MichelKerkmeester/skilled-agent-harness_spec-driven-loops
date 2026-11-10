# Iteration 1: Export Inventory of write-containment.ts

## Focus

Produce the complete export surface of `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` — every exported function with a one-line purpose and an exact `file:line` citation — and establish what the module exports *besides* functions so the inventory is complete rather than function-only.

## Findings

### A. Exported functions (8)

| # | Export | Location | One-line purpose |
|---|--------|----------|------------------|
| 1 | `drainGitContentionWarnings()` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:312]` | Returns and clears the accumulated list of git calls that spent their whole retry budget losing to a neighbour's `.git/index.lock`, so a fail-open degradation is reportable exactly once per drain. |
| 2 | `classifyViolation(status)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:511]` | Maps a two-character `git status --porcelain` XY code to the coarse violation kind: `??` → `untracked`, otherwise `D`/`A`/`M` first-match within the code → `deleted`/`added`/`modified`, else `other`. |
| 3 | `snapshotOutOfScopeDirtyPaths(opts)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:772]` | Captures the pre-dispatch baseline — every dirty path (tracked modified/deleted and untracked) lying outside `artifactDir`, each with a git blob hash and optionally a copy of its current bytes under `captureContentDir` — returning `[]` when git, the worktree, or the artifact-scope check is unavailable. |
| 4 | `detectNewOutOfScopeViolations(opts)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:814]` | Post-dispatch detection computed as (current out-of-scope dirty) minus (pre-dispatch baseline), re-hashing baseline paths so a same-path overwrite in a later iteration is still seen; throws when `artifactDir` is outside a resolvable git worktree and returns `[]` when git cannot be reasoned about. |
| 5 | `quarantineViolations(input)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1065]` | Writes each guarded path's durable evidence under `<artifactDir>/containment/quarantine/` — `manifest.json` plus `content/` bytes, `patch-head/` diff against HEAD, and `patch-baseline/` diff against the pre-dispatch bytes — never throwing, keeping the first failure on that path's entry and continuing the sweep. |
| 6 | `revertOutOfScopeViolations(opts)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1146]` | Applies the configured remedy to the given violating paths without ever deleting: in-HEAD paths are restored from HEAD, or from the baseline's captured bytes when the path was already dirty, or preserved when neither source is usable; not-in-HEAD paths are always preserved rather than removed. |
| 7 | `buildContainmentViolationEvent(input)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1214]` | Assembles the `containment_violation` JSONL event payload — violations, revert actions, optional patch path/error, and a `dataLossPossible` block naming every path that was rolled back to HEAD and where its bytes survive. |
| 8 | `enforceWriteContainment(input)` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1267]` | The high-level post-dispatch guard that composes the above in order (detect → capture patch → quarantine → revert → append event when `stateLogPath` is set) and partitions the outcome into fatal `violations` and non-fatal `advisories`, plus `recoveryHint` and `quarantinePath`. |

Function count verified deterministically, not by reading alone: a line-anchored parse of the file reports exactly 8 `export function` declarations and no default or async variant.

### B. Exported values that are not functions (3)

| Export | Location | One-line purpose |
|--------|----------|------------------|
| `BASELINE_MAX_FILE_BYTES` (`2 * 1024 * 1024`) | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:707]` | Largest single dirty file whose bytes the baseline capture (and the quarantine content copy) will store; anything larger is recorded as truncated instead. |
| `BASELINE_MAX_LANE_BYTES` (`64 * 1024 * 1024`) | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:716]` | Total bytes one snapshot/lane may copy, bounding the cost of a pre-dispatch sweep over a tree with many dirty files at once. |
| `__internals` | `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1382]` | Test/diagnostics bag re-exporting eight otherwise-private helpers: `resolveGitToplevel`, `resolveArtifactScope`, `parseStatusPorcelain`, `isInsideArtifact`, `isContainedInArtifact`, `canonicalPath`, `isRegenerableRuntimeState`, `isSubpath` (`:1383-1390`). |

### C. Exported types (12) — listed so the surface is provably complete

`ContainmentViolationKind` `[SOURCE: …write-containment.ts:40]`, `ContainmentViolation` `:47`, `ContainmentRevertAction` `:57`, `ContainmentRevertResult` `:64`, `ContainmentOptions` `:68`, `DirtyPathEntry` `:120`, `DetectOptions` `:140`, `ContainmentViolationEvent` `:145`, `EnforceInput` `:181`, `EnforceResult` `:200`, `QuarantineEntry` `:224`, `QuarantineResult` `:243` (all paths `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`).

Totals: 23 exported symbols — 8 functions, 2 constants, 1 diagnostics object, 12 types. There is no `export default` and no bare `export { … }` re-export in the file.

### D. The private side of the boundary (3 findings, secondary)

- 30 top-level functions are module-private. The pipeline stages `snapshotOutOfScopeDirtyPaths` → `detectNewOutOfScopeViolations` → `quarantineViolations` → `revertOutOfScopeViolations` share a large private substrate (`resolveArtifactScope:607`, `isContainedInArtifact:588`, `canonicalPath:558`, `isUnattributable:661`, `isRegenerableRuntimeState:678`) that is reachable from tests only through `__internals`, and only 8 of the 30 are exposed there.
- `drainGitContentionWarnings` returns `GitContentionWarning[]` `[SOURCE: …write-containment.ts:312]`, but the interface it names is declared without `export` `[SOURCE: …write-containment.ts:295]`. Callers can consume the value structurally but cannot import its type by name, and it is one of the 22 helpers NOT re-exported through `__internals`.
- The two scope-entry points disagree on the "cannot reason about git" case: `snapshotOutOfScopeDirtyPaths` returns `[]` (`:773-774`) while `detectNewOutOfScopeViolations` throws when a worktree exists but the artifact dir is outside it (`:816-820`). That is deliberate in the code's own comment ("hard failure, not an empty violation list") and is what makes the pair asymmetric by design rather than by accident.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (read in full: `:1-330`, `:331-690`, `:691-1070`, `:1071-1392`), cited above at line granularity.
- Deterministic parse of that file: `sha256 45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`, 65621 bytes, 1392 lines; line-anchored classification of every `^export` declaration, plus a `^export default` / `^export {` absence check and a `^function` private inventory.
- `grep -n "^export"` over the same file, used as the first lens and confirmed by the parse.
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:690-1010` (artifact and stop-policy validator: which lineage files the runner requires).
- `.opencode/skills/system-deep-loop/deep-research/references/state/state-outputs.md` and `state-jsonl.md` (required output shapes).

## Assessment

- **newInfoRatio:** 1.0
- **Novelty justification:** First iteration of a fresh lineage; every listed symbol and its purpose line is new to this packet, and the seven answers are the complete export surface rather than a sample of it.
- **Confidence:** high for the inventory itself — the symbol set is machine-derived from the file rather than recalled, the totals are closed (8 + 3 + 12 = 23), and each purpose line is a summary of code read directly at the cited lines. Medium for the secondary findings in section D, which are judgment about intent; the `dataLossPossible` and fail-open behaviours they rest on are quoted from the file's own doc-comments, so a reader can check them at the cited lines.

## Reflection

- **What worked:** running a deterministic line-anchored parse *after* reading the file. The parse settled the two places where reading alone invites error — whether the type exports belong in the answer (they do; a function-only grep would have under-reported by 12 symbols), and whether anything hides behind a re-export (nothing does: no default, no bare `export {`).
- **What failed:** nothing was retried; the first lens (grep) and the second (parse) agreed exactly.
- **Ruled out:** treating "every exported function" as the whole public API. Rejected because the answer would then omit `BASELINE_MAX_FILE_BYTES`/`BASELINE_MAX_LANE_BYTES`, which a caller must read to interpret `baselineTruncated`/`content_truncated`, and `__internals`, which is the only test-facing surface.
- **Deviation, stated rather than hidden:** the iteration state record was written directly into `deep-research-state.jsonl` instead of through `runtime/scripts/append-mode-event.cjs`. The gateway resolves the durable authority root to the repo-global `<repo>/.opencode/skills/.state/authority` (with run-ledger directories beside the run directory), which lies outside this lineage's write surface, and the lineage contract for this run forbids any write outside it. The record therefore carries no gateway receipt and no route-proof fields.
- **Not attempted:** no call-site fan-out (who calls the 8 functions) and no execution of the module. Both were out of the one-iteration scope, which is the inventory.

## Recommended Next Focus

With the iteration cap at 1 there is no further iteration in this lineage. The highest-value follow-up for an operator is the private-boundary question this inventory opened: enumerate the external callers of `enforceWriteContainment` and `revertOutOfScopeViolations` and check whether any of them relies on the 'preserve' default being a *non-fatal* advisory — that is the one place where the documented preserve-by-default contract and a caller's fatalness decision could silently disagree.
