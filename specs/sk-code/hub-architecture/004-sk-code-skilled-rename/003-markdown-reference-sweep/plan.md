---
title: "Implementation Plan: Phase 3: markdown-reference-sweep"
description: "Apply the phase 002 rename script to specs/, rename spec folders that carry the identity, then repair their derived metadata and compare validation with main."
trigger_phrases:
  - "markdown reference sweep plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: markdown-reference-sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | Skilled framework (sk-code hub, system-skill-advisor, system-spec-kit) |
| **Storage** | Git-tracked files; advisor SQLite DB and trigger index rebuilt from them |
| **Testing** | node --test, vitest, python unittest, the hub drift guards and `validate.sh --strict` |

### Overview
The same scripted pass that renamed the live surfaces also covered `specs/`: it moved every spec folder and file whose name carried the identity with `git mv`, and rewrote spec markdown and metadata JSON. Machine logs were skipped. Derived metadata was then repaired for every renamed packet.
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
Scripted rename, then derived-metadata repair

### Key Components
- **Rename script**: the phase 002 script, with machine-record suffixes skipped inside specs/
- **repair-derived.cjs**: re-derives graph metadata and packet pointers for renamed packets
- **refresh-track-roots.mjs**: keeps each track root's child list current

### Data Flow
Folder moves change packet paths; the text rewrite updates `specFolder` and parent references in metadata to match; `repair-derived.cjs` re-derives the rest.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every renamed packet was validated `--strict` in the worktree and at its old path on `main`, and the two summaries were compared.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 002's rename script and safe patterns.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Shared with phase 002: the rename is staged, not committed, so `git reset --hard HEAD` in the worktree discards it.
<!-- /ANCHOR:rollback -->

---
