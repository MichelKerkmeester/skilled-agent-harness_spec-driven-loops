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

`dispatch/` owns two concerns that fire around composed CLI dispatch commands (`opencode run`, `claude -p`, `codex exec -p`, `devin -p`, and siblings): a **preflight lint** that evaluates a dispatch skill's declared `hard_rules:` against the command string *before* it spawns, and an **audit trail** that appends one scrubbed JSONL line per completed dispatch. Both cores are dependency-free by design so enforcement survives even when the skill advisor daemon is down.

The `DISPATCH_SHAPES` registry in `lib/dispatch-audit.mjs` is the single source of truth for what counts as a dispatch, shared by both concerns so the before-lint and the after-audit can never disagree about a command's shape. The preflight may deny or advise; the audit never decides, it only records. Every path fails open: a missing `SKILL.md`, malformed frontmatter, a throwing check, or an unwritable log resolves to allow/skip, never to a blocked or broken dispatch.

The concern is one runtime-neutral pair of cores plus a thin adapter per runtime. The cores make every decision; each adapter only translates its runtime's event shape into the core's input and delivers the result.

---

## 2. WHAT IT DOES

**Preflight lint** fires before a composed CLI dispatch command spawns. It matches the command against `DISPATCH_SHAPES`, resolves the matched skill's `SKILL.md`, reads its `hard_rules:` frontmatter, and evaluates each rule. A `block`-severity violation denies the tool call with this reason (the model sees it as the denial message):

```text
Dispatch blocked by <skill> hard-rule(s):
  • [<rule-id>] <rule message>
```

`warn`-severity violations let the call proceed but inject this into the model's context as `additionalContext`:

```text
⚠ <skill> dispatch hard-rule advisory:
  • [<rule-id>] <rule message>
```

The five checks currently registered in `lib/dispatch-rule-checks.mjs` (`CHECKS`), with the messages the declaring skill's frontmatter carries:

| Check id | Satisfied when |
|---|---|
| `stdin-redirect-required` | An `opencode run` command closes/redirects stdin (`</dev/null`, heredoc, herestring, or a pipe feeding `opencode run`) |
| `no-bare-agent-general` | No bare top-level `--agent general` (opencode rejects it at runtime) |
| `command-flag-for-slash-prompt` | A slash-command-shaped prompt (`/family:name ...`) is paired with `--command` |
| `share-requires-confirmation` | No `--share` flag present (it publishes the session) |
| `non-interactive-permission-mode-risk` | A `claude -p`/`--print` command runs with `--dangerously-skip-permissions` or `--permission-mode bypassPermissions` |

A check returns `true` when the command *satisfies* the rule; `false` means violated. An unknown check id is skipped (the CI validator catches typos, not this hot path), and a throwing check resolves to satisfied so it can never block a dispatch.

**Audit** injects nothing into the model. After each completed dispatch it appends one scrubbed, truncated JSONL line to the size-rotated log at `.opencode/logs/cli-dispatch-audit.log` (512 KB cap, rotated to a `.1` backup):

```json
{"schema_version":1,"ts":"<ISO>","runtime":"<claude|codex|devin|opencode|pi>","sessionID":"...","callID":"...","skill":"...","command":"<scrubbed>","commandTruncated":false,"model":"...","target":"...","durationMs":1234,"exitCode":0,"outputBytes":5678}
```

