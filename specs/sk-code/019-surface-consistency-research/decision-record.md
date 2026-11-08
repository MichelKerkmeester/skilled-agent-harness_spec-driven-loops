---
title: "Decision Record: sk-code surface consistency"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "019-surface-consistency-research operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/019-surface-consistency-research"
    last_updated_at: "2026-11-08T14:48:52.430Z"
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
# Decision Record: sk-code surface consistency

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Resolve the merge conflicts of branch worktrees/145-sk-code-surface-consistency-research and bring its nine commits onto main. | Not stated. | None | The merge of branch 145 onto main |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013XkxBd3ryK3GdohGAHAJVP:1 -->

Question:
```text
Branch worktrees/145-sk-code-surface-consistency-research has 9 sk-code commits not on main (3 weeks old, 1,757 commits behind). A test merge conflicts across sk-code-obsidian, the sk-code router and playbook files. Your standing rule is to halt on merge conflicts. What should I do with it?
```

Options:
```text
Leave it unmerged (Recommended)
Resolve the conflicts
```

Answer:
```text
Resolve the conflicts
```

<!-- /ANCHOR:operator-answers-verbatim -->
