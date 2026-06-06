---
title: "Tasks: Eval Loop"
description: "Numbered tasks for building loop runner + convergence + mutation + synthesis; running iterations"
trigger_phrases:
  - "113/003 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/003-eval-loop"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Verify upstream green; start build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114032"
      session_id: "114-003-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Eval Loop

<!-- SPECKIT_LEVEL: 3 -->
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

- [B] T001 BLOCKED on 001-council-design ratification
- [B] T002 BLOCKED on 002-eval-rig dry-run gate green
- [ ] T003 Pre-flight `devin auth status` — confirm SWE 1.6 access
- [ ] T004 Pre-flight grader CLI auth (cli-claude-code OR cli-codex per council)
- [ ] T005 Create directory tree: `state/`, `state/in-flight/`, `iterations/`, `variants/`, `scripts/`
- [ ] T006 Initialize `state/eval-loop-state.jsonl` with `{type:"loop_start", ts:"<iso>", council_report_hash:<sha>, rig_version:<id>}`
- [ ] T007 Read `../001-council-design/ai-council/council-report.md` — extract budget envelope, fixture catalog, knob axes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Author `scripts/converge.cjs` — 3-signal weighted vote evaluator (plateau 0.40 + mutation-exhaustion 0.35 + MAD 0.25); legal-stop bundle (coverage + quality + budget)
- [ ] T011 Author `scripts/mutate.cjs` — pop_or_propose(queue, bestVariant, exhaustedSignatures); signature dedup borrowed from deep-agent-improvement
- [ ] T012 [P] Author `scripts/loop.cjs` — 10-step iteration cycle; imports 002 rig via require()
- [ ] T013 [P] Author `scripts/synthesize.cjs` — synthesis.md writer (top variants + alternates + confidence + insights)
- [ ] T014 Implement failure-mode handlers in `scripts/loop.cjs`: 429 backoff, grader dispute, parse error, cache race, fixture missing, grader cache poisoning, auth expiration
- [ ] T015 Implement pause/resume: `state/.eval-loop-pause` sentinel; resume reads sentinel + in-flight markers; cache hits expected on partial completion
- [ ] T016 Implement stuck detection: 3 no-improvement → axis switch; 2 axis switches → exit best-known
- [ ] T017 Dispatch first iteration; verify state.jsonl row appended; verify iteration-001.md written
- [ ] T018 Continue dispatching iterations until convergence (stopScore > 0.60 + legal-stop bundle pass) OR budget exhaustion (dispatches >= cap)
- [ ] T019 Write `synthesis.md` via `scripts/synthesize.cjs` from final state
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Verify REQ-001: min 6 iterations before STOP-allowed (`wc -l state/eval-loop-state.jsonl` ≥ 6)
- [ ] T031 Verify REQ-002: every iteration row has required fields (`jq -e '.run and .variantId and .variantScore'` per row)
- [ ] T032 Verify REQ-003: coverage gate — every fixture has ≥ 3 variants scored
- [ ] T033 Verify REQ-004: quality gate — best-variant score > 0.70 (or council floor)
- [ ] T034 Verify REQ-005: budget gate — total dispatches < cap
- [ ] T035 Verify REQ-006: convergence emits stopScore + legalStopBundle in final row
- [ ] T036 Verify REQ-007: all 7 failure modes have handlers in scripts/loop.cjs
- [ ] T037 Verify REQ-008: synthesis.md has ≥ 3 ranked variants with insights
- [ ] T038 Verify REQ-009: 429 backoff produces pause sentinel cleanly
- [ ] T039 Pause-resume integration test: kill mid-iteration; restart; verify resumption
- [ ] T040 Force-kill recovery test: kill during cache write; restart; verify no torn rows
- [ ] T041 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 003-eval-loop --strict` — exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 verification tasks pass (T030..T038)
- [ ] All P1 verification tasks pass (T039..T040)
- [ ] strict-validate exit 0 (T041)
- [ ] Operator sign-off on `synthesis.md`
- [ ] 004-skill-uplift can read synthesis.md without ambiguity
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Upstream**: `../001-council-design/ai-council/council-report.md`, `../002-eval-rig/`
- **Downstream**: `../004-skill-uplift/`
<!-- /ANCHOR:cross-refs -->
