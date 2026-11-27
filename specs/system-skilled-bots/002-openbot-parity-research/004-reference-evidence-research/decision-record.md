---
title: "Decision Record: Reference evidence research for the OpenBot parity build"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-reference-evidence-research operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research"
    last_updated_at: "2026-11-27T07:15:00.988Z"
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
# Decision Record: Reference evidence research for the OpenBot parity build

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Research both angles: per planned 003 phase the reference code to lift or mirror and its pitfalls, plus what the ten repos have that the plan and the skip list both miss, with openhuman-full read first. | Not stated. | None | spec.md Scope, scratch/research-topic.txt |
| Q002 | Run four parallel lineages of 10 iterations: two on cli-mistral-vibe deepseek-flash and two on cli-pi deepseek-v4.1-flash-1017, all at max thinking. | Not stated. | None | goal.md D1, plan.md Invocation |
| Q003 | Review the finished research with two cli-mistral-vibe deepseek-flash lineages of 10 iterations each. | The runtime refuses a single Vibe lineage, and two full lineages give two independent reads to compare. | None | review/fanout-config.json |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:898906b1-abe5-411a-9d60-305d89889d36:toolu_012T6UWtgaRsmZn9LEPoDUZu:1 -->

Question:
```text
What should the research answer? Earlier runs covered parity (what to build), plan review and plan depth. openhuman-full, the 757 MB repo with a built Rust terminal app, has not been studied by any of them.
```

Options:
```text
Both (Recommended)
Gaps only
Build evidence only
```

Answer:
```text
Both (Recommended)
```

### Q002
<!-- source: claude:898906b1-abe5-411a-9d60-305d89889d36:toolu_012T6UWtgaRsmZn9LEPoDUZu:2 -->

Question:
```text
How should the 40 iterations be split, and on which DeepSeek Flash route? All routes run at max thinking. OpenCode Go hit its monthly limit on 25 November, so I left it out.
```

Options:
```text
4 x 10, vibe + pi (Recommended)
4 x 10, vibe only
1 x 40, pi
2 x 20, vibe + pi
```

Answer:
```text
4 x 10, vibe + pi (Recommended)
```

### Q003
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01XRKfaKwDniA3PaFBnvH1mE:0 -->

Question:
```text
Deep review cannot run a single Vibe lineage. The runtime refuses it with "cli-mistral-vibe runs only as a fan-out lineage; rerun with --count=2" (workflow-steps.cjs:458). The only Vibe-only shape is two Vibe lineages on deepseek-flash, which always runs at max thinking. How should the 10 iterations be split?
```

Options:
```text
2 lineages x 10 (Recommended)
2 lineages x 5
```

Answer:
```text
2 lineages x 10 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
