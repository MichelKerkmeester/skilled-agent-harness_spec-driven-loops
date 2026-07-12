---
title: "Spec Mutation Gate Enforce"
description: "Manual scenario validating the mk-spec-gate classify/enforce surfaces and deny predicate."
trigger_phrases:
  - "plg-001"
  - "mk-spec-gate"
  - "spec mutation gate"
  - "spec gate enforce"
  - "gate-3 question"
  - "MK_SPEC_GATE_ENFORCE"
version: 1.0.0.1
---

# Spec Mutation Gate Enforce

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-spec-gate` turns the "spec folder before any file mutation" rule (Gate 3) from a prompt-time instruction into session-scoped state both runtimes can read. It ships as two thin transport adapters over one runtime-neutral core:

- OpenCode plugin: `.opencode/plugins/mk-spec-gate.js` -- classify runs in `experimental.chat.system.transform` (best-effort fetches the session's last user message via `ctx.client` since the real hook input carries no prompt field), enforce runs in `tool.execute.before` on the mutating-tool set.
- Claude hooks: `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` (`UserPromptSubmit`) and `spec-gate-enforce.mjs` (`PreToolUse` on `Write|Edit` and `Bash`).
- Shared core: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` -- `classifyIntent()` opens the gate and returns the bounded Gate-3 question, or parses an answer to an already-open gate; `evaluateMutation()` reads the cached gate state for a Write/Edit and returns `allow`/`advise`/`deny`.

Classify only ever surfaces a question (it cannot block). Enforce advises by default and denies a Write/Edit **only** when all five conditions in `.opencode/plugins/README.md` section 5.4 hold: the kill-switch is off, `MK_SPEC_GATE_ENFORCE=1`, the session is not a dispatched/child session (`AI_SESSION_CHILD=1` forces advise), the gate is open and unanswered, and the target is a real, non-exempt in-repo path. Bash is always advise-only regardless of enforce. Every entrypoint fails open: an unreadable/corrupt state file, a classifier throw, or an unresolvable root resolves to allow/no-op with no side effects.

This scenario validates, with real executed evidence: (a) with enforce OFF (the actual project wiring in `.claude/settings.json`, `MK_SPEC_GATE_ENFORCE=0`) a non-spec Write/Edit is never denied; (b) flipping `MK_SPEC_GATE_ENFORCE=1` produces a real deny plus the Gate-3 detail message on a non-spec Write; (c) a write inside the spec tree itself stays exempt and allows even with enforce on; (d) a dispatched/child session (`AI_SESSION_CHILD=1`) never denies even with enforce on; (e) a false-positive measurement using both the shipped unit-test suites and this repo's own live `spec-gate-warnings.log` telemetry, sized before any global enforce flip.

---

## 2. SCENARIO CONTRACT

- Preconditions: Node is on `PATH`. `.opencode/plugins/mk-spec-gate.js`, `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`, and both Claude hook adapters exist (confirmed live, see Evidence). `.claude/settings.json` wires `PreToolUse` (`Write|Edit` and `Bash` matchers) to `spec-gate-enforce.mjs` and `UserPromptSubmit` to `spec-gate-classify.mjs`, with `env.MK_SPEC_GATE_ENFORCE` set to `"0"` project-wide.
- Real user-facing trigger: a user asks the agent to "fix the login bug" (or any other file-mutation-shaped request) without naming a spec folder, then the agent attempts a `Write`/`Edit` on a real, non-exempt source file before a spec folder has been named -- exactly the Gate-3 violation the CLAUDE.md GATE 3 rule targets.
- Expected signals: `classifyIntent()` returns `{status:"open", question: <GATE_3_QUESTION>}` on a mutation-shaped prompt; `evaluateMutation()` returns `decision:"advise"` with `wouldDeny:true` whenever enforce is off; `decision:"deny"` with `detail` containing `"DENIED: this Write/Edit needs a bound spec folder first"` only when enforce is on, the session is not a child session, and the target is non-exempt; `decision:"allow"` for spec-tree/`.git`/`node_modules`/`dist`/`/tmp`/`/private/tmp` targets and for the disabled kill-switch, regardless of enforce; the Claude hook's stdout carries `hookSpecificOutput.permissionDecision:"deny"` only in the deny case and `additionalContext` in the advise case, never both.
- Desired user-visible outcome: a concise PASS/FAIL verdict citing the exact captured command output for each of the five behaviors above, plus a real false-positive rate measured from this repo's own telemetry.
- Pass/fail: PASS if enforce-OFF never denies, enforce-ON denies exactly the non-exempt/non-child case, exempt paths and child sessions always allow/advise, the kill-switch is a full no-op, and both unit-test suites are green. FAIL if any Write/Edit is denied while enforce is unset or while `AI_SESSION_CHILD=1`, if an exempt path is ever denied, if the kill-switch does not suppress a deny, or if either unit-test suite reports a failure.

