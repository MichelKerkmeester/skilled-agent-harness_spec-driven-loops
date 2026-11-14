---
title: "Feature Specification: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title"
description: "On Claude Code a pending hand-over refuses a question dialog, a sender with no goal hands on the unfinished goal of its packet and a session with only a generated title keeps it after a hop."
trigger_phrases:
  - "hop dialog goal title phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title"
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned children 015 to 019 from the third review round of 2026-11-14"
    next_safe_action: "Operator picks the workspace, then build children 015 to 019 in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "8d16c027-15a3-4944-a1d2-eef7cc2cb0b8"
      parent_session_id: null
    completion_pct: 74
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md. These belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/366-hop-after-question-dialog` for children 001 to 003, merged on 2026-11-13. `worktrees/373-relaunch-gap-fixes` for children 004 to 014. Children 015 to 019 have no workspace yet, and the operator picks one before the build |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop |
| **Predecessor** | 038-goal-and-workflow-resume |
| **Successor** | None |
| **Handoff Criteria** | All nineteen children are Complete, the relaunch, OpenCode plugin, goal hook and Pi suites pass, both sync checks print `PASS` and recursive strict validation prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three gaps showed on 2026-11-13 in Claude Code sessions that hand over near the context limit.

A sender that opens a question dialog after `prepare` never hops. Only the Stop hook arms a prepared hand-over, and a dialog keeps the turn open, so Stop never fires and the record stays pending. Four of fourteen live attempts in child 016 of packet 038 ended this way.

A sender that never set a goal hands on nothing. The receiver starts with the claim seed only, and because Claude Code lets no hook set a goal, the operator types `/goal` again in every new session of a packet that already has a `goal.md`.

A session with no launch name and no `/rename` has only the title Claude generated. The hop carried no name for it, so the receiver got a new generated title and the operator could no longer tell which session continued which.

Children 001 to 003 closed those three gaps. A research run on 2026-11-13 (`research/research.md`) then checked the three fixes and their parent against the code and found open ends. A wrapper that was already running kept its old code after a fix landed and said nothing. A pending record that Stop could not arm refused every question until `cancel`. A record with no handoff note was treated as a real hand-over. A goal the operator had ended came back one hop later, and the goal fallback could pick a packet far above the note. Two tests failed for reasons outside the code they test, and five documents said something the code or the packets did not.

Children 004 to 011 closed those. Two independent reviewers then read all eleven fixes on 2026-11-14 and the orchestrator checked their findings against the code. Three survived as work for this packet. The wrapper's change note goes to stderr only, so an unattended hop loses it, and a wrapper file that cannot be read for a moment prints a false note. The shared conformance case for a Stop that cannot arm drops the deferral stamp for every runtime, so it pins neither Claude's stamp nor Codex's lack of one. One README sentence, three code comments and the handoff command document say something the code does not do.

Children 012 to 014 closed those, and the packet merged to `main`. A third round of review followed on 2026-11-14: a ten-iteration deep review, an alignment run and two independent reviews of the merge, which the orchestrator checked against the code. The wrapper still prints a false change note when its start checksum came back empty. The ended-goal mark is read from any note a session ever claimed, and it is lost when the session log cannot be read. A Stop with no transcript path parks the hop and the next prompt withdraws it without a word to the operator. The sk-git sentence on a rebase and its `Commit-Id` is false, and the skill changed with no version or changelog. The playbook and the feature catalog do not describe what the packet shipped, and two closed children cite lines that later children moved.

### Purpose
A Claude Code hand-over cannot be parked behind a question dialog. Its receiver starts on the unfinished goal of the packet the note names when the sender set no goal. A session that only has a generated title keeps that title, with the hop count added, in the next session. The open ends the operator chose to close on 2026-11-14 are closed as well: a changed wrapper says so before a hop, a hand-over Stop cannot arm stops blocking questions, a goal the operator ended stays ended and the documents say what the code does. What the two reviews of 2026-11-14 confirmed is closed too: the wrapper's change note reaches `relaunch.log`, the shared conformance case states which runtime stamps a record Stop could not arm, and the comments and documents the reviews found wrong are corrected. What the third review round confirmed is closed too: the wrapper reports a change only when it read both checksums, the ended-goal mark follows the note a session claimed last, a Stop with no transcript path tells the operator, the sk-git rebase sentence says what the hook does and the playbook and catalog describe the shipped behavior.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Claude PreToolUse guard refuses `AskUserQuestion` while this session's relaunch record is pending, and names the handoff note and the cancel command in the refusal.
- The Claude goal resolver names the nearest packet in the note's spec folder lineage whose `goal.md` is within budget and still has an unticked criterion, when the session log was read whole and holds no goal entry.
- The Claude settings reader returns the last generated title, and `prepare` records it as the session name when there is no renamed title and no launch name.
- The tests for each change, the hook registry binding with the generated `.claude/settings.json` and the README lines that state the new behavior.
- The wrapper prints one note on stderr before a hop when its own file changed after the loop started.
- A Claude Stop that leaves a record pending stamps `deferredAt` on it, so the operator's next prompt withdraws the record.
- `readRelaunchFile` reads a record with no `handoff` string as absent.
- A Claude goal that was met, failed or cleared is marked in the handoff note as `goal_ended: true`, and a receiver that sets no goal keeps it ended in its own hand-over.
- The packet goal fallback considers the note's folder and its parent and no packet further up.
- Two test fixes: the killer grace-period test gets a 1000 ms deadline, and the history lookup test stops inheriting `OPENCODE_DB`.
- Five document fixes: two binding rows in the 002 parent goal, phase 033 set to Complete, the sk-git sentence on a rebase and its `Commit-Id`, two stale limitation rows in the summary of 038 child 011, and the playbook case names with `cp` in the HS-8 block.
- The wrapper appends one `wrapper-changed` line to `relaunch.log` when it prints the change note, and prints and logs nothing when its file cannot be read at the hop.
- The shared no-target conformance case asserts a deferral stamp for Claude and none for a runtime that does not stamp.
- Six wording fixes from the reviews: the README sentence on a missing goal packet, the comment in `readRelaunchFile`, the Stop comment with one test note, `goal_ended` in the handoff command document and one more limitation in the summary of child 010.
- The wrapper compares checksums only when both the start read and the hop read returned one.
- The ended-goal mark is read from the note the session claimed last, and a missing or unreadable session log keeps it.
- A Claude Stop with no transcript path prints one line saying the next prompt withdraws the hop because the transcript was missing.
- The sk-git rebase sentence is rewritten from a throwaway-repository probe, with sk-git at `1.11.12.0` and its changelog entry.
- The Claude playbook, the feature catalog and the handoff command document describe the shipped behavior, eight moved citations in children 004 and 013 name their commit, and the trigger phrase question for an ended goal has a recorded answer.

### Out of Scope
- The Pi, OpenCode, Codex, Cursor and Devin adapters. Children 001 to 003 change Claude Code only. Children from 004 may also change the shared wrapper, the shared relaunch core, tests and documents, and none edits another runtime's adapter.
- A live hop. None was run for any child, and each child records that as a known limitation.
- Other dialogs that hold a turn open, such as a plan approval. The guard matches `AskUserQuestion` only.
- Re-executing a running wrapper between hops. The wrapper says that it changed and the operator restarts it.
- The research changes the operator did not choose: a guard for `ExitPlanMode` or for the question tools of other runtimes, reading the Claude session store for a rename, a Codex goal reader and the other ranked changes of `research/research.md` section 9.
- A new module or a new relaunch record key.
- The review findings that belong elsewhere. One shared resolver for the work's purpose, and an ended goal that returns as the note's purpose, belong to packet `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/`. Moving the deferral stamp into the core so Codex gets it waits for a later packet. A change to what the ended-goal mark matches on was deferred too, until the operator asked on 2026-11-14 for every P0, P1 and P2 finding to be fixed. Child 016 takes it. Matching on the claiming session id stays. The parent goal log holds every disposition.
- Two process findings of the third review round belong to their owners: the findings parser in `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` to local-skilled-alignment, and the deep-review reducer that marks deferred protocols blocked and counts a refinement twice to system-deep-loop. The operator chose "Separate packets (Recommended)".
- The count of test files in `.skilled/hooks/README.md`, which predates this packet.

### Files to Change
Files touched across all phases, for the audit trail. Each child's `plan.md` holds the detail.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modify | 001 | Deny a question dialog over a pending hand-over of this session |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Modify | 001, 006 | One denial test and five pass-through tests, then a pass-through test for a record that names no note |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | 001 | The `AskUserQuestion` PreToolUse binding |
| `.claude/settings.json` | Modify | 001 | Generated from the registry |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | 001 | The new matcher and the denial |
| `.skilled/hooks/README.md` | Modify | 001 | The new matcher in the concern table |
| `.skilled/hooks/session-relaunch/README.md` | Modify | 001, 002, 003, 004, 005, 006, 010, 011, 012, 014, 016, 017 | The new matcher, the goal fallback and the generated title fallback, then the wrapper note, the `deferredAt` stamp, the record with no handoff, the `goal_ended` field and the bound of the fallback, then the `wrapper-changed` log line and the corrected sentence on a missing goal packet, then the claimed-last mark and the missing-transcript notice. Child 015 checks line 112 and edits it only if it is still wrong |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | 002, 003, 006, 010, 011, 014, 016 | The packet goal fallback with its whole-log flag, and the generated title passed through the settings resolver, then the read that rejects a record with no handoff, the `ended` result with the `goal_ended` note field, and the fallback bound, then the comment above the `handoff` check, then the claimed-last mark and the mark on an unreadable log |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | 002, 006, 010, 011, 016 | The fallback test and the ended or unreadable test, then two read tests with four fixtures, three goal-ending tests and one bound test, then two ended-goal mark tests |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | 002, 003, 006, 010 | `prepare` cases for the goal packet and for the recorded name, then one fixture and the `prepare` case for an ended goal one hop later |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | 003 | The settings reader returns the last generated title |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | 003, 010 | `prepare` falls back to the generated title for the name, then `prepare` and `keep` pass the note path and write the ended mark |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modify | 003 | Generated title cases |
| `.skilled/bin/skilled-loop` | Modify | 004, 012, 015 | A checksum of the wrapper file taken before the loop and a stderr note before a hop when it changed, then the `wrapper-changed` log line and no note for an empty checksum, then no note for an empty start checksum |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modify | 004, 012 | The stub can append to the wrapper copy during a run, then make it unreadable |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | 004, 012, 015 | Two tests for the note, then two for the log line and the unreadable file, then one for an empty start checksum with a `cksum` stub |
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | 005, 014, 017 | `markParked` stamps `deferredAt` on the three paths that leave a record pending, then the comment on the missing transcript path, then the notice on that path |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | 005, 006, 014, 017 | Two tests now expect the stamp and one makes the arm throw, then a default note path for the record fixture and a test for a record that names no note, then one test note, then the missing-transcript test expects the notice |
| `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | Modify | 005, 013 | The shared no-target case sets the stamp aside, because Codex Stop does not stamp, then asserts the stamp per runtime |
| `.skilled/commands/speckit/handoff.md` | Modify | 014, 019 | One sentence that `prepare` and `keep` own `goal_ended`, written after `main` is merged, then the goal switch sentence names both fields |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Generated | 014 | Rebuilt after `main` is merged, when the index check exits 1 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` | Modify | 014 | One more limitation: the ended-goal mark is matched on the claiming session id |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modify | 006, 010 | A `handoff` in the record fixture and `ended: false` in one expected result |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modify | 007 | `timeoutMs` 450 to 1000 in the grace-period test |
| `.opencode/plugins/tests/session-history-lookup.test.cjs` | Modify | 008 | The reader's environment drops `OPENCODE_DB` |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` | Modify | 009 | Binding rows for 038 and 039, with shorter D1 and D7 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md` | Modify | 009 | Status and nine phase rows set to Complete |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/goal.md` | Modify | 009 | The criteria the saved evidence proves are ticked |
| `.skilled/skills/sk-git/SKILL.md` | Modify | 009, 018 | A rebase keeps a `Commit-Id` only when the replayed message still carries one, then the sentence rewritten from a probe and version `1.11.12.0` |
| `.skilled/skills/sk-git/changelog/v1.11.12.0.md` | Create | 018 | The changelog entry for the corrected sentence |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md` | Modify | 009 | Two limitation rows the live checks had made stale |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | 009, 019 | `cp` in the HS-8 block and the `deferredAt` stamp in the adapter suite evidence, then "copies" in the HS-8 prose and evidence for the change notice, the ended-goal carry and the missing-transcript notice |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modify | 009 | The Pi mode case and the OpenCode sub-agent and title cases named in the evidence lines |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | 017 | The `stop-arm.mjs` row names the missing-transcript notice |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modify | 019 | The change notice, the `deferredAt` stamp, the missing-transcript notice, the record with no handoff, `goal_ended` and the fallback bound |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/acceptance-criteria.md` | Modify | 018 | A dated note on AC-004 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice/acceptance-criteria.md` and five documents of `013-conformance-stamp-pin/` | Modify | 019 | Eight moved citations name the commit they were observed at |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sender-dialog-after-prepare/ | The Claude PreToolUse guard refuses a question dialog while this session's hand-over is pending, so the turn ends and the Stop hook can arm the hop | Complete |
| 2 | 002-packet-goal-fallback/ | A Claude sender whose whole session log holds no goal entry hands on the nearest unfinished packet goal in the note's spec folder lineage, so the receiver starts on it | Complete |
| 3 | 003-generated-title-carry/ | `prepare` records the title Claude generated as the session name when there is no renamed title and no launch name, so the receiver keeps it with the hop count | Complete |
| 4 | 004-wrapper-change-notice/ | A running wrapper prints one note on stderr before a hop when its own file changed after the loop started, so the operator knows to restart it | Complete |
| 5 | 005-parked-record-escape/ | A Claude Stop that cannot arm a pending hand-over stamps the record, so the operator's next prompt withdraws it and question dialogs work again | Complete |
| 6 | 006-record-without-handoff/ | A relaunch record with no `handoff` string is read as absent, so the guard and Stop no longer act on a hand-over that has no note | Complete |
| 7 | 007-killer-test-margin/ | The killer grace-period test gets a 1000 ms deadline in place of 450 ms, after the failure was reproduced under load | Complete |
| 8 | 008-history-test-database-env/ | The history lookup test no longer inherits `OPENCODE_DB` from the shell | Complete |
| 9 | 009-document-corrections/ | Five document fixes: two binding rows in the 002 parent goal, phase 033 set to Complete, the sk-git rebase sentence, two stale limitation rows in the summary of 038 child 011, and the playbook case names with `cp` in HS-8 | Complete |
| 10 | 010-goal-ending-carry/ | A Claude goal that was met, failed or cleared is marked in the note and stays ended for a receiver that sets no goal | Complete |
| 11 | 011-goal-fallback-bound/ | The packet goal fallback considers the note's folder and its parent and no packet further up | Complete |
| 12 | 012-wrapper-notice-log/ | The wrapper appends one `wrapper-changed` line to `relaunch.log` when it prints the change note, and prints and logs nothing when its file cannot be read at the hop | Complete |
| 13 | 013-conformance-stamp-pin/ | The shared conformance case for a Stop that cannot arm asserts a deferral stamp for Claude and none for a runtime that does not stamp | Complete |
| 14 | 014-review-wording-fixes/ | Six wording fixes: the README sentence on a missing goal packet, the comment in `readRelaunchFile`, the Stop comment with one test note, `goal_ended` in the handoff command document and one more limitation in the summary of child 010 | Pending |
| 15 | 015-wrapper-start-checksum/ | The wrapper reports a change of its own file only when it read a checksum at loop start and at the hop, tested with a `cksum` stub that fails on its first call | Planned |
| 16 | 016-ended-goal-mark-match/ | The ended-goal mark is read from the note a session claimed last, and a missing or unreadable session log keeps it | Planned |
| 17 | 017-missing-transcript-notice/ | A Claude Stop with no transcript path prints one line saying the next prompt withdraws the hop because the transcript was missing | Planned |
| 18 | 018-sk-git-rebase-sentence/ | The sk-git rebase sentence is rewritten from a throwaway-repository probe, and sk-git moves to `1.11.12.0` with a changelog entry | Planned |
| 19 | 019-relaunch-doc-coverage/ | The Claude playbook, the feature catalog and the handoff command document describe the shipped behavior, eight moved citations name their commit, and the trigger phrase question is answered | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sender-dialog-after-prepare | 002-packet-goal-fallback | Phase 001 is Complete and the relaunch and OpenCode plugin suites pass | `validate.sh 001-sender-dialog-after-prepare --strict` RESULT: PASSED and no row of `001-sender-dialog-after-prepare/acceptance-criteria.md` is Unmet |
| 002-packet-goal-fallback | 003-generated-title-carry | Phase 002 is Complete and the relaunch, OpenCode plugin and goal hook suites pass | `validate.sh 002-packet-goal-fallback --strict` RESULT: PASSED and no row of `002-packet-goal-fallback/acceptance-criteria.md` is Unmet |
| 003-generated-title-carry | 004-wrapper-change-notice | Phase 003 is Complete and merged, and the 2026-11-13 research names the open ends the operator chose | `validate.sh 003-generated-title-carry --strict` RESULT: PASSED, and `research/research.md` sections 9 and 10 hold the ranked changes and the decisions |
| 004-wrapper-change-notice | 005-parked-record-escape | Phase 004 is Complete and the relaunch and OpenCode plugin suites pass | `validate.sh 004-wrapper-change-notice --strict` RESULT: PASSED and no row of `004-wrapper-change-notice/acceptance-criteria.md` is Unmet |
| 005-parked-record-escape | 006-record-without-handoff | Phase 005 is Complete and the relaunch and OpenCode plugin suites pass, because both change `claude-adapters.test.cjs` | `validate.sh 005-parked-record-escape --strict` RESULT: PASSED and no row of `005-parked-record-escape/acceptance-criteria.md` is Unmet |
| 006-record-without-handoff | 007-killer-test-margin | Phase 006 is Complete and the relaunch and OpenCode plugin suites pass | `validate.sh 006-record-without-handoff --strict` RESULT: PASSED and no row of `006-record-without-handoff/acceptance-criteria.md` is Unmet |
| 007-killer-test-margin | 008-history-test-database-env | Phase 007 is Complete and the relaunch and OpenCode plugin suites pass | `validate.sh 007-killer-test-margin --strict` RESULT: PASSED and no row of `007-killer-test-margin/acceptance-criteria.md` is Unmet |
| 008-history-test-database-env | 009-document-corrections | Phase 008 is Complete. Phase 009 changes documents only and was written after the code of 010 and 011, because one of its lines describes the stamp of phase 005 | `validate.sh 008-history-test-database-env --strict` RESULT: PASSED and no row of `008-history-test-database-env/acceptance-criteria.md` is Unmet |
| 009-document-corrections | 010-goal-ending-carry | Phase 008 is Complete and the relaunch and OpenCode plugin suites pass. Phase 010 depends on no document of phase 009 | `validate.sh 008-history-test-database-env --strict` RESULT: PASSED and no row of `008-history-test-database-env/acceptance-criteria.md` is Unmet |
| 010-goal-ending-carry | 011-goal-fallback-bound | Phase 010 is Complete and the relaunch and OpenCode plugin suites pass, because both change the no-goal-entry path of `relaunch-core.cjs` | `validate.sh 010-goal-ending-carry --strict` RESULT: PASSED and no row of `010-goal-ending-carry/acceptance-criteria.md` is Unmet |
| 011-goal-fallback-bound | 012-wrapper-notice-log | Phase 011 is Complete, and the two reviews of 2026-11-14 have a disposition for every finding in the goal log | `validate.sh 011-goal-fallback-bound --strict` RESULT: PASSED and no row of `011-goal-fallback-bound/acceptance-criteria.md` is Unmet |
| 012-wrapper-notice-log | 013-conformance-stamp-pin | Phase 012 is Complete and the relaunch and OpenCode plugin suites pass. Phase 013 depends on no file of phase 012 | `validate.sh 012-wrapper-notice-log --strict` RESULT: PASSED and no row of `012-wrapper-notice-log/acceptance-criteria.md` is Unmet |
| 013-conformance-stamp-pin | 014-review-wording-fixes | Phase 013 is Complete, the relaunch and OpenCode plugin suites pass and `claude/stop-arm.mjs` equals `HEAD`, because phase 013 edits it for a proof and phase 014 edits its comment | `validate.sh 013-conformance-stamp-pin --strict` RESULT: PASSED and no row of `013-conformance-stamp-pin/acceptance-criteria.md` is Unmet |
| 014-review-wording-fixes | 015-wrapper-start-checksum | Phase 014 is Complete, the third review round has a disposition for every finding in the goal log, and the operator picked the workspace | `validate.sh 014-review-wording-fixes --strict` RESULT: PASSED and no row of `014-review-wording-fixes/acceptance-criteria.md` is Unmet |
| 015-wrapper-start-checksum | 016-ended-goal-mark-match | Phase 015 is Complete and the relaunch and OpenCode plugin suites pass. Phase 016 depends on no file of phase 015 | `validate.sh 015-wrapper-start-checksum --strict` RESULT: PASSED and no row of `015-wrapper-start-checksum/acceptance-criteria.md` is Unmet |
| 016-ended-goal-mark-match | 017-missing-transcript-notice | Phase 016 is Complete and the relaunch and OpenCode plugin suites pass, because both change the session-relaunch README | `validate.sh 016-ended-goal-mark-match --strict` RESULT: PASSED and no row of `016-ended-goal-mark-match/acceptance-criteria.md` is Unmet |
| 017-missing-transcript-notice | 018-sk-git-rebase-sentence | Phase 017 is Complete and the relaunch and OpenCode plugin suites pass. Phase 018 depends on no file of phase 017 | `validate.sh 017-missing-transcript-notice --strict` RESULT: PASSED and no row of `017-missing-transcript-notice/acceptance-criteria.md` is Unmet |
| 018-sk-git-rebase-sentence | 019-relaunch-doc-coverage | Phases 015 to 018 are Complete, because phase 019 documents what 015 to 017 ship | `validate.sh --strict` RESULT: PASSED for each of children 015 to 018 and no row of their `acceptance-criteria.md` is Unmet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does each fix hold in a live hop? No live hop was run for any child. Each rests on unit and CLI tests, and each child's known limitations name what a live run would confirm.
- Do Pi, OpenCode or Codex hold a prepared hand-over open behind a dialog the same way? The research found that each has a question tool and none is guarded. The operator did not choose that change.
- Does a wrapper started after the name-carry code landed pass `--name` to its receiver? The first live check is still open: restart one wrapper, rename the session, hand over once and read the receiver's command line.
- Does `goal_ended` stay a note field? Review B asks the operator to decide before the merge, because a note that carries the field is a surface later code must keep reading. The operator approved it as "Goal continuity" on 2026-11-14 and no child changes it. Answered by the operator on 2026-11-14: "Keep it (Recommended)".
- May `main` be merged into this branch before the document commit? Both reviews recommend the merge. Review A puts it before the document commit, review B after. Child 014 takes B's order. Answered by the operator on 2026-11-14: "Merge before building (Recommended)". `main` is merged into this branch before children 012 to 014 are built. The merge is commit `be56fabc7b`, and `git merge-base --is-ancestor main HEAD` exits 0 there.
- Why did 16 picks of one rebase on 2026-11-13 keep their `Commit-Id` when 106 others did not? Not known. Child 018 reads that rebase's reflog.
- Under research: close the gaps, unknowns and open ends of packets `038-goal-and-workflow-resume` and `039-hop-dialog-goal-title` of the session relaunch loop. Find what a Claude `/rename` made in the mobile app writes and whether a hop can carry it, check each recorded known limitation of both packets against the code, name the smallest set of live runs that proves the fixes not yet run live, explain the open packet-level and parent-level items, and name the smallest change for each gap that survives.

**Research Context:** a deep-research run covered the topic above on 2026-11-13. `research/research.md` is the canonical source for its findings.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings of the 2026-11-13 deep-research run, abridged from `research/research.md`. The ten iterations ran nothing against a live runtime. One finding rests on what the orchestrating session observed about its own hop.

- Every relaunch wrapper running on 2026-11-13 started before the name-carry code landed in `.skilled/bin/skilled-loop`, and a wrapper runs the code it started with. No session those wrappers launched has a `--name` flag. The cause is inferred. One hop from a freshly started wrapper confirms or refutes it.
- `prepare` reads a Claude name from the transcript only. Claude keeps a second title store under `~/.claude/sessions` that no relaunch code reads. What a rename in the mobile app writes is unconfirmed.
- A hop is a new session in the app. Whether the app title follows `--name`, and whether a replayed `--remote-control <old name>` outranks it, is unconfirmed.
- Child 001: a pending record that Stop cannot arm blocks every question until `cancel`, except after a background-task deferral. `ExitPlanMode` and permission prompts are not guarded. A record with no `handoff` is treated as pending. Pi, OpenCode and Codex have no guard.
- Child 002: a goal cleared by hand comes back one hop later, and the fallback can pick any ancestor with an open criterion.
- Child 003: a generated title that ends in the sender's own hop number loses that number.
- Packet 038: each of its 49 recorded limits has a verdict. Five are refuted, among them two stale rows in the summary of child 011.
- Parent level: the 002 parent goal binds neither 038 nor 039 and has seven characters left. Phase 033 says Draft while its nine children say Complete. The sk-git sentence that a rebase keeps a `Commit-Id` is wrong.
- Ten shipped fixes or groups of fixes have no live hop behind them. Six live runs close what a live run can close.
- These changes fall outside this packet's frozen scope. `research/research.md` section 9 ranks 23 of them and section 10 names five operator decisions.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
