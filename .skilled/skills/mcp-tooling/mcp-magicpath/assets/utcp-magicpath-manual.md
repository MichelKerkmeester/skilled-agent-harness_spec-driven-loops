---
title: "MagicPath Code Mode Manual - verified snippet"
description: "The EXISTING validated magicpath .utcp_config.json manual entry (already registered: verify, do not re-add, do not edit), plus the env-var wiring and the exec-wrapper behavior, verbatim and marked read-only-by-registration."
trigger_phrases:
  - "magicpath utcp config"
  - "magicpath manual snippet"
  - "magicpath cli manual"
  - "magicpath env var"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# MagicPath Code Mode Manual - verified snippet

Verified snapshot of the registered MagicPath Code Mode manual.

## 1. OVERVIEW

### Purpose

The `magicpath` manual entry as it exists in this repo's `.utcp_config.json`, plus the env-var wiring and the exec-wrapper behavior. This asset exists so the wiring can be **verified** without opening the whole config.

### Usage

Use the snapshot to verify the live manual read-only. Treat the env-var wiring as the operator-selected credential path; never paste a token literal into calls, skill files, or the base manual.

---

## 2. THE REGISTERED MANUAL (ALREADY REGISTERED — VERIFY, DO NOT RE-ADD)

**Key Points**:
- This entry is **already present** in `manual_call_templates[]` of `.utcp_config.json` and is **validated as-is**. Verify its presence read-only (grep); never re-add it, never edit it, never add a second MagicPath manual.
- Manual `name` is `magicpath`, so callables resolve as `magicpath.<tool>` (Code Mode's `{manual}.{tool}` rule applied once, because the tool names have no `magicpath_` prefix of their own), and env vars are prefixed `magicpath_<NAME>`.
- Transport is `cli`: the manual command runs `node .opencode/bin/magicpath-utcp-manual.cjs`, which prints the UTCP manual listing the fourteen read-only tools. Each tool call is executed by `node .opencode/bin/magicpath-utcp-exec.cjs`, which shells out to the `magicpath-ai` binary.
- The `env_vars` block maps the CLI's `MAGICPATH_TOKEN` to `${magicpath_MAGICPATH_TOKEN}`, so the token is set in `.env` as `magicpath_MAGICPATH_TOKEN` and exposed to the CLI as `MAGICPATH_TOKEN`.
- The registered surface is **read-only on purpose**. The CLI can also write `.tsx` files, install npm packages, and create remote projects and component revisions (`add`, `code`, `image`, `create-project`, `clone`), but those are deliberately not registered. See [`../references/mutation-boundary.md`](../references/mutation-boundary.md).

**Snapshot** (byte-preserved from `.utcp_config.json`):

```json
{
    "name": "magicpath",
    "call_template_type": "cli",
    "commands": [
        {
            "command": "node .opencode/bin/magicpath-utcp-manual.cjs",
            "append_to_final_output": true
        }
    ],
    "env_vars": {
        "MAGICPATH_TOKEN": "${magicpath_MAGICPATH_TOKEN}"
    }
}
```

If this snapshot and the live `.utcp_config.json` ever disagree, **the live config wins** and this asset must be re-synced from it; never the other way around.

---

## 3. ENV-VAR WIRING

**Key Points**:
- The credential is `magicpath-ai login` (browser, operator-only) or the `MAGICPATH_TOKEN` environment variable.
- Under Code Mode, env vars are prefixed with the manual name (`magicpath_<NAME>`), so the token is set in `.env` as `magicpath_MAGICPATH_TOKEN`. The manual's `env_vars` block maps it to the CLI's `MAGICPATH_TOKEN`.
- Never put a token literal into calls, skill files, or the base manual.
- How an operator obtains a MagicPath token is UNKNOWN (account/dashboard access required).

Without a credential, a call returns structured JSON:

```json
{
  "error": "Not authenticated. Set MAGICPATH_TOKEN or run `magicpath-ai login`.",
  "code": "NOT_AUTHENTICATED",
  "suggestion": "..."
}
```

`info` is the exception and answers without credentials.

---

## 4. EXEC-WRAPPER BEHAVIOR

Tool calls run through `node .opencode/bin/magicpath-utcp-exec.cjs`, which shells out to `magicpath-ai`. The wrapper does two things an agent should know:

- **Drops unfilled optional-argument placeholders.** The CLI transport substitutes a literal `MISSING_ARG_<name>` token for any declared argument the caller left unset; it does not drop the flag. Passing that through would be worse than an error, because a filter flag given a nonsense value returns an empty result that reads as a legitimate answer (a listing filtered by a team named `MISSING_ARG_team` looks exactly like a user with no projects). The wrapper removes those tokens before the CLI ever sees them.
- **Emits structured JSON errors** so a caller parsing JSON meets one shape whether it succeeded or not:
  - `MISSING_REQUIRED_ARGUMENT` — a required argument was not supplied; the wrapper names the missing arguments.
  - `CLI_UNAVAILABLE` — `magicpath-ai` could not be run (not on PATH); install the CLI.

A missing **required positional** cannot be repaired the same way (there is no flag to drop, and guessing would invent an argument), so it fails loudly with `MISSING_REQUIRED_ARGUMENT`.

---

## 5. RELATED RESOURCES

- [credential-setup.md](../references/credential-setup.md) - the full credential reference: the manual, the env-var wiring, the unauthenticated failure shape, and discovery.
- [tool-surface.md](../references/tool-surface.md) - the 14-tool contract the manual exposes.
- [mutation-boundary.md](../references/mutation-boundary.md) - the registered read-only surface versus the deliberately unregistered write surface.
- [SKILL.md](../SKILL.md) - the runtime contract this asset supports.
