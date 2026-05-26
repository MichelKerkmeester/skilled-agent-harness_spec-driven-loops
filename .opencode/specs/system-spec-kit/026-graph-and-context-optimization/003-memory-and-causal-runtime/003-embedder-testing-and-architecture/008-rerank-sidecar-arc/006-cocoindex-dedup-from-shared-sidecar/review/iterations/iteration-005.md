# Deep Review Iteration 005 -- Maintainability Pass

## Dimension Focus

Maintainability pass over the HTTP sidecar adapter shape, fallback readability, dependency posture, test maintainability, operator docs, follow-up clarity, and stale planning surfaces.

No new P0/P1 findings were found. The existing active P1s remain the release-blocking items. This pass adds two P2 maintainability advisories: one packaging/dependency issue and one documentation-package shape issue.

## Files Reviewed

| File | Lines / Areas Reviewed | Result |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | `221-351`, `379-408` | Adapter composes by duck typing against the existing `rerank()` interface. Fallback chain is flat and readable. Cached sync `httpx.Client` is process-lifetime scoped via `_ADAPTERS`; no separate leak finding. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | `48-83`, `86-247` | Helpers are local and reusable. Tests touch private `_client` / `_fallback_adapter`, but that is proportional to isolating network/model behavior. No new test-maintainability finding beyond the dependency manifest gap. |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | `28-46`, `64-71` | Runtime and dev dependency lists omit `httpx` while runtime and tests import it. New P2. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | `352-367`, `1086-1089` | Dispatch semantics are clear as operator prose, but inherit existing DR-002-P1-001/002 correctness drift. No new maintainability finding. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | `20-30`, `261-277` | MCP/CLI split remains clear. Default sidecar claim is already tracked as DR-002-P1-001. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | `12-294` | Useful current-state inventory, but diverges from sk-doc's split feature-catalog package and carries mutable packet-history/default claims. New P2. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | `12-231` | Scenario rows include preconditions, expected signals, evidence, pass/fail, and triage. The monolithic "all scenarios in one file" shape diverges from sk-doc's split package and will get expensive as 23 scenarios evolve. Covered by the new docs P2. |
| `.opencode/specs/.../implementation-summary.md` | `137-143` | Limitations are mostly actionable. Baseline drift names packet 007; n=1 follow-up points to n=3 after drift investigation. Remaining limitations should become remediation rows when the active P1s are fixed, but no separate finding. |
| `.opencode/specs/.../plan.md` | `54-124`, `195-205` | Still useful as historical sketch, but stale default/removal language repeats existing DR-002-P1-001 and DR-002-P2-001 rather than creating a distinct new finding. |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | `18-37` | Review doctrine for catalog package shape and evergreen/current-reality rules. |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | `18-39`, `112-133` | Review doctrine for playbook package shape and 9-column scenario contract. |
| `.opencode/skills/sk-code-review/references/review_core.md` | `18-35`, `74-89` | Severity and evidence doctrine loaded before final severity calls. |

## Findings by Severity (P0/P1/P2)

P0: none.

P1: no new P1 findings. Existing active P1s remain:

- DR-002-P1-001: PROMOTE default does not reach runtime dispatch.
- DR-002-P1-002: CocoIndex MCP auto-ensure is still gated by spec-memory's opt-in flag.
- DR-003-P1-001: Localhost sidecar identity is unauthenticated.
- DR-003-P1-002: `/rerank` accepts unbounded local payloads.

### DR-005-P2-001 [P2] `httpx` is a hidden mcp-coco-index dependency

