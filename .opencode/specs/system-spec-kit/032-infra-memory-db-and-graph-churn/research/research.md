# Deep Research — Root cause of remaining system-spec-kit failures (common-cause)

**Status:** CONVERGED (3 of 10 iterations) · **Executor:** cli-codex · gpt-5.5 · reasoning=high · service-tier=fast
**Convergence trigger:** charter stop condition #1 — all P0 sub-questions (SQ1, SQ2, SQ4) answered with file:line evidence; SQ3 (P1) re-verified. Further static-analysis iterations cannot close the one residual (SQ2 historical-event forensics — see §6).

---

## 1. Verdict

The three reported symptoms are **two distinct defects plus one already-fixed concern**, and **two of the three share a single production root cause**:

| Symptom | Class | Shares common cause? |
|---|---|---|
| **SQ1** substrate stress "5-vs-4 TSV rows" | **Stale test bug** (assertion + single-daemon runner) | Surface symptom rides on the SQ4 lifecycle, but the *test failure* itself is a test defect |
| **SQ2** memory `SQLITE_CONSTRAINT_PRIMARYKEY` recurrence | **Production defect** (daemon lifecycle → FTS5 shadow divergence) | **Yes — root** |
| **SQ3** graph-metadata `last_save_at` tree-wide churn | **Already fixed at HEAD** (re-verified) | **No — independent write path** |

**Unifying root cause (SQ4, CONFIRMED conditional):** the `mk-spec-memory` launcher's respawn path can terminate an incumbent `context-server` child — *when that child's IPC deep-probe fails* — **without any DB clean-close barrier**. It reaps (`SIGTERM`→`SIGKILL`) and relaunches without verifying that `close_db()` ran (WAL checkpoint + detach + `.unclean-shutdown` removal). Under the operator's documented concurrent-session pattern this single gap produces *both* SQ1's client-side `Connection closed` diagnostic *and* SQ2's divergent FTS5 shadow that fires the primary-key constraint on the next write.

A healthy live daemon is **not** clobbered (strict single-writer bridges and returns); the kill is gated on *failed IPC liveness*, not mere concurrency. So the defect is narrow and specific: "respawn over an unresponsive incumbent, no clean-close barrier."

---

## 2. SQ1 — Substrate 5-vs-4 TSV mismatch  ·  SOLVED (P0)

**Root cause: the 5th row is a runner *connection-diagnostic* row, not a fifth scenario, duplicate, or double-write.**

- The harness requests exactly four scenarios (`--scenarios 403,404,407,410`) and asserts 4 data rows — `substrate-runner-harness.vitest.ts:31`–`:42`.
- When `connectSharedClient` fails, the runner emits a diagnostic object `{ scenario: "runner:<name>", verdict: "FAIL" }` and `main` pushes connection diagnostics into `rows` *before* the scenario rows — `run-substrate-stress-harness.mjs:326`–`:338`, `:626`–`:630`.
- The captured TSV body is exactly `runner:mk-spec-memory`, `403`, `404`, `407`, `410` (header + 5) — `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv:1`–`:6`. The diagnostic is `MCP error -32000: Connection closed` (`:2`).
- The parser cannot manufacture a duplicate (split → numeric parse → `new Set` dedup → sort) — `mjs:47`–`:62`. The TSV is written once in `finally` — `mjs:582`–`:590`.

**Compounding stale-test defect (second assertion would also fail):** the promoted runner starts **only the memory daemon** (`memoryConnection`, `clients.mk_spec_memory`), **not** a Code Graph daemon, despite the README describing two — `mjs:607`–`:638` vs `README.md:17`–`:18`. Scenarios 403/404/407 require Code Graph (`mcp__mk_code_index__code_graph_query`), so without that client they resolve to **SKIP, not PASS** — `403-code-intent-matching.md:41`, `404-…:46`, `407-…:44`, `mjs:445`–`:459`.

→ The test is **doubly stale**: (a) hardcodes 4 rows when a diagnostic row legitimately makes 5; (b) asserts PASS when the Code-Graph scenarios SKIP under a single-daemon runner. **This is a test bug, not a production regression.**

---

## 3. SQ2 — Memory PRIMARYKEY recurrence  ·  ROOT CAUSE ESTABLISHED (P0)

