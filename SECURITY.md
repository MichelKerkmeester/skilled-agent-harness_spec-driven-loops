---
title: "Security Policy"
description: "How to privately report a vulnerability in Skilled, what is in scope, which shipped defaults carry risk and how to run the framework safely."
trigger_phrases:
  - "security policy"
  - "report a vulnerability"
  - "skilled security defaults"
  - "auto mode and dangerous dispatch modes"
  - "repository security safeguards"
---

# Security Policy

> Skilled installs hooks, runs shell commands and reads environment variables inside AI coding assistants, so a flaw here can reach the machine it runs on. Report one privately through GitHub, as section 2 describes.

&nbsp;

## 1. OVERVIEW

Skilled is a set of files your AI coding assistant loads and runs. Hooks fire when a session starts, on every prompt, around each tool call and when the session ends. Skills tell the agent which shell commands to run. Some of those commands start other AI CLIs that write to your files without asking first. All of it runs under your own user account, with your environment variables and credentials.

This policy has two kinds of reader. If you found a vulnerability, sections 2 to 5 say how to report it and what counts. If you run Skilled, sections 6 and 7 say what can go wrong and which shipped defaults to change. Section 8 lists the safeguards the repository already has.

&nbsp;

## 2. REPORTING A VULNERABILITY

Report it through GitHub's private vulnerability reporting. Open the repository's **Security** tab and choose **Report a vulnerability**. Never open a public issue or pull request for a security problem.

Include what you can of the following:

- The affected file, hook, command or skill, with the commit SHA you tested against
- The runtime and its version: Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DeepSeek Harness or Mistral Vibe
- Every setting you changed from the shipped defaults: the permission mode, any dispatch flag and any hook switch set in your shell or in `.skilled/hooks/hook-flags.env`
- Steps to reproduce, or a proof of concept
- The impact you expect, such as code execution, credential exposure or a sandbox escape

Leave live secrets out of the report. If a credential leaked, name its kind and where it showed up, for example a transcript, a log under `.skilled/logs/`, a spec document or a commit. Rotate it before you write.

Skill names that begin with `sk-`, such as `sk-doc` or `sk-git`, are not API keys. Secret scanners that match the OpenAI `sk-` key prefix flag thousands of them across the skill tree. Check a scanner hit against the file before you report it.

&nbsp;

## 3. WHAT HAPPENS NEXT

Every report is acknowledged. Once the problem is confirmed, the fix lands on `main` and the advisory is published with credit to you, unless you ask to stay anonymous.

&nbsp;

## 4. SUPPORTED VERSIONS

Only the latest release on `main` receives security fixes.

&nbsp;

## 5. SCOPE

This repository ships the skills, commands, agents, hooks and scripts under `.skilled/`, plus the configuration in each of the eight runtime folders. Out of scope are the AI assistants themselves and third-party MCP servers. Report those to their own maintainers.

The in-scope surfaces live here:

| Surface | Where it lives |
|---|---|
| AI runtime hooks | `.skilled/hooks/`. `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` and `.vibe/hooks.toml` register them. OpenCode loads `.opencode/plugins/` and Pi loads `.pi/extensions/` |
| DeepSeek Harness | `.dsh/` and its guard bundle in `.dsh/plugins/repo-guards/`, which `.dsh/patches/guards.patch.yml` loads. Each run sets its own permission mode |
| Mistral Vibe | `.vibe/`. Its config and hooks apply only when the checkout root is trusted |
| Git hooks | `.skilled/scripts/git-hooks/`, installed by `.skilled/scripts/install-git-hooks.sh` |
| Skills and their scripts | `.skilled/skills/` |
| Commands and agents | `.skilled/commands/`, `.skilled/agents/` and the agent, command and prompt folders inside each runtime folder |
| Launchers and repo scripts | `.skilled/bin/` and `.skilled/scripts/` |
| MCP wiring | `.mcp.json`, which links to `.claude/mcp.json`, plus `opencode.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json`, `.pi/mcp.json`, `.dsh/patches/mcp-code-mode.patch.yml` and `.utcp_config.json` |

Some spec packets keep copies of third-party repositories as research material under `specs/**/context/`. Git ignores that path, so those copies stay on the machine that fetched them and are not part of what Skilled ships.

&nbsp;

## 6. WHAT CAN GO WRONG

Each risk below names the file that sets the behavior, so you can check it yourself.

### Hooks Run As You

`.claude/settings.json` registers hook commands on seven events, and each other runtime registers its own through the files in section 5. Every hook runs with your account and your environment.

