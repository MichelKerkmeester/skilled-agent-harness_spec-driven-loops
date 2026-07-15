---
title: "Verification Checklist: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-19. P0/P1 acceptance gates for the benchmark_creation.md consolidation."
trigger_phrases:
  - "006 checklist"
  - "benchmark consolidation checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc"
    last_updated_at: "2026-05-19T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Consolidation complete."
    next_safe_action: "ready to commit on main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "consolidate-006-benchmark-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
- [x] CHK-004 [P0] Source materials read: FORMAT.md, benchmarks_format.md, three existing *_creation.md references, two shipped SOURCE.md files, hvr_rules.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] benchmark_creation.md follows *_creation.md 10-section pattern (overview, when-to-create, when-not-to-create, folder shape, report structure, authoring workflow, date convention, authority hierarchy, case studies + mistakes, related resources)
- [x] CHK-011 [P0] No em dashes, no AI filler words (robust/leverage/comprehensive/delve) in benchmark_creation.md or source_template.md
- [x] CHK-012 [P0] All ANCHOR tags in benchmark_creation.md have matching open + close pairs
- [x] CHK-013 [P0] source_template.md uses bracket-style placeholders ([PLACEHOLDER_NAME])
- [x] CHK-014 [P1] benchmark_creation.md has valid YAML frontmatter with trigger_phrases and importance_tier
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] SC-001: `test -f .opencode/skills/sk-doc/references/benchmark_creation.md` exits 0
- [x] CHK-021 [P0] SC-002: `test -f .opencode/skills/sk-doc/assets/benchmark/source_template.md` exits 0
- [x] CHK-022 [P0] SC-003: `test ! -e .opencode/skills/sk-doc/references/benchmarks` exits 0; `test ! -e .opencode/skills/sk-doc/references/benchmarks_format.md` exits 0
- [x] CHK-023 [P0] SC-004: `test ! -e .opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` exits 0; `test ! -e .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` exits 0
- [x] CHK-024 [P0] SC-005: rg stale-path sweep returns 0 matches outside this packet's own docs
- [x] CHK-025 [P0] SC-006: `validate.sh --strict` exits 0 on this packet
- [x] CHK-026 [P0] SC-007: `validate_document.py --type readme` PASS on both shipped `benchmark_report.md` files (benchmark-2026-05-17 and benchmark-2026-05-18)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All cross-link update targets verified: benchmark_report_template.md, system-spec-kit README, mcp-coco-index README, 4 historical spec.md files, 4 originating packet docs
- [x] CHK-FIX-002 [P0] Historical relocation note appears in each of the four 004-skill-local-benchmarks-format docs
- [x] CHK-FIX-003 [P1] Packet 006 spec docs (spec/plan/tasks/checklist/implementation-summary) describe the final consolidated design
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No auth surface changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized with actual deliverables
- [x] CHK-041 [P1] implementation-summary describes what was built
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
