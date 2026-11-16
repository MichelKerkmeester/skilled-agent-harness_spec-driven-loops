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
| Q007 | All four planned packets are built in parallel through DeepSeek flash at max thinking. | Not stated. | None | packets 004, 008, 010 and 012, each scratch/dispatch |
| Q008 | The packets are built through DeepSeek on the Mistral Vibe CLI. | Not stated. | None | scratch/dispatch, scratch/vibe-runs |
| Q009 | A built and verified packet is committed and pushed to main. | Not stated. | None | the commit that carries this record |
| Q010 | The SKILLED BARTER CODER session is told that the phase 011 handover is on main. | Not stated. | None | handover-to-barter.md |
| Q011 | The fresh Fable 5.2 review of the engine change runs through the claude2 shell function. | Not stated. | None | tasks.md T012 |
| Q012 | A dropped set whose path holds an array index is restored only when the arrays line up with the pin, and refused otherwise. | Not stated. | None | tasks.md T014, overlay-engine.cjs indexesMatchPin |
| Q013 | The fix also covers two sets on one path and a key whose added record was lost, and the other review findings are documented as limits. | Not stated. | None | tasks.md T015 and T016, implementation-summary.md Known Limitations |
| Q014 | No build of the three engine limits was approved. The operator asked whether they are worthwhile, and they stay documented until the operator says otherwise. | Not stated. | None | implementation-summary.md Known Limitations, handover-to-barter.md |
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

### Q007
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_01YXiz4QXabjxXZcnD4isqiM:0 -->

Question:
```text
Four packets are planned and not built. Which one should I build next?
```

Options:
```text
Symlink Vibe + DSH (Recommended)
Doctor script fixes (022)
sk-code router hint + score
Advisor baseline capture
```

Answer:
```text
all 4 in parallel use deepseek flash max
```

### Q008
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_01YXiz4QXabjxXZcnD4isqiM:1 -->

Question:
```text
How should the next packet be built?
```

Options:
```text
DeepSeek on Vibe (Recommended)
I build it directly
```

Answer:
```text
DeepSeek on Vibe (Recommended)
```

### Q009
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_01YXiz4QXabjxXZcnD4isqiM:2 -->

Question:
```text
When the next packet is built and verified, what should I do with it?
```

Options:
```text
Commit and push to main (Recommended)
Commit only
Ask me again then
```

Answer:
```text
Commit and push to main (Recommended)
```

### Q010
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_01YXiz4QXabjxXZcnD4isqiM:3 -->

Question:
```text
Should I tell the SKILLED BARTER CODER session that the phase 011 handover (handover-to-barter.md) is on main at 6eee83d833a?
```

Options:
```text
Yes, tell it now (Recommended)
No, not yet
```

Answer:
```text
Yes, tell it now (Recommended)
```

### Q011
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_013zyEGAqBPyK3UK2Hgsk4Hu:0 -->

Question:
```text
I cannot start a fresh Fable 5.2 reviewer from this session: the repository's fable-subagent-guard hook refuses any subagent that is not opus or sonnet while Fable runs the main loop, and the cli-claude-code skill refuses to launch Claude from inside Claude Code. How should the overlay engine review (commit cb31e584730) run instead?
```

Options:
```text
Fresh Opus at medium (Recommended)
I open a Fable session
Both
```

Answer:
```text
claude2
```

### Q012
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_01MqWrVjeskwBsVXynzqDXMz:0 -->

Question:
```text
The Fable review found a confirmed defect in the phase 011 engine change that is already on main (cb31e584730): when a dropped set's path goes through an array index and the overlay also inserted or removed an item in that array, apply restores the value from the wrong pinned item (wrong data written), or skips the restore. Object-key paths work. I reran it myself and it reproduces. How should the engine handle a dropped set whose path contains an array index?
```

Options:
```text
Refuse when arrays differ (Recommended)
Refuse every index path
Revert the change on main
```

Answer:
```text
Refuse when arrays differ (Recommended)
```

### Q013
<!-- source: claude:8dafc84b-d965-4347-8887-f936e5033e76:toolu_01MqWrVjeskwBsVXynzqDXMz:1 -->

Question:
```text
The same review confirmed three more behaviours, none of which writes wrong data: (a) the same path listed in two set operations, or a set whose value a later operation in the same entry set changes, is refused as 'edited after it was applied' when dropped. (b) a key the engine added is refused on removal once its record was lost, for example a state file from the older engine. (c) a set on an item the overlay itself appended cannot be dropped. Which should the fix also cover?
```

Options:
```text
Same path twice (a)
Lost added-key record (b)
Document the rest as limits
```

Answer:
```text
Same path twice (a), Lost added-key record (b), Document the rest as limits
```

### Q014
<!-- source: claude:3912763e-4a15-47d7-994e-71d31bbf339f:toolu_01QjEciinLMnyGakHR9bUYaf:1 -->

Question:
```text
Phase 11 left three engine limits you earlier chose to document, not build: `setKeyOnItem` keeps no record, a `set` on an item the overlay itself added cannot be dropped, and a `set` that another operation writes inside or over cannot be dropped alone. The engine refuses safely in each case and no vendoring project has reported one. Does "fix all open" include building them?
```

Options:
```text
Leave documented (Recommended)
Build all three
Build setKeyOnItem only
```

Answer:
```text
are they worthwhile?
```

<!-- /ANCHOR:operator-answers-verbatim -->
