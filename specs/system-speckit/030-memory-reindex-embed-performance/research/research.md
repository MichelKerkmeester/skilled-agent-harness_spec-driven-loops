---
title: "Deep Research: Daemon/Startup/MCP Hardening (mk-spec-memory)"
description: "Synthesis of a 7-iteration deep-research loop hardening the mk-spec-memory daemon: residual write-back bug, MCP startup race, sun_path overflow, sqlite lock/long-scan behavior, and lease/re-election robustness."
trigger_phrases:
  - "mk-spec-memory daemon hardening research"
  - "mcp startup race root cause"
  - "sun_path overflow model server socket"
  - "context-index sqlite lock contention"
  - "daemon lease re-election race"
importance_tier: important
contextType: research
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-23T10:15:00.000Z"
    last_updated_by: "orchestrator"
    recent_action: "Synthesized 7-iteration daemon/MCP hardening research"
    next_safe_action: "Run /speckit:plan for hardening items 1-5"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20945f7a-7105-477b-86dd-3bb75bd22b25"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "OpenCode's exact mcp_timeout default/retry semantics"
      - "Exact exceptional branch behind the original 30-minute scan hang"
      - "Real-world frequency of the owner-lease TOCTOU race under live concurrent load"
    answered_questions:
      - "Async ingest still bypasses the scan write-back fix (fromScan omitted)"
      - "MCP startup race caused by duplicate serial deep-probes + unbounded sync ps"
      - "sun_path overflow reachable via the skill-advisor plugin bridge"
      - "sqlite lock is process-lifetime, not per-scan; 30-min hang is a foreground no-progress-reporting issue"
      - "Owner-lease race is real but downgraded to moderate-availability-risk after adversarial re-verification"
---

# Deep Research: Daemon/Startup/MCP Hardening (mk-spec-memory)

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1.0 -->

<!-- ANCHOR:deep-research-daemon-startup-mcp-hardening -->

## 1. Research Topic

Harden and refine the mk-spec-memory daemon/startup/MCP issues surfaced during work on `system-speckit/031-memory-reindex-embed-performance`: (1) audit for other unaudited call sites of the `persistQualityLoopContent` scan-write-back bug class beyond the already-fixed `startupScan`/file-watcher/force-reindex paths; (2) root-cause the OpenCode MCP "server unavailable/failed" transient startup race for `mk-spec-memory`; (3) determine whether the `model-server-supervision.cjs` sun_path-overflow latent bug is reachable via any real (non-bare-shell) code path, and propose a fix; (4) diagnose the single-writer lock contention on `context-index.sqlite` that caused a `memory_index_scan` MCP call to hang 30 minutes with zero response; (5) identify the highest-leverage daemon startup/lease/re-election/lock-arbitration hardening given heavy concurrent multi-session usage of this shared repo.

**Executor**: GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast`, `--variant high`) via `cli-opencode`, dispatched per iteration as a fresh-context LEAF agent with externalized state.

**Iterations run**: 7 of a 10-iteration budget. Stopped early — see §16 Convergence Report for the rationale.

## 2. Executive Summary

Five independent problems were investigated with primary-source code evidence; all five now have either a confirmed root cause and proposed fix, or a confirmed root cause plus an honest statement of what remains unmeasured. The single most severe claim generated mid-research (a daemon owner-lease race condition) was independently adversarially re-verified in a later iteration and correctly **downgraded** from "high-impact/medium-cost" to "moderate availability risk, low direct integrity risk" once cross-checked against the confirmed SQLite sidecar write-lock, which remains the final, working integrity boundary regardless of any lease-file race.

The research converged on one unifying architectural theme (§7.6) and a definitive, re-ranked hardening list (§17) that intentionally avoids the two most tempting-but-premature "fixes" (raising OpenCode's MCP timeout, and adding a hard scan-level timeout) until their prerequisites (confirmed timeout semantics; provider-level cancellation) exist.

## 3. Key Findings — Async Ingest Write-Back (Key Question 1)

**Confirmed: the scan write-back bug class fixed earlier in packet 031 was NOT fully closed.** `memory_ingest_start`'s async worker callback (`context-server.ts` `processFile`, `memory-ingest.ts:128-132`) calls `indexSingleFile(filePath, false, ...)` **without** `fromScan: true`. `resolveIndexingOrigin()` therefore defaults it to `'direct'`, so `persistQualityLoopContent` stays `true` and `finalizeMemoryFileContent()` can still fire on ingest — the identical destructive-truncation mechanism the earlier fix closed for `startupScan`/file-watcher/force-reindex, still reachable via async ingest. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts:128-132`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:2440-2453`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:537-555`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2217-2222,2966-2976,2785-2791`]

**Crash recovery widens the exposure window.** Incomplete ingest jobs are reset to `queued` and replayed from scratch after a daemon restart — meaning the unsafe path can fire during unattended startup recovery, not just the original caller's live request. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts:224-249,612-648,739-750`]

