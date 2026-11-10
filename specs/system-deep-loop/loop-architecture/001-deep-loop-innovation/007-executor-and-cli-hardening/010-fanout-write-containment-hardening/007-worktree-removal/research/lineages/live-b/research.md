# Research Synthesis — Exported Surface of `write-containment.ts`

Lineage `live-b` · session `fanout-live-b-1789402289626-dt269k` · generation 1 · 1 iteration ·
stop reason **maxIterationsReached** · 2026-09-14.

## 1. ANSWER

`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` exports **eight
functions**. Each is listed below with its declaration line and a one-line purpose.

| # | Exported function | `file:line` | One-line purpose |
|---|-------------------|-------------|------------------|
| 1 | `drainGitContentionWarnings` | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:312` | Drains and returns the recorded git calls that lost to a neighbour's `.git/index.lock`, so contention is reported once per drain instead of disappearing into the fail-open empty result. |
| 2 | `classifyViolation` | `…/write-containment.ts:511` | Maps a raw `git status --porcelain` XY code onto the violation-kind union (`??`→untracked, `D`→deleted, `A`→added, `M`→modified, else other). |
| 3 | `snapshotOutOfScopeDirtyPaths` | `…/write-containment.ts:772` | Pre-dispatch baseline of every dirty path outside `artifactDir` (minus unattributable dirs/files), each hashed and optionally byte-copied for a later faithful restore; returns `[]` when git, the worktree, or the scope cannot be reasoned about. |
| 4 | `detectNewOutOfScopeViolations` | `…/write-containment.ts:814` | Post-dispatch detection = current out-of-scope dirty paths minus the pre-dispatch baseline, hash-aware, throwing when `artifactDir` is outside the worktree. |
| 5 | `quarantineViolations` | `…/write-containment.ts:1065` | Writes the durable per-path record of what an out-of-scope write left behind under `<artifactDir>/containment/quarantine/` (manifest, bytes, HEAD diff, baseline diff); never throws. |
| 6 | `revertOutOfScopeViolations` | `…/write-containment.ts:1146` | Applies the remedy with no irreversible delete: `restore` goes to HEAD or to captured baseline bytes, `preserve` (default) leaves the tree alone, not-in-HEAD paths are always preserved. |
| 7 | `buildContainmentViolationEvent` | `…/write-containment.ts:1214` | Builds the `containment_violation` JSONL event payload, including a `dataLossPossible` block naming paths a HEAD rollback destroyed and where to recover them. |
| 8 | `enforceWriteContainment` | `…/write-containment.ts:1267` | The whole post-dispatch guard in one call: detect → split regenerable from guarded → capture revert patch → quarantine → apply remedy → partition violations from advisories → optionally append the event to the state log. |

Count basis: `grep -c "^export function"` over the file returns `8`, and those eight lines are
exactly the anchors above. No exported arrow-function constant and no nested `export` exists.
[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:312,511,772,814,1065,1146,1214,1267]

### 1.1 The other exported symbols (deliberately outside the asked class)

- **Constants (3):** `BASELINE_MAX_FILE_BYTES` (`:707`, 2 MiB per-file capture bound),
  `BASELINE_MAX_LANE_BYTES` (`:716`, 64 MiB per-snapshot bound), `__internals` (`:1382`, a bundle
  of eight private helpers "exported for tests / diagnostics" — an object, not a function).
- **Types/interfaces (12):** `ContainmentViolationKind` (`:40`), `ContainmentViolation` (`:47`),
  `ContainmentRevertAction` (`:57`), `ContainmentRevertResult` (`:64`), `ContainmentOptions`
  (`:68`), `DirtyPathEntry` (`:120`), `DetectOptions` (`:140`), `ContainmentViolationEvent`
  (`:145`), `EnforceInput` (`:181`), `EnforceResult` (`:200`), `QuarantineEntry` (`:224`),
  `QuarantineResult` (`:243`).
[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:40-250,707,716,1382]

Reporting these in a labelled section rather than folding them into the table keeps the asked class
(the eight functions) unambiguous while still answering the boundary question a reader would ask
next.

## 2. EVIDENCE

- **Primary:** the module itself — header `:1-37`, type block `:40-250`, body `:300-1391`, read in
  full. Revision anchored at `HEAD cbb1e4ae53`, sha256
  `45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`.
- **Usage evidence:** the only production consumer is
  `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, importing
  `snapshotOutOfScopeDirtyPaths`, `enforceWriteContainment`, `drainGitContentionWarnings`, and
  `__internals.resolveGitToplevel` at `:2776`, calling `enforceWriteContainment` at `:3436` with
  `artifactDir: lineageDir`, `mode`, `iteration`, `label`, `unattributableDirs`, and
  `unattributablePaths`, then consuming `advisories` as a warning event and `violations` plus the
  returned `event` as the fatal path at `:3452-3476`.
