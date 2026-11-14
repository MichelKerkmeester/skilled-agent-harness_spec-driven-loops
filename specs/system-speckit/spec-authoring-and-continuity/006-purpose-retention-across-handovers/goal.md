---
title: "Goal: Keep a packet's core purpose across handovers and compactions"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers"
    last_updated_at: "2026-11-14T08:40:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Keep a packet's core purpose across handovers and compactions

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A packet's purpose, the reason the work exists and whom it serves, is shown to the next AI after a resume, a relaunch, a compaction and a continuity save, and each of the four has been seen working in a real session.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every hop carries one sentence, the first sentence of the packet's purpose in its spec.md, cut at 300 characters, labelled `Purpose:`, `Parent purpose (<repo-relative folder>):` or `Goal objective:`. |
| D2 | The purpose reader is widened to the shapes live specs use; the specs are not rewritten to fit the reader. |
| D3 | The Problem Statement's first sentence is carried on the compaction hop only. |
| D4 | Phases 006 to 011 are built in number order, one at a time, by DeepSeek V4.1 Flash at max through cli-deepseek-harness, and each is checked and committed on `worktrees/374-purpose-carry-follow-ups` before the next starts. |
| D5 | Pushing to origin and merging to main each need a fresh operator yes. |
| D6 | A purpose after a compaction on Devin and OpenCode is deferred to a later phase and is not part of this goal. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-parent-purpose-scaffold | `001-parent-purpose-scaffold/goal.md` |
| 002-resume-purpose-row | `002-resume-purpose-row/goal.md` |
| 003-relaunch-goal-quote | `003-relaunch-goal-quote/goal.md` |
| 004-compaction-purpose-line | `004-compaction-purpose-line/goal.md` |
| 005-continuity-purpose-field | `005-continuity-purpose-field/goal.md` |
| 006-purpose-carry-follow-ups | `006-purpose-carry-follow-ups/goal.md` |
| 007-purpose-reader-coverage | `007-purpose-reader-coverage/goal.md` |
| 008-hop-purpose-rule-parity | `008-hop-purpose-rule-parity/goal.md` |
| 009-compaction-purpose-folder | `009-compaction-purpose-folder/goal.md` |
| 010-problem-sentence-carry | `010-problem-sentence-carry/goal.md` |
| 011-empty-parent-purpose-backfill | `011-empty-parent-purpose-backfill/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh --strict --recursive` on this packet prints `RESULT: PASSED` for the parent and all eleven children
- [ ] `rg -l -F 'Keep parent documentation lean' specs -g spec.md -g '!**/z_archive/**'`, run outside this packet, prints no file
- [ ] The vitest files `packet-purpose`, `hook-precompact`, `hook-session-start` and `history-locator-adapters` pass with 0 failed, and the relaunch suite run without `AI_SESSION_CHILD` prints `fail 0`
- [ ] The phase 011 check script prints `own purpose: 21 of 21`
- [ ] The commits for phases 006 to 011 are on origin/main
- [ ] A real operator session has shown the purpose line after each of a `/speckit:resume`, a relaunch, a compaction and a continuity save, each recorded in the log below with its session id
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
| Phases 001 to 005 built | Done | `eaba5ab89e`, `3d237cd97a`, `f0d8c03036`, `0837fcd5a2`, `191ce39bad` on origin/main |
| Remediation plan 006 to 011 | Planned | Reviewed and verified by Fable 5.2 high on 2026-11-14, fixes applied in worktree 374 |
| Live continuity save | Done | Two continuity records under 002 and 006 hold a correct purpose line, per the 2026-11-14 review |
| Live relaunch | Pending | The 2026-11-14 relaunch note opened its Goal with the Purpose line, not yet recorded with its session id |
| Remediation plan 006-011 and goals | Done | committed 9c9dd544a9, recursive strict 12 of 12 PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 008 relaunch baseline | With `AI_SESSION_CHILD=1` the relaunch suite prints 957 of 1014, because the hook turns itself off in a child session. 008 runs it with `env -u AI_SESSION_CHILD` |
<!-- /ANCHOR:log -->
