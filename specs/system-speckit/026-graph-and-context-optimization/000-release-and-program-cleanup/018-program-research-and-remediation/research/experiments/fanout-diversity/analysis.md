# Fan-Out Lineage Diversity — Analysis (Angles 31, 35)

- **Date:** 2026-06-06 · **Design:** `design.md` (pre-registered before any dispatch) · **Raw:** `raw-events.tar.gz` · **Reports:** `runs/*.md` · **Metadata:** `run-metadata.json`
- **Question 31:** does N-model heterogeneous fan-out find materially more than N runs of one model?
- **Question 35:** do MiMo, DeepSeek, and MiniMax surface different findings or converge on the same input?

## Verdicts (headline)

| Angle | Verdict |
|---|---|
| **35** | **Models diverge — but so does the same model with itself.** Mean cross-model Jaccard 0.42–0.43 (< the pre-registered 0.6 "diversity real" bar). Convergence (>0.8) is decisively ruled out. |
| **31** | **NO material coverage lift from heterogeneity, by both pre-registered prongs.** (1) 3-model trio union = 78 clusters vs best same-model 2-run union (MiniMax) = 74 → 1.05×, far below the 1.25× materiality bar. (2) Same-model run1↔run2 Jaccard (mean 0.405) is statistically indistinguishable from cross-model Jaccard (0.421/0.433) — the diversity is **stochastic (run-to-run), not model-identity-driven**. |
| **Nuance** | Heterogeneity still bought two things the aggregate numbers hide: **blind-spot insurance** (a confirmed real defect — the file-watcher rename path destroying embeddings — was found by DeepSeek-r1 and MiMo-r2 but missed by BOTH MiniMax runs despite 140+ tool calls each) and **verdict adjudication** (cross-lane contradictions exposed one false claim and one judgment flip that single-lane output would have shipped unchallenged). |

## Run matrix (observed)

| Run | Model · framework | Wall-clock | Tool calls | Words | Clusters asserted |
|---|---|---|---|---|---|
| deepseek-r1 | deepseek-v4-pro · RCAF | 393 s | 22 | 2,025 | 45 |
| deepseek-r2 | deepseek-v4-pro · RCAF | 330 s | 39 | 1,962 | 36 |
| minimax-r1 | MiniMax-M3 · TIDD-EC | 1,548 s | 140 | 4,728 | 54 |
| minimax-r2 | MiniMax-M3 · TIDD-EC | 1,152 s | 142 | 4,850 | 54 |
| mimo-r1 | MiMo-V2.5-Pro · COSTAR | 130 s | 53 | 1,539 | 39 |
| mimo-r2 | MiMo-V2.5-Pro · COSTAR | 235 s | 27 | 2,027 | 49 |

Contamination: zero forbidden-path citations in all six reports (every `.opencode/specs` mention is an exclusion-compliance statement). Format adherence: MiMo 2/2 exact contract; DeepSeek 2/2; MiniMax r1 drifted heading shape (`## Q1 —` vs `### Q1:`), r2 exact — consistent with the known M3 format-drift profile.

## Method recap

Five still-open questions from the 50-angle catalog (8, 17, 26, 30, 40 → Q1–Q5), identical text in all prompts; per-model framework scaffolds mirroring the 028 production lanes; 2 runs per model, serial, repo frozen; outputs staged outside the repo until all six completed. Findings extracted per (run, question) as discrete claims and clustered by asserted-fact-about-a-code-surface; the full membership matrix below is the audit trail. Judge = the orchestrating agent (Opus 4.8); judge read the 028 baseline notes only AFTER clustering (anchoring control).

## Metrics

**Pairwise Jaccard, run-1 trio (primary):**

| Question | D↔M | D↔X | M↔X | mean |
|---|---|---|---|---|
| Q1 moves | 0.357 | 0.357 | 0.800 | 0.505 |
| Q2 lease | 0.471 | 0.667 | 0.471 | 0.536 |
| Q3 union/breadcrumb | 0.417 | 0.375 | 0.231 | 0.341 |
| Q4 enhances | 0.286 | 0.462 | 0.417 | 0.388 |
| Q5 doctor | 0.333 | 0.250 | 0.417 | 0.333 |
| **mean** | | | | **0.421** |

Run-2 trio (robustness): Q1 0.393, Q2 0.388, Q3 0.589, Q4 0.500, Q5 0.297 → **mean 0.433**.

**Same-model run1↔run2 Jaccard:**

