---
title: "Tasks: De-vendor design-interface's Apache-2.0 dependency"
description: "Task breakdown for the ordered de-vendor-then-delete change: rewrite guidance, verify intent preservation, remove LICENSE.txt and its six citing sites, update manual-testing, record in changelog."
trigger_phrases:
  - "apache devendoring tasks"
  - "design-interface license removal tasks"
  - "design principles rewrite tasks"
  - "vendored guidance de-vendor tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/001-apache-devendoring"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Marked T001-T019 delivered against commit 8fa4752968 and re-run checks"
    next_safe_action: "None; all 19 tasks are closed with on-disk evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
      - ".opencode/skills/sk-design/design-interface/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: De-vendor design-interface's Apache-2.0 dependency
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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [de-vendor rewrite, load-bearing gate, ~2h]

**Delivered** in commit `8fa4752968`.

- [x] T001 Read `design-interface/references/design-process/design-principles.md` in full and list every guidance point (`design-principles.md`) [30m]
- [x] T002 Draft an original-words rewrite preserving each point's intent (`design-principles.md`) [1h]
- [x] T003 Compare rewrite against the original point-by-point (`design-principles.md`) [20m]
- [x] T004 HARD STOP CHECK: confirm no guidance point was lost; if any was, halt and escalate before Phase 2 (`design-principles.md`) [10m] — not triggered; the six preserved points are listed in `changelog/v1.1.0.0.md` §2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [delete license + citations, blocked on Phase 1 passing, ~1h]

**Delivered** in commit `8fa4752968`.

- [x] T005 `git rm .opencode/skills/sk-design/design-interface/LICENSE.txt` (`LICENSE.txt`) [5m]
- [x] T006 [P] Remove `license: Apache-2.0; see LICENSE.txt` frontmatter line (`SKILL.md:9`) [5m]
- [x] T007 [P] Remove provenance citation (`SKILL.md:295`) [5m]
- [x] T008 [P] Remove provenance citation (`SKILL.md:345`) [5m]
- [x] T009 [P] Remove licensing Q&A (`README.md:166`) [5m]
- [x] T010 [P] Remove resource-table row (`README.md:199`) [5m]
- [x] T011 Rewrite attribution line (`design-principles.md:17`) [10m] — delivered as a removal; no upstream source remained to attribute
- [x] T012 Delete or invert manual-testing scenario ID-007 (`manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md`) [15m] — deleted (93 lines)
- [x] T013 Update ID-007 summary references (`manual-testing-playbook/manual-testing-playbook.md:68,349,355`) [10m] — counts reconciled 31/20 to 30/19
- [x] T014 Author new `changelog/` entry recording the de-vendor (`design-interface/changelog/`) [15m] — `v1.1.0.0.md`
- [x] T015 Confirm `.gitignore` unchanged (no path) [2m] — `git show --stat 8fa4752968 -- .gitignore` returns nothing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

**Delivered**; commands re-run against the current working tree.

- [x] T016 `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/` excluding `changelog/` returns nothing (no path) [5m]
- [x] T017 `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` reports valid (no path) [5m] — `Result: PASS`
- [x] T018 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/001-apache-devendoring --strict` exits 0 (no path) [5m]
- [x] T019 Mark checklist.md items with evidence (`checklist.md`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Phase 1 hard-stop check explicitly passed before Phase 2 began
- [x] Grep sweep clean
- [x] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
