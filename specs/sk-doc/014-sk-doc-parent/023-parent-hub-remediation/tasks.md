---
title: "Tasks: Parent-hub remediation program"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "parent hub remediation tasks"
  - "014 sk-doc phase 023 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/023-parent-hub-remediation"
    last_updated_at: "2026-07-07T15:55:58.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-023 tasks (WU roadmap)"
    next_safe_action: "Resolve D1-D6; execute WU1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: Parent-hub remediation program

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Map all 18 findings (PS-01..PS-18) to nine work units
- [x] T002 Surface the six decision forks with recommended defaults
- [x] T003 Operator resolved D1-D6 → "Execute all on my defaults" (recommended defaults; D1 refined to allowlist feature_catalog, D5 refined to bless top-level deprecatedModes)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 WU1 [P0] Canonize the transport axis; allowlist feature_catalog; restore 4/4 canon-clean (PS-01) — `f788c86932`
- [x] T005 WU2 surfaceBundle → conditional + base-outcome check 5g (PS-02) — `7fa386544b`
- [x] T006 [P] WU3 One-identity ingestion guard + node_modules skip; RED/GREEN fixture (PS-03) — `4c33c79b0f`
- [x] T007 [P] WU4 sk-code tool contracts: D2 keep-false+annotate + drop Task + checker 3i/3j (PS-04, PS-05) — `4ba60fb0cd`
- [B] T008 WU5 Command-bridge lane under contract + drift guard; refresh dead ids (PS-06, PS-07) — GATED on the operator-owned system-skill-advisor scorer track (projection.ts/explicit.ts/skill_advisor.py + the gated 193-row parity re-baseline). Dead ids CONFIRMED as evidence.
- [x] T009 WU6 sk-design one-file truth pass (PS-08, PS-09, PS-10, PS-17-case) — `045d748511`
- [x] T010 [P] WU7 Doctrine refresh sweep (PS-11, PS-12, PS-13, PS-17, PS-18) — `f192cdb688`
- [x] T011 [P] WU8 Checker hardening batch, 5 rules RED/GREEN-proven (PS-14) — `c968b04771`
- [x] T012 [P] WU9 Metadata dialect convergence, sk-hub family (PS-15, PS-16) — `1fc620e83e`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 parent-skill-check.cjs 0/0 on all four hubs (final sweep: "all hard invariants passed, 0 warnings" x4); ingestion guard proven with a RED/GREEN fixture
- [B] T014 Advisor drift-guard + parity vitests green; every bridge id resolves to a live command — GATED with WU5 (advisor scorer track)
- [x] T015 validate.sh --strict on the 023 packet folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 18 findings mapped to work units; 6 forks surfaced
- [x] D1-D6 resolved ("Execute all on my defaults")
- [x] WU1-WU4, WU6-WU9 executed + pushed (8 commits); WU5 gated on the advisor scorer track
- [x] 4/4 canon-clean (0 warnings x4); validate --strict clean; advisor guard deferred with WU5
- [ ] One `[B]` remaining: WU5/T014 (advisor command-bridge — operator-gated, dead-id evidence captured)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source review**: See `../022-parent-skill-logic-review/review-report.md`
<!-- /ANCHOR:cross-refs -->
