---
title: "Decision Record: env secret guard for every runtime"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-env-secret-guard operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/env-secret-guard/001-env-secret-guard"
    last_updated_at: "2026-11-19T17:35:34.347Z"
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
# Decision Record: env secret guard for every runtime

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The three failed DeepSeek reviews are rerun through the OpenCode Go route. | Not stated. | none | specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard/spec.md |
| Q002 | No further live checks run, given the weekly usage limit. | Not stated. | none | specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard/spec.md |
| Q003 | The next fixes outside the guard are an OS-level deny per runtime and a secret manager guide. | Not stated. | none | specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard/spec.md |
| Q004 | The v4.0.2.1 changelog entry stays over the 240-line ceiling with the guard section. | Not stated. | none | implementation-summary.md:144 (limitation 5) |
| Q005 | The published v4.0.2.1 release text is updated with gh release edit after the changelog commit. | Not stated. | none | implementation-summary.md:144 (limitation 5) |
| Q006 | Tag v4.0.2.1 is deleted and recreated so it includes the guard code. | Not stated. | none | implementation-summary.md:144 (limitation 5) |
| Q007 | The v4.0.2.1 retag deletes the remote tag, then pushes the new one. | Not stated. | none | implementation-summary.md:144 (limitation 5) |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_014JXJV39zoSY1C4r5mfMwJU:0 -->

Question:
```text
The three DeepSeek v4.1 Flash max reviews (OpenCode plugin, Pi extension, command hooks) all failed with a DevPass 402 credit-limit error before reviewing anything. How should I run them?
```

Options:
```text
OpenCode Go route (Recommended)
Wait for DevPass
Skip DeepSeek review
```

Answer:
```text
OpenCode Go route (Recommended)
```

### Q002
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_011iuUTHdsfsrvCzo4E2157r:2 -->

Question:
```text
Which remaining live checks should I run? Claude Code showed 95% of your weekly limit used.
```

Options:
```text
Claude Code CE-P06 + CE-P07
Rerun Devin, OpenCode, Pi
Cursor and DSH
None
```

Answer:
```text
None
```

### Q003
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_011iuUTHdsfsrvCzo4E2157r:3 -->

Question:
```text
Two fixes sit outside the guard. Which should I start on?
```

Options:
```text
OS-level deny per runtime
Secret manager guide
Neither for now
```

Answer:
```text
OS-level deny per runtime, Secret manager guide
```

### Q004
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_01PvKb81WQHDkFBLgACYyia9:0 -->

Question:
```text
The dotenv guard is now written into the v4.0.2.1 changelog as you asked, but the entry is 280 lines and the changelog template's hard ceiling is 240 (check_changelog_shape.py, no override exists). The release was already at 238 lines before the guard went in. How should I make it fit?
```

Options:
```text
Trim v4.0.2.1 to fit (Recommended)
Move guard to v4.0.2.2
Leave it over the ceiling
```

Answer:
```text
Leave it over the ceiling
```

### Q005
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_01PvKb81WQHDkFBLgACYyia9:1 -->

Question:
```text
The v4.0.2.1 GitHub release is already published, and the changelog rule says its text is updated in the same run when the entry changes. Should I update the published release notes with `gh release edit` once the changelog is final? (The tag itself stays where it is; nothing is committed yet.)
```

Options:
```text
Update after commit (Recommended)
Update now
Don't touch it
```

Answer:
```text
Update after commit (Recommended)
```

### Q006
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_011iuUTHdsfsrvCzo4E2157r:1 -->

Question:
```text
The v4.0.2.1 tag does not include the guard code, though the published release text already describes it. Move the tag once the work is on main?
```

Options:
```text
Leave the tag (Recommended)
Move the tag after merge
New version instead
```

Answer:
```text
Delete tag and retag
```

### Q007
<!-- source: claude:593b8a5d-1784-480f-8f1e-84fbc3e0d00d:toolu_01G4qzu9nu7wDAkxpCp4tDh9:1 -->

Question:
```text
v4.0.2.1 has a published GitHub release attached. How should I retag it onto the new main commit?
```

Options:
```text
Force-move the tag (Recommended)
Delete remote tag, then push new
```

Answer:
```text
Delete remote tag, then push new
```

<!-- /ANCHOR:operator-answers-verbatim -->
