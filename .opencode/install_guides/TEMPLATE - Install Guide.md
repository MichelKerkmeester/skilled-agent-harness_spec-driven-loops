---
title: "TEMPLATE - Install Guide"
description: "Reusable phase-based install guide template with validation checkpoints and troubleshooting blocks."
trigger_phrases:
  - "install guide template"
  - "setup template"
  - "mcp install template"
  - "tool installation guide"
importance_tier: "normal"
---

# TEMPLATE - Install Guide

> Reusable template for new installation guides in `.opencode/install_guides/`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PREREQUISITES](#2--prerequisites)
- [3. INSTALLATION](#3--installation)
- [4. CONFIGURATION](#4--configuration)
- [5. VERIFICATION](#5--verification)
- [6. USAGE](#6--usage)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. RESOURCES](#8--resources)

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What this installs

`<tool name>` installs `<short purpose>`.

### Scope

- Platform: `<macOS/Linux/Windows WSL>`
- Estimated time: `<X minutes>`
- Difficulty: `<Beginner/Intermediate/Advanced>`

### AI-First Install Prompt

```text
Install <tool name> using .opencode/install_guides/<guide-file>.md.

My environment:
- Platform: <platform>
- Shell: <zsh/bash/fish/powershell>
- Install mode: <fresh/update/repair>

Start with prerequisites and stop at each phase validation checkpoint.
```
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:prerequisites -->
## 2. PREREQUISITES

- [ ] `<dependency 1>` installed (`<check command>`)
- [ ] `<dependency 2>` installed (`<check command>`)
- [ ] `<permission or access requirement>`

### Validation: `phase_1_complete`

```bash
# Replace with actual prerequisite checks
<check-command-1>
<check-command-2>
```

**Checklist:**
- [ ] All prerequisite commands return success
- [ ] Required versions are met

❌ **STOP if validation fails** - fix prerequisites before continuing.
<!-- /ANCHOR:prerequisites -->

---

<!-- ANCHOR:installation -->
## 3. INSTALLATION

### Step-by-step install

```bash
# 1) Install tool
<install-command>

# 2) Confirm binary is available
<binary-check-command>
```

### Validation: `phase_2_complete`

```bash
# Replace with actual install verification
<tool-binary> --version
```

**Checklist:**
- [ ] Binary/command is available in PATH
- [ ] Expected version is returned

❌ **STOP if validation fails** - review install output and PATH configuration.
<!-- /ANCHOR:installation -->

---

<!-- ANCHOR:configuration -->
## 4. CONFIGURATION

### OpenCode configuration (`opencode.json`)

```json
{
  "mcp": {
    "<tool-id>": {
      "type": "local",
      "command": ["/path/to/<binary>"],
      "environment": {
        "_NOTE_TOOLS": "<what this tool provides>"
      },
      "enabled": true
    }
  }
}
```

### Optional environment variables

```bash
export <ENV_VAR_NAME>=<value>
```

### Validation: `phase_3_complete`

```bash
# Replace with actual config checks
<config-check-command>
```

**Checklist:**
- [ ] Config file parses correctly
- [ ] Required environment variables are set

❌ **STOP if validation fails** - fix configuration before proceeding.
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

### End-to-end verification

```bash
# Replace with an end-to-end verification command
<verification-command>
```

Expected result: `<success signal>`

### Validation: `phase_4_complete`

**Checklist:**
- [ ] Tool starts/responds without errors
- [ ] At least one real operation succeeds

❌ **STOP if validation fails** - use troubleshooting section below.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:usage -->
## 6. USAGE

### Common commands

| Command | Purpose |
|---------|---------|
| `<command 1>` | `<what it does>` |
| `<command 2>` | `<what it does>` |
| `<command 3>` | `<what it does>` |

### Typical workflow

1. `<daily step 1>`
2. `<daily step 2>`
3. `<daily step 3>`
<!-- /ANCHOR:usage -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| Error | Cause | Fix |
|-------|-------|-----|
| `<error message>` | `<likely cause>` | `<specific fix command or action>` |
| `<error message>` | `<likely cause>` | `<specific fix command or action>` |
| `<error message>` | `<likely cause>` | `<specific fix command or action>` |

If unresolved, capture logs and rerun from **Phase 1**.
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:resources -->
## 8. RESOURCES

- Guide file path: `.opencode/install_guides/<guide-file>.md`
- Related script path: `.opencode/install_guides/install_scripts/<script>.sh`
- Install guide standards:
  - `.opencode/skill/sk-documentation/references/install_guide_standards.md`
  - `.opencode/skill/sk-documentation/assets/documentation/install_guide_template.md`
<!-- /ANCHOR:resources -->
