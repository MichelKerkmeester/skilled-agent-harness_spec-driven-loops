---
title: "Implementation Plan: Phase 57: Continuity reader vocabulary and flow lists"
description: "Teach the thin continuity reader the flow-list syntax and the opening words hand-written blocks use, without accepting a first word that says nothing about the next step."
trigger_phrases:
  - "continuity reader plan"
  - "flow list parsing plan"
  - "next action verb list"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 57: Continuity reader vocabulary and flow lists

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node |
| **Framework** | None. A library module inside the spec-kit runtime |
| **Storage** | Frontmatter in `implementation-summary.md` files |
| **Testing** | Vitest, `root` project |

### Overview
The reader's YAML subset handled block lists but not flow lists, and its first-word rule compared the raw first token against a short list. The fix adds a small flow-list parser behind the existing scalar parser, strips trailing punctuation from the first token, and widens the list to the words real blocks open with.
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
Extend in place, inside `thin-continuity-record.ts`.

### Key Components
- **`parseFlowSequence`**: splits a one-level bracketed list on commas outside quotes, and returns null for anything it cannot read with certainty, so the caller keeps the raw text.
- **`NEXT_ACTION_VERBS`**: the allowed first words, now 62.
- **First-token check**: trailing punctuation is removed before the lookup.

### Data Flow
`readThinContinuityRecord` parses the frontmatter through `parseYamlScalar`, which now hands bracketed values to `parseFlowSequence`; validation then checks each field, including the first word of `next_safe_action`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

New tests build hand-written blocks and check the flow lists, the accepted opening words and the still-rejected ones. Run against the previous reader, 6 of them fail, which is the negative control. A scan of every tracked summary measures the effect on real blocks.

### Deviation from the planner
The planner named 13 words to add. This phase adds 21: those 13 plus 8 more imperatives that each open at least 10 real blocks. Leaving them out would have kept rejecting blocks whose next action is clear.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The compiled runtime (`npm run build` in the skill) must be rebuilt, because the CLI imports the reader from `dist`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit and rebuild the runtime.
<!-- /ANCHOR:rollback -->

---
