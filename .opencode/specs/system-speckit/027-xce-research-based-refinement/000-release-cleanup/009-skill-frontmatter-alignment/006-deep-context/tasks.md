---
title: "Tasks: Phase 6: deep-context Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-context frontmatter tasks"
  - "frontmatter authoring tasks"
  - "doc contract authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/006-deep-context"
    last_updated_at: "2026-06-11T13:05:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-006-deep-context"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: deep-context Frontmatter Alignment

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

- [x] T001 Inventory all 11 docs and confirm each carries title+description only with single-line descriptions and no stray keys (`.opencode/skills/deep-context/{references,assets}/**/*.md`)
- [x] T002 [P] Audit sibling deep-loop-runtime phrases to keep deep-context phrases distinctive (`.opencode/skills/deep-loop-runtime/references/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author trigger_phrases/tier/contextType on the 4 convergence docs (`.opencode/skills/deep-context/references/convergence/{convergence,convergence_graph,convergence_recovery,convergence_signals}.md`)
- [x] T004 Author trigger_phrases/tier/contextType on the 4 state docs (`.opencode/skills/deep-context/references/state/{state_format,state_jsonl,state_outputs,state_reducer_registry}.md`)
- [x] T005 Author trigger_phrases/tier/contextType on protocol, guide, and asset docs (`references/protocol/loop_protocol.md`, `references/guides/quick_reference.md`, `assets/context_report_template.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Coverage check green: `PASS mode=coverage scope=deep-context docs=11 carrying-detailed-block=11 violations=0`
- [x] T007 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "parallel heterogeneous sweep" ranks deep-context first (0.95) with `!parallel heterogeneous sweep(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T008 Diff hygiene: git diff shows frontmatter-only hunks for the 11 files (87 insertions, 0 deletions)
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
- **Pilot recipe**: `../008-deep-loop-runtime/implementation-summary.md`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
