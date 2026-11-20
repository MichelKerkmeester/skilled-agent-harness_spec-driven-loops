---
title: "Decision Record: sk-code audit remediation"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-sk-code-audit-remediation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation"
    last_updated_at: "2026-11-19T17:36:37.964Z"
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
# Decision Record: sk-code audit remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The 37 unverified DeepSeek findings are verified in a first phase before the spec acts on them. | Not stated. | none | specs/sk-code/hub-architecture/006-sk-code-audit-remediation/spec.md |
| Q002 | The sk-code audit remediation packet is laid out as 8 phases. | Not stated. | none | specs/sk-code/hub-architecture/006-sk-code-audit-remediation/spec.md |
| Q003 | /speckit:plan for the remediation packet runs in autonomous mode. | Not stated. | none | specs/sk-code/hub-architecture/006-sk-code-audit-remediation/spec.md |
| Q004 | A single agent writes the spec docs for the phase children. | Not stated. | none | specs/sk-code/hub-architecture/006-sk-code-audit-remediation/spec.md |
| Q005 | The remediation packet gets a scaffolded goal.md. | Not stated. | none | specs/sk-code/hub-architecture/006-sk-code-audit-remediation/spec.md |
| Q006 | Uncommitted changes in the primary checkout are stashed, main is fast-forwarded to origin/main, and the stash is restored (only one file was left by then, L1519). | Not stated. | none | specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/spec.md |
| Q007 | The sk-code audit work goes into the v4.0.2.1 notes by folding facts into existing lines, naming both spec folders (006 and 007), so the shape check keeps passing. | Not stated. | none | specs/sk-code/hub-architecture/006-sk-code-audit-remediation/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a2d45c1b-daf3-4ea1-9cac-ecbdd83c0b5d:toolu_01BzVZKyf5qpVUM9DXqFAZgz:2 -->

Question:
```text
The audit produced 14 findings I verified and 37 DeepSeek findings I did not. How should the spec treat the 37 unverified ones?
```

Options:
```text
Verify first phase (Recommended)
Include all as-is
Verified only
```

Answer:
```text
Verify first phase (Recommended)
```

### Q002
<!-- source: claude:a2d45c1b-daf3-4ea1-9cac-ecbdd83c0b5d:toolu_01JeLSNp1Pciw9bmUmJoddyk:0 -->

Question:
```text
The /speckit:plan setup needs a phase layout for the sk-code audit remediation packet (specs/sk-code/hub-architecture/006-sk-code-audit-remediation). Which layout should I scaffold?
```

Options:
```text
8 phases (Recommended)
5 phases
```

Answer:
```text
8 phases (Recommended)
```

### Q003
<!-- source: claude:a2d45c1b-daf3-4ea1-9cac-ecbdd83c0b5d:toolu_01JeLSNp1Pciw9bmUmJoddyk:1 -->

Question:
```text
The /speckit:plan command was started without a mode suffix. How should the planning workflow run?
```

Options:
```text
Autonomous (Recommended)
Interactive
```

Answer:
```text
Autonomous (Recommended)
```

### Q004
<!-- source: claude:a2d45c1b-daf3-4ea1-9cac-ecbdd83c0b5d:toolu_01JeLSNp1Pciw9bmUmJoddyk:2 -->

Question:
```text
Who should author the spec docs for the phase children?
```

Options:
```text
Single agent (Recommended)
Multi-agent (1+2)
Multi-agent (1+3)
```

Answer:
```text
Single agent (Recommended)
```

### Q005
<!-- source: claude:a2d45c1b-daf3-4ea1-9cac-ecbdd83c0b5d:toolu_01JeLSNp1Pciw9bmUmJoddyk:3 -->

Question:
```text
Should the packet carry a session goal (goal.md) for the remediation program?
```

Options:
```text
Scaffold goal.md (Recommended)
Skip
```

Answer:
```text
Scaffold goal.md (Recommended)
```

### Q006
<!-- source: claude:4f13b979-22c2-4cb8-9c32-6053ecd082ab:toolu_014JxfBrZ7edtsQgu8MJcgLW:0 -->

Question:
```text
Your primary checkout's main is 69 commits behind origin/main, and git refused to fast-forward because 34 uncommitted files from other sessions would be overwritten. How should I handle it?
```

Options:
```text
Leave it (Recommended)
Stash, fast-forward, restore
Show me the 34 files first
```

Answer:
```text
Stash, fast-forward, restore
```

### Q007
<!-- source: claude:4f13b979-22c2-4cb8-9c32-6053ecd082ab:toolu_018WWp8Hy7nhdwzvC2hM7Kth:0 -->

Question:
```text
The v4.0.2.1 release notes are exactly at the shape checker's limits (280 lines, 32 sub-headings), so any added line fails the check. My full sk-code section needs 45 lines and 4 sub-headings. How should the sk-code work go in?
```

Options:
```text
Fold into existing lines (Recommended)
Compact section, trim elsewhere
Full section, over the limit
```

Answer:
```text
Fold into existing lines (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
