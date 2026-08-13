---
title: "Tasks: Residual Finding Closeouts (022 / 025 / 028)"
description: "Planned task breakdown for the three sibling residual closeouts. Every task maps to REQ-001 (022 REQ-005 fixtures), REQ-002 (025 F-011-01 binding), or REQ-003 (028 open QA). All tasks are pending; nothing is marked complete in this scaffold."
trigger_phrases:
  - "residual finding closeouts tasks"
  - "REQ-005 fixture tasks"
  - "F-011-01 binding tasks"
  - "028 open QA tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/051-residual-finding-closeouts"
    last_updated_at: "2026-08-12T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked WS-025 and 028 substantive-test tasks done with commit evidence"
    next_safe_action: "Close 028 packet-hygiene, then REQ-001/REQ-004, or defer per operator"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "REQ-002 tasks (T010-T012) done at 484076e32f; 028 substantive negative-test tasks done with verified commits; hygiene, REQ-001, and REQ-004 tasks remain open."
---
# Tasks: Residual Finding Closeouts (022 / 025 / 028)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

> Planned scaffold. Every task is pending. No task is marked `[x]` and no `implementation-summary.md` exists while Status is Planned.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (surface) [REQ ref]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Intake and seam confirmation.**

- [ ] T001 Re-read the 022 REQ-005 residual at its source and confirm it matches the landed state (`022/spec.md:175`, `022/implementation-summary.md:118,120`) [REQ-001]
- [ ] T002 Re-read the 025 F-011-01 residual at its source and confirm it matches the landed state (`025/implementation-summary.md:138`) [REQ-002]
- [ ] T003 Re-read the 028 open-QA residual and enumerate the exact unchecked items (`028/checklist.md:286` and unchecked CHK rows) [REQ-003]
- [ ] T004 Confirm shadow-parity harness seams (per-mode) and fan-out test seams are available for fixture/test expansion [REQ-001, REQ-003]
- [ ] T005 Record the operator decision on whether the F-011-01 change lands in this child or its own runtime packet [REQ-002]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Closeout execution across three independent workstreams.**

### WS-025 — F-011-01 restore-authorization binding (REQ-002)
- [x] T010 Change `resolveLifecycleAuthorization` to use `sameReference` instead of the `qualified_digest`-only compare (`sealed-artifact-store.ts`) [REQ-002]
  - **Evidence**: Commit `484076e32f` binds lifecycle authorization to the full reference in `sealed-artifact-store.ts`; `tsc` return code 0.
- [x] T011 Add a negative test: an authorization sharing `qualified_digest` but differing in `artifact_kind` is rejected (red before, green after) [REQ-002]
  - **Evidence**: Commit `484076e32f` (`sealed-reference-artifacts.vitest.ts`); orchestrator confirmed red-before by neutralizing the guard, green-after with it restored.
- [x] T012 Add a positive control: a legitimate same-reference authorization still resolves [REQ-002]
  - **Evidence**: Commit `484076e32f` (`sealed-reference-artifacts.vitest.ts`); positive control resolves after the change.

