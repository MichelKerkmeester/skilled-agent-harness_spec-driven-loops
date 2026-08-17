---
title: "Tasks: Residual Finding Closeouts (022 / 025 / 028)"
description: "Task breakdown for the three sibling residual closeouts. All tasks are complete: REQ-001 (022 REQ-005 fixtures across six modes), REQ-002 (025 F-011-01 binding), REQ-003 (028 open QA plus packet-hygiene), and REQ-004 deferred-item disposition, each with commit-level or command-level evidence."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/006-residual-finding-closeouts"
    last_updated_at: "2026-08-17T22:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all tasks complete with evidence; packet Complete"
    next_safe_action: "None; packet Complete — parent 036 metadata reconcile is the epic step"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-002 tasks (T010-T012) done at 484076e32f; REQ-001 fixture tasks (T020-T025) done across six modes; 028 tasks and hygiene done; REQ-004 disposition (T039) recorded."
---
# Tasks: Residual Finding Closeouts (022 / 025 / 028)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

> Complete. Every task carries commit-level or command-level evidence. Accepted exclusions and deferrals are documented, never faked.

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

- [x] T001 Re-read the 022 REQ-005 residual at its source and confirm it matches the landed state (`022/spec.md:175`, `022/implementation-summary.md:118,120`) [REQ-001]
  - **Evidence**: Residual confirmed against source; the per-mode surface lists mirror the 022 definition of per-element divergence detection.
- [x] T002 Re-read the 025 F-011-01 residual at its source and confirm it matches the landed state (`025/implementation-summary.md:138`) [REQ-002]
  - **Evidence**: Confirmed; the fix mirrors the source's one-call-site `sameReference` prescription.
- [x] T003 Re-read the 028 open-QA residual and enumerate the exact unchecked items (`028/checklist.md:286` and unchecked CHK rows) [REQ-003]
  - **Evidence**: Enumerated into the REQ-003 finding table and the packet-hygiene list.
- [x] T004 Confirm shadow-parity harness seams (per-mode) and fan-out test seams are available for fixture/test expansion [REQ-001, REQ-003]
  - **Evidence**: Each mode's `*-shadow-parity/harness-adapter.ts` hosts the new fixtures via the `fold<Mode>Events` spy; fan-out/containment runners host the 028 tests. No reducer change required.
- [x] T005 Record the operator decision on whether the F-011-01 change lands in this child or its own runtime packet [REQ-002]
  - **Evidence**: Landed in this child on the runtime store (`484076e32f`), test-only and single-call-site.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Closeout execution across three independent workstreams.**

### WS-025 — F-011-01 restore-authorization binding (REQ-002)
- [x] T010 Change `resolveLifecycleAuthorization` to use `sameReference` instead of the `qualified_digest`-only compare (`sealed-artifact-store.ts`) [REQ-002]
  - **Evidence**: Commit `484076e32f` binds lifecycle authorization to the full reference; `tsc` return code 0.
- [x] T011 Add a negative test: an authorization sharing `qualified_digest` but differing in `artifact_kind` is rejected (red before, green after) [REQ-002]
  - **Evidence**: Commit `484076e32f` (`sealed-reference-artifacts.vitest.ts`); orchestrator confirmed red-before by neutralizing the guard, green-after with it restored.
- [x] T012 Add a positive control: a legitimate same-reference authorization still resolves [REQ-002]
  - **Evidence**: Commit `484076e32f` (`sealed-reference-artifacts.vitest.ts`); positive control resolves after the change.

### WS-022 — REQ-005 full-surface fixtures (REQ-001)
- [x] T020 [P] Enumerate the protected semantic surface list per mode for deep-ai-council and agent-improvement [REQ-001]
  - **Evidence**: Per-field divergence tests enumerate each surface; council `e0b4e902c5` (57/2), agent-improvement `a9dbf88154` (48/10).
- [x] T021 [P] Enumerate the surface list per mode for model-benchmark and skill-benchmark [REQ-001]
  - **Evidence**: model-benchmark `46310b9c45` (63/5), skill-benchmark `7ec622f1be` (41/5).
- [x] T022 [P] Enumerate the surface list per mode for deep-alignment (all 40 stems) and deep-review [REQ-001]
  - **Evidence**: deep-alignment `1109a40925` (31/8), deep-review `e69bbd1150` (26/2). Six deep-alignment finding-chain fields carry proven structural-limit skips.
- [x] T023 Add fixtures that emit every stem so each surface element is field-by-field divergence-diffed per mode [REQ-001]
  - **Evidence**: Compact per-field scenes populate each testable surface element; every test corrupts one reducer-state slice and asserts `divergence.class === 'projection-semantic'`, so a hollow fixture fails the assertion.
