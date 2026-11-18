---
title: "Decision Record: Phase 13: github-release-notes-sync"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "013-github-release-notes-sync operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/013-github-release-notes-sync"
    last_updated_at: "2026-11-18T07:43:27.661Z"
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
# Decision Record: Phase 13: github-release-notes-sync

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Rewrite skill and release changelogs only; the packet-local changelogs under specs/ stay as they are. | Not stated. | None | D4, spec.md scope |
| Q002 | Only release bodies change for the 152 GitHub releases; no tag moves. | Not stated. | None | D3, 013-github-release-notes-sync |
| Q003 | Run the full rewrite with 4 parallel slots. | Not stated. | None | scratch/rewrite-driver.cjs --slots 4 |
| Q004 | Publish 5 sample release bodies first and wait before the rest. | Not stated. | None | 013-github-release-notes-sync/implementation-summary.md |
| Q005 | Publish the remaining 115 release bodies. | Not stated. | None | 013-github-release-notes-sync/implementation-summary.md |
| Q006 | Accept the other session's v4.1.0.0 re-tag as the new tag baseline; no tag is moved back. | Not stated. | None | goal.md deviations, 013 key decisions |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01PnQCxWv77R25iBQUY6YeHf:1 -->

Question:
```text
Which changelogs get rewritten into the new layout?
```

Options:
```text
Skill and release only (Recommended)
Everything, incl. packet-local
```

Answer:
```text
Skill and release only (Recommended)
```

### Q002
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01PnQCxWv77R25iBQUY6YeHf:2 -->

Question:
```text
For the 152 GitHub releases, what should the rewrite change?
```

Options:
```text
Release notes only (Recommended)
Notes and move every tag
```

Answer:
```text
Release notes only (Recommended)
```

### Q003
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01X8eHJDWmTQGcVt1MPseR3E:0 -->

Question:
```text
The 20-file changelog pilot passed: 19 rewritten, 1 already in layout, 0 facts lost on recheck. One file at a time averages 189 s, so the remaining 1,556 changelogs take about 82 hours on one slot. Hy4 Flash Free and Devin glm-5-2 are free, and the driver stops cleanly on any usage limit. How many files should run at once for phases 002 to 012?
```

Options:
```text
4 slots (Recommended)
2 slots
1 slot
```

Answer:
```text
4 slots (Recommended)
```

### Q004
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01HeABhUBZC9w6AYwUeYYA4A:0 -->

Question:
```text
Publish the new release notes? 120 of the 152 GitHub releases get a new body via `gh release edit <tag> --notes-file` (the other 32 already match and are skipped). Only the body changes: no tag moves, no title or asset changes. All pass the layout lint, render with 0 forced breaks and 0 broken anchors. Rollback for any release: `gh release edit <tag> --notes-file scratch/release-bodies-before/<tag>.md`, every old body is saved and committed.
```

Options:
```text
Publish all 120 (Recommended)
Publish 5 first
Don't publish
```

Answer:
```text
Publish 5 first
```

### Q005
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_019n79bPpxDttZtSU4FFvjSe:0 -->

Question:
```text
The 5 sample releases are live (v4.1.0.0, v4.0.0.0, v3.0.1.3, v2.0.1.0, v1.3.0.0). Publish the other 115 release bodies with `gh release edit --notes-file`? Only bodies change; each is undone with `gh release edit <tag> --notes-file scratch/release-bodies-before/<tag>.md`.
```

Options:
```text
Publish all 115 (Recommended)
Not yet
```

Answer:
```text
Publish all 115 (Recommended)
```

### Q006
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_019n79bPpxDttZtSU4FFvjSe:1 -->

Question:
```text
Another session re-tagged v4.1.0.0 this morning (now at 6a78ea87f9c, the commit that added its README work). The goal says every tag keeps the commit it pointed at before. How should the goal treat that tag?
```

Options:
```text
Accept the new tag (Recommended)
Move it back
```

Answer:
```text
Accept the new tag (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
