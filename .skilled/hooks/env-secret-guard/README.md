---
title: "Env Secret Guard: Dotenv Protection on Every Runtime"
description: "One runtime-neutral guard that stops an agent from reading or writing a dotenv file through a file tool or a shell command, undoes a dotenv write a shell call made anyway and reports a dotenv value in its output, wired on all seven runtimes, with value-free ways to list keys, validate and fingerprint a dotenv file."
trigger_phrases:
  - "env secret guard"
  - "dotenv guard"
  - "block env file reads"
  - "dotenv fingerprint"
  - "ENV_SECRET_GUARD_PEPPER"
version: 1.1.0.0
---

# Env Secret Guard: Dotenv Protection on Every Runtime

---

## 1. OVERVIEW

`env-secret-guard/` keeps dotenv values out of the model's context. A dotenv file is any file named `.env` or `.env.<suffix>`, except the committed template `.env.example`. A symlink whose real target is a dotenv file counts too, and so does a hard link to one under any name.

The guard denies two kinds of call. A file tool call (read, write, edit, delete, patch or grep) is denied when any path it names is a dotenv file. A shell call is denied when a reading program such as `cat`, `grep`, `head` or `cp` is handed a dotenv file, or when a redirection reads from or writes into one. Running an app that loads its own dotenv file, such as a `node --env-file=.env` start command, stays allowed, because the values never pass through the agent's output.

An agent that needs to know what a dotenv file holds gets three answers that carry no value: the keys it defines, the lines that fail to parse, and an HMAC-SHA256 fingerprint of one value. Two equal fingerprints mean two equal values. The fingerprint is keyed by `ENV_SECRET_GUARD_PEPPER` from the environment, so a short secret cannot be brute-forced from its digest. With no pepper set, no fingerprint is produced.

The guard also judges the result of a shell call, because a call's text does not show everything it does. Before a shell call it records every dotenv file in the project, to three folders deep. After the call it puts back any that changed, were deleted or were created, and it looks for a dotenv value in the output. On OpenCode and Pi a found value is replaced before the model reads it. On the other runtimes the hook runs after the output is delivered, so it can only tell the model and the user that the value reached the session and should be rotated.

An agent may read the guard's own code but not change it: a file tool that writes under `hooks/env-secret-guard/`, or a shell redirection into it, is refused.

Every adapter fails open. A payload it cannot read, or a bug in the guard, allows the call, because a guard bug must never stop an agent from working. `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` turns the guard and the OpenCode tools off on every runtime, and so does the master switch `SYSTEM_HOOKS_DISABLED=1`. Both are read from the environment of the process that starts the runtime and nowhere else. A line in `hook-flags.env` does not switch this guard off, because that file sits in the checkout where an agent can write it.

### Architecture

```text
 Claude Code ─┐
 Codex ───────┤ stdin JSON ──▶ command-hook/env-secret-guard.cjs ─┐
 Cursor ──────┤                                                   │
 Devin ───────┘                                                   │
 OpenCode ──── .opencode/plugins/env-secret-guard.js ─────────────┤
 Pi ────────── pi/env-secret-guard.ts ────────────────────────────┼──▶ lib/env-secret-guard.cjs
 DSH ───────── dsh/env-secret-guard.mjs ──────────────────────────┤      evaluateToolCall()
 any shell ─── cli/env-secret.cjs keys|validate|fingerprint ──────┘      listKeys() validate() fingerprint()

 every adapter, after a shell call ──▶ lib/env-secret-watch.cjs  reviewToolResult()
```

Every adapter imports the core. The core imports nothing from the adapters and writes neither stdout nor stderr.

---

## 2. DIRECTORY TREE

```text
env-secret-guard/
├── lib/
│   ├── env-secret-guard.cjs        # the policy and the value-free inspection functions
│   ├── env-secret-guard.test.cjs   # core, command-hook, Pi and CLI tests
│   ├── env-secret-watch.cjs        # the after-call write check and output scan
│   └── env-secret-watch.test.cjs   # write check, output scan and after-call hook tests
├── cli/
│   └── env-secret.cjs              # keys, validate and fingerprint for any shell
├── command-hook/
│   ├── env-secret-guard.cjs        # Claude Code, Codex, Cursor and Devin, before a call
│   └── env-secret-guard-after.cjs  # the same adapter under its own path, for the after-call registration
├── pi/
│   └── env-secret-guard.ts         # linked from .pi/extensions/
├── dsh/
│   └── env-secret-guard.mjs        # linked into .dsh/plugins/repo-guards/adapters/
├── opencode/
│   └── env-secret-guard.js         # link to .opencode/plugins/env-secret-guard.js
└── tests/
    └── dsh-env-secret-guard.test.mjs
```

---

## 3. RUNTIME WIRING

