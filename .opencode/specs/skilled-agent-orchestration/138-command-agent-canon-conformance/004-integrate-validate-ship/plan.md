---
title: "Implementation Plan: integrate, validate, and ship the 138 command+agent canon-conformance packet"
description: "Plan for the final child of the 138 packet: run validate.sh --recursive --strict to Errors:0, refresh parent metadata and roll up the parent, confirm every per-file gate (validate_document.py --type command|agent, sync-agents.cjs --check, sync-prompts.cjs --check) green on the integrated tree, and record the FF-push and ~/.codex install as operator-gated deferrals."
trigger_phrases:
  - "138 integrate validate ship plan"
  - "recursive strict validate plan"
  - "138 parent rollup plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship"
    last_updated_at: "2026-07-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Planned the integrate-validate-ship gates; children 000-003 each validate clean"
    next_safe_action: "Orchestrator runs recursive strict validate; FF-push and codex install await operator"
---
# Implementation Plan: integrate, validate, and ship the 138 command+agent canon-conformance packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`validate.sh`), Node.js (`generate-context.js`, `sync-agents.cjs`, `sync-prompts.cjs`), Python (`validate_document.py`), Markdown spec docs |
| **Framework** | system-spec-kit phase-parent validation + rollup; sk-doc create-command/create-agent gates; Codex dual-runtime sync gates |
| **Storage** | Spec-folder tree under `…/138-command-agent-canon-conformance/`; parent `description.json` + `graph-metadata.json` |
| **Testing** | `validate.sh --recursive --strict`; per-file gates (`validate_document.py --type command|agent`, `sync-agents.cjs --check`, `sync-prompts.cjs --check`); spec-doc structure via `template-structure.js compare` |

### Overview
Integrate the four prior phases into one green, shippable unit. Confirm children 000–003 are each green, then run `validate.sh --recursive --strict` on the whole packet to prove they validate together (Errors:0). Refresh the parent's `description.json` and `graph-metadata.json` and roll the parent up so its status and `derived.last_active_child_id` reflect the completed children. Confirm every per-file gate green on the same integrated tree. Record the two outward mutations — the FF-push of `skilled/0041-command-agent-canon` onto `origin/skilled/v4.0.0.0` and the `~/.codex/prompts/` install + stale-symlink repair — as operator-gated Open Questions, not executed here.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| Children green | Children 000-foundations, 001-command-template-conformance, 002-agent-canon-conformance, 003-codex-command-parity each pass `validate.sh --strict` at Errors:0 Warnings:0. |
| Core work landed | Command/agent conformance + codex parity shipped on `skilled/0041-command-agent-canon`: doctor family, five more command families to create-command canon, codex agent-TOML parity gate green, and `sync-prompts.cjs` + 37 thin router-prompts. |
| Integration toolchain | `validate.sh --recursive --strict` validates parent + children as a unit; `generate-context.js` refreshes parent metadata and rolls up the parent. |
| Deferred outward mutations | FF-push (shared-remote) and `~/.codex/prompts/` install (user-home) both cross the worktree boundary and wait on explicit operator confirmation. |

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Children 000–003 each pass `validate.sh --strict` (Errors:0 Warnings:0).
- [x] Core conformance + parity work is committed on the working branch.
- [x] Per-file gate commands are identified (`validate_document.py --type command|agent`, `sync-agents.cjs --check`, `sync-prompts.cjs --check`).

### Definition of Done
- [ ] `validate.sh --recursive --strict` on the packet returns Errors:0 (orchestrator-run).
- [ ] Parent `description.json` + `graph-metadata.json` refreshed and parent rolled up (orchestrator-run).
- [ ] Every per-file gate green on the integrated tree.
- [ ] FF-push of `skilled/0041-command-agent-canon` → `origin/skilled/v4.0.0.0` — DEFERRED (operator confirmation).
- [ ] `~/.codex/prompts/` install + `create` symlink repair — DEFERRED (operator confirmation).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Integrate-validate-ship: a terminal phase that treats the four sibling phases as one unit, proves the unit green with the recursive strict gate, rolls the parent up, and stops at the worktree boundary — every outward mutation (shared-remote push, user-home install) is surfaced and gated on explicit operator confirmation rather than folded silently into "integration".

### Key Components
- **Recursive strict validation**: `validate.sh --recursive --strict` over the parent + children 000–004 → Errors:0.
- **Parent rollup**: `generate-context.js` refreshes `description.json` + `graph-metadata.json`; the parent status and `derived.last_active_child_id` reflect the completed children.
- **Per-file gates**: `validate_document.py --type command|agent` (conformance canon), `sync-agents.cjs --check` (agent-TOML parity), `sync-prompts.cjs --check` (codex command parity).
- **Operator-gated ship**: FF-push (ADR-001) and `~/.codex/prompts/` install (ADR-002), both held for confirmation.

