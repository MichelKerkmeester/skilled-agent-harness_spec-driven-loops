---
title: "Tasks: Resolution hardening"
description: "Ordered work for making the search path answer on a real host, checking the launch path exists, and reconciling the packet's completion records."
trigger_phrases:
  - "resolution hardening tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Resolution hardening

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the dead search-path branch against a real host — evidence: a real interpreter planted at `<scratch>/v24.99.0/bin/node` and offered as the only search-path entry yielded 1 candidate through the default host access, the running interpreter alone, while the same call with string entries yielded 2
- [x] T002 Measure the workspace gate before any edit — evidence: `node .opencode/scripts/run-node-tests.mjs` reported 75 files, 747 pass, 15 fail, plus vitest 2 files 101 pass 0 fail
- [x] T003 [P] Attribute every baseline failure before changing anything — evidence: all 15 failures are subtests of `.opencode/bin/tests/compiled-route-manifest.test.cjs` asserting `SYNC FAILED: authored closure failed to resolve hubs: sk-code`; that file reads `.opencode/skills/sk-code/mode-registry.json` and `hub-router.json`, which commit `f1812c49f7` rewrites and no commit in this packet touches
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Accept a real directory entry as an interpreter (`.opencode/bin/lib/node-engine-resolver.cjs`) — evidence: `isInterpreterEntry` treats anything that is not a directory as a candidate, so a listing with file types no longer discards every binary
- [x] T005 Read the version from the link target when the entry path carries none (`.opencode/bin/lib/node-engine-resolver.cjs`) — evidence: a link into a versioned directory resolves with source `PATH-link`
- [x] T006 Ask the interpreter for its version under a bounded budget (`.opencode/bin/lib/node-engine-resolver.cjs`) — evidence: source `PATH-probe` answers for a binary with no version in any path, using a fixed argument list, no shell, ignored input, a 2000 ms timeout and a 16-interpreter cap
- [x] T007 Rebuild the search-path tests on real filesystem entries (`.opencode/bin/lib/node-engine-resolver.test.cjs`) — evidence: five tests read a real temporary tree through the default host access, covering all three ladder rungs, an unreadable candidate and a directory named `node`
- [x] T008 [P] Replace the machine-specific assertion with a property of the answer (`.opencode/bin/lib/node-engine-resolver.test.cjs`) — evidence: the real-host test asserts the resolved interpreter satisfies the range read from the manifest, and names no absolute path
- [x] T009 Gate the installer on the declared range (`.opencode/skills/mcp-code-mode/scripts/install.sh`) — evidence: `check_server_engine_range` calls the resolver and fails prerequisites; the fixed floor now carries a comment saying it bounds only the installer's own node usage
- [x] T010 Verify the launcher exists before reporting a working install (`.opencode/skills/mcp-code-mode/scripts/install.sh`) — evidence: `verify_installation` fails with `Launcher not found` when the registered file is absent
- [x] T011 [P] Report a missing launcher in the diagnosis (`.opencode/commands/doctor/scripts/mcp-doctor.sh`) — evidence: `diagnose_code_mode` gained a `launcher_exists` check ahead of the range check
- [x] T012 [P] Classify the launcher in both process sweepers (`.opencode/scripts/session-cleanup.sh`, `.opencode/scripts/orphan-mcp-sweeper.sh`) — evidence: `classify_command` returns `mcp-code-mode-launcher` for the launcher command line and still returns `mcp-code-mode` for the server's
- [x] T013 [P] Correct the sweeper count the repository does not support (`../002-launcher-shim/spec.md`, `../002-launcher-shim/implementation-summary.md`) — evidence: a repository-wide scan finds the entrypoint substring in exactly two shared scripts, and both documents now say two
- [x] T014 Reconcile the installer-execution records (`../004-install-and-doctor/implementation-summary.md`) — evidence: the limitation asserting no end-to-end run is replaced by the gate finding, and a verification row records where the completed run is evidenced
- [x] T015 [P] Record the answers the implementation settled (`../spec.md`, `../001-resolution-contract/spec.md`) — evidence: both open-question sections state the decision and its reason instead of leaving the question open beside a complete status
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Re-run the reproduction as a positive control — evidence: the same planted interpreter is now returned with source `PATH`, alongside the running interpreter, through the default host access
- [x] T017 Prove the tests catch the defect if it returns — evidence: reintroducing the inverted directory test made 5 of 14 fail, including the case that rejects a directory named `node`; restoring the fix returned 14 pass, 0 fail
- [x] T018 Execute the installer end to end against a scratch host — evidence: with a scratch project root and a scratch home, the run emitted `"command": ["node", ".opencode/bin/mcp-code-mode-launcher.cjs"]` with no absolute interpreter path, and a scratch-home run without a satisfying interpreter failed prerequisites with `No Node.js interpreter satisfies >=24.0.0 <25.0.0 (unsatisfied)`
- [x] T019 [P] Exercise both existence checks in both directions — evidence: the installer reports `Launcher verified at:` with the file present and `Launcher not found:` with it absent; the diagnosis reports `[PASS] launcher present` and `[FAIL] launcher missing`
- [x] T020 Re-run the workspace gate and compare against the baseline — evidence: `node .opencode/scripts/run-node-tests.mjs` reported 75 files, 753 pass, 15 fail; the pass count rises by exactly the 6 tests this phase adds and the 15 failures are the same suite `.opencode/bin/tests/compiled-route-manifest.test.cjs` recorded in T002
- [x] T021 Confirm the launcher still starts the server — evidence: an initialize request through `node .opencode/bin/mcp-code-mode-launcher.cjs` returned `serverInfo {"name":"CodeMode-MCP","version":"1.0.0"}`
- [x] T022 Remove every scratch artifact created for these runs — evidence: the scratch project, scratch home and planted interpreter trees are deleted, and `git status` for the packet paths lists only intended files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] An in-range interpreter known only to the search path is selected, and no completion claim in the packet outruns its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] The defect is reproduced against a real host before any edit
- [x] CHK-004 [P1] The gate baseline is measured and every failure attributed before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The resolver's selection contract is unchanged: same range parsing, same highest-satisfying rule, same null on failure
- [x] CHK-011 [P0] The version ladder tries the cheapest source first and executes only as a last resort
- [x] CHK-012 [P1] The installer and the diagnosis read the range through the resolver rather than restating a version
- [x] CHK-013 [P1] No comment names a spec path or artifact id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in spec.md are met
- [x] CHK-021 [P0] The search-path tests run against real filesystem entries, not injected fixtures
- [x] CHK-022 [P0] Reintroducing the defect fails the suite
- [x] CHK-023 [P1] Both existence checks are exercised present and absent
- [x] CHK-024 [P1] The gate shows no failure this phase introduced
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every review finding is either fixed or recorded with the reason it was not
- [x] CHK-FIX-002 [P0] The installer was executed, not only edited
- [x] CHK-FIX-003 [P1] No document in the packet states a count the repository contradicts
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Probing executes only a candidate a launch could itself select and execute
- [x] CHK-032 [P0] Scratch configurations and planted interpreters are removed afterwards
- [x] CHK-033 [P1] The installer run used a scratch home, so its unconditional cache clearing could not reach the operator's
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [x] CHK-041 [P1] No open question sits beside a complete status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---
