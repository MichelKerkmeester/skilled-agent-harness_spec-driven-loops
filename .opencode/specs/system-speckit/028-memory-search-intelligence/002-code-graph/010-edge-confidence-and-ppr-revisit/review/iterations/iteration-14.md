# Iteration 14: Seeded-PPR Re-Benchmark Evidence

## Dimension

Traceability review of the seeded-PPR re-benchmark evidence. Scope was limited to verifying whether the prose claims in `implementation-summary.md` and the follow-up note in `007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md` are faithfully backed by raw benchmark data, and whether the benchmark harness was the same original script rather than a modified comparison script.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/implementation-summary.md:67`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md:25`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr/results/metrics.json:37`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr/scripts/seeded-ppr-impact-benchmark.mjs:74`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/changelog/002-code-graph/changelog-002-010-edge-confidence-and-ppr-revisit.md:48`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-005-codegraph-seeded-ppr.md:24`

## Findings by Severity

### P0

None.

### P1

#### P1-014-001 [P1] Confidence-distribution claim is not backed by the persisted raw benchmark evidence

- Claim: The revisit evidence says a fresh full-repo reindex produced four live CALLS-edge confidence tiers, specifically 892 at `0.3`, 2,267 at `0.35`, 16,198 at `0.75`, and 2,838 at `0.9`, but the persisted raw benchmark artifact does not contain that distribution, and the only local live code-graph database currently has a single `0.8` confidence tier.
- Evidence: `benchmark-results.md:66` and `changelog-002-010-edge-confidence-and-ppr-revisit.md:48` record the four-tier distribution as a verification fact. The raw benchmark output at `results/metrics.json:31` through `results/metrics.json:65` records default-off metadata and metric aggregates, but no confidence histogram or edge-count distribution. The only discovered local DB was `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`; querying `CALLS` edge metadata returned `0.8|19487`, while the `metrics.json:5` recorded live DB path under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/028-deep-research-wt/...` was unavailable.
- Counterevidence sought: Searched for additional `results/**` artifacts under the seeded-PPR benchmark folder; only `results/metrics.json` exists. Queried the recorded `liveDbPath`; it could not be opened. Queried the current workspace code-graph DB as the only local substitute. Checked the changelog for the claimed counts.
- Alternative explanation: The four-tier distribution may have existed only in the temporary implementation worktree after a flag-on reindex and then was intentionally not preserved because the production/default-off DB was restored or rebuilt. If so, the prose should point to a durable raw artifact or explicitly state the distribution was transient and no longer reproducible from checked-in evidence.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 or close if a durable raw artifact is added or referenced that contains the exact four confidence buckets and counts for the same benchmark run, or if the docs are amended to limit the claim to non-persisted operator evidence rather than raw benchmark evidence.
- Finding class: matrix/evidence.

### P2

None.

## Traceability Checks

- Raw metric deltas match the main prose claims. `metrics.json:37` through `metrics.json:65` records precision@3 delta `-0.1`, precision@5 delta `-0.06`, precision@8 delta `-0.0375`, recall deltas `-0.0139` for K 3/5/8 against the same-run flat baseline, nDCG@3 delta `-0.0574`, nDCG@5 delta `-0.0415`, and nDCG@8 delta `-0.0309`.
- The wider prose ranges are explainable when compared against both the original benchmark table and the current same-run flat baseline: original flat precision@5 `0.9800` in `benchmark-results.md:30` versus current PPR precision@5 `0.94` in `metrics.json:48` gives `-0.04`, while current same-run flat `1.0` in `metrics.json:47` gives `-0.06`; original precision@8 `0.9125` in `benchmark-results.md:31` versus current PPR precision@8 `0.8812` in `metrics.json:57` gives about `-0.031`, while current same-run flat `0.9187` in `metrics.json:56` gives `-0.0375`.
- Calibration claim matches raw data. `metrics.json:76` through `metrics.json:128` shows damping `0.5` ties flat nDCG@5 at `1`, while all other tested damping values have nDCG@5 below flat.
- Script identity checks passed. `git diff --no-index` between the original tracked script at commit `f33835dbfe` under `.opencode/specs/system-spec-kit/.../seeded-ppr-impact-benchmark.mjs` and the current script under `.opencode/specs/system-speckit/.../seeded-ppr-impact-benchmark.mjs` produced no output. `git diff -- <current-script>` also produced no output, confirming no uncommitted local edits.

## Verdict

The benchmark metric prose is materially faithful to `metrics.json`, and the benchmark harness is byte-identical to the original tracked script. The remaining evidence gap is specific: the key four-tier confidence-distribution premise is not independently recoverable from the persisted raw benchmark artifact, and the available local DB currently contradicts the claimed distribution. That blocks a clean evidence-traceability pass until the raw distribution evidence is preserved or the docs qualify the claim.

## Next Dimension

Review the durability of benchmark provenance artifacts: raw DB snapshots, query logs, environment flags, and reindex command output should be checked against any release-readiness claims that depend on transient worktree state.

Review verdict: CONDITIONAL
