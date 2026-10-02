# Security Policy

Skilled installs hooks, runs shell commands and reads environment variables inside AI coding assistants, so a flaw here can reach the machine it runs on. Reports are welcome and handled privately.

---

## 1. 📖 OVERVIEW

Skilled is a set of files your AI coding assistant loads and runs. Hooks fire when a session starts, on every prompt, before and after tool calls and when the session ends. Skills tell the agent which shell commands to run, and some of those commands start other AI CLIs that write to your files without asking first. All of it runs under your own user account, with your environment variables and credentials.

This policy has two kinds of reader. If you found a vulnerability, sections 2 to 5 say how to report it and what counts. If you run Skilled, sections 6 and 7 say what can go wrong and which shipped defaults to change. Section 8 lists the safeguards the repository already has.

---

## 2. 🔒 REPORTING A VULNERABILITY

Report it through GitHub's private vulnerability reporting: open the repository's **Security** tab and choose **Report a vulnerability**. Do not open a public issue or pull request for a security problem.

Include what you can of the following:

- The affected file, hook, command or skill, with the commit SHA you tested against
- The runtime and its version: Claude Code, Codex, OpenCode, Pi, Devin, Cursor or Hermes
- Every setting you changed from the shipped defaults: the permission mode, any dispatch flag and any hook switch set in your shell or in `.skilled/hooks/hook-flags.env`
- Steps to reproduce, or a proof of concept
- The impact you expect, such as code execution, credential exposure or a sandbox escape

Leave live secrets out of the report. If a credential leaked, name its kind and where it showed up, for example a transcript, a log under `.skilled/logs/`, a spec document or a commit. Rotate it before you write.

Skill names that begin with `sk-`, such as `sk-doc` or `sk-git`, are not API keys. Secret scanners that match the OpenAI `sk-` key prefix flag thousands of them across the skill tree. Check a scanner hit against the file before you report it.

---

## 3. 🕑 WHAT HAPPENS NEXT

Every report is acknowledged. Once the problem is confirmed, the fix lands on `main` and the advisory is published with credit to the reporter, unless you ask to stay anonymous.

---

## 4. 📦 SUPPORTED VERSIONS

Only the latest release on `main` receives security fixes.

---

## 5. 🎯 SCOPE

In scope is everything this repository ships: `.skilled/` skills, commands, agents, hooks and scripts, and the runtime configuration under `.claude/`, `.codex/`, `.opencode/` and the other runtime folders.

Out of scope are the AI assistants themselves and third-party MCP servers, which should be reported to their own maintainers.

The in-scope surfaces live here:

| Surface | Where it lives |
|---|---|
| AI runtime hooks | `.skilled/hooks/`. `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` register them. OpenCode loads `.opencode/plugins/` and Pi loads `.pi/extensions/` |
| Git hooks | `.skilled/scripts/git-hooks/`, installed by `.skilled/scripts/install-git-hooks.sh` |
| Skills and their scripts | `.skilled/skills/` |
| Commands and agents | `.skilled/commands/`, `.skilled/agents/` and the agent folder inside each runtime folder |
| Launchers and repo scripts | `.skilled/bin/` and `.skilled/scripts/` |
| MCP wiring | `.mcp.json`, `opencode.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.utcp_config.json` |

Some spec packets keep copies of third-party repositories as research material under `specs/**/context/`. Git ignores that path, so those copies stay on the machine that fetched them and are not part of what Skilled ships.

---

## 6. ⚠️ WHAT CAN GO WRONG

Each risk below names the file that sets the behavior, so you can check it yourself.

### Hooks Run As You

`.claude/settings.json` registers hook commands on seven events, and each other runtime config registers its own. Every hook runs with your account and your environment. Most guards fail open: when one crashes or reads input it cannot parse, the tool call goes through and your session keeps working. The Devin permission policy is the exception and denies on any error. An edited hook script changes what runs on your machine at the next session, so review hook changes the way you review code you execute.

### The Shipped Permission Defaults Skip Approval