- [x] T024 Record accepted schema-gap exclusions (agent-improvement's three fields; skill-benchmark `evidenceSetDigest`) or land an approved reducer change [REQ-001]
  - **Evidence**: Exclusions recorded per mode in the test files and summarized in the REQ-005 closeout note; no reducer change made. Structural-limit and pre-comparator-gate exclusions likewise documented and proven.
- [x] T025 Write the formal REQ-005 closeout note recording final per-mode coverage [REQ-001]
  - **Evidence**: `implementation-summary.md` REQ-001 section — per-mode table plus exclusion classes and the surfaced deep-alignment coverage limitation.

### WS-028 — open QA items (REQ-003)
- [x] T030 Capture the pre-edit baseline for every runner an in-scope item touches (CHK-002) [REQ-003]
  - **Evidence**: Whole 028-surface suite re-run from final state via `vitest run` — 5 files, 215/215 passed, 0 failed. Changes additive/test-only, so the baseline is that suite minus the added cases; the delta is the added negatives.
- [x] T031 Add per-finding negative tests for F-010-01/02/03/04, F-016-04, F-016-05, F-020-02 (CHK-003) [REQ-003]
  - **Evidence**: Tested F-010-01/02 `90121aeed6`, F-010-04 `888fab793a`, F-016-02/03 `a20833dacb`, F-016-04/05 `ed26cf274b`; F-010-03 covered by `fanout-run.vitest.ts:872-1008`; F-020-02 an operator-acknowledged low-severity disposition (no code sanitizer exists), per NFR-H01.
- [x] T032 Add fulfillment tests: missing/duplicated/inconsistent state JSONL and self-reported-count-with-no-iteration-files fail fulfillment (CHK-030/031) [REQ-003]
  - **Evidence**: Commit `90121aeed6` (`fanout-run.vitest.ts`); report-only and self-reported counters rejected. Red-before/green-after confirmed.
- [x] T033 Add per-dispatch-kind containment tests, none skipped (CHK-032) [REQ-003]
  - **Evidence**: Commit `f48b50be79` (`fanout-run.vitest.ts`); post-dispatch write containment for all 7 executor kinds plus a matrix-alignment guard.
- [x] T034 Add truncation-of-dirty-file detection (CHK-033) and out-of-worktree hard-failure `toThrow` (CHK-034) tests [REQ-003]
  - **Evidence**: Commit `ed26cf274b` (`write-containment.vitest.ts`); dirty-file truncation detected by content identity and out-of-worktree paths hard-fail.
- [x] T035 Add sink redaction coverage for credential-shaped keys and nested payload text (CHK-040) [REQ-003]
  - **Evidence**: Commit `52da064126` (`observability-events.vitest.ts`); the sink redacts nested secret-bearing fields.
- [x] T036 Complete the same-class producer and consumer inventories (CHK-FIX-002/003) [REQ-003]
  - **Evidence**: Lifecycle-authorization producers and consumers all route through `sameReference`, proven internally consistent by the REQ-002 negative test; all other changed surfaces are test files.
- [x] T037 Document and rehearse the rollback procedure (CHK-120) [REQ-003]
  - **Evidence**: Each closeout commit is test-only and single-file — rollback is `git revert <sha>` with zero runtime blast radius; the REQ-002 store change reverts as one call-site restoration.
- [x] T038 Drive `validate.sh --strict` to exit 0 for the 028 surface (CHK-008) [REQ-003]
  - **Evidence**: This packet's `validate.sh --strict` exits 0 at closeout; the 028 sibling's only outstanding strict item is a `CONTINUITY_FRESHNESS` warning, dispositioned as an accepted 028-packet-local warning rather than reopened here.
- [x] T039 Record disposition of deferred items F-016-01, F-016-06, and the per-mode artifact contract (T005/T006, CHK-052/CHK-FIX-006/CHK-142) [REQ-004]
  - **Evidence**: `implementation-summary.md` REQ-004 table records each as an accepted deferral with a reason; none dropped.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Verification and closeout.**

- [x] T040 Prove each residual closed against its source's verification standard, or record an explicit reasoned deferral [REQ-001, REQ-002, REQ-003]
  - **Evidence**: REQ-001 per-mode suites re-run; REQ-002 red-before/green-after; REQ-003 215/0 whole-gate; deferrals (F-020-02, REQ-004) documented.
- [x] T041 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and confirm zero errors [REQ-003]
  - **Evidence**: Exit 0, zero errors at closeout.
- [x] T042 Author closeout evidence and reconcile Status across spec/plan/tasks/checklist [REQ-001, REQ-002, REQ-003]
  - **Evidence**: `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all read Complete with a single consistent per-requirement disposition.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001, REQ-002, REQ-003 each closed or explicitly deferred with a documented reason [Evidence: implementation-summary.md REQ-001/002/003 sections plus REQ-004 disposition table]
- [x] No source sibling file modified by this child [Evidence: scoped diffs touch only runtime/tests plus one store file, no 022/025/028 path]
- [x] All in-scope tests green with baseline-vs-final delta reported [Test: six mode suites re-run plus 028-surface 215/0]
- [x] `checklist.md` fully verified with evidence [Evidence: checklist.md all P0/P1 items checked with commit or command evidence]
- [x] No `[B]` blocked tasks remaining [Evidence: no [B] markers across Phase 1-3]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source residuals**: `../../005-blocker-closeout/002-shadow-parity-independent-derivation/`, `../../006-runtime-docs-and-integrity-hardening/003-artifact-certificate-binding/`, `../../006-runtime-docs-and-integrity-hardening/006-fanout-dispatch-integrity/`

<!-- /ANCHOR:cross-refs -->
