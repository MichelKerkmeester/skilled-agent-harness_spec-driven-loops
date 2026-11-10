# Research synthesis: hardening spec-folder tooling and automating corpus healing

Lineage: `devin-swe-2-max` | executor: cli-devin model=swe-2-max | loop: research | iterations: 15/15 | stopReason: maxIterationsReached

## What was analyzed

- Every commit on `091-consolidate-small-packets` (`git log origin/main..HEAD`): the spec-tooling scripts, the trigger-index rebuild workflow, the Gate 3 wording extraction, the phrase-cleanup pair, the corpus commits, the v3 upgrade command.
- The uncommitted phase-013 corpus repair: 2,083 failing folders at baseline, 6 one-off scripts, then 43 identical 9-rule manual lane briefs over the 474-folder residual.
- The shipped healing stack: `repair-derived.cjs`, `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `check-template-staleness.sh`, `upgrade-level.sh`.
- The contract documents: `CONTRACT.md` (spec-kit-docs.json is the source of truth), `MIGRATION.md` (indefinite legacy marker reads, current-version writes, never rewrite old packets to normalize style).
- The gates: `changed-packet-validation.yml`, `spec-kit-check.yml`, `strict-pass-freshness-report.yml`, `trigger-index-rebuild.yml`, `advisory-checks.yml`, pre-commit/pre-push hooks.
- The doctor stack: `update.md` + five YAMLs + `release-update.cjs`.

## Answers to the five questions

### Q1: which one-off fixes become permanent tooling, and where

The six phase-013 scripts map onto a structure that already exists; the gap is coverage, not architecture:

- `fix-specfolder.mjs` (description.json `specFolder` rewrite) has NO equivalent: `repair-derived.cjs` fixes implementation-summary rows and `packet_pointer:` frontmatter but not this JSON field. It is load-bearing: `completion-state.cjs` resolves `specFolder` to a real path with an `.opencode/specs` fallback (completion-state.cjs:67-76). Fold it into repair-derived as a derived-from-disk, atomic write.
- `fix-dup-anchors.mjs` (deduplicate anchors, insert missing structural ones) belongs as a heal-anchors module inside upgrade-legacy's doc-edit phase, which already has the per-doc edit loop.
- `add-fm-fields.mjs` beats `fillPacketFrontmatter`'s template-default fill by inheriting missing fields from the packet's own spec.md; add sibling-inheritance to upgrade-legacy's fill step.
- The 43 identical lane briefs are a 9-rule contract; its four mechanical rules (repoint-or-unlink, archive-aware continuity placeholders, impl-summary status follows spec.md, generic-phrase rewrite) belong in heal-spec-docs.cjs. Its reconstruction rule becomes `--reconstruct`, verify-then-keep (write only if the new doc validates, else record in the baseline).
- `val-detail.sh`'s grouped detail view belongs as a report mode on upgrade-legacy; `citecheck.mjs` promotes to a permanent lineage/evidence linter.
- `dup-survey.mjs` and `fix-queue.sh` stay one-off (survey/reporting + run-queue glue) but their outputs map to the sweep's `--baseline` statuses.

### Q2: what causes each failure class, and how to stop new instances

- METADATA_DISK_PATH_CONSISTENCY (2,898 findings): archive.sh refreshes parent/track metadata but never rewrites a moved packet's own recorded paths (`specFolder`, summary rows, pointers). Stop: fix-derived repair + record-time write of final path.
- ANCHORS_VALID (510): two producers: dup anchors from repeated scaffold/template use, AND a template defect: `spec.md.tmpl` emits `/ANCHOR:questions` at :399 AND :425 behind different level gates, producing an orphaned close when both render (validator rule: close must match stack top, spec-doc-structure.ts:634-635). Stop: fix the template + render-per-level vitest.
- SPEC_DOC_INTEGRITY / SUFFICIENCY (678): missing documents and under-filled required docs; produced by older scaffolds and interrupted authoring. Stop: heal-spec-docs covers defaults; `--reconstruct` covers missing; both verify-gated.
- GREP_CONVENTION (195) + TEMPLATE_SOURCE (99): seeded default trigger phrases and un-bumped markers; produced by create.sh seeding literal defaults. Stop: cleanup coverage for add-on doc kinds + evidence-gated auto-upgrade.
- LEVEL_MATCH/FILE_EXISTS (180 each): levels declared without document evidence, docs listed but absent. Stop: shared level-inference from existing docs + verify-then-keep reconstruction.
- FRONTMATTER_VALID (95), GRAPH_METADATA_CHILD_IDENTITY (260), GENERATED_METADATA_INTEGRITY (119): derived metadata drift; repair-derived re-derivation covers derivable rules; the rest flows through upgrade-legacy's migrate step.

### Q3: detecting and healing old/pre-v4 repos, and the /doctor:update fit

Detection already exists in four scattered signals: `.opencode/specs` layout (corpus.mjs alias-fold), historical `SPECKIT_TEMPLATE_SOURCE` markers (staleness check), generated-metadata presence, strict-fail counts. Consolidate into one era report (`upgrade-legacy --detect`). Healing belongs in `/doctor:update apply`'s post-apply battery as an approved `corpus_drift` step running `upgrade-legacy --apply` -- today upgrade-legacy is orphaned (zero references in the whole doctor-update stack). Invariants per MIGRATION.md: dry-run first, never rewrite old packets to normalize style, archive trees are validated-and-baselined but never repaired (the `--include-archive` flag widens the baseline, not the repair set), current-version writes only. Reversal is git-plus-commit, documented; an optional `--record` manifest covers archive-included runs. Reconstruction never invents content: verify-then-keep or record in baseline.

### Q4: hardening this branch's own changes

Two confirmed wrong-with-green-checks defects: the rebuild job commits only `trigger-index.json` while its generator writes four tracked files (3 fixture sidecars silently drift); and the template's conditional double `/ANCHOR:questions` emits an orphaned close. Plus: add `set -euo pipefail` + post-commit `git status` verify to the rebuild job; build at branch tip not the stale event sha; let workflow_dispatch bypass the subject guard; document PAT scope/rotation (custom App is the upgrade path, real lift); extend phrase cleanup/census to the nine uncovered add-on doc kinds and pin all three in the vitest; reconcile Gate 3 wording (three versions coexist: constants, question menu, mutation notice).

### Q5: which checks belong in CI or pre-commit

- changed-packet job: compare failing-RULE sets, not just verdicts, when base already fails -- a worsening currently passes silently. (S)
- Weekly sweep: pass `--baseline` (previous artifact) -- the ratchet statuses exist but are never wired. (S)
- Pre-commit: `validate --strict --no-recursive` on staged packets when <=~20 AND the validator dist is fresh; warn-and-pass otherwise (fail-closed without dist would block all spec commits).
- Phrase-judge lint on staged frontmatter; grouped-detail report mode so campaigns need no scrape scripts; corpus-commit discipline recipe documented (the 1,319-file phrase commit is the counterexample).

## Preserved contradictions

- `repair-derived.cjs` freezes `z_archive` while `upgrade-legacy.mjs --include-archive` inspects-and-records archives: reconcile as the shipped contract "validated + baselined, never repaired."
- Phase-013 healed live corpus during active work while a strict clean-tree precondition would have forbidden it: the real contract is atomic writes + git reversal, not tree purity.
- `check-template-staleness.sh --auto-upgrade` bumps marker versions without migrating layout: acceptable only as an evidence-gated bump, never a migration substitute.

## Ranked recommendations (Q1-Q5, highest value first)

| Rank | ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|------|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| 1 | F-01 | Emit exactly one `/ANCHOR:questions` closer per level in spec.md.tmpl; add render-per-level vitest asserting the anchor-stack contract | Q2, Q4 | templates/core/spec.md.tmpl + tests | S | Low: template structure; verify no level breaks | spec.md.tmpl, vitest | spec.md.tmpl:399/425; spec-doc-structure.ts:634-635 | CONFIRMED defect |
| 2 | F-02 | Commit all four rebuild artifacts (index + 3 sidecars); `set -euo pipefail`; post-commit `git status` verify | Q4 | .github/workflows/trigger-index-rebuild.yml | S | Low: same job, broader add | workflow yml | yml:44-58; generator:371-381 | CONFIRMED defect |
| 3 | F-03 | Add `corpus_drift` check to doctor-update apply battery (dry-run upgrade-legacy, approved --apply) + route it in check next-steps | Q3 | doctor-update-apply.yaml, -check.yaml, presentation.txt | M | Low-Med: new battery step behind approval | 3 doctor files | apply.yaml:146-198; zero refs found | CONFIRMED gap |
| 4 | F-04 | Compare failing-rule sets not verdicts when base already fails; block added rules | Q5 | changed-packet-validation.yml | S | Low: more precise same gate | workflow yml | yml:139-146 | CONFIRMED gap |
| 5 | F-05 | Pass `--baseline` (previous artifact) to the weekly sweep so regression/new-failure ratchet activates | Q5 | strict-pass-freshness-report.yml | S | Low: flag exists, unused | workflow yml | sweep tool:20-32,90-96 | CONFIRMED gap |
| 6 | F-06 | Add `specFolder` repair to repair-derived (derived-from-disk, atomic, NO FIELD reports) - it feeds completion-state resolution | Q1 | cli/spec/repair-derived.cjs | S | Low-Med: JSON write, conservative source | repair-derived.cjs | fix-specfolder.mjs; completion-state.cjs:67-76 | CONFIRMED gap |
| 7 | F-07 | `upgrade-legacy --detect` (or spec/repo-era.mjs): one JSON era report - layout, marker census, generated-metadata, strict-fail count - consumed by doctor check | Q3 | cli/spec/ + doctor check | M | Low: read-only report | new module + yaml | four scattered signals | INFERRED design |
| 8 | F-08 | Port fix-dup-anchors triage to a heal-anchors module in upgrade-legacy's doc-edit phase | Q1 | new module + upgrade-legacy.mjs | M | Med: marker surgery; atomic + verify | healer module | fix-dup-anchors.mjs; upgrade-legacy:378-415 | CONFIRMED fit |
| 9 | F-09 | Implement the lane playbook's mechanical rules in heal-spec-docs: repoint-or-unlink, archive-aware placeholders, status-follows-spec, generic-phrase rewrite | Q1 | heal-spec-docs.cjs + HEALING.md | M | Med: touches prose-adjacent structure only | healer + docs | batch-01.task rules 4-7 | CONFIRMED contract |
| 10 | F-10 | Document the archive contract (validated+baselined, never repaired) in README-repair-derived + MIGRATION.md; resolve the phase-013 contradiction | Q2, Q3 | two docs | S | Low: docs | 2 docs | iter 6/8 findings | CONFIRMED conflict |
| 11 | F-11 | Extend cleanup/census to the nine add-on doc kinds with per-kind recipes; extend the three-way vitest pin | Q4 | phrase tools + judge + create.sh + test | M | Med: more surfaces to seed | 4 files | 9 uncovered templates | CONFIRMED gap |
| 12 | F-12 | Reconcile Gate 3 wording: render menus from the GATE_3_CHOICE_* constants or rename them | Q4 | spec-gate-core.mjs + test | S | Low: copy or constants | 2 files | three wordings coexist | CONFIRMED divergence |
| 13 | F-13 | Pre-commit `validate --strict --no-recursive` on staged packets when <=~20 and validator dist is fresh; warn-and-pass otherwise | Q5 | git-hooks/pre-commit | M | Med: latency + dist coupling | pre-commit | no structural gate exists | REVISED, CONFIRMED gap |
| 14 | F-14 | Build at branch tip not event sha; distinguish non-FF from auth in push errors; dispatch bypasses subject guard | Q4 | trigger-index-rebuild.yml | S | Low | workflow yml | stale-event race | CONFIRMED |
| 15 | F-15 | `--reconstruct` verify-then-keep: write missing docs only when they validate; else record FILE_EXISTS in upgrade-baseline.json | Q1, Q3 | healer + upgrade-legacy | M | Med: per-doc verify pass | 2 files | batch rule 3 + sufficiency risk | REVISED |
| 16 | F-16 | Sibling-inheritance in fillPacketFrontmatter: copy importance_tier/contextType from spec.md before template defaults | Q1 | upgrade-legacy.mjs | S | Low: better defaults | upgrade-legacy.mjs | add-fm-fields.mjs advantage | CONFIRMED |
| 17 | F-17 | Grouped-detail report mode on upgrade-legacy; promote citecheck.mjs to a permanent lineage linter | Q1, Q5 | upgrade-legacy + new lint | S | Low | 2 files | val-detail.sh; citecheck.mjs | CONFIRMED residual |
| 18 | F-18 | Docs hygiene pack: narrow .opencode/specs write-blessing on v3 checkouts; evidence-gate --auto-upgrade; document PAT scope/rotation + App upgrade path; document corpus-commit discipline | Q3, Q4 | write-recipe.md, MIGRATION.md, workflows README, CONTRIBUTING | S | Low: docs | 4 docs | iter 5/9/10/12 findings | CONFIRMED |

Every mutating recommendation keeps the corpus invariants: dry-run first, atomic or verify-gated writes, structure-only edits (no prose meaning changes, no invented history), residual debt recorded not erased.