`.claude/settings.json` sets `permissions.defaultMode` to `bypassPermissions` and turns off the warning Claude Code shows for that mode with `skipDangerousModePermissionPrompt`. `opencode.json` allows `edit`, `bash`, `webfetch` and `external_directory` without a prompt. Under these defaults the agent runs shell commands, edits files, reaches outside the project folder and fetches URLs without asking you. Text the agent reads in a web page, an issue, a pull request or a file can steer it, and no approval step stands in the way.

### Dispatched CLIs Auto-Approve

The `cli-*` skills start other AI CLIs without a terminal, and a lane that may write runs with approval switched off. The deep-loop fan-out runner in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` passes `--permission-mode dangerous` to Devin and `--yolo` to Hermes for any lane that may write. An OpenCode lane with full access gets `--dangerously-skip-permissions`. `cli-devin` uses `--permission-mode dangerous` for a single dispatch too, unless you name another mode. A dispatched lane learns from its prompt which paths it may write, and nothing in its sandbox enforces that list. In one recorded incident, a review dispatch running with `--dangerously-skip-permissions` deleted 44 files across two phase folders.

### Installs Run Without A Separate Prompt

The skill advisor launcher in `.skilled/bin/system-skill-advisor-launcher.cjs` runs `npm ci` or `npm install` and a build when its runtime has not been built yet. `worktree-naming.sh create` in `sk-git` installs every package tree listed in `worktree-provision-paths.txt`, nine of them today. Neither passes `--ignore-scripts`, so each package's install scripts run. The first AI session in the main checkout also installs the git hooks when they are missing.

### MCP Servers Come From The Network

The Claude Code, Codex, Cursor, Devin and OpenCode configs each register one MCP server, Code Mode, which starts the servers listed in `.utcp_config.json`. Apart from the two Chrome DevTools entries, every `npx` entry there names no fixed version or names `@latest`, so a launch can fetch a release you have never run. Three entries connect to remote endpoints through `mcp-remote`. Code Mode reads the API keys those servers need from the `.env` file at the repository root.

### Secrets Leak Through Files And Commands

Git ignores `.env` and `.env.*` (`.env.example` excepted), `*.key`, `*.pem`, `*.cert` and the Codex home a dispatched run creates under `specs/**/lineages/*/.codex-home/`, which can hold a linked credential. The commit hooks run no secret scan. A key written into a spec document, a commit message or `.utcp_config.json` is committed as written. A key typed on a command line stays in your shell history and in the session transcript.

### Hooks Reach Outside The Repository

`.skilled/bin/install-codex-hooks.mjs` edits `~/.codex/hooks.json` to remove this repository's entries from it. The session-start hook only runs it with `--check`. The git hook installer writes to the hooks directory git resolves, so when you have set a global `core.hooksPath`, the hooks land there and run in every repository on your machine. They are written to stay silent in a repository that does not ship Skilled.

---

## 7. 🛡️ RUNNING SKILLED SAFELY

### Read What Runs

Read the hook registrations before your first AI session: the `hooks` block in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.opencode/plugins/` and `.pi/extensions/`. The [hooks README](.skilled/hooks/README.md) indexes every hook the repository authors, by concern and runtime. After a pull, this shows what changed in the code that runs on your machine:

```bash
git diff --stat ORIG_HEAD HEAD -- .claude/settings.json .codex .cursor .devin .opencode/plugins .pi/extensions .skilled/hooks .skilled/bin .skilled/scripts .utcp_config.json
```

### Turn Approval Back On

For Claude Code to ask before it acts, override the shipped mode in `.claude/settings.local.json`. Claude Code reads that file over `.claude/settings.json`, and this repository's `.gitignore` keeps it out of commits:

```json
{
  "permissions": {
    "defaultMode": "default"
  }
}
```

In OpenCode, change `"bash"` and `"edit"` under `permission` in `opencode.json` from `"allow"` to `"ask"`.

### Keep Secrets Out Of Tracked Files

- Keep API keys in the root `.env` file or your shell, never in `.utcp_config.json`. Refer to them there as `${VARIABLE_NAME}`. Code Mode expects each name prefixed with its manual name, for example `clickup_CLICKUP_API_KEY`
- Restrict the file with `chmod 600 .env`
- Never type a key on a command line or paste one into a prompt or a spec document
- Check `git diff --cached` before you commit, because no hook will catch a key for you

### Choose Dispatch Modes Deliberately

Use a read-only mode for review and research: `--permission-mode plan` for Claude Code and `--mode plan` or `--mode ask` for Cursor. `codex exec` is read-only unless you pass `--sandbox workspace-write`. When a dispatch must write, run it in a fresh git worktree so a stray delete hits a tree you can throw away. `cli-devin` and `cli-hermes` approve tool calls by default, so name a narrower mode when you dispatch them.

### Pin And Trim MCP Servers

Replace `@latest` and the unversioned `npx` entries in `.utcp_config.json` with fixed versions for the servers you use. Remove the entries you do not use, so their packages never download.

### Switch Hooks Off With Care

`SYSTEM_HOOKS_DISABLED=1` turns off every AI hook, and the [hooks README](.skilled/hooks/README.md) lists one switch per hook. Some switches widen access instead of narrowing it. With `SYSTEM_HOOKS_DISABLED=1` or `SYSTEM_PERMISSION_POLICY_DISABLED=1`, Devin approves every permission request. `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` turns off every pre-commit gate. To see where each git hook resolves, or to remove them:

```bash
bash .skilled/scripts/install-git-hooks.sh --status
bash .skilled/scripts/install-git-hooks.sh --uninstall
```

---

## 8. 🧱 HOW THE REPOSITORY GUARDS ITSELF

| Safeguard | What it does | Where |
|---|---|---|
| Mass-deletion ceiling | `pre-push` blocks a push that deletes more than 100 tracked files. `SPECKIT_MASS_DELETION_THRESHOLD` raises the ceiling for one command | `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` |
| Push permission gate | `pre-push` needs your approval for a push to any branch other than `main`, a `skilled/v*` release branch or one on the sk-git allowlist | `.skilled/scripts/git-hooks/pre-push` |
| Message contract | `commit-msg` blocks a message that breaks the sk-git commit rules. There is no bypass, and `pre-push` re-checks every pushed commit, so `--no-verify` does not let one through | `.skilled/scripts/git-hooks/commit-msg` |
| Dispatch preflight | Reads the `hard-rules.json` file beside each CLI skill's `SKILL.md` and denies a dispatch that breaks a blocking rule, such as an `opencode run` that leaves stdin open | `.skilled/hooks/dispatch/` |
| Git preflight advisory | Warns before a git command with a surprising result, such as `reset --hard` over uncommitted changes or a force push without a lease | `.skilled/skills/sk-git/hard-rules.json` |
| Devin permission policy | Answers each Devin permission request and denies on malformed input, a missing field, an unknown tool or any internal error | `.skilled/hooks/permission-policy/` |
| Fan-out write containment | Diffs the tree after each dispatch, quarantines a copy of every write outside the lane's directory and reports it | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` |
| Dispatch audit log | Writes one line per dispatch, with API keys, tokens, passwords and authorization headers redacted. Git ignores the log | `.skilled/logs/cli-dispatch-audit.log` |
| Pinned CI actions | Every GitHub Action is pinned to a commit SHA, and Dependabot updates the pins weekly | `.github/workflows/`, `.github/dependabot.yml` |
| Dependency updates | Dependabot opens weekly npm updates for the root, `.opencode/`, `.skilled/` and `.pi/extensions/`. Only a grouped npm security update made of patch releases merges on its own once checks pass. Every other update waits for a person | `.github/workflows/dependabot-auto-merge.yml` |

---

## 9. 📚 RELATED DOCUMENTS

- **[README: Git Hooks](README.md#git-hooks)** - what each git hook blocks and how to remove them
- **[README: Off Switches](README.md#off-switches)** - every hook and validation switch in one place
- **[Hooks README](.skilled/hooks/README.md)** - the full hook index with its kill switches and per-runtime coverage
- **[Git hooks README](.skilled/scripts/git-hooks/README.md)** - each git hook gate and its bypass
- **[Permission policy](.skilled/hooks/permission-policy/README.md)** - the fail-closed Devin permission decision
- **[Dispatch hooks](.skilled/hooks/dispatch/README.md)** - the preflight lint and the audit log redaction
- **[Destructive scope violations](.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md)** - the recorded deletion incident and the four-layer mitigation
- **[Code Mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md)** - `.env` setup and prefixed variable names
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - how to contribute a fix
