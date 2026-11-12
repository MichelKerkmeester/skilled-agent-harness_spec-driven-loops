---
title: "Decision Record: Phase 6: append-lock-stale-reclaim"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-append-lock-stale-reclaim operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/006-append-lock-stale-reclaim"
    last_updated_at: "2026-11-12T15:11:25.779Z"
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
# Decision Record: Phase 6: append-lock-stale-reclaim

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Phase 006 ships the reclaim-directory design for a stale append lock, not the frozen rename design. | Not stated. | None | spec.md REQ-005 and its design amendment, withAppendLock in .skilled/hooks/session-relaunch/lib/relaunch-core.cjs |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:6f6d0815-5182-4dab-96b0-b36b0b73deea:toolu_018V4VaVmNtjRQAQDxuGnvU6:0 -->

Question:
```text
Phase 006 (stale append-lock reclaim): the phase goal froze a rename-with-identity-check design (decisions D1 and D2). I measured it in a scratch copy: with one stale lock and 8 concurrent waiters it let two waiters hold the lock 127 to 176 times per 60 rounds (0 times with only 2 waiters). A different design, a short-lived `.reclaim` directory that lets one waiter at a time re-check the lock's age and remove it, measured 0 overlaps in 180 rounds of 8 waiters and 30 rounds of 16, and is what the worktree holds now. Which design should phase 006 ship?
```

Options:
```text
Reclaim directory (Recommended)
Frozen rename design
```

Answer:
```text
Reclaim directory (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
