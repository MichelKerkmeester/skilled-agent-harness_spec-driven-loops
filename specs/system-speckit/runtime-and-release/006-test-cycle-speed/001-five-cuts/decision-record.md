---
title: "Decision Record: Test cycle speed: cut the spec-kit suite time and the gate stacking"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-test-cycle-speed operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/005-test-cycle-speed"
    last_updated_at: "2026-11-10T12:21:55.671Z"
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
# Decision Record: Test cycle speed: cut the spec-kit suite time and the gate stacking

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The test-cycle plan lives in a new system-speckit packet and changes no code. | Not stated. | None | spec.md scope, plan.md |
| Q002 | DeepSeek v4.1 flash max may edit files through Devin's dangerous permission mode for the cut 1 build. | Not stated. | None | implementation-summary.md how-delivered |
| Q003 | The test:council script was first to be left as it was. | Not stated. | None | spec.md questions |
| Q004 | test:council runs its two deep-loop files under deep-loop's own config, so it still covers every file it covered before. | Leaving the script unchanged would have made it skip the two files without a word once cut 1 landed. | The earlier Leave it answer to Q1 | spec.md scope, tasks.md T011, package.json |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:57bcd03f-32c4-439a-a610-ec91a7c3d3ba:toolu_01RGopo1pcgGpJgN6efnEcsy:2 -->

Question:
```text
Where should the plan for a faster, simpler test cycle live? It is a plan only, no code changes.
```

Options:
```text
New system-speckit packet (Recommended)
Chat only
Phase 009 of sweet-search packet
```

Answer:
```text
New system-speckit packet (Recommended)
```

### Q002
<!-- source: claude:57bcd03f-32c4-439a-a610-ec91a7c3d3ba:toolu_01DmnbwsyHr4R4AdFWCmGxPF:2 -->

Question:
```text
The DeepSeek worker has to edit files, so it needs Devin's `--permission-mode dangerous`. The cli-devin skill requires your approval once per task. Approve it for this build?
```

Options:
```text
Approve dangerous (Recommended)
Read-only DeepSeek
```

Answer:
```text
Approve dangerous (Recommended)
```

### Q003
<!-- source: claude:57bcd03f-32c4-439a-a610-ec91a7c3d3ba:toolu_01DmnbwsyHr4R4AdFWCmGxPF:3 -->

Question:
```text
Plan question Q1: the `test:council` npm script in the spec-kit runtime also names two deep-loop test files. Should cut 1 remove those too?
```

Options:
```text
Leave it (Recommended)
Remove them too
```

Answer:
```text
Leave it (Recommended)
```

### Q004
<!-- source: claude:57bcd03f-32c4-439a-a610-ec91a7c3d3ba:toolu_01Sib7nowHVRkz5x1SMDnwAM:0 -->

Question:
```text
New fact on test:council: once cut 1 lands, `vitest list` shows the script silently skips its two deep-loop council files, because they are no longer in the spec-kit config's include. So leaving the script alone does change it: it runs 8 files where it used to run 10, and says nothing. How should it be handled?
```

Options:
```text
Run them via deep-loop (Recommended)
Drop the two paths
Leave it skipping
```

Answer:
```text
Run them via deep-loop (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
