---
title: "Feature Specification: Phase 13: live-hop-and-notice-reason"
description: "Phase 011 closed with two open items: the killer's timeout notice showed the plain command without saying why the manual template was ignored, and no live relaunch hop had been run. This phase puts the reason in the notice, makes every interactive runtime launch start under skilled-loop through a sourced shell shim, stops the nudge outside the loop and runs the live hops."
trigger_phrases:
  - "live hop and notice reason"
  - "phase 13 live hop and notice reason"
  - "killer notice subtitle"
  - "skilled-loop shell shim"
  - "no nudge outside skilled-loop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: live-hop-and-notice-reason

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/158-open-items-live-hop-and-legacy-rows` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-ci-red-check-repairs |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the session-relaunch suites pass with no failures and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Session relaunch loop specification.

**Scope Boundary**: The two Known Limitations that `../011-post-fix-remediation/implementation-summary.md` left open: the killer's timeout notice without a reason, and the missing live hop.

**Dependencies**:
- Phase 011's logged template fallback (`killer-manual-template`).
- A Claude Code login and tmux for the live hop.

**Deliverables**:
- A notice whose title names the timeout and whose subtitle names an ignored template's reason, with a failing-first test.
- The concern README and the Claude playbook scenario describing the new notice.
- One live Claude relaunch hop driven in tmux, with its evidence.
- A sourced shell shim that starts every interactive runtime launch under the nearest `skilled-loop`, a symlinked `.skilled` included, with bash and zsh tests.
- A shared nudge decision that stays quiet outside the loop, with one conformance case per adapter.
- The docs that describe starting the loop and the nudge, brought in line with both changes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When `SKILLED_LOOP_MANUAL_TEMPLATE` held no note placeholder or more than one, the killer logged `killer-manual-template` but its macOS notice showed only the plain command. An operator who reads the notice and not `relaunch.log` could not tell that their launch options were dropped, or that the notice came from a timeout. No phase had yet run a real relaunch hop, so the loop was proven only by unit, adapter and wrapper tests.

A plain `claude` session in a repository that links `.skilled` (the operator's `AI Systems` repository links this checkout's `.skilled`) got the context nudge, wrote a note, ran prepare, got exit 3 because no wrapper was running, and stopped. Nothing could relaunch it. Every adapter nudged outside the loop, and no launch path started a plain runtime command under the wrapper.

### Purpose
The notice says on its face why it fired and why the template was ignored, and one live hop confirms the loop end to end. Every interactive runtime launch starts under the loop in the same terminal, in this repository and in any repository that links `.skilled`, and a session outside the loop keeps working instead of stopping at a manual hand-off.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The killer's notice: a title that names the timeout and a JSON-escaped `subtitle` carrying the template problem, sent only when there is one.
- A test assertion for each case: subtitle present with a problem and absent without one.
- The concern README and the Claude playbook scenario.
- One live Claude relaunch hop in tmux, run by the orchestrator.
- `.skilled/bin/skilled-loop-shell.sh`: functions named after each runtime binary that run `bash <repo>/.skilled/bin/skilled-loop <arm> "$@"` for an interactive launch on a terminal outside a loop, found by walking up from `$PWD`, and `command <binary> "$@"` otherwise. Each runtime's pass-through subcommands and flags come from its own `--help`.
- The shared `nudgeDecision` stays quiet when `SKILLED_LOOP_ID` is unset or empty. The adapters already call it, and inside the loop nothing changes.
- The tests that assumed a nudge outside the loop, adjusted to run inside one.
- The docs that describe starting the loop or the nudge: the concern README, the `bin/` README, the hooks README, the root README, the system-spec-kit README and env reference, the feature catalog entry and index, the three session-relaunch playbook files, the OpenCode plugins README, the tests README and the `/speckit:handoff` command.
- Live hops through the shim in a symlinked repository, run by the orchestrator.

### Out of Scope
- The deep-loop legacy-row work in the same worktree, which belongs to `system-deep-loop/038-review-and-cli-lineage`.
- The CLI's and the wrapper's template warnings, which already reach stderr.
- The manual `/speckit:handoff` path and prepare's exit 3, which stay as they are.
- Changing the wrapper's own argument handling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | Timeout title and template-problem subtitle in the notice |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modify | Subtitle present and absent assertions |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Notice title and subtitle |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | Timeout scenario title match and evidence, outside-loop silence, shim checks |
| `.skilled/bin/skilled-loop-shell.sh` | Create | Sourced shell shim |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Create | Shim tests under bash and zsh |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | No nudge outside the loop |
| `.opencode/plugins/session-relaunch.js` | Modify | Comment on the branch only a loop id without a record now reaches |
| `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs`, `nudge.test.cjs`, `claude-adapters.test.cjs`, `codex-adapters.test.cjs`, `hermes-adapters.test.cjs`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `pi/session-relaunch.test.ts` | Modify | Outside-loop cases, and a loop id for tests that need a nudge |
| `.skilled/commands/speckit/handoff.md` and the docs listed in scope | Modify | Shim, symlinked repositories and the in-loop nudge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When the manual template is unusable, the killer's timeout notice carries a subtitle that says the template was ignored and why, and a notice without a template problem carries none. |
| REQ-002 | The notice change has a test that fails on the pre-phase killer, and delivery stays best-effort. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A live Claude session in tmux, started by `skilled-loop`, hands off and relaunches, and the new session claims the note. |
| REQ-004 | The concern README and the Claude playbook scenario describe the notice as it now reads. |
| REQ-005 | A sourced shell shim starts every interactive launch of Claude, Pi, OpenCode, Codex, Hermes, Devin and Cursor under the nearest `skilled-loop`, a symlinked `.skilled` included, and runs the binary directly for subcommands, print and one-shot modes, version, help, non-terminal launches and sessions already in a loop. It passes shellcheck and reads the same under bash and zsh. |
| REQ-006 | No adapter nudges when `SKILLED_LOOP_ID` is unset or empty, decided once in the shared core, and the nudge inside the loop is unchanged. |
| REQ-007 | Every doc that describes starting the loop or the nudge covers the shim and symlinked repositories and no longer describes a nudge outside the loop. |
| REQ-008 | Live hops through the shim in a repository that links `.skilled`, run by the orchestrator. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pre-phase killer fails the two notice tests, and the phase sources pass every session-relaunch suite.
- **SC-002**: One live hop finishes with the note claimed by the relaunched session.
- **SC-003**: The shim and outside-loop tests fail on the pre-change sources and pass on the phase sources, and shellcheck, the drift guards and the doc validators pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A template problem holds a character that breaks the AppleScript string | Low | The subtitle is JSON-escaped the same way the command is, and `osacompile` accepts the resulting line |
| Risk | macOS truncates a long subtitle | Low | The full reason is still in `relaunch.log` under `killer-manual-template` |
| Dependency | Claude Code login and tmux | The live hop cannot run | The notice change ships on its own; the live-hop row stays Unmet |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The notice adds no process call; the subtitle rides in the existing `osascript` call.

### Security
- **NFR-S01**: The subtitle text passes through `JSON.stringify`, so no template content reaches AppleScript unquoted.

### Reliability
- **NFR-R01**: A failed or missing `osascript` still never throws out of the killer.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Template unset or holding exactly one placeholder: no subtitle.
- Template with no placeholder or with two: the subtitle reads `Manual template ignored:` followed by the reason `manualTemplateProblem` returns.

### Error Scenarios
- `osascript` missing or timing out: the call is caught and the killer exits normally.

### State Transitions
- A superseded timeout sends no notice at all, so it carries no subtitle either.

### Shell Shim
- `SKILLED_LOOP_ID` already set: the shim runs the binary, so a relaunched session never nests a second wrapper.
- A pipe on stdin or stdout: the shim runs the binary.
- A `.skilled` that is a symlink: it counts, and the wrapper resolves its own real path.
- An alias with the runtime's name: the alias wins, and sourcing still succeeds.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function, one test file, two docs, one live run |
| Risk | 3/25 | Notice text only; the live hop changes no code |
| Research | 2/20 | Phase 011 named both items |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
