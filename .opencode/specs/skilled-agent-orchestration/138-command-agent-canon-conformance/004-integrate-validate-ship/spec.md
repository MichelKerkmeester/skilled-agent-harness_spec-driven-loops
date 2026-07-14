---
title: "Feature Specification: integrate, validate, and ship the 138 command+agent canon-conformance packet — recursive strict validation, parent rollup, and operator-gated ship"
description: "Final child of the 138 packet: integrate the four prior phases (000-foundations, 001-command-template-conformance, 002-agent-canon-conformance, 003-codex-command-parity), prove the whole packet green via validate.sh --recursive --strict (Errors:0), refresh parent metadata (description.json + graph-metadata.json) and roll up the parent, and confirm every per-file gate (validate_document.py --type command|agent, sync-agents.cjs --check, sync-prompts.cjs --check). The two outward mutations — FF-pushing branch skilled/0041-command-agent-canon to origin/skilled/v4.0.0.0 and installing the 37 codex prompts into ~/.codex/prompts/ with the stale create symlink repaired — are deferred to explicit operator confirmation (blast-radius discipline)."
trigger_phrases:
  - "138 integrate validate ship"
  - "command agent canon parent rollup"
  - "recursive strict validate 138"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship"
    last_updated_at: "2026-07-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored 004 integrate-validate-ship doc set mirroring the passing 003 sibling structure"
    next_safe_action: "Orchestrator runs recursive strict validate then rolls up the 138 parent"
