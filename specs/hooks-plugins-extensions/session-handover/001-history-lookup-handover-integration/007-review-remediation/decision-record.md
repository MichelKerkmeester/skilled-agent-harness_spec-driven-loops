---
title: "Decision Record: Phase 7: review-remediation"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-review-remediation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation"
    last_updated_at: "2026-11-15T15:09:27.933Z"
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
# Decision Record: Phase 7: review-remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Rebuild the trigger index, commit phase 007 with sk-git and merge it to main. | Not stated. | None | tasks.md T020, implementation-summary.md |
| Q002 | The local phase 007 decision-record commit is pushed after pulling origin's two newer commits. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation/spec.md |
| Q003 | origin/main is merged into worktree 399 before editing. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation/spec.md |
| Q004 | The dead prepare-time locator mint and its prepare tests are dropped, which changes the parent's frozen In Scope line. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation/spec.md |
| Q005 | For catalog and playbook entries whose names no longer fit, only the title and triggers change. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:18bab8d4-e0f3-4389-862e-01b44355af59:toolu_01U3JuwGeki75rGDYXme7cRN:0 -->

Question:
```text
Phase 007 (twelve review fixes for the handoff history lookup) is saved and passes strict validation in worktree 399, still uncommitted. How should I land it?
```

Options:
```text
Rebuild, commit, merge (Recommended)
Rebuild and commit only
Hold everything
```

Answer:
```text
Rebuild, commit, merge (Recommended)
```

### Q002
<!-- source: claude:18bab8d4-e0f3-4389-862e-01b44355af59:toolu_01Goz71MfrLP5S9AYM3T8nda:0 -->

Question:
```text
The peer pushed phase 007 to origin, but my later commit f6f268cb963 (the phase 007 decision record, docs only) is still local. Origin has since moved 2 commits ahead, so local main and origin have diverged by 1 and 2. What should I do with it?
```

Options:
```text
Pull, then push (Recommended)
Pull only
Leave it
```

Answer:
```text
Pull, then push (Recommended)
```

### Q003
<!-- source: claude:4eb2db23-5bac-4820-bd49-e03bff33aef9:toolu_017bExLf2roMrNBqDhukDqPH:0 -->

Question:
```text
Merge origin/main (9 commits ahead, up to 9b380a2e3f3: changelog, handover README, catalog and playbook index) into worktree 399 before editing?
```

Options:
```text
Merge first (Recommended)
Don't merge
```

Answer:
```text
Merge first (Recommended)
```

### Q004
<!-- source: claude:4eb2db23-5bac-4820-bd49-e03bff33aef9:toolu_017bExLf2roMrNBqDhukDqPH:1 -->

Question:
```text
Drop the prepare-time locator mint (session-handover.cjs:603-607) and its prepare tests? The claim mints its own locator and overwrites it, so this one is dead. It changes the parent's frozen In Scope line 'Mint a history locator ... when a handoff is prepared'.
```

Options:
```text
Drop it (Recommended)
Keep it
```

Answer:
```text
Drop it (Recommended)
```

### Q005
<!-- source: claude:4eb2db23-5bac-4820-bd49-e03bff33aef9:toolu_017bExLf2roMrNBqDhukDqPH:2 -->

Question:
```text
For the catalog and playbook entries whose names no longer fit, what should change?
```

Options:
```text
Title and triggers only (Recommended)
Rename files too
```

Answer:
```text
Title and triggers only (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
