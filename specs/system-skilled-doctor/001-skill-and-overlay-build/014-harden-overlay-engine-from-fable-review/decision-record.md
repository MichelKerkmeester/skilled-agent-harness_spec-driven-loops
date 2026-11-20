---
title: "Decision Record: Phase 14: harden-overlay-engine-from-fable-review"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "014-harden-overlay-engine-from-fable-review operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review"
    last_updated_at: "2026-11-19T17:37:35.411Z"
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
# Decision Record: Phase 14: harden-overlay-engine-from-fable-review

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The false cross-check NOTE lines on generated graph-metadata.json are skipped for declared entries and reworded. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review/spec.md |
| Q002 | The duplicate untracked-operation NOTE lines name the key or match so each is distinct. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review/spec.md |
| Q003 | The phase 14 plan and 013 doc fixes merge main and are pushed. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review/spec.md |
| Q004 | Phase 14 item 7: for keys an older engine wrote with added false, the restore refuses once and names the fix. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review/spec.md |
| Q005 | Phase 14 item 8: the state file schema is bumped to v2 with a migration. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/014-harden-overlay-engine-from-fable-review/spec.md |
| Q006 | Instead of choosing among the three engine-limit options, a Fable 5.2 medium review is asked what to harden and how to improve the overlay engine's UX. | Not stated. | none | 014-harden-overlay-engine-from-fable-review/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:6ad5889a-15be-4f0a-adad-59b8e4427b3f:toolu_01WnsycNzYuQHF1nCawkPJXT:0 -->

Question:
```text
On Barter, the new status prints two cross-check NOTE lines on graph-metadata.json files (sk-code and system-skilled-doctor). Both are false: a regenerate step wrote those intent_signals entries, and every verifyGenerated check passed. sk-code's file is a declared regenerate output. system-skilled-doctor's is written by a step whose outputs list is empty, so the engine cannot tell. How should the cross-check handle generated files?
```

Options:
```text
Skip declared + reword (Recommended)
Reword only
Document only
```

Answer:
```text
Skip declared + reword (Recommended)
```

### Q002
<!-- source: claude:6ad5889a-15be-4f0a-adad-59b8e4427b3f:toolu_01WnsycNzYuQHF1nCawkPJXT:1 -->

Question:
```text
Two untracked-operation NOTE lines print twice on Barter with identical text: 'insertObjectKeys at vocabularyClasses' (sk-code-hub-router) and 'setKeyOnItem at modes' (mcp-tooling-mode-registry). They are different operations at the same path. How should they read?
```

Options:
```text
Name the key or match (Recommended)
Merge into one line
Leave as is
```

Answer:
```text
Name the key or match (Recommended)
```

### Q003
<!-- source: claude:b5431c65-47b2-4733-baba-6cd064f557e8:toolu_011QasX8XLe2KimTnivb6Pnh:0 -->

Question:
```text
Phase 13 is on origin/main at 969335a6380. Two more commits are in the worktree but not pushed: the phase 14 plan (9 Fable items, Draft) plus fixes to 013's docs (test count 1214 → 1220, successor link), and a note that Barter's pin.checkout is absolute. Push them to main?
```

Options:
```text
Merge main and push (Recommended)
Keep local for now
```

Answer:
```text
Merge main and push (Recommended)
```

### Q004
<!-- source: claude:b5431c65-47b2-4733-baba-6cd064f557e8:toolu_011QasX8XLe2KimTnivb6Pnh:2 -->

Question:
```text
Phase 14, item 7: the restore will read the `added` flag and refuse to delete a key the overlay didn't add. Keys written by an older engine carry `added: false`. How should those be handled?
```

Options:
```text
Refuse once, name the fix (Recommended)
Mark on first apply
```

Answer:
```text
Refuse once, name the fix (Recommended)
```

### Q005
<!-- source: claude:b5431c65-47b2-4733-baba-6cd064f557e8:toolu_011QasX8XLe2KimTnivb6Pnh:3 -->

Question:
```text
Phase 14, item 8: the state file gained links, items and sets under schemaVersion 1. How should the engine catch an old script that rewrites the state without them?
```

Options:
```text
Note only, keep v1 (Recommended)
Bump to v2 with migration
```

Answer:
```text
Bump to v2 with migration
```

### Q006
<!-- source: claude:3912763e-4a15-47d7-994e-71d31bbf339f:toolu_01WXuMLVXyvKwXHYAQaNbCRh:0 -->

Question:
```text
Engine limits: phase 11 leaves three gaps. `setKeyOnItem` keeps no record, a `set` on an item the overlay itself added cannot be dropped, and a `set` that another operation writes inside or over cannot be dropped alone. The engine refuses safely in each case (writes nothing) and no vendoring project has reported one. Today four review rounds kept finding new holes in this same function. What do you want?
```

Options:
```text
Leave documented (Recommended)
Build setKeyOnItem only
Build all three
```

Answer:
```text
Ask fable 5.2 medium what tondonto harden and improve ux
```

<!-- /ANCHOR:operator-answers-verbatim -->
