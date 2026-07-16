# Deep Review Iteration 001 — Inventory Pass

## Dimension Focus

Inventory pass only. Scope was the 13 configured review files in `deep-review-config.json`, plus read-only supporting references needed to map catalog/playbook claims to implementation: `system-rerank-sidecar/SKILL.md`, `scripts/rerank_sidecar.py`, `scripts/start.sh`, `scripts/ensure_rerank_sidecar.py`, `tests/test_rerank_sidecar.py`, and cocoindex `cli.py::_ensure_rerank_sidecar_for_mcp`.

Dimension queue remains correct: correctness -> security -> traceability -> maintainability. Correctness should go next because the highest-risk anchors are runtime dispatch/default behavior and launcher ensure behavior, both of which can make the PROMOTE claim false even when docs and benchmark artifacts look green.

## Files Reviewed

| File | Size | Structure / key entry points | Risk |
|---|---:|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md` | 193 lines / 15,097 bytes | Requirements table at lines 132-148; success criteria at 156-162; risks at 170-180. | Medium: normative claims may disagree with shipped code. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/plan.md` | 257 lines / 12,426 bytes | Adapter sketch lines 54-124; dispatch sketch 127-143; promote/hold branch 195-205. | Medium: plan still has pre-PROMOTE/default-false language in places. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md` | 108 lines / 6,352 bytes | T001-T025 at lines 40-82; cross refs at 98-107. | Medium: tasks remain unchecked while implementation summary claims shipped. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md` | 144 lines / 11,109 bytes | Built summary 44-52; decisions 73-101; verification 107-131; limitations 137-143. | Medium: strongest claim surface for traceability. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | 425 lines / 15,473 bytes | `_rerank_via_sidecar_enabled()` lines 24-30; `CrossEncoderRerankerAdapter` 125-218; `HttpSidecarRerankerAdapter` 221-351; dispatch 379-408. | High: correctness/security critical runtime path. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | 883 lines / 30,205 bytes | config dataclass field line 629; env parse line 770; constructor wiring 833-869. | High: default/PROMOTE source of truth. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | 247 lines / 8,420 bytes | Mock transport helpers 48-64; fallback recorder 67-83; 9 tests lines 86-247. | High: test oracle currently anchors dispatch behavior. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py` | 184 lines / 6,231 bytes | arm env overrides 159-173; per-probe runner 69-144. | Medium: benchmark evidence, not production. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/benchmark_report.md` | 195 lines / 10,555 bytes | aggregate results 52-63; caveats 133-139; PROMOTE recommendation 142-157. | Medium: decision evidence and caveats. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | 1,099 lines / 46,932 bytes | rerank env table 352-367; version row 1086-1089. | Medium: operator-facing default claim. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | 496 lines / 25,893 bytes | two-stage/default dispatch claim lines 20-30; tool coverage 261-277. | Medium: skill-agent traceability. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | 294 lines / 13,823 bytes | endpoint contracts 50-106; concurrency 129-147; security 170-186; consumers 265-284. | Medium-high: cross-skill contract catalog. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | 231 lines / 21,507 bytes | RS-001..RS-023 scenario matrix lines 137-201; automated mapping 205-215; catalog index 219-231. | Medium-high: executable/manual capability matrix. |

Highest-risk files for iteration 2: `reranker.py`, `config.py`, `test_http_sidecar_adapter.py`, `cli.py::_ensure_rerank_sidecar_for_mcp` as supporting context, then `feature_catalog.md`/`manual_testing_playbook.md` for claims that depend on those runtime behaviors.

## Findings by Severity (P0/P1/P2)

P0: none recorded in inventory.

P1: none recorded in inventory.

P2: none recorded as canonical findings in inventory. Three `PENDING-VERIFY` anchors were identified for the next dimensions:

- PV-001 default dispatch: docs and implementation summary claim `COCOINDEX_RERANK_VIA_SIDECAR=true` is the default, and `Config.from_env()` parses that default at `config.py:770`, but `get_reranker_adapter()` calls `_rerank_via_sidecar_enabled()` at `reranker.py:390`, which only returns true when the raw environment variable is explicitly truthy at `reranker.py:24-30`. The new test `test_dispatch_off_by_default` asserts bundled dispatch when the env var is absent at `test_http_sidecar_adapter.py:240-247`.
- PV-002 launcher ensure: `manual_testing_playbook.md:159-160` and `feature_catalog.md:198-201` say cocoindex MCP startup auto-ensures the sidecar, but `ensure_rerank_sidecar.py:90-96` skips spawn unless `SPECKIT_CROSS_ENCODER=true`; cocoindex calls it without overriding `skip_if_disabled` at `cli.py:151-155`.
- PV-003 stale sidecar SKILL consumer text: `feature_catalog.md:46` and `manual_testing_playbook.md:42-43` describe cocoindex as default sidecar consumer, while `system-rerank-sidecar/SKILL.md:167-170` still says repointing CocoIndex is future work.

