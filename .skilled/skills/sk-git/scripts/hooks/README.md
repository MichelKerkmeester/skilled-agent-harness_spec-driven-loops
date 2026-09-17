---
title: "hooks: Git Preflight Advisory Runtime Adapters"
description: "Advisory-only git command preflight delivery across Claude, Codex, Devin, Cursor, OpenCode, and Pi. One shared stdin hook serves Bash/exec/Shell; OpenCode and Pi adapt their native tool events onto the same hard-rule parser, 17 state-aware checks, and lazy git context."
trigger_phrases:
  - "git preflight advisory hook"
  - "git advisory runtime matrix"
  - "SKGIT_ADVISORY"
  - "git hook fail open"
---

# hooks: Git Preflight Advisory Runtime Adapters

---

## 1. OVERVIEW

The git preflight advisory evaluates a shell command before it runs and surfaces surprising git behavior without changing the command's permission or exit path. The git rules were already written down in `sk-git/SKILL.md`'s `hard_rules:` frontmatter and still did not reach anyone, because they were surfaced by *prompt* routing while the damage happens at *command* time. This hook closes that gap: it reads the same frontmatter the dispatch preflight reads, evaluates it against the repository as it stands before the command runs, and prints a line.

The shared stdin hook (`git-preflight-advisory.mjs`) accepts Claude's `Bash` payload, Codex/Devin's `exec` payload, and Cursor's `Shell` payload directly: one file, three tool labels. OpenCode and Pi adapt their native tool events onto the same hard-rule parser, 17 checks, and lazy git context through their own plugin and extension.

This layer is **advisory only and fails open**. Any malformed payload, missing rule file, non-repository directory, subprocess timeout, import error, or adapter failure becomes silence or approval. Enforcement remains the responsibility of git's own behavior and the repository's commit and push hooks. A false positive costs a line of text and nothing more, so every path resolves to silence rather than a block.

---

## 2. WHAT IT DOES

The advisory runs on the pre-tool event for a shell command. It:

1. **Kill-switch + suppression.** Checks `isHookEnabled('git-preflight')` (master `SYSTEM_HOOKS_DISABLED` or `SK_GIT_PREFLIGHT_DISABLED`), then resolves three suppression tiers (see Configuration). Silence is the safe no-op.
2. **Gate on shape.** Only a directly visible `git ...` invocation matching `GIT_SHAPE` is worth inspecting; anything else exits before a single git process is spawned, keeping the cost off every unrelated command. Aliases, wrapper scripts, and anything behind a shell variable are left alone.
3. **Read + filter rules.** `readHardRules` parses the `hard_rules:` frontmatter from `sk-git/SKILL.md`, keeps only rules whose `check` exists in `GIT_CHECKS` and whose id is not silenced.
4. **Collect lazy context.** `createGitContext` builds a lazy repository-state collector; each accessor runs only when a check asks for it and caches for one invocation. Everything read is state that exists *before* the command runs: where a question can only be answered afterwards, there is deliberately no accessor.
5. **Evaluate.** `evaluate` runs each rule's check against the parsed command and context. A check returns `true` (fine) or `false` (advise). A check that throws is swallowed by the evaluator.
6. **Surface.** Caps at 3 findings plus one omitted-count line, names the subcommand the reader just invoked, and emits the advisory through the runtime's channel.

The injected advisory text (delivered per runtime, see Section 3):

```text
⚠ sk-git advisory — this `git <subcommand>` may not do what it appears to:
  • [<rule-id>] <message>
  • …and <N> more; the rule set may need narrowing.
  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>
```

The 17 checks gate on **state, never on the verb**: roughly one in seven operations in this repo is a `reset`, but the overwhelming majority merely unstage. A rule keyed to the word `reset` fires constantly and trains the reader to skim; the same rule keyed to the commit actually moving fires about a hundredth as often and stays worth reading. The rule ids: `commit-scope-drops-untracked`, `commit-pathspec-empty-change`, `add-pathspec-matches-nothing`, `add-pathspec-only-ignored`, `add-update-skips-untracked`, `restore-discards-over-staged`, `checkout-from-ref-stages-silently`, `merge-strategy-resolves-one-sided`, `case-only-pathspec-folds`, `staged-path-rewritten-by-filter`, `reset-hard-discards-changes`, `clean-force-deletes-files`, `branch-force-delete-unmerged`, `stash-clear-drops-entries`, `history-expiry-defeats-recovery`, `push-deletes-remote-ref`, `force-push-without-lease`.

