---
title: "Decision Record: Skill Changelog Retrofit"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "skill changelog retrofit operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/002-skill-changelog-retrofit"
    last_updated_at: "2026-11-24T18:38:11.919Z"
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
# Decision Record: Skill Changelog Retrofit

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Delete the retrofit packet's 004-cli-orca child along with the cli-orca spec track, and drop it from this parent's phase map, handoff table, goal table and child list. | Not stated. | none | spec.md phase map, goal.md goal table, graph-metadata.json; commit a710e0338f2 |
| Q002 | Fix only live docs that link to specs/cli-orca (the v4.2.0.0 release notes and the mcp-tooling v1.8.0.0 and v1.10.1.0 changelogs), and leave historical scratch and research logs as they are. | Not stated. | none | commit a710e0338f2 |
| Q003 | Merge origin/main into main and push the cli-orca track deletion. | Not stated. | none | commits a710e0338f2, 807cb009801 |
| Q004 | Delete the git-ignored leftovers under specs/cli-orca, including the 292 MB upstream Orca checkout, with no undo. | Not stated. | none | rm -rf specs/cli-orca after commit a710e0338f2 |
| Q005 | Merge origin/main and push the deletion of the two sk-doc cli-orca phases. | Not stated. | none | commit 7e511525bac |
| Q006 | Merge origin/main and push the rebuilt specs/descriptions.json cache. | Not stated. | none | commit 5cd127c1c6f |
| Q007 | Record the cli-orca deletion answers in this retrofit parent, since that work ran without its own packet. | Not stated. | none | decision-record.md |
| Q008 | Also delete the two sk-doc packets named after cli-orca: 005-skill-readability-refinement/003-cli-orca and 014-skill-router-files/012-align-cli-orca. | Not stated. Evidence: yes_no, option true, overlap 0, imperative false, shift false. | none | commit 7e511525bac |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01FsWon2nF3h7c1uL4Gpg1ZU:1 -->

Question:
```text
The sk-doc changelog-retrofit packet has an Orca child: specs/sk-doc/document-standards/003-changelog-system/002-skill-changelog-retrofit/004-cli-orca. It documented the cli-orca changelog. Should it go too?
```

Options:
```text
Delete it too (Recommended)
Keep it
```

Answer:
```text
Delete it too (Recommended)
```

### Q002
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01FsWon2nF3h7c1uL4Gpg1ZU:2 -->

Question:
```text
Some live docs link to specs/cli-orca: the v4.2.0.0 release notes list it among their spec folders, and the mcp-tooling changelogs v1.8.0.0 and v1.10.1.0 link to it. Historical scratch logs and research logs also mention it. What should happen to those references?
```

Options:
```text
Fix live docs only (Recommended)
Leave all references
```

Answer:
```text
Fix live docs only (Recommended)
```

### Q003
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01N4dk2BU5Y8Ki8yNVydKK7x:0 -->

Question:
```text
Deletion commit a710e0338f2 is on local main. It is 1 ahead of origin/main and 1 behind. Should I merge origin/main and push?
```

Options:
```text
Merge and push (Recommended)
Keep local
```

Answer:
```text
Merge and push (Recommended)
```

### Q004
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01N4dk2BU5Y8Ki8yNVydKK7x:1 -->

Question:
```text
One git-ignored folder is still on disk: specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main. It is a 292 MB local copy of the upstream Orca repo, and there is also a review/.legacy-projection-watermarks file. Git does not track either one, so deleting them cannot be undone. Should I delete the leftover specs/cli-orca folder?
```

Options:
```text
Delete it
Keep it
```

Answer:
```text
Delete it
```

### Q005
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01WXp9chhJZ3jL1Uu8Pstyqp:0 -->

Question:
```text
Commit 7e511525bac, which deletes the two sk-doc cli-orca phases (53 files), is on local main. Should I merge origin/main and push it?
```

Options:
```text
Merge and push (Recommended)
Keep local
```

Answer:
```text
Merge and push (Recommended)
```

### Q006
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_017k2sh8868EpNBxQWmmrAgU:0 -->

Question:
```text
Commit 5cd127c1c6f, which rebuilds specs/descriptions.json and refreshes six description.json files, is on local main. Should I merge origin/main and push it?
```

Options:
```text
Merge and push (Recommended)
Keep local
```

Answer:
```text
Merge and push (Recommended)
```

### Q007
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01MvLzxKkEbgd41zViTZufVV:0 -->

Question:
```text
The save found 8 unrecorded answers. One is the sk-git fix choice ("Fix, push, then clean up"), and it goes into specs/sk-git/worktree-lifecycle/007-provision-dev-dependencies. The other 7 are about deleting the cli-orca spec folders, and that work ran under Gate 3 option D, so it has no packet. Where should those 7 go?
```

Options:
```text
sk-doc retrofit parent (Recommended)
Readability parent
Leave them unrecorded
```

Answer:
```text
sk-doc retrofit parent (Recommended)
```

### Q008
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:chat:4ec95f10-6f0e-4e57-9c9e-cf6d71130d20:4a58f554-7479-4747-94bb-c7f669f0dc57 -->

Question:
```text
Should those two sk-doc packets be deleted as well?
```

Options: none

Answer:
```text
Yes
```

<!-- /ANCHOR:operator-answers-verbatim -->
