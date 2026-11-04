---
title: "Implementation Plan: Phase 10: sk-prompt"
description: "Audit, fix and re-review the in-scope docs, then prove them with the scope gate."
trigger_phrases:
  - "sk prompt plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: sk-prompt

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc templates and render checks |
| **Storage** | None |
| **Testing** | `scope-gate.py`, Luna review rounds |

### Overview
`run-leaf.sh` lists the scope, records the gate, sends Luna each chunk of up to eight files, hands the findings to DeepSeek, and loops Luna's diff review until it passes or three rounds end.
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
- [x] `python3 -I specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/scope.txt` prints `render_warnings=0 invalid=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-family review loop: one model reads, another writes, the first re-reads.

### Key Components
- **Luna 6 xhigh fast (`cli-codex`, read-only)**: writes `scratch/findings*.md` and `scratch/review-N.md`
- **DeepSeek V4.1 Flash high (`cli-pi`, DevPass)**: applies the findings, logs `scratch/fix-N.log`

### Data Flow
`scope.txt` to Luna audit to `findings.md` to DeepSeek fix to `diff-N.patch` to Luna review, repeated until `VERDICT: PASS`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

