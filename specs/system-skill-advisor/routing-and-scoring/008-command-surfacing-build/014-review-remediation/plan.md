---
title: "Implementation Plan: Phase 14: review-remediation"
description: "Fixes the 43 items of review pass one's work groups WG1 to WG13 in two lanes. The safety lane covers the embed engine, the attach path, the renderer and the behaviour runner, and the advisory lane covers checks, workflows, readers and docs. Each fix lands with a test that fails before it, and a coordinator wave reruns every floor."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and ESM JavaScript on Node 26 for the advisor runtime and readers, CommonJS for the doctor scripts, YAML and Markdown for the workflows and docs |
| **Framework** | None. The advisor runtime builds with `tsc` and the doctor scripts run as plain Node |
| **Storage** | Files only: the embed backup folders, the committed command baseline and the readers' session stores, read-only |
| **Testing** | Vitest in the advisor runtime, `node --test` for the doctor scripts and the shared readers |

### Overview
The plan changes 13 file-disjoint work groups taken as the review report groups them. The safety lane WG1 to WG4 runs first as four parallel lanes, each writing its failing test before its fix, and the advisory lane WG5 to WG13 runs next under the same rule. A coordinator wave then rebuilds the advisor, reruns every suite and floor against `scratch/before.txt`, reruns the planning probes and validates the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `scratch/before.txt` holds every floor and suite count from T001, and `scratch/repro-before.txt` holds the probe outputs from T002, matching spec section 2.
- [ ] The coordinator recorded in T003 that no phase 015 task edits a section 3 file while this phase builds.
- [ ] `rg -c '^- \[[ xB]\] T[0-9].*Verify: ' tasks.md` and `rg -c '^- \[[ xB]\] T[0-9]' tasks.md` print the same number.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed, `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` and the reader suite report `fail 0`, and every floor in `scratch/after.txt` equals or beats `scratch/before.txt`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted fixes inside existing modules. No module, layer or dependency is added.

### Key Components
- **`agents-md-embed.cjs`**: owns every write the embed route makes, its backup and its restore. The fixes add a guard around the write loop, a verified restore, a link check in `compose` and the foreign failure.
- **`command-attach.ts`**: the import-free module both the hub attach path and the scorer read. It gains the shared no-edit pattern and loses `COMMAND_POLICIES` through its deriver.
- **`render.ts`**: prints the command label and the child downgrade. Two inputs change: which row fills a `needsMode` head and which row supplies `mutating`.
- **`run-command-behaviour.mjs` and `prepare-behaviour-arena.mjs`**: the live-arm containment. The runner gains an entry guard, an allowlisted child environment and an arena check, and the builder writes the marker the check reads.
- **The doctor checks and workflows, the readers and the docs**: each advisory fix stays inside the file the finding names.

### Data Flow
A prompt reaches the advisor, the scorer ranks skills and command rows, and for a compiled-routing hub `enrichCompiledRoutes()` asks `attachCommand()` for a command, which now returns none on a no-edit prompt, a file name or an untyped deep-loop mention. `renderAdvisorBrief` prints the head the hooks inject. On the install side, `/doctor:agents-md embed` composes in memory, backs up, writes and proves, and any failure after the backup now ends in a verified restore or a printed refusal to restore.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `agents-md-embed.cjs` `commandApply`, `restoreFromBackup`, `compose` | Producer of every embed write and restore | update | T004 to T007 tests in `agents-md-embed.test.cjs`, `probe-embed-write-fault.cjs`, `probe-mirror-link.sh` |
| `doctor-agents-md-embed.yaml`, `doctor-agents-md-presentation.txt` | Read the embed exit codes and render the result | update | T008 `rg` counts and `doctor-agents-md-contract.test.cjs` |
| `doctor-agents-md-restore.yaml`, `agents-md.md` | Drive `restore`, which keeps its own checks | not a consumer of exit 3 | `rg -n "exit 3" .skilled/commands/doctor/assets/doctor-agents-md-restore.yaml` prints nothing before and after |
| `command-attach.ts` `attachCommand`, `typedCommandIn`, `NO_EDIT_REQUEST` | Producer of the attached and typed command | update | T009 to T011 cases in `command-attach-guards.vitest.ts`, `probe-attach.mts` |
| `handlers/advisor-recommend.ts`, `capture-command-routing-baseline.mjs` | Callers of `attachCommand` and `typedCommandForTop` | unchanged code, new behaviour | The slice test and the recapture in T040 and T041, the floors in T057 |
| `scorer/fusion.ts` `readOnlyRouteAllowed`, `commandMeaningEligible` | Second reader of the no-edit wording | update to import | `rg -c "const NO_EDIT_REQUEST" $FU` prints nothing and the scorer suite passes |
| `scorer/text.ts:148` | Third copy of the no-edit wording | unchanged, recorded | The report's section 8 carries it |
| `derive-command-bridges.cjs` `renderCommandRows` | Emitter of `COMMAND_POLICIES` | update | `DERIVE` prints `fresh` and `rg -n COMMAND_POLICIES .skilled` prints nothing |
| `render.ts` `commandLabel`, brief head | Producer of the head label | update | T017 and T018 cases, `probe-render.mjs` |
| `skill-advisor-brief.ts`, the hook adapters, the OpenCode plugin | Consumers of `renderAdvisorBrief` | unchanged | The golden, envelope and plugin tests in `VALL` |
| `run-command-behaviour.mjs` `childEnv`, first-turn guard, `G2_ROWS` | Live-arm containment and the g2 row table | update | T019 to T023 cases in `command-behaviour-guards.vitest.ts` |
| `score-command-transcripts.mjs` `startedLabel` | Reader of the g2 grammar | update to read `G2_ROWS` | `G2SUM` equals its before line |
| `agents-md-check.cjs` A10 and A11 | Reports runtime copies and router rows | update | T024 to T027 cases, this repository's `STATUS=OK` |
| `codex-hook-approval-check.cjs`, `hook-wiring-check.cjs` | Feed `/doctor:setup`, `/doctor:symlink check`, `/doctor:runtime-mirrors` and `command-offer.mjs` | update | T029 to T031 cases, `VO` for `codexHookApproval` |
| `doctor-setup.yaml`, `setup.md`, `doctor-setup-presentation.txt`, `doctor-symlink-check.yaml` | Workflow text the doctor routes follow | update | `doctor-setup-contract.test.cjs` |
| `doctor-runtime-mirrors.yaml` | Promises the absent repair line | unchanged | T030 makes its promise true |
| Capture `rows`, `attachedRows`, `typedRows` and the slice test | Publish and compare per-row outcomes | update | T040 and T041 |
| Shared readers `claude`, `devin`, `dsh`, `pi` | Open session stores for the scorer and `command-offer.mjs` | update | T042 to T047, `VSR`, `SRD --check` |
| `subprocess.ts` `runSpawnAttempt` | Collects the advisor child's output | update | T048 |
| Advisor README, ARCHITECTURE and two catalog pages | Describe the code | update | T050 to T052 `rg` counts |

