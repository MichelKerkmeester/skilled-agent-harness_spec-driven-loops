---
title: "Decision Record: Phase 4: command-meaning-matching"
description: "Operator decisions and their answers for this packet. The full ADRs live in plan.md."
trigger_phrases:
  - "004-command-meaning-matching operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching"
    last_updated_at: "2026-11-12T20:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-004-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 4: command-meaning-matching

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

Each row is an operator answer given on 2026-11-12 through AskUserQuestion. The answer column quotes the chosen option. Context, consequences and rejected options for each ADR are in `plan.md`.

| ID | Decided | Answer | Supersedes | Carried by |
|----|---------|--------|------------|------------|
| **ADR-001** | Command vectors live in a sibling table `vec_cmd_<dim>` with no foreign key, read by the same loader | "Accept all four (Recommended)", then "Sibling table (Recommended)" | The accepted wording, "the existing vector table" | `plan.md` ADR-001 |
| **ADR-002** | A command passes on meaning through a bar and a margin in the phrase-anchor check, and the lane weight stays | "Accept all four (Recommended)" | None | `plan.md` ADR-002 |
| **ADR-003** | Doctor routes get vectors, and lose them if they cause a false offer | "Accept all four (Recommended)" | None | `plan.md` ADR-003 |
| **ADR-004** | Hook budget of +25 ms median and +40 ms p95 | "Accept all four (Recommended)" | None | `plan.md` ADR-004 |
| **ADR-005** | A meaning-passed command ranks first only on a clear margin over the top skill | "First, on a clear margin (Recommended)" | None | `plan.md` ADR-005 |
| **ADR-006** | First bar 0.74 with no margin, chosen from the tune sweep before any holdout measurement | "0.74, no margin (Recommended)" | None | `plan.md` ADR-006 |
| **ADR-007** | One more improvement round after holdout read 4 of 44 against a target of 5 | "One more improvement round" | None | `plan.md` ADR-007 |
| **ADR-008** | Second bar 0.72 with margin 0.02 | "0.72, margin 0.02 (Recommended)" | ADR-006 | `plan.md` ADR-008 |
| **ADR-009** | Keep round two and close the phase as Complete with holdout reach under its target of 5. It read 3 of 44 when decided and 2 of 44 after the read-only check in `plan.md` ADR-011 | "Keep round two, close with the miss (Recommended)" | None | `plan.md` ADR-009, AC-003 |
| **ADR-010** | Raise the sweep test's corpus bound to 26, committed separately as `5fc383f83a` | "Raise the bound to 26 (Recommended)" | None | `plan.md` ADR-010 |
| Q001 | Accept all four phase 004 design recommendations. | Not stated. | None | plan.md ADR-001 to ADR-004 |
| Q002 | Build phase 004 with DeepSeek workers through cli-pi. | Not stated. | None | tasks.md worker waves, scratch/briefs |
| Q003 | Command vectors go in a sibling table with no foreign key. | Not stated. | None | plan.md ADR-001, T008 |
| Q004 | A command that passes on meaning ranks first only on a clear margin over the top skill. | Not stated. | None | plan.md ADR-005, REQ-010 |
| Q005 | Set the first meaning bar at 0.74 with no margin before measuring holdout. | Not stated. | None | plan.md ADR-006 |
| Q006 | Run one more improvement round on tune rows after holdout read 4 of 44. | Not stated. | None | plan.md ADR-007 |
| Q007 | Raise the old sweep test bound to 26 in a separate commit. | Not stated. | None | plan.md ADR-010, commit 5fc383f83a |
| Q008 | Set the second meaning bar at 0.72 with a margin of 0.02. | Not stated. | None | plan.md ADR-008, T015 |
| Q009 | Keep round two and close the phase with the holdout miss recorded. | Not stated. | None | plan.md ADR-009, AC-003 |
<!-- /ANCHOR:operator-decisions -->

---

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01R51Kkdo6BaCwXFNC82u3he:1 -->

Question:
```text
Phase 004 (meaning-based matching for commands) is planned with four open design questions, each with a recommendation: store command vectors in the existing vector table keyed by command row id, let a command pass on meaning through a threshold plus a margin (not by raising the semantic lane weight, which packet 001 owns), give doctor commands vectors too, and allow the hook +25 ms median and +40 ms p95. Accept them?
```

