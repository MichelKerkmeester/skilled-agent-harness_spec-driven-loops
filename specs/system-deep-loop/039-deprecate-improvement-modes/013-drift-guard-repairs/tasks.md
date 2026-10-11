---
title: "Tasks: Phase 13: drift-guard-repairs"
description: "Track the two repair lanes, integration review, verification and release closeout."
trigger_phrases:
  - "drift guard repairs tasks"
  - "router-sync baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: drift-guard-repairs

Track the two parallel repairs, then review their evidence and complete the verification and release steps below.

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
## Phase 1: Repair Lanes

- [x] T001 [P] Update router-sync check 1b to skip Git-ignored files and add regression cases for ignored and non-ignored untracked docs (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs`, `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs`). Evidence: [lane-01-router-sync-ignored.txt](scratch/evidence/lane-01-router-sync-ignored.txt).
- [x] T002 [P] Recapture the full corpus baseline under this child and repoint the workflow without changing its floors (`scripts/capture-top3.mjs`, `baseline/`, `.github/workflows/routing-registry-drift.yml`). Evidence: [lane-02-baseline-recapture.txt](scratch/evidence/lane-02-baseline-recapture.txt).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Review and Metadata

- [x] T003 Review both lane diffs and evidence files against `scratch/files.txt` and the scope in `spec.md`. Evidence: [review-opus-high.txt](scratch/evidence/review-opus-high.txt).
- [x] T004 Refresh `description.json` and `graph-metadata.json` from the final packet docs. Evidence: [decision-ledger.txt](scratch/evidence/decision-ledger.txt) records the completion-80 re-derive. Final generated metadata checks remain with the orchestrator.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Closeout

- [x] T005 Run the router-sync regression test, check 1b and full drift-guard script. Evidence: [lane-01-router-sync-ignored.txt](scratch/evidence/lane-01-router-sync-ignored.txt).
- [x] T006 Verify the recaptured baseline hashes and metrics, then run the golden prompt suite, scorer ratchet and corpus scorer at the existing floors. Evidence: [lane-02-baseline-recapture.txt](scratch/evidence/lane-02-baseline-recapture.txt).
- [x] T007 Run strict validation on this child and its parent. Resolve every error except generated metadata integrity and drift, which the orchestrator repairs. Evidence: the child and parent `validate.sh --strict` output from this closeout, plus [decision-ledger.txt](scratch/evidence/decision-ledger.txt) for the prior re-derive.
- [x] T008 Commit the reviewed scoped changes. Commits: `52a54da631`, `b7a961af64`, `ce539b8ee6`, `326f138e33`. CI run: `38147728254`. Evidence: [post-push-ci.txt](scratch/evidence/post-push-ci.txt).
- [x] T009 Push the branch to main. Commits: `52a54da631`, `b7a961af64`, `ce539b8ee6`, `326f138e33`. CI run: `38147728254`. Evidence: [post-push-ci.txt](scratch/evidence/post-push-ci.txt).
- [x] T010 Confirm the routing drift CI workflow passes on main. Commits: `52a54da631`, `b7a961af64`, `ce539b8ee6`, `326f138e33`. CI run: `38147728254`. Evidence: [post-push-ci.txt](scratch/evidence/post-push-ci.txt).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Both requirements in `spec.md` pass their stated checks. Evidence: [lane-01-router-sync-ignored.txt](scratch/evidence/lane-01-router-sync-ignored.txt), [lane-02-baseline-recapture.txt](scratch/evidence/lane-02-baseline-recapture.txt) and [post-push-ci.txt](scratch/evidence/post-push-ci.txt).
- [x] All tasks are marked `[x]`. Evidence: [lane-03-final-gate.txt](scratch/evidence/lane-03-final-gate.txt), [lane-04-post-rebase-gate.txt](scratch/evidence/lane-04-post-rebase-gate.txt) and [post-push-ci.txt](scratch/evidence/post-push-ci.txt).
- [x] No blocked task remains. Evidence: [decision-ledger.txt](scratch/evidence/decision-ledger.txt) and [post-push-ci.txt](scratch/evidence/post-push-ci.txt).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
