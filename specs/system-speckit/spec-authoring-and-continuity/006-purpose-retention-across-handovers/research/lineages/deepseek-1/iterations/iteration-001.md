# Iteration 1: Where problem, purpose and user need are written today, and what validation enforces

## Focus
Question 1 of section 7: where a packet's problem, purpose and user need are written today, per level and for a phase parent, and which of those places is required and validated. This iteration inventories the authoring surfaces (templates, level contract) and the enforcement path in the validator engine. Later iterations cover the hop surfaces (Q2), real packets (Q3), candidate changes (Q4) and ruled-out options (Q5).

## Actions Taken
1. Enumerated every template that carries purpose-bearing content under `.skilled/skills/system-spec-kit/templates/` and read the relevant sections of `core/spec.md.tmpl`, `packet-types/phase-parent.spec.md.tmpl`, `packet-types/research.spec.md.tmpl`, `addons/handover.md.tmpl`, `addons/goal.md.tmpl`, `addons/acceptance-criteria.md.tmpl`.
2. Read the level contract manifest `templates/spec-kit-docs.json` for levels 1, 2, phase and research: required core docs, required/optional/lazy addons, lifecycle-adjusted requirements and the per-document section-gate anchor tables.
3. Traced how the section-gate anchors are enforced: `runtime/lib/validation/orchestrator.ts` (`ANCHORS_VALID`, template-stamp token gate, phase-parent exemption) and `runtime/lib/validation/spec-doc-structure.ts` (`SPEC_DOC_SUFFICIENCY`).
4. Measured whether any validation code reads the purpose prose: case-insensitive `grep -ric "problem"` over `runtime/lib/validation/*.ts`, `runtime/cli/spec/validate.sh` and `runtime/cli/spec/progressive-validate.sh` returned **0** for every file.
5. Read the continuity block field list in `templates/core/implementation-summary.md.tmpl` and the handover template's section list, because those are the two surfaces a successor session actually reads.

## Findings
1. Every authored spec level writes the problem and purpose exactly once, in one section: `## 2. PROBLEM & PURPOSE` with `### Problem Statement` and `### Purpose`. The core template carries it for Levels 1-3 and 3+ [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:99-107]; the phase-parent template carries the same two subsections [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-72]; the research-record template carries it too [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/research.spec.md.tmpl:57-67].
2. "User need" has no dedicated authored field at Levels 1-2. The only `As a … I want … so that …` surface is `## 11. USER STORIES`, emitted inside an `<!-- IF level:3,3+ -->` block [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:326-347]. At Levels 1-2 the user need exists only as prose inside the Problem Statement, so nothing structural distinguishes it from the problem description.
3. The level contract requires only mechanical docs. Levels 1-3 require `spec.md`, `plan.md`, `tasks.md`; `implementation-summary.md` becomes required only after implementation starts; `handover.md`, `goal.md`, `timeline.md`, `decision-record.md` and `research/research.md` are `lazyAddonDocs` (scaffolded only on request), and `acceptance-criteria.md` is an optional addon at Levels 2-3, required only through the separate `AC_CLOSURE` rule [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:levels.1.requiredCoreDocs/lazyAddonDocs/optionalAddonDocs; .skilled/skills/system-spec-kit/references/structure/folder-structure.md:158-190].
4. The phase level requires `spec.md` alone, and its section-gate table declares `problem` as required for `spec.md` at `phase` [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:levels.phase.requiredCoreDocs; levels.phase.sectionGates["spec.md"].problem]. So the declared contract does name the purpose section as required at parent level.
5. Required-section enforcement exists but is gated on the template stamp. `ANCHORS_VALID` requires every anchor whose template section is a required H2, but only for documents carrying a `SPECKIT_TEMPLATE_SOURCE … v2.3` or newer stamp [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:758-768, 1028-1035]. A v2.4 `spec.md` that deletes the whole `PROBLEM & PURPOSE` section fails with a named missing anchor; an older, unstamped document keeps only the integrity check.
6. The phase parent is explicitly exempt from that check, so the parent's declared `problem` requirement is not executed. `ANCHORS_VALID` returns early for a folder classified as a phase parent with `'Phase parent lean document set accepted'` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:963-970]. The other sufficiency loop enforces missing anchors only for `timeline.md` and `goal.md` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1182-1191]. Net effect: a phase parent's `spec.md` can lose Problem & Purpose entirely and still validate.
7. No validation rule reads the purpose prose. Grep counts for `problem` are zero across the validator modules (measured this iteration), and the only content-shaped checks are placeholder tokens (`PLACEHOLDER_FILLED`) and the non-empty-anchor-body check, which fires only when an anchor is present and empty [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:752-756, 889-899; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1193-1200]. A spec that keeps the section and writes a vacuous sentence passes.
8. `goal.md` is the only surface with a durable one-line statement of intent: `## 1. DURABLE DIRECTIVE` / `**Objective:** [One sentence. What this packet is for…]`, and its anchors are required whenever the document exists [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:242-246]. It is a lazy addon, so a packet that did not ask for it has no durable directive at all [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:levels.1.lazyAddonDocs].
9. The two successor-facing surfaces carry no purpose field. `handover.md` has sections Handover Summary, Context Transfer, For Next Session, Validation Checklist, Session Notes and no problem/purpose heading [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37,50,84,107,121]; the `_memory.continuity` block carries `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions`, `answered_questions` and no purpose or problem key [SOURCE: .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:38-63]. `acceptance-criteria.md` likewise has no purpose column: `AC-ID`, `REQ`, `Given / When / Then`, `Verification`, `Status`, `Waiver` [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:57-66].

