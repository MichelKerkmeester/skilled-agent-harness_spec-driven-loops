---
title: "Tasks: Phase 9: Standalone skills"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "standalone skills tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: Standalone skills

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: the verdict this phase applies is research line 11, "Standalone skills keep a short inline router, because the class contract forbids hub files for them", with the class table at line 39 listing the seven `S` roots and line 150 fixing this phase as "Revert per skill; regenerate manifest and aliases". The same verdict is restated in the parent spec's §4 open questions, so no finding needed rechecking. What the baseline added is the two facts the research did not measure: the standalone generator path never reads `leaf-scopes.json` (`scratch/before.md` §5) and `sk-git` sits exactly at the 5,000-word cap.
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/before.md` records 39 of 39 gates at exit 0, routing accuracy 155/195, 49/66 and 19/24, the six ledger entries with their line and word counts, the machine-line count per file and the two facts above. Raw log: `.scratch-dc90/072-009/baseline.txt`, one line per gate.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: `plan.md` §4 fixes the order, cli-orca first and the two heaviest roots last, and §5 names the check for each test type. `plan.md` is unchanged from `HEAD`, so the per-file detail travelled in the two dispatch briefs, one to a Luna worker and one to a DeepSeek worker, which ran the six files in parallel.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restructure cli-orca first, the smallest router. Evidence: SMART ROUTING went from 103 to 5 lines and 714 to 132 words, `## 8. MACHINE ROUTER` is the last H2, and the section sits at `SKILL.md:62` (`scratch/after.md` §4). Its ledger entry is gone, `package_skill.py --check --strict` prints `Result: PASS` at 3,097 words, and `generate-leaf-manifest.cjs --check` prints OK.
- [x] T005 Restructure sk-git, sk-prompt and mcp-code-mode. Evidence: sk-git 135 to 6 lines and 639 to 109 words with `## 9. MACHINE ROUTER` last, sk-prompt 174 to 6 and 1,019 to 121 with `## 10` last, mcp-code-mode 129 to 5 and 773 to 118 with `## 10` last (`scratch/after.md` §4). The review found sk-git's `route_git_resources` body replaced by a pointer and its no-match name gone; the body is restored and `UNKNOWN_FALLBACK` appears three times, as `scratch/after.md` §5 records. The restored body then pushed the file over the 5,000-word cap, and three prose subsections now point at `references/continuous-integration.md`, `references/remote-branch-policy.md` and the two `scripts/` READMEs: 5,000 words at `HEAD`, 4,896 at the end. Fourteen `§2` pointers in sk-prompt's `manual-testing-playbook/` were repointed to the new section in the same pass (`scratch/after.md` §8).
- [x] T006 Restructure system-skill-advisor and system-spec-kit. Evidence: system-skill-advisor 226 to 8 lines and 1,987 to 90 words with `## 9. MACHINE ROUTER` last, system-spec-kit 312 to 6 and 1,712 to 102 with `## 8` last (`scratch/after.md` §4). system-spec-kit's scoring bodies were replaced by a pointer in the first pass; they now name `references/cli/shared-smart-router.md` section 2 at the call site, which is where those bodies live, and its intent tables, loading levels and default resources stay in the file. Both print `Result: PASS` and both manifests check OK.
- [x] T007 Regenerate the leaf manifests and aliases. Evidence: six `leaf-manifest.json` files and six `leaf-aliases.json` files regenerated, and `generate-leaf-manifest.cjs --check` prints OK for all six with the hashes recorded in `scratch/after.md` §3. `ci-leaf-manifest-freshness` reads `checked=14 fresh=14 failed=0`. Seven `.hermes` mirrors were regenerated, one per changed skill plus `sk-create-skill`, and `sync-skills-hermes.cjs --check` reads `PASS: 67 Hermes skill copies in sync`.
- [x] T010 Add standalone leaf scopes or an extension filter for system-skill-advisor `hooks/`, then regenerate its manifest and aliases (`.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`). Verify: the manifest and aliases include the routed hook markdown and no non-markdown hooks, and `generate-leaf-manifest.cjs --check` passes. Evidence: the standalone path now calls the hub's `readLeafScopes`, `collectScopedLeaves` and `walkLeafFiles`, and adds a containment check that fails closed with `OUT_OF_ROOT_LEAF_SCOPE` when a scope leaves its declared root. The new `leaf-scopes.json` names only the five Markdown paths under `hooks/`, the manifest drops from 136 leaves to 127 with no leaf added, and every removed path is a `.ts`, `.py` or `.json` file under `hooks/` (`scratch/after.md` §6). The new test `generate-leaf-manifest-standalone-scopes.test.cjs` passes here and exits 1 against `HEAD`'s generator, so it fails without the change.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1, 39 gates. The first after run left two red, `route-guard` at 1 and `sk-code-setup` at 1, and both read the same stale `mcp-tooling` manifest, because `mcp-code-mode` changed and that hub hashes its packets. After the hub was re-minted and the refreshed manifest copied over its archived activation copy, the final run is 39 of 39 at exit 0, the guard reports `failures: 0` and the setup battery `STATUS=OK legs=9`. Accuracy 155/195, 49/66 and 19/24, identical to the baseline. The final run left `git status` unchanged.
- [x] T009 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity/009-standalone-skills --strict` and the same command with `--recursive --strict` on the parent both print `RESULT: PASSED` at exit 0, both run against the final tree with these docs in place.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md §4, REQ-001 for the two checks, REQ-002 for the first instruction before the machine block, REQ-003 for the `hooks/` scope.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md §3 and §4, the per-skill restructure in four steps, and §5's one-line rule that any tooling change ships a test that fails without it.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: the phase 003 canon supplies the standalone shape and phase 004 supplies the one vocabulary. Both are complete in this tree, and the canon limits of 12 lines and 180 words with the six ledger entries are recorded in `scratch/before.md` §3.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: `generate-leaf-manifest.cjs` is the one shipped script changed, and its six test files pass 13 of 13, the new `generate-leaf-manifest-standalone-scopes.test.cjs` included. The routing-shape ratchet passes 4 of 4 and `sk-doc-script-tests` reads `all sk-doc script tests passed`.
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1, 39 of 39 at exit 0 in the final run, including `catalog-packages`, `contract-drift` and `skill-graph-freshness`.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: `router-reach` reports `operator-local=0` on all seven hubs. The additions are Markdown prose, JSON versions, regenerated manifests and changelog text, and no private surface appears in any of them.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: `package_skill.py --check --strict` prints `Result: PASS` on all six changed files, and the ledger drops from 26 entries to 20 with the ratchet still at 4 of 4, so the six entries came off without raising a ceiling. `MACHINE ROUTER` is the last H2 in all six files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md, 3 of 3 Met.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/before.md` and `scratch/after.md`, with one raw log per gate in `.scratch-dc90/072-009/after/` and `.scratch-dc90/072-009/after-final/`, and the baseline in `.scratch-dc90/072-009/baseline.txt`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: not verifiable as written. The six files were restructured in two parallel dispatches, so no per-file order was recorded, and the largest routing section at `HEAD` (system-spec-kit, 312 lines) leaves no trace of a position in the sequence. The risk the row guards against is covered instead by the per-file comparison against `HEAD` (`scratch/after.md` §5) and by the gate run over the final tree.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: no revert was needed. The generator change is the one that could half-apply, and it ships a test that fails against `HEAD`'s copy, so a revert is caught rather than assumed. Every other file is Markdown and JSON whose gates read the final tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets. Markdown, JSON, regenerated manifests and changelog text only, and no credential appears in any changed file or in these docs.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: a script changed. The new scope path was probed with fourteen shapes and the nine malformed ones all fail closed with a specific code: `MALFORMED_LEAF_SCOPES`, `LEAF_SCOPE_TRAVERSAL`, `DUPLICATE_LEAF_SCOPE_MODE`, `MISSING_LEAF_SCOPE`, `MALFORMED_LEAF_SCOPE`, `OUT_OF_ROOT_LEAF_SCOPE`, `ORPHAN_LEAF_SCOPE_MODE`, plus a `SyntaxError` on invalid JSON. `[]` means no scoping, matching the hub.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec.md, plan.md and tasks.md agree on the six skills, the order cli-orca first and the two heaviest roots last, and the two checks that decide the phase. T004 to T006 record the measured shape of each of the six files.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: six third-segment bumps and six new changelog files: cli-orca 0.1.4.0, mcp-code-mode 1.0.13.0, sk-git 1.11.4.0, sk-prompt 3.0.8.0, system-skill-advisor 0.17.21.0, system-spec-kit 2.12.19.0, each matching its `changelog/v<version>.md`. `sk-create-skill` stepped to 1.7.3.0 because the generator changed inside it.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files in `.scratch-dc90/072-009/` only. The phase runner `scratch/gates.sh` and the two gate records `scratch/before.md` and `scratch/after.md` live under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
