---
title: "01-001: Install and Version Check"
---

# 01-001: Install and Version Check

**Goal:** Verify cupt is installed and returns a valid version string.

## Setup

- Fresh shell or shell without cupt in PATH

## Test Procedure

```bash
# 1. Check if cupt is available
which cupt

# 2. Get version
cupt --version

# 3. If not installed, run install script
bash .opencode/skills/mcp-click-up/scripts/install.sh --check-only
bash .opencode/skills/mcp-click-up/scripts/install.sh
cupt --version
```

## Expected Output

```
cupt 0.7.1
```
(or newer version)

## Failure Diagnosis

- `command not found: cupt` → Run install.sh, check PATH
- Version below 0.7.0 → `pipx upgrade cupt`
- `ModuleNotFoundError` → Python env issue, reinstall via pipx
