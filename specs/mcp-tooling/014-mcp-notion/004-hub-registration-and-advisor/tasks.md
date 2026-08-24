---
title: "Tasks: Phase 004 — Register mcp-notion across the mcp-tooling hub, router, and skill-advisor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-notion hub registration tasks"
  - "mcp-notion router advisor tasks"
  - "mcp-notion phase 4 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/004-hub-registration-and-advisor"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Completed all Phase 4 hub-registration tasks; router + advisor green, advisor rebuilt"
    next_safe_action: "Proceed to Phase 5 verification and closeout"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-004-hub-registration"
      parent_session_id: "014-mcp-notion"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 004 — Register mcp-notion across the mcp-tooling hub, router, and skill-advisor

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read `mcp-click-up`'s entries across the hub files as the template for the `mcp-notion` mode object shape
- [x] T002 Confirm the canon checker `--fix` as the `leaf-manifest.json` regenerator (`.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`)
- [x] T003 [P] Confirm the trusted `skill_graph_scan` + `advisor_rebuild --force` path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Router: add the `mcp-notion` mode object (`mode-registry.json`) + tieBreak/routerSignals/vocabularyClasses (`hub-router.json`) + NOTION intent + INTENT_SIGNALS + RESOURCE_MAP (`ROUTER.md`)
- [x] T005 Advisor: append Notion description + 14 keywords (`description.json`) + domains/intent_signals/derived/entity + causal_summary seven→eight (`graph-metadata.json`)
- [x] T006 Hub doc: update SKILL.md description, keywords, §1 mode row, packetKind list, mode counts, dir tree, workflow-packets list (`SKILL.md`)
- [x] T007 Regenerate `leaf-manifest.json` via `ci-skill-root-metadata.cjs --skill mcp-tooling --fix`
- [x] T008 [P] Author `feature-catalog/FEATURE-CATALOG.md` (24-tool current-state inventory) + `examples/README.md` (Code Mode Notion workflow examples)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `skill_graph_scan` + `advisor_rebuild --force`; confirm the advisor returns `mcp-tooling` as the unambiguous #1 for Notion prompts (0.792 / 0.9458)
- [x] T010 Run `ci-skill-root-metadata.cjs --skill mcp-tooling` (PASS) + `parent-skill-check.cjs` (`PARENT_HUB_CHECK_STRICT=1`, exit 0, 0 warnings); `validate_document.py` on both new packages = 0 issues
- [x] T011 `validate.sh` this phase; refresh `implementation-summary.md` + continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Canon checker PASS; `parent-skill-check` STRICT exits 0 with 0 warnings; advisor returns `mcp-tooling` for Notion prompts; no registry↔router drift
- [x] `leaf-manifest.json` regenerated (not hand-edited); feature-catalog + examples authored (validate_document.py = 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next phase**: `../005-verification-and-closeout/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
