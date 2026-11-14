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
    recent_action: "Added operator decisions Q019 to Q028 of 2026-11-14 by hand"
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
| Q019 | Phase 011 is built now, in a new git worktree: 378, branch worktrees/378-relocate-restore-fixes. | Not stated. | None | 011-relocate-and-restore-fixes |
| Q020 | DeepSeek V4.1 Flash through dsh implements the phase 011 code. | Not stated. | None | 011-relocate-and-restore-fixes scratch worker reports |
| Q021 | Reinstall dsh 0.2.2-rc.1 for the phase 011 build, after the global dsh changed to 0.2.2-rc.3. The build called the pinned rc.1 by its absolute path. | Not stated. | None | 011-relocate-and-restore-fixes implementation-summary.md |
| Q022 | dsh is re-pinned to 0.2.2-rc.3, in a packet of its own outside this one. | The chosen option read: re-pin offline first as hard-rules.json requires, in its own packet; phase 011 stays on rc.1 meanwhile. | None | Not carried in this packet; the re-pin packet is not started |
| Q023 | The main checkout's uncommitted copies of the phase 011 to 013 planning files are removed before worktree 378 merges into main, not now. | Not stated. | None | The session handoff note of 2026-11-14 |
| Q024 | This session builds phases 012 and 013. | Not stated. The recommended option said this session holds the phase 011 diff that 013 must describe. | Q012 for the implementation of phases 012 and 013 | 012-catalog-and-playbook-alignment, 013-skill-docs-and-housekeeping |
| Q025 | The phase 009 routing review in phase 013 is done by Fable 5.2 at high effort through claude2. | Not stated. | None | 013-skill-docs-and-housekeeping REQ-008 |
| Q026 | Worktree 375 and its local branch worktrees/375-subtrack-review-remediation are removed now. | Not stated. The branch was already merged into main. | None | Done 2026-11-14: `git worktree remove` and `git branch -d` |
| Q027 | Worktree 378 takes origin/main by merge, not rebase, after origin moved while it waited. The generated trigger index and its fixtures are rebuilt from the merged tree, the suites rerun, and the push to origin/main is asked separately. The primary checkout is not touched while another session's copies are dirty there. | Not stated. | Supersedes the main-checkout merge path that Q023 assumed | Merge commits `54179394ea` and `ce8536f3e2` on worktrees/378-relocate-restore-fixes |
| Q028 | The word "quote" in the system-spec-kit routing signals stays. The routing review's optional P2 is not applied. | Not stated. The recommended option said removing it changes no top-1 on the 285 labelled rows and would need the full routing gate. | None | 013-skill-docs-and-housekeeping scratch/routing-review.md |
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

### Q019

Asked through AskUserQuestion on 2026-11-14. Question: start building phase 011, and where. Options: yes in a new worktree, yes on the current branch, or not yet.

Operator answer:
```text
Yes, new worktree (Recommended)
```

### Q020

Asked through AskUserQuestion on 2026-11-14. Question: who implements the phase 011 code. Options: DeepSeek via dsh, or this session.

Operator answer:
```text
DeepSeek via dsh (Recommended)
```

### Q021

Asked through AskUserQuestion on 2026-11-14. Question: the global dsh became 0.2.2-rc.3 while the pin requires 0.2.2-rc.1, so how does the phase 011 build proceed. Options: reinstall rc.1, this session builds, or Pi with OpenCode Go.

Operator answer:
```text
Reinstall rc.1 (Recommended)
```

### Q022

Asked through AskUserQuestion on 2026-11-14. Question: what happens to the second dsh install at 0.2.2-rc.3 that shadows the pinned rc.1 in PATH. Options: leave it for now, remove the copy, or re-pin to rc.3.

Operator answer:
```text
Re-pin to rc.3
```

### Q023

Asked through AskUserQuestion on 2026-11-14. Question: what to do with the uncommitted copies of the phase 011 to 013 planning files in the main checkout, already committed in worktree 378. Options: remove before merge, or remove them now.

Operator answer:
```text
Remove before merge (Recommended)
```

### Q024

Asked through AskUserQuestion on 2026-11-14. Question: who builds the documentation phases 012 and 013. Options: this session, DeepSeek via dsh, or Fable 5.2 via claude2.

Operator answer:
```text
This session (Recommended)
```

### Q025

Asked through AskUserQuestion on 2026-11-14. Question: who does the phase 013 review of the phase 009 routing change. Options: a fresh Fable 5.2 high, or this session.

Operator answer:
```text
use claude2 for fable 5.2 high
```

### Q026

Asked through AskUserQuestion on 2026-11-14. Question: remove worktree 375 and branch worktrees/375-subtrack-review-remediation, already merged into main. Options: remove now, or leave it for now.

Operator answer:
```text
Remove now (Recommended)
```

### Q027

Asked through AskUserQuestion on 2026-11-14. Question: worktree 378 is behind origin/main, which moved 27 commits, and they overlap only in the generated trigger-index files; how should 378 reach main. Options: merge origin into 378, rebase 378 onto origin, or wait for the other session.

Operator answer:
```text
Merge origin into 378 (Recommended)
```

### Q028

Asked through AskUserQuestion on 2026-11-14. Question: remove the word "quote" from the system-spec-kit routing signals, the routing review's optional P2. Options: leave it, or remove it in a packet of its own.

Operator answer:
```text
Leave it (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
