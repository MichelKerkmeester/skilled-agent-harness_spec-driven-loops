---
title: "Decision Record: Remove the file-total line ceiling from release notes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-remove-release-size-limit operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/006-remove-release-size-limit"
    last_updated_at: "2026-11-15T06:26:05.334Z"
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
# Decision Record: Remove the file-total line ceiling from release notes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Remove only the file-total line ceiling at first, keeping the H4 item, glance bullet and sentence gates. | Not stated. | None | REQ-001, T003, check_changelog_shape.py |
| Q002 | Move the v4.0.2.1 tag to the commit with the sk-code notes and republish the release. | Not stated. | None | .skilled/changelog/skilled/v4.0.2.1.md, tag v4.0.2.1 |
| Q003 | Give sk-code its own Code Skill section in the v4.0.2.1 notes once the item ceilings are gone, then republish with the tag moved. | Not stated. | The file-total-only scope choice, after the operator asked for the H4 item and glance bullet ceilings to go too | T012, .skilled/changelog/skilled/v4.0.2.1.md |
| Q004 | Update the v4.0.2.1 notes with this session's changes and also move the tag and republish the release. | Not stated. Evidence: alternative, option false, overlap 0, imperative false, shift false. | None | .skilled/changelog/skilled/v4.0.2.1.md, tag v4.0.2.1 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:309bc6f7-fcbc-4b75-830c-186ea0a707b1:toolu_01RtZ4JU4SD12vwHvQPLAy2m:1 -->

Question:
```text
Which size ceilings in check_changelog_shape.py and the changelog template should go?
```

Options:
```text
File total only (Recommended)
All three size caps
Every length rule
```

Answer:
```text
File total only (Recommended)
```

### Q002
<!-- source: claude:309bc6f7-fcbc-4b75-830c-186ea0a707b1:toolu_01XsVj72825oJTn9CiWvkXso:0 -->

Question:
```text
The v4.0.2.1 GitHub release text now names the sk-code changes, but the tag points at 9c4c94327e, which has the older notes. Move the tag v4.0.2.1 to f1e6734f7b and republish the release? The old tag object 5ebf76b2e9 can be pushed back to undo it.
```

Options:
```text
Republish (Recommended)
Leave the tag
```

Answer:
```text
Republish (Recommended)
```

### Q003
<!-- source: claude:309bc6f7-fcbc-4b75-830c-186ea0a707b1:toolu_011kU77nJ1kU8g7CJ3Q8Bkvo:1 -->

Question:
```text
Once the limits are gone, should the v4.0.2.1 notes give sk-code its own section?
```

Options:
```text
Yes, own section (Recommended)
Limits only
```

Answer:
```text
Yes, own section (Recommended)
```

### Q004
<!-- source: claude:309bc6f7-fcbc-4b75-830c-186ea0a707b1:chat:163d0415-35ac-48d8-85c1-95cd2d6f63a6:fc96cb27-890a-47ee-9c37-d448708914a8 -->

Question:
```text
Your call: should I update the v4.0.2.1 notes, and if so, should I also move the tag and republish the release, or only commit the notes to main?
```

Options: none

Answer:
```text
Yes yes
```

<!-- /ANCHOR:operator-answers-verbatim -->
