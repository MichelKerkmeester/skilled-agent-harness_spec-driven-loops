---
title: "Implementation Plan: The Devin swe alias already moved to SWE-2"
description: "Read the live CLI roster first, then correct the eight surfaces that describe it. Widen the advisor vocabulary rather than replacing it, because both SWE generations remain dispatchable, and let the pre-commit gate re-mint the serving manifest."
trigger_phrases:
  - "swe-2 cutover plan"
  - "devin roster verification approach"
  - "widen advisor vocabulary"
  - "compiled routing re-mint"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: The Devin swe alias already moved to SWE-2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instruction surfaces plus three JSON metadata files |
| **Framework** | The `cli-external-orchestration` parent hub, `cli-devin` mode |
| **Storage** | None. The advisor's serving manifest is re-minted, not hand-edited |
| **Testing** | `devin models list` as ground truth, `compiled-route-guard.cjs` for freshness, `validate.sh --strict` for the packet |

### Overview

Read the roster from the CLI before touching a document, because the operator's framing as a version bump turned out to understate it. Then correct the eight surfaces that describe the roster, widening the routing vocabulary rather than swapping it, since SWE-1.7 remains a legitimate explicit pin. The serving manifest goes stale the moment the mode's `SKILL.md` and the hub's `hub-router.json` change, so the commit re-mints it through the existing gate rather than a hand-run script.
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

Two-stage hub routing. The advisor scores the hub from `graph-metadata.json`; the hub's `hub-router.json` and `ROUTER.md` then pick the mode. A keyword added to the router alone never reaches the advisor, which is why the vocabulary change touches three files rather than one.

### Key Components
- **`cli-devin/SKILL.md`**: the dispatch contract. Its default model line and dispatch table are what a caller reads before composing a prompt
- **`references/providers-and-models.md`**: the roster of record. Every other surface points here rather than restating ids, which is what kept the drift to a single alias claim repeated eight times instead of eight independent claims
- **`graph-metadata.json` / `hub-router.json` / `description.json`**: the two routing stages plus the hub description the advisor scores
- **`compiled-route-guard.cjs`**: the freshness authority. It reported the hub stale after the edit, and names which hub needs a re-mint

### Data Flow

A user prompt naming a SWE generation reaches the advisor, which scores the hub from its vocabulary, then the hub router resolves the `devin-dispatch` mode, whose `SKILL.md` supplies the model id that reaches `devin -p --model`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The ground truth is `devin models list`, not a release note. Every id written into a surface was read from that output, including the negative finding that no bare `swe-2` id exists. The end-to-end check is a live `devin -p --model swe-2-max` dispatch, since a documented id that fails at resolution is the exact failure mode the V4.1 Flash packet hit on the Cline route.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `devin` CLI at version 3000.10.21 or later, authenticated. Nothing else. The three JSON edits are validated by parsing them before writing.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single commit. The eight files are documentation and metadata with no runtime state behind them, and the serving manifest is derived, so reverting the inputs and re-running the re-mint restores the prior routing exactly.
<!-- /ANCHOR:rollback -->

---
