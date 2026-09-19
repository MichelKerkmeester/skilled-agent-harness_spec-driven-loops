# Research Synthesis — Export Surface of `write-containment.ts`

**Topic:** List every exported function of `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` with a one-line purpose each, citing file:line.
**Lineage:** `live-a` (session `fanout-live-a-1789402289626-dt269k`), executor `cli-pi` / `deepseek-v4.1-flash`.
**Artifact dir:** `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/research/lineages/live-a`.
**Source revision read:** 1392 lines, 65621 bytes, sha256 `45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`.

All line citations below are into `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` unless the path is written out in full.

---

## 1. Answer — the eight exported functions

| Export | Line | One-line purpose |
|--------|------|------------------|
| `drainGitContentionWarnings()` | `312` | Return and clear the list of git calls that exhausted their `.git/index.lock` retry budget, so a fail-open degradation is reported once per drain instead of silently reading as a clean tree. |
| `classifyViolation(status)` | `511` | Map a two-character `git status --porcelain` XY code to a `ContainmentViolationKind`: `??` → `untracked`; otherwise first match of `D`/`A`/`M` → `deleted`/`added`/`modified`; else `other`. |
| `snapshotOutOfScopeDirtyPaths(opts)` | `772` | Capture the pre-dispatch baseline: every dirty path (tracked modified/deleted and untracked) outside `artifactDir`, with a git blob hash and, when `captureContentDir` is set, a copy of its bytes under `<captureContentDir>/containment/baseline/<repo-relative-path>`; returns `[]` when git, the worktree, or the artifact scope is unusable. |
| `detectNewOutOfScopeViolations(opts)` | `814` | Compute post-dispatch violations as (current out-of-scope dirty) minus (pre-dispatch baseline), re-hashing baseline paths so a same-path overwrite in a later iteration is still detected; throws when `artifactDir` is outside a resolvable worktree. |
| `quarantineViolations(input)` | `1065` | Write each guarded path's durable evidence under `<artifactDir>/containment/quarantine/` — `manifest.json`, `content/` bytes, `patch-head/` diff against HEAD, `patch-baseline/` diff against pre-dispatch bytes — never throwing, keeping the first per-path failure and continuing. |
| `revertOutOfScopeViolations(opts)` | `1146` | Apply `'preserve'` (default) or opt-in `'restore'` per violating path without ever deleting: in-HEAD paths come from HEAD, or from captured baseline bytes when the path was already dirty, or are preserved when neither source is usable; not-in-HEAD paths are always preserved. |
| `buildContainmentViolationEvent(input)` | `1214` | Assemble the `containment_violation` JSONL payload — violations, revert actions, optional patch path/error, and a `dataLossPossible` block naming every path rolled back to HEAD and where its bytes survive. |
| `enforceWriteContainment(input)` | `1267` | The composing post-dispatch guard: detect → capture the revert patch → quarantine → revert → optionally append the event when `stateLogPath` is set, then partition the outcome into fatal `violations` and non-fatal `advisories` with `recoveryHint` and `quarantinePath`. |

## 2. Non-function exports (the topic's "every exported function" is complete only with these)

| Export | Line | Purpose |
|--------|------|---------|
| `BASELINE_MAX_FILE_BYTES` (`2 * 1024 * 1024`) | `707` | Largest single file whose bytes the baseline capture will store; larger files are recorded as truncated instead. |
| `BASELINE_MAX_LANE_BYTES` (`64 * 1024 * 1024`) | `716` | Total bytes one snapshot/lane may copy, bounding the cost of a sweep over a tree with many dirty files at once. |
| `__internals` | `1382` | Test/diagnostics bag re-exporting eight private helpers: `resolveGitToplevel`, `resolveArtifactScope`, `parseStatusPorcelain`, `isInsideArtifact`, `isContainedInArtifact`, `canonicalPath`, `isRegenerableRuntimeState`, `isSubpath` (`1383-1390`). |
| 12 type exports | one per line, below | The module's whole public type surface: |

| Type | Line |
|------|------|
| `ContainmentViolationKind` | `40` |
| `ContainmentViolation` | `47` |
| `ContainmentRevertAction` | `57` |
| `ContainmentRevertResult` | `64` |
| `ContainmentOptions` | `68` |
| `DirtyPathEntry` | `120` |
| `DetectOptions` | `140` |
| `ContainmentViolationEvent` | `145` |
| `EnforceInput` | `181` |
| `EnforceResult` | `200` |
| `QuarantineEntry` | `224` |
| `QuarantineResult` | `243` |

