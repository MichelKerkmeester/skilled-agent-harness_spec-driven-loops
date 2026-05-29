---
title: "Tasks: opus deep-review remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opus review remediation tasks"
  - "017 findings tasks"
  - "benchmark-mode promotion tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/018-opus-review-remediation"
    last_updated_at: "2026-05-29T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 018 task breakdown from 017 review workstreams"
    next_safe_action: "Start T001 shared fixture-id guard extraction"
    blockers: []
    key_files:
      - "../017-two-lane-opus-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-018-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: opus deep-review remediation

<!-- SPECKIT_LEVEL: 3 -->

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

W1 traversal hardening: extract the shared fixture-id guard and close the first-writer hole before any other path work lands.

- [ ] T001 Extract shared fixture-id guard (`SAFE_FIXTURE_ID` + assert) into scripts/lib/ and require it in run-benchmark.cjs (scripts/lib/, scripts/model-benchmark/run-benchmark.cjs)
- [ ] T002 Port the shared guard into the materializer before its outputs path.join, F017-P1-01 (scripts/shared/materialize-benchmark-fixtures.cjs)
- [ ] T003 Add materializer hostile-id regression test asserting `../escaped` is refused (scripts/tests/run-benchmark-hardening.vitest.ts)
- [ ] T004 [P] grep/grep_absent containment check, F017-P2-03 (scripts/model-benchmark/scorer/score-model-variant.cjs)
- [ ] T005 [P] Sanitize candidate-derived cmd/skill refs before fs.existsSync, F017-P2-13b (scripts/agent-improvement/score-candidate.cjs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

W2 hardening-gate coverage and W3 doc-and-traceability plus the Lane B benchmark-mode promotion path.

- [ ] T006 Route bundle-gate Layer-3 execSync through DEEP_AGENT_ALLOW_CRITERIA_EXEC, F017-P1-02 (scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs)
- [ ] T007 Add smoke-run no-execution regression test under the flag (scripts/tests/scorer.vitest.ts)
- [ ] T008 [P] Harden the grader system prompt as data-only + det-check cross-check on the llm path, F017-P2-12 (scripts/model-benchmark/scorer/grader/harness.cjs)
- [ ] T009 [P] Anchor the grader cache under the run/packet outputs dir + verify the derived key on read, F017-P2-13a (scripts/model-benchmark/scorer/lib/cache.cjs)
- [ ] T010 Add the benchmark-mode promotion branch for `--benchmark-report` + benchmark-complete, F017-P1-04 (scripts/shared/promote-candidate.cjs)
- [ ] T011 Add a benchmark-mode promotion test + an agent-path-unchanged assertion (scripts/tests/remediation.vitest.ts)
- [ ] T012 Make the auto YAML promotion step executable in benchmark mode, F017-P1-04 (deep_start-model-benchmark-loop_auto.yaml)
- [ ] T013 Correct mode-aware-promotion wording to the resolved behavior, F017-P1-04 (SKILL.md, start-model-benchmark-loop.md, the auto YAML)
- [ ] T014 [P] Repoint the three Mode-4 anchors to `§4 LANE B: MODEL-BENCHMARK`, F017-P1-03 (start-model-benchmark-loop.md, start-agent-improvement-loop.md)
- [ ] T015 [P] Reword the Lane B headline framing to the deferred reality, F017-P2-01 (SKILL.md, the auto YAML)
- [ ] T016 [P] Update the explicit.ts two-node projection comment, F017-P2-04 (explicit.ts)
- [ ] T017 [P] Normalize provenance tags + packet-qualify finding-id-shaped comments, F017-P2-08/F017-P2-11 (dispatch-model.cjs, run-benchmark.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

W4 shared-helper extraction, W5 cache integrity, and the final verification gate.

- [ ] T018 Extract scripts/lib/parse-args.cjs and require it in the in-scope scripts, F017-P2-05 (scripts/lib/)
- [ ] T019 Extract a shared integration-score helper resolving status/syncStatus, F017-P2-06 (scripts/lib/)
- [ ] T020 Extract scripts/lib/profile-resolve.cjs for both writers, F017-P2-09 (scripts/lib/)
- [ ] T021 [P] Drop the unused third parameter from cwd-check classifyPath, F017-P2-07 (scripts/model-benchmark/scorer/deterministic/cwd-check.cjs)
- [ ] T022 [P] Drop the unused dispatch-model.cjs entry from LANE_MODEL_BENCHMARK, F017-P2-02 (scripts/shared/loop-host.cjs)
- [ ] T023 Assert cached.inputHash + cached.status on score-cache read, rescore on mismatch, F017-P2-10 (scripts/agent-improvement/score-candidate.cjs)
- [ ] T024 Run `npx vitest run` in the scripts dir, suite green
- [ ] T025 Record exactly one disposition per active finding in decision-record.md
- [ ] T026 Reconcile spec.md status, checklist evidence, and implementation-summary at close
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every active finding (4 P1 + 13 P2) carries exactly one disposition in decision-record.md
- [ ] vitest green; the Lane B benchmark-mode promotion path is executable
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Register**: See `decision-record.md`
- **Findings source**: See `../017-two-lane-opus-deep-review/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
