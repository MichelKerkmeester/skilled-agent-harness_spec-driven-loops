---
title: "Decision Record: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-restore-pinned-value-when-json-entry-set-leaves-overlay operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay"
    last_updated_at: "2026-11-16T10:24:52.059Z"
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
# Decision Record: Phase 11: restore-pinned-value-when-json-entry-set-leaves-overlay

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | This phase restores set only, and setKeyOnItem is named as a known limit. | Build only what was reported. | None | goal.md D5, spec.md Out of Scope |
| Q002 | When a set has left the overlay and the pinned copy cannot be read, the engine refuses the overlay and writes nothing. | A value silently left behind is the defect this phase closes. | None | goal.md D6, spec.md risks |
| Q003 | The plans for all open handover items are committed, merged and pushed to origin/main. | Not stated. | None | commits 78610610be5 to c53deaebec3 |
| Q004 | Phase 011, the removed set restore, is built first. | It is reproduced, fully decided and the smallest. | None | tasks.md T001 to T011 |
| Q005 | The build runs through DeepSeek v4.1 flash at max thinking on the Mistral Vibe CLI, in short one-change briefs. | The six earlier fixes were built that way and each run finished in a few minutes. | None | scratch/dispatch |
| Q006 | The session's operator answers are written to a decision record in each packet they belong to. | Not stated. | None | decision-record.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01TSZx8UiHW48gEKn6YhVmXp:0 -->

Question:
```text
Overlay plan, phase 011 (Barter item 7): should `setKeyOnItem` get the same restore as `set` in this phase? It also writes a value on an upstream item and keeps no record, but nobody has reported it.
```

Options:
```text
No, set only (Recommended)
Yes, both
```

Answer:
```text
No, set only (Recommended)
```

### Q002
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01TSZx8UiHW48gEKn6YhVmXp:1 -->

Question:
```text
Overlay plan, phase 011: when a `set` has left the overlay and the pinned upstream copy cannot be read, what should the engine do with the value it left in the live file?
```

Options:
```text
Refuse (Recommended)
Leave the value
```

Answer:
```text
Refuse (Recommended)
```

### Q003
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01QtbawwwcZQHwfezRRUP9EX:1 -->

Question:
```text
All of Barter's open items are now planned and your seven answers are recorded. The work is uncommitted in worktree 425. What next?
```

Options:
```text
Commit the plans (Recommended)
Commit, merge and push
Leave uncommitted
Start building
```

Answer:
```text
Commit, merge and push
```

### Q004
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01PNWPgN4rtS74ggJeNFLXYW:1 -->

Question:
```text
Five packets are planned and none is built. Which one should be built first?
```

Options:
```text
Phase 011, removed set (Recommended)
Phase 012, doctor limits
Packet 004, vibe and dsh
Nothing yet
```

Answer:
```text
Phase 011, removed set (Recommended)
```

### Q005
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01PNWPgN4rtS74ggJeNFLXYW:2 -->

Question:
```text
If something is built now, which executor should build it?
```

Options:
```text
DeepSeek on Vibe (Recommended)
This session
Not building now
```

Answer:
```text
DeepSeek on Vibe (Recommended)
```

### Q006
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01PNWPgN4rtS74ggJeNFLXYW:3 -->

Question:
```text
Your ten answers from this session are in each packet's goal and spec, but not in a spec-kit decision record. Run `/speckit:save` to write them?
```

Options:
```text
Save now (Recommended)
Skip the save
```

Answer:
```text
Save now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
