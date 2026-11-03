---
title: "Feature Specification: Decision capture series"
description: "Series parent for automatic operator decision capture: the finished build in 001 and five follow-up children that close its known gaps and prove it in a live, multi-turn conversation."
trigger_phrases:
  - "decision capture phase parent spec"
  - "decision capture series"
  - "decision capture follow-up"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture"
    last_updated_at: "2026-11-01T21:30:00Z"
    last_updated_by: "series-planner"
    recent_action: "Planned children 002 to 006 and recorded the operator's layout, goal and live-test decisions"
    next_safe_action: "Build 006 once sk-doc/065 ships the runner"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-043-decision-capture"
      parent_session_id: null
    completion_pct: 17
    open_questions: []
    answered_questions: []
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

# Feature Specification: Decision capture series

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | None. The track folder `specs/system-speckit/` holds no `spec.md` |
| **Parent Packet** | system-speckit/043-decision-capture |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child in the phase map is Complete, `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED` for every folder, and the 006 runtime matrix has a filled row for each of Claude Code, OpenCode, Codex, Pi and Devin |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The artifact this series changes is the automatic operator decision capture pipeline: the capture core and runtime adapters under `.skilled/hooks/decision-capture/`, the save-time sweeps in its `bin/`, and the decision-record writer at `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` that a full-auto `/speckit:save` calls. Child 001 built it and shipped it. Its Known Limitations leave four gaps: a hand-written decision table is never matched, so its answers stay pending and the Stop hook keeps nudging; Codex and Pi capture nothing; OpenCode and Devin are read only at save time, and OpenCode's newest storage layout has no real sample; and a plain chat question counts only when it ends the assistant message. 001's playbook evidence was fixture-based, single-prompt testing: the three decision-capture scenarios feed a fixture payload, a fixture transcript or one fixed save payload, and each runtime ran them from one prompt. No run showed the feature working in a real conversation where a person answers questions over several turns.

### Purpose
Close the four gaps and prove the whole pipeline in a live, multi-turn conversation that an orchestrator drives against a test-subject session in each runtime, so every answer an operator gives lands once, as a rewritten decision with its verbatim exchange, in the right packet.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. The optional `decision-record.md` here holds only the operator's answers that span phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map captured answers onto rows of a decision record written by hand, so they stop counting as pending without duplicate rows (002).
- Find the Codex and Pi answer surfaces and capture from them, or record a tested reason none exists (003).
- Capture OpenCode and Devin answers live or near-live and test the newest OpenCode layout on a real sample (004).
- Detect a plain chat question anywhere in an assistant message without flooding the queue (005).
- Prove the pipeline with a scripted, timed, multi-turn conversation per runtime and re-prove 002 to 005 with it (006).

