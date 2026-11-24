---
title: "Decision Record: Phase 4: regeneration-and-zero-reference-proof"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-regeneration-and-zero-reference-proof operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation/004-regeneration-and-zero-reference-proof"
    last_updated_at: "2026-11-24T14:46:10.966Z"
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
# Decision Record: Phase 4: regeneration-and-zero-reference-proof

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Remove the 3 cli-orca cite-drift label rows (later reversed). | Not stated. | None | implementation-summary.md Known Limitations |
| Q002 | Remove the 3 rows even though they still resolve at their pinned commit (later reversed). | Not stated. | None | implementation-summary.md Known Limitations |
| Q003 | Keep the 3 cli-orca label rows, because removing them drops the set below the 40-row label gate. | Removing them alone would stop the scan from scoring. | None | implementation-summary.md Known Limitations item 3 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01QmMCcJmAmHEw3BWkcTuNVK:0 -->

Question:
```text
cli-orca is gone from the advisor database and every advisor routing file. One stale reference remains outside the advisor: three test-label rows (live-02, live-09, live-16) in sk-doc's shared/scripts/cite-drift-labels.jsonl point at a deleted cli-orca benchmark report. What should happen to them?
```

Options:
```text
Remove the 3 rows (Recommended)
Leave them
```

Answer:
```text
Remove the 3 rows (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_016CZSRovzAvT1Yr1M6sn2SK:0 -->

Question:
```text
The 3 cli-orca rows in cite-drift-labels.jsonl are pinned to commit ebcc68e8, where the cli-orca report still exists, so they still resolve and are part of a fixed 40-row labelled set (20 live, 20 constructed). Removing them would break that count and any accuracy figure measured on it. Separately, ebcc68e8 is not in origin/main's history, so a fresh clone may not be able to read any of the 40 rows. What should happen to the labels?
```

Options:
```text
Keep them, check the pin (Recommended)
Remove the 3 rows anyway
Leave everything
```

Answer:
```text
Remove the 3 rows anyway
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01VozMoRWuGTHMBpqFSu14Ag:0 -->

Question:
```text
Removing the 3 cli-orca rows leaves 37 labels, and cite-drift-scan.mjs:163 sets LABEL_GATE = 40: below 40, scoring stops with 'stop: fewer than 40 labeled rows'. So deleting them alone breaks the scan's scoring mode. Which way?
```

Options:
```text
Keep the 3 rows (Recommended)
Remove + you relabel 3
Remove + lower the gate
```

Answer:
```text
Keep the 3 rows (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
