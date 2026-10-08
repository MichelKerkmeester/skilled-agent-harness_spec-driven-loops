---
title: "Tasks: Phrase cleanup hardening"
description: "Concrete tasks for building this phase. Every task is done and carries the evidence that closed it."
trigger_phrases:
  - "phrase cleanup hardening tasks"
  - "template phrase cleanup atomic writes"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phrase cleanup hardening

<!-- ANCHOR:tasks -->

Paths below are relative to the repository root. `CLI` stands for `.skilled/skills/system-spec-kit/runtime/cli`.

## Verification Checklist

- [x] All 18 template file kinds have been identified (`CLI/spec/template-phrase-census.mjs:28` lists 18 `TEMPLATE_FILES`; `rg -l '^trigger_phrases:' templates --glob '*.tmpl'` from the skill root finds 18 template files)
- [x] Atomic write implementation is complete and tested (`writeFileAtomically` at `CLI/spec/template-phrase-cleanup.mjs:224`; `CLI/tests/template-phrase-cleanup-hardening.vitest.ts` 3 passed)
- [x] Seed recipes are in the pin test for all 18 kinds (`CLI/tests/create-root-numbering.vitest.ts:402` pins 18 recipes; file 16 passed)
- [x] Pre-commit phrase-judge lint is integrated and working (`.skilled/scripts/git-hooks/pre-commit:146-159`; `CLI/tests/template-phrase-lint-hook.vitest.ts` runs the real hook, 6 passed)
- [x] No-frontmatter routing is implemented (`CLI/spec/template-phrase-cleanup.mjs:479` pushes a `fill-frontmatter` route; test at `CLI/tests/template-phrase-cleanup-hardening.vitest.ts:84`)
- [x] All existing tests still pass (the cli suite exits 0 with 1,682 passed against a baseline of 1,639; `CLI/tests/template-phrase-cleanup.vitest.ts` 17 passed unchanged)
- [x] Integration tests for the new features pass (`CLI/tests/template-phrase-integration.vitest.ts` 1 passed)

---

## Implementation Tasks

### T001: Discover All 18 Template Document Kinds

- [x] Search `.skilled/skills/system-spec-kit/templates/` for all `.tmpl` files with `trigger_phrases` (a ripgrep for `^trigger_phrases:` over `*.tmpl` finds 18 files: 10 in `addons`, 4 in `core`, 4 in `packet-types`)
- [x] For each file, create a mapping of template path to a unique kind identifier (some render the same basename, e.g., four templates render `spec.md`) (`TEMPLATE_FILES` at `CLI/spec/template-phrase-census.mjs:28` maps 18 kind ids to template paths; the phase-parent, review and research kinds share `spec.md` and are told apart by packet type through `documentKindForPath` at line 362)
- [x] Confirm each template has a `trigger_phrases` field with example phrases (the pin test throws when a template has no quoted `trigger_phrases` block, and it passes for all 18)
- [x] List all 18 kinds and their template sources (the `recipePins` table in `CLI/tests/create-root-numbering.vitest.ts:402`, and implementation-summary.md)
- [x] Create a reference table for T002 and T007 (done differently: the pin test table is the reference; no separate file was written)
- **Files affected**: `.skilled/skills/system-spec-kit/templates/*.tmpl` (read only; `git status` shows no `.tmpl` change)

### T002: Extract Default Seed Phrases for Each Kind

