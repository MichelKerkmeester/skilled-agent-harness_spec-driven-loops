---
title: "Decision Record: Phase 12: fix-barter-022-handover-items-for-doctor-scripts"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "012-fix-barter-022-handover-items-for-doctor-scripts operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/012-fix-barter-022-handover-items-for-doctor-scripts"
    last_updated_at: "2026-11-16T10:24:58.621Z"
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
# Decision Record: Phase 12: fix-barter-022-handover-items-for-doctor-scripts

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The four items still open from the vendoring project's first handover are checked against the code and planned, with no code changes. | Two of the four already checked out by reading, so they are real. | None | spec.md, plan.md, tasks.md |
| Q002 | A staged re-pin keeps skipping the regenerate steps, and the problem line names the step instead. | A stage has no project install behind it, so the steps cannot run there. | None | goal.md D4, REQ-005 |
| Q003 | A host hook that replaces a Skilled hook is declared as skilled.hostHook in local git config, one value per hook. | It mirrors skilled.omitHook: local config only, and the passing row names each host hook. | None | goal.md D5, REQ-001, REQ-006 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01VWpbJFTT7qd5XsvFn212Gw:0 -->

Question:
```text
The Barter session sent its older phase 022 handover. Phase 023 (six items) is already built and phase 024 (items 7 to 10) is planned, but phase 022 has four items still open that Skilled has no record of: a host's own pre-commit hook fails the git setup check, captured routing fixtures differ in a host, `apply --adopt` refuses a path under `repin.exclude`, and regenerate steps do not run on a staged re-pin. What should I do with those four?
```

Options:
```text
Check and plan them (Recommended)
Record only
Nothing now
```

Answer:
```text
Check and plan them (Recommended)
```

### Q002
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01DpXRxKmk12gzk1bpuZyDhp:3 -->

Question:
```text
Overlay plan, phase 012 (Barter phase 022 item 2): should a staged re-pin stay as it is and not run the regenerate steps? Barter asked for a stage to run them so a passing stage means a passing live run.
```

Options:
```text
Keep skipping them (Recommended)
Run them on the stage
```

Answer:
```text
Keep skipping them (Recommended)
```

### Q003
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01TSZx8UiHW48gEKn6YhVmXp:2 -->

Question:
```text
Overlay plan, phase 012 (Barter phase 022 item 3): is `skilled.hostHook`, one local git config value per hook, the right form for a host hook that replaces a Skilled hook?
```

Options:
```text
Yes, skilled.hostHook (Recommended)
Marker line in the hook
Do not accept host hooks
```

Answer:
```text
Yes, skilled.hostHook (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
