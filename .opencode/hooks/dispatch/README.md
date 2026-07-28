---
title: "Dispatch Hooks: CLI Dispatch Preflight + Audit"
description: "Hard-rule preflight lint and JSONL audit trail for composed CLI dispatch commands, shared by Claude, Devin, Codex, Pi and OpenCode adapters."
trigger_phrases:
  - "dispatch preflight lint"
  - "dispatch audit trail"
  - "hard rules engine"
---

# Dispatch Hooks: CLI Dispatch Preflight + Audit

---

## 1. OVERVIEW

`dispatch/` owns two concerns that fire around composed CLI dispatch commands (`opencode run`, `claude -p`, `devin -p`, and siblings): a **preflight lint** that evaluates a dispatch skill's declared `hard_rules:` against the command string *before* it spawns, and an **audit trail** that appends one scrubbed JSONL line per completed dispatch. Both cores are dependency-free by design so enforcement survives even when the skill advisor daemon is down.

The `DISPATCH_SHAPES` regexes in `lib/dispatch-audit.mjs` are the single source of truth for what counts as a dispatch, shared by both concerns. The audit kill switch is `MK_CLI_DISPATCH_AUDIT_DISABLED`.

---

## 2. DIRECTORY TREE

```text
dispatch/
+-- lib/
|   +-- dispatch-rule-checks.mjs       # hard-rule engine: parses SKILL.md hard_rules frontmatter, evaluates checks
|   +-- dispatch-rule-checks.test.mjs  # node --test
|   +-- dispatch-audit.mjs             # dispatch-shape recognition, scrubbing, JSONL append, log rotation
|   `-- dispatch-audit.test.mjs        # npx vitest run
+-- claude/   dispatch-preflight-lint.mjs, dispatch-audit-posttooluse.mjs
+-- devin/    (same pair)
`-- codex/    (same pair)
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lib/dispatch-rule-checks.mjs` | Reads a dispatch skill's `hard_rules:` YAML frontmatter and evaluates each rule against a composed shell command. Parses just enough YAML for the flat list shape rather than pulling a library. Checks fail open: a throwing check never blocks a dispatch. |
| `lib/dispatch-audit.mjs` | Runtime-neutral audit core: recognizes dispatch shapes, extracts model/target/duration hints, scrubs credentials (structural PEM/JWT patterns plus flag/env/bearer forms), truncates, and appends to a size-rotated log. Never writes stdout/stderr, never throws past its boundary. |
| `{claude,devin,codex}/dispatch-preflight-lint.mjs` | PreToolUse adapters. A `block`-severity violation denies with the rule's reason; `warn` attaches an advisory. Fast-exit on non-dispatch commands, fail open on any internal error. |
| `{claude,devin,codex}/dispatch-audit-posttooluse.mjs` | PostToolUse adapters feeding the audit core after a Bash/exec call completes. Observe-only, never blocks. |

Pi (`.pi/extensions/dispatch-preflight-lint.ts`, `dispatch-audit.ts`) and OpenCode (`.opencode/plugins/mk-cli-dispatch-audit.js`, `mk-git-preflight-advisory.js`) import these cores from their own runtime-pinned locations. Cursor has no dispatch wiring today; its Shell events reach `dispatch-audit-posttooluse.mjs` through `system-spec-kit`'s cursor `post-tool-use.mjs` proxy.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `lib/` cores import Node builtins only. Adapters import their own `../lib/` — nothing outside this tree. |
| Decisions | Preflight may deny (`block` severity) or advise (`warn`). Audit never decides; it only records. |
| Failure | Every path fails open. A missing SKILL.md, malformed frontmatter, or throwing check resolves to allow. |

---

## 5. VALIDATION

```bash
node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs
```

Expected result: all tests pass.

---

## 6. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../../skills/system-spec-kit/references/hooks/injection-contract.md`](../../skills/system-spec-kit/references/hooks/injection-contract.md): what each hook injects and its operator visibility.
- [`../../skills/cli-external-orchestration/cli-opencode/SKILL.md`](../../skills/cli-external-orchestration/cli-opencode/SKILL.md): the primary `hard_rules:` declarer these checks enforce.
