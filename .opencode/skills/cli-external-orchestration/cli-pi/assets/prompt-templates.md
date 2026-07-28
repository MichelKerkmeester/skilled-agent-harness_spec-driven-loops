---
title: Pi CLI Prompt Templates
description: Copy-ready Pi dispatch templates for print, JSON, RPC, review, generation, and package-aware tasks.
trigger_phrases:
  - "pi prompt templates"
  - "pi print template"
  - "pi json template"
  - "pi rpc template"
  - "pi review prompt template"
importance_tier: normal
contextType: implementation
version: 1.2.0.0
---

# Pi CLI Prompt Templates

Copy-ready templates for common Pi CLI dispatch shapes. Replace `[placeholders]` with your values. Apply the canonical prompt-quality card before using them.

## 1. OVERVIEW

### Purpose

This asset provides structured, copy-paste ready dispatch templates for invoking Pi CLI across its print, JSON, and RPC surfaces. Each template includes the full command with flags plus a concrete example.

### Usage

1. Find the template matching your task's dispatch shape.
2. Copy the command.
3. Replace `[placeholders]` with actual values.
4. Run through the shared deep-loop runtime, not a packet-local wrapper.

### Flag Reference

> **Exit code caveat:** the pin observed exit `0` then exit `1` on identical unauthenticated calls. Every template below assumes the caller inspects output text, not the exit code alone.
> **Offline caveat:** `--verbose` without `--offline` can hang 2+ minutes when no network path is available. Pass `--offline` whenever no live provider call is intended.
> **No enforced model allowlist at this layer:** unlike `cli-cursor`/`cli-devin`, Pi is a multi-provider passthrough; use the authenticated provider roster in `cli-reference.md` §13 rather than guessing at an unconfirmed model id.

| Flag | Purpose |
|---|---|
| `-p` / `--print` | Non-interactive mode — process the prompt and exit. Skill default for one-shot dispatch. |
| `--mode text` | Text output — the default mode. |
| `--mode json` | JSONL event stream — one JSON object per line, not a single document. |
| `--mode rpc` | Persistent stdin/stdout JSONL protocol — requires a lifecycle owner (see `integration-patterns.md` §7). |
| `--tools <list>` | Comma-separated tool allowlist (e.g. `read,grep,find,ls`) — enforced by the CLI, not a prompt sentence. |
| `--thinking <level>` | `off` through `max` — independent of `--model`, unlike Cursor/Devin's model-id-baked effort tiers. |
| `--offline` | Disable startup network operations — skill default when no live provider call is intended. |
| `--approve` / `-a` | Trust project-local files for this run — required even to read project package state. |
| `--continue` / `-c`, `--resume` / `-r` | Session continuity — use only with a stable session reference. |

---

## 2. AVAILABILITY AND GUARD

```bash
command -v pi
```

Run the self-invocation guard from [SKILL.md](../SKILL.md). Do not construct a dispatch when either check fails.

**Example:**

```bash
command -v pi && echo "pi available" || echo "cli-pi executor unavailable: command -v pi failed"
```

---

## 3. PRINT REVIEW

```bash
pi -p "Review [files] for [risk]. Do not edit files. Return findings with severity, file and line evidence, impact, and suggested tests." \
  --mode text \
  --tools read,grep,find,ls
```

Use this for a read-only review. The tool allowlist comes from the installed help capture and the local contract pin.

**Example:**

```bash
pi -p "Review src/auth/session.ts for security vulnerabilities: injection, auth bypass, secrets exposure. Do not edit files. Return findings with severity, file and line evidence, impact, and suggested tests." \
  --mode text \
  --tools read,grep,find,ls \
  --offline --approve
```

---

## 4. PRINT IMPLEMENTATION

```text
Implement [objective] in [allowed files].
Read repository instructions first.
Do not touch files outside [scope].
Preserve existing patterns.
Run [verification commands].
Return a handback with files changed, tests, failures, and unknowns.
```

