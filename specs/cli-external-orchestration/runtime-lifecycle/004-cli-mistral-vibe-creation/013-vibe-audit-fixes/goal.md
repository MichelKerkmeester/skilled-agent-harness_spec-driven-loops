---
title: "Goal: Phase 13: vibe-audit-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe audit fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/013-vibe-audit-fixes"
    last_updated_at: "2026-11-14T23:00:00Z"
    last_updated_by: "deepseek-v4-1-flash-1017"
    recent_action: "Implemented and verified every task; all findings fixed or dropped"
    next_safe_action: "Phase 014 builds the journal fixture and reader"
    blockers: []
    key_files:
      - ".vibe/plugins/repo-guards/lib/hook-io.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does sync-skills-vibe.cjs follow a symlinked ancestor of its output folder? Yes; all three generators now judge every component below the checkout"
      - "Does anything read the ERROR_POLICY export in goal-inject.mjs? No; the export was dropped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: vibe-audit-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every verified sk-code audit finding in the Vibe code either fixed and tested, or dropped with the evidence that disproves it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each behavior fix gets a regression test that fails before the fix |
| D2 | `sessionDirFor` lives once, in `lib/hook-io.mjs`. `toCoreCall` keeps the checkout as `cwd`; only `env-secret-guard.mjs` overrides it at its call site, so the git-message gate is untouched |
| D3 | `isolated-vibe-home` uses the same base folder as `output-dir-required` |
| D4 | The audit's JSDoc finding is rated P2, because it is documentation only and the sibling runtimes share the gap |
| D5 | No new hook, hook type or runtime behavior. That is phases 014 to 019 |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/dispatch/lib/*.test.mjs .vibe/plugins/repo-guards/tests/*.test.mjs` prints `fail 0`
- [ ] `npx vitest run tests/unit/fanout-run.vitest.ts` in `.skilled/skills/system-deep-loop/runtime` prints no failed test
- [ ] `rg -c "cwd: REPO_ROOT" .vibe/plugins/repo-guards/lib/hook-io.mjs` prints 3, because `toCoreCall` keeps the checkout as `cwd` (D2); the earlier `0` contradicted D2 and T012
- [ ] Each of the four verify-first checks has a fixed or dropped row below, with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Plan | Done | Spec, plan and tasks authored from `deepseek-audit-text.md` and the orchestrator's checks |
| Baseline | Done | `scratch/baseline.txt`: node:test subset 64 pass / 0 fail; fan-out 193 pass |
| Implementation | Done | Every task in `tasks.md` is `[x]`; no `[B]` rows |
| Verification | Done | `scratch/node-check.txt` (20 OK, 0 FAIL), `scratch/git-gate-after.txt` (diff empty), suites below |

### Findings

One row per audited item. `P1` and `P2` follow the audit's own rating; `Verify-first` marks the four checks nobody had opened before this phase.

| Item | State | Evidence |
|------|-------|----------|
| P1 env-secret guard resolves a relative path against the session folder | Fixed | New `env-secret-guard.test.mjs` failed `fail 1` before T013 and passed `fail 0` after; the hook now passes `cwd: sessionDirFor(payload.cwd)` at its call site |
| P1 isolated-vibe-home resolves a relative home from the folder the run starts in | Fixed | The two new cases failed before T020 (`refused a relative home that a cd places outside the checkout`) and pass after; `node --test dispatch-rule-checks.test.mjs` is 60 pass / 0 fail |
| P1 Vibe lineage succeeds only on an integer exit code of 0 | Fixed | `exit_code: null` now scores `failure`; the new vitest case failed before T024 and passes after |
| P1 failure message names an unfinished outcome | Fixed | `outcome: 'stopped'` with exit 0 now yields `..., outcome stopped`; the new case failed before T024 and passes after |
| P1 one source for each duplicated Vibe constant | Fixed | `dispatch-audit.mjs` exports `VIBE_SESSION_FREE_SUBCOMMANDS` and `VIBE_SESSION_FREE_FLAGS`; `rg -l "VIBE_SESSION_FREE_FLAGS = new Set" .skilled/hooks/dispatch/lib/` names only `dispatch-audit.mjs`, and the vitest roster case compares all three copies |
| P1 home renderer refuses every leftover substitution form | Fixed | `$VAR`, `${VAR}`, `$(` and a backtick each throw `shell substitution`; `render-home-hooks.test.mjs` is 4 pass / 0 fail |
| P1 a dotfile in the skills mirror is not drift | Fixed | The `.DS_Store` case failed `fail 1` before T007 and passes after; the generated-mirror reproduction now exits 0 with `PASS: 56 skill links are in sync` |
| P2 spec-gate pre_tool note uses system_message | Fixed | `grep -c additional_context` is 0 and `grep -c system_message` is 2; `spec-gate.test.mjs` is 3 pass / 0 fail |
| P2 goal-vibe test reads a fixture packet, not the live 011 packet | Fixed | `rg -c "011-vibe-context" goal-vibe.test.mjs` is 0; the fixture is built under `.skilled/skills/.state/` and the suite is 3 pass / 0 fail |
| P2 overlay-guard wraps its stderr note write | Fixed | `rg -n -B1 "process.stderr.write" overlay-guard.mjs` shows the `try` line; `node --check` exits 0 |
| P2 seed-state carries the MODULE box header | Fixed | `sed -n 2,4p seed-state.mjs` prints the divider, `MODULE: Vibe Spec Gate State Seeder`, the divider |
| P2 exported Vibe functions carry JSDoc | Fixed | `rg -B1 -n "^function (isVibeBinaryAvailable\|validateVibeCompletion\|buildVibeLineageCommand)" fanout-run.cjs` shows `*/` before all three |
| P2 VIBE_ALLOWED_MODELS carries its mirror comment | Fixed | `rg -n "Mirrors VIBE_SUPPORTED_MODELS" fanout-run.cjs` prints one line |
| P2 render-home test compares the rendered commands to the real path | Fixed | `rg -n realpathSync render-home-hooks.test.mjs` prints the `REAL_REPO_ROOT` line |
| P2 render-home test line 42 exceeded 120 characters | Fixed | The `assert.throws` is wrapped; `awk 'length > 120'` on the test file names only the two 204-character box-drawing header lines |
| P2 fanout-run require line exceeded 120 characters | Fixed | The renderer require is split; `awk 'length > 120 && /[Vv]ibe/' fanout-run.cjs` prints nothing |
| P2 renderer rejects a newline or carriage return in the checkout root | Fixed | `UNSAFE_PATH_CHARACTERS` now carries `\r\n`, and the new test covers both |
| Verify-first sync-skills-vibe ancestor symlink | Fixed | `assertOutputDirectorySafe` at line 281 checked only the last component; `assertNoLinkedAncestor` now walks every component below the checkout. A linked ancestor under `.skilled/skills/.state/` is refused with `refusing to write through a symbolic link`, and `--check` still passes on the real mirror |
| Verify-first sync-agents-vibe ancestor symlink | Fixed | The same check at line 122 had the same gap; the same helper is in place, the linked-ancestor reproduction is refused, and `--check` prints `PASS: 11 agent profiles are in sync` |
| Verify-first sync-prompts-vibe ancestor symlink | Fixed | The same check at line 142 had the same gap; the same helper is in place, the linked-ancestor reproduction is refused, and `--check` prints `PASS: 45 prompt stubs are in sync` |
| Verify-first goal-inject ERROR_POLICY export | Dropped | `rg -n ERROR_POLICY .skilled/hooks/goal/vibe` found no reader, and no README documents it; the export was removed, so the same command now prints nothing. The Vibe adapter is a renderer, not a hook, and the session-start hook owns fail-open |

### Deviations and findings

| Item | Note |
|------|------|
| Sync generator tests | This phase creates `sync-skills-vibe.test.mjs` with the dotfile case. Phase 020 builds the full suites for all three generators and extends that file |
| Comment hygiene checker | `check-comment-hygiene.sh` fails `bash -n` at line 169 on main as well. It sits outside the Vibe parent, so it goes to a separate packet |
| T001 command and the vitest file | `node --test .skilled/hooks/dispatch/lib/*.test.mjs` always picks up `dispatch-audit.test.mjs`, a vitest suite that `node --test` cannot run; it failed at baseline and still fails. The node:test subset is 72 pass / 0 fail, and the vitest run of that file is 130 pass / 0 fail. This is a pre-existing glob mismatch, not a phase-13 regression |
| T003 reproduction | A fresh empty mirror always reports its 56 MISSING links, so the `--check` exit is 1 for that reason alone. The dotfile verdict is read from Setup B in `scratch/dotfile-repro.txt`: a generated mirror plus `.DS_Store` exits 0 after T007 |
| Goal completion line | The `cwd: REPO_ROOT` criterion said 0, which contradicted D2 and T012's 3. Corrected to 3; `toCoreCall` is unchanged |
| Suite environment | This shell exports `MK_SPEC_GATE_ENFORCE=0` and `SYSTEM_SPEC_GATE_ENFORCE=0`, which silence the spec-gate deny path the tests assert. Baseline and final runs both unset them |
| Concurrent tree changes | Another worker added `.vibe/plugins/repo-guards/tests/dist-freshness.test.mjs` during this phase. It is outside this phase's scope and is not edited here; it accounts for three of the node:test count |
<!-- /ANCHOR:log -->
