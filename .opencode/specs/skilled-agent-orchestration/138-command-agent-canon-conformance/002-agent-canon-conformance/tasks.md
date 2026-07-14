---
title: "Tasks: agent create-agent canon conformance + Codex TOML parity gate"
description: "Task breakdown for validating the 26 agent .md files against the create-agent gate, characterizing the sanctioned ## 0. numbering warning, and restoring Codex agent-TOML parity via sync-agents.cjs --check."
trigger_phrases:
  - "agent canon conformance tasks"
  - "codex toml parity tasks"
  - "sync-agents check tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/002-agent-canon-conformance"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; Codex TOML resync committed e893d9adde"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child"
    blockers: []
    key_files:
      - ".opencode/agents/*.md"
      - ".claude/agents/*.md"
      - ".codex/agents/*.toml"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: agent create-agent canon conformance + Codex TOML parity gate

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

Assessment and create-agent gate: enumerate the agents and validate them.

- [x] T001 Enumerate the 13 agents × 2 runtimes (26 `.md`): `.opencode/agents/*.md` (permission frontmatter) + `.claude/agents/*.md` (tools frontmatter); evidence: `ls` shows 13 + 13 + 13 (opencode/claude/codex).
- [x] T002 Run `validate_document.py --type agent` across all 26 `.md`; evidence: 26/26 exit 0; every file has `## 1. CORE WORKFLOW`.
- [x] T003 [P] Classify `## 0. ILLEGAL NESTING / HARD BLOCK` coverage; evidence: 11/13 agents carry `## 0.` → 22/26 files emit one `non_sequential_numbering` warning ("expected 1, found 0"); `deep-improvement` + `prompt-improver` lack it → 4/26 files report 0 issues.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Codex TOML parity resync: decide the no-edit stance and regenerate the stale TOMLs.

- [x] T004 Decide NOT to renumber `## 0.` and NOT to backfill the two exempt agents; evidence: renumbering would strip/corrupt canon-required structure; no evidence the two omissions were oversights; both decisions recorded as ADRs in `decision-record.md`. No `.md` edited.
- [x] T005 Run `sync-agents.cjs --check` (baseline); evidence: RED (exit 1), 4 stale TOMLs — legitimate prior-packet agent-`.md` edits never synced.
- [x] T006 Regenerate via the worktree's `sync-agents.cjs`; evidence: 3 files changed (`.codex/agents/{ai-council,deep-alignment,markdown}.toml`); committed `e893d9adde` ("chore(codex): resync stale agent TOMLs to restore --check parity gate", 3 files, +9/-4).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verification and decision capture: confirm the gates and record the ADRs.

- [x] T007 Re-run `sync-agents.cjs --check`; evidence: GREEN (exit 0) — "PASS: 13 agents are in sync."
- [x] T008 Confirm behavior preservation; evidence: `git show --stat e893d9adde` lists only the three `.codex/agents/*.toml`; no agent `.md` in the diff.
- [x] T009 Record the validator numbering-gap (ADR-001) and the `## 0.` backfill nuance (ADR-002) in `decision-record.md`; note root `AGENTS.md` is out of create-agent canon scope.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]` with evidence in `checklist.md` / `implementation-summary.md`.
- [x] No `[B]` blocked tasks remaining.
- [x] 26/26 agent `.md` exit 0 on `validate_document.py --type agent`.
- [x] `sync-agents.cjs --check` GREEN (13/13 in sync).
- [x] Only the three regenerated TOMLs mutated; no agent `.md` edited.
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
