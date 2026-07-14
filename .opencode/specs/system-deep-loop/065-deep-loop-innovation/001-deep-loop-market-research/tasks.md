---
title: "Tasks: Deep-Loop Market Research (Loop-Engineering Landscape)"
description: "Ordered execution steps for the 45-iteration non-converging /deep:research run: init config, run iterations by lineage/generation, broaden via divergent pivots, dedup/novelty, catalogue 10+ repos, map insights to subsystems, synthesize research.md, strict-validate. All pending -- phase not started."
trigger_phrases:
  - "deep loop market research tasks"
  - "45 iteration task breakdown"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research"
    last_updated_at: "2026-07-14T21:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Tasks authored at scaffold time; all pending"
    next_safe_action: "T001 after operator goal-set: decide Shape A vs B (ADR-002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-001-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Loop Market Research (Loop-Engineering Landscape)

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

- [ ] T001 Decide execution shape A (parallel fan-out) vs B (sequential batches); record the resolution in `decision-record.md` ADR-002; capture explicit operator OK if Shape A (3-way parallel dispatch).
- [ ] T002 Transport pre-flights: cli-codex ChatGPT-OAuth check (LUNA + SOL); `opencode models` probe for the GLM provider prefix (e.g. `zai-coding-plan/glm-5.2`) and `max`-variant support; record actual values in `decision-record.md` ADR-003 notes.
- [ ] T003 Launch `/deep:research` against this spec folder with `--max-iterations=45 --stop-policy=max-iterations --convergence-mode=divergent` and the executor split from `plan.md` (Shape A: the `--executors` JSON recipe; Shape B: LUNA generation first). Verify the flags landed in `research/deep-research-config.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 LUNA lineage/generation: 25 iterations (cli-codex `gpt-5.6-luna`, reasoningEffort `max`, serviceTier `fast`), seeded from the 10 angles in `spec.md`.
- [ ] T005 SOL lineage/generation: 10 iterations (cli-codex `gpt-5.6-sol`, reasoningEffort `ultra`, serviceTier `fast`); under Shape B, seeded at the gaps/contradictions LUNA left.
- [ ] T006 GLM lineage/generation: 10 iterations (cli-opencode `glm-5.2`, reasoningEffort `max`, no serviceTier); under Shape B, seeded by LUNA+SOL accumulated findings.
- [ ] T007 Broadening discipline at check-ins (every 5 iterations or ~30 min): confirm divergent pivots fire at would-be-stop points; duplicate-heavy stretches answered with adjacent/contradiction/missing-source questions, not repetition (`research/deep-research-dashboard.md`, `research/deep-research-state.jsonl`).
- [ ] T008 Dedup/novelty: findings-registry deduplication observed across iterations; novel-coverage trend reviewed at each check-in and at every between-generation gate (Shape B).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Repo catalogue: 10+ GitHub repos in the synthesis, each with a working link + the transferable lesson it teaches (seed list in `spec.md`; broaden beyond it).
- [ ] T010 Subsystem mapping: every retained insight mapped to a named system-deep-loop subsystem/child/mode; 6+ distinct targets covered.
- [ ] T011 Synthesis: `research/research.md` complete with the 17-section structure incl. the mandatory "Eliminated Alternatives" section.
- [ ] T012 Close-out: checklist.md P0 items checked with evidence; scope check (zero writes outside this spec folder); `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/065-deep-loop-innovation --strict --recursive` → Errors: 0; update `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

1. Load `spec.md` and confirm scope (research only, zero writes outside this folder).
2. Load `plan.md` and identify the current phase + executor config.
3. Find the next uncompleted task above and verify its dependencies are satisfied.
4. Confirm the loop owns `research/` state; never hand-write loop files.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order (T001 → T012) |
| TASK-SCOPE | Stay inside this spec folder; the loop owns `research/` |
| TASK-VERIFY | Verify each task against its stated evidence surface |
| TASK-DOC | Update task status + checklist evidence immediately on completion |

### Status Reporting Format

`Status: T### [IN_PROGRESS | COMPLETED | BLOCKED] — evidence: <file/state ref> — next: T###`

### Blocked Task Protocol

Mark the task `[B]` with the blocker (e.g. OAuth failure, GLM probe mismatch), pause the loop if mid-run (state resumes from JSONL), and escalate to the operator with the blocker + proposed next step.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] SC-001..SC-006 in `spec.md` met with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (executor configs, shapes, flags, cadence)
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
