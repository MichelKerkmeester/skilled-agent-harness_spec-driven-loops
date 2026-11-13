---
title: Deep Research Strategy - Purpose Retention Across Handovers
description: Strategy tracker for the deepseek-2 fan-out lineage answering the five open questions on purpose retention across handovers, relaunch hops and context compactions.
trigger_phrases:
  - "deep research strategy"
  - "purpose retention research strategy"
  - "handover purpose drift"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Serves as the persistent brain for the deepseek-2 fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** Populated from the research topic and the spec's section 7 open questions.
- **Per iteration:** The agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Where a spec packet's problem, purpose and user need are dropped across session handovers, relaunch hops and context compactions in system-spec-kit, and which smallest change to its logic or templates keeps them. Answer the five numbered questions in section 7 OPEN QUESTIONS of `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md`. Read-only research over `.skilled/skills/system-spec-kit`, `.skilled/commands/speckit`, `.skilled/skills/system-deep-loop` and `specs`. Cite every claim as `[SOURCE: path:line]`.

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

- Implementing any fix; this is read-only research.
- Judging packet quality beyond purpose retention.
- Re-litigating the operator's candidate changes as conclusions before evidence.

---

## 5. STOP CONDITIONS

- Five iterations (config.maxIterations) completed.
- All five spec open questions answered or explicitly marked unanswerable with evidence.

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
- reading the template, the level contract and the validator contract as three separate layers exposed the gap that neither layer alone shows. The template demands purpose; the file contract does not require a purpose document; the validator grades anchor presence only and exempts parents. That three-layer read is what turns "purpose is dropped" into a named mechanism. (iteration 1)
- reading the code that builds each payload, not the prose that describes it, produced the decisive evidence. The prose says resume reads spec.md; the activity list and output contract show that even if it does, no purpose field survives. The `Goal` facet built from `next_safe_action` is the clearest single drop: the label promises the why and the code supplies an action. (iteration 2)
- measuring the corpus instead of reading more machinery converted a plausible mechanism into a quantified outcome. The pair comparison is the decisive evidence: the child template asks for a local outcome, so the child purpose answers a narrower question by design, and the parent's why is not reachable from the child document. (iteration 3)
- testing each candidate against the three measured failure points produced a clear ordering. The decisive discovery was that candidate B already exists in the template and candidate C's gap is a v2.2 stamp plus a generator default, not a missing section. The continuity block then emerged as the only surface that is both ubiquitous and read by multiple hops. (iteration 4)
- consolidating every elimination and then attacking the surviving recommendation produced the two measurements that decide it: user-need vocabulary is rare even in real purposes, and goal.md is a minority carrier with low overlap. Both point at the same design constraint: the carried value must include the problem, not just a purpose phrase. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- a naive search for "purpose" returned mostly prose about the research topic rather than the template contract, because the phrase "PROBLEM & PURPOSE" is a heading rather than a field. Reading the template bodies was the recovery. (iteration 1)
- the first pass at the resume YAML read only `memory_loading` and would have concluded that spec.md is read on every resume. Comparing three lists in the same file exposed the contradiction. (iteration 2)
- the first overlap pass included placeholder purposes and reported six "exact restatements" that were all identical template placeholders. Excluding placeholders changed the result to zero, which is the finding. (iteration 3)
- an early framing treated the choice as "template or runtime". The corpus evidence shows the real split is "authoring value" versus "carrier", and the cheapest carrier is the continuity block, not a new document. (iteration 4)
- an earlier draft treated the continuity field as a complete fix. The 80-of-297 empty parent purposes and the 11.6% user-mention rate show it needs an authoring dependency and a problem-inclusive payload. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `/speckit:resume` as it stands: no purpose slot, contradictory spec.md read. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `/speckit:resume` as it stands: no purpose slot, contradictory spec.md read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/speckit:resume` as it stands: no purpose slot, contradictory spec.md read.

### `goal.md` as the general carrier: 30.5% coverage and a median 0.256 overlap with Purpose. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `goal.md` as the general carrier: 30.5% coverage and a median 0.256 overlap with Purpose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `goal.md` as the general carrier: 30.5% coverage and a median 0.256 overlap with Purpose.

### `handover.md` as the carrier: no slot, 71/96 real handovers omit purpose vocabulary. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `handover.md` as the carrier: no slot, 71/96 real handovers omit purpose vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `handover.md` as the carrier: no slot, 71/96 real handovers omit purpose vocabulary.

### A validator-only fix: presence and token checks cannot grade meaning, and fail-closed enforcement has a 297-packet migration cost. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A validator-only fix: presence and token checks cannot grade meaning, and fail-closed enforcement has a 297-packet migration cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A validator-only fix: presence and token checks cannot grade meaning, and fail-closed enforcement has a 297-packet migration cost.

### Adding a new parent-level document to carry purpose: the parent already has exactly one prose document, and the measured problem is that its purpose is empty or generic, not that a document is missing. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Adding a new parent-level document to carry purpose: the parent already has exactly one prose document, and the measured problem is that its purpose is empty or generic, not that a document is missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new parent-level document to carry purpose: the parent already has exactly one prose document, and the measured problem is that its purpose is empty or generic, not that a document is missing.

### Candidate A as a purpose mechanism: acceptance criteria measure completion and have no why slot; adding them at the parent also breaks the lean-trio contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Candidate A as a purpose mechanism: acceptance criteria measure completion and have no why slot; adding them at the parent also breaks the lean-trio contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate A as a purpose mechanism: acceptance criteria measure completion and have no why slot; adding them at the parent also breaks the lean-trio contract.

### Candidate C as a standalone fix: the parent template already requires root purpose; without a stamp/validation change and a real value, a template edit changes nothing measured. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Candidate C as a standalone fix: the parent template already requires root purpose; without a stamp/validation change and a real value, a template edit changes nothing measured.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate C as a standalone fix: the parent template already requires root purpose; without a stamp/validation change and a real value, a template edit changes nothing measured.

### Explaining child drift as a few bad packets: 700 of 1,029 measured pairs fall below 0.10 overlap, so drift is the corpus-wide default. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Explaining child drift as a few bad packets: 700 of 1,029 measured pairs fall below 0.10 overlap, so drift is the corpus-wide default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Explaining child drift as a few bad packets: 700 of 1,029 measured pairs fall below 0.10 overlap, so drift is the corpus-wide default.

### Looking for a validator rule that grades the content of a purpose statement: `ANCHORS_VALID` grades presence, and `PLACEHOLDER_FILLED` grades only template tokens. No rule judges whether the sentence says anything. Candidate for "Exhausted Approaches": searching for semantic purpose validation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a validator rule that grades the content of a purpose statement: `ANCHORS_VALID` grades presence, and `PLACEHOLDER_FILLED` grades only template tokens. No rule judges whether the sentence says anything. Candidate for "Exhausted Approaches": searching for semantic purpose validation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a validator rule that grades the content of a purpose statement: `ANCHORS_VALID` grades presence, and `PLACEHOLDER_FILLED` grades only template tokens. No rule judges whether the sentence says anything. Candidate for "Exhausted Approaches": searching for semantic purpose validation.

### New parent-level document (acceptance criteria or dedicated purpose file): no purpose slot, lean-trio conflict, 297-parent migration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: New parent-level document (acceptance criteria or dedicated purpose file): no purpose slot, lean-trio conflict, 297-parent migration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New parent-level document (acceptance criteria or dedicated purpose file): no purpose slot, lean-trio conflict, 297-parent migration.

### None at the Q1 level. The mechanism is fully described above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None at the Q1 level. The mechanism is fully described above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None at the Q1 level. The mechanism is fully described above.

### Parent template alone: already requires root purpose; no enforcement and a generic generator default. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Parent template alone: already requires root purpose; no enforcement and a generic generator default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent template alone: already requires root purpose; no enforcement and a generic generator default.

### Relying on children to restate the parent naturally: 0 of 1,029 pairs share a 60-character run and the median overlap is 0.067. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Relying on children to restate the parent naturally: 0 of 1,029 pairs share a 60-character run and the median overlap is 0.067.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on children to restate the parent naturally: 0 of 1,029 pairs share a 60-character run and the median overlap is 0.067.

### Searching `runtime/hooks/` for a runtime adapter that injects `spec.md` content at compaction or startup found none; every adapter emits summary, folder pointer, lookup and recovery instruction. Candidate for "Exhausted Approaches": per-runtime hook search for a purpose field. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching `runtime/hooks/` for a runtime adapter that injects `spec.md` content at compaction or startup found none; every adapter emits summary, folder pointer, lookup and recovery instruction. Candidate for "Exhausted Approaches": per-runtime hook search for a purpose field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `runtime/hooks/` for a runtime adapter that injects `spec.md` content at compaction or startup found none; every adapter emits summary, folder pointer, lookup and recovery instruction. Candidate for "Exhausted Approaches": per-runtime hook search for a purpose field.

### Searching for a dedicated "user need" template: none exists, so the answer must name the nearest existing carrier rather than a purpose field. Recorded as finding 8 rather than an unanswered question. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a dedicated "user need" template: none exists, so the answer must name the nearest existing carrier rather than a purpose field. Recorded as finding 8 rather than an unanswered question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a dedicated "user need" template: none exists, so the answer must name the nearest existing carrier rather than a purpose field. Recorded as finding 8 rather than an unanswered question.

### Searching for a real relaunch note to sample: the handoffs directory is empty and gitignored; there is no packet-level history to measure. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a real relaunch note to sample: the handoffs directory is empty and gitignored; there is no packet-level history to measure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a real relaunch note to sample: the handoffs directory is empty and gitignored; there is no packet-level history to measure.

### Searching for a semantic purpose validator: none exists; `ANCHORS_VALID` and `PLACEHOLDER_FILLED` are structural only. This is the second iteration on this path; promote to "Exhausted Approaches". -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a semantic purpose validator: none exists; `ANCHORS_VALID` and `PLACEHOLDER_FILLED` are structural only. This is the second iteration on this path; promote to "Exhausted Approaches".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a semantic purpose validator: none exists; `ANCHORS_VALID` and `PLACEHOLDER_FILLED` are structural only. This is the second iteration on this path; promote to "Exhausted Approaches".

### Searching packet-level artifacts for the relaunch note format (`## Goal` / `## Done` / `## Remaining work` / `## In-flight state`) returned zero files. The relaunch note is runtime state under `.skilled/skills/.state/`, not a packet document. Candidate for "Exhausted Approaches": looking for relaunch notes inside packets. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching packet-level artifacts for the relaunch note format (`## Goal` / `## Done` / `## Remaining work` / `## In-flight state`) returned zero files. The relaunch note is runtime state under `.skilled/skills/.state/`, not a packet document. Candidate for "Exhausted Approaches": looking for relaunch notes inside packets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching packet-level artifacts for the relaunch note format (`## Goal` / `## Done` / `## Remaining work` / `## In-flight state`) returned zero files. The relaunch note is runtime state under `.skilled/skills/.state/`, not a packet document. Candidate for "Exhausted Approaches": looking for relaunch notes inside packets.

