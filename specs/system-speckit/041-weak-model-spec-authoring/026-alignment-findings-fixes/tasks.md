---
title: "Tasks: Phase 26: alignment-findings-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment findings fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 26: alignment-findings-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`K` is `.skilled/skills/system-spec-kit`, `C` is `.skilled/skills/sk-doc/sk-create-changelog`. Each task names its item id from `scratch/items.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the 025 CLI suite baseline still applies (`../025-deprecate-nested-changelogs/scratch/after/cli-suite.txt`). Verify: `git -c core.fsmonitor=false log -1 --format=%h` prints `5b9509576a` and the file prints `Tests  2241 passed | 20 skipped (2261)`. Evidence: HEAD was `5b9509576a` and the 025 file printed `Tests  2241 passed | 20 skipped (2261)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Lane 1: code.

- [x] T002 [P] F1: make `--write` refuse when the resolved output file does not exist, seed the target in the existing write test, and add a refusal test (`$K/runtime/cli/spec-folder/nested-changelog.ts`, `$K/runtime/cli/tests/nested-changelog.vitest.ts`). Verify: the vitest file passes, the refusal test asserts the Error names `/create:changelog` and no file exists afterwards, and it fails with the existence check removed. Evidence: the refusal test passes, asserts the Error names `/create:changelog` and leaves no file, and failed with the existence check reverted. The built generator on 025 with `--write` exits 1 and writes nothing.
- [x] T003 [P] F2: add `@deprecated` naming `/create:changelog` to the module header and the exported `main` (`$K/runtime/cli/spec-folder/nested-changelog.ts`). Verify: `rg -c "@deprecated" $K/runtime/cli/spec-folder/nested-changelog.ts` prints 2 or more. Evidence: `@deprecated` sits on the module header (line 9) and on `main` (line 826).
- [x] T004 F3: after T002 and T003, set every `nested-changelog.ts:` pointer to its real line (`$K/runtime/cli/core/spec-root-registry.ts`). Verify: the line in each pointer matches `rg -n "function ensureApprovedSpecFolder"` and the other named functions in `nested-changelog.ts`. Evidence: `spec-root-registry.ts:79` reads `nested-changelog.ts:601`, the `ensureApprovedSpecFolder` line.
- [x] T005 [P] F4: add one assertion that a `create.sh --phase` child has no `**Changelog**:` line to an existing phase-scaffold test (`$K/runtime/cli/tests/`). Verify: the test passes, and fails when the line is put back into `create.sh`. Evidence: `create-root-numbering.vitest.ts` asserts a new phase child has `**Deliverables**:` and no `**Changelog**:`, and the test failed with the fix reverted.

Lane 2: system-spec-kit docs.

