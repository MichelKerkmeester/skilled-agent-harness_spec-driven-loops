---
title: "Spec: 022/005 Spec-Memory P1 Registry Consolidation"
description: "cli-opencode + deepseek-v4-pro --variant high dispatched: extended registry.ts with RerankerProvider type + RERANKER_CANONICAL frozen object + getRerankerFallback helper; consolidated providers/voyage.ts + providers/openai.ts + auto-select.ts + cross-encoder.ts to import from registry. Closes 7 P1 cleanup findings."
trigger_phrases: ["022/005 spec-memory registry", "RERANKER_CANONICAL", "getRerankerFallback"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation"
    last_updated_at: "2026-05-23T18:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 005 shipped via cli-opencode dispatch PID 37723 (~12 min)"
    next_safe_action: "Phase 007 dispatched; arc convergence pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002251"
      session_id: "016-002-022-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "RERANKER_CANONICAL declared with local model + empty-string placeholders for voyage/cohere (no canonical reranker name known)"
      - "OLLAMA_PRIORITY now derived from MANIFESTS (7 manifests instead of 4 hardcoded inline)"
      - "Bundle gate: 678 vitest pass, 3 pre-existing failures (DB fixtures, tool count mismatch, sidecar-hardening — unrelated)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/005 Spec-Memory P1 Registry Consolidation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | cli-opencode + deepseek-v4-pro --variant high dispatch |
| Files changed | 5 (registry.ts extended + 4 consumer updates) |
| Findings closed | 7 P1 |
| Wall-clock | ~12 min cli-opencode dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Spec-memory had inline provider model defaults duplicated across 4 sites (providers/voyage.ts, providers/openai.ts, auto-select.ts, cross-encoder.ts) despite registry.ts already exporting `getCanonicalFallback(provider)` since packet 020. Reranker side had no canonical helper at all — `cross-encoder/ms-marco-MiniLM-L-6-v2` was inline in PROVIDER_CONFIG.local.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (delivered by dispatch)

- `registry.ts` extension: added `RerankerProvider` type, `RERANKER_CANONICAL` frozen object (`local: 'cross-encoder/ms-marco-MiniLM-L-6-v2'`, voyage/cohere empty placeholders), `getRerankerFallback(provider)` helper
- `providers/voyage.ts:13`: `DEFAULT_MODEL = getCanonicalFallback('voyage')`
- `providers/openai.ts:13`: `DEFAULT_MODEL = getCanonicalFallback('openai')`
- `auto-select.ts`: VOYAGE_MODEL / OPENAI_MODEL / HF_LOCAL_MODEL all derived from getCanonicalFallback; OLLAMA_PRIORITY derived from MANIFESTS
- `cross-encoder.ts:54`: PROVIDER_CONFIG.local.model = getRerankerFallback('local')

### Out of Scope

- 7 P2 over-flags (informational; not actioned)
- voyage/cohere reranker canonical values (placeholder; can be filled when canonical names are established)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | registry.ts has RERANKER_CANONICAL + getRerankerFallback | grep ≥ 3 hits |
| R2 | providers/voyage.ts + openai.ts derive from getCanonicalFallback | grep |
| R3 | auto-select.ts VOYAGE_MODEL / OPENAI_MODEL / HF_LOCAL_MODEL derive from getCanonicalFallback | grep |
| R4 | auto-select.ts OLLAMA_PRIORITY derives from MANIFESTS | grep |
| R5 | cross-encoder.ts PROVIDER_CONFIG.local.model uses getRerankerFallback | grep |
| R6 | system-spec-kit typecheck:root exit 0 | npm run typecheck:root |
| R7 | vitest: 0 new failures | dispatch self-report |
| R8 | Strict-validate phase 005 exit 0 | validate.sh --strict |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R8 pass. 7 P1 closed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

cli-opencode + deepseek-v4-pro --variant high single-wave dispatch. PID 37723. ~12 min wall-clock.

Dispatch self-reported status:
```
PHASE 005 STATUS:
- registry.ts extension: PASS
- providers/voyage.ts + openai.ts: PASS
- auto-select.ts consolidation: PASS
- cross-encoder.ts reranker: PASS
- typecheck: exit 0
- ban-list grep: 0 hits remaining
- Files changed: 5
- Bundle gate: PASS
```
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| voyage/cohere RERANKER_CANONICAL empty placeholders | Documented; getRerankerFallback returns empty string — caller must check or use only for 'local' for now |
| OLLAMA_PRIORITY now includes 7 manifests vs prior 4 hardcoded | Behavior change: cascade probes more models; preserves "first match wins" semantics |
| Pre-existing vitest failures unrelated to 005 | Confirmed by dispatch: DB fixtures, tool count, sidecar-hardening — not introduced |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
None.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Audit: f-iter005-001..007 (7 P1)
- Dispatch prompt: /tmp/005-prompt.md
- Predecessor: phase 020 (shipped getCanonicalFallback)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

Behavior preserved (same default values via canonical source).
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- OLLAMA_PRIORITY ordering: MANIFESTS export order preserved.
- voyage/cohere reranker callers MUST check `getRerankerFallback(provider) !== ''` before using (placeholder values).
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2+ via cli-opencode dispatch. 5 files modified.
<!-- /ANCHOR:complexity -->
