---
title: "Dispatch Hooks: CLI Dispatch Preflight + Audit"
description: "Hard-rule preflight lint and JSONL audit trail for composed CLI dispatch commands, shared by Claude, Devin, Codex, Cursor, Pi and OpenCode adapters."
trigger_phrases:
  - "dispatch preflight lint"
  - "dispatch audit trail"
  - "hard rules engine"
---

# Dispatch Hooks: CLI Dispatch Preflight + Audit

---

## 1. OVERVIEW

`dispatch/` owns two concerns that fire around composed CLI dispatch commands (`opencode run`, `claude -p`, `codex exec`, `devin -p`, and siblings): a **preflight lint** that evaluates a dispatch skill's declared hard rules (`hard-rules.json` beside its `SKILL.md`) against the command string *before* it spawns, and an **audit trail** that appends one scrubbed JSONL line per completed dispatch. Both cores are dependency-free by design so enforcement survives even when the skill advisor daemon is down.

The `DISPATCH_SHAPES` registry in `lib/dispatch-audit.mjs` is the single source of truth for what counts as a dispatch, shared by both concerns so the before-lint and the after-audit can never disagree about a command's shape. The preflight may deny or advise; the audit never decides, it only records. Every path fails open: a missing `SKILL.md`, malformed sidecar JSON, a throwing check, or an unwritable log resolves to allow/skip, never to a blocked or broken dispatch.

The concern is one runtime-neutral pair of cores plus a thin adapter per runtime. The cores make every decision; each adapter only translates its runtime's event shape into the core's input and delivers the result.

---

## 2. WHAT IT DOES

**Preflight lint** fires before a composed CLI dispatch command spawns. It matches the command against `DISPATCH_SHAPES`, resolves the matched skill's `SKILL.md`, reads the `hard-rules.json` sidecar beside it, and evaluates each rule. A `block`-severity violation denies the tool call with this reason (the model sees it as the denial message):

```text
Dispatch blocked by <skill> hard-rule(s):
  • [<rule-id>] <rule message>
```

`warn`-severity violations let the call proceed but inject this into the model's context as `additionalContext`:

```text
⚠ <skill> dispatch hard-rule advisory:
  • [<rule-id>] <rule message>
```

The 28 checks currently registered in `lib/dispatch-rule-checks.mjs` (`CHECKS`), with the messages the declaring skill's sidecar carries:

| Check id | Satisfied when |
|---|---|
| `stdin-redirect-required` | A headless dispatch (`opencode run`, `pi -p`, `claude -p`, `codex exec`, `devin -p`, `cursor-agent -p`, `hermes chat`, `hermes -z`) closes or redirects stdin (`</dev/null`, heredoc, herestring, a pipe feeding the CLI, or `--query-file` on `hermes chat`); every dispatch in a chain needs its own, and a redirect inside a quoted prompt does not count |
| `explicit-model-required` | An `opencode run` command passes `-m`/`--model`; every dispatch in a chain needs its own, and a flag inside a quoted prompt does not count |
| `no-bare-agent-general` | No bare top-level `--agent general` (opencode rejects it at runtime) |
| `command-flag-for-slash-prompt` | A slash-command-shaped prompt (`/family:name ...`) is paired with `--command` |
| `v2-slash-prompt-route` | No slash-command-shaped prompt is handed to an OpenCode v2 `run`, which does not expand it |
| `share-requires-confirmation` | No `--share` flag present (a deprecated no-op on OpenCode 1.19.3, absent on OpenCode 2) |
| `pi-offline-required` | A non-interactive `pi -p` command passes `--offline` |
| `pi-provider-qualified-model` | A `--model` given to `pi -p` carries its provider as `provider/model` |
| `command-v-codex-required` | A command invoking `codex` resolves a `codex` executable on `PATH` |
| `command-v-cursor-agent-required` | A command invoking `cursor-agent` resolves a `cursor-agent` executable on `PATH` |
| `command-v-devin-required` | A command invoking `devin` resolves a `devin` executable on `PATH` |
| `command-v-pi-required` | A command invoking `pi` resolves a `pi` executable on `PATH` |
| `command-v-hermes-required` | A command invoking `hermes` resolves a `hermes` executable on `PATH` |
| `hermes-yolo-required-for-writes` | A `hermes chat` run whose toolset can execute commands or write (`terminal`, `coding`, `code_execution`, `browser`) passes `--yolo` |
| `hermes-ignore-rules-required` | Every `hermes chat` command passes `--ignore-rules` |
| `hermes-explicit-toolsets-required` | `hermes chat` names an explicit `-t`/`--toolsets` list that includes `file` and excludes `delegation` and `memory` |
| `hermes-no-worktree-flag` | No `--worktree` flag present |
| `hermes-mcp-config-operator-required` | No `hermes mcp add`/`remove`/`rm`/`install` (an operator step, not a dispatch) |
| `hermes-hooks-user-level` | No `--accept-hooks` flag present |
| `jev-stdin-bounded` | A judgment whose state comes from stdin also feeds or closes stdin (`</dev/null`, a pipe, or a heredoc) |
| `jev-choice-option-cardinality` | A `jev choice` command passes at least two `-o`/`--option` values |
| `jev-score-level-cardinality` | A `jev score` command passes at least two `-l`/`--level` values |
| `jev-value-not-with-run` | No `--value` flag on `jev run` |
| `jev-custom-endpoint-required` | A `--provider custom` judgment names `--endpoint` or carries `JEV_ENDPOINT` |
| `jev-no-inline-credential` | No credential variable is assigned inline on a `jev` or `jev-mcp` command |
| `jev-mcp-host-only` | No `jev-mcp` server is started from a shell |
| `command-v-jev-required` | A command invoking `jev` resolves a `jev` executable on `PATH` |
| `non-interactive-permission-mode-risk` | A `claude -p`/`--print` command runs with `--dangerously-skip-permissions` or `--permission-mode bypassPermissions` |

