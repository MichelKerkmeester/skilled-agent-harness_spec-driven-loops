---
title: "Tasks: Phase 5: healer-phrase-seeding"
description: "The task list for Phase 5: healer-phrase-seeding, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "healer phrase seeding tasks"
  - "heal-spec-docs refill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: healer-phrase-seeding

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Trace TEMPLATE_DEFAULTS usage in heal-spec-docs.cjs (around line 45-50, and all references)
- [ ] T002 Identify call sites: where heal-spec-docs --apply is invoked (upgrade-legacy.mjs:394 and grep for others)
- [ ] T003 [P] Review phrase-judge.mjs grades (line 121) to understand template-default class
- [ ] T004 Locate three-way pin test in create-root-numbering.vitest.ts (line 224+) and `seededPhrases` in template-phrase-cleanup.mjs (line 125)
- [ ] T014 [P] Trace `inferTriggerPhrases` in frontmatter-migration.ts (line 985) and its call from the upgrade-legacy fill-frontmatter step
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Empty-list fallback decided 2026-10-08 by the operator: refill from the slug seeder
- [ ] T006 Delete TEMPLATE_DEFAULTS and refill empty lists with `seededPhrases` output (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs)
- [ ] T007 Export `seededPhrases` unchanged (.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs)
- [ ] T008 [P] Make `inferTriggerPhrases` drop every candidate the judge rejects and remove its `memory`, `indexing`, `context` fallback (.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts)
- [ ] T009 Add a case pinning healer output to the seeder output (.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts)
- [ ] T015 Add a case to upgrade-legacy.vitest.ts: a fixture with an empty list and a missing key, run `--apply`, assert every written phrase grades `null` from `judgeTriggerPhrase` (.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run Vitest: `from `.skilled/skills/system-spec-kit/runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli tests/create-root-numbering.vitest.ts tests/upgrade-legacy.vitest.ts`` and `npm test -- upgrade-legacy.vitest.ts`
- [ ] T011 Run `validate.sh --strict` on this spec packet
- [ ] T012 Grep heal-spec-docs.cjs for TEMPLATE_DEFAULTS and expect zero hits
- [ ] T013 Manual check: trace one empty-list document and one missing-key document through upgrade-legacy and grade the result
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh --strict shows no failures
- [ ] Tests pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: Section 5.6 and Section 11 recommendation SH-05 of ../../014-spec-auto-healing-research/research/research.md
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Code paths in heal-spec-docs.cjs, frontmatter-migration.ts and phrase-judge.mjs traced and understood
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes linter (npm lint or equivalent)
- [ ] CHK-011 [P0] No new console.log or debug statements left in
- [ ] CHK-012 [P1] Changes follow existing code style in heal-spec-docs.cjs
- [ ] CHK-013 [P1] Test additions use Vitest patterns from existing test files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] create-root-numbering.vitest.ts passes with the new seeder pin case
- [ ] CHK-022 [P0] upgrade-legacy.vitest.ts passes with a grade check over every negative class
- [ ] CHK-023 [P1] Grade check covers all four document types (spec, plan, tasks, impl-summary)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: class-of-bug (two upgrade-path writers emit rejected phrases)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: heal-spec-docs.cjs and inferTriggerPhrases, plus an rg for any other trigger_phrases writer
- [ ] CHK-FIX-003 [P0] Consumer inventory: upgrade-legacy.mjs fill-frontmatter step and line 394, tests, no other callers (verified by rg)
- [ ] CHK-FIX-004 [P0] Not a security/path fix, no adversarial cases needed
- [ ] CHK-FIX-007 [P1] Evidence pinned: heal-spec-docs.cjs lines 45-50, phrase-judge.mjs line 121, upgrade-legacy.mjs line 392
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Inline code comments explain why the healer seeds from the slug and the inference drops rejected phrases
- [ ] CHK-042 [P2] If a new algorithm is introduced, document its invariant
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files or debug output stored in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion claim
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



