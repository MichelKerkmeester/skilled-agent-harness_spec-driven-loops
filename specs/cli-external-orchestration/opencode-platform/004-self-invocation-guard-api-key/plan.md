---
title: "Implementation Plan: Self-invocation guard ignores OPENCODE_API_KEY"
description: "Drop OPENCODE_API_KEY from the Layer 1 variable lookup in the shell and Python forms of the guard, restate the rule in every document that carries it, and prove the new line in six environments."
trigger_phrases:
  - "self invocation guard api key plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Self-invocation guard ignores OPENCODE_API_KEY

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documents with one shell line and one Python reference block |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The documented shell line run under `env -i`, `rg` sweeps and `validate_document.py` |

### Overview
The guard is a contract written in the cli-opencode skill, and the calling AI runs it. The change puts one `grep -v '^OPENCODE_API_KEY='` in front of the existing `grep -q '^OPENCODE_'` and one name comparison in the Python reference, then restates the rule in the eleven documents that describe Layer 1. The proof is the new line run in six environments and a sweep that finds no statement without the exemption.
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
- [x] `cat scratch/after.txt` shows `clear` for the key alone and for no variable, and `TRIPPED` for the four other environments
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documented contract edit

### Key Components
- **Layer 1 shell check**: the line in `SKILL.md` and `references/self-invocation-guard.md` that a caller runs before a dispatch.
- **Layer 1 Python reference**: the pseudocode in `references/self-invocation-guard.md` that states the same rule.

### Data Flow
The caller lists its environment, drops the line that starts with `OPENCODE_API_KEY=`, and refuses the dispatch when any other line starts with `OPENCODE_`. Layers 2 and 3 run after it as before.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup measures the old line with the key alone. Implementation edits the eleven documents. Verification runs the new line in six environments and sweeps the hub.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`env -i PATH=/usr/bin:/bin <variables> /bin/sh -c "env | grep -v '^OPENCODE_API_KEY=' | grep -q '^OPENCODE_' && echo TRIPPED || echo clear"` prints `clear` for the key alone and for no variable, and `TRIPPED` for the key with `OPENCODE_CONFIG_DIR`, for `OPENCODE_CONFIG_DIR` alone, for `OPENCODE_API_KEY_FILE` and for `OPENCODE_BIN`. No automated test exists for the guard, because no code runs it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`sh`, `grep`, `rg` and `python3`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a real OpenCode session passes all three layers. Revert the one commit that carries this packet, which restores the eleven documents.
<!-- /ANCHOR:rollback -->

---

