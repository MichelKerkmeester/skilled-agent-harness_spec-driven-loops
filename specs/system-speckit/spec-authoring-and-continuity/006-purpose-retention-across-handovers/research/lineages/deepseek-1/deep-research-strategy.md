# Deep Research Strategy - Purpose Retention Across Handovers

## 1. OVERVIEW

### Purpose
Track research progress for the purpose-retention investigation: which surfaces drop a packet's problem, purpose and user need across handovers, relaunch hops and compactions, and which smallest change keeps them.

### Usage
- Read at the start of every iteration for Next Focus, key questions, and exhausted approaches.
- Machine-owned sections are refreshed by the reducer after each iteration.

---

## 2. TOPIC
Where a spec packet's problem, purpose and user need are dropped across session handovers, relaunch hops and context compactions in system-spec-kit, and which smallest change to its logic or templates keeps them. Answer the five numbered questions in section 7 OPEN QUESTIONS of `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md`. Read-only research over `.skilled/skills/system-spec-kit`, `.skilled/commands/speckit`, `.skilled/skills/system-deep-loop` and `specs`. Every claim cited as `[SOURCE: path:line]`. Operator candidates (parent-level acceptance criteria, parent-level user story or purpose/problem section, improved parent-specific spec template) are hypotheses to test, not conclusions.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?
- [x] For each hop surface, what does it read and what does it emit, and does the purpose travel? Surfaces: the Claude compaction hooks (`runtime/hooks/claude/compact-inject.ts`, `session-prime.ts`) and their counterparts for other runtimes under `runtime/hooks/`, `/speckit:resume`, `/speckit:handoff` and the session relaunch, `/speckit:save` with `generate-context.js`, the deep-loop iteration prompts and child-dispatch briefs.
- [x] In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift from it?
- [x] Which candidate change closes the measured gap at the lowest cost? The operator's candidates, to be tested and not assumed: acceptance criteria at the parent spec level, a user story or purpose and problem section at the parent level and an improved parent-specific spec template. Add any other candidate the evidence supports, for example a purpose field in the continuity block or in the compaction brief.
- [x] What is ruled out, and why?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any fix. This run reports findings only.
- Editing anything outside this lineage directory.
- Judging whether the operator's complaint is valid in general; only measuring where the artifact trail drops purpose.

---

## 5. STOP CONDITIONS
- `maxIterations` reached (stopPolicy is `max-iterations`; all five iterations run).
- Unrecoverable state corruption.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?
- For each hop surface, what does it read and what does it emit, and does the purpose travel? Surfaces: the Claude compaction hooks (`runtime/hooks/claude/compact-inject.ts`, `session-prime.ts`) and their counterparts for other runtimes under `runtime/hooks/`, `/speckit:resume`, `/speckit:handoff` and the session relaunch, `/speckit:save` with `generate-context.js`, the deep-loop iteration prompts and child-dispatch briefs.
- In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift from it?
- Which candidate change closes the measured gap at the lowest cost? The operator's candidates, to be tested and not assumed: acceptance criteria at the parent spec level, a user story or purpose and problem section at the parent level and an improved parent-specific spec template. Add any other candidate the evidence supports, for example a purpose field in the continuity block or in the compaction brief.
- What is ruled out, and why?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- going from the authoring template to the level-contract manifest to the two enforcement functions produced a chain that shows both the declared requirement and the executed check. The contradiction between them (phase: declared required, validator exempt) came from reading the manifest and the orchestrator in the same pass, which a template-only pass would have missed. (iteration 1)
- following the data shape rather than the prose. Reading `ResumeSignal` and `ThinContinuityRecord` first made the absence of purpose a structural fact (no field) instead of an inference from headings, and it explained the operator's compaction observation exactly: the facet labelled "Goal" is populated from `next_safe_action`. (iteration 2)
- turning the question into counts before reading prose. "0 of 97 handovers have a Purpose heading" and "0 purpose keys in any continuity block" are falsifiable and decide the question faster than sampling packets, and the lexical probe turned "children drift" from an impression into a number with named examples. (iteration 3)
- measuring which parent-level artifacts authors actually create. The 94-vs-10 split between `goal.md` and `acceptance-criteria.md` reorders the operator's candidates empirically, and the zero-reader count for `goal.md` moved the question from "where do we write it" to "who reads it". (iteration 4)
- tracing the consumer instead of trusting the module name. `buildResumeLadder` reads like the resume brief's engine, but the brief is produced by the command workflow, and the only code consumer is the opt-in snapshot. One grep moved the recommendation from a two-code-file change with test fixtures to a three-text-file change with no migration. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- assuming the section-gate table alone decided enforcement. The gates are data; the executor decides, and both `ANCHORS_VALID` and `SPEC_DOC_SUFFICIENCY` narrow which documents they apply to. (iteration 1)
- starting from the hook names. The interesting behaviour was in the shared continuity module the hooks call, not in the hooks themselves; a hook-only pass would have reported "injects context" without saying what context. (iteration 2)
- an early walk skipped `_archive`/`z_archive` and initially differed from the `find` count; the population had to be stated precisely (3,294 live files) so the percentages mean what they say. (iteration 3)
- treating the operator's candidates symmetrically at first. Two of them describe artifacts that already exist; only the third plus the alternatives compete on cost, so the comparison needed the measured coverage before it meant anything. (iteration 4)
- iteration 4 ranked candidates before tracing who renders the output. The cost model was directionally right (read side, not authoring) but named the wrong edit point. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A new continuity field as the cheapest option: it is the most expensive of the five and still leaves handover-only packets uncovered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A new continuity field as the cheapest option: it is the most expensive of the five and still leaves handover-only packets uncovered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new continuity field as the cheapest option: it is the most expensive of the five and still leaves handover-only packets uncovered.

