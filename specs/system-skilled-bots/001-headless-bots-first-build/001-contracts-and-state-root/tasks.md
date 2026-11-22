---
title: "Tasks: Phase 1: contracts-and-state-root"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "contracts and state root tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: contracts-and-state-root

<!-- SPECKIT_LEVEL: 3 -->

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-skilled-bots/runtime`. `S` is a temp folder made by `mktemp -d` and exported as `XDG_STATE_HOME` for every test run. `B` is a second temp folder outside the checkout that holds `git status` snapshots. `K` is a temp Skilled tree made by `mktemp -d`, holding a `.skilled/skills/.state/` folder inside a temp git repository whose `.gitignore` carries the line `.skilled/skills/.state/*/*`. Tests pass `K` as the Skilled tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Make the temp folders for the phase: `S` for test state, `B` for git status snapshots and `K` for the temp Skilled tree, all outside the checkout (`mktemp -d`). Verify: `git status --short` prints the same lines before and after the `mktemp -d` calls, and `git -C $K check-ignore -q .skilled/skills/.state/system-skilled-bots/x/runs/r1/f` exits 0.
- [ ] T002 Create the runtime package root with `tsx`, `vitest` and a `test` script, the shape of the deep-loop runtime (`$R/package.json`). Verify: `npm --prefix $R test -- --passWithNoTests` exits 0.
- [ ] T003 Run the existing skill and advisor checks with the near-empty skill folder in place (`.skilled/skills/system-skilled-bots/`). Verify: each check's output and exit status are pasted into `scratch/skill-checks.txt`, and the layout choice in ADR-003 names which checks passed.
- [ ] T004 [P] List the five existing status vocabularies by file and line, starting from the `REASONS` table in `verify-iteration.cjs` (`.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`). Where no repository file defines a vocabulary, record research.md §10 as its source. The delivery states `queued`, `claimed`, `delivered`, `failed` and `unknown` are cited there from a Hermes file outside this repository. Verify: `scratch/vocabularies.md` names one source per vocabulary, and `rg -n` finds each repository enum at its line.
- [ ] T018 [P] Check what a doctor overlay re-pin does to `.skilled/skills/.state/` (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). A code read on 2026-11-22 found that `touchedPaths` (lines 6198 to 6213) copies only paths that are blobs in the new upstream commit under `.skilled` and the runtime folders, and deletes only paths that were blobs in the old commit and are gone from the new one. Gitignored files under `.state` are in neither list, so a re-pin should leave them. A tracked `.state/<subsystem>/README.md` can still be copied. A reinstall that replaces the whole tree, or a `/doctor:symlink` retarget, can lose or hide run folders. This is inferred from reading, not yet run. Verify: a staged re-pin in a temp vendored tree with a file under `.skilled/skills/.state/system-skilled-bots/` keeps the file byte-identical, and the result, the lines read and the reinstall and retarget cases are written to `scratch/overlay-repin-state.md`.
- [ ] T023 [P] Check whether the doctor install and symlink flows add `.skilled/skills/.state/` to a consumer repository's `.gitignore` (`.skilled/commands/doctor/`). A test fixture writes that line (`scripts/tests/overlay-engine-strict-writes.test.cjs:94`), which suggests it is expected, but no install step that adds it has been read. Verify: `scratch/overlay-repin-state.md` names the file and line that adds it, or says no flow adds it. Either way REQ-014's refusal stays the guard.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Write the user-level state-root resolver: `${XDG_STATE_HOME:-$HOME/.local/state}/<tool>/`, the config override, owner-only folders and the named subfolders `requests/` (with `inbox/`, `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/`), `leases/`, `switches/`, `needs-you/`, `records/`, `installs/`, `index/` and `registered-roots`, under the folder name `system-skilled-bots` (`$R/lib/state-root.ts`). Verify: `npm --prefix $R test -- state-root` exits 0 with `XDG_STATE_HOME=$S`, and every user-level path it prints starts with `$S`.
- [ ] T006 Write hub identity over `currentRepository`, with the config identity field first, a refusal with reason `identity-unknown` when nothing answers, and one exported guard that install and enqueue call (`$R/lib/identity.ts`). Verify: `npm --prefix $R test -- identity` exits 0. The case with two temp repositories with no remote asserts a refusal for both and no shared folder. The case with two temp clones of one origin asserts one identity folder and both paths in `registered-roots`.
- [ ] T007 Write the `bots/config.json` reader: `allowedExecutorKinds`, `stateRoot`, `defaultIsolation`, `identity`, `gitHookTrigger`, `needsYou` and `retention`, with defaults when the file is missing (`$R/lib/repo-config.ts`). Verify: `npm --prefix $R test -- repo-config` exits 0, covering a missing file, a full file, an unknown key, `gitHookTrigger` absent reading as `false`, a non-boolean `gitHookTrigger` rejected by name, an `identity` that is not `owner/name` rejected with `identity-invalid`, and `"identity": "local/tool"` in a repository with no remote accepted.
- [ ] T008 Write the `BOT.md` parser and predicates: required `id`, `trigger` with a `kind` of `cron`, `queue`, `git-hook` or `manual` and that kind's fields, and a non-empty body. Defaulted `runtime`, `budget`, `enabled` and delivery. Delivery fields are the success target list, the failure override and the local-only value. Declared posture is isolation, sandbox class and secrets policy, with the isolation resolver of ADR-007 (`$R/lib/definition.ts`). Verify: `npm --prefix $R test -- definition` exits 0, with the three research.md §5 shapes parsing, `missing-id`, `missing-trigger` and `empty-body` each asserted by name, and a definition with no `isolation` and no config default resolving to `isolation-undeclared`.
- [ ] T009 Write the run record: identity, request join, dispatch snapshot, budget, honored posture, exit with raw reason and class, evidence locations including the worktree path, branch and absolute run folder path, and one delivery entry per target, written by temp file and rename to `<state root>/<identity key>/records/<run id>.json` (`$R/lib/run-record.ts`). Verify: `npm --prefix $R test -- run-record` exits 0, the round trip asserts every field group, an unknown cost reads back as `null`, the record path starts with `$S`, and a record whose run folder was deleted reads back whole with the folder reported missing.
- [ ] T010 [P] Write fixtures: the three worked shapes, one clean definition and one defect per rejection case (`$R/tests/fixtures/`). Verify: `ls $R/tests/fixtures | wc -l` prints at least 6.
- [ ] T011 [P] Write the `BOT.md` template with every field, its default and one comment line per field (`.skilled/skills/system-skilled-bots/assets/bot-template.md`). Verify: the definition test parses the template with its placeholder id filled and passes.
- [ ] T019 Write the in-tree run root: `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`, from an explicit Skilled tree input that is the registered checkout's, never a worktree. Ask git whether the path is ignored before creating it, and refuse with `run-folder-not-ignored` when it is not. Create it with mode `0700` (`$R/lib/state-root.ts`). Verify: `npm --prefix $R test -- state-root` exits 0. With `K` the run folder path starts with `$K`. With a temp tree whose `.gitignore` lacks the line, the result is the refusal and no folder exists. A guard test fails when the resolved run root sits under the real checkout.
- [ ] T020 Write the needs-you item: `id` (the parked run's id), `runId`, `botId`, `identity`, `question`, `options`, `createdAt`, `expiresAt`, `evidence`, `answer` and `resumeRequestId`, written by temp file and rename to `<state root>/<identity key>/needs-you/<item id>.json`, with a derived state and no stored state field. Add `awaiting-decision` with class `operator` and `needsYouItemId` to the record's exit (`$R/lib/needs-you.ts`, `$R/lib/run-record.ts`). Verify: `npm --prefix $R test -- needs-you` exits 0. The round trip reads back equal. An unanswered item before expiry reads open, after expiry reads expired, and with an answer reads answered. A record with exit `awaiting-decision` and no item id is rejected by name. A test pins the mapping of `awaiting-decision` to `blockedStop` in `lifecycle-taxonomy.cjs`.
- [ ] T021 [P] Add the retention keys `retention.indexRowsPerIdentity`, `retention.runFoldersPerBot`, `retention.skippedSlotsPerSummary` and `retention.closedNeedsYouPerIdentity` with the defaults 1000, 200, 100 and 200, and `needsYou.expiryDays` with the default 7 (operator D10) (`$R/lib/repo-config.ts`). Verify: `npm --prefix $R test -- repo-config` exits 0, with a missing file reading 1000, 200, 100, 200 and 7, a full file reading its values, and `0`, `-1`, `1.5` and `"200"` each rejected by name.
- [ ] T022 Prove the identity guard refuses for install and enqueue callers (`$R/lib/identity.ts`). Verify: `npm --prefix $R test -- identity` exits 0, and a temp repository with no remote and no `identity` field gets the refusal `identity-unknown` from the guard, while the same repository with `"identity": "acme/tool"` gets `acme/tool`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T012 Save `git status --short` to `$B/status-before-suite.txt` and `ls -A ~/Library/LaunchAgents` to `$B/launchagents-before-suite.txt`, then run the whole suite with state redirected (`$R`). Verify: `XDG_STATE_HOME=$S npm --prefix $R test` exits 0 and prints no failed test.
- [ ] T013 Prove no test wrote into the checkout (`git status --short`, `.skilled/skills/.state/`). Gitignored writes never show in `git status`, so this also lists the real run root. Verify: `diff $B/status-before-suite.txt <(git status --short)` prints nothing, with no filter, and `ls -d .skilled/skills/.state/system-skilled-bots` fails with no such file both before and after the suite.
- [ ] T014 Prove no sixth vocabulary and no scheduler call (`$R/lib/`). Verify: `rg -n 'launchctl|LaunchAgents' $R` prints nothing, and every status string in `run-record.ts` appears in a file listed in `scratch/vocabularies.md`, except the one value `awaiting-decision`, which ADR-010 names. `needs-you.ts` stores no state string.
- [ ] T015 Rerun the skill and advisor checks from T003 with the finished folder (`.skilled/skills/system-skilled-bots/`). Verify: each check exits with the same status it had in T003.
- [ ] T016 Confirm the operator answered Q3 and Q5 in the parent record (`../decision-record.md`). Verify: parent ADR-002 (Q3) and ADR-003 (Q5) each show a status other than `Proposed`, and the parent Operator Decisions table holds one row for each.
- [ ] T017 Prove the scheduling invariant holds for this phase (`$R`, `~/Library/LaunchAgents`). Verify: `rg -n 'launchctl bootstrap|LaunchAgents|\.plist' $R` prints nothing, and `diff $B/launchagents-before-suite.txt <(ls -A ~/Library/LaunchAgents)` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `XDG_STATE_HOME=$S npm --prefix $R test` exits 0 and every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A task blocked on an operator answer is marked `[B]` with the ADR it waits on, and the phase cannot close while it stays blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Requirements documented in spec.md. `rg -c '^\| REQ-' spec.md` prints 17.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. `rg -n '^## 3' plan.md` prints one line.
- [ ] CHK-003 [P1] Dependencies identified and available. `ls .skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts` prints both paths.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] Code passes lint/format checks. The runtime typecheck exits 0.
- [ ] CHK-011 [P0] No console errors or warnings in `npm --prefix $R test` output.
- [ ] CHK-012 [P1] Error handling implemented. Every rejection returns a named reason, and no parser throws on bad input.
- [ ] CHK-013 [P1] Code follows project patterns. sk-code's TypeScript standards apply, and no code comment carries a packet, phase or requirement id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] All acceptance criteria met. Each row in `acceptance-criteria.md` names observed evidence.
- [ ] CHK-021 [P0] Manual testing complete. The template was read against the three worked shapes.
- [ ] CHK-022 [P1] Edge cases tested: empty body, missing config, unknown frontmatter key, no remote, two clones, missing isolation, run root not ignored, vanished run folder, expired needs-you item.
- [ ] CHK-023 [P1] Error scenarios validated: an unreadable config is reported as unreadable, not as missing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

N/A. This phase builds new contracts and fixes no reported finding. The items stay unticked and do not block close.

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No hardcoded secrets. `rg -n 'token|secret|password' $R/lib` prints only field names.
- [ ] CHK-031 [P0] Input validation implemented. Unknown frontmatter keys and unknown config keys are rejected by name.
- [ ] CHK-032 [P1] State folders are owner-only. A test asserts mode `0700` on the created state root and on a created run folder.
- [ ] CHK-033 [P0] Nothing a run must not write resolves under the run root. A test lists every path function and asserts that only the run folder path sits under the Skilled tree.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. `spec.md`, `plan.md` and `tasks.md` name the same six library files.
- [ ] CHK-041 [P1] Code comments adequate. Each module header states the WHY of the contract it owns.
- [ ] CHK-042 [P2] README updated (if applicable). The skill README is phase 8's, so this stays N/A here.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Temp files in scratch/ only. Test state lives under `$S`, never in the checkout.
- [ ] CHK-051 [P1] scratch/ cleaned before completion, keeping only the evidence files named by T003, T004, T018 and T023.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 20 | 0/20 |
| P2 Items | 9 | 0/9 |

Counts exclude the N/A fix addendum. They include the L3+ sections below, N/A rows among them.

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per ADR, or delete the section when the packet records no ADR. GOOD: CHK-100 [P0] ADR-001 is followed by T002. WEAK: Architecture is verified. -->

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md`, indexed in `plan.md`'s ARCHITECTURE DECISION RECORD section. `rg -c '^## ADR-' decision-record.md` prints 11.
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted). ADR-001, ADR-002 and ADR-011 read Accepted with "We chose". The rest read Proposed with "We propose".
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale. Each ADR holds an Alternatives Considered table with at least two rows.
- [ ] CHK-103 [P2] Migration path documented (if applicable). N/A: no state exists yet, so no data moves. ADR-001 names the rollback.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per performance claim, or delete the section when the packet makes none. GOOD: CHK-110 [P1] `--keep 3` adds under 5 ms to a run. WEAK: Performance is verified. -->

N/A. NFR-P01 and NFR-P02 are N/A: these are libraries called once per run and no service runs. The items stay unticked and do not block close.

- [ ] CHK-110 [P1] Response time targets met (NFR-P01). N/A.
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02). N/A.
- [ ] CHK-112 [P2] Load testing completed. N/A.
- [ ] CHK-113 [P2] Performance benchmarks documented. N/A.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per deployment step, or delete the section when the packet ships no service. GOOD: CHK-120 [P0] The rollback command was run in a copy. WEAK: Ready to deploy. -->

This phase ships libraries and no service. Nothing is deployed or scheduled.

- [ ] CHK-120 [P0] Rollback procedure documented and tested. `plan.md` §7 names the revert, and every file is new under `.skilled/skills/system-skilled-bots/`.
- [ ] CHK-121 [P1] No plist, `launchctl` call or write into `~/Library/LaunchAgents` (T017).
- [ ] CHK-123 [P1] Runbook created. N/A: no service runs. Phase 8 owns the operator docs.
- [ ] CHK-124 [P2] Deployment runbook reviewed. N/A, same reason.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per compliance surface, or delete the section when none applies. GOOD: CHK-130 [P1] No license changed. WEAK: Compliance is verified. -->

- [ ] CHK-130 [P1] Security review completed. NFR-S01 to NFR-S03 each have a test, and no library logs a command line or an environment value.
- [ ] CHK-131 [P1] Dependency licenses compatible. `tsx` and `vitest` are the deep-loop runtime's existing dependencies, so no new license enters.
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed. N/A: no network surface.
- [ ] CHK-133 [P2] Data handling compliant with requirements. Needs-you question text stays in the user-level item file and is never copied into the run folder.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Write one check per document pair that must agree, or delete the section when the packet holds no paired documents. GOOD: CHK-140 [P1] `plan.md` and `tasks.md` agree on the three phases. WEAK: Docs are verified. -->

- [ ] CHK-140 [P1] All spec documents synchronized. `spec.md`'s contracts table, `plan.md`'s data flow and ADR-008 name the same two roots and the same subfolders.
- [ ] CHK-141 [P1] API documentation complete (if applicable). Each library exports typed functions with a header comment that states the contract's WHY.
- [ ] CHK-142 [P2] User-facing documentation updated. N/A: the skill README is phase 8's.
- [ ] CHK-143 [P2] Knowledge transfer documented. `implementation-summary.md` names each contract and the phase that reads it.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off
<!-- FILL: L3+ means Level 3 and above, so this section stays at Level 3. Name the real approver. Add a row only for a second approver who signs. Write `N/A` or delete the section when no sign-off applies. GOOD: Operator, merges the commit. WEAK: Signed off. -->

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owns the Q2, Q3, Q5 and Q8 decisions and merges the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
