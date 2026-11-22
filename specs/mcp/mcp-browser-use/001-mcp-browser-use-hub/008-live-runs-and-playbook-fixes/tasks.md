---
title: "Tasks: Phase 8: live-runs-and-playbook-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "live runs and playbook fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: live-runs-and-playbook-fixes

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

- [x] T001 Scaffold this phase as a child of `001-mcp-browser-use-hub/` with `create.sh --phase --parent`. Verify: `ls 008-live-runs-and-playbook-fixes` lists `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `acceptance-criteria.md`, `goal.md`, `description.json` and `scratch/`. Evidence: create.sh printed "Phase Spec Created Successfully" and listed the same files.
- [x] T002 Pick the level with the helper on the measured scope (`recommend-level.sh`). Verify: `recommend-level.sh --loc 3005 --files 71` prints `Recommended Level: 2`. Evidence: score 55/100, confidence 90%.
- [x] T003 Relaunch Aside with `--remote-debugging-port=9333` for attach mode (operator approved), and close the port after BB-015. Verify: `curl -s http://127.0.0.1:9333/json/version` exits 7 with no output. Evidence: exit 7 at the check on the authoring date.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the Bladebro real-browser scenarios BB-010, BB-011, BB-012, BB-013 and BB-015, read-only, with BB-012 and BB-015 targeting `app.clickup.com`, and record them (`benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/`). Verify: `awk -F, 'NR>2 && $3=="PASS"' results.csv | wc -l` prints 4 and `grep -c ',FAIL,' results.csv` prints 1. Evidence: 4 PASS, and BB-012 FAIL with the launch reason. Attach run reported on port 9333: Chrome 156, three reads, hostname `app.clickup.com`.
- [x] T005 Run the 15 Aside scenario ids on Aside 1.26.626.1517 and record them (`benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/`). Verify: `awk -F, 'NR>2' results.csv | wc -l` prints 15, and the PASS and FAIL counts are 10 and 5. Evidence: FAIL on ASD-007, 016, 017, 018 and 019, each with its cause in the reason cell.
- [x] T006 Add scenario BB-015 `real-browser/attach-mode-reads.md` and list it in the section 12 index (`mcp-bladebro/manual-testing-playbook/`). Verify: `grep -c 'BB-015' manual-testing-playbook/manual-testing-playbook.md` prints at least 3, and the validator reports `scenarios=15`.
- [x] T007 Bump the Bladebro playbook root to 1.1.0.0 and update its section 5 latest-run line (`mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md`). Verify: `grep -m1 '^version:' <file>` prints `version: 1.1.0.0`, and the section 5 line names the 2026-11-22 run.
- [x] T008 Build the Bladebro package: `feature-catalog/` (root and 17 entries), `examples/` (README and three scripts), `mcp-servers/{bladebro-cli,bladebro-mcp}/README.md`. Verify: `find feature-catalog -name '*.md' | wc -l` prints 18, and `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` exits 0.
- [x] T009 Correct the Chrome DevTools scenario forms that failed live: BDG-003, 005, 006, 011, 012 CLI forms, and BDG-014, 016, 017, 018 Code Mode forms (`mcp-chrome-devtools/manual-testing-playbook/`). Verify: `validate-playbook-package.cjs --package mcp-browser-use/mcp-chrome-devtools` exits 0 with `violations=0`. Root bumped to 1.0.6.0. BDG-015 left as it was, UNKNOWN.
- [x] T010 Correct the Aside REPL and form fixes (`mcp-aside-devtools/manual-testing-playbook/`), and bump the root to 1.0.3.0. Verify: `validate-playbook-package.cjs --package mcp-browser-use/mcp-aside-devtools` exits 0 with `violations=0`.
- [x] T011 Add one index row per new run in each mode's `benchmark/reports/README.md`. Verify: `grep -c '2026-11-22--manual-testing-playbook--clickup-real-browser' .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/README.md` prints at least 1, and the Aside equivalent for `signed-in-live` prints at least 1.
- [x] T012 Remove the unregistered 4.3 GB worktree `505-mcp-browser-use-hub` after the read-only Vibe plugin folders were made writable. Verify: `ls /Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub` exits 1 with `No such file or directory`, and `git worktree list` has no line for 505. Evidence: both checks, observed on the authoring date.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Validate the Bladebro playbook and its catalog. Verify: `validate-playbook-package.cjs --package mcp-browser-use/mcp-bladebro` and `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` each exit 0. Evidence: 15 scenarios and 0 violations, 18 catalog markdown files and 0 violations.
- [x] T014 Confirm no run folder quotes an email, account id or cookie value. Verify: `grep -rEc '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' <both run folders>` prints 0 for every file. Evidence: six files, 0 matches each.
- [x] T015 Validate the Chrome DevTools and Aside playbooks. Verify: `validate-playbook-package.cjs` exits 0 with `violations=0` for both packages. Evidence: Chrome 30 scenarios with 2 pre-existing census warnings, Aside 29 scenarios with 1 pre-existing census warning.
- [x] T016 Review follow-up, BB-015: the eval returns two booleans (`host-match`, `sign-in`) and never the hostname, the evidence rule forbids hostnames, and the `--port` citation names the catalog entry (`real-browser/attach-mode-reads.md` 1.0.1.0, `examples/attach-read.sh`, `examples/README.md`). Verify: `bash -n` and `shellcheck` pass on the script, and it exits 2 on a URL with a quote or a backslash. Evidence: `shellcheck` printed nothing; both bad URLs printed the refusal and exited 2; a node check of the eval string printed `host-match true sign-in false`.
- [x] T017 Review follow-up, Aside: ASD-012, 013 and 019 require a PASS reason that opens with the outcome, and the `SKILL.md` table and the feature catalog record console, network and context cookies as gaps on 1.26.626.1517. Verify: the Aside playbook validator exits 0 with `violations=0`. Evidence: `scenarios=29 violations=0 warnings=1`, the warning a hand-typed census that matches the tree; the Aside catalog validator prints `PASS: 0 violations`.
- [x] T018 Review follow-up, Chrome DevTools: every `bdg status` check in `references/session-management.md`, `troubleshooting.md`, `cdp-patterns.md` and the `session-status` catalog entry uses `bdg status --json` and `.active`, and the root census is no longer hand-typed. Verify: grep the Chrome `references/` and `feature-catalog/` for `bdg status` lines without `--json` that pipe to `jq` or `grep`; only the `bdg status | jq .` symptom line in `troubleshooting.md` remains, and the Chrome validator reports `warnings=0`. Evidence: both observed after the edit; the Chrome catalog validator prints `PASS: 0 violations`.
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4, REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 1 and 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: spec.md section 6 and plan.md section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Playbook and catalog validators pass. Evidence: T013 and T015.
- [x] CHK-011 [P0] No validator reports a violation. Evidence: `violations=0` for all four packages in T013 and T015.
- [x] CHK-012 [P1] Failures are recorded as failures. Evidence: five Aside FAIL rows and one Bladebro FAIL row each name a cause in the reason cell.
- [x] CHK-013 [P1] Packages follow the sibling shape. Evidence: `ls` of the Aside, Chrome DevTools and Bladebro package roots lists the same set, including `feature-catalog`, `examples` and `mcp-servers`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md, every row Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: T004 and T005 recorded the live runs.
- [x] CHK-022 [P1] Edge cases recorded. Evidence: spec.md section L2 edge cases, with the empty CSV reasons and the REPL `page` null behavior.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: BB-012 kept its FAIL and was not retried. The Aside FAILs stayed FAIL.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the Aside FAILs fall into two classes, `page.on` unsupported (ASD-012, 013, 018) and `/tmp` redirected into the session folder (ASD-007, 017). Two findings are instance-only: the stale h1 (ASD-016) and the missing `page.context` (ASD-019). Each cause is named in its reason cell.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `grep -rln` over the Aside playbook. Its `page.on` and `page.context` hits are probes of the unsupported forms (ASD-012, 013, 018, 019), kept on purpose. Its `/tmp` hits are bash scratch paths, and the REPL forms for ASD-007 and ASD-017 now use `./tmp/` and `./artifacts/`. Neither rewritten form has a live run yet.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `grep -rln` over the Aside package lists `SKILL.md`, `README.md`, `references/`, the feature catalog and `examples/`. `examples/repl-evidence-capture.sh` defaults its output to `/tmp/aside-evidence`. These consumers stay stale and are open items in spec section 10.
- [x] CHK-FIX-004 [P0] Adversarial cases. N/A: no path, parser or redaction code changed in this packet.
- [x] CHK-FIX-005 [P1] Matrix axes listed. N/A: no matrix.
- [x] CHK-FIX-006 [P1] Hostile environment variant. N/A: no code in this packet reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence pinned. Evidence: each run's `source.md` names base `2ef3895f753`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: T014, 0 matches in six files.
- [x] CHK-031 [P0] Input validation implemented. N/A: this packet adds no input-handling code.
- [x] CHK-032 [P1] Auth/authz. N/A: no auth surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence: each names the same run folders, counts and requirement ids.
- [x] CHK-041 [P1] Code comments adequate. N/A: no code comments changed.
- [x] CHK-042 [P2] README updated. Evidence: Bladebro's `README.md`, and the benchmark report index rows for both runs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files outside the repository. Evidence: run output was written outside the repository, per each `source.md`.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
