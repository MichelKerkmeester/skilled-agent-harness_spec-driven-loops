---
title: "CLI Dispatch Audit Trail"
description: "Manual scenario validating the mk-cli-dispatch-audit plugin and Claude hook twin."
trigger_phrases:
  - "mk-cli-dispatch-audit"
  - "cli dispatch audit"
  - "dispatch audit trail"
  - "cli-dispatch-audit-trail"
version: 1.0.0.0
---

# CLI Dispatch Audit Trail

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-cli-dispatch-audit` is a purely observational, fail-open telemetry surface that records completed `opencode run` / `claude -p` CLI dispatches to a redacted, size-rotated JSONL log. It ships as two thin transport adapters over one runtime-neutral core:

- OpenCode plugin adapter: `.opencode/plugins/mk-cli-dispatch-audit.js` (`tool.execute.after` on `bash` tool calls).
- Claude PostToolUse(Bash) hook adapter: `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs` (reads the PostToolUse JSON payload from stdin, normalizes Claude's `Bash` tool-name casing against OpenCode's lowercase `bash`).
- Shared core: `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.mjs` (`recordDispatch` / `matchDispatchShape` / `extractDispatchMeta` / `buildAuditLine` / `appendAuditLog`), which recognizes a dispatch shape via the `DISPATCH_SHAPES` registry (`opencode run`, `claude -p|--print`), pulls best-effort `--model` / `--agent` hints plus duration/exit/size hints out of the command and transport metadata, scrubs secret-shaped spans (API keys, bearer/basic headers, colon-form credential headers, provider key prefixes such as `sk-`/`ghp_`/`AKIA`), truncates the command to 500 chars, and appends one JSONL line to `.opencode/logs/cli-dispatch-audit.log`, rotating it to a `.1` backup at 512 KiB. The `DISPATCH_SHAPES` registry is the single source of truth shared with the sibling PreToolUse preflight lint (`dispatch-preflight-lint.mjs`), so the two can never disagree about what counts as a dispatch. Every exported function fails open (never throws past its own boundary), and both adapters never write to stdout/stderr and never block or alter the observed tool call. Per the plugin's own header comment, this surface is currently latent: no consumer reads the log yet.

This scenario validates: the shared core's unit-test suite (real, isolated vitest run); a live in-process invocation of the OpenCode plugin's `tool.execute.after` hook against a scratch project directory; a live stdin invocation of the Claude PostToolUse(Bash) hook adapter against a scratch project directory, exactly as `.claude/settings.json` wires it; the kill-switch (`MK_CLI_DISPATCH_AUDIT_DISABLED`) forcing a full no-op; and a non-dispatch Bash command (`git status`) fast-exiting without writing anything.

---

## 2. SCENARIO CONTRACT

- Preconditions: `.opencode/plugins/mk-cli-dispatch-audit.js`, `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs`, and `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.mjs` all exist (confirmed via Read, see Section 5). `.claude/settings.json` wires a `PostToolUse` hook with `matcher: "Bash"` to the Claude adapter. Node is on `PATH`; `npx vitest` is resolvable for the core's `.test.mjs` suite.
- Real user-facing trigger: an agent (Claude Code or OpenCode) runs a Bash tool call whose command matches an `opencode run` or `claude -p` / `claude --print` dispatch shape -- the same shape the `cli-external` hub's `cli-opencode` / `cli-claude-code` modes compose.
- Expected signals: the isolated core unit-test run reports `Test Files 1 passed (1)` and `Tests 38 passed (38)`; a live OpenCode plugin `tool.execute.after` invocation against a scratch project directory writes exactly one redacted JSONL line with `schema_version:1`, the matched `skill`, parsed `model`/`target`, and any secret-shaped span replaced with `[REDACTED]`; a live Claude hook stdin invocation against a separate scratch project directory writes an equivalent redacted line; the kill-switch env var (`MK_CLI_DISPATCH_AUDIT_DISABLED=1`) suppresses the write entirely (no log file created); a non-dispatch command (`git status`) is fast-exited with no log file created.
- Desired user-visible outcome: a concise pass/fail verdict citing the exact captured command output, with no fabricated JSON.
- Pass/fail: PASS if the core unit suite passes in full, both adapters write a correctly redacted line for a real dispatch-shaped command, the kill-switch fully suppresses the write, and a non-dispatch command produces no write. FAIL if any assertion fails, if a secret-shaped span survives unredacted in the written line, if the kill-switch is ignored, if a non-dispatch command still produces a write, or if either adapter throws instead of failing open.

---

## 3. TEST EXECUTION

### Commands

1. Run the shared core's unit-test suite in isolation (scoped to avoid picking up stale worktree copies of the same file):

```bash
npx vitest run --root .opencode/skills/cli-external/cli-opencode/scripts/lib dispatch-audit.test.mjs --reporter=verbose
```

2. Live-invoke the Claude PostToolUse(Bash) hook adapter via stdin against a scratch project directory, with a dispatch command carrying an embedded secret flag:

```bash
SCRATCH_DIR="$(mktemp -d)/claude-sim"
mkdir -p "$SCRATCH_DIR"
PAYLOAD='{
  "session_id": "sess-live-001",
  "tool_name": "Bash",
  "tool_use_id": "call-live-001",
  "cwd": "'"$SCRATCH_DIR"'",
  "tool_input": { "command": "opencode run --model gpt-5.5 --agent orchestrate \"do the task\" --api-key sk-liveSuperSecretDemoKey1234567890" },
  "tool_response": { "stdout": "task complete", "stderr": "", "durationMs": 842, "exitCode": 0 }
}'
printf '%s' "$PAYLOAD" | node .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs
echo "exit: $?"
cat "$SCRATCH_DIR/.opencode/logs/cli-dispatch-audit.log"
```

3. Live-invoke the OpenCode plugin's `tool.execute.after` hook in-process against a separate scratch project directory (an explicit `directory` is passed so the write never lands in the real repo's log):

```bash
SCRATCH_DIR2="$(mktemp -d)/opencode-sim"
mkdir -p "$SCRATCH_DIR2"
SCRATCH_PROJECT_DIR="$SCRATCH_DIR2" node --input-type=module -e '
import plugin from "./.opencode/plugins/mk-cli-dispatch-audit.js";
const hooks = await plugin({ directory: process.env.SCRATCH_PROJECT_DIR });
const input = {
  tool: "bash",
  sessionID: "sess-oc-live-002",
  callID: "call-oc-live-002",
  args: { command: "claude -p \"summarize this repo\" --model sonnet-5 Authorization: Bearer abcdefLIVEBEARER123456" },
};
const output = { output: "summary produced", metadata: { durationMs: 311, exitCode: 0 } };
await hooks["tool.execute.after"](input, output);
console.log("plugin hook invoked without throwing");
'
cat "$SCRATCH_DIR2/.opencode/logs/cli-dispatch-audit.log"
```

4. Kill-switch check -- expect no log file created even for a real dispatch-shaped payload:

```bash
SCRATCH_DIR3="$(mktemp -d)/kill-switch"
mkdir -p "$SCRATCH_DIR3"
PAYLOAD3='{"session_id":"sess-kill-003","tool_name":"Bash","tool_use_id":"call-kill-003","cwd":"'"$SCRATCH_DIR3"'","tool_input":{"command":"opencode run --model gpt-5.5 \"x\""},"tool_response":{"stdout":"ok","exitCode":0}}'
printf '%s' "$PAYLOAD3" | MK_CLI_DISPATCH_AUDIT_DISABLED=1 node .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs
ls "$SCRATCH_DIR3/.opencode/logs/cli-dispatch-audit.log" 2>&1 || echo "no log file created"
```

5. Non-dispatch command fast-exit check -- expect no log file created:

```bash
SCRATCH_DIR4="$(mktemp -d)/non-dispatch"
mkdir -p "$SCRATCH_DIR4"
PAYLOAD4='{"session_id":"sess-nd-004","tool_name":"Bash","tool_use_id":"call-nd-004","cwd":"'"$SCRATCH_DIR4"'","tool_input":{"command":"git status"},"tool_response":{"stdout":"clean","exitCode":0}}'
printf '%s' "$PAYLOAD4" | node .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs
ls "$SCRATCH_DIR4/.opencode/logs/cli-dispatch-audit.log" 2>&1 || echo "no log file created"
```

### Expected

- Step 1: `Test Files 1 passed (1)`, `Tests 38 passed (38)`, no failures.
- Step 2: exit 0; one JSONL line with `runtime:"claude"`, `skill:"cli-opencode"`, `model:"gpt-5.5"`, `target:"orchestrate"`, `durationMs:842`, `exitCode:0`, and the `--api-key` value replaced with `[REDACTED]`.
- Step 3: `plugin hook invoked without throwing`; one JSONL line with `runtime:"opencode"`, `skill:"cli-claude-code"`, `model:"sonnet-5"`, `durationMs:311`, `exitCode:0`, and the bearer token replaced with `[REDACTED]`.
- Step 4: no `.opencode/logs/cli-dispatch-audit.log` file exists under the scratch directory.
- Step 5: no `.opencode/logs/cli-dispatch-audit.log` file exists under the scratch directory.

---

## 4. EVIDENCE

Core unit-test suite, isolated to the canonical file (excludes stale `.worktrees/*` copies of the same test):

```bash
npx vitest run --root .opencode/skills/cli-external/cli-opencode/scripts/lib dispatch-audit.test.mjs --reporter=verbose
```

```text
✓ dispatch-audit.test.mjs > matchDispatchShape > recognizes an opencode run dispatch 1ms
✓ dispatch-audit.test.mjs > matchDispatchShape > recognizes a claude -p / --print dispatch 0ms
✓ dispatch-audit.test.mjs > matchDispatchShape > fast-exits non-dispatch bash commands 0ms
✓ dispatch-audit.test.mjs > matchDispatchShape > fast-exits non-string or empty input without throwing 0ms
✓ dispatch-audit.test.mjs > DISPATCH_SHAPES > exposes the skill + packetPath pairs the preflight lint twin resolves SKILL.md from 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > parses --model and --agent flags from the command text 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > reads duration/exit hints from an opaque metadata object, defensively 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > computes outputBytes from outputText when present 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > degrades every field to null when metadata is missing entirely 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > never throws on a non-string command or a malformed meta object 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > does not misreport a null exitCode as 0 when a later candidate holds the real value 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > does not misreport a null durationMs as 0 when a later candidate holds the real value 0ms
✓ dispatch-audit.test.mjs > extractDispatchMeta > still falls through to null when every duration/exit candidate is null or undefined 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > produces exactly one parseable JSON line with the expected fields 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > truncates a multi-KB command to the fixed cap and marks it truncated 1ms
✓ dispatch-audit.test.mjs > buildAuditLine > leaves embedded newlines inside a single valid JSON line (no raw line breaks in the file) 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs secret-shaped flags, env assignments, bearer tokens, and provider key prefixes 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > degrades to null on an unserializable record rather than throwing 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > handles an empty/non-string command without throwing 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs lowercase and camelCase secret-named env-var assignments 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs underscore-delimited live/test provider key formats 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs a quoted multi-word secret flag value in full 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs a secret-shaped model field before serialization 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs a quoted multi-word env-assignment secret value in full 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs a colon-form header credential (x-api-key: <value>) 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs an Authorization: Basic <b64> header alongside the existing Bearer form 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > scrubs a bare Authorization header value with no Bearer/Basic scheme 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > truncates an oversized target field before serialization 0ms
✓ dispatch-audit.test.mjs > buildAuditLine > leaves a normal short model/target field untouched 0ms
✓ dispatch-audit.test.mjs > appendAuditLog > writes exactly one parseable JSONL line to a fresh log 1ms
✓ dispatch-audit.test.mjs > appendAuditLog > rotates the primary log to a .1 backup once the size cap is reached 1ms
✓ dispatch-audit.test.mjs > appendAuditLog > is fail-open: an unwritable log path returns false without throwing 1ms
✓ dispatch-audit.test.mjs > appendAuditLog > returns false for empty/invalid inputs without throwing 0ms
✓ dispatch-audit.test.mjs > isAuditDisabled > is true only when the kill-switch env var is exactly "1" 0ms
✓ dispatch-audit.test.mjs > recordDispatch > matches a dispatch and writes one audit line end-to-end 1ms
✓ dispatch-audit.test.mjs > recordDispatch > returns false and writes nothing for a non-dispatch command 0ms
✓ dispatch-audit.test.mjs > recordDispatch > honors the kill-switch env var as a full no-op 0ms
✓ dispatch-audit.test.mjs > recordDispatch > never throws even when the log path is unwritable 0ms

Test Files  1 passed (1)
     Tests  38 passed (38)
```

Live Claude PostToolUse(Bash) hook adapter, stdin invocation against a scratch project directory (real command run, real file written, then read back):

```bash
printf '%s' "$PAYLOAD" | node .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs
```

```text
adapter exit code: 0
```

Written log line (read back from `$SCRATCH_DIR/.opencode/logs/cli-dispatch-audit.log`):

```json
{"schema_version":1,"ts":"2026-07-11T12:41:10.697Z","runtime":"claude","sessionID":"sess-live-001","callID":"call-live-001","skill":"cli-opencode","command":"opencode run --model gpt-5.5 --agent orchestrate \"do the task\" --api-key [REDACTED]","commandTruncated":false,"model":"gpt-5.5","target":"orchestrate","durationMs":842,"exitCode":0,"outputBytes":14}
```

The `--api-key sk-liveSuperSecretDemoKey1234567890` span was fully replaced with `[REDACTED]`; `model`, `target`, `durationMs`, and `exitCode` were correctly extracted from the command text and `tool_response` metadata.

Live OpenCode plugin `tool.execute.after` hook, in-process invocation against a separate scratch project directory:

```text
plugin hook invoked without throwing
```

Written log line (read back from the scratch directory's `.opencode/logs/cli-dispatch-audit.log`):

```json
{"schema_version":1,"ts":"2026-07-11T12:41:23.031Z","runtime":"opencode","sessionID":"sess-oc-live-002","callID":"call-oc-live-002","skill":"cli-claude-code","command":"claude -p \"summarize this repo\" --model sonnet-5 Authorization: Bearer [REDACTED]","commandTruncated":false,"model":"sonnet-5","target":null,"durationMs":311,"exitCode":0,"outputBytes":16}
```

The `Authorization: Bearer abcdefLIVEBEARER123456` header was fully replaced with `Authorization: Bearer [REDACTED]`; `runtime` correctly reads `"opencode"` (the plugin's own literal, distinct from the Claude adapter's `"claude"`), and `skill` correctly resolved to `cli-claude-code` from the `claude -p` shape.

Kill-switch check (`MK_CLI_DISPATCH_AUDIT_DISABLED=1`), real dispatch-shaped payload:

```text
adapter exit code: 0
ls: <scratch>/.opencode/logs/cli-dispatch-audit.log: No such file or directory
CONFIRMED: no log file created (kill-switch honored)
```

Non-dispatch command fast-exit check (`git status`):

```text
adapter exit code: 0
ls: <scratch>/.opencode/logs/cli-dispatch-audit.log: No such file or directory
CONFIRMED: no log file created (non-dispatch command ignored)
```

Bonus live corroboration of the shared `DISPATCH_SHAPES` registry: while running the commands above, the sibling PreToolUse preflight lint hook (`dispatch-preflight-lint.mjs`, wired in `.claude/settings.json` for every `Bash` call) fired its own real, unprompted advisories against this session's actual Bash invocations, because the printed test payloads embedded the literal strings `opencode run` and `claude -p`:

```text
PreToolUse:Bash hook additional context: cli-opencode dispatch hard-rule advisory:
  [stdin-redirect-required] Ad-hoc `opencode run` MUST close/redirect stdin (`</dev/null`) -- omitting it can hang indefinitely at 0% CPU with zero output.

PreToolUse:Bash hook additional context: cli-claude-code dispatch hard-rule advisory:
  [non-interactive-permission-mode-risk] Non-interactive `claude -p` with acceptEdits + no TTY + a Bash-heavy prompt can deadlock on an unanswerable shell-permission prompt; run it sandboxed with `--dangerously-skip-permissions` or ensure the prompt needs no shell approval.
```

This is real, unmocked confirmation that the same `DISPATCH_SHAPES` regex table the dispatch-audit core exports is live and actively evaluated by its sibling preflight lint in this exact runtime, exactly as the core's own header comment claims ("shared with the PreToolUse preflight lint... so the two can never disagree").

---

## 5. SOURCE FILES

- OpenCode plugin adapter: `.opencode/plugins/mk-cli-dispatch-audit.js`
- Claude PostToolUse(Bash) hook adapter: `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-audit-posttooluse.mjs`
- Runtime-neutral shared core: `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.mjs`
- Core unit-test suite: `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-audit.test.mjs`
- Sibling PreToolUse preflight lint (shares `DISPATCH_SHAPES`): `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs`
- Hook wiring: `.claude/settings.json` (`PostToolUse` matcher `"Bash"`)
- Plugin registry note: `.opencode/plugins/README.md` (confirms the plugin's documented behavior matches source)
- Log path (gitignored, size-rotated at 512 KiB to a `.1` backup): `.opencode/logs/cli-dispatch-audit.log`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: cli-dispatch-audit-trail
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins_and_hooks/cli_dispatch_audit_trail.md

---

## 7. PASS/FAIL

**PASS**

The shared core's unit-test suite passed 38/38 in an isolated run scoped to the canonical file. A live in-process invocation of the OpenCode plugin's `tool.execute.after` hook against a scratch project directory wrote exactly one correctly redacted JSONL line (`schema_version:1`, `runtime:"opencode"`, `skill:"cli-claude-code"`, model/target parsed, bearer token redacted). A live stdin invocation of the Claude PostToolUse(Bash) hook adapter against a separate scratch project directory, run exactly as `.claude/settings.json` wires it, wrote an equivalent correctly redacted line (`runtime:"claude"`, `skill:"cli-opencode"`, API-key flag redacted). The kill-switch env var (`MK_CLI_DISPATCH_AUDIT_DISABLED=1`) fully suppressed the write, and a non-dispatch command (`git status`) produced no log file, confirming the fast-exit path. Both adapters ran to completion without throwing, matching the plugin's fail-open design. No fabricated output was used anywhere above; every JSON line shown was written by a real process invocation and read back from disk.
