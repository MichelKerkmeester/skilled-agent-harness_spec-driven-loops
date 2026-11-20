---
title: "Decision Record: Phase 9: resume-contract-owned-assets"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "009-resume-contract-owned-assets operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/009-resume-contract-owned-assets"
    last_updated_at: "2026-11-19T17:38:02.895Z"
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
# Decision Record: Phase 9: resume-contract-owned-assets

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The red Spec-Kit Check is fixed here by removing the two stale owned_assets rows from command-contract.json. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/009-resume-contract-owned-assets/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:4ffb6631-1dac-4d59-8234-228bc0f180ed:toolu_011wnWUNY6J7CYEqCPxjS6MZ:0 -->

Question:
```text
Spec-Kit Check is red on main. Cause: two owned_assets rows in sk-create-command's command-contract.json (lines 117-118) still name speckit-resume-auto.yaml and -confirm.yaml, which commit 2e1e9c973d deleted. The fix is about 3 lines: add /speckit:resume to the workflow row's commands and drop the two stale rows. The 381 worktree still exists at ba7062dd17. Who fixes it?
```

Options:
```text
Fix here (Recommended)
Leave to 381 session
```

Answer:
```text
Fix here (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
