---
title: "Feature Specification: Phase 9: one-form-library"
description: "Merge assets/templates/ and assets/examples/ into one assets/diagrams/, dropping the template/example split and every prefix that names it, and repoint everything that still names the old paths."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: one-form-library

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 11 |
| **Predecessor** | 008-doctrine-reconciliation |
| **Successor** | 010-design-md-style-reference |
| **Handoff Criteria** | `rg -n "assets/(examples\|templates)"` over the skill and `.github/workflows` returns nothing outside a changelog entry; `check-diagram-corpus.cjs` prints `RESULT: PASSED`; `--default --all` reproduces `assets/diagrams/` byte for byte; `git log --follow` reaches the pre-move commit on a sampled file. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the remediate the manual review and bring the diagram corpus to one adjustable form library themed from a DESIGN.md specification.

**Scope Boundary**: Two directories become one, `assets/diagrams/`; every path, filename and script rule that named the old split moves with it. No pixel is repainted, no finding from the manual review is fixed, and no capture is re-shot — those are 007's, 007's, and 011's work respectively. This phase is the mechanical merge and every repoint it forces.

**Dependencies**:
- 007-manual-review-remediation and 008-doctrine-reconciliation should land their content edits against the current `assets/templates/`/`assets/examples/` paths before this phase's `git mv` runs, so the move carries settled content rather than racing a parallel edit to the same file.
- 003-applicator-and-sentinels' `apply-diagram-tokens.cjs` and 005-checker-mutations-and-ci's `check-diagram-corpus.cjs` are the two scripts this phase rewrites; both must exist on disk in their current (pre-merge) form before this phase starts.
- `sk-design-chart/scripts/apply-design-md.cjs`'s `--forms`/`--all` argument pair is the read-only pattern this phase's applicator adopts (D12; never imported or edited).

**Deliverables**:
- `assets/diagrams/`: 4 renamed skin starters, 34 renamed forms, one merged `README.md`.
- `scripts/apply-diagram-tokens.cjs` and `scripts/check-diagram-corpus.cjs`, both rewritten against one directory and one file-naming rule.
- `screenshots/diagrams/`, holding the same 38 PNGs `screenshots/templates/` and `screenshots/examples/` held, unre-rendered.
- Every reference document, palette file, mutation fixture and CI workflow step repointed to the new paths.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The diagram skill splits its 38 worked diagrams into two directories by a distinction nobody uses: `assets/templates/` (4 skin skeletons) and `assets/examples/` (34 finished diagrams, each named with a redundant `example-` prefix). The chart skill's own `assets/templates/` holds 29 worked charts with no such split. Forty-nine files across the skill — `SKILL.md`, 27 type references, two READMEs, a palette JSON, a grid baseline, a mutation-fixture file, and more — spell out the split by path or filename, and the applicator carries a `--examples` mode that exists only because the directories are two.

### Purpose
One directory, `assets/diagrams/`, holds all 38 forms under names that say what they draw rather than which bin they were filed in; every file, script and document that named the old split points at the new one, and `git log --follow` still reaches each file's history.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renaming and `git mv`-ing the four skin skeletons (`template.html` → `starter-light.html`, `template-dark.html` → `starter-dark.html`, `template-terminal.html` → `starter-terminal.html`, `template-full.html` → `starter-full.html`) and the 34 forms (`example-<name>.html` → `<name>.html`) into one `assets/diagrams/` directory.
- Merging `assets/templates/README.md` and `assets/examples/README.md` into one `assets/diagrams/README.md`.
- Rewriting `scripts/apply-diagram-tokens.cjs` to read and write one directory, replacing its boolean `--examples` flag with a `--forms a,b` / `--all` pair mirroring `sk-design-chart/scripts/apply-design-md.cjs`, while keeping `--default`'s byte-identical output and the existing `--skin` override.
- Rewriting `scripts/check-diagram-corpus.cjs` so its per-file `kind` is decided by matching a file's basename against the four starter names, not by which of two directories it used to live under.
- Updating `scripts/families/catalog-bidirectional.cjs`'s default path prefix, its `example-${id}.html` canonical-filename check, and adding the four-starter exclusion its reverse-direction loop needs once starters and forms share a directory.
- Rewording (not weakening) `scripts/families/marker-vocabulary.cjs`'s template-exemption comment to name the four starters explicitly.
- Repointing `scripts/families/grid-baseline.json`'s 24 path keys, `scripts/tests/mutation-cases.cjs`'s 8 file references, and `assets/color/diagram-palette.json`'s `pins`, `examples.skinByFile` and `examples.untokenized` values.
- Repointing every prose reference to the old paths in `references/catalog.md`'s sentinel table, `SKILL.md`, the 27 `references/types/type-*.md` files, `references/types/README.md`, `references/foundations/style-guide.md`, `references/foundations/derivation-record.md`, `references/import-export/import-drawio.md`, `references/import-export/import-mermaid.md`, two `feature-catalog/import-export/*.md` rows, two `feature-catalog/diagram-generation/*.md` rows, and five `manual-testing-playbook/**/*.md` files.
- `git mv`-ing `screenshots/examples/` (34 PNGs) and `screenshots/templates/` (4 PNGs) into `screenshots/diagrams/`, unre-rendered.
- Collapsing `.github/workflows/diagram-corpus.yml`'s two applicator steps (one per old directory) into one `--default --all` step diffed against `assets/diagrams/`.

