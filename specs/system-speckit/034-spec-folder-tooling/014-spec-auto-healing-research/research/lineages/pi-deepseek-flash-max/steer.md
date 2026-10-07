# Lead brief for this lineage (read before init and before every iteration)

This file is the lead's channel. Its rulings bind inside this lineage directory and grant no write outside it. List this file among each iteration's sources.

## 0. Pre-resolved gates

- Gate 3 is answered. The spec folder is `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research` and your only write surface is this lineage directory. Never ask a question and never end a turn with options.
- On any contradiction or "which truth prevails" moment: record it as a finding with both sources, then continue.
- Run all of `config.maxIterations` (15). Convergence is telemetry only under `stopPolicy: max-iterations`. When an angle saturates, widen to the next question instead of synthesizing early. The terminal synthesis record must carry `stopReason: "maxIterationsReached"`.

## 1. Write scope (hard)

- Write ONLY inside this lineage directory. Never write to `specs/` outside it, `.skilled/`, `.github/`, the repository root, or the scratchpad directory named in section 3.
- `specs/` outside this packet is being edited RIGHT NOW by other repair workers. A stray write there collides with live work.
- Do NOT run any of these, because each one writes: `create.sh`, `archive.sh`, `repair-derived.cjs`, `template-phrase-cleanup.mjs`, `template-phrase-census.mjs`, `refresh-track-roots.mjs`, `sweep-track-roots.mjs`, `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `upgrade-level.sh`, `validate.sh`, `generate-context.js`, any `npm`, `npx`, `vitest` or test command, and any git command that writes (`add`, `commit`, `stash`, `checkout`, `switch`, `reset`, `restore`, `rm`, `mv`, `tag`, `push`). Read their source instead.
- Allowed: read-only commands such as `git log`, `git show`, `git diff`, `git blame`, `git ls-files`, `git grep`, `rg`, `grep`, `cat`, `head`, `sed -n`, `wc`, `ls`, `find` without `-delete`, and the append gateway into your own run directory, which the workflow requires.
- Do not use the em dash character in any file you write.

## 2. The research question

Analyze every change branch `091-consolidate-small-packets` made to the spec folder tooling and the spec corpus. Then answer: how do we harden it, and how do we automate healing and fixing of specs in old formats, including pre-v4 repos, so external users on older versions are not burdened?

Use exactly these five strings as the strategy's Key Questions, so `answeredQuestions` can match them:

1. Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
2. What causes each validation failure class at the source, and how do we stop new instances?
3. How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
4. What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
5. Which checks belong in CI or pre-commit so drift is caught early and cheaply?

The operator named some examples. Treat each as a hypothesis to confirm or refute from the code, not as a given:

- Q1 examples: widening `repair-derived.cjs`'s allow-list, an anchor repair mode, a template-phrase reseed on archive.
- Q2 examples: `archive.sh` not rewriting recorded paths; template bugs such as the Level 2 phase scaffold whose `questions` anchor wraps three other sections; old template versions.
- Q3 constraints from the operator: dry run first, idempotent, reversible, never change what a document says, never invent history.

## 3. Evidence: where to look

Committed on the branch, not yet on main (run `git log --stat origin/main..HEAD`; compare against the merge base with `git diff origin/main...HEAD`):

- `4b33313bd4c` review and research the series parent rule
- `4af470d1531` series parent in all Gate 3 menus and its tooling (touches `.github/workflows/trigger-index-rebuild.yml`, `.github/workflows/advisory-checks.yml`, the Gate 3 menu presentation files under `.skilled/commands/`, `runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `runtime/hooks/pi/spec-gate-enforce.ts`)
- `bdd678bccff` replace template trigger phrases in 375 packets
- `01b0773d067` push the trigger-index rebuild with a fine-grained token
- `5e4164bfac9` clean every template's default trigger phrases (`create.sh`, `template-phrase-census.mjs`, `template-phrase-cleanup.mjs`, `retrieval/lib/phrase-judge.mjs`, their vitest files)
- `7fe1cbeda87` remove template default trigger phrases from live packets
- `b36842de3c1` repair 21 packets that failed strict validation
- `d727cf94fe1` close phase 012 and rebuild the trigger index
- `75c78afa045`, `e9935e99bbc` the Claude 5.5 roster (low relevance; note it and move on)

The phase packets that record why each change was made: `specs/system-speckit/034-spec-folder-tooling/` children `006` through `013` (read `spec.md`, `plan.md`, `implementation-summary.md`), plus the parent `spec.md` and `timeline.md`.

In progress and uncommitted, phase 013: `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md`. It repairs all 4,371 packets, live and archived. Scripted fixes so far: archive phrase cleanup, `description.json` `specFolder` paths, `repair-derived.cjs` re-derivation, duplicate and overlapping anchor repair, missing frontmatter fields. Worker lanes are fixing the long tail: anchors, links, generic phrases, level declarations, and missing documents reconstructed with a dated note.

The one-off scripts, lane briefs and failure reports (READ ONLY, never write here):
`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/`