- **Behavioral evidence:** `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts`
  imports all eight functions (`:18-25`, minus the internal-only ones) and asserts, for example,
  `classifyViolation('??') === 'untracked'` and `drainGitContentionWarnings()` empty across a
  drain (`:1021-1024`, `:238-252`).

## 3. CONFIDENCE AND GAPS

- Enumeration: high (≈95%) — a mechanical count and a full read agree.
- Purpose one-liners: high (≈90%) — each is read from the function's own doc comment plus its body.
- Caller-coverage claim: medium-high (≈85%) — repository-wide search for the module's exported
  names found no consumer other than `fanout-run.cjs` and the unit test, but the search was limited
  to the repository working tree at one revision.
- **Gap:** four functions (`quarantineViolations`, `revertOutOfScopeViolations`,
  `buildContainmentViolationEvent`, `classifyViolation`) have no non-test caller outside the
  module; the first three are reached only through `enforceWriteContainment` (`:1310`, `:1319`,
  `:1367`) and `classifyViolation` only from detection (`:839`). Their purpose lines are
  correspondingly one notch weaker than the other four.
- **Gap:** this run did not execute the module or run its test file, so the purposes are read from
  source, not observed at runtime. Executing them was out of scope for a lineage whose write
  surface is its own directory.

## 4. RULED OUT

- Feature-catalog cross-check — the subsystem catalog document
  (`.opencode/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md`)
  names none of the exported functions and cannot corroborate the inventory.
- Identifier-name inference — produced two wrong claims before being replaced by source reads.
- Counting `__internals` in the asked class — it is an object of private helpers, so the answer
  would be inflated from eight to nine.

## 5. CONVERGENCE REPORT

| Field | Value |
|-------|-------|
| Stop reason | `maxIterationsReached` |
| Iterations completed | 1 of 1 |
| Questions answered | 3 / 3 |
| Average newInfoRatio | 1.00 |
| Convergence before the cap | treated as telemetry only (cap-bound run) |
| Quality guards | source diversity (three independent source families: module, caller, tests), focus alignment (single focus, no drift), no single-weak-source (every claim anchored to a line) |

## 6. REFERENCES

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts`
- `research/lineages/live-b/iterations/iteration-001.md`
- `research/lineages/live-b/resource-map.md`
- `research/lineages/live-b/findings-registry.json`

## 7. ROUTE AND CONTAINMENT NOTES (honest record of two deliberate deviations)

1. **Artifact root binding.** `step_resolve_artifact_root` was not executed as written. Per the
   fan-out dispatch contract, `artifact_dir` was bound directly to
   `config.fanout_lineage_artifact_dir`
   (`specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/research/lineages/live-b`)
   so that the lineage's own directory is the only write surface.
2. **State-record writer.** The canonical state-record path is
   `runtime/scripts/append-mode-event.cjs`, which resolves its durable authority root outside the
   run directory — by default `<repo>/.opencode/skills/.state/authority`
   [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts:70]
   — and hands the projection engine a protected path at `<runDirectory>/../.legacy-authority-protected`
   [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:538-541].
   Both land outside this lineage, and the dispatch contract forbids any write outside the lineage
   directory, so the gateway was **not invoked**. Instead this lineage wrote
   `deep-research-state.jsonl` and `deltas/iter-001.jsonl` as the projection directly. That is the
   sanctioned legacy-writer path while a mode's authority state is not yet under ledger authority —
   the mechanical gate's ledger-backing check reports `not-enforced` in exactly that state
   [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:199-207].
   The ledger directories already present in this lineage were created by the fan-out harness
   before this process started; this run added no frames.
   **Proposed contract fix (not applied, out of scope for a research run):** the dispatch contract
   and the append gateway disagree about whether a contained lineage may call the gateway. Either
   the gateway should accept an explicit authority/ledger root inside the run directory for
   contained lineages, or the dispatch contract should name the legacy-writer fallback it expects.
   Until then, a contained lineage that follows the skill's "call the gateway, never write the
   state log" rule will write outside its own boundary.
