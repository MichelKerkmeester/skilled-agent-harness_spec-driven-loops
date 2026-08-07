---
title: "Tasks: 017/002 Tool-surface coverage audit"
description: "Task checklist for tool-surface coverage audit."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 017/002 Tool-surface coverage audit

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
- `[x]` completed | `[ ]` pending
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] T1.1: Confirm Gate 3 path and phase scope.
- [x] T1.2: Read 016/004 fixture-surgery evidence and live scenario templates.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] T2.1: Generate `evidence/tool-coverage-audit.csv`.
- [x] T2.2: Record phase-specific summary in `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] T3.1: Regenerate evidence with `node ../evidence/generate-playbook-quality-audit.js`.
- [x] T3.2: Validate parent packet with `validate.sh --strict`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
- [x] Evidence artifact exists.
- [x] Packet docs name the artifact and scope.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Parent: `017-playbook-quality-audit`
- Generator: `../evidence/generate-playbook-quality-audit.js`
<!-- /ANCHOR:cross-refs -->
