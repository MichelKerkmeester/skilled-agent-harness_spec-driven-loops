---
title: "Decision Record: Phase 5: post-alignment-doc-fixes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-post-alignment-doc-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation/005-post-alignment-doc-fixes"
    last_updated_at: "2026-11-24T13:35:46.808Z"
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
# Decision Record: Phase 5: post-alignment-doc-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Run doc alignment with two topics in a scratch topics file passed through the script's --topics flag, leaving topics.json unchanged. | Not stated. | None | plan.md section 6, tasks.md T001 |
| Q002 | Run the alignment lanes on the existing codex preset (gpt-6-luna xhigh fast), not a new luna-high preset. | Not stated. | None | tasks.md T001 |
| Q003 | Approve the scope and the paid lanes for all three alignment runs with no second checkpoint. | Not stated. | None | tasks.md T001 |
| Q004 | Fix all eight alignment findings, including the older doctor-mcp-install P0 and the SECURITY.md wording. | Not stated. | None | spec.md section 3, tasks.md T002-T003; sk-git 007 tasks.md T008-T009 |
| Q005 | After the fixes, recheck the alignment run, save the session's decisions to the packets and remove worktrees 534 and 536. | Not stated. | None | implementation-summary.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_017snk6yqvb2k79Vp9LsmSf6:0 -->

Question:
```text
/local-doc-alignment needs a topic from topics.json, and none covers the cli-orca removal or the sk-git provisioning fix. How should doc alignment run?
```

Options:
```text
Scratch topics file (Recommended)
Add topics to topics.json
Skip doc alignment
```

Answer:
```text
Scratch topics file (Recommended)
```

### Q002
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_017snk6yqvb2k79Vp9LsmSf6:1 -->

Question:
```text
Which lane executor should both alignment runs use? There is no 'luna high' preset in executors.json.
```

Options:
```text
Scratch luna-high preset (Recommended)
Existing codex preset
```

Answer:
```text
Existing codex preset
```

### Q003
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01CQErWo8szGNQHgafuxqHDE:0 -->

Question:
```text
Scope checkpoint for all three runs, from worktree 536 at origin/main febc695d7b4. (1) local-skilled-alignment, range 2ecd0b8dafc..febc695d7b4, first-parent: 142 files, 3 commits, 13 of 16 surfaces fire, 89 battery rows, then up to 4 codex lanes (gpt-6-luna xhigh fast) and a native critic. (2) doc alignment, topic cli-orca-removal: 1 doc (the captured process list in cli-mistral-vibe), 3 checks, 1 lane. (3) doc alignment, topic worktree-provisioning: 29 docs, 1 check, 2 lanes. Lanes are the paid part. Approve?
```

Options:
```text
Approve all, lanes too (Recommended)
Approve, stop before lanes
Checks only
Cancel
```

Answer:
```text
Approve all, lanes too (Recommended)
```

### Q004
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01UmoPV5L43eDw96dpCmk6hx:0 -->

Question:
```text
The alignment runs found 8 open doc findings (no code issues). Which should be fixed now?
```

Options:
```text
Mine plus literal doc fixes (Recommended)
Everything
Only my misses
Nothing now
```

Answer:
```text
Everything
```

### Q005
<!-- source: claude:ff6a7339-90f8-496d-b18b-2c3b56947423:toolu_01THZMZ7kr6zdbAybVq5LrYX:0 -->

Question:
```text
All 8 alignment findings are fixed and pushed (origin/main a35417ce37f). What next?
```

Options:
```text
Recheck the alignment run (Recommended)
Save decisions to the packets
Clean up worktrees 534 and 536
Stop here
```

Answer:
```text
Recheck the alignment run (Recommended), Save decisions to the packets, Clean up worktrees 534 and 536
```

<!-- /ANCHOR:operator-answers-verbatim -->
