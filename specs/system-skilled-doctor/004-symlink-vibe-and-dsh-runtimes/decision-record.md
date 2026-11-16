---
title: "Decision Record: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-symlink-vibe-and-dsh-runtimes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/004-symlink-vibe-and-dsh-runtimes"
    last_updated_at: "2026-11-16T10:25:16.752Z"
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
# Decision Record: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The missing Vibe and DSH link runtimes are planned in a new packet, both runtimes in scope. | Whether .dsh is meant to be linked needed checking first, so a plan was the right depth. | None | goal.md D1, D2 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01QtbawwwcZQHwfezRRUP9EX:0 -->

Question:
```text
Barter sent a new item 11, and it holds in Skilled: the doctor link manifest lists six runtimes (claude, opencode, codex, cursor, devin, pi) while the tree also ships `.vibe` and `.dsh`, so `/doctor:symlink` cannot link either. What should I do with it?
```

Options:
```text
Plan it, new packet (Recommended)
Plan it, Vibe only
Record only
```

Answer:
```text
Plan it, new packet (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