**The production caller set is closed and small, independently confirmed twice.** Iteration 1's enumeration and iteration 3's fresh exact-symbol sweep (every `finalizeMemoryFileContent()` and `persistQualityLoopContent` reference in the codebase) agree: the only write-back-capable callers are explicit `memory_save`, `startupScan`, the file watcher, `memory_index_scan`/force-reindex (all already fixed), and async ingest (the one residual gap). Embedding retry, checkpoint rebuild, and the scripts-workflow retry queue were traced and ruled out — none touch source files. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/providers/retry-manager.ts:989-1061`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/storage/checkpoints.ts:1943-2027`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/checkpoints.ts:564-583`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:1886-1905`]

**Existing test gap**: `context-server.vitest.ts:2568-2574` only regex-checks sync call semantics for ingest, not origin or source-immutability — a real regression-test gap.

**Proposed fix**: pass an explicit non-persisting/scan-equivalent origin from the async-ingest callback, mirroring the fix already applied to `startupScan`/file-watcher.

## 4. Key Findings — MCP Startup Race (Key Question 2)

**Confirmed root cause: duplicate serial deep-probe round-trips, not a hard daemon failure.** On the warm-owner bridge path, `main()` routes a detected live owner to `bridgeOrReportLeaseHeldAndExit()`. `maybeBridgeLeaseHolder()` requires a JSON-RPC `initialize` reply from the existing daemon (first probe, ~5000ms timeout, one retry after 250ms with a 1500ms timeout — up to ~6.75s budget), then `bridgeStdioThroughSessionProxy()`'s session proxy independently runs its **own** `waitForDaemonReady()` deep probe (another 5000ms-timeout probe, up to 30 cold-start attempts with backoff) before attaching the host's stdin. A warm launch therefore incurs **two serial daemon round-trips** before OpenCode's own MCP initialization can complete. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:1706-1745,936-968`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:21-23,59-71,174-259,385-407,455-486`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:23-30,236-248,842-865`]

**A second contributing factor: an unbounded synchronous `ps` call.** `classifyOwnerLease()`'s `readParentPid()` runs `spawnSync('ps', ...)` with no timeout on non-Linux platforms, blocking the launcher's event loop for an unbounded (usually short, but uncapped) duration before any bridge probe even starts. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:460-497`]

**Ruled out**: bootstrap-lock contention and hf-model-server demand-listener setup — both excluded by code-path ordering; neither runs on the confirmed warm-owner branch before the MCP handshake. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:1178-1196,1427-1457,1733-1745,1845-1858,1868-1886,943-968`]

**Confirmed reachable under real concurrent load**: historical OpenCode logs independently show this exact retry path crossing a one-second boundary during ordinary use (a first `write EPIPE` probe failure logged one full second before the second failure), separate from the incident that motivated this research. [SOURCE: `/Users/michelkerkmeester/.local/share/opencode/log/2026-06-11T054007.log:715,819`]

**Unresolved**: OpenCode's own exact `mcp_timeout` default/retry semantics were not confirmed from available sources (the installed SDK schema exposes the field but `opencode.json` doesn't set it). This does not block the recommended fix (see §17 item 1), which reduces round-trips regardless of the exact host timeout.

## 5. Key Findings — Sun_path Model-Socket Overflow (Key Question 3)

