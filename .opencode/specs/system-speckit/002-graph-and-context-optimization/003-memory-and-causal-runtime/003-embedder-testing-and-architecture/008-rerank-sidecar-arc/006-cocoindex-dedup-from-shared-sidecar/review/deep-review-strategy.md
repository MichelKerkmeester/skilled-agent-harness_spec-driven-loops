---
title: Deep Review Strategy — packet 006 cocoindex dedup PROMOTE
description: 20-iteration deep review of cocoindex HTTP sidecar dispatch + system-rerank-sidecar feature catalog/playbook docs.
---

# Deep Review Strategy — Session Tracking

## 1. OVERVIEW

20-iteration autonomous deep review of packet `008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar` PROMOTE shipment plus the cross-skill docs in `system-rerank-sidecar` (feature catalog + manual testing playbook) added in the same session.

## 2. TOPIC

PROMOTE shipment (commit `c0941055f`):
- New `HttpSidecarRerankerAdapter` class in `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`
- Dispatch update in `get_reranker_adapter()`
- New `COCOINDEX_RERANK_VIA_SIDECAR` env var in `cocoindex_code/config/config.py`
- 9 new unit tests at `tests/test_http_sidecar_adapter.py`
- A/B benchmark + report at `benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/`
- Spec packet 006 docs (spec/plan/tasks/implementation-summary)
- Arc 008 parent re-opened and re-closed

Docs shipment (commit `131838c96`):
- `system-rerank-sidecar/feature_catalog/feature_catalog.md` (11 sections)
- `system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` (15 sections, 23 RS-NNN scenarios)

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Adapter logic, fallback chain, sigmoid score passthrough, env-var parsing, dispatch routing, test correctness
- [x] D2 Security — HTTP localhost trust, port/url surface, payload validation, error/log info leakage, sidecar dependency posture
- [x] D3 Traceability — Spec/code alignment, checklist evidence, REQ-NNN mapping, feature catalog vs code, playbook vs capability
- [x] D4 Maintainability — Patterns, dependency posture (httpx lazy import), documentation quality, fallback complexity, follow-up clarity
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Re-running the A/B benchmark
- Investigating the 30/73 → 15/73 baseline drift (deferred to packet 007)
- Modifying any production source or test files (review is READ-ONLY)
- Modifying the reviewed spec docs (review-only writes go into `review/`)

## 5. STOP CONDITIONS

