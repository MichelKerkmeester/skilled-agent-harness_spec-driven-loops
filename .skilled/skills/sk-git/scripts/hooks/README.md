---
title: "Git Message Gate and Preflight Advisory: sk-git Command Hooks"
description: "One README for two hook folders. The message gate refuses a commit message, PR description or branch name that breaks the sk-git templates. The preflight advisory prints a line about surprising git behavior and never blocks."
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
version: 1.0.11.0
---

# Git Message Gate and Preflight Advisory: sk-git Command Hooks

---

## 1. OVERVIEW

One file serves two hook folders. `.skilled/hooks/git-message-gate/` and `.skilled/hooks/git-preflight/` each hold a `README.md` link to this file. The first folder indexes the message gate, which refuses a bad commit message, PR description or branch name. The second indexes the preflight advisory, which prints a line and never blocks.

The gate reads the shell command an agent is about to run. It checks the `-m` or `-F` message of `git commit`. It checks the `--body` or `--body-file` of `gh pr create` and `gh pr edit`. It checks the branch name a branch-creating command would create. It refuses only a violation it can see.

A command it cannot parse, a body it cannot read or a repository without a contract is allowed. The commit-msg hook, the pre-push hook and the CI check still stand behind it. There is no suppression switch.

The advisory reads the same `hard-rules.json` sidecar the dispatch preflight reads. It evaluates that sidecar against the repository, then prints a line. A false positive costs a line of text and nothing more.

The advisory never blocks. A malformed payload, a missing rule file, a non-repository directory or a subprocess timeout becomes silence. Enforcement stays with git's own behavior and the repository's commit and push hooks.

---

## 2. HOW IT WORKS

### The message gate

`evaluateCommand(command, cwd)` is the exported entry. Every adapter calls it. A command without `git` or `gh` returns `null` at once, so unrelated shell work pays nothing.

`inlineHeredocs` rewrites a `$(cat <<'EOF' … EOF)` body into a quoted literal. `tokenize` then splits the line into words and control operators, honouring quotes and backslash escapes. It returns `null` on anything it cannot evaluate. The caller then allows the command.

`simpleCommands` groups the tokens into simple commands. A `cd` updates the working directory for the commands after it.

`readGit` reads `git [-C dir] [-c k=v] <sub> …`. `commitMessage` collects `-m` and `--message` parts. It also reads a `-F` or `--file` path. A file value of `-` means stdin, so the message is not visible. `-C`, `-c`, `--reuse-message`, `--reedit-message`, `--fixup` and `--squash` return `null` for the same reason.

`prBody` reads `gh pr create` and `gh pr edit`. A `-R` or `--repo` flag returns `null`, because another repository's contract is not the one checked out here.

`createdBranches` covers `checkout -b` and `-B`, plus `switch -c`, `-C`, `--create` and `--force-create`. It also covers `branch` and `worktree add -b` or `-B`. A `branch` flag in `BRANCH_NON_CREATE` means the command creates nothing.

`repoRootOf` runs `git rev-parse --show-toplevel` with a 3000 ms timeout. `loadContract` then reads the rules block from `commit-message-template.md`, `pr-template.md` or `worktree-checklist.md`. It looks first at `skgit.contractDir` from a git config file. Then it tries `.sk-git/`, `.skilled/skills/sk-git/assets/` and `.opencode/skills/sk-git/assets/` in that order. A configured folder that does not exist raises a `ContractError`. A `git -c` setting is ignored.

A malformed rules block throws `ContractError`. `validateCommit` runs with stage `pre-stamp`. `validateBranch` also receives the worktree path.

`format` builds the refusal. It names the label, one `[id] message` line per error, the expected shape, the rules file and a closing line that says there is no bypass.

The entrypoint sets `v8.setFlagsFromString('--enable-experimental-regexp-engine-on-excessive-backtracks')`, so a contract pattern cannot backtrack without bound. Without the flag the gate still runs.

