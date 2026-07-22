---
title: "codex: Codex CLI Dispatch Guard Hooks"
description: "Codex CLI sibling adapters that lint a dispatch command before it spawns and audit it after it finishes, over the same shared cores as the Claude hooks."
---

# codex: Codex CLI Dispatch Guard Hooks

---

## 1. OVERVIEW

`codex/` holds the Codex CLI sibling of the parent `scripts/hooks/` adapters. Codex fires its hook events on the `exec` tool instead of Claude's `Bash` tool and uses snake_case payload fields (`tool_input.command`, `session_id`, `tool_use_id`), so each file here reads that shape and calls the identical runtime-neutral cores in `../../lib/` that the Claude adapters call. Both files also recognize a Codex-specific dispatch shape, `codex exec -p <agent>`, that the shared core does not know, since Codex dispatches its own sub-agents through `exec` rather than `opencode run` or `claude -p`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `dispatch-preflight-lint.mjs` | Targets Codex `PreToolUse(exec)`. Reads the target skill's `hard_rules:` frontmatter through `../../lib/dispatch-rule-checks.mjs` and evaluates the composed command. A `block` violation returns `hookSpecificOutput.permissionDecision: "deny"` with the rule reasons. A `warn` violation attaches an advisory and lets the normal permission flow proceed. Fast-exits on any command that is not a known dispatch shape and fails open on any internal error. |
| `dispatch-audit-posttooluse.mjs` | Targets Codex `PostToolUse(exec)`. Recognizes a completed dispatch and appends one redacted, size-rotated JSONL line through `../../lib/dispatch-audit.mjs`, tagged `runtime: "codex"`. Observation only, it never emits a permission decision since the tool call has already finished. Fails open on missing payload, parse error, or audit-path failure. |

## 3. CONSUMERS

- Wired into the Codex CLI hook configuration on the `PreToolUse` and `PostToolUse` events for the `exec` tool.
- Both files import `DISPATCH_SHAPES`, `readHardRules`, `evaluate`, `extractDispatchMeta`, `buildAuditLine`, and `appendAuditLog` from `../../lib/dispatch-rule-checks.mjs` and `../../lib/dispatch-audit.mjs`, the same cores the Claude adapters in the parent `hooks/` folder use.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../lib/README.md`](../../lib/README.md)
- [`../../../SKILL.md`](../../../SKILL.md)
