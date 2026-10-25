---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Variables used below: `S` = `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, `P` = `specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [ ] T001 Read the arg-parse loop, `output_text()`, `output_json()`, `show_help()` and the output dispatch in `$S`. Verify: `rg -n 'Recommended Level|output_text|output_json|show_help|JSON_OUTPUT' $S` prints each site.
- [ ] T002 Capture baseline output for the verification-matrix invocations into `$P/scratch/baseline/` (default run, `--json`, `--no-recommend-phases`, `--help`, and each error case). Verify: `ls $P/scratch/baseline/` lists one file per invocation.
- [ ] T003 [P] Inventory same-class producers and consumers of the level line. Verify: `rg -n 'Recommended Level' . --glob '*.sh'` prints only sites inside `$S`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [ ] T004 Add `QUIET=false` to the globals and a `--quiet|-q)` case to the parse loop in `$S`. Verify: `bash $S --quiet --loc 50 --files 2 >/dev/null && echo OK` prints `OK`; `bash $S -q --loc 50 --files 2 >/dev/null` also exits 0.
- [ ] T005 Add the quiet branch to the output dispatch in `$S` so it prints the same `Recommended Level: <N> (<Name>)` line `output_text()` uses — one shared format site, not a second literal. Verify: `bash $S --quiet --loc 1000 --files 20 --architectural --api --db` prints exactly `Recommended Level: 3 (Full)` and `| wc -l` prints `1`.
- [ ] T006 Document `--quiet, -q` in the header OPTIONS comment and in `show_help()` in `$S`. Verify: `bash $S --help | grep -n 'quiet'` prints at least 2 lines.
- [ ] T007 [P] Confirm no error path bypasses `--quiet`: validation still runs before output selection. Verify: `bash $S --quiet` exits 1 with the missing-input error on stderr and empty stdout.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [ ] T008 Run the full flag matrix: `--quiet`, `-q`, `--quiet --json`, `--quiet` + phase flags, and each error case under `--quiet`. Verify: line counts, the `Recommended Level:` line and exit codes match `spec.md` §5 scenarios.
- [ ] T009 Byte-diff the post-change default and `--json` outputs against `$P/scratch/baseline/`. Verify: `diff` prints nothing for every non-quiet invocation.
- [ ] T010 Sync the packet docs with what was built and run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict`. Verify: the run prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed — quiet run prints one line, default run diffs clean, strict validation `RESULT: PASSED`
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
<!-- FILL: Fill each checklist section below. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Blocked-task rule for this packet: a `[B]` task blocks closure until it is retried or its blocker is recorded next to the task with the failing command output.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001–REQ-009 all name an observable output or command)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (parse case, dispatch branch, help text)
- [ ] CHK-003 [P1] Baseline captured: `ls $P/scratch/baseline/` lists one file per matrix invocation
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `bash -n $S` exits 0 after the edit
- [ ] CHK-011 [P0] Success paths emit nothing on stderr: `bash $S --quiet --loc 50 --files 2 2>&1 >/dev/null` prints nothing
- [ ] CHK-012 [P1] Error paths unchanged: missing args, non-numeric values and unknown options exit 1 with the same stderr text (REQ-006)
- [ ] CHK-013 [P1] The quiet line reuses the report's `Recommended Level:` format — `rg -n 'Recommended Level' $S` shows the quiet branch shares the format site rather than duplicating a literal
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] Every acceptance-criteria row verified with its named command (AC-001–AC-009)
- [ ] CHK-021 [P0] Manual matrix run complete: `--quiet`, `-q`, `--quiet --json`, quiet + phase flags (T008)
- [ ] CHK-022 [P1] Edge cases tested: empty input, extreme `--loc`/`--files`, flag in different argument positions
- [ ] CHK-023 [P1] Error scenarios validated: missing args, non-numeric value, unknown flag — exit 1, stderr only
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Write one check per finding class this packet can produce. Delete the rows that do not apply. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Same-class producer inventory complete: `rg -n 'Recommended Level' $S` confirms one format site that the quiet branch shares
- [ ] CHK-FIX-002 [P0] Consumer inventory complete: `rg -ln 'recommend-level' . --glob '*.sh' --glob '*.ts' --glob '*.cjs'` shows no production code callers whose parsing could break
- [ ] CHK-FIX-003 [P0] Contract preservation proven: byte-diff of default and `--json` output against baseline is empty (T009)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No hardcoded secrets introduced — the diff adds a boolean flag only
- [ ] CHK-031 [P0] `--quiet` takes no value, so no new input-validation surface exists; existing numeric checks still run first
- [ ] CHK-032 [P1] N/A — the script performs no auth/authz; nothing to verify
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` describe the same flag semantics (text path only; `--json` unchanged)
- [ ] CHK-041 [P1] Any comment added to `$S` states the durable why only — no REQ/CHK/task ids or spec paths in code comments
- [ ] CHK-042 [P2] Help surface updated: `bash $S --help | grep -n 'quiet'` prints the new option (REQ-007)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Baseline captures and any scratch outputs live only under `$P/scratch/`
- [ ] CHK-051 [P1] `scratch/` cleaned of throwaway output before completion is claimed (baseline evidence may be kept or removed deliberately)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 20 | 0/20 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification
<!-- FILL: Write one check per ADR, or delete the section when the packet records no ADR. GOOD: CHK-100 [P0] ADR-001 is followed by T002. WEAK: Architecture is verified. -->

