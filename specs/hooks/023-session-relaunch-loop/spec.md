---
title: "Feature Specification: Session relaunch loop"
description: "This packet defines a phased relaunch loop for CLI sessions near the context limit. Auto-compaction settings stay unchanged and compaction remains the fallback when a hop fails."
trigger_phrases:
  - "session relaunch loop"
  - "auto-handoff near the context limit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Session relaunch loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | worktrees/148-session-relaunch-deep-review |
| **Parent Spec** | None |
| **Parent Packet** | specs/hooks/023-session-relaunch-loop |
| **Predecessor** | 022-smart-rule-injection |
| **Successor** | None |
| **Handoff Criteria** | All nine children are Complete, recursive strict validation reports RESULT: PASSED, the Claude live relaunch is proven and every drift gate is at baseline or better. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A session near the context limit needs to write a handoff note, end and restart in the same terminal. The operator wants the Skilled repo to own this behavior as a hook and command across its CLI runtimes.

### Purpose
The nine child phases define a runtime-neutral core, the runtime-specific triggers and commands, and the evidence needed to close the work. The overall outcome is a Claude relaunch at 80% with auto-compaction unchanged as the fallback when a hop fails.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 001 builds the Claude relaunch path at 80%, including the shared core, Claude hooks, wrapper, handoff command, tests, documentation and live run.
- Phase 002 verifies Pi and OpenCode events and adds automatic triggers only where the spike supports them.
- Phase 003 verifies Codex, Cursor, Devin and Hermes entry points and uses the command trigger unless a spike confirms an automatic event.
- Phase 004 reviews the combined changes, updates the cross-phase docs, runs final live checks and closes the packet.
- Phase 005 fixes the twelve P2 advisories the deep review left, aligns the new code with the sk-code-opencode checklists and refreshes the docs the fixes touch.
- Phase 006 fixes what the second deep review finds against the closed phases, aligns the touched code with the sk-code-opencode checklists and refreshes the docs those fixes change.
- Phase 007 lets a session with no Gate 3 answer write its handoff note without an operator prompt, and pins the OpenCode default model.
- Phase 008 fixes the fifteen findings of the third deep review, a DeepSeek and Luna fan-out run after phase 007.
- Phase 009 fixes the verified findings of the DeepSeek and Luna research run after phase 008, moves the decisions every adapter repeats into the shared core and adds an adapter conformance suite.
- Phases 24 to 28 keep the session goal across a hand-over: four probes settle what Claude, Codex and Hermes allow, the note and launcher carry the sender's goal packet, every runtime binds or requests the goal in the receiver, and live hops prove it.
- Phase 29 captures the thin live evidence the phase 23 runs left and corrects two playbook lines that disagree with a run.

### Out of Scope
- Changing autoCompactEnabled or autoCompactWindow.
- Adding resume flags to the wrapper.
- Editing existing hooks beyond the registry rows and documentation updates named by each phase.
- Supporting runtimes beyond Claude, Pi, OpenCode, Codex, Cursor, Devin and Hermes.
- Committing, pushing or merging.

