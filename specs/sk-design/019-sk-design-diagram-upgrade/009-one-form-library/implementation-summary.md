---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/009-one-form-library"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed out phase 9: re-verified tasks and criteria against shipped commits"
    next_safe_action: "Write the missing changelog entry in ../changelog/"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/tasks.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/acceptance-criteria.md"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-009-one-form-library-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the merged README orders starters first or interleaves alphabetically: starters first, then 34 forms alphabetically (see assets/diagrams/README.md)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-one-form-library |
| **Completed** | 2026-09-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The diagram skill's 38 worked diagrams used to sit in two directories, `assets/templates/` (4 skin
skeletons) and `assets/examples/` (34 finished diagrams, each carrying a redundant `example-`
prefix). Forty-nine files across the skill spelled out that split by path or filename, and the
token applicator carried a dead `--examples` mode that existed only because the directories were
two. This phase merged both into one `assets/diagrams/`, renamed every file to say what it draws
rather than which bin it was filed in, and rewrote the two scripts that classified files by
directory to classify them by what they actually differ on instead.

### Phase 9: one-form-library

The four skin skeletons became `starter-light.html`, `starter-dark.html`, `starter-terminal.html`,
`starter-full.html`; the 34 forms dropped their `example-` prefix. Every move was a `git mv`, so
`git log --follow` still reaches each file's pre-move history. The code stopped keying on the
directory: the token applicator now decides how to paint a file by whether it carries a
`DIAGRAM_PALETTE:BEGIN` block (a content signal, not the directory it used to live in or, as
planned, its basename), and the corpus checker classifies a file as `starter` or `form` by matching
its basename against the four starter names. The catalog indexes what answers a question, so the
four starters are exempt from `catalog-bidirectional.cjs`'s "every file needs a row" rule. The
applicator's `--examples` flag disappeared entirely - there is nothing left to flag - and `--all`
now means all 38. The CI workflow collapses what used to be two applicator-diff steps (one per
directory) into one, gating both `apply-diagram-tokens.cjs` and `apply-design-md.cjs` against the
shipped bytes with no exclusion.

Mid-phase, the operator directed a further consolidation beyond this phase's own spec: the palette
source (`assets/color/diagram-palette.json`) and the icon specimen (`assets/icons.html`) moved
into `assets/style-reference/`, beside the Style Reference's own `DESIGN.md`, and then one level
further, into `assets/style-reference/harness-diagram/`, so a visual language is one directory
holding its `DESIGN.md`, its provenance (`origin.md`), its tokens, and its icons. This is recorded
as a scope extension per the operator's instruction, not a plan deviation.

The merge surfaced two problems the plan did not anticipate. First, once starters and forms shared
a directory, `derivation-gates.cjs`'s "does this file need a palette block" rule needed the same
starter/form distinction the checker now carries (`kind !== 'starter'` replaced `kind !== 'template'`
directly, and the same value-literal rename cascaded into `accessible-svg.cjs` and
`marker-vocabulary.cjs` - three files `plan.md` had predicted would need no edit of their own).
Second, `catalog-bidirectional.cjs`'s canonical-filename check still expected the `example-` prefix
(`` `example-${id}.html` ``); it was rewritten to `` `${id}.html` ``. Both were found and fixed within
the same merge commit.

### Files Changed

The merge landed across three commits, not the one the plan anticipated:

| Commit | What | Files |
|--------|------|-------|
| `9f03950aba` | The directory merge: 38 forms renamed and moved, both scripts rewritten to classify by content/basename instead of directory, `catalog-bidirectional.cjs` and three `kind`-consuming families updated, CI collapsed to one applicator step with no exclusion | 141 files |
| `c1f109bfe4` | Scope extension: palette source and icon specimen moved beside the Style Reference; two legend swatches fixed to stop keying a dash pattern their drawing never draws | 18 files |
| `9a4b60e0ed` | Scope extension: tokens and icons moved one level further, inside `assets/style-reference/harness-diagram/`, so a visual language is one bundle | 17 files |

