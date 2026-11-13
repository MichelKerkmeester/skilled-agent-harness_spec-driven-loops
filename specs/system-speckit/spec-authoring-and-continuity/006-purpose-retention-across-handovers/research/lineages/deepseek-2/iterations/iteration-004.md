# Iteration 4: Candidate changes tested against the measured gap (Q4)

## Focus

Question 4: which candidate change closes the measured gap at the lowest cost. The operator's candidates are tested against the failure points measured in iterations 1-3, not assumed: (A) acceptance criteria at the parent spec level, (B) a user story or purpose and problem section at the parent level, (C) an improved parent-specific spec template. The evidence from iterations 2-3 also supports two further candidates, (D) a purpose field in the continuity block and (E) a purpose line in the compaction or resume payload. Cost means files and subsystems touched, migration risk to the existing corpus, and whether the change reaches the hops where purpose is actually read.

## Findings

1. The measured failure has three distinct points, not one: the parent purpose is unvalidated and often empty, the save target has no purpose slot, and every recovery hop has no purpose slot. A candidate that fixes only authoring cannot close the hop gap, and a candidate that fixes only a hop has no reliable value to read. [INFERENCE: derived from iteration 3 findings 4-7 and iteration 2 findings 1-9]

2. Candidate A, parent-level acceptance criteria, does not carry purpose. `acceptance-criteria.md` holds METADATA, Given/When/Then CRITERIA and a CLOSURE STATEMENT, so it measures done, not why. Adding it to the parent also contradicts the lean-trio contract (`spec.md`, `description.json`, `graph-metadata.json`) and would require `FILE_EXISTS` and `AC_CLOSURE` changes plus a migration for 297 existing parents. Cost is high and purpose coverage is zero. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:226-228]

3. Candidate B, a parent-level user story or purpose and problem section, already exists in form. The phase-parent template ships §2 PROBLEM & PURPOSE with Problem Statement and Purpose and marks root purpose as REQUIRED parent content. What is missing is a real value and a reader: 68 parents have an empty Purpose, 8 hold the scaffold placeholder, and 4 hold create.sh's generic text, so 80 of 297 parents carry no real why. A new section would duplicate the existing one; the useful change is to make the existing section real. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-68] [INFERENCE: based on the 297-parent Purpose scan in iteration 3]

4. Candidate C, an improved parent-specific spec template, cannot close the gap alone. The template already demands root purpose; the failure is that a parent is exempt from anchor checks and its stamp is v2.2, so neither the missing section nor the placeholder is caught. Worse, `create.sh` substitutes a generic sentence for the parent purpose ("Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity"), which is a statement about documentation layout rather than about the work. A template edit without a stamp and validation change is authoring intent only. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:443] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876]

5. Candidate D, a purpose field in the `_memory.continuity` block, reaches more hops per unit of change than any other candidate. The block is already present in 2,857 of 2,870 implementation summaries, is the second rung of the resume ladder, and is rendered into the compaction snapshot by `buildContinuityFacets`. One added field therefore travels on save, resume and compaction at once, and the existing `Goal` facet can render the purpose instead of `next_safe_action`. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:106-110] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:104-115]

6. Candidate D's cost is bounded to one subsystem and has no corpus migration. The touch points are the `ThinContinuityRecord` interface and validator, the `generate-context.js` payload/help fields and carry path, the `buildContinuityFacets` source, and their tests. The field can be optional with a fallback, so no existing packet fails validation and no new required file appears. The value can be sourced from the packet's own `spec.md` Purpose, or from the nearest ancestor with a real purpose when the packet is a phase child, using the same parent walk the save path already performs for phase-parent pointers. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:133-146] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:610-624]

7. Candidate E, a purpose line in the resume or compaction payload, is cheaper per file but weaker in coverage: the compaction brief is built from transcript analysis and would need a disk read inside a hook with a tight budget, while the resume output contract is a presentation change that only helps the resume hop. It is a complement to D, not a substitute: once the continuity block carries purpose, both surfaces can read it with no extra packet read. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:169-174]

8. The smallest authoring-side fix that pairs with D is a two-line generator change: stop substituting a generic parent purpose in `create.sh` and let the template placeholder reach the file, so `PLACEHOLDER_FILLED` fails a Draft parent until a real why is authored; bump the phase-parent stamp to v2.4 in the same change so the parent gains the required `problem` anchor, grandfathering existing parents under the documented tolerant policy. This closes the 80-of-297 authoring gap without a new document and without retrofitting the backlog. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:80] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:228]

9. Ranked by coverage per unit of migration risk: D first, the generator/stamp fix second, E third, B as the content prerequisite it always was, and A last. The evidence does not support any candidate that adds a new parent-level document; it supports making the existing parent purpose real and making the existing continuity block carry it. [INFERENCE: ranking from findings 1-8 and the measured failure points]

## Ruled Out

- Candidate A as a purpose mechanism: acceptance criteria measure completion and have no why slot; adding them at the parent also breaks the lean-trio contract.
- Candidate C as a standalone fix: the parent template already requires root purpose; without a stamp/validation change and a real value, a template edit changes nothing measured.
- Adding a new parent-level document to carry purpose: the parent already has exactly one prose document, and the measured problem is that its purpose is empty or generic, not that a document is missing.

## Dead Ends

- Looking for a validator rule that grades the content of a purpose statement: `ANCHORS_VALID` grades presence, and `PLACEHOLDER_FILLED` grades only template tokens. No rule judges whether the sentence says anything. Candidate for "Exhausted Approaches": searching for semantic purpose validation.

## Edge Cases

- Ambiguous input: "lowest cost" could mean lines changed, files touched, or migration risk. Selected interpretation: coverage of the measured hop failure per unit of migration risk, because a cheap change that reaches no hop does not close the gap.
- Contradictory evidence: the operator's candidate B is described as a proposed change, but the template already implements it. Both readings are preserved: the section exists (form) and the purpose is empty or generic in 80 of 297 parents (substance).
- Missing dependencies: none. All candidate surfaces were readable.
- Partial success: the cost estimates are structural (files/subsystems and migration risk), not measured engineer-hours; no timing data exists in the repository for comparable changes.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83
- .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37,63-68,80
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md:226-228,443,449
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876
- .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73
- .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:104-115
- .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:133-146,610-624
- .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384
- .skilled/commands/speckit/assets/speckit-resume-auto.yaml:106-110,169-174
- Iteration 3 parent-purpose scan (297 parents: 68 empty, 8 placeholder, 4 generic)

## Assessment

- New information ratio: 0.94
- Questions addressed: Q4
- Questions answered: Q4

## Reflection

- What worked and why: testing each candidate against the three measured failure points produced a clear ordering. The decisive discovery was that candidate B already exists in the template and candidate C's gap is a v2.2 stamp plus a generator default, not a missing section. The continuity block then emerged as the only surface that is both ubiquitous and read by multiple hops.
- What did not work and why: an early framing treated the choice as "template or runtime". The corpus evidence shows the real split is "authoring value" versus "carrier", and the cheapest carrier is the continuity block, not a new document.
- What I would do differently: the final iteration should attack the recommendation rather than defend it: what would make the continuity-field change fail, which evidence would overturn it, and what is definitively ruled out.

## Recommended Next Focus

Question 5: what is ruled out and why. Then stress the Q4 recommendation for failure modes (a field that no writer populates, a phase child whose parent purpose is itself empty, hook budget, schema churn) and record the strongest counter-evidence before synthesis.