# Orca CLI Installation Guide

> Install or discover the official `orca-cli` skill only when the operator asks. Runtime installation, sign-in, publishing permissions, and mutating Orca actions stay operator-controlled.

## 1. AI-FIRST INSTALL PROMPT

Use this prompt when an operator explicitly authorizes the public skill installation:

```text
Set up the official Orca CLI skill without changing the repository. First check whether the Orca skill is already installed. If installation is needed, ask for confirmation before running:

npx skills add https://github.com/stablyai/orca --skill orca-cli --global

After installation, resolve the Orca executable according to the version-matched skill guide, run the version and help checks, and load the guide with `orca skills get orca-cli --full`. Do not authenticate, create worktrees, send terminal input, publish artifacts or skills, or run mutating commands unless I authorize each action separately. Report each command's output and exit status.
```

The public skill package is not the same thing as the Orca desktop/runtime installation. Do not invent a runtime installer from the skill package command.

## 2. READ-ONLY PREFLIGHT

Resolve one executable and keep it fixed for the session:

1. Use `ORCA_CLI_COMMAND` when set.
2. Otherwise use `orca-dev` from a development checkout exposing `ORCA_DEV_REPO_ROOT`.
3. On Linux outside an Orca-managed terminal, use `orca-ide`.
4. Otherwise use `orca`.

Then run the selected executable's read-only checks:

```bash
command -v orca
orca --version
orca --help
orca agent-context --json
orca skills get orca-cli --full
```

`agent-context --json` reads the local command registry without contacting the runtime. `skills get` loads the guide bundled with the installed CLI version. If a conditional reference is needed, request only the relevant document:

```bash
orca skills get orca-cli --reference references/browser.md
orca skills get orca-cli --reference references/automations.md
orca skills get orca-cli --reference references/publishing.md
```

If the CLI rejects a reference flag, use the full guide or the command's own help. Do not guess replacement flags.

## 3. RUNTIME AND ACCOUNT BOUNDARIES

The inspected Orca 1.4.205 environment had a ready connected runtime, but runtime availability is machine state and must be checked again when a request depends on it. Do not add accounts, sign in, or select profiles from this packet without explicit operator authorization. Never print account tokens or publishing edit tokens.

The local command registry exposed no Orca-native MCP command. Official documentation describing MCP integrations is not evidence of a callable in the installed CLI, so no Code Mode manual is installed or edited by this packet.

## 4. FIRST USE CHECKLIST

- [ ] The operator approved any public skill installation.
- [ ] The selected executable path and version were captured.
- [ ] `--help` was captured for the installed version.
- [ ] `agent-context --json` and `skills get orca-cli` completed or their exact blockers were recorded.
- [ ] The request's lane is identified: discovery, worktree, terminal, handoff, browser, automation, artifact, or skill sharing.
- [ ] Any mutating or destructive action has separate authorization.
- [ ] Browser, automation, or publishing references were loaded only for the action being performed.

## 5. VERIFICATION

```bash
python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/mcp-tooling/mcp-orca-cli --check
```

The packet's manual safety matrix is in [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md). It accepts `PASS`, `FAIL`, or `SKIP` with a specific blocker. A skipped authenticated or mutating check is not evidence that the action is safe.
