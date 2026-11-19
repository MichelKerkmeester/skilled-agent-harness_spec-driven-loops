---
title: "Decision Record: Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-speckit-command-gates-step-order-drift operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift"
    last_updated_at: "2026-11-19T17:37:55.128Z"
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
# Decision Record: Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Branch worktrees/381-speckit-command-gates-step-order-drift merges main in, is rechecked and is pushed to main. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q002 | Both loose ends are fixed: main's phase 9 successor row and the resume presentation cells. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q003 | The phases may edit tests and docs outside .skilled/commands/speckit/ that assert the changed text. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q004 | Autopilot stops at a verified branch instead of merging. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q005 | Lifecycle saves pass --full-auto to the continuity writer. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q006 | An unfinished P1 item fails the run under auto and autopilot. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q007 | /speckit:plan writes tasks.md. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q008 | The closing step that only offers a second save is removed from plan, implement and complete. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q009 | save-presentation.txt and search-presentation.txt keep their unprefixed names. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q010 | The DeepSeek V4.1 Flash max implementation runs on Mistral first. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md |
| Q011 | The merged remote branch worktrees/381-speckit-command-gates-step-order-drift is deleted from origin. | Not stated. | none | 010-fix-alignment-report-findings-for-speckit-command-surfaces |
| Q012 | The red cmd-design-extract-plain-holdout-01 advisor test row is diagnosed and fixed here; the diagnosis traced it to sk-code routing metadata, not commit c75c1d8236. | Not stated. | none | 010-fix-alignment-report-findings-for-speckit-command-surfaces/implementation-summary.md:151 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:9779735f-9302-4aae-a461-3abede5e49b7:toolu_016se8NV4yoj468qo19Shbab:0 -->

Question:
```text
The speckit command gates packet is finished: all 8 phases Complete on branch worktrees/381-speckit-command-gates-step-order-drift, 21 commits ahead of origin/main and 49 behind, not pushed. A dry merge with origin/main is clean. What should happen to the branch?
```

Options:
```text
Merge main in, recheck, push to main (Recommended)
Merge main in and recheck, no push
Leave it as is
```

Answer:
```text
Merge main in, recheck, push to main (Recommended)
```

### Q002
<!-- source: claude:edbfe885-af60-4e63-8557-2a9288c9a21c:toolu_01KWV3HPbYDXi3wVFoiYTmpY:2 -->

Question:
```text
Two smaller loose ends remain. Main's phase 9 spec (009-resume-contract-owned-assets) may still say it is the last phase of the packet, and two cells of the resume presentation still name the old detection model (no finding covers them). Which should I fix now?
```

Options:
```text
Main's phase 9 successor row
Resume presentation cells
```

Answer:
```text
Main's phase 9 successor row, Resume presentation cells
```

### Q003
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_0117Xh84MNehpyMcq5hS5PV2:0 -->

Question:
```text
The fixes change text that existing tests and docs outside .skilled/commands/speckit/ assert (contract tests, command-metadata.json, catalog and playbook pages). May the phases edit those files too?
```

Options:
```text
Yes, edit them (Recommended)
No, command folder only
```

Answer:
```text
Yes, edit them (Recommended)
```

### Q004
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_0117Xh84MNehpyMcq5hS5PV2:1 -->

Question:
```text
Today autopilot (unattended mode) creates its own branch and merges when verification passes, which conflicts with your sk-git workspace rules. What should it do?
```

Options:
```text
Stop at verified branch (Recommended)
Keep merge, via sk-git
```

Answer:
```text
Stop at verified branch (Recommended)
```

### Q005
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_0117Xh84MNehpyMcq5hS5PV2:2 -->

Question:
```text
The plan, implement and complete save steps call the continuity writer without --full-auto, so they write no continuity fields although the step says they do. Should lifecycle saves pass --full-auto?
```

Options:
```text
Yes, pass --full-auto (Recommended)
No, fix the wording
```

Answer:
```text
Yes, pass --full-auto (Recommended)
```

### Q006
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_0117Xh84MNehpyMcq5hS5PV2:3 -->

Question:
```text
Under auto and autopilot nobody can approve deferring a P1 item. Should an unfinished P1 item fail the run in those modes?
```

Options:
```text
Yes, fail the run (Recommended)
No, defer and record
```

Answer:
```text
Yes, fail the run (Recommended)
```

### Q007
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_01MxVd7wyHQ2yT5cNmUHP9Ww:0 -->

Question:
```text
/speckit:plan never writes tasks.md, yet its exit gate and success text name it, and an empty scaffold satisfies the check. What should plan do?
```

Options:
```text
Stop naming it (Recommended)
Plan writes tasks.md
```

Answer:
```text
Plan writes tasks.md
```

### Q008
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_01MxVd7wyHQ2yT5cNmUHP9Ww:2 -->

Question:
```text
Plan, implement and complete each end with a step whose only job is to offer a second save right after the save step. Remove it or keep it as a status-only closeout?
```

Options:
```text
Remove it (Recommended)
Keep, status only
```

Answer:
```text
Remove it (Recommended)
```

### Q009
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_01MxVd7wyHQ2yT5cNmUHP9Ww:3 -->

Question:
```text
Phase 8 would rename save-presentation.txt and search-presentation.txt to carry the speckit- prefix like the other assets. The README and the sk-create-command naming rule currently defend the unprefixed names. Rename or keep?
```

Options:
```text
Keep the names (Recommended)
Rename with prefix
```

Answer:
```text
Keep the names (Recommended)
```

### Q010
<!-- source: claude:f863f57a-786e-4240-ba81-28682740098f:toolu_012AJr6hTvaSyvRCzG37VfAF:0 -->

Question:
```text
Which route should the DeepSeek V4.1 Flash (max effort) implementation run on? Roughly 300 task dispatches are planned. Mistral is priced at double the LLM Gateway rate in the skill docs, and whether your Mistral subscription pool absorbs it is unconfirmed there.
```

Options:
```text
Mistral first (Recommended)
LLM Gateway first
OpenCode Go first
```

Answer:
```text
Mistral first (Recommended)
```

### Q011
<!-- source: claude:e2b0daef-5e39-45d6-a68b-df1b67c8a379:toolu_01CZBHx4XEZkA2uFUNyZCwgk:0 -->

Question:
```text
Delete the remote branch worktrees/381-speckit-command-gates-step-order-drift on origin? It is fully merged into origin/main (343c2f5ab3). The local worktree and branch are already removed. To undo, re-push it from 343c2f5ab3.
```

Options:
```text
Delete it (Recommended)
Keep it
```

Answer:
```text
Delete it (Recommended)
```

### Q012
<!-- source: claude:edbfe885-af60-4e63-8557-2a9288c9a21c:toolu_01KWV3HPbYDXi3wVFoiYTmpY:0 -->

Question:
```text
One advisor test row is red on main: cmd-design-extract-plain-holdout-01 in command-routing-slice.vitest.ts now routes the /design:extract holdout to sk-code instead of sk-doc. It fails the same way without my work. The likely cause is main commit c75c1d8236, which changed sk-doc phrases without recapturing the baseline. What should happen to it?
```

Options:
```text
Leave it to its owner (Recommended)
Diagnose and fix it here
Recapture the baseline only
```

Answer:
```text
Diagnose and fix it here
```

<!-- /ANCHOR:operator-answers-verbatim -->
