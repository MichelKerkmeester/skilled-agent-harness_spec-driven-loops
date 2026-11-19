---
title: "Decision Record: Phase 10: mixed-track-sweep-guard"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "010-mixed-track-sweep-guard operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/010-mixed-track-sweep-guard"
    last_updated_at: "2026-11-19T17:49:22.353Z"
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
# Decision Record: Phase 10: mixed-track-sweep-guard

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | sk-code's 019-surface-consistency-research moves into the code-surfaces sub-track as 006; superseded by claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01Fqo9hwx9ZxATC6CPbgZGgz:0 (renumbered to 001). | Not stated. | none | 010-mixed-track-sweep-guard/spec.md REQ-001; tasks.md T002 |
| Q002 | hooks-plugins-extensions/028-sweet-search-integration moves into a new sub-track, retrieval-integrations, as 001. | Not stated. | none | 010-mixed-track-sweep-guard/spec.md REQ-001; tasks.md T003 |
| Q003 | surface-consistency-research stays in code-surfaces but becomes 001; the five packets already there shift to 002 through 006. | Not stated. | none | 010-mixed-track-sweep-guard/implementation-summary.md:66 |
| Q004 | Sweep only: sweep-track-roots reports a mixed track and fails with exit 1, while create.sh is left unchanged and does not refuse flat packets. | Not stated. | none | 010-mixed-track-sweep-guard/spec.md REQ-002 |
| Q005 | npm.md is first copied into specs/other/004-context-paging, then both untracked folders (hooks-plugins-extensions/026-context-paging and specs/sk-communication) are deleted with no archive. | Not stated. | none | 010-mixed-track-sweep-guard/implementation-summary.md:74 |
| Q006 | In working-tree mode the mixed-track check warns, with exit 0, on an untracked numbered folder beside sub-tracks; --rev stays unchanged. | Not stated. | none | 010-mixed-track-sweep-guard/tasks.md T011 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01YS5quvvPMacHf6nXmPjj2j:0 -->

Question:
```text
sk-code still has 019-surface-consistency-research sitting flat beside its four sub-tracks (I had pinned it because another session was editing it). Where should it go?
```

Options:
```text
code-surfaces/006 (Recommended)
New sub-track, 001
hub-architecture/006
```

Answer:
```text
code-surfaces/006 (Recommended)
```

### Q002
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01YS5quvvPMacHf6nXmPjj2j:1 -->

Question:
```text
hooks-plugins-extensions has the same situation: 028-sweet-search-integration sits flat beside five sub-tracks. It is marked Complete, and none of the five (hook-injection-pipeline, goal-and-directive-hooks, pi-extensions, session-turn-boundaries, repo-commit-gates) is about search. Where should it go?
```

Options:
```text
New sub-track, 001 (Recommended)
Move to system-speckit
hook-injection-pipeline/007
```

Answer:
```text
New sub-track, 001 (Recommended)
```

### Q003
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01Fqo9hwx9ZxATC6CPbgZGgz:0 -->

Question:
```text
You wrote "001". I moved sk-code's surface-consistency-research into code-surfaces as 006, the option you picked earlier. What should be 001?
```

Options:
```text
Own sub-track, 001
First in code-surfaces
Keep 006
```

Answer:
```text
First in code-surfaces
```

### Q004
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01YS5quvvPMacHf6nXmPjj2j:2 -->

Question:
```text
To stop this from happening again, should the tooling refuse a track that mixes flat packets with sub-tracks?
```

Options:
```text
Fail the sweep (Recommended)
Sweep only
No guard
```

Answer:
```text
Sweep only
```

### Q005
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01QK5WJfuQZPMDkGtmXFyhMC:0 -->

Question:
```text
The primary checkout has two leftover folders that git does not track. (1) specs/hooks-plugins-extensions/026-context-paging holds only an ignored copy of the pi-context-paging clone; the packet itself now lives at specs/other/004-context-paging with the same clone, and only one file, npm.md, exists solely in the old copy. (2) specs/sk-communication holds 90 ignored files (reference clones, scratch, run results) from a track deleted in commit 122af3efd4. Deleting untracked files cannot be undone through git. What should I do with them?
```

Options:
```text
Back up, then delete (Recommended)
Delete without backup
Only the context-paging one
Leave both
```

Answer:
```text
Delete without backup
```

### Q006
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01QK5WJfuQZPMDkGtmXFyhMC:1 -->

Question:
```text
The sweep missed 026-context-paging because it only checks folders git tracks. Should the mixed-track check also report an untracked numbered folder beside sub-tracks in the working tree?
```

Options:
```text
Warn on untracked ones (Recommended)
Fail on them too
No change
```

Answer:
```text
Warn on untracked ones (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