- [ ] CHK-100 [P0] The quiet-scope decision (text path only, JSON unchanged) is recorded in `plan.md` ADR-001 and followed by T005
- [ ] CHK-101 [P1] ADR-001 carries a status (Proposed)
- [ ] CHK-102 [P1] ADR-001 documents the rejected alternatives (bare-value output, env var) with rationale
- [ ] CHK-103 [P2] N/A — additive flag, no migration path exists
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification
<!-- FILL: Write one check per performance claim, or delete the section when the packet makes none. GOOD: CHK-110 [P1] The flag adds under 5 ms. WEAK: Performance is verified. -->

- [ ] CHK-110 [P1] `--quiet` adds no measurable time: the same scoring path runs and only the output branch differs (NFR-P01)
- [ ] CHK-111 [P1] N/A — the packet sets no throughput target (single-shot CLI)
- [ ] CHK-112 [P2] N/A — no load test applies to a one-shot script
- [ ] CHK-113 [P2] N/A — no benchmark to document
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness
<!-- FILL: Write one check per deployment step, or delete the section when the packet ships no service. GOOD: CHK-120 [P0] The rollback command was run in a copy. WEAK: Ready to deploy. -->

- [ ] CHK-120 [P0] Rollback procedure documented (plan.md §7) and its proof step — revert the single-file diff, re-run T008 — is executable
- [ ] CHK-121 [P0] The `--quiet` flag is itself the toggle: additive, opt-in, default path untouched
- [ ] CHK-122 [P1] N/A — no monitoring/alerting applies to a standalone CLI script
- [ ] CHK-123 [P1] N/A — no runbook needed beyond `--help`
- [ ] CHK-124 [P2] N/A — no deployment runbook exists to review
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification
<!-- FILL: Write one check per compliance surface, or delete the section when none applies. GOOD: CHK-130 [P1] No license changed. WEAK: Compliance is verified. -->

- [ ] CHK-130 [P1] Security review complete: no new input surface, no new file access, no new commands (CHK-030/CHK-031)
- [ ] CHK-131 [P1] No dependency added, so no license compatibility question exists
- [ ] CHK-132 [P2] N/A — OWASP Top 10 does not apply to a local argument flag
- [ ] CHK-133 [P2] N/A — the script handles no user data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification
<!-- FILL: Write one check per document pair that must agree, or delete the section when the packet holds no paired documents. GOOD: CHK-140 [P1] `plan.md` and `tasks.md` agree on the three phases. WEAK: Docs are verified. -->

- [ ] CHK-140 [P1] All spec documents synchronized: spec.md REQs ↔ acceptance-criteria.md rows ↔ tasks.md checks cover the same nine requirements
- [ ] CHK-141 [P1] N/A — no API documentation exists for a shell flag
- [ ] CHK-142 [P2] User-facing documentation updated: `show_help()` and the header OPTIONS comment list `--quiet, -q`
- [ ] CHK-143 [P2] Knowledge transfer: this packet's spec/plan/tasks are the record; no separate handoff needed
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off
<!-- FILL: Name the real approver for each role. Delete a row when the role does not exist. Write `N/A` or delete the section when no sign-off applies. GOOD: Conductor, runs every task. Operator, merges the commit. WEAK: Signed off. -->

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Implementer | Self-verification via this checklist and the T008–T010 commands | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `recommend-level.sh` before editing (READ FIRST — understand the parse loop and output dispatch)
- [ ] Confirm the task is inside this packet's scope (one file, additive flag only)
- [ ] Re-run the baseline command when a Verify line names it, and compare against `scratch/baseline/`

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in order; T004 lands before T005 and T006; T008–T010 run only after implementation |
| TASK-SCOPE | Only `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` may be modified; packet docs live under `specs/zz-bench-authoring/001-recommend-level-quiet-flag/` |
| CONTRACT | Without `--quiet`, stdout is byte-identical; with `--quiet`, stdout is exactly one line and errors stay on stderr |

### Status Reporting Format
After each task: `Task T### complete. Files modified: [list]. Verify: [command output]`

### Blocked Task Protocol
If blocked: stop, mark the task `[B]`, record the blocker and the failing command output beside it, and escalate — do not widen scope to work around it.
