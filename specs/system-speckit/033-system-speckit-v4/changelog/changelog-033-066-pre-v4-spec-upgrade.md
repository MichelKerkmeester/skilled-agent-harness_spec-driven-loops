---
title: "Changelog: Pre-v4 spec folder upgrade path [033-system-speckit-v4/066-pre-v4-spec-upgrade]"
description: "Chronological changelog for the Pre-v4 spec folder upgrade path phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-09-25

> Spec folder: `specs/system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade` (Level 2)
> Parent packet: `specs/system-speckit/033-system-speckit-v4`

### Summary

A user upgrading from v3.x now runs one command and their old spec folders pass validate.sh --strict. No language model is involved, so the upgrade costs no tokens, and an old finding no longer stops a workflow that reopens an old packet.

### Added

- Add the recorded-findings function to validateFolder between the final entry list and the summary: load upgrade-baseline.json, strip line numbers from both sides, downgrade an error entry to warn only when all its details are listed, skip the never-covered rules outside z_archive and z_future, and ignore a malformed file (runtime/lib/validation/orchestrator.ts). Evidence: five-hunk diff in orchestrator.ts (optional recorded field, applyRecordedFindings called before the summary, recorded note in the text report); runtime tsc --noEmit exit 0; generated-metadata-integrity 19 passed
- [P] Vitest cases for T004: all details listed gives warn, one new detail stays error, a shifted line number still matches, a never-covered rule stays error in an active packet and becomes warn under z_archive, a malformed file leaves every error in place, no file changes nothing (runtime/tests/upgrade-baseline.vitest.ts). Evidence: 8 passed; switching the every-key match to some-key fails the unlisted-detail case, so the invariant is guarded
- Rebuild the dist and confirm validate.sh --strict still passes on a current v4 packet with no upgrade-baseline.json (runtime/cli, runtime). Evidence: npm run build in runtime exit 0, both dists carry the change; 010-goal-file-addon and 032-recorded-findings-closure print RESULT: PASSED (errors=0 warnings=0); no upgrade-baseline.json exists under specs/
- Record-only path for z_archive and z_future under --include-archive (runtime/cli/spec/upgrade-legacy.mjs). Evidence: --include-archive harness runs pass 158 of 158 (v3.0) and 895 of 895 (v3.6) archived packets, and the sandbox git status lists no changed archived file apart from each new upgrade-baseline.json; the test "only records an archived packet and never rewrites its documents" passes, and so does "leaves a root inside z_archive alone unless --include-archive is given"
- [P] Vitest: a dry run writes nothing and exits 1, --apply makes strict pass and writes the file, a second --apply changes no byte, and a new broken link after the upgrade fails strict (runtime/cli/tests/upgrade-legacy.vitest.ts). Evidence: upgrade-legacy.vitest.ts 6 passed in a throwaway repo holding a copy of the skill: empty tree exits 0, dry run exits 1 with an unchanged manifest, --apply exits 0 and the packet passes, a second --apply changes nothing, a new broken link fails strict, a root outside the repo exits 2
- Decide from T016's counts which structure-only transforms earn code, then build each with a test and rerun the harness. Closed as not built: every active and archived packet passes on recording alone (170, 995, 158 and 895 of the same), so a transform adds no pass. The largest recorded rule, GREP_CONVENTION (2,181 and 1,977 findings), would need edits to authored documents for findings that no longer block anything, and the large metadata counts belong to archived snapshots, which are frozen by design

### Changed

- Route through sk-code before the first code write, and record what its router resolves (AGENTS.md Gate 2). Evidence: compiled-route.cjs --hub sk-code resolved sk-code-opencode; its universal, JavaScript and TypeScript checklists were loaded
- Capture the before numbers: full cli and root Vitest pass counts, and the harness counts already measured (active 111 of 170 and 686 of 1,007, archived 0 of 186 and 0 of 911) (scratch/harness/). Evidence at f2b04f4773: cli 157 files, 1,550 tests, 1,531 passed, 0 failed, 19 skipped; root 107 files, 1,277 tests, 1,264 passed, 0 failed, 13 skipped; tsc --noEmit exit 0 for runtime and runtime/cli
- Argument parsing, root resolution, discovery through collectSpecFolders, the read-only before pass and the dry-run report (runtime/cli/spec/upgrade-legacy.mjs). Evidence: dry run over specs/system-speckit/033-system-speckit-v4 printed inspected=199 active=199 archived=0 and passing=198/199, exit 1; --bogus and a root outside the repository exit 2. Discovery skips the copies of spec folders that research and review runs keep inside a packet
- Count recorded findings by rule across both tags, for the T014 decision (scratch/harness/). Evidence, findings recorded with --include-archive (v3.0 / v3.6): GREP_CONVENTION 2,181 / 1,977; GENERATED_METADATA_DRIFT 158 / 1,740; GENERATED_METADATA_INTEGRITY 158 / 1,303; METADATA_DISK_PATH_CONSISTENCY 0 / 1,383; ANCHORS_VALID 130 / 705; SPEC_DOC_SUFFICIENCY 79 / 689; SCAFFOLD_NEVER_TOUCHED 48 / 524; SPEC_DOC_INTEGRITY 137 / 453; STATUS_CROSS_DOC_CONSISTENCY 32 / 242; FRONTMATTER_MEMORY_BLOCK 7 / 205; LEVEL_MATCH 104 / 174; PLACEHOLDER_FILLED 157 / 154; FILE_EXISTS 63 / 143; TEMPLATE_SOURCE 9 / 134; AI_PROTOCOLS 78 / 71; FRONTMATTER_VALID 0 / 62; GRAPH_METADATA_CHILD_IDENTITY 0 / 28; TOC_POLICY 0 / 1. The metadata rules appear only in archived packets
- All tasks marked [x], or T014 closed as not built with the measured reason
- No [B] blocked tasks remaining

