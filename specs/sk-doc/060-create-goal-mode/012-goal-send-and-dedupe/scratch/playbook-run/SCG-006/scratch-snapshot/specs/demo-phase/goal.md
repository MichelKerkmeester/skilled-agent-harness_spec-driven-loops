---
title: "Goal: Demo phase packet"
description: "The durable directive for the demo phase packet."
---
# Goal: Demo phase packet

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Land the demo counter across the alpha and beta phases where 002-beta proves interleaving.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Counter lines are plain text and append-only. |

### Operator copy

The operator holds this directive as the session objective. Whenever anything
above the log changes, resend this file's chat slice so the operator can update
their copy.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.**

| Phase | Goal document |
|-------|---------------|
| alpha | `001-alpha/goal.md` |

**Precedence.** Decisions above outrank child detail.

<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Both phase folders hold a goal document
- [ ] The binding table lists every phase folder
- [ ] The parent durable slice stays within budget
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.
<!-- /ANCHOR:log -->
