# Deep Research Strategy — Tri-System Investigation (50 Angles)

<!-- ANCHOR: strategy-overview -->
## Overview

One angle per iteration, 50 iterations, gpt-5.5-fast (high) read-only analysis seats via cli-opencode. Each seat receives one angle, investigates against the real tree, and returns findings JSON classified as: BUG (missed defect), BROKEN-FEATURE (shipped but not working), DOC-DRIFT (docs claim what code does not do), README-MISALIGNMENT (readme/skill docs out of step), REFINEMENT (shipped feature needing improvement), or NEW-FEATURE (gap worth building). The orchestrator writes all state. Grounding: the 027 epic (24 phases + finding-remediation), the 475-scenario playbook census, the database-corruption recovery, and the live repair learnings.
<!-- /ANCHOR: strategy-overview -->

<!-- ANCHOR: research-angles -->
## Angles

### system-spec-kit — memory substrate (1–24)

1. Idempotency flag-ON enablement readiness: receipt key variance per logical update, force-retry conflicts, receipt TTL — what still blocks default-on?
2. Source-kind ingress guard coverage: same-path reindex-retire and feedback auto-promotion remain unguarded ingress paths — exact exposure and minimal guard design.
3. FTS5 LIKE-metachar scope hardening: where unescaped LIKE/MATCH metacharacters in user input reach query surfaces.
4. Shadow-evaluation replay starvation: post-PII the query pool is empty by design — privacy-preserving replay pool designs (hashed query classes, synthetic queries, opt-in ring buffer).
5. consumption_log fingerprint utility: is query_hash consumed anywhere? Dead instrumentation vs planned use; retention of the table itself.
6. Vector dual-write convergence: vec_768 BLOB table vs vec_memories vec0 — single-source-of-truth plan, divergence detection in health, migration cost.
7. Scan event-loop saturation: memory_index_scan starves the IPC bridge (observed live: health timeouts during scan) — yielding/job-queue/progress-event design.
8. Unclean-shutdown marker lifecycle: probe cost on large DBs at every boot after crash; marker staleness semantics across multiple launchers.
9. Checkpoint and backup operational reality: checkpoints dir and backups dir are empty in production despite shipped checkpoint tooling — wiring, cadence, or docs gap?
10. Retention sweep semantics: protected tiers, dry-run vs apply parity, interaction with the retention reducer.
11. Causal-edge hygiene after row deletion: 314 orphaned rows were cleaned — do causal edges referencing deleted ids linger; tombstone propagation.
12. active_memory_projection invariants: which other lookups join the projection while their write guards span all of memory_index (the class behind the scan unique-constraint crash).
13. Save-path parity: generate-context.js full save vs memory_save MCP vs CLI front door — divergence in scrubbing, provenance, metadata refresh.
14. Graph/degree channel utilization: memory_health routing telemetry — are the graph channels earning their cost in real retrieval?
15. Session trust adoption: resolveTrustedSession coverage across every session-accepting tool surface (search done — context, validate, list, bulk ops?).
16. why_ranked consistency: finalRankScore trio alignment across formatters and trace surfaces after the remediation.
17. Feature-flag truth: ENV_REFERENCE's 179 documented variables vs code-declared flags — automated diff tooling as a guard.
18. Template/validator co-evolution: fixtures silently drifted for months — a CI check that validates the canonical fixtures on every validator change.
19. mcp_server INSTALL_GUIDE and README accuracy against the dual-stack (MCP + CLI front door) reality.
20. Continuity ladder truth: resume documentation vs implemented handover/continuity frontmatter behavior.
21. Stress coverage gaps: which 027 features still lack stress suites after the four added (e.g. write-path reconciliation, metadata-edge promoter, semantic triggers).
22. Semantic trigger fallback in production: shadow-mode telemetry, activation criteria, and what its goldens actually prove.
23. Reducer interaction safety: aggregator, causal reducer, retention reducer — composition order, double-processing guards, idempotency across reducers.
24. Envelope token budgeting: "Response exceeds token budget" hints observed on memory_health — budget consistency across tools and what callers should do.