## Traceability Checks

Core protocols were mapped but not executed as gates in this inventory pass.

`spec_code` map:

- REQ-001 -> `reranker.py:221-351`, `reranker.py:379-408`, `test_http_sidecar_adapter.py:229-247`.
- REQ-002 -> `reranker.py:259-274`, `reranker.py:302-319`, `test_http_sidecar_adapter.py:118-168`.
- REQ-003 -> `reranker.py:321-351`, sidecar sigmoid source `rerank_sidecar.py:124-150`, test happy path `test_http_sidecar_adapter.py:86-115`.
- REQ-004/REQ-005 -> `run_ab.py:69-180`, `benchmark_report.md:52-63`, `benchmark_report.md:142-157`.
- REQ-006 -> `reranker.py:125-164` still contains bundled `CrossEncoder(...)` fallback; correctness pass should adjudicate spec wording vs decision D-004 at `implementation-summary.md:87-89`.
- REQ-007 -> `SKILL.md:29`, `INSTALL_GUIDE.md:361-365`, `INSTALL_GUIDE.md:1086-1089`.
- REQ-008/REQ-009 -> packet docs only in current 13-file scope; parent arc files are outside this iteration's review-scope list.
- REQ-010 -> supporting context `cli.py:139-158` and `cli.py:1179-1185`, plus `ensure_rerank_sidecar.py:80-128`.

`checklist_evidence` map:

- `tasks.md` T001-T025 at lines 40-82 are still unchecked, while `implementation-summary.md:23`, `implementation-summary.md:44-52`, and `implementation-summary.md:107-131` claim shipped state and verification evidence. Traceability pass should decide whether this is acceptable Level 1 packet drift or a completion-evidence mismatch.

Overlay map:

- `skill_agent`: mcp-coco-index SKILL default claim at `SKILL.md:29` maps to `reranker.py:24-30`, `reranker.py:379-408`, and `INSTALL_GUIDE.md:361-365`. system-rerank-sidecar SKILL consumer claim at `system-rerank-sidecar/SKILL.md:167-170` maps to catalog/playbook consumer claims at `feature_catalog.md:46`, `feature_catalog.md:273-278`, and `manual_testing_playbook.md:40-43`.
- `agent_cross_runtime`: not applicable; no runtime agent file was shipped in the two commits under review.
- `feature_catalog_code`: catalog §2 maps to `rerank_sidecar.py:85-153`; §3 to `rerank_sidecar.py:45-53` and `.env.example`; §4 to `rerank_sidecar.py:32`, `rerank_sidecar.py:117-123`, and `start.sh:25`; §5 to `rerank_sidecar.py:38-42` and `rerank_sidecar.py:124-150`; §6 to `start.sh:25`, `rerank_sidecar.py:45-53`, and `ensure_rerank_sidecar.py:108-115`; §7 to `ensure_rerank_sidecar.py:80-128`, `cli.py:139-158`, and Node helper `ensure-rerank-sidecar.cjs:71-97`; §8 to `rerank_sidecar.py:22-29`, `config.py:770`, and `cross-encoder.ts`; §9 to `rerank_sidecar.py:85-153` and `observability.py`; §10 to `reranker.py:221-351` and `cross-encoder.ts`.
- `playbook_capability`: RS-001..RS-005 map to `rerank_sidecar.py:85-153` and `tests/test_rerank_sidecar.py:39-63`; RS-006..RS-008 map to the Node ensure helper and `cross-encoder.ts`; RS-009..RS-011 map to `cli.py:139-158`, `reranker.py:379-408`, and `test_http_sidecar_adapter.py:229-247`; RS-012..RS-013 map to both ensure helpers plus `reranker.py:259-319`; RS-014..RS-016 map to `rerank_sidecar.py:32`, `rerank_sidecar.py:117-123`, and `start.sh:25`; RS-017..RS-020 map to `rerank_sidecar.py:45-53`, `start.sh:17-25`, and `reranker.py:244-319`; RS-021..RS-023 map to `start.sh:25`, `.env.example`, `rerank_sidecar.py:45-53`, and `ensure_rerank_sidecar.py:108-115`.

## Verdict

Inventory complete. No formal P0/P1/P2 findings were registered in this pass; PV-001 and PV-002 are high-priority anchors for the correctness pass, and PV-003 is a traceability/maintainability anchor.

## Next Dimension

Correctness. Start with the PROMOTE default dispatch path, then sidecar auto-ensure behavior, then fallback semantics and the test oracle.

Review verdict: PENDING
