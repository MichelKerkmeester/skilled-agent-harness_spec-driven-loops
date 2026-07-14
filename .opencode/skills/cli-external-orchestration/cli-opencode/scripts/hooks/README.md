---
title: "hooks: CLI Dispatch Guard Hooks"
description: "Runtime hook adapters that lint a CLI dispatch command before it spawns and audit it after it finishes, each delegating to a shared core in lib/ and failing open."
trigger_phrases:
  - "cli dispatch hooks"
  - "dispatch preflight lint"
  - "dispatch audit hook"
  - "opencode run guard"
---

# hooks: CLI Dispatch Guard Hooks

---

## 1. OVERVIEW

`scripts/hooks/` holds the runtime hook adapters that guard CLI dispatch commands (`opencode run` and `claude -p`). One adapter lints a composed command before it spawns. The other records an audit line after it finishes. Each adapter stays thin and defers its real logic to a runtime-neutral core in `../lib/`, so the before-lint and the after-audit share one definition of what counts as a dispatch.

Current state:

- The base `.mjs` files (`dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`) target the Claude Code hook runtime, tool name `Bash`, on the `PreToolUse` and `PostToolUse` events.
- The `codex/` subdir holds the Codex CLI sibling adapters, which read the Codex payload shape (`tool_input.command`, snake_case fields) over the same cores.
- Every adapter fails open. Empty or malformed stdin, or any internal fault, exits 0 with no output, so a bug in a hook cannot break a real dispatch.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                        scripts/hooks/                          │
╰──────────────────────────────────────────────────────────────╯

  Bash / exec tool call (JSON on stdin)
        │
        ▼
┌────────────────────────────┐        ┌────────────────────────────┐
│ dispatch-preflight-lint    │ ─────▶ │ ../lib/                    │
│ PreToolUse, deny-capable   │        │  dispatch-rule-checks      │
└────────────────────────────┘        │  dispatch-audit (shapes)   │
┌────────────────────────────┐        │                            │
│ dispatch-audit-posttooluse │ ─────▶ │  dispatch-audit            │
│ PostToolUse, observe only  │        └────────────────────────────┘
└────────────────────────────┘

Dependency direction: hooks/ ───▶ ../lib/ (never the reverse)
```

---

## 3. DIRECTORY TREE

```text
scripts/hooks/
├── dispatch-preflight-lint.mjs        # PreToolUse(Bash) hard-rule lint (Claude runtime)
├── dispatch-audit-posttooluse.mjs     # PostToolUse(Bash) audit trail (Claude runtime)
└── codex/                             # Codex CLI sibling adapters over the same cores
    ├── dispatch-preflight-lint.mjs    # PreToolUse(exec) hard-rule lint (Codex runtime)
    └── dispatch-audit-posttooluse.mjs # PostToolUse(exec) audit trail (Codex runtime)
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | Reads the target skill's hard rules through `../lib/dispatch-rule-checks.mjs` and evaluates the composed command. A `block` violation returns `hookSpecificOutput.permissionDecision: "deny"` with the reason. A `warn` violation attaches an advisory and lets the permission flow proceed. Fast-exits on any command that is not a known dispatch shape. |
| `dispatch-audit-posttooluse.mjs` | Recognizes a completed dispatch, then appends one redacted, size-rotated JSONL line through `../lib/dispatch-audit.mjs` (`recordDispatch`). Observation only. It never emits a permission decision. This is the Claude counterpart to the OpenCode dispatch-audit plugin. |
| `codex/` | The Codex CLI adapters for the same two guards, tagged `runtime: "codex"`, reading the Codex hook payload. They call the identical cores in `../lib/`, so the guard behavior matches across runtimes. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Hooks import cores from `../lib/`. The cores never import a hook. |
| Shared shapes | Both hooks read `DISPATCH_SHAPES` from `../lib/dispatch-audit.mjs`, so the lint and the audit agree on what a dispatch is. |
| Output | The preflight lint may deny or advise. The audit hook stays silent (observation only). |
| Failure | Every adapter fails open, so a hook fault never blocks or degrades a real dispatch. |

Main flow:

```text
╭────────────────────────────────────────────╮
│ runtime fires PreToolUse / PostToolUse      │
╰────────────────────────────────────────────╯
                  │
                  ▼
┌────────────────────────────────────────────┐
│ adapter reads the JSON payload on stdin     │
└────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ fast-exit unless the command matches a      │
│ known dispatch shape                        │
└────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ call the ../lib/ core (evaluate or          │
│ recordDispatch)                             │
└────────────────────────────────────────────┘
                  │
                  ▼
╭────────────────────────────────────────────╮
│ deny, advise, or stay silent (fail open)    │
╰────────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `dispatch-preflight-lint.mjs` | Hook (PreToolUse) | Wired into the runtime hook config. Reads the payload on stdin, denies or advises on a dispatch command. |
| `dispatch-audit-posttooluse.mjs` | Hook (PostToolUse) | Wired into the runtime hook config. Reads the payload on stdin, writes one audit line. |
| `codex/dispatch-preflight-lint.mjs` | Hook (Codex PreToolUse) | Same lint for the Codex runtime. |
| `codex/dispatch-audit-posttooluse.mjs` | Hook (Codex PostToolUse) | Same audit for the Codex runtime. |

---

## 7. VALIDATION

Run from the repository root. The cores these hooks call carry the tests, and they use two runners.

```bash
node --test .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.test.mjs
npx vitest run .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.test.mjs
```

Expected result: all tests pass.

---

## 8. RELATED

- [`../lib/README.md`](../lib/README.md)
- [`../../SKILL.md`](../../SKILL.md)
- [`../../README.md`](../../README.md)
