---
title: "Tasks: Comment Hygiene — Durable WHY"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "comment hygiene tasks"
  - "durable why tasks"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/002-comment-hygiene-durable-why"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown for comment-hygiene remediation"
    next_safe_action: "Run T001 once child 001 has landed"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Comment Hygiene — Durable WHY

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

- [ ] T001 Confirm every finding against HEAD before any edit. Re-grep each cited pointer at its cited line. Two findings were confirmed by the synthesis author (six requirement-identifier hits in the agent-improvement scripts; the phase path at lines 5-6 of the Cursor goal-injection hook); the other eight are unverified and must each be reproduced or struck with evidence here. Confirm the four `Feature catalog:` comments are still at `memory-save.ts:212-215`.
- [ ] T002 Run the repaired checker tree-wide and reconcile its output against the nine named findings. For the pattern-anchor finding, the checker's output — not the named file list — is the authoritative work list. Record any site the checker finds that no finding named (`.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`).
- [ ] T003 [P] Diff this child's file list against the security register's active work list and record the sequencing decision per shared file. A shared file's edit lands after that program's child.
- [ ] T004 [P] Build the comment-only assertion: a script that reads `git diff` and confirms every changed hunk lies inside a comment token for the file's language. Exercise it against a deliberately non-comment change to prove it fails.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Replace the six requirement-identifier comments with the behavioural reason each guards; where the reason is not recoverable from the surrounding code, delete and record why (`.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/**`).
- [ ] T006 Replace the ephemeral phase pointer with the durable reason (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/**`).
- [ ] T007 [P] Replace the packet-local pointer in the validator's documentation comment (`.opencode/skills/sk-doc/scripts/quick_validate.py`).
- [ ] T008 [P] Replace the archive and snapshot comments that name renumberable packet directories (`.opencode/skills/sk-doc/sk-create-benchmark/scripts/*.cjs`).
- [ ] T009 [P] Replace the comment that points into a packet spec (`.opencode/skills/sk-prompt/sk-prompt-models/benchmarks/**/loop.cjs`).
- [ ] T010 Replace the embedded phase path at lines 5-6; confirm the file is still a valid ESM module and the goal-injection path still runs (`.opencode/hooks/goal/cursor/goal-inject.mjs`).
- [ ] T011 Replace the archived-packet identifiers in the regression test's comments without changing a single assertion (`.opencode/plugins/tests/mk-goal-tool-path.test.cjs`).
- [ ] T012 [P] Replace the spec-local provenance pointer in the performance pattern asset; the asset is copied into downstream code by design, so the replacement must read as durable guidance (`.opencode/skills/sk-code/sk-code-webflow/assets/patterns/performance-patterns.js`).
- [ ] T013 [B] Replace the four `Feature catalog:` comments with the durable reason each annotates. Blocked until child 001 lands the feature-catalog checker rule, since otherwise the class cannot be proven closed (`.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:212-215`).
- [ ] T014 Close any additional site the checker found in T002 that no finding named, or record it as out of scope with a reason.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Test happy path manually: run the repaired checker on every touched file and on the full staged set; both must return clean.
- [ ] T016 Test edge cases: run the comment-only assertion over the whole diff and confirm zero executable lines changed. Confirm no template literal, heredoc, or runtime-visible docstring was modified.
- [ ] T017 Run the owning-package suite for every touched package, and confirm the two files that are themselves tests still pass and still assert the same behaviour.
- [ ] T018 Record the baseline/delta on the checker's violation count: N closed, zero introduced, against the program baseline captured in child 001.
- [ ] T019 Update documentation: reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md` and `implementation-summary.md` so no document contradicts another's completion state.
- [ ] T020 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every deleted comment listed with the reason its WHY was unrecoverable
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