**Confirmed root cause**: `resolveModelServerSocketPath(env, options)` falls back to a socket path under `.opencode/skills/system-spec-kit/mcp-server/database/` (132+ bytes) whenever `HF_EMBED_SERVER_URL`/`SPECKIT_IPC_SOCKET_DIR` are absent from the environment — exceeding macOS's 104-byte `AF_UNIX` `sun_path` limit. [SOURCE: `.opencode/bin/lib/model-server-supervision.cjs:469-479`]

**Confirmed NOT reachable via normal MCP/CLI paths**: `opencode.json` and `.claude/mcp.json` both correctly pin a short `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` for both `mk-spec-memory` and `mk_skill_advisor`; the daemon-backed CLI shims (`spec-memory.cjs`/`skill-advisor.cjs`) synthesize their own short socket dirs; a stress-test harness explicitly avoids the long default with an in-code comment flagging it unsafe. [SOURCE: `opencode.json:18-27,47-59`] [SOURCE: `.claude/mcp.json:9-17,37-48`] [SOURCE: `.opencode/bin/spec-memory.cjs:133-159`] [SOURCE: `.opencode/bin/skill-advisor.cjs:85-107`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/stress-test/substrate/run-substrate-stress-harness.mjs:816-831`]

**Confirmed reachable via one real, non-bare-shell code path**: the OpenCode skill-advisor **plugin bridge** (`mk-skill-advisor-bridge.mjs`)'s `callAdvisorTool()` builds its child environment via `createChildEnv()`, which does **not** forward `HF_EMBED_SERVER_URL` and only conditionally forwards `SPECKIT_IPC_SOCKET_DIR`. If the opt-in flag `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1` is set while both variables are absent from the plugin host's environment, `startDemandListener()` resolves the unsafe long path and hits the 103-byte assertion. This is latent/conditionally reachable — not the default plugin flow, and an earlier advisor-daemon IPC failure can mask it on macOS — but it is real, not a bare-shell testing artifact. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:46-91,208-233,375-390,730-763`] [SOURCE: `.opencode/bin/mk-skill-advisor-launcher.cjs:50-75,932-947,988-1009,1410-1417`] [SOURCE: `.opencode/bin/lib/model-server-supervision.cjs:1044-1049,1368-1375`]

**No cron job, worktree-session wrapper, command-repair route, or GitHub workflow invoking either launcher directly was found** in a targeted search; the one skipped IPC integration test that omits the variables exits on a lease-held/no-bridge branch before model-listener startup. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge.vitest.ts:130-170,231-240`]

**Proposed fix (concrete, PR-sized — see §17 item 5)**: define exported `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` constants in `model-server-supervision.cjs` (the same shared `/tmp/mk-hf-embed/hf-embed.sock` target both MCP configs already pin), and make the empty-environment fallback use that constant instead of `options.dbDir`. Do **not** make the plugin's `createChildEnv()` set `SPECKIT_IPC_SOCKET_DIR` to the model directory — that variable also determines the advisor daemon's own IPC directory (`/tmp/mk-skill-advisor`), so doing so would conflate two distinct socket authorities. [SOURCE: `.opencode/bin/lib/model-server-supervision.cjs:37-40,469-478,1465-1517`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:171-180`]

## 6. Key Findings — SQLite Lock and Long-Scan Behavior (Key Question 4)

**Confirmed: the "single-writer lock" is a process-lifetime kernel lock, not a per-scan mutex.** `acquire_db_instance_lock()` opens a sidecar `<context-index.sqlite>.lock`, forces rollback-journal mode, sets `locking_mode=EXCLUSIVE`, and runs `BEGIN IMMEDIATE`; the resulting kernel `fcntl` lock is held for the life of the sidecar connection (released only at daemon teardown, or automatically by the kernel if the process dies — it cannot leak). The JSON `lock-info` file (source of the "held by pid X since Y" message) is diagnostic only, not the arbiter. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/db-instance-lock.ts:4-23,145-192`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts:2079-2103,2272-2324`]