Options:
```text
Accept all four (Recommended)
Accept, but no doctor vectors
I will review the spec first
```

Answer:
```text
Accept all four (Recommended)
```

### Q002
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01R51Kkdo6BaCwXFNC82u3he:2 -->

Question:
```text
After the plan is settled, should I start building phase 004?
```

Options:
```text
Stop after the commit (Recommended)
Build with DeepSeek swarm
```

Answer:
```text
Build with DeepSeek swarm
```

### Q003
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_013Qn3EaLqbYLKpHSa1zXwYY:0 -->

Question:
```text
LOGIC-SYNC: you accepted storing command vectors in the existing vector table, but that table's key is a foreign key to the skill table and commands are not skills, so the insert fails. Where should command vectors go?
```

Options:
```text
Sibling table (Recommended)
Drop the foreign key
```

Answer:
```text
Sibling table (Recommended)
```

### Q004
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_013Qn3EaLqbYLKpHSa1zXwYY:1 -->

Question:
```text
A command that passes on meaning can still rank below a passing skill, and the measurement counts a command only when it ranks first, so holdout reach could stay at 0 even when matching works. Where should a command that passes on meaning rank?
```

Options:
```text
First, on a clear margin (Recommended)
Keep its score position
Count top three as reach
```

Answer:
```text
First, on a clear margin (Recommended)
```

### Q005
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_011hwSdH5xs53buj62qLuXnq:0 -->

Question:
```text
The threshold sweep (tune rows and the 35 must-stay-silent rows only, real embeddings) shows a trade-off for the meaning bar. Today 2 of 45 tune prompts reach their command on its own row. Which bar should I set before the one-time holdout measurement? I pick it now, unseen, so the holdout stays an honest check.
```

Options:
```text
0.74, no margin (Recommended)
0.70, margin 0.02
0.70, no margin
0.68, margin 0.10
```

Answer:
```text
0.74, no margin (Recommended)
```

### Q006
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_016eF74H4TtFPANWXvyoNJVS:0 -->

Question:
```text
Phase 004 is built and measured with real embeddings at the bar you chose. Holdout plain-chat reach went from 0 to 4 of 44 (doctor 2, speckit 2), tune from 9 to 13 of 45, false offers stay 0 of 35, typed stays 24 of 44, hook time is unchanged. The plan's target was at least 5 of 44, so it misses by one. How should the phase close?
```

Options:
```text
Close with the miss recorded (Recommended)
Keep it In Progress
One more improvement round
```

Answer:
```text
One more improvement round
```

### Q007
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_016eF74H4TtFPANWXvyoNJVS:1 -->

Question:
```text
With the embedder running, one older test now runs and fails: tests/scorer/lane-weight-sweep.vitest.ts allows at most 25 prompts and its fixture has held 26 since 2026-10-28. It is skipped when no embedder is running, which is why the suite was green before. Neither file is part of this work. What should I do?
```

Options:
```text
Raise the bound to 26 (Recommended)
Leave it
```

Answer:
```text
Raise the bound to 26 (Recommended)
```

### Q008
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_0165bGx6qbFQXb6dNaxCpDNm:0 -->

Question:
```text
Improvement round result on tune rows: building the embedding text from the user-voice job sentence and phrases (dropping the command-voice description) separates commands better. False offers now start at 0.68. Which bar do I set before the second holdout measurement?
```

Options:
```text
0.72, margin 0.02 (Recommended)
0.74, no margin
0.70, margin 0.02
```

Answer:
```text
0.72, margin 0.02 (Recommended)
```

### Q009
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01QVghzp2cemaJqVZVxD7DeP:0 -->

Question:
```text
The improvement round did not help on unseen prompts. Second holdout measurement: 3 of 44 (round one was 4 of 44). Tune went from 13 to 14 of 45, false offers stay 0 of 35, typed stays 24 of 44. Both are far above the 0 of 44 we started with, but both miss the 5 of 44 target, and the difference between them is one prompt. Further rounds would be tuning on the holdout set. Which version do I keep, and how does the phase close?
```

Options:
```text
Keep round two, close with the miss (Recommended)
Revert to round one, close with the miss
Keep round two, leave In Progress
```

Answer:
```text
Keep round two, close with the miss (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