### Out of Scope
- Building the conversation runner itself. It is shared and belongs to the sk-create-manual-testing-playbook skill, planned in `specs/sk-doc/065-conversation-playbook-scenarios`; 006 uses it.
- Barter's own conversion program and its goals, which another session owns.
- Changing the existing `open_questions` and `answered_questions` continuity fields.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` and its tests | Modify | 002 | Match captured answers to existing hand-written table rows |
| `.skilled/hooks/decision-capture/` adapters, sweeps and tests | Create or Modify | 003, 004, 005 | Codex and Pi capture or its recorded absence, OpenCode and Devin live capture, chat question detection |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` and the runtime mirrors | Modify | 003, 004 | Register only adapters a live probe proved |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` | Create | 006 | One conversation scenario for decision capture, in the format 065 defines |
| `.skilled/hooks/README.md`, `.skilled/skills/.state/decision-capture/README.md` | Modify | 003, 004, 005 | Coverage rows and the matching rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-decision-capture-build/ | The capture core, Claude hook, transcript, OpenCode and Devin sweeps, decision-record writer, save wiring and Stop-hook nudge | Complete |
| 2 | 002-table-row-matching/ | Map captured answers onto rows of a hand-written decision table so they stop counting as pending, with no duplicate rows | Complete |
| 3 | 003-codex-and-pi-capture/ | Find the Codex and Pi answer surfaces and capture from them, or record a tested reason none exists | Complete |
| 4 | 004-opencode-devin-live-capture/ | Capture OpenCode and Devin answers live or near-live, and test OpenCode's newest layout on a real sample | Complete |
| 5 | 005-chat-question-detection/ | Detect a plain chat question anywhere in an assistant message, capped per message, in every runtime's sweep | Complete |
| 6 | 006-live-conversation-test/ | Run the decision-capture conversation scenario in every runtime on the shared runner from sk-doc/065, and keep the results matrix | Complete |
| 7 | 007-gap-closure/ | Close the gaps the 2026-11-02 research ranked: report unreadable Codex and Pi transcripts, offer orphaned answers at save, nudge on Pi, and drop two duplicated code paths | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Children 002 to 005 close only after the 006 conversation scenario re-proves them, so the 006 Claude Code row runs first, once `specs/sk-doc/065-conversation-playbook-scenarios` ships the shared runner
- 006's scenario files are written as soon as 065's `001-scenario-contract` lands, before 002 is built. Only the 006 runs wait for 065's runner

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-decision-capture-build | 002-table-row-matching | 001 is committed and its Known Limitations name the open gaps | `git log --oneline -1 23b4f3d2e7` resolves and 001's `implementation-summary.md` lists four limitations |
| 002-table-row-matching | 003-codex-and-pi-capture | The session's 27 Barter answers resolve to Q67 to Q93 with no new row, and every other record of the session is consumed or a counted refusal with its reason | 002's acceptance criteria are Met and the 006 matrix records the re-proof |
| 003-codex-and-pi-capture | 004-opencode-devin-live-capture | Codex and Pi each capture or carry a probe file and a test that pin the absence | 003's acceptance criteria are Met |
| 004-opencode-devin-live-capture | 005-chat-question-detection | OpenCode and Devin answers queue during the conversation, once each | 004's acceptance criteria are Met and the 006 matrix records it |
| 005-chat-question-detection | 006-live-conversation-test | A mid-message chat question becomes one candidate within the per-message cap | 005's acceptance criteria are Met and the 006 matrix records it |
| 006-live-conversation-test | 007-gap-closure | Every runtime row of the 006 matrix passes and the research run has ranked the remaining gaps | `research/research.md` exists with its verification addendum, and the 006 matrix has five passing rows |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Queue record 12 of this session's queue (the session-relaunch child-guard answer) has no row in any decision record. 002 plans to record it once in 001's `decision-record.md` through a full-auto save. The operator confirms or redirects that.
- 006 depends on `specs/sk-doc/065-conversation-playbook-scenarios`, which another session is planning. Its runner format fixes the shape of the 006 scenario.
- Before the follow-ups are built: what defects and weak spots does the 001 build carry, should children 002 to 006 be changed, merged, split or re-ordered, and is the 006 contract with the 065 conversation runner right?

**Research Context**: a `/deep:research` run is active for this topic. `research/research.md` is the canonical output; this note only points at it.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Research findings** (5 iterations across two lineages, DeepSeek 3 and Luna 2, stop reason `maxIterationsReached`; ranking and evidence in `research/research.md`):

- Keep the shape: one queue core, one chat detector, one writer and one matcher are already the shared seams. The five save-time readers stay separate because each parses a format another tool owns.
- Close four gaps, each small: Codex and Pi sweeps report an unreadable named transcript; the save step lists answers orphaned by sessions that never saved, through the existing `--scan-orphans`; Devin and Pi call `takeNudge`; `coverage-rationale.md` explains the Codex and Cursor cells.
- Do not add a live record writer, a Codex live hook or a second process classifier. Chat-pair auto-acceptance waits on one multi-question live case.
- Maintainability by deletion: the OpenCode plugin imports its sweep's mapping instead of `answerMap`, the matcher CLI reuses the writer's consumed-log reader, and `save.md` stops restating the process filter.
<!-- END GENERATED: deep-research/spec-findings -->

Where the findings landed: 002 gained REQ-011 to REQ-016 (one-row-one-answer refusal, counted refusals as the handoff criterion, rebuild by rerun, orphan scan and `--release`, nudge text naming the sweep and matcher, bolded appendix labels, the save-writer scenario's checks). 003 gained REQ-008 (the Claude adapter's `process.cwd()` fallback) and REQ-009 (its `n/a:` refusal shape as the series convention). 004's REQ-003 fixture now comes from its own live probe, with an UNKNOWN escape. 005's 006 stage gained the negative assertion. 006 splits S12 into its own scenario file, uses the runner's `compact` and `restart`, makes S0 a check-only turn and maps its marks onto PASS, FAIL and SKIP, per `specs/sk-doc/065-conversation-playbook-scenarios/decision-record.md` ADR-002. Set aside pending the operator: D6, D7 and D9 (open-questions.md 5).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Operator decisions that span phases**: See `decision-record.md`
- **Goal**: See `goal.md` for the series objective and the binding to each child goal
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks the decision capture series: the finished build in 001, the follow-up fixes in 002 to 005, and the live conversation proof in 006.
- The series closes when every child is Complete, `validate.sh --recursive --strict` prints `RESULT: PASSED` for every folder, and the 006 matrix holds a row for each of the five runtimes, either a passing conversation run or a recorded absence of any answer surface with its evidence. New work on a different artifact gets its own packet.
<!-- /ANCHOR:requirements -->