### The compaction `Goal` facet: it is `next_safe_action`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The compaction `Goal` facet: it is `next_safe_action`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The compaction `Goal` facet: it is `next_safe_action`.

### The continuity block as it stands: ubiquitous but purpose-blind. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The continuity block as it stands: ubiquitous but purpose-blind.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The continuity block as it stands: ubiquitous but purpose-blind.

### The relaunch note: ephemeral, gitignored runtime state, unvalidated. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The relaunch note: ephemeral, gitignored runtime state, unvalidated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The relaunch note: ephemeral, gitignored runtime state, unvalidated.

### Treating `/speckit:resume` as a purpose carrier: its output contract has no purpose field, so even a full read of spec.md cannot surface one through the resume packet. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:174] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `/speckit:resume` as a purpose carrier: its output contract has no purpose field, so even a full read of spec.md cannot surface one through the resume packet. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:174]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `/speckit:resume` as a purpose carrier: its output contract has no purpose field, so even a full read of spec.md cannot surface one through the resume packet. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:174]

### Treating `acceptance-criteria.md` as a purpose carrier: its sections are METADATA, CRITERIA (Given/When/Then rows) and CLOSURE STATEMENT, so it measures completion and carries no why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `acceptance-criteria.md` as a purpose carrier: its sections are METADATA, CRITERIA (Given/When/Then rows) and CLOSURE STATEMENT, so it measures completion and carries no why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `acceptance-criteria.md` as a purpose carrier: its sections are METADATA, CRITERIA (Given/When/Then rows) and CLOSURE STATEMENT, so it measures completion and carries no why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83]

