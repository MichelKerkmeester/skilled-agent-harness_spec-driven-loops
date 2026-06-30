---
title: "Feature Specification: spec-kit `:auto` non-interactive contract"
description: "Phase parent for the spec-kit `:auto` setup-resolution contract: 001 introduced the three-tier flow for /deep:start-review-loop; 002 generalizes it to all 12 user-invokable command surfaces."
trigger_phrases:
  - "spec-kit auto mode contract"
  - "auto mode noninteractive setup"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract"
    last_updated_at: "2026-05-11T12:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created phase parent; imported 028 as 001"
    next_safe_action: "Author 002 child packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-spec-kit-auto-mode-noninteractive-contract-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec.md | v2.2 -->

# Feature Specification: spec-kit `:auto` non-interactive contract

<!-- SPECKIT_LEVEL: phase-parent -->

## 1. Metadata

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Priority** | P1 |
| **Created** | 2026-05-11 |
| **Phase Count** | 2 |
| **Last Active Child** | `002-auto-mode-contract-generalization-to-all-commands/` |

## 2. Purpose

This packet coordinates the spec-kit `:auto` (autonomous) setup-resolution contract: a three-tier flow (resolve confidently → ask one targeted clarification when genuinely ambiguous → fail fast as last resort) that ensures `/command:*:auto` dispatches never hang on stdin under non-interactive runtimes.

Phase 1 (001, ex-028) introduced and verified the contract for `/deep:start-review-loop`. Phase 2 (002) lifts the contract into a shared reference doc and migrates the remaining 11 `:auto` commands across `/spec_kit/`, `/create/`, and `/deep/` to cite it, with full live `:auto` dispatch verification per command.

## 3. Scope

In scope:
- Author the three-tier `:auto` contract for `/deep:start-review-loop` (Phase 1, completed pre-rename as packet 028).
- Lift the contract into `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md` so 12 commands cite a single source.
- Migrate `/speckit:` (deep-research, complete, implement, plan, resume), `/create:` (sk-skill, agent, changelog, feature-catalog, testing-playbook, folder_readme), and `/deep:start-agent-improvement-loop` to the shared contract.
- Full live `:auto` dispatch verification across all 12 commands.

Out of scope:
- `/prompt` and `agent_router` (no paired YAML; dispatch-only).
- YAML workflow asset edits (unless a per-command live verification forces it).
- Cross-command integration tests (e.g., `:plan:auto` → `:implement:auto`).
- Non-`/command:*` skill-internal `:auto` flows.

## 4. Phase Documentation Map

| Phase | Folder | Status | Description |
| --- | --- | --- | --- |
| 1 | `001-deep-review-three-tier-setup/` | Complete | Three-tier `:auto` setup contract authored, implemented, and live-verified for `/deep:start-review-loop`. Originally shipped as `system-spec-kit/028-deep-review-noninteractive-setup-bypass`; renamed and imported here 2026-05-11. |
| 2 | `002-auto-mode-contract-generalization-to-all-commands/` | Complete | Lifted three-tier flow into shared `auto_mode_contract.md` reference doc; migrated 11 remaining commands to cite it; full live `:auto` dispatch verification = 13/13 PASS. |

## 5. Phase Handoffs

| From | To | Handoff Criteria | Verification |
| --- | --- | --- | --- |
| `001-deep-review-three-tier-setup` | `002-auto-mode-contract-generalization-to-all-commands` | `/deep:start-review-loop:auto` three-tier flow shipped and dry-run-verified across Trace A/B/C/D; deep-review.md §0 contains the canonical pattern that 002 will generalize. | `001/evidence/dry-run-verification.txt` has 4 verdicts; `001/implementation-summary.md` completion_pct: 100; strict-validate 001 exit 0. |

## 6. Success Criteria

- A shared `auto_mode_contract.md` reference doc exists in `system-spec-kit/references/workflows/`.
- All 12 in-scope commands' §0 cite the shared contract and provide their own per-field default-resolution table.
- Each command's `:confirm` path remains untouched (regression-checked).
- 12 live `:auto` dispatches captured as evidence; ≥10/12 PASS verdicts.

## Related Documents

- `001-deep-review-three-tier-setup/spec.md`
- `002-auto-mode-contract-generalization-to-all-commands/spec.md`
- Origin: `.opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/implementation-summary.md` §Known Limitations (F-Stage-E-001)
- Shared contract (created by 002): `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`
- Memory: `feedback_auto_mode_ask_only_when_ambiguous.md`, `feedback_codex_spawnagent_allowlist.md`, `feedback_gate3_no_tmp_exemption.md`
