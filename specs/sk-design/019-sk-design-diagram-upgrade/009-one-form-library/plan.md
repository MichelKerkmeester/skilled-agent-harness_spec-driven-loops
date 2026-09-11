---
title: "Implementation Plan: Phase 9: one-form-library"
description: "Merge assets/templates/ and assets/examples/ into assets/diagrams/, rewrite the applicator and checker to key on filename instead of directory, and repoint every file the inventory below found."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: one-form-library

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS (`.cjs`) for the two scripts; Markdown/JSON for everything else; `git mv` for every file move |
| **Framework** | None; `node --test` for the mutation suite, GitHub Actions for CI |
| **Storage** | Flat files only: 38 HTML forms, 38 PNGs, one palette JSON, one grid-baseline JSON, one mutation-fixture file, ~35 Markdown documents, one workflow file |
| **Testing** | `node scripts/check-diagram-corpus.cjs` piped and grepped for `RESULT: PASSED`; `node --test scripts/tests/`; `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` diffed against the moved corpus |

### Overview
This phase merges `assets/templates/` (4 files) and `assets/examples/` (34 files) into one `assets/diagrams/`, renaming the four skin skeletons to `starter-<skin>.html` and dropping the `example-` prefix from the 34 forms. Every script, config file and document that named the old split is repointed; the applicator's `--examples` mode is replaced with a `--forms`/`--all` pair read from `sk-design-chart/scripts/apply-design-md.cjs`'s shape (D12); the checker's directory-based `kind` classification becomes a basename match against the four starter names. The inventory below was built by running `rg` against the live tree, not from memory, per this phase's authoring brief.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `assets/templates/` (4 files) and `assets/examples/` (34 files) exist on disk in their current, pre-merge form
- [ ] `scripts/apply-diagram-tokens.cjs` and `scripts/check-diagram-corpus.cjs` exist on disk in their current, pre-merge form
- [ ] The full-inventory `rg` sweep below has been re-run against the live tree immediately before the first `git mv`, since a document could change between authoring and execution

### Definition of Done
- [ ] All fourteen requirements in `spec.md` are met, per the acceptance criteria in `acceptance-criteria.md`
- [ ] `rg -n "assets/(examples|templates)"` over the skill tree and `.github/workflows` returns nothing outside a changelog entry
- [ ] `check-diagram-corpus.cjs` prints `RESULT: PASSED`, `node --test scripts/tests/` exits `0`, and `--default --all` reproduces `assets/diagrams/` byte for byte except the recorded untokenized file
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A mechanical corpus move plus a filename-keyed classification rewrite, in that order: the files move first (T004-T006), then the two scripts that classified them by directory are rewritten to classify by basename (T007-T008), then every dependent script, config and document is repointed (T009-T019).

### Key Components
- **`assets/diagrams/`**: the merged directory, four starters plus 34 forms plus one merged `README.md`.
- **Basename classification**: a small constant, the four starter filenames, that both `apply-diagram-tokens.cjs` (which mode paints which file) and `check-diagram-corpus.cjs` (what `kind` a file carries) test against, replacing the `TEMPLATE_DIR`/`EXAMPLE_DIR` prefix test both scripts use today.
- **`--forms`/`--all`**: the applicator's new, mutually-exclusive selection pair, read from `apply-design-md.cjs`'s `parseArgs`/`formsFromOptions` shape and reproduced against `apply-diagram-tokens.cjs`'s own painting logic, never imported.
- **`catalog-bidirectional.cjs`'s starter exclusion**: the one family whose reverse-direction loop (every file needs a catalog row) would otherwise misfire on the four starters once they share a directory with the indexed forms.

