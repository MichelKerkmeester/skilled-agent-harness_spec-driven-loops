---
title: "Decision Record: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "009-claude-user-hook-sync operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/009-claude-user-hook-sync"
    last_updated_at: "2026-11-16T12:01:59.380Z"
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
# Decision Record: Opt-in sync of Skilled's Claude hooks into the user-level Claude settings

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Keep Skilled's Claude hooks in the user-level Claude settings and keep that copy synced with the repo, rather than removing it. | The operator wants the user-level copy always synced. | None | spec.md REQ-002 |
| Q002 | The user-level copy is refreshed by an opt-in SessionStart auto-copy rather than a whole-file symlink or dropping the copy. | A whole-file symlink would wipe the operator's personal settings and Orca hooks; the operator also asked that it stay off for other installs by default. | None | spec.md REQ-001, REQ-002; .skilled/bin/sync-claude-user-hooks.mjs |
| Q003 | The sync is switched on in the primary checkout's hook-flags.env and one sync runs right after the push. | Until a sync runs, the old user-level strings differ from the new guarded commands and every hook would run twice. | None | tasks.md T023, acceptance-criteria.md AC-008 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01EkfxPna7WgNbjhQ3int9oq:0 -->

Question:
```text
Your user-level ~/.claude/settings.json has its own copy of 20 Skilled repo hooks, which the repo's .claude/settings.json already registers. In this repo several of them run twice on every call, including spec-gate-enforce, git-preflight-advisory and dispatch-preflight-lint. In a repo without a .skilled/ folder they all fail and show the 'mk claude hook could not resolve' warning. They also go stale whenever a hook folder is renamed. What should I do with them?
```

Options:
```text
Remove them (Recommended)
Keep, repo-only
Leave as is
```

Answer:
```text
symlink skilled one into user  level .claude so its always synced
```

### Q002
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01DzUjWMg3WZyNJTzEAZfsTQ:0 -->

Question:
```text
A JSON file can't be partly symlinked, and Claude Code settings can't include another file. Symlinking the whole ~/.claude/settings.json to Skilled's .claude/settings.json would wipe your model, env, plugins, permissions, status line and Orca hooks. Which design keeps the user-level Skilled hooks in sync?
```

Options:
```text
Auto-copy each session (Recommended)
Symlink whole file
Drop user-level copies
```

Answer:
```text
Auto-copy each session (Recommended)
```

### Q003
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_018woh3YvuDK5VimHX5DuQsa:1 -->

Question:
```text
After the push, turn the sync on for you? I'd write SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED=1 to the primary checkout's gitignored .skilled/hooks/hook-flags.env, then run one sync once that checkout has the new hooks. Until a sync runs, your current ~/.claude/settings.json copy won't match the new guarded commands, and every Skilled hook runs twice. A backup is kept as ~/.claude/settings.json.pre-skilled-hook-sync.
```

Options:
```text
Enable + sync now (Recommended)
Don't enable
```

Answer:
```text
Enable + sync now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
