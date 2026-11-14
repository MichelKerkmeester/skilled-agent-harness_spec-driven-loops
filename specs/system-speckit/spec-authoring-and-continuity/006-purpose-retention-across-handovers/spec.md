---
title: "Feature Specification: Keep a packet's core purpose across handovers and compactions"
description: "A packet keeps its mechanics across relaunch hops and compactions but loses why the work exists and whom it serves. This packet found where the purpose drops, and its phase children build the change that keeps it in front of the next session on a resume, a relaunch, a compaction and a continuity save."
trigger_phrases:
  - "purpose retention across handovers"
  - "keep a packet s core purpose across handovers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Keep a packet's core purpose across handovers and compactions

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/371-purpose-retention-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The operator reported on 2026-11-13 that the core reason, problem, purpose or user need behind a piece of work gets lost after several in-session handovers (relaunch hops) or context compactions. The session keeps the mechanics, such as files, commits and the next action, and loses why the work exists and whom it serves. The operator wants a packet's purpose to survive a resume, a relaunch, a compaction and a continuity save, so the next AI still sees why the work exists.

Observed in the reporting session:
- The context recovered after a compaction listed active files, word-reference counts and recent topics, and carried no statement of the work's purpose.
- The `_memory.continuity` frontmatter block in `implementation-summary.md` has the fields `packet_pointer`, `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions` and `answered_questions`. None of them holds the problem or the purpose.
- `templates/core/spec.md.tmpl` and `templates/packet-types/phase-parent.spec.md.tmpl` both already have a "PROBLEM & PURPOSE" section with "Problem Statement" and "Purpose", so the purpose is written once at authoring time.
- `templates/addons/handover.md.tmpl` has "Handover Summary", "Context Transfer" and "For Next Session" and no heading for the problem or purpose.
- `templates/addons/acceptance-criteria.md.tmpl` exists and is scaffolded from Level 2. `templates/addons/goal.md.tmpl` carries a "Durable Directive".

All template paths are under `.skilled/skills/system-spec-kit/`.

Where the work stands on 2026-11-14. The research ran first and found that the purpose is written once, in `spec.md`, and that no hop read it back. Phases 001 to 005 then built the carry on all four hops and are on main. An independent review found the result partly aligned with the need: every hop now carries a purpose line, but the line is one sentence read only under an exact `### Purpose` heading, the hops state three different rules and three of the four hops have not been seen in a real run. Phases 006 to 010 plan the answers to that review.

### Purpose
Keep a packet's purpose, the reason the work exists and whom it serves, in front of the next AI after a resume, a relaunch, a compaction and a continuity save.

The research in `research/research.md` found where the purpose was dropped on each hop. The phase children in the map below build the change and close what the review found.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n '^## [0-9]' .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl
37:## 1. Handover Summary
50:## 2. Context Transfer
84:## 3. For Next Session
107:## 4. Validation Checklist
121:## 5. Session Notes
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Trace each hop surface, record what it reads and emits and whether the purpose travels, and cite every claim as `[SOURCE: path:line]` in `research/research.md`. Done on 2026-11-13.
- Carry the packet purpose into the resume brief, the relaunch note, the context recovered after a compaction and the continuity save, and make an unfilled purpose in a new phase parent fail a check. Built in phase children 001 to 005.
- Close the defects found during that build and the findings of the independent review of 2026-11-14. Planned in phase children 006 to 010.
- Hold the phase map, the handoff criteria and the per-finding decisions for those children in this document.

### Out of Scope
- Build detail in this document - every edit, task and check lives in the phase child that owns it.
- Writing a purpose for live phase parents that never had one - nothing is written there to carry. They are listed in `006-purpose-carry-follow-ups/scratch/phase-parents-without-purpose-text.txt` for the operator to order as separate work.
- Running the hooks from anything other than the built `dist/` folder - every hook in this repository runs from that build, and the drift message already tells an operator to rebuild.
- A default reader for the stored `packet_purpose` value - the operator chose to build the field knowing that only the opt-in authored snapshot renders it (decision Q006).
- Any change to Barter repositories - they are outside this repository.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The synthesis that answers the five research questions. Done |
| `research/resource-map.md` | Create | The map of files the lineages read. Done |
| `research/lineages/` | Create | One folder per lineage with its iteration state. Done |
| `spec.md` | Modify | The phase map, the handoff criteria and the review decisions |

