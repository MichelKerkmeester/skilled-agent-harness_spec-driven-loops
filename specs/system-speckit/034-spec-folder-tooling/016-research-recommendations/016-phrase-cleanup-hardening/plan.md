---
title: "Plan: Phrase cleanup hardening"
description: "How this phase will be built."
trigger_phrases:
  - "phrase cleanup hardening"
  - "phrase census and cleanup plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phrase cleanup hardening

<!-- ANCHOR:plan -->

## 1. Technical Context

The phrase cleanup family consists of two tools:
- `template-phrase-census.mjs`: scans documents and reports what trigger phrases are present or missing.
- `template-phrase-cleanup.mjs`: applies updates to trigger phrase lists, with a dry-run and apply mode.

The census tool recognizes only five document kinds (spec, acceptance-criteria, plan, tasks, implementation-summary). The templates directory holds 18 template files with `trigger_phrases`, of which 13 are add-on kinds (like goal, before-after, changelog, etc.); these are never seeded and retain their template defaults.

The cleanup tool writes files at line 420 using `fs.writeFileSync()`, then reads them back to compute a hash. If a crash occurs between write and read, the file is left partially written but the tool cannot detect it. Additionally, files with no frontmatter at all are skipped rather than routed to a fixer.

## 2. Approach

### 2.1 Atomic Write Implementation

- Review `template-phrase-cleanup.mjs:410-427` where the write happens.
- Replace `fs.writeFileSync()` with temp+rename: write to a temp file in the same directory, then `fs.renameSync()` to the target. This is atomic on most filesystems.
- Keep the before/after hash recording after the write succeeds.
- Add a test that simulates a process kill during write and confirms the original file is unchanged.

### 2.2 Seed Recipes for 18 Document Kinds

- Search `.skilled/skills/system-spec-kit/templates/` for all `.tmpl` files with `trigger_phrases`.
- Build a mapping table of template path to template kind (e.g., `templates/core/spec.md.tmpl` -> spec, `templates/packet-types/phase-parent.spec.md.tmpl` -> phase-parent-spec).
- Define default phrases for each of the 18 kinds, reading from the existing template files.
- Extend `create.sh:403-432` seeding to initialize all 18 kinds.
- Add the recipes to `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` in the pin test section.

### 2.3 No-Frontmatter Routing

- In `template-phrase-cleanup.mjs`, detect files with no frontmatter.
- Instead of skipping, report them for routing to `fill-frontmatter` or another fixer.
- Update the return object to track which files were routed vs. skipped.

### 2.4 Pre-commit Phrase-Judge Lint

- Identify the phrase-judge criteria (located in `../retrieval/lib/phrase-judge.mjs` or similar).
- Add a new step to the pre-commit hook (`.skilled/scripts/git-hooks/pre-commit`) that:
  - Detects staged files with frontmatter changes.
  - Extracts the `trigger_phrases` the commit adds, by comparing the staged frontmatter with HEAD.
  - Calls the phrase-judge to grade each added phrase.
  - Blocks the commit only on `template-default` and `editor-fallback`, decided 2026-10-08 by the operator.
  - Prints a warning, without blocking, for every other negative class.
- Honours `SPECKIT_SKIP_PHRASE_LINT=1` as its bypass, like the hook's other `SPECKIT_SKIP_*` gates.
- Document the lint in the hook file and in `.skilled/scripts/git-hooks/README.md` if it exists.

## 3. Affected Surfaces

### Files to Modify

| Surface | Count | Details |
|---------|-------|---------|
| Cleanup tool | 1 | `template-phrase-cleanup.mjs` |
| Census tool | 1 | `template-phrase-census.mjs` |
| Create script | 1 | `create.sh` seeding logic |
| Tests | 2+ | Pin test for recipes, new atomic write test |
| Pre-commit hook | 1 | `.skilled/scripts/git-hooks/pre-commit` |

### Files to Create or Add To

| File | Purpose |
|------|---------|
| Pre-commit lint module | New helper to validate frontmatter with phrase-judge |

## 4. Testing Strategy

### Pre-write Tests

- Unit test: atomic write with simulated crash
- Unit test: no-frontmatter detection and routing
- Unit test: seed recipes for each of the 18 kinds
- Integration test: cleanup with new seed recipes produces correct output
- Hook test: an added `template-default` phrase blocks, an added `single-token` phrase only warns, an existing phrase is not graded, and `SPECKIT_SKIP_PHRASE_LINT=1` skips the lint

### Regression Tests

- Run existing cleanup tests to confirm no behavior change
- Run census tests to confirm seed recipes integrate correctly
- Run create.sh tests to confirm seeding still works
- Confirm the lint calls the phrase-judge (not skipped)

## 5. Dependencies

- All phases of the parent are independent; this phase has no hard dependencies.
- The phrase-judge module must be available and testable.
- The template files in `templates/` must not be modified.

## 6. Rollback

- Revert the commits that modified the three tool files and the hook.
- Confirm cleanup still works with the old non-atomic write.
- Confirm pre-commit hook still works without the new lint.

## 7. Confidence and Risks

### Low Risk

- Atomic write is a well-known pattern (temp file + rename).
- Seed recipes are data, not code logic.
- Pre-commit lint is additive and can be bypassed.
- No changes to runtime API or behavior.

### Mitigation

- Test atomic write on multiple filesystems if possible.
- Validate seed recipes by running census on a test corpus.
- Test pre-commit lint with both valid and invalid frontmatter.
- Run full test suite before committing.

## 8. Metadata and References

- **Research evidence**: `../../014-spec-auto-healing-research/research/research.md` section 8.2, V39
- **Cleanup tool**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` lines 32-38, 410-427
- **Census tool**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`
- **Pin test**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`
- **Pre-commit hook**: `.skilled/scripts/git-hooks/pre-commit`

<!-- /ANCHOR:plan -->