Most guards fail open. When one crashes or reads input it cannot parse, the tool call goes through and your session keeps working. A few fail closed instead. The Devin permission policy denies on any error. On DeepSeek Harness, the dispatch preflight, the spec gate and the MCP route guard deny when their core check fails. Its git message gate denies on a `ContractError` and logs any other error before it lets the command run.

An edited hook script changes what runs on your machine at the next session. Review hook changes the way you review code you run.

### Most Calls Run Without A Prompt

`.claude/settings.json` sets `permissions.defaultMode` to `auto`. Claude Code then approves most tool calls without asking you and screens them with its own classifier instead. The same file sets `skipDangerousModePermissionPrompt`, so a switch to bypass mode shows no warning. `opencode.json` allows `edit`, `bash`, `webfetch`, `doom_loop` and `external_directory` without a prompt.

Under these defaults the agent runs shell commands, edits files, reaches outside the project folder and fetches URLs, mostly without asking you. Text the agent reads in a web page, an issue, a pull request or a file can steer it.

### Dispatched CLIs Approve Their Own Work

The CLI bridges and the deep-loop fan-out start other AI CLIs with no terminal attached, so nobody is there to answer a prompt. A lane that may write runs with approval off. The fan-out runner in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` passes these flags:

| CLI | What a lane gets |
|---|---|
| Devin | `--permission-mode dangerous` for any lane that may write. A single `cli-devin` dispatch uses it too, unless you name another mode |
| OpenCode | `run --standalone -m provider/model#effort --format json`, plus `--auto` only for a `danger-full-access` sandbox. The executor exposes no sandbox flag, so any other requested sandbox mode fails closed before dispatch |
| Cursor | `--force`, with its sandbox on for workspace writes and off for full access |
| Codex | `approval_policy=never`, confined only by the sandbox mode it is given |
| Mistral Vibe | `--trust --auto-approve` on every lane |
| DeepSeek Harness | `--approval-policy never`, which confines nothing. Its permission mode decides what it may touch |

DeepSeek Harness also loads the `.env` file of the folder it starts in, so a run started from the repository root reads its keys.

A lane learns from its prompt which paths it may write. Nothing stops a write outside them while the lane runs. In one recorded incident, a review dispatch running with `--dangerously-skip-permissions` deleted 44 files across two phase folders.

### Installs And Builds Run Without Asking

The skill advisor launcher, `.skilled/bin/system-skill-advisor-launcher.cjs`, runs `npm ci` or `npm install` and a build when its runtime has not been built yet. `worktree-naming.sh create` in sk-git installs each package tree listed in `worktree-provision-paths.txt` that is not already installed, and skips a listed path with no `package.json`. It uses npm, or bun for a package that ships a `bun.lock` or `bun.lockb` and no `package-lock.json`. Neither passes `--ignore-scripts`, so each package's install scripts run.

At session start, the dist freshness check rebuilds any watched package whose compiled build is older than its sources. In the main checkout with live sync on, the session-start git hooks check also installs a missing git hook.

### Commits Reach The Remote On Their Own

Live sync is on by default in the main checkout. In a session started through the launch wrapper, the post-commit hook publishes each commit to the shared live branch, and the pre-push hook lets that one branch through without asking. At session start, the primary reconcile hook also publishes local commits when the main checkout is ahead of its live branch. `SYSTEM_LIVE_SYNC_DISABLED=1` turns the loop off.

### Tools Reach The Network

The Claude Code, Codex, Cursor, Devin, OpenCode and Pi configs each register one MCP server, Code Mode, which starts the servers listed in `.utcp_config.json`. A DeepSeek Harness dispatch registers it only when it adds the Code Mode patch, and Mistral Vibe has no registration.

Apart from the three Chrome DevTools entries, every `npx` entry in `.utcp_config.json` names no fixed version or names `@latest`. A launch can fetch a release you have never run. Four entries connect to remote endpoints through `mcp-remote`. One entry, `aside`, runs a binary from your `PATH`. Code Mode reads the API keys those servers need from the `.env` file at the repository root.

The classifier injection screen sends the text of each fetched web page to the hosted Jev classifier, once a Jev key is stored.

### Secrets Leak Through Files And Commands

Git ignores `.env` and `.env.*` (`.env.example` excepted), `*.key`, `*.pem`, `*.cert` and the Codex home a dispatched run creates under `specs/**/lineages/*/.codex-home/`, which can hold a linked credential. The commit hooks run no secret scan. A key written into a spec document, a commit message or `.utcp_config.json` is committed as written. A key typed on a command line stays in your shell history and in the session transcript.

