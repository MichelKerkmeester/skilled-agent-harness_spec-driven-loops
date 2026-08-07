# Deep Review Iteration 006 -- Adversarial Recheck + Stabilization

## Dimension Focus

Adversarial recheck across the active correctness, security, traceability, and maintainability findings. This pass challenged each active P1/P2 for false positives, duplicates, missing downgrade triggers, and missed P0/P1 risk before synthesis.

No new P0/P1 findings were found. No new high-confidence P2 findings were added. Two prior security P1s are reclassified to P2 advisories because the review prompt establishes the supported deployment as a single-user Mac; their original multi-user localhost attack vector is not a required-fix threat model for this packet.

## Files Reviewed

| File | Lines / Areas Reviewed | Result |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | `24-30`, `221-351`, `379-408` | Confirms raw-env sidecar dispatch still defaults off; HTTP adapter remains unauthenticated but loopback-only; fallback parsing branches cover malformed sidecar responses. No missed P0/P1 in the adapter. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | `620-629`, `747-770`, `833-855` | Confirms `Config.rerank_via_sidecar` default true is parsed and stored but not consumed by dispatch. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | `1-120`, `229-247` | Confirms the test suite explicitly codifies the default-off runtime behavior in `test_dispatch_off_by_default`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | `139-158`, `1179-1185` | Confirms CocoIndex MCP calls `ensure_rerank_sidecar()` without overriding `skip_if_disabled`. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | `49-55`, `80-128` | Confirms helper default `skip_if_disabled=True`, `SPECKIT_CROSS_ENCODER` gate, unauthenticated health attach, and full env inheritance. |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | `14-25` | Confirms `.env` / `.env.local` sourcing and loopback bind to `127.0.0.1`. |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | `56-153` | Confirms `/rerank` has only empty-documents and negative-top_k checks before model prediction. |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | `39-95` | Confirms tests cover health, basic rerank, concurrency, and shutdown, but not auth or oversized-payload rejection. |
| `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/spec.md` | `132-160` | Confirms REQ-006 removal wording and REQ-010 cold-start spawn requirement remain drift points. |
| `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/tasks.md` | `40-82` | Confirms T001-T025 remain unchecked despite shipped summary. |
| `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md` | `23-52`, `87-97`, `107-143` | Confirms PROMOTE/default and launcher claims still contradict runtime; benchmark caveats already document drift/n=1. |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | `28-71` | Confirms no direct `httpx` dependency in runtime or dev dependency lists. |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | `167-170` | Confirms stale CocoIndex consumer text remains. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | `36-46`, `170-205`, `230-284` | Confirms current default/launcher claims inherit correctness P1s; security posture omits downgraded advisory caveats. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | `12-50`, `155-201` | Confirms RS-009/010 depend on failing default/spawn contracts; RS-021..023 do not cover forged listener or payload limits. |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | `18-37` | Confirms split-package and evergreen catalog expectations. |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | `18-40`, `112-135` | Confirms per-feature playbook and 9-column scenario expectations. |
| `.opencode/skills/sk-code-review/references/review_core.md` | `18-35`, `74-89` | Loaded before final severity calls. |

## Findings by Severity (P0/P1/P2)

P0: none.

### Confirmed Active P1 Findings

#### DR-002-P1-001 [P1] PROMOTE default does not reach runtime dispatch

