---
title: "Feature Specification: Close eight known gaps in the session relaunch loop"
description: "Eight known gaps remain after phase 34: two claim-seed parsers disagree, a Pi provider switch keeps the launch effort, prepare outside the loop ignores the off switch, one README paragraph is stale, the spec validator can hang on fsmonitor, the parent goal binding stops at 011, the concern cannot be switched per runtime and the root README still features it. This phase closes all eight, then the four findings of the pre-commit review and the test sandboxes that read the operator's shell."
trigger_phrases:
  - "known gap fixes"
  - "session relaunch known gaps"
  - "per-runtime session relaunch switch"
  - "SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Close eight known gaps in the session relaunch loop

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 35 |
| **Predecessor** | 034-default-off-opt-in |
| **Successor** | None |
| **Handoff Criteria** | Every code gap and review finding has a test that failed before its fix and passes after it, the relaunch, Pi, hook-flags and validator suites are green with a clean environment and with per-runtime and kill flags exported, the docs name the per-runtime switches and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight gaps remain after phase 34. `specFolderFromSeed` and `notePathFromSeed` in `lib/nudge.cjs` split a claim seed at the first ` | Spec folder: ` marker, while `parseClaimSeed` in `lib/relaunch-core.cjs` splits at the last, so a note path that holds the marker parses two ways. `live_model_voids_launch_effort` in `.skilled/bin/skilled-loop` treats a Pi hop as the same model only when the launch model is spelled `provider/model`, so a launch with `--provider X` and a recorded provider that differs keeps an effort chosen for another model. `prepare` in `bin/session-relaunch.cjs` checks the concern only inside the loop and prints a manual claim outside it even when the concern is off.

The session-relaunch README Codex paragraph says no Codex receiver is handed a goal packet, but a manual claim now binds the note's packet. The spec validator calls git without `core.fsmonitor=false`, so it can hang in a checkout whose fsmonitor daemon is stuck. The parent `goal.md` binding table lists child goals up to 011 only. The concern is on or off for every runtime at once, so an operator cannot keep it on for Pi and off for Claude Code. The root README still features the in-session handover in two headline sections although it ships off.

After G1 to G8 a pre-commit review found four more issues. The `prepare` refusal named `SYSTEM_SESSION_RELAUNCH_ENABLED=1` even when a kill switch or a falsy per-runtime flag had turned the concern off, and a refused `prepare` could still rewrite the note. `hook-flags.sh` did not trim the runtime name and ignored the legacy master alias `MK_HOOKS_DISABLED`. The validator git-call test missed a git call after `if`, `elif`, `while` or `until` and one behind a `VAR=value` prefix. The full gate then showed that the relaunch test sandboxes read the operator's shell: with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported, the node suites failed 98 of 934 (`scratch/final-gate-claude0-node.txt`).

### Purpose
The eight gaps close with a failing-first test for each code change, and an operator can switch the session-relaunch concern per runtime from one documented place.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the nudge claim-seed parsing onto the core `parseClaimSeed`, so both split at the last marker (G1)
- Count a recorded Pi provider that differs from the launch provider as a model switch, for `--provider X` and for `X/model` (G2)
- Make `prepare` refuse when its runtime's concern is off, inside and outside the loop, before it reads or edits the note, with exit 2 and a message naming the switch that decided (G3, amended)
- Correct the Codex goal paragraph in the session-relaunch README (G4)
- Pass `-c core.fsmonitor=false` on every git call the spec validator makes (G5)
- Bind the parent goal to every child that holds a `goal.md`, within the 4,000-character slice budget (G6)
- Add per-runtime enable flags to the shared resolver and pass the runtime from every session-relaunch caller (G7)
- Fold the two root README sections into one short section and document the per-runtime flags on every operator surface (G8)
- Make `hook-flags.sh` trim the runtime name and honour every master alias, `MK_HOOKS_DISABLED` included, with the same answers as `hook-flags.cjs` (R1)
- Make the validator git-call test catch git after `if`, `elif`, `while` and `until` and behind `VAR=value` prefixes (R2)
- Make the relaunch test sandboxes hermetic, so the suites pass whatever relaunch, per-runtime or kill flags the operator's shell exports (R3)
- State the Pi provider rule and its documented limit in the session-relaunch README (R4)
- Keep `hook-flags.ts` free of new type errors (R5)

