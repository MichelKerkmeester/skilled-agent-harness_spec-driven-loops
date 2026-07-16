---
title: "Deep-Review Report: Background-enrichment concurrency-cap fix (010)"
description: "Ten-iteration deep-review (opus-4.8 + gpt-5.5 xhigh) of the enrichment scheduler cap fix. Verdict: CONDITIONAL — the committed cap fix is correct, but the extended review surfaced 3 P1 (1 fix-exposed liveness, 2 pre-existing shutdown-durability) + 4 P2 in the surrounding scheduler/scan lifecycle."
trigger_phrases:
  - "010 deep review report"
  - "enrichment cap review verdict"
  - "enrichment scheduler hardening findings"
importance_tier: "normal"
contextType: "review"
---
<!-- Deep-review synthesis — 9-section contract -->
# Deep-Review Report: Background-enrichment concurrency-cap fix (010)

## 1. Executive Summary

**Verdict: CONDITIONAL.** The committed 010 cap fix is *correct for the wedge it fixes* — the concurrency cap now holds (invariant `0 ≤ active ≤ MAX` proven 4 ways; atomic gate; no re-entrancy; dist mirrors source; no enrichment regression). But running the full 10 iterations (iters 1-3 converged on a **safety-only false PASS**) surfaced that making the cap *real* exposed, and the surrounding lifecycle already contained, real liveness + shutdown-durability gaps.

- **Counts:** P0 = 0 · **P1 = 2** (F-006 REFUTED on deeper trace — see registry) · P2 = 6 (deduplicated).
- **Reviewers:** iters 1-6 `claude-opus-4-8` (account2); iters 7-9 `gpt-5.5 xhigh fast` (cli-codex); iter 10 failed to produce output (codex multi-dispatch flakiness) — meta-synthesis done by the loop-manager.
- **Key escalation:** the safety proof (`0 ≤ active ≤ MAX`) does NOT imply liveness (slots returning to 0) or shutdown safety. Two independent models confirmed the shutdown-fence P1.
- **Attribution:** F-006 (hung-run) is *exposed by this fix* (cap-now-real). F-008/F-012 (shutdown fences) are *pre-existing* (scheduler + scan were always unfenced); this fix only changes their timing. None is a defect in the committed cap logic.

## 2. Planning Trigger

CONDITIONAL → **remediation warranted**, but it is lifecycle/durability hardening *around* the scheduler, not a correction of the committed cap. Recommended as a follow-up packet (natural home: the `007-mcp-daemon-reliability` track, which already owns shutdown-durability packets 008/009). The committed 010 stays — it correctly fixes the CPU wedge.

## 3. Active Finding Registry (deduplicated, with evidence)

| ID | Sev | Status | Location | Finding | Evidence |
|----|-----|--------|----------|---------|----------|
| F-006 | ~~P1~~ **REFUTED** | not reachable | `memory-save.ts` run / embed path | Claimed: a hung embed never releases its slot → cap deadlock. REFUTED by loop-manager trace: every provider bounds the embed request with an abort-on-timeout (`ollama.ts:164`, `openai.ts:125`, `voyage.ts:150`, `hf-local.ts:433`); the embed is the only network await in the run (entity/graph steps are sync better-sqlite3). The run always settles → `finally` releases the slot. iter4's "un-timed" cite (`embeddings.ts:739`) did not verify. | loop-manager direct trace into `shared/embeddings/providers/*` |
| F-008 | **P1** | **confirmed (2 models)** | `memory-save.ts` run / `context-server.ts:1646` | Queued enrichment runs after `closeDb()`; `requireDb()` REOPENS the closed DB → dirties WAL after the TRUNCATE checkpoint → violates README:262 close guarantee. Scheduler absent from `fatalShutdown` fence list | iter6 (opus) + iter8 (gpt-5.5); fatalShutdown comment 1626-1630; README:262 |
| F-012 | **P1** | confirmed | `context-server.ts:2256` (scan), `:1535` (yield) | `startupScan` is fire-and-forget, unfenced before `closeDb()`; the new poll-phase yield widens the SIGTERM→close→scan-resume→reopen window | iter8 (gpt-5.5); `void startupScan(...)` confirmed |
| F-007 | P2 | confirmed | `memory-save.ts:2921` | Queue unbounded in LENGTH (distinct from retention-duration); a continuous live-save flood grows it without bound → OOM | iter2/iter5; sibling `job-queue.ts:711-723` caps + evicts |
| F-009 | P2 | confirmed | `memory-save.ts:2920`, `memory-crud-health.ts` | Scheduler state (`active`/`queued`) + `post_insert_enrichment_status` not exposed in `memory_health` → F-006 deadlock is silent/undiagnosable | iter9 (gpt-5.5) |
| F-010 | P2 | confirmed | `memory-save.ts:2965` | Background failures are log-only, unaggregated (no counter/last-error/rate-limit/persisted-failed) | iter9 |
| F-011 | P2 | confirmed | `memory-save.ts:2929` | Backfill recovery path not discoverable from `memory_health` (no remediation hint) | iter9 |