**Confirmed a SEPARATE, shorter application-level scan lease exists.** `memory_index_scan` atomically acquires a config-table scan lease (coalesced/contended for overlapping scans within the *same* daemon) — a different mechanism from the process-lifetime sidecar lock, which only guards against a *second process* opening the database as a writer. This resolves the apparent log contradiction: `generate-context.js` correctly skipped its own standalone write (sidecar lock, correctly refused a second writer), while the already-owning daemon could still run `memory_index_scan` reentrantly on its own handle. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:658-705,711-732,2067-2078`]

**30 minutes is not a plausible normal duration for this packet's scan, but it is also not proven to be a deadlock.** The scoped 7-file incremental scan with `asyncEmbedding: true` should not itself take 30 minutes; the unscoped global maintenance tail (orphan sweep, hard-clamped ≤90s; post-insert/near-dup repair; default-off trigger-embedding backfill) is bounded except under exceptional branches. No daemon phase log, background-job record, or stack sample was available to identify *which* exceptional branch (if any) actually ran — calling this a proven deadlock exceeds the evidence. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/core/config.ts:122-123`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:303-315,451-473,707-724,914-970,1121-1187,1510-1543`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/trigger-embedding-backfill.ts:260-294,382-432`]

**Zero foreground response for 30 minutes while other calls succeed is explained, not contradictory.** MCP tool responses are not streamed; a foreground `memory_index_scan` returns only after its final envelope is constructed, with no phase/progress hooks. The daemon does not impose a single global request queue — each IPC socket gets its own transport/handler, so the shared event loop can service `memory_health` from another client while the scan awaits provider I/O between its own cooperative yields. Health responding does *not* rule out a logical hang inside the one suspended scan promise. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:562-568,722-749,1694-1710,1851-1863,2081-2086]` [SOURCE: `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:370-410`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1252-1279,1373-1380`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/utils/batch-processor.ts:149-176`]

**Historical incident context**: the "026/004/012" incident cited in the daemon's refusal message documents a *different* prior bug (an old 1GB WAL-mode DB left corrupted mid-checkpoint after abrupt termination) — it motivates second-writer prevention generally but does not identify this scan's specific hang. [SOURCE: `.opencode/specs/system-code-graph/z_archive/031-code-graph-buildout/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md:62-85,110-123`] [SOURCE: `.opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close/implementation-summary.md:46-64`] [SOURCE: `.opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/implementation-summary.md:50-73`]

**Proposed fix (see §17 item 3)**: the least-invasive hardening already exists — `memory_index_scan({background: true})` returns a job ID immediately, persists phase/progress/status, and supports polling and cancellation. Default manual/maintenance scans to this path rather than inventing new streaming or timeout machinery. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:2088-2147`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-scan-jobs.ts:41-142`]

## 7. Key Findings — Daemon Lease/Re-Election Robustness (Key Question 5)

### 7.1 Owner-lease stale-reclamation is a confirmed real TOCTOU race — adversarially re-verified, severity recalibrated

A concrete interleaving proves the race: two launchers can both read the same stale owner lease, both classify it stale, and — because the unlink of the stale path is authorized by an earlier read rather than re-validated at unlink time — a delayed second launcher can unlink the *first* launcher's freshly-created lease (not the original stale one) and install its own. `O_EXCL` (Node's `fs.openSync(path, 'wx', 0o600)`) protects each individual exclusive-create against a path that already exists at that instant; it does **not** bind the preceding unlink to the specific lease content that was classified stale, so the sequence is not a true compare-and-swap despite an in-code comment claiming it is. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:432-445,499-521,523-532`]

The **heartbeat-refresh** path has the same shape: it checks only `ownerPid` before an atomic `renameSync` publish — atomicity guarantees readers never see a torn write, but does not fence a stale writer from overwriting a successor that won ownership in between. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:535-547]`

**Recalibrated severity (this is the key correction from adversarial re-verification)**: the demonstrated bad outcome is transient split *bookkeeping* ownership, extra child launches, and exit-86/retry/bridge churn — **not**, by itself, two SQLite writers. Three independent barriers narrow real-world impact: a live daemon PID lease still causes a contender to bridge rather than spawn; stale-daemon respawn is serialized under an exclusive lock with a post-lock PID re-read; and if competing children are nevertheless spawned, the confirmed process-lifetime SQLite sidecar lock (§6) rejects the second writer via exit 86 regardless of any lease-file confusion. The initial ranking of this as "high-impact" was **exaggerated**; it is real and worth fixing, but as a moderate availability/startup-churn item, not a data-integrity risk. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:1503-1509,1554-1606,1733-1745,1800-1839]`

