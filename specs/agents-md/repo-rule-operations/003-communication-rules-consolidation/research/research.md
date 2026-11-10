---
title: "Research: communication rules review synthesis and clause ledger"
description: "Synthesis of four reviews of the communication-rules analysis, what was withdrawn and why, and a ledger showing where each moved or merged clause now lives."
trigger_phrases:
  - "communication rules review synthesis"
  - "communication clause ledger"
importance_tier: "normal"
contextType: "research"
---
# Research: communication rules review synthesis and clause ledger

<!-- ANCHOR:verdict -->
## 1. VERDICT

The first analysis (`analysis-under-review.md`) said delivery was the weak point and proposed a reply card. That was wrong. Semicolon rates are flat across delivery: 40.4% of replies before the rule was read, 36.8% after and 38.7% when it was never read. They move with the rule's wording instead: 19.9%, then 61.9% after one prose edit, then 32.1%. Packet `016-repo-rule-advisor-surfacing/002-rule-concision-and-loading` had already found that "the bottleneck is binding, not delivery volume", and its card pilot was held. The three sessions since Gate 6 landed miss the reply rules in 1 of 4 windows, too few to judge.

What survived is consolidation: one home per norm, the two real conflicts fixed and the rules brought in line with their own house style.
<!-- /ANCHOR:verdict -->

<!-- ANCHOR:reviews -->
## 2. REVIEWS

Four read-only reviews ran in parallel. Each one's full output is in `reviews/`.

- **Claude Opus 5.5 xhigh** overturned the delivery headline with the by-version data. It found that AGENTS.md section 4 cannot hold a card, more punctuation breaches and the fifth "lead with the verdict" copy.
- **DeepSeek V4.1 Flash max** found the earlier research and pilot that already rejected cards. It also proposed grounding estimates instead of banning them.
- **GPT-6 Luna max fast** showed that the measurement strips code before counting punctuation, and that receipts belong beside the claim they support.
- **SWE-2 max** found the recorded operator override on the question-tool table. Devin's read-only mode refused files outside the repository and shell commands, so it needed two reruns.

Every load-bearing citation was re-read before use. The override passage in `REPO RULES.md`, the earlier research verdict, the Gate 6 pilot result and the code-stripping in the measurement script all held.
<!-- /ANCHOR:reviews -->

<!-- ANCHOR:withdrawn -->
## 3. WITHDRAWN

- The reply card: binding, not delivery, and no room in Devin's prefix.
- Moving the per-runtime question-tool table: a recorded operator override.
- On-request-only estimates: already reconciled in `answer-the-actual-request.md` section 7.
- The paragraph and in-flight-table "conflicts": deliberate layering and a named carve-out.
- Renaming `answer-the-actual-request.md`: three of four reviewers refused, and it saves 4 bytes.
- Moving the plain-rewrite procedure to the human-voice skill: that skill's triggers do not catch "say that more plainly". It was shortened in place instead.
<!-- /ANCHOR:withdrawn -->

<!-- ANCHOR:ledger -->
## 4. CLAUSE LEDGER

- **Clipped while working, dense at a boundary**: from `uncertainty-and-honesty.md` section 6 to `communication.md` section 1. The boundary definition merged in.
- **Qualify only when it changes what the reader does**: stays in `uncertainty-and-honesty.md` section 6, now titled WHEN TO QUALIFY.
- **The close-out leads with the verdict** (uncertainty self-check): removed. `communication.md` section 5 and its self-check carry it.
- **The first line carries the payload** and **the outcome fits in two lines**: merged into `communication.md` section 5, THE ANSWER FIRST, with the closing-deletion test.
- **Verdict first** (`communication-decisions.md` section 1): kept as "earn it", pointing at `communication.md` section 5 for the order.
- **Restate, approach, questions** (decisions section 3): replaced. The answer comes first. The reading taken is named in one line, the materially-different-work case defers to `uncertainty-and-honesty.md` section 1, and the question cap stays.
- **Plain re-render**: kept in `communication.md` section 4 as a copy edit with claims and protected text intact. The pointer to the scope-exemption reference was dropped, and the HVR pointer kept.
- **Receipts order**: `communication-handoff.md` section 1. Receipts come after the outcome and beside their claim, and the handback is last.
- **New**: choosing by reader impact (`communication.md` section 2), saying each fact once (section 3), naming identifiers only where the reader acts on them and keeping one or two numbers to a sentence (`communication-prose.md` section 2), and the semicolon join made explicit beside the fragments line.
<!-- /ANCHOR:ledger -->
