# Tasks — node:test suite remediation

## Cluster A — deep-alignment reference repoint
- [x] A1 Repoint `066-command-surface-benchmark` → `035-…` across the 16 DAB
      scenarios, the matrix JSON, the adapter, and the command-* tests.
- [x] A2 Scope-rename `behavior-benchmark` → `behavior_benchmark` in the
      command-benchmark fixture paths only (inline + split test constants).
- [x] A3 Adapter `create-command` → `sk-create-command`.
- [x] A4 DAB-016 marker `conformance-benchmark` → `conformance_benchmark`.
- [x] A5 Verify: stale tokens grep to zero; command-behavior-matrix green;
      legit `behavior-benchmark` / `059` / conformance-benchmark refs unchanged.
- [ ] A6 Runner-hash + doc-hash tripwires: run golden fingerprints, re-pin only
      if clean. DEFERRED to owner (regression-risk).

## Cluster A — deferred tripwires (owner judgment)
- [ ] `create/benchmark.md` + `deep/review.md` doc-hash re-pins.
- [ ] runner `.cjs` byte-hash re-pin after golden-fingerprint proof.
- [ ] adapter discover-vs-sync inventory reconciliation (35 ≠ 34).

## Cluster B — compiled-routing re-mint (DEFERRED, non-mechanical)
- [ ] B1 Compiler edits (mode rename, review-key collapse).
- [ ] B2 Re-mint the seven hub manifests.
- [ ] B3 Verify: manifest test green after a runtime rebuild.

## Cluster C — unbuilt dist (DEFERRED, design decision)
- [ ] C1 Choose and apply the durable fix for the git-ignored dist.
- [ ] C2 Verify: mk-communication-projection suite green.
