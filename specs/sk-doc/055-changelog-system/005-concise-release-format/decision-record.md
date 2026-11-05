---
title: "Decision Record: Phase 5: concise-release-format"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-concise-release-format operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/055-changelog-system/005-concise-release-format"
    last_updated_at: "2026-11-05T21:47:48.753Z"
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
# Decision Record: Phase 5: concise-release-format

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build the recommended changes straight after the five research iterations, with gates and a commit, instead of stopping to plan. | Not stated. | None | plan.md, implementation-summary.md |
| Q002 | Take the best of both model entries: v4.0.1.0 for length, selection and section shape, v4.0.0.0 for voice and the opening of a major release. | Not stated. | None | assets/changelog-template.md, SKILL.md |
| Q003 | The changelog shape checks fail as errors, not warnings. | Not stated. | None | scripts/check_changelog_shape.py, create-changelog-auto.yaml, create-changelog-confirm.yaml |
| Q004 | Drop the (Level N) suffix from a changelog's spec-folder line. | Not stated. | None | assets/changelog-template.md, scripts/check_changelog_shape.py |
| Q005 | Smaller Fixes is an optional H4 slot that no check requires. | Not stated. | None | assets/changelog-template.md |
| Q006 | Apply the AGENTS.md Gate 2 edit that names ROUTER.md, refreshing the shipped manifest so the doctor check stays clean. | Not stated. | None | AGENTS.md, .skilled/commands/doctor/assets/agents-md-manifest.json |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78oolu_01FAT8B3vxXDTy33zeNDYoVM:1 -->

Question:
```text
After the 5 research iterations, what should happen?
```

Options:
```text
Research, plan, then ask (Recommended)
Research, then build
```

Answer:
```text
Research, then build
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78oolu_01PBrWRqD2K1M6ytAMT1Y9yP:0 -->

Question:
```text
Which changelog should sk-create-changelog treat as the model for a release with many changes?
```

Options:
```text
Two, by scale (Recommended)
v4.0.1.0 only
Keep v4.0.0.0
```

Answer:
```text
Maybe take best from both
```

### Q003
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78oolu_01PBrWRqD2K1M6ytAMT1Y9yP:1 -->

Question:
```text
How strict should the new changelog shape checks in validate_document.py be (total length, number of items, at-a-glance order)?
```

Options:
```text
Warnings (Recommended)
Errors
```

Answer:
```text
Errors
```

### Q004
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01PBrWRqD2K1M6ytAMT1Y9yP:2 -->

Question:
```text
Should the spec-folder line in a changelog drop its "(Level N)" suffix, as the v4.0.1.0 entry does?
```

Options:
```text
Drop it (Recommended)
Keep it
```

Answer:
```text
Drop it (Recommended)
```

### Q005
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78oolu_01PBrWRqD2K1M6ytAMT1Y9yP:3 -->

Question:
```text
Should "#### Smaller Fixes" become the required heading for the list of small fixes?
```

Options:
```text
Optional slot (Recommended)
Required name
```

Answer:
```text
Optional slot (Recommended)
```

### Q006
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78oolu_01DSyEqsE8wHK2pg9tNctV7u:1 -->

Question:
```text
The AGENTS.md research found one gap: Gate 2 at AGENTS.md:70 never names ROUTER.md, which v4.0.1.0 made every skill's routing file. The proposed edit adds 3 bytes and leaves 13 of the 16,384-byte budget. /doctor:agents-md check passes 12/12 right now. Apply it?
```

Options:
```text
Apply it
Leave it (Recommended)
```

Answer:
```text
Apply it
```

<!-- /ANCHOR:operator-answers-verbatim -->
