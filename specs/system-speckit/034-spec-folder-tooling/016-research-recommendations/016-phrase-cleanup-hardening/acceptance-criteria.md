---
title: "Acceptance Criteria: Phrase cleanup hardening"
description: "Verification conditions for this phase."
trigger_phrases:
  - "phrase cleanup hardening acceptance"
  - "template phrase cleanup verification"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria-core | v2.2 -->

# Acceptance Criteria: Phrase cleanup hardening

<!-- ANCHOR:criteria -->

| Criterion | Given | When | Then | Verification | Status | Waiver |
|-----------|-------|------|------|--------------|--------|--------|
| R1a: Atomic write works correctly | Cleanup tool is updated | A file is written using atomic logic | The file has correct content and is fully written | Read the file after cleanup and confirm it matches expected | Unmet | - |
| R1b: Atomic write test passes | Atomic write test exists | Test is run | Test passes and confirms no partial writes on error | Run `npm test` on the atomic write test | Unmet | - |
| R2a: Seed recipes exist for all 18 kinds | All 18 template kinds are identified | Recipes are defined | A recipe exists for each kind in the pin test | Grep for all 18 kinds in the pin test and count them | Unmet | - |
| R2b: Seed recipes are applied | Cleanup tool is updated | Create.sh runs with new kinds | Each new document kind gets seeded phrases | Create a new packet of each kind and inspect trigger_phrases | Unmet | - |
| R3a: No-frontmatter files are detected | Cleanup tool is updated | A no-frontmatter file is processed | The file is reported as no-frontmatter | Run cleanup on a file without frontmatter and check output | Unmet | - |
| R3b: No-frontmatter routing exists | Cleanup tool is updated | A no-frontmatter file is detected | The file is routed to a fixer or reported | Inspect the return object and confirm routing metadata | Unmet | - |
| R4a: Pre-commit lint blocks tool fingerprints | Lint is added to pre-commit hook | A commit adds a `template-default` or `editor-fallback` phrase | The commit is blocked with the phrase-judge reason | Run `git add` and `git commit` and confirm the block | Unmet | - |
| R4b: Pre-commit lint warns on other classes | Lint is running | A commit adds a phrase in another negative class, such as `single-token` | A warning is printed and the commit proceeds | Inspect hook output and the exit status | Unmet | - |
| R4c: Pre-commit lint can be bypassed | Lint is running | `SPECKIT_SKIP_PHRASE_LINT=1` is set | Lint is skipped and commit proceeds | Commit a blocked phrase with the variable set and confirm it goes through | Unmet | - |
| P3: Hash reporting works | Atomic write is implemented | Cleanup writes a file | Before and after hashes are recorded in output | Run cleanup and inspect the report for hash fields | Unmet | - |
| Integration: Cleanup, seeding, and linting work together | All features are implemented | A full workflow is executed | New packet is created, seeded correctly, and an added template-default phrase is blocked | Create packet, inspect phrases, stage an added template-default phrase, confirm lint blocks it | Unmet | - |
| P1a: Pin test covers all 18 kinds | Pin test is updated | Test runs | Every kind has a recipe and the test passes | Run the pin test and confirm it passes | Unmet | - |
| P1b: Two-way pin still holds | Templates and create.sh are updated | Both are run | Template defaults and create.sh seeding agree on phrases for all 18 kinds | Compare template defaults against create.sh seeding output | Unmet | - |
| P2a: No regression in cleanup behavior | Existing tests run | Tests are executed | All existing cleanup tests pass | Run `npm test` on template-phrase-cleanup.mjs tests | Unmet | - |
| P2b: No regression in census behavior | Existing tests run | Tests are executed | All existing census tests pass | Run `npm test` on template-phrase-census.mjs tests | Unmet | - |
| P2c: No regression in create.sh | Create.sh tests run | Tests are executed | All create.sh tests pass | Run create.sh tests and confirm pass | Unmet | - |
| R5: Phase validates strictly | All changes are in place | `validate.sh --strict` runs | No validation errors in the phase spec folder | Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening --strict` | Unmet | - |

<!-- /ANCHOR:criteria -->
