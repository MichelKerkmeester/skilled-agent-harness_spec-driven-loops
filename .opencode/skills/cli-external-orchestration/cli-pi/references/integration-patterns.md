---
title: "Pi CLI Integration Patterns"
description: "Conductor/executor patterns for Pi print, JSON, RPC, read-only review, validation, and session handback."
trigger_phrases:
  - "pi integration pattern"
  - "pi cross-ai dispatch"
  - "pi json integration"
  - "pi rpc client"
  - "pi validation handback"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---

# Pi CLI Integration Patterns

This reference describes how the calling AI should integrate Pi without duplicating the deep-loop executor.

Confirmed Pi mode behavior is sourced from the [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md). The patterns below are orchestration guidance built around that contract.

## 1. OVERVIEW

### Core Principle

The calling AI is the conductor; Pi is the delegated executor. The shared deep-loop runtime owns process construction — this reference never inserts a packet-local shell wrapper between the skill and that runtime.

### Purpose

Gives the conductor/executor patterns for print, JSON, and RPC dispatch, the validation pipeline and handback format, cross-validation against sibling CLIs, and documented anti-patterns.

### When to Use

- Composing a Pi dispatch prompt and choosing print, JSON, or RPC mode
- Building the pre-dispatch contract or the post-dispatch validation pipeline
- Deciding whether Pi or a sibling CLI should validate the other's output

---

## 2. CONDUCTOR AND EXECUTOR

The calling AI is the conductor. Pi is the delegated executor. The shared deep-loop runtime owns process construction.

~~~text
Calling AI
  -> classifies task and selects Pi mode
  -> loads cli-pi and prompt-quality rules
  -> sends a scoped prompt to the shared runtime
Shared deep-loop runtime
  -> launches pi
  -> captures output and process state
Calling AI
  -> validates output and workspace changes
  -> records handback and next action
~~~

Do not insert a packet-local shell wrapper between the skill and the runtime. That creates a second adapter with a second set of failure semantics.

---

## 3. PRE-DISPATCH CONTRACT

Every dispatch carries:

| Field | Required content |
|---|---|
| Tool | Pi CLI with a resolved binary |
| Mode | Print, JSON, or RPC |
| Task | One bounded objective |
| Context | Files, constraints, and relevant findings |
| Scope | Workspace and allowed mutations |
| Verification | Tests, checks, or evidence required |
| Handback | Summary, files, failures, and open questions |

The prompt should say what Pi may change and what it must not touch. A provider name or model should be explicit when the task depends on it.

---

## 4. PRINT MODE

Use print mode for a bounded request that needs one final response or a workspace change. The pinned contract confirms print mode uses -p or --print.

~~~text
PRECHECK
  command -v pi
  self-invocation guard
  provider/auth output policy

DISPATCH
  pi -p "<scoped task>" --mode text

HANDOFF
  inspect stdout and stderr
  inspect git diff
  run required verification
~~~

Print mode is not proof of success. The pin observed missing-provider failures with different exit codes. The response text must be classified before the caller reports a result.

---

## 5. READ-ONLY REVIEW

Pi's installed help exposes a tool allowlist. Use read, grep, find, and ls when the delegated review must not write files.

~~~bash
pi --tools read,grep,find,ls -p "Review the target and report findings"
~~~

This is safer than relying on a prompt sentence alone. It remains a caller-selected boundary and must still be validated against the actual output.

Recommended review handback:

1. Findings first.
2. File and line evidence.
3. Severity and impact.
4. Concrete remediation.
5. Tests that would confirm the remediation.

---

## 6. JSON EVENT STREAM

