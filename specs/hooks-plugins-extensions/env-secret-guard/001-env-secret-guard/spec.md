---
title: "Feature Specification: env secret guard for every runtime"
description: "An agent can read or edit a .env file on every runtime Skilled supports. This packet adds one shared guard, wired as an OpenCode plugin, a Pi extension, a DSH adapter and a command hook for Claude Code, Codex, Cursor and Devin, plus value-free ways to list keys, validate and fingerprint a dotenv file."
trigger_phrases:
  - "env secret guard"
  - "dotenv guard plugin"
  - "block env file reads"
  - "hmac fingerprint dotenv"
  - "envsitter port"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: env secret guard for every runtime

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/341-env-secret-guard` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An agent in a Skilled checkout can read, edit or patch a `.env` file on every runtime this repository supports. OpenCode, for example, edits one without any prompt, because the repository grants `edit: allow` and OpenCode has no dotenv rule for edits. Reads only ask, and an approved or unattended read puts every secret value into the model's context. An agent that needs to know whether a key exists or whether two values match has no way to find out without reading the values.

### Purpose
The agent can never open a dotenv file through a file tool, and it can still list the keys, check the syntax and compare values by fingerprint.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git grep -l -i envsitter -- . ':!specs' ':!barter' | wc -l
0
$ python3 -c "import json;print(json.load(open('opencode.json'))['permission'])"
{'edit': 'allow', 'bash': 'allow', 'webfetch': 'allow', 'doom_loop': 'allow', 'external_directory': 'allow'}
$ grep -a -o 'action:"read",resource:"\*\.env[^}]*}' ~/.local/opencode-v2/.../opencode.exe   (OpenCode 2.2.5)
action:"read",resource:"*.env",effect:"ask"}
action:"read",resource:"*.env.*",effect:"ask"}
action:"read",resource:"*.env.example",effect:"allow"}
```
The built-in defaults cover `read` only, with `ask`. No default covers `edit`, `write` or `patch` on a dotenv file.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one runtime-neutral core that decides whether a tool call reads or writes a dotenv file, for file tools on every runtime and for shell commands that hand a dotenv file to a reading program or redirect into one.
- Wire the core on all seven runtimes: an OpenCode plugin, a Pi extension, a DSH repo-guards adapter, and one command hook shared by Claude Code, Codex, Cursor and Devin, registered through the hook registry.
- Add the OpenCode tools `env_secret_list_keys`, `env_secret_validate` and `env_secret_fingerprint`, and a CLI with the same three actions for the runtimes whose hooks cannot register tools. None of them returns a value.
- Key the fingerprint with HMAC-SHA256 on a pepper read only from the `ENV_SECRET_GUARD_PEPPER` environment variable, never from a file in the repository.
- Gate everything with the `env-secret-guard` concern, so `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` turns it off.

### Out of Scope
- Shell reads through a program outside the reading-program list, and `source .env` followed by printing a variable. The shell rule catches the common direct reads. It is not a shell parser.
- `grep` over a directory that contains a `.env`. ripgrep skips gitignored files by default, and judging every directory search would deny ordinary work.
- The source plugin's rule that refused every file outside the project root. It blocked unrelated reads, and the dotenv rule here matches by file name wherever the file sits, so it no longer needs that rule to catch `../other/.env`.
- The `.envsitter/pepper` file. The source branch committed its pepper, and this port never reads a pepper from disk.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs` | Create | The shared policy and the value-free inspection functions |
| `.skilled/hooks/env-secret-guard/cli/env-secret.cjs` | Create | The `keys`, `validate` and `fingerprint` CLI |
| `.skilled/hooks/env-secret-guard/command-hook/env-secret-guard.cjs` | Create | Command hook for Claude Code, Codex, Cursor and Devin |
| `.skilled/hooks/env-secret-guard/pi/env-secret-guard.ts` | Create | Pi extension, linked from `.pi/extensions/` |
| `.skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs` | Create | DSH adapter, linked into `.dsh/plugins/repo-guards/adapters/` |
| `.opencode/plugins/env-secret-guard.js` | Create | OpenCode guard hook and the three inspection tools |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | One registry entry, rendered into the four JSON hook configs |
| `.dsh/plugins/repo-guards/index.mjs` | Modify | Register the DSH adapter |
| Test files beside each adapter, plus the hooks and plugins READMEs | Create, Modify | Coverage and inventory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On every runtime, a read, write, edit, delete or grep tool call is denied when a target path's base name is `.env` or starts with `.env.`, except `.env.example`. A symlink whose real target is such a file is denied too. |
| REQ-002 | A patch tool call is denied when any `*** Add File:`, `*** Update File:`, `*** Delete File:`, `*** Move to:`, `---` or `+++` header names a dotenv file. |
| REQ-003 | A shell call is denied when a reading program such as `cat`, `grep` or `cp` is given a dotenv file, or a redirection reads from or writes to one, including Codex's argv form `['bash', '-lc', '<script>']`. |
| REQ-009 | No tool result, CLI output or deny message contains a dotenv value. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `env_secret_list_keys` and the CLI's `keys` action return the keys and a validity flag for a dotenv file inside the project. |
| REQ-005 | `env_secret_validate` and `validate` return the line numbers that fail to parse. |
| REQ-006 | `env_secret_fingerprint` and `fingerprint` return the HMAC-SHA256 hex digest of one key's value under `ENV_SECRET_GUARD_PEPPER`, and refuse when the pepper is unset. |
| REQ-007 | All inspection paths refuse a path outside the project or a file that is not a dotenv file. |
| REQ-008 | `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` turns the guard and the tools off on every runtime. |
| REQ-010 | The four generated hook configs match the registry (`sync-hook-registrations.cjs --check` passes) and every mirror link resolves (`sync-runtime-mirrors.cjs --check` passes). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The core, command-hook, Pi, CLI, DSH and OpenCode test files all pass, with cases for every P0 and P1 requirement.
- **SC-002**: `node --test .opencode/plugins/tests/` passes with the same failures, if any, as on `main` before this change.
- **SC-003**: Both runtime-mirror sync checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `lib/v2-bridge.js` maps `tool.execute.before` and `tool` onto OpenCode 2 | Without it the plugin works on OpenCode 1 only | The v2 registration suite discovers new plugin files on its own and checks the dual export |
| Risk | A runtime names its read tool or its path field differently than assumed | High: the guard is a silent no-op there | Match path fields by name pattern at any depth, test each runtime's payload shape, and have an independent reviewer check each surface |
| Risk | The shell rule denies ordinary work | Med: friction | Only reading programs and redirections count, so running an app with `--env-file=.env` passes, and the tests pin both lists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The guard does no file I/O for a call whose paths have no dotenv base name, apart from one `realpath` per existing path.

### Security
- **NFR-S01**: The pepper comes only from the environment. Nothing the plugin writes or returns contains the pepper or a dotenv value.

### Reliability
- **NFR-R01**: A tool that cannot read its file returns a fixed refusal string and never throws.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a call with no path arguments passes, and an unreadable hook payload passes, because a guard bug must never stop an agent.
- Maximum input: a patch naming many files is denied if any one of them is a dotenv file.
- Failure path: a denied call carries `env-secret-guard: <path> is a dotenv file and its values must not reach the model`, followed by the value-free way to inspect it on that runtime.
- Name lookalikes: `.envrc`, `.environment` and `env.example` are not dotenv files and pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One core, five adapters, the CLI, the registry and generated configs |
| Risk | 14/25 | A security guard on every file and shell call on seven runtimes |
| Research | 8/20 | Source plugin exists. Checked the bridge, OpenCode's defaults and each runtime's hook contract |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