### A parent-level user story section as a standalone change: the parent template already has the purpose section, so the candidate is a no-op without a reader. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A parent-level user story section as a standalone change: the parent template already has the purpose section, so the candidate is a no-op without a reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A parent-level user story section as a standalone change: the parent template already has the purpose section, so the candidate is a no-op without a reader.

### All seven candidates and habits listed in findings 4-10. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: All seven candidates and habits listed in findings 4-10.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: All seven candidates and habits listed in findings 4-10.

### Looking for a "purpose" field in the continuity schema. `ThinContinuityRecord` has six fields and none is a purpose; a purpose string has no slot to occupy. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a "purpose" field in the continuity schema. `ThinContinuityRecord` has six fields and none is a purpose; a purpose string has no slot to occupy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a "purpose" field in the continuity schema. `ThinContinuityRecord` has six fields and none is a purpose; a purpose string has no slot to occupy.

### Looking for a hop that already reads `goal.md`. None exists; the durable directive has no consumer today. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a hop that already reads `goal.md`. None exists; the durable directive has no consumer today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a hop that already reads `goal.md`. None exists; the durable directive has no consumer today.

### Looking for a packet family where several continuity saves preserved the purpose by convention. The convention does not exist: the only recurring carriers are `spec.md` and, in one packet, `goal.md` pointers. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a packet family where several continuity saves preserved the purpose by convention. The convention does not exist: the only recurring carriers are `spec.md` and, in one packet, `goal.md` pointers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a packet family where several continuity saves preserved the purpose by convention. The convention does not exist: the only recurring carriers are `spec.md` and, in one packet, `goal.md` pointers.

### Parent-level acceptance criteria as the closing change: no purpose column, only 10 of 319 parents have the file, and enabling it touches four or more edit points. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Parent-level acceptance criteria as the closing change: no purpose column, only 10 of 319 parents have the file, and enabling it touches four or more edit points.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent-level acceptance criteria as the closing change: no purpose column, only 10 of 319 parents have the file, and enabling it touches four or more edit points.

### Searching for a dedicated "user need" or "user story" token below Level 3. The template emits USER STORIES only for `level:3,3+`; there is no L1/L2 equivalent to find. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a dedicated "user need" or "user story" token below Level 3. The template emits USER STORIES only for `level:3,3+`; there is no L1/L2 equivalent to find.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a dedicated "user need" or "user story" token below Level 3. The template emits USER STORIES only for `level:3,3+`; there is no L1/L2 equivalent to find.

### The hypothesis that a purpose paragraph in handover.md reaches the next session through the ladder. The parser extracts four labelled fields only; an unlabelled paragraph is not part of the signal shape. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The hypothesis that a purpose paragraph in handover.md reaches the next session through the ladder. The parser extracts four labelled fields only; an unlabelled paragraph is not part of the signal shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The hypothesis that a purpose paragraph in handover.md reaches the next session through the ladder. The parser extracts four labelled fields only; an unlabelled paragraph is not part of the signal shape.

### The hypothesis that a runtime's compaction hook rehydrates the packet's spec.md. Every hook was grepped for ladder/authored-snapshot usage; the only importer is Claude's opt-in snapshot, and no hook reads spec.md. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The hypothesis that a runtime's compaction hook rehydrates the packet's spec.md. Every hook was grepped for ladder/authored-snapshot usage; the only importer is Claude's opt-in snapshot, and no hook reads spec.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The hypothesis that a runtime's compaction hook rehydrates the packet's spec.md. Every hook was grepped for ladder/authored-snapshot usage; the only importer is Claude's opt-in snapshot, and no hook reads spec.md.

### The hypothesis that continuity saves accumulate purpose over time because they are written repeatedly. 0 purpose-like keys exist in any continuity block in the corpus. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The hypothesis that continuity saves accumulate purpose over time because they are written repeatedly. 0 purpose-like keys exist in any continuity block in the corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The hypothesis that continuity saves accumulate purpose over time because they are written repeatedly. 0 purpose-like keys exist in any continuity block in the corpus.

### The hypothesis that handovers in practice restate the purpose because the template gives room for it. 0 of 97 have a heading and only one carries a restatement bullet, which no parser reads. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The hypothesis that handovers in practice restate the purpose because the template gives room for it. 0 of 97 have a heading and only one carries a restatement bullet, which no parser reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The hypothesis that handovers in practice restate the purpose because the template gives room for it. 0 of 97 have a heading and only one carries a restatement bullet, which no parser reads.

