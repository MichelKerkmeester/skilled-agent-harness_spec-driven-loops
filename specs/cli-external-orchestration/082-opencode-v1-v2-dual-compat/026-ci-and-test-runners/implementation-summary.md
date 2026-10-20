---
title: "Implementation Summary"
description: "Seven suites and checks that passed locally but blocked nothing now run where a failure stops a build: the hooks vitest tree has its own blocking job, sk-doc's runner reaches its two node tests, the dual-version workflow runs its trigger-path unit tests, the drift-guard orchestrator has a test, and SECURITY.md has a document type."
trigger_phrases:
  - "ci and test runners implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/026-ci-and-test-runners"
    last_updated_at: "2026-10-20T07:28:17Z"
    last_updated_by: "generate-context"
    recent_action: "Rows 14 16 17 28 32 33 34 fixed locally with mutation evidence"
    next_safe_action: "Run the Luna review, then push and prove hooks-vitest on CI"
    blockers: []
    key_files:
      - ".github/workflows/dispatch-enforcement-guard.yml"
      - ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".skilled/skills/sk-doc/scripts/tests/run-script-tests.sh"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs"
    session_dedup:
      fingerprint: "sha256:36d883636c17873837efabf11ec74d03badb7568ff1be5d9c6693d0434ca4a12"
      session_id: "scaffold-026-ci-and-test-runners"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-ci-and-test-runners |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A failing hooks suite, sk-doc node test, dual-version unit test or drift-guard aggregation now fails a build. Before this phase each of them could break without any job going red.

### Phase 26: ci-and-test-runners

The hooks vitest tree runs in its own blocking job, `hooks-vitest`. The tree holds the three runtime adapter suites: the Pi preflight lint, the Pi directive dedup and the Codex shell-tool names. Running it on a clean tree first showed that three Pi preflight tests passed only on a machine with `devin` and `pi` installed, because the dispatch rules check PATH for the binary. The suite now puts stub binaries on PATH for those tests, so they judge the command and not the machine. Both vitest calls in the guard workflow use `.skilled/node_modules/.bin/vitest`. `npx --prefix .skilled` happened to find the right vitest, but it ran a stub from a parent `node_modules` as soon as `.skilled/node_modules` was missing.

sk-doc's runner now runs its two frontmatter-version node tests by name. The dual-version battery job runs the config-shape and battery unit tests that start the workflow. A new node:test suite drives the drift-guard orchestrator through its pass, warn and fail paths with stub guards, and a new `sk-code-script-tests.yml` workflow runs it with the other sk-code script suites, because the shared runner that collects them only reports. The shared node runner says why `.pi/extensions` is not one of its roots. The sk-doc validator has a `security_policy` type that a file named exactly `SECURITY.md` matches, and the type requires an Overview first and a reporting section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/dispatch-enforcement-guard.yml` | Modified | The blocking `hooks-vitest` job, and the audit step's vitest called by path |
| `.github/workflows/opencode-dual-version.yml` | Modified | A step running both trigger-path unit tests |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modified | Stub `devin` and `pi` on PATH for the extension-boundary tests |
| `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | Modified | Runs the two self-running node tests by name |
| `.skilled/scripts/run-node-tests.mjs` | Modified | Records why `.pi/extensions` is not a root |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs` | Created | Covers the orchestrator's pass, warn and fail aggregation |
| `.github/workflows/sk-code-script-tests.yml` | Created | Runs the sk-code script suites in a blocking job |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modified | The `security_policy` type and its detection |
| `.skilled/skills/sk-doc/scripts/tests/test_validator.py`, `security-policy/SECURITY.md`, `security-policy-no-reporting/SECURITY.md` | Modified, Created | One case that auto-detects and one that must be rejected |
| `.skilled/skills/sk-doc/shared/references/core-standards.md`, `.skilled/skills/sk-doc/shared/scripts/README.md` | Modified | Name the new type |
| `specs/hooks/023-session-relaunch-loop/012-ci-red-check-repairs/` | Modified | Phase label `12 of 12`, task T010 and re-derived graph metadata |
| This folder and `../spec.md` | Modified | The phase records and the phase 26 row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first. Every edit was then written by DeepSeek v4.1 flash through short literal briefs, one change each, and checked against the brief. The spec-folder documents were written directly. Each new or changed test was run against the old code, or against a mutant where the old code had no test, and each run is kept under `scratch/mutation/`. The hooks tree was also run in a clean export of the tree on node 20.19.5 with a system-only PATH, which is how the three PATH-dependent Pi tests were found before CI could find them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend sk-doc's runner for row 14 instead of renaming the tests to `*.test.mjs` | The shared runner that would collect a rename is advisory, while sk-doc's runner already blocks on every push |
| Record `.pi/extensions` instead of adding it to the runner's roots | Every `.pi` suite is `.test.ts` with its own package runner, so the root would discover nothing and only suggest the suites were gated |
| One `hooks-vitest` job for the whole tree, not one per adapter suite | The hooks config already collects every vitest suite in the tree, the three adapter suites included |
| Stub binaries on PATH in the Pi preflight test | The dispatch rules refuse a dispatch whose binary is absent, which is correct behaviour; the test is about the command, so the machine is held constant |
| Match only the exact name `SECURITY.md` | Two tracked lowercase `security.md` files are a playbook leaf and a catalog leaf, and a lowercase reference should keep its own type |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Row 14 mutant (patch bump +2) | New runner exit 1, old runner exit 0 (`scratch/mutation/row14-runner.txt`) |
| Row 16 trigger paths | Neither unit test was named in a step at HEAD; both are now (`scratch/mutation/row16-trigger-steps.txt`) |
| Row 17 on a CI-like PATH | Old test 3 failed of 38; new test 38 of 38; a no-handler mutant fails 19; the full tree 204 of 204 (`scratch/mutation/row17-hermetic-path.txt`) |
| Row 28 ancestor `node_modules` | With `.skilled/node_modules` missing, `npx --prefix .skilled` ran the ancestor stub and the path call failed (`scratch/mutation/row28-ancestor-node-modules.txt`) |
| Row 32 roots | 137 files listed with or without `.pi/extensions` (`scratch/mutation/row32-pi-roots.txt`) |
| Row 33 orchestrator | 4 of 4 pass; three mutants fail 2, 2 and 1 tests (`scratch/mutation/row33-drift-guards.txt`) |
| Row 34 type | Old validator 11 of 13, new 13 of 13; `SECURITY.md` is `security_policy` with 0 issues (`scratch/mutation/row34-security-type.txt`) |
| sk-doc script tests | 35 passed, 1 skipped as in CI, exit 0 (`scratch/after/sk-doc-script-tests.txt`) |
| Workflow lint | `check-gate-inputs.sh` RESULT: PASSED, `actionlint` exit 0 on all three workflows (`scratch/after/workflow-lint.txt`) |
| Hooks tree, worktree | 6 files, 204 of 204, exit 0 (`scratch/after/hooks-vitest.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`opencode.json` is not assessed.** Row 34 marks it UNKNOWN for later, and this phase leaves it there.
2. **The `.pi` suites still run in no CI job.** This phase records why the shared runner does not collect them; installing their packages in CI belongs to the provisioning group.
3. **Other sk-doc tests may run in no blocking job.** `test-cite-drift-scan.mjs`, `test-root-name-consumer-matrix.cjs` and `install-guide-contract.test.cjs` were seen and not checked, because they are not rows of this group.
<!-- /ANCHOR:limitations -->

---
