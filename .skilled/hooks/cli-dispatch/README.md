---
title: "Dispatch Hooks: CLI Dispatch Preflight + Audit"
description: "Hard-rule preflight lint and JSONL audit trail for composed CLI dispatch commands, shared by Claude, Devin, Codex, Cursor, Pi, OpenCode and DeepSeek Harness adapters. The DSH adapters at `.dsh/plugins/repo-guards/adapters/dispatch-preflight-lint.mjs` and `dispatch-audit.mjs` call the same cores."
trigger_phrases:
  - "dispatch preflight lint"
  - "dispatch audit trail"
  - "hard rules engine"
  - "opencode dispatch audit"
  - "opencode dispatch preflight"
  - "cli dispatch audit plugin"
---

# Dispatch Hooks: CLI Dispatch Preflight + Audit

---

## 1. OVERVIEW

`cli-dispatch/` owns two concerns that fire around composed CLI dispatch commands (`opencode run`, `claude -p`, `codex exec`, `devin -p` and siblings). The first is a preflight lint. It evaluates a dispatch skill's declared hard rules against the command string before the command spawns. The rules live in `hard-rules.json` beside the skill's `SKILL.md`. The second is an audit trail. It appends one scrubbed JSONL line per completed dispatch.

Both cores are dependency-free, so enforcement survives a skill advisor daemon outage.

The `DISPATCH_SHAPES` registry in `lib/dispatch-audit.mjs` is the single source of truth for what counts as a dispatch. Both concerns read it, so the before-lint and the after-audit cannot disagree about a command's shape. It maps `vibe`, `vibe-rs` and `vibe-acp` to `cli-mistral-vibe`. The session-free forms start no run and are excluded. Those forms are `-v`/`--version`, `-h`/`--help` and the `config`, `mcp` and `help` subcommands.

The preflight may deny or advise. The audit never decides, it only records. Every path fails open except the DSH preflight, which denies when the shared rule check throws.

The concern is one runtime-neutral pair of cores plus a thin adapter per runtime. The cores decide. Each adapter only translates its runtime's event shape.

---

## 2. HOW IT WORKS

Preflight lint fires before a composed CLI dispatch command spawns. It matches the command against `DISPATCH_SHAPES`, resolves the matched skill's `SKILL.md`, reads the `hard-rules.json` sidecar beside it and evaluates each rule.

A `block`-severity violation denies the tool call with this reason. The model sees it as the denial message:

```text
Dispatch blocked by <skill> hard-rule(s):
  • [<rule-id>] <rule message>
```

`warn`-severity violations let the call proceed but inject this into the model's context as `additionalContext`:

```text
⚠ <skill> dispatch hard-rule advisory:
  • [<rule-id>] <rule message>
```

The 40 checks registered in `lib/dispatch-rule-checks.mjs` (`CHECKS`), with the messages the declaring skill's sidecar carries:

