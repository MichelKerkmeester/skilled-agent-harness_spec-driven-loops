---
title: "Tasks: Behavioral-Benchmark Framework & Shared Harness"
description: "Task Format: T### [P?] Description (file path). All pending -- phase not started."
trigger_phrases:
  - "tasks"
  - "behavior benchmark framework"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/027-deep-loop-behavior-benchmarks/001-framework-and-harness"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 8 tasks complete; exit gate passed on the claude-cli baseline leg"
    next_safe_action: "Proceed to phase 002 (pilot deep-review)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-001-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Behavioral-Benchmark Framework & Shared Harness

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

- [x] T001 Probed OPEN-001: `opencode models` lists no Anthropic provider (opencode/deepseek/kimi-for-coding/minimax/zai-coding-plan/openai only). Resolved to the `claude` CLI leg (v2.1.198 verified installed); decision + stated host-binary confound recorded as D-007 in `decision-record.md`.
- [x] T002 Resolved OPEN-002 to `.opencode/skills/deep-loop-workflows/shared/behavior-benchmark/` (D-008); cli-opencode SKILL.md + the GLM-5.2 prompt-craft profile read in the executing session before composing any dispatch.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Framework reference authored at `shared/behavior-benchmark/framework.md` (266 lines: schema, D1-D5 rubric, 11-bucket taxonomy, budget + rerun policy, package conventions). Written by GLM-5.2-max under an orchestrator-specified COSTAR contract; verified section-by-section against the contract, zero spec-path citations.
- [x] T004 Runner built at `shared/behavior-benchmark/behavior-bench-run.cjs` (~680 lines, zero deps, 4 legs incl. claude-cli baseline, watchdog + hard timeout + process-group kill, checkpoints, delegation evidence, report-only isolation, schemaVersion-1 result JSON, exported pure classify/score functions). Written by GLM-5.2-max; contract-compliance spot-checked line-by-line (leg table, classify order, seam, detached kill).
- [x] T005 Fixture `../fixtures/fx-001-review-target/` built by GLM-5.2-max: toy slug-utility packet with exactly the three seeded review findings specified (silent Unicode stripping vs silent spec, post-trim truncation violating the no-trailing-hyphen rule, unguarded null/undefined vs a 'validation complete' task claim) -- verified present and uncommented in `src/slugify.js`. FIXTURE.md states the freeze + git-restore contract.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Hermetic suite `tests/behavior-bench-run.test.cjs` (fake-leg seam via BEHAVIOR_BENCH_SPAWN_JSON, watchdog-kill/stuck_no_progress case, classify/score unit cases): `node .../behavior-bench-run.test.cjs` exit 0, 'all assertions passed' -- re-run green after the calibration fix.
- [x] T007 Exit gate PASSED: SMOKE-001 on the claude-cli baseline leg -> `runs/SMOKE-001-claude-cli.result.json`, schemaVersion 1, classification `pass`, dims {d1:2,d2:2,d3:null,d4:2,d5:null}, tTerminal 11.9s, isolation clean. First run exposed a d4 rubric bug in the ORCHESTRATOR'S OWN dispatch contract (artifacts demanded even when no delegation expected); fixed in runner + framework.md, suite re-run green, smoke re-run pass.
- [x] T008 `check-comment-hygiene.sh` clean on all 3 code files; `verify_alignment_drift.py --root .../behavior-benchmark`: PASS 0 findings (one use-strict warning found and fixed); `validate.sh --strict` run on this phase at closeout.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]` remaining.
- [x] SC-001..SC-004 in `spec.md` met with evidence (see T001-T008).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decisions**: `decision-record.md` (OPEN-001/OPEN-002 gate T001/T002).
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