A project linked with `/doctor:symlink link --include env` links the checkout's `.env`, so every tool started in that project reads its secrets.

The dotenv guard keeps an agent from reading `.env` through its tools, but it judges a list of programs, not every command. A script that prints a loaded variable gets past that check. So does interpreter code that loads the file without naming it. A second check after each shell call undoes a dotenv write and looks for a dotenv value in the output. On Claude Code, Codex, Cursor, Devin and DeepSeek Harness it can only report a value the model has already read. It does not find a value printed encoded or split, or one shorter than 12 characters. Mistral Vibe runs the first check only.

Claude Code, Devin and Cursor also carry their own deny lists for dotenv files. In a live check with permissions bypassed, Claude Code refused `Read`, `Edit` and `cat` and still let `python3 -c` read the file. Devin refused reads in `auto` mode only. In `dangerous` mode it refused nothing, and its write entries stopped no write. DeepSeek Harness refuses a command that prints a value it loaded, but a script that prints the environment gets past it.

The guard lowers the odds of a leak. It does not make a dotenv file a safe place for real values, so keep them in a secret manager where you can.

### Hooks Reach Outside The Repository

`.skilled/bin/install-codex-hooks.mjs` edits `~/.codex/hooks.json` to remove this repository's entries from it. The session-start hook only runs it with `--check`.

The git hook installer writes to the hooks directory git resolves. When you have set a global `core.hooksPath`, the hooks land there and run in every repository on your machine. In a repository that does not ship Skilled they add only the commit message rules, plus the Commit-Id checks where that policy covers the repository. A repository that ships Skilled runs its own scripts only in the checkout that installed the hooks, its worktrees or a repository you mark with `git config --local skilled.trustRepoHooks true`. Trust covers every branch of that repository.

&nbsp;

## 7. RUNNING SKILLED SAFELY

### Read What Runs

Read the hook registrations before your first AI session: the `hooks` block in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.opencode/plugins/`, `.pi/extensions/`, `.dsh/patches/guards.patch.yml` and `.vibe/hooks.toml`. The [hooks README](.skilled/hooks/README.md) indexes every hook the repository authors, by concern and runtime.

Several entries under `.skilled/hooks/` are links to code inside a skill, so the command below also covers `.skilled/skills`. After a pull, it shows what changed in the code that runs on your machine:

```bash
git diff --stat ORIG_HEAD HEAD -- .claude/settings.json .claude/mcp.json .codex .cursor .devin .dsh .opencode/plugins opencode.json .pi .vibe .skilled/hooks .skilled/bin .skilled/scripts .skilled/skills .skilled/commands/doctor/scripts .utcp_config.json
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

- Keep API keys in the root `.env` file or your shell, never in `.utcp_config.json`. Refer to them there as `${VARIABLE_NAME}`. Code Mode expects each name prefixed with its manual name, with every underscore in that name doubled. The [Code Mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md) shows the exact form
- Restrict the file with `chmod 600 .env`
- Where you can, keep references in the file and the values in a secret manager, and let it start the app, as in `op run --env-file=.env -- npm start`. The [dotenv guard README](.skilled/hooks/env-secret-guard/README.md) lists the options and the runtime sandboxes that refuse a read for every process
- To let an agent compare dotenv values, export `ENV_SECRET_GUARD_PEPPER` from your shell profile, never from a file in the repository. A key the agent can read lets it test guesses against a fingerprint
- Never type a key on a command line or paste one into a prompt or a spec document
- Check `git diff --cached` before you commit, because no hook will catch a key for you

### Choose Dispatch Modes Deliberately

Use a read-only mode for review and research: `--permission-mode plan` for Claude Code and `--mode plan` or `--mode ask` for Cursor. `codex exec` is read-only unless you pass `--sandbox workspace-write`. `cli-devin` approves tool calls by default, so name a narrower mode when you dispatch it.

For DeepSeek Harness, pick `read-only` or `workspace-write` on purpose. Run it from a scratch folder outside the checkout with a disposable `DSH_HOME`. Never run it from the repository root.

When a dispatch must write, run it in a fresh git worktree, so a stray delete hits a tree you can throw away.

### Pin And Trim MCP Servers

Replace `@latest` and the unversioned `npx` entries in `.utcp_config.json` with fixed versions for the servers you use. Remove the entries you do not use, so their packages never download.

### Switch Hooks Off With Care

`SYSTEM_HOOKS_DISABLED=1` turns off every AI hook except the git message gate. It turns off every pre-commit gate too. The [hooks README](.skilled/hooks/README.md) lists one switch per hook. Some switches widen access instead of narrowing it. With `SYSTEM_HOOKS_DISABLED=1` or `SYSTEM_PERMISSION_POLICY_DISABLED=1`, Devin approves every permission request. `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` turns off every pre-commit gate.

