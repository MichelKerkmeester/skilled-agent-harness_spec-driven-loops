Let me verify several key claims across the investigations before composing the final report.
# Research Report: Five-Question System Audit

---

### Q1: Self-maintaining memory-index move-reconciliation under rapid concurrent spec-folder moves across sessions — is it correct, and what race exposure remains?

**Findings:**

1. The primary move reconciliation lives in `reconcileMoves()` at `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:512-628`. It detects sibling folder renames (e.g. `012-old/spec.md` -> `012-new/spec.md`) and updates `file_path`, `canonical_file_path`, and `spec_folder` in place, preserving the row ID and embedding. [HIGH]

2. Pairing old and new paths requires the new location to have a `graph-metadata.json` with a `packet_id` field (incremental-index.ts:526-531). Without this, the reconciler silently degrades to delete+reindex. [HIGH]

3. Matching is strictly sibling-only — it compares grandparent directory *basename* equality (incremental-index.ts:568-573). Cross-tree relocations (different grandparent) and depth changes are invisible to the reconciler. [HIGH]

4. The reconciler has no wrapping transaction — it reads the old row (line 581), then runs a standalone UPDATE (line 603). The `changes !== 1` check at line 614 provides partial protection, but another writer could interleave between read and write. [MEDIUM]

5. The file watcher at `.opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:575-582` handles `add`/`change`/`unlink` but has NO dedicated `rename` handler. A folder rename produces `unlink` on the old path (triggering immediate deletion via `removeIndexedMemoriesForFile`) + `add` on the new path (triggering reindex). This path NEVER invokes `reconcileMoves()`, so embeddings are destroyed on every rename while the server is running. [HIGH]

6. A per-scan lease in `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:409-536` prevents concurrent scans within a single MCP server instance via `memory_index_scan`, but each MCP instance has its own SQLite database. There is no cross-database coordination for moves across sessions. [HIGH]

7. No concurrency test coverage exists — the test file at `tests/incremental-index-move-reconcile.vitest.ts` tests only sequential, single-threaded scenarios. [HIGH]