| Check id | Satisfied when |
|---|---|
| `stdin-redirect-required` | A headless dispatch (`opencode run`, `pi -p`, `claude -p`, `codex exec`, `devin -p`, `cursor-agent -p`, `vibe -p`, `vibe --prompt-file`) closes or redirects stdin (`</dev/null`, heredoc, herestring or a pipe feeding the CLI). A pipe into a bare `vibe -p` counts. |
| `explicit-model-required` | An `opencode run` command passes `-m`/`--model`. |
| `no-bare-agent-general` | No bare top-level `--agent general`, which opencode rejects at runtime. |
| `command-flag-for-slash-prompt` | A slash-command-shaped prompt (`/<family>:<name> ...`) is paired with `--command`. |
| `v2-slash-prompt-route` | No slash-command-shaped prompt is handed to an OpenCode v2 `run`, which does not expand it. |
| `share-requires-confirmation` | No `--share` flag present. It is a deprecated no-op on OpenCode 1.19.3 and absent on OpenCode 2. |
| `pi-offline-required` | A non-interactive `pi -p` command passes `--offline`. |
| `pi-provider-qualified-model` | A `--model` given to `pi -p` carries its provider as `provider/model`. |
| `command-v-codex-required` | A command invoking `codex` resolves a `codex` executable on `PATH`. |
| `command-v-cursor-agent-required` | A command invoking `cursor-agent` resolves a `cursor-agent` executable on `PATH`. |
| `command-v-devin-required` | A command invoking `devin` resolves a `devin` executable on `PATH`. |
| `command-v-pi-required` | A command invoking `pi` resolves a `pi` executable on `PATH`. |
| `jev-stdin-bounded` | A judgment whose state comes from stdin also feeds or closes stdin (`</dev/null`, a pipe or a heredoc). |
| `jev-choice-option-cardinality` | A `jev choice` command passes at least two `-o`/`--option` values. |
| `jev-score-level-cardinality` | A `jev score` command passes at least two `-l`/`--level` values. |
| `jev-value-not-with-run` | No `--value` flag on `jev run`. |
| `jev-custom-endpoint-required` | A `--provider custom` judgment names `--endpoint` or carries `JEV_ENDPOINT`. |
| `jev-no-inline-credential` | No credential variable is assigned inline on a `jev` or `jev-mcp` command. |
| `jev-mcp-host-only` | No `jev-mcp` server is started from a shell. |
| `command-v-jev-required` | A command invoking `jev` resolves a `jev` executable on `PATH`. |
| `non-interactive-permission-mode-risk` | A `claude -p`/`--print` command runs with `--dangerously-skip-permissions` or `--permission-mode bypassPermissions`. |
| `headless-only` | A dsh dispatch uses the headless profile and one task. |
| `stdin-dash-required` | A dsh dispatch ends with a lone `-` and closes stdin after sending the prompt. |
| `route-patch-required` | A dsh dispatch passes exactly one of the two approved route patches before app flags. |
| `closed-roster` | Every dsh route and patch belongs to the closed roster of approved route and checkout patch files. |
| `approval-never-required` | An unattended dsh dispatch passes `--approval-policy never`. |
| `dsh-home-isolated` | `DSH_HOME` points to a disposable directory outside the checkout. A `$REPO` path counts as the checkout. |
| `lineage-patch-required` | A dsh dispatch passes `.dsh/patches/lineage.patch.yml`. |
| `guards-patch-required` | Every dsh dispatch passes `.dsh/patches/guards.patch.yml` before app flags. |
| `json-final-and-exit-required` | A dsh caller requires `--json`, exit 0 and a final event with `reason.kind` `completed`. |
| `pinned-version-required` | An explicit `npx @deepseek-ai/dsh@<version>` names `0.2.2-rc.3`. Command text cannot read an installed binary's version. |
| `command-v-dsh-required` | A command invoking `dsh` resolves a `dsh` executable on `PATH`. |
| `no-repo-root-dotenv` | A dsh dispatch does not use the repository root as its working directory, including through `cd "$REPO"`. |
| `mcp-opt-in-only` | MCP remains disabled unless the dispatch explicitly passes its dedicated patch. |
| `print-mode-only` | A `vibe` dispatch runs print mode (`vibe -p TEXT`, a pipe into a bare `vibe -p` or `vibe --prompt-file PATH`). A bare interactive `vibe` and the `vibe-acp` agent are refused. |
| `isolated-vibe-home` | A `vibe` dispatch sets `VIBE_HOME` to a disposable directory outside the checkout and the operator's `~/.vibe`. An unset home, a checkout path, a tilde or `$HOME`/`$PWD`/command-substitution path and `~/.vibe` are refused. |
| `output-dir-required` | A `vibe` dispatch passes `--output-dir` naming a directory outside the checkout, where `export.json` carries the outcome. A missing flag and a directory inside the checkout are refused. |
| `rendered-home-hooks` | A `vibe` dispatch chains the home-hooks render before the run and its argument repeats the home the run sets. |
| `vibe-closed-roster` | A `vibe` dispatch's `--model` names a roster alias (`deepseek-flash` or `glm-flash`). A missing model, an unexpanded variable and any other alias are refused. |
| `no-repo-root-cwd` | A `vibe` dispatch runs outside the repository root, including through `--workdir`. A run started at the root is refused. |

A check returns `true` when the command satisfies the rule. `false` means violated. An unknown check id is skipped, because the CI validator catches typos and this hot path does not. A throwing check resolves to satisfied, so it can never block a dispatch.

A rule that declares `block` or the stronger `error` severity denies the dispatch. Every other severity is advisory. Every dispatch in a chain is held to its own packet's rules. A redirect or a flag inside a quoted prompt does not count.

