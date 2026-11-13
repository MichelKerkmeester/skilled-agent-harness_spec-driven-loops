# Iteration 1: Where problem, purpose and user need are written today (Q1)

## Focus

Question 1: where a packet's problem, purpose and user need are written today, per level and for a phase parent, and which of those places is required and validated. Scope: template sources under `.skilled/skills/system-spec-kit/templates`, the level contract in `references/structure/folder-structure.md`, the phase contract in `references/structure/phase-definitions.md`, the validation contract in `references/validation/validation-rules.md`, and the continuity record schema in `runtime/lib/continuity/thin-continuity-record.ts`.

## Findings

1. For a standard packet the only authored purpose carrier is `spec.md` §2 "PROBLEM & PURPOSE", which holds a Problem Statement and a one-sentence Purpose. The core template ships the `problem` anchor, and Level 2 requires the anchors `metadata, problem, scope, requirements, success-criteria, risks, questions`. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:100-112] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/template-structure.vitest.ts:74-83]

2. The `problem` anchor is enforced only as a structural presence check. A document stamped `SPECKIT_TEMPLATE_SOURCE` v2.3 or later fails with `required anchor '<id>' is missing` for each anchor its rendered template requires; a v2.2 or unstamped document keeps integrity-only checking. Content inside the anchor is never graded beyond unfilled template tokens. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57]

3. File-level requirements rise with level while the purpose carrier stays the same single section: Level 1 requires `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`; Level 2 adds `acceptance-criteria.md`; Level 3 keeps that set with `decision-record.md` as a lazy add-on. No level requires a separate problem, purpose or user-story document. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:218-223]

4. A phase parent is a weaker contract: `FILE_EXISTS` accepts only the lean trio `spec.md`, `description.json`, `graph-metadata.json`, and heavy docs live in the children. The parent therefore has exactly one prose document in which purpose could live. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:144-146] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:226-228]

5. The phase-parent spec template does demand purpose at authoring time: its authoring contract lists "Root purpose: what problem does this entire phased decomposition solve?" as REQUIRED parent content, and its body has Problem Statement and Purpose subsections plus a note that this spec is the only authored parent document. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:65-71]

6. That parent purpose requirement is not validated. Phase parents are explicitly exempt from anchor checks, and the phase-parent template is stamped v2.2, so the v2.3+ required-anchor rule never fires for a parent. A parent can therefore ship with an empty or stale Problem & Purpose and still pass `--strict`. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:443] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:80]

7. Two secondary purpose carriers exist but neither is required. `goal.md`'s "Durable Directive" asks for one sentence on "What this packet is for", yet `goal.md` is absent from every level's required-file list and is authored only on request through the goal workflow. `description.json` carries a one-line `description`, which is the only purpose-shaped field present at every level including a phase parent. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:218-228] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/description.json:2-9]

8. No template or validator surface uses the term "user need". A repository-wide search over templates, commands, runtime and the research packet found the phrase only in this packet's own spec and tasks; the nearest authored slot is the one-sentence Purpose, and the nearest machine-readable slot is the one-line `description.json` description. [INFERENCE: based on a case-insensitive search of .skilled/skills/system-spec-kit, .skilled/commands/speckit, .skilled/skills/system-deep-loop and specs/system-speckit for "user need", "whom it serves" and "who it serves", which returned hits only in packet 006 and its baseline copies] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md:36]

9. The continuity record that every save writes has no purpose field at all. `ThinContinuityRecord` is exactly `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action`, `blockers`, `key_files`, `session_dedup`, `session_ref`, `completion_pct`, `open_questions`, `answered_questions`; the closest purpose-like slot is `next_safe_action`, which is an action, not a reason. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73]

## Ruled Out

- Searching for a dedicated "user need" template: none exists, so the answer must name the nearest existing carrier rather than a purpose field. Recorded as finding 8 rather than an unanswered question.
- Treating `acceptance-criteria.md` as a purpose carrier: its sections are METADATA, CRITERIA (Given/When/Then rows) and CLOSURE STATEMENT, so it measures completion and carries no why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83]

## Dead Ends

- None at the Q1 level. The mechanism is fully described above.

## Edge Cases

- Ambiguous input: "per level" could mean documentation levels or phase levels. Selected interpretation: documentation Levels 1/2/3 plus the phase-parent level, because the question names both "per level" and "for a phase parent". Deferred: the `review` level, which is a separate lean shape and carries no purpose contract.
- Contradictory evidence: none in Q1. The phase-parent template demands root purpose while the validator exempts the parent; that is a policy gap, not a conflict between sources.
- Missing dependencies: none. All cited files were present.
- Partial success: none. Every planned Q1 source was read.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:100-112
- .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37,65-71,80
- .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41
- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83
- .skilled/skills/system-spec-kit/references/structure/folder-structure.md:158-199
- .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:144-146
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md:212-228,443,449
- .skilled/skills/system-spec-kit/runtime/cli/tests/template-structure.vitest.ts:74-83
- .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73
- specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/description.json:2-9
- specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md:36

## Assessment

- New information ratio: 0.94
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: reading the template, the level contract and the validator contract as three separate layers exposed the gap that neither layer alone shows. The template demands purpose; the file contract does not require a purpose document; the validator grades anchor presence only and exempts parents. That three-layer read is what turns "purpose is dropped" into a named mechanism.
- What did not work and why: a naive search for "purpose" returned mostly prose about the research topic rather than the template contract, because the phrase "PROBLEM & PURPOSE" is a heading rather than a field. Reading the template bodies was the recovery.
- What I would do differently: next iteration should trace the hop surfaces by reading the code that builds each injected context, not the reference prose that describes it, because prose and code disagree on whether `spec.md` is read (see iteration 2).

## Recommended Next Focus

Question 2: for each hop surface, what does it read and what does it emit, and does the purpose travel. Start with the compaction hooks and `buildContinuityFacets`, then `/speckit:resume`, `/speckit:handoff` and the relaunch note, then `generate-context.js`, then the deep-loop iteration prompt and child-dispatch briefs.