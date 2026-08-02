---
title: "Repository Scripts"
description: "Repository maintenance scripts for session cleanup, orphan-process review, Git hooks, distribution data and Node test discovery."
trigger_phrases:
  - "repository scripts"
  - "Git hook scripts"
  - "session cleanup scripts"
---

# Repository Scripts

---

## 1. OVERVIEW

`.opencode/scripts/` owns repository-level scripts for local operators and automated workflows. The direct entrypoints cover session cleanup, orphan-process review, Git-hook installation, Skill Advisor distribution data and Node test discovery.

## 2. CONTENTS

| Entry | Responsibility |
|---|---|
| `claude-session-cleanup.sh` | Compatibility entrypoint for Claude session cleanup. |
| `copy-skill-advisor-dist-data.sh` | Copies required advisor data into compiled output. |
| `install-git-hooks.sh` | Installs repository-managed Git hooks. |
| `orphan-mcp-sweeper.sh` | Reviews or cleans stale MCP helpers with dry-run support. |
| `run-node-tests.mjs` | Discovers and runs the repository's Node test files. |
| `session-cleanup.sh` | Cleans session-scoped MCP helper descendants. |
| `git-hooks/` | Contains hook entrypoints, shared helpers and harnesses. |
| `launchagents/` | Contains the macOS LaunchAgent template for orphan-process checks. |

## 3. BOUNDARIES

- Prefer session-scoped cleanup over global process selection.
- Review dry-run output before enabling live orphan cleanup.
- Change Git-hook behavior in `git-hooks/` and install it through `install-git-hooks.sh`.
- Use `copy-skill-advisor-dist-data.sh` for generated advisor data.

## 4. VALIDATION

Run shell syntax and plist checks from the repository root:

```bash
bash -n .opencode/scripts/claude-session-cleanup.sh
bash -n .opencode/scripts/copy-skill-advisor-dist-data.sh
bash -n .opencode/scripts/install-git-hooks.sh
bash -n .opencode/scripts/orphan-mcp-sweeper.sh
bash -n .opencode/scripts/session-cleanup.sh
plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist
```

Review the orphan sweeper without changing processes:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose
```

## 5. RELATED

- [`Git hooks`](./git-hooks/README.md)
- [`Git-hook libraries`](./git-hooks/lib/README.md)
- [`Git-hook tests`](./git-hooks/tests/README.md)
- [`LaunchAgent template`](./launchagents/README.md)
