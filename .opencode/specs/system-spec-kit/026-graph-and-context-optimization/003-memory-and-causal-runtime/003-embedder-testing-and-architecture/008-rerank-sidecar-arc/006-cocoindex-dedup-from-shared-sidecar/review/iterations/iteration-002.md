# Deep Review Iteration 002 — Correctness Pass

## Dimension Focus

Correctness pass over the runtime sidecar dispatch path, with special focus on PV-001 default dispatch, PV-002 launcher ensure, REQ-002 fallback behavior, REQ-003 score passthrough, the 9 new adapter tests, REQ-006 PROMOTE wording, and the A/B runner used for the decision.

## Files Reviewed

| File | Lines / Areas Reviewed | Result |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | `620-629`, `747-770`, `833-855` | Confirms `Config.rerank_via_sidecar` parses default `true`, but this value is not consumed by dispatch. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | `24-30`, `221-351`, `379-408` | Dispatch reads raw env and defaults off; HTTP adapter fallback and score mapping were reviewed. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | `86-247` | Tests meaningfully cover happy path, 5 fallback modes, short-circuit, and explicit-env dispatch; one test codifies the default-off bug. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | `139-158`, `1179-1185` | MCP entrypoint calls the sidecar ensure helper, but with the helper's spec-memory default gate. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | `80-128` | Helper exits before health probe/spawn when `SPECKIT_CROSS_ENCODER` is unset. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md` | `132-148`, `156-161` | REQ-001, REQ-002, REQ-003, REQ-006, and REQ-010 checked against code. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md` | `44-52`, `83-101`, `107-139` | PROMOTE/default claims and D-004 fallback decision checked. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | `20-30` | Default sidecar dispatch claim checked against runtime. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | `352-365` | Operator-facing default and auto-ensure claims checked. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | `190-201`, `265-278` | Cross-skill consumer and launcher claims checked. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | `38-43`, `155-161` | Manual scenario claims checked against ensure path. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py` | `57-62`, `69-144`, `147-180` | Arm env overrides, fixture handling, daemon restart, parsing, and p95 calculation reviewed. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/benchmark_report.md` | `76-89`, `124-156` | A/B claim context and caveats checked. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability/observability.py` | `37-58` | Confirms fallback reason field and recording method. |

## Findings by Severity (P0/P1/P2)

P0: none.

### P1-001 [P1] PROMOTE default does not reach runtime dispatch

- File: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24`
- Evidence: `Config.from_env()` parses `COCOINDEX_RERANK_VIA_SIDECAR` with default `True` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:770` and stores it in the dataclass at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:855`. Dispatch does not read that `Config` value; `get_reranker_adapter()` calls `_rerank_via_sidecar_enabled()` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:390`, and that helper only returns true when the raw env var is explicitly set to a truthy token at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24-30`. The new test `test_dispatch_off_by_default` codifies bundled dispatch when the env var is absent at `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:240-247`. This contradicts the PROMOTE/default claims in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:47-48`, `.opencode/skills/mcp-coco-index/SKILL.md:29`, and `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:361`.
- Finding class: cross-consumer
- Scope proof: Exact search for `rerank_via_sidecar` in the mcp-coco-index runtime found the config field and parse site, while dispatch uses `_rerank_via_sidecar_enabled()` raw env reads; no call path threads `Config.rerank_via_sidecar` into `get_reranker_adapter()`.
- Recommendation: Reconcile the source of truth. Either make `_rerank_via_sidecar_enabled()` default to true / consume `Config.rerank_via_sidecar`, or revert the PROMOTE/default documentation and config default. Update `test_dispatch_off_by_default` to assert the chosen contract.

Claim adjudication:

- claim: With `COCOINDEX_RERANK_VIA_SIDECAR` unset, shipped runtime dispatches to the bundled `CrossEncoderRerankerAdapter`, so the documented PROMOTE default-on behavior is false.
- evidenceRefs: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:770`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:855`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:390`, `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:240`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:47`
- counterevidenceSought: A caller that always exports `COCOINDEX_RERANK_VIA_SIDECAR=true` before every `get_reranker_adapter()` call, or a code path that passes `Config.rerank_via_sidecar` into dispatch before line 390.
- alternativeExplanation: The config default may have been intended as future-facing documentation while raw-env dispatch remained opt-in; that would make the PROMOTE docs/config default wrong rather than the adapter branch itself.
- finalSeverity: P1
- confidence: high
- downgradeTrigger: Downgrade to P2 if an upstream launcher or daemon bootstrap is shown to always materialize the env var from `Config.from_env()` before reranker dispatch in all supported runtime paths.

### P1-002 [P1] CocoIndex MCP auto-ensure is still gated by spec-memory's opt-in flag

