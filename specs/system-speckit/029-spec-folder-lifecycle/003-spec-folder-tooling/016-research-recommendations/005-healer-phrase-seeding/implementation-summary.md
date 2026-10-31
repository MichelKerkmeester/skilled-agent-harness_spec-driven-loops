---
title: "Implementation Summary"
description: "Phase 5: healer-phrase-seeding is complete. The upgrade path no longer writes a trigger phrase that phrase-judge rejects: heal-spec-docs refills from the slug seeder and inferTriggerPhrases keeps only admitted phrases."
trigger_phrases:
  - "healer phrase seeding implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts"
      - ".skilled/skills/system-spec-kit/runtime/package.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.d.mts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-healer-phrase-seeding |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is **complete**. Built in wave 1, reviewed once by the other model family, and verified by the orchestrator. The upgrade path no longer writes a trigger phrase that phrase-judge grades in a negative class, so the healer and the fill step no longer write what the checker refuses.

- `heal-spec-docs.cjs` lost `TEMPLATE_DEFAULTS`. A small `SEEDED_KINDS` map now names the seeder kind for `plan.md`, `tasks.md` and `implementation-summary.md`, and an empty `trigger_phrases` list is refilled with exactly what `seededPhrases` returns. The healer loads the seeder with `require()`, which works because `template-phrase-cleanup.mjs` guards its entry point with `isDirectRun` and has no top-level await.
- `template-phrase-cleanup.mjs` now exports `seededPhrases`. The function body did not change.
- `inferTriggerPhrases` in `frontmatter-migration.ts` filters its candidates through `judgeTriggerPhrase` and keeps only the ones the judge admits. The `memory`, `indexing`, `context` fallback is gone, and the function returns `undefined` when nothing admissible remains.
- `create-root-numbering.vitest.ts` gained a case that runs the real healer on three documents with empty lists and expects each list to equal the seeder output and to grade `null`.
- `upgrade-legacy.vitest.ts` gained a case that repairs a legacy packet with `--apply` and grades every phrase written to `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Delete TEMPLATE_DEFAULTS, refill from the slug seeder |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modify | Export `seededPhrases` |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modify | `inferTriggerPhrases` emits no rejected phrase |
| `.skilled/skills/system-spec-kit/runtime/package.json` | Modify | Export `./cli/retrieval/lib/phrase-judge.mjs` for the compiled build |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.d.mts` | Create | Type declarations for `judgeTriggerPhrase` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modify | Pin healer output to the seeder |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Grade every phrase the upgrade writes |

### The Compiled-Import Defect

The first version of `inferTriggerPhrases` imported `phrase-judge.mjs` by a relative path. The orchestrator found that this broke the compiled output: loading it failed with `ERR_MODULE_NOT_FOUND` for `dist/retrieval/lib/phrase-judge.mjs`, because the build holds no copy of that `.mjs` file.

The fix has three parts. `runtime/package.json` now exports `./cli/retrieval/lib/phrase-judge.mjs`. A new `phrase-judge.d.mts` declares `judgeTriggerPhrase` so the TypeScript import typechecks. `frontmatter-migration.ts` imports `@spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` through the `@spec-kit/runtime/*` path alias that the CLI `tsconfig.json` already carried. After the fix, typecheck and build both exit 0, and the compiled `dist/lib/frontmatter-migration.js` carries that package import and loads.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Wave 1 built the phase from `tasks.md`, one task per brief, with the diff checked before the next brief. Per the goal, the briefs ran as DeepSeek V4.1 Flash through cli-pi on the LLM Gateway route.

The brief for the upgrade-legacy test (T015, logged as 005-5) failed on that route with an API error, "reasoning_content in thinking mode must be passed back". The run wrote nothing. Under the parent goal's rule that a failing DeepSeek route switches to the other route, it was rerouted to the other DeepSeek lane (logged as DSO), which wrote the test, and the file then reported 18 passed.

### Review

Luna reviewed read-only and reported one P1: the grade loop covered only `spec.md` and `plan.md`, while the checklist requires all four document types. The fixture now adds an `implementation-summary.md` with an empty list, the loop grades spec, plan, tasks and summary, and the case pins the plan and summary refills as non-empty so the loop cannot pass on empty lists. The case passes after the fix. That was the only finding in round 1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions

| Decision | Status |
|----------|--------|
| Empty trigger_phrases list fallback | Decided 2026-10-08 by the operator: refill with the exact slug-seeder output. Built as decided |
| TEMPLATE_DEFAULTS | Decided 2026-10-08 by the operator: deleted, not pinned. Built as decided |
| Scope | Decided 2026-10-08 by the operator: widened to `inferTriggerPhrases`. Built as decided |
| Seeder loading | Deviation from the plan: `require()` instead of dynamic `import()`, recorded in spec.md section 10 |
| Judge import path | Deviation from the plan: a package export and a `.d.mts` file, added after the compiled build failed on the relative import |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -c TEMPLATE_DEFAULTS heal-spec-docs.cjs` | Prints 0; `rg TEMPLATE_DEFAULTS .skilled` finds no hit |
| `rg "'memory', 'indexing', 'context'" frontmatter-migration.ts` | No hit (the fallback sat at line 1020 before the build) |
| `create-root-numbering.vitest.ts` | 14 passed |
| `upgrade-legacy.vitest.ts` | 18 passed |
| Rerun of both files from the skill root with `--config vitest.config.ts` | `Test Files 2 passed`, `Tests 32 passed`, rc 0 |
| CLI typecheck and build after the import fix | rc 0 each |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, wave 1 final | rc 0; 162 files passed and 3 skipped, 1,648 tests passed and 19 skipped; baseline at `c85ec7f8803` was 161 files and 1,639 tests; legacy and validation suites 0 failed |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | rc 0 |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |

The cli suite count covers all of wave 1, not only this phase, so the 9-test rise over the baseline is shared with the other phases.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Follow-ups Outside This Phase

- `scaffold-debug-delegation.sh` writes the literal phrases `debug`, `delegation`, `scaffold` and `task <id>` into the debug report it scaffolds. The judge grades the first three `single-token`. The script is not called by `upgrade-legacy.mjs`, so it sits outside the rule this phase set, but it is another writer of rejected phrases.
- `plan.md` still says the healer loads the seeder with "dynamic `import()`", and its Definition of Ready and Definition of Done boxes are unticked. `plan.md` was outside the closing file list, so CHK-040 in `tasks.md` stays open until it is synchronized.
- `heal-spec-docs.cjs` now loads an ES module with `require()`. `runtime/cli/package.json` declares node `>=22.12.0`, and the reruns here used v26.8.2. It was not tried on an older Node.
<!-- /ANCHOR:limitations -->

---


