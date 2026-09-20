---
name: jev-cli
description: Use when classifying or scoring state with the `jev` CLI or the `jev-mcp` stdio MCP server.
version: 0.1.0
author: tumf
license: MIT
metadata:
  hermes:
    tags: [jev, cli, mcp, classification, scoring]
    related_skills: []
---

# jev-cli

## Overview

Use the `jev` command to ask TypeSafe Jev typed questions about text or JSON state. Prefer this skill when a task needs a compact machine-readable probability, one choice from explicit criteria, an ordered score, or several typed answers in one request.

The package and repository are named `jev-cli`. `uv tool install jev-cli` installs two commands: `jev` for the shell and `jev-mcp` for MCP hosts. No optional extra is required.

When the host already has the `jev` MCP server connected, call its `noul`, `choice`, `score`, or `run` tool instead of shelling out. Use the `jev` command otherwise.

Install this bundled skill with `jev install-skills`. Add `--global` for the user-wide target and `--claude` for Claude skill directories.

## Workflow

1. Confirm the command is installed with `jev --version`. If it is missing, install from the repository root with `make install`. Completion: `jev --version` exits successfully.
2. Confirm key availability with `jev auth status`, then use `jev auth test` when API validity must be verified. If absent or invalid, ask the user to configure the selected provider's API key; never print, infer, or commit it. Completion: the selected command returns `ok: true`.
3. Choose the narrowest question type:
   - `noul` for a yes/no probability.
   - `choice` for one key from explicit options.
   - `score` for an ordered numeric level.
   - `run` for a complete request object or multiple questions.
4. Send only the state needed for the judgment. The selected provider receives the submitted state and questions, so do not send secrets or private data without explicit authorization.
5. Use default JSON output for automation. Use `--value` only when a scalar is sufficient. Completion: parse the result and account for the exit code before acting on it.

Read [references/cli.md](references/cli.md) for copy-paste command forms, inputs, output controls, exit codes, and the `jev-mcp` stdio server configuration.

## Decision rules

- Give `choice` options stable keys and descriptions that make the categories mutually understandable.
- Give `score` levels in ascending order; the returned number may be fractional.
- Use `--json-state` only when the state must retain JSON structure.
- Use `@file` or stdin for long input instead of embedding it in shell arguments. These forms are CLI-only: the MCP tools send `state` verbatim, so read the file in the host and pass its content.
- The official TypeSafe API is the default. Use `--provider vercel`, `--provider openrouter`, or `--provider custom` only when the caller selects another provider.
- Use the provider-specific environment variable only for process-level overrides: `TYPESAFE_API_KEY`, `AI_GATEWAY_API_KEY`, `OPENROUTER_API_KEY`, or `JEV_API_KEY`. A custom provider also requires `JEV_ENDPOINT`; `JEV_MODEL` is optional. The normal credential store remains under the user's config directory.
- Treat model output as a structured judgment, not verified fact. Keep consequential actions behind the caller's own validation and authorization rules.

## Common pitfalls

1. **Calling the executable `jev-cli`.** The package is `jev-cli`, but the executables are `jev` and `jev-mcp`.
2. **Using `--value` with `run`.** Batched requests require the JSON response.
3. **Treating transport failures as negative answers.** Exit code `4` means retryable API or network failure, not a model judgment.
4. **Leaking state through convenience.** Inspect file and stdin content before submission when it may contain credentials or private records.
5. **Embedding an API key in examples.** Use `jev auth set` through stdin or the environment variable without writing its value into scripts or documentation.
6. **Running `jev-mcp` by hand.** Its stdin and stdout carry MCP protocol frames; start it only from an MCP host configuration.

## Verification checklist

- [ ] `jev --version` succeeds.
- [ ] `jev auth status` or `jev auth test` succeeds without exposing the key.
- [ ] The selected question type matches the desired answer shape.
- [ ] Submitted state contains no unauthorized secret or private data.
- [ ] The caller handles JSON and nonzero exit codes.
- [ ] Consequential follow-up actions retain their own authorization checks.
