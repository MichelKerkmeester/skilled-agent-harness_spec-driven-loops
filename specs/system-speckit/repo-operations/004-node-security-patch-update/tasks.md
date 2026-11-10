---
title: "Tasks: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases"
description: "Task Format: T### [P?] Description (file path). Verify: supplied command or evidence states the expected result"
trigger_phrases:
  - "node security patch update tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `N` | Selected patched Node.js releases and declared floors |
| `W` | `.github/workflows/` |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the security notice and release index for N (Node.js release index). Verify: 22.23.4 is identified as a security release, 24.22.2 and 26.13.0 are newest on their lines, and Node 20 has no later release than 20.20.2 from March 2026. Evidence: supplied release-index facts dated 2026-11-10.
- [x] T002 Install the patched Node releases and repoint the local node link (nvm and ~/.local/bin/node). Verify: mcp-doctor reports Node.js v26.13.0 and the engine range satisfied by the nvm 24.22.2 interpreter. Evidence: supplied machine-step and doctor results.
- [x] T003 [P] Confirm the affected manifests and lockfiles (ten package.json files and seven package-lock.json files). Verify: nine manifests use the selected multi-line range, the Code Mode server uses its 24-only range, and 14 lock entries were synced. Evidence: supplied change record.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Pin Code Mode and move CI to Node 22 (`.skilled/skills/mcp-code-mode/mcp-server/.nvmrc`, W). Verify: .nvmrc is 24.22.2, all 37 setup-node steps name 22, the two Node 20 rerun blocks are removed and both affected workflow files parse as YAML. Evidence: supplied change record.
- [x] T005 Raise package engine ranges and sync locks (ten package.json files and seven package-lock.json files). Verify: nine manifests declare ^22.23.4 || ^24.22.1 || >=26.12.1, the Code Mode server declares >=24.22.1 <25.0.0, and 14 lock entries match. Evidence: supplied change record.
- [x] T006 Update stated minimums, diagnostics and the launcher expectation (CONTRIBUTING.md, system-spec-kit README files, doctor scripts and .skilled/bin/mcp-code-mode-launcher.test.cjs). Verify: stated minimums and the diagnostic floor are updated and the expected range constant matches. Evidence: supplied change record.
- [x] T007 Update the Barter host fallback pin (Barter host .nvmrc). Verify: it changed from v26.10.0 to v26.13.0 in its own commit d5f4d628e. Evidence: supplied host-repository fact.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Record the resolver and launcher suite results (node-engine-resolver and mcp-code-mode-launcher tests). Verify: 21 passed and 1 failed, with the direct-server test failure matching the pre-change result because mcp-server dependencies are absent. Evidence: supplied test results.
- [x] T009 Record the host diagnostic and workflow checks (mcp-doctor.sh and the two affected workflow files). Verify: mcp-doctor prints the two supplied PASS lines and both workflow files parse as YAML. Evidence: supplied verification results.
- [x] T010 Record the remaining operator cleanup and policy exceptions (spec.md and implementation-summary.md). Verify: the eight older nvm versions, Node 18 npx bridge scripts and unchanged Node 22 workflow comments are documented. Evidence: supplied scope and limitation facts.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`. Evidence: T001 through T010 and the verification checklist are checked with evidence.
- [x] No `[B]` blocked tasks remaining. Evidence: no task is marked blocked and packet blockers are empty.
- [x] Manual verification passed. Evidence: mcp-doctor printed the supplied Node.js v26.13.0 and engine-range PASS lines.
- [x] Acceptance criteria are closeable. Evidence: acceptance-criteria.md marks every row Met and Closeable Yes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 and REQ-002 define the patched floors and synchronized consumers.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md names the package policy, pins, CI, diagnostics and verification surfaces.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the release index confirmed the selected versions and nvm installed the three patched releases.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Package engine declarations and lock entries agree. Evidence: nine shared ranges and the Code Mode server range were synchronized across ten manifests and 14 lock entries.
- [x] CHK-011 [P0] No changed runtime console path was in scope. Evidence: the changes update version declarations, CI, documentation and a diagnostic floor. The supplied doctor output contains the two reported PASS lines.
- [x] CHK-012 [P1] Launcher behavior is checked against the declared range. Evidence: the launcher test suite is recorded as 21 passed and 1 failed, with the same direct-server failure as before the change.
- [x] CHK-013 [P1] Package declarations follow one supported-range policy. Evidence: the nine shared ranges match and the Code Mode server retains its separate 24-only range.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md marks every criterion Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: nvm installed the three patched releases, the local node link was repointed and mcp-doctor reported both supplied PASS lines.
- [x] CHK-022 [P1] Runtime boundary effects are recorded. Evidence: the new range excludes Node 20, 23 and 25 and releases below the patched floors on 22, 24 and 26. The supplied facts do not include per-boundary test output.
- [x] CHK-023 [P1] Error scenarios are recorded. Evidence: the direct-server test failure needs mcp-server dependencies that are absent and is the same failure reported before the change. The resolver host test failed before patched Node 24 was installed, as expected.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Finding class recorded. Evidence: this cross-consumer runtime policy update affects pins, CI, package declarations, diagnostics and documentation.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: spec.md lists the ten affected package manifests and seven lockfiles.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed policy. Evidence: plan.md lists all 37 setup-node steps, the launcher, doctor scripts, test runner hint and stated-minimum documents.
- [x] CHK-FIX-004 [P0] N/A for parser, path and redaction cases. Evidence: this change updates Node version policy and does not change a parser, path resolver or redaction surface.
- [x] CHK-FIX-005 [P1] Matrix axes are recorded. Evidence: plan.md names supported lines 22, 24 and 26, earlier releases on those lines and excluded lines 20, 23 and 25. The approved facts do not provide a row count.
- [x] CHK-FIX-006 [P1] N/A for hostile environment variants. Evidence: no hostile environment or global-state test result was included in the supplied facts.
- [x] CHK-FIX-007 [P1] Evidence source limits are recorded. Evidence: the supplied facts name branch worktrees/336-subtrack-gap-fixes and the separate Barter commit d5f4d628e, but no current-repository fix SHA or explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No credential changes are in the supplied scope. Evidence: the listed changes cover runtime versions, package metadata, CI, diagnostics and documentation.
- [x] CHK-031 [P0] N/A for new input validation. Evidence: no user-input or parser change is listed in the supplied change record.
- [x] CHK-032 [P1] N/A for authentication and authorization. Evidence: no auth surface is listed in the supplied change record.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks are synchronized. Evidence: each names the same supported floors, CI updates, package ranges and known limitations.
- [x] CHK-041 [P1] No code comments were changed. Evidence: workflow comments about Node 22 behavior were explicitly left unchanged.
- [x] CHK-042 [P2] Applicable README minimums updated. Evidence: CONTRIBUTING.md and both system-spec-kit README files are listed in the supplied change record.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] N/A for scratch fixtures. Evidence: no scratch files or generated fixtures are listed in the approved change scope.
- [x] CHK-051 [P1] N/A for scratch cleanup. Evidence: no scratch files or generated fixtures are listed in the approved change scope.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-10
<!-- /ANCHOR:summary -->

---