## Questions Answered
- Q1: Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated? — Answered by findings 1-9: written once in `PROBLEM & PURPOSE` at every level; "user need" as a distinct field exists only at Level 3+ (USER STORIES); the section is template-required and enforced for stamped Level 1/2/3 docs through `ANCHORS_VALID`, and declared-but-not-executed for phase parents; no rule validates the prose itself.

## Questions Remaining
2, 3, 4, 5.

## Ruled Out
- Treating `PLACEHOLDER_FILLED` as a purpose check. It only detects `[YOUR_VALUE_HERE:`/`[NEEDS_CLARIFICATION:` tokens; a filled but meaningless sentence passes, so it cannot be offered as the current purpose gate.
- Treating `acceptance-criteria.md` as a purpose surface. Its schema has no purpose or user-need column, so parent-level acceptance criteria would not, by themselves, carry the purpose.

## Dead Ends
- Searching for a dedicated "user need" or "user story" token below Level 3. The template emits USER STORIES only for `level:3,3+`; there is no L1/L2 equivalent to find.

## Edge Cases
- Ambiguous input: none. The question names the surfaces to inspect; the scope is the packet's authoring templates plus validator.
- Contradictory evidence: the manifest declares `problem` required for phase, while the validator exempts phase parents. Both are cited (findings 4 and 6) and the contradiction is recorded as a declared-vs-executed gap, not resolved into a single claim.
- Missing dependencies: none; all files were readable.
- Partial success: none.

## Sources Consulted
- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/packet-types/research.spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts`

## Assessment
- New information ratio: 1.0
- Questions addressed: Q1
- Questions answered: Q1

## Reflection
- What worked and why: going from the authoring template to the level-contract manifest to the two enforcement functions produced a chain that shows both the declared requirement and the executed check. The contradiction between them (phase: declared required, validator exempt) came from reading the manifest and the orchestrator in the same pass, which a template-only pass would have missed.
- What did not work and why: assuming the section-gate table alone decided enforcement. The gates are data; the executor decides, and both `ANCHORS_VALID` and `SPEC_DOC_SUFFICIENCY` narrow which documents they apply to.
- What I would do differently: measure the real packet corpus earlier, since template-declared requirements say little about what authors actually write.

## Recommended Next Focus
Q2: trace each hop surface (Claude `compact-inject.ts` and `session-prime.ts`, other runtimes' hooks, `/speckit:resume`, `/speckit:handoff`, `/speckit:save` + `generate-context.js`, deep-loop iteration prompts and child-dispatch briefs) for what each reads and emits, and whether the purpose travels.

## SCOPE VIOLATIONS
- None. Every write landed inside `research/lineages/deepseek-1/`; no researched file was modified.