### Treating `acceptance-criteria.md` as a purpose surface. Its schema has no purpose or user-need column, so parent-level acceptance criteria would not, by themselves, carry the purpose. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `acceptance-criteria.md` as a purpose surface. Its schema has no purpose or user-need column, so parent-level acceptance criteria would not, by themselves, carry the purpose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `acceptance-criteria.md` as a purpose surface. Its schema has no purpose or user-need column, so parent-level acceptance criteria would not, by themselves, carry the purpose.

### Treating `PLACEHOLDER_FILLED` as a purpose check. It only detects `[YOUR_VALUE_HERE:`/`[NEEDS_CLARIFICATION:` tokens; a filled but meaningless sentence passes, so it cannot be offered as the current purpose gate. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `PLACEHOLDER_FILLED` as a purpose check. It only detects `[YOUR_VALUE_HERE:`/`[NEEDS_CLARIFICATION:` tokens; a filled but meaningless sentence passes, so it cannot be offered as the current purpose gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `PLACEHOLDER_FILLED` as a purpose check. It only detects `[YOUR_VALUE_HERE:`/`[NEEDS_CLARIFICATION:` tokens; a filled but meaningless sentence passes, so it cannot be offered as the current purpose gate.

### Treating the programmatic ladder as the brief's renderer. It is consumed only by the opt-in authored snapshot; the operator-facing brief is assembled by the command workflow from its reply format. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the programmatic ladder as the brief's renderer. It is consumed only by the opt-in authored snapshot; the operator-facing brief is assembled by the command workflow from its reply format.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the programmatic ladder as the brief's renderer. It is consumed only by the opt-in authored snapshot; the operator-facing brief is assembled by the command workflow from its reply format.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Searching for a dedicated "user need" or "user story" token below Level 3. The template emits USER STORIES only for `level:3,3+`; there is no L1/L2 equivalent to find. (iteration 1)
- Treating `acceptance-criteria.md` as a purpose surface. Its schema has no purpose or user-need column, so parent-level acceptance criteria would not, by themselves, carry the purpose. (iteration 1)
- Treating `PLACEHOLDER_FILLED` as a purpose check. It only detects `[YOUR_VALUE_HERE:`/`[NEEDS_CLARIFICATION:` tokens; a filled but meaningless sentence passes, so it cannot be offered as the current purpose gate. (iteration 1)
- Looking for a "purpose" field in the continuity schema. `ThinContinuityRecord` has six fields and none is a purpose; a purpose string has no slot to occupy. (iteration 2)
- The hypothesis that a purpose paragraph in handover.md reaches the next session through the ladder. The parser extracts four labelled fields only; an unlabelled paragraph is not part of the signal shape. (iteration 2)
- The hypothesis that a runtime's compaction hook rehydrates the packet's spec.md. Every hook was grepped for ladder/authored-snapshot usage; the only importer is Claude's opt-in snapshot, and no hook reads spec.md. (iteration 2)
- Looking for a packet family where several continuity saves preserved the purpose by convention. The convention does not exist: the only recurring carriers are `spec.md` and, in one packet, `goal.md` pointers. (iteration 3)
- The hypothesis that continuity saves accumulate purpose over time because they are written repeatedly. 0 purpose-like keys exist in any continuity block in the corpus. (iteration 3)
- The hypothesis that handovers in practice restate the purpose because the template gives room for it. 0 of 97 have a heading and only one carries a restatement bullet, which no parser reads. (iteration 3)
- A new continuity field as the cheapest option: it is the most expensive of the five and still leaves handover-only packets uncovered. (iteration 4)
- A parent-level user story section as a standalone change: the parent template already has the purpose section, so the candidate is a no-op without a reader. (iteration 4)
- Looking for a hop that already reads `goal.md`. None exists; the durable directive has no consumer today. (iteration 4)
- Parent-level acceptance criteria as the closing change: no purpose column, only 10 of 319 parents have the file, and enabling it touches four or more edit points. (iteration 4)
- All seven candidates and habits listed in findings 4-10. (iteration 5)
- Treating the programmatic ladder as the brief's renderer. It is consumed only by the opt-in authored snapshot; the operator-facing brief is assembled by the command workflow from its reply format. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Resource map: `resource-map.md` not present at init; skipping coverage gate.

Pointer inventory for the first iteration (paths only, not evidence):
- Templates: `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`, `.skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl`, `goal.md.tmpl`, `acceptance-criteria.md.tmpl`.
- Hooks: `.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,cursor,devin,dsh,opencode,pi}/`.
- Commands: `.skilled/commands/speckit/{resume,handoff,save,plan}.md`.
- Continuity writer: `.skilled/skills/system-spec-kit/runtime/scripts/memory/generate-context.js` (path to be confirmed).
- Validation: `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`, `runtime/cli/spec/validate.sh`.
- Deep loop: `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (`buildLoopPrompt`).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy is `max-iterations`)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-11-13T22:05:00.000Z
