---
title: "Tasks: Multi-AI Council Deferrals — state.jsonl v1.1 forward-compat metadata + memory-save payload routing + advisory-check + command wiring docs (packet-089 deferrals) [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/003-multi-ai-council-deferrals"
    last_updated_at: "2026-05-06T17:36:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-system-deep-loop/z_archive/022-multi-ai-council-write-protocol/003-multi-ai-council-deferrals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Multi-AI Council Deferrals — state.jsonl v1.1 forward-compat metadata + memory-save payload routing + advisory-check + command wiring docs (packet-089 deferrals)

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T201 Read packet 092 spec, plan, tasks, checklist, and decision record
- [x] T202 Read packet 089 helper, output-schema/state-format references, tests, and agent mirrors
- [x] T203 Confirm no new `.opencode/skills/multi-ai-council/` folder is required
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T204 Add v1.1 state metadata constants to `persist-artifacts.cjs`
- [x] T205 Add metadata to generated and appended state JSONL events
- [x] T206 Add v1 read-side state parser tolerance with implicit schema version
- [x] T207 Add `--memory-save-payload-out FILE` CLI flag and payload writer
- [x] T208 Add memory-save payload extraction for summary, decisions, follow-ups, and status
- [x] T209 Create `advise-council-completion.cjs` informational advisor CLI
- [x] T210 Update `state-format.md` for v1.1 metadata and additive schema evolution
- [x] T211 Add helper Vitest coverage for metadata, v1 parsing, payload present, and payload absent
- [x] T212 Add advisor Vitest coverage for complete packet, missing report, and missing complete event
- [x] T213 Update `.opencode`, `.claude`, and `.gemini` agent body §14/§16 sections
- [x] T214 Attempt `.codex` mirror update and record sandbox write block
- [x] T215 Create `command-wiring.md` reference with shell and YAML examples
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T216 Run packet 092 strict validation before completion-doc updates
- [x] T217 Run helper and advisor syntax checks
- [x] T218 Run targeted Vitest suite for helper, advisor, and mirror-parity baseline
- [x] T219 Run smoke checks for advisor, payload generation, docs/tests existence, no skill folder, and permission invariant
- [x] T220 Update completion documentation with verification evidence and known `.codex` sandbox limitation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed except the documented `.codex` mirror write block
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
