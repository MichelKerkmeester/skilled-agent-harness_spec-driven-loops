---
title: "Tasks: Phase 018 - design-mcp-open-design Transport Integration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 018 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/018-mcp-open-design-transport-integration"
    last_updated_at: "2026-07-07T10:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-open-design-transport-018"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 018 - design-mcp-open-design Transport Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read the moved skill's full `SKILL.md` and `graph-metadata.json`
- [x] T002 Dispatch Explore agent for repo-wide reference inventory (live vs. historical classification)
- [x] T003 Read sk-code's `mode-registry.json` `extensions.surface-axis` + `code-webflow/SKILL.md` frontmatter as precedent
- [x] T004 Confirm integration shape with operator via AskUserQuestion (3 options weighed)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Internal link + identity fixes

- [x] T005 Fix `SKILL.md` internal links (2: sk-design self-reference, sk-doc smart-router template)
- [x] T006 [P] Fix `INSTALL_GUIDE.md` (2 sibling-skill links + 4 hardcoded script paths + title/prose rename)
- [x] T007 [P] Fix `references/inner_generator_binding.md`, `guarded_proxy.md`, `freshness_invalidation.md`, `cli_child_pairing.md` (design_proof_token.md depth fix, system-spec-kit depth fix, JSON example strings)
- [x] T008 [P] Fix `references/design_parity_transport.md` (real_ui_loop.md depth fix x2, identity rename)
- [x] T009 [P] Fix `feature_catalog/03--grounding/design-system-grounding.md` and `feature_catalog/feature_catalog.md` (missing design-interface/ segment + identity rename)
- [x] T010 [P] Fix `manual_testing_playbook/05--design-gate/mandatory-design-gate.md` and `manual_testing_playbook/manual_testing_playbook.md` (missing design-interface/ segment + identity rename)
- [x] T011 [P] Rename identity in `README.md` (title, H1, 4 validator command paths, Skills Library link depth) and `scripts/{install.sh,_common.sh,doctor.sh}` + `mcp-servers/open-design/README.md` (comment/log mentions)
- [x] T012 Delete `design-mcp-open-design/graph-metadata.json`

### Registry wiring

- [x] T013 Add `discriminator.packetKind` + `extensions.transport-axis` + new `design-mcp-open-design` mode entry to `mode-registry.json`; version bump 1.3.0.0 -> 1.4.0.0
- [x] T014 Add `routerSignals["design-mcp-open-design"]` + `vocabularyClasses["design-mcp-open-design-aliases"]` + `tieBreak` append to `hub-router.json`; version bump 1.2.1.0 -> 1.3.0.0

### Hub + external cross-references

- [x] T015 Fix sk-design's own `SKILL.md` (5 mode-count/transport-listing mentions) and `README.md` (5 mentions)
- [x] T016 Remove now-internal `mcp-open-design` edges from sk-design's own `graph-metadata.json` (siblings, prerequisite_for, related_to)
- [x] T017 [P] Fix `mcp-figma/SKILL.md` (2 mentions), `README.md` (2 mentions), `manual_testing_playbook.md` (1 mention)
- [x] T018 [P] Remove `mcp-open-design` edges from `mcp-figma/graph-metadata.json` (siblings, related_to, causal_summary prose)
- [x] T019 [P] Fix `cli-opencode/SKILL.md` ALWAYS rule #13; version bump 1.3.15.0 -> 1.3.15.1
- [x] T020 [P] Fix `AGENTS.md` (2 routing table rows)
- [x] T021 Remove stale `.opencode/changelog/mcp-open-design` symlink; add `.opencode/changelog/sk-design/design-mcp-open-design`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Systematic link scan inside `design-mcp-open-design/` alone: 0 broken (first pass, before hub-level fixes)
- [x] T023 Repo-wide link scan across `sk-design` + `mcp-figma` (excluding node_modules/changelog/benchmark): 0 broken
- [x] T024 JSON parse check on `mode-registry.json`, `hub-router.json`, `sk-design/graph-metadata.json`, `mcp-figma/graph-metadata.json`
- [x] T025 Router-mode skill-benchmark: verdict PASS, aggregate 100/100, D5 connectivity 100/100
- [x] T026 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Link scan and D5 gate both confirm the restructure is clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