**Closed inventory:** 8 functions + 2 constants + 1 object + 12 types = **23 exported symbols**. No `export default`, no bare `export { … }`.

## 3. Secondary findings

1. **Private return type on a public function.** `drainGitContentionWarnings` returns `GitContentionWarning[]` (`312`) but that interface is declared without `export` (`295`), so consumers can use the value structurally yet cannot name its type; it is also not among the eight helpers in `__internals`.
2. **Asymmetric unusable-git handling by design.** `snapshotOutOfScopeDirtyPaths` returns `[]` (`773-774`) for every skip case, while `detectNewOutOfScopeViolations` throws when a worktree exists but the artifact dir is outside it (`816-820`). The comment states the intent — "hard failure, not an empty violation list" — so this is a deliberate split, not drift, but a caller must handle two different failure shapes from two functions that read as a matched pair.
3. **Test reachability.** 30 top-level functions are private; `__internals` exposes 8. The partition helpers inside `enforceWriteContainment` (`escapesArtifactTree` `1286`, `isPacketScopedPath` `1343`, `isPreservedAdvisory` `1353`) are reachable only through the full guard, so the fatal-versus-advisory policy is testable only end to end.

## 4. Method and verification

- **Two lenses, both recorded.** Lens 1: `grep -n "^export"` over the file. Lens 2: a line-anchored parse that classified every `^export` declaration by kind, asserted the absence of `export default` and bare `export {`, and inventoried every `^function`. The lenses agreed exactly, and the second one is what produced the closed totals in §2.
- **Failure mode the second lens existed to catch:** a function-only reading of the topic. It would have dropped 15 symbols from the answer, including the two constants a caller needs in order to interpret `baselineTruncated` and `content_truncated`.
- **Not verified by execution.** The module was read, parsed and cross-checked, but not imported or run; every purpose line is a summary of code read at the cited lines, not an observed runtime behaviour.

## 5. Convergence report

| Field | Value |
|-------|-------|
| stopReason | `maxIterationsReached` |
| stopPolicy | `max-iterations` (cap honoured: 1 iteration run, 0 skipped) |
| iterations completed | 1 of 1 |
| converged | false — convergence before the cap is telemetry only for this lineage |
| questions answered | 3 / 3 (ratio 1.0) |
| average newInfoRatio | 1.0 (single iteration: 1.0) |
| trend | n/a (one sample) |
| stuck count | 0 |
| guard violations | none recorded by this lineage in its own artifact dir |
| resource map | emitted at `resource-map.md` (evidence-derived; `resource_map_present: false`, no packet-level map existed at INIT) |

## 6. Process deviations (stated, not hidden)

- **Direct state-log write.** Iteration and synthesis records were written straight into `deep-research-state.jsonl` instead of through `runtime/scripts/append-mode-event.cjs`. The gateway resolves its durable authority root to the repo-global `<repo>/.opencode/skills/.state/authority` and keeps run ledgers beside the run directory, both outside this lineage's write surface, which this run's contract forbids writing to. Consequence: these records carry no gateway receipt and no route-proof fields.
- **`resolveArtifactRoot` not run.** `artifact_dir` was bound directly to the `config.fanout_lineage_artifact_dir` override, as instructed for this fan-out, so no artifact root was resolved or minted.

## 7. Open gaps (for a follow-up run, not answered here)

1. **Caller behaviour around the preserve default.** Which callers treat a preserved not-in-HEAD path as non-fatal? `enforceWriteContainment` decides fatal-versus-advisory from packet scope (`1343-1357`) and leaves the final judgement to the caller, so a caller that ignores `advisories` would swallow a genuine out-of-scope write.
2. **Baseline capture in this very lineage.** `containment/baseline/...` exists in this artifact dir with the exact shape `captureBaselineFile` writes (`749-753`), which implies a capture with a content dir was configured for this fan-out; the harness side of that configuration was not traced.
3. **The 12 type exports are listed, not individually annotated.** Their fields are documented in the file, and no caller-level review was performed.

## 8. References

- `deep-research-strategy.md`, `iterations/iteration-001.md`, `deltas/iter-001.jsonl`, `findings-registry.json` (this artifact dir).
- `resource-map.md` (this artifact dir) — evidence-derived resource map for this run.
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (primary source, all cited lines).
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:690-1010` (lineage artifact and stop-policy validation contract).
- `.opencode/skills/system-deep-loop/deep-research/references/state/state-outputs.md`, `state-jsonl.md`, `state-reducer-registry.md`.
