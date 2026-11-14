---
title: "Decision Record: Phase 1: fix-agent-contract-contradictions"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-fix-agent-contract-contradictions operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/001-fix-agent-contract-contradictions"
    last_updated_at: "2026-11-14T12:09:06.982Z"
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
# Decision Record: Phase 1: fix-agent-contract-contradictions

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Provision worktree 377 with sk-git's install and build so the packet can be scaffolded and validated there. | Not stated. | None | Worktree 377, all phases of the packet |
| Q002 | Fix the agent roster drift with a registry that generates the rosters, not with a check alone. | Not stated. | None | ../spec.md Open Questions, ../goal.md D3, phase 002 spec.md |
| Q003 | Remove the eight box-drawn closing summaries from the agent files and test three agents before and after. | Not stated. | None | ../spec.md Open Questions, ../goal.md D7, phase 005 spec.md |
| Q004 | Author a parent goal.md plus one goal.md per phase now, so a session can be bound to the packet. | Not stated. | None | ../goal.md and each phase's goal.md |
| Q005 | Start implementing with phase 1 after the spec packet was committed. | Not stated. | None | tasks.md of this phase |
| Q006 | Record the session's operator answers in a decision record with a full-auto save. | Not stated. | None | decision-record.md of this phase |
| Q007 | Regenerate the trigger index in worktree 377 and commit it so a lookup finds the new packet. | Not stated. | None | Commit 975d857ccd on the worktree branch |
| Q008 | Keep branch worktrees/377-agent-contract-and-registry-alignment local, neither merged nor pushed. | Not stated. | None | ../spec.md Metadata Branch row |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01FBnzavuGZZrdnnksreEfJT:0 -->

Question:
```text
The new worktree (377) cannot scaffold or validate a phased spec until its dependencies are installed and built. May I run sk-git's provisioning there? It runs npm install and build for about a dozen packages inside the worktree only. Undo: remove worktree 377, which deletes everything it installed.
```

Options:
```text
Provision 377 (Recommended)
Use main instead
```

Answer:
```text
Provision 377 (Recommended)
```

### Q002
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01TFVYtmjSvdkJfASBwJ6sGw:1 -->

Question:
```text
Phase 2 of the spec: how should the agent roster drift be fixed?
```

Options:
```text
Registry (Recommended)
Check only
```

Answer:
```text
Registry (Recommended)
```

### Q003
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01TFVYtmjSvdkJfASBwJ6sGw:2 -->

Question:
```text
Phase 5 of the spec: what should happen to the eight box-drawn closing summaries in the agent files?
```

Options:
```text
Remove and test (Recommended)
Keep them
```

Answer:
```text
Remove and test (Recommended)
```

### Q004
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01TFVYtmjSvdkJfASBwJ6sGw:3 -->

Question:
```text
Should the packet also get goal files (a parent goal.md plus one per phase) so a session can be bound to it?
```

Options:
```text
Not now (Recommended)
Author goals now
```

Answer:
```text
Author goals now
```

### Q005
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01UcbFGZkibX8tGLHXQ17C6L:0 -->

Question:
```text
The spec packet (specs/agents/006-agent-contract-and-registry-alignment) is committed in worktree 377. What should happen next with the work itself?
```

Options:
```text
Start phase 1 (Recommended)
Stop at the spec
Start phase 6 first
```

Answer:
```text
Start phase 1 (Recommended)
```

### Q006
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01UcbFGZkibX8tGLHXQ17C6L:1 -->

Question:
```text
Four of your answers this session (new packet, worktree, registry, remove summaries) are in the specs but not in a decision record. Should I record them now with /speckit:save in full-auto mode?
```

Options:
```text
Save now (Recommended)
Not yet
```

Answer:
```text
Save now (Recommended)
```

### Q007
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01UcbFGZkibX8tGLHXQ17C6L:2 -->

Question:
```text
The trigger index does not list the new packet, so a trigger lookup cannot find it. Should I regenerate the index in worktree 377 and commit it?
```

Options:
```text
Regenerate (Recommended)
Leave it
```

Answer:
```text
Regenerate (Recommended)
```

### Q008
<!-- source: claude:0f404b94-69fc-40f5-a6fd-9abefbb6612b:toolu_01UcbFGZkibX8tGLHXQ17C6L:3 -->

Question:
```text
Branch worktrees/377-agent-contract-and-registry-alignment exists only locally. What should happen to it?
```

Options:
```text
Keep local (Recommended)
Merge to main
Push the branch
```

Answer:
```text
Keep local (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
