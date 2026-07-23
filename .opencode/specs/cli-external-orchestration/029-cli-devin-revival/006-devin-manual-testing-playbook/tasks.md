---
title: "Tasks: Devin manual-testing playbook"
description: "Task breakdown for authoring the Devin-native manual-testing playbook: setup/confirmation, root-file + 8-category authoring, and structural verification."
trigger_phrases: ["devin manual testing playbook tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/006-devin-manual-testing-playbook"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 006 (Planned): all 19 tasks unchecked, none yet executed."
    next_safe_action: "Author checklist.md; wait for phases 003-005 before starting T004"
    blockers: ["devin auth login requires an interactive OAuth browser flow only the operator can complete - blocks scenario EXECUTION, not this phase's authoring work"]
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Devin manual-testing playbook

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

- [ ] T001 Confirm phases 003 (skill packet), 004 (hook adapter layer), and 005 (model registry) have landed before authoring cross-references that depend on them.
- [ ] T002 Re-verify phase 001's live Devin CLI contract facts remain accurate (version, hooks, permission modes, subagents, cloud handoff, model roster, `devin mcp` subcommands). (`../001-devin-contract-pin/implementation-summary.md`)
- [ ] T003 [P] Re-confirm the archived `swe-1.6` hallucination-fixture facts (hallucinated CLI flags, wrong-cwd path defects, bundle-gate bypasses) against `../../z_archive/018-cli-devin-prompt-quality/spec.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the root file `manual-testing-playbook.md` with the confirmed 17-section structure, both banners, and the per-category summary sections. (`cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md`)
- [ ] T005 Author the `cli-invocation` category: default invocation, `--print` single-turn mode, model selection via `--model`/short names, and the flag-hallucination-fixture scenario. (`cli-invocation/*.md`)
- [ ] T006 Author the `permission-modes` category: normal, accept-edits, bypass, autonomous, plus the separate `--sandbox` OS-level flag. (`permission-modes/*.md`)
- [ ] T007 Author the `subagents` category: `subagent_explore`, `subagent_general`, and a custom `.devin/agents/[name]/AGENT.md` profile. (`subagents/*.md`)
- [ ] T008 Author the `hooks` category: `SessionStart`/`UserPromptSubmit` smoke tests at minimum, against phase 004's adapter layer. (`hooks/*.md`)
- [ ] T009 Author the `session-continuity` category: `--continue`/`-c`, `--resume`/`-r`, `/fork`, `/revert`. (`session-continuity/*.md`)
- [ ] T010 Author the `cloud-handoff` category: `/handoff` tested thoroughly across at least 2 scenarios. (`cloud-handoff/*.md`)
- [ ] T011 Author the `prompt-templates` category, ported near-verbatim from cli-codex's CLEAR/RCAF scoring apparatus. (`prompt-templates/*.md`)
- [ ] T012 Author the `mcp-integration` category: `devin mcp add/list/get/remove/login/logout/enable/disable`. (`mcp-integration/*.md`)
- [ ] T013 Add a cross-reference from `cli-devin/SKILL.md` to the playbook root file. (`cli-external-orchestration/cli-devin/SKILL.md`)
- [ ] T014 Populate the root file's Automated Test Cross-Reference and Feature Catalog Cross-Reference Index sections once every category file exists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run sk-doc's `validate_document.py` against the root file and every scenario file; confirm 0 structural errors.
- [ ] T016 Confirm total scenario count lands in the 15-20 range and all 8 categories have `>=1` scenario.
- [ ] T017 Confirm `DV-NNN` IDs are globally sequential and unique with no gaps or collisions across categories.
- [ ] T018 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh cli-external-orchestration/029-cli-devin-revival/006-devin-manual-testing-playbook --strict` and confirm 0 errors, 0 warnings.
- [ ] T019 Confirm the root file explicitly marks scenario EXECUTION (not authoring) as gated on `devin auth login`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `validate.sh <phase-folder> --strict` exits 0 on this phase's own docs.
- [ ] Playbook cross-referenced from `cli-devin/SKILL.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- `../001-devin-contract-pin/implementation-summary.md`
- `../../z_archive/018-cli-devin-prompt-quality/spec.md`
- `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md`
<!-- /ANCHOR:cross-refs -->