Required inventories:
- Same-class producers: `rg -n "NO_EDIT_REQUEST|do not \(change" .skilled/skills/system-skill-advisor/runtime/lib` lists `command-attach.ts`, `fusion.ts` and `scorer/text.ts` after T012, and `rg -n "isSymlink\(" .skilled/commands/doctor/scripts/agents-md-embed.cjs` lists the root, router, mirror and CLAUDE.md checks after T007.
- Consumers of changed symbols: `rg -n "COMMAND_POLICIES|restoreFromBackup|attachCommand|childEnv|G2_ROWS|startedLabel|parseTableRows" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'` is run in T060 and every hit is a file this phase lists or a doc that names it correctly.
- Matrix axes: the embed failure matrix is write fault, damaged backup, foreign line and linked path, each on a fixture that writes more than one file. The attach matrix is no-edit wording, `/deep:` typed equal, typed other, typo, depth wording, file name with `.` and `/` and a sentence-ending period. The env matrix is denied secret, allowed runtime key, `AI_SESSION_CHILD` and the git overrides.
- Algorithm invariant: a restore never writes a byte until every recorded entry passed the allowlist and its hash. A typed command matches only when the characters after it cannot continue a path. A live turn starts only where the marker exists and no remote does.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the floors, suite counts and probe outputs into `scratch/` (T001 to T003). Implementation fixes WG1 to WG4 in wave 1, WG5 to WG9 and WG11 to WG13 in wave 2 and WG10 in wave 3, one lane per group (T004 to T055). Wave 4 fixes what the verifiers flagged in ten lanes that run beside WG10 (T062 to T073). Verification rebuilds, reruns every suite, floor and probe and validates the packet (T056 to T061). `tasks.md` owns the order and the checkboxes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | One failing-then-passing case per finding: the embed write fault, restore, link and foreign cases, the attach guards, the renderer heads, the env allowlist, the arena check, the g2 labels, the A10 and A11 cases, the hook checks, the Devin fallback, the DSH pin, the parity tests and the output cap | `node --test` for the doctor scripts and readers, Vitest for the advisor runtime |
| Integration | The command baseline slice, the deriver check, the mirror check, the route check, the bench file and the g2 rescoring | Vitest, the capture and deriver scripts, `score-command-transcripts.mjs --summary` |
| Manual | The six planning probes and one arena built and removed under the system temp folder | `node` and `bash` from the repository root |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013 changes in the embed engine, readers, runner and scorer | Internal | Green | None. Phase 013 is complete and every file reads as this plan describes |
| Phase 015 planning beside this phase | Internal | Yellow | A concurrent edit to a shared file. T003 holds wave 1 until the coordinator records the order |
| `node:sqlite` for the Devin fixture database | Internal | Green | T042 cannot build its corrupt-database case |
| No new package | External | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A floor in `scratch/after.txt` reads lower than `scratch/before.txt`, a suite reports a failure the lane cannot fix inside its files, or the second review pass finds a fix that broke a default path.
- **Procedure**: Revert the lane's files with `git -c core.fsmonitor=false checkout HEAD -- <the lane's files>` before commit, or revert the lane's commit after it. Regenerated outputs revert with their source: rerun the deriver after reverting `derive-command-bridges.cjs`, the capture with `--write` after reverting the capture and `session-reader-declarations.mjs` after reverting a reader.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► Wave 1 safety lanes WG1-WG4 ──► Wave 2 advisory lanes ──► Wave 3 WG10 and Wave 4 follow-ups (T062-T073) ──► Verification (T056-T061)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 013 complete | Every wave, because the before numbers must exist first |
| Wave 1 safety lanes | Setup and the T003 gate | Wave 2, because WG5's README row and WG9's recapture read WG1 and WG2 results |
| Wave 2 advisory lanes | Wave 1 | Wave 3, because the README describes WG4 and WG9, and wave 4, because its follow-ups fix wave 2 work |
| Wave 3 WG10 | Wave 2 | Verification |
| Wave 4 follow-up lanes | Wave 2, and T041 for the slice-test lane | Verification |
| Verification | Every lane | The second review pass |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The scope decisions came from the coordinator under the packet goal's D1 and the autonomous answers are in `spec.md` section 10. WG1 to WG13 are planned exactly as the report groups them, and each group owns its files alone, with the two additions spec section 3 names. `COMMAND_POLICIES` is deleted at its emitter and `TRACKED_COMMANDS` stays the one attach-path table.
<!-- /ANCHOR:decisions -->
