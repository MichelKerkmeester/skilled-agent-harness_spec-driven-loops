---
title: "Tasks: sk-vision 010 quality gate"
description: "Executable tasks for the quality gate child."
trigger_phrases:
  - "sk-vision 010 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/010-quality-gate"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 010 task list."
    next_safe_action: "Complete T001-T012 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-010-quality-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 010 quality gate

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 006-009 folders exist with their gate targets on disk — evidence: `grep -m1 Status` on all six phase `spec.md` files returns `Complete`; `find feature-catalog -name "*.md" | wc -l` = 17, `find manual-testing-playbook -name "*.md" | wc -l` = 17
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run `ci-skill-root-metadata.cjs` (fleet) — evidence: exit 0, `OK [S] sk-vision`, checked=13 passed=13 failed=0
- [x] T003 Run `validate_skill_package.py` + `package_skill.py --check` — evidence: both exit 0, `Result: PASS` (LICENSE kebab-case + smart-router marker advisories only, debt-tolerant)
- [x] T004 Run `validate_document.py` on SKILL.md, README, references/runtime-reference.md, catalog root + 16 leaves, playbook root — evidence: all 21 docs exit 0 (listed in implementation-summary)
- [x] T005 Run catalog + playbook package validators — evidence: `validate_catalog_package.py` exit 0 (`PACKAGE sk-vision: PASS tier=fail violations=0`; the copy pack's `.cjs` name was wrong — the shipped validator is `.py`, see implementation-summary); `validate-playbook-package.cjs` exit 0 (`PASS package=sk-vision scenarios=16 violations=0`)
- [x] T006 Run `extract_structure.py` on SKILL.md (DQI) — evidence: exit 0, DQI total 88/100 band `good`
- [x] T007 Run `bun run build && bun test` in vision-runtime — evidence: build exit 0 (`built dist/plugin.js + dist/python/runtime.py`); test exit 0 (8 pass, 0 fail)
- [x] T008 Run advisor smoke (`advisor_recommend --warm-only`) — evidence: exit 0, daemon warm, `sk-vision` recommended (confidence 0.95, uncertainty 0.12)
- [x] T009 Reconcile metadata — evidence: 002-001 + 006-002 `completion_pct` 0→100 with evidence lines; parent `last_active_child_id` → 010-quality-gate; parent spec.md phase-map 006-010→Complete, Status→Complete, continuity refreshed; graph-metadata regenerated via `backfill-graph-metadata.js` for all new folders + parent (generate-context.js aborts with INSUFFICIENT_CONTEXT_ABORT — see KNOWN LIMITATIONS)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run parent `validate.sh --recursive --strict` — evidence: 11/11 folders `RESULT: PASSED` (0 errors / 0 warnings each; wrapper exit 2 is the pre-existing repo COMMAND_TREE_PARITY drift, not a folder failure)
- [x] T011 Final sweep — evidence: no `.venv`; no `*.tmp/*~/*.bak`; no hub JSON on skill root; `git diff --exit-code` on `context/` exit 0; `validate.sh --strict` on this child exit 0; nothing staged by this run
- [x] T012 All tasks marked `[x]` with evidence; no `[B]` remaining — evidence: T001-T012 all `[x]` with inline evidence above
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: T001-T012 all checked with inline evidence
- [x] No `[B]` blocked tasks remaining — evidence: zero `[B]` entries
- [x] Manual verification passed — evidence: gate outputs in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
