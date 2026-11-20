---
title: "OpenCode Version Detection"
description: "A `cli-opencode` lineage resolves the installed OpenCode binary, parses its `--version` output into a version family, and refuses an OpenCode 1 binary rather than dispatching it."
trigger_phrases:
  - "OpenCode Version Detection"
  - "opencode version detection"
  - "resolveOpencodeBinary version probe"
  - "OpenCode 1 refusal"
version: 1.0.6.0
---

# OpenCode Version Detection (cli-opencode)

## 1. OVERVIEW

A `cli-opencode` lineage runs OpenCode 2, the only supported major. The runtime resolves the binary, parses its `--version` output into a version family, and refuses the lineage when the binary reports a retired major, so an OpenCode 1 install is named and never dispatched.

The family always comes from the parsed probe output, never from the binary name. A binary named `opencode` that reports a 2.x version is dispatched with the OpenCode 2 command line, and one that reports a 1.x version is refused with a message naming OpenCode 1 as unsupported. Install and the capability surface live in [`install-and-versions.md`](../../cli-opencode/references/install-and-versions.md).

---

## 2. HOW IT WORKS

### Binary Resolution And Version Probe

`resolveOpencodeBinary` returns the command name, the executable path, and the parsed version family for one dispatch. `OPENCODE_BIN` overrides the search: a bare name is resolved through `env.PATH`, a path is used as it stands, and an override that does not resolve is an error rather than a fallback. Without the override, the resolver takes the first `opencode` in `PATH` order.

The probe runs the resolved executable with `--version` under a bounded timeout and joins its standard output and standard error. `parseOpencodeVersion` then reads the first supported version token in that text: major 1 is `unsupported`, major 2 is `v2`, and every other shape is `unknown`. A leading word and a prerelease or build suffix are tolerated, so `1.0.0`, `1.0.0-rc.1`, and `opencode v2.0.32` all parse. A binary that cannot be found, a probe that fails or times out, and output with no supported version token all raise `E_OPENCODE_UNRESOLVED`, and the message includes the probe output. A major-1 binary raises the same error with a message that names OpenCode 1 as no longer supported and asks for OpenCode 2. Successful probes are cached by canonical path, size, and modification time, and `clearOpencodeVersionCache` empties that cache.

### Command Line

`buildLineageCommand` routes a lineage to its kind adapter, and the `cli-opencode` adapter composes the argv. It refuses with an input error when the executor cannot be resolved, so an absent binary is a refusal before the run rather than a spawn failure inside it.

The argv is `run --standalone -m <model>#<effort> --format json --auto`, with the effort folded into the model selector when one is set. Under `workspace-write`, the default when no sandbox mode is set, the builder also hands the child an inline `OPENCODE_CONFIG_CONTENT` that denies `external_directory`; that stops the file tools at the working directory but not Bash, which can still write anywhere. `danger-full-access` adds no deny, and `read-only` is refused. OpenCode 2 has no directory flag, so the builder sets the spawn `cwd` to the directory root instead.

The native lineage kind has no fan-out adapter. `buildLineageCommand` refuses a `native` lineage, and a fan-out that expands to one is refused before any spawn, because OpenCode 2 `run` cannot start a registered command. `native` remains the single-executor default, dispatched by the workflow.

### Failure Behavior

The family is never inferred from the executable name, and the resolver does not fall back to another candidate once a binary has been chosen. A probe failure is therefore a refusal, not a silent switch to another generation, and the refusal message includes the probe output so the operator can see what the binary reported.

The hook-side resolver at `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` applies the same parse rule to the binary named by a dispatch command, and the dispatch rule checks use it to select the version-scoped rules for that command. Its `SUPPORTED_FAMILIES` list holds `v2` alone, so a major-1 binary reads as `unsupported` and the rule engine applies every rule to it rather than skipping the version-scoped ones. The two surfaces implement the same version rule as separate copies, and a parity test keeps them aligned.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Runtime | `resolveOpencodeBinary` resolution and probe, `parseOpencodeVersion` family mapping, the `E_OPENCODE_UNRESOLVED` refusal, and the metadata-keyed probe cache. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Runtime | The `cli-opencode` lineage builder that composes the OpenCode 2 argv, the native lineage refusal, and the `isOpencodeBinaryAvailable` preflight. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Vitest | Version resolution cases, the lineage argv cases, the native refusal, the adversarial resolver cases, and the parser parity check against the hook-side resolver. |

---

## 4. SOURCE METADATA

- Group: OpenCode Version Detection
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `opencode-version-dispatch/opencode-version-dispatch.md`

Related references:
- [cli-dispatch-authorization.md](../cli-dispatch-authorization/cli-dispatch-authorization.md): the hook-side inspector and the version-aware rule checks that consume the same parse rule.
- [cli-executor-dispatch-routing.md](../cli-executor-dispatch-routing/cli-executor-dispatch-routing.md): hub-level routing that selects the `cli-opencode` packet in the first place.