`main()` reads stdin and accepts the tool names `bash`, `exec` and `shell`. The shared gate exits 0 on stdin it cannot read, on a tool name outside the three or on a crash. It takes the command from `tool_input.command`. It resolves the project directory from `cwd`, then `workspace_roots[0]`, then `CLAUDE_PROJECT_DIR`, `CODEX_PROJECT_DIR` and `process.cwd()`.

A `ContractError` becomes a refusal that says the rules cannot be read. `deny()` then picks the envelope. A `Shell` tool name or a `workspace_roots` array gets `{ permission: "deny", user_message, agent_message }` and exit 2. Everything else gets `hookSpecificOutput.permissionDecision: "deny"` and exit 0. The `.cursor/hooks.json` registration ends in a `||` fallback. That fallback appends an allow envelope after the deny, so the hook exits 0.

### The preflight advisory

The advisory runs on the pre-tool event for a shell command. It starts with the kill-switch `isHookEnabled('git-preflight')`, which reads the master `SYSTEM_HOOKS_DISABLED` or `SK_GIT_PREFLIGHT_DISABLED`.

Only a directly visible `git ...` invocation matching `GIT_SHAPE` is worth inspecting. Anything else exits before a single git process is spawned. Aliases, wrapper scripts and anything behind a shell variable are left alone.

`readHardRules` reads `hard-rules.json` beside `sk-git/SKILL.md`. It keeps only rules whose `check` exists in `GIT_CHECKS` and whose id is not silenced. A malformed sidecar gives an empty rule set.

`createGitContext` builds a lazy repository-state collector. Each accessor runs only when a check asks for it and caches for one invocation. Each git call is bounded to 1.5s. The shared hook, OpenCode and Pi read the repository before the command runs. DSH runs after it and reads the state the command left.

`evaluate` runs each rule's check against the parsed command and context. A check returns `true` when the command is fine and `false` when it should advise. A check that throws is swallowed by the evaluator.

The surface caps at 3 findings plus one omitted-count line and names the subcommand the reader just invoked. The text reads:

```text
⚠ sk-git advisory — this `git <subcommand>` may not do what it appears to:
  • [<rule-id>] <message>
  • …and <N> more; the rule set may need narrowing.
  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>
```

The 17 checks gate on state, never on the verb. `reset-hard-discards-changes` fires only when `--hard` meets a dirty working tree, not on every unstage. A rule keyed to the word `reset` alone would fire on every unstage and train the reader to skim.

The rule ids: `commit-scope-drops-untracked`, `commit-pathspec-empty-change`, `add-pathspec-matches-nothing`, `add-pathspec-only-ignored`, `add-update-skips-untracked`, `restore-discards-over-staged`, `checkout-from-ref-stages-silently`, `merge-strategy-resolves-one-sided`, `case-only-pathspec-folds`, `staged-path-rewritten-by-filter`, `reset-hard-discards-changes`, `clean-force-deletes-files`, `branch-force-delete-unmerged`, `stash-clear-drops-entries`, `history-expiry-defeats-recovery`, `push-deletes-remote-ref`, `force-push-without-lease`.

DSH formats its own text. It writes `⚠ sk-git advisory: this ...`, then `• N more advisories were omitted.`, then `Advisory only. Silence: SKGIT_ADVISORY_SKIP=<rule-id>`.

