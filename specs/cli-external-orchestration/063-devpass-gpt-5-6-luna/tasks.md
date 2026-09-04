---
title: "Tasks: Luna on both DevPass rosters"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "luna devpass"
  - "llmgateway rosters"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/063-devpass-gpt-5-6-luna"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete; ten dispatches recorded"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-063-luna-devpass"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Luna on both DevPass rosters

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Capture Luna's facts live [evidence: `opencode models llmgateway --verbose` — reasoning true, attachment true, temperature **false**, ladder none/low/medium/high/xhigh/max, context 1,050,000, input cap 922,000, output 128,000, $0.20 in / $1.20 out per 1M]
- [x] T002 Classify it against the DevPass fair-use rule [evidence: $1.20/1M output is far under the $15 Premium line, so Standard — no weekly cap]
- [x] T003 Confirm the wire id before writing config [evidence: `"model":"gpt-5.6-luna"` → 200, content `WIRE-LUNA`, upstream `azure/gpt-5.6-luna`]
- [x] T004 Confirm cli-opencode has no DevPass section to add to [evidence: no `llmgateway` string in its catalog before this change]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the Luna model object with its own ladder (`.pi/models.json`)
- [x] T006 Add the fifth picker entry (`.pi/settings.json`) [evidence: five `llmgateway/` entries; both files `JSON.parse` clean; no trailing newline preserved]
- [x] T007 Create the `### llmgateway` section with five rows, the bare-id inversion, the Standard-tier note and the closed-roster bound (`cli-opencode/references/providers-and-models.md`)
- [x] T008 Add the `llmgateway` row to the `--variant` mapping table, stating effort is per-model here (`cli-opencode/references/providers-and-models.md`)
- [x] T009 [P] Add the Luna row and correct the four→five counts (`cli-pi/references/providers-and-models.md`)
- [x] T010 [P] Add the Luna row, the temperature caveat and the counts (`.pi/custom-providers.md`)
- [x] T011 [P] Name the DevPass routes and the bare-id rule in the provider prose (`cli-opencode/SKILL.md`)
- [x] T012 Reconcile packet 060 so its WS1 is not claimed twice
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Luna on both CLIs [evidence: `LUNA-PI-OK` at `--thinking max`; `LUNA-OC-OK` at `--variant max`]
- [x] T014 The other four through cli-opencode, so its rows are tested not inferred [evidence: `OC-deepseek-v4-flash`, `OC-deepseek-v4-flash-vision-exp`, `OC-glm-5.3-flash` at max; `OC-gemini-3.8-flash` at high]
- [x] T015 pi config integrity [evidence: five models in the block; both files parse; operator formatting intact]
- [x] T016 No secret in any tracked file [evidence: `apiKey` remains the `${LLMGATEWAY_API_KEY}` reference]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]` [evidence: T001-T016]
- [x] No `[B]` blocked tasks
- [x] Every catalog row backed by a dispatch on that CLI, not carried across from the other
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
