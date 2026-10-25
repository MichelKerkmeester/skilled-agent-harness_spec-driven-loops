---
title: "Implementation Plan: Phase 66: opencode-v2-default-name"
description: "Swap the two names on this machine with backups first, then rebuild the setup helper's both mode and the install reference to match. v2 keeps the opencode and opencode2 names through symlinks, and v1 gets an opencode1 launcher that sets OPENCODE_DB to its own copy of the database."
trigger_phrases:
  - "opencode v2 default name plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 66: opencode-v2-default-name

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, POSIX sh, Node.js (node:test) |
| **Framework** | None |
| **Storage** | SQLite session databases under `~/.local/share/opencode` |
| **Testing** | node:test, shellcheck, live dispatch |

### Overview
Swap the names on this machine first, with backups taken before anything moves, and prove each version with a live run. Then rebuild the setup helper so `both` produces the same layout, and rewrite the install reference to describe it.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two npm prefixes with names wired in `~/.local/bin`.

### Key Components
- **`~/.local/bin/opencode`, `opencode2`**: symlinks into the v2 prefix, so both names run v2 on `opencode.db`.
- **`~/.local/bin/opencode1`**: a `/bin/sh` launcher that sets `OPENCODE_DB=opencode-v1.db` and execs the v1 binary.
- **`opencode-setup.sh both`**: installs both packages, writes the two links after the v1 install, then the launcher.

### Data Flow
A run under `opencode` or `opencode2` opens `opencode.db`. A run under `opencode1` opens `opencode-v1.db`. Dispatch still resolves `opencode2` first, so it reaches v2 unchanged.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`opencode-setup-both.test.cjs` builds the earlier layout in a throwaway HOME with fake pinned packages, so npm installs nothing. It checks the new names, the launcher's database choice, an idempotent rerun, and a refusal when an aside copy already exists. A run against the previous helper is the negative control.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Machine: `cp -P ~/.local/share/opencode/pre-v2-default-20261024/opencode.symlink ~/.local/bin/opencode`, `cp -p .../opencode2.launcher ~/.local/bin/opencode2`, `rm ~/.local/bin/opencode1`. To undo v2's migration, stop every OpenCode process and copy `opencode.db`, `opencode.db-wal` and `opencode.db-shm` back from the same folder.
- Repo: revert the three files and this phase folder.
<!-- /ANCHOR:rollback -->

---