The command is scrubbed before it lands on disk: secret-bearing flags (`--api-key`/`--token`/`--secret`/`--password`), env assignments whose name contains token/key/secret/password, `Authorization: Bearer|Basic` headers, header-style credentials, bare provider key prefixes (`sk-...`, `ghp_...`, `xox...`, `AKIA...`), PEM key/certificate blocks, and bare JWTs are each replaced with `[REDACTED]`. The command is then truncated to 500 chars; `model` and `target` run through the same scrub+truncate pipeline. The full pipeline (`recordDispatch`) is fail-open throughout: any internal error resolves to `false`, never a thrown exception.

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the **same** `lib/` cores. What differs is the event each runtime fires, the payload shape that event carries, and how the result is handed back. Claude, Codex, and Devin each carry a preflight + audit pair; Cursor and OpenCode carry audit only; Pi carries a richer preflight (with its own authorization layer) plus audit.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/dispatch-preflight-lint.mjs`, `claude/dispatch-audit-posttooluse.mjs` | `PreToolUse`/`PostToolUse` on `Bash` | `tool_name: 'Bash'`; reads `tool_input.command`, `tool_response.stdout`/`stderr` | Preflight: `permissionDecision: 'deny'` on block, `additionalContext` on warn. Audit: no output, exit 0. |
| **Codex** | `codex/dispatch-preflight-lint.mjs`, `codex/dispatch-audit-posttooluse.mjs` | `PreToolUse`/`PostToolUse` on `exec` (`.codex/hooks.json`) | `tool_name: 'exec'`; resolves project dir from `payload.cwd` or `CODEX_PROJECT_DIR` | Same deny/advisory envelope as Claude; audit tagged `runtime: 'codex'`. |
| **Devin** | `devin/dispatch-preflight-lint.mjs`, `devin/dispatch-audit-posttooluse.mjs` | `PreToolUse`/`PostToolUse` on `exec` (`.devin/hooks.v1.json`) | `tool_name: 'exec'`; whitespace-only `cwd` treated as absent, falls back to `DEVIN_PROJECT_DIR` | Same deny/advisory envelope; audit tagged `runtime: 'devin'`. |
| **Cursor** | `cursor/post-tool-use.mjs` | `postToolUse` event | Multiplexed proxy: `Shell` tool_name → normalizes to `Bash` and `spawnSync`s `claude/dispatch-audit-posttooluse.mjs`; `Write` → post-edit-quality (separate concern). Cursor's `tool_output` is a JSON-stringified string, parsed back into `{stdout, exitCode}`. | Audit only (no preflight). Proxy emits `{permission: 'allow'}` and never blocks. |
| **Pi** | `pi/dispatch-preflight-lint.ts`, `pi/dispatch-audit.ts` | `tool_call` / `tool_result` events, discovered via `.pi/extensions/` | `toolName: 'bash'`. Preflight is richer: captures raw user input on the `input` event, then runs `shouldDenyPiDispatch` authorization (self-dispatch `cli-pi` always denied; ambiguous denied; direct-but-unnamed denied unless the user text explicitly names the executor or a `/deep:... --executor cli-*` carries it) *before* evaluating hard rules. | Preflight: `{block: true, reason}` on deny/block; `{reason}` on warn. Audit: `recordDispatch` tagged `runtime: 'pi'`. |
| **OpenCode** | `.opencode/plugins/cli-dispatch-audit.js` (mirrored at `opencode/`) | Plugin, `tool.execute.after` event | `input.tool: 'bash'`; anchors the log path to the repo root via `findRepoRoot` so a nested working directory cannot plant a stray `.opencode` tree | Audit only. Tagged `runtime: 'opencode'`. |

The three CommonJS/ESM preflight-and-audit pairs (Claude, Codex, Devin) share the same structure: read stdin JSON, fast-exit on a non-dispatch tool name or non-matching command, evaluate the core, emit the result. Cursor deliberately does not reimplement the audit: it reshapes its `Shell` payload and shells out to the Claude audit adapter, so a future change to the audit logic lands in both without a second edit. Pi is the only runtime that adds an authorization layer on top of the hard-rule lint, because a Pi session can dispatch itself (`cli-pi`) and that must be blocked regardless of the target skill's declared rules.

Two runtimes are mirrored rather than hosted here. OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/cli-dispatch-audit.js` is a browsability-only symlink back into that folder and nothing loads through it. Pi loads in the other direction: the real `pi/*.ts` files live here, and `.pi/extensions/` holds the relative symlinks Pi discovers. The `sk-git`-owned `sk-git-preflight-advisory.js` plugin reuses this concern's `lib/dispatch-rule-checks.mjs` engine but mirrors under `sk-git/scripts/hooks/opencode/`.

---

## 4. DIRECTORY TREE

