---
title: "Decision Record: Research the current repository reality for a root README rewrite"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "025-root-readme-rewrite operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite"
    last_updated_at: "2026-11-19T17:37:49.743Z"
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
# Decision Record: Research the current repository reality for a root README rewrite

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The 20-iteration Devin research may run each iteration with --permission-mode dangerous. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/spec.md |
| Q002 | The README plan is approved with hooks, plugins and extensions placed below skills, and it may run a bit longer if the sentences stay short and optimized. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/spec.md |
| Q003 | The validator exempts the four root guides and CROSS-CLI.md from the per-section --- divider rule. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/spec.md |
| Q004 | SECURITY.md keeps all six newly disclosed risks. | Not stated. | none | specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:471a5d1f-da2b-4389-a4e0-fca7b0f046c0:toolu_01DQPkp5ACzqJNMHmnXBqZyf:0 -->

Question:
```text
The 20-iteration Devin research (deepseek-v4-1-flash-max) runs each iteration with --permission-mode dangerous, because the iteration has to write its own state files. The write limit to the research folder is enforced by the prompt, and a guard reports any write outside it afterwards. Approve dangerous mode for this whole research run?
```

Options:
```text
Approve (Recommended)
Use native instead
Use another CLI model
```

Answer:
```text
Approve (Recommended)
```

### Q002
<!-- source: claude:471a5d1f-da2b-4389-a4e0-fca7b0f046c0:toolu_01KX8fTD6yuh1e4oHBDF1ywn:0 -->

Question:
```text
Approve this README rewrite plan: ~550–650 lines in 13 sections, one ### subsection per hook, plugin and extension, every stale claim fixed, and the parent phase map row added for 025?
```

Options:
```text
Approve as proposed (Recommended)
Approve, keep it longer
Change the order first
```

Answer:
```text
Hooks plugins extensions below skills, also make it. A bit longer as lomg as its optimized shortish sentences proper paragraphs, no over use of bleted lists wrc
```

### Q003
<!-- source: claude:471a5d1f-da2b-4389-a4e0-fca7b0f046c0:toolu_01BxCvKUxcofrxwrGzPVjsjX:0 -->

Question:
```text
The repo's validator rejects the four root guides (install, contributing, release, security) and CROSS-CLI.md unless each numbered section has a --- divider line above it. Only README.md is exempt. Which spacing should they use?
```

Options:
```text
Spacer plus divider (Recommended)
Exempt them in validator
Divider only
```

Answer:
```text
Exempt them in validator
```

### Q004
<!-- source: claude:471a5d1f-da2b-4389-a4e0-fca7b0f046c0:toolu_01BxCvKUxcofrxwrGzPVjsjX:1 -->

Question:
```text
SECURITY.md now discloses six risks it did not before, each sourced: live sync auto-pushes commits, the Jev screen sends fetched web text to a hosted classifier, the link option can share .env with a linked project, the stale-build rebuild at session start, Vibe dispatches run with auto-approve, and the git-hook trust rule. Keep them?
```

Options:
```text
Keep all six (Recommended)
Remove the new ones
```

Answer:
```text
Keep all six (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
