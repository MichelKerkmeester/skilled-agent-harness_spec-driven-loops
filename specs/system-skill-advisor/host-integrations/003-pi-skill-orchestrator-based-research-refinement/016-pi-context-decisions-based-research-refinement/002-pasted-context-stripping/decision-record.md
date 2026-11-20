---
title: "Decision Record: Pasted-Context Stripping Before Scoring"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "002-pasted-context-stripping operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/002-pasted-context-stripping"
    last_updated_at: "2026-11-19T17:37:18.692Z"
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
# Decision Record: Pasted-Context Stripping Before Scoring

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The phase 002 LOGIC-SYNC is resolved by amending the spec and editing the pinned parity test for corpus row rr-paste-208. | Not stated. | none | REQ-002 in 002-pasted-context-stripping/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:3ae11fee-4e8c-4cf8-a15c-d21988173a1a:toolu_01TzXJ2YTaDQTKYAEbWx45eE:0 -->

Question:
```text
LOGIC-SYNC REQUIRED in phase 002 (pasted-context stripping). REQ-002 says the GATES vitest set must exit 0, but the corpus row the phase requires (rr-paste-208) breaks `tests/legacy/advisor-corpus-parity.vitest.ts:114`, which pins `toHaveLength(195)`. That test file is not in 002's spec.md Files to Change, and goal D5 limits each phase to its listed files. A trial bump to 196 (since reverted) passed the test with the :178/:179/:184 counts unchanged; 66 of 67 GATES tests pass now. Not blockers, already recorded: the calibration baseline was stale since April (200 rows), so its diff is more than one row (the row's isolated effect is Brier 0.215213→0.21428); and a pasted '/deep:review' still changes the compiled route, because enrichCompiledRoutes reads the raw prompt (logged as a follow-up). How should I resolve the size pin?
```

Options:
```text
Amend spec, edit test (Recommended)
Amend, pin line only
Drop the corpus row
```

Answer:
```text
Amend spec, edit test (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