- [x] For each of the 18 document kinds, read the template to understand its purpose (the 13 new shell default lists at `CLI/spec/create.sh:456-525` copy each template's phrase block)
- [x] Design default trigger phrases that describe what the document is (done differently: one slug-plus-suffix phrase per kind, `<slug> <suffix>`, from `SEED_PHRASE_SUFFIXES` at `CLI/spec/template-phrase-cleanup.mjs:37`, for example `<slug> decision record`)
- [x] Confirm the phrases match the convention used by `phrase-judge.mjs` (the pin test grades every seeded phrase with `judgeTriggerPhrase` and expects `null` for all 18)
- [x] Document the phrases in a seed recipes file or directly in the test (directly in the test: `recipePins` at `CLI/tests/create-root-numbering.vitest.ts:402`)
- [x] Cross-check against existing phrase lists in live packets (not applicable: the live-packet cross-check was replaced by checking each shell list against its template block, and the census over `specs` recognizes all 18 kinds)
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`

### T003: Implement Atomic Write in Cleanup Tool

- [x] Read `template-phrase-cleanup.mjs:410-427` and understand the current write logic (the old `fs.writeFileSync` call sat in `runCleanup`; it now calls `writeFileAtomically` at `CLI/spec/template-phrase-cleanup.mjs:509`)
- [x] Choose an atomic write strategy: temp file + rename (recommended) (temp file in the same directory, then `fs.renameSync`, per goal D1)
- [x] Implement the atomic write (`CLI/spec/template-phrase-cleanup.mjs:224`):
  - [x] Write to a temp file in the same directory (done differently: the name is `.<file>.<pid>.<random>.tmp`, opened with `wx` and the target's mode, then `fchmod`ed so the umask cannot narrow it)
  - [x] Compute the hash of the temp file content (done differently: no hash of the temp file; `beforeHash` hashes the content read before the write, and `afterHash` hashes the target read back after the rename)
  - [x] If hash matches expected, rename temp to target (done differently: the rename runs after the full content is written and closed, without a pre-rename hash comparison)
  - [x] If error occurs, delete temp file (the `finally` block unlinks the temp file when it still exists; the rename-failure test finds no `.tmp` left)
  - [x] Report success only if rename completes (`changes` and `changed` update only after the call returns; a throw is reported as `write failed: ...` in `issues`)
- [x] Keep the hash verification step after write completes (`afterHash` is still read back at line 510)
- [x] Test the new write logic with a unit test (`CLI/tests/template-phrase-cleanup-hardening.vitest.ts`, see T004)
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`

### T004: Add Atomic Write Unit Test

- [x] Create a test that:
  - [x] Writes a file using the atomic logic (test at line 50 cleans a template-default spec and expects the seeded phrase in the file)
  - [x] Confirms the file has the correct content (same test, `toContain('  - "atomic file replacement fixture"')`, and the mode stays `0664` under a `022` umask)
  - [x] Simulates an error during write and confirms no partial file is left (done differently: the test at line 69 injects a failing `fs.renameSync` instead of killing a process, then expects the original bytes intact, `changed` 0 and no `.tmp` file)
  - [x] Verifies the hash check works correctly (the first test expects `beforeHash` and `afterHash` to be 64-character hex strings)
- [x] Run the test and confirm it passes (3 passed)
- [x] Document the test in the acceptance criteria (R1a, R1b and P3 cite it)
- **Files to create**: `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup-hardening.vitest.ts`

### T005: Update Census Tool with All 18 Kinds

- [x] Modify `template-phrase-census.mjs` to recognize all 18 template kinds (`CLI/spec/template-phrase-census.mjs:28-75`)
- [x] Extend the `DOCUMENT_KINDS` list to include all 18 kinds (currently hardcoded to five) (15 kinds by relative path at line 48, plus `phaseParentSpec`, `reviewSpec` and `researchSpec` resolved by packet type through `documentKindForPath` at line 362)
- [x] Extend the `TEMPLATE_FILES` mapping to all 18 template paths (18 entries at line 28)
- [x] Test the updated census on a test corpus with all 18 template types (a read-only run of `template-phrase-census.mjs --root specs --json` over the real corpus exits 0 and reports counts for all 18 kinds, the lowest being `debugDelegation` 1; the existing census cases in `CLI/tests/template-phrase-cleanup.vitest.ts` pass unchanged)
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`

### T006: Add Seed Recipes to Pin Test

- [x] Open `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`
- [x] Find the pin test section (around line 224) (the existing pins now sit above the new case; the new case starts at line 402)
- [x] Add seed recipe data for all 18 document kinds (`recipePins` holds 18 entries; the test asserts their document paths equal the manifest's `documents` keys and their kinds equal `loadTemplateDefaults()` keys)
- [x] Ensure the test covers the two-way pin (template defaults and `create.sh` seeding) (each of the 18 shell default lists is compared with its template block, and for the 13 new kinds the `seed_template_document` call site is asserted in the `create.sh` source)
- [x] Run the test and confirm it passes (`pins seed recipes for every template document kind` passes; the file reports 16 passed)
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`

### T007: Update Create.sh Seeding Logic

- [x] Read `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` seeding section
- [x] Extend it to recognize all 18 document kinds, not just four (new `seed_template_document` helper at line 394, 13 new default lists at lines 456-525, call sites at lines 546-550 and 692-701)
- [x] Apply the correct seed recipes for each kind (each call passes the slug phrase and the kind suffix, which `seededPhrases` mirrors)
- [x] Test the updated seeding on a fresh packet creation (`CLI/tests/create-root-numbering.vitest.ts:170` scaffolds real phase, review and research packets; `CLI/tests/template-phrase-integration.vitest.ts:64` scaffolds a packet with lazy add-ons and a goal; a direct `create.sh --phase` run seeded the parent `spec.md` with `seed proof phase probe phase parent spec`)
- [x] Confirm the trigger_phrases field is populated correctly (both tests compare the written list with `seededPhrases` output and grade it `null`; the phase parent also needed the `replace_template_default_trigger_phrases` call at line 1724)
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`

### T008: Implement No-Frontmatter Routing

- [x] In `template-phrase-cleanup.mjs`, detect files with no frontmatter:
  - [x] Check if the file lacks a `---` delimited frontmatter block (line 478 matches the parser reason `missing opening frontmatter delimiter`; other malformed frontmatter is still reported as skipped)
  - [x] Route the file to `fill-frontmatter` instead of skipping it (`noFrontmatterRoute` at line 269 returns the fixer name, the `upgrade-legacy.mjs` path, its `--roots <packet> --apply` arguments and a runnable command; it reports the route and does not run the fixer)
- [x] Update the return object to track which files were routed (`routed` at line 525, and a `routed to fill-frontmatter; run: ...` summary line at line 580)
- [x] Add a test for no-frontmatter detection and routing (`CLI/tests/template-phrase-cleanup-hardening.vitest.ts:84`)
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`

### T009: Create Pre-commit Phrase-Judge Lint

- [x] Identify the phrase-judge location and API (likely in `../retrieval/lib/phrase-judge.mjs`) (`judgeTriggerPhrase` from `CLI/retrieval/lib/phrase-judge.mjs`, imported at `CLI/spec/template-phrase-lint.mjs:15`; the judge itself is unchanged)
- [x] Create a lint helper module that:
  - [x] Detects staged files with frontmatter (`stagedMarkdownChanges` lists staged `*.md` files, rename aware; `parseFrontmatter` skips files without a trigger phrase list)
  - [x] Extracts the trigger_phrases the commit adds, compared with HEAD (the staged blob is compared with the `HEAD` blob of the old path through `normalizeTriggerText`)
  - [x] Calls phrase-judge to grade each added phrase (line 96)
  - [x] Blocks on `template-default` and `editor-fallback`, warns on every other negative class (`BLOCKING_CLASSES` at line 24, branch at line 99)
- [x] Add the lint to the pre-commit hook at `.skilled/scripts/git-hooks/pre-commit` (lines 146-159)
- [x] Honour `SPECKIT_SKIP_PHRASE_LINT=1` as the bypass (checked in the hook at line 148 and again in the linter at line 117)
- [x] Document the lint in the hook file (the section comment at `.skilled/scripts/git-hooks/pre-commit:146`, plus `.skilled/scripts/git-hooks/README.md:110`; the review also had the gate registered at `.skilled/scripts/git-hooks/lib/gates.tsv:8`)
- **Files affected**: `.skilled/scripts/git-hooks/pre-commit`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` (new lint helper module)

### T010: Write Pre-commit Lint Tests

- [x] Create a test that stages valid frontmatter and confirms lint passes (done differently: no separate clean-phrase case; the case at `CLI/tests/template-phrase-lint-hook.vitest.ts:143` stages an edit to a valid file and expects exit 0, and the single-token case at line 131 also exits 0)
- [x] Create a test that stages an added `template-default` phrase and confirms the lint blocks (line 117 runs the case for `feature specification` and expects exit 1 with `[template-default]`; the same table runs `context` for `[editor-fallback]`)
- [x] Create a test that stages an added `single-token` phrase and confirms the lint warns and passes (line 131 stages `neurology`, expects exit 0, a `WARNING` line and `[single-token]`)
- [x] Test the `SPECKIT_SKIP_PHRASE_LINT=1` bypass (line 155, with the linter file deleted to prove the gate is skipped whole; line 167 also pins the persistent registry switch)
- [x] Confirm phrases already in HEAD are not graded (line 143 keeps `feature specification` in HEAD and expects no `template-default` output)
- **Files to create**: `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-lint-hook.vitest.ts`

### T011: Run Existing Tests

- [x] Run all existing tests in the cleanup and census modules (`CLI/tests/template-phrase-cleanup.vitest.ts` 17 passed, unmodified)
- [x] Confirm no regressions in the three-way pin test (`create-root-numbering.vitest.ts` 16 passed, including the earlier pin cases)
- [x] Run create.sh tests (the same file holds the `create.sh` seeding and numbering cases)
- [x] Confirm phrase-judge integration works (the hook test blocks `template-default` and `editor-fallback` and warns on `single-token` through the real judge)
- **Verification**: the five phase test files all pass (43 tests, rc 0); the full cli suite exits 0 with 167 files passed and 3 skipped, 1,682 tests passed and 19 skipped, against a baseline of 161 files and 1,639 tests

### T012: Integration Testing

- [x] Create a test packet and run cleanup on it (`CLI/tests/template-phrase-integration.vitest.ts:64` runs `create.sh`, then the cleanup script with `--apply --json`)
- [x] Confirm atomic write works and cleanup output is correct (the report shows `changed` 1, differing `beforeHash` and `afterHash`, and the restored template block is back to the `seededPhrases` output)
- [x] Confirm seed recipes are applied to new packets (the test compares `decision-record.md`, `before-after.md`, `timeline.md`, `roadmap.md` and `goal.md` with `seededPhrases`)
- [x] Stage a packet with an added `editor-fallback` phrase and confirm pre-commit blocks it (done differently: the real hook blocks `context` as `[editor-fallback]` in `CLI/tests/template-phrase-lint-hook.vitest.ts:117`, while the integration test stages an added `feature specification` and expects the lint script to exit 1 with `[template-default]`)
- [x] Set `SPECKIT_SKIP_PHRASE_LINT=1` and confirm the lint is skipped (`CLI/tests/template-phrase-lint-hook.vitest.ts:155`)
- **Verification**: the integration file passes (1 passed) and the hook file passes (6 passed)

### T013: Documentation and Handoff

- [x] Update or create a README explaining the atomic write strategy (not applicable as a separate file: Files to Change names no README for the cleanup tool, so the strategy is recorded in implementation-summary.md)
- [x] Document the 18 seed recipes and their purpose (the `recipePins` table in the pin test, and the kind list in implementation-summary.md)
- [x] Document the pre-commit lint in the hook README (`.skilled/scripts/git-hooks/README.md` counts the eighth blocking gate and lists `SPECKIT_SKIP_PHRASE_LINT=1`)
- [x] Update implementation-summary.md
- [x] Prepare a summary for the parent spec changelog (no `changelog/` folder exists under the parent or the track, so the summary lives in implementation-summary.md)
- **Files affected**: `.skilled/scripts/git-hooks/README.md`, implementation-summary.md

---

## Verification Checklist Details

- [x] All 18 template kinds identified in T001
- [x] Seed phrases designed for each kind in T002
- [x] Atomic write implemented and tested in T003, T004
- [x] Census tool updated in T005
- [x] Pin test covers all 18 kinds in T006
- [x] Create.sh seeding extended in T007
- [x] No-frontmatter routing implemented in T008
- [x] Pre-commit lint created in T009
- [x] Lint tests pass in T010
- [x] Existing tests pass in T011
- [x] Integration tests pass in T012
- [x] Documentation complete in T013

<!-- /ANCHOR:tasks -->
