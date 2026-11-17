---
title: "Dispatch Library: Hard-Rule Engine and Audit Core"
description: "Runtime-neutral dispatch library that evaluates a skill's hard-rules sidecar, recognizes dispatch shapes and writes one scrubbed JSONL audit line."
trigger_phrases:
  - "dispatch rule engine"
  - "dispatch audit core"
  - "opencode version resolver"
version: 1.0.0.0
---

# Dispatch Library: Hard-Rule Engine and Audit Core

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/lib/` holds the shared cores that the runtime adapters in this concern call. The rule engine reads a `hard-rules.json` sidecar beside a dispatch skill's `SKILL.md` and grades a composed command before anything runs. The audit core recognizes a finished dispatch and appends one redacted JSONL line. The version resolver answers which OpenCode family a binary runs, because a sidecar rule can declare that it applies to one family alone.

Current state:

- Every preflight in this concern uses the rule engine.
- Cursor reaches the engine through the Claude preflight it spawns.
- The audit adapters use the audit core. Vibe runs preflight only.
- No core writes to stdout or stderr.

Failures stay local. A rule check that throws counts as satisfied. A version probe that fails returns `unknown`. An audit write that cannot happen returns `false`. The DSH preflight is the exception in this tree, because it denies when the shared rule check throws.

---

## 2. PACKAGE TOPOLOGY

```text
dispatch-rule-checks.mjs ───▶ dispatch-audit.mjs
          │
          └───────────────▶ opencode-version.mjs
```

The arrow points one way. `dispatch-audit.mjs` and `opencode-version.mjs` import nothing from this folder, so either one loads on its own. The rule engine needs both. The audit core answers which packet governs a dispatch, and the version resolver decides which rules apply to a binary.

The test files sit outside that order. Each one imports all three modules so it can build a fixture from the real cores. A core never imports a test.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `dispatch-rule-checks.mjs` | Reads the rule sidecars and grades a command against them. |
| `dispatch-audit.mjs` | Recognizes a dispatch and writes one redacted JSONL line per call. |
| `opencode-version.mjs` | Resolves an OpenCode binary to a supported family or `unknown`. |
| `dispatch-rule-checks.test.mjs` | `node --test` suite for the rule engine. |
| `dispatch-audit.test.mjs` | `vitest` suite for the audit core. |
| `opencode-version-corpus.json` | Version-output samples the rule engine suite parses. |

The test files cover one core each. The corpus file holds sample version output for the suite to parse.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins, plus the sibling cores the rule engine needs. Nothing from `node_modules`. |
| Ownership | A rule about a dispatch belongs in a skill's sidecar. The code that reads it belongs here. |
| Output | No stdout and no stderr. The audit path reports through its return value. |
| Failure | A throwing check counts as satisfied. A failed write returns `false`. |

The grade is a list. `evaluate` returns only the rules that failed. A rule with `block` or `error` severity keeps that weight so the adapter can deny. Every other severity becomes a warning. An unknown check id is skipped, so a typo in a sidecar loses its rule without an error. The rule engine suite is what catches that.

`recordDispatch` checks the kill switch first. With `CLI_DISPATCH_AUDIT_DISABLED` set to `1`, it returns `false` before it reads the command.

Main flow for one finished call:

```text
╭──────────────────────────────────────────╮
│ adapter after a Bash call                │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ recordDispatch                           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ isAuditDisabled                          │
│ switch set to 1 → stop                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ matchDispatchShape                       │
│ no dispatch shape → stop                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ extractDispatchMeta                      │
│ model, target, duration, exit code       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ buildAuditLine                           │
│ scrub secrets, cap the command at 500    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ appendAuditLog                           │
│ rotate at 512 KB, append owner-only      │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ true when written, false otherwise       │
╰──────────────────────────────────────────╯
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `evaluateDispatch(command, skillsRoot, options)` | Function | Grades each dispatch in a chain against the rules of the packet that governs it and returns only the packets with violations. |
| `evaluate(command, rules, options)` | Function | Grades one command against one rule array and returns only the violated rules. |
| `readHardRules(skillMdPath)` | Function | Reads `hard-rules.json` beside a `SKILL.md`. Returns an empty array on any read or shape error. |
| `recordDispatch(params)` | Function | Runs the audit pipeline for one finished call. |
| `buildAuditLine(record)` | Function | Formats one JSONL line without writing it. Returns null when the record cannot be built. |
| `appendAuditLog(logPath, line)` | Function | Writes one line and rotates the log first when it has reached the cap. |
| `resolveOpencodeVersionSync(binary)` | Function | Runs the binary with `--version` and returns its family. |

`CHECKS` holds the 40 check functions that a sidecar rule names by id. `KNOWN_CHECKS` is the key list. A sidecar rule with an id outside that list does nothing, and the rule engine suite fails on it.

---

## 6. VALIDATION

Run the first command from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs
```

Expected result: `pass 64` with `fail 0`. The runner exits 0.

Run the second command from the repository root.

```bash
cd .skilled/hooks/cli-dispatch/lib && ../../../node_modules/.bin/vitest run dispatch-audit.test.mjs
```

Expected result: `Test Files  1 passed (1)` and `Tests  133 passed (133)`. The runner exits 0.

The rule engine suite also reads every `cli-*` sidecar and fails when a rule names a check id that `CHECKS` does not hold.

---

## 7. RELATED

- [The dispatch concern](../README.md) holds runtime registration and the kill switches.
- [The Claude adapters](../claude/README.md) call these cores from preflight and post-tool hooks.
- [The DSH adapter tests](../tests/dsh-dispatch.test.mjs) compare the DSH wrappers with the shared cores.
- [The hooks library](../../README.md) lists the hook folders and their switches.
