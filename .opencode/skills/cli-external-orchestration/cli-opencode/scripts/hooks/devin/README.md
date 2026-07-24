---
title: "devin: Devin CLI Dispatch Guard Hooks"
description: "Devin CLI sibling adapters that lint a dispatch command before it spawns and audit it after it finishes, over the same shared cores as the Claude/Codex hooks."
---

# devin: Devin CLI Dispatch Guard Hooks

---

## 1. OVERVIEW

`devin/` holds the Devin CLI sibling of the parent `scripts/hooks/` adapters. Devin fires its hook events on the `exec` tool (matcher `^exec$` in `.devin/hooks.v1.json`) and calls the identical runtime-neutral cores in `../../lib/` that the Claude and Codex adapters call. Devin's tool_input field names are unconfirmed (no live capture yet - see phase 008 decision-record.md); each file tolerates the same field-name fallbacks the Claude/Codex siblings already use.

**STATUS: DORMANT** - `.devin/hooks.v1.json` is confirmed not consulted at all under `devin -p` (packet-wide finding, see `../../../../../system-spec-kit/mcp-server/hooks/devin/README.md`). Built and live-tested for correctness anyway; not yet observed firing in a real session.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `dispatch-preflight-lint.mjs` | Targets Devin `PreToolUse(^exec$)`. Reads the target skill's `hard_rules:` frontmatter through `../../lib/dispatch-rule-checks.mjs` and evaluates the composed command. A `block` violation returns `hookSpecificOutput.permissionDecision: "deny"` with the rule reasons. A `warn` violation attaches an advisory and lets the normal permission flow proceed. Fast-exits on any command that is not a known dispatch shape and fails open on any internal error. |
| `dispatch-audit-posttooluse.mjs` | Targets Devin `PostToolUse(^exec$)`. Recognizes a completed dispatch and appends one redacted, size-rotated JSONL line through `../../lib/dispatch-audit.mjs`, tagged `runtime: "devin"`. Observation only, it never emits a permission decision since the tool call has already finished. Fails open on missing payload, parse error, or audit-path failure. |

## 3. CONSUMERS

- Wired into `.devin/hooks.v1.json` on the `PreToolUse` and `PostToolUse` events for the `^exec$` matcher.
- Both files import `DISPATCH_SHAPES`, `readHardRules`, `evaluate`, `extractDispatchMeta`, `buildAuditLine`, and `appendAuditLog` from `../../lib/dispatch-rule-checks.mjs` and `../../lib/dispatch-audit.mjs`, the same cores the Claude/Codex adapters in the parent `hooks/` folder use.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../lib/README.md`](../../lib/README.md)
- [`../codex/README.md`](../codex/README.md)
- [`../../../SKILL.md`](../../../SKILL.md)
