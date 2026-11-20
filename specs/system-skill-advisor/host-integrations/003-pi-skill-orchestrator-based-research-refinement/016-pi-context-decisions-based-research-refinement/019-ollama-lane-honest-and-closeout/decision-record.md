---
title: "Decision Record: Phase 19: ollama-lane-honest-and-closeout"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "019-ollama-lane-honest-and-closeout operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout"
    last_updated_at: "2026-11-20T00:15:52.877Z"
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
# Decision Record: Phase 19: ollama-lane-honest-and-closeout

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build the three lane fixes and run a real ablation with a local ollama serve, stopping it afterwards. | Not stated. | none | REQ-001 to REQ-005, T003 to T009 |
| Q002 | Write each ended session's pending answers into the packet each one decided. | Not stated. | none | REQ-009, T011 |
| Q003 | Write all 231 mapped answers after verifying the inferred mappings, with one commit per spec track. | Not stated. | none | D3, REQ-009, T011 |
| Q004 | Run both alignment checks with Vibe DeepSeek Flash lanes; the critic also ran on it. | Not stated. | none | D6, REQ-013, T014 |
| Q005 | Run both alignment checks in :auto report-only mode, then fix or accept every finding. | Not stated. | none | D6, REQ-013, T014, T015 |
| Q006 | The expansive deep review covers this session's 019 work, its five follow-up fixes and the ten answer-routing commits, and leaves phase 018 out. | Not stated. | None | review/review-report.md, review/fanout-review-focus.txt |
| Q007 | The review runs three cli-mistral-vibe lineages on deepseek-flash. | Not stated. | None | review/fanout-config.json |
| Q008 | Swap the gitignored command in the Vibe document test for a tracked one, and remove worktree 480. | Not stated. Evidence: yes_no, option false, overlap 0, imperative false, shift false. | None | implementation-summary.md (Vibe document test in CI row) |
| Q009 | Remove worktree 480 again and revert the stop-loop noise in the 016 parent's description.json and graph-metadata.json. | Not stated. Evidence: yes_no, option true, overlap 0, imperative false, shift false. | None | the 016 parent's description.json and graph-metadata.json |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01XMDVtEebTNvXYMmBsamYtt:1 -->

Question:
```text
The Ollama lane is off, with a re-enable checklist (coverage refresh and gate, outage counted as degraded, OLLAMA_* env forwarding, fresh ablation). You earlier chose to write those as a checklist, not build them. To leave nothing open, how far should I go? A real ablation needs `ollama serve` started locally (installed, nomic-embed-text already pulled); I'd stop it afterwards.
```

Options:
```text
Build 3 fixes + ablate (Recommended)
Build 3 fixes, no ablation
Delete the lane instead
```

Answer:
```text
Build 3 fixes + ablate (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01XMDVtEebTNvXYMmBsamYtt:2 -->

Question:
```text
Other sessions left unrecorded operator answers: fddcf466 (57), f863f57a (9), ef52f514 (5), ffe8ca1c (3), and three with 1 each. The save rule says a session writes no entries for other sessions' answers. How should these be closed?
```

Options:
```text
Route each to its packet (Recommended)
Leave to those sessions
```

Answer:
```text
Route each to its packet (Recommended)
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_013YPd3z1gyXR23Q6TLRZnnw:0 -->

Question:
```text
Unrecorded operator answers are far more than the 7 sessions I described. The read-only map found 606 pending in this repo. 246 are already in committed decision records but were never marked consumed, 35 already sit in hand-written tables, and 71 are skips (Gate 3 D, gitignored specs/other, Barter repo, questions back). That leaves 231 answers to write across 75 packets, many of which have no decision-record.md yet. On 11-17 you answered "None for now" to recording this backlog; today you said route each to its packet. How far should I go?
```

Options:
```text
All 231, commit per track (Recommended)
All 231, commit per packet
Confirmed only
Backfill only
```

Answer:
```text
All 231, commit per track (Recommended)
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0162JywkkKKWdLNUpfRgLxoV:0 -->

Question:
```text
Which model should review the 019 change in /local-skilled-alignment (branch vs f2f03c90fb6) and /local-doc-alignment (new advisor-vector topic)? 015 and 016 used opencode-go; Luna wrote this code, so a different family gives an independent read.
```

Options:
```text
opencode-go (Recommended)
codex
opus-high
Battery only
```

Answer:
```text
Cli vibe deepseek flash
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0162JywkkKKWdLNUpfRgLxoV:1 -->

Question:
```text
How should the two runs handle checkpoints and fixes?
```

Options:
```text
:auto, report then I fix (Recommended)
:auto with --fix literal
:confirm
```

Answer:
```text
:auto, report then I fix (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01Wk8H15zVz2ebXiAMjPyqcy:0 -->

Question:
```text
Which work should the expansive deep review cover? Phase 018's commit f9f293f772c set the semantic lane to weight 0 and added the heartbeat reaper; 019 builds on it, but it was not part of this session's work.
```

Options:
```text
019 + follow-ups (Recommended)
Add 018 too
Code only
```

Answer:
```text
019 + follow-ups (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01Wk8H15zVz2ebXiAMjPyqcy:1 -->

Question:
```text
Which executors should run the 3 parallel review lanes?
```

Options:
```text
2 Vibe + 1 Codex (Recommended)
3 Vibe DeepSeek Flash
Native Claude, one lane
```

Answer:
```text
3 Vibe DeepSeek Flash
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:chat:2476513a-5ea2-45bb-969a-7883f146a3fb:763e97b1-fa88-45e0-a21c-e8303fc49102 -->

Question:
```text
Two decisions are still yours: should I swap the gitignored command in packet 008's Vibe test for a tracked one, and should I remove worktree 480?
```

Options: none

Answer:
```text
Go
```

### Q009
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:chat:def46857-8768-4f1f-bd7f-903c970deabd:9ad5049f-cf1e-42e7-92df-e3b2e1a854f9 -->

Question:
```text
Should I remove worktree 480 again? Should I revert the stop-loop noise in the 016 parent's description.json and graph-metadata.json to their committed versions?
```

Options: none

Answer:
```text
yes to all
```

<!-- /ANCHOR:operator-answers-verbatim -->
