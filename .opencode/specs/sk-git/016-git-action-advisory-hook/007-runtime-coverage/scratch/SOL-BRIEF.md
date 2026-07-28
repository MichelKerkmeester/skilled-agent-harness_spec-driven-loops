# BRIEF: Git Preflight Advisory — Cross-Runtime Adapters + Style Alignment + Code READMEs

You are GPT-5.6-SOL acting as a senior implementation engineer. Work entirely inside THIS
repository checkout (the worktree you were launched in). Execute everything below, verify it,
then STOP. Do not commit, do not push, do not touch git state.

## What exists (read these first, in this order)

1. `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` — a PreToolUse hook that
   evaluates git commands against sk-git's `hard_rules:` frontmatter. Already serves Claude
   (`tool_name: Bash`) and Codex/Devin (`tool_name: exec`), resolving the repo from payload `cwd`.
2. `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` — 17 checks + a git command parser.
3. `.opencode/skills/sk-git/scripts/lib/git-context.mjs` — lazy repository-state collector.
4. `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` — 23 tests. MUST stay green.
5. `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs` — fire-rate audit.
6. `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs`
   — the shared frontmatter parser + evaluator (`readHardRules`, `evaluate(cmd, rules, {checks, context})`).

## Style authority

`.opencode/skills/sk-code/code-opencode/references/javascript/style-guide.md` and
`.opencode/skills/sk-code/code-opencode/references/javascript/quality-standards/` (both files).
Read them before writing a line. Note the OPENCODE PLUGIN EXEMPTION TIER: plugins must never
write to process stdout/stderr.

## HARD CONSTRAINTS (violations fail the whole task)

- Comment hygiene: NEVER put spec paths, packet/phase numbers, or ADR/REQ/CHK/task ids in code
  comments. Comments carry the durable WHY only.
- Never duplicate the rule engine, the checks, or the context collector. Every adapter imports
  the existing modules.
- Every adapter fails open: any internal error means silence/approval, never a blocked command.
- Advisory only: nothing you write may block or fail a git command.
- Do not modify `.claude/settings.json` or `.codex/hooks.json` (already wired).
- Do not modify any file outside the write scope listed at the bottom.

## TASK 1 — Style-align the existing sk-git script files (behavior-neutral)

Bring these five files to the JS style guide: boxed `╔═╗` COMPONENT header where the guide
requires it, numbered `─── N. SECTION ───` dividers, complete JSDoc on exported functions,
naming conventions. Do NOT change behavior, exports, or messages:

- `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs`
- `.opencode/skills/sk-git/scripts/lib/git-context.mjs`
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` (header/dividers only; leave test bodies alone)
- `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs`

After aligning: `node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`
must report 23 pass / 0 fail. If a style change breaks a test, the style change is wrong.

## TASK 2 — OpenCode plugin

Create `.opencode/plugins/mk-git-preflight-advisory.js`.

- Mirror the structure of `.opencode/plugins/mk-deep-loop-guard.js` (thin default-export
  adapter over shared cores) and `.opencode/plugins/mk-cli-dispatch-audit.js`.
- Hook `tool.execute.before` for Bash-tool calls; extract the command; fast-exit on non-git
  shapes (reuse the same GIT_SHAPE gating idea as the hook — import from the hook if exported,
  otherwise export the regex from `git-rule-checks.mjs` and use it in both).
- Evaluate via the shared `readHardRules` + `evaluate` with `GIT_CHECKS` and a
  `createGitContext(projectDir)`; resolve projectDir via
  `.opencode/skills/system-spec-kit/runtime/lib/workspace/repo-root.mjs` `findRepoRoot`.
- Delivery: plugins must NOT print. Study how sibling plugins surface warnings (deep-loop-guard
  writes a bounded state-dir log; check whether any sibling injects assistant-visible context —
  e.g. an `experimental` transform or returning metadata). Use the strongest *legal*
  user-visible channel a sibling plugin already uses; if none exists, write one advisory line
  per event to a bounded, size-rotated log under the same state-dir convention deep-loop-guard
  uses, and say so in the README (Task 6). Never invent a new delivery mechanism.
- Honor the same env suppression tiers the hook honors (`SKGIT_ADVISORY`, `SKGIT_ADVISORY_SKIP`).

## TASK 3 — Pi extension

Create `.pi/extensions/git-preflight-advisory.ts`.

- Mirror `.pi/extensions/dispatch-preflight-lint.ts` exactly in shape: default-export factory,
  `pi.on("tool_call", ...)`, `event.toolName === "bash"`, dynamic `import()` of the shared
  `.mjs` modules by relative path, warn = `return { reason: ... }`, fail open via try/catch
  returning undefined.
- Import `git-rule-checks.mjs` (GIT_CHECKS), `git-context.mjs` (createGitContext), and the
  shared `dispatch-rule-checks.mjs` (readHardRules, evaluate).
- Same suppression tiers; same one-advisory-cap discipline as the hook (max 3 + count line).

## TASK 4 — Cursor wiring

- Create `.cursor/hooks/git-preflight-advisory.mjs`: a thin proxy in the style of
  `.cursor/hooks/spec-gate-enforce.mjs` (read ITS header first for the confirmed payload
  facts: `preToolUse` fires with tool_name `Shell` for the shell surface). Map the Cursor
  payload (tool name + command field + cwd) onto the shared hook's expected stdin JSON and
  spawn `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`, forwarding its
  stdout verbatim; or, if the sibling proxies instead re-implement inline, follow the sibling.
  Fail open.
- Register it in `.cursor/hooks.json` under `preToolUse` (command entry, timeout 10), after
  the existing entries.

## TASK 5 — Devin wiring

- Add an entry to `.devin/hooks.v1.json` under `PreToolUse`, matcher `^exec$`, invoking the
  shared hook directly in the same `bash -c 'cd "${DEVIN_PROJECT_DIR:-$PWD}" && node …'`
  fail-open envelope every sibling entry uses (with the printf fallback JSON). The shared hook
  already accepts `exec` payloads. Place it in the SAME matcher group as the existing `^exec$`
  entries, after them.

## TASK 6 — Code READMEs

Create `.opencode/skills/sk-git/scripts/lib/README.md` and
`.opencode/skills/sk-git/scripts/hooks/README.md`.

- Pattern: `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/README.md`
  (YAML frontmatter with title/description/trigger_phrases, `# Title`, `## 1. OVERVIEW`,
  `## 2. ARCHITECTURE` with a box diagram, key-files table, `## VALIDATION` with the exact
  commands). Uppercase H2 headers.
- lib README covers: the 17 checks and the discriminator-not-verb principle, the lazy context,
  the noise audit and its control group, the test suite and how to run it.
- hooks README covers: the advisory hook, its runtime matrix (Claude Bash / Codex+Devin exec /
  Cursor proxy / OpenCode plugin / Pi extension), the suppression tiers, fail-open guarantees,
  and where each runtime registers it.

## TASK 7 — Verify everything, then write a completion report

Run and record results:
1. `node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` → 23/0.
2. `node --check` on every file you created or edited (.js/.mjs).
3. JSON parse `.cursor/hooks.json` and `.devin/hooks.v1.json` (node -e JSON.parse).
4. Stdin simulations against a scratch repo you create under /tmp (init, hooksPath detached,
   one tracked file modified + one untracked in a subdir):
   - Claude: `{"tool_name":"Bash","tool_input":{"command":"git commit --only <dir> -m x"}}` → advisory
   - exec: same with tool_name "exec" and payload cwd → advisory
   - non-git command → silence. Clean-tree ordinary commit → silence.
5. Cursor proxy: pipe a Shell-shaped payload through your proxy → advisory text appears.
6. Pi/OpenCode: `node --check` (pi .ts: review import paths resolve relative to the file;
   if `npx tsc --noEmit` is available for `.pi`, run it, else state you could not).

Write the full report (commands + real outputs, honest about anything skipped) to:
`.opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage/scratch/SOL-REPORT.md`

## WRITE SCOPE (complete list — nothing else)

- `.opencode/skills/sk-git/scripts/**` (align + READMEs)
- `.opencode/plugins/mk-git-preflight-advisory.js` (new)
- `.pi/extensions/git-preflight-advisory.ts` (new)
- `.cursor/hooks/git-preflight-advisory.mjs` (new) and `.cursor/hooks.json` (append one entry)
- `.devin/hooks.v1.json` (append one entry)
- `.opencode/specs/sk-git/016-git-action-advisory-hook/007-runtime-coverage/scratch/SOL-REPORT.md`
- Scratch repos under /tmp only.
