---
title: "Decision Record: Phase 2: table-row-matching"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "002-table-row-matching operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching"
    last_updated_at: "2026-11-02T14:35:24.440Z"
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
# Decision Record: Phase 2: table-row-matching

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A decision record with no readable Q-id table makes match-decision-table exit 0 with its answers left pending, not exit 2. | The save step runs the matcher on every record, so exit 2 would stop the save on every ADR-only record. | None | spec.md NFR-R02 and edge cases, CHK-012, CHK-023, match-decision-table.vitest.ts |
| Q002 | The Child guard answer stays recorded in 001-decision-capture-build as Q008. | The child-guard fix shipped with the 001 build. | None | spec.md section 10, CHK-003, 001 decision-record.md Q008 |
| Q003 | 002 scratch/ keeps the calibration table and the run evidence its criteria cite; CHK-051 is amended to say so. | AC-004 to AC-007 and AC-019 cite those run files. | None | CHK-051, scratch/ |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_01VUhbnQJucBBFrjdsTJpiYB:0 -->

Question:
```text
Decision-capture child 002 (table-row matching): its spec says a decision record with no Q-id table should make match-decision-table exit 2 ('no decision table found'). The CLI actually exits 0 with 'consumed 0, refused 0, pending N'. The save step now runs the matcher on every packet that has a decision-record.md, so exit 2 would stop the save on every ADR-only record. Which is right?
```

Options:
```text
Keep exit 0, amend spec (Recommended)
Build exit 2
```

Answer:
```text
Keep exit 0, amend spec (Recommended)
```

### Q002
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_01VUhbnQJucBBFrjdsTJpiYB:1 -->

Question:
```text
Record 12 of session fe0c9990 (the 'Child guard' answer, 'fix it in the same push') was saved as Q008 in 001-decision-capture-build/decision-record.md, following the open-questions recommendation. You never confirmed where it belongs. Where should it stay?
```

Options:
```text
Keep it in 001 as Q008 (Recommended)
Move to series parent
Drop it
```

Answer:
```text
Keep it in 001 as Q008 (Recommended)
```

### Q003
<!-- source: claude:2cdc1c20-d541-4a71-ba53-999a34105259:toolu_01VUhbnQJucBBFrjdsTJpiYB:2 -->

Question:
```text
002's checklist item CHK-051 says its scratch/ folder holds only the calibration table, but AC-004 to AC-007 and AC-019 cite run files kept there (real-run/, runs/, save-writer-*.txt). What should change?
```

Options:
```text
Amend CHK-051 (Recommended)
Delete the run files
```

Answer:
```text
Amend CHK-051 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
