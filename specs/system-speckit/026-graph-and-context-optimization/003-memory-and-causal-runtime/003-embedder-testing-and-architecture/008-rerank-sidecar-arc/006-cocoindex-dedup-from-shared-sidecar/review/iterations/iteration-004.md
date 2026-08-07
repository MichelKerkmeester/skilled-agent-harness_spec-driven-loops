# Deep Review Iteration 004 — Traceability Pass

## Dimension Focus

Traceability pass over the six required cross-reference protocols: `spec_code`, `checklist_evidence`, `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`.

This pass separates repeated gate failures from new findings. The runtime-default and launcher-spawn contradictions remain the already-open P1s from iteration 2; the localhost identity and payload-bound gaps remain the already-open P1s from iteration 3. New findings here are traceability-only P2s.

## Files Reviewed

| File | Lines / Areas Reviewed | Result |
|---|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md` | `120-162` | REQ-001..REQ-010 mapped. REQ-006 remains wording drift; REQ-010 remains contradicted by launcher gate. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md` | `40-82` | T001-T025 remain unchecked with pending/stale evidence despite shipped summary. New P2. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md` | `23-52`, `87-97`, `107-131` | Shipped/PROMOTE claims and validation evidence checked against source and task ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/spec.md` | `52-63` | Arc parent phase-map includes phase 006 as complete PROMOTE. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/graph-metadata.json` | `6-13`, `43`, `53` | `children_ids`, `derived.status`, and `last_active_child_id` align with REQ-008. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | `24-30`, `149-154`, `221-351`, `379-408` | HTTP adapter, fallback chain, score passthrough, and default-dispatch contradiction checked. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | `629`, `770`, `855` | Config default still parses `COCOINDEX_RERANK_VIA_SIDECAR` as true, but runtime dispatch remains raw-env. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | `48-57`, `86-115`, `137-216`, `229-247` | Adapter tests cover expected branches; default-off test still codifies DR-002-P1-001. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py` | `57-62`, `91-98`, `154-178` | A/B runner has explicit arm env overrides and local artifact writes. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/benchmark_report.md` | `52-63`, `76-85`, `142-157` | Decision rule evidence supports PROMOTE as written, subject to existing runtime default findings. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | `20-30` | Default sidecar claim repeats DR-002-P1-001. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | `352-365`, `1086-1089` | Env var and sidecar dependency documented; launcher auto-ensure claim repeats DR-002-P1-002. |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | `167-170` | Stale consumer text says CocoIndex repoint is future work. New P2. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | `36-46`, `50-106`, `129-186`, `190-284` | Sections mostly map to code, but default/launcher/security claims inherit prior P1 failures. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | `38-51`, `137-215` | RS matrix is executable in shape; RS-009/010 rely on failing default/spawn contracts and security scenarios omit forged-sidecar / oversized-payload checks. |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | `22-32`, `56-60`, `85-153` | Endpoint, lifecycle, lock, sigmoid, logging, and payload-bound evidence checked. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | `49-55`, `80-128` | Python ensure helper still gates spawn on `SPECKIT_CROSS_ENCODER`. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | `64-106` | Node ensure helper mirrors the opt-in gate and env inheritance behavior for spec-memory. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | `371-405`, `468-497` | Spec-memory local provider posts to `/rerank` and caps local provider documents before API call. |

## Findings by Severity (P0/P1/P2)

P0: none.

P1: no new P1 findings. Existing active P1s remain:

- DR-002-P1-001: PROMOTE default does not reach runtime dispatch.
- DR-002-P1-002: CocoIndex MCP auto-ensure is still gated by spec-memory's opt-in flag.
- DR-003-P1-001: Localhost sidecar identity is unauthenticated.
- DR-003-P1-002: `/rerank` accepts unbounded local payloads.

### DR-004-P2-001 [P2] Task ledger remains unchecked and stale after the packet claims SHIPPED/PROMOTE

- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40`
- Evidence: `tasks.md` still lists T001-T025 with `[ ]` status at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40-82`, and most evidence cells are `(pending)` or stale placeholders. The implementation summary simultaneously claims `Status: SHIPPED — PROMOTE path` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:23`, lists built artifacts at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:44-52`, and records validation/test/benchmark evidence at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:107-131`. Strict validation currently passes for the Level 1 packet, so this is not a validator blocker, but it is a traceability mismatch inside the packet.
- Finding class: matrix/evidence
- Scope proof: The mismatch is contained to packet-local docs; no reviewed source code behavior depends on `tasks.md`.
- Recommendation: Either mark T001-T025 with shipped evidence and links to the actual artifacts, or add an explicit note that the task ledger was superseded by `implementation-summary.md` evidence for this Level 1 packet.

### DR-004-P2-002 [P2] `system-rerank-sidecar` SKILL.md still says CocoIndex repointing is future work

- File: `.opencode/skills/system-rerank-sidecar/SKILL.md:170`
- Evidence: The canonical sidecar skill says "`CocoIndex` currently bundles its own Qwen instance" and that repointing it at the shared sidecar is future work at `.opencode/skills/system-rerank-sidecar/SKILL.md:167-170`. The new catalog and playbook describe the current state as two consumers, with CocoIndex default-on via `COCOINDEX_RERANK_VIA_SIDECAR=true` at `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46`, `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:273-278`, and `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:40-43`. Runtime code also now has `HttpSidecarRerankerAdapter` in `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:221-351`.
- Finding class: matrix/evidence
- Scope proof: This is cross-document drift within the same sidecar skill package; it does not add a new runtime failure beyond DR-002-P1-001/002.
- Recommendation: Update the `system-rerank-sidecar` SKILL.md Consumers section to say spec-memory is opt-in, CocoIndex has an HTTP adapter/default claim under arc 008 phase 006, and carry the current caveats from the open P1s until fixed.