### Treating `handover.md` as the purpose carrier across saves: the template has no purpose slot and 71 of 96 real handovers never mention purpose, problem, objective or user need. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `handover.md` as the purpose carrier across saves: the template has no purpose slot and 71 of 96 real handovers never mention purpose, problem, objective or user need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `handover.md` as the purpose carrier across saves: the template has no purpose slot and 71 of 96 real handovers never mention purpose, problem, objective or user need.

### Treating the compaction "Goal" facet as a purpose carrier: the code fills it from `next_safe_action`, so the label is misleading rather than a path. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the compaction "Goal" facet as a purpose carrier: the code fills it from `next_safe_action`, so the label is misleading rather than a path. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the compaction "Goal" facet as a purpose carrier: the code fills it from `next_safe_action`, so the label is misleading rather than a path. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299]

### Treating the continuity block as a purpose carrier: the block is present in 99.5% of summaries, yet the save target has no purpose section and no summary restates the purpose sentence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the continuity block as a purpose carrier: the block is present in 99.5% of summaries, yet the save target has no purpose section and no summary restates the purpose sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the continuity block as a purpose carrier: the block is present in 99.5% of summaries, yet the save target has no purpose section and no summary restates the purpose sentence.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None at the Q1 level. The mechanism is fully described above. (iteration 1)
- Searching for a dedicated "user need" template: none exists, so the answer must name the nearest existing carrier rather than a purpose field. Recorded as finding 8 rather than an unanswered question. (iteration 1)
- Treating `acceptance-criteria.md` as a purpose carrier: its sections are METADATA, CRITERIA (Given/When/Then rows) and CLOSURE STATEMENT, so it measures completion and carries no why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] (iteration 1)
- Searching `runtime/hooks/` for a runtime adapter that injects `spec.md` content at compaction or startup found none; every adapter emits summary, folder pointer, lookup and recovery instruction. Candidate for "Exhausted Approaches": per-runtime hook search for a purpose field. (iteration 2)
- Treating `/speckit:resume` as a purpose carrier: its output contract has no purpose field, so even a full read of spec.md cannot surface one through the resume packet. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:174] (iteration 2)
- Treating the compaction "Goal" facet as a purpose carrier: the code fills it from `next_safe_action`, so the label is misleading rather than a path. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299] (iteration 2)
- Explaining child drift as a few bad packets: 700 of 1,029 measured pairs fall below 0.10 overlap, so drift is the corpus-wide default. (iteration 3)
- Searching packet-level artifacts for the relaunch note format (`## Goal` / `## Done` / `## Remaining work` / `## In-flight state`) returned zero files. The relaunch note is runtime state under `.skilled/skills/.state/`, not a packet document. Candidate for "Exhausted Approaches": looking for relaunch notes inside packets. (iteration 3)
- Treating `handover.md` as the purpose carrier across saves: the template has no purpose slot and 71 of 96 real handovers never mention purpose, problem, objective or user need. (iteration 3)
- Treating the continuity block as a purpose carrier: the block is present in 99.5% of summaries, yet the save target has no purpose section and no summary restates the purpose sentence. (iteration 3)
- Adding a new parent-level document to carry purpose: the parent already has exactly one prose document, and the measured problem is that its purpose is empty or generic, not that a document is missing. (iteration 4)
- Candidate A as a purpose mechanism: acceptance criteria measure completion and have no why slot; adding them at the parent also breaks the lean-trio contract. (iteration 4)
- Candidate C as a standalone fix: the parent template already requires root purpose; without a stamp/validation change and a real value, a template edit changes nothing measured. (iteration 4)
- Looking for a validator rule that grades the content of a purpose statement: `ANCHORS_VALID` grades presence, and `PLACEHOLDER_FILLED` grades only template tokens. No rule judges whether the sentence says anything. Candidate for "Exhausted Approaches": searching for semantic purpose validation. (iteration 4)
- `/speckit:resume` as it stands: no purpose slot, contradictory spec.md read. (iteration 5)
- `goal.md` as the general carrier: 30.5% coverage and a median 0.256 overlap with Purpose. (iteration 5)
- `handover.md` as the carrier: no slot, 71/96 real handovers omit purpose vocabulary. (iteration 5)
- A validator-only fix: presence and token checks cannot grade meaning, and fail-closed enforcement has a 297-packet migration cost. (iteration 5)
- New parent-level document (acceptance criteria or dedicated purpose file): no purpose slot, lean-trio conflict, 297-parent migration. (iteration 5)
- Parent template alone: already requires root purpose; no enforcement and a generic generator default. (iteration 5)
- Relying on children to restate the parent naturally: 0 of 1,029 pairs share a 60-character run and the median overlap is 0.067. (iteration 5)
- Searching for a real relaunch note to sample: the handoffs directory is empty and gitignored; there is no packet-level history to measure. (iteration 5)
- Searching for a semantic purpose validator: none exists; `ANCHORS_VALID` and `PLACEHOLDER_FILLED` are structural only. This is the second iteration on this path; promote to "Exhausted Approaches". (iteration 5)
- The compaction `Goal` facet: it is `next_safe_action`. (iteration 5)
- The continuity block as it stands: ubiquitous but purpose-blind. (iteration 5)
- The relaunch note: ephemeral, gitignored runtime state, unvalidated. (iteration 5)

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

- Target surfaces: `.skilled/skills/system-spec-kit` (templates, validation, continuity), `.skilled/commands/speckit` (resume/handoff/save commands), `.skilled/skills/system-deep-loop` (iteration prompts and briefs), `specs/` (real packets).
- Operator candidate changes are hypotheses: parent-level acceptance criteria, parent-level user story or purpose/problem section, improved parent-specific spec template.
- `resource-map.md` is not present at the spec folder; skipping the coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-11-13T21:03:26.000Z
