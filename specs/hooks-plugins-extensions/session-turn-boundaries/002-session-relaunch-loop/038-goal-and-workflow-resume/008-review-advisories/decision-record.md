---
title: "Decision Record: Phase 8: review-advisories"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-review-advisories operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories"
    last_updated_at: "2026-11-13T06:11:05.251Z"
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
# Decision Record: Phase 8: review-advisories

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED stays at 1 in the gitignored hook-flags.env after the live hop test. | Not stated. | None | .skilled/hooks/hook-flags.env |
| Q002 | The goal carry-over harness and the Claude relaunch playbook text are fixed now, so a Claude sender with a goal gets no ending prompt and prepare runs early. | Not stated. | None | 028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh, session-relaunch-claude.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:74f9de05-0121-41a0-9099-52709127e249:toolu_01SbkgxX846Hy1dXve5fRrp3:1 -->

Question:
```text
The sending session turned SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED on in the gitignored hook-flags.env for this test. It was 0 before. Where should it end up?
```

Options:
```text
Back to 0 (Recommended)
Keep at 1
```

Answer:
```text
Keep at 1
```

### Q002
<!-- source: claude:74f9de05-0121-41a0-9099-52709127e249:toolu_01PVtSsE4tdggxGrKnkLQU5u:1 -->

Question:
```text
The playbook harness for check GR-1 fails as written on Claude Code 2.1.323: its 'ping' prompt withdraws a hand-over that is already armed. Shall I fix the harness script and the playbook text?
```

Options:
```text
Fix both now (Recommended)
Not now
```

Answer:
```text
Fix both now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
