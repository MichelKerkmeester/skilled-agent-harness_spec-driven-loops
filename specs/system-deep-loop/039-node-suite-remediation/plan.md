# Plan — node:test suite remediation

## Approach

Work happens in an isolated git worktree at the origin tip, never the shared
primary checkout (which carries concurrent-session work). DeepSeek V4 Flash is
dispatched per cluster for the mechanical edits; every result is verified with
objective checks before it is trusted, because Flash is non-reasoning and its
output is a hypothesis until grep and the test run confirm it.

## Cluster A — deep-alignment reference repoint

Exact, enumerated string replacements (no heuristic search-and-replace):

1. `066-command-surface-benchmark` → `035-command-surface-benchmark`
   (unambiguous token; safe everywhere it appears in the target files).
2. Inside command-benchmark fixture paths only, the segment
   `/behavior-benchmark/fixtures/` → `/behavior_benchmark/fixtures/`.
   The scenario files' own directory (`deep-alignment/behavior-benchmark/`)
   stays kebab and must not change.
3. Adapter `sk-doc-command.cjs`: `create-command` → `sk-create-command` in the
   canon and contract path constants.
4. DAB-016 marker pin: `conformance-benchmark` → `conformance_benchmark` to
   match the contract field and the pinned source.

Targets: 16 DAB scenario `.md`, `command-benchmark-matrix.json`, the adapter,
and the four `deep-alignment/scripts/tests/command-*.test.cjs` constants.

**Held:** the frozen runner-byte-hash pin — verify the golden fingerprints run
clean before re-pinning; otherwise report it, do not blind-fix.

## Cluster B — compiled-routing re-mint

Compiler edits for the renamed mode and the review-key collapse, then re-mint
the seven hub manifests. Verified by rebuilding the runtime and running the
manifest test. High blast radius; verify-first.

## Cluster C — unbuilt dist

Decide the durable fix (build in test setup, guard the test on dist presence,
or un-ignore the artifact) and apply the smallest one that keeps the suite
honest without committing a build artifact that re-rots.

## Verification

Per cluster: the stale tokens grep to zero, the previously-failing suites run
green, and a scoped diff shows no unrelated file touched.