```text
╭────────────────────────────────────────────────────────────────────╮
│ Claude Bash · Codex/Devin exec · Cursor Shell · OpenCode/Pi bash   │
╰────────────────────────────────────────────────────────────────────╯
                              │
                  runtime payload normalization
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│ readHardRules + evaluate                                           │
│ GIT_SHAPE + GIT_CHECKS + createGitContext                          │
└────────────────────────────────────────────────────────────────────┘
                              │
             up to 3 findings + omitted-count line
                              │
          ┌──────────────────────────┬───────────────┬────────────────┐
          ▼                          ▼               ▼
  hook context JSON              Pi reason     OpenCode next-turn
  Claude/Codex/Devin/Cursor      no block      system context
```

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the **same** `GIT_SHAPE` gate, `GIT_CHECKS` rule set, `readHardRules` frontmatter parser, and `createGitContext` lazy collector. What differs is the tool event each runtime fires, the payload shape, and the channel the advisory is handed back through.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `git-preflight-advisory.mjs` | `PreToolUse` in `.claude/settings.json` (no matcher: the hook filters to `tool_name: Bash` itself); timeout 5s | Reads `tool_input.command` + `cwd`; project dir from `cwd` then `CLAUDE_PROJECT_DIR` then `process.cwd()` | `hookSpecificOutput.additionalContext` JSON on stdout (PreToolUse) |
| **Codex** | `git-preflight-advisory.mjs` | `PreToolUse` in `.codex/hooks.json`, matcher `exec`; timeout 5s | Same `exec` payload shape as Devin; `cd "${CODEX_PROJECT_DIR:-$PWD}"` | Same `additionalContext` JSON; a fallback `printf` envelope covers a resolution failure |
| **Devin** | `git-preflight-advisory.mjs` | `PreToolUse` in `.devin/hooks.v1.json`, matcher `^exec$`; timeout 5s | Same `exec` shape; `cd "${DEVIN_PROJECT_DIR:-$PWD}"` | Same `additionalContext` JSON; fallback `printf` envelope |
| **Cursor** | `git-preflight-advisory.mjs` (registered directly; `.cursor/hooks/git-preflight-advisory.mjs` is a browsability-only mirror symlink) | `preToolUse` in `.cursor/hooks.json`, matcher `Shell` | Cursor carries the project root in `workspace_roots[0]` instead of `cwd`; the hook falls through to `CLAUDE_PROJECT_DIR`/`CODEX_PROJECT_DIR`/`process.cwd()` when absent | Same `additionalContext` JSON |
| **OpenCode** | `.opencode/plugins/sk-git-preflight-advisory.js` (mirrored at `opencode/` via browsability symlink) | `tool.execute.before` for `bash`; advisory buffered and drained on the next `experimental.chat.system.transform` | Resolves repo root via `findRepoRoot` (falls back to host dir); OpenCode plugins cannot print without overlaying the TUI prompt line, so it buffers at most 20 events | Bounded findings injected once as a system block on the next transform; never stdout/stderr; the command is never delayed or blocked |
| **Pi** | `pi/git-preflight-advisory.ts` (real file; `.pi/extensions/` symlinks here) | `tool_call` for `bash`; advisory keyed by call id and delivered on the matching `tool_result` | Pi's agent core reads a `tool_call` handler's return only for `.block`: a bare `reason` is discarded before the model sees it, so the advisory is buffered and appended to the `tool_result` content instead | Appended to `tool_result` content; warn-only, never `block: true` |

OpenCode discovers plugins solely from `.opencode/plugins/`, so `sk-git-preflight-advisory.js` must live there; `scripts/hooks/opencode/sk-git-preflight-advisory.js` is a relative symlink back into that folder for browsability: nothing loads through it. Pi loads in the other direction: the real `pi/git-preflight-advisory.ts` lives here, and `.pi/extensions/git-preflight-advisory.ts` is the symlink Pi discovers.

---

## 4. DIRECTORY TREE

```text
hooks/  (sk-git/scripts/hooks/)
+-- git-preflight-advisory.mjs        # shared stdin hook (Bash/exec/Shell)
+-- git-preflight-advisory.test.mjs   # node --test suite
+-- opencode/ sk-git-preflight-advisory.js  # symlink -> ../../../../../plugins/sk-git-preflight-advisory.js
`-- pi/
    +-- README.md
    `-- git-preflight-advisory.ts     # real file; .pi/extensions/ symlinks here
../lib/
+-- git-rule-checks.mjs               # GIT_SHAPE + parseGitCommand + 17 GIT_CHECKS
+-- git-rule-checks.test.mjs          # node --test suite
`-- git-context.mjs                   # lazy repository-state collector (1.5s timeout per git call)
```

The hooks-tree index at `.opencode/hooks/git-preflight/` mirrors these: `shared/git-preflight-advisory.mjs` (symlink to the shared hook), `opencode/sk-git-preflight-advisory.js` (symlink to the plugin), `pi/git-preflight-advisory.ts` (symlink to the Pi extension), and `README.md` (symlink to this file).

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `git-preflight-advisory.mjs` | Shared stdin hook for `Bash`, `exec`, and Cursor `Shell` payloads. Reads the repo from payload `cwd`, Cursor's `workspace_roots[0]`, or the runtime project-directory env. Kill-switch, suppression tiers, shape gate, rule read/filter, lazy context, evaluate, cap-at-3 surface, `additionalContext` JSON emit. `main().catch(approve)`: the fail-open path is also the exit-0 path. |
| `../lib/git-rule-checks.mjs` | The `GIT_SHAPE` gate, `parseGitCommand` (subcommand/flags/pathspec split with value-flag and `--` handling), and the 17 `GIT_CHECKS`. Each check gates on state, returns `true` (fine) / `false` (advise), and fails open on uncertainty. |
| `../lib/git-context.mjs` | Lazy repository-state collector. Each accessor runs only when a check asks, caches for one invocation, and fails soft (returns `null`/safe unknown) on any git failure or 1.5s timeout. Reads only pre-command state. |
| `.opencode/plugins/sk-git-preflight-advisory.js` | OpenCode plugin. `tool.execute.before` for `bash` evaluates the same engine and buffers at most 20 advisory events; `experimental.chat.system.transform` drains them as one system block on the next turn. Never prints; never blocks. |
| `pi/git-preflight-advisory.ts` | Pi `tool_call`/`tool_result` extension. Evaluates on `tool_call`, buffers by call id, appends to `tool_result` content. Warn-only, never `block: true`. |
| `../../hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared `readHardRules` frontmatter parser and `evaluate` runner imported by all adapters. |
| `../../hooks/shared/hook-flags.mjs` / `.cjs` | Kill-switch resolver (`isHookEnabled('git-preflight')`). |

