---
title: "Implementation Summary"
description: "Five suites that passed locally but blocked nothing now run where a failure stops a build: the two .pi extension suites in a new matrix workflow, the sk-git worktree-naming suite in a new workflow, and two sk-doc node tests in sk-doc's named list."
trigger_phrases:
  - "unrun tests ci coverage implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/029-unrun-tests-ci-coverage"
    last_updated_at: "2026-10-20T11:52:32Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-unrun-tests-ci-coverage"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 029-unrun-tests-ci-coverage |
| **Completed** | Not yet: Luna review, strict validation and the CI proof on main are open |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five suites passed on a developer machine and ran in no job that could fail a build, so a regression in any of them would have reached main unseen. Each now runs in a blocking job, and each was broken once to show that job's command fails.

### Phase 29: unrun-tests-ci-coverage

The two `.pi` extensions, `pi-cache-optimizer` (118 tests) and `pi-fast-mode-w-subagent-support` (81 tests), now run in `pi-extension-tests.yml`, one matrix leg each: install from the extension's own lockfile, then its own `npm test`. The sk-git worktree naming, allocation and provisioning suite (109 tests) runs in `sk-git-script-tests.yml`. In sk-doc, `test-cite-drift-scan.mjs` (67 tests) and `install-guide-contract.test.cjs` (4 tests) join the named node list in `run-script-tests.sh`, which the blocking sk-doc Script Tests job already runs.

The sixth suspect, `test-root-name-consumer-matrix.cjs`, was already covered: `test_root_name_consumer_matrix.py` runs it and fails on a nonzero exit, so it stays out of the list rather than running twice. The dual-version workflow's bun comment now says what provisioning does: a package with `bun.lock` or `bun.lockb` and no `package-lock.json` installs with bun.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/pi-extension-tests.yml` | Created | One blocking leg per `.pi` extension |
| `.github/workflows/sk-git-script-tests.yml` | Created | A blocking job for `worktree-naming.test.sh` |
| `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | Modified | Two more names in `NODE_TESTS` |
| `.skilled/scripts/run-node-tests.mjs` | Modified | The `.pi/extensions` comment names the workflow that runs those suites |
| `.github/workflows/opencode-dual-version.yml` | Modified | The bun comment in both provisioning steps |
| `.github/workflows/README.md` | Modified | Rows for the two new workflows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each suite's placement was confirmed by grepping every workflow and the runners they call at `7d55952975` (`scratch/baseline/where-suites-run.txt`). Every suite was run on Node 22.23.1 before the edit, and the git-using ones again with an empty HOME, no git identity and a system-only PATH, to stand in for the runner (`scratch/baseline/hermetic.txt`). DeepSeek v4.1 flash wrote every code and workflow change from one-change literal briefs. Each wired suite was then broken once and the job's exact command run (`scratch/mutation/run-mutations.sh`), and Luna reviewed the change read-only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two new workflows instead of adding steps to an existing one | No existing workflow is filtered to sk-git or `.pi/extensions`; a step in a broader workflow would run these suites on unrelated pushes and miss pushes that only touch them |
| `test-root-name-consumer-matrix.cjs` left out of `NODE_TESTS` | Its Python wrapper already runs it in the same blocking job; listing it would run it twice |
| Tests only for the `.pi` legs, not `typecheck` or `check:pack` | The open item was suites that never ran; the extensions' typecheck uses `tsc` 7 and is a separate decision |
| A two-entry matrix rather than a discovered list | Two extensions exist; a third would need its own lockfile and test script anyway |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baselines on Node 22.23.1 | PASS: 67, 4, 109, 118 and 81 tests (`scratch/baseline/suites.txt`) |
| sk-doc mutants | New runner exit 1 naming both files; base runner exit 0; unmutated exit 0 (`scratch/mutation/skdoc-node-tests.txt`) |
| sk-git mutant | Exit 1, 98 pass and 11 fail (`scratch/mutation/sk-git-naming.txt`) |
| `.pi` mutants | Each leg's `npm test` exit 1 (`scratch/mutation/pi-extensions.txt`) |
| sk-doc runner as CI runs it | 37 PASS, 1 SKIP, exit 0 (`scratch/after/sk-doc-script-tests.txt`) |
| `actionlint`, `check-gate-inputs.sh` | Exit 0; RESULT: PASSED, 0 failures (`scratch/after/workflow-lint.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A third `.pi` extension.** The matrix names the two extensions that exist; a new one must be added to it.
<!-- /ANCHOR:limitations -->

---
