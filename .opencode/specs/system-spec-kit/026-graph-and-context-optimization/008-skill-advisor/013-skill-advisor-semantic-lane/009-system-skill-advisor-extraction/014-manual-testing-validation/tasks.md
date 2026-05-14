---
title: "Tasks: 014 Manual Testing Validation"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/014-manual-testing-validation"
    last_updated_at: "2026-05-14T18:06:00Z"
    last_updated_by: "opencode-go/glm-5.1"
    recent_action: "All tasks complete"
    next_safe_action: "Finalize and commit"
    blockers: []
    completion_pct: 100
---

# Tasks: 014 Manual Testing Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:t1-preflight -->
## T1 — Pre-flight and Inventory

- [x] Confirm on `main` branch
- [x] Scaffold packet 014 directory structure
- [x] Inventory all 42 scenario files into results/scenario-run-log.md

<!-- /ANCHOR:t1-preflight -->

---

<!-- ANCHOR:t2-nc -->
## T2 — Native MCP Tools (NC-001..NC-006)

- [x] NC-001: advisor_recommend happy path via MCP
- [x] NC-002: advisor_status transitions via MCP
- [x] NC-003: advisor_validate slices via MCP
- [x] NC-004: Ambiguous brief rendering via MCP
- [x] NC-005: Lifecycle redirect metadata via MCP
- [x] NC-006: Advisor status/rebuild separation via MCP

<!-- /ANCHOR:t2-nc -->

---

<!-- ANCHOR:t3-lc -->
## T3 — Lifecycle Routing (LC-001..LC-005)

- [x] LC-001: Age haircut via lane attribution inspection
- [x] LC-002: Supersession via skill_graph_query
- [x] LC-003: Archive handling via skill_graph_query
- [x] LC-004: Schema migration via skill_graph_status
- [x] LC-005: Rollback lifecycle via advisor_recommend + advisor_status

<!-- /ANCHOR:t3-lc -->

---

<!-- ANCHOR:t4-sc -->
## T4 — Scorer Fusion (SC-001..SC-005)

- [x] SC-001: Five-lane fusion weights via advisor_status.laneWeights
- [x] SC-002: Projection via skill_graph_query
- [x] SC-003: Top-2 ambiguity via advisor_recommend
- [x] SC-004: Lane attribution via advisor_recommend laneBreakdown
- [x] SC-005: Ablation protocol via advisor_validate slices

<!-- /ANCHOR:t4-sc -->

---

<!-- ANCHOR:t5-au -->
## T5 — Auto-Update Daemon (AU-001..AU-005)

- [x] AU-001: Watcher narrow scope via advisor_status generation tracking
- [x] AU-002: Lease single-writer via advisor_rebuild behavior
- [x] AU-003: Daemon lifecycle/shutdown via advisor_status trustState
- [x] AU-004: Generation-tagged publication via advisor_status generation field
- [x] AU-005: Rebuild from source via advisor_rebuild with force:true

<!-- /ANCHOR:t5-au -->

---

<!-- ANCHOR:t6-cl -->
## T6 — CLI Hooks and Plugin (CL-001, CL-003..CL-005)

- [x] CL-001: Claude user-prompt-submit hook (file read verification)
- [x] CL-003: Gemini user-prompt-submit hook (file read verification)
- [x] CL-004: Codex hook/wrapper (file read verification)
- [x] CL-005: OpenCode plugin bridge (MCP validation)

<!-- /ANCHOR:t6-cl -->

---

<!-- ANCHOR:t7-ai -->
## T7 — Auto-Indexing (AI-001..AI-005)

- [x] AI-001: Derived extraction via skill_graph_scan
- [x] AI-002: Sanitizer boundaries via advisor_recommend (no prompt leaks)
- [x] AI-003: Provenance/fingerprints via skill_graph_query
- [x] AI-004: DF/IDF corpus stats via advisor_status skillCount
- [x] AI-005: Anti-stuffing via advisor_validate safety slice

<!-- /ANCHOR:t7-ai -->

---

<!-- ANCHOR:t8-p2 -->
## T8 — P2 Sample Scenarios

- [x] CP-001..CP-004 (file read + schema inspection)
- [x] OP-001..OP-003 (handler code inspection)
- [x] PC-001..PC-005 (Python shim + CLI flag verification)

<!-- /ANCHOR:t8-p2 -->

---

<!-- ANCHOR:t9-gaps -->
## T9 — Gap Analysis and Scenario Creation

- [x] Identify P0/P1 gaps — none found
- [x] No new scenarios needed (0 created, cap was 5)

<!-- /ANCHOR:t9-gaps -->

---

<!-- ANCHOR:t10-final -->
## T10 — Final Validation and Commit

- [x] Final binding counts in implementation-summary.md
- [x] Strict-validate PASS
- [x] Commit on main
- [x] Update parent metadata

<!-- /ANCHOR:t10-final -->