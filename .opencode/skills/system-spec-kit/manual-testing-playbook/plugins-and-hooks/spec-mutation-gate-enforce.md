---
title: "Spec Mutation Gate Enforce"
description: "Manual scenario validating the system-spec-gate classify/enforce surfaces and deny predicate."
trigger_phrases:
  - "plg-001"
  - "system-spec-gate"
  - "spec mutation gate"
  - "spec gate enforce"
  - "gate-3 question"
  - "SYSTEM_SPEC_GATE_ENFORCE"
version: 1.0.0.1
id: plugins-and-hooks-spec-mutation-gate-enforce
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Spec Mutation Gate Enforce

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`system-spec-gate` turns the "spec folder before any file mutation" rule (Gate 3) from a prompt-time instruction into session-scoped state both runtimes can read. It ships as two thin transport adapters over one runtime-neutral core:

- OpenCode plugin: `.opencode/plugins/system-spec-gate.js` -- classify runs in `experimental.chat.system.transform` (best-effort fetches the session's last user message via `ctx.client` since the real hook input carries no prompt field), enforce runs in `tool.execute.before` on the mutating-tool set.
- Claude hooks: `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` (`UserPromptSubmit`) and `spec-gate-enforce.mjs` (`PreToolUse` on `Write|Edit` and `Bash`).
- Shared core: `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` -- `classifyIntent()` opens the gate and returns the bounded Gate-3 question, or parses an answer to an already-open gate; `evaluateMutation()` reads the cached gate state for a Write/Edit and returns `allow`/`advise`/`deny`.

Classify only ever surfaces a question (it cannot block). A dispatched child (`AI_SESSION_CHILD=1`) short-circuits classify and enforce as a complete no-op before any state read/write, question, denial, or telemetry. For an interactive session, enforce advises by default and denies a Write/Edit only when enforcement is enabled, the gate is open and unanswered, and the target is a real, non-exempt in-repo path. Bash is always advise-only for interactive sessions. Every entrypoint fails open: an unreadable/corrupt state file, a classifier throw, or an unresolvable root resolves to allow/no-op with no side effects.

This scenario validates, with real executed evidence: (a) with enforce OFF (the actual project wiring in `.claude/settings.json`, `SYSTEM_SPEC_GATE_ENFORCE=0`) a non-spec Write/Edit is never denied; (b) flipping `SYSTEM_SPEC_GATE_ENFORCE=1` produces a real deny plus the Gate-3 detail message on a non-spec Write; (c) a write inside the spec tree itself stays exempt and allows even with enforce on; (d) a dispatched/child session (`AI_SESSION_CHILD=1`) emits no question, denial, advisory, or telemetry even with enforce on; (e) a false-positive measurement using both shipped unit-test suites and this repo's own live telemetry, sized before any global enforce flip.

---

## 2. SCENARIO CONTRACT

- Preconditions: Node is on `PATH`. `.opencode/plugins/system-spec-gate.js`, `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, and both Claude hook adapters exist (confirmed live, see Evidence). `.claude/settings.json` wires `PreToolUse` (`Write|Edit` and `Bash` matchers) to `spec-gate-enforce.mjs` and `UserPromptSubmit` to `spec-gate-classify.mjs`, with `env.SYSTEM_SPEC_GATE_ENFORCE` set to `"0"` project-wide.
- Real user-facing trigger: a user asks the agent to "fix the login bug" (or any other file-mutation-shaped request) without naming a spec folder, then the agent attempts a `Write`/`Edit` on a real, non-exempt source file before a spec folder has been named -- exactly the Gate-3 violation the CLAUDE.md GATE 3 rule targets.
- Expected signals: `classifyIntent()` returns `{status:"open", question: <GATE_3_QUESTION>}` on an interactive mutation-shaped prompt; `evaluateMutation()` returns `decision:"advise"` with `wouldDeny:true` whenever enforce is off; `decision:"deny"` with `detail` containing `"DENIED: this Write/Edit needs a bound spec folder first"` only when enforce is on, the session is interactive, and the target is non-exempt; a child returns `{status:"closed", question:null}` from classify and `{decision:"allow", detail:null, wouldDeny:false}` from enforce; spec-tree/`.git`/`node_modules`/`dist`/`/tmp`/`/private/tmp` targets and the disabled kill-switch also allow.
- Desired user-visible outcome: a concise PASS/FAIL verdict citing the exact captured command output for each of the five behaviors above, plus a real false-positive rate measured from this repo's own telemetry.
- Pass/fail: PASS if enforce-OFF never denies, enforce-ON denies exactly the non-exempt interactive case, exempt paths allow, child sessions are complete no-ops, the kill-switch is a full no-op, and both unit-test suites are green. FAIL if a child emits any Gate-3 question/advisory/telemetry or denial, if an exempt path is denied, if the kill-switch does not suppress a deny, or if either unit-test suite reports a failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Validate the Spec Mutation Gate Enforce end to end against the commands below, and report a PASS or FAIL verdict with cited command output.`

```text
a user asks the agent to "fix the login bug" (or any other file-mutation-shaped request) without naming a spec folder, then the agent attempts a `Write`/`Edit` on a real, non-exempt source file before a spec folder has been named -- exactly the Gate-3 violation the CLAUDE.md GATE 3 rule targets
```

### Commands

1. Run the OpenCode plugin adapter's unit-test suite. Neutralize the two vars the operator may export ambiently (`AI_SESSION_CHILD` and `SYSTEM_SPEC_GATE_ENFORCE`) with `env -u` so the suite is hermetic -- an inherited `AI_SESSION_CHILD=1` would force the complete child no-op and suppress interactive deny assertions:

```bash
env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE node .opencode/plugins/tests/system-spec-gate.test.cjs
```

Expected: TAP output, `# tests 11`, `# pass 11`, `# fail 0`.

2. Run the shared spec-gate-core unit-test suite (uses `node:test` module mocks). Neutralize the same ambient gate vars as step 1 (plus the kill-switch) so the run is hermetic in a child-dispatched shell:

```bash
env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE -u SYSTEM_SPEC_GATE_DISABLED node --experimental-test-module-mocks --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs
```

Expected: `# tests 87`, `# pass 87`, `# skipped 0`, `# fail 0`.

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
  | SYSTEM_SPEC_GATE_ENFORCE=0 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs
```

Expected: exit 0, one JSON object with `additionalContext` containing `SPEC FOLDER QUESTION`.

5. Enforce OFF: a real Write on the non-spec fixture file must be `advise`, never `deny`:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | SYSTEM_SPEC_GATE_ENFORCE=0 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, `additionalContext` present, `permissionDecision` absent.

6. Flip the enforce env var: the identical Write must now `deny`. Neutralize the operator's ambient `AI_SESSION_CHILD` with `env -u` for this command; a dispatched child takes the complete no-op path tested in step 7.

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, `permissionDecision:"deny"` with a reason starting `DENIED: this Write/Edit needs a bound spec folder first`.

7. Enforce ON + a dispatched/child session (`AI_SESSION_CHILD=1`): must allow silently with no advisory, telemetry, or denial:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | SYSTEM_SPEC_GATE_ENFORCE=1 AI_SESSION_CHILD=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, empty stdout, and no new `spec-gate-warnings.log` entry.

8. Enforce ON, target inside the spec tree itself: exempt, must allow:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":".opencode/specs/999-demo/spec.md"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | SYSTEM_SPEC_GATE_ENFORCE=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
```

Expected: exit 0, empty stdout (allow, no advisory, no deny).

9. Kill-switch: `SYSTEM_SPEC_GATE_DISABLED=1` must be a full no-op even with enforce on and the gate open:

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"src/login.ts"},"session_id":"hook-demo-a","cwd":"'"$TMPDIR_A"'"}' \
  | SYSTEM_SPEC_GATE_ENFORCE=1 SYSTEM_SPEC_GATE_DISABLED=1 node .opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs
