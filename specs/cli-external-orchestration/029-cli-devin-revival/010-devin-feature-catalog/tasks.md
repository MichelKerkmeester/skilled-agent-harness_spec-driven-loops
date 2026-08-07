---
title: "Tasks: Devin feature catalog"
description: "Task breakdown for authoring cli-devin's feature-catalog package via LUNA-dispatched content authoring."
trigger_phrases: ["devin feature catalog tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored task breakdown; all tasks unchecked, phase Planned"
    next_safe_action: "Confirm dependency phases before T001"
    blockers: ["Depends on 003/005/009 for full content"]
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin feature catalog

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that can run in parallel; `[B]` marks a blocked task pending a decision.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Confirm current `Status` field of phases 003/005/009; record which categories get real content vs. explicit stubs
- [ ] T002 Re-run phase 004's hook-dormancy probe methodology if the installed `devin` version differs from `3000.2.17`; update the dormancy-status citation if the finding has changed
- [ ] T003 Lock the 7 category names and 8 hook-event feature slugs (no numeric prefixes, kebab-case, matching `create-feature-catalog`'s naming rules)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Create `cli-devin/feature-catalog/feature-catalog.md` from `assets/feature-catalog-template.md`
- [ ] T005 [P] Create the `hooks/` category's 8 per-feature files (`session-start.md`, `user-prompt-submit.md`, `pre-tool-use.md`, `post-tool-use.md`, `permission-request.md`, `stop.md`, `post-compaction.md`, `session-end.md`), each with the mandatory dormancy-status field
- [ ] T006 [P] Create the `cli-invocation/` category's per-feature files (`--model`, `--permission-mode`, `-p`/print mode, `--continue`/`--resume`, `--agent-config`)
- [ ] T007 [P] Create the `permission-modes/` category's per-feature files (`auto`, `accept-edits`, `smart`, `dangerous`)
- [ ] T008 [B] Create the `model-dispatch/` category's per-feature file, citing phase 005 REQ-011's allowlist and phase 002 REQ-014/015's enforcement -- blocked until phase 002 lands; author as a stub otherwise
- [ ] T009 [P] Create the `subagents/` category's per-feature files (`subagent_explore`, `subagent_general`, custom `.devin/agents/[name]/AGENT.md` profiles)
- [ ] T010 [B] Create the `mcp-host-integration/` category's per-feature file -- blocked until phase 009 lands; author as a stub otherwise
- [ ] T011 [P] Create the `sequential-thinking/` category's per-feature file (the 2-layer `devin mcp add` + `system_instructions` pattern)
- [ ] T012 Dispatch T005-T011's actual prose authoring to `cli-codex` with `--model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, citing exact source documents per category
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T013 Run `check_no_hyphenated_catalog_content.py` against the staging root
- [ ] T014 Run `validate_document.py` on the root catalog and every per-feature leaf
- [ ] T015 Run `extract_structure.py` on the root catalog
- [ ] T016 Manually verify every root entry links to exactly one per-feature file and vice versa
- [ ] T017 Manually spot-check every `hooks` per-feature file's dormancy status against phase 004/008's actual current state -- not just structural presence
- [ ] T018 Manually verify no category describes a not-yet-shipped capability as current behavior
- [ ] T019 Finalize `implementation-summary.md`; `validate.sh --strict` → 0 errors; update parent `spec.md`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, OR each is explicitly resolved with a documented stub
- [ ] `create-feature-catalog`'s shared validators pass clean
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on `../003-cli-devin-skill-packet/`, `../005-devin-model-registry-and-quota/`, `../009-devin-mcp-host-integration/` for full content.
- Sources the `hooks` category entirely from `../004-devin-hook-adapter-layer/` and `../008-devin-hook-parity/`, regardless of their own build status.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`