The dotenv guard reads its off switches from the environment only. A line in `hook-flags.env` does not turn it off, because an agent can write that file.

To see where each git hook resolves, or to remove them:

```bash
bash .skilled/scripts/install-git-hooks.sh --status
bash .skilled/scripts/install-git-hooks.sh --uninstall
```

&nbsp;

## 8. HOW THE REPOSITORY GUARDS ITSELF

| Safeguard | What it does | Where |
|---|---|---|
| Mass-deletion ceiling | `pre-push` blocks a push that deletes more than 100 tracked files. `SPECKIT_MASS_DELETION_THRESHOLD` raises the ceiling for one command and `SPECKIT_ALLOW_MASS_DELETION=1` allows one push | `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` |
| Push permission gate | `pre-push` asks before a push to any branch other than `main`, a `skilled/v*` release branch or one on the sk-git allowlist. `SPECKIT_ALLOW_REMOTE_PUSH=1` approves one push | `.skilled/scripts/git-hooks/pre-push` |
| Message contract | `commit-msg` blocks a message that breaks the sk-git commit rules, with no bypass. `pre-push` checks every pushed commit again, which catches a `git commit --no-verify` | `.skilled/scripts/git-hooks/commit-msg` |
| Message contract in CI | `git push --no-verify` skips every `pre-push` gate. This workflow checks each pushed commit, new branch name and pull request description on GitHub. It blocks a merge only when the branch rules make it a required check | `.github/workflows/message-contract.yml` |
| Dispatch preflight | Reads the `hard-rules.json` file beside each CLI bridge's `SKILL.md` and denies a dispatch that breaks a blocking rule, such as an `opencode run` that leaves stdin open | `.skilled/hooks/cli-dispatch/` |
| Git preflight advisory | Warns before a git command with a surprising result, such as `reset --hard` over uncommitted changes or a force push without a lease. It runs on every runtime except Mistral Vibe | `.skilled/skills/sk-git/hard-rules.json` |
| Devin permission policy | Answers each Devin permission request and denies on malformed input, a missing field, an unknown tool or any internal error | `.skilled/hooks/permission-policy/` |
| Overlay guard | Denies an edit to a file that a copied project's overlay owns. It covers every runtime, and `SYSTEM_OVERLAY_GUARD_DISABLED=1` turns it off | `.skilled/hooks/overlay-guard/` |
| Dotenv guard | Denies an agent's read or write of a `.env` file on every runtime, through file tools, patches and the common shell reads. It answers with key names, syntax errors or a keyed fingerprint instead of a value. `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` in the environment turns it off | `.skilled/hooks/env-secret-guard/` |
| Fan-out write containment | Diffs the tree after each dispatch and reports every change outside the lane's folder. It keeps a copy of each change it can blame on the lane and undoes nothing unless a run opts in | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` |
| Dispatch audit log | Writes one line per dispatch, with API keys, tokens, passwords and authorization headers redacted. Git ignores the log | `.skilled/logs/cli-dispatch-audit.log` |
| Pinned CI actions | Every GitHub Action is pinned to a commit SHA, and Dependabot updates the pins weekly | `.github/workflows/`, `.github/dependabot.yml` |
| Dependency updates | Dependabot opens weekly npm updates for the root package and every package under `.opencode/`, `.skilled/` and `.pi/extensions/`. Only an npm security update made of patch releases merges on its own once checks pass. Every other update waits for a person | `.github/workflows/dependabot-auto-merge.yml` |

&nbsp;

## 9. RELATED DOCUMENTS

- **[README: Git Hooks](README.md#git-hooks)** - what each git hook blocks and how to remove them
- **[README: Off Switches](README.md#off-switches)** - the switches most people set
- **[Hooks README](.skilled/hooks/README.md)** - the full hook index with its off switches and per-runtime coverage
- **[Git Hooks README](.skilled/scripts/git-hooks/README.md)** - each git hook gate, its bypass and the trust setting
- **[Permission Policy](.skilled/hooks/permission-policy/README.md)** - the fail-closed Devin permission decision
- **[Dispatch Hooks](.skilled/hooks/cli-dispatch/README.md)** - the preflight lint and the audit log redaction
- **[Destructive Scope Violations](.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md)** - the recorded deletion incident and the four-layer mitigation
- **[Code Mode Install Guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md)** - `.env` setup and prefixed variable names
- **[Contributing](CONTRIBUTING.md)** - how to contribute a fix