This document's own work changes no file outside the packet. Each phase child lists the files it changes in section 3 of its own `spec.md`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `research/research.md` answers all five open questions with resolvable citations | Each of the five questions has its own answer in `research/research.md`, and every `[SOURCE: path:line]` opens to the cited line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `research/research.md` names one recommended change with its cost and how to validate it | `research/research.md` holds one recommendation with a cost and a validation step |
| REQ-003 | `research/research.md` lists what was ruled out and why | `research/research.md` holds a ruled-out list with one reason per item |
| REQ-004 | The purpose carry for the four hops is built and on main | `git log --no-walk --format=%h eaba5ab89e 3d237cd97a f0d8c03036 0837fcd5a2 191ce39bad` prints five hashes, one per phase 001 to 005 |
| REQ-005 | Every finding of the independent review of 2026-11-14 has a recorded decision | The table under "Independent Review of 2026-11-14" in section 7 holds one row per finding, 1 to 10, plus row A for the alignment gap, each with a decision and a reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `research/research.md` answers the five questions, and every citation the orchestrating session opens resolves to the cited line.
- **SC-002**: `research/research.md` names one recommended change with its cost and validation, and lists what was ruled out.
- **SC-003**: `git status --short` shows no change outside this packet after the research run.
- **SC-004**: A real session shows the packet's purpose line after a resume, a relaunch, a compaction and a continuity save. Open on 2026-11-14: only the continuity save has live evidence. A real compaction, a real relaunch and an operator-run `/speckit:resume` have not been observed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-deepseek-harness` on `deepseek-v4.1-flash-1017` | The run cannot start | Stop and report to the operator, and do not swap the executor |
| Risk | Both lineages run the same model, so agreement between them is not corroboration | High | The orchestrating session opens the citations itself before it trusts a finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

1. Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?
2. For each hop surface, what does it read and what does it emit, and does the purpose travel? Surfaces: the Claude compaction hooks (`runtime/hooks/claude/compact-inject.ts`, `session-prime.ts`) and their counterparts for other runtimes under `runtime/hooks/`, `/speckit:resume`, `/speckit:handoff` and the session relaunch, `/speckit:save` with `generate-context.js`, the deep-loop iteration prompts and child-dispatch briefs.
3. In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift from it?
4. Which candidate change closes the measured gap at the lowest cost? The operator's candidates, to be tested and not assumed: acceptance criteria at the parent spec level, a user story or purpose and problem section at the parent level and an improved parent-specific spec template. Add any other candidate the evidence supports, for example a purpose field in the continuity block or in the compaction brief.
5. What is ruled out, and why?

### Research Context

Deep research runs against this packet with `/deep:research`, and `research/research.md` is the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings of the 2026-11-13 deep-research run, two lineages of five iterations on the same model, abridged from `research/research.md`.

