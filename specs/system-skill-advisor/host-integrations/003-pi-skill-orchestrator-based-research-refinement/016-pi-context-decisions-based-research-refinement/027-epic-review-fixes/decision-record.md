---
title: "Decision Record: Fix the findings of the fresh epic review"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "027-epic-review-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes"
    last_updated_at: "2026-11-22T10:37:46.330Z"
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
# Decision Record: Fix the findings of the fresh epic review

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Delete the calibration override, query-class routing and the BM25 length calibration rather than wire them up. | Not stated. | None | REQ-001, REQ-005, spec.md section 3 |
| Q002 | Delete the untracked lane build output from the primary checkout's advisor dist folder. | Not stated. | None | REQ-007, T013 |
| Q003 | Fix every P1 and P2 finding and the drift the fresh review listed, rather than only saving the report. | Not stated. Evidence: yes_no, option false, overlap 0, imperative true, shift false. | None | spec.md section 3, tasks T004 to T014 |
| Q004 | Fix all five Opus verification findings in phase 027, including the two that predate the change. | Not stated. | None | REQ-009, REQ-010, REQ-011, tasks T021 to T025 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01C8pRMfwHAoTS7iA13QMU8f:2 -->

Question:
```text
Three findings are dead or unreachable settings: the calibration override that nothing calls, query-class routing, and the BM25 length calibration. Should they be deleted or wired up?
```

Options:
```text
Delete all three (Recommended)
Wire all three
Wire calibration only
```

Answer:
```text
Delete all three (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01C8pRMfwHAoTS7iA13QMU8f:3 -->

Question:
```text
Two untracked build-output leftovers from the removed lane sit in this checkout's dist/ (lanes/semantic-shadow.js plus its .map file, and the embedders/ folder). They're ignored by git and nothing imports them. Can I delete them? This can't be undone, but a rebuild of an older commit would recreate them.
```

Options:
```text
Yes, delete them
No, leave them
```

Answer:
```text
Yes, delete them
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:chat:9f916b44-4326-48e1-a62b-b443ebcf2633:163e02f9-09ca-40b8-aaac-ad0069b05af5 -->

Question:
```text
Your call: do you want the report saved into the epic, for example as a new phase 027, and the fixes planned? Nothing has been changed yet.
```

Options: none

Answer:
```text
Fix all p1,p2 drift etc
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01VpLGFF789dYgusDkKBFGSc:0 -->

Question:
```text
The fresh Opus review found five new P2 defects. Items 1 to 3 are gaps in my phase 027 change: the Python native bridge still drops the two location keys, a comment and a catalog line describe the deleted helper, and the new doctor test only runs `--shared-model keep`. Items 4 and 5 predate the change: three `.env.example` threshold keys do nothing, and the Python fallback never applies route exclusions. Which should I fix?
```

Options:
```text
Fix 1 to 3 in 027 (Recommended)
Fix all five in 027
Leave them for now
```

Answer:
```text
Fix all five in 027
```

<!-- /ANCHOR:operator-answers-verbatim -->
