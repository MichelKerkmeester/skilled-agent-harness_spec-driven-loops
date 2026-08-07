---
title: "Tasks: align the playbook generator + confirm convention docs"
description: "Task breakdown for the generator-alignment pass."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/002-generator-alignment"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Implement the generator fix (playbook-generator.cjs id/filename derivation)"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Align the Playbook Generator + Confirm Convention Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Read `playbook-generator.cjs` in full; locate every use of the `AG-NNN` id/filename pattern (confirmed at
      ~line 169 and ~line 184; check for any other use sites in the same file).
- [ ] Grep the two convention SKILL.md files + templates + four `/create:*` generator YAMLs for numbered
      per-feature filename mandates/examples (baseline evidence for R4).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Replace the `spec.id = AG-${String(i + 1).padStart(3, '0')}` ordinal derivation with a descriptive-slug
      derivation from the scenario intent.
- [ ] Update the staging file write to use the slug filename instead of `${spec.id}.md`.
- [ ] Add an optional `stage:` frontmatter field (default `routing`) to generated scenario output.
- [ ] Add a minimal same-directory slug-collision check with a deterministic disambiguator fallback.
- [ ] Fix any surviving numbered per-feature filename mandate/example found in the convention docs, templates,
      or generators (expected: none — verify only).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Dry-run the generator against a sample skill; confirm output filenames are slugs, not `AG-NNN`.
- [ ] Confirm the generator's output loads cleanly through the number-agnostic benchmark loader.
- [ ] Grep confirms zero surviving numbered per-feature mandate/example in the convention surfaces.
- [ ] `validate.sh --strict` on this phase folder is Errors 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
`playbook-generator.cjs` emits only slug-named scenario files (optionally carrying `stage:`); the sk-doc
convention docs, templates, and `/create:*` generators are confirmed (or fixed) to already forbid numbered
per-feature filenames.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Foundation phase alongside 001-loader-and-guard; both must land before 004-execute-migration renames the
existing 111 files. Consistent with the parent packet's decision record (slug-canonical, tolerate-then-rename
sequencing, explicit `stage:` grouping).
<!-- /ANCHOR:cross-refs -->
