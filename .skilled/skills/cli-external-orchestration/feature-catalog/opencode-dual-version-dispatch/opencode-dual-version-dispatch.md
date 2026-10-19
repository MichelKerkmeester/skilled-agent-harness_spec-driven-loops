---
title: "OpenCode Dual-Version Dispatch"
description: "A `cli-opencode` lineage resolves the installed OpenCode binary, parses its `--version` output into a version family, and builds the OpenCode 1 or OpenCode 2 command line from that family rather than from the binary name."
trigger_phrases:
  - "OpenCode Dual-Version Dispatch"
  - "opencode dual-version dispatch"
  - "resolveOpencodeBinary version probe"
  - "OpenCode 1 and OpenCode 2 lineage argv"
version: 1.0.0.0
---

# OpenCode Dual-Version Dispatch (cli-opencode)

## 1. OVERVIEW

A `cli-opencode` lineage runs whichever OpenCode major version the machine has installed. The runtime resolves the binary, parses its `--version` output into a version family, and composes the command line from that family, so one lineage kind reaches either generation without a per-machine branch in the caller.

Two binaries can coexist. OpenCode 1 installs as `opencode` and OpenCode 2 installs as `opencode2`, and the family always comes from the parsed probe output. A binary named `opencode` that reports a 2.x version is dispatched with the OpenCode 2 command line, and a binary named `opencode2` that reports a 1.x version is dispatched with the OpenCode 1 command line. Install, side-by-side setup, the capability delta, and the irreducible gaps live in [`install-and-versions.md`](../../cli-opencode/references/install-and-versions.md).

---

## 2. HOW IT WORKS

### Binary Resolution And Version Probe

`resolveOpencodeBinary` returns the command name, the executable path, and the parsed version family for one dispatch. `OPENCODE_BIN` overrides the search: a bare name is resolved through `env.PATH`, a path is used as it stands, and an override that does not resolve is an error rather than a fallback. Without the override, the resolver walks `PATH` in directory order and prefers `opencode2` over `opencode` inside each directory, so directory order still wins over name order.

The probe runs the resolved executable with `--version` under a bounded timeout and joins its standard output and standard error. `parseOpencodeVersion` then reads the first supported version token in that text: major 1 is `v1`, major 2 is `v2`, and every other shape is `unknown`. A leading word and a prerelease or build suffix are tolerated, so `1.19.3`, `1.19.3-rc.1`, and `opencode v2.0.32` all parse. A binary that cannot be found, a probe that fails or times out, and output with no supported version token all raise `E_OPENCODE_UNRESOLVED`, and the message names both candidate binary names and includes the probe output. Successful probes are cached by canonical path, size, and modification time, and `clearOpencodeVersionCache` empties that cache.

### Command Line Per Family

`buildLineageCommand` routes a lineage to its kind adapter, and the `cli-opencode` adapter composes the argv from the resolved family. It refuses with an input error when the executor cannot be resolved, so an absent binary is a refusal before the run rather than a spawn failure inside it.

On OpenCode 1 the argv is `run --model <provider/model> --format json --dir <directory-root>`, with `--dangerously-skip-permissions` added for a `danger-full-access` sandbox and `--variant <effort>` added when a reasoning effort is set. On OpenCode 2 the argv is `run --standalone -m <model>#<effort> --format json`, with `--auto` added for the same sandbox and the effort folded into the model selector when one is set. OpenCode 2 has no directory flag, so the builder sets the spawn `cwd` to the directory root instead.

The native lineage adapter is version-aware in the same way. It resolves the same binary and refuses to start on OpenCode 2, because that generation has no registered-command route on `run` and a native lineage needs one.

### Failure Behavior

The family is never inferred from the executable name, and the resolver does not fall back from one candidate to the other once a binary has been chosen. A probe failure is therefore a refusal, not a silent switch to the other generation, and the refusal message names both `opencode2` and `opencode` so the operator can see which candidates were considered.

The hook-side resolver at `.skilled/hooks/dispatch/lib/opencode-version.mjs` applies the same parse rule to the binary named by a dispatch command, and the dispatch rule checks use it to select the version-scoped rules for that command. The two surfaces share the version rule rather than each defining their own.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Runtime | `resolveOpencodeBinary` resolution and probe, `parseOpencodeVersion` family mapping, the `E_OPENCODE_UNRESOLVED` refusal, and the metadata-keyed probe cache. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Runtime | The `cli-opencode` lineage builder that composes the OpenCode 1 or OpenCode 2 argv from the resolved family, the native adapter's OpenCode 2 refusal, and the `isOpencodeBinaryAvailable` preflight. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Vitest | Version resolution cases, the per-family lineage argv cases, the OpenCode 2 native refusal, the adversarial resolver cases, and the parser parity check against the hook-side resolver. |

---

## 4. SOURCE METADATA

- Group: OpenCode Dual-Version Dispatch
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `opencode-dual-version-dispatch/opencode-dual-version-dispatch.md`

Related references:
- [cli-dispatch-authorization.md](../cli-dispatch-authorization/cli-dispatch-authorization.md): the hook-side inspector and the version-aware rule checks that consume the same parse rule.
- [cli-executor-dispatch-routing.md](../cli-executor-dispatch-routing/cli-executor-dispatch-routing.md): hub-level routing that selects the `cli-opencode` packet in the first place.