**Audit** injects nothing into the model. After each completed dispatch it appends one scrubbed, truncated JSONL line to the size-rotated log at `<repository root>/.skilled/logs/cli-dispatch-audit.log`. The cap is 512 KB, rotated to a `.1` backup. Most adapters resolve the Git top-level from their working directory. DSH uses the checkout that holds its own file. A directory outside a Git repository is used as it stands:

```json
{"schema_version":1,"ts":"<ISO>","runtime":"<claude|codex|devin|opencode|pi|dsh>","sessionID":"...","callID":"...","skill":"...","command":"<scrubbed>","commandTruncated":false,"model":"...","target":"...","durationMs":1234,"exitCode":0,"outputBytes":5678}
```

The command is scrubbed before it lands on disk. Secret-bearing flags (`--api-key`/`--token`/`--secret`/`--password`) and env assignments whose name contains token/key/secret/password are replaced with `[REDACTED]`. So are `Authorization: Bearer|Basic` headers, header-style credentials, bare provider key prefixes (`sk-...`, `ghp_...`, `xox...`, `AKIA...`), PEM key/certificate blocks and bare JWTs. The command is then truncated to 500 chars. `model` and `target` run through the same scrub and truncate pipeline. The full pipeline (`recordDispatch`) is fail-open throughout. Any internal error resolves to `false`, never a thrown exception.

### Boundaries

| Boundary | Rule |
|---|---|
| Imports | `lib/` cores import Node builtins only. Adapters import their own `../lib/` and `../../shared/hook-flags.mjs`. The OpenCode plugin imports `hook-flags.cjs` instead. Nothing outside this tree. |
| Decisions | Pi's preflight adds an authorization deny that is independent of the target skill's declared rules. |
| Failure | A missing `SKILL.md`, malformed sidecar JSON, a throwing check, an unparsable payload or an unwritable log resolves to allow or skip. The DSH preflight denies instead. |
| Output | The cores never write stdout or stderr. Each adapter owns its own transport. Audit writes only to the rotated log file. |

The Pi preflight is the one import exception. It tries a long specifier such as `../../.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` first and falls back to `../lib/`. Only the long one resolves through the test alias in `.skilled/hooks/vitest.config.ts`, whose alias maps that path to the real tree. The Cursor proxy imports `hook-flags.mjs` by a deep repo-relative path, because its real home is under `system-spec-kit`.

---

## 3. RUNTIME COVERAGE