- File: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90`
- Evidence: CocoIndex MCP startup calls `_ensure_rerank_sidecar_for_mcp()` before creating the MCP server at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:1179-1185`. That function imports and calls `ensure_rerank_sidecar()` without overriding `skip_if_disabled` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:151-155`. The helper default is `skip_if_disabled: bool = True` at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:85`, and it returns before health-probe/spawn when `SPECKIT_CROSS_ENCODER` is not exactly `true` at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90-96`. The docs claim CocoIndex MCP auto-ensures the sidecar at `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:198-201`, `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:159-160`, and `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:365`.
- Finding class: cross-consumer
- Scope proof: The supporting launcher files are explicitly part of the correctness focus for PV-002 and back REQ-010 in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:148`; the reviewed docs in scope make the auto-ensure claim.
- Recommendation: Make the CocoIndex call site pass `skip_if_disabled=False`, or change the helper gate to honor `COCOINDEX_RERANK_VIA_SIDECAR` for CocoIndex separately from `SPECKIT_CROSS_ENCODER`. Then add a cold-start test/smoke where `COCOINDEX_RERANK_VIA_SIDECAR=true` and `SPECKIT_CROSS_ENCODER` is unset.

Claim adjudication:

- claim: A cold CocoIndex MCP launch without `SPECKIT_CROSS_ENCODER=true` does not spawn the shared sidecar, contradicting the PROMOTE claim that MCP-mode operators get sidecar dispatch for free.
- evidenceRefs: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:151`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:85`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:92`, `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:198`, `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:159`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:97`
- counterevidenceSought: A CocoIndex-specific environment setup that always sets `SPECKIT_CROSS_ENCODER=true` before `cli.py::mcp`, or a wrapper that calls the helper with `skip_if_disabled=False`.
- alternativeExplanation: The ensure helper may have been intentionally designed only for spec-memory, with CocoIndex expected to tolerate first-call HTTP failure and bundled fallback; that still contradicts the current CocoIndex auto-spawn docs.
- finalSeverity: P1
- confidence: high
- downgradeTrigger: Downgrade to P2 if the documented supported deployment always runs CocoIndex MCP under `SPECKIT_CROSS_ENCODER=true`, or if the docs are corrected to say CocoIndex does not auto-spawn unless that flag is set.

### P2-001 [P2] REQ-006 still says to remove the bundled CrossEncoder despite D-004 preserving it as fallback

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139`
- Evidence: REQ-006 requires the bundled `CrossEncoder` load to be removed on PROMOTE at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139`, and SC-005 repeats that grep should return zero hits at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:160`. The shipped code keeps `CrossEncoderRerankerAdapter` and imports `CrossEncoder` lazily at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:125-164`, while D-004 explicitly decides to keep the class as HTTP fallback at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:87-89`.
- Finding class: matrix/evidence
- Scope proof: This is not a runtime correctness bug; the code matches D-004 and the fallback requirement, but the normative REQ-006/SC-005 wording points future validators at the wrong expected state.
- Recommendation: Rewrite REQ-006/SC-005 to require no eager bundled model load on the default path while preserving the lazy fallback class.

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| PV-001 / REQ-001 default dispatch | fail | `config.py:770` default true diverges from `reranker.py:24-30` raw-env default false; `test_http_sidecar_adapter.py:240-247` asserts default off. |
| PV-002 / REQ-010 launcher ensure | fail | `cli.py:151-155` calls helper defaults; `ensure_rerank_sidecar.py:90-96` skips spawn unless `SPECKIT_CROSS_ENCODER=true`. |
| REQ-002 fallback chain | pass | Connection exceptions hit `sidecar_unavailable` at `reranker.py:302-309`; 5xx/4xx bucket at `reranker.py:311-319`; malformed/missing-index payloads hit `sidecar_malformed` at `reranker.py:321-335`; tests cover the listed branches at `test_http_sidecar_adapter.py:118-216`; diagnostics field is written by `observability.py:55-58`. |
| REQ-003 score passthrough | pass | The sidecar payload is coerced to Python `float` and assigned directly to `QueryResult.reranker_score` at `reranker.py:321-350`; the happy-path test verifies ordering and `0.95` passthrough at `test_http_sidecar_adapter.py:86-115`. No normalization or inverse-sigmoid was found; path-class boost can modify scores only when its existing env flag is enabled. |
| Test correctness | pass | The 9 tests use `httpx.MockTransport` and a fallback recorder, so they exercise the adapter without a live sidecar or model load. The main gap is not false-positive behavior in the tests; it is that `test_dispatch_off_by_default` asserts the opposite of the PROMOTE/default claim. |
| REQ-006 PROMOTE wording vs D-004 | partial | Runtime follows D-004 by preserving lazy fallback; spec REQ-006/SC-005 still describes full removal. |
| `run_ab.py` score/arm integrity | pass | Arm A/B env overrides explicitly set false/true at `run_ab.py:159-173`; fixture is read once and not mutated at `run_ab.py:154`; per-probe command receives the arm env at `run_ab.py:91-98`; p95 uses a simple nearest-rank helper at `run_ab.py:57-62`. No correctness issue found that would flip the A/B verdict. |

Traceability summary: required=6, executed=6, pass=3, partial=1, fail=2, blocked=0, notApplicable=0, gatingFailures=2.

## Verdict

CONDITIONAL. No P0 was found. Two P1 findings block the PROMOTE/default claim: the dispatch default is not actually on when the env var is unset, and the CocoIndex MCP launcher does not auto-spawn the sidecar unless the spec-memory-only flag is set. The HTTP adapter fallback chain, sigmoid score passthrough under default settings, and A/B harness logic did not produce additional correctness findings.

## Next Dimension

Security. Focus on localhost HTTP trust, port/env override surface, payload validation, sidecar dependency failure posture, and error/log leakage.

Review verdict: CONDITIONAL
