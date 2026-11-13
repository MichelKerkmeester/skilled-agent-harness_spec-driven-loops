---
title: "Feature Specification: Phase 11: permission-mode-carry"
description: "A Claude session that changes its permission mode after launch restarts in the launch mode after a hop. The Stop payload carries the live mode, but the Stop adapter arms with no settings, the relaunch record has no field for it and the wrapper replays only the launch flag."
trigger_phrases:
  - "permission mode carry"
  - "phase 11 permission mode carry"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: permission-mode-carry

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 17 |
| **Predecessor** | 010-fanout-orphan-liveness |
| **Successor** | 012-session-name-carry |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh 011-permission-mode-carry --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Research rank 5 for Claude only. The Claude Stop adapter passes the payload's `permission_mode` to `arm`, the relaunch core keeps it on the record, `consume` prints it and `skilled-loop` replays it as `--permission-mode` on a Claude relaunch and in the manual command. Four source files, five test files and the wrapper test harness, named in the Files to Change table. Planned only: nothing is built until the operator gives the greenlight.

**Dependencies**:
- This phase runs before phases 012 and 014. Phase 012 edits `.skilled/bin/skilled-loop` (the consume read at `:1226-1252` and the Claude arguments at `:616-617`) and phase 014 edits `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` (`:119-135`). Both start from the tree this phase leaves, so neither is dispatched while this phase is open.
- Phase 017 owns the README and playbook text for this change. This phase writes no document outside its folder.
- The five test files pass at baseline: 155, 158, 67, 54 and 45 tests, each `fail 0` (Measured Behavior).
- The operator answers the plan-mode question in section 10 before T012 is built.

**Deliverables**:
- A Claude Stop arm that stamps the live permission mode on the record.
- A relaunch core that keeps a `permissionMode` key on the armed record.
- A `consume` output that prints `permissionMode` when the record holds one.
- A wrapper that replays the live mode as `--permission-mode` on a Claude hop and in the manual command, and falls back to the launch mode when the live one is unusable.
- A recorded live answer, from Claude itself, to the two unconfirmed points: the spelling of the default mode and whether `bypassPermissions` needs a second flag.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Claude session moved into another permission mode after launch, for example with Shift+Tab into `acceptEdits`, restarts in the launch mode after a hop. The Stop payload names the live mode (`.skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:6`), but the Stop adapter calls `arm` with no settings (`.skilled/hooks/session-relaunch/claude/stop-arm.mjs:152`), the arm path copies only model, provider and effort (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011`), `consume` prints only those three (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:793`) and the wrapper replays a launch `--permission-mode` as a plain extra argument, because it is not in the record-backed list (`.skilled/bin/skilled-loop:593`).