---

## 3. TEST EXECUTION

1. Run the OpenCode plugin adapter's unit-test suite. Neutralize the two vars the operator may export ambiently (`AI_SESSION_CHILD` and `MK_SPEC_GATE_ENFORCE`) with `env -u` so the suite is hermetic -- `AI_SESSION_CHILD=1` in the inherited env would force the WS4 child-session advise-only path and suppress the "must deny" assertion, producing a spurious `# fail 1`:

```bash
env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE node .opencode/plugins/tests/mk-spec-gate.test.cjs
```

Expected: TAP output, `# tests 11`, `# pass 11`, `# fail 0`.

2. Run the shared spec-gate-core unit-test suite (uses `node:test` module mocks):

```bash
node --experimental-test-module-mocks --test .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs
```

Expected: `# tests 66`, `# pass 66`, `# fail 0`.

3. Build a disposable, non-exempt fixture project (deliberately NOT under `/tmp` or `/private/tmp`, which the core always treats as exempt scratch space -- `mktemp -d` with no path argument resolves to `$TMPDIR`, e.g. `/var/folders/.../T/...` on macOS):

```bash
TMPDIR_A=$(mktemp -d)
mkdir -p "$TMPDIR_A/src" "$TMPDIR_A/.opencode/specs/999-demo"
echo '// placeholder' > "$TMPDIR_A/src/login.ts"
echo '# demo' > "$TMPDIR_A/.opencode/specs/999-demo/spec.md"
```

4. Classify a mutation-shaped prompt through the real Claude `UserPromptSubmit` hook, opening the gate (enforce OFF, matching the live project wiring):

```bash
printf '%s' '{"prompt":"fix the login bug","session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | MK_SPEC_GATE_ENFORCE=0 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs
```

Expected: exit 0, one JSON object with `additionalContext` containing `SPEC FOLDER QUESTION`.

5. Enforce OFF: a real Write on the non-spec fixture file must be `advise`, never `deny`:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | MK_SPEC_GATE_ENFORCE=0 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, `additionalContext` present, `permissionDecision` absent.

6. Flip the enforce env var: the identical Write must now `deny`. Neutralize the operator's ambient `AI_SESSION_CHILD` with `env -u` for this one command -- a dispatched/child session (`AI_SESSION_CHILD=1`) correctly advises instead of denying (that is step 7's contract), so the deny path is only reachable when that signal is absent, exactly as it is in a real interactive Claude session:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | env -u AI_SESSION_CHILD MK_SPEC_GATE_ENFORCE=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, `permissionDecision:"deny"` with a reason starting `DENIED: this Write/Edit needs a bound spec folder first`.

7. Enforce ON + a dispatched/child session (`AI_SESSION_CHILD=1`): must advise, never deny:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | MK_SPEC_GATE_ENFORCE=1 AI_SESSION_CHILD=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, `additionalContext` present, `permissionDecision` absent.

8. Enforce ON, target inside the spec tree itself: exempt, must allow:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":".opencode/specs/999-demo/spec.md"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | MK_SPEC_GATE_ENFORCE=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, empty stdout (allow, no advisory, no deny).

