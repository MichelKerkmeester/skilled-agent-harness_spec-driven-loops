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

<!-- /ANCHOR:operator-answers-verbatim -->
