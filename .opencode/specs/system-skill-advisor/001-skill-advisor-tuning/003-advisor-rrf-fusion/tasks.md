---
title: "Tasks: Advisor RRF Fusion Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "advisor routing labeled set"
  - "advisor rrf vs weighted sum harness"
  - "read-only advisor projection copy"
  - "advisor scoreAdvisorPrompt matrix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/003-advisor-rrf-fusion"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and the labeled set, run complete"
    next_safe_action: "Compute metrics and author the results docs"
    blockers: []
    key_files:
      - "scripts/advisor-rrf-benchmark.mjs"
      - "scripts/labeled-routing-set.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Advisor RRF Fusion Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm the production scorer entry point and the dist bundle carry the RRF tiebreak, the conflict adjustment and the self-guard, and read the conflict path multiplier and the guard branches (`dist/mcp_server/lib/scorer/fusion.js`)
- [x] T002 Confirm the read-only projection backup mechanism through `MK_SKILL_ADVISOR_DB_DIR` (`dist/mcp_server/lib/scorer/projection.js`)
- [x] T003 Build the 42-prompt labeled routing set grounded in the corpus trigger phrases across five bands, including the self_guard and conflict bands (`scripts/labeled-routing-set.mjs`)
- [x] T003b Build the conflict-edge overlay that gives the conflict-rerank seam real `conflicts_with` mass in-memory (`scripts/conflict-overlay.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the matrix harness that copies the live database read-only, points the loader at a scratch copy and scores the conflict band against the overlay (`scripts/advisor-rrf-benchmark.mjs`)
- [x] T005 Run the three arms by toggling the flag readers, capturing per-prompt top-1, plus the self-guard and conflict differentials (`scripts/advisor-rrf-benchmark.mjs`)
- [x] T006 Compute aggregate top-1 correctness, the per-band breakdown, the agreement spread versus baseline and the two seam differentials (`scripts/advisor-rrf-benchmark.mjs`)
- [x] T007 Add the determinism pass, the default-off byte-identity pass and the overlay-inert-when-off check and write the rollup (`results/metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the run reproduces exit 0 and the source database hash is unchanged (`scripts/advisor-rrf-benchmark.mjs`)
- [x] T009 Author the per-prompt, aggregate and per-seam data tables grounded strictly in metrics.json (`benchmark-results.md`)
- [x] T010 Author the per-seam graduate and cut verdicts and the recommendation (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
