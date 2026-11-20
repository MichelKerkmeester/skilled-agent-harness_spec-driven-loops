---
title: "Decision Record: Phase 18: ollama-lane-off-and-daemon-liveness"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "018-ollama-lane-off-and-daemon-liveness operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/018-ollama-lane-off-and-daemon-liveness"
    last_updated_at: "2026-11-19T16:12:40.219Z"
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
# Decision Record: Phase 18: ollama-lane-off-and-daemon-liveness

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build ranked changes 1 to 5 of the phase 017 report in one fix phase. | Not stated. | None | spec.md scope, REQ-001 to REQ-009 |
| Q002 | Explain the lane today and the benefit and cost of each fix before deciding how they combine. | Not stated. | None | spec.md problem statement |
| Q003 | A fresh Opus at high effort recommends how the lane is treated, before the operator chooses. | Not stated. | None | plan.md overview, implementation-summary.md decisions |
| Q004 | Skip the embed at weight 0 and set the default weight to 0, keeping the lane live, with the coverage and env fixes written as a re-enable checklist. | Not stated. | None | REQ-001, REQ-002, REQ-005, plan.md re-enable checklist |
| Q005 | Use a heartbeat-file watchdog in the launcher instead of a socket ping, because a ping would reset the idle timer. | Not stated. | None | REQ-004, goal.md D3 |
| Q006 | Release system-skill-advisor as 1.2.0.0 with a changelog entry. | Not stated. | None | REQ-010, SKILL.md, changelog/v1.2.0.0.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01MrsxvpBTTQCvx52VjdwoD4:1 -->

Question:
```text
The Ollama report ranks five changes. Which should become a fix phase? (1 drop the semantic lane weight to 0, removing Ollama from the prompt path; 2 parent-death check + launcher liveness ping against orphaned daemons; 3 refresh embeddings from the daemon and gate the lane on coverage; 4 forward OLLAMA_* env and settle the three dead scorer flags; 5 default off the hf model-server and delete the cascade and legacy paths)
```

Options:
```text
1 + 2 (Recommended)
3 + 4
5
None for now
```

Answer:
```text
1 + 2 (Recommended), 3 + 4, 5
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01TwKzs1WTACjukuBymMFS1Y:0 -->

Question:
```text
You picked changes 1+2, 3+4 and 5. Change 1 sets the Ollama semantic lane's weight to 0 (off the prompt path), while 3+4 fix the lane's embedding coverage and Ollama env so it works. How should these combine?
```

Options:
```text
Off now, fixed for later (Recommended)
Keep it live, fix it
Remove the lane entirely
```

Answer:
```text
Explain the current state how it used and benefits and what would change per fix benefit or downside with current
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01EX7ZC14MmEgfbgY5TfeZKv:0 -->

Question:
```text
With that picture: how should phase 018 treat the Ollama semantic lane? (Fix 2, the daemon liveness checks, goes in under every option.)
```

Options:
```text
Off now, fixed for later (Recommended)
Off, minimal
Keep it live, fix it
Remove the lane entirely
```

Answer:
```text
ask fresh opus high 
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01DkbvUKdvNu66qPutcvZU9e:0 -->

Question:
```text
Opus showed weight 0 alone does not stop the Ollama call (checked: advisor-recommend.ts:574 always calls the embed wrapper, which never reads the weight), and that the shared embedder cascade is read by an sk-doc validator and spec-kit tests. Which shape should phase 018 build? All shapes include the daemon liveness checks and advisor-side cleanup (pointer straight to the one Ollama model, delete the legacy embedding path, hf spawner off by default).
```

Options:
```text
Guard + weight 0 (Recommended)
Guard only
Guard + weight 0 + build 3/4
```

Answer:
```text
Guard + weight 0 (Recommended)
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01U21zwr7YgzhyRMyn4w8inE:0 -->

Question:
```text
Fix 2's launcher liveness ping would keep every daemon alive: the daemon's idle monitor resets on every IPC frame (advisor-server.ts:413 → markActivity), so a 60 s ping defeats the 30-minute idle exit. I propose a heartbeat-file watchdog instead: the server touches a heartbeat file every 15 s, and the launcher SIGTERMs then SIGKILLs a child whose heartbeat is older than 3 minutes. It catches a blocked or stopped server and never touches the idle timer. The server-side parent-death check is unchanged: it exits when its parent pid changes. Use the heartbeat watchdog?
```

Options:
```text
Heartbeat watchdog (Recommended)
Ping, excluded from idle
Parent-death check only
```

Answer:
```text
Heartbeat watchdog (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01U21zwr7YgzhyRMyn4w8inE:1 -->

Question:
```text
system-skill-advisor is at 1.1.1.0. This phase changes the default lane weight (live confidences rise about 5.3%), stops the hf model server by default and adds daemon lifecycle code. What version?
```

Options:
```text
1.2.0.0 + changelog (Recommended)
1.1.2.0 + changelog
```

Answer:
```text
1.2.0.0 + changelog (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
