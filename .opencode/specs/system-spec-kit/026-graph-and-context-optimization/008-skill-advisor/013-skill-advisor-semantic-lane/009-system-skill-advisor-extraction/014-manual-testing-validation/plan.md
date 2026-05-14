---
title: "Plan: 014 Manual Testing Validation"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/014-manual-testing-validation"
    last_updated_at: "2026-05-14T18:06:00Z"
    last_updated_by: "opencode-go/glm-5.1"
    recent_action: "Manual testing plan executed"
    next_safe_action: "Finalize and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---

# Plan: 014 Manual Testing Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1 — Pre-flight + Scaffold

1. Confirm `git branch --show-current` = `main`.
2. Scaffold packet 014 with all Level 2 docs + `results/` subdir + `scenario-run-log.md` stub.
3. Inventory all 42 scenario files into the run log table header.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2 — Run Scenarios (P0 + P1 Priority)

### P0 Categories (full coverage)

- **01 — Native MCP Tools (NC-001..NC-006)**: Call `advisor_recommend`, `advisor_status`, `advisor_validate`, `advisor_rebuild` directly via OpenCode MCP tools. Verify prompt-safety, thresholds, freshness, ambiguity, lifecycle metadata, rebuild separation.
- **07 — Lifecycle Routing (LC-001..LC-005)**: Validate via advisor_recommend with lifecycle-attributed skills. Age haircut, supersession, archive handling queries.
- **08 — Scorer Fusion (SC-001..SC-005)**: Validate lane weights, projection, ambiguity, attribution via advisor_status.laneWeights and advisor_recommend laneBreakdown.
- **05 — Auto-Update Daemon (AU-001..AU-005)**: Test watcher narrow scope, generation bumps, rebuild-from-source via advisor_status generation tracking.

### P1 Categories (full coverage)

- **02 — CLI Hooks and Plugin (CL-001, CL-003..CL-005)**: Read hook files; verify OpenCode plugin bridge via direct MCP call.
- **06 — Auto-Indexing (AI-001..AI-005)**: Validate derived extraction, sanitizer boundaries, provenance via skill_graph_scan + skill_graph_query.

### P2 Categories (sample: 1-2 per category)

- **03 — Compat and Disable (CP-001..CP-004)**: Read shim scripts; verify force flags in schemas.
- **04 — Operator H5 (OP-001..OP-003)**: Read handler code for degraded/quarantined/unavailable states.
- **10 — Python Compat (PC-001..PC-005)**: Read Python shim; verify CLI flags.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3 — Gap Creation (Cap 5)

For each P0/P1 GAP identified:
- Create scenario doc under appropriate category dir
- Use sk-doc playbook template structure
- Document scenario name, pre-conditions, steps, expected output, verification

Result: No P0/P1 gaps identified. All 8 advisor MCP tools are live-callable. No new scenarios needed.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4 — Verify + Commit

1. Final binding counts in implementation-summary.md
2. Validate via `spec/validate.sh --strict`
3. Commit on `main`

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5 — Parent Continuity

- Update parent handover.md §9 with 014 results line
- Update parent graph-metadata.json children_ids + last_active_child_id

<!-- /ANCHOR:phase-5 -->