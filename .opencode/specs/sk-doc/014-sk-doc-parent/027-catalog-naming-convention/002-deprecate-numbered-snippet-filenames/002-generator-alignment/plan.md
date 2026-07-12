---
title: "Plan: align the playbook generator + confirm convention docs"
description: "Fix playbook-generator.cjs to emit descriptive-slug scenario filenames with an optional stage: field instead of AG-NNN.md, and re-verify the sk-doc convention docs + /create:* generators already forbid numbered per-feature filenames."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/002-generator-alignment"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Implement the generator fix (playbook-generator.cjs id/filename derivation)"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Align the Playbook Generator + Confirm Convention Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
A small, single-file code fix plus a re-verification pass. Change `playbook-generator.cjs` so it emits
descriptive-slug scenario filenames (with an optional `stage:` frontmatter field) instead of `AG-NNN.md`, and
confirm — with no change expected — that the sk-doc convention docs and `/create:*` generators already forbid
numbered per-feature filenames.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Grep shows zero surviving numbered per-feature mandate/example in the two convention skills + templates + four
`/create:*` generators; `playbook-generator.cjs` no longer emits `AG-NNN.md`; a sample generator dry run
produces slug filenames that load cleanly through the number-agnostic benchmark loader; `validate.sh --strict`
Errors 0; comment hygiene — no spec/ADR ids embedded in any code comment touched here.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`playbook-generator.cjs` synthesizes benchmark scenario specs from a skill's declared intents and writes each
one into a staging directory as a `.md` file with YAML frontmatter. The `spec.id` derivation and the staging
filename are currently the same ordinal value, which is the one remaining coupling point between "scenario
identity" and "the numbered anti-pattern." The sk-doc convention skills (`create-feature-catalog`,
`create-manual-testing-playbook`) are the authored source of truth that human authors and other generators
follow; the folder-naming layer of that convention was already updated by the sibling convention-docs phase —
this phase checks the file-naming layer specifically, since that phase's scope was folders, not per-feature
files.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Read `playbook-generator.cjs` in full (not just the two known line numbers) to find every place `spec.id` or
   the `AG-` pattern is produced or consumed, including any downstream use inside the same file.
2. Replace the ordinal id/filename derivation with a descriptive-slug derivation from the scenario's intent
   text, keeping the `id:` frontmatter field for identity; add an optional `stage:` frontmatter field (default
   `routing`) to generated output.
3. Add a minimal same-directory collision check for the generator's own output, with a deterministic
   disambiguator fallback if two intents slugify to the same string.
4. Grep the two sk-doc convention SKILL.md files, their templates, and the four `/create:*` generator YAMLs for
   any surviving numbered per-feature filename mandate or example; fix it if found, otherwise record the
   verification as a pass.
5. Dry-run the generator against a sample skill; confirm the output loads cleanly through the number-agnostic
   benchmark loader; run `validate.sh --strict`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Manual dry run of the generator against a sample skill (there is no existing automated test that exercises this
code path). Grep verification of the two convention docs, their templates, and the four `/create:*` generator
YAMLs. Confirm the generator's slug-named output round-trips through the number-agnostic loader without error.
`validate.sh --strict` on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Independent of the migration-tooling phase — different code path entirely. Foundation alongside the
loader-and-guard phase; both can proceed in parallel, but both must land before the execute-migration phase
renames the existing 111 files, so a playbook regenerated during or after migration cannot reintroduce the
numbered filename form.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git checkout` `playbook-generator.cjs` (single file). The convention-docs re-verification makes no edits unless
a gap is found, in which case `git checkout` the affected convention file(s). No runtime state changes, no
migration executed by this phase.
<!-- /ANCHOR:rollback -->
