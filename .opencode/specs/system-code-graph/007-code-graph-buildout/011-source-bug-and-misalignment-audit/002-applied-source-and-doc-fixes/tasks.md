---
title: "Tasks: Applied Source & Doc Fixes [system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes/tasks]"
description: "31 of 38 audit findings fixed on the cg-remediation branch via cli-opencode gpt-5.5-fast --variant high in an isolated worktree. Typecheck clean; full suite shows zero regressions vs the pre-existing BUG-06 WIP baseline."
trigger_phrases:
  - "code graph remediation applied-source-and-doc-fixes"
  - "system-code-graph fix applied source & doc fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/002-applied-source-and-doc-fixes"
    last_updated_at: "2026-05-29T08:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed 31 fixes on cg-remediation; verified typecheck + zero test regressions"
    next_safe_action: "Operator reviews and merges cg-remediation into main when BUG-06 WIP settles"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Applied Source & Doc Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` done. Findings keyed to `../archive/review-report.md` CG-IDs.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Isolated worktree + B0 baseline + RM-8 guardrails.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Apply / triage the findings in §4 of spec.md.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Typecheck clean; full suite zero-regression vs B0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Outcome recorded per finding; branch `cg-remediation` committed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Findings: `../archive/review-report.md`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
