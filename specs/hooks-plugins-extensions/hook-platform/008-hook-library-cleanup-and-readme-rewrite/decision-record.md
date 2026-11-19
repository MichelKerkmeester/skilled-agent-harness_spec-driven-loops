---
title: "Decision Record: Hook library cleanup, literal names and README rewrite"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-hook-library-cleanup-and-readme-rewrite operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite"
    last_updated_at: "2026-11-19T17:35:44.201Z"
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
# Decision Record: Hook library cleanup, literal names and README rewrite

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The hook cleanup renames both folders and files whose names mislead or collide. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md |
| Q002 | The plan folds symlink-only leaf READMEs, removes strays and the dead module, and merges the two Codex checks. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md |
| Q003 | /speckit:plan for the hook library cleanup runs in autonomous mode. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md |
| Q004 | The Level 3 hook cleanup packet is decomposed into four phases. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md |
| Q005 | The packet's research intent is refactor. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md |
| Q006 | The packet offers a session goal (goal.md set with the native /goal command). | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:4c8e2248-ba9b-4d3f-9154-72a6e322a33b:toolu_01EwkEvBmhjEdiy92E9MXJwB:2 -->

Question:
```text
Several names mislead or collide: 'dispatch' vs 'task-dispatch', 'completion' whose scripts are all 'completion-evidence-*', a 'subagent-guard.mjs' that belongs to session-handover. A folder rename touches the hook registry, four generated runtime configs, plugin sources, CI and spec sub-tracks. How far should renaming go?
```

Options:
```text
Folders and files (Recommended)
Files only
None, report only
```

Answer:
```text
Folders and files (Recommended)
```

### Q002
<!-- source: claude:4c8e2248-ba9b-4d3f-9154-72a6e322a33b:toolu_01EwkEvBmhjEdiy92E9MXJwB:3 -->

Question:
```text
Every hook feature is still wired into at least one runtime, so no whole feature is dead. Which removals should the plan include?
```

Options:
```text
Strays and dead module (Recommended)
Fold symlink-only leaf READMEs (Recommended)
Merge the two Codex checks
Delete legacy git/ pre-commit
```

Answer:
```text
Fold symlink-only leaf READMEs (Recommended), Strays and dead module (Recommended), Merge the two Codex checks, Delete legacy git/ pre-commit
```

### Q003
<!-- source: claude:4c8e2248-ba9b-4d3f-9154-72a6e322a33b:toolu_017aXLvxwvC33wfHWQCpJweq:0 -->

Question:
```text
SpecKit Plan setup for hook-platform/006: how should the planning workflow run?
```

Options:
```text
Autonomous (Recommended)
Interactive
Autopilot
```

Answer:
```text
Autonomous (Recommended)
```

### Q004
<!-- source: claude:4c8e2248-ba9b-4d3f-9154-72a6e322a33b:toolu_017aXLvxwvC33wfHWQCpJweq:1 -->

Question:
```text
The level script scored this Level 3 and recommends phases (score 40 of 50, threshold 25). How should the packet be decomposed?
```

Options:
```text
Four phases (Recommended)
Three phases
No phases
```

Answer:
```text
Four phases (Recommended)
```

### Q005
<!-- source: claude:4c8e2248-ba9b-4d3f-9154-72a6e322a33b:toolu_017aXLvxwvC33wfHWQCpJweq:2 -->

Question:
```text
Which research intent should the packet record?
```

Options:
```text
refactor (Recommended)
add_feature
fix_bug
```

Answer:
```text
refactor (Recommended)
```

### Q006
<!-- source: claude:4c8e2248-ba9b-4d3f-9154-72a6e322a33b:toolu_017aXLvxwvC33wfHWQCpJweq:3 -->

Question:
```text
Should the packet carry a session goal (a goal.md you set with the native /goal command)?
```

Options:
```text
Offer it (Recommended)
Skip
```

Answer:
```text
Offer it (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