## Cross-Reference Protocol Results

| Protocol | Status | Evidence | Impact |
|---|---|---|---|
| `spec_code` | fail | REQ-010 requires cold CocoIndex MCP startup to spawn the sidecar at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:148`, but `cli.py` calls the helper without overriding `skip_if_disabled` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:152-155`, and the helper returns before spawn unless `SPECKIT_CROSS_ENCODER=true` at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:85-96`. REQ-006 also remains partial due `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139` vs `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:87-89`. | Repeated P1/P2 gate failures; no new P1. |
| `checklist_evidence` | fail | T001-T025 remain unchecked at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40-82` while shipped evidence lives in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:23` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:107-131`. | New P2 DR-004-P2-001. |
| `skill_agent` | fail | `mcp-coco-index` claims default sidecar dispatch at `.opencode/skills/mcp-coco-index/SKILL.md:29`, repeating DR-002-P1-001. `system-rerank-sidecar` says CocoIndex repointing is future work at `.opencode/skills/system-rerank-sidecar/SKILL.md:170` while catalog/playbook say current default consumer at `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46` and `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:43`. | Repeated P1 plus new P2 DR-004-P2-002. |
| `agent_cross_runtime` | notApplicable | No new agent definitions shipped in either reviewed commit. | No gate impact. |
| `feature_catalog_code` | fail | Endpoint/lifecycle/score/caching/observability sections map to code (`rerank_sidecar.py:85-153`, `ensure_rerank_sidecar.py:80-128`, `cross-encoder.ts:371-405`, `reranker.py:221-351`), but catalog default/launcher claims at `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:194-201`, `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:232-233`, and `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:273-278` inherit DR-002-P1-001/002; security posture at `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:170-186` still lacks the identity/auth and payload-bound caveats from DR-003-P1-001/002. | Repeated P1 gate failures; no new finding beyond stale SKILL/task evidence. |
| `playbook_capability` | fail | RS-009/RS-010 at `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:159-160` rely on the failing CocoIndex auto-ensure/default-dispatch contracts. RS-021..RS-023 at `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:199-201` cover loopback/revision/env but do not cover forged localhost listeners or oversize payload rejection, matching DR-003-P1-001/002. | Repeated P1 gate failures; no new finding. |

Traceability summary: required=6, executed=6, pass=0, partial=0, fail=5, blocked=0, notApplicable=1, gatingFailures=5.

## REQ-NNN Mapping Detail

| Requirement | Status | Evidence | Impact |
|---|---|---|---|
| REQ-001 | pass-with-caveat | `HttpSidecarRerankerAdapter` exists at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:221`; explicit env dispatch begins at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:390`; test coverage starts at `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:229`. | Passes for explicit `true`; default-on remains DR-002-P1-001. |
| REQ-002 | pass | HTTP exceptions and non-200/malformed payloads fall back at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:302-335`; tests cover 5xx/malformed/missing-index at `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:137-216`. | No new issue. |
| REQ-003 | pass | Sidecar sigmoid happens at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:124`; adapter assigns returned floats to `QueryResult.reranker_score` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:321-350`; test asserts `0.95` passthrough at `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:97-113`. | No new issue. |
| REQ-004 | pass | Benchmark artifacts are present under `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/`; report methodology/results live at `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/benchmark_report.md:52-85`; `sk-doc validate_document.py` returned exit 0 for the report in this iteration. | No new issue. |
| REQ-005 | pass | Recommendation section states PROMOTE and applies the decision rule at `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/benchmark_report.md:142-156`. | No new issue. |
| REQ-006 | partial | Spec still says bundled `CrossEncoder` load is removed at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139`, while runtime keeps lazy fallback construction at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:149-154` and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:254-257`; D-004 says to keep the class at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:87-89`. | Existing DR-002-P2-001. |
| REQ-007 | pass | Env var and dependency docs are present at `.opencode/skills/mcp-coco-index/SKILL.md:29`, `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:361-365`, and `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:1088`. | No new issue. |
| REQ-008 | pass | Parent phase-map row 006 is complete at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/spec.md:62`; graph metadata includes phase 006 at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/graph-metadata.json:6-13`, status complete at line 43, and `last_active_child_id` at line 53. | No new issue. |
| REQ-009 | pass | Current strict validation exited 0 for both packet and parent during this iteration; implementation summary also records packet strict validation at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:111-115`. | No new issue. |
| REQ-010 | fail | `cli.py` invokes `ensure_rerank_sidecar()` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:152-155`; helper default `skip_if_disabled=True` is declared at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:85` and returns early when `SPECKIT_CROSS_ENCODER` is unset at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90-96`. | Existing DR-002-P1-002. |

## Verdict

CONDITIONAL. Traceability coverage is complete for the assigned pass, but five protocol gates fail. Three are repeated from active P1s, one is the existing REQ-006 P2, and two are new P2 traceability drifts. No new P0/P1 was found.

## Next Dimension

Maintainability. Focus on adapter/fallback complexity, duplicate launcher helper behavior, docs ownership boundaries, and whether remediation can reduce the cross-skill contract surface without broad refactoring.

Review verdict: CONDITIONAL