A check returns `true` when the command *satisfies* the rule; `false` means violated. An unknown check id is skipped (the CI validator catches typos, not this hot path), and a throwing check resolves to satisfied so it can never block a dispatch.

**Audit** injects nothing into the model. After each completed dispatch it appends one scrubbed, truncated JSONL line to the size-rotated log at `.skilled/logs/cli-dispatch-audit.log` (512 KB cap, rotated to a `.1` backup):

```json
{"schema_version":1,"ts":"<ISO>","runtime":"<claude|codex|devin|opencode|pi>","sessionID":"...","callID":"...","skill":"...","command":"<scrubbed>","commandTruncated":false,"model":"...","target":"...","durationMs":1234,"exitCode":0,"outputBytes":5678}
```

The command is scrubbed before it lands on disk: secret-bearing flags (`--api-key`/`--token`/`--secret`/`--password`), env assignments whose name contains token/key/secret/password, `Authorization: Bearer|Basic` headers, header-style credentials, bare provider key prefixes (`sk-...`, `ghp_...`, `xox...`, `AKIA...`), PEM key/certificate blocks, and bare JWTs are each replaced with `[REDACTED]`. The command is then truncated to 500 chars; `model` and `target` run through the same scrub+truncate pipeline. The full pipeline (`recordDispatch`) is fail-open throughout: any internal error resolves to `false`, never a thrown exception.

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the **same** `lib/` cores. What differs is the event each runtime fires, the payload shape that event carries, and how the result is handed back. Claude, Codex, Devin, and Cursor each carry a preflight + audit pair; OpenCode preflights in-process from its plugin's `tool.execute.before` and audits from `tool.execute.after`; Pi carries a richer preflight (with its own authorization layer) plus audit. Only the post-execution halves are observe-only.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/dispatch-preflight-lint.mjs`, `claude/dispatch-audit-posttooluse.mjs` | `PreToolUse`/`PostToolUse` on `Bash` | `tool_name: 'Bash'`; reads `tool_input.command`, `tool_response.stdout`/`stderr` | Preflight: `permissionDecision: 'deny'` on block, `additionalContext` on warn. Audit: no output, exit 0. |
| **Codex** | `codex/dispatch-preflight-lint.mjs`, `codex/dispatch-audit-posttooluse.mjs` | `PreToolUse`/`PostToolUse` on `exec\|Bash` (`.codex/hooks.json`) | `tool_name: 'exec'` up to 0.15x, `'Bash'` from 0.160, whose PostToolUse response is one string; resolves project dir from `payload.cwd` or `CODEX_PROJECT_DIR` | Same deny/advisory envelope as Claude; audit tagged `runtime: 'codex'`. |
| **Devin** | `devin/dispatch-preflight-lint.mjs`, `devin/dispatch-audit-posttooluse.mjs` | `PreToolUse`/`PostToolUse` on `exec` (`.devin/hooks.v1.json`) | `tool_name: 'exec'`; whitespace-only `cwd` treated as absent, falls back to `DEVIN_PROJECT_DIR` | Same deny/advisory envelope; audit tagged `runtime: 'devin'`. |
| **Cursor** | `cursor/dispatch-preflight-lint.mjs`, `cursor/post-tool-use.mjs` | `preToolUse` and `postToolUse` events, both on the `Shell` matcher (`.cursor/hooks.json`) | Preflight spawns the Claude preflight with a Claude-shaped `Bash` payload and translates its envelope. PostToolUse is a multiplexed proxy: `Shell` tool_name → normalizes to `Bash` and `spawnSync`s `claude/dispatch-audit-posttooluse.mjs`; `Write` → post-edit-quality (separate concern). Cursor's `tool_output` is a JSON-stringified string, parsed back into `{stdout, exitCode}`. | Preflight: `{permission: 'deny'}` with `agent_message`/`user_message` and exit 2 on block, `agent_message` on warn, `{permission: 'allow'}` otherwise. Audit: proxy emits `{permission: 'allow'}` and never blocks. |
| **Pi** | `pi/dispatch-preflight-lint.ts`, `pi/dispatch-audit.ts` | `tool_call` / `tool_result` events, discovered via `.pi/extensions/` | `toolName: 'bash'`. Preflight is richer: captures raw user input on the `input` event, then runs `shouldDenyPiDispatch` authorization (ambiguous denied; direct-but-unnamed denied unless the user text explicitly names the executor or a `/deep:... --executor cli-*` carries it) *before* evaluating hard rules. | Preflight: `{block: true, reason}` on deny/block; `{reason}` on warn. Audit: `recordDispatch` tagged `runtime: 'pi'`. |
| **OpenCode** | `.skilled/plugins/cli-dispatch-audit.js` (mirrored at `opencode/`) | Plugin, `tool.execute.before` and `tool.execute.after` events | `input.tool: 'bash'`; anchors the log path to the repo root via `findRepoRoot` so a nested working directory cannot plant a stray `.opencode` tree; resolves the declaring skill under the checkout's source root | Preflight in-process: `tool.execute.before` throws with the block reason to deny. Audit: `tool.execute.after` records only, tagged `runtime: 'opencode'`. |

