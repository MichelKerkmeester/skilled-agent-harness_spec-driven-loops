---
title: "Decision Record: Phase 4: hook-readme-fold-and-rewrite"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-hook-readme-fold-and-rewrite operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite"
    last_updated_at: "2026-11-16T05:26:14.890Z"
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
# Decision Record: Phase 4: hook-readme-fold-and-rewrite

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The operator fixes line 54 of .skilled/hooks/env-secret-guard/README.md by hand, changing 'every adapter,' to 'every adapter except Vibe,', and the session then rechecks and signs off T021. | Not stated. | None | T021, CHK-011, tasks.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a4c37e98-2c3a-4c20-a7bf-acbc32e31f29:toolu_01Kshnbr75cwyGpriGTMVYMP:0 -->

Question:
```text
Phase 004 is done except one line in .skilled/hooks/env-secret-guard/README.md (line 54). It says every adapter runs the after-call watch, but Vibe does not. The env-secret guard blocks agents from editing its own README, so the fix has to come from you. How should T021 close?
```

Options:
```text
I'll fix it by hand (Recommended)
Restart with guard off
Accept the draft as-is
```

Answer:
```text
I'll fix it by hand (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
