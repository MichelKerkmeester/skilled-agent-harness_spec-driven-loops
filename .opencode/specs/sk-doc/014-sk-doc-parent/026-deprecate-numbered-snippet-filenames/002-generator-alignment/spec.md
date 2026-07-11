---
title: "Spec: Align the playbook generator + confirm convention docs emit only slug filenames"
description: "Phase 002 of the numbered-snippet-filename deprecation. Fix playbook-generator.cjs so it emits descriptive-slug scenario filenames (with an optional stage: frontmatter field) instead of AG-NNN.md, and re-verify that the sk-doc convention docs (create-feature-catalog, create-manual-testing-playbook), their templates, and the four /create:* generator YAMLs already forbid numbered per-feature filenames. Small foundation phase — no folders renamed, no existing files touched here."
trigger_phrases:
  - "align playbook generator slug filenames"
  - "de-number playbook-generator.cjs"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/002-generator-alignment"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement the generator fix (playbook-generator.cjs id/filename derivation)"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Align the Playbook Generator + Confirm Convention Docs Emit Only Slug Filenames

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 026/002-generator-alignment |
| **Level** | 1 |
| **Status** | Planned |
| **Phase** | 002 of 005 (foundation) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
`playbook-generator.cjs` is the one live generator that still produces the numbered-filename anti-pattern at the
per-scenario file level: it computes `spec.id` as an ordinal (`AG-${String(i + 1).padStart(3, '0')}`) and writes
the staged scenario file as `${spec.id}.md`. Every other path that could reintroduce the pattern — the two sk-doc
convention skills (`create-feature-catalog`, `create-manual-testing-playbook`), their asset templates, and the
four `/create:*` command generator YAMLs — was already corrected at the folder-naming layer by the sibling
packet's convention-docs phase, and is expected (not assumed) to already forbid numbered per-feature filenames
too. This phase makes the generator emit a descriptive-slug filename instead of the ordinal, and re-verifies the
convention surfaces so nothing regenerates the anti-pattern once the existing 111 files are renamed. It is
foundation work: it must land before the migration phase renames anything, otherwise a playbook regenerated
mid-migration would put the numbered form straight back.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope:**
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs` — the
  `spec.id` assignment (currently `AG-${String(i + 1).padStart(3, '0')}`, ~line 169) and the staging file write
  that names the output `${spec.id}.md` (~line 184). Replace the ordinal-based id/filename derivation with a
  descriptive slug derived from the scenario's intent, and add an optional `stage:` frontmatter field to
  generated scenarios (default `routing`) consistent with the operator's routing/holdout/negative grouping
  decision.
- Re-verification of `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md`,
  `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md`, their asset templates, and the four
  `/create:*` command generator YAMLs — confirm they already document and emit bare-slug per-feature filenames
  only. No edits are expected here (the folder-naming layer was already fixed by the prior convention-docs
  phase); if a surviving numbered-filename mandate or example is found, fix it as part of this phase rather than
  deferring it.

**Out of scope:** the benchmark loader's file-selection gate (already handled by the foundation loader phase);
the migration/rename engine that will touch the 111 existing files; actually renaming those existing files; the
re-benchmark and no-new-numbered-snippet guard proof (later verification phase).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** `playbook-generator.cjs` no longer derives the staged scenario filename from an `AG-NNN` ordinal; the
  filename is a descriptive slug derived from the scenario's intent.
- **R2:** The generator continues to emit an `id:` frontmatter field on each scenario (the identity key the
  loader and downstream tooling key off of) — the filename change does not disturb that identity semantics.
- **R3:** The generator optionally emits a `stage:` frontmatter field (default `routing`) on generated
  scenarios, matching the field the tolerant loader is expected to read.
- **R4:** Grep of the two convention SKILL.md files, their templates, and the four `/create:*` generator YAMLs
  shows zero mandate or example that names a per-feature scenario file with a numeric ordinal prefix (excluding
  historical or changelog text).
- **R5:** The generator performs a basic same-directory collision check on its own slug output, with a
  deterministic disambiguator fallback (not the full migration-engine collision logic — just enough that the
  generator itself cannot silently overwrite a sibling file).
- **R6:** Generator output remains loadable by the number-agnostic benchmark loader — no new incompatibility is
  introduced between the generator's output shape and the loader's expected input shape.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A manual dry run of `playbook-generator.cjs` against a sample skill produces slug-named `.md` files, not
   `AG-NNN.md` files.
2. Grep across the two convention SKILL.md files, their templates, and the four `/create:*` generator YAMLs for
   a numbered per-feature filename mandate or example returns zero hits (excluding historical prose) —
   confirming the convention was already covered, or recording the one fix if a gap is found.
3. `validate.sh --strict` on this phase folder is Errors 0.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Risk:* `spec.id` may be read elsewhere in the same file (or by a caller) as more than a filename stem —
  changing its derivation without reading the full function first could silently change the loadable identity
  key rather than just the filename.
- *Risk:* two distinct scenario intents could slugify to the same string inside a single generator run; the
  collision check (R5) needs a deterministic fallback, not a silent overwrite.
- *Dependency:* none blocking on sibling phases — this can run in parallel with the loader-and-guard foundation
  phase — but both must land before the execute-migration phase touches the existing 111 files.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None — the stage-field decision and the slug-is-canonical decision are already locked by the parent packet's
decision record; this phase implements the generator side of those decisions.
<!-- /ANCHOR:questions -->