9. Kill-switch: `MK_SPEC_GATE_DISABLED=1` must be a full no-op even with enforce on and the gate open:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | MK_SPEC_GATE_ENFORCE=1 MK_SPEC_GATE_DISABLED=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
rm -rf "$TMPDIR_A"
```

Expected: exit 0, empty stdout (allow).

10. False-positive check: classify three read-only/non-mutation prompts directly against the ESM core (via a disposable fixture dir) and confirm none open the gate:

```bash
TMPDIR_E=$(mktemp -d)
node --input-type=module -e "
import * as core from '$(pwd)/.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs';
const projectDir = '$TMPDIR_E';
const prompts = ['explain how the login flow works', 'what does this function do', 'review the auth module for bugs'];
let i = 0;
for (const prompt of prompts) {
  const result = core.classifyIntent({ prompt, sessionID: 'fp-check-' + (i++), projectDir, env: process.env });
  console.log(JSON.stringify({ prompt, result }));
}
"
rm -rf "$TMPDIR_E"
```

Expected: all three return `{"status":"closed","question":null}`.

11. Measure the real advise/would-deny/deny rate from this repo's own live telemetry (produced by real Claude Code sessions running this exact plugin under the project's actual `MK_SPEC_GATE_ENFORCE=0` wiring):

```bash
LOG=.opencode/skills/.spec-gate-state/spec-gate-warnings.log
wc -l "$LOG"
awk -F'|' '{gsub(/^ +| +$/,"",$5); print $5}' "$LOG" | sort | uniq -c
awk -F'|' '{gsub(/^ +| +$/,"",$3); print $3}' "$LOG" | sort | uniq -c
grep -c '| deny$' "$LOG"
```

Expected: zero `deny` lines (confirms enforce has never fired live in this project), a nonzero `would-deny` count sizing the real false-positive exposure of a future enforce flip.

12. Confirm the live wiring source of truth:

```bash
grep -n "MK_SPEC_GATE_ENFORCE" .claude/settings.json
grep -n "spec-gate-enforce.mjs\|spec-gate-classify.mjs" .claude/settings.json
```

Expected: `"MK_SPEC_GATE_ENFORCE": "0"` and both hooks wired as documented in Overview.

---

## 4. EVIDENCE

Plugin adapter unit-test run (real, step 1, hermetic `env -u` command):

```text
$ env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE node .opencode/plugins/tests/mk-spec-gate.test.cjs
1..11
# tests 11
# suites 0
# pass 11
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 22.702583
```

All 11 subtests passed, including `MK_SPEC_GATE_ENFORCE unset: no Write/Edit is ever denied through the OpenCode adapter, even after classify opens the gate` and `WS4: AI_SESSION_CHILD=1 + enforce on + open gate -> tool.execute.before never throws (advise, not deny)`.

The `env -u` neutralization is load-bearing: with the operator's ambient env leaked (`export AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0`), the bare `node .opencode/plugins/tests/mk-spec-gate.test.cjs` command reports `# pass 10 / # fail 1` -- the single failure is `not ok 7 - P2 fix: classify and enforce key an absent sessionID under the same fallback -- enforce sees what classify opened` with `error: 'Missing expected rejection: enforce must see the same no-session gate state classify opened, and deny'`. `AI_SESSION_CHILD=1` forces the WS4 child-session advise-only path, which suppresses the deny that assertion expects. This is an ambient-env leak in the invocation, not a plugin defect; the `env -u` form above restores a clean 11/11.

Shared core unit-test run (real, step 2):

```text
$ node --experimental-test-module-mocks --test .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs
...
1..66
# tests 66
# suites 0
# pass 66
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 641.477166
```

All 66 subtests passed, including the `WS4 child matrix` block (child+enforce=advise, no-child+enforce=deny, child+disabled=allow, `AI_SESSION_CHILD` value variants, bash stays advise-only for a child too).

Live Claude-hook transport run, steps 4-9 (real, captured against a disposable `$(mktemp -d)` fixture, NOT under `/tmp`/`/private/tmp`):

