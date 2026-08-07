---
title: "Tasks: Hook Reference Docs Relocation"
description: "Task ledger for relocating four hook reference docs to owning trees. Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook relocation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/001-hook-docs-relocation"
    last_updated_at: "2026-08-06T07:42:39Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Completed relocation, evidence reconciliation, and strict validation"
    next_safe_action: "No follow-up required; packet verification is complete"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-system-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hook Reference Docs Relocation

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

- [x] T001 Inventory the four docs with purpose notes and owner candidates (system-spec-kit/references/hooks/) [evidence: `decision-record.md` verified placement matrix records all 4 documents and their documented behavior]
- [x] T002 Build the placement matrix: per doc, owner tree, behavior evidence, decision (record in decision-record.md) [evidence: `decision-record.md` ADR-001 status Accepted and 4-row Verified Placement Matrix]
- [x] T003 Enumerate every live consumer of the old path strings via repo-wide grep [evidence: pre-move `rg` inventory found 34 live consumer files after excluding `.git`, spec/history records, `z_archive`, review reports, and generated benchmark reports]

### Pre-Move Live Consumer Inventory (34 files)

- Root/runtime docs: `AGENTS.md`, `CLAUDE.md`, `README.md`, `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`, `.devin/hooks/README.md`, `.pi/extensions/README.md`.
- Unified-hook and owner docs: `.opencode/hooks/README.md`, `.opencode/hooks/dispatch/README.md`, `.opencode/hooks/goal/README.md`, `.opencode/hooks/mcp-route-guard/README.md`, `.opencode/hooks/post-edit-quality/README.md`, `.opencode/hooks/task-dispatch/README.md`, `.opencode/skills/system-skill-advisor/hooks/pi/README.md`, `.opencode/skills/sk-git/scripts/hooks/pi/README.md`, `.opencode/skills/sk-code/sk-code-opencode/references/shared/hooks.md`, `.opencode/skills/.goal-state/README.md`, `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`.
- system-spec-kit consumers: `.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/README.md`, `.opencode/skills/system-spec-kit/leaf-aliases.json`, `.opencode/skills/system-spec-kit/leaf-manifest.json`, `.opencode/skills/system-spec-kit/references/config/hook-system.md`, `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`, `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md`, `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md`, `.opencode/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md`, `.opencode/skills/system-spec-kit/mcp-server/hooks/README.md`, `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/README.md`, `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/README.md`, `.opencode/skills/system-spec-kit/mcp-server/plugin-bridges/README.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move the four docs with git mv to their owner trees [evidence: `git diff --cached --name-status` reports 4 `R100` source-to-destination pairs]
- [x] T005 Rewrite relative links inside the moved docs [evidence: moved-doc Node audit output `MOVED_DOC_RELATIVE_LINKS=PASS files=4`]
- [x] T006 Repoint every consumer file [evidence: all 34 files in the pre-move inventory were updated; post-move live-content `rg` count output is `0`]
- [x] T007 Update AGENTS.md directive-capsule pointer [evidence: `AGENTS.md:419` points to `.opencode/hooks/injection-contract.md`; `AGENTS.md:137` points to the advisor-owned contract]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Grep sweep: old path strings absent from live content [evidence: repo-wide `rg -n --hidden` with `.git`, spec/history, `z_archive`, iterations, review reports, and generated benchmark reports excluded outputs count `0`]
- [x] T009 Wikilink and relative-link audit on moved docs [evidence: `MOVED_DOC_RELATIVE_LINKS=PASS files=4`; final packet run uses `SPECKIT_VALIDATE_LINKS=true`]
- [x] T010 validate.sh --strict on the packet, fix any errors [evidence: link-aware and standard `validate.sh --strict` runs both returned `Summary: Errors: 0 Warnings: 0` and `RESULT: PASSED`]
- [x] T011 Confirm scoped git status and no unrelated changes [evidence: scoped `git diff --name-status` contains the 34 inventoried consumer docs, 4 contracted renames, and packet evidence only; unrelated pre-existing worktree changes remain untouched]
- [x] T012 Record evidence in checklist and summary, close the packet [evidence: `checklist.md` evidence rows and `implementation-summary.md` verification table are reconciled to Complete]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] validate.sh --strict exits 0
- [x] Old path strings absent from live content
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
