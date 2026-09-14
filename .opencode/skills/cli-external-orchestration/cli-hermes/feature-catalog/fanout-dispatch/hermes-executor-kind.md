---
title: "Hermes Executor Kind And Lineage Command"
description: "`cli-hermes` is a first-class `ExecutorKind`, and `buildHermesLineageCommand` emits the one auditable headless shape a fan-out lineage runs: `hermes chat -Q --oneshot` with the prompt delivered on stdin."
trigger_phrases:
  - "hermes executor kind and lineage command"
  - "buildHermesLineageCommand"
  - "hermes chat oneshot dispatch shape"
  - "cli-hermes ExecutorKind"
version: 1.0.0.0
---

# Hermes Executor Kind And Lineage Command (buildHermesLineageCommand)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`cli-hermes` is a first-class `ExecutorKind`, and `buildHermesLineageCommand` emits the one auditable headless shape a fan-out lineage runs: `hermes chat -Q --oneshot` with the prompt delivered on stdin.

The packet deliberately owns no spawn path. A caller that wants a Hermes leaf hands the lineage to the shared deep-loop runtime, and this adapter is where the flags, the bounds and the failure modes are decided.

---

## 2. HOW IT WORKS

### Availability Refusal

The adapter probes for the binary before it builds anything. When `command -v hermes` fails it raises an input error naming the kind, so an unavailable executor surfaces as a refusal to construct rather than a spawn failure the caller has to interpret.

### The Argument Spine

The emitted command is fixed in shape. `chat -Q --oneshot` is the auditable headless form: the response arrives on stdout, the session id on stderr, and the exit code is hard. The top-level `-z` form is never used here because it drops the session id and auto-approves everything. The prompt travels through `--query-file -`, which reads stdin verbatim, so a long iteration brief is never shell-interpreted and never hits an argv limit. `--ignore-rules` keeps the operator's instruction files, memories and session search out of the leaf prompt, and `--source tool` keeps the run out of the operator's session lists. Turn and budget bounds and an explicit toolset list follow, then `--yolo` for any lineage that is not read-only, then the validated reasoning level when one resolves.

### Flag Support And Sandbox Posture

The kind's supported fields are `model`, `reasoningEffort`, `timeoutSeconds` and `liveTools`. `sandboxMode` is absent because Hermes ships no confinement flag, and the preventive-sandbox capability table records the kind as `false` with the reason stated inline: omitting `--yolo` narrows what a flagged tool call may do, and a narrowed toolset restricts what the leaf can reach, but neither is an operating-system boundary. `configDir` is absent as well: the home override is real, but a fresh home carries fresh credentials, so per-lineage profiles wait for a seeded-credential contract.

### Approval Scope

Omitting `--yolo` does not stop ordinary file writes or commands. It leaves the run under Hermes's single-query approval gate for the tool calls Hermes itself flags as dangerous, including its dangerous-command patterns and writes into a protected `.hermes/` directory; headless, with nobody present to approve, those calls are blocked. A write lineage therefore passes `--yolo` so a flagged step cannot silently fail the leaf, and a read-only lineage relies on the narrowed toolset for its safety.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | `buildHermesLineageCommand`, `isHermesBinaryAvailable`, and the adapter registration in the lineage-command table. |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Shared | `EXECUTOR_KINDS`, the `cli-hermes` flag-support entry, and the preventive-sandbox capability ruling. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Handler | The documented dispatch shape and the hard rules a manual dispatch is held to. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md` | Handler | Flags, headless forms, exit codes and environment for the Hermes CLI. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Vitest | Exercises the emitted Hermes command, its refusal paths and its flag composition. |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Vitest | Covers the kind list, flag support and sandbox-capability entries. |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts` | Test harness | Declares the adapter matrix the stress suite runs each CLI kind through. |

---

## 4. SOURCE METADATA

- Group: Fan-out dispatch
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fanout-dispatch/hermes-executor-kind.md`

Related references:
- [closed-model-roster.md](closed-model-roster.md) - the model allowlist this builder checks before emitting a command.
- [toolset-and-web-search-policy.md](toolset-and-web-search-policy.md) - how the `-t` list in the spine above is chosen.
