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
    last_updated_at: "2026-11-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added operator decisions Q010 to Q018 of 2026-11-14 by hand"
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
| Q010 | The findings of the two code reviews of 2026-11-14 are remediated in new child phases 006 onward under this parent. Phases 001 to 005 are not reopened, and the parent goal is updated. | Not stated. | None | spec.md Operator Decisions, goal.md D5, children 006 to 010 |
| Q011 | The remediation work happens in git worktree 375, created from origin/main. | Not stated. | None | spec.md Operator Decisions, the Branch row of each child spec.md from 006 to 010 |
| Q012 | For the remediation phases, planning and plan verification are done by fresh Fable 5.2 instances at high effort through claude2, and implementation by DeepSeek V4.1 Flash at max reasoning through the dsh harness. | Not stated. | None | spec.md Operator Decisions, goal.md log |
| Q013 | Reviewer B findings 1 to 5 are handed to the 008 command surfacing session and are not planned in this packet. | Not stated. | None | spec.md Handed to the 008 session, goal.md log |
| Q014 | B8 is accepted as a known miss: sub-track requests that name a skill track keep routing to that skill, with system-spec-kit as a passing second candidate. No scorer change and no skill or track name in a signal. | Not stated. | None | 009-proposal-search-and-routing tasks.md T010, goal.md log |
| Q015 | Branch worktrees/375-subtrack-review-remediation is merged to main and pushed after origin/main is merged into it and the suites rerun. | Not stated. | None | goal.md log |
| Q016 | The P1 and P2 findings of the two reviews of the finished packet are fixed in three phases: 011 code, 012 feature catalog and playbook, 013 skill documents, changelog and packet records. | Not stated. | None | spec.md Operator Decisions, goal.md D6, children 011 to 013 |
| Q017 | This session writes the planning documents for phases 011 to 013. | Not stated. The recommended option said the session already holds both reviews and the traced code paths. | Q012 for the planning of phases 011 to 013 | spec.md Operator Decisions |
| Q018 | The phase 009 routing change gets a review task: phase 013 adds both routing files to the review manifest and reviews the change. | Not stated. | None | 013-skill-docs-and-housekeeping REQ-008 |
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

### Q010

Recorded by hand on 2026-11-14 from the orchestrator's brief to the planning session. The question, the options and the operator's own words were not passed to that session, so none is quoted here.

Decision as briefed:
```text
remediation of the two code reviews is planned as new children 006 onward under this parent, not by reopening 001 to 005, and the parent goal is updated
```

### Q011

Recorded by hand on 2026-11-14 from the orchestrator's brief to the planning session. The question, the options and the operator's own words were not passed to that session, so none is quoted here.

Decision as briefed:
```text
the work happens in git worktree 375 created from origin/main
```

### Q012

Recorded by hand on 2026-11-14 from the orchestrator's brief to the planning session. The question, the options and the operator's own words were not passed to that session, so none is quoted here. Q006 and Q008 stay the record for phases 001 to 005.

Decision as briefed:
```text
planning and plan verification are done by fresh Fable 5.2 high instances through claude2, implementation by DeepSeek V4.1 Flash at max reasoning through the dsh harness
```

### Q013

Recorded by hand on 2026-11-14 from the orchestrator's brief to the planning session. The question, the options and the operator's own words were not passed to that session, so none is quoted here.

Decision as briefed:
```text
reviewer B findings 1 to 5 are handed to the 008 command surfacing session
```

### Q014

Asked through AskUserQuestion on 2026-11-14. Question: how should B8 be resolved. Options: accept the miss, a scorer change in a new phase, or allow a name exception.

Operator answer:
```text
Accept the miss (Recommended)
```

### Q015

Asked through AskUserQuestion on 2026-11-14. Question: what should happen to branch 375. Options: merge to main and push, merge locally only, or leave the branch.

Operator answer:
```text
Merge to main and push (Recommended)
```

### Q016

Asked through AskUserQuestion on 2026-11-14. Question: accept the split of the fixes into phase 011 for code and phase 012 for docs. Options: 011 code and 012 docs, one phase 011, or three phases with docs split into 012 catalog and playbook and 013 skill documents, references, changelog and READMEs.

Operator answer:
```text
Three phases
```

### Q017

Asked through AskUserQuestion on 2026-11-14. Question: who writes the planning documents for the new phases. Options: this session, or Fable 5.2 high through claude2 as Q012 says.

Operator answer:
```text
This session (Recommended)
```

### Q018

Asked through AskUserQuestion on 2026-11-14. Question: how the plan handles the phase 009 routing change that no reviewer judged. Options: add a review task, or accept it as reviewed.

Operator answer:
```text
Add a review task (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