**Root cause: unclean daemon exit after DB-open leaves the FTS5 shadow (`memory_fts_data`) divergent; the next write's `memory_index` insert fires the `memory_fts_insert` trigger into the divergent shadow → `SQLITE_CONSTRAINT_PRIMARYKEY`. The at-rest DB looks healthy because the divergence is in the derived shadow b-tree, not the source rows.**

Lifecycle mechanics:
- `.unclean-shutdown` is written on **every** non-`:memory:` DB open, before bootstrap completes — `vector-index-store.ts:739`,`:746`,`:1270`,`:1297`. So marker presence ≠ corruption; it means "open, or not closed through the clean path."
- The marker is removed **only** by `close_db()` after a successful main-WAL checkpoint, shard detach, and `db.close()` — `vector-index-store.ts:1353`,`:1366`–`:1369`.
- Cleanup-bypass exits skip that close: direct `process.exit(1)` on API/embedder validation failure and the top-level `main().catch` bypass `fatalShutdown()`→`closeDb()` — `context-server.ts:1634`,`:1636`,`:1648`,`:1649`,`:2070`.
- Even the graceful path is **time-bounded, not barrier-verified**: `fatalShutdown()` races `closeDb()` against `SHUTDOWN_DEADLINE_MS` and `process.exit()`s either way — `context-server.ts:1491`,`:1528`,`:1543`.

**Why it recurs after an FTS rebuild + clean restart:** the rebuild repairs the *shadow*, but the *lifecycle that corrupts it* (kill / unclean exit without clean close) is unchanged — so the shadow re-diverges on the next unclean exit.

**Why row-count parity didn't catch it:** packet 032's own repair record chose the FTS-shadow-rebuild branch *after* ruling out duplicate source IDs — `032/implementation-summary.md:50`,`:79`. `memory_index = memory_fts` parity is necessary, not sufficient.

**Boot probe is detect-only:** when the marker exists, the boot path runs `memory_fts` `integrity-check` and **logs a warning but performs no rebuild/swap** — `context-server.ts:360`,`:363`,`:373`,`:380`. So nothing self-heals between an unclean exit and the next failed write. The only repair is the confirmation-gated `memory_health` `autoRepair` rebuild — `memory-crud-health.ts:623`,`:639`,`:654`,`:662`.

---

## 4. SQ3 — Graph-metadata churn  ·  RE-VERIFIED AT HEAD (P1)

**The committed fix holds and is independent of the daemon lifecycle.**

- Schema declares `last_active_child_id` / `last_active_at`; derive + merge preserve them; no-op refresh skips the write when only volatile fields would change — `graph-metadata-schema.ts:57`–`:58`, `graph-metadata-parser.ts:1096`,`:1098`,`:1135`,`:1170`,`:1258`. Regression tests: `graph-metadata-refresh.vitest.ts:131`,`:148`.
- The canonical save workflow refreshes **only `validatedSpecFolderPath`** before semantic indexing — `workflow.ts:1679`–`:1705`. The tree-wide walk is now confined to the **explicit backfill tool with its default root** — `backfill-graph-metadata.ts:7`–`:8`,`:70`–`:72`,`:193`–`:194`.
- → SQ3 does **not** share the daemon-swap lifecycle; it is a direct metadata write path. No action needed beyond keeping the regression tests.

---

## 5. SQ4 — Common cause  ·  CONFIRMED (conditional) (P0)

**SQ1 and SQ2 trace to one mechanism; SQ3 does not.**

The path (all code-confirmed):
1. An incumbent daemon's IPC deep-probe fails — `probeDaemon(deepProbe:true)` requires an `initialize` reply; timeout/error/closed-before-reply → `action: respawn` — `launcher-ipc-bridge.cjs:126`,`:164`,`:191`,`:202`,`:343`,`:344`,`:346`.
2. The second launcher serializes on respawn locks (which guard against *duplicate respawners*, **not** DB closure), reaps the recorded `childPid`, writes a new lease, launches a replacement — `mk-spec-memory-launcher.cjs:321`,`:322`,`:329`,`:336`,`:343`,`:345`–`:347`.
3. The reap is `reapLeaseChildBeforeRespawn()`: `SIGTERM`, wait `RESPAWN_REAP_GRACE_MS`, escalate to `SIGKILL` — `mk-spec-memory-launcher.cjs:283`,`:292`–`:301`; grace constant `model-server-supervision.cjs:19`.
4. **There is no clean-close barrier** between the kill and the relaunch — the respawn path never inspects `.unclean-shutdown`, WAL state, or `close_db()` success — `vector-index-store.ts:1368` (the only marker-removal site) vs `mk-spec-memory-launcher.cjs:343`–`:347` (proceeds directly to replacement launch).

