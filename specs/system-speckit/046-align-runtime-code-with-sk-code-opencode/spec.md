---
title: "Feature Specification: Align system-spec-kit runtime code with sk-code-opencode"
description: "The system-spec-kit runtime drifts from sk-code-opencode: 254 of 559 files lack a MODULE header, 185 of 312 large files lack numbered section dividers, 35 files mix both divider formats, and 2 code folders lack a README. A cheap DeepSeek loop fixes the comment and README drift; fact-checked folder merges follow."
trigger_phrases:
  - "spec kit runtime alignment"
  - "sk-code-opencode section dividers spec kit"
  - "spec kit runtime folder depth"
  - "spec kit code readme gaps"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Align system-spec-kit runtime code with sk-code-opencode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-30 |
| **Branch** | `main` (workspace choice deferred to the build) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code under `.skilled/skills/system-spec-kit/runtime/` does not follow the sk-code-opencode comment and structure rules in `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §2 and §4. The default mode of `verify_alignment_drift.py` reports 0 findings because it never checks section dividers or folder READMEs.

Measured on 2026-09-30 (census script over 559 JS/TS files, `node_modules` and `dist` excluded):

| Measure | Count |
|---------|-------|
| JS/TS files (tests) | 559 (301) |
| Files without a `MODULE:`/`COMPONENT:` header in the first 40 lines | 254 |
| `--check-exact-headers` findings | 40 errors, 1 warning |
| Files over 150 lines | 312 |
| ...of those with no numbered section divider | 185 |
| Non-test files over 150 lines / without numbered sections (the in-scope set) | 153 / 37 |
| Files using a non-standard divider shape | 80 |
| Files mixing Format A and Format B dividers, which §4 forbids | 35 |
| Code folders | 81 |
| Code folders with no `README.md` | 2: `cli/hermes`, `cli/hermes/tests` |
| Single-file leaf folders | 25 |

`runtime/shared` is a tracked symlink to `../shared/dist`, not a duplicated build tree; DeepSeek's report claimed otherwise and was wrong. The ARCHITECTURE.md for this skill exists and follows the shared 8-section skeleton.

### Purpose
Every runtime file carries the sk-code-opencode header and, when it is a non-test file over 150 lines, numbered section dividers in one format; every code folder has a README; and folders that exist only to hold one file are merged where a fact-check confirms it is safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- MODULE header on every runtime JS/TS file, tests included.
- Numbered section dividers on non-test files over 150 lines, one format per file, which also resolves the 35 mixed-format files.
- A code README for `runtime/cli/hermes` and `runtime/cli/hermes/tests`, unless the tests folder is merged away.
- Folder merges from the candidate list below, only for rows the SWE-2 MAX fact-check marks CONFIRMED, with every importer updated.
- A refresh of `ARCHITECTURE.md` §2 PACKAGE TOPOLOGY if merges change the tree.

### Out of Scope
- Behavior changes of any kind.
- Numbered sections inside test files, by operator decision on 2026-09-30.
- Extending the checker and adding the ARCHITECTURE template, owned by `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode`.
- `runtime/cli/runtime/` and `runtime/cli/runtime-mirrors/`, which are generated mirrors.

### Folder merges (DeepSeek proposal, SWE-2 MAX fact-check 2026-09-30)

Full importer lists: `scratch/investigation/devin-swe2max-merge-factcheck.md`.

| Folder | Target | Verdict | Action |
|--------|--------|---------|--------|
| `lib/hooks/` | `hooks/lib/` | CONFIRMED, wide blast | Merge by Opus, last. 5 runtime hook adapters, 1 test, `.skilled/plugins/system-completion-sentinel.js` outside the skill, about 12 docs and 3 generated indexes point at it |
| `cli/hermes/tests/` | `cli/tests/` | CONFIRMED | Merge; rewrite the test's own `SCRIPT` path |
| `tests/deep-loop/` | `tests/` | CONFIRMED | Merge; one `require` depth fix in the moved test |
| `tests/graph/` | `tests/` | CONFIRMED | Merge; two import depth fixes and the `tests/README.md` command example |

### Forbidden folder names

Operator rule, 2026-09-30: double-underscore folder names are forbidden, and test code lives only under `tests/`.

| Folder | Target | Action |
|--------|--------|--------|
| `tests/__helpers__/` (`test-env.ts`) | `tests/helpers/` | Rename; update 3 referencing files |
| `tests/embedders/__fixtures__/` | `tests/embedders/fixtures/` | Rename; update 4 referencing files |
| `cli/tests/__snapshots__/` | `cli/tests/snapshots/` | This is vitest's generated default name, so a rename alone would make vitest write a fresh snapshot and pass. Set `resolveSnapshotPath` in the vitest config first, move the `.snap` file, then confirm `scaffold-golden-snapshots.vitest.ts` still compares against the moved file |

Overlapping sibling names flagged for review, not for automatic merge: `lib/search` / `lib/discovery`, `data/` / `database/`, `lib/hooks` / `hooks/lib`, `cli/config` / `cli/core`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/**/*.{ts,js,cjs,mjs}` | Modify | Header and section-divider comments only |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/README.md` | Create | Code README |
| Confirmed merge folders and their importers | Move/Modify | Path moves and import rewrites |
| `.skilled/skills/system-spec-kit/ARCHITECTURE.md` | Modify | Topology refresh after merges |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No change alters runtime behavior: the typecheck and the full vitest suite pass after every batch, with the same pass count as the baseline taken before the first edit. |
| REQ-002 | Every loop edit touches comment and blank lines only; a batch whose diff changes a code line is reverted. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders` reports 0 errors on this runtime. |
| REQ-004 | Every code folder under `runtime/` has a `README.md`. |
| REQ-005 | Each CONFIRMED merge lands with all importers updated; each REJECTED merge is recorded with its reason. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Files without a header go from 254 to 0, non-test files over 150 lines without numbered sections from 37 to 0, and mixed-format files from 35 to 0.
- **SC-002**: Test pass count equals the pre-edit baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Checker flags and the loop driver from deep-loop child 029 | No done signal without them | Build 029's prerequisites first |
| Risk | DeepSeek edits a code line while adding comments | High | Per-batch diff filter reverts any non-comment change |
| Risk | Hook files load in every runtime session; a broken hook breaks all sessions | High | Hooks batch runs last, one file per brief, with the hook tests after each |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek brief names one file or one folder and one change.
- **NFR-P02**: The loop runs on DeepSeek V4.1 Flash at `high` through `opencode-go`, with `cline-pass` as the fallback route.

### Security
- **NFR-S01**: No credentials in briefs.

### Reliability
- **NFR-R01**: The loop is resumable: a batch is recorded done only after its checks pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Shebang lines stay first; the header follows them.
- `dist/` and the generated mirror trees are never edited.

### Error Scenarios
- Provider quota or timeout: the batch stays pending and is retried.

### State Transitions
- A merge that fails tests is reverted in full before the next one starts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 440 files, comment-only, plus up to 4 folder moves |
| Risk | 13/25 | Hook files run in every session |
| Research | 6/20 | Measured; merge list awaits fact-check |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The `lib/hooks/` merge reaches `.skilled/plugins/`, outside this skill. Keep it in this packet, or drop it and only record it?
<!-- /ANCHOR:questions -->

---
