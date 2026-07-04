---
title: "Git Hooks"
description: "Repo-tracked git hooks and their installer. Currently the comment-hygiene pre-commit gate that blocks ephemeral-artifact pointers in code comments."
trigger_phrases:
  - "git hooks"
  - "pre-commit hook"
  - "comment hygiene gate"
  - "install git hooks"
---

# Git Hooks

> Version-controlled git hooks plus a one-line installer. Hooks are opt-in: nothing runs until `install-hooks.sh` symlinks them into `.git/hooks/`.

---

## 1. OVERVIEW

`.opencode/hooks/` holds the repository's version-controlled git hooks and the script that installs them. Git only runs hooks from the local, untracked `.git/hooks/` directory, so these files live here under version control and `install-hooks.sh` symlinks them into place.

Today the only hook is `pre-commit`, the comment-hygiene gate. It blocks any commit that adds ephemeral-artifact pointers (spec-folder paths, packet/phase numbers, ADR/REQ/CHK/task/finding ids) to **code comments**, enforcing the durable-WHY rule from the code style guide.

---

## 2. FILES

| File | Role |
|---|---|
| `install-hooks.sh` | Symlinks `pre-commit` into `.git/hooks/pre-commit`. Run once per clone. |
| `pre-commit` | Comment-hygiene gate. Runs the checker on every staged file; exits non-zero (blocking the commit) when a code file carries a forbidden comment artifact. |

---

## 3. HOW IT WORKS

```text
install-hooks.sh
   └─ ln -sf .opencode/hooks/pre-commit  .git/hooks/pre-commit

git commit
   └─ .git/hooks/pre-commit
        ├─ for each staged file (git diff --cached --diff-filter=ACM)
        │     └─ run .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh <file>
        ├─ if any file returns rc=1  → print BLOCKED + count → exit 1 (commit aborted)
        └─ else                       → exit 0 (commit proceeds)
```

- The checker is resolved relative to the repo root. If it is missing or not executable, the hook prints a warning and exits 0 — fail-open, so missing infrastructure never blocks a commit.
- **Escape hatch:** add `// hygiene-ok` to a specific line to exempt it when a flagged token is legitimately durable (for example a stable standard reference like a CWE or RFC id).

---

## 4. INSTALL

From the repository root, once per clone:

```bash
bash .opencode/hooks/install-hooks.sh
# Installed: pre-commit → .git/hooks/pre-commit
```

The hook is a symlink, so later edits to `.opencode/hooks/pre-commit` take effect immediately with no reinstall.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Opt-in | Hooks do nothing until `install-hooks.sh` runs. A fresh clone has no active hook. |
| Scope | `pre-commit` checks comment hygiene only. It does not run tests, linting, or formatting. |
| Fail-open | If the hygiene checker is absent or non-executable, the hook exits 0 — it never blocks on its own tooling being missing. |
| Bypass | `git commit --no-verify` skips the hook; prefer fixing the comment or using `// hygiene-ok` for a genuinely durable reference. |

---

## 6. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/hooks/README.md
```

---

## 7. RELATED

- [`../skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`](../skills/sk-code/code-quality/scripts/check-comment-hygiene.sh) — the checker the hook invokes per staged file.
- [`../skills/sk-code/shared/references/universal/code_style_guide.md`](../skills/sk-code/shared/references/universal/code_style_guide.md) — §4, the comment-hygiene rule this gate enforces.