8. Migration v23 at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1200-1238` performs a one-time re-canonicalization of `spec_folder` from `file_path` at startup, but this only fixes legacy data, not concurrent moves. [MEDIUM]

9. `memory_embedding_reconcile` at `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:302-449` reconciles `embedding_status` vs vector coverage, NOT file paths or spec folder moves. The name is misleading for move-reconciliation purposes. [HIGH]

**Verdict:** The move-reconciliation mechanism is correct for single-session, sequential sibling renames when `graph-metadata.json` exists at the new location. However, it has significant race exposure: the file watcher bypasses reconciliation entirely (destroying embeddings), cross-tree moves are invisible, cross-session moves have no coordination, and the read-write gap lacks transaction protection. [HIGH]

---

### Q2: What happens when the lease-holder launcher dies ungracefully — full failure analysis — and what is the re-election latency for secondary launchers?

**Findings:**

1. The system uses a two-tier filesystem lease: an owner lease (`.spec-memory-owner.json`) with heartbeat + TTL + PPID validation, and a legacy PID lease (`.mk-spec-memory-launcher.json`). Owner lease classification is at `.opencode/bin/mk-spec-memory-launcher.cjs:346-363`. [HIGH]

2. Dead PID is detected instantly via `processLiveness()` using `process.kill(pid, 0)` with `ESRCH` check, defined at `.opencode/bin/lib/model-server-supervision.cjs:274-284`. This is the fastest detection path — classification returns `stale-pid` immediately when a new launcher starts. [HIGH]

3. PPID-1-orphan detection at launcher.cjs:352-353 catches processes whose parent was reaped to init (PID 1), which would otherwise pass the liveness check but are effectively dead. [HIGH]

4. Heartbeat-based staleness uses a TTL of 60,000ms with an interval of `max(1s, ttlMs/2) = 30s` (launcher.cjs:430-431). The stale threshold is `ttlMs * 2 = 120s` (launcher.cjs:358). If no new launcher starts within 120s, heartbeat expiry is the fallback detection path. [HIGH]

5. Heartbeat failure is self-terminating: if `refreshOwnerLeaseFile()` fails, the launcher calls `shutdownLauncherForSignal('SIGTERM')` (launcher.cjs:433-440), preserving the single-ownership guarantee. [HIGH]

6. The deep daemon probe at `.opencode/bin/lib/launcher-ipc-bridge.cjs:124-210` uses a JSON-RPC `initialize` handshake with a 5,000ms timeout to detect hung daemons — those that accept TCP connections but never respond. [HIGH]

7. Respawn protocol at launcher.cjs:671-752: (a) acquires bootstrap lock, (b) acquires respawn lock, (c) re-validates both owner and PID lease haven't changed, (d) reaps owner process with SIGTERM + 7s grace + SIGKILL, (e) clears old owner lease, (f) writes new owner lease via exclusive create (`wx`), (g) reaps child daemon with same 7s SIGTERM/SIGKILL, (h) checks `.unclean-shutdown` marker, (i) launches replacement server. [HIGH]

8. Minimal re-election latency — measured from a new launcher's `acquireOwnerLeaseFile` call to `launchServer()` after a killed owner — is approximately `~1ms (liveness check) + ~14s (two 7s reap grace periods for owner + child) + ~5s (deep probe timeout) = ~19s` in the worst case where both owner and child need SIGKILL. Best case (PID dead, SIGTERM succeeds immediately): `~1ms + ~1s + ~5s = ~6s`. [HIGH]

9. The respawn lock (`acquireRespawnLockFile` at `model-server-supervision.cjs:615-693`) uses exclusive `wx` create and prevents two secondary launchers from racing to respawn the same dead daemon. [HIGH]

10. Crash-loop guard at `model-server-supervision.cjs:215-236`: max 3 deaths in 60s window with exponential backoff (250ms to 5000ms). On give-up, clears leases, reaps process tree, and mirrors exit signal. [HIGH]

**Verdict:** The lease model handles ungraceful death correctly through three orthogonal detection paths (PID liveness, PPID orphan, heartbeat staleness) and a multi-step respawn protocol with re-validation, reap, and re-election guards. Re-election latency is bounded: ~6s best case (SIGTERM accepted), ~19s worst case (dual SIGKILL). The self-terminating heartbeat failure ensures no split-brain. [HIGH]

---

### Q3: Code-graph multi-file union queries — usage and value analysis of `unionMode:'multi'` and `hotFileBreadcrumb`

**Findings:**

1. `unionMode` is defined in `QueryArgs` at `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:35` as `'single' | 'multi'`, exposed in the tool schema at `tool-schemas.ts:54`. [HIGH]

2. The `unionMode === 'multi'` branch at query.ts:1319-1321 concatenates `subject` + `args.subjects[]` into a single `rawSubjects` array, then each subject is independently resolved to a file path and all successful resolutions are collected into `sourceFiles` for `computeBlastRadius()`. [HIGH]

3. `unionMode:`multi'` is **only valid for `blast_radius`**. The other operations (`outline`, `calls_from/to`, `imports_from/to`) ignore both `subjects` and `unionMode` — these branches never read either parameter. [HIGH]

4. `unionMode` is tested at `tests/code-graph-query-handler.vitest.ts:1000-1073` with a full vitest case verifying `multiFileUnion=true`, both subjects in `sourceFiles`, correct `depthGroups`, `hotFileBreadcrumbs`, and `riskLevel`. [HIGH]

5. `hotFileBreadcrumb` is defined at `lib/shared/shared-payload.ts:59-62` as `{ degree: number; changeCarefullyReason: string }`. It is computed by `buildHotFileBreadcrumbs()` at query.ts:932-962, which takes the top 10% of files by degree (with a min-threshold of 1, capped at degree=20). [HIGH]