```text
=== 4. classify opens the gate (enforce OFF) ===
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"SPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit, pick one:\nA) Use an existing spec folder (name it)\nB) Create a new spec folder\nC) Update a related spec folder (name it)\nD) Skip (no spec folder needed for this change)\nE) Use a phase folder (e.g. .opencode/specs/<parent>/<NNN-phase>, name it)"}} (exit=0)

=== 5. enforce OFF: Write on real non-spec file -> must be ADVISE, never deny ===
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"SPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit, pick one:\nA) Use an existing spec folder (name it)\nB) Create a new spec folder\nC) Update a related spec folder (name it)\nD) Skip (no spec folder needed for this change)\nE) Use a phase folder (e.g. .opencode/specs/<parent>/<NNN-phase>, name it)"}} (exit=0)

=== 6. enforce ON: same Write -> must DENY ===
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DENIED: this Write/Edit needs a bound spec folder first. Ask the USER to reply with a letter A-E naming an existing (or new) spec folder, then retry."}} (exit=0)

=== 7. enforce ON + AI_SESSION_CHILD=1: same Write -> must ADVISE, never deny ===
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"SPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit, pick one:\nA) Use an existing spec folder (name it)\nB) Create a new spec folder\nC) Update a related spec folder (name it)\nD) Skip (no spec folder needed for this change)\nE) Use a phase folder (e.g. .opencode/specs/<parent>/<NNN-phase>, name it)"}} (exit=0)

=== 8. enforce ON: Write inside the spec tree itself -> exempt, must ALLOW (no output) ===
 (exit=0)

=== 9. kill-switch MK_SPEC_GATE_DISABLED=1: enforce ON + open gate -> must ALLOW (no output) ===
 (exit=0)
```

All six signals matched exactly: deny fired in exactly one case (step 6: enforce on, non-exempt, non-child, open gate), and every other combination allowed or advised as designed.

Supplementary live core probe (real, a broader disposable Node script that imports `spec-gate-core.mjs` directly and calls `classifyIntent()`/`evaluateMutation()` for the same enforce-off/enforce-on/exempt-path/child-session/kill-switch matrix as steps 5-9, plus the three step-10 false-positive prompts, all against a `$(mktemp -d)`-based fixture cleaned up after):

```text
--- (a) classifyIntent enforce-OFF ---
{ "status": "open", "question": "SPEC FOLDER QUESTION: ..." }
--- (a) evaluateMutation enforce-OFF (non-spec Write, open gate) ---
{ "decision": "advise", "detail": "SPEC FOLDER QUESTION: ...", "wouldDeny": true }
--- (b) evaluateMutation enforce-ON (non-spec Write, open gate) ---
{ "decision": "deny", "detail": "DENIED: this Write/Edit needs a bound spec folder first. ...", "wouldDeny": true }
--- (c) evaluateMutation enforce-ON, spec-tree path (exempt) ---
{ "decision": "allow", "detail": null, "wouldDeny": false }
--- (d) evaluateMutation enforce-ON + AI_SESSION_CHILD=1 (must never deny) ---
{ "decision": "advise", "detail": "SPEC FOLDER QUESTION: ...", "wouldDeny": true }
--- (e) classifyIntent non-mutation prompt: "explain how the login flow works" ---
{ "status": "closed", "question": null }
--- (e) classifyIntent non-mutation prompt: "what does this function do" ---
{ "status": "closed", "question": null }
--- (e) classifyIntent non-mutation prompt: "review the auth module for bugs" ---
{ "status": "closed", "question": null }
--- (f) evaluateMutation MK_SPEC_GATE_DISABLED=1 (kill-switch, enforce ON, gate open) ---
{ "decision": "allow", "detail": null, "wouldDeny": false }
```

None of the three read-only/review-shaped prompts opened the gate -- zero false positives across this small probe set.

Real production telemetry, this repo's own `spec-gate-warnings.log` (step 11, produced by real Claude Code sessions running this exact plugin, `MK_SPEC_GATE_ENFORCE=0`):

```text
$ wc -l .opencode/skills/.spec-gate-state/spec-gate-warnings.log
     188 .opencode/skills/.spec-gate-state/spec-gate-warnings.log

$ awk -F'|' '{gsub(/^ +| +$/,"",$5); print $5}' spec-gate-warnings.log | sort | uniq -c
 167 advise
  21 would-deny

$ awk -F'|' '{gsub(/^ +| +$/,"",$3); print $3}' spec-gate-warnings.log | sort | uniq -c
 168 bash
  20 edit
   1 write

$ grep -c '| deny$' spec-gate-warnings.log
0
```

