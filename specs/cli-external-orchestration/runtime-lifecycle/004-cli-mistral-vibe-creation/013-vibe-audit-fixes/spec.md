---
title: "Feature Specification: Phase 13: vibe-audit-fixes"
description: "An sk-code audit of the Vibe code found two guard defects and a set of smaller correctness and hygiene gaps. The env-secret guard judges relative paths against the checkout instead of the session folder, and the isolated-home dispatch rule ignores a preceding cd. This phase fixes every verified finding and tests each behavior fix."
trigger_phrases:
  - "vibe audit fixes"
  - "phase 13 vibe audit fixes"
  - "vibe sk-code audit findings"
  - "vibe hook-io session dir"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: vibe-audit-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 21 |
| **Predecessor** | 012-playbook-docs-and-closeout |
| **Successor** | 014-vibe-journal-fixture-and-reader |
| **Handoff Criteria** | Both P1 fixes carry a test that failed before the fix, and the dispatch, repo-guards and fan-out suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Fixes to existing Vibe code that the 2026-11-14 sk-code audit flagged and the orchestrator confirmed. No new hook, hook type or runtime behavior.

**Dependencies**:
- Phases 007, 008, 009 and 011, which built the files this phase corrects.
- The audit text in the session scratchpad (`deepseek-audit-text.md`), whose findings this phase cites by file and line.

**Deliverables**:
- The two P1 fixes, each with a regression test.
- The confirmed P2 fixes, and a recorded keep-or-drop verdict for the four checks nobody has opened yet.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every Vibe dispatch runs in a scratch folder, yet `toCoreCall` hands each guard core the checkout root as its working directory (`.vibe/plugins/repo-guards/lib/hook-io.mjs:71-75`). So `env-secret-guard` resolves a relative path, and checks its symlink and hard-link targets, against the wrong folder (`.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:148-160`). Separately, the `isolated-vibe-home` dispatch rule resolves a relative `VIBE_HOME` against the caller's cwd and ignores a `cd` before the run (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:1004-1007`), while `output-dir-required` honors it (line 980). That gives false blocks, and it can miss a home inside the checkout. Smaller gaps sit beside these two: a success check that accepts `null` as exit 0, a failure message that hides the run's outcome, duplicated constants, a dead write, a test bound to a live packet, a dotfile counted as drift and missing doc comments.