### Files to Change
This is a phase-level file summary. Each child plan owns the detailed file list.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| .skilled/hooks/session-relaunch/, .skilled/bin/skilled-loop, .skilled/commands/speckit/handoff.md, hook-registry.json and generated Claude settings rows | Create and modify | 001-claude-relaunch-loop | Shared core, Claude hooks, wrapper, handoff command, tests and Claude documentation. |
| .skilled/hooks/session-relaunch/pi/, session-relaunch/opencode/, .pi/extensions/, OpenCode plugin files and wrapper case arms | Create and modify | 002-pi-opencode-adapters | Pi and OpenCode adapters, verified wrapper arms and runtime documentation. |
| .skilled/bin/skilled-loop runtime arms, verified adapters, registry rows and command mirrors | Modify | 003-command-trigger-runtimes | Codex, Cursor, Devin and Hermes entry points based on spike evidence. |
| Root README, system-spec-kit README, catalog and playbook indexes | Modify | 004-integration-review-and-docs-closure | Cross-phase doc rollup, review and closure evidence. |
| .skilled/hooks/session-relaunch/lib/ and its adapter folders, their tests, .skilled/bin/skilled-loop, the session-relaunch READMEs, the plugins-and-hooks playbook page, the Pi Fast Mode extension and the sk-doc README checklist script | Create and modify | 005-deep-review-remediation | Advisory fixes with one test per code finding, shared adapter helpers, a balanced Skip suffix and the docs the fixes change. |
| .skilled/hooks/session-relaunch/lib/, bin/, pi/, claude/, codex/, hermes/, opencode plugin, their tests, the hook registry, .claude/settings.json, .codex/hooks.json, the sk-doc version check, the session-relaunch READMEs, the env reference, the three plugins-and-hooks playbook pages, the feature catalog and the two benchmark run folders | Create and modify | 006-deep-review-2-remediation | Fixes for the second deep review's twelve findings, the code alignment pass, the live-playbook gaps G1 to G25, the docs those fixes change and the dated live-run records. |
| The spec-gate core and its test, the spec-gate README, AGENTS.md, opencode.json, the session-relaunch playbooks and one benchmark run folder | Modify | 007-handoff-gate-exemptions | The runtime-state exemption in the spec gate and in the Gate 2 and Gate 3 sentences, the OpenCode default model and the run-10 live records. |
| .skilled/hooks/session-relaunch/lib/ and its tests, the handoff command, the env reference, the phase 002, 006 and 007 records, the run-10 benchmark folder and this parent's spec and goal | Modify | 008-review-3-remediation | Code fixes with a test each, the doc corrections the third review found and the parent's seven-to-eight phase update. |
| .skilled/hooks/session-relaunch/lib/, bin/, claude/, codex/, hermes/, pi/, the OpenCode plugin, .skilled/bin/skilled-loop, their tests and the new adapter conformance suite, the session-relaunch READMEs, the handoff command, the env reference, the feature catalog entry, the phase 002 record, the research folder and this parent's spec and goal | Create and modify | 009-research-fixes-and-core-consolidation | Research fixes with a failing-first test each, shared nudge and kill-target helpers in the core, the conformance suite, the doc drift the research found and the parent's eight-to-nine phase update. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-claude-relaunch-loop/ | Claude session hops at 80%, with auto-compaction untouched as the fallback. | complete |
| 2 | 002-pi-opencode-adapters/ | Automatic triggers for Pi and OpenCode where verified, using the shared core. | complete |
| 3 | 003-command-trigger-runtimes/ | Codex, Cursor, Devin and Hermes enter the loop by command unless a spike confirms an automatic event. | complete |
| 4 | 004-integration-review-and-docs-closure/ | Cross-phase review, doc rollup, final live runs and closure. | complete |
| 5 | 005-deep-review-remediation/ | Fix the twelve P2 advisories from the deep review, align the new code with sk-code-opencode and refresh the docs it touches. | complete |
| 6 | 006-deep-review-2-remediation/ | Fix what the second deep review finds against the closed phases, align the touched code with the sk-code-opencode checklists and refresh the docs the fixes change. | complete |
| 7 | 007-handoff-gate-exemptions/ | Runtime-state handoff notes pass the spec gate and stay out of Gate 2 and Gate 3, and the OpenCode default model is pinned. | complete |
| 8 | 008-review-3-remediation/ | Fix the fifteen findings of the third deep review: five code fixes with tests, two adapter test gaps and the doc and evidence records that claimed more than they showed. | complete |
| 9 | 009-research-fixes-and-core-consolidation/ | Fix the verified research findings with a failing-first test each, move the decisions every adapter repeats into the core, add an adapter conformance suite and correct the doc drift. | complete |
| 10 | 010-post-fix-research/ | Five more research iterations after phase 009, DeepSeek V4.1 Flash max through cli-pi on LLM Gateway, with each finding verified. | complete |
| 11 | 011-post-fix-remediation/ | Fix all twenty post-fix research findings, the two frontier items and the follow-ups, with failing-first tests and arm conformance cases. | complete |
| 12 | 012-ci-red-check-repairs/ | AGENTS.md is back inside the 16 KB delivery prefix, and the session-relaunch example line no longer reads as a switch, so Rule Canary Sync and sk-doc Script Tests pass again locally. | complete |
| 13 | 013-live-hop-and-notice-reason/ | The killer's notice names the timeout and an ignored template's reason, the nudge fires only inside `skilled-loop`, and a shell shim starts every interactive runtime under the loop, also in repositories that link `.skilled`. | complete |
| 14 | 014-handover-docs-promotion/ | The root README introduces the in-session handover in plain words with a one-line setup section, the command library lists `/speckit:handoff`, and the other doc surfaces link the setup and keep the handoff note apart from `handover.md`. | complete |
| 15 | 015-v4-0-0-13-changelog/ | The v4.0.0.13 global Skilled release entry, Sessions That Hand Themselves Over, leads with the in-session handover and also covers OpenCode 1 and 2 dual compatibility and the breaking `sk-code-skilled` rename. | complete |
| 16 | 016-handover-trigger-review/ | The `/speckit:handoff` doc follows the sk-create-command template, and a ten-iteration deep review checks whether the automatic handover fires every time on Claude, Pi, OpenCode, Codex and Hermes, then fixes what it confirms and proves live hops again. | complete |
| 17 | 017-hop-history/ | Every hop writes `handed-over`, `claimed`, `done` or `timed-out` lines to a gitignored hop history; `session-relaunch.cjs history` and `/doctor:setup` show it, and `SESSION_RELAUNCH_NOTIFY_HOPS` adds an opt-in macOS notice per hand-over. | complete |
| 18 | 018-outside-loop-handoff/ | A session outside `skilled-loop` keeps a handoff note with `session-relaunch.cjs keep` instead of hearing nothing, Claude Code points it back at the note after a compaction, and `history` and `/doctor:setup` name every note nobody claimed. | complete |
| 19 | 019-fork-compact-pointer-research/ | [Phase 19 scope] | Pending |
| 20 | 020-fork-session-guards/ | [Phase 20 scope] | Pending |
| 21 | 021-fork-nudge-and-precompact-guards/ | [Phase 21 scope] | Pending |
| 22 | 022-runtime-certainty-claude-pi-opencode/ | Live certification of S1 to S13 on Claude, Pi and OpenCode, with the defects it found fixed test-first | Complete |
| 23 | 023-relaunch-cancel-and-test-isolation/ | Test isolation from the loop environment, withdraw or cancel of a prepared hand-over, and a hop line written only when the wrapper relaunches | Complete |
| 24 | 024-goal-rebind-claude-codex-hermes-probes/ | Run four recorded probes with controls: Claude start prompt as a command, a Claude start hook sending `/goal`, a Codex goal from seed or hook context, and Hermes with `HERMES_SPEC_FOLDER`, then name the phase 27 path | Complete |
| 25 | 025-goal-binding-record-and-launcher/ | The hand-over note records the sender's goal packet, claim and `skilled-loop` pass it to the receiver, and `SESSION_RELAUNCH_GOAL=0` turns it off | Complete |
| 26 | 026-goal-rebind-shared-core-and-opencode/ | Pi, Devin, Cursor, Hermes and OpenCode bind the hand-over goal packet on the first turn when they have no goal of their own | Complete |
| 27 | 027-goal-rebind-claude-and-codex/ | A Claude or Codex receiver sets the hand-over goal from `goal.md` on the path phase 24 proved, within the 4,000-character slice limit, or asks for the fenced slice | Complete |
| 28 | 028-goal-rebind-live-proof-and-docs/ | Live hops show the goal surviving a hand-over on Claude and Pi with switch-off and no-goal controls, a Codex no-goal control, and the receiver half on OpenCode 2 and Devin; the OpenCode 2 hop failed at first and passed after phase 30, Devin and Cursor have no hop path, Cursor and Hermes were skipped; playbook scenarios and doc updates landed | Complete |
| 29 | 029-relaunch-evidence-gaps-and-playbook-drift/ | Capture the thin Codex and Claude live evidence, find the cause of the Claude nudge retry, record a Pi baseline and correct two playbook lines that disagree with a run | Complete |
| 30 | 030-opencode2-killer-target/ | An OpenCode 2 hop reaches its receiver: the killer signals the loop's child instead of the plugin's server, a signalled exit 130 counts as the hop, and the post-signal grace covers a slow TUI exit | Complete |
| 31 | 031-relaunch-model-and-effort/ | A relaunched session starts on the sender's model and effort on every runtime that takes them at launch, from the launch flags or the sender's current state | Complete |
| 32 | 032-opencode2-standalone-replay/ | The wrapper starts OpenCode 2 with `--standalone` on the first launch and every relaunch and drops the `-m` replay it rejects, so the loop hops more than once with no flag to remember | Complete |

