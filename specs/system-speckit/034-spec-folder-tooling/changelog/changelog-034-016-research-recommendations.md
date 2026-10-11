---
title: "Changelog: Phase 16: research-recommendations [034-spec-folder-tooling/016-research-recommendations]"
description: "Chronological changelog for the Phase 16: research-recommendations phase."
trigger_phrases:
  - "spec folder tooling research recommendations changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-08 to 2026-10-10

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The 16 children here build the ranked recommendations of the auto-healing research in `../014-spec-auto-healing-research/research/research.md` section 11. The set fixes the spec template and the phase scaffold, hardens the healer and the upgrade path, corrects what CI compares, adds the era report and the external-user compat path, and lands anchor repair, lane rules as heal modes and the phrase lint. All 16 children are Complete and every acceptance row is Met.

### Added

- `003-archive-path-follow-ups`: a real-tools round trip test for archive and restore, plus a `SKIP_DIRS` policy comment stating that archived documents keep their content.
- `008-legacy-era-report`: `repo-era.mjs`, a read-only classifier and report of the pre-v4 signals, wired into the `upgrade-legacy` dry run.
- `009-doctor-update-compatibility`: a read-only compatibility phase in `/doctor:update check`, a separate gated compat action with a mandatory preview and collision listing, and the `planLayoutMove` map.
- `010-upgrade-reversibility`: a git refusal, a before-image manifest written before the first change, a stale-manifest refusal, the Downgrades preview and a README recovery script.
- `011-anchor-repair-mode`: `heal-spec-docs.cjs --anchor-repair` for glued pairs, isolated duplicates and nested questions layouts, plus marker-only un-nesting in `repairArchived`.
- `015-lane-rules-as-heal-modes`: five heal modes in order (anchor-wrap, link-repoint, continuity-placeholders, level-from-spec and header-add), each refusing when the packet evidence cannot prove the fix, with refusals recorded in `upgrade-baseline.json`.
- `016-phrase-cleanup-hardening`: atomic cleanup writes, seeding and census for all 18 template kinds, no-frontmatter routing and a blocking pre-commit phrase lint.

### Changed

- `004-trigger-index-rebuild-hardening`: the rebuild job stages and commits the four index files with a presence check, guards its own commits by trailer, classifies a failed push and retries a non-fast-forward once.
- `006-evidence-gated-provenance`: the healer stamps a template header only on an exact anchor match, and `--auto-upgrade` and `--fix` are retired with loud refusals.
- `007-ci-rule-set-comparison`: the changed-packet gate compares failing rule sets against the merge base and fails closed, and the weekly sweep downloads the previous report as `--baseline`.
- `012-fold-one-off-repairs`: the fill takes the document class template literal before the runtime tables, `upgrade-legacy` prints failures grouped by rule with counts, and the process-wide template cache is removed.
- `013-anchor-contract-alignment`: ANCHORS_VALID reports an anchor opened inside another, a closer without an opener and a duplicate closer, with the registry and the rules updated to match.

### Fixed

- `001-spec-template-anchor-nesting`: the questions anchor wraps only the questions in new spec scaffolds, and the golden test fails on any anchor nested inside another.
- `002-phase-scaffold-graph-metadata`: `create.sh --phase` derives graph metadata for the parent and every child before it exits, so a fresh phase scaffold passes its own strict gate.
- `005-healer-phrase-seeding`: the healer and the upgrade fill write only phrases the judge admits, and the compiled-import defect found at gate time was fixed with a package export and a declaration file.
- `014-gate-3-menu-parity`: the full "as an existing packet in the same track" wording is back in the 9 presentation files and the 3 compiled contracts, pinned by a parity test.

### Verification

