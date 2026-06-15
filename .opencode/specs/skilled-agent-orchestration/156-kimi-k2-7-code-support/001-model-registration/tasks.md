---
title: "Tasks: Phase 1: model-registration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "kimi-k2.7-code"
  - "model registration tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-kimi-k2-7-code-support/001-model-registration"
    last_updated_at: "2026-06-15T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All registration tasks complete and verified"
    next_safe_action: "Begin 002-framework-bakeoff prompt-framework bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-model-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: model-registration

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

- [x] T001 Confirm `kimi-for-coding` provider authed and slug live (`opencode models kimi-for-coding`)
- [x] T002 Capture live facts: context 262144, output 32768, display name "Kimi K2.7 Code"
- [x] T003 [P] Read the Adopting a New Provider checklist (`.opencode/skills/sk-prompt-small-model/references/pattern-index.md` §4)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `kimi-k2.7-code` entry + update registry description rotation line (`sk-prompt-small-model/assets/model-profiles.json`)
- [x] T005 Retire `kimi-k2.6`: executors + recommended_frameworks status -> historical, notes point to kimi-k2.7-code (`sk-prompt-small-model/assets/model-profiles.json`)
- [x] T006 Create the new prompt-craft profile (`sk-prompt-small-model/references/models/kimi-k2.7-code.md`)
- [x] T007 [P] Add HISTORICAL banner to `sk-prompt-small-model/references/models/kimi-k2.6.md` and update `references/models/_index.md` tables
- [x] T008 Update SKILL.md: frontmatter, keywords, triggers, MODEL_ALIASES, §3 matrix row (`sk-prompt-small-model/SKILL.md`)
- [x] T009 [P] Update routing graph metadata (`sk-prompt-small-model/graph-metadata.json` and `cli-opencode/graph-metadata.json`)
- [x] T010 Update cli-opencode auth-login list + Model Selection paragraph (`cli-opencode/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Live smoke dispatch returns "pong" at exit 0, cost 0 (`opencode run --model kimi-for-coding/k2p7`)
- [x] T012 Run card-sync guard to exit 0 (`check-prompt-quality-card-sync.sh .`) and parse all edited JSON
- [x] T013 Re-index advisor (`skill_advisor.py --force-refresh`) and confirm routing probe surfaces both skills
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

