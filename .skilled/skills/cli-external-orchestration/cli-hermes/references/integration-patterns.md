---
title: "Hermes CLI Integration Patterns"
description: "Conductor and executor patterns for Hermes write dispatch, read-only review, cross-validation, fan-out lineages, and handback validation."
trigger_phrases:
  - "hermes integration pattern"
  - "hermes cross-ai dispatch"
  - "hermes fan-out lineage"
  - "hermes validation handback"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Hermes CLI Integration Patterns

How the calling AI integrates Hermes without duplicating the deep-loop executor. The shared runtime owns process construction; this reference never inserts a packet-local shell wrapper between the skill and that runtime.

## 1. OVERVIEW

### Core Principle

The calling AI is the conductor; Hermes is the delegated executor. Every pattern below ends with the conductor reading the exit code, stdout and stderr and verifying the result with the command the prompt named.

---

## 2. PATTERNS

### Write dispatch

1. Probe `command -v hermes` and `hermes config get providers.llmgateway.base_url`.
2. Write the prompt file: preamble, inlined persona, task, exact files, acceptance, verification command.
3. Dispatch with `--yolo`, `--ignore-rules`, `--source tool`, the leaf toolset list, `--run-budget` under your timeout.
4. Read exit code; on 0 read stdout and run the verification command yourself.
5. Diff the paths touched against the paths authorized; anything else goes back out.

### Read-only review

Same shape without `--yolo`, with `-t file,todo` and `SPECKIT_HERMES_READ_ONLY=1` in the environment so the repo plugin refuses the write tools (the fan-out sets both for a read-only lineage). The prompt asks for findings with `file:line` citations and forbids edits. Open every citation you are about to repeat.

### Cross-validation

Dispatch the same brief to Hermes on `glm-5.3-flash` and to a sibling runtime (Pi on the same gateway model, or Codex). Compare findings; where they disagree, name what would settle it. Agreement between two runs of the same model is not corroboration.

### Fan-out lineage

Use `--executor=cli-hermes` on `/deep:research` or `/deep:review`. Set the lineage `timeoutSeconds` to 900 or more: the one live research iteration ran 1042 seconds against a 600-second setting and finished only because the runner's ceiling is twice `iterations × timeoutSeconds` (observed 2026-09-14). A lineage may also name MCP servers in `liveTools.mcpServers`; the builder appends them to `-t`. The runtime builds the command, passes the prompt on stdin, applies write containment to the lineage directory, and treats exit 1 as failure. Keep `iterations × timeoutSeconds` under the four-hour lineage ceiling.

### Session continuation

Capture `session_id:` from stderr. A follow-up may resume with `hermes chat --resume <id>`, but a dispatch never resumes an operator's interactive session, and the resumed run still passes `--ignore-rules` and an explicit toolset list.

---

## 3. ANTI-PATTERNS

| Anti-pattern | Why it fails | Do instead |
|---|---|---|
| `hermes -z "<prompt>"` for a dispatch | No session id, auto-approves everything, auto-accepts hooks | `chat -Q --oneshot --query-file` |
| Omitting `--yolo` on a write task | Ordinary writes still run; a step Hermes flags as dangerous is blocked headless and the leaf reports it | Pass `--yolo` with every write or terminal toolset; never on a read-only run |
| Omitting `--ignore-rules` | `SOUL.md`, memories and CWD rules enter the leaf prompt | Always pass it |
| Default toolset roster | `delegation` and `memory` are enabled | Explicit `-t` list |
| `--worktree` | Writes `.git/worktrees/` inside the repo; containment reverts it | Let the runner own isolation |
| Trusting exit 0 alone | A budget-cut partial answer also exits 0 | Verify with the named command |
| `hermes import-agent` | Copies repo state into the user home, bypasses trust | Inline personas; use prompt templates |
| Relocating `HERMES_HOME` per lineage | A fresh home has no credentials | Shared home plus `--ignore-rules` |

---

## 4. HANDBACK

Report what ran and what it returned (exit code, stdout head, `session_id:`), what the verification command showed, and which paths changed. A Hermes `COMPLETE` in stdout is a claim about itself until the verification command confirms it.