- File: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24`
- Recheck result: confirmed. `_rerank_via_sidecar_enabled()` reads the raw `COCOINDEX_RERANK_VIA_SIDECAR` environment variable and returns false when it is unset at `reranker.py:24-30`. `Config.from_env()` separately parses the same env var with default true at `config.py:770` and stores it at `config.py:855`, but `get_reranker_adapter()` dispatches through `_rerank_via_sidecar_enabled()` at `reranker.py:390` without consuming the `Config` field. The adversarial counterclaim that a launcher materializes the Config default into the env did not hold in the reviewed paths; exact search only found raw env dispatch and tests. `test_dispatch_off_by_default` at `test_http_sidecar_adapter.py:240-247` still asserts bundled dispatch when the env var is absent.
- Severity call: P1 remains correct because the PROMOTE/default-on claim is a shipped runtime contract, not just docs polish.

#### DR-002-P1-002 [P1] CocoIndex MCP auto-ensure is still gated by spec-memory's opt-in flag

- File: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90`
- Recheck result: confirmed. `cli.py::_ensure_rerank_sidecar_for_mcp()` calls `ensure_rerank_sidecar(port=..., sidecar_skill_path=...)` without passing `skip_if_disabled=False` at `cli.py:151-155`. The helper default is `skip_if_disabled=True` at `ensure_rerank_sidecar.py:85`, and it exits before health probe or spawn unless `SPECKIT_CROSS_ENCODER=true` at `ensure_rerank_sidecar.py:90-96`. No alternate CocoIndex MCP path bypassing this helper was found; the MCP command calls `_ensure_rerank_sidecar_for_mcp()` at `cli.py:1179-1185`.
- Severity call: P1 remains correct because REQ-010 and the operator docs claim cold CocoIndex MCP startup auto-spawns the sidecar.

### Downgraded Security Findings

#### DR-003-P1-001 -> P2 [downgraded] Localhost sidecar identity is unauthenticated

- File: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248`
- Recheck result: code observation confirmed, severity downgraded. The adapter still trusts `http://127.0.0.1:<port>` at `reranker.py:248-250`, sends raw query/documents to `/rerank` without an auth header at `reranker.py:294-300`, and the sidecar has unauthenticated `/health`, `/warmup`, and `/rerank` endpoints at `rerank_sidecar.py:85-109`. `start.sh:25` confirms loopback-only bind, and `ensure_rerank_sidecar.py:49-55` still accepts any 200 `/health`.
- Downgrade rationale: the established deployment is a single-user Mac. The multi-user local spoofing attack requires an arbitrary same-host user or the operator intentionally spoofing their own sidecar, so it is advisory hardening rather than a required P1 fix for this packet.
- New status: P2 advisory, `downgradeTrigger=true`.

#### DR-003-P1-002 -> P2 [downgraded] `/rerank` accepts unbounded local payloads