Use JSON mode when the caller or an integration needs structured progress. The local pin and [Pi JSON docs](https://pi.dev/docs/latest/json) describe one JSON object per line.

~~~text
start pi --mode json
read each line
parse the type field
store the session header
collect message and tool events
surface errors without flattening them into final prose
~~~

Do not parse JSON mode as one large JSON document. A truncated final event is a transport problem, not a successful empty result.

---

## 7. RPC INTEGRATION

Use RPC when the consumer needs a long-lived process. The pin and [RPC docs](https://pi.dev/docs/latest/rpc) confirm stdin/stdout JSONL framing.

~~~text
spawn pi --mode rpc
write one JSON request per line
read response lines and asynchronous events
correlate responses by request id when present
keep the process alive for follow-up work
close stdin and reap the child deliberately
~~~

RPC requires a lifecycle owner. The shared runtime must own timeouts, termination, stdout backpressure, stderr capture, and cleanup. If those guarantees are unavailable, use print or JSON instead and escalate the integration gap.

---

## 8. SESSION CONTINUITY

Pi exposes session-related flags in the installed help, including --continue, --resume, --session, --session-id, --fork, and --session-dir. Use them only when the calling workflow has a stable session identity and a clear handback policy.

Continuation rules:

- Reuse a session only when the prior context is relevant.
- Pass the exact task delta in the new prompt.
- Do not assume the provider or model remains available.
- Capture output from every continuation.
- Re-run verification after any continuation that can edit files.

---

## 9. NATIVE RESOURCE HANDOFF

Prompt templates are confirmed (phases 012/013): `.pi/prompts/*.md` mirrors all 36 canonical commands, and argument substitution live-verified in a real session. Skill discovery remains per Pi docs, unconfirmed — full path-precedence across every documented location, and whether nested hub packets flatten, still needs a credentialed live session. See [native-skills-and-extensions.md](./native-skills-and-extensions.md) §4/§8 for the current confirmed-vs-open boundary.

When a task needs native resources:

1. Load [native-skills-and-extensions.md](./native-skills-and-extensions.md).
2. Identify whether the resource is first-party, local, or packaged.
3. Confirm trust and scope before loading project-local files.
4. Keep the resource path in the handback.
5. Separate documented behavior from live evidence.

---

## 10. COMMUNITY PACKAGE HANDOFF

pi-subagents and pi-mcp-extension are community packages, not first-party Pi CLI modes. See [mcp-and-third-party-packages.md](./mcp-and-third-party-packages.md). A package request must include:

- Package name and source.
- Requested install scope.
- Trust approval.
- Requested resource types.
- Verification after install.
- Rollback path.

Do not silently turn an optional package into a required dependency of the hub.

---

## 11. VALIDATION PIPELINE

Use this order for a write-capable dispatch:

1. Confirm binary availability.
2. Confirm self-invocation guard.
3. Confirm mode and tool boundary.
4. Dispatch through the shared runtime.
5. Inspect output text and exit status.
6. Inspect changed files.
7. Run syntax and focused tests.
8. Run the stack gate.
9. Produce a concise handback.

The calling AI owns the final acceptance decision. Pi output is evidence, not authority.

---

## 12. FAILURE RECOVERY

| Failure | Recovery |
|---|---|
| Binary absent | Stop and install outside the dispatch |
| Provider missing | Surface auth requirement, do not retry blindly |
| Exit code conflicts with output | Classify output text first |
| RPC framing error | Stop the client and preserve raw lines |
| Extension load error | Disable or repair the extension, then revalidate |
| Trust rejection | Obtain explicit project-local approval |
| Unexpected file edits | Stop, inspect diff, and roll back only scoped changes |

---

## 13. HANDBACK FORMAT

~~~text
PI_HANDBACK
status: PASS | FAIL | BLOCKED
mode: print | json | rpc
summary: <one sentence>
files_changed:
  - <path>
verification:
  - <command and result>
failures:
  - <failure or none>
open_questions:
  - <question or none>
~~~

The handback must not claim a successful model run when the output only shows a provider failure.

---

## 14. CROSS-VALIDATION WITH OTHER CLI EXECUTORS

**Use Pi and a sibling CLI to validate each other's work, leveraging different strengths.**

### Strength Comparison for Task Routing

| Strength Area | Pi CLI | Cursor CLI | Devin CLI |
|---|---|---|---|
| Native model | None (multi-provider passthrough) | Composer (`composer-2.5`) | Adaptive router |
| Persistent bidirectional session | `--mode rpc`, confirmed | No | No (session resume/fork only) |
| First-party extension system | `.pi/extensions/*.ts`, confirmed | No (external `hooks.json`) | No (external `hooks.v1.json`) |
| Read-only exploration mode | `--tools read,grep,find,ls` | `--mode ask`/`--mode plan` | `--permission-mode auto` |
| Subagent delegation | `pi-subagents` package, confirmed | Not native | `run_subagent`, native |

### Cross-Validation Strategies

| Strategy | Flow | Best For |
|---|---|---|
| **Adversarial review** | A generates, B critiques | Security-critical code |
| **Provider-diverse opinion** | Sibling generates, Pi reviews through a different provider | When a genuinely different model family's perspective is wanted |
| **Specialist routing** | Route by strength (table above) | Efficiency optimization |

---

## 15. ANTI-PATTERNS

**What NOT to do when orchestrating Pi CLI from the calling AI.**

### 1. Trusting the Exit Code

```bash
# BAD: the pin observed exit 0 then exit 1 on identical unauthenticated calls
if pi -p "..." --mode text; then
  echo "Success"  # This can run even when the dispatch never reached a model
fi

# GOOD: inspect output text
OUTPUT=$(pi -p "..." --mode text 2>&1)
if echo "$OUTPUT" | grep -qi "no api key\|not authenticated"; then
  echo "Auth or provider failure"
else
  echo "$OUTPUT"
fi
```

### 2. Running Without `--offline` When No Network Path Is Expected

```bash
# BAD: the pin observed a 2+ minute hang under --verbose with no network path
pi -p "..." --verbose

# GOOD: pass --offline when no live provider network call is intended
pi -p "..." --offline --approve
```

### 3. Treating a Package's README as the Pi CLI Contract

```text
# BAD: assuming pi-mcp-extension's streamable-HTTP example is live-verified here
"Configure a streamable HTTP MCP server the way the package docs show"

# GOOD: only stdio is confirmed live (phase 007) -- see mcp-and-third-party-packages.md §5
"Configure a stdio MCP server; do not assume streamable HTTP works until it is tested"
```

### 4. Backgrounding `pi` Inside Shell Scripts Called by Another AI

```bash
# BAD: & inside the shell command -- orchestrator sees instant exit 0
pi -p "Deep review all phases" > /tmp/result.txt 2>&1 &
echo "PID: $!"
# The Bash tool reports "completed" in <2 seconds. pi is still running.

# GOOD: no & -- use the orchestrator's own background mechanism instead
# In Claude Code: Bash(command="pi -p ...", run_in_background=true)
```

### 5. Confusing RPC Mode With MCP

```text
# BAD: "start Pi's MCP server so the extension can connect"
# Pi RPC and MCP are different layers -- RPC connects a caller to Pi;
# MCP connects an extension to a tool server (see mcp-and-third-party-packages.md §5).

# GOOD: name which layer the task actually needs before dispatching
```

