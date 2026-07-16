Now I have all the evidence needed. Here is the complete report.

---

### Q1: Is the self-maintaining memory-index move-reconciliation correct under rapid concurrent spec-folder moves, and what race exposure remains?

- Findings:
  1. Move reconciliation is triggered before the delete+reindex cycle in `memory-index.ts:692-699` only when both `filesToDelete` and `filesToIndex` are non-empty. It calls `incrementalIndex.reconcileMoves(filesToDelete, filesToIndex)`. [HIGH]
  2. The reconciliation (`incremental-index.ts:512-628`) pairs old→new paths by matching grandparent directory + basename (sibling folder rename) and requires exactly 1 sibling deleted, exactly 1 live DB row, and optional document_type cross-check. The `packet_id` from the *new* location's `graph-metadata.json` gates eligibility, but is NOT used for the old→new pairing itself. [HIGH]
  3. The in-place row update (`incremental-index.ts:603-612`) preserves embedding, id, and history — the row's `file_path`, `canonical_file_path`, `spec_folder`, and `file_mtime_ms` are repointed without re-embedding. [HIGH]
  4. No inter-process lock protects the reconcileMoves call itself. The scan already holds a scan lease (`memory-index.ts:354-389`, `acquireIndexScanLease`) that coalesces concurrent scans, but a `memory_save` call (which uses per-folder `withSpecFolderLock` in `spec-folder-mutex.ts:88-110`) is NOT serialized against the scan. A save could insert/update a row between `categorizeFilesForIndexing` and `reconcileMoves`. [HIGH]
  5. The scan lease has a heartbeat (`memory-index.ts:400-408`) that keeps it alive during long scans, so the lease window covers the full reconcile+index duration. [HIGH]
  6. The `reconcileMoves` function is purely in-process (no cross-process coordination like a mutex file) and reads DB state directly. If two different scan invocations somehow raced past the lease (e.g., due to heartbeat failure), both could attempt move reconciliation on overlapping rows. [MEDIUM]
  7. The `document_type` cross-check (`incremental-index.ts:588-591`) requires the stored `document_type` column be available (`hasDocumentTypeColumn()`). When absent (legacy/test schemas), the cross-verification is skipped, allowing potential mismatched repoints. [MEDIUM]
  8. After reconciliation, `moveReconciled` is surfaced in the scan response (`memory-index.ts:142`) and reconciled paths are removed from `filesToDelete`/`filesToIndex` (`memory-index.ts:694-697`), preventing redundant delete+reindex. [HIGH]

- Verdict: The mechanism is correct for the common case (serial scans, narrow rename guard) but has a race window between `categorizeFilesForIndexing` and `reconcileMoves` where a concurrent `memory_save` could insert/update a candidate row, and the lack of document_type column in legacy schemas weakens the cross-verification guard. The scan lease provides strong serialization, but heartbeat failure could expose a dual-scan race. [MEDIUM-HIGH confidence]

---

### Q2: What happens when the lease-holder launcher dies ungracefully, and what is the re-election latency for secondary launchers?

