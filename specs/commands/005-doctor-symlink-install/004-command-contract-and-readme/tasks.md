---
title: "Tasks: Phase 4: command-contract-and-readme"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "command contract and readme tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: command-contract-and-readme

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

**Paths**: `C` is `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`. `D` is `.skilled/commands/doctor/`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the doctor family entry before editing it (`C`). Verify: `python3 -c "import json; json.load(open('.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json'))"` exits 0.
- [x] T002 [P] Confirm both routers are on disk (`D/symlink.md`, `D/install.md`). Verify: `ls .skilled/commands/doctor/symlink.md .skilled/commands/doctor/install.md` prints both paths.
- [x] T003 [P] Record the README's section order before the new section lands (`README.md`). Verify: `rg -c '^## [0-9]+\.' README.md` prints 17 from the final state, the sixteen the phase found plus the new section 5.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Command Contract

- [x] T004 Name both commands in the doctor family's `router_path`, `argument_hint` and selector text (`C`). Verify: `rg -c '\.skilled/commands/doctor/(symlink|install)\.md' C` prints 2 and `rg -c '\(symlink\)|\(install\)' C` prints 5.
- [x] T005 Add the four execution targets, `check`, `link`, `unlink` and the install guide (`C`). Verify: `rg -c 'doctor-symlink-(check|link|unlink)\.yaml|doctor-install\.yaml' C` prints 8.
- [x] T006 Move the coverage sentence to "37 of the 41 shipped commands" (`C`). Verify: `rg -n '37 of the 41 shipped commands' C` prints one line.
- [x] T007 Add the eight owned assets: the symlink presentation, three symlink YAMLs, the manifest and the engine, plus the install presentation and YAML (`C`). Verify: `sed -n '244,280p' C | rg -c 'doctor-symlink|symlink-manifest|symlink-engine|doctor-install'` prints 8.
- [x] T008 Add the four loader requirements, the two `destructive_policy` operations for `link` and `unlink`, and the two invocation aliases (`C`). Verify: `rg -c '^        "/doctor:(symlink|install)' C` prints 4, `rg -c '^        "symlink (link|unlink) ' C` prints 2, and `sed -n '316p' C | rg -o '/doctor:(symlink|install)' | wc -l` prints 2.

### Routers

- [x] T009 Shorten the `argument-hint` of `symlink.md` to 128 characters, under the 140-character soft budget, and spell the runtime list `<list>` (`D/symlink.md`). Verify: `python3 -c "import re;v=re.search(r'^argument-hint: (.*)$',open('.skilled/commands/doctor/symlink.md').read(),re.M).group(1);print(len(v))"` prints 128 and `rg -n '<csv>' .skilled/commands/doctor/symlink.md` exits 1 with no match. The hint of `install.md` stays at 56 characters.

### Root README

