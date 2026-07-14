---
title: "lib: Runtime-Neutral CLI Dispatch Cores"
description: "Two dependency-free cores shared by the dispatch hooks across runtimes: a hard-rule engine that gates a command before it spawns and an audit core that records it after."
trigger_phrases:
  - "cli dispatch cores"
  - "dispatch rule engine"
  - "dispatch audit core"
  - "hard rules engine"
---

# lib: Runtime-Neutral CLI Dispatch Cores

---

## 1. OVERVIEW

`scripts/lib/` holds the two dependency-free cores that the dispatch hooks in `../hooks/` share across the Claude, OpenCode, and Codex runtimes. `dispatch-rule-checks.mjs` gates a composed command before it spawns. `dispatch-audit.mjs` records a completed command as one JSONL line. Both parse only what they need, hold no external dependency, and fail open, so the enforcement and telemetry paths survive even when a daemon is down.

Current state:

- No external dependencies and no daemon. Each core reads the input it is handed and returns.
- `DISPATCH_SHAPES` in `dispatch-audit.mjs` is the single source of truth for what counts as a dispatch. The preflight lint reads the same list, so the before-check and the after-audit cannot disagree.
- Each core has a co-located test file, and the two files use different runners (see VALIDATION).

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                         scripts/lib/                           │
╰──────────────────────────────────────────────────────────────╯

  command text + payload
        │
        ├───────────────▶ dispatch-rule-checks  (gate before spawn)
        │                   parseHardRules · readHardRules · evaluate
        │
        └───────────────▶ dispatch-audit        (record after finish)
                            DISPATCH_SHAPES · matchDispatchShape
                            extractDispatchMeta · buildAuditLine
                            recordDispatch · appendAuditLog

  Consumed by ../hooks/ (Claude, OpenCode, Codex). Cores import
  only Node built-ins and never import a hook.
```

---

## 3. DIRECTORY TREE

```text
scripts/lib/
├── dispatch-rule-checks.mjs        # hard-rule engine (parse + evaluate)
├── dispatch-rule-checks.test.mjs   # node --test coverage for the engine
├── dispatch-audit.mjs              # audit trail core (shape + meta + JSONL log)
└── dispatch-audit.test.mjs         # vitest coverage for the audit core
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `dispatch-rule-checks.mjs` | Parses the hard-rule list from a skill's SKILL.md and evaluates each rule against a command. Exports `parseHardRules`, `readHardRules`, `CHECKS`, `KNOWN_CHECKS`, and `evaluate`, which returns only the violated rules. Each check is a pure function. Reads a missing or malformed SKILL.md as an empty rule set (fail open). |
| `dispatch-audit.mjs` | Recognizes a dispatch shape, extracts the model and target and duration and size hints, scrubs and truncates the command, formats one JSONL line, and appends it to a size-rotated log. Exports `DISPATCH_SHAPES`, `matchDispatchShape`, `extractDispatchMeta`, `buildAuditLine`, `appendAuditLog`, `recordDispatch`, `DEFAULT_LOG_RELATIVE_PATH`, `KILL_SWITCH_ENV`, and `isAuditDisabled`. |
| `dispatch-rule-checks.test.mjs` | Coverage for the rule engine, run with Node's built-in test runner. |
| `dispatch-audit.test.mjs` | Coverage for the audit core, run with vitest. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Cores import only Node built-ins (`node:fs`, `node:path`). They never import from `../hooks/`. |
| Exports | Consumed by the adapters in `../hooks/` (including the `codex/` siblings) and by the fan-out in-process guard. |
| Failure | Every exported function fails open. A parse error or IO fault returns a safe empty result rather than throwing past its boundary. |
| Kill switch | Set `MK_CLI_DISPATCH_AUDIT_DISABLED=1` (the `KILL_SWITCH_ENV` value) to turn the audit surface into a no-op under any runtime. |

Main flow (audit core):

```text
╭────────────────────────────────────────────╮
│ completed command + output metadata         │
╰────────────────────────────────────────────╯
                  │
                  ▼
┌────────────────────────────────────────────┐
│ matchDispatchShape (fast-exit if none)      │
└────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ extractDispatchMeta, then scrub + truncate  │
└────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ buildAuditLine, then appendAuditLog         │
└────────────────────────────────────────────┘
                  │
                  ▼
╭────────────────────────────────────────────╮
│ one JSONL line in a size-rotated log        │
╰────────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `evaluate` | Function | Returns the violated hard rules for a command. Used by the preflight lint. |
| `readHardRules` | Function | Reads and parses the hard rules from a SKILL.md path. Returns an empty list on any read error. |
| `recordDispatch` | Function | Full record path. Recognizes, scrubs, formats, and appends one audit line. Used by the audit hook. |
| `DISPATCH_SHAPES` | Constant | The shared registry of dispatch command patterns, read by both the audit core and the preflight lint. |

---

## 7. VALIDATION

Run from the repository root. The two test files use different runners.

```bash
node --test .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.test.mjs
npx vitest run .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.test.mjs
```

Expected result: all tests pass.

---

## 8. RELATED

- [`../hooks/README.md`](../hooks/README.md)
- [`../../SKILL.md`](../../SKILL.md)
- [`../../README.md`](../../README.md)