Each adapter has its own error path. The shared hook ends in `main().catch(approve)`, so a throw exits 0. The OpenCode plugin catches evaluation and transform errors and never throws. The Pi extension catches import and evaluation errors and returns `undefined`. The DSH adapter logs a warning and returns the downstream result.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude, message gate | `PreToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | A deny envelope on stdout, exit 0. |
| Codex, message gate | `PreToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | The same deny envelope. |
| Devin, message gate | `PreToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | The same deny envelope. |
| Cursor, message gate | `preToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | The deny envelope, then the registration's allow envelope. Exit 0. |
| Vibe, message gate | `pre_tool` | None | `.vibe/plugins/repo-guards/git-message-gate.mjs` | A deny carrying the gate's reason. A `ContractError` is refused and any other error allows, with a line on stderr. |
| DSH, message gate | `tools/pre-execute` | `.skilled/hooks/git-message-gate/dsh/git-message-gate.mjs` | `.skilled/skills/sk-git/scripts/hooks/dsh/git-message-gate.mjs` | `{ kind: 'deny', reason }`. |
| OpenCode, message gate | `tool.execute.before` | `.skilled/hooks/git-message-gate/opencode/sk-git-message-gate.js` | `.opencode/plugins/sk-git-message-gate.js` | A thrown error as the tool result. A rules block that cannot be read is refused. |
| Pi, message gate | `tool_call` | `.skilled/hooks/git-message-gate/pi/git-message-gate.ts` | `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts` | `{ block: true, reason }`. A rules block that cannot be read is refused. |
| Shared, message gate | None. A core module the adapters import. | `.skilled/hooks/git-message-gate/shared/git-message-gate.mjs` | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Nothing. It returns a reason or `null`. |
| Claude, preflight | `PreToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | `hookSpecificOutput.additionalContext`. |
| Codex, preflight | `PreToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The same `additionalContext`. |
| Devin, preflight | `PreToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The same `additionalContext`. |
| Cursor, preflight | `preToolUse` | None | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | The same `additionalContext`. |
| Vibe, preflight | None | None | None | Nothing. No Vibe hook runs the advisory. |
| DSH, preflight | `tools/post-execute` | `.skilled/hooks/git-preflight/dsh/git-preflight-advisory.mjs` | `.skilled/skills/sk-git/scripts/hooks/dsh/git-preflight-advisory.mjs` | An added context on the tool result. |
| OpenCode, preflight | `experimental.chat.system.transform, tool.execute.before` | `.skilled/hooks/git-preflight/opencode/sk-git-preflight-advisory.js` | `.opencode/plugins/sk-git-preflight-advisory.js` | One system block on the next turn. |
| Pi, preflight | `tool_call, tool_result` | `.skilled/hooks/git-preflight/pi/git-preflight-advisory.ts` | `.skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | Text appended to the tool result. |
| Shared, preflight | None. A core module the adapters import. | `.skilled/hooks/git-preflight/shared/git-preflight-advisory.mjs` | `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Nothing. It writes one JSON line. |

Claude, Codex, Devin and Cursor register the shared hooks in `hook-registry.json` under the ids `git-preflight-advisory` and `git-message-gate`. The generated entries land in `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` and `.cursor/hooks.json`. No registration names a path in either hook folder, so the runtime folders here hold links for browsing only.

| Runtime | Event | Matcher | Timeout |
|---|---|---|---|
| Claude | `PreToolUse` | `Bash` | 5 seconds |
| Codex | `PreToolUse` | `exec\|Bash` | 5 seconds |
| Devin | `PreToolUse` | `^exec$` | 5 seconds |
| Cursor | `preToolUse` | `Shell` | 10 seconds |

Codex sends `exec` before 0.160 and `Bash` from 0.160, which is why its matcher names both. Claude also reads `.claude/settings.local.json` and accepts matcher `*` or no matcher. Claude, Codex and Devin change into the project directory first, with `cd "${CLAUDE_PROJECT_DIR:-$PWD}"`, `cd "${CODEX_PROJECT_DIR:-$PWD}"` and `cd "${DEVIN_PROJECT_DIR:-$PWD}"`. A resolution failure falls back to a `printf` envelope.

Cursor also carries browsability-only mirrors of both hooks under `.cursor/hooks/`. They are `.cursor/hooks/git-preflight-advisory.mjs` and `.cursor/hooks/git-message-gate.mjs`. Nothing loads through them.

OpenCode discovers plugins solely from `.opencode/plugins/`, so `sk-git-message-gate.js` and `sk-git-preflight-advisory.js` must live there. The `opencode/` folders here hold relative links back into that folder.

Pi loads in the other direction. The real `pi/git-message-gate.ts` and `pi/git-preflight-advisory.ts` live in the skill. `.pi/extensions/git-message-gate.ts` and `.pi/extensions/git-preflight-advisory.ts` are the one-line entry files Pi discovers.

DSH registers both through the `repo-guards` bundle. `.dsh/plugins/repo-guards/index.mjs` imports `registerGitMessageGate` and `registerGitPreflightAdvisory`. `.dsh/plugins/repo-guards/adapters/git-preflight-advisory.mjs` and `.dsh/plugins/repo-guards/adapters/git-message-gate.mjs` symlink to the real adapters.

Vibe runs the message gate only. A `pre_tool` hook named `git-message-gate` in `.vibe/hooks.toml` runs `.vibe/plugins/repo-guards/git-message-gate.mjs`. The hooks hub keeps a browse link to it at `.skilled/hooks/git-message-gate/vibe/git-message-gate.mjs`. No Vibe hook runs the preflight advisory.

The OpenCode advisory plugin resolves the repo root with `findRepoRoot` and falls back to the host directory. It buffers at most 20 events and drains them on the next `experimental.chat.system.transform`. OpenCode drops the oldest event when its buffer is full. It never prints, because OpenCode paints plugin output onto the prompt line.

Pi reads a `tool_call` handler's return only for `.block`, so a bare `reason` is discarded. The advisory is buffered by call id and appended to the `tool_result` content instead. Pi also swallows errors while delivering the advisory.

A DSH session can run outside the checkout, so the advisory adapter reads the rules from its own location rather than the session `cwd`. Both DSH adapters declare `ERROR_POLICY = 'fail-open'`.

---

## 4. DIRECTORY TREE

```text
git-message-gate/  and  git-preflight/   (the two folders that link this file)
+-- README.md                     # this file, the link target of both folders
+-- dsh/     git-message-gate.mjs, git-preflight-advisory.mjs
+-- opencode/  sk-git-message-gate.js, sk-git-preflight-advisory.js
+-- pi/      git-message-gate.ts, git-preflight-advisory.ts
+-- shared/  git-message-gate.mjs, git-preflight-advisory.mjs
`-- tests/   dsh-git-message-gate.test.mjs, dsh-git-preflight-advisory.test.mjs
```

