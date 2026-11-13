---
title: "Implementation Plan: Phase 11: typed-command-delivery-and-guards"
description: "Generate one table of every tracked command with its policy and owner, attach a typed command to the top recommendation when the top is its row or its owner, put the owner first for a typed command with no scorer row, measure it as a typed block in the command capture and add three small guards."
trigger_phrases:
  - "typed command delivery plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: typed-command-delivery-and-guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the advisor runtime, Node ES modules for the capture and the cost script, CommonJS for the deriver and the mirror script, YAML and Markdown for the doctor asset and the guides |
| **Framework** | The system-skill-advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`), the spec-kit runtime mirror tools and the doctor commands |
| **Storage** | None. The capture writes its committed JSON baseline, and the status reads the existing diagnostics file under the system temp folder |
| **Testing** | Vitest in `ADV`, `node --test` for the mirror script and the doctor assets, the Python advisor test, the capture scripts and the Claude prompt hook in a sandbox |

### Overview
The deriver emits a `TRACKED_COMMANDS` table that gives every tracked runnable its policy, its owner skill and whether the TypeScript scorer has a row for it. Two helpers read it: one finds the typed command in a prompt and one says whether the top recommendation may carry it. The recommend handler uses them to attach a typed command to its owner on top, the scorer uses them to put the owner first when the command has no row of its own and the capture uses them to report the typed block. The guards are independent: a count and a collapse check in the mirror script, hook health in the status output, a head length test and a cost script.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The cause of each of the seven rows is read in code and recorded in `spec.md`.
- [x] Each research claim is checked in code and its verdict is in `spec.md`.
- [x] Every design question has an autonomous answer under the goal's D1, recorded in `spec.md` section 10.
- [x] The coordinator confirms phases 005, 008 and 010 are committed. No wave 1 task starts before it. Phase 008's code landed in `c909693acb` at 04:08 and the first wave 1 log is from 04:09.
- [x] The before numbers are recorded (T001, T002).

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`.
- [x] The baseline reads `attachedMetrics.typed.combined` 44 of 44 and every floor holds against `scratch/before.txt`.
- [x] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One generated table, read in three places. The deriver owns which commands exist and their policy and owner. The helpers own how a prompt names one. The handler, the scorer step and the capture only ask the helpers, so the number the capture reports is the decision the handler makes.

### Key Components
- **`TRACKED_COMMANDS`** (generated in `ADV/lib/command-attach.ts`): runnable string to `{ policy, ownerSkillId, scorerRow }`, for every bridge entry whether its bridge is active or not.
- **`typedCommandIn(prompt)`**: the longest key typed as its own token, with no word character, colon or hyphen on either side.
- **`typedCommandForTop(topSkillId, prompt)`**: that key's row when the top is its owner or the command row of the same command, else nothing.
- **`rankTypedCommandOwnerFirst`** (`ADV/lib/scorer/fusion.ts`): when the typed command has `scorerRow` false and its owner passes below rank 1, the owner moves to rank 1. It runs after the doctor helper handoff.
- **`attachTypedCommand`** (`ADV/handlers/advisor-recommend.ts`): sets `command`, `policy` and `ownerSkillId` on the top recommendation from `typedCommandForTop`, after the compiled route enrichment, on both return paths.
- **Capture typed block** (`capture-command-routing-baseline.mjs`): `own` is a top-1 hit, `attached` is a delivered command that matches the row with a policy and `typedRows` records each row's top, carrier, command and policy.
- **Guards**: `commandVisibility` and a `COLLAPSE` drift line in `sync-runtime-mirrors.cjs`, `hookHealth` in `advisor_status`, a line under the setup leg, an install step, `command-head-length.vitest.ts` and `measure-brief-cost.mjs`.

### Data Flow
A prompt reaches the recommend handler. The scorer ranks, and when the prompt types a command with no scorer row it puts the owner first. The handler builds the public recommendations and the compiled route may attach a hub command. Then the typed step overrides the top's command with the typed one when the top is its row or its owner. The hook renders the top as `<owner> → <command> (<policy>)`.

### Top Recommendation After This Phase

```json
{"skillId":"system-spec-kit","kind":"skill","command":"/speckit:resume","policy":"start","ownerSkillId":"system-spec-kit"}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Generated block in `command-attach.ts` | Rows and policies for active bridges only | Add `TRACKED_COMMANDS` for every entry | T003 |
| Scorer ordering | Doctor typed ordering only | Owner first for a typed command with no scorer row | T012, T017 |
| Recommend handler | Compiled route attach for seven hubs | Typed step on the top, policy from the new table | T013, T016, T020 |
| Command capture and baseline | Plain attached block | Typed block and per-row list | T015, T017 |
| `sync-runtime-mirrors.cjs --check` | Link drift only | Visibility line and collapse guard | T004 |
| `advisor_status` | Freshness, staleness, lane health | `hookHealth` | T005, T009, T023 |
| `/doctor:setup` advisor leg | PASS, DEGRADED, FAIL or SKIP | Shows hook health, status unchanged | T010 |
| `INSTALL-SKILLED.md` check section | Runs `/doctor:setup` | One command that prints a recommendation | T007 |
| `AGENTS.md`, `.skilled/commands/create/` | Frozen by phase 006 and decision Q025 | Unchanged | T024 |

Matrix axes for the typed rule: top is the command row, the owner or another skill. The command has a scorer row or not. The owner passes or not. The literal is whole, partial or inside a path. Every axis has one test case in T008, T012 or T013.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records every pinned floor and the per-row typed state in `scratch/` before any change. Implementation runs the waves in `tasks.md`: the generated table and the independent guards first, then the helpers and the status field, then the ordering step, the handler step and the head test, then the capture's typed block and the attached policy, then the rebuild and recapture and the hook check. Verification reruns every floor, checks the live status field, checks the boundaries and writes the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The two helpers, the ordering step, the typed handler step, the head length over every tracked command, the visibility count, the status field | Vitest in `ADV`, `node --test` |
| Integration | The command capture and its slice test, the scorer eval, the Python test, the parity test, the deriver check, the doctor contract tests | The capture scripts, `jq`, Vitest, `python3` |
| Manual | The Claude prompt hook on the 44 typed rows and the cost script, each in a sandboxed socket directory | `scratch/typed-heads.mjs`, `measure-brief-cost.mjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005's recommendation fields and head policy | Internal | Open: being built | The typed step has no field to set, so no wave 1 task starts |
| Phase 008's edits to `advisor-status.ts`, `doctor-setup.yaml` and `INSTALL-SKILLED.md` | Internal | Open: planned | T005, T007, T009 and T010 would collide |
| Phase 010's edit to the routing-accuracy README | Internal | Open: being built | T018 would collide |
| A fresh build in `ADV` | Internal | Green once T017 runs | The capture refuses a stale build |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor drops below its before value, the slice test fails after the recapture or the deriver check is not `fresh`.
- **Procedure**: revert this phase's commits, run `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` to regenerate the block, rebuild in `ADV` and confirm the slice test passes against the restored baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 005, 008 and 010 committed | Implementation |
| Implementation | The before numbers in `scratch/` | Verification |
| Verification | All implementation tasks | Phase 007's after arm reading typed rows |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The autonomous answers for this phase, each the recommended option under the goal's D1, are in `spec.md` section 10. Two research claims were refuted in code and change the plan: the mirror check prints no visibility count today, so the count is new output, and no 140-byte head guard exists, so the head test uses the renderer's own 320-byte cap.
<!-- /ANCHOR:decisions -->
