---
title: "Git Hooks"
description: "Repo-tracked git hooks and their installer. The pre-commit hook runs two independent gates: a comment-hygiene gate that blocks ephemeral-artifact pointers in code comments, and a staged agent-mirror-sync gate that blocks commits which desync the .opencode / .claude agent mirrors."
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

Today the only hook is `pre-commit`, which runs two independent gates. The **comment-hygiene gate** blocks any commit that adds ephemeral-artifact pointers (spec-folder paths, packet/phase numbers, ADR/REQ/CHK/task/finding ids) to **code comments**, enforcing the durable-WHY rule from the code style guide. The **agent-mirror-sync gate** fires only when the commit stages files under `.opencode/agents/` or `.claude/agents/`, and blocks a commit that would desync the two agent mirrors. Both gates fail open if their tooling is missing.

---

## 2. FILES

| File | Role |
|---|---|
| `install-hooks.sh` | Symlinks `pre-commit` into `.git/hooks/pre-commit`. Run once per clone. |
| `pre-commit` | Two independent gates. (1) **Comment hygiene** — runs the checker on every staged file and blocks the commit when a code file carries a forbidden comment artifact. (2) **Agent mirror-sync** — when staged files include `.opencode/`/`.claude/` agent files, runs the mirror-sync checker on them and blocks a commit that desyncs the mirrors. Each gate fails open if its own tooling is missing. |

---

## 3. HOW IT WORKS

```text
install-hooks.sh
   └─ ln -sf .opencode/hooks/pre-commit  .git/hooks/pre-commit

git commit
   └─ .git/hooks/pre-commit
        ├─ Gate A · comment hygiene
        │    ├─ for each staged file (git diff --cached --diff-filter=ACM)
        │    │     └─ run .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh <file>
        │    ├─ any file returns rc=1     → print BLOCKED + count → exit 1 (commit aborted)
        │    └─ checker missing/non-exec  → warn → skip gate (fail-open)
        │
        ├─ Gate B · agent mirror-sync (only when agent files are staged)
        │    ├─ staged agent files = git diff --cached --diff-filter=ACMD
        │    │                        filtered to ^\.(opencode|claude)/agents/
        │    ├─ none staged               → skip gate (most commits)
        │    └─ else run .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
        │          ├─ mirrors desynced       → print BLOCKED → exit 1 (commit aborted)
        │          └─ node/checker missing   → warn → skip gate (fail-open)
        │
        └─ neither gate blocked          → exit 0 (commit proceeds)
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
| Scope | `pre-commit` runs two gates — comment hygiene and staged agent-mirror-sync. It does not run tests, linting, or formatting. |
| Fail-open | Each gate exits 0 when its own tooling is missing — the hygiene checker absent or non-executable, or `node` / the mirror-sync checker unavailable. Neither gate blocks on missing infrastructure. |
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
