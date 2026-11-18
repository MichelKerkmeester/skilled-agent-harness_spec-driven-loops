---
title: "Decision Record: Plan Text and Goal Closeout"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "012-plan-text-and-goal-closeout operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout"
    last_updated_at: "2026-11-18T22:31:45.801Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Plan Text and Goal Closeout

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The research lives in a new phase child under the 003 pi-skill-orchestrator refinement packet. | Not stated. Source: the parent spec.md continuity answered_questions line, from session db37536c-37e4-472c-8a05-521b8fec328d. The sweep of that session lists no question for it, so the question is the topic label before the comma. | None | parent spec.md, Phase Documentation Map |
| Q002 | The five research iterations ran on Opus 5.5 medium through claude2, the second Claude account, by operator override. | Not stated. | None | 001-deep-research |
| Q003 | Phases 002, 003 and 004 build N3, R3 with R5, and R2 with N1; every other idea is cut or research-only. | Not stated. Source: the parent spec.md continuity answered_questions line, from session db37536c-37e4-472c-8a05-521b8fec328d. The sweep of that session lists no question for it, so the question is the topic label before the comma. | None | parent spec.md, phases 002 to 004 |
| Q004 | All plan changes C1 to C15 from the plan validation apply, and the build order is 002, then 004, then 003. | The same answer line also records the build-order answer to the next question in the same prompt, key toolu_01AryvHhtuWDk6cnV75y26bR:1, "002, 004, 003 (Recommended)". | None | 005-plan-validation-research, parent goal.md D1 |
| Q005 | Phase 003's guard returns the policy's existing skipped result, and its ship rule is H >= ceil(N / 2) with N = 9 and C = 0. | The same answer line also records the ship-rule answer to a later question in the same prompt, key toolu_01AryvHhtuWDk6cnV75y26bR:3, "Keep rule, tightened (Recommended)". | None | 003-follow-up-routing-benchmark, implementation-summary.md:80 |
| Q006 | The build runs in worktree 474 on its own branch, with commits on that branch approved. | Not stated. Source: the parent spec.md continuity answered_questions line, from session db37536c-37e4-472c-8a05-521b8fec328d. The sweep of that session lists no question for it, so the question is the topic label before the comma. | None | parent goal.md D6 |
| Q007 | Every open item becomes a new phase child, 006 or later, under this packet. | Not stated. Source: the parent spec.md continuity answered_questions line, from session db37536c-37e4-472c-8a05-521b8fec328d. The sweep of that session lists no question for it, so the question is the topic label before the comma. | None | phases 006 to 013, parent goal.md |
| Q008 | Stored route receipts are researched first, then built, as phases 010 and 011. | Not stated. Source: the parent spec.md continuity answered_questions line, from session db37536c-37e4-472c-8a05-521b8fec328d. The sweep of that session lists no question for it, so the question is the topic label before the comma. | None | 010-route-receipts-research, 011-route-receipts-build |
| Q009 | The packet finishes with an sk-git merge to main, an advisor rebuild and daemon restart there, the goal criteria on main, then a push. | Not stated. Source: the parent spec.md continuity answered_questions line, from session db37536c-37e4-472c-8a05-521b8fec328d. The sweep of that session lists no question for it, so the question is the topic label before the comma. | None | parent goal.md D6, 012 tasks T019 to T021 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: spec-answer:db37536c:placement -->

Question:
```text
Placement
```

Options: none

Answer:
```text
a new phase child under 003-pi-skill-orchestrator-based-research-refinement.
```

### Q002
<!-- source: claude:db37536c-37e4-472c-8a05-521b8fec328d:toolu_019mMfnvVJMpph1bXs7CPNhq:0 -->

Question:
```text
The run can't use claude2 from this session. cli-claude-code/SKILL.md says "SELF-INVOCATION PROHIBITED": inside Claude Code it must not dispatch `claude`. The runtime enforces this too: executor-audit.ts refuses cli-claude-code when `claude` is in the process ancestry. Separately, dispatch-iteration.cjs only forwards configDir on review loops, so a research loop from any runtime would ignore claude2 and run on account 1. Init is done (config, ledger, strategy, spec check) and the lock is released. How should I run the 5 iterations?
```

Options:
```text
Native Opus 5.5 medium (Recommended)
Fix configDir, run elsewhere
Stop here
```

Answer:
```text
I approve override to yse claude2
```

### Q003
<!-- source: spec-answer:db37536c:refinement-phases -->

Question:
```text
Refinement phases
```

Options: none

Answer:
```text
002 pasted-context stripping (N3), 003 follow-up routing benchmark with floor counter (R3 and R5), 004 crash-path fallback with threshold doc line (R2 shrunk and N1). Everything else is cut or research-only.
```

### Q004
<!-- source: claude:db37536c-37e4-472c-8a05-521b8fec328d:toolu_01AryvHhtuWDk6cnV75y26bR:0 -->

Question:
```text
The 3-iteration plan check proposed 15 changes (C1–C15) to the planned phases 002–004 and the 016 parent spec. All three phases stay, and nothing comes back from the cut list. Which changes should I apply to the plan docs?
```

Options:
```text
Apply all C1–C15 (Recommended)
Apply 002 + 004 only
Apply none yet
```

Answer:
```text
Apply all C1–C15 (Recommended)
```

### Q005
<!-- source: claude:db37536c-37e4-472c-8a05-521b8fec328d:toolu_01AryvHhtuWDk6cnV75y26bR:2 -->

Question:
```text
For phase 003's follow-up guard, what should 'emit nothing' return when it suppresses a weak follow-up?
```

Options:
```text
Policy's skipped result (Recommended)
Empty result {}
```

Answer:
```text
Policy's skipped result (Recommended)
```

### Q006
<!-- source: spec-answer:db37536c:build-location -->

Question:
```text
Build location
```

Options: none

Answer:
```text
git worktree 474, branch worktrees/474-advisor-pasted-context-and-crash-fallback. Commits on that branch are approved.
```

### Q007
<!-- source: spec-answer:db37536c:open-item-closure -->

Question:
```text
Open-item closure
```

Options: none

Answer:
```text
'Fix all open work leave nothing open or untested'. Every open item becomes a new phase child 006 or later under this packet.
```

### Q008
<!-- source: spec-answer:db37536c:route-receipts -->

Question:
```text
Stored route receipts
```

Options: none

Answer:
```text
research first, then build. N4 leaves the cut list and becomes phases 010 and 011.
```

### Q009
<!-- source: spec-answer:db37536c:finish -->

Question:
```text
Finish
```

Options: none

Answer:
```text
merge the worktree branch into main through sk-git, rebuild the advisor runtime on main, restart its daemon, rerun the goal criteria on main, then push origin/main.
```

<!-- /ANCHOR:operator-answers-verbatim -->