A single wedged/dead-probed incumbent therefore produces **both** symptoms: the client sees `Connection closed` (→ SQ1's diagnostic row) **and** the DB never closed cleanly (→ SQ2's divergent shadow on next write).

**Bounded correctly (negative knowledge):** a *healthy* live lease holder is bridged and left alone — strict single-writer checks `isLeaseHeld()` → `bridgeOrReportLeaseHeld()` → return before `launchServer()` — `mk-spec-memory-launcher.cjs:878`–`:883`. The defect is "respawn over an *unresponsive* incumbent," not "any concurrency."

**031/009 did not close this:** its own summary states the coverage was deterministic, not live, and the real-process `mk-spec-memory` lease suite is **skipped** — `031/009/implementation-summary.md:55`,`:111`; `launcher-lease.vitest.ts:173`–`:174`.

---

## 6. Residual (the one thing static analysis can't close)

SQ2 is closed at the **mechanism** level but open at the **historical-event** level: there is no captured timestamped launcher log tying the observed TSV `Connection closed` to a specific `dead-socket` respawn and the subsequent `.unclean-shutdown` re-appearance — `iteration-003.md:28`, confidence 0.70. More static-analysis iterations cannot produce that log; it requires either (a) reproducing the swap under instrumentation, or (b) enabling launcher event logging and waiting for the next live recurrence. This is a forensics gap, **not** a root-cause gap, and is why the loop converged at iteration 3 rather than burning iterations 4–10.

---

## 7. Recommended fixes (research-only — not applied)

| # | Target | Fix | Leverage |
|---|---|---|---|
| **F1** | SQ2/SQ4 production fix | **Boot self-heal:** when `.unclean-shutdown` is present AND the `memory_fts` `integrity-check` fails, auto-rebuild the FTS shadow at boot (promote the existing `memory_health` rebuild into the gated boot path, which is currently detect-only at `context-server.ts:360`–`:380`). | High — makes the recurrence self-healing regardless of how the daemon died |
| **F2** | SQ4 production fix | **Clean-close barrier on reap:** before `SIGKILL` in `reapLeaseChildBeforeRespawn`, give the incumbent a real chance to remove `.unclean-shutdown` via `close_db()` (wait for marker removal, not just process exit). | Medium — reduces corruption *frequency* |
| **F3** | SQ1 test fix | In `substrate-runner-harness.vitest.ts`: filter `runner:*` diagnostic rows before the length assertion and assert only on scenario rows; add `skipIf` for Code-Graph scenarios when no Code Graph client is started (or start the Code Graph daemon to match the README). | Restores a meaningful, deterministic test |
| **F4** | Systemic | **Worktree-per-session isolation (packet 035):** per-session isolated DBs remove the concurrent-launcher contention that triggers F1/F2 in the first place. | Highest durable — removes the trigger, not just the symptom |

Priority: **F1 first** (cheapest, self-healing, directly stops the user-visible recurrence), then **F3** (restore the test), then **F4** (durable systemic), with **F2** as defense-in-depth.

---

## 8. Convergence record

| Iter | Focus | newInfoRatio | Answered | Open |
|---|---|---|---|---|
| 001 | SQ1 | 0.78 | SQ1 | SQ2, SQ3, SQ4 |
| 002 | SQ2 + SQ4 link | 0.66 | — (narrowed SQ2/SQ4) | SQ2, SQ3, SQ4 |
| 003 | SQ4 confirm + SQ3 recheck | 0.72 | SQ3, SQ4 | SQ2 (historical-event only) |

Stopped per charter stop-condition #1 (all P0 answered with evidence; min-3 iterations satisfied). newInfoRatio did **not** decay to ≤0.05 — convergence is by *substantive completion*, not exhaustion: every sub-question has a code-confirmed root cause, and the only remainder (§6) is unreachable by more code reading.

**Note on artifact layout:** iteration files were written flat at `research/iteration-00N.md` rather than the YAML-canonical `research/iterations/`; the `iterations/` and `deltas/` dirs are empty. Cosmetic — does not affect findings; reconcile at next packet touch if desired.
