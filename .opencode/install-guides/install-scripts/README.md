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

`install-scripts/` owns the repository's shell entrypoints for installing and validating local MCP components. Regular scripts provide shared helpers, the aggregate installer and the Sequential Thinking installer. Symlinked entrypoints delegate to installers owned by their component skill.

The Chrome DevTools entrypoint is currently unavailable because its symlink target is absent. It is not part of the available installer surface.

## 2. CONTENTS

| File | Role | Availability |
|---|---|---|
| `_utils.sh` | Shared shell helpers for installer logging, prerequisites, JSON updates and verification. | Available |
| `install-all.sh` | Coordinates component installation with selection and dry-run options. | Available |
| `install-sequential-thinking.sh` | Installs the Sequential Thinking component. | Available |
| `install-code-mode.sh` | Symlink to the Code Mode installer owned by `mcp-code-mode`. | Available |
| `install-spec-kit-memory.sh` | Symlink to the Spec Kit Memory installer owned by `system-spec-kit`. | Available |

The unavailable symlink is recorded here for diagnosis only:

```text example
install-chrome-devtools.sh -> ../../skills/mcp-chrome-devtools/scripts/install.sh
```

## 3. USAGE

Run an available installer from the repository root. Start with the component-specific help output before allowing a script to modify configuration.

```bash
bash .opencode/install-guides/install-scripts/install-all.sh --help
```

The component symlinks resolve to their owning skill directories. Do not treat the unavailable Chrome DevTools symlink as an install command.

## 4. VALIDATION

Check the installer shell syntax from the repository root:

```bash
for script in .opencode/install-guides/install-scripts/*.sh; do bash -n "$script"; done
```

The broken-symlink check is intentionally separate because a broken target cannot be validated by `bash -n`:

```bash
find .opencode/install-guides/install-scripts -type l ! -exec test -e {} \; -print
```

Expected result: the syntax loop exits successfully. The symlink check reports the unavailable Chrome DevTools entrypoint until its owning installer is restored.

## 5. RELATED

- [`install-guides README`](../README.md)
