---
title: "Decision Record: Phase 1: dead-hook-file-removal"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-dead-hook-file-removal operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal"
    last_updated_at: "2026-11-15T15:18:32.711Z"
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
# Decision Record: Phase 1: dead-hook-file-removal

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Delete .skilled/hooks/git/ together with the test cases, the gate-list entry and the CI step that exist to prove it. | Not stated. | None | plan.md ADR-001 and tasks T004 to T011 |
| Q002 | Delete the five untracked stray paths under .skilled/hooks/ on the main checkout after backing up the one log. | Not stated. | None | tasks T002 and acceptance criterion AC-010 |
| Q003 | Run a third review of phase 1 on the fixed tree, one more than the two the implement workflow allows. | Not stated. | None | implementation-summary.md, How It Was Delivered |
| Q004 | Close phase 1 on the fixed tree without a fourth review, so it closes with no APPROVED verdict on record. | Not stated. | None | implementation-summary.md, How It Was Delivered |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:133f8e07-9936-40d6-9e69-2265d880c7d0:toolu_018bCWESEvGFdxPYXYuEXnYq:1 -->

Question:
```text
Legacy .skilled/hooks/git/: the plan says to halt if a test exists to prove the legacy hook, and several do. pre-commit.test.sh has 9 cases that run it, broken-move-drill.sh has 2, and check-gate-inputs.sh lists it as a required gate file with 7 fixture cases written against it. Nothing installs it: this checkout links scripts/git-hooks/pre-commit. Delete it anyway?
```

Options:
```text
Delete with its tests (Recommended)
Keep git/ in place
```

Answer:
```text
Delete with its tests (Recommended)
```

### Q002
<!-- source: claude:133f8e07-9936-40d6-9e69-2265d880c7d0:toolu_018bCWESEvGFdxPYXYuEXnYq:2 -->

Question:
```text
Main checkout strays: five untracked paths under .skilled/hooks/ on main hold no source. session-relaunch/ is 7 empty folders. decision-capture/.skilled/logs/cli-dispatch-audit.log is one 4K log. dispatch/node_modules, dispatch/lib/node_modules and dispatch/pi/node_modules each hold one Vitest results.json cache. To undo: I copy the log to the session scratchpad first and copy it back, the empty folders are recreated with mkdir, and the caches regenerate on the next test run. Delete them now?
```

Options:
```text
Yes, delete all five (Recommended)
No, leave main alone
```

Answer:
```text
Yes, delete all five (Recommended)
```

### Q003
<!-- source: claude:3ea54291-0b23-4abb-9332-032bf7c88ccf:toolu_01DnMuVpYxbqur5WxuRbd4JD:0 -->

Question:
```text
Phase 1 (dead hook file removal) hit the review cap: /speckit:implement allows two @review dispatches and the second also returned REQUESTED_CHANGES, so the workflow says stop. Its two blocking findings were (1) three more lines naming the deleted hook-flags.ts in brace form, now fixed and verified, and (2) the release-note sentence missing from implementation-summary.md, which the workflow itself forbids writing before approval. All gates match the baseline after the fixes. How should I close phase 1?
```

Options:
```text
Third review (Recommended)
Close without review
Stop here
```

Answer:
```text
Third review (Recommended)
```

### Q004
<!-- source: claude:3ea54291-0b23-4abb-9332-032bf7c88ccf:toolu_01QSFpCjqkZD6u4Y7fzWMMfT:0 -->

Question:
```text
The third @review of phase 1 (dead hook file removal) also returned REQUESTED_CHANGES, with one finding: `.skilled/scripts/git-hooks/tests/README.md` still said "The legacy hygiene helper gets the same cases" about the removed pre-commit. I confirmed it and deleted the sentence. The reviewer ran about 20 other searches plus import and symlink checks and found nothing else, and I then read every doc line that describes an edited test, script or workflow. The code and tests have passed all three rounds; each round's finding was one stale doc sentence. How should I close phase 1?
```

Options:
```text
Close now (Recommended)
Fourth review
Stop here
```

Answer:
```text
Close now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
