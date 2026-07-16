---
title: "Tasks: Phase 5: backfill-remaining-profiles"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "backfill remaining profiles tasks"
  - "small model profile tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/005-backfill-remaining-profiles"
    last_updated_at: "2026-06-02T18:04:14Z"
    last_updated_by: "agent"
    recent_action: "All tasks completed"
    next_safe_action: "Proceed to phase 006-thin-and-standardize-cli-cards"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-backfill-remaining-profiles"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: backfill-remaining-profiles

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

- [x] T001 Verify hub scaffold from phase 4 is in place (`.opencode/skills/sk-prompt-models/references/models/`)
- [x] T002 Read `model-profiles.json` entries for all 6 target models to extract framework data
- [x] T003 [P] Confirm 6-section template structure from existing priority profiles (mimo-v2.5-pro, minimax-m3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Author `minimax-2.7.md` — TIDD-EC empirical profile with benchmark 120/003 evidence, TIDD-EC fill scaffold, sibling pointer to minimax-m3 (`references/models/minimax-2.7.md`)
- [x] T005 [P] Author `swe-1.6.md` — RCAF primary, mandatory caller-side pre-planning contract, escalation rule to deepseek-v4-pro, non-TTY rule (`references/models/swe-1.6.md`)
- [x] T006 [P] Author `deepseek-v4-pro.md` — RCAF/medium, `--pure` flag note for deepseek-api path, 64k window budget guidance, escalation-target context (`references/models/deepseek-v4-pro.md`)
- [x] T007 [P] Author `kimi-k2.6.md` — RCAF/medium, 200k large-context specialist, ~5–10% hang rate note, file-anchor discipline (`references/models/kimi-k2.6.md`)
- [x] T008 [P] Author `qwen3.6.md` — RCAF/medium, 32k window constraints, mandatory truncation markers, no cross-pool fallback (`references/models/qwen3.6.md`)
- [x] T009 [P] Author `glm-5.1.md` — RCAF/medium, dual-pool dispatch (cognition-pro + opencode-go), explicit scope discipline despite 128k window (`references/models/glm-5.1.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm all 6 profile files present via `ls references/models/`
- [x] T011 Spot-check each profile: H1 heading, valid YAML frontmatter with `model_id`, 6 sections present
- [x] T012 Verify `model_id` frontmatter values round-trip to matching registry entries in `model-profiles.json`
- [x] T013 Confirm minimax-2.7 benchmark evidence section contains 120/003 scores (0.767 TIDD-EC, 0.742 RCAF)
- [x] T014 Confirm swe-1.6 pre-planning contract is explicitly stated as mandatory (not optional)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
