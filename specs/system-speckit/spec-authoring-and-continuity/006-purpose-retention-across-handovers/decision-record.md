---
title: "Decision Record: Keep a packet's core purpose across handovers and compactions"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-purpose-retention-across-handovers operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers"
    last_updated_at: "2026-11-13T21:18:47.860Z"
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
# Decision Record: Keep a packet's core purpose across handovers and compactions

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The research ran as two DeepSeek lineages of five iterations each, ten in total. | Not stated. | None | plan.md, research/deep-research-config.json |
| Q002 | The research loop ran autonomously with every iteration forced to run. | Not stated. | None | plan.md, research/deep-research-config.json |
| Q003 | The build is planned as five parts, with the purpose field in the continuity block included. | Not stated. | None | spec.md phase map, 005-continuity-purpose-field |
| Q004 | The research packet was committed, merged to main and pushed. | Not stated. | None | research/research.md |
| Q005 | The five build plans and the two research corrections were committed, merged to main and pushed. | Not stated. | None | spec.md phase map, research/research.md section 9 |
| Q006 | All five children were built, including 005 whose own spec rates its value as narrow. | Not stated. | None | spec.md phase map, 005-continuity-purpose-field |
| Q007 | Child 001 also changes the recent_action default, so a finished parent with a real purpose still passes the scaffold check. | Not stated. | None | 001-parent-purpose-scaffold/plan.md |
| Q008 | The live checks that a session can run were run: agent-followed resume runs and the 001 sandbox cases. A real compaction and a real relaunch stay unproven. | Not stated. | None | 001-parent-purpose-scaffold/tasks.md, 002-resume-purpose-row/tasks.md |
| Q009 | The three defects found during the build are planned as one further child, 006-purpose-carry-follow-ups, and not built yet. | Not stated. | None | spec.md phase map, 006-purpose-carry-follow-ups |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01NA8j3mDDKrx7BHgZ5FzpFs:2 -->

Question:
```text
The DeepSeek harness executor only runs as a fan-out of two or more parallel lineages, a single run exits with an error. How should the 10 iterations be shaped on deepseek-v4.1-flash at max?
```

Options:
```text
2 lineages x 10 (Recommended)
2 lineages x 5
3 lineages x 10
```

Answer:
```text
2 lineages x 5
```

### Q002
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01NA8j3mDDKrx7BHgZ5FzpFs:3 -->

Question:
```text
Should the research loop run all iterations without stopping, or pause for your review after each one?
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
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01X27AL9EkFdG7E4Mav3x2t5:0 -->

Question:
```text
The deep research on lost packet purpose is done. It recommends making the resume brief, the compaction brief and the relaunch note quote the purpose already written in spec.md, plus stopping create.sh from writing a generic purpose into new phase parents. What should happen next?
```

Options:
```text
Plan that change (Recommended)
Plan it with the continuity field
Stop here
```

Answer:
```text
Plan it with the continuity field
```

### Q004
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01X27AL9EkFdG7E4Mav3x2t5:1 -->

Question:
```text
The research packet (specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers) is uncommitted in worktree 371. What should happen to it?
```

Options:
```text
Commit, merge, push (Recommended)
Commit only
Leave uncommitted
```

Answer:
```text
Commit, merge, push (Recommended)
```

### Q005
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01FTtHSFz49YNnA7LWM9Dt39:0 -->

Question:
```text
The five build plans and two corrections to the research report are uncommitted in worktree 371. One correction fixes a wrong claim already on origin/main (that create.sh writes a generic parent purpose). What should happen to them?
```

Options:
```text
Commit, merge, push (Recommended)
Commit only
Leave uncommitted
```

Answer:
```text
Commit, merge, push (Recommended)
```

### Q006
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01FTtHSFz49YNnA7LWM9Dt39:1 -->

Question:
```text
Which of the five planned children should be built now, with DeepSeek v4.1 flash max workers as before? Child 005 (the continuity field) states its own value is narrow: nothing loads that block into a model, and the only code that shows its Goal never runs in this repository.
```

Options:
```text
Build 001 to 004, hold 005 (Recommended)
Build all five
Build 002 and 004 only
Build nothing now
```

Answer:
```text
Build all five
```

### Q007
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01FTtHSFz49YNnA7LWM9Dt39:2 -->

Question:
```text
Child 001 makes an unfilled purpose in a new phase parent fail a check. Its side effect: a new parent marked Complete then also fails a scaffold check on its own frontmatter defaults, even with a real purpose. How should the plan handle that?
```

Options:
```text
Fix the default too (Recommended)
Accept the side effect
Hold child 001
```

Answer:
```text
Fix the default too (Recommended)
```

### Q008
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01H9876YSX3iBVyfY42ZgXDR:1 -->

Question:
```text
Three behaviors are only proven by tests, not by a real run: the Purpose row in /speckit:resume, the Goal line in a relaunch note and the purpose section after a compaction. Should I run the live checks I can run from this session?
```

Options:
```text
Run resume and the 001 sandbox (Recommended)
Skip the live checks
```

Answer:
```text
Run resume and the 001 sandbox (Recommended)
```

### Q009
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01YFvcr8jXhKitQqkvSwYSX2:1 -->

Question:
```text
Three defects turned up during the build and were left alone because they are outside packet 006: five older phase parents still carry the generic purpose sentence, detectSpecFolder only matches .opencode/specs/ paths, and the resume workflow file and its presentation file list different brief rows. What should happen with them?
```

Options:
```text
Plan them as a new phase (Recommended)
Leave them recorded
Plan only the path match
```

Answer:
```text
Plan them as a new phase (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