### system-code-graph (25–36)

25. CLI path-resolution robustness: code-index.cjs invoked from arbitrary cwd; absolute-path self-resolution audit across all three front doors.
26. detect_changes adoption: blocked-on-stale refusal is shipped — do agent workflows actually call it before acting on diffs; where should it be wired?
27. code_graph_apply default routing safety: bare apply routes to staleness-based rescan — observed long-running call; confirm guards, document expected duration, consider explicit-operation requirement at the CLI layer.
28. Apply sub-operations truth: rescan/prune-excludes/repair-nodes/recover-sqlite-corruption/rollback-bad-apply vs playbook and docs coverage.
29. Reconnect parity: mk-code-index bridge/proxy behavior vs mk-spec-memory front-proxy after the 026/007 lifecycle fixes — remaining flap exposure.
30. Graph database lifecycle: growth, compaction, the untracked database/ dir contents, and whether any maintenance is documented or automated.
31. Tool schema drift: CODE_GRAPH_TOOL_SCHEMAS vs TOOL_DEFINITIONS alias vs the CLI manifest — single-source generation.
32. README/SKILL.md alignment with the shipped 8-tool surface, blocked payloads, and CLI fallback contract.
33. Gold-query battery freshness: do the battery queries still represent the tree after the epic's renames and the agents/skills/commands pluralization?
34. Language coverage honesty: which file types index, which silently skip, and what parser_skip_list accumulates.
35. Cross-system linking: code-graph key_files vs spec-memory COVERED_BY edges — is the join surfaced anywhere useful?
36. Daemon supervision uniformity: launcher watchdog, lease, orphan-reap parity with the spec-memory launcher's hardened behavior.

### system-skill-advisor (37–46)

37. Native vs local scorer parity: systematic differential testing beyond the gold dataset (the local path just needed three fixes the native path did not).
38. Trigger vocabulary hygiene: the sk-git over-matching class — audit all skills for greedy keyword sets that need boundary disambiguation.
39. Derived freshness maintenance: age haircut now reads graph-metadata last_updated_at — what refreshes that field, and does anything keep it honest?
40. Ambiguity margin calibration: dual 0.05 score/confidence margins — empirical false-positive/negative rates on real session prompts.
41. Lane architecture transparency: shadowOnly lanes, lane weights, projection caps — operator-facing explanation and tuning surface.
42. skill-graph.sqlite operational runbook: rebuild, migration, corruption recovery (JSON export is ignored at runtime — single point of failure).
43. Regression dataset growth: 100 gold cases — harvesting real misroutes from session logs into the dataset.
44. Hook brief quality: UserPromptSubmit advisor latency, ambiguity presentation, and whether agents act on the brief correctly.
45. Trusted-mutation gating: advisor_rebuild/skill_graph_scan --trusted docs vs actual enforcement.
46. Cross-session reconnect verification: the owner-lease + reconnecting proxy under multi-session contention.

### Cross-system (47–50)

47. Tri-daemon lifecycle uniformity: re-election, leases, orphan reaping, persistent logs — behavior matrix across the three launchers and drift between them.
48. CLI front-door parity drift: 37/8/9 tool counts, offline smoke coverage, envelope/exit-code consistency across the three CLIs.
49. Catalog/playbook governance: hand-maintained counts and tables (feature catalog, playbook index, drift-prone self-checks) — generation or CI-guarding.
50. Deep-loop integration surface: how deep loops save memory, exclusion policies (z_future), and whether loop artifacts feed retrieval well.
<!-- /ANCHOR: research-angles -->

<!-- ANCHOR: iteration-protocol -->
## Iteration protocol

Iteration N investigates angle N. Seat brief: the angle text + grounding pointers + read-only rules + findings JSON contract. Orchestrator extracts the JSON, writes `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl` (finding rows), appends state events. Pool ≤3 concurrent seats, 20s stagger, 1200s timeout per seat. Findings registry accumulates across iterations; convergence is by angle exhaustion (50/50), not delta decay.
<!-- /ANCHOR: iteration-protocol -->
