---
title: "Implementation Plan: Retire three low-value reply rules and fold their unique clauses into the surviving rules"
description: "Retire three reply rules in the order the retire workflow sets, fold their unique clauses into two surviving rules, then repoint the scripts, tests, manifest and docs that named them."
trigger_phrases:
  - "reply rule pruning plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Retire three low-value reply rules and fold their unique clauses into the surviving rules

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown rule files, Python 3 scripts, Node.js checkers |
| **Framework** | The `sk-create-repo-rule` retire workflow |
| **Storage** | None |
| **Testing** | `check-repo-rules.cjs`, pytest, `node --test`, `agents-md-manifest.cjs --check` |

### Overview
The merged content is written into `communication.md` and `uncertainty-and-honesty.md` first, so no clause is ever without a home. The three files then retire pointer first and file last. The scripts, tests, manifest and counting docs are repointed after the corpus gate passes.
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
- [x] `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a trigger-loaded rule corpus behind one router.

### Key Components
- **`AGENTS.md` Gate 6**: names the reply rules a session loads before a reply.
- **`REPO RULES.md`**: the trigger and index rows that make a rule loadable and browsable.
- **`check-repo-rules.cjs`**: the corpus gate that proves files, rows, links and phrases agree.

### Data Flow
Gate 6 and the router's trigger row name a rule file, the session reads it, and the compliance script later reads transcripts to see whether the file arrived and whether replies kept its bans.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the corpus checker and pytest baselines. Implementation merges the clauses, retires the three files and repoints what named them. Verification reruns the corpus checker, the pytest suites, the doctor suites and the manifest check from the final state.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — the verification tasks in `tasks.md` cover it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — no dependency beyond the components named in the architecture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing is committed. `git restore --staged --worktree` on the paths in the spec's file table brings back the three rule files and every edit, and `rm -r` on this packet folder removes the packet.
<!-- /ANCHOR:rollback -->

---
