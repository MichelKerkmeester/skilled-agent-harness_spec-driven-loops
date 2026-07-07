---
title: "Tasks: Phase 9 — cutover and rollout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code cutover tasks"
  - "sk-code rollout runbook tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/009-cutover-and-rollout"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded branch tasks (done) and main-side rollout tasks (pending)"
    next_safe_action: "Merge, then run the main-side rollout runbook"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9 — cutover and rollout

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Setup (branch)
- [x] T001 [P] Map the cutover surface (alias sites, scorer entries, coupled corpora, ~350 NAME refs); evidence: 4 alias-definition sites, ~14-file scorer cluster, ~11 corpora, bucket map in plan.md.
- [x] T002 [P] Map version/changelog state; evidence: hub 4.0.0.0; code-review anchor mismatch (1.0.0.0 vs 1.5.0.0); 4 packets missing changelogs.
- [x] T003 [P] Scope the 3 cleanup items; evidence: 8 harness failures (7 sk-code + 1 sk-design), vocab hard-coding, CS-003 matcher — all with verified minimal fixes.
- [x] T004 Confirm worktree un-runnability; evidence: graph compiler `VALIDATION FAILED: 17 errors` (un-built dist paths); advisor TS vitest 16/18 files fail to load (`@spec-kit/shared`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (branch)
- [x] T005 Migrate the 8 harness tests to the hub layout; evidence: union surface router, packet-aware existence, count bumps (28→29), hub-mode intents; suite `8 failed → 1 failed`.
- [x] T006 Fix the 29-path smart_routing drift; evidence: all repointed to relocated/renamed files; `0` dead of 96.
- [x] T007 Generalize `parent-hub-vocab-sync`; evidence: `buildModePrefixes(registry)` from `workflowMode`; sk-design byte-identical; sk-code orphans 47→13.
- [x] T008 Fix the CS-003 matcher; evidence: `keywordHits` word-boundary guard for `review`; scenario routes `[implement]`; genuine-review control `[review]`.
- [x] T009 Fix the two fold-broken live refs; evidence: `setup-cp-sandbox.sh` → `sk-code` (syntax clean); dead README link removed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (branch) + main-side rollout (pending)
- [x] T010 Verify the branch cleanup; evidence: harness `1 failed | 98 passed` (1 = sk-design digest); replay checks green; 0 dead paths.
- [x] T011 Author the ordered main-side rollout runbook; evidence: `implementation-summary.md` § Main-Side Rollout Runbook (8 steps, per-step verification).
- [ ] T012 [B] MAIN: remove advisor scorer identity (TS+Python), rebaseline corpora, regen graph, reindex.
- [ ] T013 [B] MAIN: delete the 4 alias sites; repoint ~350 NAME refs; cut the version release.
- [ ] T014 [B] MAIN: full verification (advisor vitest/parity, pytest, benchmark ~71, `parent-skill-check.cjs` re-confirm, `validate.sh --recursive`, harness suite fully green incl. regenerating the sk-design dispatch-boundary fixture digest, vocab-sync 0 orphans/collisions, 0 live sk-code-review refs).
- [ ] T017 [B] MAIN: packet close-out — flip T012–T017 with evidence, set 009 + parent spec/graph-metadata to Complete (pct 100), update goal memory + MEMORY.md, final report; optional live-mode benchmark with its own user go.
- [x] T015 Review pass: canonical-scope `parent-skill-check.cjs` 3d; evidence: sk-code AND the reference hub sk-design both failed 10 invariants (validator hard-coded the canonical taxonomy; CI only ran the default target); after scoping, all three hubs pass and the canonical output is unchanged.
- [x] T016 Review pass: add `reviewer` keyword/alias; evidence: the word-boundary fix had traded the `preview` false-positive for a `reviewer` false-negative; after the add, reviewer task → `[review]`, CS-003 → `[implement]`, vocab-sync 18→18, benchmark 71/zero diffs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Branch tasks (T001–T011) complete and verified.
- [x] Main-side tasks (T012–T014) specified as an ordered, verifiable runbook (blocked on post-merge `dist`).
- [x] Final phase of the packet; parent rollup follows after the main-side rollout.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (NAME-ref bucket map)
- **Checklist**: See `checklist.md`
- **Summary + Runbook**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