6. `hotFileBreadcrumb` is emitted in all `code_graph_query` response types (`blast_radius`, `calls_from/to`, `imports_from/to`) in three surfaces: per-node `hotFileBreadcrumb` (line 1150), per-affected-file `hotFileBreadcrumb` (line 1157), and a top-level `hotFileBreadcrumbs[]` array (line 1172-1175). [HIGH]

7. **Zero downstream code reads `hotFileBreadcrumb` and acts on it.** It is purely an advisory output field for the AI agent to visually inspect. The `SharedPayloadSection.hotFileBreadcrumb` field at `shared-payload.ts:80` exists in the type contract across 3 copies but is never populated at runtime — it's a dead type reservation. [HIGH]

8. The `code_graph_context` handler (which consumes `code_graph_query` results) never references `hotFileBreadcrumb` — it uses `blast_radius` nodes and `affectedFiles` but the breadcrumb field is decoration only. [HIGH]

**Verdict:** `unionMode:'multi'` is functional, tested, and used — it enables multi-file blast-radius analysis that combines several source files without duplicate dependents, a capability with clear value for change-impact analysis. `hotFileBreadcrumb` is implemented and well-tested as a computational feature, but it earns **zero** of its complexity cost: no downstream code reads it, no behavioral gate or decision uses it, and the shared-payload slot for it was never wired. The top-10% degree heuristic is shipped but orphaned. [HIGH]

---

### Q4: Skill-graph enhancement-edge propagation — does it measurably improve unprompted skill discovery?

**Findings:**

1. The `enhances` edge type lives in the SQLite `skill_edges` table with a weight band of `[0.3, 0.7]` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:136-142`. Edges originate from per-skill `graph-metadata.json` declarations (e.g., `cli-devin/graph-metadata.json:8-14` declares it enhances `sk-prompt-models`). [HIGH]

2. The propagation tool `skill_graph_propagate_enhances` is registered at `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:66-83` and dispatched through `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:35-74`. It is gated behind `requireTrustedCaller` (line 40) with a workspace-escape guard (line 49-53). [HIGH]

3. Detection uses three rules at `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:177-231`: (a) family-inference (max +0.45): source covers >=50% of target's family peers; (b) asset-shape (max +0.30): target has files matching source's `enhance_when` rules; (c) sibling-transitivity (max +0.15): source enhances B, B siblings target. Default `minConfidence=0.75`. [HIGH]

4. The `enhances` edge multiplier in scoring is **0.55** — the strongest positive multiplier in the graph_causal lane at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:14`. The propagation formula at line 70 is `seed_score * edge_weight * 0.55 * (1/(depth+1))`. The graph_causal lane itself carries a weight of **0.13** in the 5-lane fusion at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:10`. [HIGH]

5. The Python legacy advisor (`scripts/skill_advisor.py:963-971`) also uses enhances edges with a multiplier of **0.3** and a threshold of `>= 0.1` to apply the transitive boost. The review-plus-write disambiguation (lines 3078-3093) explicitly acknowledges graph enhances/sibling signals can counter-boost. [HIGH]

6. **No A/B comparison exists.** No test harness measures whether advisor recommendations change with vs without propagated enhances edges. No test corpus compares rec-lists after propagation. The Python advisor uses its own compiled `skill-graph.json` rather than the SQLite graph, so Python-bridge and TypeScript-MCP routing may diverge on post-propagation state. [HIGH]

7. The propagation pipeline changes `graph-metadata.json` on disk, but the effect on live recommendations only materializes after `skill_graph_scan` re-indexes into SQLite, which is not automatic. A gap exists between "edge was written" and "advisor sees it." [HIGH]

8. The detection rules are sound (family-coverage logic is proportional, not binary; asset-shape checks actual filesystem state; transitivity is a natural graph property), but the **minimum confidence threshold of 0.75** combined with the **only 3 possible rule contributors** means a candidate must score highly on at least two rules to pass — family-inference alone (max 0.45) can never pass the bar. This constrains the propagation to already-well-connected skills. [HIGH]

**Verdict:** The mechanism is implemented and architecturally sound — it propagates enhances edges via deterministic rules and those edges influence recommendations through the graph_causal scoring lane. However, there is **zero quantitative evidence** that propagation measurably improves unprompted skill discovery: no A/B test, no before/after recommendation comparison, no precision/recall measurement. The claim of value is asserted, not proven. [HIGH]

---

### Q5: Doctor command coverage gaps — which subsystems lack a `/doctor` diagnostic target, and which failure modes therefore go undiagnosed?

**Findings:**

1. The canonical route manifest is at `.opencode/commands/doctor/_routes.yaml` (193 lines), validated by `route-validate.sh/route-validate.py`. It defines **7 subsystem targets** (`memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-advisor`, `skill-budget`), **2 MCP sub-routes** (`/doctor:mcp install|debug`), and **1 standalone orchestrator** (`/doctor:update`). [HIGH]

2. Of the 7 subsystem targets, only `skill-advisor` is `mutates`-class; the other 6 are `read-only`. All rebuild operations are routed to `/doctor:update`. [HIGH]

3. **17 of 21 skills** have no `/doctor` target. The uncovered skills are: `sk-git`, `sk-code`, `sk-code-review`, `sk-doc`, `sk-prompt`, `sk-prompt-models`, `cli-claude-code`, `cli-codex`, `cli-devin`, `cli-opencode`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-code-mode`. [HIGH]

