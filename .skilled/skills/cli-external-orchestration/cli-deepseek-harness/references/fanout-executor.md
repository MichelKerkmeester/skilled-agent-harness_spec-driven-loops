---
title: "DeepSeek Harness - Fan-Out Executor"
description: "The cli-deepseek-harness executor kind in the shared deep-loop runner: its lineage command, env allowlist, per-lineage DSH_HOME, recursion refusal, result validation and why it remains experimental while OpenCode Go is unverified."
trigger_phrases:
  - "dsh fan-out executor"
  - "dsh lineage command"
  - "cli-deepseek-harness executor kind"
  - "dsh env allowlist"
  - "dsh deep-loop lineage"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# DeepSeek Harness - Fan-Out Executor

Open this file before asking the deep-loop runtime to run a dsh lineage. The kind is registered and kept out of every default allowlist, so a dsh lineage runs only when a caller names it.

---

## 1. OVERVIEW

### Purpose

Describes how the shared runner builds, runs and judges a dsh lineage, so a caller knows what the runner owns and what this packet must never duplicate.

### When to Use

- Asking the deep-loop runtime to run a dsh lineage.
- Reviewing the executor kind's argv, environment or result check.
- Explaining what the runner refuses before it spawns a dsh lineage.

### Status

`cli-deepseek-harness` is in `EXECUTOR_KINDS`, and `buildDshLineageCommand` builds its command. `EXPERIMENTAL_EXECUTOR_KINDS` lists it for information only. LLM Gateway `deepseek-v4.1-flash-1017` completed a keyed lineage and is the default model. OpenCode Go `deepseek-v4.1-flash` is configured, not verified, and stays out of defaults because no request was sent for it. This packet must not add a wrapper, spawn path or command builder of its own.

---

## 2. LINEAGE COMMAND

The runner builds this shape for each dsh lineage (research synthesis section 9.9):

```text
cwd   = the lineage directory
env   = the allowlist + DSH_HOME=<system temp>/dsh-home-* (removed after the lineage) + the route's key variable
argv  = dsh --profile headless
          --patch <repo>/.dsh/patches/<route>.patch.yml
          --patch <repo>/.dsh/patches/lineage.patch.yml
          [--patch <repo>/.dsh/agents/<persona>.patch.yml]
          --patch <repo>/.dsh/patches/guards.patch.yml
          [--patch <repo>/.dsh/patches/mcp-code-mode.patch.yml]
          --json --permission-mode <read-only|workspace-write> --approval-policy never -
stdin = the prompt, then closed
```

`<route>` is the patch the model selects (section 5), and `<persona>` appears only when the lineage names one. The guards patch is required rather than optional: the builder refuses a lineage when the bundle is missing, so no dsh lineage starts unguarded (see [guards-and-hooks.md](./guards-and-hooks.md)). The MCP patch appears only for a lineage that names `code_mode`. The cwd is the lineage directory, never the repository root, which keeps the root `.env` out of the run.

### What the Runner Owns

1. Probe `command -v dsh` and `dsh --version`, and refuse anything but the pinned version. The version probe runs in a throwaway home outside the checkout, because even a probe creates harness state.
2. Create `dsh-home-*` in the system temp folder, outside the checkout, set `DSH_HOME` to it and set the child cwd to the lineage directory. The home is removed once the lineage settles.
3. Pass the route, lineage and guards patches explicitly, plus a persona patch when one is named and the MCP patch when `code_mode` is named.
4. Pass only allowlisted environment variable names, then add `DSH_HOME` after the filter.
5. Write the prompt to stdin after `-`, close stdin, enforce `timeoutSeconds` and keep stdout and stderr apart.
6. Fail on a non-zero exit, a `did not activate` line on stderr, an `error` event, a last line that is not a parseable `final`, or a final reason other than `completed`. The stderr check runs after the run ends, so a lineage whose guards failed to load has already executed unguarded by the time it is marked failed. A preflight boot would double every lineage's startup, so this is an accepted gap, kept small by the guards-patch rule and the bundle tests.
7. Run the existing containment scan and fail closed on a write outside the lineage.
8. Record the executable version and the invocation fingerprint before dispatch, and the attempt outcome after it.

