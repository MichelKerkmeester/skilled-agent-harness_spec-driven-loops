---
title: "Decision Record: Provision a nested npm package even when an ancestor installed a same-named dependency"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-provision-dev-dependencies operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/worktree-lifecycle/007-provision-dev-dependencies"
    last_updated_at: "2026-11-24T13:35:49.508Z"
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
# Decision Record: Provision a nested npm package even when an ancestor installed a same-named dependency

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Open a separate sk-git packet for the worktree dev-dependency provisioning bug. | Not stated. | None | spec.md section 2 |
| Q002 | Find the root cause, fix it, add a test and validate in this session; commit and push only after approval. | Not stated. | None | spec.md REQ-001 to REQ-003, tasks.md T003-T007 |
| Q003 | Fix the sk-git SKILL.md line that called both create and provision idempotent, push it, then remove worktree 536. | Not stated. | none | T010, tasks.md; sk-git SKILL.md v1.11.14.0; changelog/v1.11.14.0.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01Bm8YUwiAawYRSeEynppvqw:1 -->

Question:
```text
The sk-git issue is outside this packet: worktree-naming.sh create installed system-spec-kit without its dev dependencies, which broke four builds. How should it be handled?
```

Options:
```text
Just note it (Recommended)
Open a packet for it
```

Answer:
```text
Open a packet for it
```

### Q002
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01Y4rjDukBLkni6MCvDEGFse:2 -->

Question:
```text
How far should this session go on the sk-git packet now?
```

Options:
```text
Open packet and fix (Recommended)
Open packet only
```

Answer:
```text
Open packet and fix (Recommended)
```

### Q003
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_011bxxp6vYLbfEGt3iep9Vzz:0 -->

Question:
```text
The recheck confirms all 8 earlier findings are resolved. It found one new, older P1: sk-git SKILL.md:156 says `worktree-naming.sh create` and `provision` are 'both idempotent', but every `create` allocates a new worktree. Only `provision` is idempotent (critic-confirmed at worktree-naming.sh:412/416). Fix it before removing worktree 536?
```

Options:
```text
Fix, push, then clean up (Recommended)
Leave it, clean up now
```

Answer:
```text
Fix, push, then clean up (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
