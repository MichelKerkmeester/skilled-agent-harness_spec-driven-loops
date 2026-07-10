---
title: "Tasks: Phase 16: sk-doc Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc frontmatter tasks"
  - "guidance reconciliation tasks"
  - "doc contract final phase tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/016-sk-doc"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-016-sk-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: sk-doc Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 39/39 docs fail (29 missing the detailed fields, 7 with no frontmatter, benchmark_creation at 12 phrases, 3 docs on `contextType: reference`) (`check-skill-doc-frontmatter.sh --skill sk-doc --coverage`)
- [x] T002 Triage template-skeleton fences: benchmark report/source templates carry copyable `{{PLACEHOLDER}}` leading fences tied to a documented `cp` workflow; keep skeletons in place, enum-fix only (`.opencode/skills/sk-doc/assets/benchmark/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Append trigger_phrases/importance_tier/contextType to the 28 docs carrying title+description only (`.opencode/skills/sk-doc/references/**`, `assets/**`)
- [x] T004 Prepend full 5-field blocks to the 7 docs with no frontmatter (`assets/agent_template.md`, `assets/flowcharts/*.md`)
- [x] T005 Trim benchmark_creation.md from 12 phrases to the 8 strongest; fix `contextType: reference` (`references/benchmark_creation.md`)
- [x] T006 Add tier+contextType to readme_creation.md; enum-fix the two benchmark skeleton fences (`references/readme_creation.md`, `assets/benchmark/*.md`)
- [x] T007 Replace the knowledge-file NEVER rule with the Skill Reference/Asset contract: doc-type tables, decision trees, §3 field reference, §4 template entry, §5 validation rules, §6/§7/§9/§10 sweeps (`assets/frontmatter_templates.md`)
- [x] T008 [P] Teach the 5-field block in both scaffold skeletons plus the standard asset structure and the §6 decision-tree example (`assets/skill/skill_reference_template.md`, `assets/skill/skill_asset_template.md`)
- [x] T009 [P] Rewrite stale memory-search claims to advisor doc harvest; spec-folder memory claims left intact (`assets/feature_catalog/feature_catalog_snippet_template.md`, `references/feature_catalog_creation.md`)
- [x] T010 [P] Add the canonical contract pointer to the references/assets directory guidance (`references/skill_creation.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Coverage check green: `PASS mode=coverage scope=sk-doc docs=39 carrying-detailed-block=39 violations=0`
- [x] T012 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "dqi scoring bands" surfaces sk-doc at 0.74 with `!dqi scoring bands(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T013 Stale-claim re-sweep: remaining "Spec Kit Memory" hits are true claims (MCP server names, install guide filenames, the new advisor-mechanism statements)
- [x] T014 Diff hygiene: git diff shows frontmatter-only hunks except the six in-scope Part 2 body-edit files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (coverage check + routing smoke without touching the live daemon)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification evidence**: See `implementation-summary.md`
- **Contract origin**: `../001-frontmatter-benefit-investigation/research.md`
- **Pilot phase**: `../008-deep-loop-runtime/`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
