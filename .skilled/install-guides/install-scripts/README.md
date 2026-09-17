---
title: "Component Install Scripts"
description: "Shell entrypoints for installing the repository's MCP components and related local tooling."
trigger_phrases:
  - "component install scripts"
  - "MCP installer scripts"
  - "install-all.sh"
---

# Component Install Scripts

---

## 1. OVERVIEW

`install-scripts/` owns the repository's shell entrypoints for installing and validating local MCP components. Regular scripts provide shared helpers and the aggregate installer. Symlinked entrypoints delegate to installers owned by their component skill.

---

## 2. CONTENTS

| File | Role | Availability |
|---|---|---|
| `_utils.sh` | Shared shell helpers for installer logging, prerequisites, JSON updates and verification. | Available |
| `install-all.sh` | Coordinates component installation with selection and dry-run options. | Available |
| `install-chrome-devtools.sh` | Symlink to the Chrome DevTools installer owned by `mcp-chrome-devtools`. | Available |
| `install-code-mode.sh` | Symlink to the Code Mode installer owned by `mcp-code-mode`. | Available |

---

## 3. USAGE

Run an installer from the repository root. Start with the component-specific help output before allowing a script to modify configuration.

```bash
bash .opencode/install-guides/install-scripts/install-all.sh --help
```

The component symlinks resolve to their owning skill directories.

---

## 4. VALIDATION

Check the installer shell syntax from the repository root:

```bash
for script in .opencode/install-guides/install-scripts/*.sh; do bash -n "$script"; done
```

The broken-symlink check is intentionally separate because a broken target cannot be validated by `bash -n`:

```bash
find .opencode/install-guides/install-scripts -type l ! -exec test -e {} \; -print
```

Expected result: the syntax loop exits successfully and the symlink check prints nothing.

---

## 5. RELATED

- [`install-guides README`](../README.md)
