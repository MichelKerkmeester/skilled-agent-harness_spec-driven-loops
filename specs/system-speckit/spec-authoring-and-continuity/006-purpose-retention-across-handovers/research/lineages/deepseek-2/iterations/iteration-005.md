# Iteration 5: What is ruled out, and stress test of the recommendation (Q5)

## Focus

Question 5: what is ruled out, and why. This iteration consolidates every eliminated direction from iterations 1-4, records the reason and the evidence for each, adds the measurements that decide between the surviving candidates, and stress-tests the iteration-4 recommendation (a purpose field in the continuity block) for the failure modes that would overturn it.

## Findings

1. Ruled out: a new parent-level document (acceptance criteria or a dedicated purpose file). `acceptance-criteria.md` has no why slot (METADATA, Given/When/Then CRITERIA, CLOSURE STATEMENT), and any new required parent document breaks the lean-trio contract and forces `FILE_EXISTS` and `AC_CLOSURE` migrations across 297 existing parents. Reason: high cost, zero purpose coverage. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:226-228]

2. Ruled out: an improved parent template on its own. The template already requires root purpose; a parent is exempt from anchor checks and stamped v2.2, so the requirement has no enforcement, and `create.sh` fills the section with a generic sentence about documentation layout. Reason: it changes authoring intent, not the measured absence or the hop read. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:443] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876]

3. Ruled out: `handover.md` as the purpose carrier across saves. Its template has no purpose or problem slot, and 71 of 96 real packet handovers never use purpose, problem, objective or user-need vocabulary; only 9 carry a purpose-like heading. Reason: the document most associated with continuation does not carry the why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-84] [INFERENCE: based on the 96-handover scan in iteration 3]

4. Ruled out: the continuity block as it exists today. It is present in 2,857 of 2,870 implementation summaries, but its schema is action-and-state only and the save target has no purpose heading. Reason: ubiquity without a purpose field carries nothing; the block is the right carrier, not a current carrier. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73] [SOURCE: .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:85-149]

5. Ruled out: the compaction `Goal` facet as a purpose path. `buildContinuityFacets` fills the `goal` facet from `next_safe_action`, so the injected `### Goal` is an imperative action. Reason: the label is a false positive for purpose and must not be counted as coverage. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-303]

6. Ruled out: `/speckit:resume` as a purpose carrier in its current contract. Its resume packet has `now|last|next|blockers|artifact` and no purpose slot, and the workflow contradicts itself on whether `spec.md` is read at all. Reason: even a full spec read cannot surface purpose through the current output contract. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:159-174] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92-93]

7. Ruled out: the relaunch note as the durable compensation. The note is written to `.skilled/skills/.state/session-relaunch/handoffs/`, which is runtime state, not a packet artifact; no notes existed in the checkout, and `validate.sh` never sees them. Reason: it cannot accumulate a purpose history or be validated, and it depends on free-authored Goal text. [SOURCE: .skilled/commands/speckit/handoff.md:28-37]

8. Ruled out: `goal.md` as the general-purpose carrier. 889 of 2,912 spec folders (30.5%) carry a `goal.md`, 884 of those have a real Objective, and where both exist the Objective and the spec Purpose overlap at a median Jaccard of 0.256, with 132 of 854 pairs below 0.10. Reason: coverage is a minority and the two statements often say different things, so a goal pointer is a supplement for the packets that have one, not the fix. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41] [INFERENCE: based on a goals-vs-purposes comparison over specs/, run 2026-11-13]

9. Ruled out: a validator-only fix. `ANCHORS_VALID` grades anchor presence and `PLACEHOLDER_FILLED` grades unfilled template tokens; neither judges whether the purpose says anything, and hard enforcement would fail the 80 parents whose purpose is empty, placeholder or generic unless the existing corpus is grandfathered. Reason: a validator can force a non-empty string, not a real reason, and a fail-closed rule has a 297-packet migration cost. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57]

10. The user-need half of the problem is absent even where purpose is written. Of 2,866 real Purpose paragraphs, 333 (11.6%) mention a user, operator, reader or other beneficiary; Problem Statements do better at 623 of 2,884 (21.6%) but still leave four in five silent about whom the work serves. Any carried value must therefore include the Problem Statement, not only the Purpose sentence, or the who is still lost. [INFERENCE: based on beneficiary-word scans over specs/**/spec.md, run 2026-11-13]