- Findings:
  1. The spec-kit-memory launcher uses a two-level lease model: an **owner lease** (`.spec-memory-owner.json`, `mk-spec-memory-launcher.cjs:85`) with fields `ownerPid`, `ppid`, `executablePath`, `startedAtIso`, `lastHeartbeatIso`, `ttlMs`, `canonicalDbDir`, and a **daemon lease** (`.mk-spec-memory-launcher.json`, line 84) with `pid`, `childPid`, `socketPath`. [HIGH]
  2. Owner lease TTL defaults to 60 seconds (`mk-spec-memory-launcher.cjs:321`, `ttlMs: 60000`). Heartbeat interval = TTL/2 = ~30 seconds (line 431). Stale threshold = 2× TTL = 120 seconds (line 358). [HIGH]
  3. Owner classification (`classifyOwnerLease`, lines 346-363) checks: (a) process liveness via `process.kill(pid, 0)`, (b) PPID-1 orphan detection via `readParentPid`, (c) stale heartbeat via `Date.now() - heartbeatMs > ttlMs * 2`. A `stale-pid` (dead process) is classified immediately. `ppid-1-orphan` is detected even if the process is still alive. `stale-heartbeat-reclaim` fires after 120s. [HIGH]
  4. On ungraceful death (SIGKILL): the secondary launcher's `acquireOwnerLeaseFile` (lines 365-403) reads the existing owner lease, classifies it as `stale-pid` (dead), reclaims it, logs `ownerLeaseReclaimed`, and writes a new owner lease. The dead-socket respawn path (`respawnAfterDeadSocket`, lines 671-752) then: acquires bootstrap lock, re-verifies lease hasn't changed, reaps old owner (SIGTERM → wait → SIGKILL), reaps old child, writes exclusive owner lease, builds if needed, writes leasse file, launches server. [HIGH]
  5. Re-election latency for a killed process: **immediate**. `process.kill(pid, 0)` returns ESRCH instantly when the PID is dead. The secondary launcher detects this on startup during `acquireOwnerLeaseFile` → `classifyOwnerLease` → `getProcessLiveness` (`model-server-supervision.cjs`, used via `mss.processLiveness` at line 347). The re-spawn itself has serialized lock gates (bootstrap lock, respawn lock) but these are sub-second. [HIGH]
  6. For a stuck/network-partitioned process that is still alive: re-election latency could be up to 120 seconds (stale heartbeat threshold). However, `ppid-1-orphan` detection (`readParentPid` at lines 326-344) catches the case where the original parent died and the process was re-parented to PID 1, closing this gap on Linux where `/proc/{pid}/status` is readable. [HIGH]
  7. The code-graph subsystem has an equivalent but independent owner-lease mechanism (`owner-lease.ts:1-535`) with its own `.code-graph-owner.json` file, mutation lock, and heartbeat, using the same pattern of PID-liveness + PPID-1-orphan + heartbeat-stale classification. [HIGH]
  8. The skill-advisor subsystem uses a SQLite-backed lease (`daemon/lease.ts:1-395`) with `skill_graph_daemon_lease` table and heartbeat interval of 5 seconds (default 30s stale-after, 5s heartbeat). [HIGH]
  9. The launcher's `uncaughtException` handler (`mk-spec-memory-launcher.cjs:1317-1325`) clears all lease files before re-throwing, and the `process.on('exit')` handler (line 1336) also runs `clearAllLeaseFiles`, so a crash in the launcher itself cleans up its own leases. [HIGH]

- Verdict: The lease-holder launcher dying ungracefully is handled correctly: dead-PID detection is immediate (ESRCH), the stale-heartbeat fallback covers stuck-but-alive processes within 120s, and PPID-1-orphan detection shortens this further. Re-election latency for the most common case (SIGKILL) is sub-second, limited only by bootstrap lock serialization. The two-level lease (owner + daemon) plus the dead-socket respawn path with re-verification guards provides robust single-writer ownership. [HIGH confidence]

---

### Q3: Are `unionMode:'multi'` and `hotFileBreadcrumb` actually used, and do they earn their complexity?

