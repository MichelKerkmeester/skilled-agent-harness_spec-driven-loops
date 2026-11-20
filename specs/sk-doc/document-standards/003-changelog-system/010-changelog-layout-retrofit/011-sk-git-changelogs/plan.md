---
title: "Implementation Plan: Phase 11: sk-git-changelogs"
description: "Run the phase 001 driver on the 54 sk-git changelogs and keep only drafts that pass every gate."
trigger_phrases:
  - "sk git changelogs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: sk-git-changelogs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js for the driver, Python 3 for the checks |
| **Framework** | None |
| **Storage** | `../scratch/state.jsonl`, one JSON row per dispatch |
| **Testing** | `check_changelog_shape.py`, `hvr_scan.py` and the driver's fact lock |

### Overview
The driver from phase 001 rewrites each of the 54 sk-git changelogs with Hy4 Flash Free at high thinking. A draft stays only after it passes the fact lock, the shape check and the voice scan. Anything else is restored.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 has passed its pilot
- [ ] `wc -l < ../scratch/lists/011.txt` prints 54
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The driver state shows 54 files in `pass` or `unchanged`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one worker dispatch per file behind a gate script

### Key Components
- **`../scratch/rewrite-driver.cjs`**: dispatches the writer, runs every gate and restores a failed file
- **`../scratch/brief-rewrite.md`**: tells the writer to reshape the layout and keep every fact

### Data Flow
The driver reads the list, saves each original, sends the brief, writes the reply, runs the gates and keeps the draft or restores the original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the list and the driver. Implementation runs the driver on the list, then reruns the restored files once. Verification rechecks every file and validates this phase. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The driver reruns every gate on each draft. After the run, `../scratch/wave-verify.cjs ../scratch/lists/011.txt` reruns them on the files as they sit on disk.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`opencode` with the opencode-go route, and `devin` for the fallback. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a rewrite reads wrong after it lands. Revert this phase's commit, which holds only the files in `../scratch/lists/011.txt`.
<!-- /ANCHOR:rollback -->

---