### Purpose
Every Vibe guard and dispatch rule judges paths against the folder the run actually uses, and the audited code meets the sk-code SKILLED checklist.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "cwd: REPO_ROOT" .vibe/plugins/repo-guards/lib/hook-io.mjs
71:  if (tool === 'bash') return { tool, input: { command: input.command }, cwd: REPO_ROOT };
73:    return { tool, input: { file_path: input.file_path }, cwd: REPO_ROOT };
75:  return { tool, input, cwd: REPO_ROOT };
$ rg -c "^function sessionDirFor" .vibe/plugins/repo-guards/*.mjs
.vibe/plugins/repo-guards/overlay-guard.mjs:1
.vibe/plugins/repo-guards/spec-gate.mjs:1
.vibe/plugins/repo-guards/spec-gate-classify.mjs:1
.vibe/plugins/repo-guards/post-edit-quality.mjs:1
$ node -e 'console.log([null, "", false].map((v) => Number(v) === 0).join(" "))'
true true true
$ awk 'length > 120 { print FILENAME ":" FNR ": " length }' <fanout-run.cjs> <render-home-hooks.test.mjs>
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3227: 129
.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs:42: 124
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `sessionDirFor` from its four copies into `lib/hook-io.mjs`, and have `env-secret-guard.mjs` pass the session folder as `cwd` at its call site. `toCoreCall` stays unchanged, because `git-message-gate.mjs:39-47` passes `call.cwd` to `evaluateCommand` and `dispatch-preflight.mjs:21` relies on `toCoreCall` anchoring to the checkout.
- Resolve a relative `VIBE_HOME` in `isolated-vibe-home` against `vibeWorkingDirectory()`, the base `output-dir-required` already uses.
- Fix the confirmed P2 findings in `fanout-run.cjs`, `dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, `spec-gate.mjs`, `render-home-hooks.cjs`, `overlay-guard.mjs`, `seed-state.mjs` and `render-home-hooks.test.mjs`.
- Open the findings nobody has read yet: the ancestor-symlink check shared by `sync-skills-vibe.cjs`, `sync-agents-vibe.cjs` and `sync-prompts-vibe.cjs`, and the `goal-inject.mjs` `ERROR_POLICY` export. Fix each one that holds, and record a drop verdict with evidence for each one that does not.
- Fix the dotfile drift in `sync-skills-vibe.cjs` (`listOutputEntries` keeps every name, lines 237-240), with a `.DS_Store` test that fails before the fix.
- Move `goal-vibe.test.mjs` off the live 011 packet onto a temporary `goal.md` fixture, as `goal-cursor.test.mjs:229-233` builds one.

### Out of Scope
- New hooks for the parity gaps - phases 014 to 019 own them.
- The test-wiring, render-step and lineage-posture items - phase 020 owns them.
- Doc corrections in `guards-and-hooks.md` and the skill README - phase 021 owns them.
- `check-comment-hygiene.sh`, which fails `bash -n` at line 169 on main as well - it sits outside the Vibe parent and goes to a separate packet.
- Full test suites for the three Vibe sync generators - phase 020 owns them. This phase creates `sync-skills-vibe.test.mjs` with the dotfile case only, and 020 extends it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | Modify | Export `sessionDirFor`; `toCoreCall` is unchanged |
| `.vibe/plugins/repo-guards/{overlay-guard,spec-gate,spec-gate-classify,post-edit-quality}.mjs` | Modify | Import the shared `sessionDirFor` |
| `.vibe/plugins/repo-guards/env-secret-guard.mjs` | Modify | Passes `cwd: sessionDirFor(payload.cwd)` at its call site |
| `.vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs` | Create | A relative symlink to a dotenv file in the session folder is denied |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | `isolated-vibe-home` base folder; import the session-free sets |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Relative-home cases with and without a preceding `cd` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Export `VIBE_SESSION_FREE_SUBCOMMANDS` and `VIBE_SESSION_FREE_FLAGS` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Integer exit check, outcome in the failure message, mirror comment, JSDoc, one long line |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Null exit code and stopped-outcome cases; the three roster copies agree |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | Modify | Replace the ignored `pre_tool` `additional_context` write with a `system_message` UI note |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | Modify | Refuse any leftover `$VAR`, `${`, `$(` or backtick, and reject newline and carriage return in the root |
| `.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` | Modify | Compare against the real path; wrap line 42 |
| `.vibe/plugins/repo-guards/overlay-guard.mjs` | Modify | Wrap the note write in try/catch |
| `.vibe/plugins/repo-guards/fixtures/spec-gate/seed-state.mjs` | Modify | Add the MODULE box header |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs` | Modify | Skip dotfiles in `listOutputEntries`; the ancestor-symlink check if confirmed |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-{agents,prompts}-vibe.cjs` | Modify if confirmed | The same ancestor-symlink check |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-vibe.test.mjs` | Create | The `.DS_Store` case; phase 020 extends the file |
| `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` | Modify | A temporary `goal.md` fixture instead of the live 011 packet |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | Modify if confirmed | The `ERROR_POLICY` export |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The env-secret guard judges a relative path against the session folder | A new test makes a relative symlink to `.env` inside a scratch session folder. The guard allows it before the fix and denies it after, and `node --test .vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs` prints `fail 0` |
| REQ-002 | `isolated-vibe-home` resolves a relative home from the folder the run starts in | `cd /tmp && VIBE_HOME=vibe-home vibe -p …`, with the context cwd set to the checkout, passes. `cd <repo> && VIBE_HOME=vibe-home vibe -p …`, with the context cwd set to `/tmp`, is refused. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A Vibe lineage succeeds only on an integer exit code of 0 | A unit case with `exit_code: null` scores `failure` |
| REQ-004 | The failure message names an unfinished outcome | A unit case with `outcome: 'stopped'` and exit 0 gets a message containing `stopped` |
| REQ-005 | One source for each duplicated Vibe constant | `rg -c "new Set\\(\\['config', 'mcp', 'help'\\]\\)" .skilled/hooks/dispatch/lib/` prints a match in one file only, and a unit test asserts the three roster copies are equal |
| REQ-006 | The home renderer refuses every leftover substitution form | `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` covers `$VAR`, `${VAR}` and a backtick command, and prints `fail 0` |
| REQ-007 | The rest of the confirmed P2 items are fixed | `spec-gate.mjs` writes no `additional_context` and notes through `system_message`, `goal-vibe.test.mjs` names no live packet, a `.DS_Store` in the skills mirror is not drift, `overlay-guard.mjs` wraps its stderr write, `seed-state.mjs` carries the MODULE header, the exported Vibe functions carry JSDoc, and no in-scope line exceeds 120 characters |
| REQ-008 | Each verify-first finding ends as a fix or a recorded drop | `goal.md` has a log row for each of the four checks (three generators' ancestor-symlink check and `ERROR_POLICY`), with the command output behind its verdict |
| REQ-009 | The git-message gate behaves as before | Its two fixture payloads print the same output before and after the `hook-io.mjs` change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/dispatch/lib/*.test.mjs .vibe/plugins/repo-guards/tests/*.test.mjs` prints `fail 0`.
- **SC-002**: `npx vitest run tests/unit/fanout-run.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, prints no failed test.
- **SC-003**: `awk 'length > 120' <each touched file>` prints nothing, and `node --check` exits 0 on each touched `.mjs` and `.cjs` file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The guard cores under `.skilled/hooks/*/lib/` accept a `cwd` field | Med: a core that ignores `cwd` would make the fix a no-op | REQ-001's test fails before the fix, which proves the core reads the field |
| Risk | Moving `sessionDirFor` changes four hooks at once | Med: a wrong import fails a guard open | Every guard still passes its fixture, and `node --check` runs on each file |
| Risk | Moving the `spec-gate` advise text from `additional_context` to `system_message` changes who sees it | Low: the model never saw it; the operator now does | Vibe ignores `additional_context` on `pre_tool` and shows `system_message` as a UI note (`mistralai_vibe_local_harness/vibe/_foreign_hooks.py:364-379`) |
| Risk | A shared `hook-io.mjs` change could reach the git-message gate | Med | `toCoreCall` stays unchanged, and T004 and T036 compare the gate's fixture output before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- UNVERIFIED: `assertOutputDirectorySafe` (`sync-skills-vibe.cjs:281`, `sync-agents-vibe.cjs:122`, `sync-prompts-vibe.cjs:142`) checks only the last path component for a symlink. Nobody has opened it yet; T008 to T010 decide.
- UNVERIFIED: whether `goal-inject.mjs:14`'s `ERROR_POLICY` export has a reader. T011 decides whether to test it or drop it.
<!-- /ANCHOR:questions -->

---