- The purpose is written once, in `spec.md` section 2, and no automatic hop reads it back. The compaction "Goal" facet is filled from `next_safe_action`, the default Claude compaction brief is transcript-only and the resume brief has no purpose row.
- Phase parents often carry no real purpose, because nothing flags an unfilled parent purpose and the validator exempts parents from anchor checks.
- The lineages split on the fix. The adjudicated recommendation quotes the packet's existing Purpose in the resume brief, the compaction brief and the relaunch note's Goal, and makes an unfilled parent purpose fail a check. A purpose field in `_memory.continuity` is held.
- Ruled out: parent-level acceptance criteria, a new parent purpose section (one already exists) and a template or validator change alone.
- Full answers, orchestrator citation checks and limits: `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->

### Independent Review of 2026-11-14

An independent review of phases 001 to 005 and of the plan for phase 006 returned ten findings and the verdict "partly aligned". Each finding was checked against the code or the documents before it was planned for. This planning session could not start `node`, so findings were confirmed by reading the code and by `rg` counts, and the reviewer's run-time numbers are quoted as the reviewer's.

| Finding | Decision | Reason |
|---------|----------|--------|
| 1. The helper reads a purpose only under an exact `### Purpose` heading | Planned in 007 | Confirmed by the counts in the Measured Behavior block of `007-purpose-reader-coverage/spec.md`: most live files that lack the heading state a purpose another way |
| 2. Phase 006 claims every live phase parent states its reason and fixes five | Folded into 006 | Its Purpose and REQ-001 now claim only that no parent holds the scaffold sentence. Parents with no purpose text stay out of scope and are listed |
| 3. The first-sentence rule yields a list marker, a line cut at an abbreviation or a line cut at 300 characters, and the problem is never carried | Planned in 007 and 010 | 007 fixes the list marker and the abbreviation cut and keeps the cap, which the stored field's limit depends on. 010 carries the problem sentence after a compaction and waits for the operator's yes |
| 4. The compaction line needs exactly one pinned packet | Planned in 009 | Confirmed in `session-stop.ts:234-238`. The recovery falls back to the folder the cached brief names |
| 5. The stored `packet_purpose` has no default reader | Declined | The operator built it knowing this (decision Q006), and every continuity write copies the purpose again, so a stale copy lasts only until the next save |
| 6. The relaunch rule differs from the other hops | Planned in 008 | Confirmed: the files that state the rule use different labels, and `handoff.md` and `nudge.cjs` have no scaffold skip |
| 7. Three hops run only from the git-ignored build | Declined | Every hook in this repository runs from `dist/`, so this is the runtime's standing contract and not part of carrying a purpose |
| 8. This document and the five summaries are stale | Done in this update | The Problem Statement, Purpose and scope above state the need and the build, and each summary names its landing commit |
| 9. The spec folder path is not held inside the project | Planned in 009 | Confirmed in `session-prime.ts:232` and in the Pi adapter at line 79 |
| 10. Test gaps | Split across 006, 008 and 009 | 006 edit E15 tests the non-Draft gate, 008 pins the nudge labels and, through edit E9, the resume `purpose_row` label, and 009 moves the compaction tests to repo-relative folders. The resume hop is prose a model follows, so its rule text gets a pin and not a behavior test |
| A. Devin and OpenCode get no purpose after a compaction (review, Alignment section) | Deferred | Devin's `PostCompaction` hook has never been observed firing (`.devin/SYNC.md:139`), so a purpose line there could not be proven. OpenCode is a real gap: after `session.compacted`, `.opencode/plugins/session-history-lookup.js` already adds a `## History Lookup` section to the system text, so a purpose line could ride on that path. It is deferred, not declined, and left to the operator to schedule as its own phase |

### Plan Verification of 2026-11-14

A second independent model verified phases 006 to 010 and returned "ready with fixes". The orchestrating session confirmed its one P1 by running the relaunch suite: 1014 of 1014 pass in a normal shell and 957 of 1014 with `AI_SESSION_CHILD=1`, the variable every dispatched worker carries, because the relaunch hook turns itself off for a child session. Phase 008 now runs that suite with `env -u AI_SESSION_CHILD`. The other fixes are in place: 007's coverage claim reads 272 of 292, 009 walks a folder up to its nearest `spec.md` and reads the brief's folder line only above `Recent context:`, and 010 carries its measured continuity baseline of 43 tests.

### Operator Decisions of 2026-11-14

- Phase 010 is built.
- The parent gets a `goal.md` through `/create:goal`, with the Objective drafted from the original user need.
- Phase 011 backfills the 21 live phase parents that state no purpose.
- Edit E2 of phase 006 is widened to cover the later children of the local embeddings parent.
- Phase 008 pins the resume `purpose_row` label in the command workflow test.
- The parent's own summary names its landing commits.

### Build Order

Build the phases in number order, 006 to 011, one at a time. The order is not only a dependency chain: phase 009 raises `hook-session-start.vitest.ts` from 23 to 27 tests and phase 008 raises the command workflow test from 148 to 150 passes, so the Setup baselines quoted in 006 and 007 hold only before 008 and 009 are built.
<!-- /ANCHOR:questions -->

---



