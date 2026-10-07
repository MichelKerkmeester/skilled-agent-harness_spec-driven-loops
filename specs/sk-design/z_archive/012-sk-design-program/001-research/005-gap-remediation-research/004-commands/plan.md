---
title: "Implementation Plan: /interface:* Commands as Literal Design Prompts"
description: "Reconstructed Level 2 implementation plan for the literal-prompt commands research child. It restates the spec.md research question and scope; the original plan was never written."
trigger_phrases:
  - "interface commands literal prompts research plan"
  - "interface command rewrite plan"
importance_tier: "important"
contextType: "research"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: /interface:* Commands as Literal Design Prompts (gap B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded — research-only child; no command files rewritten |
| **Framework** | Forced 5-iteration SOL deep-research synthesis (read-only) |
| **Storage** | `research/research.md` — the synthesis |
| **Testing** | Not recorded |

### Overview
Answer how the `/interface:*` commands should be rewritten to be literal, self-contained design prompts while preserving the researched authority split (commands own intake, modes own taste). Deliver concrete literal-prompt command bodies plus the runtime include/shared-fragment mechanism, reconciling literal-prompt richness with the anti-duplication contract. Research and recommend only — no command files are rewritten in this child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Gap B confirmed against the repo state in `../gap-analysis.md`
- [ ] The prior commands research (`../../002-research-design-commands/research/research.md`) available to ground the rewrite

### Definition of Done
- [ ] `research/research.md` delivered with the literal-prompt command bodies and the runtime include/shared-fragment mechanism
- [ ] No command files rewritten (research-only scope)
- [ ] Folder validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only deep-research synthesis. Literal prompt bodies are drafted against the researched authority split and the anti-duplication contract; nothing is executed.

### Key Components
- `spec.md` — the child charter (research question, scope, successor)
- `research/` — the deep-research artifact tree
- `research/research.md` — the forced 5-iteration SOL synthesis (the deliverable)

### Data Flow
The forced 5-iteration SOL loop reads the shipped thin routers, the shared creation-contract and the prior 20-iteration commands research, then synthesizes the literal-prompt bodies and include mechanism into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Setup
- [ ] Scaffold the child packet and its `research/` state tree

### Phase 2: Research
- [ ] Run the forced 5-iteration SOL deep-research on the literal-prompt commands question

### Phase 3: Synthesis + Verification
- [ ] Write the synthesis to `research/research.md`
- [ ] Validate the folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Not recorded — research-only child; verification beyond folder validation was not captured.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../gap-analysis.md` (gap B evidence) | Internal | Not recorded | No evidence-confirmed gap to research |
| `../../002-research-design-commands/research/research.md` | Internal | Not recorded | No prior 20-iteration commands research to build on |
| Shipped thin routers + shared creation-contract | Internal | Not recorded | No current command bodies to reconcile against |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — research-only child; nothing to roll back beyond discarding the synthesis draft.
<!-- /ANCHOR:rollback -->
