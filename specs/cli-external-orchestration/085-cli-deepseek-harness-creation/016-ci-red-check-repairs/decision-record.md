---
title: "Decision Record: Phase 16: ci-red-check-repairs"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "016-ci-red-check-repairs operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/016-ci-red-check-repairs"
    last_updated_at: "2026-11-08T09:05:30.258Z"
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
# Decision Record: Phase 16: ci-red-check-repairs

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Repair every red check, the system-skilled-doctor playbook included, despite its live worktrees 320 and 324. | Not stated. | None | 016-ci-red-check-repairs spec.md section 3, tasks.md T004 |
| Q002 | The DSH plugin tests move into per-concern tests/ folders. | Not stated. | None | commit add85004bd |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01CWc2FV45WHM7hdykv4kFcB:1 -->

Question:
```text
The system-skilled-doctor playbook has 2 violations, but another session has live worktrees on that skill (320, 324). Which fixes should I include?
```

Options:
```text
All but doctor (Recommended)
Everything
Only 1 and 2
```

Answer:
```text
Everything
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01LUFrHMLQArCroqMzb9pQGF:0 -->

Question:
```text
Where should the 8 DSH plugin test files live? Today they're in `.dsh/plugins/repo-guards/tests/`. sk-code-skilled's house rule says a test never sits beside its source and belongs in a `tests/` folder. The hook library README says tests sit next to their code, as Pi's do, and about 40 existing tests follow that. Two concern folders (post-edit-quality, session-relaunch) already use their own `tests/` folder. The biggest DSH test file covers about 15 adapters in 9 concern folders.
```

Options:
```text
Per-concern tests/ (Recommended)
Keep where they are
Beside each adapter
```

Answer:
```text
Per-concern tests/ (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