Every runtime folder holds one relative link. The real code stays in `.skilled/skills/sk-git/scripts/hooks/`. The `tests/` folders hold real suites.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `git-message-gate.mjs` | The blocking gate. It exports `evaluateCommand` and runs as a stdin hook for `Bash`, `exec` and `Shell`. It denies a `git commit -m` or `-F` message. It denies a `gh pr create` or `edit` body. It denies a branch-creating command whose text breaks the repository's own template rules. It allows what it cannot read. |
| `dsh/git-message-gate.mjs` | The DSH adapter. `tools/pre-execute` for `bash` returns `{ kind: 'deny', reason }`. A `ContractError` is refused. Any other error is logged and allowed. |
| `.opencode/plugins/sk-git-message-gate.js` | The OpenCode plugin. `tool.execute.before` for `bash` throws a refusal prefixed `sk-git-message-gate:`. An internal fault is swallowed. |
| `pi/git-message-gate.ts` | The Pi `tool_call` extension. It returns `{ block: true, reason }` on a refusal. A gate that cannot load allows the call. |
| `git-preflight-advisory.mjs` | The shared advisory stdin hook for `Bash`, `exec` and Cursor `Shell` payloads. It reads the repo from payload `cwd` or Cursor's `workspace_roots[0]`. It falls back to the runtime project-directory env. `main().catch(approve)` makes the fail-open path the exit-0 path. |
| `dsh/git-preflight-advisory.mjs` | The DSH adapter. `tools/post-execute` for `bash` adds a notice to the tool result. It never denies. |
| `.opencode/plugins/sk-git-preflight-advisory.js` | The OpenCode plugin. `tool.execute.before` for `bash` evaluates the same engine and buffers at most 20 advisory events. `experimental.chat.system.transform` drains them as one system block. It never prints and never blocks. |
| `pi/git-preflight-advisory.ts` | The Pi `tool_call` and `tool_result` extension. It evaluates on `tool_call`, buffers by call id and appends to `tool_result` content. Warn-only, never `block: true`. |
| `../lib/git-rule-checks.mjs` | The `GIT_SHAPE` gate, `parseGitCommand` and the 17 `GIT_CHECKS`. `parseGitCommand` splits the subcommand, flags and pathspec, with value-flag and `--` handling. Each check gates on state and returns `true` or `false`. |
| `../lib/git-context.mjs` | The lazy repository-state collector. Each accessor runs only when a check asks and caches for one invocation. It fails soft with `null` on any git failure or 1.5s timeout. |
| `../lib/message-contract.mjs` | `loadContract`, `validateCommit`, `validatePrBody`, `validateBranch` and `ContractError`. It reads the rules block from the sk-git templates. |
| `../../../../hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | The shared `readHardRules` sidecar reader and `evaluate` runner imported by every advisory adapter. |
| `../../../../hooks/shared/hook-flags.mjs` | The kill-switch resolver. `isHookEnabled('git-preflight')` reads it. The `.cjs` twin serves the OpenCode plugin. |
| `../../../../hooks/shared/hook-adapter-shared.cjs` | `readStdin`, with a 3000 ms stdin deadline. |

---

## 6. CONFIGURATION

The advisory is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on`, in any case.

