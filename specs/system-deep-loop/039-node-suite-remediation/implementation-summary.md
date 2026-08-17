# Implementation Summary — node:test suite remediation

## Status: Cluster A path-rot shipped; sha tripwires + inventory + Clusters B/C deferred

## What shipped

Cluster A's mechanical reference repoint, applied in an isolated worktree and
verified before commit. 21 files: 16 DAB scenarios, the benchmark matrix, the
adapter, and three command-* tests.

- `066-command-surface-benchmark` → `035-command-surface-benchmark` (the packet
  was renumbered; `066` no longer exists, so every reference was broken).
- The fixtures directory segment `behavior-benchmark` → `behavior_benchmark`,
  scoped strictly to the command-benchmark packet paths (both the inline
  scenario/matrix paths and the split `path.join(SPEC_ROOT, …)` test constants).
- Adapter `create-command` → `sk-create-command` (the skill mode was renamed).
- DAB-016 marker cell `conformance-benchmark` → `conformance_benchmark` to match
  the contract field and the pinned source.

### Verification (worktree)
- `git grep 066-command-surface-benchmark` in deep-alignment → 0.
- Hazards preserved: the unrelated `059-deep-alignment-mode` fixture paths (11
  files) stay kebab; the legitimate `assets/conformance-benchmark` paths (4
  files), the shared runner dir, and the scenarios' own `behavior-benchmark`
  directory are all unchanged.
- `command-behavior-matrix.test.cjs` now passes (6/0); the path-rot subtests in
  the other command-* suites pass.

## Deferred — regression-risk, needs owner judgment

The remaining failures are deliberate sha256/inventory tripwires, not path drift.
Re-pinning them blindly defeats the tripwire and can mask a real change, so they
are handed back with the exact current values:

- `command-scenario-rollout` — `create/benchmark.md` pin `93e50ef0…` → current
  `7069a4be…`; runner `.cjs` pin `f568f79f…` → current `cc5e0fa8…` (the runner
  has a golden-fingerprint check that must be run and proven clean *before*
  re-pinning the byte hash).
- `command-topology-pilot` — `deep/review.md` pin drifted → `f2d5c62a…`.
- `sk-doc-command-adapter` — real inventory drift: discover count 35 ≠ prompt-sync
  count 34; needs reconciliation, not a re-pin.

### Clusters B and C (untouched)
- **B — compiled-route-manifest (16):** compiled-routing artifacts lag the skill
  fleet (a mode rename, a review-key collapse); needs compiler edits + a fleet
  re-mint. No one-shot regen. Runtime fail-safes to legacy prose routing.
- **C — mk-communication-projection (19):** imports a git-ignored, unbuilt
  `dist/`; a build/test design decision, not a code edit.

### Note on execution
The operator-chosen DeepSeek V4 Flash dispatch was blocked by this session's
permission classifier (`opencode run --dangerously-skip-permissions` denied), so
the mechanical edits were applied deterministically instead — safer and fully
verifiable for an exact string repoint.