- Findings:
  1. `unionMode` is accepted in the tool schema (`tool-schemas.ts:54`) and consumed in `query.ts:1319-1321`: when set to `'multi'`, the blast_radius operation unions `subject + subjects` as source files. It's surfaced in the response as `multiFileUnion` (line 1498) and `unionMode` (line 1499). [HIGH]
  2. The only value of `unionMode` is enabling multi-subject blast-radius queries without the caller need to manually compute the union. Without it, only `subject` is used (line 1321: `[subject]`). [HIGH]
  3. `hotFileBreadcrumb` is computed by `buildHotFileBreadcrumbs` (`query.ts:932-961`): for each file path, it queries `graphDb.queryFileDegrees()`, identifies the top ~10% highest-degree files (min threshold 20), and attaches a `{ degree, changeCarefullyReason }` marker. [HIGH]
  4. `hotFileBreadcrumb` is attached to: (a) blast_radius `affectedFiles` entries and seed nodes (lines 1142-1157), (b) blast_radius `hotFileBreadcrumbs` aggregation (lines 1172-1175), (c) relationship query outputs for calls_from/to and imports_from/to (lines 793, 819). [HIGH]
  5. The `queryFileDegrees` DB call is an additional structural query layer beyond the basic edge resolution. For blast_radius, it's called once per response (not per file), computing degrees on the union of source files + affected files. [HIGH]
  6. Explicit test coverage exists for both features in `code-graph-query-handler.vitest.ts` (lines 1004, 1021, 1043, 1056, 1064, 1067). A manual testing playbook scenario (`022-code-graph-query-blast-radius.md`) explicitly tests `unionMode:'multi'`. [HIGH]
  7. The complexity overhead is moderate: `buildHotFileBreadcrumbs` is ~30 lines of straightforward logic (filter + sort + threshold + map); `unionMode` is a ~3-line conditional spread. Neither introduces cross-cutting architectural complexity. [HIGH]
  8. No MCP tool client code in the repository (beyond tests) was found calling `unionMode:'multi'` — usage evidence is test-only. However, the MCP client (AI agent) driving these tools is external and would not appear in the repo. [MEDIUM]

- Verdict: Both features are actually wired into the response pipeline and tested. `unionMode:'multi'` provides real value for multi-subject blast-radius queries (avoids N separate calls) with minimal complexity (~3 lines). `hotFileBreadcrumb` adds a moderate additional DB query per response but provides actionable guidance ("change carefully — changes ripple to N dependents") for high-degree files. Both earn their complexity. [HIGH confidence]

---

### Q4: Does skill-graph enhancement-edge propagation measurably improve unprompted skill discovery?

- Findings:
  1. The `propagateInboundEnhances` pipeline (`cross-skill-edges/index.ts:26-69`) detects missing `edges.enhances[]` declarations using composite scoring with three rules: **family-inference** (max 0.45 contribution, `detect-inbound-enhances.ts:70-105`), **asset-shape** (max 0.30, lines 111-138), and **sibling-transitivity** (max 0.15, lines 144-166). Min confidence default is 0.75 (line 30). [HIGH]
  2. The family-inference rule fires when a source skill already enhances ≥3 peers in the target's family and >50% of that family's peers are already enhanced. The asset-shape rule checks if the target has files matching the source's `enhance_when` rules. The sibling-transitivity rule checks if source enhances B, and B lists target as a sibling. [HIGH]
  3. Enhancement edges feed directly into the **graph-causal scoring lane** (`graph-causal.ts:13-14`): `enhances` edges get a **0.55 multiplier** — the highest positive multiplier among all edge types (siblings: 0.35, depends_on: 0.35, prerequisite_for: 0.30, conflicts_with: -0.35). [HIGH]
  4. The graph-causal lane propagates scores through the skill graph using BFS with depth decay (`graph-causal.ts:56-87`): `propagated = currentStrength × edgeWeight × |multiplier| × 1/(depth+1)`. Edges with weight <0.05 are pruned. [HIGH]
  5. The explicit scoring lane also interacts with enhances edges: `explicit.ts:279-280` documents that graph sibling/enhances edges compound through downstream layers and must be overcome by explicit disambiguation boosts. [HIGH]
  6. Propagated edges are written to the source skill's `graph-metadata.json` file (`apply-graph-metadata-patch.ts:57-77`), making them durable and picked up by the skill-graph scan → SQLite index → all scoring lanes at query time. [HIGH]
  7. The propagation is opt-in: default mode is `'report'` (no writes), and apply mode requires either explicit `applyCandidateIds` or `applyAllHighConfidence` with `confidenceLabel === 'high'` AND `applyable === true` (`cross-skill-edges/index.ts:46-53`). [HIGH]
  8. No quantitative measurement of recommendation quality delta (e.g., A/B test of advisor precision/recall with vs. without propagated enhances edges) was found in the codebase. Test coverage validates correctness of detection logic (`cross-skill-edges.vitest.ts`) but not measurable improvement. [LOW]

