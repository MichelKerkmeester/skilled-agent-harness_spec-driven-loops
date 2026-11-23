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
| Q004 | Mark option A recommended in the brief and sample F6 four more times. | Not stated. | None | T010, render.ts |
| Q005 | Merge 013 to main and push once it is settled, then remove worktree 527. | Not stated. | None | worktree 527 |
| Q006 | Keep the brief change, record SC-002 as unmet with the eight-run evidence, mark the packet Complete and merge it to main. | Not stated. | None | spec.md, implementation-summary.md, render.ts |
| Q007 | When the operator typed the deep-loop command, the brief prints plain (ask) with no offer options. | Not stated. | None | REQ-006, T011 |
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

### Q004
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01NJooULPAY3w2XE4bAGbTjQ:0 -->

Question:
```text
Packet 013 is built and tested: the brief now reads `/deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop)`, and the advisor suite passes 2624 of 2624. But in four F6 runs, 0 sessions asked the full three-option offer (before: 1 of 4). Every session asked for the review target first. Two named options from the brief: one recommended :auto, the other recommended :confirm. The other two defaulted to :confirm. What next?
```

Options:
```text
Reword and resample (Recommended)
Keep as is and merge
Revert the brief change
```

Answer:
```text
Reword and resample (Recommended)
```

### Q005
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01NJooULPAY3w2XE4bAGbTjQ:1 -->

Question:
```text
When 013 is settled, should its commits go to main? Worktree 527 holds three 013 commits (plan, brief change, F6 record). The 012 commit is already on main.
```

Options:
```text
Merge and push when settled (Recommended)
Ask me again first
```

Answer:
```text
Merge and push when settled (Recommended)
```

### Q006
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01SKd3PiJDc9tNs3fnqRkgh6:0 -->

Question:
```text
After marking A recommended, four more F6 runs: 0 of 4 asked the full three-option offer (8 runs total, 0 full offers; packet 012's rate was 1 of 4). It did shift the mode: 3 of 4 now preferred :auto (before: 1 of 4), and one composed `/deep:review:auto --extend=3`. No session ever offered C (no loop), and every one asked for the target first. Suite is green. How should 013 close?
```

Options:
```text
Keep, merge, SC-002 unmet (Recommended)
Revert the brief change
Leave 013 open
```

Answer:
```text
Keep, merge, SC-002 unmet (Recommended)
```

### Q007
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017NgHjmF6m34GboesBNRQYx:1 -->

Question:
```text
When you type the command yourself, for example `/deep:review:confirm the auth module`, what should the hint show?
```

Options:
```text
Plain (ask), no options (Recommended)
No command in the hint
```

Answer:
```text
Plain (ask), no options (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
