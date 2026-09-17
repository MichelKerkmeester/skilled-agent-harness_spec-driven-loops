---
title: "Contract: the skill advisor CLI front door"
description: "The frozen calling contract for the daemon-backed advisor CLI: nine commands, argument shapes, output envelope, exit taxonomy and the fields a caller may rely on."
trigger_phrases:
  - "advisor cli contract"
  - "skill advisor cli commands"
  - "advisor exit codes"
  - "advisor cli output shape"
version: 0.11.0.0
importance_tier: "important"
contextType: "reference"
---
# Contract: the skill advisor CLI front door

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The single entry point for every advisor capability. Callers read this rather than the CLI
> source. Field names and exit codes here are frozen: a change to either is a breaking change.

---

## 1. INVOCATION

```
node .opencode/bin/skill-advisor.cjs <command> [--arg value ...] --format json
```

The shim resolves the built CLI, verifies the build is current, and reaches the daemon over a
unix socket. It starts the daemon when none is listening.

`--format` takes `json`, `jsonl` or `text`. Callers parse `json`.

`--warm-only` starts or attaches to the daemon and returns without running a command. Use it at
session start so the first real call does not pay daemon start.

---

## 2. COMMANDS

Nine, each accepting three spellings: snake case, kebab case and camel case.

| Command | Mutates | Required arguments |
|---------|---------|--------------------|
| `advisor_recommend` | no | `prompt` |
| `advisor_status` | no | `workspaceRoot` |
| `advisor_validate` | no | `confirmHeavyRun` |
| `advisor_rebuild` | **yes** | none |
| `skill_graph_query` | no | `queryType` |
| `skill_graph_status` | no | none |
| `skill_graph_validate` | no | none |
| `skill_graph_scan` | **yes** | none |
| `skill_graph_propagate_enhances` | **yes** unless `dryRun` | none |

Optional arguments per command come from the tool manifest and are printed by
`<command> --help`. The three mutating commands require caller trust; an untrusted caller is
refused before anything is written.

---

## 3. OUTPUT ENVELOPE

Success goes to stdout:

```json
{ "status": "ok", "data": { ... } }
```

Failure goes to **stderr**, not stdout:

```json
{ "status": "error", "error": "<message>", "exitCode": <int> }
```

Callers that read only stdout see nothing on failure. Read stdout, then fall back to stderr.

`data` is the command's own payload. For `advisor_recommend` a caller may rely on
`recommendations[]` with `skillId`, `score`, `confidence` and `uncertainty`, plus
`effectiveThresholds`. Anything not named here may change.

**Fields that are not stable across calls** and must never be compared or cached:
`timestamp`, `generatedAt`, `durationMs`, `latencyMs`, `checkedAt`, `lastLiveAt`, `updatedAt`,
`generation`, `cache.hit`, and the measured latency values under a validate slice.

`cache.hit` deserves its own warning: two identical calls return `false` then `true`, because the
daemon caches by prompt. It describes the cache, never the recommendation.

---

## 4. EXIT TAXONOMY

Five codes. A caller decides what to do from the code, not by parsing the message.

| Code | Meaning | What a caller should do |
|------|---------|-------------------------|
| 0 | Success | Read `data` |
| 1 | The handler raised | Treat as a failed call; do not retry blindly |
| 64 | Usage: unknown command, missing or invalid argument | Fix the call; retrying is pointless |
| 69 | Protocol: the daemon speaks a version this CLI does not | Stop, and report both versions |
| 75 | Retryable: daemon not ready, at capacity, or shutting down | Retry, or proceed without a recommendation |

75 is the one that matters for prompt-time callers. The advisor is an accelerator, so a caller
that gets 75 continues without a recommendation rather than blocking.

---

## 5. FAILURE POSTURE

The advisor never blocks the caller. Every integration treats an absent recommendation as normal:
the prompt still goes through, the command still runs, the session still starts. A caller that
waits on the advisor, or fails because the advisor failed, is wired wrong.

Set a timeout. The prompt-time integrations use a few seconds and fall through on expiry.

---

## 6. WHAT IS PROVEN ABOUT THIS SURFACE

A parity harness recorded 22 frozen cases across all nine commands against the CLI and against the
MCP surface while both shipped. Every success path returned identical payloads apart from
`cache.hit`, which differs only because whichever surface runs second hits the cache the first one
warmed; error envelopes differed by design, because an exit code is a thing only a process has.
