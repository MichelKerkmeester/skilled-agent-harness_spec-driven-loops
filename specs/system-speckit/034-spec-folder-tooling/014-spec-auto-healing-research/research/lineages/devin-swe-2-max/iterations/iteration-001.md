# Iteration 1: Branch commit inventory and phase 013 repair baseline

## Focus

Inventory every commit on `091-consolidate-small-packets` (`git log origin/main..HEAD`), the in-progress phase 013 corpus repair, and the scratchpad fix scripts; start the failure-class taxonomy that later iterations attribute to sources. Interpretation note: "every change the branch made" is taken as the 10 commits in `origin/main..HEAD` plus the uncommitted phase 013 working-tree state.

## Actions Taken

1. `git log origin/main..HEAD --format` plus `--stat` summary for the full commit list and per-commit blast radius.
2. Read `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md` (working tree; the phase is uncommitted).
3. Listed the scratchpad directory and `fix-lanes/`; read the heads of `fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs`, `dup-survey.mjs`, `fix-queue.sh`, `val-one.sh`, `val-detail.sh`.
4. Re-derived the lead's `x RULE_ID` counts from `all-detail.txt`, `detail2.txt`, `detail3.txt` with `grep -oE "^x [A-Z_]+"`.
5. Read `steer.md` (lead brief) before this iteration.

## Findings

1. The branch carries exactly 10 commits over `origin/main`; 8 are spec-tooling/corpus work and 2 are the Claude 5.5 roster (`75c78afa045`, `e9935e99bbc`), which are docs/model-config only. CONFIRMED [SOURCE: git log origin/main..HEAD output; steer.md line 49].
2. Per-commit blast radius: `bdd678bccff` touched 898 files and `7fe1cbeda87` touched 1,856 files (corpus phrase edits); `4af470d1531` touched 79 files including Gate 3 menus and CI workflows; `d727cf94fe1` rewrote 26 files with 15,951 insertions (mostly the rebuilt trigger index). CONFIRMED [SOURCE: git log --stat origin/main..HEAD].
3. Phase 013 baseline (working-tree spec.md): 4,371 packets, 2,046 failing strict validation = 1,935 of 2,198 archived plus 111 of 2,173 live, besides 37 non-packet folders; archived packets kept pre-archive paths, duplicate/missing anchors, 102 packets missing required docs, and 470 files of template default trigger phrases. CONFIRMED [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md lines 58-61 of the working tree].
4. Lead's failure counts reproduce exactly: `all-detail.txt` = 2,083 `###` folders led by METADATA_DISK_PATH_CONSISTENCY 2,898, ANCHORS_VALID 510, SPEC_DOC_INTEGRITY 417, SPEC_DOC_SUFFICIENCY 261, GRAPH_METADATA_CHILD_IDENTITY 260, GREP_CONVENTION 195, LEVEL_MATCH 180, FILE_EXISTS 180; `detail3.txt` = 474 folders led by ANCHORS_VALID 235, GREP_CONVENTION 152, LEVEL_MATCH 131, FILE_EXISTS 131, SPEC_DOC_SUFFICIENCY 108, TEMPLATE_SOURCE 76. CONFIRMED [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt, detail3.txt via grep recount].
5. The one-off fix scripts already carry healing-tool conventions: `fix-dup-anchors.mjs` is dry-run by default with `--apply` to write and states "Prose is never touched; only whole anchor-marker lines change"; `fix-specfolder.mjs` skips packets whose `specFolder` already matches and preserves JSON indent and trailing newline; `add-fm-fields.mjs` "Never overwrites an existing field" and copies values from the sibling `spec.md`. CONFIRMED [SOURCE: scratchpad fix-dup-anchors.mjs lines 1-6, fix-specfolder.mjs lines 1-24, add-fm-fields.mjs lines 1-4].
6. The failure-report format itself is a hand-rolled protocol: `val-detail.sh` awk-scrapes `validate.sh --strict --verbose` output into `### <folder>` / `x RULE_ID:` / indented detail lines, and the downstream fix scripts parse that text format back (e.g. `add-fm-fields.mjs` regex `Empty required frontmatter field: (importance_tier|contextType)`). CONFIRMED [SOURCE: scratchpad val-detail.sh lines 1-6, add-fm-fields.mjs lines 12-19].
7. Phase 013's scope rules are the Q3 safety contract in miniature: "Changing what any document says" is out of scope, reconstructed documents carry a dated note, and non-packet folders stay untouched. CONFIRMED [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md scope section, working tree].

## Ruled Out

- Deep-reading the two Claude 5.5 roster commits as tooling-change evidence: they touch model lists and thinking-effort config, not spec tooling (steer.md already flags them low relevance). Recorded, not pursued.
- Treating `all-detail.txt` counts as given: re-derived instead; they match, so no contradiction finding needed.

## Dead Ends

None this iteration.

## Edge Cases

- Ambiguous input: "every change the branch made" could include working-tree lint noise; interpreted as commits plus the phase 013 uncommitted state named by the brief.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R1.1 | Add a machine-readable failure report mode to validate.sh (e.g. `--format=jsonl` emitting `{folder, rule, file, detail}` rows) so repair phases stop scraping verbose text | Q1, Q5 | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | M | Low: additive flag, default output unchanged | validate.sh output layer | val-detail.sh awk-scrapes verbose output (scratchpad val-detail.sh:1-6) and fix scripts re-parse that text (add-fm-fields.mjs:14-18) | CONFIRMED need; INFERRED design |
| R1.2 | Promote the three safety conventions already in the one-offs (dry-run default with `--apply`, skip-when-equal, never overwrite existing fields, preserve JSON formatting) into a shared repair-tool contract document so future healers inherit them | Q1 | `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md` or a new `references/repair/` doc | S | Low: documentation only | one doc | fix-dup-anchors.mjs:1-6, fix-specfolder.mjs:14-23, add-fm-fields.mjs:1-4 | INFERRED |

Idempotency/reversibility notes: R1.1 is read-only output, trivially reversible, cannot change a document. R1.2 is documentation of conventions, no document semantics touched.

## Sources Consulted

- `steer.md` (lead brief, lines 1-93)
- `git log origin/main..HEAD` and `git log --stat origin/main..HEAD` (HEAD citations)
- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md` (working tree, lines 1-120)
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/` listing, `fix-lanes/` listing
- `all-detail.txt`, `detail2.txt`, `detail3.txt` (scratchpad, grep recounts)
- `fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs`, `dup-survey.mjs`, `fix-queue.sh`, `val-one.sh`, `val-detail.sh` (scratchpad heads)

## Assessment

- New information ratio: 0.85 (6 of 7 findings fully new to this lineage, 1 partially new since the lead pre-counted rule totals which I confirmed)
- Questions addressed: Q1 partially (script inventory and their built-in safety conventions), Q2 partially (taxonomy seeded)
- Questions answered: none yet

## Reflection

- What worked: grep recounts over the detail files gave exact rule frequencies without parsing 4 MB of text; reading script heads revealed the safety-convention pattern the Q1 answer will hinge on.
- What did not: nothing failed.
- Do differently: next iteration should read `all-baseline.tsv`/`all-failed.txt` and the `fix-lanes/batch-*.task` briefs to tie each scripted fix to the rule classes it cleared.

## Recommended Next Focus

Iteration 2: complete the taxonomy. Map each failure class in `detail3.txt` to the script or lane that addressed it, and read 013's `plan.md`/`tasks.md` for the lane structure.