- All 4 dimensions reviewed with weighted_stop_score >= 0.60 and findings density <= 0.10
- OR 20 iterations reached
- OR three consecutive error/no-progress iterations (stuck recovery)

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 2 | Found two P1 blockers to the PROMOTE/default claim: dispatch ignores `Config.rerank_via_sidecar` default true, and CocoIndex MCP ensure still skips spawn unless `SPECKIT_CROSS_ENCODER=true`. Fallback chain, score passthrough, tests, and A/B runner logic otherwise passed the correctness read. |
| Security | CONDITIONAL | 3 | Found two P1 same-host security risks: the localhost sidecar identity/auth boundary is missing, and unauthenticated `/rerank` accepts unbounded payloads before model inference. Added one P2 advisory for full parent-env inheritance by the spawned sidecar. Loopback bind, diagnostics buckets, test mock transport, and benchmark fixture handling otherwise passed. |
| Traceability | CONDITIONAL | 4 | Ran all six cross-reference protocols. `spec_code`, `checklist_evidence`, `skill_agent`, `feature_catalog_code`, and `playbook_capability` fail due active P1/P2 drift; `agent_cross_runtime` is not applicable. Added two P2 traceability findings for unchecked packet tasks and stale `system-rerank-sidecar` SKILL consumer text. |
| Maintainability | CONDITIONAL | 5 | Adapter/fallback/test structure is readable and remediation-friendly. Added two P2 advisories: `httpx` is used by mcp-coco-index runtime/tests without a direct package dependency, and the sidecar catalog/playbook diverge from sk-doc's split evergreen package contract. |
| Adversarial recheck | CONDITIONAL | 6 | Stabilization pass found no new P0/P1 and no new high-confidence P2. DR-002-P1-001 and DR-002-P1-002 remain active P1s. DR-003-P1-001 and DR-003-P1-002 were downgraded to P2 under the solo-Mac single-user deployment note. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 8 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2; reclassified DR-003-P1-001 and DR-003-P1-002 from P1 to P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- The HTTP adapter fallback chain is structurally sound for the five requested failure modes: request exceptions, 5xx, 4xx, malformed JSON, and missing-index payloads all route through `_fallback_to_bundled()` with explicit diagnostic buckets.
- Sigmoid scores are not normalized or inverse-transformed on the default path; they are parsed as floats and assigned to `QueryResult.reranker_score`.
- `run_ab.py` explicitly flips `COCOINDEX_RERANK_VIA_SIDECAR` per arm and did not show a correctness bug that would distort the A/B verdict.
- Security pass confirmed the sidecar binds loopback only (`127.0.0.1`), fallback diagnostics store enum-style buckets rather than query/content, `httpx.MockTransport` tests avoid real network calls, and the benchmark fixture path is read-only/operator-local rather than shell-interpolated.
- Adversarial recheck confirmed the two correctness P1s with direct runtime evidence and found no missed P0/P1 across adapter parsing, launcher/config logging, requirement coverage, or benchmark methodology.
- Solo-Mac threat-model calibration applies cleanly: the localhost identity/auth and unbounded direct `/rerank` concerns remain real code observations, but they are P2 hardening advisories for the supported single-user Mac deployment.

## 9. WHAT FAILED

- PROMOTE default-on behavior is not actually default-on at dispatch: `Config.from_env()` has the default, but `get_reranker_adapter()` reads raw env and defaults off.
- CocoIndex MCP auto-ensure is blocked by the spec-memory-only `SPECKIT_CROSS_ENCODER=true` gate, so the sidecar is not spawned for a cold CocoIndex MCP launch under the documented default.
- Localhost sidecar identity is unauthenticated: consumers trust any process answering `127.0.0.1:<RERANK_SIDECAR_PORT>`. Under solo-Mac deployment this is downgraded to a P2 hardening advisory, not an active P1.
- `/rerank` lacks request-size/count/text bounds and forwards all accepted documents into model prediction. Under solo-Mac deployment this is downgraded to a P2 hardening advisory, not an active P1.
- The spawned sidecar inherits the full parent environment; docs already flag this, but the code still lacks a minimal env allowlist.
- mcp-coco-index imports `httpx` in the new HTTP adapter and test suite, but its own `pyproject.toml` does not declare `httpx` directly.
- The sidecar catalog/playbook are useful but monolithic and packet-history-heavy relative to sk-doc's split evergreen package contract.

## 10. EXHAUSTED APPROACHES

[None yet]

## 11. RULED OUT DIRECTIONS

- Treating `Config.rerank_via_sidecar` as the dispatch source of truth is ruled out for the current code: no runtime call path from `Config.from_env()` to `get_reranker_adapter()` was found in the reviewed code.
- Treating the launcher ensure as CocoIndex-default-on is ruled out for the current code: `cli.py` calls `ensure_rerank_sidecar()` without overriding `skip_if_disabled`, and the helper returns early unless `SPECKIT_CROSS_ENCODER=true`.
- Fallback-chain and score-passthrough concerns were reviewed and did not produce correctness findings under default settings.
- Treating loopback bind as complete authentication is ruled out: `start.sh` binds `127.0.0.1`, but neither the adapter nor ensure helper authenticates the listener or verifies process ownership before sending query/document payloads.
- Treating `top_k=10**9` as the main OOM path is ruled out: list slicing caps output to document count. The real payload risk is unbounded document count and per-document text size.
- Treating the localhost identity/auth and direct payload-bound gaps as P1 under the supported deployment is ruled out by the explicit solo-Mac single-user context. They remain P2 hardening advisories.
- Treating the A/B benchmark as invalid because runtime default dispatch is broken is ruled out: `run_ab.py` sets `COCOINDEX_RERANK_VIA_SIDECAR` explicitly for each arm, so the benchmark still tests bundled vs HTTP path equivalence.
- Treating invalid `RERANK_SIDECAR_PORT` parsing as a release-blocking missed finding is ruled out for this iteration: it is an operator-local malformed env override, not a documented PROMOTE/default contract.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis: all four dimensions plus adversarial recheck are covered. Generate the review report with verdict CONDITIONAL, required fixes for DR-002-P1-001 and DR-002-P1-002, and eight P2 advisories.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