---
# Feature Specification: integrate, validate, and ship the 138 command+agent canon-conformance packet — recursive strict validation, parent rollup, and operator-gated ship

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/0041-command-agent-canon` (worktree `.worktrees/0041-skilled-command-agent-canon`) |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/138-command-agent-canon-conformance |
| **Predecessor** | 003-codex-command-parity (codex command parity — thin router-prompts + `sync-prompts.cjs --check` gate) |
| **Successor** | None (final child; parent rollup completes the packet) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 000–003 each land their own conformance work and each pass `validate.sh --strict` independently, but "each child is green" is not the same claim as "the packet is green as an integrated unit". Nothing yet proves that the four children validate together under `validate.sh --recursive --strict`, that the parent's derived metadata (`description.json`, `graph-metadata.json`) reflects the finished children, or that every per-file gate the packet introduced — `validate_document.py --type command|agent`, `sync-agents.cjs --check`, and the new `sync-prompts.cjs --check` — is simultaneously green on the same tree. And the packet's two OUTWARD mutations are still open: the working branch `skilled/0041-command-agent-canon` has not been fast-forwarded onto `origin/skilled/v4.0.0.0`, and the 37 generated codex prompts have not been installed into the user's `~/.codex/prompts/` (with its stale `create` symlink still broken). Both cross the repo/worktree boundary into shared-remote and user-home blast radius, so they cannot be done silently as part of an "integration" step.

### Purpose
Integrate, validate, and ship the whole 138 packet. Prove the four children pass together via `validate.sh --recursive --strict` at Errors:0; refresh the parent's `description.json` and `graph-metadata.json` and roll the parent up to reflect its completed children; and confirm every per-file gate green on the integrated tree (`validate_document.py --type command|agent` across the conformed command families and agents, `sync-agents.cjs --check`, `sync-prompts.cjs --check`). The two outward mutations are surfaced explicitly and DEFERRED to operator sign-off rather than executed here: the FF-push of `skilled/0041-command-agent-canon` → `origin/skilled/v4.0.0.0`, and the `~/.codex/prompts/` install + stale-symlink repair. This keeps the in-branch integration deliverable complete and reviewable while every higher-blast action waits on an explicit go.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `validate.sh --recursive --strict` on the whole `138-command-agent-canon-conformance` packet and confirm Errors:0.
- Refresh parent metadata (`description.json`, `graph-metadata.json`) and roll the phase parent up so its status and `derived.last_active_child_id` reflect the completed children 000–003 plus this final child.
- Confirm every per-file gate green on the integrated tree: `validate_document.py --type command` across the conformed command families, `--type agent` across the agents, `sync-agents.cjs --check`, and `sync-prompts.cjs --check`.
- Author this child's Level-2 spec-doc set and record the two deferred outward mutations as Open Questions rather than failures.

### Out of Scope
- Re-doing any child's conformance work — 000–003 own their edits; this phase integrates and validates them, it does not reopen them.
- Executing the FF-push of `skilled/0041-command-agent-canon` onto `origin/skilled/v4.0.0.0` — deferred to operator confirmation (shared-remote blast radius; see Open Questions and `decision-record.md` ADR-001).
- Installing the 37 codex prompts into `~/.codex/prompts/` and repairing the stale `create` symlink — deferred to operator confirmation (user-home blast radius; see Open Questions and `decision-record.md` ADR-002).
- CI wiring of the packet's gates — a plausible parent-level follow-on, not built here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `…/138-…/description.json` | Regenerate | Parent metadata refreshed to reflect completed children |
| `…/138-…/graph-metadata.json` | Regenerate | Parent rollup: status + `derived.last_active_child_id` reflect 000–003 + 004 |
| `…/138-…/004-integrate-validate-ship/*.md` | Create | This child's Level-2 spec-doc set (spec/plan/tasks/checklist/implementation-summary/decision-record) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- REQ-001: `validate.sh --recursive --strict` on the `138-command-agent-canon-conformance` packet returns Errors:0 — the four children validate together as an integrated unit, not only in isolation.
- REQ-002: Parent metadata is present and rolled up — `description.json` and `graph-metadata.json` at the parent reflect the completed children (status + `derived.last_active_child_id`), so the packet is visible to memory search and graph traversal.
- REQ-003: Every per-file gate is green on the integrated tree — `validate_document.py --type command` (conformed command families), `--type agent` (agents), `sync-agents.cjs --check`, and `sync-prompts.cjs --check` all pass simultaneously.

### P1 - Required (complete OR user-approved deferral)
- REQ-004: Ship (FF-push of `skilled/0041-command-agent-canon` → `origin/skilled/v4.0.0.0`) is DEFERRED pending explicit operator confirmation (shared-remote blast radius). Tracked as an Open Question; the in-branch integration deliverable is complete regardless. See ADR-001.
- REQ-005: The `~/.codex/prompts/` install of the 37 prompts and the repair of the stale `create` symlink are DEFERRED pending explicit operator confirmation (user-home blast radius). Tracked as an Open Question; the in-repo `.codex/prompts/` tree + `--check` gate are complete regardless. See ADR-002.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Acceptance Scenarios
- Given the packet, when `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <138-folder> --recursive --strict` runs, then it reports Errors:0 across the parent and children 000–004.
- Given the parent folder, when its metadata is inspected, then `description.json` and `graph-metadata.json` exist and `graph-metadata.json` rolls the parent up to reflect the completed children (status + `derived.last_active_child_id`).
- Given the integrated tree, when each per-file gate is run, then `validate_document.py --type command|agent`, `sync-agents.cjs --check`, and `sync-prompts.cjs --check` all pass on the same tree.
- Given the two outward mutations, when the phase closes, then the FF-push and the `~/.codex/prompts/` install are recorded as operator-gated Open Questions — not silently executed and not marked failed.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Integration-vs-isolation risk**: a child that passes `--strict` alone can still break a `--recursive` run (parent-child link warnings, metadata drift). Mitigation: REQ-001 runs the recursive gate on the whole packet, not just per child.
- **Shared-remote mutation risk**: FF-pushing `skilled/0041-command-agent-canon` onto `origin/skilled/v4.0.0.0` touches a shared branch other sessions build on. Mitigation: the push is deferred to explicit operator confirmation (REQ-004 / ADR-001); the in-branch deliverable does not depend on it.
- **User-home mutation risk**: installing to `~/.codex/prompts/` and repairing the `create` symlink touch pre-existing user files from an older flat convention. Mitigation: deferred to explicit operator confirmation (REQ-005 / ADR-002); the in-repo `.codex/prompts/` tree already carries the parity.
- **Dependency**: children 000–003 must each be green before integration; the parent metadata generator (`generate-context.js`) and `validate.sh --recursive --strict` are the integration toolchain; the per-file gates (`validate_document.py`, `sync-agents.cjs`, `sync-prompts.cjs`) are the packet's own conformance contracts.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Deferred (operator confirmation required) — ship:** Should branch `skilled/0041-command-agent-canon` be fast-forwarded onto `origin/skilled/v4.0.0.0`? This is a shared-remote mutation onto a branch other sessions track, so it is held pending explicit operator confirmation. The in-branch integration (recursive strict validate + parent rollup) is complete independent of this decision. See `decision-record.md` ADR-001.
- **Deferred (operator confirmation required) — codex home install:** Should the 37 generated prompts be installed into the user's `~/.codex/prompts/`, and should the stale `create` symlink (broken link → `../../.opencode/command/create`, singular "command", target absent) be repaired? Both are user-HOME mutations over pre-existing files from an older flat convention, held pending explicit operator confirmation. The in-repo `.codex/prompts/` tree and its `--check` gate (phase 003) are complete regardless. See `decision-record.md` ADR-002.

<!-- /ANCHOR:questions -->
