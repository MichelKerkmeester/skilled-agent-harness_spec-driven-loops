---
title: "Tasks: Phase 18: triage-gen4-p2-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "triage gen4 p2 findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: triage-gen4-p2-findings

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

`H` is `.skilled/skills/mcp-browser-use`. `L` is `.skilled/bin/lib/compiled-routing`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List the P2 findings from the merged registry. Verify: the count. Evidence: `total 31 p2 24`.
- [x] T002 Check each against the current source. Verify: a verdict row per finding in `implementation-summary.md`. Evidence: 20 held, 4 refuted.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] README release table and entry shape (`$H/README.md`). Verify: every file in `changelog/` has a row. Evidence: six releases listed plus 1.1.5.0.
- [x] T004 [P] Core Web Vitals, projection and `reject` wording (`$H/ROUTER.md`). Verify: the advisor ranks sk-code first and the hub second on a Core Web Vitals prompt. Evidence: `sk-code 0.9376, mcp-browser-use 0.8669`.
- [x] T005 [P] Refuse `ASIDE_CLI_BASE_URL` (`$H/mcp-aside-devtools/scripts/install.sh`, `INSTALL-GUIDE.md`, install catalog entry). Verify: run with it set. Evidence: exit 1 before any download.
- [x] T006 [P] Segment-only `..` guard (`$H/mcp-aside-devtools/examples/repl-evidence-capture.sh`). Verify: five folder names against a stub `aside`. Evidence: `./tmp/a..b` passes the guard; `./tmp/../etc`, `./tmp/..`, `./tmp/x/../../y` refused.
- [x] T007 [P] Download, read, run nvm (`$H/mcp-chrome-devtools/references/troubleshooting.md`). Verify: no pipe into bash in the block. Evidence: re-read.
- [x] T008 Resolver `--hub` check, engine override root, derived `selectionKinds` (`$L/014-runtime-engine/lib/resolve.cjs`, `compiled-route.cjs`, `$L/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`, archive copies). Verify: `resolve.cjs --prompt x` exits 2; sync check. Evidence: usage, exit 2; "all 61 served copies match".
- [x] T009 Epic docs (`../goal.md`, `../spec.md`, 001, 002, 006, 012 continuity, `../006-verification/goal.md`). Verify: validate. Evidence: recorded in `implementation-summary.md`.
- [x] T010 Release 1.1.5.0 (`$H/*.json`, `$H/SKILL.md`, `$H/changelog/v1.1.5.0.md`), re-mint, regenerate intent signals. Verify: guard and generator. Evidence: 8 fresh; RESULT: PASSED.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Hub canary and the replay. Verify: canary exit 0; replay fails only MBU-PB-04. Evidence: recorded in `implementation-summary.md`.
- [x] T012 Bin suite. Verify: no failure. Evidence: 197 of 197.
- [x] T013 Hub checks. Verify: `parent-skill-check` OK and four playbooks exit 0. Evidence: OK, 0 warnings; `exit=0` four times.
- [x] T014 Validate the epic. Verify: `validate.sh --strict --recursive` prints RESULT: PASSED. Evidence: recorded in `implementation-summary.md`.
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
- **Review**: See `../review/deep-review-findings-registry.json`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: sections 1 to 4.
- [x] CHK-003 [P1] Dependencies identified. Evidence: P2 #15 handed to the advisor packet.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` on both scripts and `node -c` on both engine files. Evidence: each exit 0.
- [x] CHK-011 [P0] No debug code left. Evidence: the quality gate reports no blocker.
- [x] CHK-012 [P1] Comments carry the why. Evidence: the wrapper and engine comments name the reason, no finding ids.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` reads Closeable Yes.
- [x] CHK-021 [P0] Manual testing complete. Evidence: wrapper, guard and resolver runs.
- [x] CHK-022 [P1] Edge cases tested. Evidence: `./tmp/a..b` and `./tmp/x/../../y`.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: resolver without `--hub` exits 2.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each held finding has a class. Evidence: the verdict table.
- [x] CHK-FIX-002 [P0] Same-class inventory done. Evidence: the three README release findings closed by one table fix; the completion fields grepped across every phase.
- [x] CHK-FIX-003 [P0] Consumer inventory done. Evidence: archive copies synced; manifest re-minted.
- [x] CHK-FIX-004 [P1] Path guard tested with joined and nested inputs. Evidence: five folder names.
- [x] CHK-FIX-005 [P1] Evidence is pinned to the phase commit named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: none added.
- [x] CHK-031 [P0] Input handling. Evidence: the wrapper refuses a changed download source; the guard refuses every `..` segment.
- [x] CHK-032 [P1] Auth and authz: N/A. No change touches sign-in or permissions.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree. Evidence: REQ-001 to REQ-005.
- [x] CHK-041 [P1] The hub docs state what ships. Evidence: README, `ROUTER.md`, install guide.
- [x] CHK-042 [P2] Changelog written. Evidence: `changelog/v1.1.5.0.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only. Evidence: the stub `aside` lived in the session scratchpad and was removed.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the canary build folders were removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->