Prior context: spec-memory hit 1080→246 MB after sidecar arc; nomic + jina-v3 production defaults at 14/18 fixture; arc 006 launcher concurrency complete; arc 008 (this packet) re-opened to close dedup intent.

Per implementation-summary.md, packet 006 ships PROMOTE: default `COCOINDEX_RERANK_VIA_SIDECAR=true`; A/B confirmed hit-rate parity (15/73 vs 15/73) and p95 Δ = +18 ms (well under +500 ms gate); 9 new tests + 231 total tests passing; fallback chain preserves the bundled adapter as resilience.

Iteration 1 inventory: all 13 configured review-scope files were read. Highest-risk runtime files are `reranker.py`, `config.py`, and `test_http_sidecar_adapter.py`; supporting launcher context is `mcp-coco-index/mcp_server/cocoindex_code/cli.py:139-158` plus `system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:80-128`. Pending verification anchors for correctness: raw-env sidecar dispatch may ignore `Config.rerank_via_sidecar` default true; cocoindex MCP ensure may skip sidecar spawn unless `SPECKIT_CROSS_ENCODER=true`. Pending traceability anchor: `system-rerank-sidecar/SKILL.md` still describes CocoIndex sidecar repointing as future work while the catalog/playbook say default consumer.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 6 | REQ-001/002/003/004/005/007/008/009 passed or pass-with-caveat. REQ-006 remains partial due removal wording vs D-004 fallback. REQ-010 fails because CocoIndex MCP calls the ensure helper with `skip_if_disabled=True` and still gates spawn on `SPECKIT_CROSS_ENCODER=true`. Adversarial recheck confirmed no new P0/P1. |
| `checklist_evidence` | core | fail | 4 | `tasks.md` T001-T025 remain unchecked with pending/stale evidence while `implementation-summary.md` claims SHIPPED/PROMOTE and records verification. New DR-004-P2-001. |
| `skill_agent` | overlay | fail | 4 | mcp-coco-index SKILL default-dispatch claim repeats DR-002-P1-001. system-rerank-sidecar SKILL still calls CocoIndex repointing future work while catalog/playbook describe CocoIndex as current default consumer. New DR-004-P2-002. |
| `agent_cross_runtime` | overlay | n/a | 4 | No new agents shipped. |
| `feature_catalog_code` | overlay | fail | 6 | Endpoint/lifecycle/score/observability sections map to code, but catalog default/launcher claims inherit DR-002-P1-001/002 and security posture omits the now-P2 DR-003-P1-001/002 caveats. Maintainability pass also found sk-doc package/evergreen drift in DR-005-P2-002. |
| `playbook_capability` | overlay | fail | 6 | RS-009/RS-010 rely on failing CocoIndex auto-ensure/default-dispatch contracts; RS-021..RS-023 cover loopback/revision/env but not forged-sidecar or oversize-payload rejection scenarios, now P2 advisories under solo-Mac context. Maintainability pass also found the monolithic playbook shape diverges from sk-doc's split package contract in DR-005-P2-002. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| spec.md (packet 006) | inventory, correctness, security, traceability, adversarial_recheck | 6 | DR-002-P2-001, DR-003-P1-001 (downgraded P2), DR-003-P1-002 (downgraded P2) | failed requirement gate; security items advisory under solo-Mac |
| plan.md (packet 006) | inventory, maintainability | 5 | Repeat-only staleness tied to DR-002-P1-001 and DR-002-P2-001 | stale but not new |
| tasks.md (packet 006) | inventory, traceability | 4 | DR-004-P2-001 | failed evidence ledger |
| implementation-summary.md (packet 006) | inventory, correctness, security, traceability | 4 | DR-002-P1-001, DR-002-P1-002, DR-004-P2-001 | shipped claims mismatch task ledger/default/spawn |
| reranker.py | inventory, correctness, security, traceability, maintainability, adversarial_recheck | 6 | DR-002-P1-001, DR-002-P2-001, DR-003-P1-001 (downgraded P2), DR-005-P2-001 | high-risk failed |
| config.py | inventory, correctness, security, traceability | 4 | DR-002-P1-001 | high-risk failed |
| pyproject.toml (mcp-coco-index) | maintainability | 5 | DR-005-P2-001 | hidden dependency |
| test_http_sidecar_adapter.py | inventory, correctness, security, traceability, maintainability | 5 | DR-002-P1-001, DR-005-P2-001 | test codifies mismatch; imports hidden dependency |
| run_ab.py | inventory, correctness, security, traceability | 4 | – | passed correctness/security/traceability read |
| benchmark_report.md | inventory, correctness, traceability | 4 | – | decision evidence passed with caveats |
| INSTALL_GUIDE.md | inventory, correctness, traceability, maintainability | 5 | DR-002-P1-001, DR-002-P1-002 | failed claims |
| SKILL.md (mcp-coco-index) | inventory, correctness, traceability, maintainability | 5 | DR-002-P1-001 | failed default claim |
| SKILL.md (system-rerank-sidecar) | traceability | 4 | DR-004-P2-002 | stale consumer claim |
| feature_catalog.md | inventory, correctness, security, traceability, maintainability, adversarial_recheck | 6 | DR-002-P1-002, DR-003-P1-001 (downgraded P2), DR-003-P2-001, DR-004-P2-002, DR-005-P2-002 | failed/partial claims; package-shape advisory |
| manual_testing_playbook.md | inventory, correctness, security, traceability, maintainability, adversarial_recheck | 6 | DR-002-P1-002, DR-003-P1-001 (downgraded P2), DR-003-P2-001, DR-004-P2-002, DR-005-P2-002 | failed/partial claims; package-shape advisory |
| cli.py (supporting REQ-010 focus) | correctness, security, traceability, adversarial_recheck | 6 | DR-002-P1-002, DR-003-P1-001 (downgraded P2) | supporting failure evidence |
| ensure_rerank_sidecar.py (supporting REQ-010 focus) | correctness, security, traceability, adversarial_recheck | 6 | DR-002-P1-002, DR-003-P1-001 (downgraded P2), DR-003-P2-001 | supporting failure/advisory evidence |
| rerank_sidecar.py (supporting security focus) | security, traceability, adversarial_recheck | 6 | DR-003-P1-001 (downgraded P2), DR-003-P1-002 (downgraded P2) | advisory hardening under solo-Mac |
| start.sh (supporting security focus) | security, adversarial_recheck | 6 | DR-003-P1-001 (downgraded P2), DR-003-P2-001 | loopback passed; env sourcing advisory |
| test_rerank_sidecar.py (supporting security focus) | security, adversarial_recheck | 6 | DR-003-P1-002 (downgraded P2) | lacks advisory auth/oversize tests |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 20
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-05-20T20:30:00Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 25 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-codex, gpt-5.5, model_reasoning_effort=xhigh, service_tier=fast
- Started: 2026-05-20T20:30:00Z
<!-- MACHINE-OWNED: END -->