```text
dispatch/
+-- lib/
|   +-- dispatch-rule-checks.mjs       # hard-rule engine: parses SKILL.md hard_rules frontmatter, evaluates checks
|   +-- dispatch-rule-checks.test.mjs  # node --test
|   +-- dispatch-audit.mjs             # dispatch-shape recognition, scrubbing, JSONL append, log rotation
|   `-- dispatch-audit.test.mjs        # npx vitest run
+-- claude/   dispatch-preflight-lint.mjs, dispatch-audit-posttooluse.mjs
+-- devin/    (same pair)
+-- codex/    (same pair)
+-- cursor/   post-tool-use.mjs        # multiplexed proxy (Shell -> dispatch audit, Write -> post-edit-quality)
+-- pi/       dispatch-preflight-lint.ts, dispatch-audit.ts (real files; `.pi/extensions/` symlinks to them)
`-- opencode/ cli-dispatch-audit.js (browsability symlink -> ../../../plugins/; real file loaded from .opencode/plugins/)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/dispatch-rule-checks.mjs` | The hard-rule engine. `parseHardRules`/`readHardRules` extract the `hard_rules:` list from a SKILL.md's YAML frontmatter (just enough YAML for the flat list-of-maps shape, no library). `CHECKS` holds the five pure check functions. `evaluate` runs the rules against a command and returns only the violated ones, mapping `block`/`error` severity to `block` and everything else to `warn`. Imports Node builtins only. |
| `lib/dispatch-audit.mjs` | Runtime-neutral audit core. `DISPATCH_SHAPES` is the shared dispatch registry. `inspectDispatch`/`matchDispatchShape` recognize a dispatch (tokenizing the shell command, distinguishing `direct`/`ambiguous`/`none`). `extractDispatchMeta` pulls model/target/duration/exit/size hints. `buildAuditLine` scrubs secrets, truncates, and formats one JSONL line. `appendAuditLog` does the size-rotated append. `recordDispatch` runs the whole pipeline. Never writes stdout/stderr, never throws past its boundary. |
| `claude/dispatch-preflight-lint.mjs`, `codex/` and `devin/` siblings | PreToolUse adapters. A `block` denies with the rule's reason; `warn` attaches an advisory. Fast-exit on non-dispatch commands, fail open on any internal error. |
| `claude/dispatch-audit-posttooluse.mjs`, `codex/` and `devin/` siblings | PostToolUse adapters feeding the audit core after a Bash/exec call completes. Observe-only, never emit a permission decision. |
| `cursor/post-tool-use.mjs` | Multiplexed Cursor proxy. For `Shell`, normalizes the tool name to `Bash`, parses the JSON-stringified `tool_output`, and `spawnSync`s the Claude audit adapter. Real home is under `system-spec-kit`; indexed here as a symlink. |
| `pi/dispatch-preflight-lint.ts` | Pi `tool_call` extension. Captures raw user input on the `input` event, runs `shouldDenyPiDispatch` authorization (self-dispatch and unnamed-direct denial), then evaluates hard rules. |
| `pi/dispatch-audit.ts` | Pi `tool_result` extension. Calls `recordDispatch` tagged `runtime: 'pi'`. |

`.opencode/plugins/cli-dispatch-audit.js` is the OpenCode adapter; it imports this concern's `lib/dispatch-audit.mjs` core and the shared `hook-flags.cjs` resolver.

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_DISPATCH_DISABLED=1` | Full no-op on every runtime. The shared resolver (`isHookEnabled('dispatch')`) short-circuits every preflight and audit adapter. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Legacy alias of the canonical flag. Also the audit core's own `KILL_SWITCH_ENV`: the audit adapters additionally call `isAuditDisabled`, so setting this name disables the audit surface directly. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `lib/` cores import Node builtins only. Adapters import their own `../lib/` and `../../shared/hook-flags.mjs` (or `hook-flags.cjs` for the OpenCode plugin): nothing outside this tree. The Cursor proxy imports `hook-flags.mjs` by a deep repo-relative path because its real home is under `system-spec-kit`. |
| Decisions | Preflight may deny (`block` severity) or advise (`warn`). Audit never decides; it only records. Pi's preflight adds an authorization deny that is independent of the target skill's declared rules. |
| Failure | Every path fails open. A missing `SKILL.md`, malformed frontmatter, a throwing check, an unparsable payload, or an unwritable log resolves to allow/skip. |
| Output | The cores never write stdout or stderr. Each adapter owns its own transport. Audit writes only to the rotated log file. |

---

## 8. VALIDATION

```bash
node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs
```

Expected result: all tests pass.

```bash
node -e "import('./.opencode/plugins/cli-dispatch-audit.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (confirms the OpenCode adapter still resolves this core).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): the advisory's exact injected text and its visibility to the operator.
- [`../shared/README.md`](../shared/README.md): the shared kill-switch resolver the adapters use.
- [`../../skills/cli-external-orchestration/cli-opencode/SKILL.md`](../../skills/cli-external-orchestration/cli-opencode/SKILL.md): the primary `hard_rules:` declarer these checks enforce.
