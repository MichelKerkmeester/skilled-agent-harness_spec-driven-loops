---
title: "Implementation Plan: Phase 68: retire-opencode2-name"
description: "Remove the opencode2 link on this machine, make the helper retire it, rewrite the documented v2 commands to opencode with a pattern that matches only command uses, and classify models listings by their flags so the doc test survives the rename."
trigger_phrases:
  - "retire opencode2 name plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 68: retire-opencode2-name

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, POSIX sh, Node.js (node:test), Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, vitest, shellcheck |

### Overview
The machine change comes first, then the helper and its test, then a pattern-based rewrite of `opencode2 <subcommand>` in the docs with the remaining mentions triaged by hand.
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
Name wiring in `~/.local/bin`.

### Key Components
- **`retire_opencode2`**: removes an `opencode2` link into the v2 prefix and moves any other file there aside.
- **`opencode1` launcher**: sets `OPENCODE_DB=opencode-v1.db` and `OPENCODE_DISABLE_AUTOUPDATE=1`.

### Data Flow
N/A.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The helper test covers the retirement of a launcher file and of a v2 link, the launcher's two variables and an idempotent rerun. The models-form test scans every cli doc, so it checks the rewrite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Machine: `ln -s ../opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe ~/.local/bin/opencode2`. Repo: revert the commit.
<!-- /ANCHOR:rollback -->

---