- File: `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28`
- Evidence: Runtime code lazy-imports `httpx` in `HttpSidecarRerankerAdapter._get_client()` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:244-250`, and the new adapter test module imports it eagerly at `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:15`. The mcp-coco-index package dependency list at `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28-46` does not declare `httpx`, and the dev extras at `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:64-71` also omit it. `httpx` is declared by the sibling sidecar package at `.opencode/skills/system-rerank-sidecar/pyproject.toml:13`, but that does not make it a direct dependency of mcp-coco-index installs.
- Finding class: cross-consumer
- Scope proof: Exact dependency search across `pyproject.toml` / `requirements*.txt` under `mcp-coco-index` found no `httpx` entry; runtime and tests both depend on it.
- Recommendation: Add `httpx` as a direct dependency of `mcp-coco-index` (runtime, not only test extras), ideally pinned/aligned with `system-rerank-sidecar` unless the fork intentionally supports a broader range.

### DR-005-P2-002 [P2] Sidecar catalog/playbook diverge from sk-doc split-package and evergreen contracts

- File: `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46`
- Evidence: sk-doc's feature-catalog template says the root catalog should use frontmatter, TOC, numbered all-caps H2s, per-feature files, current-reality wording, and packet-history-free references at `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:18-23`; its canonical layout expects category folders plus per-feature files at `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:27-37`. The testing playbook template likewise requires per-feature files and evergreen current-behavior scenarios at `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:18-26` and `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:30-39`. The shipped sidecar playbook explicitly inlines every scenario in one root file at `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:14`, and the actual catalog/playbook package currently contains only `feature_catalog.md` and `manual_testing_playbook.md`. Both docs also carry mutable packet-history/default claims, e.g. `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46`, `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:233`, `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:275-276`, `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:43`, and `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:201`.
- Finding class: matrix/evidence
- Scope proof: `rg --files .opencode/skills/system-rerank-sidecar/feature_catalog .opencode/skills/system-rerank-sidecar/manual_testing_playbook` returns only the two root markdown files, so there are no stable per-feature anchors for the 11 catalog sections or 23 RS scenarios.
- Recommendation: Either migrate to the sk-doc split package (`NN--category/NN-feature.md` files) or explicitly document a lightweight exception for this small skill. In either case, remove mutable packet-history phrasing from evergreen catalog/playbook claims and link to current source/test anchors plus the active review findings.

## Maintainability Checks

| Check | Status | Evidence |
|---|---|---|
| Adapter interface shape | pass | `HttpSidecarRerankerAdapter.rerank()` at `reranker.py:276-283` mirrors the existing adapter call shape and dispatch uses it through `get_reranker_adapter()` at `reranker.py:379-408`. No abstract base exists, so duck typing is consistent with the local pattern. |
| Client lifecycle | pass-with-caveat | `_get_client()` lazily creates one sync `httpx.Client` per adapter at `reranker.py:244-252`; adapters are cached in `_ADAPTERS` at `reranker.py:390-407`. No close hook exists, but the cache is process-lifetime and a sync call holds `self` while in flight. |
| Lazy import clarity | pass-with-caveat | Lazy `import httpx` at `reranker.py:246` matches the docstring's "avoid default path import cost" at `reranker.py:387-388`. The cost is reasonable, but only if dependency declaration is fixed by DR-005-P2-001. |
| Fallback chain complexity | pass | The five modes are flat: request exception -> `sidecar_unavailable` at `reranker.py:302-309`; non-200 -> `sidecar_5xx` or `sidecar_<status>` at `reranker.py:311-319`; malformed/missing-index -> `sidecar_malformed` at `reranker.py:321-335`. No nested try/except maze. |
| Diagnostic cardinality | pass-with-caveat | 5xx and 4xx/status buckets are distinct; malformed JSON and missing-index intentionally share `sidecar_malformed`. Good enough for operator triage, not enough for schema-level telemetry. |
| Test helper maintainability | pass | `_install_mock_transport()` and `_RecordedFallback` at `test_http_sidecar_adapter.py:48-83` are small and reusable across all HTTP branch tests. Tests depend on private fields, but that is an acceptable test seam for isolating network and model load. |
| Docs quality | advisory | INSTALL_GUIDE and SKILL wording is understandable, but default/launcher claims remain covered by DR-002-P1-001/002. Catalog/playbook package shape is the new DR-005-P2-002. |
| Follow-up clarity | pass-with-caveat | Known limitations name packet 007 for baseline drift at `implementation-summary.md:140` and n=3 confirmation at `implementation-summary.md:141`. Other limitations should be converted to remediation rows when the active P1s are planned. |
| Plan staleness | repeat-only | `plan.md:134` still sketches default false and `plan.md:198` says to remove bundled load, but those are the same failure classes as DR-002-P1-001 and DR-002-P2-001. Reconcile with those fixes rather than count a new finding. |

Claim adjudication: not required; no new P0/P1 findings were introduced in this iteration.

newFindingsRatio: 0.08 (2 new P2 advisories against the active severity-weighted finding pool; no P0 override).

## Verdict

CONDITIONAL. Maintainability coverage is complete. Adapter/fallback/test structure is maintainable enough to remediate without broad refactoring, but `httpx` must be declared directly and the sidecar docs need either sk-doc package migration or an explicit lightweight exception. Existing P1s keep the review verdict CONDITIONAL.

## Next Dimension

Adversarial recheck / stabilization. All four dimensions are now covered; iteration 6 should replay the active P1/P2 set, check for false positives or duplicates, and synthesize if no new P0/P1 appears.

Review verdict: CONDITIONAL
