---
title: "Decision Record: Phase 9: skilled-alignment-and-docs"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "009-skilled-alignment-and-docs operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/009-skilled-alignment-and-docs"
    last_updated_at: "2026-11-24T07:00:28.304Z"
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
# Decision Record: Phase 9: skilled-alignment-and-docs

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Close the F1 residual now with an authoring-verb guard that keeps ordered keywords out of prompts holding authoring, building, creating or writing. | Not stated. | None | AC-008, T011, hub-router.json orderedKeywordBlockers, router.cjs scoreModes |
| Q002 | Delete every bots-* folder in the system temp folder, not only the four rollback copies. | Not stated. | None | 006 scratch rollback evidence; temp cleanup |
| Q003 | Stop after every phase reached Complete and leave the merge to main for later. | Not stated. | None | parent spec.md phase map |
| Q004 | Fix the checker so it fails a native bot and a sandbox mismatch, and point the template at a real executor, before the merge. | Not stated. Evidence: yes_no, option false, overlap 1, imperative true, shift false. | None | REQ-007, AC-011, T016, scripts/bot-check.cjs, assets/bot-template.txt |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01JTf9ubVX2BHBXWhhhigZpn:0 -->

Question:
```text
Four authoring prompts still route to the bots `run` mode at stage two (the mode that dispatches a real executor): "start writing the bot", "start building the bot", "how do I start building the bot" and "launch the bot I'm writing". The ordered keywords `~start the bot` / `~launch the bot` allow three words in between, so "writing" slips through. Close it now, before the version bump and final gates? A fix edits the hub-local router engine (authored and runtime copies), the hub-router contract text, canary gold, and reruns the rebuild chain (new policy hash), about 45-60 minutes. Leaving it open means AC-008 ("each named-bot request routes its mode") cannot stay Met as written: it needs a superseding decision record (a new `decision-record.md` in 009 with an ADR) or an amended criterion.
```

Options:
```text
Authoring-verb guard (Recommended)
Per-keyword adjacency
Record as follow-up
```

Answer:
```text
Authoring-verb guard (Recommended)
```

### Q002
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_018qYUDmQANDzvFMJwgRewDG:1 -->

Question:
```text
My four rollback rehearsal copies are full copies of the tree, left in the system temp folder (/var/folders/.../T/bots-rollback-copy-1DAlzh, -B1ukAg, -Rr1uh6, -vfBipD). Delete them? Their node_modules are only symlinks, so deleting the copies doesn't touch the worktree.
```

Options:
```text
Delete the four copies (Recommended)
Delete all bots-* temp
Keep everything
```

Answer:
```text
Delete all bots-* temp
```

### Q003
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_018qYUDmQANDzvFMJwgRewDG:2 -->

Question:
```text
Every phase of the headless bots packet is now Complete. What should I do next?
```

Options:
```text
Prepare merge to main (Recommended)
Stop here
```

Answer:
```text
Stop here
```

### Q004
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:chat:72c45006-b610-42bf-869f-70ae911344a1:0a96c4e0-af03-413d-8376-c5139aa85a46 -->

Question:
```text
Should I make that fix before the merge?
```

Options: none

Answer:
```text
fix
```

<!-- /ANCHOR:operator-answers-verbatim -->
