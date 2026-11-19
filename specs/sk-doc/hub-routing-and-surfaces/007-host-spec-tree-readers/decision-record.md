---
title: "Decision Record: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-host-spec-tree-readers operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/007-host-spec-tree-readers"
    last_updated_at: "2026-11-19T17:37:07.894Z"
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
# Decision Record: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | All three unstarted Barter handover items (5, 6, 7) are planned, one packet each. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/007-host-spec-tree-readers/spec.md + specs/sk-code/verification-guards/005-surface-intent-fold-declaration/spec.md + specs/sk-git/commit-standards/008-doctor-host-hook-acceptance/spec.md |
| Q002 | The built items 5, 6 and 7 in worktree 368 are committed, merged and pushed. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/007-host-spec-tree-readers/spec.md + specs/sk-code/verification-guards/005-surface-intent-fold-declaration/spec.md + specs/sk-git/commit-standards/008-doctor-host-hook-acceptance/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_017h44TRQsyvVXxEMTt3iM82:0 -->

Question:
```text
The new Barter handover has three unstarted items: 5 (three readers assume Skilled's own spec tree), 6 (verify-router-sync rejects a hub that folds a child's intents) and 7 (doctor git check fails hand-over hooks and an omitted post-commit). Which should I take on in Skilled?
```

Options:
```text
Plan all three (Recommended)
Items 5 and 7 only
Analyze only
Leave them
```

Answer:
```text
Plan all three (Recommended)
```

### Q002
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01PipubZwrJFh4cdCyKbBRPG:0 -->

Question:
```text
Barter handover items 5, 6 and 7 are built in worktree 368 and uncommitted. All gates pass (bin tests 181 of 182 with 1 skipped, doctor tests 83 of 83, router-sync tests 16 of 16, three packets RESULT: PASSED). None of it was run inside Barter's real tree. What should I do with it?
```

Options:
```text
Commit, merge, push (Recommended)
Commit only
Leave uncommitted
```

Answer:
```text
Commit, merge, push (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
