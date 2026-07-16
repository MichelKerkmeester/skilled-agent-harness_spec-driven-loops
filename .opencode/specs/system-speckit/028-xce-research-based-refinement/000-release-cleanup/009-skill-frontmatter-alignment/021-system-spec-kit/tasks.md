---
title: "Tasks: Phase 22: system-spec-kit Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "system-spec-kit frontmatter tasks"
  - "frontmatter batch authoring tasks"
  - "doc contract normalization tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/021-system-spec-kit"
    last_updated_at: "2026-06-11T09:57:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign-wide coverage flip and live-daemon smoke ride packet 145"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/validation/validation_rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-022-system-spec-kit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: system-spec-kit Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 45/45 docs fail across 4 drift classes — 42 title+description only, 1 no frontmatter, 1 partial block, 1 `contextType: reference` (`check-skill-doc-frontmatter.sh --skill system-spec-kit --coverage`)
- [x] T002 Heading-scan all 45 docs (existing frontmatter + `grep "^#"` outline) to ground phrase, tier, and contextType authoring
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Author + patch assets batch: 4 docs, all `planning` (`.opencode/skills/system-spec-kit/assets/*.md`)
- [x] T004 [P] Author + patch cli/config/debugging/hooks batches: 10 docs; `daemon_cli_reference`, `hook_system`, `skill_advisor_hook` promoted to `important` (`.opencode/skills/system-spec-kit/references/{cli,config,debugging,hooks}/*.md`)
- [x] T005 [P] Author + patch memory batch: 7 docs; complete `embedder_architecture.md` partial block, fix `embedder_pluggability.md` enum drift, `epistemic_vectors.md` to `research` (`.opencode/skills/system-spec-kit/references/memory/*.md`)
- [x] T006 [P] Author + patch structure/templates batches: 9 docs; `level_specifications` promoted to `important` (`.opencode/skills/system-spec-kit/references/{structure,templates}/*.md`)
- [x] T007 [P] Author + patch validation batch: 6 docs; 4 promoted to `important` as formal contract/registry docs (`.opencode/skills/system-spec-kit/references/validation/*.md`)
- [x] T008 [P] Author + patch workflows batch: 9 docs; net-new block prepended to `agent-io-contract.md`, 3 contract docs promoted to `important`, perishable ids dropped from `rename_pattern.md` description (`.opencode/skills/system-spec-kit/references/workflows/*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Coverage check green: `PASS mode=coverage scope=system-spec-kit docs=45 carrying-detailed-block=45 violations=0`
- [x] T010 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "validation rule registry" ranks system-spec-kit first (0.95) with `!validation rule registry(signal)`; "staged trio publication" passes at 0.74 with `!staged trio publication(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T011 Diff hygiene: `git diff -U0` hunk scan shows no hunk past original line 20 in any of the 45 files
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
- **Pilot recipe**: `../008-deep-loop-runtime/`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
