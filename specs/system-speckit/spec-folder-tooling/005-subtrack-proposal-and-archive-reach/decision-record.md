---
title: "Decision Record: Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-subtrack-proposal-and-archive-reach operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach"
    last_updated_at: "2026-11-13T10:29:45.859Z"
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
# Decision Record: Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | No archive search mode was chosen at this point: the operator asked for the downsides of always-on search first. | Not stated. | None | spec.md Operator Decisions, goal.md D1 |
| Q002 | Mixed tracks stay forbidden, so a subtrack proposal is a complete whole-track map. | Not stated. | None | spec.md Operator Decisions, goal.md D2, 001-relocation-engine REQ-003 |
| Q003 | No numbering option was chosen at this point: the operator asked which option costs more renumbering. | Not stated. | None | spec.md Operator Decisions, goal.md D4 |
| Q004 | Archive search is opt-in and live: ripgrep plus per-packet JSON, with no committed archive index and CI unchanged. | Not stated. | None | spec.md Operator Decisions, goal.md D1, 004-archive-search-and-json |
| Q005 | Renumbering is done by a deterministic tool that updates every store, with no hand edits and no AI fix-up work. Counting archived packets in next-number allocation was carried as a stated assumption in the plan the operator then approved. | Not stated. | None | spec.md Operator Decisions, goal.md D3 and D4, 001-relocation-engine, 003-subtrack-archive-and-numbering |
| Q006 | The planning documents are written by one Fable 5.2 worker at medium effort, dispatched through the operator's claude2 account. | Not stated. | None | scratch/dispatch-brief.md |
| Q007 | Packet 005 gets a goal: a phase-parent goal.md binding five child goals, offered to the operator to set. | Not stated. | None | goal.md |
| Q008 | Code is implemented by DeepSeek V4.1 Flash at max reasoning through the dsh harness (or Pi with the OpenCode Go provider), never by Fable. Fable through claude2 stays allowed for documents. | Not stated. | None | scratch/dispatch-brief-002-docs.md, 002-subtrack-proposal/implementation-summary.md |
| Q009 | Restoring an archived packet onto a live folder with the same name stays refused. The engine renumbers only when a differently named packet holds the number. | Not stated. | None | 001-relocation-engine REQ-014, archive.sh |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01TanHQVQfYhMQuN9y8td1LH:1 -->

Question:
```text
Today the trigger index and every ripgrep recipe skip z_archive at all depths on purpose. How should archived packets become searchable?
```

Options:
```text
Opt-in flag (Recommended)
Always on, ranked lower
Always on, equal
```

Answer:
```text
downsides of always on
```

### Q002
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01TanHQVQfYhMQuN9y8td1LH:2 -->

Question:
```text
The current rule forbids a mixed track (a track holds either flat packets or subtracks, never both, and the sweep flags a mix). When the AI spots a cluster of related packets in a flat track, what should it propose?
```

Options:
```text
Whole-track map (Recommended)
Allow mixed tracks
```

Answer:
```text
Whole-track map (Recommended)
```

### Q003
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01TanHQVQfYhMQuN9y8td1LH:3 -->

Question:
```text
Numbering ignores z_archive, so a track whose packets are all archived starts again at 001 (specs/sk-doc has 48 archived packets and would reuse 001). Should next-number allocation count archived packets?
```

Options:
```text
Count archives (Recommended)
Leave as is
```

Answer:
```text
if we go for 1 that would mean renumbering all archived ones right. if we go for 2 you would te renumber after archiving. what is more costly
```

### Q004
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01Nxncwg4Sqrj2wpDXhrfAEU:0 -->

Question:
```text
Given those downsides (index doubles from about 18k to 36k paths, stale hits compete with live ones, CI checks out no z_archive), how should archived packets become searchable?
```

Options:
```text
Opt-in, live search (Recommended)
Opt-in, own index
Always on, ranked lower
```

Answer:
```text
Opt-in, live search (Recommended)
```

### Q005
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01Nxncwg4Sqrj2wpDXhrfAEU:1 -->

Question:
```text
Neither numbering option renumbers existing packets, and there are zero live-vs-archived number collisions today. Should next-number allocation count archived packets?
```

Options:
```text
Count archives (Recommended)
Leave as is
```

Answer:
```text
We need smart renumbering, that also updates jsons etc, without needed to use manual work or use a lot of tokens from ai to fix
```

### Q006
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01HraKx4RGVUNJ7wqn5yeNex:1 -->

Question:
```text
Who writes the planning documents for packet 005?
```

Options:
```text
Single agent (Recommended)
Multi-agent (1+2)
Multi-agent (1+3)
```

Answer:
```text
Use 1 Fable 5.2 medium agent through claude2
```

### Q007
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_01HraKx4RGVUNJ7wqn5yeNex:2 -->

Question:
```text
Should packet 005 get a session goal (goal.md) for this workflow?
```

Options:
```text
Offer a goal (Recommended)
Skip
```

Answer:
```text
Offer a goal (Recommended)
```

### Q008
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_019h1GrnnyC9nB3uZEdVq1Q7:0 -->

Question:
```text
Phase 002 is running on Fable 5.2 through claude2 at high effort; I picked high because it writes code, while you named medium for the planning docs. Which effort should the build workers for phases 003 to 005 use?
```

Options:
```text
High (Recommended)
Medium
Xhigh
```

Answer:
```text
We dont want fable for coding, for implementing utilize deepseek v4.1 flash max cli dsh or pi withj opencode go provider
```

### Q009
<!-- source: claude:af8d5552-c79a-45e0-acf2-f076146fb351:toolu_019h1GrnnyC9nB3uZEdVq1Q7:2 -->

Question:
```text
Restoring an archived packet when a live folder with the exact same name already exists: phase 001 keeps the existing refusal (existing tests require it) and renumbers only when a differently named packet holds the number. Is that the behavior you want?
```

Options:
```text
Keep the refusal (Recommended)
Renumber anyway
```

Answer:
```text
Keep the refusal (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