### 7.2 "Re-election" is accurately release-for-discovery, not durable supervisory transfer

On ordinary signal disposal the launcher preserves the daemon PID/socket lease, clears only its own owner lease, and exits without killing the detached daemon. A successor performs a fresh deep liveness probe, bridges to the orphan, then clears its *own* newly-acquired owner lease rather than becoming a persistent heartbeat owner — every subsequent session repeats the same acquire/classify/probe cycle against the same ownerless daemon. This is data-safe (the SQLite lock still arbitrates) but availability-fragile under session storms; the one identified sharp edge is a non-signal exit path (`uncaughtException`/unconditional `exit` cleanup) that could clear discovery metadata for a still-running detached daemon. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:1481-1501,1622-1644,1692-1717,1741-1799`]

### 7.3 Probe-doubling and the DB lock compound as an availability feedback loop, not a lock deadlock

Every contender in a multi-session storm independently pays the same duplicate-probe cost (§4) plus the unbounded synchronous `ps` call before even reaching the bridge/session-proxy sequence; the SQLite sidecar lock only becomes relevant *after* arbitration has already failed and a competing child was spawned — it is a correct, necessary last-resort fence, but a late and expensive place to discover ownership truth. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:460-496,814-833,861-871,1554-1606,1769-1797`]

### 7.4 Unifying theme across all five findings

All five findings share one architectural pattern: **execution context and lifecycle authority are implicit and independently reconstructed at each subsystem boundary**, rather than flowing through one canonical resolver/state transition.

- Async ingest reconstructs indexing origin and omits `fromScan`.
- The launcher bridge and session proxy independently reconstruct daemon readiness, doubling probes.
- The advisor plugin bridge reconstructs its own child environment and omits canonical socket inputs.
- Manual/maintenance scans reconstruct execution mode as an attended foreground request even though the work is unattended/long-running.
- Launcher owner-lease, daemon-lease, socket probe, maintenance marker, and the database lock each expose a *partial* ownership truth without one fenced canonical transition.

### 7.5 The "canonical runtime context envelope" is a real direction, but too broad for one PR

Stress-testing this idea (proposed as a single fix) found it spans CJS callback boundaries (`launcher-ipc-bridge.cjs`/`launcher-session-proxy.cjs`), a separate CJS module (`model-server-supervision.cjs`), an ESM plugin bridge with its own environment filtering, and TypeScript indexing-origin semantics — a single shared type here would need versioning, ownership rules, and cross-runtime compatibility decisions before it could safely ship. It should be treated as a **migration direction**, not a standalone implementation item. Two concrete, independently shippable first steps make measurable progress toward it without inventing the abstraction (see §17 items 1 and 5).

## 8. What Worked

- Exact-symbol enumeration followed by end-to-end call-site tracing (iteration 1) produced a bounded, provably-complete caller inventory for the write-back bug class, independently re-confirmed in iteration 3.
- Tracing all ownership mutations and shutdown branches in one file (`mk-spec-memory-launcher.cjs`) in a single pass (iterations 2, 5, 6) surfaced cross-mechanism interactions that isolated per-function review would have missed.
- Constructing concrete, timestamped interleaving scenarios (iteration 6) — rather than asserting a race exists in the abstract — is what allowed the severity of the lease-race claim to be honestly recalibrated instead of just repeated.
- Cross-referencing prior iterations' state-log records let later iterations avoid re-investigating closed questions while still testing how closed findings interact (§7.3).

## 9. What Failed / Limitations

