---
title: "Decision Record: Hook hub index gap links and conversation scenario renames"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-hub-index-gap-links operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hub-index-gap-links"
    last_updated_at: "2026-11-19T17:35:39.783Z"
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
# Decision Record: Hook hub index gap links and conversation scenario renames

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | OpenCode decision-capture.js is linked into the hooks folder as well. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/007-hub-index-gap-links/spec.md |
| Q002 | The -conversation suffix is dropped now from all CLI playbooks, including the Vibe scenarios. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/007-hub-index-gap-links/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:4ffb6631-1dac-4d59-8234-228bc0f180ed:toolu_01459qFvDHtwYM4y7ZSfre2X:2 -->

Question:
```text
OpenCode decision-capture.js has no hooks-folder mirror on purpose, per the README. Link it as well?
```

Options:
```text
Link it (Recommended)
Leave as is
```

Answer:
```text
Link it (Recommended)
```

### Q002
<!-- source: claude:4ffb6631-1dac-4d59-8234-228bc0f180ed:toolu_01459qFvDHtwYM4y7ZSfre2X:3 -->

Question:
```text
The 27 Vibe hook-scenario files belong to the Mistral session's packet, which is still active in worktree 383. When should the -conversation suffix be dropped?
```

Options:
```text
Now, Vibe folder only (Recommended)
Now, all CLI playbooks
Later
```

Answer:
```text
Now, all CLI playbooks
```

<!-- /ANCHOR:operator-answers-verbatim -->
