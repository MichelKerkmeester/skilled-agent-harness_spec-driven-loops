---
title: "Feature Specification: Align system-skill-advisor runtime code with sk-code-opencode"
description: "The system-skill-advisor runtime drifts from sk-code-opencode: 113 of 132 large files lack numbered section dividers, 33 files lack a MODULE header, 2 code folders lack a README, and several single-file folders add nesting without a boundary. A cheap DeepSeek loop fixes the comment and README drift; fact-checked folder merges follow."
trigger_phrases:
  - "skill advisor runtime alignment"
  - "sk-code-opencode section dividers advisor"
  - "advisor runtime folder depth"
  - "advisor code readme gaps"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Align system-skill-advisor runtime code with sk-code-opencode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/070-runtime-code-alignment`, merged to `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code under `.skilled/skills/system-skill-advisor/runtime/` does not follow the sk-code-opencode comment and structure rules in `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §2 and §4. The checker that should catch this, `verify_alignment_drift.py`, reports 0 findings in its default mode because it never looks at section dividers or folder READMEs, so the drift has grown unseen.

Measured on 2026-09-30 (census script over 300 JS/TS files, `node_modules` and `dist` excluded):

| Measure | Count |
|---------|-------|
| JS/TS files (tests) | 300 (161) |
| Files without a `MODULE:`/`COMPONENT:` header in the first 40 lines | 33 |
| `--check-exact-headers` findings | 6 errors, 9 warnings |
| Files over 150 lines | 132 |
| ...of those with no numbered section divider | 113 |
| Non-test files over 150 lines / without numbered sections (the in-scope set) | 56 / 40 |
| Files using a non-standard divider shape (`// ----`, `// ===`, inline-titled rules) | 15 |
| Code folders | 52 |
| Code folders with no `README.md` | 2: `lib/routing`, `types` |
| Single-file leaf folders | 18 |

The ARCHITECTURE.md for this skill already exists and follows the 8-section skeleton it shares with system-spec-kit.

### Purpose
Every runtime file carries the sk-code-opencode header and, when it is a non-test file over 150 lines, numbered section dividers in one format; every code folder has a README; and folders that exist only to hold one file are merged where a fact-check confirms it is safe.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- MODULE header on every runtime JS/TS file, tests included.
- Numbered section dividers (Format A or B, one per file) on non-test files over 150 lines, replacing non-standard divider shapes.
- A code README for `runtime/lib/routing` and `runtime/types`, from `sk-create-readme/assets/readme-code-template.md`.
- Folder merges from the candidate list below, only for rows the SWE-2 MAX fact-check marks CONFIRMED, with every importer updated.
- A refresh of `ARCHITECTURE.md` §2 PACKAGE TOPOLOGY if merges change the tree.

### Out of Scope
- Behavior changes of any kind. The loop edits comments only; merges move files and rewrite import paths only.
- Numbered sections inside test files, by operator decision on 2026-09-30.
- Extending the checker and adding the ARCHITECTURE template. Both are owned by `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode`, which this packet depends on.

### Folder merges (DeepSeek proposal, SWE-2 MAX fact-check 2026-09-30)

Full importer lists: `scratch/investigation/devin-swe2max-merge-factcheck.md`.

| Folder | Target | Verdict | Action |
|--------|--------|---------|--------|
| `types/` | `lib/skill-graph/` | REJECTED | Stays. `tsconfig.json` maps it package-wide and 8 production modules import `better-sqlite3` |
| `lib/auth/` | `lib/` | REJECTED | Stays. Its README declares the auth boundary |
| `lib/context/` | `lib/` | CONFIRMED | Merge; 10 importers plus README tree rows |
| `lib/corpus/` | `lib/` | CONFIRMED | Merge; 3 importers, its own `../lifecycle` import, 6 doc links |
| `lib/routing/` | `lib/` | CONFIRMED, not a pure move | Merge by Opus, not DeepSeek. `CONFIG_DIR_CANDIDATES` walks up from `import.meta.url`; a move without rewriting it silently disables the route denylist |
| `tests/utils/` | `tests/` | CONFIRMED | Merge; one import in the moved test |
| `lib/scorer/lanes/__tests__/` | `tests/scorer/` | Repair and move | Worth keeping and broken, not dead: its migration-idempotency and embedding-skip cases are covered nowhere else. It runs under no vitest include and 2 imports point 5 levels up to paths that do not exist. Move it to `tests/scorer/`, fix all 6 imports, delete the folder |
| `stress-test/search-quality/` | none | Delete | Dead: `harness.ts` imports 3 modules that do not exist and runs under no config. Remove the folder and the `stress-test/skill-advisor/README.md` link to it |

### Forbidden folder names

Operator rule, 2026-09-30: double-underscore folder names (`__tests__`, `__fixtures__`, `__shared__` and the like) are forbidden, and test code lives only under `tests/`.

| Folder | Target | Action |
|--------|--------|--------|
| `tests/__fixtures__/` (`errors.ts`) | `tests/fixtures/` | Merge into the existing fixtures folder; update 4 referencing files |
| `tests/__shared__/` (`affordance-injection-fixtures.json`) | `tests/fixtures/` | Merge; update 3 referencing files |
| `lib/scorer/lanes/__tests__/` | `tests/scorer/` | Covered by the repair row above |

Overlapping sibling names flagged for review, not for automatic merge: `tests/fixtures` / `tests/__fixtures__`, `data/` / `database/`, `bench/` / `stress-test/`, `lib/utils/` / `lib/shared/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/**/*.{ts,js,cjs,mjs}` | Modify | Header and section-divider comments only |
| `.skilled/skills/system-skill-advisor/runtime/lib/routing/README.md` | Create | Code README |
| `.skilled/skills/system-skill-advisor/runtime/types/README.md` | Create | Code README, unless the folder is merged away |
| Confirmed merge folders and their importers | Move/Modify | Path moves and import rewrites |
| `.skilled/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | Topology refresh after merges |
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

- **SC-001**: Non-test files over 150 lines without numbered sections go from 40 to 0, and files without a header from 33 to 0.
- **SC-002**: Test pass count equals the pre-edit baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Checker flags and the loop driver from deep-loop child 029 | No done signal without them | Build 029's prerequisites first |
| Risk | DeepSeek edits a code line while adding comments | High | Per-batch diff filter reverts any non-comment change |
| Risk | DeepSeek's merge proposals are wrong; one checked claim missed importers | Med | SWE-2 MAX fact-check before any move; tests after each merge |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek brief names one file or one folder and one change, so a dispatch finishes in minutes.
- **NFR-P02**: The loop runs on DeepSeek V4.1 Flash at `high` through `opencode-go`, with `cline-pass` as the fallback route.

### Security
- **NFR-S01**: No credentials in briefs; dispatch env carries only the child-session flags.

### Reliability
- **NFR-R01**: The loop is resumable: a batch is recorded done only after its checks pass, so a rerun skips it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Files with a shebang or a `'use strict'` line keep it above the header.
- Generated files under `dist/` are never edited.

### Error Scenarios
- Provider quota or timeout: the batch is left pending and retried; nothing half-written is kept.
- A file that already has both divider formats is normalized to one.

### State Transitions
- A merge that fails tests is reverted in full before the next one starts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 140 files, comment-only, plus up to 8 folder moves |
| Risk | 10/25 | Import rewrites on merges; comment edits are behavior-neutral |
| Research | 6/20 | Measured; merge list awaits fact-check |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The dead-code rule (delete unless worth keeping and only broken) is applied in the merge table.
<!-- /ANCHOR:questions -->

---