### Out of Scope
- Fixing any of the 34 manual-review findings (F1-F34) or resolving any systemic pattern (S1-S10) - that is 007-manual-review-remediation's job; this phase moves files, it does not repaint one.
- Reconciling the doc-versus-corpus contradictions the manual review found (S6's dot-pattern default, S7's `rule-solid` disagreement, S9's dead sentinel tokens) - that is 008-doctrine-reconciliation's job.
- Re-shooting any screenshot - the committed PNGs travel unre-rendered; 011-full-page-capture re-shoots them full page.
- Building the DESIGN.md Style Reference applicator - that is 010's job; this phase only carries `apply-diagram-tokens.cjs` forward with a directory merge, not a new painting mode.
- Fixing `references/types/type-sequence.md`'s pre-existing references to `example-sequence-dark.html` and `example-sequence-full.html`, neither of which exists in the corpus today - a content accuracy defect unrelated to the path merge, out of this phase's scope lock.
- Any change to `sk-design-chart/` - D12 is a hard block; `apply-design-md.cjs`'s `--forms`/`--all` shape is read, never imported or edited.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `assets/templates/template.html`, `template-dark.html`, `template-terminal.html`, `template-full.html` | Move (git mv) | → `assets/diagrams/starter-light.html`, `starter-dark.html`, `starter-terminal.html`, `starter-full.html` |
| `assets/examples/example-*.html` (34 files) | Move (git mv) | → `assets/diagrams/*.html`, dropping the `example-` prefix |
| `assets/templates/README.md`, `assets/examples/README.md` | Delete + Create | Merge into `assets/diagrams/README.md` |
| `scripts/apply-diagram-tokens.cjs` | Modify | One `DIAGRAM_DIR`; `--forms`/`--all` replaces `--examples`; starter/form dispatch by basename |
| `scripts/check-diagram-corpus.cjs` | Modify | One `DIAGRAM_DIR`; `kind` derived by basename match against the four starters |
| `scripts/families/catalog-bidirectional.cjs` | Modify | Default prefix, canonical-filename check, and starter exclusion updated |
| `scripts/families/marker-vocabulary.cjs` | Modify | Comment reworded to name the four starters; assertion logic unchanged |
| `scripts/families/grid-baseline.json` | Modify | 24 path keys repointed |
| `scripts/tests/mutation-cases.cjs` | Modify | 8 file references repointed |
| `assets/color/diagram-palette.json` | Modify | `pins`, `examples.skinByFile`, `examples.untokenized` repointed |
| `references/catalog.md` | Modify | Sentinel table's canonical/variants/imports cells repointed |
| `SKILL.md` | Modify | 10 path references repointed |
| `references/types/type-*.md` (27 files), `references/types/README.md` | Modify | Every old-path reference repointed |
| `references/foundations/style-guide.md`, `references/foundations/derivation-record.md` | Modify | Path references repointed |
| `references/import-export/import-drawio.md`, `import-mermaid.md` | Modify | Path references repointed |
| `feature-catalog/import-export/drawio-import.md`, `mermaid-import.md`, `feature-catalog/diagram-generation/primitive-variants.md`, `editorial-style-and-connectors.md` | Modify | Path references repointed |
| `manual-testing-playbook/manual-testing-playbook.md`, `capture-review/capture-review.md`, `diagram-generation/primitive-variants.md`, `editorial-style-and-connectors.md`, `type-selection-and-routing.md` | Modify | Path references repointed |
| `screenshots/examples/`, `screenshots/templates/` (38 PNGs) | Move (git mv) | → `screenshots/diagrams/`, unre-rendered |
| `.github/workflows/diagram-corpus.yml` | Modify | Two applicator steps collapse into one `--default --all` step against `assets/diagrams` |
| `../changelog/` (new file) | Create | Version-bump entry recording the merge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The four skin skeletons and 34 forms MUST live under one directory, `assets/diagrams/`, with the skeletons renamed `starter-light.html`, `starter-dark.html`, `starter-terminal.html`, `starter-full.html` and the forms renamed by dropping the `example-` prefix, every move performed as `git mv` so `git log --follow` reaches the pre-move commit (D13). |
| REQ-002 | `scripts/apply-diagram-tokens.cjs` MUST read from and write to the single `assets/diagrams/` directory, replace its boolean `--examples` flag with a `--forms a,b` / `--all` pair mirroring `sk-design-chart/scripts/apply-design-md.cjs`'s mutually-exclusive selection, and MUST keep `--default`'s byte-identical reproduction and the existing `--skin` override (D13). |
| REQ-003 | The applicator's per-file painting choice - sentinel-block substitution for a starter, literal-hex remapping for a form - MUST be decided by matching the file's basename against the four starter names, never by which of two directories the file used to live in. |
| REQ-004 | `scripts/check-diagram-corpus.cjs` MUST derive its per-file `kind` from the same four-starter basename match rather than a `TEMPLATE_DIR`/`EXAMPLE_DIR` directory prefix, so the three families that branch on `kind` (`accessible-svg`, `derivation-gates`, `marker-vocabulary`) continue to hold with no edit of their own. |
| REQ-005 | `scripts/families/catalog-bidirectional.cjs` MUST resolve its default path prefix and canonical-filename check against the renamed corpus (`assets/diagrams/`, `${id}.html` with no `example-` prefix) and MUST exclude the four starter files from its file-to-row reverse-direction check, since starters carry no catalog row today and none is added by this phase. |
| REQ-006 | `references/catalog.md`'s sentinel-bound table MUST repoint every `canonical`/`variants`/`imports` cell to the renamed path and filename, with row count and header shape unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `assets/templates/README.md` and `assets/examples/README.md` MUST merge into one `assets/diagrams/README.md` carrying both file inventories, and the surviving document's own relative links MUST resolve. |
| REQ-008 | `assets/color/diagram-palette.json`'s `pins` array, `examples.skinByFile` key, and `examples.untokenized` entry MUST repoint to the renamed paths and filenames; no other key in the file is renamed or restructured. |
| REQ-009 | `scripts/families/grid-baseline.json`'s 24 path keys MUST repoint to the renamed paths, with every file's recorded violation count and pixel value unchanged - D5's ratchet binds per file, not per path string. |
| REQ-010 | `scripts/tests/mutation-cases.cjs`'s 8 file references MUST repoint to the renamed corpus, and every anchor its cases patch MUST still exist at that anchor in the renamed file. |
| REQ-011 | `.github/workflows/diagram-corpus.yml` MUST collapse its two applicator steps into one step calling `--default --all --out <dir>` and diffing against `assets/diagrams`, excluding the renamed untokenized file (`sequence-oauth-dark.html`) rather than its old name. |
| REQ-012 | Every prose reference to the old paths across `SKILL.md`, the 27 `references/types/type-*.md` files, `references/types/README.md`, `references/foundations/style-guide.md`, `references/foundations/derivation-record.md`, `references/import-export/import-drawio.md`, `import-mermaid.md`, the four named `feature-catalog/*.md` rows, and the five named `manual-testing-playbook/**/*.md` files MUST repoint to the renamed paths and filenames. |
| REQ-013 | `screenshots/examples/` (34 PNGs) and `screenshots/templates/` (4 PNGs) MUST merge into `screenshots/diagrams/` by `git mv`, keeping the existing 38 PNG bytes unre-rendered. |
| REQ-014 | `scripts/families/marker-vocabulary.cjs`'s template-exemption comment MUST be reworded to name the four starters rather than "a template"; `scripts/families/node-budget.cjs`'s existing `kind === 'specimen'` guard MUST be left exactly as it is, since it guards `assets/icons.html`, which does not move. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "assets/(examples|templates)" .opencode/skills/sk-design/sk-design-diagram .github/workflows` returns nothing outside a changelog entry that describes the move.
- **SC-002**: `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED`, and `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` exits `0`.
- **SC-003**: `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` reproduces every file under `assets/diagrams/` byte for byte, except the recorded untokenized exception.
- **SC-004**: `git log --follow -- assets/diagrams/<file>` reaches the pre-move commit for a sampled starter, form, and screenshot.
- **SC-005**: `screenshots/diagrams/` holds 38 PNGs, one per form; `screenshots/examples/` and `screenshots/templates/` no longer exist.
- **SC-006**: `git diff` over `sk-design-chart/` is empty for this phase (D12).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 007 and 008's content edits landing on the pre-move paths first | A `git mv` racing a parallel content edit to the same file produces an avoidable rebase conflict | Confirm 007/008's status before starting T004-T005; if either is mid-edit, sequence this phase after |
| Dependency | 003's applicator and 005's checker existing in their pre-merge form | Both scripts are rewritten, not created; if either is missing or already partially edited, the rewrite has no known baseline to diff against | T001 reads both files on disk before any edit |
| Risk | A prose file this inventory missed keeps a dangling old-path reference | The phase's own completion criterion (SC-001) would fail, or worse, pass on an incomplete `rg` pattern | The `rg` inventory in `plan.md` covers the whole skill tree and `.github/workflows`, not a hand-picked file list; SC-001 reruns the same command at the end |
| Risk | `check-diagram-corpus.cjs`'s `kind`-derivation rewrite silently changes which files `accessible-svg`, `derivation-gates`, or `marker-vocabulary` flag | The checker could shift from `RESULT: PASSED` to a false failure, or worse, a false pass on a real defect | Run the checker before and after the rewrite and diff its per-family finding counts; they must match exactly, since no file's actual content changed |
| Risk | `catalog-bidirectional.cjs`'s reverse-direction loop false-positives on the four starters once they share a directory with the indexed forms | Four spurious "no catalog row names this file" errors on files that were never meant to be indexed | REQ-005's starter exclusion is a dedicated task with its own verify step (a corpus run reporting zero new findings) |
| Risk | The applicator's `--forms`/`--all` rewrite breaks `--default`'s documented byte-identity property | 002/003's signed contract (`--default reproduces the stock bytes`) would silently regress | SC-003 re-derives every file through `--default --all` and diffs the output against the moved corpus before this phase closes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies. The move touches 76 files (38 HTML forms, 38 PNGs) plus roughly 20 scripts and documents; the only timing concern is the applicator and checker's own run time against 38 files, unchanged from today's 38-file run.

### Security
- **NFR-S01**: No auth surface. Every touched file is local; the CI workflow's collapsed applicator step still fetches nothing beyond the one already-allowlisted Google Fonts link the corpus's `no-external` family holds.

### Reliability
- **NFR-R01**: No uptime target applies. Determinism target: `apply-diagram-tokens.cjs --default --all` against the moved corpus produces the same bytes on two runs, and `check-diagram-corpus.cjs` produces the same finding count on two runs against an unmutated `assets/diagrams/`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A de-prefixed form name colliding with a starter name, or with another de-prefixed form name - checked directly against the live 34-file listing before any `git mv` runs; zero collisions found (see `plan.md`'s inventory).
- `assets/icons.html`, the specimen sheet `references/catalog.md` already excludes from indexing - it does not move, since it was never under `assets/templates/` or `assets/examples/` to begin with, and no reference to it names either old directory.

### Error Scenarios
- A `git mv` landing before its target's referencing scripts are updated - the checker and applicator would then read a stale `TEMPLATE_DIR`/`EXAMPLE_DIR` pointing at directories that no longer exist. Tasks sequence the script rewrites (T007-T013) to complete before the moves are treated as final, and T022's corpus run is the check that catches a stale pointer.
- `catalog-bidirectional.cjs`'s reverse-direction loop flagging a starter file post-merge (see Risks) - REQ-005 names the exclusion explicitly rather than leaving it to be discovered by a red run.

### State Transitions
- Mid-phase, `assets/templates/` and `assets/examples/` are briefly both present alongside a partially-populated `assets/diagrams/` - not a state this phase leaves committed; the move is one atomic set of `git mv` operations per T004-T005, not an incremental migration.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | 38 HTML `git mv`s, 38 PNG `git mv`s, 2 script rewrites, 1 family-rule rewrite, 1 family reword, 3 config files, ~35 prose files, 1 CI workflow - wide in file count, but each individual edit is mechanical |
| Risk | 12/25 | No auth, no API, no production data - but a checker or applicator regression would silently pass a corpus that no longer matches what the three affected families actually assert |
| Research | 9/20 | The inventory is read directly off disk via `rg` (documented in `plan.md`); the only genuine unknowns were the two split-argument path constants no literal grep catches and the `catalog-bidirectional.cjs` reverse-direction exposure, both found by reading the scripts, not assumed |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the merged `assets/diagrams/README.md` orders its table by the four starters first or interleaves them alphabetically with the 34 forms - left to whichever task authors the merge, since neither ordering affects the corpus check's own catalog-bidirectional assertion.
- Whether the applicator's internal option name (`isExamples` today) is renamed to something starter/form-neutral as part of the `--forms`/`--all` rewrite, or left as an internal variable name while only its CLI surface changes - left to the executing task, since neither choice is externally observable.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md`'s `L2: ENHANCED ROLLBACK` section - this packet carries no separate `decision-record.md` file

---