4. Only **4 of 21 skills** have even a standalone `doctor.sh` script (not wired into the `/doctor` router): `system-spec-kit/scripts/doctor.sh`, `system-code-graph/scripts/doctor.sh`, `system-skill-advisor/scripts/doctor.sh`, `mcp-code-mode/scripts/doctor.sh`. These check dist existence and native-module imports only. [HIGH]

5. **Undiagnosed failure mode — MCP daemon/launcher layer:** There is no `/doctor` target for launcher lease expiry/renewal failures, socket canonicalization races, front-proxy health/overload, WAL checkpoint failures in MCP databases, or daemon recycle script hangs. These failures manifest as silent MCP tool timeouts with no diagnostic surface. [HIGH]

6. **Undiagnosed failure mode — embedding model-server RSS/memory:** `/doctor embeddings` reports provider and model-server status but does NOT check whether hf-local RSS exceeds the watchdog threshold. Model download stuck/silent failures are partially detected by `loaded: false` but the root cause (download failing vs. pending) is not distinguished. [MEDIUM]

7. **Undiagnosed failure mode — runtime hook health:** No verification exists that Claude/Codex/OpenCode/Gemini hooks are firing and returning non-stale payloads. Stale hook payloads (e.g., a 24h-old cached Skill Advisor brief) have no diagnostic surface. [HIGH]

8. **Undiagnosed failure mode — session worktree reaping:** Orphaned worktrees in `.worktrees/`, broken `.git` symlinks in worktree subdirs, and unreaped ephemeral worktrees have no diagnostic target. [MEDIUM]

9. **Undiagnosed failure mode — `skill-graph.sqlite` standalone health:** Skill-graph diagnostics are only accessible through `/doctor skill-advisor` or `/doctor:update`. There is no quick read-only check for graph corruption, zero node/edge count, or stale index when skill SKILL.md files are present. [MEDIUM]

10. **Undiagnosed failure mode — `sk-git` worktree health:** No diagnostic for worktree namespace exhaustion (numbering collisions in `wt/`), stale branches not reaped after merge, or conventional commit compliance drift. [LOW]

**Verdict:** Coverage is concentrated on the `system-*` infrastructure skills (spec-kit, code-graph, skill-advisor) and deep-loop runtime, leaving 17 user-facing skills and several critical infrastructure layers (daemon/launcher, hook health, worktree reaping, standalone skill-graph) without any `/doctor` diagnostic target. The most impactful gaps are the launcher/daemon layer (silent MCP failures) and runtime hook health (stale payloads), both of which have no `/doctor` path whatsoever. [HIGH]
