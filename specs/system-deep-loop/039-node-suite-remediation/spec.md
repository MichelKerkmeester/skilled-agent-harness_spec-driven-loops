# Spec — node:test suite remediation

## Purpose

The node:test gate reports 63 failures that were masked for months by a
reporter-parse bug (now fixed). The failures are not user-facing runtime
breakage; they are drift left behind by skill/spec reorganizations. This packet
remediates the drift so the gate reports an honest, mostly-green result.

## Scope

Three independent failure clusters:

- **Cluster A — deep-alignment command-benchmark references (6 failures).**
  A packet renumber (`066-command-surface-benchmark` → `035-…`), a fixtures
  directory rename (`behavior-benchmark` → `behavior_benchmark`, scoped to the
  command-benchmark packet only), and a skill mode rename
  (`create-command` → `sk-create-command`) left stale paths in scenario
  definitions, the benchmark matrix, the adapter, and four tests. The source
  data exists at the new locations; this is a mechanical repoint.

- **Cluster B — compiled-route-manifest drift (16 failures).** The frozen
  compiled-routing artifacts lag the evolved skill fleet (a mode rename, a
  review-key collapse) and need compiler edits plus a fleet re-mint. The
  runtime fail-safes to legacy prose routing, so nothing is user-facing broken.

- **Cluster C — mk-communication-projection unbuilt dist (19 failures).** The
  plugin imports a git-ignored, never-built `dist/`. Fixing it is a build/test
  design choice, not a code edit.

## Requirements

- Each fix tracks the current source of truth; no stale magic values are
  re-introduced.
- The `behavior-benchmark` name is legitimate elsewhere in the tree; the rename
  is scoped strictly to the command-benchmark fixture paths.
- The frozen runner-hash pin in Cluster A is held: re-pinning it blindly can
  mask a real scoring regression, so it is verified against the golden
  fingerprints before any change, or left for its owner.

## Out of scope

- Origin-tree goal-plugin failures surfaced by the honest runner but not yet
  triaged against this checkout.
- Any behavior change to shipped routing or benchmark logic beyond path/name
  reconciliation.

## Proof

- `git grep` of the stale tokens returns zero in the touched files.
- The previously-failing suites in each cluster run green.
- Legitimate `behavior-benchmark` references outside the command-benchmark
  fixtures are unchanged.