- `fix-dup-anchors.mjs`, `add-fm-fields.mjs`, `fix-specfolder.mjs`, `dup-survey.mjs`, `fix-queue.sh`, `val-one.sh`, `val-detail.sh`
- `fix-lanes/batch-NN.task` (lane briefs), `fix-lanes/batch-NN.detail`, `fix-lanes/batch-NN.txt`
- Rule-by-rule failure reports: `all-detail.txt` (baseline, 4 MB, use `rg`, do not cat it whole), `detail2.txt`, `detail3.txt`. Format: a `### <folder>` line, then `x RULE_ID: summary`, then indented detail lines.
- Lead's count of `x RULE_ID` lines (re-derive before you rely on it): baseline `all-detail.txt` 2,083 folders, led by METADATA_DISK_PATH_CONSISTENCY 2,898, ANCHORS_VALID 510, SPEC_DOC_INTEGRITY 417, SPEC_DOC_SUFFICIENCY 261, GRAPH_METADATA_CHILD_IDENTITY 260, GREP_CONVENTION 195, LEVEL_MATCH 180, FILE_EXISTS 180, GENERATED_METADATA_INTEGRITY 119, TEMPLATE_SOURCE 99, FRONTMATTER_VALID 95. Latest `detail3.txt` 474 folders, led by ANCHORS_VALID 235, GREP_CONVENTION 152, LEVEL_MATCH 131, FILE_EXISTS 131, SPEC_DOC_SUFFICIENCY 108, TEMPLATE_SOURCE 76, SPEC_DOC_INTEGRITY 62.

A fresh scaffold sample: `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/*.txt` is a byte copy of this packet's docs exactly as `create.sh` produced them for a Level 2 phase child, before anyone edited them. The live copies of those docs will be rewritten after this run, so cite the `.txt` copies.

Existing tooling to build on (read the source, do not run it):

- `.skilled/skills/system-spec-kit/runtime/cli/spec/`: `validate.sh`, `repair-derived.cjs` and `README-repair-derived.md`, `create.sh`, `archive.sh`, `refresh-track-roots.mjs`, `sweep-track-roots.mjs`, `template-phrase-cleanup.mjs`, `template-phrase-census.mjs`, `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `upgrade-level.sh`, `check-template-staleness.sh`, `README.md`
- Validator registry and rules: `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`, and `.skilled/skills/system-spec-kit/references/validation/` (`validation-rules.md`, `template-compliance-contract.md`, `path-scoped-rules.md`, `five-checks.md`)
- Templates: `.skilled/skills/system-spec-kit/templates/` (`CONTRACT.md`, `MIGRATION.md`, `core/`, `addons/`, `packet-types/`)
- `/doctor:update`: `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/doctor-update-*.yaml`, `.skilled/commands/doctor/assets/doctor-update-presentation.txt`, `.skilled/commands/doctor/scripts/release-update.cjs`
- `/doctor:speckit`: `.skilled/commands/doctor/speckit.md`, `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`
- CI: `.github/workflows/` (`trigger-index-rebuild.yml`, `changed-packet-validation.yml`, `spec-kit-check.yml`, `strict-pass-freshness-report.yml`, `advisory-checks.yml`, `README.md`)

Concurrency note: files under `specs/` outside this packet can change between two of your reads. For committed content prefer `git show HEAD:<path>` and say you cited HEAD. When you cite a working-tree line, say so.

## 4. Output shape

- Cite `[SOURCE: <repo-relative path>:<line>]` for every claim about the repository. Scratchpad files are cited by their absolute path and line. Mark each claim CONFIRMED (you read the cited line and it says this) or INFERRED (plausible, and name the check that would confirm it).
- Every iteration narrative that proposes an action carries a `## Recommendations` table with columns: ID, recommendation, question answered (Q1 to Q5), where it lives (file path), effort (S under a day, M one to three days, L more), risk (Low, Med or High, with the reason), files touched, evidence, standing (CONFIRMED or INFERRED).
- Name what you ruled out and why, as `ruled_out` delta rows.
- Each recommendation must say whether it is idempotent, how it is reversed, and whether it could change what a document says. A recommendation that edits prose meaning or invents history is out of scope for Q3; say so if you reject one for that reason.
- The final lineage `research.md` ends with one ranked table across all five questions, highest value first.

## 5. A suggested iteration plan (deviate when your strategy finds a better order, and say why)

- 1 to 2: inventory the branch commits and the phase 013 repair; build a failure-class taxonomy from the detail reports and the scripts.
- 3 to 5: Q2, the source of each failure class (templates, `create.sh`, `archive.sh`, generators, old template versions).
- 6 to 7: Q1, compare each one-off script with the existing tools that could own it.
- 8 to 10: Q3, old-layout and pre-v4 detection, migration, and the `/doctor:update` fit.
- 11 to 12: Q4, the branch's own changes.
- 13: Q5, CI and pre-commit placement, using what the workflows already run.
- 14: adversarial pass. Try to refute your own top recommendations against the code, especially every idempotency and reversibility claim.
- 15: the ranked recommendation table.