### Data Flow
Verify each child green → run recursive strict validate on the packet → refresh parent metadata + roll up → confirm every per-file gate green on the same tree → surface the two outward mutations as Open Questions. The integration path never crosses the worktree boundary; the ship path (push, home install) only runs after operator confirmation.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm children green
- [x] Confirm children 000–003 each pass `validate.sh --strict` at Errors:0 Warnings:0.
- [x] Confirm the core conformance + parity work is committed on `skilled/0041-command-agent-canon`.

### Phase 2: Integrate + validate + roll up
- [ ] Run `validate.sh --recursive --strict` on the whole packet → Errors:0 (orchestrator-run).
- [ ] Refresh parent `description.json` + `graph-metadata.json` and roll the parent up (orchestrator-run).
- [ ] Confirm every per-file gate green on the integrated tree (`validate_document.py --type command|agent`, `sync-agents.cjs --check`, `sync-prompts.cjs --check`).

### Phase 3: Surface the deferred ship
- [x] Record the FF-push (`skilled/0041-command-agent-canon` → `origin/skilled/v4.0.0.0`) as an operator-gated Open Question (ADR-001).
- [x] Record the `~/.codex/prompts/` install + stale-symlink repair as an operator-gated Open Question (ADR-002).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Recursive strict validation | Parent + children 000–004 | `bash …/scripts/spec/validate.sh <138-folder> --recursive --strict` → Errors:0 |
| Parent rollup | Parent metadata | `description.json` + `graph-metadata.json` present; status + `derived.last_active_child_id` reflect completed children |
| Command-canon gate | Conformed command families | `validate_document.py --type command` → exit 0 |
| Agent-canon gate | Agents | `validate_document.py --type agent` → exit 0 |
| Cross-runtime parity gates | `.codex/agents/*.toml`, `.codex/prompts/*.md` | `sync-agents.cjs --check`, `sync-prompts.cjs --check` → GREEN |
| Spec-doc structure | This child's docs | `template-structure.js compare 2 <doc>.md <path> all` → 0 missing/extra/out-of-order |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Children 000–003 green | Internal precondition | Available (each `--strict` Errors:0) | Recursive validate cannot reach Errors:0 |
| `validate.sh --recursive --strict` | Integration gate | Available | Cannot prove packet-level green |
| `generate-context.js` | Metadata + rollup tool | Available | Parent stays invisible to memory/graph |
| `validate_document.py`, `sync-agents.cjs`, `sync-prompts.cjs` | Per-file gates | Available | Cannot confirm conformance/parity on the integrated tree |
| Operator confirmation | External decision | Pending | Gates only the outward ship (FF-push + `~/.codex/prompts/` install), not the in-branch deliverable |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the recursive validate surfaces an integration defect, or the parent rollup is incorrect, or the packet approach is abandoned.
- **Procedure**: the integration deliverable is spec docs + regenerated parent metadata in the worktree — revert the `004-integrate-validate-ship/` docs and the parent `description.json` / `graph-metadata.json` changes. No shared-remote or user-home state was mutated (both are deferred), so rollback stays inside the worktree with no push to unwind and no home-directory reversal.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Confirm children green) -> Phase 2 (Integrate + validate + roll up) -> Phase 3 (Surface deferred ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm children green | Children 000–003 each `--strict` Errors:0 | Integrate + validate + roll up |
| Integrate + validate + roll up | Green children + integration toolchain | Surface deferred ship |
| Surface deferred ship | Green integrated packet | Operator ship decision (FF-push + `~/.codex/prompts/` install) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm children green | Low (re-run per-child gates) | ~15 min |
| Integrate + validate + roll up | Medium (recursive validate + metadata rollup + per-file gates) | ~1 hour |
| Surface deferred ship | Low (record Open Questions) | ~15 min |
| **Total** | | **~1.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration required.
- [x] Integration output is additive spec docs + regenerated parent metadata; no runtime path altered.
- [x] Outward mutations (FF-push, `~/.codex/prompts/` install) are deferred, so rollback stays inside the worktree.

### Rollback Procedure
1. Revert the `004-integrate-validate-ship/` docs and the parent `description.json` / `graph-metadata.json` changes in the worktree.
2. Confirm the parent rollup is reverted and the child folder is removed.
3. No `origin/skilled/v4.0.0.0` push to unwind and no `~/.codex/prompts/` cleanup needed — both were deferred, not executed.

<!-- /ANCHOR:enhanced-rollback -->
