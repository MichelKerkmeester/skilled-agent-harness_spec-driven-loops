---
title: "Decision Record: Phase 8: claude-hook-tree-guard"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-claude-hook-tree-guard operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/008-claude-hook-tree-guard"
    last_updated_at: "2026-11-16T13:04:15.219Z"
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
# Decision Record: Phase 8: claude-hook-tree-guard

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Re-sync ~/.claude/settings.json from the primary checkout once phase 8 is on main. | Not stated. | None | implementation-summary.md Known Limitations 1, .skilled/bin/sync-claude-user-hooks.mjs |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a4c37e98-2c3a-4c20-a7bf-acbc32e31f29:toolu_015P1xCZmYCT81giQJ6YUxaT:1 -->

Question:
```text
Your ~/.claude/settings.json still has the old hook check, so Claude sessions started in your home folder keep printing 'could not resolve'. Once phase 8 is on main, should I re-sync it by running node .skilled/bin/sync-claude-user-hooks.mjs from the primary checkout? It saves a backup first, and the change affects every Claude session.
```

Options:
```text
Yes, after merge (Recommended)
Dry run only
No, I'll do it
```

Answer:
```text
Yes, after merge (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
