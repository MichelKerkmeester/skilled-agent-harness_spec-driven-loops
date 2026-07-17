---
title: "Tasks: Markdown-Link Integrity Guard [133/007/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "007-link-integrity-guard completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/007-link-integrity-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete; all tasks executed + verified"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Markdown-Link Integrity Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

`T### [P?] Description (file path)` — `[P]` marks parallelizable tasks. All tasks below are complete.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Build `check-markdown-links.cjs` resolver + exclusions + allowlist (`.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`)
- [x] T002 Verify green on current tree (0 broken, exit 0)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 Negative test: inject a broken link in a scanned doc → exit 1; clean up
- [x] T004 Add CI workflow (`.github/workflows/markdown-link-integrity.yml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T005 Author Level-2 spec docs for this phase
- [x] T006 `validate.sh --strict --recursive` green; scoped commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

All tasks done: guard built + verified green + verified catching; CI workflow added; packet authored + validated.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Guard source: `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`
- Resolver origin: `../review/baseline/link-audit.cjs`
- Sibling wikilink checker: `.opencode/skills/system-spec-kit/scripts/check-links.sh`
<!-- /ANCHOR:cross-refs -->
