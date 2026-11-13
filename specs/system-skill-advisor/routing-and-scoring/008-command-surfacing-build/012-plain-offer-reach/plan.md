---
title: "Implementation Plan: Phase 12: plain-offer-reach"
description: "Five waves in a fixed order: name the matched doctor command in the hand-off, add task-shaped sk-doc aliases, label a hub that needs a mode, pair each deep mode with a scorer anchor and a hub alias and, only when that wave leaves the floors unchanged, anchor three create rows. Every wave ends with a recapture and a floor check."
trigger_phrases:
  - "plain offer reach plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: plain-offer-reach

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the advisor runtime and the hook fallback, JSON for the hub routers, the doctor slice and the baseline, Node ES modules for the capture scripts and CommonJS for the compiled-route tools |
| **Framework** | The system-skill-advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`) and the compiled routing front door under `.skilled/bin/` |
| **Storage** | None. The capture writes its committed JSON baseline and the manifest refresh writes two activation manifests per hub |
| **Testing** | Vitest in `ADV`, `node --test` for the compiled-route tools, the Python advisor test, the command capture, the scorer eval and the parent skill check |

### Overview
The doctor hand-off keeps its firing rules and changes what it inserts: the command the helper's ranker put first when its policy is `run`, and the helper otherwise. Two hubs gain multi-word aliases, refreshed so they keep serving their compiled route. The scorer gains one phrase per deep mode, and three more for the create rows only when the deep wave moves no floor. A hub that withholds its command gets a `needsMode` flag that the brief prints as `(needs a mode)`. Each wave is proven by a recapture of the command baseline and a floor check before the next wave starts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each family's cause is read in code and recorded in `spec.md` section 2.
- [x] Each research claim is checked in code and its verdict is in `spec.md`.
- [x] Each wave's effect is simulated on a copy of the built runtime, with the diffs in `scratch/planning/`.
- [x] The coordinator confirms phase 011 is committed. No wave 1 task starts before it. Phase 011 landed in `99b68d8b3d` and `scratch/before.txt` ran on it.
- [x] The before numbers and the route tables are recorded (T001 to T003).

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`. AC-005 was met after the prompt policy amendment.
- [x] `jq -c '.attachedMetrics.plain.tune' ADV/scripts/routing-accuracy/command-routing-baseline.json` prints a `combined` above 9, and `scratch/after-final.txt` holds every floor at or above `scratch/before.txt`.
- [x] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data first, code last. Two of the five waves only add vocabulary (hub keywords and phrase anchors). One changes what an existing insertion inserts. One adds an optional field that rides the same path the `policy` field already rides.

