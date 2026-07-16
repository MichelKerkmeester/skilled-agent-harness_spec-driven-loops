---
title: "Tasks: Phase 7: routing-benchmark-and-review"
description: "Task list for the Lane-C hub benchmark and independent deep-review that resolve the deferred figma-transport routing question."
trigger_phrases:
  - "routing benchmark tasks"
  - "lane-c hub benchmark tasks"
  - "deep-review fold-in tasks"
  - "phase 007 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Executed benchmark + independent review; findings deferred to planning"
    next_safe_action: "Run the benchmark and review after integration lands"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: routing-benchmark-and-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 006 complete: hub identity wired, referrers repointed, advisor rebuilt [evidence: advisor rebuilt this program: generation 11997 to 11998, 18/18 skills; hub identity + referrers closed in phase 008's rollout record]
- [x] T002 Prepare Lane-C benchmark scenarios for the three modes, including figma-transport routing [evidence: 13/13 hub_routing scenarios exist (7 routing + 6 blind holdouts incl. figma-transport + MT-H01 boundary) via the corpus phase]
- [x] T003 [P] Scope the independent deep-review over the full fold-in diff [evidence: review scope = registry/router/`SKILL.md`/metadata + 13/13 hub scenarios + 49/49 packet recall scenarios; 4-iteration plan]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the Lane-C skill-benchmark; capture the report under `mcp-tooling/benchmark/router-final/` [evidence: `run-skill-benchmark.cjs --skill mcp-tooling --trace-mode router` verdict=PASS aggregate=95 scenarios=13; captured under `benchmark/baseline/` (frozen baseline naming per the storage guide supersedes the drafted `router-final/` label)]
- [x] T005 Run the independent deep-review pass; record P0/P1/P2 findings [evidence: `review-report.md` recorded: verdict FAIL, P0=3 P1=10 P2=2 across 4/4 iterations (state in `review/lineages/sol-review/`)]
- [x] T006 Resolve the figma-transport routing carve-out: keep metadata routing, or record a routing-config amendment against phase 002's ADR-001/ADR-006 [evidence: metadata routing KEPT; figma phrasing routes sk-design-first per doctrine but the committed positive scenario scores 0/13 figma keyword hits in lexical replay (verified against `hub-router.json`); remediation routed to the planning packet, 0 silent routing-config amendments]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm the benchmark report covers all three modes and the transport routing [evidence: benchmark covers 13/13 scenarios across all six modes incl. the transport routing rows]
- [x] T008 Confirm deep-review P0/P1 findings are resolved or explicitly deferred with rationale [evidence: 0/15 findings resolved in-phase by design (frozen scope: measurement and review only); 15/15 explicitly deferred to the remediation planning packet embedded in `review-report.md` (3 P0 verified against real files by the orchestrator: defaultResource, figma lexical miss, zero route-gold rows)]
- [x] T009 Run phase-folder validation [evidence: `validate.sh --strict --no-recursive` run at close-out]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Benchmark report generated; deep-review findings resolved or deferred; routing question closed with evidence [evidence: PASS 95 report pair in `benchmark/baseline/`; FAIL review with 15/15 findings deferred-to-planning in `review-report.md`; figma routing question answered empirically]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
