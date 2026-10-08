---
title: "Feature Specification: Phrase cleanup hardening"
description: "The phrase cleanup tools have non-atomic writes and lack seed recipes for new document kinds. Hardening adds atomic writes, seeding for add-on documents and a pre-commit lint."
trigger_phrases:
  - "phrase cleanup hardening"
  - "template phrase cleanup atomicity"
  - "phrase census and cleanup robustness"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phrase cleanup hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-lane-rules-as-heal-modes |
| **Successor** | None |
| **Handoff Criteria** | Atomic writes pass verification, seed recipes exist for 18 template file kinds, pre-commit lint runs and catches divergence, and all tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the spec folder tooling parent, the final phase. The cleanup family tools `template-phrase-census.mjs` and `template-phrase-cleanup.mjs` have three hardening gaps: writes to files are not atomic (a crash between write and read leaves a truncated file), the seeding step recognizes only the five built-in kinds and has no recipes for the thirteen add-on kinds, and there is no pre-commit lint to catch staged frontmatter divergence from the phrase judge.

**Scope Boundary**: Phrase cleanup and census tools, their tests, the pre-commit hook.

**Dependencies**:
- Phase 15 (lane rules healing) will have run first.
- No other phases depend on this one.
- The template phrase-judge is in a separate codebase location.

**Deliverables**:
- Atomic write support in `template-phrase-cleanup.mjs`.
- Seed recipes for 18 template file kinds available in the pin test.
- A pre-commit hook lint that grades newly added trigger phrases with the phrase judge. It blocks only `template-default` and `editor-fallback`, warns on every other negative class, and has a `SPECKIT_SKIP_PHRASE_LINT=1` bypass.
- No-frontmatter files routed to `fill-frontmatter` instead of skipped.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`template-phrase-cleanup.mjs:420` writes a file and then reads it back to record the hash, but uses in-place truncate-then-write, so a crash or error between write and read leaves a truncated file with no recovery. Separately, `create.sh` seeding and `template-phrase-census.mjs` recognize only five document kinds (spec, acceptance-criteria, plan, tasks, implementation-summary), but 18 template files carry `trigger_phrases`. The five built-in kinds have default phrases (from templates and in `phrase-judge.mjs`), but add-on template kinds retain template defaults and are never customized in any cleanup step. Finally, there is no pre-commit hook lint to catch staged frontmatter that the phrase-judge would reject, so bad phrases slip through.

### Purpose
Ensure phrase cleanup writes are atomic, every template kind can be seeded with correct default phrases, and bad frontmatter is caught before commit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the non-atomic write in `template-phrase-cleanup.mjs` with an atomic operation.
- Identify all 18 template file kinds and add seed recipes for each to the pin test.
- Implement a pre-commit hook lint that grades the trigger phrases a commit adds. It blocks on `template-default` and `editor-fallback`, warns on every other negative class, and is bypassed with `SPECKIT_SKIP_PHRASE_LINT=1`, like the hook's other gates.
- Route no-frontmatter files to a fixer instead of skipping them.

### Out of Scope
- Changing the phrase-judge criteria or adding new default phrase sets.
- Rewriting `create.sh` seeding logic (only extend it).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modify | Atomic write, no-frontmatter routing |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs` | Modify | Extend DOCUMENT_KINDS to all 18 template kinds |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Extend seeding to all 18 kinds |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Inspect | Confirm five default phrase sets; required for pin test verification |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Modify | Update pin test with recipes for all 18 kinds |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Add phrase-judge lint for staged files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Primary (P0)

| ID | Requirement | Verification |
|-----|------|--------------|
| R1 | Atomic write: file is fully written or not at all | Write a test that intentionally crashes mid-write and confirm no partial file is left |
| R2 | Seed recipes exist for all 18 template kinds | Run template-phrase-census against a corpus and confirm every kind is recognized |
| R3 | No-frontmatter files are routed to `fill-frontmatter` | Trace the code path from cleanup to fixer and confirm routing exists |
| R4 | Pre-commit lint blocks a newly added `template-default` or `editor-fallback` phrase and only warns on other negative classes | Stage one phrase of each kind and confirm the hook blocks the first and warns on the second |

### Secondary (P1)

| ID | Requirement | Verification |
|-----|------|--------------|
| P1 | Seed recipes are in the pin test | Read the test file and find the 18 recipes |
| P2 | Lint can be bypassed with `SPECKIT_SKIP_PHRASE_LINT=1` | Commit a blocked phrase with the variable set and confirm the commit goes through |
| P3 | Hash reporting is preserved | Cleanup records before and after hashes in the report output |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Atomic writes are in place in `template-phrase-cleanup.mjs`.
- All 18 template file kinds have seed recipes available.
- A new pre-commit phrase-judge lint runs on newly added phrases, blocking only `template-default` and `editor-fallback`.
- No-frontmatter files are sent to `fill-frontmatter`.
- The pin test for seed recipes covers all 18 kinds and passes.
- No regression in cleanup behavior or hash reporting.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Atomic write implementation breaks on some filesystems | Low | High | Test on macOS, Linux and Windows, use temp+rename pattern |
| Seed recipes conflict with existing templates | Low | Med | Cross-check each recipe against the template file |
| Pre-commit lint is too strict and blocks valid commits | Low | Med | It blocks only the two tool-fingerprint classes on added phrases, warns on the rest, and has a `SPECKIT_SKIP_PHRASE_LINT=1` bypass |
| Hash reporting is broken during refactor | Low | Med | Preserve beforeHash and afterHash in output after atomic write |
| New document kinds are not discovered | Low | Low | Search templates directory for all `trigger_phrases` fields and count them |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. **Decided 2026-10-08 by the operator:** the lint blocks only `template-default` and `editor-fallback` on newly added phrases, because those classes are tool fingerprints rather than author choices. It warns on every other negative class, since the research ruled out turning phrase warnings into errors on author-declared phrases. A `SPECKIT_SKIP_PHRASE_LINT=1` bypass matches the hook's other `SPECKIT_SKIP_*` gates.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `../../014-spec-auto-healing-research/research/research.md`, section 11 row SH-16
- **Cleanup tool**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` lines 32-38 and 418-427
- **Census tool**: `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`
- **Pin test**: `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` lines 224+
- **Parent Spec**: `../spec.md`
