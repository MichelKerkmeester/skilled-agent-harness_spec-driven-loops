---
title: "Implementation Plan: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent"
description: "Extend the existing bash orphan sweeper with a temp-path orphan class and a macOS ancestor fix, cover it with a vitest harness that sources the script, and install the LaunchAgent live after a dry run on this machine."
trigger_phrases:
  - "orphan sweep temp processes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Orphan sweeper: reap abandoned temp and scratch processes and install the LaunchAgent

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (macOS `/bin/bash`), TypeScript tests |
| **Framework** | launchd LaunchAgent |
| **Storage** | None |
| **Testing** | vitest, shellcheck |

### Overview
One script, `.skilled/scripts/orphan-mcp-sweeper.sh`, gains a `temp-path-orphan` class and a macOS `pgrep -a` fix for its session tree. A new vitest file sources the script and checks the class verdicts. A dry run on the live process list gates the LaunchAgent install.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run orphan-sweeper launcher-stop-hook-orphan-sweep` prints all files passed; `shellcheck -S warning` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script extension

### Key Components
- **`orphan-mcp-sweeper.sh`**: scans processes, classifies, applies preserve rules, signals TERM then KILL.
- **LaunchAgent `com.michelkerkmeester.orphan-sweep`**: runs the sweeper every 600 seconds at low priority.

### Data Flow
`ps -axo` rows → `classify_command`, else `is_temp_path_orphan` → `preserve_reason` → `terminate_candidates`, which rechecks the class with `current_class_of` before each signal.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run orphan-sweeper launcher-stop-hook-orphan-sweep` from `.skilled/skills/system-spec-kit/runtime` must pass every file, and a `--dry-run --verbose` run from inside a session must show `reason=live-session-tree` for that session's MCP helpers.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash`, `pgrep`, `ps`, `lsof`, `getconf`, `launchctl`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the live agent kills a process that was in use. Run `launchctl bootout gui/$(id -u)/com.michelkerkmeester.orphan-sweep` and delete `~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist`; revert the script commit if the class itself is wrong. Every kill is logged in `~/.local/share/orphan-sweeper.log`.
<!-- /ANCHOR:rollback -->

---
