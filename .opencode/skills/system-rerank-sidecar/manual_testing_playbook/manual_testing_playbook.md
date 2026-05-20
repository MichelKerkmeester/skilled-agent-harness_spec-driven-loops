---
title: "system-rerank-sidecar: Manual Testing Playbook"
description: "Operator-facing validation matrix for the system-rerank-sidecar HTTP cross-encoder skill. Covers endpoint contracts, model lifecycle, concurrency, score normalization, security posture, launcher integration, cross-skill rerank flow with mk-spec-memory and mcp-coco-index, concurrency and load, failure modes and recovery, security and environment, automated test cross-reference, and feature-catalog cross-reference."
trigger_phrases:
  - "system-rerank-sidecar playbook"
  - "rerank sidecar manual tests"
  - "qwen sidecar validation matrix"
importance_tier: "important"
contextType: "reference"
---

# system-rerank-sidecar: Manual Testing Playbook

This document is the operator-facing manual validation matrix for the `system-rerank-sidecar` skill. It defines deterministic scenarios with exact prompts and command sequences, expected signals, evidence-capture rules, and pass/fail criteria so any operator can execute the matrix and grade results consistently. Scenarios are inlined here — there are no per-feature subfolder files — because the sidecar's surface is small enough to fit in one document. Scenario IDs use the `RS-` prefix (Rerank Sidecar).

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. HTTP ENDPOINT CONTRACTS](#7--http-endpoint-contracts)
- [8. LAUNCHER INTEGRATION — SPEC-MEMORY](#8--launcher-integration--spec-memory)
- [9. LAUNCHER INTEGRATION — COCOINDEX](#9--launcher-integration--cocoindex)
- [10. CROSS-SKILL RERANK FLOW](#10--cross-skill-rerank-flow)
- [11. CONCURRENCY AND LOAD](#11--concurrency-and-load)
- [12. FAILURE MODES AND RECOVERY](#12--failure-modes-and-recovery)
- [13. SECURITY AND ENVIRONMENT](#13--security-and-environment)
- [14. AUTOMATED TEST CROSS-REFERENCE](#14--automated-test-cross-reference)
- [15. FEATURE CATALOG CROSS-REFERENCE INDEX](#15--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

The sidecar runs as a single FastAPI process bound to `127.0.0.1:8765`. Two MCP servers consume it:

- `mk-spec-memory` (opt-in via `SPECKIT_CROSS_ENCODER=true`)
- `mcp-coco-index` (default ON via `COCOINDEX_RERANK_VIA_SIDECAR=true` since arc 008 phase 006)

This playbook validates that:

- The HTTP contract (`/health`, `/warmup`, `/rerank`) behaves as specified.
- Lifecycle transitions (cold load, warmth, clean shutdown) are observable and correct.
- Concurrency serialization holds under parallel load.
- Both consumers route through the shared sidecar and fall back cleanly when it is unreachable.
- Security posture (loopback bind, pinned model revision) is intact.

### Realistic Test Model

Scenarios mimic operator behavior: start the sidecar, probe it, drive load from real MCP consumers, and observe the outcomes. Where a sub-agent or alternate runtime helps coordinate parallel work, the scenario calls it out.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Sidecar venv installed via `bash .opencode/skills/system-rerank-sidecar/scripts/install.sh`.
3. `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots/e61197ed45024b0ed8a2d74b80b4d909f1255473/` is present (no network calls during model load).
4. Port `8765` is free, OR `RERANK_SIDECAR_PORT` is overridden to a free port.
5. Both consumer skills are installed: `mk-spec-memory` (Node) and `mcp-coco-index` (Python venv at `.opencode/skills/mcp-coco-index/mcp_server/.venv`).
6. Destructive scenarios (sidecar kill, port collision) MUST be run last so subsequent scenarios start from a known-clean state.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

For every scenario, capture:

- The command(s) run, verbatim.
- Sidecar PID (`pgrep -f rerank_sidecar`).
- `/health` JSON snapshot before and after the operation.
- `/rerank` response body when applicable (full JSON, not truncated).
- Latency observations (`latency_ms` field or wall-clock).
- Any fallback markers in consumer-side diagnostics.
- Scenario verdict with rationale.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Sidecar control: `bash .opencode/skills/system-rerank-sidecar/scripts/start.sh` (foreground), `pkill -TERM -f rerank_sidecar` (stop).
- HTTP probes: `curl -sf [-X METHOD] http://127.0.0.1:8765/<path>`.
- Spec-memory consumer: `node` snippet calling `cross-encoder.ts` via test fixture, or `mk-spec-memory-launcher.cjs`.
- Cocoindex consumer: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc search "<query>" --limit N`.
- Sequential steps separated by `->`.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This document.
2. Per-scenario execution evidence packaged together (one folder per run).
3. Triage notes for any non-PASS outcome.

### Scenario Verdicts

- **PASS**: every expected signal observed; evidence complete.
- **PARTIAL**: core behavior works but at least one expected signal is missing or evidence is incomplete.
- **FAIL**: expected behavior absent, contradictory output, or critical preconditions broken.

### Release Readiness

The sidecar is release-ready when:

1. No category scenario FAILs.
2. All §7 endpoint scenarios PASS (`/health`, `/warmup`, `/rerank` happy paths).
3. §10 cross-skill scenarios PASS for both consumers.
4. §12 failure-mode scenarios show the documented fallback path firing without operator intervention.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

The matrix is small enough that a single operator can run all scenarios sequentially in under 30 minutes. When a parallel sub-agent helps:

- Wave 1 — §7 endpoint contracts (sequential, single operator).
- Wave 2 — §8 + §9 launcher integration (parallel safe across the two consumer skills if you run them in separate shells).
- Wave 3 — §10 cross-skill flow (sequential because both consumers share the sidecar).
- Wave 4 — §11 concurrency + §12 failure modes (sequential; destructive scenarios MUST run after the rest).
- Wave 5 — §13 security audit (read-only, parallel safe).

Save evidence after each wave before proceeding.

---

## 7. HTTP ENDPOINT CONTRACTS

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-001 | `/health` cold | Health responds before model load | n/a | `bash scripts/start.sh &` -> wait 3s -> `curl -sf http://127.0.0.1:8765/health` | HTTP 200; `model_loaded:false`; `uptime_s` < 5; `queue_depth:0` | curl response JSON | PASS if `status:ok` AND `model_loaded:false` | check sidecar PID running; check port not bound by other process |
| RS-002 | `/warmup` first call | Cold warmup loads Qwen and transitions `model_loaded` | n/a | `curl -sf -X POST http://127.0.0.1:8765/warmup` -> `curl -sf http://127.0.0.1:8765/health` | warmup returns `status:warmed`; subsequent `/health` shows `model_loaded:true` | warmup response JSON + post-warmup `/health` JSON | PASS if warmup completes in < 30s AND `model_loaded:true` after | inspect uvicorn log at `/tmp/rerank-sidecar.log`; confirm Qwen snapshot path |
| RS-003 | `/rerank` happy path | Two-document rerank returns sigmoid-normalized ordering | curl body: `{"query":"apple","documents":["apple","quantum chromodynamics"],"top_k":2}` | `curl -sf -X POST http://127.0.0.1:8765/rerank -H "Content-Type: application/json" -d '{"query":"apple","documents":["apple","quantum chromodynamics"],"top_k":2}'` | HTTP 200; `results[0].index==0`; `results[0].relevance_score > results[1].relevance_score`; both scores in `[0,1]` | response JSON | PASS if ordering correct AND scores bounded `[0,1]` | re-confirm sigmoid at `rerank_sidecar.py:124`; check pinned revision matches `.env.example` |
| RS-004 | `/rerank` index-preservation | Rerank does not lose the original document index | curl body: `{"query":"banana","documents":["dog","banana","airplane"],"top_k":3}` | `curl -sf -X POST http://127.0.0.1:8765/rerank -H "Content-Type: application/json" -d '{"query":"banana","documents":["dog","banana","airplane"],"top_k":3}'` | HTTP 200; result with `index:1` has the highest `relevance_score` | response JSON | PASS if `index:1` is top result | inspect raw logits before sigmoid; ensure index field is the original position |
| RS-005 | `/rerank` empty documents | Empty-input request is rejected without crashing | curl body: `{"query":"foo","documents":[],"top_k":0}` | `curl -sf -X POST http://127.0.0.1:8765/rerank -H "Content-Type: application/json" -d '{"query":"foo","documents":[],"top_k":0}'` | HTTP 4xx OR HTTP 200 with empty `results` | response JSON + uvicorn log | PASS if no 5xx AND sidecar still serves `/health` after | check FastAPI validation rules; confirm uvicorn worker did not crash |

---

## 8. LAUNCHER INTEGRATION — SPEC-MEMORY

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-006 | spec-memory ensure (sidecar absent) | mk-spec-memory launcher spawns sidecar when absent | n/a | `pkill -f rerank_sidecar` -> launch mk-spec-memory MCP via the configured runtime -> `pgrep -f rerank_sidecar` -> `curl -sf http://127.0.0.1:8765/health` | sidecar PID appears within 10s; `/health` returns `status:ok` | `pgrep` output + `/health` JSON | PASS if launcher spawned exactly one sidecar process | inspect `bin/lib/ensure-rerank-sidecar.cjs` in mk-spec-memory; verify port-bind atomicity |
| RS-007 | spec-memory ensure (sidecar present) | Existing sidecar is attached, not duplicated | n/a | (assumes sidecar already running) -> launch mk-spec-memory MCP -> `pgrep -f rerank_sidecar \| wc -l` | exactly one sidecar PID | `pgrep` count | PASS if PID count is 1 | check ensure helper's `/health` probe path; verify EADDRINUSE handling |
| RS-008 | spec-memory rerank routing | `SPECKIT_CROSS_ENCODER=true` routes `memory_search` Stage 3 through the sidecar | mcp_search query with reranker enabled | call `memory_search({ query: "<seed term>", limit: 10 })` via spec-memory MCP with `SPECKIT_CROSS_ENCODER=true` | results include `scoringMethod` reflecting reranker; sidecar log (if `RERANK_LOG_PATH` set) records one request | MCP response + sidecar log line | PASS if Stage 3 reranker fires on sidecar (verify via log or sidecar `queue_depth` spike during call) | confirm `cross-encoder.ts` provider routing; check env var visibility to spec-memory child |

---

## 9. LAUNCHER INTEGRATION — COCOINDEX

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-009 | cocoindex ensure (sidecar absent) | mcp-coco-index MCP launch auto-ensures the sidecar | n/a | `pkill -f rerank_sidecar` -> launch mcp-coco-index MCP -> `pgrep -f rerank_sidecar` -> `curl -sf http://127.0.0.1:8765/health` | sidecar PID appears within 10s; `/health` returns `status:ok` | `pgrep` output + `/health` JSON | PASS if launcher spawned exactly one sidecar process via `_ensure_rerank_sidecar_for_mcp` | inspect `cocoindex_code/cli.py:139-158`; verify Python `ensure_rerank_sidecar.py` path resolution |
| RS-010 | cocoindex rerank routing | `COCOINDEX_RERANK_VIA_SIDECAR=true` (default) routes `ccc search` Stage 2 through sidecar | natural-language query expected to hit reranker, e.g. "registry of available embedding backends" | `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc search "registry of available embedding backends" --limit 5` | results returned; sidecar `/health.queue_depth` spike OR JSONL request log shows entry | command output + sidecar log/queue evidence | PASS if request observed at sidecar AND `HttpSidecarRerankerAdapter` dispatch confirmed via `RetrievalDiagnostics` | confirm `get_reranker_adapter()` returns `HttpSidecarRerankerAdapter`; check env var is `true` in ccc subprocess |
| RS-011 | cocoindex opt-out | Setting `COCOINDEX_RERANK_VIA_SIDECAR=false` bypasses sidecar | same query | `COCOINDEX_RERANK_VIA_SIDECAR=false .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc search "registry of available embedding backends" --limit 5` | results returned; sidecar receives no request from this call (queue stays 0) | command output + sidecar JSONL log diff | PASS if no log line is appended for this call | verify env var propagation to cocoindex's reranker dispatch; rerun with `RERANK_LOG_PATH` set |

---

## 10. CROSS-SKILL RERANK FLOW

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-012 | Both consumers share one sidecar | mk-spec-memory + mcp-coco-index running together use the SAME sidecar process | n/a | start both MCPs in the same session -> `pgrep -f rerank_sidecar \| wc -l` -> issue one `memory_search` and one `ccc search` -> compare sidecar PID before/after | exactly one sidecar PID; both `memory_search` and `ccc search` request logs (if enabled) hit the same PID | `pgrep` count + sidecar PID + request logs | PASS if PID stays 1 AND both consumers' calls reach it | verify both ensure helpers probe before spawn; check no race-bind under parallel launch |
| RS-013 | Independent consumer fallback (sidecar down) | When the sidecar is killed mid-session, both consumers fall back without crashing | n/a | start both MCPs with healthy sidecar -> run smoke queries -> `pkill -KILL -f rerank_sidecar` -> immediately rerun smoke queries | spec-memory falls back to positional scoring (`scoringMethod: 'fallback'`); cocoindex falls back to bundled adapter (`reranker_fallback_reason: 'sidecar_unavailable'`) | spec-memory diagnostics + cocoindex `RetrievalDiagnostics` | PASS if both queries return results AND neither MCP crashed | inspect fallback paths in `cross-encoder.ts` and `HttpSidecarRerankerAdapter`; confirm timeout config |

---

## 11. CONCURRENCY AND LOAD

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-014 | Parallel `/rerank` serialization | Two concurrent `/rerank` calls are serialized via asyncio.Lock; `queue_depth` momentarily >= 1 | curl bodies: same two-doc payloads | issue two `curl -X POST /rerank` in parallel (e.g. `& wait`) while a background loop polls `/health.queue_depth` every 200 ms | one curl observes `queue_depth >= 1` at some point; both return HTTP 200 with valid ordering | curl outputs + queue-depth poll log | PASS if both succeed AND queue_depth >= 1 observed at least once | check `asyncio.Lock` wrap in `rerank_sidecar.py`; confirm uvicorn `--workers 1` |
| RS-015 | SIGTERM during in-flight | SIGTERM during a `/rerank` call terminates cleanly without orphaning | n/a | start long-running `/rerank` call -> `pkill -TERM -f rerank_sidecar` -> observe exit | uvicorn logs `shutdown` event; no orphan Python process; port `8765` released within 5 s | uvicorn log + `lsof -iTCP:8765` after | PASS if port releases cleanly | inspect FastAPI lifespan shutdown; check whether in-flight task is awaited or cancelled |
| RS-016 | Race-bind under parallel cold start | Two launchers calling ensure_rerank_sidecar in parallel result in ONE sidecar (not two) | n/a | `pkill -f rerank_sidecar` -> kick off `mk-spec-memory-launcher` and `mcp-coco-index` MCP launch within < 100 ms of each other -> `pgrep -f rerank_sidecar \| wc -l` | exactly one sidecar PID | `pgrep` count + ensure-helper logs from both consumers | PASS if PID count is 1 | review port-bind EADDRINUSE handling in both ensure helpers; check whether the second spawn attempt aborted cleanly |

---

## 12. FAILURE MODES AND RECOVERY

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-017 | Cache miss | Model cache snapshot missing causes loud, recoverable failure | n/a | move HF snapshot dir aside -> `curl -sf -X POST /warmup` | warmup returns 5xx OR sidecar logs `local_files_only` failure; sidecar process stays alive on next `/health` | uvicorn log + `/health` response | PASS if failure is loud (HTTP 5xx with detail) AND sidecar stays responsive on `/health` | restore snapshot path; verify `local_files_only=True` is honored |
| RS-018 | Port collision | EADDRINUSE on `8765` produces actionable error | n/a | bind port `8765` with `nc -l 8765` -> attempt `bash scripts/start.sh` | start.sh exits non-zero with clear error message mentioning EADDRINUSE or port already in use | start.sh stderr | PASS if error is human-readable AND exit code != 0 | document the `RERANK_SIDECAR_PORT=<other>` override path |
| RS-019 | Sidecar timeout | Long `/rerank` call exceeds consumer-side timeout, fallback fires | unusually long document list (e.g., 100 docs of 8 KB each) | issue `/rerank` via cocoindex consumer with `COCOINDEX_RERANK_VIA_SIDECAR=true` and a forced short timeout (set adapter `timeout_s` to 1 s) | `RetrievalDiagnostics.reranker_fallback_reason == 'sidecar_unavailable'`; bundled adapter took over | cocoindex diagnostics | PASS if fallback fires AND search still returns results | verify the timeout knob path through `HttpSidecarRerankerAdapter`; confirm bundled adapter loaded only after fallback |
| RS-020 | Sidecar crash mid-session | Sidecar process death between consumer calls is detected | n/a | run a baseline `ccc search` -> `pkill -KILL -f rerank_sidecar` -> rerun the SAME `ccc search` without restarting cocoindex | second call falls back to bundled adapter, no MCP crash | cocoindex diagnostics + sidecar absence confirmed via `pgrep` | PASS if second call returns results via bundled path | confirm cocoindex's `HttpSidecarRerankerAdapter` retries via fresh `httpx.Client` instance and falls back on connection refused |

---

## 13. SECURITY AND ENVIRONMENT

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RS-021 | Loopback bind verification | Sidecar only listens on `127.0.0.1`, not external interfaces | n/a | `lsof -iTCP:8765 -sTCP:LISTEN` after sidecar start | LISTEN entry shows `127.0.0.1:8765` (or `localhost:8765`), NOT `0.0.0.0:8765` or `*:8765` | `lsof` output | PASS if only loopback is bound | verify `uvicorn --host 127.0.0.1` in `start.sh`; reject any future PR that adds `--host 0.0.0.0` |
| RS-022 | Pinned revision held | Loaded model snapshot matches `.env.example` pinned revision | n/a | inspect `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots/<sha>/` -> compare sha to `.env.example::RERANK_MODEL_REVISION` | shas match | snapshot dir listing + `.env.example` value | PASS if snapshot sha == pinned revision | re-pin via `.env.example` if upstream model has moved; never silently follow `main` |
| RS-023 | Env-var leak audit | Parent shell secrets are inherited by sidecar (open advisory) | n/a | export `FAKE_SECRET=token` -> `bash scripts/start.sh` -> inspect sidecar `/proc/<pid>/environ` (Linux) or `ps -E -p <pid>` (macOS) | `FAKE_SECRET` is visible in sidecar env | environ dump | DOCUMENTED ADVISORY — operator notes the leak surface and plans the RERANK_* allowlist follow-on. PASS = scenario executed and behavior recorded. FAIL = sidecar fails to start | reference the open advisory in arc 008 phase 005 review iter-002 |

---

## 14. AUTOMATED TEST CROSS-REFERENCE

| Scenario | Automated test cousin |
|---|---|
| RS-001..RS-005 | `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` (4 P0 cases) |
| RS-006, RS-007 | `bin/lib/ensure-rerank-sidecar.vitest.ts` (in `mk-spec-memory`) |
| RS-009 | cocoindex `cli.py::_ensure_rerank_sidecar_for_mcp` is exercised by the cocoindex MCP startup; no dedicated unit test today |
| RS-010, RS-011 | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` (9 cases) + `tests/test_reranker.py` dispatch tests |
| RS-013, RS-019, RS-020 | `tests/test_http_sidecar_adapter.py::test_connection_error_falls_back_to_bundled` and siblings |
| RS-014 | no direct automated cousin (concurrency is observable only via live HTTP) |
| RS-021 | enforced by `scripts/start.sh` (`--host 127.0.0.1`) |

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

| Catalog Section | Scenarios |
|---|---|
| §2 HTTP ENDPOINT CONTRACTS | RS-001, RS-002, RS-003, RS-004, RS-005 |
| §3 MODEL LIFECYCLE | RS-002, RS-015, RS-017, RS-022 |
| §4 CONCURRENCY AND LOCKING | RS-014, RS-015, RS-016 |
| §5 SCORE NORMALIZATION | RS-003, RS-004 |
| §6 SECURITY POSTURE | RS-021, RS-022, RS-023 |
| §7 LAUNCHER INTEGRATION | RS-006, RS-007, RS-009, RS-016 |
| §8 CONFIGURATION AND ENV VARS | RS-008, RS-010, RS-011 |
| §9 OBSERVABILITY | RS-001, RS-014, RS-019, RS-020 |
| §10 CROSS-SKILL CONSUMERS | RS-012, RS-013 |
