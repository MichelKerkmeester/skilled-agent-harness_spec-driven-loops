# Resource map - what each evidence source proved

## Spec tooling (`.skilled/skills/system-spec-kit/runtime/cli/spec/`)

- `repair-derived.cjs` - derivable-vs-authored rule split; fixes summary rows + packet_pointer frontmatter, NOT description.json specFolder; atomic writes; freezes z_archive/scratch
- `heal-spec-docs.cjs` - proven-safe doc defaults; candidate home for the playbook's mechanical rules
- `upgrade-legacy.mjs` - orchestrator: dry-run default, --apply, --include-archive (records, never repairs archives), frontmatter fill -> heal -> repair-derived -> JSON migrate -> revalidate -> upgrade-baseline.json; no rollback snapshot
- `check-template-staleness.sh` - marker-vs-manifest compare; --auto-upgrade bumps markers only, no layout migration
- `create.sh`, `archive.sh` - producers: seeding defaults; archive move never rewrites packet's own recorded paths
- `refresh-track-roots.mjs`, `sweep-track-roots.mjs` - track-root derived metadata; sweep has --baseline with regression/new-failure/known-failure/first-run statuses
- `template-phrase-{cleanup,census}.mjs` - 375-packet default-phrase replacement, idempotent, misses 9 add-on doc kinds
- `upgrade-level.sh`, `README.md`, `README-repair-derived.md` - level migration and tool docs

## Validation stack

- `runtime/lib/validation/spec-doc-structure.ts` - ANCHORS_VALID mechanics: same-id re-open illegal (:622), stack-mismatch close orphaned (:635), leftover open unclosed (:654)
- `runtime/lib/validation/orchestrator.ts` + `cli/lib/validator-registry.json` - rule wiring
- `runtime/cli/lib/completion-state.cjs:67-76` - specFolder is load-bearing (path resolution + .opencode/specs fallback)
- `runtime/cli/retrieval/lib/corpus.mjs` - .opencode/specs alias-fold = old-layout detection
- `runtime/cli/retrieval/generate-trigger-index.mjs:371-381` - writes index + 3 fixture sidecars
- `runtime/cli/spec-gate-core.mjs` - GATE_3_CHOICE_* constants vs inline menu wording

## Contracts

- `templates/CONTRACT.md` - spec-kit-docs.json owns public Level contracts
- `templates/MIGRATION.md` - indefinite legacy reads, current-version writes, no style-normalizing rewrites
- `templates/core/spec.md.tmpl:184-425` - questions anchor double-close defect
- `templates/addons/` - 9 templates with uncovered trigger_phrases
- `references/validation/{validation-rules,path-scoped-rules,five-checks}.md`

## Doctor stack (`.skilled/commands/doctor/`)

- `update.md` + `doctor-update-{check,align,apply,rollback,record-base}.yaml` + `doctor-update-presentation.txt` + `scripts/release-update.cjs` - check/align/apply/rollback lifecycle; apply post-apply battery = healing slot; zero upgrade-legacy references

## CI and hooks

- `changed-packet-validation.yml` - merge-base regression gate; verdict-only compare when base already fails
- `strict-pass-freshness-report.yml` - weekly report-only; --baseline never passed
- `trigger-index-rebuild.yml` - commits only index; stale event-sha build; subject guard blocks dispatch; PAT token push
- `spec-kit-check.yml`, `advisory-checks.yml` - build/typecheck/tests; advisory never blocks
- `git-hooks/{pre-commit,pre-push}`, `install-git-hooks.sh` - remint/parity/drift already gated

## Phase-013 evidence (scratchpad)

- `fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs`, `dup-survey.mjs`, `fix-queue.sh`, `val-one.sh`, `val-detail.sh`, `citecheck.mjs` - the six-plus one-offs and their target classes
- `fix-lanes/batch-01..43.task` - identical 9-rule manual playbook over 474 residual folders
- `all-baseline.tsv`, `all-failed.txt`, `all-done.txt`, `detail{,2,3}.txt`, `{cleanup,arch}-apply.json` - 2,083 -> residual campaign trail

## Commits (read via `git show` / `git log`)

- `01b0773d067` - rebuild job + Actions-app refusal rationale
- `4af470d1531` - Gate 3 constant extraction with divergent inline text
- `6024a0813cd` - v3 upgrade command: old markers, .opencode/specs detection + refusal
- corpus commits - 1,319 files/541 folders phrase pass; archives untouched
