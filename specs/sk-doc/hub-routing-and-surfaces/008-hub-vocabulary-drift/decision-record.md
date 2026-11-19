---
title: "Decision Record: Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-hub-vocabulary-drift operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift"
    last_updated_at: "2026-11-19T17:37:10.223Z"
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
# Decision Record: Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The 9 hub vocabulary drift items are tackled now. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift/spec.md |
| Q002 | Closing the drift packet (T019, status) and recording the answers is handed to the 008 session. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift/spec.md |
| Q003 | This session fixes both Drift Guard failures in a new packet, but only after the 008 command surfacing session commits its corpus work; narrowed by claude:447cdf58-e65c-42b4-942d-6318296dbf0d:toolu_01S28JJwFsCbtuXogavWPNcT:0 to the hub vocabulary only. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift/spec.md |
| Q004 | The sk-doc ROUTER.md hub-vocabulary fixes are edited here, on lines other than those the 008 session changes. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift/spec.md |
| Q005 | The wider nine-phrase fix is committed here and lands through the 008 branch. | Not stated. | none | specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:447cdf58-e65c-42b4-942d-6318296dbf0d:toolu_01S28JJwFsCbtuXogavWPNcT:1 -->

Question:
```text
The other Drift Guard failure is independent of the 008 work: 9 hub vocabulary drift items in the sk-doc and system-deep-loop routers. This session's context is about 85% full, so the work would start in a fresh session with a new packet and worktree. When should that start?
```

Options:
```text
Hand off now (Recommended)
Later, when you ask
```

Answer:
```text
Tackle now
```

### Q002
<!-- source: claude:765b978e-aba4-4cf3-aca4-aa103f4ffa68:toolu_01D6Q5DbJNES21KcpoJhHfnP:1 -->

Question:
```text
The drift packet (specs/sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift) still has task T019 open and Status 'In Progress', and the hook asks for /speckit:save to record your two answers. Both would need a new commit after the merge. How should the packet be closed?
```

Options:
```text
Hand to 008 session (Recommended)
I close it on branch 372
Leave as is
```

Answer:
```text
Hand to 008 session (Recommended)
```

### Q003
<!-- source: claude:447cdf58-e65c-42b4-942d-6318296dbf0d:toolu_015V6oUyP4Wt97Ksomi5xUSq:0 -->

Question:
```text
The Routing Registry Drift Guard is the only red workflow left on main (ab08b3cffc), with two failures this branch did not cause. First, the routing corpus pin: the three corpus files changed in the command surfacing work on 12 and 13 November and no longer match the hashes in routing-baseline.json. Second, hub vocabulary: 9 drift items in the sk-doc and system-deep-loop routers, red for at least five main runs. Who should fix them?
```

Options:
```text
Me, after 008 finishes (Recommended)
Me, both now
Hub vocabulary only, now
Leave both to other sessions
```

Answer:
```text
Me, after 008 finishes (Recommended)
```

### Q004
<!-- source: claude:765b978e-aba4-4cf3-aca4-aa103f4ffa68:toolu_01L8RyiTnyNUbMPfeCUNJdf2:0 -->

Question:
```text
The checker reads only each hub's root ROUTER.md, never the mode packets' files. So six of the nine fixes must go into .skilled/skills/sk-doc/ROUTER.md, a file the 008 session (CHAT AUTOMATION, worktree 352) also edits on its unpushed branch and that my handoff note said to keep out of. Its branch changes two lines there: the version line and the SKILL_CREATION keyword line. My fix would change four other lines (AGENT_CREATION, COMMAND_CREATION, DIFF, GOAL_AUTHORING). How should the six sk-doc phrases be fixed?
```

Options:
```text
Edit here, other lines (Recommended)
Hand the six to 008
Edit here, bump version too
```

Answer:
```text
Edit here, other lines (Recommended)
```

### Q005
<!-- source: claude:765b978e-aba4-4cf3-aca4-aa103f4ffa68:toolu_01AHajKeP6V77uBZN7VhvvM4:0 -->

Question:
```text
The nine-phrase fix is wider than planned. Once the phrases are in the two root ROUTER.md files, a second Drift Guard step requires them in each hub's graph-metadata.json, which the advisor scores. That is an improvement: one holdout prompt now routes correctly to deep review, so the holdout count goes from 50 to 51. But it forces three recaptures: the compiled skill-graph.json (marked operator-gated), the local-versus-native divergence ledger (one entry resolved), and scorer-eval-baseline.json, which you told me not to touch because the 008 session recaptures it on its branch. The Drift Guard workflow stays red until the 008 pull request merges anyway, because of the corpus pin. Where should this fix land?
```

Options:
```text
Commit here, land via 008 (Recommended)
Land on main now, all of it
Land on main, leave the baseline
```

Answer:
```text
Commit here, land via 008 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
