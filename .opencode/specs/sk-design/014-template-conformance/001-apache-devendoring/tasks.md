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
    last_updated_at: "2026-07-27T14:52:12.976Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across three gated phases"
    next_safe_action: "Start T001"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/LICENSE.txt"
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Read `design-interface/references/design-process/design-principles.md` in full and list every guidance point (`design-principles.md`) [30m]
- [ ] T002 Draft an original-words rewrite preserving each point's intent (`design-principles.md`) [1h]
- [ ] T003 Compare rewrite against the original point-by-point (`design-principles.md`) [20m]
- [ ] T004 [B until T003 passes] HARD STOP CHECK: confirm no guidance point was lost; if any was, halt and escalate before Phase 2 (`design-principles.md`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [delete license + citations, blocked on Phase 1 passing, ~1h]

- [ ] T005 `git rm .opencode/skills/sk-design/design-interface/LICENSE.txt` (`LICENSE.txt`) [5m]
- [ ] T006 [P] Remove `license: Apache-2.0; see LICENSE.txt` frontmatter line (`SKILL.md:9`) [5m]
- [ ] T007 [P] Remove provenance citation (`SKILL.md:295`) [5m]
- [ ] T008 [P] Remove provenance citation (`SKILL.md:345`) [5m]
- [ ] T009 [P] Remove licensing Q&A (`README.md:166`) [5m]
- [ ] T010 [P] Remove resource-table row (`README.md:199`) [5m]
- [ ] T011 Rewrite attribution line (`design-principles.md:17`) [10m]
- [ ] T012 Delete or invert manual-testing scenario ID-007 (`manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md`) [15m]
- [ ] T013 Update ID-007 summary references (`manual-testing-playbook/manual-testing-playbook.md:68,349,355`) [10m]
- [ ] T014 Author new `changelog/` entry recording the de-vendor (`design-interface/changelog/`) [15m]
- [ ] T015 Confirm `.gitignore` unchanged (no path) [2m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

- [ ] T016 `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/` excluding `changelog/` returns nothing (no path) [5m]
- [ ] T017 `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` reports valid (no path) [5m]
- [ ] T018 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/001-apache-devendoring --strict` exits 0 (no path) [5m]
- [ ] T019 Mark checklist.md items with evidence (`checklist.md`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Phase 1 hard-stop check explicitly passed before Phase 2 began
- [ ] Grep sweep clean
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