Use print mode for a bounded one-shot task. The caller validates the result.

**Example:**

```bash
pi -p "Implement a sliding-window rate limiter in src/middleware/rate-limit.ts. Read repository instructions first. Do not touch files outside src/middleware/. Preserve existing Express middleware patterns. Run npm test -- rate-limit. Return a handback with files changed, tests, failures, and unknowns." \
  --offline --approve
```

---

## 5. JSON EVENT STREAM

```bash
pi --mode json "Analyze [scope] and return the event stream for [consumer]"
```

Use only when the consumer parses JSONL records. Do not wrap the output in a single JSON document.

**Example:**

```bash
pi --mode json "Analyze src/api/ for unhandled promise rejections and return the event stream for the calling AI's own JSONL consumer"
```

---

## 6. RPC SESSION

```bash
pi --mode rpc --no-session
```

Use only with a client that owns stdin/stdout JSONL framing, request correlation, timeout, and cleanup. RPC is persistent, not a print alias. See [pi-tools.md](../references/pi-tools.md) §2 for how this differs from every sibling CLI's own continuation model.

**Example:**

```bash
pi --mode rpc --no-session
# The shared runtime spawns this once, then writes one JSON request per line
# and reads response/event lines for the lifetime of the integration.
```

---

## 7. CONTINUATION

```text
Continue the prior Pi task for session [session reference].
New objective: [delta].
Existing evidence: [files or output].
Re-run: [verification].
Return only the new changes and remaining risks.
```

Use continuation flags only when the calling workflow has a stable session reference.

**Example:**

```bash
pi -c -p "Continue the prior rate-limiter task for session rate-limit-2026-07-27. New objective: add a Redis adapter behind the existing store interface. Existing evidence: src/middleware/rate-limit.ts. Re-run: npm test -- rate-limit. Return only the new changes and remaining risks."
```

---

## 8. PACKAGE REVIEW

```text
Evaluate community package [package] before installation.
Source: [URL or registry reference].
Requested scope: [project or global].
Inspect: executable code, dependencies, settings changes, and permissions.
Do not install without explicit trust approval.
Return a rollback command and a safe verification probe.
```

Use for pi-subagents or pi-mcp-extension. They are community packages, not first-party Pi features.

**Example:**

```text
Evaluate community package npm:pi-mcp-extension before installation.
Source: https://pi.dev/packages/pi-mcp-extension.
Requested scope: project.
Inspect: executable code, dependencies, settings changes, and permissions.
Do not install without explicit trust approval.
Return a rollback command and a safe verification probe.
```

---

## 9. SPEC-FOLDER PRE-APPROVAL (GATE 3 BYPASS)

When the calling AI has an active Gate-3 spec folder and needs the delegated Pi session to skip re-asking:

```text
Spec folder: [path] (pre-approved, skip Gate 3). [task description]
```

**Example:**

```bash
pi -p "Spec folder: specs/cli-external-orchestration/031-cli-pi-creation/003-cli-pi-skill-packet (pre-approved, skip Gate 3). Add a new section to references/cli-reference.md documenting the --header flag." \
  --offline --approve
```

---

## 10. STRUCTURED HANDBACK

```text
PI_HANDBACK
status: PASS | FAIL | BLOCKED
mode: print | json | rpc
summary: [one sentence]
files_changed: [paths or none]
verification: [commands and results]
failures: [failure or none]
unknowns: [unknown or none]
```

## 11. SOURCE AND CONFIDENCE

Confirmed flags and observed failure behavior: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

Native prompt-template and extension discovery are confirmed for the project-local surfaces this repo actually populates (phases 012/013). Full precedence across every documented discovery location, and native skill discovery specifically, remain per Pi docs, unconfirmed. Read [native-skills-and-extensions.md](../references/native-skills-and-extensions.md) before relying on those surfaces.
