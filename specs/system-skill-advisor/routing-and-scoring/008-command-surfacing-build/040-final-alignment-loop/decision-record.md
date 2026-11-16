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
| ADR-001 | Waive AC-004 for probe P05 only, "check whether the skill graph is stale and show me how to rebuild it", and keep its route to /doctor:helper. | The prompt asks how to rebuild the graph. `/doctor:helper` ranks `/doctor:skill-advisor rebuild` first for it (`doctor-helper-match.cjs --top=3`), which is the repair the reader asked for, so moving the prompt to the advisor skill would route it worse. Taken under D1 as the recommended option. P07, P08 and P09 are fixed. | None | AC-004, T006, `scratch/probes.json` |
<!-- /ANCHOR:operator-decisions -->
