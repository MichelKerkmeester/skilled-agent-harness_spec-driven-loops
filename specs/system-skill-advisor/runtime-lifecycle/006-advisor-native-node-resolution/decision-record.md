---
title: "Decision Record: Start the skill advisor on the Node its native database module was built for"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-advisor-native-node-resolution operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/runtime-lifecycle/006-advisor-native-node-resolution"
    last_updated_at: "2026-11-13T16:11:19.964Z"
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
# Decision Record: Start the skill advisor on the Node its native database module was built for

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Plan two Skilled packets from Barter's handover, this one and sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth, and stop before building. | Not stated. | None | spec.md, plan.md |
| Q002 | Run the plan workflow autonomously with a single agent, no goal file and the fix_bug intent for both packets. | Not stated. | None | plan.md |
| Q003 | Build both packets in worktree 367 from the literal plan text and stop before committing; the operator then named DeepSeek Flash at max as the executor. | Not stated. | None | implementation-summary.md, how-delivered |
| Q004 | Run the save on main so the answers of this session are recorded and marked consumed. | Not stated. | None | decision-record.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01Nr5mRHRLEnZMigbUyJgnKC:0 -->

Question:
```text
Barter's handover 015-advisor-after-install names two confirmed causes in Skilled code: the compiled route builds one rule per subset of a hub's modes on every call, and the advisor daemon starts on the session's Node instead of the Node its native module was built for. Should I start the Skilled work for them now?
```

Options:
```text
Plan both (Recommended)
Plan the route fix only
Fix the handover first
Nothing now
```

Answer:
```text
Plan both (Recommended)
```

### Q002
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01E92d61nAtk4LExHZVbr9Ro:2 -->

Question:
```text
How should the /speckit:plan workflow run for the two packets? Last time you chose autonomous, a single agent and no goal file.
```

Options:
```text
Same as last time (Recommended)
Interactive
```

Answer:
```text
Same as last time (Recommended)
```

### Q003
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01NfMEJgz8oD1fTB7SeCJ9pi:0 -->

Question:
```text
Both Skilled plan packets (the mode-subset cap and the advisor Node record) are written in worktree 367 and pass strict validation, uncommitted. What should happen next?
```

Options:
```text
Implement both (Recommended)
Commit the plans only
Stop here
```

Answer:
```text
Implement both (Recommended)
```

### Q004
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_0137PjQirssmBFkvBNANtQ2B:0 -->

Question:
```text
Both Skilled fixes are pushed to origin/main (cap at four modes: 9224c7b291, advisor Node record: cbfe4b0d23) and worktree 367 is removed. Six answers from this session still show as pending in main's decision queue, four of which are already written in the packets. What should I do last?
```

Options:
```text
Clear the queue (Recommended)
Clear queue and brief Barter
Stop here
```

Answer:
```text
Clear the queue (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
