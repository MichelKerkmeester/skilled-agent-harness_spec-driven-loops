---
title: "Tasks: Phase 5: inventory-parity-and-doc-truth"
description: "Task breakdown for mcp-refero inventory parity (examples, install.sh, playbook, catalog leaves, changelog) and the sk-design de-duplication with byte-diffed gates."
trigger_phrases:
  - "refero parity tasks"
  - "mcp-refero 005 tasks"
  - "refero dedup tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks completed with evidence"
    next_safe_action: "Proceed to 006-live-verification-capture when operator auth is available"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: inventory-parity-and-doc-truth

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

- [x] T001 Read ground truth: research.md sections A/C/D/G + tool-surface.md + SKILL.md + playbook root + a sibling scenario + catalog files (`../001-research/research/research.md`, `.opencode/skills/mcp-tooling/mcp-refero/`)
- [x] T002 [P] Read the exemplar examples directory and install wrapper (`.opencode/skills/mcp-tooling/mcp-aside-devtools/examples/`, `mcp-aside-devtools/scripts/install.sh`)
- [x] T003 Capture BEFORE gates: sk-design `validate_skill_package.py` output saved to scratchpad; mcp-refero `package_skill.py --check --strict` PASS baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `examples/README.md` + 3 walkthroughs: funnel, metadata-first lookup, screen-image fetch (`.opencode/skills/mcp-tooling/mcp-refero/examples/`)
- [x] T005 Author `scripts/install.sh` verify-only posture check; `bash -n` + live run (`.opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh`)
- [x] T006 [P] Author FUNNEL-001, FORMAT-001, QUOTA-001 scenario leaves (`manual-testing-playbook/read-only/funnel-walk.md`, `read-only/format-text-retrieval.md`, `safety-gate/quota-recovery.md`)
- [x] T007 Update playbook root: coverage table 9, waves, two new section-8 summaries + one section-9 summary, index 9/9, readiness rule, v1.1.0.0 (`manual-testing-playbook/manual-testing-playbook.md`)
- [x] T008 [P] Author 8 per-tool catalog leaves (`feature-catalog/styles/{search_styles,get_style}.md`, `screens/{search_screens,get_screen,get_similar_screens,get_screen_image}.md`, `flows/{search_flows,get_flow}.md`)
- [x] T009 Update domain files with leaf links + root count summary (3 domain + 8 leaves) (`feature-catalog/`)
- [x] T010 Bump SKILL.md/README.md to v1.1.0.0, surface examples/install.sh; author `changelog/v1.1.0.0.md`
- [x] T011 Slim sk-design `refero_tools.md` to pointer, v1.6.0.0 (`.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md`)
- [x] T012 Bounded transport-phrasing edits: design-interface SKILL.md (3 lines), README.md (2 lines), design_references_mcp.md (2 link lines), mobbin_tools.md (1 line), ID-010 playbook anchor row (1 line) [evidence: 6/6 `design-interface` files edited; gate diff empty]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 AFTER gates: sk-design `validate_skill_package.py` byte-identical diff vs baseline; mcp-refero `package_skill.py --check --strict` PASS
- [x] T014 Relative-link sweep over all touched files [evidence: 0/29 files with broken relative links]
- [x] T015 Author spec child docs (spec/plan/tasks/checklist), delete scaffold implementation-summary.md, write the real one; regenerate description.json + graph-metadata.json; `validate.sh --strict --no-recursive` PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification gates passed (see checklist.md for evidence)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
