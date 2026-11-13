---
title: "Decision Record: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "009-git-history-lift operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/009-git-history-lift"
    last_updated_at: "2026-11-13T13:57:55.448Z"
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
# Decision Record: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Plan the two Skilled packets first and stop before building; the operator later asked for the build with Codex gpt-6-luna at xhigh fast. | Not stated. | None | plan.md, tasks.md |
| Q002 | Run the plan workflow autonomously for this packet and for sk-doc/doc-validation-tooling/005-router-empty-block-capture. | Not stated. | None | plan.md |
| Q003 | Plan with a single agent, with no explorer fan-out. | Not stated. | None | plan.md |
| Q004 | Record this packet as add_feature and the empty-block capture packet as fix_bug; the Barter follow-up stayed with Barter's existing child 016-upstream-lift-adoption and got no Skilled packet. | Not stated. | None | spec.md |
| Q005 | Neither packet carries a goal.md. | Not stated. | None | spec.md |
| Q006 | Provision worktree 365 with sk-git's provision command so the metadata repair script could run. | Not stated. | None | implementation-summary.md, how-delivered |
| Q007 | Merge the branch into main locally after the commit; the push followed once the suites passed on main. | Not stated. | None | implementation-summary.md, how-delivered |
| Q008 | Record the session's unrecorded answers in the two packets through the spec-kit save. | Not stated. | None | decision-record.md |
| Q009 | Leave the six answers the save queue did not hold out of the decision records. | Not stated. | None | decision-record.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_019NYY7yDi8Ag1jyzyXEHrMm:1 -->

Question:
```text
How far should I go once the spec folders exist?
```

Options:
```text
Plan only (Recommended)
Plan and build Skilled
```

Answer:
```text
Plan only (Recommended)
```

### Q002
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01Wzcb4i8j6iS5rYV9UWruFs:0 -->

Question:
```text
The /speckit:plan workflow asks how it should run when started without a mode. Should I plan the three packets (advisor lift, empty-block fix, Barter follow-up) straight through, or stop for your approval after each of its seven steps per packet?
```

Options:
```text
Autonomous (Recommended)
Interactive
```

Answer:
```text
Autonomous (Recommended)
```

### Q003
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01Wzcb4i8j6iS5rYV9UWruFs:1 -->

Question:
```text
Should the planning use one agent or fan out explorer agents to map the code first?
```

Options:
```text
Single agent (Recommended)
Multi-agent 1+2
Multi-agent 1+3
```

Answer:
```text
Single agent (Recommended)
```

### Q004
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01Wzcb4i8j6iS5rYV9UWruFs:2 -->

Question:
```text
The workflow records one intent per packet. I propose: advisor lift = add_feature, empty-block capture = fix_bug, Barter follow-up = refactor. Accept these?
```

Options:
```text
Accept as proposed (Recommended)
All fix_bug
```

Answer:
```text
Accept as proposed (Recommended)
```

### Q005
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01Wzcb4i8j6iS5rYV9UWruFs:3 -->

Question:
```text
Should the packets carry a session goal file (goal.md) for you to set with /goal?
```

Options:
```text
Skip (Recommended)
Offer
```

Answer:
```text
Skip (Recommended)
```

### Q006
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01TSjpYnLCBKJBb43uuHt4Si:0 -->

Question:
```text
Both Skilled plan packets are written in worktree 365, but strict validation fails on two generated-metadata errors that only a repair script can fix, and that script needs the spec-kit build, which the bare worktree lacks. May I install the worktree's dependencies with sk-git's provision command? Undo: remove the worktree, which deletes everything the install adds.
```

Options:
```text
Yes, provision (Recommended)
No, leave it
```

Answer:
```text
Yes, provision (Recommended)
```

### Q007
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01SpyoW5C3FxXyLCTWoSdaGE:1 -->

Question:
```text
After committing, what should happen to the branch? Main is untouched so far, and Barter's follow-up packet 016 can only start once this is on main.
```

Options:
```text
Stop after commit (Recommended)
Merge to main locally
Merge and push to origin
```

Answer:
```text
Merge to main locally
```

### Q008
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_019zchRmiDXZpFCYqcDAW4p5:2 -->

Question:
```text
Eight answers you gave this session are not in a decision record yet, such as including the registry compilers and the narrower lift. Should I record them in the two packets with the spec-kit save step?
```

Options:
```text
Record them (Recommended)
Skip
```

Answer:
```text
Record them (Recommended)
```

### Q009
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01AAu9ibjsC3pE4u4wq4hAQw:0 -->

Question:
```text
Six answers from the building session have no decision-record entry, because the save queue did not hold them: Gate 3 option B (two new packets), "Implement with luna xhigh fast", "Max paralization", the git worktree choice, one commit per packet, and removing the worktree. What should I do with them?
```

Options:
```text
Leave them out (Recommended)
Add them by hand
Add as a note only
```

Answer:
```text
Leave them out (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
