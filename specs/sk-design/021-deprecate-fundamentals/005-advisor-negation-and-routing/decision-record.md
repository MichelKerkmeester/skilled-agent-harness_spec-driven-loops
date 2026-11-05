---
title: "Decision Record: Phase 5: advisor-negation-and-routing"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-advisor-negation-and-routing operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing"
    last_updated_at: "2026-11-05T16:11:55.120Z"
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
# Decision Record: Phase 5: advisor-negation-and-routing

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the advisor explicit lane so a negated write verb earns no write-surface boost, instead of recording the lost case as accepted. | Not stated. | None | REQ-001, T001-T004 |
| Q002 | Send both borderline prompts to the modes that own them, with the vocabulary edits made by a fresh Opus agent at medium effort. | Not stated. | None | REQ-002, REQ-003 |
| Q003 | Update the existing v4.0.1.0 entry with this work and republish its tag rather than opening a new release. | Not stated. | None | REQ-004, T009 |
| Q004 | Commit the branch work and push the worktree branch to origin. | Not stated. | None | implementation-summary.md |
| Q005 | Fast-forward main to the branch and recreate the v4.0.1.0 tag and release on the new main head. | Not stated. | None | REQ-004, scratch/facts.md section 4 |
| Q006 | Have DeepSeek Flash write the four new READMEs. | Not stated. | None | specs/sk-design/021-deprecate-fundamentals |
| Q007 | Delete the two old smoke-run folders of the local alignment command that still mention sk-design-fundamentals. | Not stated. | None | specs/sk-design/021-deprecate-fundamentals |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01Xu5ihEQFfzK9UVFMrCVXyw:0 -->

Question:
```text
Advisor regression: "Review the routing taxonomy only; don't write anything back yet" (gold sk-code) now goes to sk-doc by 0.007. It used to win only because sk-design had a duplicate link to sk-code from the retired mode. The test says a lost case is 'a regression to fix, not to record'. What should I do?
```

Options:
```text
Fix scorer negation (Recommended)
Record as accepted
Restore an edge
```

Answer:
```text
Fix scorer negation (Recommended)
```

### Q002
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01Xu5ihEQFfzK9UVFMrCVXyw:1 -->

Question:
```text
Two borderline routes go to sk-code: "Review this design document for clarity" (it also went to sk-code on main) and "review the chart colour system" (sk-code 0.92 vs sk-design 0.88). What do you want?
```

Options:
```text
Leave them (Recommended)
Tune both
Tune chart only
```

Answer:
```text
Optimize with fresh oous nedium
```

### Q003
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01Xu5ihEQFfzK9UVFMrCVXyw:2 -->

Question:
```text
The retirement isn't in any framework release note, because v4.0.1.0 is already tagged. Open the next Skilled release entry?
```

Options:
```text
Not now (Recommended)
Open next release
```

Answer:
```text
Uodate v40.1.0 changelog delete and repuvkish live tag
```

### Q004
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01Xu5ihEQFfzK9UVFMrCVXyw:3 -->

Question:
```text
After the above, how should I wrap up?
```

Options:
```text
Commit, no push (Recommended)
Commit and push
Don't commit yet
```

Answer:
```text
Commit and push
```

### Q005
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_019nV8Uw3uymyYJPbNJXd64p:0 -->

Question:
```text
Republishing v4.0.1.0 deletes the live tag (currently on main commit 10474a9567) and its GitHub release, then recreates both with the updated notes. Rollback: recreate the tag at 10474a9567 and rerun `gh release create` with the old notes from git history. The new commits are only on branch worktrees/316-deprecate-design-fundamentals (head d1c57bb81d), not on main. Where should the new tag point?
```

Options:
```text
Merge to main, then tag
Tag the branch head
Not yet
```

Answer:
```text
Merge to main, then tag
```

### Q006
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01JSoSyhL1iXBsEpsfTzT1Xw:2 -->

Question:
```text
Who should write the four READMEs?
```

Options:
```text
DeepSeek Flash (Recommended)
Me directly
```

Answer:
```text
DeepSeek Flash (Recommended)
```

### Q007
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01YbeEqGC19Y8GdehP9gMFc2:0 -->

Question:
```text
The only remaining sk-design-fundamentals mentions are captured output in two old smoke-run folders of your private local-skilled-alignment command (untracked, gitignored, referenced by nothing). What should happen to them?
```

Options:
```text
Keep them (Recommended)
Delete both folders
Annotate them
```

Answer:
```text
Delete both folders
```

<!-- /ANCHOR:operator-answers-verbatim -->
