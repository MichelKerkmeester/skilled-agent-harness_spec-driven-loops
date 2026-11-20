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

<!-- /ANCHOR:operator-answers-verbatim -->
