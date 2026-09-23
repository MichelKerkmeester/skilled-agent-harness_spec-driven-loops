---
title: "Goal: Capture Folders out of the Containment Snapshot"
description: "Keep containment capture folders out of the fan-out snapshot and detection, untrack them all, and prove a worktree removes again."
trigger_phrases:
  - "containment capture snapshot"
  - "capture folders untracked"
  - "worktree remove path limit"
  - "baseline capture nesting"
  - "capture detection guard"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot"
    last_updated_at: "2026-09-23T20:30:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "Closed the packet with every acceptance criterion met"
    next_safe_action: "None. The packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-capture-folders-out-of-snapshot"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Capture Folders out of the Containment Snapshot

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Keep containment's own capture output out of every later run's snapshot and violation detection, and stop tracking it so a worktree can be removed again.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Guard both the snapshot and the violation detection, because detection subtracts the baseline and would report an earlier run's captures as new violations. |
| D2 | Match a capture folder by path segment wherever it sits in the path, whichever run wrote it, not only the current run's. |
| D3 | Untrack every capture folder and ignore both kinds in git, because any tracked capture is copied by the next run. |
| D4 | Implemented by cli-pi with MiMo v2.6 pro through the llmgateway provider, and the orchestrator verifies every diff. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] The two new write-containment tests fail before their guard and pass after it
- [x] git ls-files lists no capture path and the longest tracked path is 353
- [x] A fresh worktree of the fixed tree removes with plain git worktree remove
- [x] write-containment.vitest.ts passes 79 and the runtime typecheck exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| T001 read the snapshot and detection code | Done | Reviewed the two functions in write-containment.ts before commit 162a3bd816 |
| T002 snapshot test red | Done | New test in write-containment.vitest.ts was red before its guard, commit 162a3bd816, covers REQ-006 and AC-006 |
| T003 snapshot guard | Done | Capture skip in the snapshot loop, commit 162a3bd816, covers REQ-001 and AC-001 |
| T004 detection test red | Done | New test in write-containment.vitest.ts was red before its guard, commit 162a3bd816, covers REQ-006 and AC-006 |
| T005 detection guard | Done | Capture skip before the baseline lookup in the detection loop, commit 162a3bd816, covers REQ-002 and AC-002 |
| T006 gitignore rules | Done | Two ignore patterns for both capture kinds in .gitignore, commit b7648ec0b0, covers REQ-003 and AC-003 |
| T007 untrack the captures | Done | git rm --cached of 24,582 capture files, commit b7648ec0b0, covers REQ-003 and AC-003 |
| T008 prune the sk-doc baseline | Done | baseline-readme-verdicts.json dropped from 1,304 entries to 1,058 with parity pass on 1,058 files, covers REQ-005 and AC-005 |
| T009 run the suites and typecheck | Done | write-containment.vitest.ts 79 passed, the six containment-related test files 395 passed and 1 skipped, runtime typecheck exit 0 |
| T010 live removal proof | Done | Fresh worktree added and removed at the final HEAD, both exit 0 and the folder gone, covers REQ-004 and AC-004 |
| T011 packet docs and parent rows | Done | This packet filled at the final HEAD of branch worktrees/066-ci-cleanup-follow-ups |

### Deviations and findings

| Item | Note |
|------|------|
| Quarantine generations cited elsewhere now untracked | A remediation plan cites five quarantine generations that are now untracked and the content stays in history |
| Workflow exclude now empty | The dispatch enforcement workflow excludes a containment path that no longer matches anything in CI and it is left in place |
| Walkers read the disk | Filesystem walkers such as the trigger-index generator read the disk and not git, so ignored captures on a local disk can be picked up by a local regeneration |
<!-- /ANCHOR:log -->
