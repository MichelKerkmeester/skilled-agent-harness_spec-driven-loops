# Deep Research Strategy — live-a

## Research Topic

List every exported function of `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` with a one-line purpose each, citing file:line.

Scope decision for a 1-iteration cap: the deliverable is an exact, complete inventory with per-symbol purpose lines, not an evaluation of the design. Design observations are recorded as secondary findings only.

## Known Context

Bounded pre-dispatch snapshot (pointer-based; captured at INIT, not a substitute for reading the file):

- **Source under study:** `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` — 1391 lines, 65621 bytes, sha256 `45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`.
- **Module header states its contract** (`write-containment.ts:1-29`): a dispatched leaf can write anywhere, because its artifact-dir boundary is prompt-only; this module turns that into a structural boundary by diffing the git working tree after a dispatch. Remedy defaults to PRESERVE; restore is opt-in; the guard fails OPEN.
- **Structural layout of the file (section banners):** 1. TYPES (`:36-38`), 2. PATH HELPERS (`:252-254`), 3. GIT HELPERS (`:273-275`), 4. CLASSIFICATION (`:507-509`), 5. PUBLIC API (`:695-697`).
- **Integration points:** `runtime/scripts/append-mode-event.cjs` is the ledger-backed write path for state records (state log is a projection of the ledger, not a direct write target). `captureContentDir` output shape (`<captureContentDir>/containment/baseline/<repo-relative-path>`, `write-containment.ts:749-753`) matches the `containment/baseline/...` tree already present in this lineage directory — evidence that a pre-dispatch baseline capture with a content dir ran for this fan-out.
- **Conventions observed in the file:** heavily documented WHY-comments; every exported symbol carries a purpose doc-comment except `__internals`; git wrappers are synchronous by contract (`:327`); all git calls are read-only except `checkout HEAD --` inside the opt-in restore path.
- **Gaps:** no `resource-map.md` exists in the spec folder (`resource_map_present: false`); no prior iteration files exist in this lineage, so this is generation 1, iteration 1.

## Key Questions

- Q1: What is the exact set of exported functions in `write-containment.ts`, and what is each one's purpose in one line?
- Q2: What does the file export that is NOT a function (types, constants), so the inventory is complete rather than function-only?
- Q3: Which symbols are deliberately module-private, i.e. what is the public/private boundary?

## Answered Questions

- Q1 (iteration 1): the file exports 8 functions — `drainGitContentionWarnings` (`write-containment.ts:312`), `classifyViolation` (`:511`), `snapshotOutOfScopeDirtyPaths` (`:772`), `detectNewOutOfScopeViolations` (`:814`), `quarantineViolations` (`:1065`), `revertOutOfScopeViolations` (`:1146`), `buildContainmentViolationEvent` (`:1214`), `enforceWriteContainment` (`:1267`).
- Q2 (iteration 1): besides the 8 functions the module exports 2 constants (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:707`, `:716`), the `__internals` diagnostics bag (`:1382`) and 12 types (`:40`–`:243`) — 23 symbols in total.
- Q3 (iteration 1): 30 top-level functions are private; `__internals` exposes 8, and the fatal/advisory partition helpers inside `enforceWriteContainment` are not directly reachable from tests.

## What Worked

- Pairing a read of the whole file with a line-anchored deterministic parse: the parse settled symbol counts, closed the inventory (8 + 3 + 12 = 23), and proved the absence of `export default` / bare re-exports, which reading alone asserts weakly.
- Reading the module's own doc-comments as primary evidence for intent: every exported symbol except `__internals` carries a purpose comment, so the one-line purposes are the author's stated contract corroborated by the code beneath them.
- Reading `fanout-run.cjs`'s lineage validator before writing any packet file, so `research.md`, `iterations/iteration-001.md`, `deltas/iter-001.jsonl` and the terminal `synthesis_complete` record landed in the shapes the runner checks.

## What Failed

- Nothing failed and nothing was retried; the grep lens and the parse lens agreed exactly on the first pass.

## Exhausted Approaches

- None. One iteration ran, at a cap of one.

## Ruled-Out Directions

- Reading only the `export function` grep hits and calling that "every export": rejected because it would silently drop the 12 type exports, the 2 exported constants, and `__internals`, which are also part of the module's public surface.

## Next Focus

Cap reached (`maxIterations: 1`, `stopPolicy: max-iterations`); this lineage stops here with `stopReason: maxIterationsReached` and no further focus. Handed to the operator in `research.md` §7: trace the external callers of `enforceWriteContainment` and `revertOutOfScopeViolations` to see whether any of them treats a preserved not-in-HEAD path as non-fatal, since the guard deliberately leaves fatal-ness to the caller.
