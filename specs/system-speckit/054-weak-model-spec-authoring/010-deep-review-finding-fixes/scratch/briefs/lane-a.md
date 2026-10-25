# Lane A: gate code

Read `common.md` in this folder first. This file adds what is specific to lane A.

## Skills to read

`.skilled/skills/sk-code/SKILL.md` and the references its router names for shell scripts, TypeScript and Vitest tests.

## Tasks

T010 to T030 in `$P/tasks.md`. Evidence goes to `$P/scratch/evidence/lane-a/`.

## Files you own

- `$S/runtime/cli/spec/create.sh`
- `$S/runtime/lib/validation/orchestrator.ts`
- `$S/runtime/cli/rules/check-placeholders.sh`
- `$S/runtime/cli/spec/check-placeholders.sh`
- `$S/runtime/cli/lib/validator-registry.json`
- `$S/runtime/cli/rules/check-scaffold-never-touched.sh`
- `$S/runtime/cli/lib/status-classifier.sh`
- `$S/runtime/lib/description/packet-synopsis.ts`
- `$S/runtime/cli/retrieval/lib/corpus.mjs`
- Tests in `$S/runtime/cli/tests/`: `create-track-containment.vitest.ts` (new), `placeholder-token-gate.vitest.ts`, `post-edit-placeholder-scan.vitest.ts` (new), `required-template-anchors.vitest.ts` (new), `validation-gate-hardening.vitest.ts`, `generated-metadata-drift.vitest.ts`, `trigger-index.vitest.ts`, and `test-validation-extended.sh` only if a harness expectation changes because of your fix.
- `$S/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md`
- A `README.md` under `$S/runtime/` only where it states behavior you changed.
- The build output in `$S/runtime/dist/` and `$S/runtime/cli/dist/`. You are the only lane that builds.

## Facts the conductor checked on this tree

- `validate.sh` runs only the compiled orchestrator, `$S/runtime/dist/lib/validation/orchestrator.js`, after a freshness check that exits 3 on a stale build. Native rules shadow registry shell rules with the same id, so `rules/check-placeholders.sh` never runs under `validate.sh`. Only the isolated rule harness and the parity test run it.
- `PLACEHOLDER_MARKER_RE` at `orchestrator.ts:665` has no `g` flag. `validatePlaceholders` at `:714`, with its `exec` at `:734`, checks only the first match on a line, skips a match only when a backtick sits right before it, and finds fences with `/^\s*```/`. `carriesTokenGateStamp` at `:676` reads `TEMPLATE_STAMP_RE` at `:674` over the first 70 lines and passes at v2.3 or later. `specStatusIsDraft` is at `:694`. `validateAnchorIntegrity`, the ANCHORS_VALID rule, is at `:833` and exempts phase parents.
- `spec/check-placeholders.sh:99` defines `PLACEHOLDER_BODY` with no colon, and around `:138` it skips only the fence lines themselves. The post-edit hook calls this script with the edited doc's folder (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:39`).
- `loadTemplateContract` at `$S/runtime/cli/utils/template-structure.js:519` splits a template's anchors into required and optional by H2 header prefix (`requiredAnchors`, `:550-596`).
- `create.sh` sets `SPECS_DIR="$REPO_ROOT/specs"`, appends `/$TRACK` when the track is non-empty and runs `mkdir -p` with no check (around `:1287-1294`). `--path` already has `resolve_and_validate_create_target` (around `:1223`), which refuses `..` forms lexically.
- The main checkout keeps `specs/ai-systems`, `specs/anobel.com` and `specs/obsidian` as deliberate symlinks to folders outside the repository, maintained by `.skilled/bin/relink-local-specs.sh`. The track check must therefore read the value and must never resolve an existing track symlink. The plan's "Algorithm invariant for P1-01" lists the values to refuse and to accept, and an empty value keeps meaning "no track".
- `gitIgnoredPaths` at `$S/runtime/cli/retrieval/lib/corpus.mjs:200` makes the one git call, an `execFileSync` at `:202`.
- No folder under `specs/` outside packet 054 carries a v2.3 template stamp. Only packet 054 holds v2.3 docs.

## Decisions you keep

- ADR-002: every gate change applies only to docs stamped v2.3 or later, through `carriesTokenGateStamp`. A v2.2 doc keeps today's code path line for line. Test both sides.
- ADR-001: the required-anchor check reads the doc's rendered template through the header-prefix rule `loadTemplateContract` applies. An anchor is required when its section's H2 header has no `L2:`, `L3:`, `L3+:` or `FIX ADDENDUM:` prefix. Do not read `sectionGates` in `templates/spec-kit-docs.json`. T017 pins the orchestrator's required set to `template-structure.js` for every level and core doc.
- ADR-003: the post-edit scan matches exactly the four markers PLACEHOLDER_FILLED flags, applies the same code-span, fence and all-matches rules per stamp, and keeps its exit codes and `--json` fields. Its goal is to report what strict validation would flag in each doc.
- ADR-006: each new error names the file, the missing anchor or token and the section heading to restore, so a model fixes it in one pass.