Iters 1-3, 7 found the safety, type, and emitted-JS dimensions fully sound.

## 4. Remediation Workstreams

- **W-1 (P1, recommended now):** Shutdown fences for F-008 + F-012. Add the enrichment scheduler AND the startup scan to `fatalShutdown` *before* `closeDb()` — a `stopping` flag, clear `backgroundEnrichmentQueue`, prevent `start(next)`, bail `run` before `requireDb()`; track `startupScanPromise` + abort. Mirror the established `fileWatcher`/`ingestWorker` fence + `job-queue` `acquireWorkerDb` idiom. Markers recovered via `repairIncompleteMarkers`.
- ~~**W-2 (P1):** Hung-run timeout for F-006.~~ DROPPED — F-006 refuted (every embed provider already bounds the request with an abort-on-timeout; the run always settles and releases its slot).
- **W-3 (P2):** Cap `backgroundEnrichmentQueue` length (mirror `MAX_PENDING_INGEST_JOBS`), shed overflow to the pending-marker backfill.
- **W-4 (P2):** Observability — expose scheduler state + enrichment-status distribution in `memory_health`; aggregate/rate-limit failures; add a recovery hint.

## 5. Spec Seed

Follow-up packet: "Harden the background-enrichment scheduler: shutdown-fence the scheduler + startup scan, bound the run with a timeout, cap the queue, and expose health." Scope: `memory-save.ts`, `context-server.ts` (fatalShutdown + scan), `memory-crud-health.ts`. Natural track: `007-mcp-daemon-reliability` (shutdown-durability sibling to 008/009).

## 6. Plan Seed

Order by severity/safety: (1) W-1 shutdown fences first (durability, confirmed P1, 2-model) — add to the existing fence sequence; (2) W-2 hung-run timeout; (3) W-3 queue cap; (4) W-4 health. Each independently revertible; each needs a regression + (for fences) a shutdown-during-pending-enrichment test.

## 7. Traceability Status

The 010 acceptance criteria (REQ-001..005: cap holds, queue yields, no regression, scan yields, clean build) all remain ✅ — the cap fix is correct. The findings are NEW concerns in the scheduler/scan *lifecycle*, outside the original REQ set, hence a follow-up rather than a 010 re-open.

## 8. Deferred Items

If the user defers W-1/W-2: document that (a) a hung embedding can silently disable enrichment until daemon restart (recoverable via `memory_index_scan({force:true})`), and (b) a shutdown with pending enrichment can re-dirty the WAL → a possible needless boot rebuild (bounded by `wal_autocheckpoint=256` + boot integrity gate; no data loss — backfill recovers). W-3/W-4 are pure hardening.

## 9. Audit Appendix (convergence data)

| Iter | Model | P0 | P1 | P2 | Note |
|------|-------|----|----|----|------|
| 1-3 | opus-4.8 | 0 | 0 | 5 | Safety-converged (false PASS — safety only) |
| 4 | opus-4.8 | 0 | 1 | 0 | F-006 hung-run (liveness) |
| 5 | opus-4.8 | 0 | 0 | 1 | F-007 unbounded queue |
| 6 | opus-4.8 | 0 | 0(→1) | 1 | F-008 shutdown fence |
| 7 | gpt-5.5 | 0 | 0 | 0 | Type/emitted-JS sound |
| 8 | gpt-5.5 | 0 | 2 | 0 | F-008 confirmed→P1 + F-012 scan unfenced |
| 9 | gpt-5.5 | 0 | 0 | 3 | F-009/010/011 observability |
| 10 | gpt-5.5 | — | — | — | FAILED (no output; process died) |

- **Convergence:** iters 1-3 converged on safety; iters 4-9 broke that convergence with liveness + shutdown + observability findings → the loop did NOT reach a clean-PASS convergence; verdict CONDITIONAL.
- **Model diversity paid off:** opus found the liveness + first shutdown finding; gpt-5.5 confirmed the shutdown P1 independently and found the scan-unfence + observability cluster.
- **Loop-manager independent corroboration:** verified F-008 (`fatalShutdown` comment + `shuttingDown` flag), F-012 (`void startupScan`), README:262 close guarantee, and the no-timeout-at-checked-layers for F-006.
- Records: `review/iterations/iteration-00{1..9}.md`. Prompts: `review/prompts/`.
