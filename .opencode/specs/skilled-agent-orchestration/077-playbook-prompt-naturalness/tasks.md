---
title: "Tasks: 094 - naturalize playbook prompt voice"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "094 tasks"
importance_tier: "high"
contextType: "doc-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness"
    last_updated_at: "2026-05-07T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Phase A edits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 094 - naturalize playbook prompt voice

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Author decision-record.md with heuristic ADR-001 and dispatch ADR-002
- [x] T002 Author spec.md, plan.md, tasks.md, checklist.md, description.json, graph-metadata.json, implementation-summary.md placeholder
- [ ] T003 Validate spec packet via `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A: sk-doc template + reference + command updates (orchestrator)

- [ ] T010 Edit `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md` line 67 (SCENARIO CONTRACT placeholder)
- [ ] T011 Edit same file line 79 (TEST EXECUTION placeholder)
- [ ] T012 Edit `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` lines 313, 333 (per-category scaffold placeholders)
- [ ] T013 Edit same file line 395 (per-feature scaffold inside root template)
- [ ] T014 Add "When to use RCAF vs natural-human" subsection to `.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md` §5 (after the "Acceptable prompt" example, before "Prompt sync rule")
- [ ] T015 Update `.opencode/commands/create/testing-playbook.md` line 317 to clarify both prompt voices
- [ ] T016 Self-validate sk-doc package: `validate_document.py` on each of the 4 modified files

### Phase B.1: Easy-wins playbooks (6 cli-codex dispatches, sequential)

- [ ] T020 Dispatch cli-codex (gpt-5.5 medium fast) for sk-code playbook (25 files)
- [ ] T021 Verify sk-code playbook (validators + audits)
- [ ] T022 Dispatch cli-codex for sk-doc playbook (18 files)
- [ ] T023 Verify sk-doc playbook
- [ ] T024 Dispatch cli-codex for sk-prompt playbook (29 files)
- [ ] T025 Verify sk-prompt playbook
- [ ] T026 Dispatch cli-codex for mcp-coco-index playbook (27 files)
- [ ] T027 Verify mcp-coco-index playbook
- [ ] T028 Dispatch cli-codex for mcp-code-mode playbook (27 files)
- [ ] T029 Verify mcp-code-mode playbook
- [ ] T030 Dispatch cli-codex for mcp-chrome-devtools playbook (23 files)
- [ ] T031 Verify mcp-chrome-devtools playbook

### Phase B.2: sk-/deep- playbooks (5 cli-codex dispatches, sequential)

- [ ] T040 Dispatch cli-codex for sk-code-review playbook (19 files)
- [ ] T041 Verify sk-code-review playbook
- [ ] T042 Dispatch cli-codex for sk-git playbook (23 files)
- [ ] T043 Verify sk-git playbook
- [ ] T044 Dispatch cli-codex for deep-research playbook (42 files)
- [ ] T045 Verify deep-research playbook
- [ ] T046 Dispatch cli-codex for deep-review playbook (40 files)
- [ ] T047 Verify deep-review playbook
- [ ] T048 Dispatch cli-codex for deep-agent-improvement playbook (38 files)
- [ ] T049 Verify deep-agent-improvement playbook

### Phase B.3: cli-* playbooks (4 cli-codex dispatches, sequential; mostly retain RCAF)

- [ ] T060 Dispatch cli-codex for cli-claude-code playbook (27 files)
- [ ] T061 Verify cli-claude-code playbook (expect higher RCAF retention)
- [ ] T062 Dispatch cli-codex for cli-codex playbook (28 files)
- [ ] T063 Verify cli-codex playbook
- [ ] T064 Dispatch cli-codex for cli-gemini playbook (19 files)
- [ ] T065 Verify cli-gemini playbook
- [ ] T066 Dispatch cli-codex for cli-opencode playbook (32 files)
- [ ] T067 Verify cli-opencode playbook

### Phase B.4: system-spec-kit (23 per-category cli-codex dispatches; 321 files)

- [ ] T080 Inventory system-spec-kit/manual_testing_playbook category folders (resolve to 23 dirs)
- [ ] T081 Dispatch cli-codex per-category × 23 (sequential)
- [ ] T082 Per-category verification post each dispatch
- [ ] T083 system-spec-kit root playbook re-validate after all category dispatches complete
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T090 Global validate_document.py sweep across all 16 playbook roots
- [ ] T091 Global prompt-sync audit across all ~498 per-feature files (byte-equality)
- [ ] T092 Global RCAF retention rate sanity (15-40% expected band; per-playbook breakdown)
- [ ] T093 Per-playbook naturalness spot-check (5 random scenarios per playbook)
- [ ] T094 Forbidden-sidecar sweep across all playbooks
- [ ] T095 Dispatch @review for DQI pass on sk-code-review playbook
- [ ] T096 Dispatch @review for DQI pass on sk-git playbook
- [ ] T097 Resolve any P0/P1 from @review (cli-codex follow-up dispatch if needed)
- [ ] T098 Author implementation-summary.md with evidence anchors
- [ ] T099 Update graph-metadata.json (094 status=complete, track parent children_ids append)
- [ ] T100 `validate.sh --strict` on 094 packet returns exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All checklist.md items resolved with evidence
- [ ] @review DQI no P0/P1 regressions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md` for the heuristic ADR
<!-- /ANCHOR:cross-refs -->