## Capture order

Capture every before-output your tasks need before your first build, because the build replaces the orchestrator every `validate.sh` call uses. That includes AC-004's v2.2 verdict: copy a passing v2.2 Level 3 packet from outside 054 into your scratchpad sandbox, remove its `requirements` section and record its strict verdict under the old build.

## Census guard

- `$P/scratch/baseline/rules-before.tsv` holds six rule statuses for 4,719 folders, taken before any edit with:
  `env SPECKIT_RULES=PLACEHOLDER_FILLED,ANCHORS_VALID,SCAFFOLD_NEVER_TOUCHED,STATUS_CROSS_DOC_CONSISTENCY,GENERATED_METADATA_DRIFT,SPEC_DOC_SUFFICIENCY node $P/scratch/tools/rule-census.mjs $S/runtime/dist/lib/validation/orchestrator.js $P/scratch/baseline/folders.txt`
  It takes about 4 minutes.
- After your final build, run it to `$P/scratch/baseline/rules-after.tsv` (T030). `diff` against `rules-before.tsv` must print nothing. If a row differs, do not touch the census or the baseline. Report each changed folder, rule and both statuses, with your reading of the cause.
- The synopsis change (T024, T025) is the most likely to move a verdict, because `checkGeneratedMetadataDrift` compares a stored description with a fresh derive whenever the stored `source_doc_hashes` are missing or stale. Before you edit `packet-synopsis.ts`, count the folders in `folders.txt` that would derive a different synopsis under the new cut, and how many of those lack matching stored hashes. Put the numbers in `T025-before.txt`. If the change would move any verdict, do not land it, and report the numbers.

## Consumers to check

- Run `rg -n 'YOUR_VALUE_HERE' $S/runtime --glob '*.sh' --glob '*.ts' --glob '*.mjs' --glob '*.cjs'` and confirm no fourth placeholder scanner exists beyond the three named in the plan.
- Status readers: `status-classifier.sh:68-82`, `specStatusIsDraft`, and `classifyStatus` in `$S/runtime/cli/sweep/strict-pass-freshness.ts`. Your tasks change the first two. Read the third and report whether it reads only the first Status row. Do not edit it.
- `status-classifier.sh` is sourced by `rules/check-placeholders.sh`, `check-status-cross-doc-consistency.sh` and `check-scaffold-never-touched.sh`. `derivePacketSynopsis` feeds `extractDescription` in `folder-discovery.ts`, `deriveCausalSummary` in `graph-metadata-parser.ts` and the drift check. `gitIgnoredPaths` is also used by `spec/repo-era.mjs`. Confirm each consumer still behaves.
- Find every caller that passes `--track` to `create.sh` (commands, YAML assets, scripts, tests) and confirm none passes a value your check now refuses.

## Matrix for T012

Cross stamp (v2.2, v2.3), status (Draft, Complete) and shape: a bare token, a backticked token, a backticked token then a bare one on the same line, a token inside a longer code span, a backtick fence, a tilde fence, an indented fence, the `<YOUR_VALUE_HERE:` form and a `[template:` title. Every shape gets a v2.3 Complete row. Every shape whose v2.2 verdict the fix keeps gets a v2.2 row that asserts the old verdict. Each row asserts both the orchestrator and the shell rule. Give the axes and the row count in your report.

## Adversarial cases for T010

`..`, `../x`, `a/../../x`, an absolute path and `.` are refused before any folder is made, and nothing appears outside the sandbox's `specs/`. `demo` and `demo/sub` succeed. An empty value behaves as no track. An existing track symlink still works. Run the refusal cases against the unchanged script first and save that output as `T010-before.txt`.

## Build and syntax

Run `npm --prefix $S/runtime run build`, then `npm --prefix $S/runtime/cli run build`. Both must exit 0. Rebuild after each source change before any check that goes through `validate.sh`. Then `bash $S/runtime/cli/spec/validate.sh specs/agents/001-terminal-proof-discipline --strict --no-recursive | tail -1` must print `RESULT: PASSED` (T029). Run `bash -n` on every shell script you change.

## Acceptance rows you feed

AC-001, AC-002, AC-003, AC-004, and the synopsis and fsmonitor parts of AC-011. AC-003's packet-wide check, `"placeholders":0` on packet 054, is rerun by the conductor at close, because phase 010's own implementation summary still holds scaffold tokens until then. Report the count you see and which files it comes from.
