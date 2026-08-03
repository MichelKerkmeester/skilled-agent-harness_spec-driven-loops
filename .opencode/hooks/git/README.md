---
title: "Git Hooks"
description: "Version-controlled Git hooks and the opt-in installer that places the pre-commit hook into the active repository hook directory."
trigger_phrases:
  - "git hooks"
  - "pre-commit hook"
  - "install git hooks"
---

# Git Hooks

---

## 1. OVERVIEW

`.opencode/hooks/git/` contains the version-controlled Git hook surface. `install-hooks.sh` creates the active hook link and `pre-commit` runs the repository's staged-file checks.

The hook is opt-in. A clone does nothing until the installer is run.

## 2. CONTENTS

| File | Role |
|---|---|
| `install-hooks.sh` | Installs the repository-managed hook into Git's resolved hooks directory. |
| `pre-commit` | Runs comment-hygiene and agent-mirror checks for staged changes. |

## 3. CONTROL FLOW

```text
install-hooks.sh
   └─ links pre-commit into Git's active hooks directory

git commit
   └─ pre-commit
        ├─ comment-hygiene check for staged files
        └─ agent-mirror check when agent files are staged
```

The hook resolves its checkers from the repository root. Missing tooling is fail-open, so absent optional infrastructure produces a warning rather than blocking a commit.

## 4. INSTALLATION

Run the installer from the repository root:

```bash
bash .opencode/hooks/git/install-hooks.sh
```

## 5. RELATED

- [`Comment-hygiene checker`](../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh)
- [`Universal code style guide`](../../skills/sk-code/shared/references/universal/code-style-guide.md)
