---
title: "Tasks: Codex command parity — sync-prompts.cjs + repo-tracked thin router-prompts"
description: "Task breakdown for building the sync-prompts.cjs generator, materializing 37 thin router-prompts into a repo-tracked .codex/prompts/ tree, and proving the --check drift gate fails closed."
trigger_phrases:
  - "codex command parity tasks"
  - "sync-prompts tasks"
  - "codex prompt generation tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/003-codex-command-parity"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude"
    recent_action: "All in-repo tasks done; --check GREEN exit 0; committed c1771fbbf3"
    next_safe_action: "Orchestrator strict-validates this child; deferred install tracked as open"
---
# Tasks: Codex command parity — sync-prompts.cjs + repo-tracked thin router-prompts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Confirm the premise correction (Codex commands are markdown prompts, not TOML) and identify `sync-agents.cjs` as the structural mirror (`.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs`)
- [x] T002 Inventory in-scope commands under `.opencode/commands/**/*.md` applying the exclusion set (`assets`/`scripts`/`fixtures` dirs, `README.md`, `*.contract.md`) → 37 files

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author `sync-prompts.cjs` mirroring `sync-agents.cjs`: `REPO_ROOT` via `__dirname`, node builtins (`node:fs`/`node:path`), recursive source walk with exclusions, `toFlatName()` flat-hyphenated naming, `renderPrompt()` thin-router text, `--check` drift mode (`.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`)
- [x] T004 Generate the repo-tracked tree — run the generator to materialize 37 thin router-prompts (`.codex/prompts/*.md`)
- [x] T005 Confirm thin-router shape on a sampled prompt: `design/motion.md` → `.codex/prompts/design-motion.md` points at `.opencode/commands/design/motion.md` and forwards `$ARGUMENTS`, no body inlined

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run `node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check` → `PASS: 37 prompts are in sync.` exit 0 (GREEN)
- [x] T007 Confirm fail-closed drift behavior via the generator's `checkOutputs()` branches — `STALE`/`MISSING`/`EXTRA` set `process.exitCode = 1`
- [x] T008 Commit the generator + `.codex/prompts/` tree, main tree untouched (all work in the worktree) — commit `c1771fbbf3`
- [x] T009 Author this child's Level-2 spec-doc set (spec/plan/tasks/checklist/implementation-summary + decision-record); evidence: six docs under `003-codex-command-parity/`, structure-clean via `template-structure.js compare` (0 missing/extra/out-of-order)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]` with evidence in `checklist.md` / `implementation-summary.md`
- [x] No `[B]` blocked tasks remaining for the in-repo deliverable
- [x] `sync-prompts.cjs --check` GREEN (exit 0), 37/37 prompts in sync
- [x] `.codex/prompts/` tree + generator repo-tracked under commit `c1771fbbf3`
- [ ] DEFERRED (operator confirmation): `~/.codex/prompts/` install + stale `create` symlink repair

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
