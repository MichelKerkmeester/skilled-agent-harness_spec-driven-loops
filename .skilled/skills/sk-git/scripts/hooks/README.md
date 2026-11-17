---
title: "Git Message Gate and Preflight Advisory: sk-git Command Hooks"
description: "Checks visible message text against sk-git rules and adds non-blocking guidance for selected git commands."
trigger_phrases:
  - "git preflight advisory hook"
  - "git advisory runtime matrix"
  - "SKGIT_ADVISORY"
  - "git hook fail open"
  - "dsh git message gate"
  - "repo-guards message contract"
  - "bash pre-execute deny"
  - "opencode git message gate"
  - "sk-git message contract"
  - "bash tool before hook"
  - "pi git message gate"
  - "tool_call block"
  - "shared git message gate"
  - "evaluateCommand commit message"
  - "pretooluse deny envelope"
  - "buffered system context"
  - "dsh git preflight advisory"
  - "opencode git preflight advisory"
  - "pi git preflight advisory"
  - "pretooluse additional context"
  - "repo-guards post execute"
  - "shared git preflight hook"
  - "sk-git advisory context"
  - "sk-git advisory extension"
  - "sk-git advisory plugin"
  - "SKGIT_ADVISORY_SKIP"
  - "tool result advisory"
version: 1.0.12.0
---

# Git Message Gate and Preflight Advisory: sk-git Command Hooks

---

## 1. OVERVIEW

The message gate checks visible text passed to `git commit` against the repository contract. It also checks PR bodies passed to `gh pr create` or `gh pr edit`. The gate checks branch names created by Git commands. It refuses visible violations and allows input it cannot parse or read.

The preflight advisory checks selected `git` commands against repository state. A match adds guidance for the runtime. It never blocks the command. The DSH adapter runs after the command and reads the state it left.

The concern keys are `git-message-gate` and `git-preflight`. The message gate has no switch. The preflight advisory uses `SK_GIT_PREFLIGHT_DISABLED` and honors `SYSTEM_HOOKS_DISABLED`.

`.skilled/hooks/git-message-gate/README.md` and `.skilled/hooks/git-preflight/README.md` are symlinks to this file. The message gate core is `git-message-gate.mjs`. The shared preflight entry is `git-preflight-advisory.mjs`. OpenCode and Pi have runtime adapters. DSH uses its bundle adapters.

---

## 2. HOW IT WORKS

The message gate exports `evaluateCommand(command, cwd)`. It parses shell input into simple commands. It checks the message passed to `git commit`. It checks a PR body passed to `gh pr create` or `gh pr edit`. It also checks branch names created by branch commands. It calls `loadContract` and `validateCommit` for commit text. It uses `validatePrBody` for PR text and `validateBranch` for new branch names from `message-contract.mjs`.

A failed rule returns refusal text. The gate allows a command it cannot parse or a message it cannot read. A malformed contract is refused by the runtime entry.

The preflight entry matches commands with `GIT_SHAPE`. It reads `hard-rules.json` beside sk-git's `SKILL.md` through `readHardRules`. `GIT_CHECKS` filters the rules to checks the code implements. The `evaluate` function runs those checks with repository state from `createGitContext`. The advisory reports up to three findings and a count for any it omits.

---

## 3. RUNTIME COVERAGE