The harness has no turn or time budget in headless, so the runner's timeout is the only bound. The harness bash tool has its own 60 s per-call timeout, which bounds one command, not the run.

---

## 3. ENVIRONMENT ALLOWLIST

| Entry | Why |
|---|---|
| Prefix `LLMGATEWAY_` | The LLM Gateway route's key, the precedent cli-pi and cli-hermes already use |
| Single key `OPENCODE_API_KEY` | The OpenCode Go route's key |

Every kind also passes the common set: `PATH`, `HOME`, `LANG`, `TMPDIR`, `NODE_PATH`, `TERM`, `USER`, `LOGNAME`, `__CF_USER_TEXT_ENCODING`, `SYSTEM_SPEC_GATE_ENFORCE`, `AI_SESSION_CHILD` and any `LC_*` key. `DSH_HOME` is not in that set on purpose. The runner gives every lineage a fresh home and adds it after the filter, so an inherited one cannot point a leaf at the operator's harness state. The same pass sets the lineage markers the child needs, including `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` and `SYSTEM_SPEC_GATE_DISABLED`.

Two entries are refused:

- **`DEEPSEEK_` prefix.** It would let `DEEPSEEK_API_KEY` through, and the composed config's DeepSeek web search and fetch rows read that key, which switches the official route back on.
- **`DSH_` prefix.** A blanket prefix would carry deployment knobs nobody reviewed.

---

## 4. RECURSION AND STATE

- **Recursion.** The audit maps the kind to the executable `dsh` and grants no self-presence exemption. Pi's exemption exists because Pi has no in-process delegation, and dsh delegates in process through its own subagent tools.
- **State environment.** A dsh dispatch is refused at the `env` layer when `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` or `DSH_HOME` is already set and non-empty, which is how a nested dsh dispatch meets the guard before a spawn.
- **Self-detection.** No environment marker that a dsh child sets for itself is known. Whether one exists is UNKNOWN, so the dispatch stack, process ancestry, the state environment and the lockfile check, not a dsh-specific probe, are what refuse a nested dsh dispatch.
- **State.** The runner's state-env map pairs `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` with `DSH_HOME`, and its default-home map names `.dsh`.

---

## 5. FLAG SUPPORT IN THE EXECUTOR CONFIG

| Executor field | dsh mapping |
|---|---|
| `model` | Selects one of two route patches. `deepseek-v4.1-flash-1017` maps to `route-llmgateway-deepseek.patch.yml`, `deepseek-v4.1-flash` to `route-opencode-go-deepseek.patch.yml`, and any other id is refused |
| `reasoningEffort` | Pinned to `max` for both dsh models. The Gateway route accepted `max` in the saved run. OpenCode Go has not been called, so its support remains unverified |
| `timeoutSeconds` | Runner-owned, dsh has no timeout option |
| `agentPersona` | Selects `.dsh/agents/<persona>.patch.yml`, which the builder requires to exist |
| Preventive sandbox capability | True for the observed dsh `workspace-write` boundary: a file write under `$HOME` outside the cwd was denied. OS temp paths remain writable, including another lineage's disposable `DSH_HOME`, so separate temp homes are not an enforced boundary between lineages |
| MCP capability | `code_mode` only, and only with the MCP patch (see [mcp.md](./mcp.md)) |

The effort value is recorded in the invocation metadata rather than passed on argv, because dsh takes no effort flag.

---

## 6. SINGLE DISPATCHES

The runner accepts research and review lineages. A single build or doc dispatch composes the shape in [cli-reference.md](./cli-reference.md) section 5 from a scratch cwd, with the same hard rules, and validates the `final` event the same way.

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) - the flags and the exit contract the runner reads.
- [providers-and-models.md](./providers-and-models.md) - the roster the `model` field selects from.
- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - the patches the argv names.
- [guards-and-hooks.md](./guards-and-hooks.md) - the bundle the required guards patch loads.