### Phase Transition Rules

- Each phase must pass strict validation independently before the next phase begins.
- This map tracks aggregate phase progress.
- Use /speckit:resume with the selected child path to resume a phase.
- Run recursive strict validation on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-claude-relaunch-loop | 002-pi-opencode-adapters | the from-phase is Done per plan section 7 (all its AC seeds Met, gate PG passed) | validate.sh <child> --strict RESULT: PASSED plus its acceptance-criteria.md rows Met |
| 002-pi-opencode-adapters | 003-command-trigger-runtimes | the from-phase is Done per plan section 7 (all its AC seeds Met, gate PG passed) | validate.sh <child> --strict RESULT: PASSED plus its acceptance-criteria.md rows Met |
| 003-command-trigger-runtimes | 004-integration-review-and-docs-closure | the from-phase is Done per plan section 7 (all its AC seeds Met, gate PG passed) | validate.sh <child> --strict RESULT: PASSED plus its acceptance-criteria.md rows Met |
| 004-integration-review-and-docs-closure | 005-deep-review-remediation | the deep review of the closed phases has a report with a finding registry | `review-archive/20261018T184826Z/review-report.md` exists with verdict and registry |
| 005-deep-review-remediation | 006-deep-review-2-remediation | the second deep review has a report with a finding registry | `review-archive/20261019T144809Z/review-report.md` exists with verdict and registry |
| 006-deep-review-2-remediation | 007-handoff-gate-exemptions | phase 006 is Complete, and its live runs recorded the Gate 3 and sk-doc prompts G20 and G21 that phase 007 removes | `validate.sh 006-deep-review-2-remediation --strict` RESULT: PASSED, and G20 and G21 are in the 006 implementation summary |
| 007-handoff-gate-exemptions | 008-review-3-remediation | phase 007 is Complete and the third deep review has a report with a finding registry | `validate.sh 007-handoff-gate-exemptions --strict` RESULT: PASSED, and `review/review-report.md` exists with verdict and registry |
| 008-review-3-remediation | 009-research-fixes-and-core-consolidation | phase 008 is Complete and the research run after it has a merged report with a verification table | `validate.sh 008-review-3-remediation --strict` RESULT: PASSED, and `research/research.md` exists with its verified findings |
| 009-research-fixes-and-core-consolidation | 010-post-fix-research | phase 009 is Complete and merged to main | `validate.sh 009-research-fixes-and-core-consolidation --strict` RESULT: PASSED |
| 010-post-fix-research | 011-post-fix-remediation | phase 010 is Complete with a verified report | `research/research.md` in 010 gives every finding a verdict |
| 007-handoff-gate-exemptions | 012-ci-red-check-repairs | 007's AGENTS.md and hook-flags example changes are on main | The rule canary and the sk-doc script tests pass locally |
| 011-post-fix-remediation | 013-live-hop-and-notice-reason | phase 011 is Complete and lists the notice reason and the live hop as Known Limitations | `validate.sh 011-post-fix-remediation --strict` RESULT: PASSED |
| 013-live-hop-and-notice-reason | 014-handover-docs-promotion | phase 013 is Complete with live hops recorded for all five automatic runtimes | `validate.sh 013-live-hop-and-notice-reason --strict` RESULT: PASSED |
| 014-handover-docs-promotion | 015-v4-0-0-13-changelog | phase 014 is Complete with the in-session handover documented in the root README and the other doc surfaces | `validate.sh 014-handover-docs-promotion --strict` RESULT: PASSED |
| 015-v4-0-0-13-changelog | 016-handover-trigger-review | phase 015 is Complete with the v4.0.0.13 release entry validated | `validate.sh 015-v4-0-0-13-changelog --strict` RESULT: PASSED |
| 016-handover-trigger-review | 017-hop-history | phase 016 is Complete with the review findings fixed and live hops re-proven | `validate.sh 016-handover-trigger-review --strict` RESULT: PASSED |
| 017-hop-history | 018-outside-loop-handoff | phase 017 is Complete with the hop history recorded and readable | `validate.sh 017-hop-history --strict` RESULT: PASSED |
| 018-outside-loop-handoff | 019-fork-compact-pointer-research | [Criteria TBD] | [Verification TBD] |
| 019-fork-compact-pointer-research | 020-fork-session-guards | [Criteria TBD] | [Verification TBD] |
| 020-fork-session-guards | 021-fork-nudge-and-precompact-guards | [Criteria TBD] | [Verification TBD] |
| 021-fork-nudge-and-precompact-guards | 022-runtime-certainty-claude-pi-opencode | [Criteria TBD] | [Verification TBD] |
| 022-runtime-certainty-claude-pi-opencode | 023-relaunch-cancel-and-test-isolation | Phase 22 live matrix closed | 022 acceptance-criteria.md all rows Met, Waived or Superseded |
| 023-relaunch-cancel-and-test-isolation | 024-goal-rebind-claude-codex-hermes-probes | Phase 23 is Complete and the operator asked for goal persistence across a hand-over | `validate.sh 023-relaunch-cancel-and-test-isolation --strict` RESULT: PASSED |
| 024-goal-rebind-claude-codex-hermes-probes | 025-goal-binding-record-and-launcher | None. Phase 25 needs no probe verdict, so the two can run side by side | Phase 25 baseline gate recorded |
| 025-goal-binding-record-and-launcher | 026-goal-rebind-shared-core-and-opencode | Phase 25 is Complete and the launcher hands the packet to the receiver | `validate.sh 025-goal-binding-record-and-launcher --strict` RESULT: PASSED, and the relaunch gate is at or above its baseline |
| 026-goal-rebind-shared-core-and-opencode | 027-goal-rebind-claude-and-codex | Phases 24 and 25 are Complete, so the probe verdicts pick the Claude and Codex path | `024` implementation summary holds a verdict per probe and names the phase 27 path |
| 027-goal-rebind-claude-and-codex | 028-goal-rebind-live-proof-and-docs | Phases 25 to 27 are Complete | `validate.sh` strict RESULT: PASSED for each, and the goal suites at their baselines |
| 023-relaunch-cancel-and-test-isolation | 029-relaunch-evidence-gaps-and-playbook-drift | Phase 23 is Complete and its live runs recorded the four evidence gaps and two playbook lines | The gaps are listed in the 023 implementation summary |
| 028-goal-rebind-live-proof-and-docs | 030-opencode2-killer-target | Phase 28 recorded the OpenCode 2 hop as Unmet with its run evidence | `028` AC-009 names the failed run and the inferred cause |
| 030-opencode2-killer-target | 031-relaunch-model-and-effort | Phase 30 is Complete and committed, because both change `skilled-loop` | `validate.sh 030-opencode2-killer-target --strict` RESULT: PASSED |
| 030-opencode2-killer-target | 032-opencode2-standalone-replay | Phase 30 is pushed, and its live hop relied on a PATH shim that added `--standalone` | The 030 harness `run-hop.sh` holds the shim |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Do pre-commit and CI run sync checks with --check?
- Do the Pi and OpenCode spikes verify their usage events, nudge APIs, arm events and interactive seed and name flags well enough for an AUTO verdict?
- What interactive seed syntax, Stop or sessionEnd events and command mirror forms do the Codex, Cursor, Devin and Hermes spikes verify, and which verdict does each runtime receive?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Phase 001: 001-claude-relaunch-loop/spec.md, plan.md and tasks.md
- Phase 002: 002-pi-opencode-adapters/spec.md and plan.md
- Phase 003: 003-command-trigger-runtimes/spec.md and plan.md
- Phase 004: 004-integration-review-and-docs-closure/spec.md and plan.md
- Phase 005: 005-deep-review-remediation/spec.md and plan.md
- Phase 006: 006-deep-review-2-remediation/spec.md and plan.md