### Data Flow
`apply-diagram-tokens.cjs` and `check-diagram-corpus.cjs` both currently derive a directory constant (`TEMPLATE_DIR`/`EXAMPLE_DIR` or `EXAMPLES_DIR`) from `path.join(PACKAGE_ROOT, 'assets', 'templates'|'examples')` and then test `file.startsWith(...)` against it. After this phase, both collapse to one `DIAGRAM_DIR = path.join(PACKAGE_ROOT, 'assets', 'diagrams')`, and the template-vs-example (now starter-vs-form) branch in each script tests the file's basename against the four starter names instead. `catalog-bidirectional.cjs` reads `ctx.exampleDir` from the shared context object `check-diagram-corpus.cjs` builds; once that context's directory is the merged one, the family's own reverse-direction loop needs the same starter exclusion the two upstream scripts apply, or the four starters will each report a spurious "no catalog row" error.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase's `research_intent` is a structural merge, not `fix_bug`. It is filled here anyway because
the two rewritten scripts (`apply-diagram-tokens.cjs`, `check-diagram-corpus.cjs`) are the diagram
skill's only producers of directory-based path handling, and every document below is a consumer of
the path or filename they, or the moved files themselves, produce.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/apply-diagram-tokens.cjs` (producer) | Two directory constants (`TEMPLATE_DIR`, `EXAMPLES_DIR`), a boolean `--examples` flag, directory-based paint dispatch | Rewrite: one `DIAGRAM_DIR`, `--forms`/`--all`, basename-based paint dispatch | `--default --all --out <tmp>` diffed against `assets/diagrams/` |
| `scripts/check-diagram-corpus.cjs` (producer) | Two directory constants, `kind` derived by `file.startsWith(TEMPLATE_DIR)` | Rewrite: one `DIAGRAM_DIR`, `kind` derived by basename match | `RESULT: PASSED`; per-family finding counts unchanged from the pre-move run |
| `scripts/families/accessible-svg.cjs`, `derivation-gates.cjs`, `marker-vocabulary.cjs` (consumers of `ctx.kind`) | Each tests `ctx.kind === 'template'` (or `!== 'template'`) | Not a consumer this phase edits - the upstream `kind`-derivation fix in `check-diagram-corpus.cjs` propagates without touching these three files | `RESULT: PASSED`'s per-family counts confirm the propagation held |
| `scripts/families/catalog-bidirectional.cjs` (consumer of `ctx.exampleDir`, producer of catalog findings) | Default path prefix `assets/examples/`, canonical check `example-${id}.html`, reverse loop over every file in `exampleDir` | Update: prefix `assets/diagrams/`, check `${id}.html`, reverse loop excludes the four starters | Corpus run reports zero new `catalog-bidirectional` findings |
| `scripts/families/node-budget.cjs` (unrelated consumer) | `if (kind === 'specimen') return;` - a guard for `assets/icons.html`, which never carried this kind and does not move | Not a consumer this phase touches - explicitly out of scope per D13's "that stays as it is" | `git diff` shows no change to this file |
| `assets/color/diagram-palette.json`, `scripts/families/grid-baseline.json`, `scripts/tests/mutation-cases.cjs` (consumers, path-bearing config) | Hold literal paths/filenames under the old split | Update every path/filename value | `check-diagram-corpus.cjs` and `node --test scripts/tests/` both green post-update |
| `references/catalog.md`, `SKILL.md`, 27 `type-*.md`, and ~15 more prose documents (consumers, read-only to the corpus check) | Hold literal path/filename prose | Update every reference | `rg -n "assets/(examples\|templates)"` returns nothing outside a changelog entry |
| `.github/workflows/diagram-corpus.yml` (consumer of the applicator's CLI and the corpus's directory layout) | Two applicator steps, one diffed against each old directory | Collapse into one `--default --all` step diffed against `assets/diagrams` | CI run green on this branch |
| `sk-design-chart/scripts/apply-design-md.cjs` (pattern source, read-only) | `--forms`/`--all` mutual exclusion in `parseArgs`/`formsFromOptions` | Not a consumer this phase touches - D12 hard block; shape read, never imported or edited | `git diff` over `sk-design-chart/` stays empty |

Required inventories (built from `rg`, not memory - the actual commands and their output, run
against the live tree on 2026-09-11):

**1. Literal path string `assets/(examples|templates)`, across the skill tree:**

```
rg -n "assets/(examples|templates)" .opencode/skills/sk-design/sk-design-diagram
```

204 matches across 49 files. By match count, the heaviest files: `references/catalog.md` (28),
`scripts/families/grid-baseline.json` (24), `SKILL.md` (10), `scripts/tests/mutation-cases.cjs` (8),
and 25 of the 27 `references/types/type-*.md` files (3-6 matches each). The full 49-file list, one
row per file, is in `spec.md`'s Files to Change table.

**2. The same pattern, across `.github/workflows`:**

```
rg -n "assets/(examples|templates)" .github/workflows
```

2 matches, both in `.github/workflows/diagram-corpus.yml` (the two `diff -rq` lines against
`assets/templates` and `assets/examples`).

**3. What the literal grep above does NOT catch - the two scripts building the same paths from
split arguments, found by reading each script rather than trusting the grep:**

```
grep -n "TEMPLATE_DIR\|EXAMPLE_DIR\|EXAMPLES_DIR" scripts/apply-diagram-tokens.cjs scripts/check-diagram-corpus.cjs
```

`apply-diagram-tokens.cjs:15-16` — `TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'assets', 'templates')`,
`EXAMPLES_DIR = path.join(PACKAGE_ROOT, 'assets', 'examples')`. `check-diagram-corpus.cjs:31-32` —
the same pattern, `TEMPLATE_DIR`/`EXAMPLE_DIR`. Because `'assets'` and `'templates'` are separate
string arguments to `path.join`, neither file contains the literal substring `assets/templates`, so
neither shows up in inventory 1 or in this phase's own completion-criterion grep. Both are edited by
this phase regardless (REQ-002, REQ-004); SC-001's grep alone is not proof these two files are done -
a direct read of both, post-edit, is required (T007-T008's own verify step).

**4. `kind`-classification logic, across every family (the other thing a path-string grep cannot
find, since these lines never mention "template" or "example" as a substring of a path):**

```
grep -n "kind\b" scripts/families/*.cjs scripts/check-diagram-corpus.cjs
```

Four hits: `check-diagram-corpus.cjs:143` (the derivation itself, directory-based, rewritten by
REQ-004), `accessible-svg.cjs:38`, `derivation-gates.cjs:22`, `marker-vocabulary.cjs:42` (all three
read `ctx.kind`, none of the three needs an edit once the upstream derivation is fixed), and
`node-budget.cjs:18` (`kind === 'specimen'`, unrelated - `specimen` is never an assigned kind value;
this line guards `assets/icons.html` and D13 says it stays as it is).

**5. `catalog-bidirectional.cjs`'s own exposure, found by reading the family in full (not caught by
either grep above, since its risk is behavioral, not textual):**

`scripts/families/catalog-bidirectional.cjs:46` defaults an un-prefixed catalog cell to
`assets/examples/${s}`; `:59` loops `fs.readdirSync(exampleDir)` and flags any file with no catalog
row. Once `exampleDir` (aliased to the merged directory) lists the four starters alongside the 34
indexed forms, that loop will flag all four as "no catalog row names this file" unless excluded -
they have never had a row and this phase does not add one. `:48-49`'s canonical check also hard-codes
`example-${id}.html`, which no longer matches once the prefix drops.

**6. Binary artifacts no text search can find - confirmed by directory listing and by grepping for
any document that names either screenshot path:**

```
find screenshots/examples -name "*.png" | wc -l   # 34
find screenshots/templates -name "*.png" | wc -l   # 4
rg -n "screenshots/(examples|templates)" .opencode/skills/sk-design/sk-design-diagram   # 0 matches
```

No document names either screenshot directory by path, so the move (T018) needs no companion prose
edit - confirmed by the empty `rg`, not assumed from the PNGs' silence.

**7. The renamed-corpus filename check, run before any `git mv`, to prove no collision:**

Every one of the 34 `example-<name>.html` files, with the prefix stripped, was compared against the
other 33 stripped names and against the four starter names (`starter-light`, `starter-dark`,
`starter-terminal`, `starter-full`). Zero collisions, zero internal duplicates - the full 34-row
before/after list is in this task's session evidence; a sample: `example-architecture.html` →
`architecture.html`, `example-sequence-oauth-dark.html` → `sequence-oauth-dark.html`.

**8. Shared renderer - confirmed to need no change:**

`sk-design/shared/scripts/render-screenshots.cjs` mirrors whatever directory structure exists under
whatever `<assets-root>` it is pointed at (`destinationFor` computes `path.relative(assetsRoot, src)`
generically); it does not hard-code `templates` or `examples`. Once `assets/diagrams/` exists, a
future re-render against the merged `assets/` root produces `screenshots/diagrams/*.png` with no
script edit - confirmed by reading the script, not assumed. This phase moves the existing PNGs by
`git mv` rather than re-rendering (the re-shoot is 011's job).

Algorithm invariant: after every `git mv` (T004-T005) and before any script edit (T007-T008), the
directory `assets/diagrams/` must hold exactly 38 `.html` files and `assets/templates/`,
`assets/examples/` must not exist; a script rewritten against a directory that does not yet exist,
or against one that still holds stale copies, proves nothing.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | `assets/diagrams/` holds exactly 38 `.html` files and one `README.md`; the two old directories no longer exist | `find`, `test -d` |
| Whole-corpus | `check-diagram-corpus.cjs` against the merged, renamed directory | `node scripts/check-diagram-corpus.cjs` |
| Applicator | `--default --all` reproduces every moved file byte for byte, except the recorded untokenized exception | `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` + `diff -rq` |
| Mutation | The existing suite, repointed, still proves each family fires for its stated reason | `node --test scripts/tests/` |
| Regression grep | No file outside a changelog entry still names the old paths | `rg -n "assets/(examples\|templates)"` over the skill tree and `.github/workflows` |
| History | A moved file's history survives the move | `git log --follow -- assets/diagrams/<file>` |
| CI | The collapsed applicator step and the corpus/mutation steps, on a real push | `.github/workflows/diagram-corpus.yml` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007-manual-review-remediation, 008-doctrine-reconciliation | Internal | Yellow - both authored, not yet executed | If either lands content edits after this phase's `git mv`, those edits target paths that no longer exist; sequencing (not blocking) is the mitigation, since this phase's own work does not depend on their content, only on not racing it |
| `scripts/apply-diagram-tokens.cjs`, `scripts/check-diagram-corpus.cjs` (003, 005's deliverables) | Internal | Green - both exist on disk today, read in full for this plan | Without them, REQ-002 and REQ-004 have nothing to rewrite |
| `sk-design-chart/scripts/apply-design-md.cjs` (pattern source, read-only) | Internal | Green - exists on disk, read for its `--forms`/`--all` shape | Without it, the applicator's new flag pair would be invented rather than ported (D12) |
| Node.js runtime, `node --test` | External | Green | None; unchanged from today's requirement |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the checker or applicator regresses after the rewrite - a finding count changes with no corresponding content change, or `--default --all` no longer reproduces the corpus byte for byte.
- **Procedure**: `git mv` preserves history in both directions, so a revert of this phase's commit range restores `assets/templates/`, `assets/examples/`, and both scripts' pre-merge form exactly. No data migration, no deployed state, no external system to reconcile.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inventory + collision check (T001-T003) ──┐
                                           ├──► File moves (T004-T006) ──► Script rewrites (T007-T014) ──► Repoint everything else (T015-T020) ──► Verify (T021-T027)
Pattern-source read (D12 confirm) ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | File moves |
| File moves | Setup | Script rewrites |
| Script rewrites | File moves | Repoint everything else |
| Repoint everything else | Script rewrites | Verify |
| Verify | Repoint everything else | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001-T003) | Low | 1 hour |
| File moves + script rewrites (T004-T014) | Medium-High | 4-6 hours |
| Repoint everything else (T015-T020) | Medium | 3-4 hours |
| Verification (T021-T027) | Low-Medium | 1-2 hours |
| **Total** | | **9-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable; every artifact is git-tracked and moved with `git mv`
- [ ] Feature flag configured - not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set - not applicable; GitHub Actions' own run history is the monitoring surface

### Rollback Procedure
1. Stop touching `assets/diagrams/`, `scripts/apply-diagram-tokens.cjs`, `scripts/check-diagram-corpus.cjs`, `scripts/families/*.cjs`, and the repointed documents.
2. `git revert` the phase's commit range.
3. Confirm `assets/templates/`, `assets/examples/`, `screenshots/templates/`, and `screenshots/examples/` are restored exactly, and both scripts read from the two old directories again.
4. Notify the operator and the 010/011 phase owners, since both depend on `assets/diagrams/` existing.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - no database; `git revert` is sufficient given every move is a tracked `git mv`.
<!-- /ANCHOR:enhanced-rollback -->

---