Representative changes (full detail per file is in `tasks.md`'s per-task evidence):

| File | Action | Purpose |
|------|--------|---------|
| `assets/diagrams/` (38 `.html`, 38 `.png`, 1 `README.md`) | Created (via `git mv`) | The merged, renamed corpus |
| `assets/templates/`, `assets/examples/`, `screenshots/templates/`, `screenshots/examples/` | Deleted (moved) | Superseded by `assets/diagrams/` and `screenshots/diagrams/` |
| `scripts/apply-diagram-tokens.cjs` | Modified | One `FORM_DIR`; `--forms`/`--all` replaces `--examples`; paint dispatch by palette-block presence |
| `scripts/check-diagram-corpus.cjs` | Modified | One `FORM_DIR`; `kind` derived by basename match against the four starter names |
| `scripts/families/catalog-bidirectional.cjs` | Modified | Prefix, canonical-filename check, and starter exclusion updated |
| `scripts/families/accessible-svg.cjs`, `derivation-gates.cjs`, `marker-vocabulary.cjs` | Modified | `kind` literal values renamed (`template`→`starter`, `example`→`form`); `marker-vocabulary.cjs`'s comment reworded |
| `scripts/families/node-budget.cjs` | Modified | Dead `kind === 'specimen'` guard removed (deviation from "left untouched" - see Key Decisions) |
| `scripts/families/grid-baseline.json` (24 keys), `scripts/tests/mutation-cases.cjs` (8 refs) | Modified | Repointed to the renamed corpus |
| `assets/color/diagram-palette.json` → `assets/style-reference/harness-diagram/diagram-palette.json` | Modified + moved | `skinByFile` repointed; `examples` renamed to `forms`; already-empty `untokenized` array dropped |
| `references/catalog.md`, `SKILL.md`, 27 `type-*.md`, ~15 more prose documents | Modified | Every reference repointed |
| `.github/workflows/diagram-corpus.yml` | Modified | Two applicator steps collapsed into one, gating both applicators, no exclusion |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every file move was a `git mv`, verified this pass by `git log --follow` reaching the pre-move
commit on a sampled starter, form, and screenshot. Verification for this closeout re-ran every
check `spec.md`'s Handoff Criteria and `acceptance-criteria.md` name, from the current working
tree, rather than trusting the shipped commit messages:

- `node scripts/check-diagram-corpus.cjs` → `Summary: errors: 0` / `RESULT: PASSED`.
- `node --test scripts/tests/` → `tests 16 / pass 16 / fail 0`.
- `node scripts/apply-diagram-tokens.cjs --default --all --out <tmp>` and
  `node scripts/apply-design-md.cjs --default --all --out <tmp>`, each diffed against
  `assets/diagrams/` with `diff -rq` → both empty, with no `--exclude` flag needed (the
  "recorded untokenized exception" every planning doc still names had already been resolved
  before this phase ran; `diagram-palette.json`'s `untokenized` array was already `[]`).
- `rg -n "assets/(examples|templates)" .opencode/skills/sk-design/sk-design-diagram .github/workflows`
  → zero matches.
- `gh run view 34571238552` (workflow "Diagram Corpus", head `f3bf733cf4`, the branch's current tip)
  → all three jobs `success`: "Corpus check", "Both applicators reproduce the stock bytes",
  "Mutation suite".
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Applicator dispatch keys off palette-block presence, not basename (deviation from REQ-003) | The content signal and the basename signal partition the corpus identically today (only the four starters carry the block), so this was a defensible implementation choice, not a defect - but it is a real deviation from what `spec.md`/`plan.md` specified, named here rather than silently absorbed |
| `node-budget.cjs`'s `kind === 'specimen'` guard removed, not left untouched (deviation from REQ-014) | `check-diagram-corpus.cjs` never assigns `kind = 'specimen'`; the guard was unreachable before this phase and after it. The shipped commit chose to delete the dead branch rather than preserve it verbatim as `plan.md` and `goal.md`'s own pre-execution log both predicted. Functionally inert either way |
| Scope extension: palette source and icon specimen consolidated into `assets/style-reference/` | Operator instruction received mid-phase, recorded in `goal.md`'s LOG as a scope extension rather than absorbed silently. Two further commits (`c1f109bfe4`, `9a4b60e0ed`) carried it out; `sk-design-chart/` stayed untouched throughout (D12; confirmed empty `git diff` across all three commits) |
| `diagram-palette.json`'s `examples` key renamed to `forms`, `untokenized: []` dropped | Not what REQ-008 specified ("no other key is renamed or restructured"), but matches the applicator's new `--forms` terminology and drops an already-empty array rather than repointing nothing. `pins`, the other key REQ-008 named, had already been removed from this file in an earlier phase - the spec's inventory was stale by execution time, a risk `plan.md` itself flagged (T001's note that a document could change between authoring and execution) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-diagram-corpus.cjs` | PASS - `Summary: errors: 0`, `RESULT: PASSED` |
| `node --test scripts/tests/` | PASS - 16/16, including the whole-corpus precondition and the completeness triple |
| `apply-diagram-tokens.cjs --default --all` vs `assets/diagrams/` | PASS - `diff -rq` empty, no exception needed |
| `apply-design-md.cjs --default --all` vs `assets/diagrams/` | PASS - `diff -rq` empty, no exception needed |
| `--forms`/`--all` mutual exclusion | PASS - `--forms x --all` exits 2, `ERROR: --all cannot be combined with --forms` |
| Unknown form name fails closed | PASS - `--forms nonexistent-form` exits 2, `ERROR: form does not exist: nonexistent-form` |
| `git log --follow` on a sampled starter, form, screenshot | PASS - reaches `277efcb1c37`, `77898f77767`, `c64e9cc331` respectively, all pre-dating the move |
| `rg -n "assets/(examples\|templates)"` over the skill tree and `.github/workflows` | PASS - 0 matches |
| Merged README's 32 relative links | PASS - all resolve (checked programmatically) |
| `sk-design-chart/` untouched (D12) | PASS - 0 files in that tree appear in any of the three commits' diff stats |
| No ephemeral spec/task/finding id in any touched script or workflow | PASS - `grep -rnE "REQ-[0-9]\|T0[0-9]{2}\b\|AC-[0-9]\|F[0-9]{1,2}\b"` returns nothing |
| Live CI run, current branch tip (`f3bf733cf4`) | PASS - `gh run view 34571238552`: Corpus check / Both applicators / Mutation suite all `success` |
| `bash .../validate.sh specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library --strict` | See the literal `RESULT:` line this closeout pass reports in chat; run from the repository root with `NODE_PRESERVE_SYMLINKS=1` against the `realpath .opencode` path per the operator's standing convention |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No changelog entry for this phase.** `spec.md`'s Phase Context and Files-to-Change table both
   call for a version-bump entry in `.opencode/skills/sk-design/sk-design-diagram/changelog/`, but
   no task in `tasks.md` ever tracked that work, and the directory still holds only `v1.0.0.0.md` as
   of this closeout. This is a real gap against the phase's own spec, not a fabricated pass - it sits
   outside this packet's write authority to fix directly, since the changelog lives under
   `.opencode/` and this closeout pass is scoped to `specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/`
   only.
2. **Two cosmetic wording residues in `scripts/tests/mutation-cases.cjs`.** The
   `catalog-bidirectional` `PACKAGE_CASES` entry's `expect` regex still reads
   `/example-gone\.html|architecture/`; the `example-gone.html` alternative can no longer match
   anything since the corpus dropped the `example-` prefix, and the test only passes because of the
   `architecture` alternative. Separately, the `derivation-gates` `FILE_CASES` entry's `name` field
   still reads "a template whose palette block drifts from the token source" even though its target
   file is now `starter-light.html`. Neither affects test correctness (both were confirmed passing
   this pass); neither is caught by `rg -n "assets/(examples|templates)"`, since neither contains
   that literal substring.
3. **`references/types/type-sequence.md`'s two dangling references remain unfixed.** It names
   `example-sequence-dark.html` and `example-sequence-full.html`, neither of which has ever existed
   in the corpus. This is a pre-existing content-accuracy defect `spec.md` explicitly places out of
   this phase's scope, and it remains out of scope for this closeout too.
<!-- /ANCHOR:limitations -->

---