### Purpose
A Claude receiver starts in the permission mode its sender held at Stop, or in the launch mode when the live one cannot be replayed safely, and each fallback says why on stderr.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n --sort path -e '"permission_mode"' -e "armed = arm\(\{ loopId, cwd: payload.cwd" -e "for \(const key of \['model', 'provider', 'effort'\]\)" -e "claude:--model\|claude:--effort\|claude:-n\|claude:--name\|" -e "claude:--output-format\|claude:--permission-mode" .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json .skilled/hooks/session-relaunch/claude/stop-arm.mjs .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/bin/skilled-loop
.skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:6:  "permission_mode": "bypassPermissions",
.skilled/hooks/session-relaunch/claude/stop-arm.mjs:152:    armed = arm({ loopId, cwd: payload.cwd || process.cwd(), env });
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011:  for (const key of ['model', 'provider', 'effort']) {
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:793:  for (const key of ['model', 'provider', 'effort']) {
.skilled/bin/skilled-loop:488:      claude:--output-format|claude:--permission-mode|claude:--permission-prompts|\
.skilled/bin/skilled-loop:593:    claude:--model|claude:--effort|claude:-n|claude:--name|\
exit=0

$ claude --version && claude --help | grep -n -A3 -e '--permission-mode <mode>'
2.1.323 (Claude Code)
151:  --permission-mode <mode>              Permission mode to use for the session
152-                                        (choices: "acceptEdits", "auto",
153-                                        "bypassPermissions", "manual",
154-                                        "dontAsk", "plan")

$ env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/<file>.test.cjs   (one run per file, at e1886c57c8)
relaunch-core: tests 155 pass 155 fail 0 exit=0
session-relaunch-cli: tests 158 pass 158 fail 0 exit=0
claude-adapters: tests 67 pass 67 fail 0 exit=0
skilled-loop-wrapper-model-effort: tests 54 pass 54 fail 0 exit=0
skilled-loop-wrapper-launch-arguments: tests 45 pass 45 fail 0 exit=0
```

The arm call passes no `settings`, the core and `consume` loops name three keys, and `--permission-mode` is a value option at `:488` but not a record-backed one at `:593`, so a launch value is replayed through `replayed_extra_arguments` (`.skilled/bin/skilled-loop:940`). The help lists `manual` and no `default`, while Claude's hook payload for an unchanged session is expected to say `default`. That gap is inferred and T001 confirms it. The help says nothing on whether `bypassPermissions` needs `--allow-dangerously-skip-permissions` or `--dangerously-skip-permissions` beside it, so T002 confirms that live.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm from Claude itself what the Stop payload reports for the default mode and whether `--permission-mode bypassPermissions` starts a bypass session with no second flag.
- Pass the Stop payload's `permission_mode` to `arm` as `settings.permissionMode` in `claude/stop-arm.mjs`.
- Keep a non-empty `permissionMode` on the armed record in `lib/relaunch-core.cjs`, and print it from `consume` in `bin/session-relaunch.cjs`.
- Capture a launch `--permission-mode` into `SKILLED_LOOP_PERMISSION_MODE`, make it record-backed, and replay the live mode (or the launch one) as `--permission-mode` on a Claude hop and in the manual command.
- Apply the operator's answer on a live `plan` mode, with option B of section 10 as the recommendation.

### Out of Scope
- Codex, Cursor, Devin, OpenCode and Pi permission or mode flags - the phase brief limits this phase to Claude, and research section 5 shows only Claude can replay a stamped mode today.
- Pi `--plan` and `--build` - phase 015 owns them.
- Session names, the `-n/--name` lists and the consume `name` read - phase 012 owns them.
- The deferred-hop notice and `session_crons` in `claude/stop-arm.mjs:119-135` - phase 014 owns them.
- The session-relaunch README and the Claude relaunch playbook - phase 017 documents what this phase ships.
- `codex/stop-arm.mjs:121`, which also arms with no settings - Codex is out of scope, and its mode-to-flag mapping is UNCONFIRMED (research section 5).
- A note line telling the receiver about the sender's mode - that touches `lib/nudge.cjs`, which this phase does not edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | Pass `settings: { permissionMode }` from the payload to `arm` at `:152`. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Add `permissionMode` to the live-settings keys at `:1011` and to the `arm` JSDoc at `:978-980`. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Add `permissionMode` to the consume keys at `:793`. |
| `.skilled/bin/skilled-loop` | Modify | Capture, validate, record-back and replay the mode on a Claude hop (`:593`, `:609-619`, `:790-831`, `:1252-1272`) and in the manual command (`:256-308`). |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Add the Stop arm stamp tests. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the arm keep test. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Add the consume print test. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` | Modify | Add the wrapper replay, fallback, plan and manual-command tests. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | Move `--permission-mode plan` ahead of the seed in the expected arguments of the existing Claude replay test at `:53-57`. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modify | Let the runtime stub write `permissionMode` from `RECORD_PERMISSION_MODE`, beside `RECORD_MODEL` at `:190-192`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Two live facts are recorded in `scratch/live-checks.md` before any source edit. First, the `permission_mode` a Claude 2.1.323 Stop payload reports for a session started with no mode flag, and whether `claude -p --permission-mode default` is accepted. Second, the `permission_mode` a Stop payload reports for `claude -p --permission-mode bypassPermissions` with no other permission flag, and for `--dangerously-skip-permissions --permission-mode acceptEdits`. Each fact quotes the command, its exit status and the captured payload value. |
| REQ-002 | `claude/stop-arm.mjs` passes `settings: { permissionMode: payload.permission_mode }` to `arm` when that value is a non-empty string, and no `permissionMode` otherwise. Test `stop-arm stamps the payload permission mode on the armed record` in `claude-adapters.test.cjs` sends `permission_mode: "acceptEdits"` and asserts the armed record's `permissionMode` is `acceptEdits`. Test `stop-arm arms without a permission mode when the payload has none` sends no `permission_mode` and asserts the record has no `permissionMode` key. Today the first fails because the key is never written. |
| REQ-003 | `lib/relaunch-core.cjs` keeps a non-empty `settings.permissionMode` on the armed record, and an arm with no mode keeps the mode the record already held. The model-switch rule at `:1014-1018` does not touch it. Test `arm keeps a live permission mode and a later arm without one keeps it` in `relaunch-core.test.cjs` asserts both. Today the first arm drops the key. |
| REQ-004 | `bin/session-relaunch.cjs` `consume` prints `permissionMode` when the record holds a non-empty string, and no key otherwise. Test `consume reports the permission mode the record holds` in `session-relaunch-cli.test.cjs` asserts the exact JSON with `permissionMode: "acceptEdits"`, and the existing `consume reports the model and effort the record holds and nothing it lacks` still passes unchanged. |
| REQ-005 | `.skilled/bin/skilled-loop` captures a Claude launch `--permission-mode <m>` or `--permission-mode=<m>` into an exported `SKILLED_LOOP_PERMISSION_MODE`, lists `claude:--permission-mode` as record-backed so it is no longer replayed as an extra argument, and the Claude branch of `build_relaunch_arguments` appends `--permission-mode "$SKILLED_LOOP_PERMISSION_MODE"` after the effort and before the seed. Test `the sender live permission mode replaces the launch mode for that hop` in `skilled-loop-wrapper-model-effort.test.cjs` launches with `--permission-mode manual`, has the stub record `acceptEdits`, and asserts the hop arguments hold `--permission-mode acceptEdits` exactly once and the child env has `SKILLED_LOOP_PERMISSION_MODE=acceptEdits`. |
| REQ-006 | A live mode the wrapper does not accept leaves the launch mode in place with a stderr line `warning: ignoring the sender permission mode <m>, relaunching on the launch mode`. The accepted set is the six choices `claude --help` lists, plus the spelling of the default mode that REQ-001 records, mapped to the value the CLI accepts. Test `a live permission mode the CLI would reject falls back to the launch mode` asserts the launch value and the warning for `bogusMode`. |
| REQ-007 | A live `plan` mode follows the operator's answer to the open question in section 10. Under the recommended option B, a live `plan` does not replace the launch mode and the wrapper prints `note: the sender was in plan mode, the receiver starts in the launch mode`. Test `a live plan mode keeps the launch mode` asserts that. If the operator picks another option, this row and its test are rewritten before T012 is built. |
| REQ-008 | The wrapper never adds a permission flag the launch line did not carry. If REQ-001 shows that `--permission-mode bypassPermissions` needs a second flag, a live `bypassPermissions` is replayed only when the launch line carried `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions`, and otherwise falls back to the launch mode with a warning. Test `a live bypass mode with no unlocking launch flag keeps the launch mode` covers that branch. If REQ-001 shows no second flag is needed, the test asserts plain replay instead. |
| REQ-009 | The manual claim command carries the live mode by the same rules. `read_consumed_live_settings` and `apply_consumed_live_settings` read and apply `permissionMode`. Test `manual command carries the live permission mode` asserts `--permission-mode acceptEdits` in the printed command. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | The five test files pass in full after the change, with counts equal to the baseline plus the added tests. The existing Claude replay test at `skilled-loop-wrapper-launch-arguments.test.cjs:53-57` keeps its name and its two flags, and only the position of `--permission-mode plan` moves ahead of the seed. Codex's arm at `codex/stop-arm.mjs:121` is unchanged, and `rg -n "permissionMode" .skilled/hooks/session-relaunch/codex` prints nothing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/live-checks.md` names the default-mode spelling and the bypass rule, each with the command, exit status and payload value Claude printed.
- **SC-002**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'permission mode' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'permission mode|plan mode|bypass mode' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` exits 0 with `fail 0`.
- **SC-004**: The five test files run in full with `fail 0`, and `validate.sh 011-permission-mode-carry --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 012 and 014 edit `skilled-loop` and `claude/stop-arm.mjs` | Built in parallel, the edits would conflict | This phase runs first, and both phases rebase onto its tree |
| Dependency | Claude 2.1.323 for the live checks | Without it the default spelling and the bypass rule stay inferred | T001 and T002 run before any edit, and the plan halts if they cannot |
| Risk | A hop grants a permission the operator never chose | High | The live mode comes from the sender's own Stop payload, and REQ-008 forbids adding an unlocking flag |
| Risk | A receiver restarted in `plan` cannot run the claim that writes the note | Medium | Option B keeps the launch mode for a live `plan` until the operator decides |
| Risk | The payload says `default` and the CLI rejects it, ending the relaunch at a usage error | High | REQ-006 accepts only help choices and the spelling REQ-001 records, and falls back to the launch mode |
| Risk | Launch `--dangerously-skip-permissions` and a live `acceptEdits` disagree on the receiver | Medium | T002 records which flag wins, and REQ-008's test pins the rule |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The hop path reads the mode in the same `consumed_field` style as the model, one `node -e` call per hop.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: The wrapper replays only a mode from the six help choices or the mapped default, never a free string, so a crafted record cannot inject an argument.
- **NFR-S02**: The wrapper never adds `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions` on its own.

### Reliability
- **NFR-R01**: Any unusable live mode falls back to the launch mode, so the relaunch never ends at a usage error the launch line would not have hit.
- **NFR-R02**: A record with no `permissionMode` gives the same hop arguments as today, except for the position of a launch `--permission-mode`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a payload with no `permission_mode`, or an empty one, arms with no key, and the hop replays the launch mode or none.
- Maximum input: a 10,000 character `permission_mode` is stored by the core but is not one of the accepted values, so the wrapper warns and keeps the launch mode.
- Failure path: an unknown mode prints the warning of REQ-006 and the relaunch still runs. A failed `consume` leaves the launch mode, as it does for the model today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four source files and six test files, about 120 lines, no new module |
| Risk | 9/25 | A permission setting crosses a hop, and the wrapper's argument order changes for one flag |
| Research | 6/20 | Two live checks against Claude 2.1.323 and one operator decision |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What should a hop do when the sender's live mode is `plan`, given the receiver must at least run the claim command and usually edit? Answered by the operator on 2026-11-13: option B. The other options stay listed as the alternatives that were weighed.
  - A) Carry `plan` as is. The receiver starts in plan mode. Faithful, but the claim command writes the note, and plan mode is expected to block or prompt for that write (inferred, not tested), so the hop can stall until the operator leaves plan mode.
  - B) Do not carry a live `plan`. The receiver starts in the launch mode, which is today's behaviour, and the wrapper prints one note line on stderr. **Recommended**: it keeps every hop able to claim and edit, it changes nothing for a session that never left plan, and it carries every other mode.
  - C) Map a live `plan` to `manual`. The receiver can claim, but a session launched in `acceptEdits` loses that mode on the hop.
  - D) Carry `plan` and tell the receiver in the note to ask the operator to leave plan mode. This needs a `lib/nudge.cjs` change outside this phase.
- What does Claude 2.1.323 put in `permission_mode` for an unchanged session, and does the CLI take `default`? T001 answers it.
- Does `--permission-mode bypassPermissions` need a second flag, and which flag wins when `--dangerously-skip-permissions` meets another mode? T002 answers it.
<!-- /ANCHOR:questions -->

---