| Runtime | Message gate entry and real file | Preflight entry and real file | Runtime result |
|---|---|---|---|
| Claude | Registry ID `git-message-gate`. File `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`. | Registry ID `git-preflight-advisory`. File `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. | Gate returns a deny envelope. Advisory adds `additionalContext`. |
| Codex | Registry ID `git-message-gate`. File `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`. | Registry ID `git-preflight-advisory`. File `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. | Gate returns a deny envelope. Advisory adds `additionalContext`. |
| Cursor | Registry ID `git-message-gate`. File `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`. | Registry ID `git-preflight-advisory`. File `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. | The gate's deny is followed by the registration's allow fallback. Advisory writes the Claude-shaped `hookSpecificOutput.additionalContext`, not Cursor's `permission` and `agent_message` envelope, and no Cursor translation is registered. |
| Devin | Registry ID `git-message-gate`. File `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`. | Registry ID `git-preflight-advisory`. File `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`. | Gate returns a deny envelope. Advisory adds `additionalContext`. |
| OpenCode | Plugin `sk-git-message-gate.js`. Real file `.opencode/plugins/sk-git-message-gate.js`. | Plugin `sk-git-preflight-advisory.js`. Real file `.opencode/plugins/sk-git-preflight-advisory.js`. | Gate throws a refusal. Advisory adds a system block on the next transform. |
| Pi | Entry `.pi/extensions/git-message-gate.ts`. Real file `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts`. | Entry `.pi/extensions/git-preflight-advisory.ts`. Real file `.skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`. | Gate returns a block reason. Advisory appends text to the tool result. |
| DSH | Entry `.dsh/plugins/repo-guards/adapters/git-message-gate.mjs`. Real file `.skilled/skills/sk-git/scripts/hooks/dsh/git-message-gate.mjs`. | Entry `.dsh/plugins/repo-guards/adapters/git-preflight-advisory.mjs`. Real file `.skilled/skills/sk-git/scripts/hooks/dsh/git-preflight-advisory.mjs`. | Gate denies before execution. Advisory adds context after the command. |
| Vibe | Entry `git-message-gate` in `.vibe/hooks.toml`. File `.vibe/plugins/repo-guards/git-message-gate.mjs`. | None. `.vibe/hooks.toml` has no preflight entry. | Gate returns a deny object. No preflight advisory runs. |

The shared [hook registry](../../../system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json) names the entries `git-preflight-advisory` and `git-message-gate`. Claude, Codex, Devin and Cursor use generated registrations in these files:

- `.claude/settings.json` registers both IDs for `PreToolUse` with matcher `Bash`. Its timeout is `5` seconds.
- `.codex/hooks.json` registers both IDs for `PreToolUse` with matcher `exec|Bash`. Its timeout is `5` seconds.
- `.devin/hooks.v1.json` registers both IDs for `PreToolUse` with matcher `^exec$`. Its timeout is `5` seconds.
- `.cursor/hooks.json` registers both IDs for `preToolUse` with matcher `Shell`. Its timeout is `10` seconds.

OpenCode's plugin glob is `.opencode/plugins/`. Pi loads `.pi/extensions/git-message-gate.ts` and `.pi/extensions/git-preflight-advisory.ts`. Each entry re-exports its adapter from this skill.

The DSH bundle entry `.dsh/plugins/repo-guards/index.mjs` imports both adapters through `.dsh/plugins/repo-guards/adapters/`. Vibe registers only the message gate in `.vibe/hooks.toml` as `pre_tool` with match `re:bash|process_start|process_write`.

Cursor's generated command uses a `||` fallback. If the gate exits with status 2, the fallback writes an allow envelope after the deny envelope.

The shared message entry exits 0 without output on an unexpected error. OpenCode and Pi swallow unexpected gate errors. DSH logs them and continues. Vibe writes them to stderr and allows the call. A malformed contract is refused.

The preflight adapters fail open. The shared entry exits 0 without output on an error. OpenCode and Pi omit the advisory when evaluation fails. DSH logs a warning and keeps the downstream result.

---

## 4. DIRECTORY TREE

```text
.skilled/hooks/
+-- git-message-gate/
|   +-- README.md
|   +-- dsh/git-message-gate.mjs
|   +-- opencode/sk-git-message-gate.js
|   +-- pi/git-message-gate.ts
|   +-- shared/git-message-gate.mjs
|   +-- tests/dsh-git-message-gate.test.mjs
|   `-- vibe/git-message-gate.mjs
`-- git-preflight/
    +-- README.md
    +-- dsh/git-preflight-advisory.mjs
    +-- opencode/sk-git-preflight-advisory.js
    +-- pi/git-preflight-advisory.ts
    +-- shared/git-preflight-advisory.mjs
    `-- tests/dsh-git-preflight-advisory.test.mjs
```

Both README entries are symlinks to this file. The runtime index entries point to code under the sk-git skill or plugin folders.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `git-message-gate.mjs` | Exports `evaluateCommand` and checks visible shell text against the message contract. |
| `git-preflight-advisory.mjs` | Reads hook input and returns advisory context for shell-hook runtimes. |
| `../lib/message-contract.mjs` | Loads and validates the repository's message rules. |
| `../lib/git-rule-checks.mjs` | Matches git command shapes and implements the preflight checks. |
| `../lib/git-context.mjs` | Supplies repository state to preflight checks. |
| `../../../../hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Reads `hard-rules.json` and evaluates its rules. |

---

## 6. CONFIGURATION

The message gate has no switch. These switches control the preflight advisory.

| Switch | Effect |
|---|---|
| `SK_GIT_PREFLIGHT_DISABLED=1` | Turns off the preflight advisory. |
| `SYSTEM_HOOKS_DISABLED=1` | Turns off preflight with other hooks that honor the master switch. |
| `SKGIT_ADVISORY=0` | Silences every preflight advisory. |
| `SKGIT_ADVISORY_SKIP=<rule-id>` | Silences an exact rule ID or an ID prefix. Comma-separated values are accepted. |

---

## 7. VALIDATION

The shared rule and contract suites are linked here. Other links cover runtime adapters.

| Suite | Coverage |
|---|---|
| [Git rule tests](../lib/git-rule-checks.test.mjs) | Preflight command parsing and state checks. |
| [Message contract tests](../lib/message-contract.test.mjs) | Contract parsing and message validation. |
| [Shared preflight tests](./git-preflight-advisory.test.mjs) | Shared stdin hook behavior. |
| [DSH message gate tests](../../../../hooks/git-message-gate/tests/dsh-git-message-gate.test.mjs) | DSH message gate adapter. |
| [DSH preflight tests](../../../../hooks/git-preflight/tests/dsh-git-preflight-advisory.test.mjs) | DSH advisory adapter. |
| [OpenCode message gate tests](../../../../../.opencode/plugins/tests/sk-git-message-gate.test.cjs) | OpenCode refusal and pass paths. |
| [Pi message gate tests](./pi/git-message-gate.test.ts) | Pi block and pass paths. |
| [Vibe message gate tests](../../../../../.vibe/plugins/repo-guards/tests/git-message-gate.test.mjs) | Vibe pre-tool gate behavior. |

Run this smoke test from the repository root:

```bash
SK_GIT_PREFLIGHT_DISABLED=1 node .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs < /dev/null
```

Expected result: no output and exit status `0`.

---

## 8. RELATED

- [Hooks index](../../../../hooks/README.md): the hook coverage matrix.
- [sk-git skill](../../SKILL.md): the contract rules and workflow.
- [Message contract code](../lib/message-contract.mjs): contract loading and validation.
- [Git rule checks](../lib/git-rule-checks.mjs): preflight command checks.
- [Hook flags](../../../../hooks/shared/hook-flags.cjs): shared concern switches.
