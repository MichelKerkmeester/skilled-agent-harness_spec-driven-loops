---
title: "Changelog: Phase 20: deep-review-remediation [034-spec-folder-tooling/020-deep-review-remediation]"
description: "Chronological changelog for the Phase 20: deep-review-remediation phase."
trigger_phrases:
  - "spec folder tooling deep review remediation changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-10

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/020-deep-review-remediation` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The deep review of phases 016 to 019 returned CONDITIONAL with 0 P0, 9 P1 and 2 P2 findings after deduplication. Each finding has a fix pushed as `bb2006123f`, a test or check that shows it, and an acceptance row. The rows and their evidence are in acceptance-criteria.md, and the lane tasks are in tasks.md.

### Added

- Scaffold this folder with create.sh --phase --parent in append mode, Level 2, and record the output (scratch/evidence/create-020.txt)
- [P] Check phase 010 against its own record and against main CI. Its tasks.md now marks T009 and T011 closed, and main shows a live Trigger Index Rebuild success on 079e9c34d2 (scratch/evidence/phase-010-status.txt)
- [A] Red: a z_archive symlink to a directory outside specs makes archive copy into it. Cases added to runtime/cli/tests/archive-track.vitest.ts. 9 of 32 fail on the red run (scratch/evidence/lane-a-red.txt)
- [C] Red: a default root and a declared scope symlinked outside the skill. Cases in sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs, failing with "Missing expected exception" (scratch/evidence/lane-c-red.txt)
- [C] Green: each start scope is resolved and confined before readdirSync in generate-leaf-manifest.cjs (scratch/evidence/lane-c-green.txt, scratch/evidence/lane-c-final.txt)
- [D] Red: a parse test on trigger-index-rebuild.yml that fails while checkout keeps credentials. Evidence: runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts loads the workflow with js-yaml and asserts that checkout sets persist-credentials: false (test checks out without persisting the credential). The mutant with persist-credentials: true goes red, 1 failed of 38 (scratch/evidence/closure-workflow-red-mutants.txt, block persist-true). Green runs: 37 passed and 1 skipped under GNU bash 3.2.57 (scratch/evidence/closure-workflow-bash32-recheck.txt) and under GNU bash 5.2.0 (scratch/evidence/closure-workflow-bash52-recheck.txt). The actionlint gate still runs (scratch/evidence/actionlint-final.txt)

### Changed

- Read review/review-report.md sections 1 to 6 and 8 to 9, and the phase 019 layout the packet follows (review/review-report.md)
- Record the starting strict validates before any edit: phase 019 and the 034 parent both print RESULT: PASSED with rc=0 (scratch/evidence/validate-019-baseline.txt, scratch/evidence/validate-034-baseline.txt)
- [A] Green: archive_root is confined below specs before any copy, rename or source removal, and ./.. segments are refused in runtime/cli/spec/archive.sh (scratch/evidence/lane-a-green.txt, scratch/evidence/lane-a-dotseg-red.txt, scratch/evidence/lane-a-dotseg-green.txt)
- [B] Red: default --apply through a symlinked spec.md and tasks.md changes the outside target. Cases in runtime/cli/tests/heal-symlink-containment.vitest.ts. 4 of 4 fail on the red run (scratch/evidence/lane-b-red.txt)
- [B] [P] Parity: the three entrypoints resolve one target set through resolveTargets. Before and after dry-run selections match (scratch/evidence/lane-b-parity.txt), and the parity test fails on a mutated selection (scratch/evidence/lane-b-parity-red.txt)
- [D] Green: persist-credentials: false, the write token only in the push step (line 157), the four-output content check, and the stop-commands wrapper (scratch/evidence/lane-d-harness.txt, scratch/evidence/actionlint-final.txt, scratch/evidence/post-review-trigger-green-bash32.txt, scratch/evidence/post-review-trigger-green-bash52.txt). The retry failure named here was removed by the 2026-10-10 restructure, so its harness evidence is historical. Live proof waits for the post-push run

### Fixed

- [B] Green: symlinked documents are refused before any read or write in runtime/cli/spec/heal-spec-docs.cjs, and the fence, code-span, continuity and delimiter fixes pass their cases (scratch/evidence/lane-b-green.txt, scratch/evidence/lane-b-final-vitest.txt)
- [B] Same-class producer grep for writes reached from a user-derived path in the healer and upgrade-legacy.mjs. Evidence: scratch/evidence/closure-same-class-write-inventory.txt. Its section 1 is the saved grep, and its H1 to H6 and U1 to U7 entries classify each write. No site is marked UNGUARDED. Two sites, E1 and U3, have no check at the write and rely on a caller or discovery guard. The operator accepts these PARTIAL sites, because each sits behind a root the operator names explicitly and the bug class is following a link, not naming a real path: the healer --folder outside the default roots with no --roots (H5), the backfill --root (K1), the phrase-cleanup --root (E2) and the leaf skillDir parent (L1). The orchestrator's decision of 2026-10-10 also accepts site E1, the phrase-cleanup write with no check at the write, on the same basis. The two non-exclusive temp names (graph-metadata-parser.ts:1852 and :1855, archive.sh:333-339) are low-risk temps inside contained directories and are not changed here
- [D] Red: a stub generator that exits nonzero after writing a partial sidecar. No red run on the unfixed workflow was captured. The harness ran the fixed workflow blocks against the same failure (cases R1, R2, S and F in scratch/evidence/lane-d-harness.txt). Superseded in part by the operator's restructure of 2026-10-10, which removed the retry, so R1 and R2 are historical. The exit-checked regenerate step and the verify step now cover that path (see the AC-006 note in acceptance-criteria.md). Closed in this pass: the three generator-fault cases in runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts (fresh-partial, fresh-complete and regenerate-partial) each assert no commit and no push. The red runs are two mutants of the restructured workflow that remove the exit check, regen-exit-removed (1 failed of 38) and fresh-exit-removed (5 failed of 38), in scratch/evidence/closure-workflow-red-mutants.txt. No red run exists on the removed retry, as the note above already states. The bash re-runs are scratch/evidence/closure-workflow-bash32-recheck.txt and scratch/evidence/closure-workflow-bash52-recheck.txt
- [D] Trace the report producer for SL-006-010. Route 1 (freshness sweep) reproduced red and green, route 2 (repair output) shares its wrapper, and route 3 (changed-packet annotations) cannot receive a raw newline (scratch/evidence/workflow-command-trace.txt, scratch/evidence/lane-d-freshness-stop-commands-red.txt, scratch/evidence/lane-d-freshness-stop-commands-green.txt)
- [H] Phase 019 SC-002 is recorded as met, with 019-epic-follow-up-fixes/scratch/evidence/post-push-ci.txt as the receipt
- CHK-010 Code passes lint and format checks for every lane's files. The gate's lint step passes. The cli package's lint script is tsc --noEmit, which exits 0 in the speckit CI job, and actionlint exits 0 on the workflows (scratch/evidence/closure-gate-speckit-ci-actionlint.txt). The gate has no ESLint or format step. A manual ESLint run over the changed .ts files in G4 job j18 (scratch/evidence/closure-gate-final4.txt, sections 1 and 7) reports 0 problems over all 21 changed .ts files. Before the dead-code removal, the same run reported 6 errors in 2 files, all identical at HEAD (scratch/evidence/closure-eslint-head-baseline.txt). Decision of 2026-10-10: remove the dead code now. Lane L deleted seven unused symbols (frontmatterForContextTemplate, VALID_LEVELS, CHECKLIST_H1_PREFIX, OPTIONAL_TEMPLATE_HEADER_RE, OPTIONAL_TEMPLATE_ANCHORS, h2Headers and normalizeHeader) in runtime/cli/lib/frontmatter-migration.ts and runtime/lib/validation/orchestrator.ts. Removing h2Headers left normalizeHeader with no reference. Both packages typecheck with exit 0, and the targeted vitest runs pass (9 of 9 in the CLI, 84 of 84 at the root) (scratch/evidence/closure-lane-l-dead-code.txt). The repository has no format tool, so no format check exists to run. The format half is recorded as not checkable, not as passed. The 95 typecheck:tests errors sit in 36 files. runtime/tests/graph-metadata-schema.vitest.ts is in this phase's diff, and its two TS2339 errors are at HEAD too, moved down one line (scratch/evidence/closure-tsc-trigger-test-finding.txt).

### Verification

- Targeted vitest, 13 suites the lanes touched (archive, healer containment and parity and lane modes, repair-derived, upgrade-legacy, phrase cleanup and provenance, graph-metadata backfill, migrate generated JSON, folder discovery, graph-metadata schema, upgrade baseline) - 13 files passed, 369 tests passed, 1 skipped, exit 0 (final-targeted-vitest.txt)
- Phase command workflows test - 148 passed, 0 failed, exit 0 (phase-command-workflows-final.txt)
- Leaf manifest scope test - Exit 0 (lane-c-final.txt)
- Red and green pairs for each code lane - Recorded in the lane evidence files named in acceptance-criteria.md
- actionlint over every workflow - Exit 0, no output. A negative control reports an unknown key with exit 1 (actionlint-final.txt)
- YAML parse of the changed YAML files - All nine parse, and the duplicate-key negative control is reported (yaml-parse-check.txt)
- Hermes sync check - PASS, 70 copies in sync, exit 0 (lane-g-sync-check.txt)
- Child-dispatch grep, HEAD against now - 0 at HEAD, 7, 7 and 1 now (closure-child-marker-part3.txt, section 3), in the two SKILL.md copies and the implement YAML (child-dispatch-check.txt)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | Lane A containment |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modified | Lane B refusals, shared helper, atomic write, transform fixes (Deviation 7) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modified | Lane F guards and baseline handling, and the Lane B helper reuse. `recordFindings` (line 1250) carries an `export` that only the upgrade-legacy test imports, and the module also calls it at line 1591 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modified | Link refusal, exclusive temporary names, UNREADABLE reasons |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modified | Lane E provenance |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts` | Modified | Prune report link refusal and exclusive write |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified, Deviation | Linked baseline not applied, `UPGRADE_BASELINE_LINK` warning. Unused symbols removed (CHK-010, Deviation 12) |
| `.skilled/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts` | Modified | Link refusal in the description loaders and cache |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modified | Link refusal in the graph metadata loader |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modified | Lane C start-scope confinement |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs` | Modified | Lane C case: a root and a declared scope symlinked outside the skill |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts`, `heal-lane-modes.vitest.ts`, `repair-derived.vitest.ts`, `template-phrase-cleanup.vitest.ts`, `upgrade-legacy.vitest.ts`, `migrate-generated-json.vitest.ts`, `graph-metadata-backfill.vitest.ts` | Modified | New cases for the lane that touches each suite |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-symlink-containment.vitest.ts`, `heal-target-parity.vitest.ts`, `template-phrase-provenance.vitest.ts` | New | Lane B containment and parity, and Lane E provenance |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modified | Lane D non-ASCII listing case. The quoted `head_failing["$packet"]` reference came from the 016 closeout (Deviation 8) |
| `.skilled/skills/system-spec-kit/runtime/tests/folder-discovery.vitest.ts`, `graph-metadata-schema.vitest.ts`, `upgrade-baseline.vitest.ts` | Modified | Link-refusal cases for the description loaders, the graph metadata loader and the linked baseline |
| `.github/workflows/trigger-index-rebuild.yml` | Modified | Lane D credential and verification, restructured on the operator's decision of 2026-10-10 into a `rebuild` job (`contents: read`, no secret) and a `push` job (`contents: write`, the job that runs git push). A rejected push exits 0 with a notice instead of retrying. The file is no longer the harnessed copy from the earlier pass. Its SHA-256 is `f955fd3f81a5c8ba901a695fea05bb25eadea0a9cd234ec377281f0cd91e1b65` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` | New | Runs the workflow's run blocks under bash against a local bare origin, with a token-free generator stub and planted hooks. 59 passed and 1 skipped (60 cases) on its own. The mutant reds are under Verification |
| `.github/workflows/strict-pass-freshness-report.yml` | Modified | Stop-commands around printed folder names |
| `.github/workflows/changed-packet-validation.yml` | Modified | Route 3 annotation escaping, stop-commands replay of validator output, `git diff -z` packet listing |
| `.skilled/skills/system-spec-kit/SKILL.md` and `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Gate 3 child-dispatch branch |
| `AGENTS.md` | Modified, Deviation | Line 86, the autonomous child-dispatch exemption, names `AI_SESSION_CHILD=1` alone, matching the gate core (Deviation 11) |
| `.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md` | Modified, Deviation | Line 26 names `AI_SESSION_CHILD=1` alone as the exemption, matching the gate core. Lines 52 and 53 are unchanged (Deviation 13) |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modified, Deviation | Seven unused symbols removed across this file and `orchestrator.ts` (CHK-010, Deviation 12) |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modified | Child-dispatch branch, `checkpoint_options`, `child_dispatch_checkpoints` |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md` | Modified | No-roots sentence |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/derived-packet-repair.md` | Modified | Three H2 separators |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` | Modified | `UPGRADE_BASELINE_LINK` line |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md`, `heal-spec-docs-lane-modes.md`, `spec-lifecycle-automation.md`, `upgrade-legacy-downgrades-report.md` | Modified, Deviation | Catalog sentences for the lane behaviour (Deviation 5) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md` | Modified, Deviation | Playbook steps for the archive refusals (Deviation 5) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`, `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md` | Modified, Deviation | Module README rows for the archive and leaf refusals (Deviation 5) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modified, Deviation | `documentsPhaseFolder` helper that accepts both spellings of the phase-folder flag (Deviation 6) |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md`, `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml`, `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | Modified, Deviation | Made while closing 019's CHK-021 (Deviation 4) |
| `.github/workflows/playbook-operator-contract.yml` | Modified, Deviation | Two comment lines and a `shellcheck disable=SC2016` directive above a `node -e` run block (Deviation 1) |
| `.skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml` | Modified, Deviation | One command line quoted with single quotes so the YAML parses (Deviation 2) |
| Three deep-loop stress-test READMEs: `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/README.md`, `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/README.md`, `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/README.md` | Modified, Deviation | Reason not found (Deviation 3) |
| `.skilled/changelog/skilled/README.md`, `.skilled/changelog/skilled/v4.0.0.4.md`, `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` | Modified, Deviation | Row for the unreleased `v4.0.0.4.md`, and the Deep Review Fixes sections (Deviation 9) |
| `specs/system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild/spec.md` | Modified | `Superseded by` note |
| `specs/system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild/implementation-summary.md` | Modified | The two LOGIC-SYNC items read as resolved by supersession, the changelog item and the next action |
| `specs/system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild/plan.md` and `tasks.md` | Modified | `actionlint` (exit 0) in the testing row, and T009 and T011 closed |
| `specs/system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild/graph-metadata.json` | Modified | Re-derived by `repair-derived.cjs --apply` |
| `specs/system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild/scratch/evidence/` (`actionlint-trigger-index-rebuild.txt`, `ci-bot-commit-proof.txt`, `validate-010-closure.txt`) | New | The evidence the 010 docs cite. The files date from 07:57 to 08:02 on 10 October, during this phase |
| `specs/system-speckit/034-spec-folder-tooling/changelog/` (`changelog-034-010-trigger-index-ci-rebuild.md`, `changelog-034-017-heal-cli-and-compat-yaml-simplification.md`, `changelog-034-018-epic-docs-alignment.md`, `changelog-034-019-epic-follow-up-fixes.md`) | New | Generated phase entries. 010 and 019 were regenerated. The 016 entry was deleted (Known Limitations item 17). 020 has none |
| `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/acceptance-criteria.md`, `implementation-summary.md`, `plan.md` and `tasks.md` | Modified | Citations of the renamed evidence now name `.txt`, 30 citations in all. Other edits in these files belong to the 019 lane (see Not this packet's changes) |
| `specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/graph-metadata.json` | Modified | Re-derived by `repair-derived.cjs --apply` |
| `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/goal.md` | Modified | Continuity block closed: `completion_pct` 100, `last_updated_by` `closure-leaf`, box 3 proof named in `recent_action`. The CLI log citation names the `.txt` file. `recent_action` was shortened to one clause in the fix pass, for SPECDOC_FRONTMATTER_004 |
| `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/graph-metadata.json` | Modified | Re-derived by `repair-derived.cjs --apply` |
| `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/spec.md` | Modified, Deviation | Status In Progress to Complete (Deviation 8) |
| `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/scratch/evidence/`, `019-epic-follow-up-fixes/scratch/evidence/` and `020-deep-review-remediation/scratch/evidence/` | Renamed, 26 files | `.log` to `.txt` with each basename kept. The `*.log` rule in `.gitignore` (line 261) had kept them out of git, so the new names are untracked until staged. The 019 folder also holds files the 019 lane wrote, which this packet does not record. `scratch/evidence/workflow-command-trace-route3-closed.txt` is not edited, so its seven `route3-*.log` citations still name `.log` files that now ship as `.txt` |
| `specs/system-speckit/034-spec-folder-tooling/spec.md`, `timeline.md`, `graph-metadata.json` | Modified | Completion percentage, 016 phase row, 019 and 020 timeline entries, and the parent graph re-derive. `description.json` has no diff and is not listed |
| `specs/system-speckit/034-spec-folder-tooling/020-deep-review-remediation/` | Created | This packet's documents and `scratch/evidence/`. Four uncited, empty `016-closeout-*.done` markers were deleted in the fix pass. `016-closeout-final-gates.done` holds `ALLDONE` and was kept |
| `specs/system-speckit/034-spec-folder-tooling/020-deep-review-remediation/tasks.md` | Modified | T026 completion figure, now 95 |

### Follow-Ups

- Search debt is not all closed. The brief said every search-debt item is fixed. The review's search ledger and this packet's own scope disagree on three items:
- SL-SEC-008 (upgrade apply symlink containment) is closed by lane F.
- SL-006-010 (workflow command log injection) is closed for both workflows. The freshness report routes are closed by stop-commands. The changed-packet annotations are closed by escaping each property and message, and by replaying validator output inside a stop-commands block. The percent-decoding case is tested and closed. The hostile replay (scratch/evidence/route3-hostile-old.txt and route3-hostile-new.txt) names packets such as a%0A::error::PWNED. The new block prints one ::error line per packet, with % escaped to %25 first, then : and , escaped in properties. A reviewer's rerun with ::add-mask::, CR and LF also gave exactly one ::error line. The replay is a text replay of the run block, not a GitHub runner run. The verdict is in scratch/evidence/workflow-command-trace-route3-closed.txt, and workflow-command-trace.txt is unchanged. The git diff -z listing change is a separate fix for silently skipped names. The stage-two harness run on the final block lists and grades the control-character, quote and non-ASCII names (scratch/evidence/changed-packet-listing-controlchar-stage2.txt), and the harness block matches the workflow's run block, apart from surrounding whitespace (scratch/evidence/changed-packet-listing-block-match.txt).
- SL-005-006 (runtime test execution) is closed for the touched suites only. The full CLI suite is the orchestrator's.
- SL-007 (individual lane transform edge cases) is covered for the transforms that changed. A review of every transform is not claimed.
- SL-007-009 (spec-code traceability) and SL-007-010 (checklist evidence) stay open. The spec puts them out of scope, and no lane addresses them. Deep-review iterations 8 to 10 exercised both rows, but the reducer keeps them open because no later row closes them by id (review/review-report.md section 9).