The three hosted CommonJS/ESM preflight-and-audit pairs (Claude, Codex, Devin) share the same structure: read stdin JSON, fast-exit on a non-dispatch tool name or non-matching command, evaluate the core, emit the result. Cursor deliberately does not reimplement either half: its preflight shapes a Claude payload and shells out to the Claude preflight adapter, and its postToolUse proxy does the same for the audit, so a future change to the rules or the audit logic lands in both without a second edit. OpenCode keeps both halves in-process in its plugin, the one surface where `tool.execute.before` can still stop a command. Pi is the only runtime that adds an authorization layer on top of the hard-rule lint, because a direct dispatch must be authorized by the operator's own request.

Two runtimes are mirrored rather than hosted here. OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/cli-dispatch-audit.js` is a browsability-only symlink back into that folder and nothing loads through it. Pi loads in the other direction: the real `pi/*.ts` files live here, and `.pi/extensions/` holds the relative symlinks Pi discovers. The `sk-git`-owned `sk-git-preflight-advisory.js` plugin reuses this concern's `lib/dispatch-rule-checks.mjs` engine but mirrors under `sk-git/scripts/hooks/opencode/`.

---

## 4. DIRECTORY TREE

```text
dispatch/
+-- lib/
|   +-- dispatch-rule-checks.mjs       # hard-rule engine: reads the hard-rules.json sidecar, evaluates checks
|   +-- dispatch-rule-checks.test.mjs  # node --test
|   +-- dispatch-audit.mjs             # dispatch-shape recognition, scrubbing, JSONL append, log rotation
|   `-- dispatch-audit.test.mjs        # vitest, the pinned .skilled binary
+-- claude/   dispatch-preflight-lint.mjs, dispatch-audit-posttooluse.mjs
+-- devin/    (same pair)
+-- codex/    (same pair), codex-shell-tool.test.mjs  # vitest, hooks config
+-- cursor/   dispatch-preflight-lint.mjs (Shell preflight), post-tool-use.mjs  # multiplexed proxy (Shell -> dispatch audit, Write -> post-edit-quality)
+-- pi/       dispatch-preflight-lint.ts, dispatch-audit.ts (real files; `.pi/extensions/` symlinks to them), dispatch-preflight-lint.test.ts, directive-dedup.test.ts  # vitest, hooks config
`-- opencode/ cli-dispatch-audit.js (browsability symlink -> ../../../plugins/; real file loaded from .opencode/plugins/)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/dispatch-rule-checks.mjs` | The hard-rule engine. `readHardRules` reads the `hard-rules.json` sidecar beside a SKILL.md (a JSON array of rule objects, no library). `CHECKS` holds the 28 pure check functions, enumerated as `KNOWN_CHECKS`. `evaluate` runs the rules against a command and returns only the violated ones, mapping `block`/`error` severity to `block` and everything else to `warn`; `evaluateDispatch` holds every dispatch in a chain to its own packet's rules. Imports Node builtins only. |
| `lib/dispatch-audit.mjs` | Runtime-neutral audit core. `DISPATCH_SHAPES` is the shared dispatch registry. `inspectDispatch` classifies a dispatch (tokenizing the shell command, distinguishing `direct`/`ambiguous`/`none`). `resolveDispatchPackets` returns every packet a command dispatches to, in order, and `resolveDispatchCommands` every dispatch with its unwrapped text; `matchDispatchShape` records the first packet the resolver names. `extractDispatchMeta` pulls model/target/duration/exit/size hints. `buildAuditLine` scrubs secrets, truncates, and formats one JSONL line. `appendAuditLog` does the size-rotated append. `recordDispatch` runs the whole pipeline. Never writes stdout/stderr, never throws past its boundary. |
| `claude/dispatch-preflight-lint.mjs`, `codex/` and `devin/` siblings | PreToolUse adapters. Through `evaluateDispatch`, each dispatch in a chain is evaluated against its own packet's rules. A `block` denies with the rule's reason; `warn` attaches an advisory. Fast-exit on non-dispatch commands, fail open on any internal error. |
| `claude/dispatch-audit-posttooluse.mjs`, `codex/` and `devin/` siblings | PostToolUse adapters feeding the audit core after a Bash/exec call completes. Observe-only, never emit a permission decision. |
| `cursor/post-tool-use.mjs` | Multiplexed Cursor proxy. For `Shell`, normalizes the tool name to `Bash`, parses the JSON-stringified `tool_output`, and `spawnSync`s the Claude audit adapter. Real home is under `system-spec-kit`; indexed here as a symlink. |
| `pi/dispatch-preflight-lint.ts` | Pi `tool_call` extension. Captures raw user input on the `input` event, resolves a wrapped or shell-run dispatch before running `shouldDenyPiDispatch` authorization (unnamed-direct denial), then evaluates every resolved packet's hard rules. |
| `pi/dispatch-audit.ts` | Pi `tool_result` extension. Calls `recordDispatch` tagged `runtime: 'pi'`. |

`.skilled/plugins/cli-dispatch-audit.js` is the OpenCode adapter; it imports this concern's `lib/dispatch-audit.mjs` core and the shared `hook-flags.cjs` resolver.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_DISPATCH_DISABLED=1` | Full no-op on every runtime. The shared resolver short-circuits both concerns: `isHookEnabled('dispatch')` silences every audit adapter and `isHookEnabled('dispatch-guard')` every preflight adapter. |
| `SYSTEM_DISPATCH_GUARD_DISABLED=1` | Preflight guard only: the adapters stop refusing before execution, while the audit log keeps recording. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Audit log only: the canonical flag of the `dispatch` concern and the audit core's own `KILL_SWITCH_ENV` (the audit adapters additionally call `isAuditDisabled`). The preflight guard keeps running. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `lib/` cores import Node builtins only. Adapters import their own `../lib/` and `../../shared/hook-flags.mjs` (or `hook-flags.cjs` for the OpenCode plugin): nothing outside this tree. The Pi adapters are the exception: they import `../../.skilled/hooks/shared/hook-flags.mjs`, a path written for their `.pi/extensions/` symlink, so a test loads them only under `.skilled/hooks/vitest.config.ts`, whose alias maps that path to the real tree. The Cursor proxy imports `hook-flags.mjs` by a deep repo-relative path because its real home is under `system-spec-kit`. |
| Decisions | Preflight may deny (`block` severity) or advise (`warn`). Audit never decides; it only records. Pi's preflight adds an authorization deny that is independent of the target skill's declared rules. |
| Failure | Every path fails open. A missing `SKILL.md`, malformed sidecar JSON, a throwing check, an unparsable payload, or an unwritable log resolves to allow/skip. |
| Output | The cores never write stdout or stderr. Each adapter owns its own transport. Audit writes only to the rotated log file. |

---

## 8. VALIDATION

```bash
node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs
```

```bash
# The adapter suites are vitest files; run them under the hooks config, whose alias resolves the Pi adapters' link-relative imports
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts .skilled/hooks/dispatch/pi/directive-dedup.test.ts
```

`node --test` cannot run these files, because they are vitest suites: the codex file fails with `Cannot read properties of undefined (reading 'config')`. A vitest run without `--config` runs two of them, but not `dispatch-preflight-lint.test.ts`, which fails on the Pi adapter's `hook-flags.mjs` import. Each command calls the pinned `.skilled/node_modules/.bin/vitest`, because vitest is installed under `.skilled/node_modules` and not at the repository root, so `npx vitest` run from the root does not find it and fetches or reuses a different copy.

Expected result: all tests pass.

```bash
node -e "import('./.skilled/plugins/cli-dispatch-audit.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (confirms the OpenCode adapter still resolves this core).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): the advisory's exact injected text and its visibility to the operator.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../skills/cli-external-orchestration/cli-opencode/SKILL.md`](../../skills/cli-external-orchestration/cli-opencode/SKILL.md): the primary hard-rule declarer these checks enforce.
