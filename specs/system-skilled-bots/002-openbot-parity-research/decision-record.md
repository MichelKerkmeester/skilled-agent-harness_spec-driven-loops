---
title: "Decision Record: OpenBot parity research for skilled bots"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "002-openbot-parity-research operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research"
    last_updated_at: "2026-11-24T19:25:30.526Z"
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
# Decision Record: OpenBot parity research for skilled bots

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Split the research into four lineages of 13 iterations: two on Devin and two on Vibe, 52 in total. | Each lineage has a hard 4-hour limit, and smaller lineages leave margin. | None | goal.md D1, plan.md, research/fanout-config.json |
| Q002 | Scope OpenBot parity to a small team, keeping sign-in, roles and shared memory in scope. | Not stated. | None | goal.md D3, spec.md scope, research/research.md section 12 |
| Q003 | Build a terminal screen early, right after the activity view and routines, with activity, inbox and routine panes first. | Those items already write the data the screen shows, and the operator prefers the terminal to a desktop app. | None | research/research.md section 15 |
| Q004 | Build the terminal screen as a new MIT Rust ratatui app that follows openhuman-tui's layout and keys but copies none of its code. | openhuman is GPL-3.0-only and Skilled is MIT, so a fork would put the screen under GPL. | None | research/research.md section 15 |
| Q005 | Commit and push packet 002 without the Vibe session-log folders (vibe-home, vibe-output). | They are 45 MB of raw journals, and the iterations, deltas and syntheses already hold the research. | None | git history on system-skilled-bots |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01JZYqWc5PVHYw1mRHCoVR2D:1 -->

Question:
```text
How should the 50+ iterations be split? Each lineage has a hard 4-hour limit, so 25 iterations in one lineage is tight at roughly 10 minutes an iteration.
```

Options:
```text
4 lineages, 13 iters (Recommended)
2 lineages, 25 iters
Devin first, Vibe as fallback
```

Answer:
```text
4 lineages, 13 iters (Recommended)
```

### Q002
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01JZYqWc5PVHYw1mRHCoVR2D:2 -->

Question:
```text
What is 'our use case' for scoping OpenBot parity? It decides which of OpenBot's parts the research keeps and which go on the skip list.
```

Options:
```text
Solo dev + personal assistant (Recommended)
Solo dev, repo bots only
Small team
```

Answer:
```text
Small team
```

### Q003
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01Y2x42GSnAQ6ek4F6WxeVyR:0 -->

Question:
```text
What kind of UI do you want for skilled bots, and when should it come?
```

Options:
```text
Terminal screen early (Recommended)
Local web page
Desktop app
```

Answer:
```text
Terminal screen early (Recommended)
```

### Q004
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01CSfSh9b6ER7mZge8pMCn1F:0 -->

Question:
```text
openhuman's terminal app is GPL-3.0-only while Skilled is MIT, and it is 9,526 lines of Rust wired to openhuman's own engine. How should we build the bots terminal screen?
```

Options:
```text
Fork, separate GPL program (Recommended)
Rebuild in Rust, MIT
Rebuild in Node, MIT
```

Answer:
```text
Rebuild in Rust, MIT
```

### Q005
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01CSfSh9b6ER7mZge8pMCn1F:1 -->

Question:
```text
Packet 002 (the finished research) is ready to commit to system-skilled-bots. 45 MB of it is Vibe's raw session logs (no keys found). Commit and push which way?
```

Options:
```text
Without Vibe logs (Recommended)
With everything
Not yet
```

Answer:
```text
Without Vibe logs (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
