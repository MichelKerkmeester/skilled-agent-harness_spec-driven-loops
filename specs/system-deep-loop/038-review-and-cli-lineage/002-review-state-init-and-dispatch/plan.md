---
title: "Implementation Plan: Deep-review state-log init through the gateway, and the child-dispatch retry rule"
description: "Open each deep-review run as a ledger event through the append gateway, so the state log is the gateway's projection from its first row, and add a retry rule to the child-dispatch preamble."
trigger_phrases:
  - "review run open plan"
  - "run initialized gateway plan"
  - "dispatch retry plan"
  - "attribution collapse fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-review state-log init through the gateway, and the child-dispatch retry rule

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node, workflow YAML, Markdown |
| **Framework** | Deep-loop runtime and append gateway |
| **Storage** | Append-only ledger frames and the JSONL state projection |
| **Testing** | Vitest, the stem-producer census |

### Overview
The init step builds a `deep_review.run_initialized` event from `deep-review-config.json` and hands it to `append-mode-event.cjs`, which writes the state log's first row as a projection. Later appends then rebuild a row that matches it, so the attribution guard passes. The preamble gains one retry line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single writer: the append gateway is the only writer of the state log.

### Key Components
- **Init step**: builds the event with `node -e` and calls the gateway, as the migration step already does.
- **Stem census**: declares which file speaks each stem; the checker holds it to the emitter surface.

### Data Flow
`deep-review-config.json` → init step builds the `run_initialized` event → gateway commits it to the ledger → projection writes the config row → each later event extends the same projection.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`deep-review-run-open.vitest.ts` extracts the init command from each shipped YAML and runs it, so a later edit back to a direct write fails. A control case keeps the old direct-written row and confirms it still fails.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Packet 038 must land on main first; this change rebases onto it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the merge. Runs opened in the meantime keep a gateway-written state log, which the old direct write never reads.
<!-- /ANCHOR:rollback -->

---