### Key Components
- **Doctor hand-off** (`ADV/lib/scorer/doctor-helper-handoff.ts`, `ADV/lib/scorer/fusion.ts`): `matchDoctorProblem` returns the ranker's `runnable`. `runnableDoctorBridgeId` maps it to a `command-doctor-*` row with policy `run` that the projection holds. `applyDoctorHelperHandoff` inserts that row, or the helper, and a plain repair request with no candidate gets the helper.
- **Hub vocabulary** (`.skilled/skills/sk-doc/hub-router.json`, `.skilled/skills/system-deep-loop/hub-router.json`): keywords appended to existing classes. The compiled route counts distinct matched keywords times the mode weight, so one added keyword breaks a tie and two clear a weight-4 rival.
- **Activation manifests**: `compiled-route-manifest.cjs refresh` pins the new policy hash. The served copy under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/` is copied over its authored twin under the archived router program, which `compiled-route-sync.cjs --check` compares.
- **Phrase anchors** (`ADV/lib/scorer/lanes/explicit.ts` `PHRASE_BOOSTS`): three deep phrases lift `system-deep-loop`, one with a `sk-code` penalty. Three create phrases lift `sk-doc` or the playbook command row.
- **Mode label**: `routeNeedsMode` in `ADV/lib/command-attach.ts`, `needsMode` in the schema and `AdvisorRecommendation`, set in `enrichCompiledRoutes`, kept by `recommendationFromCli` and printed by `renderAdvisorBrief` only when the top carries no command.

### Data Flow
A prompt is scored. When no doctor bridge passes and the prompt reads as a doctor problem, the hand-off inserts the ranked `run` command or the helper. The handler asks a compiled hub for its route. A single route attaches the mode's command. A `defer` or `clarify` route on a hub with commands sets `needsMode`. The hook renders `use <owner> → <command> (<policy>)`, or `use <hub> (needs a mode)`, or the bare skill.

### Heads After This Phase

```text
Advisor: live; use system-skilled-doctor → /doctor:agents-md check (run) 0.80/0.20 pass.
Advisor: live; use sk-doc → /create:agent (start) 0.82/0.20 pass.
Advisor: live; use system-deep-loop → /deep:review (ask) 0.82/0.20 pass.
Advisor: live; use sk-doc (needs a mode) 0.90/0.15 pass.
```

The numbers in these heads are illustrative. The golden test pins the form.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `applyDoctorHelperHandoff` | Inserts `/doctor:helper` for any ranked doctor problem | Insert the ranked `run` command, keep the helper otherwise, add the repair request | T004, T005, T008 |
| `doctor-prompts.jsonl` | Pins the helper on three hand-off rows | Relabel the three to the command now offered | T006 |
| `sk-doc` and deep-loop hub routers | Paraphrase-blind vocabulary | Six and three multi-word keywords | T010, T022 |
| Activation manifests, served and authored | Pin each hub's policy hash | Refreshed and copied after each hub edit | T010, T022 |
| `PHRASE_BOOSTS` | No deep or create phrase for plain wording | Three deep anchors, then three create anchors | T021, T026 |
| Recommendation schema and type | `command`, `policy`, `ownerSkillId` | Add optional `needsMode` | T014, T015 |
| `enrichCompiledRoutes` | Attaches a single-mode command | Also sets `needsMode` on a defer or clarify route | T016 |
| `recommendationFromCli` | Keeps `command`, `policy`, `ownerSkillId` | Also keeps `needsMode` | T018 |
| `renderAdvisorBrief` | Head from phase 005 | Adds ` (needs a mode)` to a top with no command | T017 |
| Command baseline | Pins every capture row | Recaptured after A, B, D and E | T008, T011, T023, T027 |
| OpenCode plugin `cliRecommendations` | Drops `command` and `policy` | Not a consumer here. Recorded for phase 013 | `rg -n "cliRecommendations" .opencode/plugins/system-skill-advisor.js` |
| Python scorer | No hand-off, own phrase table | Unchanged. The parity test guards it | T009, T030 |
| `AGENTS.md`, `.skilled/commands/create/`, every `ROUTER.md`, every canary fixture | Frozen or served twins | Unchanged | T032 |

Matrix axes for the hand-off: ranked command policy `run`, `ask` or none. A skill passes or not. The cue is strong, weak or none. The prompt carries a repair phrase or not. T005's cases cover `run` with no skill, `run` beside a skill with a strong cue, `ask`, no candidate with and without a skill, and the existing silence row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records every floor, the per-row plain state and the compiled route of every non-holdout row and canary prompt on both hubs. Implementation runs the waves in `tasks.md` in the order A, B, C, D, E, each ending with a recapture and a floor check. Verification reruns every floor, counts the chat rows, checks the boundaries and the live heads and writes the summary.

### How the coordinator decides to skip wave E
T024 writes `scratch/after-D.txt`. Wave E runs only when all of these hold, else T025 marks T026 to T029 `[B]` with the first line that differs and the phase closes without them:
1. The `FLOOR` lines, the `TYPED` lines and the `EVAL` line in `after-D.txt` are byte-identical to the same lines in `after-C.txt`. A rise counts as a change too, because wave E needs headroom it can measure.
2. `PY` exits 0 and `PAR`, `RS`, `VDS` and `SUITE` report 0 failed.
3. The three deep rows carry their command in the recaptured baseline (T023's verify).

After wave E, T028 applies the same comparison to `after-E.txt` against `after-D.txt` except for `PLAIN`. When any floor line moved, T029 has the coordinator revert `ADV/lib/scorer/lanes/explicit.ts` to its wave D state and rerun T027.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The cue, the ranked runnable, `runnableDoctorBridgeId`, the hand-off end to end on four tune prompts and one silence row, `routeNeedsMode`, the handler flag, the fallback reader, the golden heads | Vitest in `ADV` |
| Integration | The command capture and its slice test, the doctor slice, the scorer eval, the Python test, the parity test, the advisor suite, the compiled-route tests, the guard, the sync check, the parent skill check and a route diff of every non-holdout row per hub | The capture scripts, `jq`, Vitest, `python3`, `node --test` |
| Manual | The Claude prompt hook on two hub-identity prompts and one doctor tune prompt, in a sandboxed socket folder | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 committed | Internal | Yellow: workers editing on 2026-11-13 | Waves would collide on five files, so no wave 1 task starts |
| A fresh build in `ADV` | Internal | Green once each recapture task runs `npm run build` | The capture refuses a stale build |
| `compiled-route-manifest.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs` | Internal | Green: all seven hubs fresh, 0 failures, 55 copies match | A hub edit would leave the hub on `legacy` |
| No new package | External | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor line drops below `scratch/before.txt`, the guard reports a failure, a silence row changes route or the slice test fails after a recapture.
- **Procedure**: revert the wave's files with the coordinator's own git step, rerun `node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>` and the manifest copy for any hub the wave touched, run `npm run build` in `ADV` and `node ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs --write`, and confirm the floor check prints the previous wave's lines.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► A ──► B ──► C ──► D ──► (E only if D left the floors unchanged) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 011 committed | Every wave |
| Implementation, waves A to E | The before numbers and the route tables, then the previous wave's floor check | Verification |
| Verification | The last wave that ran | The phase 012 rerun of the after arm in segment three |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The autonomous answers are in `spec.md` section 10. Three research claims were refuted in code and change the plan. The doctor change goes into the insertion, not the early return. No compiled policy snapshot exists, so a hub edit needs only the manifest refresh and copy. Two of the three create rows have no scorer row, so their anchor lifts `sk-doc` and the hub alias carries the command.
<!-- /ANCHOR:decisions -->
