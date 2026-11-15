---
title: "Decision Record: Phase 4: agent-template-conformance-and-drift-check"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-agent-template-conformance-and-drift-check operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/004-agent-template-conformance-and-drift-check"
    last_updated_at: "2026-11-14T13:26:02.055Z"
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
# Decision Record: Phase 4: agent-template-conformance-and-drift-check

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The operator did not choose yet and asked whether the exceptions would be valuable or whether full conformance is better. | The operator wanted an assessment before choosing. | None | scratch/required-sections.md |
| Q002 | Phase 004 writes a narrow required-sections list into the agent template and the check reads it from there. | About 15 of 20 exceptions would carry no information, and full conformance would write runtime budgets nobody measured. | None | REQ-001 and the spec.md scope amendment |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b4d994a7-2eea-4664-a8cc-18efadcb7983:toolu_01LWrqg5WkTrbKsFrUQ7ZrsG:0 -->

Question:
```text
Phase 004 adds a check that each agent file follows the agent template's outline. The template never marks which sections are required, and after the two planned renames (CAPABILITY SCAN, HOOK-INJECTED CONTEXT ROUTING) the 11 agent files still differ from the template skeleton in 24 places: 10 lack RUNTIME PARAMETERS, 7 title section 0 differently, 4 lack OUTPUT FORMAT, 2 lack SUMMARY, and debug and markdown order sections differently. How should those 24 gaps be closed?
```

Options:
```text
Exceptions (Recommended)
Full conformance
Narrow the required list
```

Answer:
```text
would those exceptions be valuable, logical to have, or is 2 better
```

### Q002
<!-- source: claude:b4d994a7-2eea-4664-a8cc-18efadcb7983:toolu_01Jk3mfb5SE5cPNhphfVNLEo:0 -->

Question:
```text
Given that assessment, which way should phase 004 close the outline gaps between the 11 agent files and the agent template?
```

Options:
```text
Narrow list (Recommended)
Exceptions
Full conformance
```

Answer:
```text
Narrow list (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