### Scope Amendment

The operator approved this amendment on 2026-10-25, when finishing the packet autonomously was approved. It amends G3 (REQ-003 and AC-003) so the refusal names the switch that decided and a refused `prepare` leaves the note's bytes unchanged. It adds R1 to R5 (REQ-015 to REQ-019, AC-015 to AC-019) for the four review findings, the hermetic sandboxes, the Pi provider sentence and the type check. With relaunch off, a missing `--session`, a path outside the repo or an invalid note now gets the refusal first, and only a missing `--handoff` still wins. That ordering is a judgement call recorded here. The hermetic sandboxes (R3) also drop the goal concern's kill switch and aliases, a second judgement call: a hop can start the next session on the goal command, and the hostile run showed the goal hops failing while those switches were exported.

### Out of Scope
- Any other hook concern's default or switch - each keeps its current answer
- Kill switch names and the master switch - both keep their meaning and still win over every enable flag
- The relaunch protocol, thresholds and wrapper hop logic beyond G2 - nothing else changes once the concern is on
- `keep`, `claim`, `cancel`, `complete` and `history` - G3 changes `prepare` only
- Goal files for children 012 to 032 - none exists, and writing them is not part of this phase
- The operator's gitignored `.skilled/hooks/hook-flags.env` - the operator edits it by hand

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | G1: `specFolderFromSeed` and `notePathFromSeed` use `core.parseClaimSeed` |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs` | Modify | G1, G3, G7: a note path holding the marker, `prepare` refusal in and out of the loop, an adapter silent with its runtime off |
| `.skilled/bin/skilled-loop` | Modify | G2: `live_model_voids_launch_effort` compares the launch provider with the recorded provider |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` or `skilled-loop-shell.test.cjs` | Modify | G2: failing-first rows for `--provider X` and `X/model` with a different recorded provider |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | G3: the concern check moves before the outside-loop branch; G7: the check passes the resolved runtime |
| `.skilled/hooks/session-relaunch/README.md` | Modify | G4: the Codex goal paragraph (about line 184); G8: the per-runtime switches; R4: the Pi provider rule and its limit (line 43) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` and the scripts it runs | Modify | G5: every git call gets `-c core.fsmonitor=false`; known sites include `cli/rules/check-spec-doc-integrity.sh`, `cli/rules/check-ac-coverage.sh`, `cli/rules/check-source-tags-helper.mjs` and `cli/validation/continuity-freshness.ts` |
| Validator test file under `.skilled/skills/system-spec-kit/runtime/` | Modify | G5: a test that fails while any validator git call omits the option |
| `specs/hooks/023-session-relaunch-loop/goal.md` | Modify | G6: binding rows for 033, 034 and 035 |
| `.skilled/hooks/shared/hook-flags.cjs`, `.mjs`, `.ts`, `.sh` | Modify | G7: runtime-aware answer for session-relaunch |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modify | G7: precedence table across all four readers; R1: spaced-runtime and `MK_HOOKS_DISABLED` rows |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts` | Modify | R2: the shell git-call matcher covers control keywords and `VAR=value` prefixes |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs`, `.opencode/plugins/tests/session-relaunch.test.cjs` | Modify | R3: each sandbox strips the relaunch, per-runtime and kill flags it inherits |
| `.skilled/hooks/session-relaunch/claude/*.mjs`, `codex/*.mjs`, `hermes/*.mjs` | Modify | G7: each `isHookEnabled` call passes the adapter's runtime |
| `.opencode/plugins/session-relaunch.js` | Modify | G7: passes `opencode` |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | G7: passes `pi` |
| `README.md` | Modify | G8: one short section replaces "Endless Sessions" (about line 65) and "Turn On Endless Sessions" (about line 221); anchors that link to the old sections follow |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | G8: per-runtime flag rows, read by `/doctor:env` |
| `.env.example` | Modify | G8: sections 8 and 18 |
| `.skilled/hooks/hook-flags.env.example` | Modify | G8: per-runtime lines |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | Modify | G8: `hook-flags.env` eligibility covers the per-runtime flags |
| `.skilled/hooks/shared/README.md`, `.skilled/hooks/README.md` | Modify | G8: the runtime-aware rule |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md` | Modify | G8: the three playbooks name the per-runtime flags |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For a claim seed whose note path holds the spec-folder marker, the nudge's note path and spec folder equal what `parseClaimSeed` returns for the same seed. |
| REQ-002 | On Pi, a recorded provider that differs from the launch provider counts as a model switch whether the launch named the provider with `--provider X` or as `X/model`; the Hermes exemption and the empty-launch-model rule are unchanged. |
| REQ-003 | `prepare` checks its runtime's concern before it reads or edits the note, inside and outside `skilled-loop`. When the concern is off it exits 2, writes no record, prints no manual claim, leaves the note's bytes unchanged and names the switch that decided: the kill or master switch key (for example "session relaunch is disabled by SYSTEM_SESSION_RELAUNCH_DISABLED; unset it..."), the runtime flag (for example "session relaunch is off for claude by SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED; set it to 1..."), or both enable flags when nothing turned it on. Amended 2026-10-25. |
| REQ-004 | `keep`, `claim`, `cancel`, `complete` and `history` behave as before with the concern on or off. |
| REQ-005 | Every git call that `validate.sh` makes, directly or through a script it runs, carries `-c core.fsmonitor=false`. |
| REQ-006 | `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` for CLAUDE, CODEX, PI, OPENCODE, HERMES, CURSOR and DEVIN is read from the environment and from `hook-flags.env`, the environment winning; a set per-runtime flag, truthy or falsy, wins over `SYSTEM_SESSION_RELAUNCH_ENABLED` for that runtime. |
| REQ-007 | The master switch and `SYSTEM_SESSION_RELAUNCH_DISABLED` win over every global and per-runtime enable flag. |
| REQ-008 | The `.cjs`, `.mjs`, `.ts` and `.sh` readers give the same answer for the same runtime, env and file inputs. |
| REQ-009 | Every session-relaunch caller passes its runtime: the adapters by their folder, `prepare` from the runtime it resolves, the OpenCode plugin and the Pi extension. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | The session-relaunch README Codex paragraph says a manual claim binds the note's packet and no longer says no Codex receiver gets one. |
| REQ-011 | The parent `goal.md` binding table has a row for every child that holds a `goal.md`, and `goal.cjs packet` reports `packet_budget=ok`. |
| REQ-012 | The root README has one short section in place of the two, saying the handover ships off and showing the global and per-runtime switches. |
| REQ-013 | ENV-REFERENCE.md, `.env.example` sections 8 and 18, `hook-flags.env.example`, `doctor-env.yaml`, the session-relaunch, shared and hooks READMEs and the three session-relaunch playbooks name the per-runtime flags. |
| REQ-014 | The existing relaunch, Pi, hook-flags and validator suites pass with no assertion weakened. |
| REQ-015 | `hook-flags.sh` trims the runtime name and honours every master alias, `MK_HOOKS_DISABLED` included, giving the same answers as `hook-flags.cjs`. |
| REQ-016 | The validator git-call test flags a git call that follows `if`, `elif`, `while` or `until` or sits behind one or more `VAR=value` prefixes. |
| REQ-017 | The relaunch test sandboxes are hermetic: the node suites pass with a clean environment, with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported, and with all seven per-runtime flags `0` plus `SYSTEM_SESSION_RELAUNCH_DISABLED=1` and `SYSTEM_HOOKS_DISABLED=1` exported. |
| REQ-018 | The session-relaunch README states that on Pi a live provider other than the launch provider is a model switch, and that a Pi launch naming no provider has nothing to compare, so a same-model provider change keeps the launch thinking level. |
| REQ-019 | `hook-flags.ts` gains no new type errors. No tsconfig covers it, so an ad-hoc strict `tsc` run compares the HEAD copy with the working tree. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test for G1, G2, G3, G5, G7, R1 and R2 fails on the code before its fix and passes after it.
- **SC-002**: The relaunch node suites, the Pi vitest, the hook-flags tests and the validator tests exit 0, with counts at or above the baselines (928, 59, 27), with a clean environment and again with the per-runtime and kill flags of REQ-017 exported.
- **SC-003**: `bash -n` and `shellcheck` on `.skilled/bin/skilled-loop` exit 0.
- **SC-004**: With `SYSTEM_SESSION_RELAUNCH_ENABLED=1` and `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, the resolver answers off for Claude and on for Pi, OpenCode and Codex in all four readers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | G3 and G7 both change the `prepare` check | Parallel edits conflict | G7 starts after the G1 to G4 work lands |
| Dependency | Phase 34's default-off resolver | G7 builds on its enable rule | 034 strict PASSED before the G7 tests land |
| Risk | A caller left without its runtime | That runtime ignores its per-runtime flag | Inventory every `isHookEnabled(CONCERN` call and test one adapter silent with its runtime off |
| Risk | Four resolver copies drift | One runtime gets a different answer | One precedence table run through all four readers |
| Risk | A test sandbox inherits the operator's relaunch or kill flags | The suites fail on a machine that exports them | Each sandbox strips those flags, and the full gate runs with a clean, a Claude-off and a hostile environment |
| Risk | The goal slice exceeds 4,000 characters | The parent goal cannot be sent | Cut in the budget-and-handoff section 3 order and measure with `goal.cjs packet` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The resolver still reads the config file at most once per process.

### Security
- **NFR-S01**: A missing or unreadable config file leaves the concern off for every runtime unless the environment enables it.

### Reliability
- **NFR-R01**: A per-runtime flag uses the same truthy set as the global flag: `1`, `true`, `yes` or `on`, case-insensitive; an empty value counts as not set.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty per-runtime value: not set, so the global flag decides.
- Note path holding the spec-folder marker twice: both parsers split at the last marker.
- Unknown runtime name passed to the resolver: the global flag decides.

### Error Scenarios
- Per-runtime `0` in the environment and `1` in the file: the environment wins and that runtime is off.
- Concern off and `prepare` run outside the loop: exit 2, no manual claim printed, the note's bytes unchanged.
- Concern off and `prepare` run with no `--session`, a note outside the repo or an invalid note: the refusal comes first. A missing `--handoff` is still reported as a usage error before the refusal.
- Runtime name with surrounding spaces: every reader trims it and finds its per-runtime switch.
- Git missing or not a repository during validation: the validator keeps its current fallback.

### State Transitions
- A record armed while a runtime was on, then its flag set to `0`: the next hook call for that runtime is silent.
- Hermes hop with a differing provider: the Hermes exemption still keeps the effort rule out of play.
- Pi launch naming no provider, then a provider change on the same model: nothing to compare, so the launch thinking level stays (a documented limit, not code).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 35 files across eight gaps: resolver, ten callers, wrapper, CLI, validator scripts and about twelve docs |
| Risk | 13/25 | A shared resolver contract every hook reads, and the validator every packet runs |
| Research | 4/20 | Each gap is located at file and line |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The sk-create-goal phase-parent workflow wants a binding row for every direct child, and `check-goal.cjs` reports a missing row for 012 to 032, but those children hold no `goal.md`, the validator rejects a row whose target does not exist and 21 more rows would exceed the 4,000-character budget. Whether to author those goals or split the parent goal is the operator's decision.
<!-- /ANCHOR:questions -->

---
