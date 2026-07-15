---
title: "109: 026 restructure execution Wave 2 (998 PROCEED operations)"
description: "Execute 998 Wave 2 PROCEED operations: 000-release-cleanup 6-sub-phase recatalog, 006-skill-advisor 5-sub-phase internal structure, parent-doc derived fields, SHALLOW+MEDIUM→DEEP archive. Reduced from 998's full 4-op plan."
trigger_phrases:
  - "109 spec"
  - "026 wave 2 execution"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/088-subphase-recatalog-and-archive"
    last_updated_at: "2026-05-16T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 109 Wave 2 executor"
    next_safe_action: "W2.A graph-metadata sync"
    blockers: []
    key_files:
      - "998-aggressive-restructure-research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:877aa9719e48648b5f446d14df9c94096c41d5526c814d323920ac75c09ff946"
      session_id: "109-spec"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Baseline: 7b138f18c"
      - "Source plan: 998/resource-map.md §3-§4"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 109: 026 restructure execution Wave 2

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Source plan** | 998/resource-map.md |
| **Baseline** | `7b138f18c` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Execute 998's 4 PROCEED Wave 2 operations: graph-metadata sync (000 7→59, 008 13→26), 000-release-cleanup 6-sub-phase recatalog, 006-skill-advisor 5-sub-phase internal structure, SHALLOW+MEDIUM reclassification archive, parent-doc derived fields. Per-operation immediate commit, per-wave HEAD baseline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (6 sub-waves)

- W2.A graph-metadata sync (LOW risk)
- W2.B 000 recatalog (HIGHEST impact: 59 children → 6 sub-phases)
- W2.C M10 unblock (015 → 000/002-audit/<NN>)
- W2.D 008 5 sub-phases (26 children → skill-graph/scorer/router/hardening/docs)
- W2.E SHALLOW+MEDIUM → DEEP archive (16 packets)
- W2.F parent-doc rewrites + index refresh

### Out of Scope

REDESIGN/ABORT operations from 998: 003+005 merge, 012+006 merge, 010 dissolution, cross-parent quality gates, 008 internal phase EXECUTION (only STRUCTURE in W2.D).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | 000 graph-metadata children_ids = filesystem actuals (59) |
| REQ-002 | 008 graph-metadata children_ids = filesystem actuals (26) |
| REQ-003 | 000 has 6 sub-phases with classification per iter 003 |
| REQ-004 | 008 has 5 sub-phases with clustering per iter 005 |
| REQ-005 | 015 absorbed under 000/002-audit/ |
| REQ-006 | 16 packets archived to z_archive/wave-2-reclassified/ |
| REQ-007 | 026 parent docs reflect Wave 2 state |
| REQ-008 | Strict-validate exits 0 on 109 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 sub-waves committed on main
- 000 sub-phase structure visible in filesystem
- 008 sub-phase structure visible in filesystem
- 109 strict-validate exits 0
- Final push to origin
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| W2.B 000 move breaks 200+ cross-refs | High | High | Per-batch commit; cross-ref sweep |
| 008 cluster ambiguity | Medium | Medium | Default to larger cluster per iter 005 |
| Parallel agent commits interleave | Medium | Low | Per-op atomic commit; tolerate misattribution |

### Dependencies

- 998 resource-map.md
- 999 research/iterations/iteration-003.md (000 mapping)
- 999 research/iterations/iteration-005.md (008 clustering)
- iter 009 + 010 (SHALLOW/MEDIUM list)
- Baseline 7b138f18c
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

Performance: ~2-4h wall-clock. Atomic per-op commits.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- 000 dup-prefixed packets (003-vitest-baseline-recovery vs 002-search-query-rag-optimization; 004-search-rag-measurement-driven-implementation vs 002-vitest-recovery-followup): rename via -alt suffix before sub-phase move
- 008 children straddling clusters: default to LARGER cluster
- 014/008 + 014/023 reclassified from MEDIUM to SHALLOW: exclude from W2.E
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

Will resolve during execution; documented in implementation-summary post-completion.
<!-- /ANCHOR:questions -->