---

## 6. CONFIGURATION

The advisory is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared kill-switch.

| Variable | Effect |
|---|---|
| `SK_GIT_PREFLIGHT_DISABLED=1` | Full no-op on every runtime. Each adapter checks `isHookEnabled('git-preflight')` before any work; the shared hook returns `approve()` (exit 0), the OpenCode plugin and Pi extension return before evaluation. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SKGIT_ADVISORY=0` | Silence every git preflight advisory. `false` and `off` are equivalent, case-insensitively. The safety valve. |
| `SKGIT_ADVISORY_SKIP=commit` | Silence every rule whose id starts with `commit-`. The practical tier. |
| `SKGIT_ADVISORY_SKIP=add-pathspec-only-ignored` | Silence one exact rule id. The minimum viable tier. |

`SKGIT_ADVISORY_SKIP` accepts comma-separated tokens. A token matches either a complete rule id or an id prefix followed by `-`.

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory only | Every surfaced result is warning-only and capped at 3 findings plus one omitted-count line. No adapter ever emits a block or deny decision; the command always runs. |
| Fail-open | Non-git commands stop at `GIT_SHAPE`. Missing/malformed stdin produces no advisory and exits 0. Missing frontmatter produces an empty rule set. A check that throws is swallowed by the evaluator. Git subprocess failures and timeouts return safe unknown values. A Cursor `Shell` payload the hook cannot parse fails open exactly as a `Bash`/`exec` one. Pi catches import and evaluation errors and returns `undefined`. OpenCode catches evaluation and transform errors, never throws, never writes stdout/stderr. `main().catch(approve)` makes the fail-open path the exit-0 path. |
| State, not verb | Every check gates on repository state, never on the command verb alone. A check that cannot find a discriminator does not belong here. |
| Pre-command only | `git-context.mjs` reads only state that exists before the command runs. Where a question can only be answered afterwards, there is deliberately no accessor. |
| Cost | Nothing runs until a check asks for it; unrelated commands exit at the shape gate before a single git process is spawned. Each git call is bounded to 1.5s. |
| Output | The shared hook writes one `additionalContext` JSON to stdout. OpenCode buffers and injects via `experimental.chat.system.transform`. Pi appends to `tool_result` content. No adapter writes to the TUI prompt line. |
| Imports | Adapters import the shared `dispatch-rule-checks.mjs` (`readHardRules`/`evaluate`), `git-context.mjs`, `git-rule-checks.mjs`, and `hook-flags`. Nothing outside the repo. |

---

## 8. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
node --test .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs
```

Expected result: all tests pass (the 17 checks and the shared hook's parsing/suppression/surface logic).

```bash
node --check .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
node --check .opencode/plugins/sk-git-preflight-advisory.js
```

Expected result: no syntax errors.

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.cursor/hooks.json', 'utf8')); JSON.parse(require('node:fs').readFileSync('.devin/hooks.v1.json', 'utf8'))"
```

Expected result: exit 0 (confirms the runtime configs that register this hook are valid JSON).

For stdin smoke tests, create a temporary repository with hooks disabled, then pass `Bash`, `exec`, and Cursor `Shell` payloads containing `git commit --only <dir> -m x`. The dirty scoped repository must advise; a non-git command and an ordinary commit in a clean repository must stay silent.

---

## 9. RELATED

- [`../lib/README.md`](../lib/README.md): the rule-engine and context-collector library.
- [`../../SKILL.md`](../../SKILL.md): the `hard_rules:` frontmatter the advisory executes.
- [`pi/README.md`](pi/README.md): the Pi extension bridge.
- [`../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs`](../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs): the shared `readHardRules`/`evaluate` runner.
- [`../../../../hooks/README.md`](../../../../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix.
