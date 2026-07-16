---
title: "Tasks: Reconstruct sk-design 001-008 design specs and establish clean 001-009 numbering [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design reconstruction tasks"
  - "sk-design 001-008 tasks"
  - "sk-design numbering cleanup tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Broke plan into phased task list"
    next_safe_action: "Hand off Phase 3/4 tasks to the downstream sonnet-5 scaffold + GPT-5.6 fill run."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/"
      - ".opencode/specs/sk-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-sk-design-reconstruct-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct sk-design 001-008 design specs and establish clean 001-009 numbering

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Verify no `sk-design/001-008` packet has ever been committed (`git log --all --diff-filter=A --name-only -- '.opencode/specs/sk-design/00[1-8]*'`)
- [x] T002 Verify `009-sk-design-claude-parity` is the only ever-tracked sk-design spec packet (`git log --diff-filter=A --oneline --reverse -- '.opencode/specs/sk-design/009*'`)
- [x] T003 [P] Confirm `.opencode/specs/sk-design/z_archive/` holds only `description.json`/`graph-metadata.json`, no archived phase folders
- [x] T004 [P] Confirm the 3 scratch folders (`002-mcp-open-design`, `003-mcp-figma-with-direct-cli-support`, `003-sk-design-parent`) each return 0 lines from `git ls-files`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Source Mapping — this packet's core deliverable.**

- [x] T005 Enumerate `.opencode/skills/sk-design/design-foundations/` (SKILL.md lines, references, procedures, assets, scripts) for target packet `001`
- [x] T006 Enumerate `.opencode/skills/sk-design/design-interface/` for target packet `002`
- [x] T007 Enumerate `.opencode/skills/sk-design/design-motion/` for target packet `003`
- [x] T008 Enumerate `.opencode/skills/sk-design/design-audit/` for target packet `004`
- [x] T009 Enumerate `.opencode/skills/sk-design/design-md-generator/` (excluding vendored `node_modules/`) for target packet `005`
- [x] T010 Enumerate `.opencode/skills/sk-design/design-mcp-open-design/` (transport) for target packet `006`
- [x] T011 Enumerate hub root (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`, `README.md`) for target packet `007`
- [x] T012 Enumerate `shared/`, `benchmark/`, `feature_catalog/` for target packet `008`
- [x] T013 Record the 8-row source map with evidence in `spec.md` §3 and `plan.md` §4
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**This packet's own verification (not the downstream hand-off).**

- [x] T014 Confirm no destructive command (`rm`, `git rm`, `git mv`) was executed anywhere in this session
- [x] T015 Confirm no file was authored outside `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/`
- [x] T016 Confirm `description.json`/`graph-metadata.json` were not authored by this packet (generated downstream)
- [ ] T017 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Hand-Off (downstream, out of scope for this packet)

- [ ] T018 [B] Re-verify the 3 scratch folders are still 0-tracked-files immediately before the gated clear runs
- [ ] T019 [B] `rm -rf` the 3 scratch folders only after T018 passes
- [ ] T020 [B] Sonnet-5 scaffolds `spec.md`/`plan.md`/`tasks.md`/`checklist.md` for packets `001-008` per the source map in `plan.md` §4
- [ ] T021 [B] GPT-5.6 fills each packet's content from its live skill-tree source (not this session's cached counts)
- [ ] T022 [B] Regenerate `.opencode/specs/sk-design/description.json` and `graph-metadata.json` once all 8 packets exist
- [ ] T023 [B] Confirm final `ls .opencode/specs/sk-design/` shows a contiguous `001-009`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks marked `[x]` (T017 pending strict validation run)
- [ ] Phase 4 tasks remain `[B]` blocked on downstream hand-off — not required for this packet's own completion
- [ ] No `[B]` blocked tasks in Phase 1-3
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
