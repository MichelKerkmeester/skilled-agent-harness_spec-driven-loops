---
title: "Implementation Plan: Phase 10: align-cli-classifier"
description: "Run an operator-local alignment check over the cli-classifier files changed since base 6a9946a800: four read-only review lanes, routing probes and a critic, then a fix lane for the upheld findings that do not change routing, a router-prose pass and a full recheck."
trigger_phrases:
  - "align cli classifier plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: align-cli-classifier

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON skill docs; Python and Node checks |
| **Framework** | None |
| **Storage** | None; run evidence stays in the run folder outside the checkout |
| **Testing** | The check battery, the advisor routing probes, `package_skill.py`, `validate_document.py`, `check-markdown-links.cjs` |

### Overview
The check reads the cli-classifier files changed since base `6a9946a800` and reviews them in four read-only lanes. A fix lane applies the upheld findings that do not change routing, and a follow-up pass fixes the router prose the fix lane may not touch. A recheck reruns the full battery against the worktree.
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
- [x] The recheck battery reads `{"fail":3,"pass":56,"not_applicable":3}`, and each failure is classified
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: review, fix, recheck.

### Key Components
- **Review lanes**: four read-only lanes run by DeepSeek V4.1 Flash workers: code; skill docs; READMEs, changelogs and env; routing.
- **Critic**: overturns weak findings before any fix.
- **Fix lane**: a DeepSeek lane that applies the upheld findings that do not change routing.
- **Router-prose pass**: fixes router prose the fix lane was barred from.
- **Recheck**: reruns the full battery against the worktree.

### Data Flow
The scope step lists the changed files. The battery and the lanes read them and write findings. The critic filters the findings, the fix lane edits the docs, and the recheck reads the edited tree.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Battery | Every check that applies to the changed files | The check battery, first run and recheck |
| Routing | Probe prompts scored against the advisor | `skill-advisor.cjs advisor_recommend` |
| Docs | Package shape, document rules, links | `package_skill.py --check --strict`, `validate_document.py`, `check-markdown-links.cjs` |
| Router parse | All 54 skill routers against HEAD | The router-file resolver |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The router move in phases 004 and 005.
- The router-file resolver and the skill advisor.
- DeepSeek V4.1 Flash workers for the lanes and the fix lane.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix-lane edit is found to change routing, or a recheck failure is not derived.
- **Procedure**: restore that file from HEAD with `git checkout -- <path>`, after naming it to the operator, then rerun the router-file resolver and the battery.
<!-- /ANCHOR:rollback -->

---
