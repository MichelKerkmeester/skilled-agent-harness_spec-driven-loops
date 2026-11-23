---
title: "Decision Record: Carry the deep-loop offer in the advisor hint"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "013-deep-loop-offer-in-hint operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint"
    last_updated_at: "2026-11-23T16:25:34.655Z"
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
# Decision Record: Carry the deep-loop offer in the advisor hint

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Open a new follow-up packet that puts the deep-loop offer options in the advisor brief, with nothing built until the plan is approved. | Not stated. | None | spec.md, plan.md, tasks.md |
| Q002 | Approve the plan and build it in worktree 527, including four F6 behaviour runs. | Not stated. | None | tasks.md T001 to T009 |
| Q003 | Name offer options only for the two deep-loop commands and leave every other ask command label unchanged. | Not stated. | None | spec.md Out of Scope, render.ts |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_019arXajtfnsMvo3vr33UMv3:0 -->

Question:
```text
Packet 012 is Complete and pushed. One gap is left from the F6 behaviour runs: the advisor's prompt hint shows only `/deep:review (ask)`, so a session that asks for the target first never opens the command doc and never asks the three-option offer (it did in 1 of 4 runs). The only fix that reaches that session is putting the offer format in the hint itself (`render.ts`), which is outside packet 012. What should happen with it?
```

Options:
```text
New follow-up packet (Recommended)
Leave it
```

Answer:
```text
New follow-up packet (Recommended)
```

### Q002
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01KEg4nWKAGKzjg4XmxXe8hp:0 -->

Question:
```text
Packet 013's plan: one branch in render.ts's commandLabel makes the brief head read `system-deep-loop → /deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop)`. The plan also covers updating the golden tests and the injection contract, the full advisor suite, and four F6 behaviour runs (about $0.80). Approve it?
```

Options:
```text
Approve and build (Recommended)
Approve, skip F6 runs
Hold
```

Answer:
```text
Approve and build (Recommended)
```

### Q003
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01KEg4nWKAGKzjg4XmxXe8hp:2 -->

Question:
```text
Should other commands with policy `ask` (for example /create:changelog or /doctor:mcp debug) get a generic hint such as `(ask: offer it, then wait)`?
```

Options:
```text
Deep-loop only (Recommended)
Add a generic hint
```

Answer:
```text
Deep-loop only (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