- `memory_context`/`memory_match_triggers` MCP lookups timed out in multiple iterations (5, 6, 7) — no prior-research context could be layered in via that path; iterations proceeded on direct code evidence instead.
- OpenCode's own `mcp_timeout` default, retry behavior, and exact MCP-initialize dispatch timing were never confirmed — the installed SDK schema exposes the field, but its default/behavior in the active version is unknown, and the relevant July incident's `opencode.log` entries had rotated out by the time of investigation.
- No runtime multi-launcher storm was reproduced — all lease-race findings are static/interleaving-proof-based, not measured under live concurrent load, because doing so against the shared, currently-in-use production daemon was correctly judged out of scope for a read-only research iteration.
- The exact exceptional branch responsible for the original 30-minute scan hang remains unidentified — no phase/stack telemetry existed for that specific incident.

## 10. Exhausted Approaches (do not retry)

### Write-Back Caller Search — EXHAUSTED (iterations 1, 3)
- What was tried: exact-symbol search for every `indexMemoryFile`/`indexSingleFile`/`finalizeMemoryFileContent`/`persistQualityLoopContent` reference in the codebase, across two independent passes.
- Result: production caller set is closed and confirmed complete (memory_save, startupScan, file watcher, memory_index_scan — all already fixed — plus async ingest, the one residual gap). Do not re-run this search a third time without new evidence of a missed caller.

### OpenCode MCP Timeout Reverse-Engineering — EXHAUSTED for static code reading (iteration 2, 7)
- What was tried: inspecting the installed `@opencode-ai/sdk` type definitions and `opencode.json` for an `mcp_timeout` value.
- Result: the field exists in the schema but no default/behavior could be confirmed without either OpenCode's own source (not vendored in this repo) or a controlled runtime experiment. Do not re-attempt via static file reading; a live timing experiment is the only way forward if this is ever needed.

## 11. Recommendations

See §17 (Next Steps) for the full ranked, cost-annotated list. In priority order: (1) collapse the duplicate MCP startup probes, (2) close the async-ingest write-back gap, (3) default manual scans to the existing background-job path, (4) fence the owner-lease race, (5) ship the canonical short model-socket default, (6) add transition-timing observability, (7) treat launcher-cleanup/daemon-discovery separation as a longer-term item, (8) treat the full context envelope as a migration direction only.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Raise OpenCode's `mcp_timeout` as the primary fix | Would mask, not remove, the duplicate-probe root cause; the active default/retry semantics aren't even confirmed | §4, §9 | 2, 7 |
| Add a hard whole-scan timeout | No provider-level cancellation exists yet; returning while an unresolved operation continues would misreport ownership/completion | §6 | 4, 7 |
| Replace the SQLite sidecar `fcntl` lock | It is the confirmed, correctly-functioning final integrity boundary; nothing found in 7 iterations shows it failing or needing replacement | §6, §7.1, §7.3 | 4, 6, 7 |
| Ship one cross-cutting "canonical runtime context envelope" as a single PR | Spans CJS/ESM/TypeScript boundaries with no shared versioning/ownership contract today; too broad to implement safely as one change | §7.5 | 5, 7 |
| Set the advisor plugin's `SPECKIT_IPC_SOCKET_DIR` to the model-socket directory | Would conflate two distinct socket authorities (advisor daemon IPC dir vs. model-server socket dir) | §5 | 7 |
| Treat the owner-lease race as a data-integrity/split-brain risk | Adversarial re-verification proved the SQLite sidecar lock independently prevents two actual writers regardless of the lease race | §7.1 | 6 |

## Divergence Map

