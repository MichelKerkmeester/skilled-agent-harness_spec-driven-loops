---
title: "Decision Record: Phase 9: rename-rule-and-test-root-fixes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "009-rename-rule-and-test-root-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/009-rename-rule-and-test-root-fixes"
    last_updated_at: "2026-11-19T17:38:11.065Z"
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
# Decision Record: Phase 9: rename-rule-and-test-root-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Luna's wording fix for rename-pattern.md section 2 is applied: moved paths that act as live locators are updated. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/009-rename-rule-and-test-root-fixes/spec.md |
| Q002 | The failing fingerprint-docset-generation.sh cases are investigated and fixed. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/009-rename-rule-and-test-root-fixes/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01NtT9TKhFyC4d5rkSqCMfAs:1 -->

Question:
```text
Luna proposed a wording fix for rename-pattern.md section 2 (Historical spec docs): "Preserve historical content, but update a moved path when it acts as a live locator and the link check would otherwise fail." It matches the exception I used in this regroup. Apply it?
```

Options:
```text
Apply it (Recommended)
Skip
```

Answer:
```text
Apply it (Recommended)
```

### Q002
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01NtT9TKhFyC4d5rkSqCMfAs:2 -->

Question:
```text
fingerprint-docset-generation.sh fails 3 of 7 cases, and failed the same 3 before the regroup. Validation reports drift correctly when I run the same steps by hand, so the test script itself looks wrong. Should I look into it?
```

Options:
```text
Leave it
Investigate and fix
```

Answer:
```text
Investigate and fix
```

<!-- /ANCHOR:operator-answers-verbatim -->
