---
title: "Tasks: Phrase cleanup hardening"
description: "Concrete tasks for building this phase."
trigger_phrases:
  - "phrase cleanup hardening tasks"
  - "template phrase cleanup atomic writes"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phrase cleanup hardening

<!-- ANCHOR:tasks -->

## Verification Checklist

- [ ] All 18 template file kinds have been identified
- [ ] Atomic write implementation is complete and tested
- [ ] Seed recipes are in the pin test for all 18 kinds
- [ ] Pre-commit phrase-judge lint is integrated and working
- [ ] No-frontmatter routing is implemented
- [ ] All existing tests still pass
- [ ] Integration tests for the new features pass

---

## Implementation Tasks

### T001: Discover All 18 Template Document Kinds

- [ ] Search `.skilled/skills/system-spec-kit/templates/` for all `.tmpl` files with `trigger_phrases`
- [ ] For each file, create a mapping of template path to a unique kind identifier (some render the same basename, e.g., four templates render `spec.md`)
- [ ] Confirm each template has a `trigger_phrases` field with example phrases
- [ ] List all 18 kinds and their template sources
- [ ] Create a reference table for T002 and T007
- **Files affected**: `.skilled/skills/system-spec-kit/templates/*.tmpl`

### T002: Extract Default Seed Phrases for Each Kind

- [ ] For each of the 18 document kinds, read the template to understand its purpose
- [ ] Design default trigger phrases that describe what the document is
- [ ] Confirm the phrases match the convention used by `phrase-judge.mjs`
- [ ] Document the phrases in a seed recipes file or directly in the test
- [ ] Cross-check against existing phrase lists in live packets
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`

### T003: Implement Atomic Write in Cleanup Tool

- [ ] Read `template-phrase-cleanup.mjs:410-427` and understand the current write logic
- [ ] Choose an atomic write strategy: temp file + rename (recommended)
- [ ] Implement the atomic write:
  - Write to a temp file in the same directory (e.g., `file.tmp`)
  - Compute the hash of the temp file content
  - If hash matches expected, rename temp to target
  - If error occurs, delete temp file
  - Report success only if rename completes
- [ ] Keep the hash verification step after write completes
- [ ] Test the new write logic with a unit test
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` lines 410-427

### T004: Add Atomic Write Unit Test

- [ ] Create a test that:
  - Writes a file using the atomic logic
  - Confirms the file has the correct content
  - Simulates an error during write and confirms no partial file is left
  - Verifies the hash check works correctly
- [ ] Run the test and confirm it passes
- [ ] Document the test in the acceptance criteria
- **Files to create**: Test in `.skilled/skills/system-spec-kit/runtime/cli/tests/`

### T005: Update Census Tool with All 18 Kinds

- [ ] Modify `template-phrase-census.mjs` to recognize all 18 template kinds
- [ ] Extend the `DOCUMENT_KINDS` list to include all 18 kinds (currently hardcoded to five)
- [ ] Extend the `TEMPLATE_FILES` mapping to all 18 template paths
- [ ] Test the updated census on a test corpus with all 18 template types
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`

### T006: Add Seed Recipes to Pin Test

- [ ] Open `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`
- [ ] Find the pin test section (around line 224)
- [ ] Add seed recipe data for all 18 document kinds
- [ ] Ensure the test covers the two-way pin (template defaults and `create.sh` seeding)
- [ ] Run the test and confirm it passes
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`

### T007: Update Create.sh Seeding Logic

- [ ] Read `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` seeding section
- [ ] Extend it to recognize all 18 document kinds, not just four
- [ ] Apply the correct seed recipes for each kind
- [ ] Test the updated seeding on a fresh packet creation
- [ ] Confirm the trigger_phrases field is populated correctly
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`

### T008: Implement No-Frontmatter Routing

- [ ] In `template-phrase-cleanup.mjs`, detect files with no frontmatter:
  - Check if the file lacks a `---` delimited frontmatter block
  - Route the file to `fill-frontmatter` instead of skipping it
- [ ] Update the return object to track which files were routed
- [ ] Add a test for no-frontmatter detection and routing
- **Files affected**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`

### T009: Create Pre-commit Phrase-Judge Lint

- [ ] Identify the phrase-judge location and API (likely in `../retrieval/lib/phrase-judge.mjs`)
- [ ] Create a lint helper module that:
  - Detects staged files with frontmatter
  - Extracts the trigger_phrases the commit adds, compared with HEAD
  - Calls phrase-judge to grade each added phrase
  - Blocks on `template-default` and `editor-fallback`, warns on every other negative class
- [ ] Add the lint to the pre-commit hook at `.skilled/scripts/git-hooks/pre-commit`
- [ ] Honour `SPECKIT_SKIP_PHRASE_LINT=1` as the bypass
- [ ] Document the lint in the hook file
- **Files affected**: `.skilled/scripts/git-hooks/pre-commit`, new lint helper module

### T010: Write Pre-commit Lint Tests

- [ ] Create a test that stages valid frontmatter and confirms lint passes
- [ ] Create a test that stages an added `template-default` phrase and confirms the lint blocks
- [ ] Create a test that stages an added `single-token` phrase and confirms the lint warns and passes
- [ ] Test the `SPECKIT_SKIP_PHRASE_LINT=1` bypass
- [ ] Confirm phrases already in HEAD are not graded
- **Files to create**: Test for the lint helper

### T011: Run Existing Tests

- [ ] Run all existing tests in the cleanup and census modules
- [ ] Confirm no regressions in the three-way pin test
- [ ] Run create.sh tests
- [ ] Confirm phrase-judge integration works
- **Verification**: All tests pass with status 0

### T012: Integration Testing

- [ ] Create a test packet and run cleanup on it
- [ ] Confirm atomic write works and cleanup output is correct
- [ ] Confirm seed recipes are applied to new packets
- [ ] Stage a packet with an added `editor-fallback` phrase and confirm pre-commit blocks it
- [ ] Set `SPECKIT_SKIP_PHRASE_LINT=1` and confirm the lint is skipped
- **Verification**: All integration tests pass

### T013: Documentation and Handoff

- [ ] Update or create a README explaining the atomic write strategy
- [ ] Document the 18 seed recipes and their purpose
- [ ] Document the pre-commit lint in the hook README
- [ ] Update implementation-summary.md
- [ ] Prepare a summary for the parent spec changelog
- **Files affected**: `.skilled/scripts/git-hooks/README.md`, implementation-summary.md

---

## Verification Checklist Details

- [ ] All 18 template kinds identified in T001
- [ ] Seed phrases designed for each kind in T002
- [ ] Atomic write implemented and tested in T003, T004
- [ ] Census tool updated in T005
- [ ] Pin test covers all 18 kinds in T006
- [ ] Create.sh seeding extended in T007
- [ ] No-frontmatter routing implemented in T008
- [ ] Pre-commit lint created in T009
- [ ] Lint tests pass in T010
- [ ] Existing tests pass in T011
- [ ] Integration tests pass in T012
- [ ] Documentation complete in T013

<!-- /ANCHOR:tasks -->