### WS-022 — REQ-005 full-surface fixtures (REQ-001)
- [ ] T020 [P] Enumerate the protected semantic surface list per mode for deep-ai-council and agent-improvement [REQ-001]
- [ ] T021 [P] Enumerate the surface list per mode for model-benchmark and skill-benchmark [REQ-001]
- [ ] T022 [P] Enumerate the surface list per mode for deep-alignment (all 40 stems) and deep-review [REQ-001]
- [ ] T023 Add fixtures that emit every stem so each surface element is field-by-field divergence-diffed per mode [REQ-001]
- [ ] T024 Record accepted schema-gap exclusions (agent-improvement's three fields; skill-benchmark `evidenceSetDigest`) or land an approved reducer change [REQ-001]
- [ ] T025 Write the formal REQ-005 closeout note recording final per-mode coverage [REQ-001]

### WS-028 — open QA items (REQ-003)
- [ ] T030 Capture the pre-edit baseline for every runner an in-scope item touches (CHK-002) [REQ-003]
  - **Status**: OPEN. 028-packet-hygiene bookkeeping, not runtime work.
- [ ] T031 Add per-finding negative tests for F-010-01/02/03/04, F-016-04, F-016-05, F-020-02 (CHK-003) [REQ-003]
  - **Status**: SUBSTANTIVELY MET, left unchecked because one named finding is dispositioned rather than tested (NFR-H01). Tested: F-010-01/02 `90121aeed6`, F-010-04 `888fab793a`, F-016-02/03 `a20833dacb`, F-016-04/05 `ed26cf274b`. Covered by existing suite: F-010-03 (`fanout-run.vitest.ts:872-1008`). Dispositioned low-severity, no test: F-020-02 (no sanitizer exists; operator/config-authored label).
- [x] T032 Add fulfillment tests: missing/duplicated/inconsistent state JSONL and self-reported-count-with-no-iteration-files fail fulfillment (CHK-030/031) [REQ-003]
  - **Evidence**: Commit `90121aeed6` (`fanout-run.vitest.ts`); report-only and self-reported counters are rejected. Red-before/green-after confirmed by the orchestrator.
- [x] T033 Add per-dispatch-kind containment tests, none skipped (CHK-032) [REQ-003]
  - **Evidence**: Commit `f48b50be79` (`fanout-run.vitest.ts`); post-dispatch write containment runs for all 7 executor kinds plus a matrix-alignment guard.
- [x] T034 Add truncation-of-dirty-file detection (CHK-033) and out-of-worktree hard-failure `toThrow` (CHK-034) tests [REQ-003]
  - **Evidence**: Commit `ed26cf274b` (`write-containment.vitest.ts`); dirty-file truncation detected by content identity and out-of-worktree paths hard-fail.
- [x] T035 Add sink redaction coverage for credential-shaped keys and nested payload text (CHK-040) [REQ-003]
  - **Evidence**: Commit `52da064126` (`observability-events.vitest.ts`); the sink redacts nested secret-bearing fields.
- [ ] T036 Complete the same-class producer and consumer inventories (CHK-FIX-002/003) [REQ-003]
  - **Status**: OPEN. 028-packet-hygiene bookkeeping, not runtime work.
- [ ] T037 Document and rehearse the rollback procedure (CHK-120) [REQ-003]
  - **Status**: OPEN. 028-packet-hygiene bookkeeping, not runtime work.
- [ ] T038 Drive `validate.sh --strict` to exit 0 for the 028 surface (CHK-008) [REQ-003]
  - **Status**: OPEN. The 028 packet carries a CONTINUITY_FRESHNESS warning; documentation/evidence item, not runtime work.
- [ ] T039 Record disposition of deferred items F-016-01, F-016-06, and the per-mode artifact contract (T005/T006, CHK-052/CHK-FIX-006/CHK-142) [REQ-004]
  - **Status**: OPEN. REQ-004 disposition still pending.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Verification and closeout.**

- [ ] T040 Prove each residual closed against its source's verification standard, or record an explicit reasoned deferral [REQ-001, REQ-002, REQ-003]
- [ ] T041 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <051-folder> --strict` and confirm zero errors [REQ-003]
- [ ] T042 Author closeout evidence and reconcile Status across spec/plan/tasks/checklist [REQ-001, REQ-002, REQ-003]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-001, REQ-002, REQ-003 each closed or explicitly deferred with a documented reason
- [ ] No source sibling file modified by this child
- [ ] All in-scope tests green with baseline-vs-final delta reported
- [ ] `checklist.md` fully verified with evidence
- [ ] No `[B]` blocked tasks remaining

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source residuals**: `../../005-blocker-closeout/022-shadow-parity-independent-derivation/`, `../../006-runtime-docs-and-integrity-hardening/025-artifact-certificate-binding/`, `../../006-runtime-docs-and-integrity-hardening/028-fanout-dispatch-integrity/`

<!-- /ANCHOR:cross-refs -->