- Verdict: The mechanism is well-designed: it detects missing enhances edges using structured heuristics, propagates them into the skill-graph scoring pipeline where they carry the highest positive multiplier (0.55), and surfaces them in advisor recommendations through the graph-causal lane. The pipeline is conservative (high confidence threshold, opt-in apply). However, there is no quantitative evidence in the codebase measuring actual improvement in recommendation quality — the mechanism's value is established structurally (it feeds the highest-weighted edge into the graph traversal) but not empirically. [MEDIUM confidence]

---

### Q5: Which subsystems lack a `/doctor` diagnostic target, and which failure modes therefore go undiagnosed?

- Findings:
  1. The route manifest (`_routes.yaml:27-147`) defines 7 `/doctor` targets: `memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-advisor`, `skill-budget`. These cover the 3 MCP server backends (mk-spec-memory, mk-code-index, mk-skill-advisor) plus deep-loop coverage graphs and description budgets. [HIGH]
  2. The skills directory (`.opencode/skills/`) contains 24 skill directories. The 7 doctor targets directly cover only 3 skills (`system-spec-kit`, `system-code-graph`, `system-skill-advisor`). [HIGH]
  3. CLI executor skills (`cli-claude-code`, `cli-codex`, `cli-devin`, `cli-opencode`) have **no doctor diagnostic target**. Failure modes undiagnosed: model-specific launch parameter drift, CLI binary version mismatches, per-model prompt-contract staleness. [HIGH]
  4. The `sk-git` skill (git workflow orchestrator) has **no doctor diagnostic target**. Failure modes undiagnosed: worktree corruption, stale branch tracking, conventional-commit template drift. [HIGH]
  5. The `mcp-code-mode` skill's `doctor.sh` exists at `.opencode/skills/mcp-code-mode/scripts/doctor.sh` but is **not registered** as a route in `_routes.yaml` — it has a script but no routeable `/doctor` target. [HIGH]
  6. MCP connector skills (`mcp-chrome-devtools`, `mcp-click-up`) have **no doctor diagnostic target**. Failure modes undiagnosed: connection health, tool availability regression, credential expiry. [HIGH]
  7. Code-authoring skills (`sk-code`, `sk-code-review`, `sk-doc`, `sk-prompt`, `sk-prompt-models`) have **no doctor diagnostic target**. Failure modes undiagnosed: convention template drift, surface-detection marker staleness. [HIGH]
  8. The `deep-loop` route (`_routes.yaml:97-113`) covers coverage graphs for deep-research and deep-review at the runtime level via `deep-loop-runtime/scripts/status.cjs`, but NOT at the individual skill configuration level (`deep-research`, `deep-review`, `deep-improvement`, `deep-ai-council`). [MEDIUM]
  9. The `customize-opencode` skill (built-in, configures opencode itself) has **no doctor diagnostic target**. Failure modes undiagnosed: permission rule conflicts, MCP server registration issues, agent config drift. [HIGH]
  10. The `/doctor:mcp` companion command (`mcp_subroutes` at `_routes.yaml:156-176`) partially covers MCP server infrastructure (install/debug), and `/doctor:update` (`standalone` at `_routes.yaml:184-192`) covers cross-subsystem migration. These are not `/doctor <target>` routes. [HIGH]
  11. The `mcp-code-mode` doctor script at `.opencode/skills/mcp-code-mode/scripts/doctor.sh` exists but has no corresponding YAML asset in `.opencode/commands/doctor/assets/` and no route entry in `_routes.yaml`. It is effectively unreachable through the `/doctor` router. [HIGH]

- Verdict: The `/doctor` command covers the 3 MCP server subsystems comprehensively but has significant gaps: CLI executors (4 skills), git workflow, code-authoring standards (5 sk-* skills), MCP connectors (2 skills), built-in customization, and individual deep-loop skill configurations all lack diagnostic targets. The `mcp-code-mode` skill has a doctor script but no route registration. The `/doctor:mcp` and `/doctor:update` companion commands cover installation/debug and cross-subsystem migration respectively, but these are not `/doctor <target>` routes. [HIGH confidence]
