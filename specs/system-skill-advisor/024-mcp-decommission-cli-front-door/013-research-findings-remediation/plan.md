---
title: "Implementation Plan: Phase 13: research-findings-remediation"
description: "Check each research claim against the repository, fix only what survives, and refuse what does not. One markdown file changes; the reasoning for not changing a second is the other half of the deliverable."
trigger_phrases:
  - "remediation plan research findings"
  - "verify before acting on a finding"
  - "refuse a refuted claim"
  - "trigger phrase correction"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Phase 13: research-findings-remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown frontmatter read by the retrieval layer |
| **Framework** | The advisor's compatibility test directory |
| **Storage** | None |
| **Testing** | The four compatibility suites, plus the repository frontmatter gate |

### Overview

Each claim gets checked before it gets acted on. The trigger phrase naming a deleted suite is real and is corrected. The gitignore claim is not, and the plan is to say so rather than change a working ignore rule to match a finding.
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

Frontmatter as machine-read metadata. The `trigger_phrases` block is not prose: the retrieval layer indexes it, so a phrase naming something deleted routes a reader to nothing and fails silently, which is why nothing caught it.

### Key Components
- **The compatibility README's frontmatter**: the indexed surface, and the only defective part of the file
- **The README body**: already accurate about the daemon, Python parity and redirect contracts, so it was left alone apart from a table that listed half its own directory
- **The gitignore patterns**: checked and found to be serving a different skill, so deliberately untouched

### Data Flow

A reader's phrase reaches the retrieval index, which resolves it to this document, which must then name suites that exist.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The four compatibility suites are run, and their output and exit status read. The repository frontmatter gate is run because the edited file carries frontmatter and that gate has already caught one missing field in this packet's output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the advisor runtime's own test dependencies, already installed in this worktree.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single file. It is documentation metadata with no runtime behavior behind it.
<!-- /ANCHOR:rollback -->

---
