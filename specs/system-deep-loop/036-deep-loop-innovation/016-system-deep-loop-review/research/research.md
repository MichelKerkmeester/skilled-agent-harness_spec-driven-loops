---
title: "Deep-Loop Runtime Latent-Issue Research — Synthesized Findings"
trigger_phrases: []
---
# Deep-Loop Runtime Latent-Issue Research — Synthesized Findings

## 1. Overview

Fan-out deep-research run over the `system-deep-loop` machinery, hunting latent issues,
failure modes, races, and undocumented behaviors on the wider surface beyond the 016
deep-review dimension audit and the remediated 014 gateway-alignment findings. One CLI
lineage (`glm`, cli-devin / GLM 5.2) ran a forced-depth 10-iteration loop and produced
42 evidence-cited findings. This document is the canonical synthesis; per-iteration
narratives live under `research/lineages/glm/iterations/`.

- **Spec folder:** specs/system-deep-loop/036-deep-loop-innovation/016-system-deep-loop-review
- **Stop reason:** maxIterationsReached (`--stop-policy=max-iterations`; convergence treated as telemetry)
- **Severity rollup:** 1×P0, 15×P1, 26×P2 (42 total)
- **Status:** terminal, synthesis complete

## 2. Research Topic

Fresh broad investigation of the system-deep-loop machinery for latent issues, failure
modes, races, and undocumented behaviors the 016 deep-review's dimension-audit did not
reach. Research lens (how does X work, where could it break), not an audit. Surfaces:
append gateway + typed ledger + legacy projections, reducers (reduce-state.cjs,
reduce-alignment-state.cjs), fan-out pool (fanout-run/pool/salvage/merge.cjs), executor
adapters (cli-pi/cli-devin/cli-cursor/cli-opencode/cli-codex/cli-claude-code),
verify-iteration.cjs, convergence/scoring path, the 8 /deep:* command docs + 16
orchestrator YAMLs, deep-loop agents across six runtimes. Explicit non-goal:
re-deriving 016 review findings or remediated 014 gateway-alignment findings.

## 3. Execution Provenance

