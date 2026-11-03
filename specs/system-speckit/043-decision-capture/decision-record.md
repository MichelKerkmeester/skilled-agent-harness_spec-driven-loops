---
title: "Decision Record: Decision capture series"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "043-decision-capture operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture"
    last_updated_at: "2026-11-01T21:00:36.478Z"
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
# Decision Record: Decision capture series

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Make decision capture a series parent: the finished build becomes child 001 and each open follow-up becomes its own child. | Not stated. | None | spec.md Phase Documentation Map, 001-decision-capture-build/ |
| Q002 | Write separate goals for this series and for the Barter conversion program, plus one chat goal that points at both. This series carries a parent goal and a goal in every child. | Not stated. | None | goal.md binding table, the goal.md in each child |
| Q003 | Prove decision capture in a live, timed, multi-turn conversation that an orchestrator drives against a test-subject session in each runtime, and re-prove children 002 to 005 with it. | A single-prompt scenario with mocked decisions does not show the feature working in a conversation the way a person holds one. | None | 006-live-conversation-test/, spec.md Problem Statement |
| Q004 | Keep the live conversation test, and extend sk-create-manual-testing-playbook so a scenario can script an orchestrator playing the human against a test subject over several prompts. Child 006 runs its scenario on that shared runner and builds none of its own. | Not stated. | None | 006-live-conversation-test/spec.md, specs/sk-doc/065-conversation-playbook-scenarios |
| Q005 | Fix D6 in child 002: a re-save with a changed answer rewrites the verbatim appendix item as well as the row. | Not stated. The research listed it as a medium defect. | The open-questions recommendation to accept it as risk | 002 REQ-017, AC-020, T021 |
| Q006 | Turn on Codex's default_mode_request_user_input setting in this repository's .codex/config.toml and in the operator's own ~/.codex/config.toml, not only in the runner's scratch project. | Not stated. | The recommendation to enable it in the scratch project only | handover.md section 2.4, .codex/config.toml |
| Q007 | Run one live probe each for Codex, Pi, OpenCode and Devin: a real session in a scratch project asks one harmless question, to see where that runtime puts the answer. | The 003 and 004 specs require consent before a live probe. | None | 003-codex-and-pi-capture T005, 004-opencode-devin-live-capture REQ-001 and REQ-002 |
| Q008 | The conversation runner trusts a scratch project's Codex hooks only in this series' 006 runs, and records and removes the trust entries afterwards. | Decision capture on Codex may need its hooks to fire in the 006 tests, and trusting writes entries into ~/.codex/config.toml. | The runner declining hook trust in every scratch project | 006-live-conversation-test, the 065 runner hook-trust switch |
| Q009 | On Codex, a multi-select step keeps its extra choices typed as a note on the 'None of the above' row, rather than being marked SKIP. | Codex's question tool allows one choice per question. | None | 006-live-conversation-test scenario files |
| Q010 | After every acceptance row is met and the five-runtime live runs pass, finish with a deep review and fix pass, an alignment check, a second live pass, and a commit list ready for the operator. | Not stated. | None | handover.md section 3.2 steps 6 to 9 |
| Q011 | Commit and push this series only after both tracks are checked, and show the operator the file list first. | Every Skilled commit and push needs the operator's yes (master goal D4). | None | handover.md section 3.2 step 9, open-questions.md item 3 |
| Q012 | Run the 006 live conversations for Claude Code, OpenCode, Pi and Devin now, one at a time while no other runner is live, and run Codex once the hook-trust rule lands. | The runner already passed Claude Code, OpenCode, Pi and Devin when each ran alone, and only Codex depends on the hook-trust rule. | handover.md section 3 item 5 run order | 006 tasks T007 to T011, handover.md |
| Q013 | The sk-code alignment pass and the playbook-routing check cover this series own code and its decision-capture scenarios, not the 065 session ROUTER.md changes. | The operator said the request was for this session work, not for the 065 packet. | None | operator-decision-capture.md feature catalog entry, system-spec-kit manual-testing-playbook section 7.5 |

<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GzdNpsGNrLCyzjdNpt6n46:0 -->

Question:
```text
The Skilled decision-capture packet (specs/system-speckit/042-decision-capture) is a finished single packet, so it has no phases for child goals. Spec-kit's rule for new work on the same feature is a 'series parent': a new parent folder named after the feature, with 042 moved in as child 001 and the open work as children 002–005. Each child gets its own goal, under a parent goal. How should I set it up?
```

Options:
```text
Series parent (Recommended)
Children inside 042
Fewer children
```

Answer:
```text
Series parent (Recommended)
```

### Q002
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GzdNpsGNrLCyzjdNpt6n46:1 -->

Question:
```text
Which goal files should I write? The Skilled decision-capture goal stays in the Skilled repo, separate from Barter.
```

Options:
```text
Both, kept separate (Recommended)
Decision capture only
```

Answer:
```text
Goals for both and 1 unique chat goal that references skiled work and barte rconversion work
```

### Q003
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:chat:859f58f9-516f-4599-8f10-59337f3cc75a:140468bc-9866-4e0a-946a-e4ec11ca2d1e -->

Question:
```text
None asked. The operator raised this unprompted, in reply to a status report on the series setup.
```

Options: none

