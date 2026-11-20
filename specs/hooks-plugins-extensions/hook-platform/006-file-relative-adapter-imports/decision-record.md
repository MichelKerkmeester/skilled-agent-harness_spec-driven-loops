---
title: "Decision Record: Pi loads hook adapters on every version"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-file-relative-adapter-imports operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/006-file-relative-adapter-imports"
    last_updated_at: "2026-11-19T17:47:08.667Z"
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
# Decision Record: Pi loads hook adapters on every version

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | pi-extensions/012-file-relative-adapter-imports moves into the hook-platform sub-track. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/006-file-relative-adapter-imports/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01MwRWArZ7skRLJCiDHzxQNy:1 -->

Question:
```text
Your move also removed pi-extensions/, including pi-extensions/012-file-relative-adapter-imports, which sits in ~/.Trash/pi-extensions and in git HEAD and has no new home. Worktree 353 has an uncommitted new packet pi-extensions/012-pi-extension-load-compat. What should happen to the Pi packet?
```

Options:
```text
Move to hook-platform (Recommended)
Restore in place
Leave deleted
```

Answer:
```text
Move to hook-platform (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