| Question | DeepSeek | MiniMax | MiMo |
|---|---|---|---|
| Q1 | 0.286 | 0.545 | 0.385 |
| Q2 | 0.462 | 0.526 | 0.533 |
| Q3 | 0.444 | 0.467 | 0.400 |
| Q4 | 0.455 | 0.462 | 0.462 |
| Q5 | 0.250 | 0.235 | 0.167 |
| **mean** | **0.379** | **0.447** | **0.389** |

Overall same-model mean **0.405** vs cross-model **0.421/0.433** — no heterogeneity dividend at the coverage level. Note Q5 (open-ended enumeration) has the lowest overlap *everywhere*, including within-model: the more enumerative the question, the more stochastic the findings.

**Unions (coverage):** all-6-runs distinct clusters = **104**; run-1 trio = **78** (75%); DeepSeek pair = 59; MiniMax pair = **74**; MiMo pair = 63. Heterogeneous trio (3 dispatches) vs MiniMax pair (2 dispatches): 1.054× at 1.5× the dispatch count — per-dispatch, homogeneous-MiniMax is *more* efficient (37 vs 26 clusters/dispatch). **Singletons: 42/104 (40%)** of all clusters were asserted by exactly one run — a long stochastic tail is the dominant diversity source. No saturation at n=6.

**Unique-cluster mass per model (either run):** MiniMax 20, MiMo 11, DeepSeek 10.

## Adjudicated cross-lane conflicts (accuracy dimension)

1. **Watcher bypass (Q1):** DeepSeek-r1 + MiMo-r2 claimed live `rename` events take `unlink`→`removeFn` with no reconcile path, destroying embeddings. **VERIFIED TRUE** (`lib/ops/file-watcher.ts:575-582`; zero `reconcile` references in the file). Missed by both MiniMax runs and the 028 baseline (D8). *The single most valuable finding of the experiment, and a heterogeneity win.*
2. **`hotFileBreadcrumb` dead slot (Q3):** DeepSeek-r1 ("type-only reservation, never populated") vs MiMo-r1 ("flows through to context assembly"). **DeepSeek RIGHT, MiMo WRONG** — `hotFileBreadcrumb` exists only as optional type fields in both shared-payload files; zero assignment sites outside the code-graph handler. One confirmed false claim in 6 runs, caught only because lanes disagreed.
3. **Re-election latency (Q2):** four different answers (D1 ~6–19 s incl. reap grace; D2/M1 instant ESRCH reclaim; M2 ~41–55 s session-proxy reattach ladder; consensus 120 s heartbeat floor for zombie/EPERM). **All verified facets of different layers** — M2's reattach-ladder constants confirmed verbatim (`launcher-session-proxy.cjs:11-17`). MiniMax-r2 answered the question-as-asked (secondary-perspective) most directly; the others answered adjacent latencies. Disagreement here is decomposition diversity, not error.
4. Flagged unresolved: DeepSeek-r1's "each MCP instance has its own SQLite database / no cross-database coordination" conflicts with MiniMax-r2's "the scan lease blocks parallel launchers against the SAME database" — D1's framing is dubious given the shared-daemon architecture; recorded as disputed, not counted for either side.

## Per-model signatures (what each lane is FOR)

