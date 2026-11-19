---
title: "Decision Record: Phase 8: router-readme-presentation-alignment"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-router-readme-presentation-alignment operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/008-router-readme-presentation-alignment"
    last_updated_at: "2026-11-19T17:38:00.551Z"
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
# Decision Record: Phase 8: router-readme-presentation-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The copies of the plan and complete step counts in command-metadata.json, the advisor's command bridges and projection.ts are updated too. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/008-router-readme-presentation-alignment/spec.md |
| Q002 | The stale step lines just outside phase 8's requirements are fixed in phase 8. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/008-router-readme-presentation-alignment/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:9779735f-9302-4aae-a461-3abede5e49b7:toolu_01MBDxCFJTxnFbNPnXTcmwjW:0 -->

Question:
```text
Phase 8 changes the step count in two router descriptions (plan: 8 to 7 steps, complete: 14+ to 13 steps). Those descriptions are copied in command-metadata.json, the skill advisor's generated command bridges and projection.ts, and the parent commands README. The phase 8 plan lists command-metadata.json as unchanged. Should I update the copies too?
```

Options:
```text
Update the copies (Recommended)
Leave the copies
```

Answer:
```text
Update the copies (Recommended)
```

### Q002
<!-- source: claude:9779735f-9302-4aae-a461-3abede5e49b7:toolu_01MBDxCFJTxnFbNPnXTcmwjW:1 -->

Question:
```text
A few stale lines sit just outside what phase 8's requirements name: speckit-plan.yaml says 'step 7' or 'Steps 1-7' on 4 lines and the plan presentation on 1, although plan's last step is 6. The README says the save tail holds 'anchor requirements' (removed in phase 6) and its overview names only :auto and :confirm. Should phase 8 fix these as well?
```

Options:
```text
Fix them in phase 8 (Recommended)
Leave and report
```

Answer:
```text
Fix them in phase 8 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
