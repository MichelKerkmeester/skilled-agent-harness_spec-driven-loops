---
title: "Tasks: Phase 5: healer-phrase-seeding"
description: "The task list for Phase 5: healer-phrase-seeding, each task naming its file. Every task is done and carries the evidence that closed it, except the open plan sync row."
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

- [x] T001 Trace TEMPLATE_DEFAULTS usage in heal-spec-docs.cjs (around line 45-50, and all references) (the constant had one consumer, `healDoc` in the same file; after the build `rg TEMPLATE_DEFAULTS .skilled` finds no hit anywhere)
- [x] T002 Identify call sites: where heal-spec-docs --apply is invoked (upgrade-legacy.mjs:394 and grep for others) (`upgrade-legacy.mjs` runs `[HEAL, '--apply', '--folder', target]` at line 395 after the fill-frontmatter step at line 385; no other caller found)
- [x] T003 [P] Review phrase-judge.mjs grades (line 121) to understand template-default class (the judge grades the old plan, tasks and summary phrases as `template-default`; `judgeTriggerPhrase` returns `{negativeClass, reason}` or `null`, and grades `debug`, `delegation` and `scaffold` as `single-token`)
- [x] T004 Locate three-way pin test in create-root-numbering.vitest.ts (line 224+) and `seededPhrases` in template-phrase-cleanup.mjs (line 125) (the new healer case sits after the `create.sh seeds trigger phrases` block; the seeder is at line 125 in `template-phrase-cleanup.mjs`)
- [x] T014 [P] Trace `inferTriggerPhrases` in frontmatter-migration.ts (line 985) and its call from the upgrade-legacy fill-frontmatter step (function at line 986, called at line 1301 inside the module that `upgrade-legacy.mjs` loads as `FRONTMATTER_LIB`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Empty-list fallback decided 2026-10-08 by the operator: refill from the slug seeder
- [x] T006 Delete TEMPLATE_DEFAULTS and refill empty lists with `seededPhrases` output (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs) (`TEMPLATE_DEFAULTS` replaced by `SEEDED_KINDS` mapping plan, tasks and implementation-summary to their seeder kind; the seeder loads with `require()` instead of the planned dynamic `import()`, see spec.md section 10)
- [x] T007 Export `seededPhrases` unchanged (.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs) (one-word diff: `function seededPhrases` became `export function seededPhrases`)
- [x] T008 [P] Make `inferTriggerPhrases` drop every candidate the judge rejects and remove its `memory`, `indexing`, `context` fallback (.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts) (done with a `judgeTriggerPhrase(entry) === null` filter and `return undefined` on an empty result; done differently in one respect: the judge import needed a package export and a `.d.mts` file after the orchestrator found the relative import broke the compiled build, see the follow-on rows below)
- [x] T009 Add a case pinning healer output to the seeder output (.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts) (`heal-spec-docs refills empty trigger phrases` runs the real healer on plan, tasks and summary with `trigger_phrases: []`, expects each list to equal `seededPhrases(file, kind)` and each phrase to grade `null`; the file reports 14 passed)
- [x] T015 Add a case to upgrade-legacy.vitest.ts: a fixture with an empty list and a missing key, run `--apply`, assert every written phrase grades `null` from `judgeTriggerPhrase` (.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts) (case `writes no phrase the judge rejects when it repairs a legacy packet`; the first attempt on the llmgateway route wrote nothing and was rerouted, see implementation-summary.md; the file reports 18 passed)
- [x] T016 Give the compiled build a loadable import of phrase-judge (.skilled/skills/system-spec-kit/runtime/package.json and .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.d.mts) (added after the orchestrator found `ERR_MODULE_NOT_FOUND` for `dist/retrieval/lib/phrase-judge.mjs`: `runtime/package.json` exports `./cli/retrieval/lib/phrase-judge.mjs`, the new `.d.mts` declares `judgeTriggerPhrase`, and `frontmatter-migration.ts` imports `@spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs`; afterwards typecheck rc 0, build rc 0 and the dist module imports)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run Vitest: `from `.skilled/skills/system-spec-kit/runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli tests/create-root-numbering.vitest.ts tests/upgrade-legacy.vitest.ts`` and `npm test -- upgrade-legacy.vitest.ts` (run as the whole cli suite: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` exits 0 with 162 files passed and 3 skipped, 1,648 tests passed and 19 skipped, against a baseline of 161 files and 1,639 tests; a direct rerun of the two files from the skill root with `--config vitest.config.ts` printed `Test Files 2 passed`, `Tests 32 passed`, rc 0)
- [x] T011 Run `validate.sh --strict` on this spec packet (prints `RESULT: PASSED` after `repair-derived.cjs --apply`; `check-goal.cjs` passes)
- [x] T012 Grep heal-spec-docs.cjs for TEMPLATE_DEFAULTS and expect zero hits (`grep -c TEMPLATE_DEFAULTS` prints 0; none of the three old template phrases `what shipped`, `task breakdown`, `technical approach` remain in the file either)
- [x] T013 Manual check: trace one empty-list document and one missing-key document through upgrade-legacy and grade the result (done by the upgrade-legacy fixture instead of by hand: `plan.md` and `implementation-summary.md` start with `trigger_phrases: []`, `spec.md` has no key, `tasks.md` has no frontmatter; after `--apply` the case pins that the plan and summary refills are non-empty and that every phrase in all four documents grades `null`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] validate.sh --strict shows no failures (`RESULT: PASSED`)
- [x] Tests pass (cli suite exits 0 with 1,648 passed; the two phase files pass 32 of 32)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-004 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md sections 3 and 4)
- [x] CHK-003 [P1] Code paths in heal-spec-docs.cjs, frontmatter-migration.ts and phrase-judge.mjs traced and understood (T001 to T004 and T014)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes linter (npm lint or equivalent) (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exits 0; it runs `tsc --noEmit` first, and CLI typecheck and build also exit 0)
- [x] CHK-011 [P0] No new console.log or debug statements left in (the added lines of the five changed source and test files hold no `console.` call)
- [x] CHK-012 [P1] Changes follow existing code style in heal-spec-docs.cjs (the new block keeps the file's section-banner comments and CommonJS `require` style; judged from the diff, and the review round raised no style finding)
- [x] CHK-013 [P1] Test additions use Vitest patterns from existing test files (both cases use `describe`, `it`, `expect` and the files' existing fixture helpers `spawnSync` and `writeLegacyPacket`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [x] CHK-021 [P0] create-root-numbering.vitest.ts passes with the new seeder pin case (14 passed)
- [x] CHK-022 [P0] upgrade-legacy.vitest.ts passes with a grade check over every negative class (18 passed; the case expects `judgeTriggerPhrase` to return `null` for every written phrase, so a phrase in any negative class fails it)
- [x] CHK-023 [P1] Grade check covers all four document types (spec, plan, tasks, impl-summary) (review fix: the first grade loop covered only spec and plan; the fixture now adds an `implementation-summary.md` with an empty list and grades all four, pinning the plan and summary refills as non-empty)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: class-of-bug (two upgrade-path writers emit rejected phrases) (both writers fixed, not only the one that surfaced)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: heal-spec-docs.cjs and inferTriggerPhrases, plus an rg for any other trigger_phrases writer (an rg over `runtime/cli/spec` and `runtime/cli/lib` finds three other writers: `create.sh` and `template-phrase-cleanup.mjs`, both slug-seeded, and `scaffold-debug-delegation.sh`, which writes the literal phrases `debug`, `delegation`, `scaffold` and `task <id>`, three of which the judge grades `single-token`; that script is not called by upgrade-legacy and is recorded as a follow-up; the other hits only read or name the field, and `repair-derived.cjs` and `migrate-generated-json.ts` carry no `trigger_phrases` reference)
- [x] CHK-FIX-003 [P0] Consumer inventory: upgrade-legacy.mjs fill-frontmatter step and line 394, tests, no other callers (verified by rg) (`upgrade-legacy.mjs` lines 385 and 395, plus the two vitest files; `rg TEMPLATE_DEFAULTS .skilled` finds nothing)
- [x] CHK-FIX-004 [P0] Not a security/path fix, no adversarial cases needed (not applicable: the change alters which strings are written into frontmatter, not any path, permission or input boundary)
- [x] CHK-FIX-007 [P1] Evidence pinned: heal-spec-docs.cjs lines 45-50, phrase-judge.mjs line 121, upgrade-legacy.mjs line 392 (the cited lines are pre-build positions; the healer's constant is gone, `phrase-judge.mjs` is unchanged, and the call site now sits at `upgrade-legacy.mjs` line 395 after phase 008 added lines above it)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (plan.md Key Components now records `require()` for the seeder; its Definition of Ready and Done boxes are ticked)
- [x] CHK-041 [P1] Inline code comments explain why the healer seeds from the slug and the inference drops rejected phrases (comments in `heal-spec-docs.cjs` explain the slug seed and the judge-rejected template phrases; `frontmatter-migration.ts` carries "The judge owns phrase admissibility; keep only candidates it admits.")
- [x] CHK-042 [P2] If a new algorithm is introduced, document its invariant (not applicable: no new algorithm; the healer calls the existing seeder and the inference filters through the existing judge)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files or debug output stored in scratch/ only (scratch/ holds only `.gitkeep`)
- [x] CHK-051 [P1] scratch/ cleaned before completion claim (scratch/ holds only `.gitkeep`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 9 | 8/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



