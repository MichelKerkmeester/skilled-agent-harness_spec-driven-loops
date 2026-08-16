# Checklist — node:test suite remediation

## [P0] Cluster A mechanical repoint
- [x] `066-command-surface-benchmark` → `035-…` across the 21 files (verified) | Evidence: `git grep 066-command-surface-benchmark` in deep-alignment → 0
- [x] `behavior_benchmark` scoped to command-benchmark fixture paths only (verified) | Evidence: `059` fixtures (11 files) + `assets/conformance-benchmark` (4) + shared/own dirs unchanged
- [x] Adapter `create-command` → `sk-create-command` (verified) | Evidence: adapter lines 56/60 now `sk-create-command`, line 69 `035-…`
- [x] DAB-016 marker `conformance-benchmark` → `conformance_benchmark` (verified) | Evidence: pin-table row cell updated
- [x] `command-behavior-matrix` suite green after repoint | Evidence: node --test → 6 pass 0 fail

## [P0] Safety
- [x] Applied in an isolated worktree; shared primary checkout untouched | Evidence: worktree at origin tip `5fb0253f27`
- [x] No unrelated file changed | Evidence: `git status` = 21 deep-alignment files + packet 039 only

## [P1] Deferred (owner judgment — NOT done here)
- [ ] Re-pin `create/benchmark.md`, `deep/review.md` doc hashes after confirming intent [DEFERRED: tripwire, owner confirms]
- [ ] Verify runner golden fingerprints, then re-pin the runner `.cjs` byte hash [DEFERRED: regression-risk]
- [ ] Reconcile the adapter discover-vs-sync inventory (35 ≠ 34) [DEFERRED: real drift]
- [ ] Cluster B compiled-routing re-mint [DEFERRED: non-mechanical]
- [ ] Cluster C unbuilt-dist design decision [DEFERRED: non-mechanical]