Every runtime evaluates the same `lib/` cores. What differs is the event each runtime fires, the payload shape that event carries and how the result is handed back. Only the post-execution halves are observe-only.

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse`, `PostToolUse` on `Bash`, 5 seconds | `claude/dispatch-preflight-lint.mjs`, `claude/dispatch-audit-posttooluse.mjs` | The same pair. | A deny reason, an advisory or nothing. |
| Codex | `PreToolUse`, `PostToolUse` on `exec\|Bash`, 5 seconds | `codex/dispatch-preflight-lint.mjs`, `codex/dispatch-audit-posttooluse.mjs` | The same pair. | The same envelope as Claude. |
| Devin | `PreToolUse`, `PostToolUse` on `^exec$`, 5 seconds | `devin/dispatch-preflight-lint.mjs`, `devin/dispatch-audit-posttooluse.mjs` | The same pair. | The same envelope as Claude. |
| Cursor | `preToolUse` on `Shell`, 10 seconds, plus `postToolUse` | `cursor/dispatch-preflight-lint.mjs`, `cursor/post-tool-use.mjs` | `cursor/post-tool-use.mjs` links to `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`. | A deny or allow permission envelope, always. |
| Pi | `input`, `tool_call`, `tool_result` | `pi/dispatch-preflight-lint.ts`, `pi/dispatch-audit.ts` | The same pair. | A block reason, an advisory or nothing. |
| OpenCode | `tool.execute.after`, `tool.execute.before` | `opencode/cli-dispatch-audit.js` | `.opencode/plugins/cli-dispatch-audit.js` | A thrown error or nothing. |
| DeepSeek Harness | `tools/pre-execute`, `tools/post-execute` on `bash` | `dsh/dispatch-preflight-lint.mjs`, `dsh/dispatch-audit.mjs` | The same pair. | A deny reason or nothing. |
| Vibe | `pre_tool` on `bash` and `process_start` | `vibe/dispatch-preflight.mjs` | `.vibe/plugins/repo-guards/dispatch-preflight.mjs` | A refusal or nothing. No audit line. |

**Claude.** The preflight reads only `tool_name: 'Bash'` and `tool_input.command`. The audit reads `tool_response.stdout`/`stderr`. A block emits `permissionDecision: 'deny'` with the reason. A warn emits `additionalContext`. The audit emits nothing and exits 0.

**Codex.** Registered in `.codex/hooks.json`. Codex names its shell tool `exec` up to 0.15x and `Bash` from 0.160. The later PostToolUse response is one string. The project dir comes from `payload.cwd` or `CODEX_PROJECT_DIR`. The audit is tagged `runtime: 'codex'`.

**Devin.** Registered in `.devin/hooks.v1.json`. The payload carries `tool_name: 'exec'`. A whitespace-only `cwd` is treated as absent and falls back to `DEVIN_PROJECT_DIR`. The audit is tagged `runtime: 'devin'`.

**Cursor.** Registered in `.cursor/hooks.json`. The preflight spawns the Claude preflight with a Claude-shaped `Bash` payload and translates its envelope. It gives the child 5 seconds and allows on a spawn or parse failure. A block returns `{permission: 'deny'}` with `agent_message` and `user_message`, then exits 2. A warn returns `{permission: 'allow'}` with `agent_message`.

`postToolUse` carries no matcher. Its proxy normalizes `Shell` to `Bash`, parses the JSON-stringified `tool_output` into `{stdout, exitCode}` and `spawnSync`s the Claude audit. A `Write` call goes to post-edit-quality instead. The proxy always emits `{permission: 'allow'}`.

**Pi.** Discovered through `.pi/extensions/`, whose entry files re-export the real `pi/*.ts` files. The payload carries `toolName: 'bash'`. The preflight captures raw user input on `input`, then runs `shouldDenyPiDispatch` before the hard rules. An ambiguous reading is denied. A direct dispatch with no named executor is denied unless the user text names it. A deny returns `{block: true, reason}`. A warn returns `{reason}`. The audit is tagged `runtime: 'pi'`.

**OpenCode.** One plugin. The tool name is `bash`, read as `input.tool: 'bash'`. `findRepoRoot` anchors the log path to the repo root, so a nested working directory cannot plant a stray `.skilled` tree. The plugin reads the hard rules under the checkout's source root and skips the lint when there is none. The preflight throws with the block reason to deny. The audit records only, tagged `runtime: 'opencode'`.

**DeepSeek Harness.** The preflight reads `exec.arguments.command`, calls `evaluateDispatch`, denies a blocked rule and fails closed if the shared core errors. It logs warn violations through `ctx.logger.warn`.

The audit reads the result content, the session id and the call id from the DSH event. It calls `recordDispatch` with `runtime: 'dsh'`, logs an error and continues. Both adapters find the checkout from their own file path, because a DSH session runs in a lineage folder. `.dsh/plugins/repo-guards/adapters/dispatch-preflight-lint.mjs` and `.dsh/plugins/repo-guards/adapters/dispatch-audit.mjs` link to the real `dsh/` files here.

**Vibe.** `.vibe/hooks.toml` holds a `pre_tool` hook named `dispatch-preflight`, `strict = true`. It runs `.vibe/plugins/repo-guards/dispatch-preflight.mjs`, which calls `evaluateDispatch`. No Vibe hook audits.

The three hosted CommonJS/ESM preflight-and-audit pairs (Claude, Codex, Devin) share one structure. Each reads stdin JSON, fast-exits on a non-dispatch tool name or a non-matching command, evaluates the core and emits the result.

Cursor reimplements neither half. Its preflight shapes a Claude payload and shells out to the Claude preflight. Its `postToolUse` proxy does the same for the audit. DeepSeek Harness calls `evaluateDispatch` and `recordDispatch` directly from its two repo-guards adapters.

OpenCode keeps both halves in-process in its plugin, the one surface where `tool.execute.before` can still stop a command. Pi is the only runtime that adds an authorization layer on top of the hard-rule lint, because a direct dispatch must be authorized by the operator's own request.

Two runtimes are mirrored rather than hosted here. OpenCode's real plugin cannot live in this tree, because its loader globs `.opencode/plugins/` by a flat pattern. So `opencode/cli-dispatch-audit.js` is a browsability-only symlink and nothing loads through it. Pi loads the other way. The real `pi/*.ts` files live here and `.pi/extensions/` holds the one-line entry files Pi discovers. The `sk-git`-owned `sk-git-preflight-advisory.js` plugin reuses this concern's `lib/dispatch-rule-checks.mjs` engine but mirrors under `sk-git/scripts/hooks/opencode/`.

---

## 4. DIRECTORY TREE

```text
cli-dispatch/
+-- lib/
|   +-- dispatch-rule-checks.mjs
|   +-- dispatch-rule-checks.test.mjs
|   +-- dispatch-audit.mjs
|   +-- dispatch-audit.test.mjs
|   +-- opencode-version.mjs
|   `-- opencode-version-corpus.json
+-- claude/
|   +-- dispatch-preflight-lint.mjs
|   `-- dispatch-audit-posttooluse.mjs
+-- codex/
|   +-- dispatch-preflight-lint.mjs
|   +-- dispatch-audit-posttooluse.mjs
|   `-- codex-shell-tool.test.mjs
+-- devin/
|   +-- dispatch-preflight-lint.mjs
|   +-- dispatch-audit-posttooluse.mjs
|   `-- devin-dispatch-audit.test.mjs
+-- cursor/
|   +-- dispatch-preflight-lint.mjs
|   `-- post-tool-use.mjs -> ../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs
+-- pi/
|   +-- dispatch-preflight-lint.ts
|   +-- dispatch-audit.ts
|   +-- dispatch-preflight-lint.test.ts
|   `-- directive-dedup.test.ts
+-- dsh/
|   +-- dispatch-preflight-lint.mjs
|   `-- dispatch-audit.mjs
+-- opencode/
|   `-- cli-dispatch-audit.js -> ../../../../.opencode/plugins/cli-dispatch-audit.js
`-- tests/
    `-- dsh-dispatch.test.mjs
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/dispatch-rule-checks.mjs` | The hard-rule engine. `readHardRules` reads the `hard-rules.json` sidecar beside a SKILL.md, a JSON array of rule objects, with no library. `CHECKS` holds the 40 pure check functions, enumerated as `KNOWN_CHECKS`. `evaluate` runs the rules against a command and returns only the violated ones. It maps `block`/`error` severity to `block` and everything else to `warn`. `evaluateDispatch` holds every dispatch in a chain to its own packet's rules. Imports Node builtins only. |
| `lib/dispatch-audit.mjs` | The audit core. `DISPATCH_SHAPES` is the shared dispatch registry. `inspectDispatch` classifies a dispatch as `direct`, `ambiguous` or `none`. `resolveDispatchPackets` returns every packet a command dispatches to, in order. `resolveDispatchCommands` returns every dispatch with its unwrapped text. `matchDispatchShape` records the first packet the resolver names. `extractDispatchMeta` pulls model, target, duration, exit and size hints. `buildAuditLine` scrubs secrets, truncates and formats one JSONL line. `appendAuditLog` does the size-rotated append. `recordDispatch` runs the whole pipeline. It never writes stdout or stderr and never throws. |
| `lib/opencode-version.mjs` | Resolves the OpenCode family (`v1` or `v2`) from a binary's version output, with a 3-second probe and a cache. `evaluate` uses it to filter a rule by its `appliesTo` list. |
| `lib/opencode-version-corpus.json` | The version-output samples the resolver's test reads. |
| `claude/dispatch-preflight-lint.mjs` | PreToolUse adapter. Through `evaluateDispatch`, each dispatch in a chain is evaluated against its own packet's rules. A `block` denies with the rule's reason. `warn` attaches an advisory. It fast-exits on a non-dispatch command and fails open on any internal error. |
| `claude/dispatch-audit-posttooluse.mjs` | PostToolUse adapter feeding the audit core after a Bash call completes. Observe-only, never emits a permission decision. |
| `codex/dispatch-preflight-lint.mjs`, `codex/dispatch-audit-posttooluse.mjs` | The Codex pair. Both accept `exec` and `Bash`. The audit reads a string response or `{stdout, stderr}`. |
| `devin/dispatch-preflight-lint.mjs`, `devin/dispatch-audit-posttooluse.mjs` | The Devin pair. Both accept `exec` only. |
| `cursor/dispatch-preflight-lint.mjs` | Cursor preflight shim. It spawns the Claude preflight with a Claude-shaped payload and translates the envelope. |
| `cursor/post-tool-use.mjs` | Multiplexed Cursor proxy. Its real home is under `system-spec-kit` and this folder holds a link. |
| `pi/dispatch-preflight-lint.ts` | Pi `tool_call` extension. It captures raw user input on the `input` event, then authorizes and evaluates the hard rules. |
| `pi/dispatch-audit.ts` | Pi `tool_result` extension. Calls `recordDispatch` tagged `runtime: 'pi'`. |
| `dsh/dispatch-preflight-lint.mjs` | DeepSeek Harness `tools/pre-execute` adapter. Calls `evaluateDispatch` and denies a blocked dispatch or a shared-core failure. |
| `dsh/dispatch-audit.mjs` | DeepSeek Harness `tools/post-execute` adapter. Calls `recordDispatch` tagged `runtime: 'dsh'` and continues if audit logging fails. |

`.opencode/plugins/cli-dispatch-audit.js` is the OpenCode adapter. It imports this concern's `lib/dispatch-audit.mjs` core and the shared `hook-flags.cjs` resolver.

The Pi preflight carries an authorization layer the other runtimes do not have. A sentence that names the executor authorizes only when it carries no negation or refusal word. The two `not <other>, use <executor>` and `not <other> but <executor>` forms are the exception. So an odd double negative such as `use cli-devin, it is not forbidden` is a fail-closed deny accepted by policy and the operator writes the request as its own sentence.

A `/deep:... --executor cli-*` phrase authorizes the executor its value names. A mention authorizes only outside every quote, backtick, `$(` and `${` span. The scan reads the text the way a POSIX shell quotes it, with and without comments and with curly quotes read as quotes and as literals. Text whose quoting never closes, nests past 32 levels or puts a `case` inside a substitution is denied. Only listed English contractions count as prose apostrophes.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_DISPATCH_DISABLED=1` | Full no-op on every runtime. The shared resolver short-circuits both concerns. `isHookEnabled('dispatch')` silences every audit adapter and `isHookEnabled('dispatch-guard')` every preflight adapter. |
| `SYSTEM_DISPATCH_GUARD_DISABLED=1` | Preflight guard only. The adapters stop refusing before execution, while the audit log keeps recording. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Audit log only. It is the canonical flag of the `dispatch` concern and the audit core's own `KILL_SWITCH_ENV`. Every audit adapter honors it through `isHookEnabled('dispatch')`, and `recordDispatch` checks it again for exactly `1`. Codex, Devin and OpenCode also call `isAuditDisabled`. The preflight guard keeps running. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command or export it for a session. Persist it in `.skilled/hooks/hook-flags.env` to keep it. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/cli-dispatch/tests/dsh-dispatch.test.mjs
.skilled/node_modules/.bin/vitest run .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs
```

```bash
# The adapter suites are vitest files. Run them under the hooks config, whose alias serves the literal long specifier the Pi preflight keeps.
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs .skilled/hooks/cli-dispatch/devin/devin-dispatch-audit.test.mjs .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.test.ts .skilled/hooks/cli-dispatch/pi/directive-dedup.test.ts
```

`node --test` cannot run these files, because they are vitest suites. The codex file fails with `Cannot read properties of undefined (reading 'config')`. A vitest run without `--config` runs two of them, but not `dispatch-preflight-lint.test.ts`, which fails on the Pi adapter's `hook-flags.mjs` import. Each command calls the pinned `.skilled/node_modules/.bin/vitest`, because vitest is installed under `.skilled/node_modules` and not at the repository root. So `npx vitest` from the root fetches or reuses a different copy.

Expected result: all tests pass.

```bash
node -e "import('./.opencode/plugins/cli-dispatch-audit.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error. That confirms the OpenCode adapter still resolves this core.

---

## 8. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): the advisory's exact injected text and its visibility to the operator.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../skills/cli-external-orchestration/cli-opencode/SKILL.md`](../../skills/cli-external-orchestration/cli-opencode/SKILL.md): the primary hard-rule declarer these checks enforce.
