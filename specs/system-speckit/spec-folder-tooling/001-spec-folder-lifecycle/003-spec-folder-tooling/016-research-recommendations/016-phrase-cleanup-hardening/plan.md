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

Before this phase, the census tool recognized only five document kinds (spec, acceptance-criteria, plan, tasks, implementation-summary). The templates directory holds 18 template files with `trigger_phrases`, of which 13 are add-on kinds (decision-record, the phase-parent, review and research specs, resource-map, handover, debug-delegation, research, before-after, timeline, roadmap, review-report and goal); these were never seeded and kept their template defaults.

Before this phase, the cleanup tool wrote files at line 420 using `fs.writeFileSync()`, then read them back to compute a hash. If a crash occurred between write and read, the file was left partially written and the tool could not detect it. Additionally, files with no frontmatter at all were skipped rather than routed to a fixer.

## 2. Approach

### 2.1 Atomic Write Implementation

- Review the write in `runCleanup` (line 420 before the build, now the call at `template-phrase-cleanup.mjs:509`).
- Replace `fs.writeFileSync()` with temp+rename: write to a temp file in the same directory, opened with the target's mode, then `fs.renameSync()` to the target (`writeFileAtomically`, line 224). This is atomic on most filesystems.
- Keep the before/after hash recording after the write succeeds.
- Add a test that injects a failing rename and confirms the original file is unchanged and no temp file is left. The built test injects the failure instead of killing a process.

### 2.2 Seed Recipes for 18 Document Kinds

- Search `.skilled/skills/system-spec-kit/templates/` for all `.tmpl` files with `trigger_phrases`.
- Build a mapping table of template path to template kind (e.g., `templates/core/spec.md.tmpl` -> spec, `templates/packet-types/phase-parent.spec.md.tmpl` -> phase-parent-spec). The phase-parent, review and research kinds all render into `spec.md`, so `documentKindForPath` tells them apart by their template marker, not by file name.
- Define default phrases for each of the 18 kinds, reading from the existing template files.
- Extend `create.sh` seeding to initialize all 18 kinds: a `seed_template_document` helper (line 394) and one default list per new kind inside `replace_template_default_trigger_phrases`.
- Add the recipes to `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` in the pin test section.

### 2.3 No-Frontmatter Routing

- In `template-phrase-cleanup.mjs`, detect files with no frontmatter.
- Instead of skipping, report them for routing to `fill-frontmatter` (the `upgrade-legacy.mjs` fixer). Only a missing opening delimiter routes; other malformed frontmatter is still skipped.
- Update the return object to track which files were routed vs. skipped (`routed`, with the fixer path, its arguments and a runnable command). The tool reports the route and does not run the fixer.

### 2.4 Pre-commit Phrase-Judge Lint

- Identify the phrase-judge criteria (located in `../retrieval/lib/phrase-judge.mjs` or similar).
- Add a new step to the pre-commit hook (`.skilled/scripts/git-hooks/pre-commit`, lines 146 to 159) that runs the new `template-phrase-lint.mjs` and:
  - Detects staged files with frontmatter changes.
  - Extracts the `trigger_phrases` the commit adds, by comparing the staged frontmatter with HEAD.
  - Calls the phrase-judge to grade each added phrase.
  - Blocks the commit only on `template-default` and `editor-fallback`, decided 2026-10-08 by the operator.
  - Prints a warning, without blocking, for every other negative class.
- Honours `SPECKIT_SKIP_PHRASE_LINT=1` as its bypass, like the hook's other `SPECKIT_SKIP_*` gates.
- Document the lint in the hook file and in `.skilled/scripts/git-hooks/README.md`.
- Register the gate as `templatePhraseLint` in `.skilled/scripts/git-hooks/lib/gates.tsv`, so `/doctor:git hooks` lists it and the persistent `speckit.hooks.templatePhraseLint` switch reads it. The review added this step.
- If the linter, `node` or git is unavailable, warn and let the commit through; only a newly added blocking phrase fails.

## 3. Affected Surfaces

### Files to Modify

| Surface | Count | Details |
|---------|-------|---------|
| Cleanup tool | 1 | `template-phrase-cleanup.mjs` |
| Census tool | 1 | `template-phrase-census.mjs` |
| Create script | 1 | `create.sh` seeding logic |
| Tests | 4 | `create-root-numbering.vitest.ts` (modified), plus `template-phrase-cleanup-hardening.vitest.ts`, `template-phrase-lint-hook.vitest.ts` and `template-phrase-integration.vitest.ts` (new) |
| Pre-commit hook | 3 | `.skilled/scripts/git-hooks/pre-commit`, plus `lib/gates.tsv` and `README.md` in the same folder |

### Files to Create or Add To

| File | Purpose |
|------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` | New helper that grades the trigger phrases a commit adds with phrase-judge |

## 4. Testing Strategy

### Pre-write Tests

- Unit test: atomic write with an injected rename failure
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

- Revert the commits that modified the three tool files, the hook, its `gates.tsv` row and its README text.
- Confirm cleanup still works with the old non-atomic write.
- Confirm pre-commit hook still works without the new lint.

## 7. Confidence and Risks

### Low Risk

- Atomic write is a well-known pattern (temp file + rename).
- Seed recipes are data, not code logic.
- Pre-commit lint is additive and can be bypassed.
- The only report change is a new `routed` list in the cleanup report, and a no-frontmatter file no longer counts as skipped.

### Mitigation

- Test atomic write on multiple filesystems if possible.
- Validate seed recipes by running census on a test corpus.
- Test pre-commit lint with both valid and invalid frontmatter.
- Run full test suite before committing.

## 8. Metadata and References

- **Research evidence**: `../../014-spec-auto-healing-research/research/research.md` section 8.2, V39
- **Cleanup tool**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`, the atomic write at line 224 and its call at line 509
- **Census tool**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`
- **Pin test**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`
- **Pre-commit hook**: `.skilled/scripts/git-hooks/pre-commit`

<!-- /ANCHOR:plan -->
