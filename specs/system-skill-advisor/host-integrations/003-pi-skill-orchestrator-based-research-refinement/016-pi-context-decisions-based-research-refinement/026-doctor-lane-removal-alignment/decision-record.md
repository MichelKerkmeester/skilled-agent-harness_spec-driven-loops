---
title: "Decision Record: Align the doctor surface with the removed advisor lane"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "026-doctor-lane-removal-alignment operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/026-doctor-lane-removal-alignment"
    last_updated_at: "2026-11-21T22:14:11.076Z"
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
# Decision Record: Align the doctor surface with the removed advisor lane

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The eight cleanup trigger phrases on the /doctor:update route stay, replacing 024 decision Q004. | Not stated. | 024 decision-record Q004 | REQ-020, .skilled/commands/doctor/_routes.yaml |
| Q002 | origin/main is merged into worktrees/497-ollama-lane-removal and its conflicts are resolved in favour of the lane removal; main itself is not touched. | Not stated. | None | REQ-021, merge commit 12a5a29ab09 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01USysu9RTCLyjFEcDuCtYB1:0 -->

Question:
```text
Two of your recorded choices conflict. You earlier decided that the post-upgrade cleanup gets no advisor routing phrases, because new phrases move the frozen routing baselines (decision Q004 in 024). Packet 026 then added eight cleanup phrases to the /doctor:update route, and the routing baselines still pass (60/60). Which stands?
```

Options:
```text
Keep the phrases (Recommended)
Remove the phrases
```

Answer:
```text
Keep the phrases (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01USysu9RTCLyjFEcDuCtYB1:1 -->

Question:
```text
main has moved 237 commits since this branch started. A trial merge conflicts in eight files, and a test file added on main (overlay-request-routing.vitest.ts) contains a removed-lane env var that would turn the new blocking residue gate red after a merge. Should I merge main into the worktree branch now and resolve that? Nothing is pushed, and the merge commit can be undone with a reset to the current tip.
```

Options:
```text
Yes, merge into the branch (Recommended)
No, leave it to me
```

Answer:
```text
Yes, merge into the branch (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
