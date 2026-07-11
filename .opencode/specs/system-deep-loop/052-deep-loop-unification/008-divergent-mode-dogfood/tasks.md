---
title: "Tasks: Divergent-Mode Live Dogfood — Research + Review"
description: "Task ledger for the parallel 10-iteration research + review dogfood run."
trigger_phrases:
  - "divergent mode dogfood tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "P0 incident during T003/T004 dispatch, docs recreated from context"
    next_safe_action: "Operator decision needed before any re-run"
    blockers:
      - "Both loops destroyed mid-run by a CLI-dispatched opencode session with unscoped repo write access"
    key_files:
      - "tasks.md"
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Scaffold packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) as phase 008 under `052-deep-loop-unification`, modeled on the `007-comprehensive-deep-review` precedent.
- [x] T002 Traced `stopPolicy`/`convergenceMode` precedence in the shipped YAML (`deep_review_auto.yaml:579,601,705-709`) to confirm `stopPolicy: "max-iterations"` would silently suppress the divergent-pivot branch — decided to leave `stopPolicy` at default for review.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Dispatched the research loop: `maxIterations: 10`, `convergenceMode: "divergent"`, executor `cli-opencode`/`openai/gpt-5.6-sol-fast`/high. Reached iteration 9/10 (8 independently verified) before the destructive incident (see T005).
- [x] T004 [P] Dispatched the review loop: `reviewTarget: ".opencode/skills/system-deep-loop"`, `reviewTargetType: "skill"`, `maxIterations: 10`, `convergenceMode: "divergent"`, dimensions `[correctness, security, traceability, maintainability]`, same executor. Reached iteration 7/10 (6 confirmed complete, iteration 7 unverifiable) before the destructive incident (see T005).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 [P0] **Incident, not planned verification**: between research iteration 8 and its post-dispatch check for iteration 9, a dispatched `opencode run` CLI session (running under `--dangerously-skip-permissions` with no worktree isolation) deleted the entire `008-divergent-mode-dogfood/` packet — both loops' full artifact trees plus this packet's own spec docs. Independently confirmed by the orchestrating conversation: `system-deep-loop`'s own tracked code was NOT touched (`git status` shows zero deletions repo-wide); the loss is contained to this packet's untracked files, unrecoverable via git. See `research/INCIDENT.md` and `review/INCIDENT.md` for full evidence and root-cause analysis (RM-8 destructive-scope-violation class).
- [x] T006 [P1] Partial recovery performed: research's 8 verified iteration narratives + 9 prompts reconstructed verbatim/deterministically by that loop's own agent from its transcript (see `research/INCIDENT.md`); review's key findings (P1-001 through P1-009, P2-001 through P2-003) and config reconstructed from the orchestrating conversation's own transcript (see `review/INCIDENT.md`). Raw JSONL state, deltas, findings-registry, and dashboards for both loops are NOT reconstructed (would require fabrication).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Close-Out

- [ ] T007 [B] Blocked on operator decision: whether/how to re-run this dogfood pass with proper isolation (git worktree per dispatch, and/or adding the missing BANNED OPERATIONS block to `deep-research`'s prompt pack to close the confirmed asymmetry with `deep-review`'s).
- [ ] T008 Run `validate.sh --strict` on this packet once its final state (incident-only vs. re-run) is settled.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining. — T007 blocked on operator decision.
- [ ] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Precedent**: `../007-comprehensive-deep-review/`
<!-- /ANCHOR:cross-refs -->