| Runtime | Entry | Registered by | Tools it judges | Deny shape |
|---|---|---|---|---|
| Claude Code | `command-hook/env-secret-guard.cjs` | `hook-registry.json`, rendered into `.claude/settings.json` | `Read`, `Write`, `Edit`, `MultiEdit`, `NotebookEdit`, `Grep`, `Bash` | `permissionDecision: deny` |
| Codex | `command-hook/env-secret-guard.cjs` | `hook-registry.json`, rendered into `.codex/hooks.json` | `exec`, `Bash`, `apply_patch`, `edit`, `read_file` | `permissionDecision: deny` |
| Cursor | `command-hook/env-secret-guard.cjs` | `hook-registry.json`, rendered into `.cursor/hooks.json`, no matcher | every tool, filtered in the core | `permission: deny`, exit 2, chosen by `hook_event_name: preToolUse`, `conversation_id` or `workspace_roots` |
| Devin | `command-hook/env-secret-guard.cjs` | `hook-registry.json`, rendered into `.devin/hooks.v1.json` | `read`, `edit`, `write`, `multiedit`, `patch`, `apply_patch`, `grep`, `exec`, `bash`, `run_command` | `permissionDecision: deny` |
| OpenCode | `.opencode/plugins/env-secret-guard.js` | OpenCode's plugin folder | `read`, `write`, `edit`, `multiedit`, `patch`, `apply_patch`, `grep`, `bash` | a thrown error |
| Pi | `pi/env-secret-guard.ts` | symlink in `.pi/extensions/` | `read`, `write`, `edit`, `grep`, `bash`, `powershell` | `{ block: true, reason }` |
| DSH | `dsh/env-secret-guard.mjs` | `.dsh/plugins/repo-guards/index.mjs` | `read`, `write`, `edit`, `apply_patch`, `grep`, `bash` | `{ kind: 'deny', reason }` |

OpenCode also registers the tools `env_secret_list_keys`, `env_secret_validate` and `env_secret_fingerprint`. On the other runtimes the deny message names the CLI instead.

The after-call check runs on shell tools only.

| Runtime | After-call entry | What a finding does |
|---|---|---|
| Claude Code, Codex, Devin | `command-hook/env-secret-guard-after.cjs` as `PostToolUse` | adds the notice as `additionalContext` |
| Cursor | the same script as `postToolUse` | returns the notice as `agent_message` |
| OpenCode | `tool.execute.after` in the plugin | replaces the value in the output and appends the notice |
| Pi | `tool_result` in the extension | replaces the value in the result and appends the notice |
| DSH | `tools/post-execute` in the adapter | adds the notice as an additional context |

The Codex hook installer identifies a hook by its script path, which is why the after-call registration has its own entry file.

### Settings

| Variable | Default | Meaning |
|---|---|---|
| `SYSTEM_ENV_SECRET_GUARD_DISABLED` | unset | `1` switches the guard off. Environment only |
| `ENV_SECRET_GUARD_PEPPER` | unset | the key for fingerprints |
| `ENV_SECRET_GUARD_WRITE_CHECK` | `restore` | `report` names a changed dotenv file and leaves it as the call left it |
| `ENV_SECRET_GUARD_STATE_DIR` | `$XDG_STATE_HOME/env-secret-guard`, else `~/.local/state/env-secret-guard` | where the record and the backups live |

The record holds a backup copy of each dotenv file, so it sits outside the checkout in a folder only its owner can read. A version the guard undid is kept there under `rejected/`, so an edit you made yourself while a call was running is not lost. When a tool you run through the agent is meant to write a dotenv file, such as a command that pulls env values from a host, set `ENV_SECRET_GUARD_WRITE_CHECK=report` or run that command yourself.

A refusal and an after-call finding are also appended to `.skilled/skills/.state/env-secret-guard.log` when the project has that folder. A line holds a tool name and a path, never a value.

---

## 4. ENTRYPOINTS

```bash
node .skilled/hooks/env-secret-guard/cli/env-secret.cjs keys .env
node .skilled/hooks/env-secret-guard/cli/env-secret.cjs validate .env.local
ENV_SECRET_GUARD_PEPPER=... node .skilled/hooks/env-secret-guard/cli/env-secret.cjs fingerprint .env API_KEY
```

Each prints one JSON object. Exit 0 is an answer, 1 a refusal or a missing key, 2 bad usage. Only a dotenv file or `.env.example` inside the current directory can be inspected.

Make a pepper once with `openssl rand -base64 32` and export it from your shell profile. Never write it into a file in a repository.

---

## 5. LIMITS

- The shell rule covers the common reading programs and redirections. It is not a shell parser, so a program outside its list, `source .env` followed by printing a variable, a script that hard-codes the path, or a path only a real program prints, such as `cat $(ls | grep env)`, gets past the text check. A substitution that only echoes text, such as `$(printf .env)`, is judged by what it prints. An interpreter or a shell handed a dotenv file as an argument is refused, inline code or script file alike.
- The after-call check is what catches those routes, and it has limits of its own. A write is undone only for a shell call, only for dotenv files within three folders of the project root, and only when the record taken before the call is under an hour old. A process left running in the background can write after the check has run.
- The output scan knows a value only as the dotenv file spells it, so a value printed encoded, reversed or split is not found. It skips values shorter than 12 characters, a single plain word and a local address. On Claude Code, Codex, Cursor, Devin and DSH it reports a leak after the model has already read it.
- The rule that an agent may not change the guard covers file tools and shell redirections. A program such as `sed -i`, `cp` or `rm` aimed at the guard's folder is not judged, and nothing stops an agent from editing a runtime's hook registration.
- A grep over a directory that holds a `.env` is not judged. ripgrep skips gitignored files by default.
- A grep family program's first plain argument is its pattern, so `grep -n .env README.md` is allowed and `grep KEY .env` is not.

---

## 6. VALIDATION

```bash
node --test .skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs
node --test .skilled/hooks/env-secret-guard/lib/env-secret-watch.test.cjs
node --test .skilled/hooks/env-secret-guard/tests/dsh-env-secret-guard.test.mjs
node --test .opencode/plugins/tests/env-secret-guard.test.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

---

## 7. RELATED

- [`../README.md`](../README.md): the hooks tree and its kill-switch index.
- [`../overlay-guard/README.md`](../overlay-guard/README.md): the deny guard this one is modelled on.
- [`../../../.opencode/plugins/README.md`](../../../.opencode/plugins/README.md): the OpenCode plugin inventory.