- [x] T006 [P] F5: cut `SKILL.md` to 4990 words or fewer, starting at lines 102 and 105 (`$K/SKILL.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py $K` prints no `exceeds word limit` line. Evidence: `SKILL.md` is 4982 words and `package_skill --check` prints PASS.
- [x] T007 [P] F6: move `references/workflows/nested-changelog.md` out of the COMPLETE intent into another intent (`$K/SKILL.md`). Verify: the RESOURCE_MAP lists the leaf under no COMPLETE key and under at least one other key. Evidence: `nested-changelog.md` moved from the COMPLETE intent to the RESEARCH intent. Leaf-manifest freshness 14/14.
- [x] T008 [P] F7: point the six level-change notes at `implementation-summary.md` or the spec.md change-log section (`$K/SKILL.md`, `$K/references/templates/template-guide.md`, `$K/references/workflows/quick-reference.md`, `$K/assets/template-mapping.md`). Verify: each of the six lines reads the new target, and `rg -n "/create:changelog"` on those lines prints nothing. Evidence: the six level-change lines point at `implementation-summary.md`, or the spec.md CHANGE LOG at Level 3+.
- [x] T009 [P] F8: match the catalog root entry to the leaf description (`$K/feature-catalog/feature-catalog.md`). Verify: `validate_catalog_package.py --package system-spec-kit` reports no `root_leaf_description_mismatch`. Evidence: `validate_catalog_package --package system-spec-kit` exits 0 with no `root_leaf_description_mismatch`.
- [x] T010 [P] F9: mirror the catalog leaf wording in step 7 and its Expected line (`$K/manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md`). Verify: `rg -n "plus its changelog/ when an older packet still has one"` on the file prints the step. Evidence: step 7 and its Expected line mirror the catalog leaf.
- [x] T011 [P] F10: describe `--write` as re-rendering an existing packet changelog and refusing a packet with none (`$K/references/workflows/nested-changelog.md`, `$K/references/workflows/quick-reference.md`). Verify: `rg -n -- "--write"` on both files shows only the re-render and refuse wording. Evidence: both files describe `--write` as re-render-only with a refusal for a packet with none.
- [x] T012 F11: after T006 to T011, update the unreleased entry for F1 and the doc fixes (`$K/changelog/v2.12.13.0.md`). Verify: the entry names the refusal, and a read of the added lines finds no em dash, semicolon or Oxford comma. Evidence: `v2.12.13.0.md` covers the refusal guard and the doc fixes.

Lane 3: sk-doc and the changelog command.

- [x] T013 [P] F12: fix the voice at line 248, the NEVER rule at line 345, add a refusal branch to the router pseudocode and soften the line 51 routing claim (`$C/SKILL.md`). Verify: a read of the four places shows one voice, no rule that forbids the re-render, a branch that refuses a packet-local request, and no guaranteed-routing claim. Evidence: line 255 is imperative, line 352 is the NEVER rule, the pseudocode has a refusal branch, and line 51 carries a softened advisor claim.
- [x] T014 [P] F13: remove the stale trigger phrase (`$C/references/worked-examples.md`). Verify: `rg -n "packet local changelog example" $C/references/worked-examples.md` prints nothing. Evidence: the trigger phrase is gone from `worked-examples.md`.
- [x] T015 [P] F14: drop the nested-output assumption at lines 63 and 67 (`$C/manual-testing-playbook/version-and-format/choose-four-part-bump.md`). Verify: a read of both lines names only global output. Evidence: `choose-four-part-bump.md` names global output only.
- [x] T016 [P] F15: drop `changelog_mode` and unwrap its guards (`.skilled/commands/create/assets/create-changelog-{auto,confirm}.yaml`). Verify: `rg -n "changelog_mode" .skilled/commands/create/assets/` prints nothing and both files load with a YAML parser. Evidence: `rg` finds no `changelog_mode` and both YAMLs parse.
- [x] T017 F16: after T013, soften the routing claim and update the skill entry if T013 changed what it says (`.skilled/skills/sk-doc/changelog/v2.3.24.0.md`, `$C/changelog/v1.3.6.0.md`). Verify: a read of lines 3 and 24 shows no guaranteed-routing claim. Evidence: the `v2.3.24.0` and `v1.3.6.0` claims are softened. sk-doc `validate_skill_package`, `quick_validate`, the playbook package and `parent-skill-check` all exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 F17: rebuild the trigger index after all doc edits (`$K/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: the script's `--check` exits 0. Deferred to push time, not run: origin/main is 9 commits ahead with its own trigger-index rebuild commits, so a rebuild of the generated `trigger-index.json` here would conflict on rebase. It is rebuilt after the rebase.
- [x] T019 F18: sync the Hermes mirror and run the hub check. Verify: the mirror check and the hub check both report no drift. Evidence: the Hermes sync reports 67 copies in sync and `parent-skill-check` exits 0.
- [x] T020 F18: rebuild the CLI and rerun the suite. Verify: `npx vitest run --config vitest.config.ts --project cli` from `$K` prints at least 2241 passed and 0 failed against the 025 baseline. Evidence: `scratch/after/cli-suite.txt` prints 191 files passed and 3 skipped, 2242 tests passed and 20 skipped, rc 0. The +1 over the 2241 baseline is the refusal test. Typecheck and build exit 0.
- [x] T021 F18: validate the packet. Verify: `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder. Evidence: every child of 054 prints `RESULT: PASSED`. The 054 parent prints `RESULT: FAILED` on a `SOURCE_FINGERPRINT_MISMATCH` in its own `graph-metadata.json`, which is outside this phase and needs a repair-derived run on the parent.
- [x] T022 F18: rerun the S1, S2, S3 and S4 battery. Verify: each scenario reports no finding. Evidence: S1 3/3 pass. S2, S3, S4, S7, S9 and S11 gave 70 pass and 2 fail. Both failures are the stale sk-doc compiled-routing manifest (S2 compiled-routing readiness and S7 compiled-route guard), which the pre-commit gate re-mints. The conductor rechecks after the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Items**: See `scratch/items.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-012. Evidence: spec.md section 4 lists REQ-001 to REQ-012.
- [x] CHK-002 [P0] Technical approach defined in plan.md: three lanes, then the conductor gates. Evidence: plan.md names the three lanes and the conductor gates.
- [x] CHK-003 [P1] Baseline recorded: T001 confirms the 025 suite still applies. Evidence: T001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The CLI `npm run typecheck` and `npm run build` exit 0. Evidence: both exit 0.
- [x] CHK-011 [P1] Comments carry the reason and no packet, phase or finding id. Evidence: the added comments in the `.ts` diff from `5b9509576a` carry no packet, phase or finding id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` rows AC-001 to AC-006 read Met.
- [x] CHK-021 [P0] The refusal test fails with the existence check removed. Evidence: the refusal test failed with the existence check reverted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] F1 is `class-of-bug`: every write path in `nested-changelog.ts` goes through the existence check, shown by `rg -n "writeFileSync"` on the file. Evidence: `rg -n "writeFileSync"` finds one write at line 819, after the existence check at line 813.
- [x] CHK-FIX-002 [P1] Evidence is pinned to the fix commit or a diff range from `5b9509576a`. Evidence: the working-tree diff from `5b9509576a` (25 files, 168 insertions, 117 deletions).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the diff adds none. Evidence: the diff adds no secret.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every doc that describes `--write` matches the refusal in code. Evidence: T011, T013 and the `--help` and catalog leaf line 28 now read "refuses a missing one".
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stayed in the session scratchpad or this phase's `scratch/`. Evidence: this phase holds only `scratch/items.md` and `scratch/after/cli-suite.txt`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 5 | 5/5 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