| Field | Value |
|-------|-------|
| Orchestrator | /deep:research:auto (deep-research-auto.yaml, fan-out branch) |
| Runner | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` run_id `1787718857188-beoi5q` |
| Lineage | label `glm`, kind cli-devin, model glm-5-2, iterations 10, concurrency 1 |
| Wall clock | ~20 min (started 04:34:17Z, completed 04:54:28Z, duration_ms 1211457) |
| Outcome | succeeded=1 failed=0 orphaned=0 (orchestration-summary.json) |
| Merge | fanout-merge.cjs exit 0 — 42 key findings merged into research/findings-registry.json |

## 4. Methodology

Each iteration read runtime source directly under
`.opencode/skills/system-deep-loop/runtime/`, traced code paths end-to-end, and
cross-referenced the 016 and 014 review reports to exclude known issues. Findings cite
file:line as reported by the lineage; citations are leaf-reported evidence and were not
independently re-verified by the orchestrator during synthesis.

## 4a. Conductor Re-Verification (load-bearing findings)

The synthesis reports leaf-supplied citations. The conductor independently re-verified the
highest-severity findings against current source before this packet was committed:

| Finding | Verdict | Confirmed against |
|---------|---------|-------------------|
| F-029 (P0) | CONFIRMED | `append-mode-event.ts:510-516` sets `projectionRefreshed=false`/`projectionError` on failure, but `:539-544` returns `ok:true` unconditionally; CLI `append-mode-event.cjs:502` exits `outcome.ok ? 0 : 2`, so a projection-refresh failure still exits 0 and the prompt-pack exit-2-halt never fires. |
| F-010 (P1) | CONFIRMED | `fanout-merge.cjs` reconstruction uses `severity: detail.severity || 'P2'`; the verdict counts at `:800-810` under-fire when a reconstructed finding has no severity field. |
| F-011 (P1) | CONFIRMED (throw real) | three `throw inputError(...findingsCount...)` sites at `fanout-merge.cjs:961-963, 983-985, 986-987`; the full-abort-for-all-lineages blast radius depends on the caller lacking per-lineage isolation (not yet traced). |

The other 39 findings are cited hypotheses; confirm each against source before any fix.

## 5. Findings Catalog — P0

| ID | Title | Source |
|----|-------|--------|
| F-029 | Append gateway returns `ok: true` when projection refresh fails — ledger and state log diverge silently | append-mode-event.ts:510-516, 539-544 |

F-029 is the highest-severity finding: the gateway's pipeline can succeed at append
(ledger updated) while failing at projection refresh (state log stale), still returning
`ok: true` with exit 0. Combined with F-015 (reducer reads the projection, not the
ledger), this creates a silent stale-read window affecting every loop type.

## 6. Findings Catalog — P1

| ID | Title | Source |
|----|-------|--------|
| F-001 | Salvage events bypass the append gateway, writing directly to the state log projection | fanout-salvage.cjs:135 |
| F-003 | jsonl-repair.ts mergeJsonlUnderLock races with non-lock-respecting appenders | jsonl-repair.ts:217-219, 241-244 |
| F-007 | Orphaned lineages lose retry credit on resume — readRetryCountsFromLedger ignores orphan_requeued events | fanout-pool.cjs:265-274, fanout-run.cjs:2366-2367 |
| F-010 | reconstructReviewRegistryFromState defaults severity to P2, potentially downgrading P0/P1 findings | fanout-merge.cjs:894, 910, 805 |
| F-011 | researchCandidatesFromIteration throws on findingsCount mismatch, aborting the entire merge for all lineages | fanout-merge.cjs:961-963, 983-987 |
| F-012 | Missing anchor in strategy file blocks the entire reducer output | reduce-state.cjs:1654-1674, 1717, 2117 |
| F-013 | Corruption warnings block write of already-computed registry/dashboard/strategy | reduce-state.cjs:2123-2124 |
| F-015 | Reducer reads state log projection directly, not the typed ledger | reduce-state.cjs:2072 |
| F-016 | Alignment reducer findingDedupKey includes severity, preventing severity transition tracking | reduce-alignment-state.cjs:423-433 |
| F-022 | Three of six CLI executor kinds (devin, pi, opencode) have no preventive sandbox for write operations | executor-config.ts:77-99 |
| F-034 | repairJsonlTail truncates ALL content after the first malformed line | jsonl-repair.ts:47-86, 189-209 |
| F-038 | fanout-salvage STATE_LOG_BY_LOOP_TYPE only covers research and review — alignment salvage silently skipped | fanout-salvage.cjs:19-22, 77 |
| F-039 | Salvage writes the SAME recovered text to ALL missing iteration files | fanout-salvage.cjs:109, 111-126 |

Note: the lineage's own synthesis event recorded a p1Count of 11 vs its table's 15 P1
rows — the per-finding table above (authoritative, itemized) yields 1/15/26.

## 7. Findings Catalog — P2

| ID | Title | Source |
|----|-------|--------|
| F-002 | Fan-out salvage and merge cover only 2 of 8 loop modes with drift-prone independent maps | fanout-salvage.cjs:19-22, fanout-merge.cjs:1102 |
| F-004 | loop-lock isStaleLoopLock treats ttlMs=0 as immediately stale, allowing premature reclaim | loop-lock.ts:551-552, 188 |
| F-005 | Retry re-queue has no delay — flapping executor burns retries instantly | fanout-pool.cjs:632-651 |
| F-006 | abortStalledAttempt picks the oldest active attempt, which may not be the stalled one | fanout-pool.cjs:687-714 |
| F-008 | Signal handler writes stopped summary but doesn't abort the pool — second normal summary can overwrite it | fanout-run.cjs:2377-2406 |
| F-009 | Cross-list duplication — one lineage's resolved finding stays active in another's list after merge | fanout-merge.cjs:758-791 |
| F-014 | collapseFindingsByDedupKey fallback key can falsely merge distinct findings at the same file:line | reduce-state.cjs:751-759, 778-806 |
| F-017 | Alignment reducer silently drops corrupt delta records while review reducer tracks them | reduce-alignment-state.cjs:157-185 |
| F-018 | Divergent corruption handling policies between alignment and review reducers | reduce-alignment-state.cjs:947-950 |
| F-019 | Duplicated parseJsonlDetailed / loadDeltaPayloads implementations across reducers can drift | reduce-alignment-state.cjs:130, 157 |
| F-020 | cli-devin workspace-write uses --permission-mode dangerous with no OS sandbox — confinement is post-hoc only | fanout-run.cjs:2030-2037 |
| F-021 | cli-pi has no sandboxMode support — pi executors run without runtime sandbox confinement | executor-config.ts:97-99 |
| F-023 | Model allowlists are hand-duplicated literals that can drift from actual CLI rosters | fanout-run.cjs:1971, 1823 |
| F-025 | convergence.cjs silently routes alignment to review signals — wrong convergence semantics | convergence.cjs:723-733 |
| F-026 | p0ResolutionRate defaults to 1.0 with zero P0 findings — inflates composite score | convergence.cjs:379-381, 333 |
| F-027 | Novelty corroboration trace shows passed:true when decision is CONTINUE — misleading trace | convergence.cjs:785-788 |
| F-028 | verify-iteration delta check only requires a type=iteration record — no content validation | verify-iteration.cjs:184 |
| F-030 | Projection refresh replays the ENTIRE ledger on every append — O(n²) over a loop | append-mode-event.ts:466-468, 488 |
| F-031 | Legacy upcast path is deep-research-only — other modes' legacy records are rejected | append-mode-event.cjs:427-431, 474 |
| F-032 | Cutover binding fallback uses all-zero SHA and random UUIDs — breaks audit trail outside git | append-mode-event.cjs:328-350 |
| F-033 | PID reuse can keep a dead owner's lock alive for up to 2×TTL | loop-lock.ts:549-554 |
| F-035 | mergeJsonlUnderLock double-reads and triple-merges under the writer lock | jsonl-repair.ts:239-244 |
| F-036 | stableRecordIdentity falls back to full JSON serialization for field-less records | jsonl-repair.ts:112-123 |
| F-037 | Heartbeat timer is a module-level singleton — one heartbeat per process | loop-lock.ts:57, 661-696 |
| F-040 | observability-events redacts prompt/body fields — overly broad redaction loses diagnostics | observability-events.cjs:84-87 |
| F-041 | artifact-root.cjs cross-skill re-export creates a runtime dependency on system-spec-kit | artifact-root.cjs:17-18 |
| F-042 | extractTextFromOpencodeJson truncates at 50,000 chars — silent content loss | fanout-salvage.cjs:54, 57 |

## 8. Systemic Patterns

1. **Loop-type coverage gaps** (F-002, F-016, F-017, F-024, F-031, F-038): the
   `alignment` type is missing from salvage/convergence surfaces and has divergent
   reducer behavior; `council`/`context` are missing from verify-iteration. Loop-type
   registries are scattered per-script with no single source of truth.
2. **Post-hoc-only confinement** (F-020, F-021, F-022): three of six CLI kinds have no
   preventive OS sandbox; write-containment detects and reverts only after the fact and
   only for git-tracked paths.
3. **Projection-vs-ledger divergence** (F-015, F-029): reducer reads the projection;
   gateway reports success even when projection refresh fails — together a silent
   stale-read window.
4. **Fail-closed amplification** (F-011, F-012, F-013): single-lineage or single-anchor
   anomalies abort whole-packet outputs (merge, registry/dashboard/strategy writes)
   instead of degrading per-item.

## 9. Key Finding Deep-Dives

- **F-029 (P0)** — see §5. Silent data-loss path; every loop type affected.
- **F-007 (P1)** — orphan_requeued events don't restore retry credit; resumed orphaned
  lineages get a fresh budget, potentially exceeding the intended attempt cap.
- **F-010 (P1)** — P0/P1 findings reconstructed without explicit severity land as P2 and
  stop triggering FAIL in merged verdicts; a release-blocking finding can be masked.
- **F-011 (P1)** — no per-lineage error isolation in merge; one miscount drops all
  lineages' findings.
- **F-012/F-013 (P1)** — reducer computes everything then refuses to write on anchor or
  corruption warnings; availability lost for warning-class input problems.
- **F-034 (P1)** — one corrupt mid-log line drops all later valid records; for a
  10-iteration loop a corrupt line at iteration 3 loses iterations 4–10.
- **F-039 (P1)** — multi-file salvage stamps identical recovered stdout into every gap,
  making recovered files indistinguishable and content meaningless.

## 10. Observed Run Telemetry (live corroboration)

Telemetry from this very run corroborates several researched themes:

| Observation | Evidence |
|-------------|----------|
| Leaf wrote future-dated timestamps (e.g., 06:35Z–07:06Z during a 04:34–04:54Z window); one unparseable `2022026-08-26T...` year token | orchestration-status.log `timestamp_anomaly`, counts anomalous=12 unparseable=1 |
| Containment advisory: pre-existing untracked plan.md/tasks.md detected at dispatch boundary, preserved not reverted | orchestration-status.log `containment_advisory` (preserved_untracked ok=true) |
| Lineage registry used alias key `findings`; merge coerced 42 entries to canonical `keyFindings` | fanout-merge output schema_mismatch warn |
| Resource-map emission skipped: no deltas/ stream written by the lineage despite iteration artifacts existing | reduce-state --emit-resource-map --fanout-resource-map-only → "no delta files found" |

These are operational observations of the same machinery under study; they support
themes F-042 (salvage/extraction fidelity), projection hygiene (§8.3), and the
delta-stream contract enforced by verify-iteration (F-028).

## 11. Eliminated Alternatives

Directions deliberately excluded during the loop because prior reviews already cover
them (per the topic's non-goal):

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Re-deriving salvage identical-stdout stamping as a new finding | Already noted by 016 P2 themes | iterations/iteration-001.md §Ruled Out | 1 |
| verify-iteration 3/8 mode coverage as new finding | Already noted by 016 | iterations/iteration-001.md §Ruled Out | 1 |
| buildAttributionMd verdict filter without active-disposition | Already noted by 016 P2 | iterations/iteration-003.md §Ruled Out | 3 |
| Near-duplicate dedup opt-in via undocumented env var | Already noted by 016 P2 | iterations/iteration-003.md §Ruled Out | 3 |
| ANCHOR/MACHINE-OWNED dialect mismatch (016 P1-3) | Already noted by 016 | iterations/iteration-004.md §Ruled Out | 4 |
| Same-findingId fold without content comparison (016 P1-8) | Already noted by 016 | iterations/iteration-004.md §Ruled Out | 4 |

## 12. Divergence Map

No divergent pivots recorded: `convergence_mode=default` (not divergent), single
lineage, no saturated directions or pivot transactions in the merged registry. The
topic did not converge — the cap stopped the loop while newInfoRatio remained high
(0.60 at run 10). Remaining frontier: command-doc/YAML contract surface (8 /deep:*
docs + 16 orchestrator YAMLs) received the least iteration focus (runs stayed on
runtime scripts); cross-runtime agent drift across the six runtime agent files was
touched only via adapter-level analysis (run 6).

## 13. Open Questions

1. **F-033** — Is the 2×TTL PID-reuse window acceptable, or should nonce checks happen
   during staleness detection rather than only refresh/release?
2. **F-030** — Does full-ledger replay per append matter at real loop lengths, or are
   loops bounded small enough in practice?
3. **F-016** — Should the alignment dedup key exclude severity to enable transition
   tracking, or is alignment's finding model fundamentally different?
4. **F-029** — Should the gateway fail closed (`ok:false`) on projection-refresh
   failure, or retry the refresh?

## 14. Convergence Report

- Stop reason: maxIterationsReached (forced-depth policy; convergence telemetry only)
- Total iterations: 10
- Questions answered: 0 / 0 registry-tracked (focus-driven loop; 4 open questions in §13)
- Last 3 iteration summaries: run 8: Append gateway and projection refresh (0.70) | run 9: loop-lock.ts and jsonl-repair.ts (0.65) | run 10: Cross-cutting issues (0.60)
- Convergence threshold: 0.05 (never approached; min ratio observed 0.60)
- Divergence summary: no divergent pivots recorded

## 15. Artifacts

- research/research.md — this synthesis
- research/findings-registry.json — merged registry (42 key findings)
- research/deep-research-findings-registry.json — compatibility copy
- research/deep-research-dashboard.md — generated dashboard
- research/fanout-attribution.md — per-lineage attribution
- research/orchestration-summary.json, research/orchestration-status.log — runner telemetry
- research/deep-research-config.json — resolved setup config
- research/lineages/glm/ — lineage packet (state log, strategy, dashboard, registry, 10 iteration files, its own progressive research.md)

## 16. References

- 016 deep-review report: review/ packet under this spec folder (baseline exclusions)
- Runtime sources cited per-finding in §5–§7 (leaf-reported file:line)
- Prior context: none loaded (memory_context unavailable at start; treated as None per contract)

## 17. Suggested Next Steps

- Triage F-029 (P0) first; it invalidates the receipt guarantee the gateway exists to provide.
- Bundle the fail-closed amplification cluster (F-011/F-012/F-013) into one resilience decision.
- Treat §12 remaining frontier (command docs + YAML contracts, cross-runtime agent files) as the next research pass if continued.