- [x] T010 Add the top-level `## 5. 🔗 USE IT IN YOUR OWN PROJECT` section with its five subsections, Run The Guide, The Steps It Prints, What Gets Linked, Plan, Yes, Undo and Keep Linked Projects Healthy (`README.md`). Verify: `rg -n '^## 5\. 🔗 USE IT IN YOUR OWN PROJECT' README.md` prints line 221 and `rg -c '^### (Run The Guide|The Steps It Prints|What Gets Linked|Plan, Yes, Undo|Keep Linked Projects Healthy)$' README.md` prints 5.
- [x] T011 Renumber the later sections 6-17 and update their internal anchors (`README.md`). Verify: `rg -c '^## [0-9]+\.' README.md` prints 17 and `rg -n '#7--deep-loop|#13--code-mode-mcp' README.md` prints six lines, the links that carry the new ids.
- [x] T012 Name both commands in `### Keep It Healthy` (`README.md`). Verify: `sed -n '215,218p' README.md | rg -c '/doctor:(install|symlink)'` prints 1, the sentence at line 217.
- [x] T013 Change the DOCTOR section to "Sixteen commands", add a table row for each command after `/doctor:setup`, and one entry per command (`README.md`). Verify: `rg -n 'Sixteen commands' README.md` prints line 1292, `rg -c '^\| `/doctor:(install|symlink)`' README.md` prints 2 and `rg -c '^\*\*`/doctor:(install|symlink)' README.md` prints 2.
- [x] T014 Correct the draft paragraph that claimed `/doctor:install` links (`README.md`). Verify: `rg -n 'is the guide' README.md` prints the sentence at line 225 that states the command checks, asks, inspects and prints, and `rg -n 'install command links|/doctor:install links' README.md` exits 1 with no match.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Validate the symlink router as a command (`D/symlink.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type command .skilled/commands/doctor/symlink.md` prints `Total issues: 0`.
- [x] T016 Validate the install router as a command (`D/install.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type command .skilled/commands/doctor/install.md` prints `Total issues: 0`.
- [x] T017 Validate the root README (`README.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type readme README.md` prints `Total issues: 0`.
- [x] T018 Prove each router's authored name is kebab-case (`D/symlink.md`, `D/install.md`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .skilled/commands/doctor/symlink.md` and the same command on `install.md` each print `PASS: authored artifact name is kebab-case` and exit 0.
- [x] T019 Prove the contract still parses and names the new assets (`C`). Verify: `python3 -c "import json; json.load(open('.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json'))"` exits 0, and `rg -c 'doctor:symlink|doctor:install|doctor-symlink|doctor-install' C` prints 16, the lines that name the new commands or their assets.
- [x] T020 Prove every shipped router is consistently described (`.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` prints `routers=41 clean=41 path-drift=0 shape-drift=0` and exits 0.
- [x] T021 Run every doctor suite (`D/scripts/tests/run-all.sh`). Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 with `7 suite(s) passed, 0 failed` and node:test totals `pass 991`, `fail 0`. The run includes `doctor-install-contract.test.cjs` at 16/16, which reads the contract's invocation aliases and loader requirements, and `doctor-symlink-contract.test.cjs` at 34/34.
- [x] T022 Prove each command index agrees with the router frontmatter (`D/scripts/command-catalog-mirror-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` and exits 0.
- [x] T023 Strict-validate this folder. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/004-command-contract-and-readme --strict` passes every document rule and prints `RESULT: PASSED` once the two generated metadata files are re-derived. While they are stale it reports `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` only, and `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <this folder> --apply` rewrites them. Those two files belong to the orchestrator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T023 is checked for every document rule. The metadata refresh that turns its verify into `RESULT: PASSED` is the orchestrator's, and it is the one step left.
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - the runs recorded in `../scratch/verification-evidence.md`, plus the three document validators, the kebab check, the JSON parse and the router generator check run over this tree
- [x] `validate_document.py` prints `Total issues: 0` for both routers and the README, and `generate-command-routers.cjs --check` prints `routers=41 clean=41 path-drift=0 shape-drift=0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Symlink contract**: See `../001-symlink-engine-and-command/scratch/engine-contract.md`
- **Install contract**: See `../002-install-guide-router/scratch/install-contract.md`
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

- [x] CHK-001 [P0] The contract is valid JSON before the edit, so a later parse failure is this phase's. See T001.
- [x] CHK-002 [P0] Both routers are on disk, so the contract has two real files to describe. See T002.
- [x] CHK-003 [P1] The task list carries one line per changed surface and per verification run. Verify: `rg -c '^- \[[x ]\] T[0-9]' specs/commands/005-doctor-symlink-install/004-command-contract-and-readme/tasks.md` prints 23.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The edited contract parses. Verify: `python3 -c "import json; json.load(open('.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json'))"` exits 0.
- [x] CHK-011 [P0] Both routers still pass the command document validator. Verify: `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type command .skilled/commands/doctor/symlink.md` and the same command on `install.md` each print `Total issues: 0`.
- [x] CHK-012 [P1] Every router the generator walks is clean. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` prints `routers=41 clean=41 path-drift=0 shape-drift=0`, exit 0.
- [x] CHK-013 [P1] Each router's authored name is kebab-case. Verify: `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py` on each router prints `PASS: authored artifact name is kebab-case`, exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria closed. Verify: every row in `acceptance-criteria.md` reads `Met`, which the validator reports as `AC_CLOSURE: 8/8 criteria met, waived or superseded; packet is closeable`.
- [x] CHK-021 [P0] The doctor suites pass. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 with `7 suite(s) passed, 0 failed` and `pass 991`, `fail 0`.
- [x] CHK-022 [P0] Both contract tests read the new fields. Verify: the same run reports `doctor-install-contract.test.cjs` at 16/16 and `doctor-symlink-contract.test.cjs` at 34/34. See T021.
- [x] CHK-023 [P1] Each index agrees with the router frontmatter. Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No edited file holds a credential. Verify: `rg -n 'sk-[A-Za-z0-9]{16,}|ghp_' README.md .skilled/commands/doctor/symlink.md .skilled/commands/doctor/install.md .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` exits 1 with no match in this pass.
- [x] CHK-031 [P0] No README line tells a reader to commit a link. Verify: `rg -n 'commit the link|commit an absolute link|commit a link' README.md` exits 1 with no match in this pass.
- [x] CHK-032 [P1] The README states the guide's read-only role. Verify: `rg -n 'is the guide' README.md` prints line 225, which says the command checks, asks, inspects and prints the setup commands.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The contract's coverage sentence carries the count this phase states. Verify: `rg -n '37 of the 41 shipped commands' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints line 8.
- [x] CHK-041 [P1] The README's numbered sections run 1 to 17 with the new one at 5. Verify: `rg -c '^## [0-9]+\.' README.md` prints 17.
- [x] CHK-042 [P2] The DOCTOR section's count and rows agree. Verify: `rg -n 'Sixteen commands|^\| `/doctor:(install|symlink)`' README.md` prints three lines, the count at 1292 and the two rows at 1298 and 1299.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch leftovers in this folder. Verify: `ls -A specs/commands/005-doctor-symlink-install/004-command-contract-and-readme/scratch` prints `.gitkeep`.
- [x] CHK-051 [P1] This phase wrote no file outside the four it names. Verify: `git status --porcelain -- README.md .skilled/commands/doctor/symlink.md .skilled/commands/doctor/install.md .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` lists the contract and the README as modified and the two routers as new, and nothing else.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-31
<!-- /ANCHOR:summary -->

---


---
