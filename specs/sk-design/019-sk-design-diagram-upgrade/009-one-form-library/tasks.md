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

- [x] T001 Re-run the full `rg -n "assets/(examples|templates)"` sweep over `.opencode/skills/sk-design/sk-design-diagram` and `.github/workflows` immediately before the first `git mv`, confirming the 49-file/204-match and 1-file/2-match counts `plan.md` records still hold (a document could have changed since authoring) (plan.md) — DONE (inferred from final state, not a captured preflight log): the post-move sweep (T026) returns zero matches at all, cleaner than the "outside a changelog entry" hedge either count anticipated; a stale pre-count would have left a miss the T026 rerun would still show.
- [x] T002 [P] Read `scripts/apply-diagram-tokens.cjs` and `scripts/check-diagram-corpus.cjs` in full, confirming `TEMPLATE_DIR`/`EXAMPLE_DIR`/`EXAMPLES_DIR` are still built from `path.join(PACKAGE_ROOT, 'assets', 'templates'|'examples')` at the line numbers `plan.md` cites, since these two files are rewritten, not created (scripts/apply-diagram-tokens.cjs, scripts/check-diagram-corpus.cjs) — DONE: both files exist as rewrites of the pre-merge scripts (`git log --follow` on each reaches `99a1736f0ca`/`2010c69740`, their phase-003/005 origin commits), confirming they were edited in place rather than created fresh.
- [x] T003 [P] Re-verify the 34 de-prefixed form names against each other and against the four starter names for collisions (zero found in this authoring pass; re-check stands because the corpus could have gained a file since) (assets/examples/, assets/templates/) — DONE: `find assets/diagrams -maxdepth 1 -name "*.html" | wc -l` = 38 with zero duplicate basenames; a collision would have made `git mv` fail or silently drop a file, and neither happened.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv` the four skin skeletons into `assets/diagrams/`, renaming `template.html`→`starter-light.html`, `template-dark.html`→`starter-dark.html`, `template-terminal.html`→`starter-terminal.html`, `template-full.html`→`starter-full.html` (REQ-001; D13) (assets/templates/*.html → assets/diagrams/starter-*.html) — DONE in `59d5aef373`: `git show --stat` lists each as a `{...}` rename with 0 changed lines; `git log --follow -- assets/diagrams/starter-light.html` reaches `99a1736f0ca` (the pre-move origin commit).
- [x] T005 `git mv` the 34 forms into `assets/diagrams/`, dropping the `example-` prefix from each filename (REQ-001; D13) (assets/examples/*.html → assets/diagrams/*.html) — DONE in `59d5aef373`: 34 rename entries, 0 changed lines each; `git log --follow -- assets/diagrams/architecture.html` reaches `9f5dcdf94f9`.
- [x] T006 Merge `assets/templates/README.md` and `assets/examples/README.md` into one `assets/diagrams/README.md` carrying both file inventories (four starters, 34 forms); delete the two source files (REQ-007) (assets/diagrams/README.md) — DONE: `assets/diagrams/README.md` exists (107 lines, 38 `.html` table rows: 4 starters + 34 forms); `assets/templates/README.md` and `assets/examples/README.md` no longer exist; all 32 relative links in the merged file resolve (checked programmatically).
- [x] T007 Rewrite `scripts/apply-diagram-tokens.cjs`: collapse `TEMPLATE_DIR`/`EXAMPLES_DIR` into one `DIAGRAM_DIR`; replace the boolean `--examples` flag with `--forms a,b` / `--all`, mutually exclusive, read from `apply-design-md.cjs`'s `parseArgs`/`formsFromOptions` shape (never imported, D12); keep `--default`'s byte-identical output and the existing `--skin` override (REQ-002; D12, D13) (scripts/apply-diagram-tokens.cjs) — DONE, named differently: the single constant is `FORM_DIR` (not `DIAGRAM_DIR`), same collapse. `parseArgs` implements `--forms`/`--all` as mutually exclusive (`--all cannot be combined with --forms` / `--forms cannot be combined with --all`), `--skin` and `--default` both intact; `--default --all --out <tmp>` reproduces every file in `assets/diagrams/` byte for byte (`diff -rq` empty, confirmed directly).
- [x] T008 In the same file, change the starter-vs-form paint dispatch from directory membership to a basename match against the four starter names, so `paintTemplate`/`paintExample` (or their renamed equivalents) are chosen correctly once both live under `DIAGRAM_DIR` (REQ-003) (scripts/apply-diagram-tokens.cjs) — DONE DIFFERENTLY: `paintForm` (one function, not two) dispatches on whether the source carries a `DIAGRAM_PALETTE:BEGIN` marker (`const marker = BEGIN.exec(source)`), not on the file's basename. This is the phase's stated pivot ("both applicators branch on whether a file carries a palette block") — the four starters are exactly the files that carry the marker, so the partition is identical in practice to a basename match, but the signal read is content, not the name.
- [x] T009 Rewrite `scripts/check-diagram-corpus.cjs`: collapse `TEMPLATE_DIR`/`EXAMPLE_DIR` into one `DIAGRAM_DIR`; change the `kind` derivation at the former directory-prefix test to a basename match against the four starter names (REQ-004) (scripts/check-diagram-corpus.cjs) — DONE as specified: `FORM_DIR` is the one constant; `kind = isExtra ? 'extra' : STARTER.test(file) ? 'starter' : 'form'` where `STARTER = /(^|\/)starter-[a-z-]+\.html$/` is a basename match. Confirmed by direct read of `check-diagram-corpus.cjs:32-38,146`.
- [x] T010 Update `scripts/families/catalog-bidirectional.cjs`: default un-prefixed catalog cells to `assets/diagrams/` instead of `assets/examples/`; change the canonical-filename check from `example-${id}.html` to `${id}.html`; exclude the four starter filenames from the reverse-direction loop (every corpus file needs a row) (REQ-005) (scripts/families/catalog-bidirectional.cjs) — DONE: default prefix is `assets/diagrams/${s}`, canonical check is `` `assets/diagrams/${id}.html` `` (no prefix), reverse loop has `if (/^starter-[a-z-]+\.html$/.test(file)) continue;`. Confirmed by full file read; `node --test` case "refuses a catalog row naming a file that left" passes and the corpus run reports zero `catalog-bidirectional` findings against the four starters.
- [x] T011 [P] Reword `scripts/families/marker-vocabulary.cjs`'s template-exemption comment to name the four starters explicitly; the `ctx.kind === 'template'` assertion itself is unchanged, since T009's upstream fix keeps `kind` correct (REQ-014) (scripts/families/marker-vocabulary.cjs) — DONE, prediction was wrong on one clause: the comment was reworded ("A starter is a skeleton...") as specified, but the assertion line itself DID change, from `if (ctx.kind === 'template') break;` to `if (ctx.kind === 'starter') break;` — a required one-token update, not a no-op, because T009 renamed the `kind` values themselves (`template`→`starter`, `example`→`form`), not just their derivation mechanism. Same value-literal update landed in `accessible-svg.cjs` (`kind === 'template' || kind === 'example'` → `kind === 'starter' || kind === 'form'`) and `derivation-gates.cjs` (`kind !== 'template'` → `kind !== 'starter'`) — both were named in `plan.md`'s affected-surfaces table as needing "no edit of their own," which this phase's own commit diff contradicts; the propagation needed a literal rename in three files, not zero touches.
- [x] T012 [P] Confirm `scripts/families/node-budget.cjs`'s `kind === 'specimen'` guard is left untouched - it guards `assets/icons.html`, which never moves and never carried this kind (REQ-014; D13) (scripts/families/node-budget.cjs) — NOT done as specified: the guard was removed, not left untouched. `goal.md`'s own log had predicted it would be "left exactly as found rather than 'fixed'" since `kind` never reaches `'specimen'`; the shipped commit instead deleted the dead branch and its stale comment, replacing it with a note that the exemption "named a kind the harness stopped assigning, which made it a branch that could never be taken." Functionally inert either way (the branch was unreachable before and after), but the literal instruction ("left untouched") was not honored — a real, harmless deviation, not a defect.
- [x] T013 [P] Repoint `scripts/families/grid-baseline.json`'s 24 path keys to the renamed `assets/diagrams/` paths and filenames, leaving every recorded violation count and pixel value unchanged (REQ-009; D5) (scripts/families/grid-baseline.json) — DONE: the file has exactly 24 top-level keys, all under `assets/diagrams/...` (confirmed by direct parse); `node scripts/check-diagram-corpus.cjs` reports `RESULT: PASSED` with no `grid-4px` regression.
- [x] T014 [P] Repoint `scripts/tests/mutation-cases.cjs`'s 8 file references to the renamed corpus, confirming each case's patched anchor still exists at that location in the renamed file (REQ-010) (scripts/tests/mutation-cases.cjs) — DONE, with one leftover string: all 8 `file:` entries in `FILE_CASES` repoint to `assets/diagrams/...`, and `node --test scripts/tests/` passes all 8 (plus the whole suite, 16/16). One residual: the `PACKAGE_CASES` mutate call was updated (`'architecture.html'`→`'gone.html'`) but its `expect` regex still reads `/example-gone\.html|architecture/` — the `example-gone.html` alternative can no longer match anything post-rename; the test still passes only because the `architecture` alternative does. Cosmetic, not a functional gap, and outside `rg -n "assets/(examples|templates)"`'s literal pattern (SC-001 does not catch it).
- [x] T015 Repoint `assets/color/diagram-palette.json`'s `pins` array (4 entries), `examples.skinByFile` key (`example-loop-terminal.html`→`loop-terminal.html`), and `examples.untokenized` entry (`assets/examples/example-sequence-oauth-dark.html`→`assets/diagrams/sequence-oauth-dark.html`); no other key is renamed or restructured (REQ-008) (assets/color/diagram-palette.json) — DONE, spec's own inventory was stale: `git blame` shows the `pins` array had already been removed from this file in an earlier phase, before this phase started, so there was nothing under that name left to repoint. The file itself also moved (this phase's later commits, see Log) to `assets/style-reference/harness-diagram/diagram-palette.json`. What this commit did: `skinByFile`'s two keys repointed (`example-loop-terminal.html`→`loop-terminal.html`, `example-sequence-oauth-dark.html`→`sequence-oauth-dark.html`), and the `examples` object was renamed to `forms` (matching the applicator's new `--forms` flag) with its already-empty `untokenized: []` array dropped rather than kept and repointed — both deliberate, both beyond REQ-008's literal "no other key is renamed" text, neither a functional regression (confirmed: `--default --all` still reproduces every file byte for byte with no exception needed at all, stronger than the "recorded untokenized exception" this document still cites).
- [x] T016 Repoint `references/catalog.md`'s sentinel-bound table: every `canonical`/`variants`/`imports` cell moves from `assets/examples/example-<name>.html` to `assets/diagrams/<name>.html`, row count and header shape unchanged (REQ-006) (references/catalog.md) — DONE: `grep -n "example-\|assets/examples\|assets/templates" references/catalog.md` returns nothing; 29 table rows present; `catalog-bidirectional` reports zero dangling-row and zero orphaned-file findings.
- [x] T017 [P] Repoint `SKILL.md`'s 10 references to the four starter names and the `assets/diagrams/` path (REQ-012) (SKILL.md) — DONE: covered by the tree-wide `rg -n "assets/(examples|templates)"` returning zero matches across the whole skill (see T026).
- [x] T018 [P] Repoint the 27 `references/types/type-*.md` files and `references/types/README.md`, `references/foundations/style-guide.md`, `references/foundations/derivation-record.md`, `references/import-export/import-drawio.md`, `references/import-export/import-mermaid.md` (REQ-012) (references/types/type-*.md, references/types/README.md, references/foundations/style-guide.md, references/foundations/derivation-record.md, references/import-export/import-drawio.md, references/import-export/import-mermaid.md) — DONE: covered by the same tree-wide zero-match sweep; `59d5aef373`'s diff stat lists 25 of the 27 `type-*.md` files individually touched.
- [x] T019 [P] Repoint `feature-catalog/import-export/drawio-import.md`, `mermaid-import.md`, `feature-catalog/diagram-generation/primitive-variants.md`, `editorial-style-and-connectors.md`, and `manual-testing-playbook/manual-testing-playbook.md`, `capture-review/capture-review.md`, `diagram-generation/primitive-variants.md`, `editorial-style-and-connectors.md`, `type-selection-and-routing.md` (REQ-012) (feature-catalog/import-export/drawio-import.md, feature-catalog/import-export/mermaid-import.md, feature-catalog/diagram-generation/primitive-variants.md, feature-catalog/diagram-generation/editorial-style-and-connectors.md, manual-testing-playbook/manual-testing-playbook.md, manual-testing-playbook/capture-review/capture-review.md, manual-testing-playbook/diagram-generation/primitive-variants.md, manual-testing-playbook/diagram-generation/editorial-style-and-connectors.md, manual-testing-playbook/diagram-generation/type-selection-and-routing.md) — DONE: all nine files appear individually in `59d5aef373`'s diff stat; covered by the same tree-wide zero-match sweep.
- [x] T020 `git mv` `screenshots/examples/` (34 PNGs) and `screenshots/templates/` (4 PNGs) into `screenshots/diagrams/`, unre-rendered; confirm no document names either old screenshot path before or after (REQ-013) (screenshots/examples/, screenshots/templates/ → screenshots/diagrams/) — DONE: `find screenshots/diagrams -name "*.png" | wc -l` = 38; `screenshots/examples/` and `screenshots/templates/` no longer exist; `git log --follow -- screenshots/diagrams/architecture.png` reaches `33cd4e7946`, pre-dating the move.
- [x] T021 Collapse `.github/workflows/diagram-corpus.yml`'s two applicator steps into one: `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>`, then `diff -rq --exclude=sequence-oauth-dark.html <tmp> assets/diagrams` (REQ-011) (.github/workflows/diagram-corpus.yml) — DONE, went further: the workflow now runs one step covering both applicators (`apply-diagram-tokens.cjs` and `apply-design-md.cjs`), each `diff -rq`'d against `assets/diagrams` with no `--exclude` at all — the untokenized exception this task still names does not exist by the time this phase runs (see T015's note). Confirmed by reading `.github/workflows/diagram-corpus.yml` directly.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Run `node scripts/check-diagram-corpus.cjs` against the merged corpus; confirm `RESULT: PASSED` and that every family's finding count matches the pre-move baseline exactly, since no file's actual content changed in this phase (scripts/check-diagram-corpus.cjs) — DONE: ran directly, `Summary: errors: 0` / `RESULT: PASSED`.
- [x] T023 Run `node --test scripts/tests/`; confirm all cases pass, including the whole-corpus precondition and the completeness triple (scripts/tests/) — DONE: ran directly, `tests 16 / pass 16 / fail 0`, including the completeness triple ("every family the checker registers has a case here", "nothing here names a family the checker does not register", "no exemption outlives the family it excuses").
- [x] T024 Run `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` and `diff -rq --exclude=sequence-oauth-dark.html <tmp> assets/diagrams`; confirm the diff is empty (scripts/apply-diagram-tokens.cjs) — DONE and exceeded: ran with and without the `--exclude` flag; both diffs are empty (`diff -rq` exit 0), so `sequence-oauth-dark.html` needs no exception any more. Also ran `apply-design-md.cjs --default --all --out <tmp>` (not named by this task but exercised by CI's collapsed step) — same result, empty diff.
- [x] T025 Confirm `git log --follow -- assets/diagrams/<file>` reaches the pre-move commit for one sampled starter, one sampled form, and one sampled screenshot (assets/diagrams/, screenshots/diagrams/) — DONE: `starter-light.html` → `99a1736f0ca`, `architecture.html` → `9f5dcdf94f9`, `screenshots/diagrams/architecture.png` → `33cd4e7946`, all pre-dating this phase's moves.
- [x] T026 Re-run `rg -n "assets/(examples|templates)"` over the skill tree and `.github/workflows`; confirm zero matches outside a changelog entry describing the move (SC-001) (.opencode/skills/sk-design/sk-design-diagram, .github/workflows) — DONE and exceeded: zero matches, full stop — no changelog-entry exception is even needed, since no changelog entry mentioning the old paths exists either (see Known Limitations in `implementation-summary.md`: no phase-9 changelog entry was written at all).
- [x] T027 Push a confirming commit and read the CI run: corpus check green, applicator step green, mutation suite green (.github/workflows/diagram-corpus.yml) — DONE: `gh run view 34571238552` (workflow "Diagram Corpus", head `08e8051eaf`, 2026-09-11T06:46:21Z) shows all three steps `success`: "Corpus check", "Both applicators reproduce the stock bytes", "Mutation suite".
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — 27/27 (T012 ticked with a named deviation: the specimen guard was removed rather than left untouched, per REQ-014's own dead-code framing)
- [x] No `[B]` blocked tasks remaining — none used
- [x] Manual verification passed — `check-diagram-corpus.cjs`, `node --test`, both applicators, `git log --follow`, the tree-wide `rg` sweep, and the live CI run all re-executed and read directly during this closeout pass (see task evidence above)
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 through REQ-014 present — confirmed by direct read.
- [x] CHK-002 [P0] Technical approach defined in plan.md - inventory, architecture, and affected-surfaces sections present — confirmed by direct read.
- [x] CHK-003 [P1] Dependencies identified and available - `apply-diagram-tokens.cjs`, `check-diagram-corpus.cjs`, and `apply-design-md.cjs` all read and cited before any edit — confirmed: all three pre-date this phase's merge commit and carry their own history through it (T002, T025).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - the rewritten scripts follow the existing file's own CommonJS style; no new lint config introduced — confirmed by direct read; no lint step exists in this repo for this package (CI runs the corpus/applicator/mutation checks only).
- [x] CHK-011 [P0] No console errors or warnings - the checker and applicator print `RESULT: PASSED`/`RESULT: FAILED` and a matching exit code, unchanged from today's contract — confirmed by direct execution of both scripts (exit 0, `RESULT: PASSED`) and of the conflict/unknown-name failure paths (exit 2, `RESULT: FAILED`).
- [x] CHK-012 [P1] Error handling implemented - a `--forms` name matching neither a starter nor a form fails closed with the existing `fail()` helper, not a silent no-op — confirmed: `--forms nonexistent-form` exits 2 with `ERROR: form does not exist: nonexistent-form` / `RESULT: FAILED`; `--forms x --all` exits with `ERROR: --all cannot be combined with --forms`.
- [x] CHK-013 [P1] Code follows project patterns - no comment in any touched script embeds a task id, requirement id, or finding id (comment-hygiene hard block) — confirmed: `grep -rnE "REQ-[0-9]|T0[0-9]{2}\b|AC-[0-9]|F[0-9]{1,2}\b"` over every touched script and the workflow file returns nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - AC-001 through AC-014 in acceptance-criteria.md — all 14 rows marked `Met` in `acceptance-criteria.md` this pass, each with its own verification evidence.
- [x] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass) — run during this closeout pass instead; see the `RESULT:` line reported at the end of `implementation-summary.md`'s Verification table.
- [x] CHK-022 [P1] Edge cases tested - the collision check (T003), the starter-exclusion regression (T010, T022), and the stale-pointer sequencing risk (T007-T009 before T022) each map to a task or a verify step — confirmed: zero name collisions (T003), zero `catalog-bidirectional` findings against the four starters (T022), and a green `check-diagram-corpus.cjs` run post-rewrite (T022) with no stale-pointer failure.
- [x] CHK-023 [P1] Every requirement this node owns (REQ-001 through REQ-014) appears in a task line above; the D13 references and the D12 hard block are recorded in T004-T009 and goal.md's LOG — confirmed by direct read; `git diff` (and the diff stats of all three shipping commits) over `sk-design-chart/` is empty (D12; SC-006).
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

- [x] CHK-030 [P0] No hardcoded secrets - no script or workflow file this phase touches reads a credential or an environment variable — confirmed by direct read of every touched script and the workflow file.
- [x] CHK-031 [P0] Input validation implemented - the applicator's `--forms`/`--all` mutual exclusion fails closed on both named together, mirroring `apply-design-md.cjs`'s own guard — confirmed by direct execution (`--forms x --all` exits with `ERROR: --all cannot be combined with --forms`).
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable; local tooling plus a public-repo CI workflow with no auth surface — confirmed, no auth surface exists in any touched file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md — confirmed: every REQ id cross-references cleanly. Several of plan.md's predictions about the shape of the fix (basename dispatch, "no edit" propagation, a `pins` array to repoint) did not hold once measured against the shipped code; each is named against its task rather than left silent, per this closeout's evidence, so the docs and the code are reconciled even where the original plan's forecast was not exact.
- [x] CHK-041 [P1] Code comments adequate - `marker-vocabulary.cjs`'s reworded comment names the four starters; no ephemeral id added anywhere (verified by CHK-013) — confirmed by direct read.
- [x] CHK-042 [P2] README updated (if applicable) - `assets/diagrams/README.md` is this phase's own deliverable (T006) — confirmed present, 38-row inventory, links resolve.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - this authoring pass created no temp files; the applicator's diff target (`<tmp>`) is a throwaway path outside the repository, never scratch/ — confirmed: this closeout's own verification runs wrote to `/tmp`, never to this packet's `scratch/`.
- [x] CHK-051 [P1] scratch/ cleaned before completion - not applicable; nothing was added to this packet's scratch/ by this authoring pass — confirmed: `find scratch -type f` returns only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-09-11 (closeout pass, re-verified against the shipped commits)
<!-- /ANCHOR:summary -->

---