<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-parent-purpose-scaffold/ | An unfilled purpose in a new phase parent fails a check | Complete |
| 2 | 002-resume-purpose-row/ | The `/speckit:resume` brief shows the packet purpose | In Progress |
| 3 | 003-relaunch-goal-quote/ | The relaunch note Goal opens with the packet purpose | Complete |
| 4 | 004-compaction-purpose-line/ | The context injected after a compaction carries the packet purpose, and the shared purpose helper | Complete |
| 5 | 005-continuity-purpose-field/ | The continuity block carries the purpose and the recovery Goal shows it | Complete |
| 6 | 006-purpose-carry-follow-ups/ | Real purposes for the five live phase parents that hold the scaffold sentence, the PreCompact folder line for `specs/` paths, resume asset brief rows that match the presentation file and a test that an unfilled parent purpose fails the gate once the parent leaves Draft | Complete |
| 7 | 007-purpose-reader-coverage/ | The purpose helper reads a purpose written under another heading or as an inline `Purpose:` label, and no longer returns a list marker or a line cut at an abbreviation | Complete |
| 8 | 008-hop-purpose-rule-parity/ | The relaunch note, the nudge text and the resume assets state the same purpose rule and labels as the helper, with the scaffold skip | Complete |
| 9 | 009-compaction-purpose-folder/ | The compaction recovery finds the packet when the session touched more than one, holds the folder path inside the project, and its tests use repo-relative folders | Complete |
| 10 | 010-problem-sentence-carry/ | The context recovered after a compaction also carries the first sentence of the Problem Statement. The operator said yes on 2026-11-14 | Complete |
| 11 | 011-empty-parent-purpose-backfill/ | One authored purpose sentence in each of the 21 live phase parents that state none, reviewed by the operator before commit | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-parent-purpose-scaffold | 002-resume-purpose-row | None. The two phases touch different files and can ship in either order | Each phase passes `validate.sh --strict` on its own |
| 002-resume-purpose-row | 003-relaunch-goal-quote | None. The relaunch note text does not depend on the resume brief | Each phase passes `validate.sh --strict` on its own |
| 003-relaunch-goal-quote | 004-compaction-purpose-line | None. The compaction hook does not depend on the relaunch note | Each phase passes `validate.sh --strict` on its own |
| 004-compaction-purpose-line | 005-continuity-purpose-field | Phase 004 is built and merged, because phase 005 imports the purpose helper that 004 creates | `runtime/lib/spec/packet-purpose.ts` exists and its tests pass |
| 005-continuity-purpose-field | 006-purpose-carry-follow-ups | None from phase 005. Edits E13 and E14 replace the `reply_format` line phase 002 wrote, so they apply while that line reads as phase 002 left it | `rg -c -F` on the E13 and E14 search texts in `006-purpose-carry-follow-ups/plan.md` prints 1 for each asset |
| 006-purpose-carry-follow-ups | 007-purpose-reader-coverage | None. Phase 007 edits the purpose helper and its tests, which phase 006 does not touch | Each phase passes `validate.sh --strict` on its own |
| 007-purpose-reader-coverage | 008-hop-purpose-rule-parity | Phase 007 is built, because phase 008 writes into the hop files the rule the widened helper follows | `rg -c '^const PURPOSE_SECTION_HEADING' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints 1 |
| 008-hop-purpose-rule-parity | 009-compaction-purpose-folder | None from phase 008. Phase 009 takes effect for folders under `specs/` only once phase 006 edit E11 is built | `rg -c -F '(?:\.opencode\/)?specs\/' .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints 1 once edit E11 is built. It prints nothing today |
| 009-compaction-purpose-folder | 010-problem-sentence-carry | Phases 007 and 009 are built and the operator has said yes to carrying the problem sentence, which widens the Purpose-only design the operator approved | `rg -c -F 'function paragraphAfter' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` and `rg -c -F 'folderNamedInBrief' .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` each print a count of 1 or more |
| 010-problem-sentence-carry | 011-empty-parent-purpose-backfill | None from phase 010. Phase 011 writes the exact `### Purpose` heading the current helper reads, so it needs no earlier phase. It runs last so its sentences are reviewed against the final rule | `node 011-empty-parent-purpose-backfill/scratch/check-backfill.mjs \| tail -1` prints `own purpose: 0 of 21` before it starts |
<!-- /ANCHOR:phase-map -->
