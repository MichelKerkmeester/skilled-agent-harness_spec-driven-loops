---
title: "Plan: 021/003 embedder pluggability narrative"
description: "Phases for the Opus-driven canonical narrative"
trigger_phrases: ["021/003 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/003-embedder-pluggability-narrative"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored phases"
    next_safe_action: "Dispatch markdown agent (Opus)"
    blockers: []
    key_files: ["evidence/embedder-pluggability.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021003"
      session_id: "021-003-embedder-pluggability-narrative-plan"
      parent_session_id: "021-003-embedder-pluggability-narrative"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 021/003 embedder pluggability narrative

<!-- ANCHOR:summary -->
## 1. SUMMARY

Opus-class markdown agent reads 016/004 decision-record + cocoindex_code/registered_embedders.py + 018/001 config.py + 019 spec docs. Synthesizes single canonical narrative at `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` (≤ 600 LOC). Cross-link from CocoIndex INSTALL_GUIDE + root README.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Coverage | Both MCPs explained equally |
| Citations | ADRs + commit SHAs referenced |
| Size cap | ≤ 600 LOC |
| Cross-links | INSTALL_GUIDE + README updated |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
markdown agent (Opus)
  ↓ reads: 016/004 dec-record, registered_embedders.py, config.py, 019 specs
  ↓ synthesizes: embedder-pluggability.md (≤ 600 LOC)
  ↓ updates: cross-links in INSTALL_GUIDE + root README
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch
- Author Opus markdown-agent prompt with source list + output spec + 600-LOC cap

### Phase 2: Review
- Spot-check citations resolve
- Verify out-of-box matrix is accurate

### Phase 3: Cross-link wiring
- Add link from CocoIndex INSTALL_GUIDE §4
- Add link from root README (handled by 021/002)

### Phase 4: Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Citation spot-check
- Read-through with "new contributor" framing
- LOC count vs 600 cap
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- markdown agent (Opus)
- 016/004 decision-record.md
- 019/001 registered_embedders.py
- 018/001 config.py
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| LOC > 600 | Trim or split into 2 docs |
| Hallucinated facts | Revert; tighten dispatch prompt with citation-mandate |
| Out-of-date within days | Add "last validated against commit X" footer |
<!-- /ANCHOR:rollback -->