- File: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56`
- Recheck result: code observation confirmed, severity downgraded. `RerankRequest` has unbounded `query`, `documents`, and `top_k` fields at `rerank_sidecar.py:56-60`; runtime validation only rejects empty documents and negative `top_k` at `rerank_sidecar.py:110-113`; the handler then builds all `(query, doc)` pairs and calls `_model.predict(pairs)` at `rerank_sidecar.py:121-122`. The tests at `test_rerank_sidecar.py:48-95` do not exercise oversized requests.
- Downgrade rationale: under the solo-Mac deployment, the abusive same-host caller is the same operator. Normal CocoIndex calls cap the document count before POSTing via `reranker.py:287-300`; direct unbounded `/rerank` remains worth documenting and bounding, but it is not a required security fix in this threat model.
- New status: P2 advisory, `downgradeTrigger=true`.

### Confirmed Active P2 Findings

- DR-002-P2-001 remains real and not a duplicate: REQ-006/SC-005 still require removing the bundled `CrossEncoder` load at `spec.md:139` and `spec.md:160`, while D-004 explicitly keeps the class as lazy fallback at `implementation-summary.md:87-89` and runtime still contains the fallback class path.
- DR-003-P2-001 remains real and not a duplicate: `ensure_rerank_sidecar.py:108-115` passes the full parent environment into the child process; this is distinct from listener identity and payload bounds.
- DR-004-P2-001 remains real and not a duplicate: `tasks.md:40-82` remains unchecked while `implementation-summary.md:23` and `implementation-summary.md:107-131` claim shipped validation evidence. This is packet-local evidence drift, not a runtime defect.
- DR-004-P2-002 remains real and not a duplicate: `system-rerank-sidecar/SKILL.md:167-170` still calls CocoIndex repointing future work, while the new catalog/playbook describe CocoIndex as a current default consumer at `feature_catalog.md:46` and `manual_testing_playbook.md:40-43`.
- DR-005-P2-001 remains real and not a duplicate: runtime imports `httpx` lazily at `reranker.py:246` and tests import it at `test_http_sidecar_adapter.py:15`; `mcp-coco-index/mcp_server/pyproject.toml:28-71` omits it from direct runtime/dev dependencies.
- DR-005-P2-002 remains real and not a duplicate: the sidecar catalog/playbook have only two root markdown files, while sk-doc templates require per-feature files and evergreen/package-history-free structure at `feature_catalog_template.md:18-37` and `manual_testing_playbook_template.md:18-40`.

## Adversarial Missed-Risk Sweep

No missed P0/P1 found.

| Probe | Result |
|---|---|
| `reranker.py` uncaught exceptions / edge cases | Malformed JSON, missing indexes, non-numeric indexes, missing scores, and request exceptions route through existing fallback branches at `reranker.py:302-335`. Invalid `RERANK_SIDECAR_PORT` would raise during adapter construction, but that is an operator-local malformed env override rather than a shipped PROMOTE/default contract failure; I am not adding it as a new finding. |
| Secret leakage in `cli.py` / `config.py` | No secret-value logging found in the reviewed launcher/config path. `cli.py:156` prints the ensure result JSON, which contains port/fallback/ownerPid but not environment values. Runtime diagnostics store bucket strings rather than query/doc content. |
| Requirement coverage gaps | REQ-010 remains the active launcher P1. REQ-006 remains the active wording P2. REQ-008/REQ-009 are validation/doc requirements rather than unit-test requirements and have packet evidence in `implementation-summary.md:111-115`; no new blocker. |
| Benchmark / decision-rule edge cases | `run_ab.py:159-173` explicitly sets the sidecar env per arm, so it validly compares bundled vs HTTP path even though the default dispatch claim is broken. `benchmark_report.md:133-138` already discloses n=1 and absolute hit-rate drift. No new P1 invalidates the A/B path-equivalence result. |

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| Evidence gate | pass | Every active P1 has file:line evidence: DR-002-P1-001 at `reranker.py:24`; DR-002-P1-002 at `ensure_rerank_sidecar.py:90`. Downgraded security findings also retain file:line evidence. |
| Scope gate | pass | Findings stay within `reviewScopeFiles` or the supporting files already listed in strategy §15 (`cli.py`, `ensure_rerank_sidecar.py`, `rerank_sidecar.py`, `start.sh`, sidecar tests, sk-doc templates). |
| Coverage gate | pass | Correctness, security, traceability, and maintainability are all covered, and this pass is the required stabilization/adversarial recheck. |
| Downgrade gate | pass | Both security downgrades are tied to the prompt's solo-Mac deployment note; the code observations remain active as P2 hardening advisories. |
| Duplicate gate | pass | Each P2 has a distinct remediation surface: spec wording, env inheritance, task ledger, stale skill text, dependency manifest, docs package shape, listener identity, and payload limits. |

Traceability summary: required=5, executed=5, pass=5, partial=0, fail=0, blocked=0, notApplicable=0, gatingFailures=0.

## Verdict

CONDITIONAL. The review has converged for synthesis: all four dimensions are covered, the stabilization pass found no new P0/P1 and no new high-confidence P2, and the evidence/scope/coverage gates pass. The final active severity mix is P0=0, P1=2, P2=8 after downgrading the solo-Mac localhost security findings.

The two remaining P1s are correctness/traceability blockers against the PROMOTE/default story: runtime dispatch does not default to the sidecar, and CocoIndex MCP startup does not auto-spawn the sidecar without `SPECKIT_CROSS_ENCODER=true`.

## Next Dimension

Synthesis. Generate the review report with verdict CONDITIONAL, required remediation for DR-002-P1-001 and DR-002-P1-002, and advisory follow-up for the eight P2 items.

Review verdict: CONDITIONAL