11. Stress test of the recommendation: a continuity `purpose` field survives the failure modes if (a) the writer always attempts population with a leaf → nearest-ancestor fallback, using the parent walk the save already performs; (b) an unset value renders as an explicit "not recorded" marker rather than a generic sentence; (c) the field is optional, so no existing record fails validation; and (d) the authoring fix lands, because a phase child whose parent purpose is empty has nothing to inherit. Counter-evidence that would overturn it is a ubiquitous surface already read by every hop; the measurements found none: handover is often purpose-free, `goal.md` covers 30.5%, the continuity block is ubiquitous but currently purpose-blind, and the compaction and resume surfaces have no purpose slot. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:610-624] [INFERENCE: derived from findings 1-10 and iterations 2-4]

## Ruled Out

- New parent-level document (acceptance criteria or dedicated purpose file): no purpose slot, lean-trio conflict, 297-parent migration.
- Parent template alone: already requires root purpose; no enforcement and a generic generator default.
- `handover.md` as the carrier: no slot, 71/96 real handovers omit purpose vocabulary.
- The continuity block as it stands: ubiquitous but purpose-blind.
- The compaction `Goal` facet: it is `next_safe_action`.
- `/speckit:resume` as it stands: no purpose slot, contradictory spec.md read.
- The relaunch note: ephemeral, gitignored runtime state, unvalidated.
- `goal.md` as the general carrier: 30.5% coverage and a median 0.256 overlap with Purpose.
- A validator-only fix: presence and token checks cannot grade meaning, and fail-closed enforcement has a 297-packet migration cost.
- Relying on children to restate the parent naturally: 0 of 1,029 pairs share a 60-character run and the median overlap is 0.067.

## Dead Ends

- Searching for a semantic purpose validator: none exists; `ANCHORS_VALID` and `PLACEHOLDER_FILLED` are structural only. This is the second iteration on this path; promote to "Exhausted Approaches".
- Searching for a real relaunch note to sample: the handoffs directory is empty and gitignored; there is no packet-level history to measure.

## Edge Cases

- Ambiguous input: "ruled out" could mean candidates only or every failed investigative path. Selected interpretation: both, with candidates first and investigative dead ends last.
- Contradictory evidence: `goal.md` looks like a purpose carrier (its directive asks what the packet is for) yet its content overlaps the spec Purpose at only 0.256 and exists in 30.5% of packets. Both claims are recorded; it is a partial carrier, not the fix.
- Missing dependencies: none. All measured surfaces were readable.
- Partial success: the beneficiary scan is lexical (user/operator/reader/who). It undercounts implicit beneficiaries such as "the next session" or "CI", so 11.6% and 21.6% are lower bounds on who-mentions, not exact rates.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83
- .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-84
- .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41
- .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:85-149
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57,226-228,443,449
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876
- .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73,289-303
- .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:610-624
- .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92-93,159-174
- .skilled/commands/speckit/handoff.md:28-37
- specs/**/spec.md (2,866 Purpose paragraphs, 2,884 Problem Statements, 889 goal.md files, 854 objective/purpose pairs)

## Assessment

- New information ratio: 0.87
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- What worked and why: consolidating every elimination and then attacking the surviving recommendation produced the two measurements that decide it: user-need vocabulary is rare even in real purposes, and goal.md is a minority carrier with low overlap. Both point at the same design constraint: the carried value must include the problem, not just a purpose phrase.
- What did not work and why: an earlier draft treated the continuity field as a complete fix. The 80-of-297 empty parent purposes and the 11.6% user-mention rate show it needs an authoring dependency and a problem-inclusive payload.
- What I would do differently: synthesis should present the recommendation as a pair (carrier plus authoring fix) with an explicit fallback, because either half alone leaves a measured hole.

## Recommended Next Focus

Synthesis: consolidate Q1-Q5 into `research.md`, name the paired recommendation with its cost and validation, list the ruled-out directions, and record the convergence report with stop reason `maxIterationsReached`.