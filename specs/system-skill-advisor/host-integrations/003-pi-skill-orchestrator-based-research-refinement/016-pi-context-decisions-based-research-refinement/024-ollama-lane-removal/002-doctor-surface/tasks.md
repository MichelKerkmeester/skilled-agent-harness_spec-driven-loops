---
title: "Tasks: Phase 2: doctor-surface"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor surface tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: doctor-surface

<!-- SPECKIT_LEVEL: 3 -->

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

`D/` is `.skilled/commands/doctor/`. `R/` is `.skilled/skills/system-skill-advisor/runtime/`. `G` is `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`. Line numbers are at `bf6806ad4b3`; delete from the bottom of a file up so earlier numbers hold.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reprint the Measured Behavior numbers at the phase's start commit and note that commit (`spec.md`). Verify: the commands print `7 targets`, the seven legs, `8`, `18`, `32 routes validated` and `"doctorRoutes":36`.
- [ ] T002 Read phase 001's recorded gate baselines (`../001-residue-check-and-cleanup-tool/implementation-summary.md`). Verify: `rg -n 'run-all.sh|derive-command-bridges|check-markdown-links|npm test' ../001-residue-check-and-cleanup-tool/implementation-summary.md` prints at least one row for each.
- [ ] T003 [P] Record the model-server file list at the start commit (`implementation-summary.md`). Verify: `git grep -l -i -E 'hf-model-server|model server|model_server|HF_MODEL_SERVER' -- .skilled/commands/doctor | wc -l` prints 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Delete the embedder route block, 232 to 250 with the blank line after it, and leave the setup phrase at 407 (`D/_routes.yaml`). Verify: the Measured Behavior target command prints `6 targets: tune rebuild skill-budget parent-skill skill-graph-freshness router-reach`, and `rg -c 'model server or helper process' D/_routes.yaml` prints 1.
- [ ] T005 Delete the route's workflow asset (`D/assets/doctor-skill-advisor-embedder.yaml`). Verify: `test -e D/assets/doctor-skill-advisor-embedder.yaml; echo $?` prints 1.
- [ ] T006 Drop `embedder|` from the argument hint at 3 and delete the table row at 61 (`D/skill-advisor.md`). Verify: `rg -c -i embedder D/skill-advisor.md` prints nothing and exits 1.
- [ ] T007 Delete menu item 5 at 16, answer row `5` at 31, help line 49, `embedder` from the valid-targets line at 65 and the manifest row at 87; renumber menu items and answers 6 and 7 to 5 and 6, help lines 50 and 51 to `-> 5` and `-> 6`, and `(6)` at 56 to `(5)`; leave `Press 1-6` at 58 (`D/assets/doctor-skill-advisor-presentation.txt`). Verify: `bash D/scripts/route-validate.sh 2>/dev/null | grep -o '[0-9]* routes validated'` prints `31 routes validated` and the script exits 0.
- [ ] T008 Delete section 8, from the blank line before `## 8. Embedder Setup Presentation` to the end of the file (206 to 306 at HEAD, earlier once T007 has run) (`D/assets/doctor-skill-advisor-presentation.txt`). Verify: `rg -n -i 'embedder|ollama|meaning match|vector' D/assets/doctor-skill-advisor-presentation.txt` prints nothing, and `tail -n 1` of the file prints the `Route manifest parse error` row.
- [ ] T009 Delete the embedder constants at 74 to 82, the helpers `embedderRoute`, `embedderWorkflow`, `yamlStrings` and `phaseText` at 193 to 228, and section 4 from 324 to the end at 496; keep the `parseYaml` import, which `allowedTools` still uses (`D/scripts/tests/skill-advisor-route-contract.test.cjs`). Verify: `grep -c '^test(' D/scripts/tests/skill-advisor-route-contract.test.cjs` prints 7, `rg -c -i 'EMBEDDER_|embedder' D/scripts/tests/skill-advisor-route-contract.test.cjs` prints nothing, and `node --test D/scripts/tests/skill-advisor-route-contract.test.cjs` reports `fail 0`.
- [ ] T010 Delete the embedder leg at 60 and change "seven" to "six" at 5 and 6 (`D/assets/doctor-setup.yaml`). Verify: the Measured Behavior leg command prints `sk-code sk-git trigger-index runtime-mirrors advisor delivery`, and `rg -c -i 'seven|embedder' D/assets/doctor-setup.yaml` prints nothing.
- [ ] T011 Change "seven" to "six" at 19, delete the target row at 40, the paragraph at 55, the repair row at 64 and the troubleshooting row at 108, and leave the model-server sentence at 87 (`D/assets/doctor-setup-presentation.txt`). Verify: `rg -n -i 'embedder|seven|vector coverage|semantic' D/assets/doctor-setup-presentation.txt` prints nothing and `rg -c SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP D/assets/doctor-setup-presentation.txt` prints 1.
- [ ] T012 Rewrite line 62 to "It then runs six read-only legs once: the sk-code setup battery, the sk-git setup battery, the trigger index freshness check, the runtime mirror check, the advisor status probe with `--warm-only`, and the delivery check, which reads whether each runtime's prompt hook is wired and whether Codex has approved it." and leave 72 (`D/setup.md`). Verify: `rg -c 'six read-only legs' D/setup.md` prints 1, `rg -c -i 'embedder|semantic' D/setup.md` prints nothing, and `rg -c 'model servers' D/setup.md` prints 1.
- [ ] T013 Drop checklist item 5 from line 60 so it ends "4) /doctor:git setup, from inside the target repo. 5) /doctor:setup, from inside the target repo, to confirm the result. Pass only values the operator gave." (`D/assets/doctor-install.yaml`). Verify: `rg -c '5\) /doctor:setup' D/assets/doctor-install.yaml` prints 1 and `rg -c -i embedder D/assets/doctor-install.yaml` prints nothing.
- [ ] T014 Delete step 5 with its blank line at 122 to 124 and renumber `6) /doctor:setup` at 125 to `5) /doctor:setup` (`D/assets/doctor-install-presentation.txt`). Verify: `rg -c '^5\) /doctor:setup' D/assets/doctor-install-presentation.txt` prints 1 and `rg -c -i 'embedder|meaning match' D/assets/doctor-install-presentation.txt` prints nothing.
- [ ] T015 Delete the embedder entry of `CHECKLIST_STEPS` at 87 to 92 (`D/scripts/tests/doctor-install-contract.test.cjs`). Verify: `node --test D/scripts/tests/doctor-install-contract.test.cjs` reports `fail 0`.
- [ ] T016 [P] Delete the `coverage_report` key at 212 and keep `daemon_restart` at 213 (`D/assets/doctor-update-apply.yaml`). Verify: `rg -c 'include-semantic-health|coverage_report' D/assets/doctor-update-apply.yaml` prints nothing and `rg -c daemon_restart D/assets/doctor-update-apply.yaml` prints 1.
- [ ] T017 [P] Rewrite 429 to "After the rebuild outcome on an applied run, name a restart of the advisor daemon to load updated command bridges and lane weights, which are read once at startup. Skip it on dry-run.", delete the `Vector coverage:` line at 467, and end 471 with "On a dry-run, omit the advisor daemon line because the rebuild prompt did not run." (`D/assets/doctor-update-presentation.txt`). Verify: `rg -n -i 'vector|semantic|ollama' D/assets/doctor-update-presentation.txt` prints nothing and `rg -c 'Advisor daemon: restart' D/assets/doctor-update-presentation.txt` prints 1.
- [ ] T018 [P] Delete the coverage step at 125 (`D/assets/doctor-overlay-apply.yaml`). Verify: `rg -c -i 'include-semantic-health|vector' D/assets/doctor-overlay-apply.yaml` prints nothing.
- [ ] T019 [P] Delete the coverage step at 114 (`D/assets/doctor-overlay-repin.yaml`). Verify: `rg -c -i 'include-semantic-health|vector' D/assets/doctor-overlay-repin.yaml` prints nothing.
- [ ] T020 [P] Delete the six `Advisor vector coverage:` lines at 427, 438, 451, 463, 489 and 501 (`D/assets/doctor-overlay-presentation.txt`). Verify: `rg -c -i 'vector coverage|ollama' D/assets/doctor-overlay-presentation.txt` prints nothing.
- [ ] T021 [P] Delete the coverage step at 102 (`D/assets/doctor-symlink-link.yaml`). Verify: `rg -c -i 'include-semantic-health|vector' D/assets/doctor-symlink-link.yaml` prints nothing.
- [ ] T022 [P] Delete the two `Advisor vector coverage:` lines at 217 and 252 (`D/assets/doctor-symlink-presentation.txt`). Verify: `rg -c -i 'vector coverage|ollama' D/assets/doctor-symlink-presentation.txt` prints nothing.
- [ ] T023 [P] Delete the assignment at 169 and the clause "semantic embeddings are disabled," from the comment at 163, so the comment reads "directory makes the SQLite loader return null, and the native lane-ranking overrides are cleared" (`D/scripts/doctor-phrase-reach.cjs`). Verify: `rg -c 'DISABLE_BUILTIN_SEMANTIC|semantic embeddings' D/scripts/doctor-phrase-reach.cjs` prints nothing and `node --test D/scripts/tests/doctor-phrase-reach.test.cjs` reports `fail 0`.
- [ ] T024 [P] Delete the cost script (`R/scripts/measure-embedder-cost.mjs`). Verify: `test -e R/scripts/measure-embedder-cost.mjs; echo $?` prints 1.
- [ ] T025 [P] Delete the script's row at 62 and the cold-sample paragraph at 66 with the blank line at 65 (`R/scripts/README.md`). Verify: `rg -c 'measure-embedder-cost|11434' R/scripts/README.md` prints nothing.
- [ ] T026 Delete the TypeScript row at 265 to 270 and the Python row at 610 to 615, and drop the comma after the `}` that now closes each array, at 264 and 609 (`R/scripts/command-bridges/scoring-compatibility.json`). Verify: `node -e "JSON.parse(require('fs').readFileSync('R/scripts/command-bridges/scoring-compatibility.json','utf8'))"` exits 0 and `rg -c embedder R/scripts/command-bridges/scoring-compatibility.json` prints nothing.
- [ ] T027 Run the generator so it rewrites the bridge JSON and the generated blocks of `projection.ts`, `command-attach.ts` and `skill_advisor.py`, and edit none of them by hand (`R/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `node R/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status":"fresh"` with the expected `"doctorRoutes":35`, `"generated":62`, `"typescriptActive":46` and `"pythonActive":52`, each one below Measured Behavior (record any other delta as a finding), and `git grep -l command-doctor-skill-advisor-embedder -- .skilled/skills/system-skill-advisor` prints nothing.
- [ ] T028 [P] Delete the "Meaning Matching For Commands" section at 86 to 99, step row 5 at 157, and the `semantic_lane_off` row at 342; renumber step row 6 at 158 to 5; change 351's "the advisor build, its embedder and its tuning" to "the advisor build and its tuning" (`INSTALL-SKILLED.md`). Verify: `rg -n -i 'embedder|ollama|semantic|meaning match' INSTALL-SKILLED.md` prints nothing and `rg -c '^\| 5 \| .*/doctor:setup' INSTALL-SKILLED.md` prints 1.
- [ ] T029 [P] Delete the `/doctor:install` bullet at 54, section 12 from 275 to 378 and the embedder-pluggability row at 387; renumber `## 13.` and `## 14.` to 12 and 13 and `### 14.1` to `### 14.4` to 13.1 to 13.4; leave `version` to the pre-commit hook (`G`). Verify: `rg -n -i 'embedder|ollama|semantic' G` prints only the `lanes/semantic-shadow.js` import line until T030, and `rg -c '^## (12\. RELATED RESOURCES|13\. TUNING THE ADVISOR)' G` prints 2.
- [ ] T030 Change the package-check line that imports `lanes/semantic-shadow.js` (105 at HEAD, 104 once T029 has run) to import `lanes/lexical.js` (`G`). Verify: `node -e "import('./.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/lanes/lexical.js')"` exits 0, and `rg -n -i 'embedder|ollama|semantic' G` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Run every doctor suite (`D/scripts/tests/run-all.sh`). Verify: `bash D/scripts/tests/run-all.sh` exits 0 and its summary names no failed suite.
- [ ] T032 Run the live route validator, which `run-all.sh` does not run (`D/scripts/route-validate.sh`). Verify: it exits 0, prints `31 routes validated`, and its H1 warning for `/doctor:skill-advisor` lists only `tune, rebuild`.
- [ ] T033 Run the bridge check and the drift guard (`R/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `--check` prints `"status":"fresh"` and `"changed":[]`, and `npx vitest run tests/command-bridges-drift-guard.vitest.ts` in `R` reports every test passed.
- [ ] T034 Run the mirror check and the markdown link check (`.skilled/skills/system-spec-kit/runtime/cli/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`, and `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` exits 0 with 0 broken.
- [ ] T035 Run the advisor suite and compare it with phase 001's baseline (`R/package.json`). Verify: `npm test` in `R` fails no test that passed in the baseline, and any ratchet that needs recapturing is recorded as a finding in `implementation-summary.md`, not recaptured silently.
- [ ] T036 Prove the doctor folder no longer names the route or passes the flag (`.skilled/commands/doctor/`). Verify: `git grep -l include-semantic-health -- .skilled/commands/doctor` prints nothing, `git grep -n -i -E 'embedder|ollama|include-semantic-health|vector coverage|meaning match|semantic lane|DISABLE_BUILTIN_SEMANTIC|semantic embeddings' -- .skilled/commands/doctor` prints nothing, and `git grep -l measure-embedder-cost -- . ':!specs'` prints nothing.
- [ ] T037 Prove the model-server class is untouched (`D/scripts/orphan-process-check.cjs`). Verify: the T003 command prints 8 with the same files, `git diff --stat <start commit> -- D/scripts/orphan-process-check.cjs D/scripts/tests/orphan-process-check.test.cjs D/scripts/tests/fixtures/doctor-helper` prints nothing, and `shasum -a 256 D/scripts/tests/fixtures/doctor-helper/heldout.jsonl` prints `e5a41fbcad7db0bd8f5e67034579b74573c6eedf096b60b378d393c32f143191`.
- [ ] T038 Run phase 001's residue check in repo mode (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` lists no path under `.skilled/commands/doctor/` outside the eight T003 files, and lists neither install doc.
- [ ] T039 Record each gate's command, exit status and count (`implementation-summary.md`). Verify: `rg -c '^\| ' implementation-summary.md` counts one row per gate in T031 to T038.
- [ ] T040 Validate this phase (`spec.md`). Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the skill-advisor menu reads 1 to 6 and the install checklist reads 1 to 5, and `run-all.sh` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` section 3 and `../../023-ollama-deprecation-research/research/iterations/iteration-003.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 001 is committed and its gate baselines are readable
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` passes on both edited test files and `doctor-phrase-reach.cjs`
- [ ] CHK-011 [P0] `_routes.yaml` and every edited workflow YAML parse with the `yaml` package
- [ ] CHK-012 [P1] No generated file was edited by hand: `--check` prints `"changed":[]` right after the generator run
- [ ] CHK-013 [P1] No numbering gap remains: menu 1 to 6, answers 1 to 6, install checklist 1 to 5, `INSTALL-SKILLED.md` step table 1 to 5, `INSTALL-GUIDE.md` sections 0 to 13
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The skill-advisor menu and accepted answers read by hand after T007
- [ ] CHK-022 [P1] The unknown-target failure block lists the six valid targets
- [ ] CHK-023 [P1] Advisor `npm test` compared with phase 001's baseline
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Finding class: `cross-consumer`; one route feeds the router displays, two contract tests, the install checklist and four generated outputs.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: each of the eight files that pass the flag at HEAD is edited or deleted.
- [ ] CHK-FIX-003 [P0] Consumer inventory: generator outputs, compatibility input and install docs are changed here; the two changelog lines are left to phase 006.
- [ ] CHK-FIX-004 [P0] Parity cases: `route-validate.sh` J1 already fails on a target missing from a display or an extra one, so no new adversarial test is added.
- [ ] CHK-FIX-005 [P1] Matrix: 7 display surfaces by 6 targets and 3 install surfaces by 5 steps, as `plan.md` lists.
- [ ] CHK-FIX-006 [P1] `doctor-phrase-reach.cjs` still sets `SYSTEM_SKILL_ADVISOR_DB_DIR` and `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL` after the edit, so its frozen regime stays reproducible.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, token or dotenv value appears in any edited file
- [ ] CHK-031 [P0] No hook, permission or `allowed-tools` line changes
- [ ] CHK-032 [P1] `git grep -n -E 'ollama (pull|serve)' -- .skilled/commands/doctor` prints nothing, so no doctor step can pull a model or start a server
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] No code comment written in this phase names a spec, phase or task id
- [ ] CHK-042 [P2] The runtime scripts README lists only scripts that exist
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 19 | 0/19 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] `/doctor:setup` runs six legs and makes one fewer advisor CLI call (NFR-P01)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented: revert the phase commit, then `--check` prints `"doctorRoutes":36`
- [ ] CHK-121 [P1] Phase 004 does not start until T036's flag grep prints nothing
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No dependency is added or removed and no lockfile changes
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md` Files to Change, `plan.md` Affected Surfaces and `tasks.md` name the same 28 files
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Merges the branch | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
