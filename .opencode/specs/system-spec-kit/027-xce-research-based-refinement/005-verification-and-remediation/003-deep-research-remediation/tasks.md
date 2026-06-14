---
title: "Tasks: Deep-Research Remediation Program [template:level_1/tasks.md]"
description: "Lane-ordered task list for remediating the 198 Fable-verified findings: L1 security and L8 adherence complete; L2–L7 and L9 remain, each following the verify-first per-finding loop."
trigger_phrases:
  - "029 remediation tasks"
  - "remediation lane tasks"
  - "verify first task loop"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/003-deep-research-remediation"
    last_updated_at: "2026-06-12T12:10:00Z"
    last_updated_by: "claude-fable-orchestrator"
    recent_action: "L1 + L8 lanes closed with Fable verdicts and scoped commits"
    next_safe_action: "Open L2 lane with a Fable batch still-real verify"
    blockers: []
    key_files:
      - "backlog/remediation-backlog.json"
    session_dedup:
      fingerprint: "sha256:2003d4aca44bb943b1eae69b36f1d9ebe8fe3f8a5e907a323dbee96013ac03b3"
      session_id: "029-remediation-resume-2026-06-12"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Research Remediation Program

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

- [x] T001 Bank backlog with Fable verdicts (backlog/remediation-backlog.json)
- [x] T002 Preflight: DB health + exactly one warm daemon
- [x] T003 [P] Dispatch fresh Fable dashboard true-solution investigation (L8-command-adherence/true-solution-investigation.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 live-237 single-writer DB lock + launcher exit-86 contract + standalone-opener adoption (mcp_server/lib/search/db-instance-lock.ts)
- [x] T005 tri-016 scrubber promotion to shared + fail-closed CLI save lane (shared/parsing/secret-scrubber.ts, scripts/core/workflow.ts)
- [x] T006 [P] tri-050 hash-only query fingerprints + legacy purge (mcp_server/lib/telemetry/consumption-logger.ts)
- [x] T007 [P] tri-005 write-ingress claim reconciliation (feature_catalog.md, 022 spec.md + implementation-summary.md)
- [x] T008 L8 winner: --command dispatch protocol + probe gauntlet + score-slot + placeholder sweep (cli-opencode SKILL.md, commands/)
- [ ] T009 L2 code-graph apply safety lane (28 findings)
- [ ] T010 L3 idempotency flag-ON blockers (5 findings)
- [ ] T011 L4 launcher lifecycle parity incl. mk-code-index dual-writer mirror (15 findings)
- [ ] T012 L5 advisor correctness lane (35 findings)
- [ ] T013 L6 save/continuity truth lane (17 findings)
- [ ] T014 L7 shadow/feedback honesty lane (19 findings)
- [ ] T015 L9 P2/P3 sweep (65 findings)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Fable adversarial re-verify every L1/L8 fix before commit (verify/*.md)
- [x] T017 Live deployment verification: lock refusal, legacy-row purge, daemon health
- [ ] T018 Per-lane Fable batch re-verify for L2–L9 as each lane ships
- [ ] T019 Final backlog reconciliation + program close-out
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every non-refuted backlog item carries a disposition with a Fable verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
