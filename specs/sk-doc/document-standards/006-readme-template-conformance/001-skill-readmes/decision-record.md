---
title: "Decision Record: Phase 1: skill-readmes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-skill-readmes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/001-skill-readmes"
    last_updated_at: "2026-11-16T15:44:16.957Z"
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
# Decision Record: Phase 1: skill-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The planning run for the README program runs in Autonomous mode. | Not stated. | None | plan.md |
| Q002 | The README program is planned as a refactor of existing documents. | Not stated. | None | spec.md |
| Q003 | The planning run offers a session goal for the program instead of skipping it. | Not stated. | None | plan.md |
| Q004 | Phase 001 writes a new sk-design README from the skill README template. | Not stated. | None | spec.md REQ-001 |
| Q005 | The implement run on phase 001 uses Autonomous mode. | Not stated. | None | tasks.md T004-T015 |
| Q006 | Install-guide authoring stays retired, so the route was removed from every sk-doc routing surface in commit 56cb7775a8b. | Not stated. | None | implementation-summary.md Key Decisions |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:337e2d66-377c-4a62-99f7-86910ae24591oolu_01RdW8gGhhSUQZqf9H1TeRx7:0 -->

Question:
```text
SpecKit Plan setup for the README program (folder, six phases and their names are already set from the handoff note). Which execution mode should /speckit:plan run in?
```

Options:
```text
Interactive (Recommended)
Autonomous
Autopilot
```

Answer:
```text
Autonomous
```

### Q002
<!-- source: claude:337e2d66-377c-4a62-99f7-86910ae24591oolu_01RdW8gGhhSUQZqf9H1TeRx7:1 -->

Question:
```text
Which research intent fits this README rewrite program?
```

Options:
```text
refactor (Recommended)
add_feature
fix_bug
```

Answer:
```text
refactor (Recommended)
```

### Q003
<!-- source: claude:337e2d66-377c-4a62-99f7-86910ae24591oolu_01RdW8gGhhSUQZqf9H1TeRx7:3 -->

Question:
```text
Should this planning run set a session goal?
```

Options:
```text
Skip (Recommended)
Offer a session goal
```

Answer:
```text
Offer a session goal
```

### Q004
<!-- source: claude:337e2d66-377c-4a62-99f7-86910ae24591oolu_01B5CZNpDQg4L2uaQWGbcpuc:0 -->

Question:
```text
sk-design is the one skill folder with a SKILL.md and no README.md. Should phase 001 write a new .skilled/skills/sk-design/README.md from the skill README template, checked against its files? (local-webflow leaves the phase either way: it is a symlink into another project outside this repository and git does not track it, so phase 001 covers 13 existing skill READMEs.)
```

Options:
```text
Write it (Recommended)
Leave it out
```

Answer:
```text
Write it (Recommended)
```

### Q005
<!-- source: claude:f7735347-b0b1-4b4f-a0cd-c44e70a362ab:toolu_014pYMtgckDpEUbqizwCjbx8:0 -->

Question:
```text
Which execution mode should the /speckit:implement run on phase 001 (the 14 skill READMEs) use?
```

Options:
```text
Autonomous :auto (Recommended)
Confirm :confirm
```

Answer:
```text
Autonomous :auto (Recommended)
```

### Q006
<!-- source: claude:f7735347-b0b1-4b4f-a0cd-c44e70a362ab:toolu_014pYMtgckDpEUbqizwCjbx8:2 -->

Question:
```text
CI on main is red: install-guide-contract.test.cjs says install-guide authoring is retired, but commit fad83abd791 added sk-create-readme/assets/install-template.md and put "install guide" back at sk-doc/hub-router.json:252. Which truth wins?
```

Options:
```text
A) Keep the retirement
B) Install guides are back
C) Leave it red
```

Answer:
```text
A) Keep the retirement
```

<!-- /ANCHOR:operator-answers-verbatim -->
