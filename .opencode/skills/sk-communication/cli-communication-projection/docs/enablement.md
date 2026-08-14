# Enablement

## 1. OVERVIEW

Projection is OFF by default for everyone. Pulling the repository never changes
anyone's CLI output. Nothing is rewritten until an operator opts in on their own
machine, and that choice is never committed for other people.

Two opt-in sources decide enablement, checked in this order:

1. The environment variable `COMMUNICATION_PROJECTION_ENABLED`.
2. The git-ignored `enablement.local.json` at the package root, consulted only when the variable is unset.

A set variable always wins. With neither source opting in, enablement is false.
Every activation path calls `isProjectionEnabled()` before it projects, and a
false answer returns the exact original output.

This guide covers the opt-in sources, the per-machine privacy boundary, the
OpenCode plugin setup and the wrapper runtime launch commands for Claude Code,
Codex, Pi, Devin and Cursor.

---

## 2. OPT-IN SOURCES

### The environment variable

Set `COMMUNICATION_PROJECTION_ENABLED` to `1`, `true` or `on` to enable
projection. Any other set value keeps it off. A set variable always wins, which
lets CI and tests force either state.

```sh
export COMMUNICATION_PROJECTION_ENABLED=1
```

To keep a machine off from the shell, set the variable to `0`, `false` or `off`.
A set variable wins over the local file, so CI can force either state without
touching the file.

### The local override file

The git-ignored `enablement.local.json` lives at the package root. It opts in
when it holds `{ "enabled": true }`. The gate reads it only when the variable is
unset.

```json
{
  "enabled": true
}
```

The committed `enablement.local.json.example` shows the file shape, and the
package `.gitignore` ignores the real file so a private opt-in stays local.

### The optional localProvider block

The same file can name a local model for projection to call. Add a
`localProvider` object next to `enabled: true`, with a `kind`, a `model`,
and an optional `endpoint`:

```json
{
  "enabled": true,
  "localProvider": {
    "kind": "ollama",
    "model": "llama3.2"
  }
}
```

Four kinds are supported: `ollama`, `lmstudio`, `llama.cpp`, and
`openai-compatible`. Each kind has a default endpoint, so you can omit
`endpoint` and let the loader use the default for that kind:

- `ollama` defaults to `http://127.0.0.1:11434/api/chat`.
- `lmstudio` defaults to `http://127.0.0.1:1234/v1/chat/completions`.
- `llama.cpp` and `openai-compatible` default to
  `http://127.0.0.1:8080/v1/chat/completions`.

Set `endpoint` explicitly to point at a server that listens elsewhere. For a
local LM Studio server on its default port, write:

```json
{
  "enabled": true,
  "localProvider": {
    "kind": "lmstudio",
    "model": "qwen2.5-7b-instruct",
    "endpoint": "http://localhost:1234/v1"
  }
}
```

That single write is enough. The loader turns the block into a local provider
record, a local-only privacy policy, a required judge, a local HTTP transport,
and the shipped copy-editing prompt. Both entry points then activate on their
own for the next message or launch.

A missing or malformed `localProvider` fails closed. The loader returns no
config, and both entry points emit the byte-exact original, exactly as they do
when enablement is off.

---

## 3. PRECEDENCE AND PRIVACY BOUNDARY

The variable wins over the local file. Set a variable to keep a machine off even
when the local file opts in, and unset it to let the local file decide. The
decision itself is the pure function `resolveProjectionEnablement(env,
localOverride)`, so the rule is exhaustively testable without touching the disk.

The local override is private per machine. It is git-ignored, so enabling it on
your machine never changes another machine's output and never commits the choice
for others. Treat the file as a local boundary: keep it out of commits, out of
shared image layers and out of backup snapshots that others can read.

---

## 4. PREREQUISITES

Use Node.js 22 or newer and npm 10 or newer. Install only a reviewed, exact
package version or tarball. Do not install a moving tag in a release workflow.

Run the compatibility doctor from [configuration.md](./configuration.md) before
enabling any route. Treat a blocked report as original-only and a degraded
report as requiring explicit operator review. Confirm the privacy route, the
provider records and the freshness facts before the first projected run.

---

## 5. OPENCODE PLUGIN SETUP

OpenCode projects through the native hook in
`.opencode/plugins/mk-communication-projection.js`. The plugin registers the
`chat.message` hook and, when the projection is opted in and the hook is not
killed, replaces the assistant text parts with the projected text.

To enable it:

1. Confirm the plugin file exists at
   `.opencode/plugins/mk-communication-projection.js`.
2. Set `COMMUNICATION_PROJECTION_ENABLED=1` for the OpenCode session. Or write
   the git-ignored local override file.
3. Leave `MK_COMMUNICATION_PROJECTION_DISABLED` unset.
4. Launch OpenCode and send a message.

The per-plugin kill-switch is `MK_COMMUNICATION_PROJECTION_DISABLED=1`. Set it
to disable the hook class without touching the enablement file. With the flag
off or with the kill-switch set, the hook leaves the original parts untouched
and renders the byte-exact original. The plugin writes no standard output and no
standard error.

---

## 6. WRAPPER RUNTIME SETUP

Every runtime without a native hook projects through the CLI-output wrapper at
`bin/cli-output-wrapper.mjs` in the package directory. The launcher runs a
target command, captures its assistant output and renders the projection or the
byte-exact original.

Usage:

```sh
bin/cli-output-wrapper.mjs <runtime> [-- <command...>]
bin/cli-output-wrapper.mjs --list
```

`--list` prints every wrapper runtime with its launch mode and path identifier.
Run each runtime through its documented non-interactive command:

| Runtime | Launch command | Mode |
| --- | --- | --- |
| claude | `claude -p --output-format stream-json` | headless |
| codex | `codex exec --json` | stream |
| pi | pi print mode | print |
| devin | `devin -p` | stream |
| cursor | cursor-agent non-interactive | stream |

Example:

```sh
bin/cli-output-wrapper.mjs claude -- claude -p --output-format stream-json "Describe the error."
```

When projection is disabled or the stream is not projectable, the launcher
prints the byte-exact original and passes the target exit code through. The
wrapper never rewrites canonical transcripts, events, tool inputs or tool
results.

---

## 7. VERIFY ENABLEMENT

Enable one runtime and confirm one of two outcomes. With projection on and the
route approved, the assistant output shows the projected text. With projection
off, a failed gate or an incapable runtime, the output is byte-identical to the
original.

The launcher states its resolution on standard error, including the runtime, the
launch mode, the path identifier and the pass-through reason. Read that line
before trusting a projection. Confirm the canonical transcript, events, tool
inputs and tool results are unchanged.

---

## 8. RELATED RESOURCES

- [Configuration](./configuration.md)
- [Install and verify](./install.md)
- [Privacy modes](./privacy.md)
- [Rollout runbook](./runbook.md)
- [Rollback](./rollback.md)
