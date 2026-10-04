# Iteration 2: release-update engine operator scenarios

## Focus

Q2 only: assess vendored trees without tags, offline checks, prereleases, renames, deletions, binary and generated files, partial or interrupted apply, and rollback. Compare engine behavior with test coverage for each.

## Actions Taken

1. Read the lineage config and strategy, research output contract, and engine/test inventory.
2. Traced release/base resolution, file classification, generated paths, apply locking/writes, and rollback.
3. Matched the scenarios to named test cases and assertions.
4. Did not run `node --test`: its fixture helper creates temporary repositories and `afterEach` recursively deletes them (`release-update.test.cjs:68-69,353-355`). That exceeds this iteration's allowed write paths.

## Findings

1. **P1 — Abrupt apply termination can strand the lock needed for rollback.** Apply acquires an exclusive lock (`release-update.cjs:1775-1794`), writes `rollback.json` before its per-file write loop (`release-update.cjs:1883-1902`), and removes the lock only in `finally` (`release-update.cjs:1903-1905`). Rollback also needs that lock (`release-update.cjs:2035-2036`). The partial-write test covers a caught filesystem error, verifies the lock is gone, then rolls back (`release-update.test.cjs:1045-1071`). **Inference:** abrupt process termination skips JavaScript cleanup, leaving a lock that blocks rollback; the CLI entrypoint has no signal cleanup or stale-owner recovery (`release-update.cjs:2177-2195`). A hard-kill fixture would confirm this boundary.

2. **P2 — Valid-UTF-8, NUL-free binary content can reach text merging.** `isBinary` detects NUL bytes or invalid UTF-8 only (`release-update.cjs:555-560`), and otherwise `classifyFile` can use a line merge (`release-update.cjs:645-663`). The binary test uses NUL-containing bytes (`release-update.test.cjs:985-1015`). **Inference:** some binary formats with valid UTF-8 and no NUL could be misclassified; a representative fixture is needed to confirm the merge risk.

3. **P2 — Generated-file handling is a closed path allowlist.** Four generated path classes are recognized (`release-update.cjs:79-100`); other generated outputs fall through to ordinary customization/conflict classification. Tests cover locally regenerated leaf manifests and graph metadata, plus authored graph-metadata edits (`release-update.test.cjs:503-539`), but not trigger-index artifacts or other generated paths. This is conservative, yet can make regeneration noise look like customization.

4. **P2 — Rename handling is path-based and has no direct rename test.** The report joins entries by exact path (`release-update.cjs:1015-1058`), so a same-unit rename is treated as deletion plus addition. Separate changelog deletion/addition is tested (`release-update.test.cjs:588-601`), but no rename operation or locally edited rename is exercised. A whole-unit rename reports the old unit as `removed` (`release-update.cjs:907-920`); apply automatically handles only `update` and `new` units, leaving removal to explicit decisions (`release-update.cjs:1680-1696`). This is cautious but can leave the old unit until the operator accepts deletion.

5. **P2 — Offline plus a tagless vendor fails closed, but that combination is untested.** Offline mode suppresses remote tag lookup and fetch (`release-update.cjs:739-756`). Without local release/base evidence, units are `blocked` and the overall status is `unknown` (`release-update.cjs:907-920,1098-1105`). The existing offline test checks that an unrelated directory unit remains visible when a recorded release cannot resolve (`release-update.test.cjs:603-617`); it does not cover a tagless vendor with no network.

### Scenario coverage

- **Vendored tree without tags:** works when a remote is reachable: remote tags are queried and missing commits fetched, then base inference compares trees (`release-update.cjs:743-755,793-836`). Covered using a no-history vendor and explicit local-path `--remote` (`release-update.test.cjs:1194-1202`). `record-base` requires the installed release named when no local tag exists (`release-update.cjs:1971-1980`; `release-update.test.cjs:541-568`).
- **Offline:** safely returns unknown/blocked without local evidence; cannot discover a remote release. Partially tested for an unresolvable recorded release (`release-update.test.cjs:603-617`), not for tagless vendor plus offline.
- **Prereleases:** stable is default; `--include-prerelease` opts in, with numeric release and prerelease ordering (`release-update.cjs:154-201,252-259,739-750`). Covered (`release-update.test.cjs:362-399,576-585`).
- **Renames:** same-unit file moves reduce to delete plus add; whole-unit removal needs explicit decisions. No direct rename test; only separate add/delete coverage (`release-update.test.cjs:588-601`).
- **Deletions:** unedited deleted files are `take-release`; locally edited deleted files conflict and need an explicit decision (`release-update.cjs:645-663`). Both file paths are covered (`release-update.test.cjs:588-601,985-1015`); whole-unit removal is reported separately (`release-update.test.cjs:446-455`).
- **Binary:** NUL/invalid-UTF-8 files conflict; NUL bytes are covered, valid-UTF-8 binary is not (`release-update.cjs:555-560,645-663`; `release-update.test.cjs:985-1015`).
- **Generated:** listed artifacts are marked for regeneration; other paths are ordinary files. Leaf manifest and graph metadata are tested; trigger-index patterns are not (`release-update.cjs:79-100,681-723`; `release-update.test.cjs:503-539`).
- **Partial apply:** a caught write failure leaves a rollback record and the normal exception path removes the lock; tested with a permission-induced failure and rollback (`release-update.cjs:1883-1905`; `release-update.test.cjs:1045-1071`). Hard interruption is untested and can strand the lock.
- **Rollback:** restores unchanged-after-apply paths, skips later edits, preserves modes/symlinks, and serializes with apply (`release-update.cjs:1797-1822,2015-2061`). Normal restoration, modes/symlinks, and edited-after-apply behavior are covered (`release-update.test.cjs:895-925,1123-1136`).

## Questions Answered

- **Q2:** Does `release-update.cjs` behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each?

## Questions Remaining

- Q1: Does each workflow (check, align, apply) promise only what `release-update.cjs` actually does: flags, exit codes, outputs, unit keys, locking, rollback?
- Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows?
- Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?
- Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity?

## Next Focus

This iteration stays on Q2. The remaining questions are left to their assigned passes; preserve the hard-interruption, binary heuristic, generated allowlist, rename, and offline-coverage gaps for synthesis.

## Sources Consulted

- `.skilled/commands/doctor/scripts/release-update.cjs`
- `.skilled/commands/doctor/scripts/tests/release-update.test.cjs`
- `specs/system-speckit/049-doctor-audit-followups/005-doctor-update-research/research/deep-research-config.json`
- `specs/system-speckit/049-doctor-audit-followups/005-doctor-update-research/research/deep-research-strategy.md`
- `.skilled/skills/system-deep-loop/deep-research/references/state/state-outputs.md`
- `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md`

## Assessment

- `newInfoRatio`: 0.70
- Novelty: confirmed normal release-selection and rollback paths while identifying hard-interruption recovery, binary classification, generated-file, rename, and offline-coverage boundaries.
- Confidence: high for observed code and tests; medium for hard termination and valid-UTF-8 binary behavior, which need focused fixtures.

## Reflection

Reading the test declarations and assertions gave direct coverage evidence without running a fixture suite that recursively removes temporary repositories. Remaining uncertainty is limited to two edge cases the suite does not construct.

## Recommended Next Focus

Continue with the reducer-assigned question on the next pass. If Q2 is revisited, first add an in-scope abrupt-process-termination scenario that verifies lock recovery.
