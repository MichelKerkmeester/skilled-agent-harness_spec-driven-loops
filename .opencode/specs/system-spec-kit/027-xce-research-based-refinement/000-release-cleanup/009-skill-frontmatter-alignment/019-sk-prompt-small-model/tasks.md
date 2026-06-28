---
title: "Tasks: Phase 19: sk-prompt-models Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-prompt-models frontmatter tasks"
  - "model profile frontmatter tasks"
  - "small model doc contract tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-models"
    last_updated_at: "2026-06-11T13:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/_index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-019-sk-prompt-models"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: sk-prompt-models Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 14/14 docs fail; non-profile docs miss the three detailed fields, the 7 model profiles also miss `description` and carry non-contract registry keys (`check-skill-doc-frontmatter.sh --skill sk-prompt-models --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author full contract on the 7 model profiles with model-named trigger phrases and new one-line descriptions; drop `model_id`/`profile_of`/`status`/`last_benchmarked` (`.opencode/skills/sk-prompt-models/references/models/{deepseek-v4-pro,glm-5.1,kimi-k2.6,mimo-v2.5-pro,minimax-2.7,minimax-m3,qwen3.6}.md`)
- [x] T003 Author trigger_phrases/tier/contextType on the 5 non-profile references and 2 assets, keeping existing descriptions (`references/{context-budget,models/_index,output-verification,pattern-index,quota-fallback}.md`, `assets/{cli_prompt_quality_card,confidence-scoring-rubric}.md`)
- [x] T004 Tier judgments: `important` for the canonical CLI prompt quality card; `deprecated` + contextType `research` for the historical minimax-2.7 profile; all other docs `normal`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Coverage check green: `PASS mode=coverage scope=sk-prompt-models docs=14 carrying-detailed-block=14 violations=0`
- [x] T006 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "minimax m3 prompt framework" ranks sk-prompt-models first (0.95) with `!minimax m3 prompt framework(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T007 Diff hygiene: git diff shows frontmatter-only hunks for the 14 files
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