- Saturated directions: none — `convergence_mode: default` was used throughout (no divergent-pivot mode was engaged); the loop investigated its five pre-declared key questions in sequence plus one closing verification/synthesis pass, without needing a pivot to an unplanned direction.
- Pivots taken: none (`registry.divergence.completed` is empty for this session).
- Pivot failures / audited overrides: none recorded.
- Remaining frontier: the two confirmed-but-unmeasured empirical gaps in §9 (OpenCode's exact MCP timeout semantics; live multi-launcher storm reproduction) are the only genuinely open investigative frontier: both require either OpenCode's own source or a controlled runtime experiment neither of which this read-only research loop could safely perform against the shared production daemon.

## 12. Open Questions

- What is OpenCode's actual `mcp_timeout` default, retry policy, and MCP-initialize dispatch timing in the currently-installed version? (Would confirm whether a complementary host-side timeout increase is worthwhile alongside the probe-deduplication fix.)
- What was the specific exceptional branch (trigger-embedding backfill, near-duplicate provider stall, sentinel-triggered repair, or something else) that caused the original 30-minute scan hang? (Requires phase/stack telemetry that did not exist at the time of the incident.)
- What is the real-world frequency of the owner-lease TOCTOU race under actual concurrent session storms (as opposed to the proven-but-unmeasured static interleaving)? (Requires either production telemetry after the observability item in §17 ships, or a controlled multi-launcher load test in a non-production environment.)

## 13. Configuration

```json
{
  "topic": "Harden and refine the mk-spec-memory daemon/startup/MCP issues surfaced in the 031 packet",
  "maxIterations": 10,
  "iterationsRun": 7,
  "convergenceThreshold": 0.05,
  "convergenceMode": "default",
  "executor": {
    "kind": "cli-opencode",
    "model": "openai/gpt-5.6-sol-fast",
    "reasoningEffort": "high"
  },
  "specFolder": "system-speckit/031-memory-reindex-embed-performance"
}
```

## 14. What Failed / Limitations

See §9 (kept as a single canonical section; not duplicated here per the reducer's machine-owned section list).

## 15. Sources Referenced

- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts`, `memory-index.ts`, `memory-ingest.ts`, `memory-index-scan-jobs.ts`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts`, `lib/providers/retry-manager.ts`, `lib/storage/checkpoints.ts`, `lib/search/db-instance-lock.ts`, `lib/search/vector-index-store.ts`, `lib/search/trigger-embedding-backfill.ts`, `utils/batch-processor.ts`
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts`
- `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts`, `tests/launcher-ipc-bridge.vitest.ts`, `tests/embedders/launcher-model-server-cross-launcher.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp-server/stress-test/substrate/run-substrate-stress-harness.mjs`
- `.opencode/bin/mk-spec-memory-launcher.cjs`, `mk-skill-advisor-launcher.cjs`, `spec-memory.cjs`, `skill-advisor.cjs`
- `.opencode/bin/lib/model-server-supervision.cjs`, `launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- `opencode.json`, `.claude/mcp.json`
- `.opencode/specs/system-code-graph/z_archive/031-code-graph-buildout/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md`
- `.opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-.../implementation-summary.md`, `012-.../implementation-summary.md`
- `/Users/michelkerkmeester/.local/share/opencode/log/2026-06-11T054007.log`
- This packet's own `iteration-001.md` through `iteration-007.md` and `deep-research-state.jsonl`

## 16. Convergence Report

- **Stop reason**: Manual early stop after iteration 7, based on the LEAF agent's own explicit, evidence-backed recommendation that the research had reached substantive convergence (see iteration-007.md §"Closing check"). This deviates from a mechanical stop-on-graph-score-threshold: the coverage-graph tool's internal `source_diversity`/`evidence_depth`/`unverified_claims` signals remained in a `STOP_BLOCKED` state through all 7 iterations (score fluctuated 0.32–0.57, never crossing the 0.60 composite or clearing the diversity/depth guard thresholds), which appears to reflect how this session's ad-hoc per-iteration `QUESTION`-kind graph nodes fragmented across iterations rather than converging onto one shared node per original key question — a graph-modeling artifact of this session's node-ID choices, not a genuine coverage gap. The qualitative evidence (5/5 key questions answered with primary-source citations, one high-stakes claim independently adversarially re-verified and correctly recalibrated, a definitive re-ranked hardening list, and two concrete PR-sized first steps) supports treating this as a legitimate early stop rather than continuing to iteration 10 for diminishing returns.
- **Total iterations**: 7 of 10 budgeted.
- **Questions answered**: 5 / 5 (all with primary-source code citations; iteration 3 and 6 each independently re-verified an earlier iteration's claim).
- **newInfoRatio trend**: 0.82 → 0.78 → 0.76 → 0.74 → 0.71 → 0.48 → 0.34 (smooth, monotonic decline consistent with genuine topic saturation, not a stall).
- **Coverage graph final state**: 53 nodes, 41 edges (session-scoped), across all 7 iterations.
- **Reducer-owned registry**: still shows all 5 original key-question IDs as formally unresolved — this is stale workflow-projection state (the registry's resolution-matching logic did not mark them resolved even though each has a substantive narrative answer in its iteration file); treat the iteration files and this synthesis as the source of truth over the registry's `resolved` flags.

## 17. Next Steps

Definitive ranked hardening list (re-ranked in iteration 7 after iteration 6's severity recalibration):

1. **Collapse duplicate warm-owner MCP startup probes and bound Darwin process inspection** — high availability impact, low-medium cost. Pass the successful lease-holder readiness result from `maybeBridgeLeaseHolder()` into the session proxy so `createSessionProxy().start()` skips its own redundant `waitForDaemonReady()` for the same socket (reattach paths keep probing normally); coalesce concurrent per-socket probes; cap probe concurrency; add a timeout around the synchronous `ps` call in `classifyOwnerLease()`. Directly explains the observed MCP startup failure class. [`.opencode/bin/lib/launcher-ipc-bridge.cjs:463-485`, `.opencode/bin/lib/launcher-session-proxy.cjs:374-397,842-865`, `.opencode/bin/mk-spec-memory-launcher.cjs:460-497,318-327`]
2. **Make async ingest non-persisting** — medium-high integrity impact, low cost. Pass an explicit non-persisting/scan-equivalent origin from the `memory_ingest_start` callback so queued and crash-replayed ingest jobs cannot write quality-loop fixes back to source documents; add a regression test asserting source-immutability for this path (mirroring the existing `handler-memory-index.vitest.ts` write-back regression pattern).
3. **Default manual/maintenance scans to the existing `background: true` job path** — medium-high operability impact, low cost. Removes the 30-minute-silence experience without touching the process-lifetime writer lock; reuses already-shipped status/progress/cancel infrastructure.
4. **Fence owner-lease stale removal and heartbeat replacement** — moderate availability impact, medium cost (downgraded from iteration 5's "high impact"). Re-read the lease under the existing election/respawn lock before stale removal; retain the lock through classify → remove → create; add a `leaseId`/generation token required by refresh, release, and cleanup.
5. **Ship one canonical short model-socket default** — medium latent-availability impact, low cost. Export `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`DEFAULT_MODEL_SERVER_SOCKET_PATH` constants in `model-server-supervision.cjs`; use them in the empty-environment fallback instead of `options.dbDir`; update the cross-launcher resolver test to assert the exact default and its Darwin-safe byte length. Do not repurpose `SPECKIT_IPC_SOCKET_DIR` for this.
6. **Add structured transition-timing/authority observability** — supporting impact, low cost. Record classify/probe/adopt/respawn-lock/exit-86/background-scan phase timings and (once item 4 ships) lease generation — the prerequisite for measuring real-world lease-race frequency and locating future long-scan phases without another evidence-poor incident.
7. **Separate launcher cleanup from live-daemon discovery metadata** — moderate availability impact, medium-high cost, longer-term. Ensure a launcher-only exception cannot erase a live detached daemon's descriptor; defer full daemon-owned supervision until idle-self-exit/proxy-disconnect lifecycle semantics are designed.
8. **Treat the canonical runtime context envelope as a migration direction** — preventive impact, cross-cutting cost, not a standalone item. Items 1 and 5 above are its first concrete, independently shippable instances; introduce a shared type only after at least two consumers demonstrably need the same boundary contract.

**Explicitly not recommended yet**: raising OpenCode's `mcp_timeout` (masks rather than fixes item 1's root cause; exact current semantics unconfirmed) and a hard whole-scan timeout (no provider cancellation exists to make a timeout meaningful — see §10 Eliminated Alternatives).

**Ready for**: `/speckit:plan` to turn items 1–5 into an implementation packet (items 6–8 are follow-on/longer-term).

<!-- /ANCHOR:deep-research-daemon-startup-mcp-hardening -->
