---
title: "Plan: 018/002 baseline fixture"
description: "Implementation phases for authoring the deterministic code-retrieval fixture"
trigger_phrases: ["018/002 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored implementation phases"
    next_safe_action: "Execute Phase 1: domain survey"
    blockers: []
    key_files:
      - "evidence/code-retrieval-fixture.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018002"
      session_id: "018-002-baseline-fixture-plan"
      parent_session_id: "018-002-baseline-fixture"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 018/002 baseline fixture

<!-- ANCHOR:summary -->
## 1. SUMMARY

Survey real source files across domains, author natural-language queries with mixed difficulty, validate every path, ship `code-retrieval-fixture.json` + a path-validation script.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Coverage | ≥ 10 pairs spanning ≥ 4 domains |
| Validity | Every `expected_source_path` exists + matches CocoIndex include patterns |
| Bias | Hand-review confirms no lexical leakage from source identifiers |
| Validator | `fixture-validate.sh` exits 0 |
| Strict-validate | Returns PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
evidence/
  code-retrieval-fixture.json   ←─ canonical fixture (consumed by 018/003)
  fixture-validate.sh           ←─ path-existence + indexability check
```

Pair schema:
```json
{ "query": "...", "expected_source_path": "...", "expected_symbol": "...",
  "difficulty": "easy|medium|hard", "category": "..." }
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Domain survey
- Pick 15-20 source files across: memory MCP handlers, code-graph lib, rescue layer, embedder adapters, spec-kit scripts, vitest cases, doc templates
- Capture path + symbol + 1-line description per source

### Phase 2: Query authoring
- Author natural-language queries; vary lexical overlap deliberately

### Phase 3: Validation
- `fixture-validate.sh` checks every path exists + matches CocoIndex include patterns

### Phase 4: Hand-review
- Walk through each pair; rewrite biased queries

### Phase 5: Ship + commit
- Write `evidence/code-retrieval-fixture.json` (pretty-printed)
- Write `evidence/fixture-validate.sh`
- Strict-validate + commit + push
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `fixture-validate.sh` must exit 0 on commit
- 018/003 will exercise the fixture against real embedders — fixture quality validated by getting non-zero, non-100% scores (any embedder scoring 0 OR 20/20 = mis-calibrated)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 018/001 (consumer: 018/003 needs the swap mechanism to use this fixture)
- CocoIndex's `DEFAULT_INCLUDED_PATTERNS` from `settings.py` (informs validator)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Fixture biased (1 embedder lands 18/20, another 5/20) | Audit pairs, rewrite biased queries |
| All embedders score < 5/20 | Queries too adversarial; lower difficulty mix |
| All embedders score > 18/20 | Queries too easy; raise difficulty mix |
<!-- /ANCHOR:rollback -->
