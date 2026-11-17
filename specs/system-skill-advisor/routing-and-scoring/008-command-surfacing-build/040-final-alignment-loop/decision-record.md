---
title: "Decision Record: Phase 40: final-alignment-loop"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "040-final-alignment-loop operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop"
    last_updated_at: "2026-11-16T22:30:00.000Z"
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
# Decision Record: Phase 40: final-alignment-loop

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| ADR-001 | Waive AC-004 for probes P05, P08 and P09, and keep their routes. | P05, "check whether the skill graph is stale and show me how to rebuild it", asks how to rebuild the graph, and `/doctor:helper` ranks `/doctor:skill-advisor rebuild` first for it (`doctor-helper-match.cjs --top=3`), the repair the reader asked for. P08 and P09 name this packet's own behaviour arena and routing arm. Routing them to the advisor needed the words arena, clean, arm and briefs in its intent signals, and review pass thirteen showed those words then pulled ordinary prompts such as "the routing arm of the load balancer is flaky" to the advisor. Taken under D1 as the recommended option. P07 is fixed with "vibe prompt hook" alone. | None | AC-004, T006, `scratch/probes.json`, `scratch/after-pass-13.txt` |
| ADR-002 | Waive AC-005 for the nine P1 the closing alignment run `20261117T064814Z` left after its two run-command P1 were fixed: seven fresh routing probes (PRB-01 to PRB-07) and two doc-coverage findings (B-1, B-4). They become operator items. | The operator approved on 2026-11-17 (Q088) closing after the final alignment instead of looping. Every alignment run writes new probes, and pulling them to the advisor with intent phrases leaked ordinary prompts in review pass thirteen. B-1 and B-4 ask for new ROUTER keywords and feature-catalog leaves for the measurement tooling, which is new documentation scope. The two run-command P1 sit in the exception the operator kept, so they were fixed. Taken under D1 as the recommended option. | None | AC-005, T009, `scratch/closing-alignment.md` |
| Q001 | Amend the review and alignment criterion to 0 P0 with every P1 fixed or accepted by the operator. | Not stated. | The 0 P1 wording of the review and alignment criterion | goal.md section 3, Q089, 040 ADR-002 |
| Q002 | The operator clears or replaces the session goal, and no fix pass runs. | Not stated. | None | goal.md log, 040 implementation-summary |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:77af2d6d-58e8-4180-b6da-697f12833f71:toolu_018rS3D45EJGCXuDtCkb53kt:0 -->

Question:
```text
The command-surfacing goal is blocked on two criteria: review converged at 0 P1 (criterion 4), and /local-skilled-alignment at 0 P0 and 0 P1 (criterion 6). The closing alignment run left nine P1: seven fresh routing probes and two doc-coverage gaps. Review passes 10 to 14 each found new refusal wordings in the mention check. Under Q088 you accepted that class as a known limit. Everything else is met: all 40 phases are Complete with strict PASSED, the suite has 0 failed, and the branch is clean, level with main and unpushed. How should the goal close?
```

Options:
```text
Amend criteria 4+6 (Recommended)
One more fix pass
Leave goal open
```

Answer:
```text
Amend criteria 4+6 (Recommended)
```

### Q002
<!-- source: claude:77af2d6d-58e8-4180-b6da-697f12833f71:toolu_01ACmYpGv874mDdiriMRwjSk:0 -->

Question:
```text
The session /goal still holds the old wording, which asks for 0 P1 in the command-surfacing review and alignment. The Stop hook keeps refusing to close against it. Your Q089 amendment changed only the packet's goal.md. I can't edit the session goal. What should happen?
```

Options:
```text
I'll clear /goal (Recommended)
Do the fix pass
```

Answer:
```text
I'll clear /goal (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