- **MiniMax-M3 (TIDD-EC/dense):** the depth engine. 2.4× the words, ~5.5× the tool calls, biggest cluster yield (54+54), largest unique mass (20), and the only lane that surfaced split-brain windows, the reattach ladder, `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER`, ledger-vs-reconcile transaction asymmetry. Cost: 19–26 min/dispatch. Missed the watcher bypass twice — depth ≠ breadth.
- **DeepSeek-v4-pro (RCAF/medium):** the analyst. Lowest volume but contributed quantified-latency arithmetic, the threshold-arithmetic insight that family-inference (0.45) can never pass minConfidence (0.75) alone, and the verified watcher-bypass defect. Run-to-run verdict instability is highest (flipped Q3 value judgment between runs).
- **MiMo-V2.5-Pro (COSTAR/lean):** the efficiency play. 2–4 min/dispatch (6–10× faster than M3), near-DeepSeek coverage, perfect format adherence, found the watcher bypass (r2) — but produced the one confirmed false claim (r1's flows-through inference).

## Comparison vs the 028 single-lane baselines (D8/D6/D2/D9/D3)

- New vs 028: watcher-bypass defect (Q1), zombie + EPERM 120 s floors and the reattach ladder (Q2), zero-production-caller enumerations + dead type slot (Q3), tool-level doctor gaps — ingest/retention/checkpoints/session (Q5), mcp-code-mode orphaned doctor.sh (Q5).
- Found by 028 but missed by ALL SIX fresh runs: the "no external health-check daemon — a dead daemon stays down until demand arrives" gap (D6). Six fresh runs ≠ exhaustive either; coverage has a long tail in every direction.

## Threats to validity

- n=2 runs/model: same-model baselines are thin; treat the 0.40≈0.42 equality as robust in direction (replicated across both trios) but imprecise in magnitude.
- Framework confound is by design: this measures production *lanes* (model + its tuned prompt), not pure model identity. M3's depth may be partly TIDD-EC/dense pre-planning.
- Single judge did extraction + clustering; the matrix below makes every membership auditable. Subsumption choices (e.g., skill-family doctor gaps collapsed into one enumeration cluster) compress Q5 overlap for runs that enumerated families separately.
- `--pure` strips plugins for the DeepSeek lane only (provider requirement); other lanes were instructed-only. No MCP usage was observed in any lane's event stream.

## Decision unblocked (backlog item 4)

**Heterogeneous fan-out is NOT justified by coverage volume** — at equal dispatch count, re-running the strongest lane (MiniMax-M3/TIDD-EC) matches or beats the mixed trio. **It IS justified as cheap insurance + adjudication**: per-model systematic blind spots are real (M3 double-missed a confirmed defect), cross-lane contradictions caught the only false claim, and the three lanes sit on independent quota pools (parallelism without pool contention). Recommended deep-loop default: homogeneous fan-out on the task-matched lane for coverage, plus ONE heterogeneous lane as a skeptic/insurance seat when findings will drive code changes — and never trust single-run verdict-flips (Q3) without a second sample.

---

## Appendix: cluster membership matrix (audit trail)

Legend: D1/D2 = deepseek r1/r2, M1/M2 = minimax, X1/X2 = mimo. A run is a member when its report asserts the cluster's fact (per-finding mapping in `runs/*.md`; matching rule in `design.md`).

### Q1 — move-reconciliation (21 clusters)

| # | Cluster (asserted fact) | D1 | D2 | M1 | M2 | X1 | X2 |
|---|---|---|---|---|---|---|---|
| A | mechanism + call-site + in-place repoint preserving id/embedding | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B | packet_id gate from NEW folder's graph-metadata.json only | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| C | matching is grandparent+basename sibling-rename only | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D | SELECT/UPDATE un-transactioned (TOCTOU/crash window) | ✓ | — | ✓ | ✓ | ✓ | — |
| E | **live watcher rename = unlink+add, bypasses reconcile, destroys embeddings** (verified) | ✓ | — | — | — | — | ✓ |
| F | scan lease serializes concurrent scans (heartbeat, fail-closed contention) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| F′ | cross-session/cross-DB coordination absent (disputed) | ✓ | — | — | — | — | — |
| G | no concurrency tests in move-reconcile suite | ✓ | — | — | — | — | — |
| H | migration v23 one-time re-canonicalization | ✓ | — | — | — | — | — |
| I | memory_embedding_reconcile ≠ path reconcile (naming) | ✓ | — | — | — | — | — |
| J | exactly-1 uniqueness guards (sibling + live row) | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| K | save-path lock interplay w/ scan (withSpecFolderLock; residual old-folder race) | — | ✓ | ✓ | — | ✓ | — |
| L | document_type cross-check + skip nuances | — | ✓ | ✓ | ✓ | ✓ | — |
| M | moveReconciled response + list removal | — | ✓ | — | — | — | — |
| N | graph-metadata.json non-atomic read tolerance | — | — | ✓ | — | — | — |
| O | divergence path IS runInTransaction (contrast) | — | — | — | ✓ | — | — |
| P | mutation-ledger append-only triggers | — | — | — | ✓ | — | — |
| R | chained moves X→Y→Z degrade to delete+reindex | — | — | — | — | ✓ | — |
| S | lineage logical_key tolerance after move | — | — | — | — | — | ✓ |
| T | description-map cache 60 s TTL staleness | — | — | — | — | — | ✓ |
| U | watcher concurrency test coverage exists | — | — | — | — | — | ✓ |

### Q2 — lease death/re-election (24 clusters)

| # | Cluster | D1 | D2 | M1 | M2 | X1 | X2 |
|---|---|---|---|---|---|---|---|
| A2 | two-tier owner+PID lease files w/ fields | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B2 | dead-PID instant detection (kill-0 ESRCH) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C2 | PPID-1 orphan detection branch | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D2c | constants: TTL 60 s, heartbeat 30 s, stale 2×TTL=120 s | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| E2 | heartbeat-refresh failure → self-termination | ✓ | — | — | ✓ | ✓ | — |
| F2 | deep JSON-RPC initialize probe for hung daemons | ✓ | — | ✓ | — | — | ✓ |
| G2 | respawn protocol (locks, re-validate, reap 7 s, wx lease) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| H2 | re-election latency quantified (answers diverge: 6–19 s / instant / 41–55 s / 120 s) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| I2 | respawn/mutation lock prevents dual takeover | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| J2 | crash-loop guard (3 deaths/60 s, backoff, give-up) | ✓ | — | — | — | — | — |
| K2 | code-graph sibling owner-lease mechanism | — | ✓ | — | — | ✓ | — |
| L2 | skill-advisor lease model differs (SQLite / pid-only) | — | ✓ | ✓ | — | — | — |
| M2c | exit/signal handlers clear lease files | — | ✓ | ✓ | ✓ | — | — |
| N2 | exclusive-create + re-read-after-write verify | — | — | ✓ | ✓ | — | — |
| O2 | EPERM/sandbox owners treated live (120 s floor) | — | — | ✓ | — | — | ✓ |
| P2 | SIGKILL bypasses exit handlers; file persists | — | — | ✓ | ✓ | — | — |
| Q2z | zombie launcher passes kill-0 → 120 s floor | — | — | ✓ | — | — | — |
| R2 | clear-lease double-read guard (residual sub-syscall window) | — | — | ✓ | — | ✓ | ✓ |
| S2 | SPECKIT_BRIDGE_RESPAWN_DISABLED kill-switch | — | — | — | — | — | ✓ |
| T2 | "stale-reclaim, not leader election" framing | — | — | — | — | — | ✓ |
| U2 | RSS watchdog in-place daemon recycle keeps lease | — | — | — | — | — | ✓ |
| V2 | **secondary reattach ladder 40×[100..1500 ms] ≈ 41–55 s** (verified) | — | — | — | ✓ | — | — |
| W2 | split-brain window: orphaned daemon w/ dead lease-holder | — | — | — | ✓ | — | — |
| X2u | MK_SPEC_MEMORY_STRICT_SINGLE_WRITER disable path | — | — | — | ✓ | — | — |

### Q3 — unionMode / hotFileBreadcrumb (17 clusters)

| # | Cluster | D1 | D2 | M1 | M2 | X1 | X2 |
|---|---|---|---|---|---|---|---|
| A3 | schema + handler wiring (merge subject+subjects) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B3 | multi affects blast_radius only | ✓ | — | — | ✓ | — | — |
| C3 | subjects-without-flag silently ignored (footgun) | — | — | ✓ | — | — | — |
| D3 | multiFileUnion response-flag semantics | — | ✓ | ✓ | ✓ | — | ✓ |
| E3 | breadcrumb algorithm (top-10%, min, cap 20) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| F3 | emission surfaces (nodes/affectedFiles/top-level/relationship ops) | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| G3 | zero production callers of unionMode (grep) | — | ✓ | ✓ | ✓ | — | ✓ |
| H3 | breadcrumb has no operative consumer / advisory-only | ✓ | — | ✓ | ✓ | — | ✓ |
| H3⁻ | breadcrumb "flows through to context assembly" (**refuted**) | — | — | — | — | ✓ | — |
| I3 | test + playbook coverage exists | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| J3 | graceful partial-resolution degradation | — | — | — | — | ✓ | ✓ |
| K3 | no telemetry counters for usage | — | — | — | ✓ | — | ✓ |
| L3 | response bloat on single-subject calls | — | — | — | ✓ | — | — |
| M3c | empty-degree fast path ambiguity | — | — | ✓ | — | — | — |
| N3 | cost quantified (one bounded SQL, negligible) | — | ✓ | ✓ | — | — | — |
| O3 | spec-kit payload mirror = future consumers inherit | — | — | — | ✓ | — | — |
| P3 | changelog/docs reference trail | — | — | ✓ | — | — | — |

### Q4 — enhances propagation (19 clusters)

| # | Cluster | D1 | D2 | M1 | M2 | X1 | X2 |
|---|---|---|---|---|---|---|---|
| A4 | tool surface + modes (report/apply/dryRun) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B4 | trusted-caller + workspace-escape guards | ✓ | — | ✓ | ✓ | — | ✓ |
| C4 | 3 rules w/ caps 0.45/0.30/0.15 + minConfidence 0.75 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D4c | family rule alone can never pass 0.75 bar (arithmetic) | ✓ | — | — | — | — | — |
| E4 | enhances = 0.55 strongest multiplier in graph-causal lane | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| F4 | lane weight 0.13 in fusion | ✓ | — | — | — | ✓ | — |
| G4 | BFS depth-decay propagation formula | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| H4 | no A/B / quantitative measurement exists | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| I4 | manual-only; nothing auto-invokes (hook/doc evidence) | — | ✓ | ✓ | ✓ | ✓ | — |
| J4 | applied edges not live until skill_graph_scan re-index | ✓ | — | — | — | — | — |
| K4 | python legacy advisor parallel path (divergence risk) | ✓ | — | — | — | — | ✓ |
| L4 | asymmetric enhanced_by cookbook gap | — | — | ✓ | — | — | — |
| M4 | applyable gate via inferEdgePayload exemplar | — | — | ✓ | ✓ | — | — |
| N4 | auto_added_at/reason audit markers | — | — | — | — | ✓ | ✓ |
| O4 | WEIGHT-PARITY reciprocal validation | — | — | — | — | — | ✓ |
| P4 | actual enhances edges in compiled graph enumerated | — | — | — | ✓ | — | ✓ |
| Q4t | test-coverage specifics (malformed-asset etc.) | — | — | ✓ | — | ✓ | — |
| R4 | zero metrics calls in handler / no counters | — | — | — | ✓ | — | — |
| S4 | detection walks filesystem (existsSync) | — | — | — | ✓ | — | — |

### Q5 — doctor coverage gaps (23 clusters)

| # | Cluster | D1 | D2 | M1 | M2 | X1 | X2 |
|---|---|---|---|---|---|---|---|
| A5 | manifest: 7 routes + 2 mcp subroutes + 1 standalone | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B5 | skill-level enumeration of uncovered skills (cli-*/sk-*/mcp-*/deep-*) | ✓ | ✓ | — | ✓ | — | ✓ |
| C5 | MCP-tool-level gaps (30+ tools vs 5 wired; ingest/retention/checkpoints) | — | — | ✓ | — | — | — |
| D5 | IPC/launcher/lease layer has no target | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| E5e | eval/speckit-eval.db unreachable except /doctor:update | — | — | ✓ | — | ✓ | — |
| F5 | hf-model-server lifecycle gap (status-only embeddings target) | ✓ | — | ✓ | ✓ | — | ✓ |
| G5 | runtime hook health unverifiable | ✓ | — | — | — | — | — |
| H5 | worktree/sk-git diagnostics absent | ✓ | ✓ | — | ✓ | — | — |
| I5 | skill-graph/propagate not independently diagnosable | ✓ | — | ✓ | — | ✓ | — |
| J5 | mcp-code-mode doctor.sh exists but unrouted | — | ✓ | — | — | — | ✓ |
| L5 | mcp-doctor.sh hardcoded 5-server list (structural) | — | — | — | ✓ | — | — |
| M5 | gate3_location/mutation-class manifest mismatch | — | — | ✓ | — | — | — |
| N5 | code-graph target read-only vs repair flags conflict | — | — | ✓ | ✓ | — | — |
| O5 | most targets read-only; only skill-advisor mutates | ✓ | — | — | ✓ | — | — |
| P5 | :mcp/:update are not positional routes | — | ✓ | — | ✓ | — | — |
| Q5u | update.md 8-subsystem contract enumerated | — | — | — | — | ✓ | — |
| R5 | session-management has no target | — | — | ✓ | — | ✓ | — |
| S5 | constitutional cache undiagnosable | — | — | ✓ | — | — | — |
| T5 | orphan-mcp sweeper not routed | — | — | — | ✓ | — | — |
| V5 | Codex runtime lacks doctor command copy | — | — | — | — | — | ✓ |
| W5 | deep-loop target covers runtime only, not per-skill | — | ✓ | — | — | — | — |
| X5d | deep-loop target script-only fragility (no fallback) | — | — | — | — | — | ✓ |
| Y5 | standalone doctor.sh scripts exist but disconnected | ✓ | — | ✓ | — | — | ✓ |
