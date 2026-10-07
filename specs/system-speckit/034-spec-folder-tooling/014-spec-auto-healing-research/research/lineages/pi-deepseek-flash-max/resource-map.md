# Resource Map - pi-deepseek-flash-max lineage

Sources consulted across the 15 iterations, grouped by area. Paths are repository-relative; scratchpad paths are absolute by design (they are outside the repository).

## Spec-kit tooling (`runtime/cli/`)

- `spec/upgrade-legacy.mjs` - staged migration pipeline, dry-run default, baseline ledger
- `spec/repair-derived.cjs` and `spec/README-repair-derived.md` - derived-fact repairs and the refusal boundary
- `spec/heal-spec-docs.cjs` - literal template-value restoration and template provenance
- `spec/archive.sh` - move and restore sequences (path-drift producer)
- `spec/create.sh` - scaffold, seeding, metadata generation
- `spec/template-phrase-census.mjs`, `spec/template-phrase-cleanup.mjs` - the safe mass-repair pair
- `spec/refresh-track-roots.mjs`, `spec/sweep-track-roots.mjs` - track-root report/repair pair
- `spec/validate.sh`, `spec/check-template-staleness.sh`, `spec/progressive-validate.sh`
- `lib/validator-registry.json` - 42 rules with severities, categories and implementations
- `rules/check-metadata-disk-consistency*.{sh,cjs}` - path-drift semantics
- `rules/check-files.sh`, `rules/check-level-match.sh`, `rules/check-template-source.sh`, `rules/check-grep-convention.sh`, `rules/check-frontmatter.sh`
- `retrieval/generate-trigger-index.mjs` - four-output generator contract
- `retrieval/lib/phrase-judge.mjs` - phrase verdict owner
- `graph/backfill-graph-metadata.ts`, `graph/migrate-generated-json.ts` - generated metadata writers
- `lib/frontmatter-migration.ts` - frontmatter field filling
- `runtime/lib/validation/orchestrator.ts` - live anchor, placeholder and template checks
- `runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `runtime/hooks/pi/spec-gate-enforce.ts` - Gate 3 menus and dialog

## Templates

- `templates/core/spec.md.tmpl` - nested `questions` anchor (lines 184/399/425)
- `templates/spec-kit-docs.json` - level contract and per-template versions
- `templates/core/{plan,tasks,implementation-summary}.md.tmpl`, `templates/addons/*`

## Validation references

- `references/validation/validation-rules.md` - documented anchor rules (including unimplemented no-nesting)
- `references/structure/phase-definitions.md`, `references/workflows/quick-reference.md`

## Spec corpus (phase packets and repair evidence)

- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md` - corpus repair scope
- `specs/system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup/implementation-summary.md`
- `specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md`
- `research/scaffold-sample/*.txt` - pre-edit scaffold render (byte copy)
- Branch commits: `4b33313bd4c`, `4af470d1531`, `bdd678bccff`, `01b0773d067`, `5e4164bfac9`, `7fe1cbeda87`, `b36842de3c1`, `d727cf94fe1`, plus the Claude roster commits noted and dropped.

## CI and hooks

- `.github/workflows/trigger-index-rebuild.yml`, `changed-packet-validation.yml`, `strict-pass-freshness-report.yml`, `advisory-checks.yml`, `README.md`
- `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/pre-push`

## Doctor surface

- `.skilled/commands/doctor/update.md`, `speckit.md`, `_routes.yaml`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml`, `doctor-update-check.yaml`
- `.skilled/commands/doctor/scripts/release-update.cjs` - unit model and generated-artifact table

## Read-only scratchpad (outside the repo)

- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt`, `detail3.txt` - baseline and latest failure reports
- `.../scratchpad/fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs` - one-off repairs
- `.../scratchpad/fix-lanes/batch-01.task` - the nine lane rules

## Lead channel

- `steer.md` - the lead brief bound to this lineage
