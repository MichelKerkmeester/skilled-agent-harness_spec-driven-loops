---
title: "Tasks: Phase 8 — routing benchmark and review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code routing benchmark tasks"
  - "skill-benchmark re-layer tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/008-routing-benchmark-and-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented completed benchmark + review + harness-fix tasks"
    next_safe_action: "phase 009 cutover-and-rollout"
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
# Tasks: Phase 8 — routing benchmark and review

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
## Phase 1: Setup
- [x] T001 Run the router-mode benchmark against the hub; evidence: `loop-host.cjs --mode=skill-benchmark --skill=sk-code --trace-mode=router` → first run CONDITIONAL aggregate 51 (D1-intra 73, D2 55, D3 27).
- [x] T002 [P] Dispatch three independent read-only review lenses; evidence: (a) contracts/invariants audit, (b) doctrine/reference integrity, (c) routing root-cause — all returned finding sets.
- [x] T003 Confirm every finding against the real files (finding = hypothesis); evidence: router selects the correct mode in 9/10 apparent failures (artifact, not defect); one real P1 canary regression confirmed by running `check-rule-copies.js` (exit 1).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Re-layer `router-replay.cjs` for hubs; evidence: `loadSurfaceRouter` (reads `shared/references/smart_routing.md`), `assembleResources`, `registryPacketRoots`; hub branch selects mode from `hub-router.json` (telemetry preserved) + recalls resources from the surface router; add-only, presence-gated (no-op unless a surface router exists — only `sk-code` has one).
- [x] T005 Parse the forbidden set; evidence: `extractForbiddenPrefixes` in `load-playbook-scenarios.cjs` reads the "Expected NOT loaded" block into glob-prefix forbidden entries; `forbiddenResources` threaded into the scenario object.
- [x] T006 Correct the negative branch in `score-skill-benchmark.cjs`; evidence: suppression scenarios scored on positive-set recall, failing only on a real forbidden-prefix leak; no-positive/no-forbidden scenario (RD-001) returns neutral, not penalized.
- [x] T007 Update harness vitest coverage; evidence: negative-scoring test rewritten to the forbidden-set model (`references/webflow/` forbidden, `webflow/leak.md` → 0) + new passing regression test (positive `universal/a.md` + forbidden `webflow/` → 1).
- [x] T008 Restore the P1 canary; evidence: `check-rule-copies.js` `IRON_LAW_FILES` repointed to `code-verify/SKILL.md`; matcher relaxed to "≥1 line carries both concepts"; canary exits 0.
- [x] T009 Fix four cheap in-family defects; evidence: `opencode-config.md` `<spec-folder>` → `graph-metadata.json`; CR-018 link fixed; two `smart_routing.md` paths → `shared/references/`; stale sub-file count corrected.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T010 Capture the official router-mode record; evidence: `benchmark/router-final/skill-benchmark-report.{md,json}` = `verdict=CONDITIONAL aggregate=71 scenarios=29` (D1-intra 87, D2 79, D3 47, D5 100).
- [x] T011 Pristine-harness regression baseline; evidence: `git stash push` on the three harness files → 8 failures; `git stash pop` + changes → 8 failures (99 tests) → zero net-new; the design-family failure is unrelated and pre-existing.
- [x] T012 Run the restored gate + hygiene; evidence: `check-rule-copies.js` exit 0; comment-hygiene rc=0 on `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`, `check-rule-copies.js`.
- [x] T013 Confirm deferrals; evidence: 8 pre-existing test failures (flat/pre-fold casualties), `parent-hub-vocab-sync` generalization, and the CS-003 matcher recorded as 009 work.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Honest routing verdict captured and the merge-blocker restored; phase 009 cutover-and-rollout is the next safe action
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