- Wave 1 and wave 2 final gates: the CLI suite passed 1,648 then 1,685 tests with 0 failed against the 1,639 baseline, `check` exited 0 in both waves and typecheck exited 0 in wave 2, and the hook tests reported 0 failed.
- Tree5 gate, 2026-10-09: CLI test 1,775 passed, 19 skipped, 0 failed, root test exit 0 with 4,180 runtime tests passed, focused vitest 152 passed, hooks 181 passed and 0 failed, doctor 7 of 7 suites, test validation 31 of 31 and both drift guards passed.
- CLI suite, 2026-10-10: exit 0 with 174 files passed, 1,830 tests passed and 19 skipped, after the changed-packet test projection was aligned with the workflow.
- Packet closeout: `validate.sh --recursive --strict` printed `RESULT: PASSED` for 17 of 17 folders and `check-goal.cjs` passed 17 of 17. CI on the shipped commits is 11 of 11 success, with the trigger index rebuild skipped on its own bot commit by design.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `templates/core/spec.md.tmpl`, the golden snapshot test and its snapshots (001) | Modified | Per-level questions anchor openers, a moved L3+ closer and an anchor-order helper |
| `create.sh` and `scaffold-passes-its-own-gate.vitest.ts` (002) | Modified | One `backfill_graph_metadata` helper called from the phase block and the root path |
| `archive-track.vitest.ts` and a `SKIP_DIRS` comment in `heal-spec-docs.cjs` (003) | Modified | A round trip case on the real tools and the archived-packet policy |
| `.github/workflows/trigger-index-rebuild.yml` and `.github/workflows/README.md` (004) | Modified | Four-file staging, presence check, post-commit check, trailer guard and one retry |
| `heal-spec-docs.cjs`, `template-phrase-cleanup.mjs`, `frontmatter-migration.ts`, `runtime/package.json`, `phrase-judge.d.mts` and two test files (005) | Modified and created | Slug seeding, judge-filtered fill and the compiled import fix |
| `heal-spec-docs.cjs`, `check-template-staleness.sh`, `quality-audit.sh`, `templates/MIGRATION.md` and `heal-provenance.vitest.ts` (006) | Modified and created | Exact-anchor provenance stamp and the retired flags |
| `changed-packet-validation.yml`, `strict-pass-freshness-report.yml`, `.github/workflows/README.md` and `ci-rule-set-comparison.vitest.ts` (007) | Modified and created | Rule-set comparison, fail-closed handling and the sweep baseline |
| `repo-era.mjs`, `repo-era.vitest.ts`, `upgrade-legacy.mjs` and `spec/README.md` (008) | Created and modified | The era report and its dry-run block |
| `doctor-update-check.yaml`, `doctor-update-compat-action.yaml`, `doctor-update-presentation.txt`, `_routes.yaml`, `update.md`, two doctor test files, `upgrade-legacy.mjs` and `upgrade-legacy.vitest.ts` (009) | Created and modified | The compat check, the gated action and `planLayoutMove` |
| `upgrade-legacy.mjs`, `upgrade-legacy.vitest.ts` and `spec/README.md` (010) | Modified | The manifest, the stale refusal, the downgrades preview and the recovery script |
| `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `spec/README.md`, `heal-anchor-repair.vitest.ts`, `anchor-repair-sample.vitest.ts`, its 60-document fixture and two modified test files (011) | Modified and created | The anchor repair mode and the archived un-nesting |
| `upgrade-legacy.mjs`, `frontmatter-migration.ts`, `upgrade-legacy.vitest.ts` and `frontmatter-template-literals.vitest.ts` (012) | Modified and created | Template-literal precedence, grouped detail and the cache removal |
| `orchestrator.ts`, `validator-registry.json`, `validation-rules.md`, `anchor-contract.vitest.ts`, three new fixtures, one modified fixture and `anchor-nesting-severity.vitest.ts` (013) | Modified and created | The nesting, closer and duplicate checks |
| 9 presentation files, 3 compiled contracts and `gate-3-menu-parity.test.mjs` (014) | Modified and created | Option C wording restored and pinned |
| `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `spec/README.md`, `heal-lane-modes.vitest.ts` and `upgrade-legacy.vitest.ts` (015) | Modified and created | The five heal modes, the runner and the baseline refusals |
| `template-phrase-cleanup.mjs`, `template-phrase-census.mjs`, `create.sh`, `template-phrase-lint.mjs`, the pre-commit hook, `gates.tsv`, the hooks README and four test files (016) | Modified and created | Atomic writes, 18-kind seeding, no-frontmatter routing and the lint gate |

