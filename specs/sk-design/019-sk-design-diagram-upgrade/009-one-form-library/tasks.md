---
title: "Tasks: Phase 9: one-form-library"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: one-form-library

<!-- SPECKIT_LEVEL: 2 -->

---

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

- [ ] T001 Re-run the full `rg -n "assets/(examples|templates)"` sweep over `.opencode/skills/sk-design/sk-design-diagram` and `.github/workflows` immediately before the first `git mv`, confirming the 49-file/204-match and 1-file/2-match counts `plan.md` records still hold (a document could have changed since authoring) (plan.md)
- [ ] T002 [P] Read `scripts/apply-diagram-tokens.cjs` and `scripts/check-diagram-corpus.cjs` in full, confirming `TEMPLATE_DIR`/`EXAMPLE_DIR`/`EXAMPLES_DIR` are still built from `path.join(PACKAGE_ROOT, 'assets', 'templates'|'examples')` at the line numbers `plan.md` cites, since these two files are rewritten, not created (scripts/apply-diagram-tokens.cjs, scripts/check-diagram-corpus.cjs)
- [ ] T003 [P] Re-verify the 34 de-prefixed form names against each other and against the four starter names for collisions (zero found in this authoring pass; re-check stands because the corpus could have gained a file since) (assets/examples/, assets/templates/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 `git mv` the four skin skeletons into `assets/diagrams/`, renaming `template.html`→`starter-light.html`, `template-dark.html`→`starter-dark.html`, `template-terminal.html`→`starter-terminal.html`, `template-full.html`→`starter-full.html` (REQ-001; D13) (assets/templates/*.html → assets/diagrams/starter-*.html)
- [ ] T005 `git mv` the 34 forms into `assets/diagrams/`, dropping the `example-` prefix from each filename (REQ-001; D13) (assets/examples/*.html → assets/diagrams/*.html)
- [ ] T006 Merge `assets/templates/README.md` and `assets/examples/README.md` into one `assets/diagrams/README.md` carrying both file inventories (four starters, 34 forms); delete the two source files (REQ-007) (assets/diagrams/README.md)
- [ ] T007 Rewrite `scripts/apply-diagram-tokens.cjs`: collapse `TEMPLATE_DIR`/`EXAMPLES_DIR` into one `DIAGRAM_DIR`; replace the boolean `--examples` flag with `--forms a,b` / `--all`, mutually exclusive, read from `apply-design-md.cjs`'s `parseArgs`/`formsFromOptions` shape (never imported, D12); keep `--default`'s byte-identical output and the existing `--skin` override (REQ-002; D12, D13) (scripts/apply-diagram-tokens.cjs)
- [ ] T008 In the same file, change the starter-vs-form paint dispatch from directory membership to a basename match against the four starter names, so `paintTemplate`/`paintExample` (or their renamed equivalents) are chosen correctly once both live under `DIAGRAM_DIR` (REQ-003) (scripts/apply-diagram-tokens.cjs)
- [ ] T009 Rewrite `scripts/check-diagram-corpus.cjs`: collapse `TEMPLATE_DIR`/`EXAMPLE_DIR` into one `DIAGRAM_DIR`; change the `kind` derivation at the former directory-prefix test to a basename match against the four starter names (REQ-004) (scripts/check-diagram-corpus.cjs)
- [ ] T010 Update `scripts/families/catalog-bidirectional.cjs`: default un-prefixed catalog cells to `assets/diagrams/` instead of `assets/examples/`; change the canonical-filename check from `example-${id}.html` to `${id}.html`; exclude the four starter filenames from the reverse-direction loop (every corpus file needs a row) (REQ-005) (scripts/families/catalog-bidirectional.cjs)
- [ ] T011 [P] Reword `scripts/families/marker-vocabulary.cjs`'s template-exemption comment to name the four starters explicitly; the `ctx.kind === 'template'` assertion itself is unchanged, since T009's upstream fix keeps `kind` correct (REQ-014) (scripts/families/marker-vocabulary.cjs)
- [ ] T012 [P] Confirm `scripts/families/node-budget.cjs`'s `kind === 'specimen'` guard is left untouched - it guards `assets/icons.html`, which never moves and never carried this kind (REQ-014; D13) (scripts/families/node-budget.cjs)
- [ ] T013 [P] Repoint `scripts/families/grid-baseline.json`'s 24 path keys to the renamed `assets/diagrams/` paths and filenames, leaving every recorded violation count and pixel value unchanged (REQ-009; D5) (scripts/families/grid-baseline.json)
- [ ] T014 [P] Repoint `scripts/tests/mutation-cases.cjs`'s 8 file references to the renamed corpus, confirming each case's patched anchor still exists at that location in the renamed file (REQ-010) (scripts/tests/mutation-cases.cjs)
- [ ] T015 Repoint `assets/color/diagram-palette.json`'s `pins` array (4 entries), `examples.skinByFile` key (`example-loop-terminal.html`→`loop-terminal.html`), and `examples.untokenized` entry (`assets/examples/example-sequence-oauth-dark.html`→`assets/diagrams/sequence-oauth-dark.html`); no other key is renamed or restructured (REQ-008) (assets/color/diagram-palette.json)
- [ ] T016 Repoint `references/catalog.md`'s sentinel-bound table: every `canonical`/`variants`/`imports` cell moves from `assets/examples/example-<name>.html` to `assets/diagrams/<name>.html`, row count and header shape unchanged (REQ-006) (references/catalog.md)
- [ ] T017 [P] Repoint `SKILL.md`'s 10 references to the four starter names and the `assets/diagrams/` path (REQ-012) (SKILL.md)
- [ ] T018 [P] Repoint the 27 `references/types/type-*.md` files and `references/types/README.md`, `references/foundations/style-guide.md`, `references/foundations/derivation-record.md`, `references/import-export/import-drawio.md`, `references/import-export/import-mermaid.md` (REQ-012) (references/types/type-*.md, references/types/README.md, references/foundations/style-guide.md, references/foundations/derivation-record.md, references/import-export/import-drawio.md, references/import-export/import-mermaid.md)
- [ ] T019 [P] Repoint `feature-catalog/import-export/drawio-import.md`, `mermaid-import.md`, `feature-catalog/diagram-generation/primitive-variants.md`, `editorial-style-and-connectors.md`, and `manual-testing-playbook/manual-testing-playbook.md`, `capture-review/capture-review.md`, `diagram-generation/primitive-variants.md`, `editorial-style-and-connectors.md`, `type-selection-and-routing.md` (REQ-012) (feature-catalog/import-export/drawio-import.md, feature-catalog/import-export/mermaid-import.md, feature-catalog/diagram-generation/primitive-variants.md, feature-catalog/diagram-generation/editorial-style-and-connectors.md, manual-testing-playbook/manual-testing-playbook.md, manual-testing-playbook/capture-review/capture-review.md, manual-testing-playbook/diagram-generation/primitive-variants.md, manual-testing-playbook/diagram-generation/editorial-style-and-connectors.md, manual-testing-playbook/diagram-generation/type-selection-and-routing.md)
- [ ] T020 `git mv` `screenshots/examples/` (34 PNGs) and `screenshots/templates/` (4 PNGs) into `screenshots/diagrams/`, unre-rendered; confirm no document names either old screenshot path before or after (REQ-013) (screenshots/examples/, screenshots/templates/ → screenshots/diagrams/)
- [ ] T021 Collapse `.github/workflows/diagram-corpus.yml`'s two applicator steps into one: `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>`, then `diff -rq --exclude=sequence-oauth-dark.html <tmp> assets/diagrams` (REQ-011) (.github/workflows/diagram-corpus.yml)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Run `node scripts/check-diagram-corpus.cjs` against the merged corpus; confirm `RESULT: PASSED` and that every family's finding count matches the pre-move baseline exactly, since no file's actual content changed in this phase (scripts/check-diagram-corpus.cjs)
- [ ] T023 Run `node --test scripts/tests/`; confirm all cases pass, including the whole-corpus precondition and the completeness triple (scripts/tests/)
- [ ] T024 Run `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` and `diff -rq --exclude=sequence-oauth-dark.html <tmp> assets/diagrams`; confirm the diff is empty (scripts/apply-diagram-tokens.cjs)
- [ ] T025 Confirm `git log --follow -- assets/diagrams/<file>` reaches the pre-move commit for one sampled starter, one sampled form, and one sampled screenshot (assets/diagrams/, screenshots/diagrams/)
- [ ] T026 Re-run `rg -n "assets/(examples|templates)"` over the skill tree and `.github/workflows`; confirm zero matches outside a changelog entry describing the move (SC-001) (.opencode/skills/sk-design/sk-design-diagram, .github/workflows)
- [ ] T027 Push a confirming commit and read the CI run: corpus check green, applicator step green, mutation suite green (.github/workflows/diagram-corpus.yml)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [ ] CHK-001 [P0] Requirements documented in spec.md - REQ-001 through REQ-014 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md - inventory, architecture, and affected-surfaces sections present
- [ ] CHK-003 [P1] Dependencies identified and available - `apply-diagram-tokens.cjs`, `check-diagram-corpus.cjs`, and `apply-design-md.cjs` all read and cited before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - the rewritten scripts follow the existing file's own CommonJS style; no new lint config introduced
- [ ] CHK-011 [P0] No console errors or warnings - the checker and applicator print `RESULT: PASSED`/`RESULT: FAILED` and a matching exit code, unchanged from today's contract
- [ ] CHK-012 [P1] Error handling implemented - a `--forms` name matching neither a starter nor a form fails closed with the existing `fail()` helper, not a silent no-op
- [ ] CHK-013 [P1] Code follows project patterns - no comment in any touched script embeds a task id, requirement id, or finding id (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - AC-001 through AC-014 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested - the collision check (T003), the starter-exclusion regression (T010, T022), and the stale-pointer sequencing risk (T007-T009 before T022) each map to a task or a verify step
- [ ] CHK-023 [P1] Every requirement this node owns (REQ-001 through REQ-014) appears in a task line above; the D13 references and the D12 hard block are recorded in T004-T009 and goal.md's LOG
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is a structural merge - it moves and renames a
corpus, it does not repair a known-bad behavior. The finding-class/producer-inventory/adversarial-
table apparatus does not apply; the affected-surfaces inventory in `plan.md` covers the same ground
for this phase's actual shape. Traceability is instead covered by CHK-023 above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - no script or workflow file this phase touches reads a credential or an environment variable
- [ ] CHK-031 [P0] Input validation implemented - the applicator's `--forms`/`--all` mutual exclusion fails closed on both named together, mirroring `apply-design-md.cjs`'s own guard
- [ ] CHK-032 [P1] Auth/authz working correctly - not applicable; local tooling plus a public-repo CI workflow with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized - REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate - `marker-vocabulary.cjs`'s reworded comment names the four starters; no ephemeral id added anywhere (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) - `assets/diagrams/README.md` is this phase's own deliverable (T006)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - this authoring pass created no temp files; the applicator's diff target (`<tmp>`) is a throwaway path outside the repository, never scratch/
- [ ] CHK-051 [P1] scratch/ cleaned before completion - not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---