Answer:
```text
Was 043 actually proper tested though the new decision capture feature, like were decisions mocked in a test playbook session? Shouldnt have been a single prompt test scenario but a series of timed prompts run by an orchestrator with a test subject to see if it works mimicing human conversation
```

### Q004
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:chat:08d3829f-d9f6-42da-bd6b-dba427e0c157:51af12e3-a8a9-4fd6-a91e-0f9afd2ceb49 -->

Question:
```text
None asked. The operator replied to the report that a live-conversation-test child would be added.
```

Options: none

Answer:
```text
That should be the case and we should also maybe update sk create manual testing playbook to support those elaborate human like orchestrator vs test subject multi prompt conversation like playbook scenarios
```

### Q005
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_013uc3BQhrCmip5sM9ssXaEa:2 -->

Question:
```text
Decision-capture research found a smaller defect (D6): re-saving with a changed answer never rewrites the decision record's appendix item, so the old answer text stays. Child 002 already touches the writer. Fix it there?
```

Options:
```text
Fix it in 002 (Recommended)
Accept the risk
```

Answer:
```text
Fix it in 002 (Recommended)
```

### Q006
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_013uc3BQhrCmip5sM9ssXaEa:3 -->

Question:
```text
Codex shows its question tool only with the experimental default_mode_request_user_input setting. For the conversation tests, I turn it on only in the runner's throwaway scratch project; your own Codex config stays untouched. OK?
```

Options:
```text
Scratch project only (Recommended)
Don't enable it
```

Answer:
```text
Enable it in repo and macbook
```

### Q007
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GUMFmGnoBDWW7P834uAaLq:0 -->

Question:
```text
Decision capture 003 and 004 each need one live probe per runtime (Codex, Pi, OpenCode, Devin): a real session in a throwaway scratch project asks one harmless question, so we can see where that runtime puts your answer. Their specs require your consent. Allow them?
```

Options:
```text
Yes, all four (Recommended)
Ask me per runtime
No probes
```

Answer:
```text
Yes, all four (Recommended)
```

### Q008
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GUMFmGnoBDWW7P834uAaLq:1 -->

Question:
```text
In scratch test projects, Codex asks whether to trust the project's hooks; 'Trust all' writes trust entries into your ~/.codex/config.toml. The runner currently declines, so hooks don't run there. But decision capture on Codex may need those hooks to fire in the 006 tests. What should the runner do?
```

Options:
```text
Trust only in 043/006 runs (Recommended)
Always trust
Never trust
```

Answer:
```text
Trust only in 043/006 runs (Recommended)
```

### Q009
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GUMFmGnoBDWW7P834uAaLq:2 -->

Question:
```text
Codex's question tool allows only one choice per question. For a multi-select step, the runner types the extra choices as a note on Codex's 'None of the above' row. Keep that, or mark Codex multi-select as unsupported?
```

Options:
```text
Keep typing it as a note (Recommended)
Mark it SKIP
```

Answer:
```text
Keep typing it as a note (Recommended)
```

### Q010
<!-- source: claude:fe0c9990-06d3-454e-a8e7-7c7bc649bc49:toolu_01GUMFmGnoBDWW7P834uAaLq:3 -->

Question:
```text
You want both tracks 'perfect'. Beyond every acceptance criterion and the five-runtime live runs, what should the fresh sessions finish with?
```

Options:
```text
Deep review + fix pass (Recommended)
Alignment check (Recommended)
Second live pass
Commit list ready
```

Answer:
```text
Deep review + fix pass (Recommended), Alignment check (Recommended), Second live pass, Commit list ready
```

### Q011

Question: Not relayed verbatim. It concerned open-questions.md item 3, whether to commit and push once 002 is built and checked, or earlier.
Options: Not relayed.
Answer: Only after both tracks are checked, with the file list shown first (relayed by the build session's handover, 2026-11-02)

### Q012
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_014BYYJgBdTfQ3cpLmCtvMNi:0 -->

Question:
```text
Decision capture 006 (live conversation tests) is gated in your handover on the 065 session finishing a clean five-runtime runner matrix and building the Codex hook-trust rule; neither has landed. The runner already passes Claude Code, OpenCode, Pi and Devin 6/6 when each runs alone. Both sessions' runs write under specs/ and would break each other's repo-change check if they overlap. How should 006 proceed?
```

Options:
```text
Run 4 now, Codex later (Recommended)
Wait for 065 first
065 first, then me now
```

Answer:
```text
Run 4 now, Codex later (Recommended)
```

### Q013
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_01R4KffdJfLD9Lziv2fWfJjJ:0 -->

Question:
```text
Your request has two parts. The code-alignment part fits packet 043-decision-capture, which this session already works in. The playbook-mode routing part doesn't: the uncommitted changes to sk-create-manual-testing-playbook/ROUTER.md (a new CONVERSATION_SCENARIO intent, edited 16:40 today) belong to specs/sk-doc/065-conversation-playbook-scenarios. That packet's session, 'PLAYBOOK CONVERSATIOn', is open and idle. Who should perfect that routing, and where is it documented?
```

Options:
```text
065 session does it (Recommended)
I do it, in 065
I do it, new 043 child
```

Answer:
```text
sorry ignore 065, it was for your work
```

<!-- /ANCHOR:operator-answers-verbatim -->
