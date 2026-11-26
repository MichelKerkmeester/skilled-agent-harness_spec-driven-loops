---
title: "Decision Record: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-openbot-parity-build operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build"
    last_updated_at: "2026-11-26T13:05:08.849Z"
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
# Decision Record: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Both key maps are approved: the terminal key map in 003/001 AC-007 and the 010/001 design/key-map-delta.md. | Not stated. | None | 003-terminal-screen, 010-conversations |
| Q002 | Decisions D5 and D6 are tightened rather than kept as taken. | Not stated. | None | spec.md decisions D5 and D6 |
| Q003 | Before choosing scope cuts, the operator asked for more detail on items 3 and 4, the members roster half and the Linux secret store group. | Not stated. | None | spec.md scope |
| Q004 | Delete the stray untracked files and keep the 012 manual testing scenarios. | Not stated. | None | 012-manual-testing-scenarios |
| Q005 | D5 tightens in whichever way gives the best UX without adding memory or disk use. | Not stated. | None | spec.md D5, 007-per-bot-apps |
| Q006 | D6 tightens by sandboxing each bot child. | Not stated. | None | spec.md D6 |
| Q007 | Keep the members half of the channel roster, so anyone listed in members can answer from a channel. | Not stated. | None | 011-messaging-channels |
| Q008 | Cut none of scope item 4: the Linux secret-tool store, BOTS_UI_BIN and the next-open restore all stay. | Not stated. | None | 008-vault, 003-terminal-screen, 007-per-bot-apps |
| Q009 | D5 tightens by opt-in: a shared bot with no worktree must declare apps: repository, and its record says repository rather than []. | Not stated. | None | spec.md D5, 007-per-bot-apps |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:0 -->

Question:
```text
Status: the parity build plan is finished. It is pushed at 036026f5d89 and all 15 folders pass strict validation. None of my workers are running. Before the build starts, do you approve the two key maps, the terminal key map (003/001 AC-007) and the 010/001 design/key-map-delta.md?
```

Options:
```text
Approve both (Recommended)
Approve terminal only
Review first
```

Answer:
```text
Approve both (Recommended)
```

### Q002
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:1 -->

Question:
```text
While you said not to ask, I took the recommended default for decisions D1 to D11 and A1 to A7. D5 and D6 accept a small leftover security risk, which the review flagged. Do they stand?
```

Options:
```text
Keep all as taken (Recommended)
Tighten D5 and D6
Review all first
```

Answer:
```text
Tighten D5 and D6
```

### Q003
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:2 -->

Question:
```text
The review proposed scope cuts that I kept in scope. Which of them should be cut?
```

Options:
```text
Cut nothing (Recommended)
WhatsApp and Signal later
Members roster half
Linux secret store and more
```

Answer:
```text
need more info on 3 and 4
```

### Q004
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:3 -->

Question:
```text
Two sets of untracked files are in the worktree. What should happen to them?
```

Options:
```text
Delete stray, keep 012 (Recommended)
Delete both
Keep both for now
```

Answer:
```text
Delete stray, keep 012 (Recommended)
```

### Q005
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:0 -->

Question:
```text
D5 today: a bot run with no worktree of its own (a shared run) can't get a narrowed apps list. The project's MCP config files pin the full .utcp_config.json, so its child sees every app while the record says posture.apps: []. How should D5 tighten?
```

Options:
```text
Opt in and record truth (Recommended)
Refuse all shared runs
Narrow per executor
```

Answer:
```text
we need best ux without bloating memory or disk space
```

### Q006
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:1 -->

Question:
```text
D6 today: every bot child runs as your OS user, so any child can read any secret, whether from a 0600 value file or by calling the security tool on the keychain. A grant only decides which secret is injected. How should D6 tighten?
```

Options:
```text
Sandbox each child (Recommended)
Separate OS user
Keep, and warn louder
```

Answer:
```text
Sandbox each child (Recommended)
```

### Q007
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:2 -->

Question:
```text
Scope item 3, the members roster half: phase 011/003 lets a channel answer come from the owner or from anyone listed in members of operators.json, and adds bots channel roster add, remove and list. Cutting the members half keeps only the owner. Only you could answer from a phone, and the roster verbs shrink to setting the owner. Cut it?
```

Options:
```text
Keep members (Recommended)
Cut members
```

Answer:
```text
Keep members (Recommended)
```

### Q008
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:3 -->

Question:
```text
Scope item 4 is three small pieces. Linux secret-tool: 008 stores secrets in the Linux Secret Service, else a 0600 file. BOTS_UI_BIN: a test-only variable letting the bots ui verb's tests use a stub instead of building the Rust screen. 007 next-open restore: if a run is killed before it puts the worktree's own .utcp_config.json back, the next open of that tree restores it. Which should be cut?
```

Options:
```text
Cut none (Recommended)
Cut Linux secret-tool
Cut BOTS_UI_BIN
Cut next-open restore
```

Answer:
```text
Cut none (Recommended)
```

### Q009
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_0158bJFugqyGdUrGQU6sco6H:1 -->

Question:
```text
For the parked bots plan: D5 tightens with shared bots opting in. A bot with no worktree must declare apps: repository on purpose, and its record says repository rather than []. No extra memory or disk. Does that work?
```

Options:
```text
Yes, opt in (Recommended)
Explain more first
```

Answer:
```text
Yes, opt in (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
