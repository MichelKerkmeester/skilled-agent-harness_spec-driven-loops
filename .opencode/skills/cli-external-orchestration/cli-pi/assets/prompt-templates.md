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
version: 1.0.0.0
---

# Pi CLI Prompt Templates

These templates provide dispatch mechanics. Apply the canonical prompt-quality card before using them.

## 1. AVAILABILITY AND GUARD

~~~bash
command -v pi
~~~

Run the self-invocation guard from [SKILL.md](../SKILL.md). Do not construct a dispatch when either check fails.

## 2. PRINT REVIEW

~~~bash
pi -p "Review [files] for [risk]. Do not edit files. Return findings with severity, file and line evidence, impact, and suggested tests." \
  --mode text \
  --tools read,grep,find,ls
~~~

Use this for a read-only review. The tool allowlist comes from the installed help capture and the local contract pin.

## 3. PRINT IMPLEMENTATION

~~~text
Implement [objective] in [allowed files].
Read repository instructions first.
Do not touch files outside [scope].
Preserve existing patterns.
Run [verification commands].
Return a handback with files changed, tests, failures, and unknowns.
~~~

Use print mode for a bounded one-shot task. The caller validates the result.

## 4. JSON EVENT STREAM

~~~bash
pi --mode json "Analyze [scope] and return the event stream for [consumer]"
~~~

Use only when the consumer parses JSONL records. Do not wrap the output in a single JSON document.

## 5. RPC SESSION

~~~bash
pi --mode rpc --no-session
~~~

Use only with a client that owns stdin/stdout JSONL framing, request correlation, timeout, and cleanup. RPC is persistent, not a print alias.

## 6. CONTINUATION

~~~text
Continue the prior Pi task for session [session reference].
New objective: [delta].
Existing evidence: [files or output].
Re-run: [verification].
Return only the new changes and remaining risks.
~~~

Use continuation flags only when the calling workflow has a stable session reference.

## 7. PACKAGE REVIEW

~~~text
Evaluate community package [package] before installation.
Source: [URL or registry reference].
Requested scope: [project or global].
Inspect: executable code, dependencies, settings changes, and permissions.
Do not install without explicit trust approval.
Return a rollback command and a safe verification probe.
~~~

Use for pi-subagents or pi-mcp-extension. They are community packages, not first-party Pi features.

## 8. STRUCTURED HANDBACK

~~~text
PI_HANDBACK
status: PASS | FAIL | BLOCKED
mode: print | json | rpc
summary: [one sentence]
files_changed: [paths or none]
verification: [commands and results]
failures: [failure or none]
unknowns: [unknown or none]
~~~

## 9. SOURCE AND CONFIDENCE

Confirmed flags and observed failure behavior: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

Per Pi docs, unconfirmed: native skill, prompt-template, package, and extension discovery details. Read [native-skills-and-extensions.md](../references/native-skills-and-extensions.md) before relying on those surfaces.