### Follow-Ups

- The 29 ANCHORS_VALID errors left at the corpus census are not nesting errors and were not cleared. Most sit in sandbox, review and scratch copies kept inside other packets, the rest in archived packets.
- The `/doctor:update compat` orchestrator and its two prompted approvals were never run end to end. The clone run replays the command strings with both approvals pre-approved.
- The 30 recorded findings (27 SPEC_DOC_INTEGRITY and 3 TEMPLATE_SOURCE) are downgraded to warnings, not repaired, because their link targets no longer exist.
- The phrase lint fails open when the linter, node or git is unavailable, and the atomic cleanup write is exercised on macOS only.

## 2026-10-11

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The operator-gated closeout: the real v3 upgrade runs on a fresh clone, the two defects they found and the review fixes in the upgrade tools, and the full-tree apply on the worktree. This entry also closes the changelog refresh that phase 012 left open.

### Changed

- Real v3 runs: a fresh clone of `9f2970c46` (3,465 `spec.md` files, 1.1 GB, 2,048 packets) ran the move, the preview, the apply and the restore. The preview exited 1 with 2,048 failing packets, 0 unreadable and no ENAMETOOLONG. The apply exited 2 with 2,045 of 2,048 packets passing, a 16,212,687-byte manifest with 0 inline content and 31,168 sidecar files. Five upgraded packets pass `validate.sh --strict` and the README recovery script restored one packet byte for byte. Evidence: `009-doctor-update-compatibility/scratch/evidence/lane-real-repo-rerun.txt`.
- Full-tree apply: `node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --roots specs --apply` exited 0, inspected 2,265 packets, passing 2,256 to 2,265 of 2,265, and wrote 24 paths (19 modified and 5 added) across 9 packets with 0 deletions. Evidence: `012-fold-one-off-repairs/scratch/evidence/lane-clone-apply.txt`, section "Real tree apply".
- Follow-up commit `e173e4398c` re-derived description and graph metadata in the five packets the apply left failing, recorded their remaining link findings in `upgrade-baseline.json`, and repaired the stress findings packet frontmatter by hand.

### Fixed

- D1: the dry-run preview followed a committed self-referential link until ENAMETOOLONG. The preview keeps relative links as written and checks containment on the real preview path, so an in-packet link is kept and an escaping link is still refused.
- D2: the reversibility manifest inlined every before-image into one base64 string and the 1.1 GB apply refused with "Invalid string length". Before-image bytes now go to sidecar files under the git directory, read back and checked before the first restore write.
- Post-rerun review fixes: the secret test covers the sidecar files, the README restore script refuses escaping sidecar names and linked sidecar directories, and unreferenced sidecars are pruned after a manifest is written.

### Verification

- The focused upgrade-legacy suite grew from 63 to 67 tests, all passing. Evidence: `009-doctor-update-compatibility/scratch/evidence/lane-review-fixes-upgrade.txt`.
- The clone run ends STATUS=PARTIAL for manual review, because three of 2,048 packets still fail METADATA_DISK_PATH_CONSISTENCY, a rule the tool never records by design.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modified | Link-preserving preview, sidecar before-images and the sidecar guard and prune |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | Red and green cases for the preview links, the sidecar names and the orphan prune |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | The hardened restore script and the sidecar layout |

### Follow-Ups

- Three packets stay failing on METADATA_DISK_PATH_CONSISTENCY after the apply: `027-xce-research-based-refinement`, `029-spec-root-resolution-hardening` and `030-rust-backend-rewrite-research`. They end the run at STATUS=PARTIAL for manual review.
- The `/doctor:update compat` orchestrator with its prompted approvals is still unexercised on a real clone.
