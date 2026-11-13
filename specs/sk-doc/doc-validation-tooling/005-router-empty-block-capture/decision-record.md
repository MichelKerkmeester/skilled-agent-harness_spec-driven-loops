---
title: "Decision Record: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-router-empty-block-capture operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/doc-validation-tooling/005-router-empty-block-capture"
    last_updated_at: "2026-11-13T13:57:59.593Z"
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
# Decision Record: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the two registry compilers in this packet by editing the authored files under specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout and rebuilding the served closure. | Not stated. | None | plan.md, implementation-summary.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:c2497e96-ff88-41c6-9599-e776e8c18a21:toolu_01P4AtGRwiZEc7aqQuLAwKcw:0 -->

Question:
```text
The empty-block capture plan lists two registry-compiler.cjs files under .skilled/bin as edits. I found they are byte-for-byte served copies of authored files in specs/sk-doc/z_archive/019-skill-routing-refactor, and compiled-route-sync.cjs --check fails when a served copy differs. Fixing them means editing the archived authored files and rebuilding the served closure, which the plan did not scope. How should the capture packet handle them?
```

Options:
```text
Defer the compilers (Recommended)
Include them properly
Pause the capture packet
```

Answer:
```text
Include them properly
```

<!-- /ANCHOR:operator-answers-verbatim -->