| Variable | Effect |
|---|---|
| `SK_GIT_PREFLIGHT_DISABLED=1` | Full no-op on every runtime. Each adapter checks `isHookEnabled('git-preflight')` before any work. The shared hook returns `approve()` (exit 0). The OpenCode plugin and Pi extension return before evaluation. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SKGIT_ADVISORY=0` | Silence every git preflight advisory. `false` and `off` are equivalent, case-insensitively. The safety valve. |
| `SKGIT_ADVISORY_SKIP=commit` | Silence every rule whose id starts with `commit-`. The practical tier. |
| `SKGIT_ADVISORY_SKIP=add-pathspec-only-ignored` | Silence one exact rule id. The minimum viable tier. |

`SKGIT_ADVISORY_SKIP` accepts comma-separated tokens. A token matches either a complete rule id or an id prefix followed by `-`.

Set a flag inline for one command or export it for a session. To keep it, persist it in `.skilled/hooks/hook-flags.env`. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file.

The message gate has no switch. The commit, PR and branch rules carry no bypass on any surface. The place to change them is the rules block in the sk-git templates.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs
node --test .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs
node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs
node --test .skilled/hooks/git-message-gate/tests/dsh-git-message-gate.test.mjs
node --test .skilled/hooks/git-preflight/tests/dsh-git-preflight-advisory.test.mjs
```

Expected result: all tests pass. The suites cover the 17 checks, the message contract, the shared hook's parsing and suppression, both DSH adapters and the shared stdin deadline.

```bash
node --test .opencode/plugins/tests/sk-git-message-gate.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts
```

Expected result: all pass. Each suite refuses a nonconforming commit in a throwaway repository and passes a conforming one.

```bash
node --check .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
node --check .opencode/plugins/sk-git-preflight-advisory.js
node --check .opencode/plugins/sk-git-message-gate.js
```

Expected result: no syntax errors.

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.cursor/hooks.json', 'utf8')); JSON.parse(require('node:fs').readFileSync('.devin/hooks.v1.json', 'utf8'))"
```

Expected result: exit 0, which confirms the runtime configs that register these hooks are valid JSON.

For a stdin smoke test, create a temporary repository with hooks disabled. Pass `Bash`, `exec` and Cursor `Shell` payloads containing `git commit --only <dir> -m x`. The dirty scoped repository must advise. A non-git command and an ordinary commit in a clean repository must stay silent.

---

## 8. RELATED

- [`../../../../hooks/README.md`](../../../../hooks/README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../../../../hooks/shared/README.md`](../../../../hooks/shared/README.md): the switch resolver the advisory calls.
- [`../lib/README.md`](../lib/README.md): the rule engine and context collector.
- [`../../SKILL.md`](../../SKILL.md): the manifest whose sibling `hard-rules.json` the advisory executes.
- [`pi/README.md`](pi/README.md): the Pi extension bridge.
- [`../../../../hooks/cli-dispatch/lib/dispatch-rule-checks.mjs`](../../../../hooks/cli-dispatch/lib/dispatch-rule-checks.mjs): the shared `readHardRules` and `evaluate` runner.
