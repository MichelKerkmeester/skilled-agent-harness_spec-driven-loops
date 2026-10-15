---
title: "Implementation Plan: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer"
description: "Reflow one line of the shipped commit template so its rules block round-trips through the /doctor:git standards serializer again."
trigger_phrases:
  - "standards template round trip plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with a JSON rules block, read by Node.js |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` (`git-standards.test.cjs`) |

### Overview
Split the `commitId` entry of `commit-message-template.md` into the six-line layout `styled()` emits for an object too wide to inline. The parsed contract stays identical, so only the text layout changes.
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
Data-file fix. No code changes.

### Key Components
- **`commit-message-template.md`**: the shipped commit rules block that `/doctor:git standards init` copies into `.sk-git/`.
- **`git-standards.cjs` `serialize()`**: keeps the block's layout only when `styled(original)` equals the original text.

### Data Flow
`set` parses the block, changes one value and writes `styled()` output when the block round-trips, else `JSON.stringify` output.
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

Revert the one commit. The change is whitespace inside a JSON block.
<!-- /ANCHOR:rollback -->

---

