---
title: "Decision Record: Rename session relaunch to session handover"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "044-in-session-handover-rename operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/044-in-session-handover-rename"
    last_updated_at: "2026-11-15T09:08:33.317Z"
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
# Decision Record: Rename session relaunch to session handover

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Rename session relaunch on every live surface with no alias for the old relaunch names. | Not stated. | None | REQ-001, spec.md scope |
| Q002 | Rename the seed prefix but keep bare relaunch names such as relaunch-core.cjs, relaunch.log and the skilled-relaunch folder. | Bare relaunch still names what the wrapper does. | None | spec.md out of scope, implementation-summary.md decisions |
| Q003 | Leave changelogs, benchmark reports, archives and spec folders under the old name, and describe the rename in new release notes. | They record what shipped under the old name. | None | REQ-004, .skilled/changelog/skilled/v4.0.2.2.md |
| Q004 | Move the primary checkout's git-ignored .state/session-relaunch folder after the push lands. | Not stated. | None | implementation-summary.md limitations |
| Q005 | Support both handover names: routing words, the shorter session-handover name, a second switch spelling and a retitled parent goal. | Not stated. | None | REQ-005, REQ-006, REQ-007 |
| Q006 | Make session-handover the main name and accept the in-session spelling for the on and off switches. | Not stated. | the in-session-handover main name chosen in the first rename pass | REQ-005, T012, hook-flags.cjs |
| Q007 | When a main switch and its in-session spelling both hold values, the main switch decides. | A setting under the name the docs use should never be overruled by the other one. | None | REQ-005, AC-005, hook-flags.test.cjs |
| Q008 | Fold this session's handover work into the v4.0.2.1 release notes instead of a separate v4.0.2.2 entry. | Not stated. | the separate unreleased v4.0.2.2 entry | REQ-004, AC-004, .skilled/changelog/skilled/v4.0.2.1.md |
| Q009 | Fold phases 041, 042, 043 and 044 into v4.0.2.1 and delete v4.0.2.2. | Not stated. | None | REQ-004, .skilled/changelog/skilled/v4.0.2.1.md |
| Q010 | Move tag v4.0.2.1 to the commit with the new entry and update the GitHub release body. | Not stated. | None | REQ-004, implementation-summary.md limitations |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_017e7QyxYWRX9QKPmtnPDavb:0 -->

Question:
```text
You suggested renaming "session relaunch" to "in-session handover" under .skilled/hooks. The old name sits in 131 files (about 3,650 mentions), 25 environment variable names such as SYSTEM_SESSION_RELAUNCH_ENABLED, the hook folder, the Pi and OpenCode plugin files, the runtime state folder and installed projects' hook registrations. How far should it go?
```

Options:
```text
Names in prose first (Recommended)
Full rename with aliases
Not now
```

Answer:
```text
Full name without alias - 100% conversion
```

### Q002
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_012p3HuTcxhsvvMsMpK8JcU5:2 -->

Question:
```text
Does 100% also cover the bare word "relaunch", meaning what the wrapper does (relaunch-core.cjs, relaunch.log, the skilled-relaunch state folder, the relaunch log events), and the seed prefix "[session-relaunch] claim and continue handoff"?
```

Options:
```text
Seed yes, bare no (Recommended)
Everything
```

Answer:
```text
Seed yes, bare no (Recommended)
```

### Q003
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_012p3HuTcxhsvvMsMpK8JcU5:3 -->

Question:
```text
What about history: shipped changelogs and existing spec folders such as 002-session-relaunch-loop and its 43 phases?
```

Options:
```text
Leave history (Recommended)
Rename spec folders too
```

Answer:
```text
Leave history (Recommended)
```

### Q004
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_012MjaNWoPzJ2Zh3DSuPGJVL:1 -->

Question:
```text
Should I move the primary checkout's git-ignored .skilled/skills/.state/session-relaunch folder (holds the other Vibe session's open handoff note) to .state/in-session-handover after the push lands?
```

Options:
```text
Leave it to me (Recommended)
Move it after push
```

Answer:
```text
Move it after push
```

### Q005
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01GiSA5S7ZeVh1yjap5RGBay:0 -->

Question:
```text
You want "in session handover" or "session-handover" supported there. Where do you mean?
```

Options:
```text
Words that route
Shorter names
Switch aliases
The goal title
```

Answer:
```text
Words that route, Shorter names, Switch aliases, The goal title
```

### Q006
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01W5cByTz5SstjXxWhggT5wZ:0 -->

Question:
```text
Which name is the main one in the folder, files, seed and docs? The other is then accepted for the switches and the routing words.
```

Options:
```text
in-session-handover main (Recommended)
session-handover main
```

Answer:
```text
session-handover main
```

### Q007
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01W5cByTz5SstjXxWhggT5wZ:1 -->

Question:
```text
When both the main switch and its alias are set to different values, which wins?
```

Options:
```text
Main name wins (Recommended)
Off wins
```

Answer:
```text
Main name wins (Recommended)
```

### Q008
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01YaJFabTZAJiHnTcgyCa5Pp:1 -->

Question:
```text
The v4.0.2.2 release note is on main but has no tag or GitHub release. Publish it now?
```

Options:
```text
Not yet (Recommended)
Tag and publish now
```

Answer:
```text
make our work part of hangelog 4021
```

### Q009
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01ChXAJ52sKkvA9AmyuSCUyx:0 -->

Question:
```text
"Our work" in v4.0.2.1: which phases go in? The entry already covers handover phases 036 to 040. This session also shipped 041 (cross-runtime parity), 042 (gap closure), 043 (Vibe switch and live hop) and 044 (the rename).
```

Options:
```text
041 to 044 (Recommended)
044 only
```

Answer:
```text
041 to 044 (Recommended)
```

### Q010
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01ChXAJ52sKkvA9AmyuSCUyx:1 -->

Question:
```text
v4.0.2.1 is tagged and published on GitHub. After the entry changes, what happens to the release?
```

Options:
```text
Republish tag and body (Recommended)
Body only
File only
```

Answer:
```text
Republish tag and body (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
