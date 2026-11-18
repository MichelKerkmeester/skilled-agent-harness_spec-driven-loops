---
title: "Decision Record: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-surfacing-scorer-follow-ups operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups"
    last_updated_at: "2026-11-17T22:04:54.279Z"
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
# Decision Record: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Hand the nine fixes to a session with fresh context through a handoff note, which this session then claimed and continued after compaction. | Not stated. | None | scratch/work-record.md |
| Q002 | Keep the low-information wide-cluster rule, so a floored rival still makes a short vague prompt abstain. | The rule is a recorded decision from commit 1c80022452b, and the cited prompt does not reproduce in Skilled. | None | spec.md section 10, tasks.md T008 |
| Q003 | Keep the 0.08 command tie-break, so a command still ranks below its owning skill on an exact bridge match. | Packet 007 research kept the tie-break, and the command is still offered beside its owner. | None | spec.md section 10, tasks.md T009 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01B1XWDX66jJdHhzNs27k82s:2 -->

Question:
```text
This session is past its context window, and the 9 fixes are a large build: scorer changes with a regression corpus on top of each. Should I hand over to a fresh session or keep going here?
```

Options:
```text
Hand over (Recommended)
Continue here
```

Answer:
```text
Hand over (Recommended)
```

### Q002
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01R735gnWaCqN99iMUjcwf7M:0 -->

Question:
```text
Item 2: the vendoring project wants a floored rival (confidence lifted to 0.82) to stop tying a real match on short prompts. Skilled chose the opposite in commit 1c80022 (2026-10-27): "the low-information abstention still reads the wider cluster so a floored skill cannot top an under-specified prompt", and a test pins it. The prompt they cite does not reproduce in Skilled: "commit my changes" routes to sk-git at 0.92. Which wins?
```

Options:
```text
Keep current rule (Recommended)
Narrow the rule
```

Answer:
```text
Keep current rule (Recommended)
```

### Q003
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01R735gnWaCqN99iMUjcwf7M:1 -->

Question:
```text
Item 3: on an exact bridge match, the command still ranks second, below the skill that owns it (-0.08 when the prompt has no slash). Packet 007's research decided to "keep the 0.08 adjustment as a tie-break and add a same-owner precedence rule", and the brief already offers the command as the same answer. Which wins?
```

Options:
```text
Keep the order (Recommended)
Command first on exact match
```

Answer:
```text
Keep the order (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