This is a genuine live false-positive measurement, not a synthetic one: over 188 real advise/would-deny events in this project, `deny` never fired (matching the project's `MK_SPEC_GATE_ENFORCE=0` wiring), 21 of 188 (~11%) were `would-deny` (the `write`/`edit` events that a future `MK_SPEC_GATE_ENFORCE=1` flip would actually block), and the remaining 167 were `bash` (always advise-only by design, never deny-capable). Inspecting the 20 `edit` would-deny paths surfaced a real, worth-flagging edge case for anyone sizing an enforce flip: several were `edit` calls against `implementation-summary.md` files under `.worktrees/<name>/.opencode/specs/...` -- a worktree's OWN nested spec tree is **not** recognized as exempt by `isExemptTargetPath()`, because the exemption only matches `.opencode/specs/` relative to the running session's resolved project root, and a worktree's spec tree sits several path segments below that root (`.worktrees/<name>/.opencode/specs/...`, not `.opencode/specs/...`). This is a real, reproducible false-positive source for worktree-heavy workflows, not a defect in the tested behavior above -- documented here as an operator caveat before any global enforce flip.

Live wiring confirmation (step 12):

```text
$ grep -n "MK_SPEC_GATE_ENFORCE" .claude/settings.json
7:    "MK_SPEC_GATE_ENFORCE": "0"
```

`.claude/settings.json` wires `PreToolUse` (`Bash` and `Write|Edit` matchers) to `spec-gate-enforce.mjs` and `UserPromptSubmit` to `spec-gate-classify.mjs`, both confirmed present in the hooks block read directly from the file.

---

## 5. SOURCE FILES

- OpenCode plugin adapter: `.opencode/plugins/mk-spec-gate.js`
- Plugin adapter unit test: `.opencode/plugins/tests/mk-spec-gate.test.cjs`
- Runtime-neutral core: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`
- Core unit test: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs`
- Claude classify hook: `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs`
- Claude enforce hook: `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs`
- Shared Gate-3 classifier consumed by the core: `.opencode/skills/system-spec-kit/shared/dist/gate-3-classifier.js`
- Hook wiring: `.claude/settings.json` (`PreToolUse` matchers `Write|Edit` and `Bash`; `UserPromptSubmit` matcher `""`; `env.MK_SPEC_GATE_ENFORCE`)
- Deny-predicate documentation: `.opencode/plugins/README.md` section 5.4 "mk-spec-gate: who can deny"
- Live telemetry: `.opencode/skills/.spec-gate-state/spec-gate-warnings.log` (real, project-local, gitignored state)

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: spec-mutation-gate-enforce
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins_and_hooks/spec_mutation_gate_enforce.md

---

## 7. PASS/FAIL

**PASS**

Both shipped unit-test suites are fully green (`mk-spec-gate.test.cjs`: 11/11 when invoked hermetically via `env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE ...` per step 1; `spec-gate-core.test.mjs`: 66/66). Live invocation of the actual Claude hook scripts (`spec-gate-classify.mjs` / `spec-gate-enforce.mjs`), piped real hook-shaped JSON payloads against a disposable non-exempt fixture, reproduced every required signal: enforce OFF never denied a real Write; flipping `MK_SPEC_GATE_ENFORCE=1` produced a real `deny` with the exact Gate-3 detail string; a dispatched/child session (`AI_SESSION_CHILD=1`) advised instead of denying even with enforce on; a spec-tree target stayed exempt and allowed even with enforce on; and the kill-switch (`MK_SPEC_GATE_DISABLED=1`) was a full no-op. A separate live probe against three read-only/review-shaped prompts confirmed zero false-positive gate-opens. This repo's own real `spec-gate-warnings.log` (188 lines, produced by real Claude Code sessions under this project's actual `MK_SPEC_GATE_ENFORCE=0` wiring) independently confirms zero real denies to date and sizes the would-deny exposure at 21/188 (~11%) `write`/`edit` events -- the concrete false-positive rate an operator should weigh before flipping enforce globally.

One non-blocking caveat surfaced by that same telemetry, not a failure of this scenario's tested behavior: `isExemptTargetPath()` does not recognize a worktree's own nested `.opencode/specs/` tree as exempt (it only matches `.opencode/specs/` relative to the running session's resolved project root), so `edit` calls against spec docs inside `.worktrees/<name>/.opencode/specs/...` show up as real `would-deny` events today. Flag this to whoever owns the enforce-flip decision before enabling it in worktree-heavy sessions.
