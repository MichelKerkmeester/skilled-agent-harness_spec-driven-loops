---
title: "Scripts: Maintainer Git Filters"
description: "One-shot installer for the per-clone git clean/smudge filters that keep maintainer-mode code-graph flags local-only in config files."
trigger_phrases:
  - "maintainer filters"
  - "clean smudge filter"
  - "setup-maintainer-filters"
---

# Scripts: Maintainer Git Filters

> Installs per-clone git clean/smudge filters that keep maintainer-mode code-graph flags local-only.

---

## 1. OVERVIEW

`scripts/` currently owns one script: `setup-maintainer-filters.sh`. It registers two git content filters in the clone-local `.git/config` so the maintainer-mode code-graph flags (`SPECKIT_CODE_GRAPH_INDEX_*`) stay `"true"` in the working tree while every commit and push carries `"false"`, the framework default.

Current state:

- Single idempotent installer, safe to re-run.
- Filters live in `.git/config`, which is per-clone and never committed, so each maintainer runs the script once per machine.
- The filter is registered as `required`, so a missing or failing filter fails loudly instead of letting an unfiltered file through.


---

## 2. ARCHITECTURE

```text
working tree                     index / commit                  remote
SPECKIT_CODE_GRAPH_INDEX_*       SPECKIT_CODE_GRAPH_INDEX_*       SPECKIT_CODE_GRAPH_INDEX_*
= "true"        ── clean ──▶     = "false"    ── push ──▶         = "false"
     ▲
     └──────────────────────── smudge ────────────────────────
                       (checkout, pull, clone)
```

The clean filter rewrites `"true"` to `"false"` when content moves into the index. The smudge filter rewrites `"false"` back to `"true"` when content moves into the working tree. Both are single sed expressions with a format-agnostic pattern that matches JSON (`"KEY": "true"`) and TOML (`KEY = "true"`) spellings, and both are reentry-safe: a file that already holds the target value is left unchanged.


---

## 3. DIRECTORY TREE

```text
scripts/
+-- setup-maintainer-filters.sh   # Installs the clean/smudge filter pair
`-- README.md
```


---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `setup-maintainer-filters.sh` | Resolves the repo root, registers `filter.maintainer-flags.clean`, `filter.maintainer-flags.smudge` and `filter.maintainer-flags.required` in `.git/config`, then prints rehydrate and verify instructions |


---

## 5. FLOW

```text
run script (any cwd)
        │
        ▼
resolve repo root from script location
        │
        ▼
.git present? ── no ──▶ error to stderr, exit 1
        │
        ▼ yes
git config filter.maintainer-flags.clean    (sed: "true" -> "false")
git config filter.maintainer-flags.smudge   (sed: "false" -> "true")
git config filter.maintainer-flags.required true
        │
        ▼
print rehydrate commands and verify instructions
```

Guards: `set -euo pipefail` stops the script on any failed command or unset variable. The filter only rewrites the five flag keys (`SKILLS`, `AGENTS`, `COMMANDS`, `SPECS`, `PLUGINS`); files that do not contain those keys are left untouched.


---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `setup-maintainer-filters.sh` | Script | Run once per clone to install the filters |

Run from any directory; the script locates the repo root itself:

```bash
bash scripts/setup-maintainer-filters.sh
```

Filters only take effect on content that is re-filtered. After installing, rehydrate the tracked config files through the smudge filter:

```bash
git rm --cached opencode.json .claude/mcp.json .vscode/mcp.json .codex/config.toml
git checkout -- opencode.json .claude/mcp.json .vscode/mcp.json .codex/config.toml
```


---

## 7. VALIDATION

Run from the repository root.

Syntax check:

```bash
bash -n scripts/setup-maintainer-filters.sh
```

Expected result: no output, exit code 0.

Filter registration:

```bash
git config --get filter.maintainer-flags.required
```

Expected result: `true`.

Local versus committed flags, for each config file that carries the keys:

```bash
grep SPECKIT_CODE_GRAPH_INDEX_SKILLS opencode.json
git show HEAD:opencode.json | grep SPECKIT_CODE_GRAPH_INDEX_SKILLS
```

Expected result: the working tree shows `"true"`, the committed version shows `"false"`.


---

## 8. RELATED

- [`../README.md`](../README.md) repository overview
- [`../.opencode/skills/sk-git/references/config-content-filters.md`](../.opencode/skills/sk-git/references/config-content-filters.md) git content-filter reference