rm -rf "$TMPDIR_A"
```

Expected: exit 0, empty stdout (allow).

10. False-positive check: classify three read-only/non-mutation prompts directly against the ESM core (via a disposable fixture dir) and confirm none open the gate:

```bash
TMPDIR_E=$(mktemp -d)
node --input-type=module -e "
import * as core from '$(pwd)/.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs';
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

11. Measure the real advise/would-deny/deny rate from this repo's own live telemetry (produced by real Claude Code sessions running this exact plugin under the project's actual `SYSTEM_SPEC_GATE_ENFORCE=0` wiring):

```bash
LOG=.opencode/skills/.state/spec-gate/spec-gate-warnings.log
wc -l "$LOG"
awk -F'|' '{gsub(/^ +| +$/,"",$5); print $5}' "$LOG" | sort | uniq -c
awk -F'|' '{gsub(/^ +| +$/,"",$3); print $3}' "$LOG" | sort | uniq -c
grep -c '| deny$' "$LOG"
```

Expected: zero `deny` lines (confirms enforce has never fired live in this project), a nonzero `would-deny` count sizing the real false-positive exposure of a future enforce flip.

12. Confirm the live wiring source of truth:

```bash
grep -n "SYSTEM_SPEC_GATE_ENFORCE" .claude/settings.json
grep -n "spec-gate-enforce.mjs\|spec-gate-classify.mjs" .claude/settings.json
```

Expected: `"SYSTEM_SPEC_GATE_ENFORCE": "0"` and both hooks wired as documented in Overview.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: Enforce-OFF never denies, enforce-ON denies exactly the non-exempt interactive case, exempt paths allow, child sessions are complete no-ops, the kill-switch is a full no-op, and both unit-test suites are green.
- **Fail**: A child emits any Gate-3 question/advisory/telemetry or denial, if an exempt path is denied, if the kill-switch does not suppress a deny, or if either unit-test suite reports a failure.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the plugin host, bridge, and core files listed in section 4 are the ones actually loaded, and that any compiled output is current.
3. Compare the observed output field by field against the expected signals in section 2, and quote the first field that disagrees.


---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- OpenCode plugin adapter: `.opencode/plugins/system-spec-gate.js`
- Plugin adapter unit test: `.opencode/plugins/tests/system-spec-gate.test.cjs`
- Runtime-neutral core: `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- Core unit test: `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs`
- Claude classify hook: `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs`
- Claude enforce hook: `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs`
- Shared Gate-3 classifier consumed by the core: `.opencode/skills/system-spec-kit/shared/dist/gate-3-classifier.js`
- Hook wiring: `.claude/settings.json` (`PreToolUse` matchers `Write|Edit` and `Bash`; `UserPromptSubmit` matcher `""`; `env.SYSTEM_SPEC_GATE_ENFORCE`)
- Deny-predicate documentation: `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md`
- Live telemetry: `.opencode/skills/.state/spec-gate/spec-gate-warnings.log` (real, project-local, gitignored state)

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: spec-mutation-gate-enforce
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/spec-mutation-gate-enforce.md
