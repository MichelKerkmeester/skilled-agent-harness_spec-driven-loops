---
title: "Tasks: Phase 9: deep-research Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-research frontmatter tasks"
  - "research doc authoring tasks"
  - "frontmatter campaign phase nine tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization/004-deep-research-frontmatter-alignment"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-009-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: deep-research Frontmatter Alignment

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

- [x] T001 Confirm baseline: 15/15 docs carry title+description only with the closing fence at line 4, no folded scalars, no non-contract keys (`.opencode/skills/deep-research/{references,assets}/**/*.md`)
- [x] T002 Harvest the sibling deep-* trigger-phrase corpus to keep authored phrases distinctive (deep-loop-runtime, deep-review, deep-context, deep-ai-council, deep-improvement)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author 5-8 trigger phrases per doc from headings/content, research-prefixing loop-generic vocabulary, via an assertion-guarded Python patch (`.opencode/skills/deep-research/{references,assets}/**/*.md`, 15 files)
- [x] T004 Tier judgment: promote the 5 formal contract docs to `important` (`references/convergence/convergence.md`, `references/protocol/loop_protocol.md`, `references/protocol/spec_check_protocol.md`, `references/guides/capability_matrix.md`, `references/state/state_format.md`); the 10 descriptive docs stay `normal`
- [x] T005 contextType assignment: `implementation` for 11 runtime-behavior references, `general` for `quick_reference.md` + `deep_research_dashboard.md`, `planning` for `deep_research_strategy.md` + `convergence_reference_only.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Coverage check green: `PASS mode=coverage scope=deep-research docs=15 carrying-detailed-block=15 violations=0`
- [x] T007 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "research stop contract stuck recovery" ranks deep-research first (0.95) with `!research stop contract(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T008 Diff hygiene: git diff shows insertion-only frontmatter hunks (all at line 3) for the 15 files
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
- **Pilot recipe**: `../008-deep-loop-runtime/`
- **Contract origin**: `../001-frontmatter-benefit-investigation/research.md`
- **Consumer + checker packet**: `skilled-agent-orchestration/z_archive/112-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