### Fixed

- Confirm the single-file Vitest commands by running one existing file in each project: repair-derived.vitest.ts (cli) and generated-metadata-integrity.vitest.ts (root) (.skilled/skills/system-spec-kit/vitest.config.ts). Evidence: npx vitest run --config vitest.config.ts --project cli tests/repair-derived.vitest.ts 13 passed, exit 0; --project root runtime/tests/generated-metadata-integrity.vitest.ts 19 passed, exit 0
- Exit 1 from run() when failed[] is non-empty (runtime/cli/graph/backfill-graph-metadata.ts). Evidence: 5-line diff in run(); graph-metadata-backfill and repair-derived tests 19 passed, 1 skipped (pre-existing), exit 0; cli tsc --noEmit exit 0
- [P] Spawn test: a folder whose refresh throws makes the backfill exit 1, and a clean folder still exits 0 (runtime/cli/tests/graph-metadata-backfill.vitest.ts). Evidence: 8 passed, 1 skipped; with the exit-code fix removed the new test fails expected +0 to be 1, so it guards the bug
- Document edits and derivation for active packets, in the order backfill-frontmatter, heal-spec-docs, repair-derived, migrate-generated-json --only (runtime/cli/spec/upgrade-legacy.mjs). Evidence: on a v3-shaped fixture packet --apply ran all four steps (step ...: ok) and passing before=0/1 after=1/1, exit 0
- Write upgrade-baseline.json atomically with sorted findings and a stable recordedAt, validate again, print the report, set exit 0, 1 or 2 (runtime/cli/spec/upgrade-legacy.mjs). Evidence: the fixture's upgrade-baseline.json holds 6 sorted findings with schema 1; a second --apply exits 0 and leaves the specs manifest identical; a new broken link then prints RESULT: FAILED with x SPEC_DOC_INTEGRITY
- [P] Write the v4.0.0.1 release notes covering every change since the v4.0.0.0 tag and naming the command, per the operator's choice on 2026-09-24 (.skilled/skills/system-spec-kit/changelog/v4.0.0.1.md). Evidence: routed through sk-doc to sk-create-changelog, expanded format over 139 commits and 44 packets; claims checked against each packet's summary and commits, with six unsupported claims corrected; hvr_scan.py 0 hard blockers, validate_document.py exit 0

### Verification

- Final proof, v3.0.0.0 with --include-archive, 2026-09-25 - PASS. 328 of 328 after --apply, from 2: active 170 of 170, archived 158 of 158
- Final proof, v3.6.0.0 with --include-archive, 2026-09-25 - PASS. 1,890 of 1,890 after --apply, from 0: active 995 of 995, archived 895 of 895
- Dry run, both final sandboxes - PASS. Exit 1 and the specs manifest unchanged
- Second --apply, both final sandboxes - PASS. Manifest identical
- Scope, both final sandboxes - PASS. No new .md file, no archived file changed apart from its new baseline, no changed status line
- Negative control, both final sandboxes - PASS. A new broken link in an upgraded packet prints RESULT: FAILED with x SPEC_DOC_INTEGRITY
- Unreadable frontmatter on real trees - Reported. 23 left as is lines on v3.0 and 48 on v3.6, and every packet holding one still passes
- Earlier proof runs, 2026-09-24 - PASS. The same results over all four runs, active only and with archives, for both tags

### Files Changed

| File | Action | What changed |
|---|---|---|
| `runtime/cli/spec/upgrade-legacy.mjs` | Created | The upgrade command |
| `runtime/lib/validation/orchestrator.ts` | Modified | Recorded-findings hook in validateFolder |
| `runtime/cli/graph/backfill-graph-metadata.ts` | Modified | Exit 1 when a folder fails |
| `runtime/tests/upgrade-baseline.vitest.ts` | Created | Hook tests |
| `runtime/cli/tests/upgrade-legacy.vitest.ts` | Created | Command tests in a throwaway repository |
| `runtime/cli/tests/graph-metadata-backfill.vitest.ts` | Modified | Exit-status tests |
| `runtime/cli/spec/README.md` | Modified | Names the command |
| `.skilled/skills/system-spec-kit/changelog/v4.0.0.1.md` | Created | Release notes for everything since the v4.0.0.0 tag |
| `scratch/harness/` | Modified | Proof runner, scope checks and a v4 packet count |

### Follow-Ups

- Run it at upgrade time. The command records whatever fails when it runs. Run again after new work, it would record new mistakes too. The dry run lists every packet a run would record, so check it first.
- Folders that are not v4 packets are left alone. v3.6 holds 28 folders with a spec.md but no packet name: backup copies, test fixtures, review scopes and three letter-suffixed names such as 002b-. The command never touches them. CI validates such a folder only when a pull request changes it, and blocks only when it passed on the base, so they cannot newly block a pull request.
- Generated titles can be clipped. A document with no frontmatter gets the shared library's title, which carries the packet path and is cut from the front past 120 characters.
- An empty value stays empty. A key that is present with no value counts as present, so its finding is recorded instead of filled.
- Broken YAML inside a closed block is read line by line. The library reads a block as key and value lines, so a block with both fences but, say, an unterminated quote counts as readable. Missing keys are then added below the broken line. The authored lines stay byte for byte, and the YAML stays as broken as it was.
- The commit hook is stricter. Because a failed re-derive now exits non-zero, the pre-commit hook blocks a commit whose metadata cannot be re-derived. On 2026-09-24 that held for none of the 4,114 packets in this checkout. SPECKIT_SKIP_SPEC_REMINT=1 bypasses it.
