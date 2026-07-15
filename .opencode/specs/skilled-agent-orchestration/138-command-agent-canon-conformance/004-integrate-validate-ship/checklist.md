---
title: "Verification Checklist: integrate, validate, and ship the 138 command+agent canon-conformance packet"
description: "Verifier contract for the final child of the 138 packet: children green, recursive strict validate Errors:0, parent metadata refreshed + rolled up, every per-file gate green on the integrated tree, and the FF-push + ~/.codex install performed under operator direction."
trigger_phrases:
  - "138 integrate validate ship checklist"
  - "recursive strict validate verification"
  - "138 parent rollup check"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship"
    last_updated_at: "2026-07-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled verifier contract to shipped state; gates green, ship + install done"
    next_safe_action: "Commit the closeout reconciliation to finalize the completion claim"
---
# Verification Checklist: integrate, validate, and ship the 138 command+agent canon-conformance packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Children 000–003 each green before integration; evidence: `validate.sh --strict` on `000-foundations`, `001-command-template-conformance`, `002-agent-canon-conformance`, `003-codex-command-parity` each returns Errors:0 Warnings:0.
- [x] CHK-002 [P0] Core conformance + parity work committed on the working branch; evidence: commits `95b5a60240` (doctor family), `52d17a8075` (five more command families → create-command canon), `e893d9adde` (codex agent-TOML parity gate), `c1771fbbf3` (`sync-prompts.cjs` + 37 thin router-prompts) on `skilled/0041-command-agent-canon`.
- [x] CHK-003 [P1] Integration toolchain + per-file gates identified; evidence: `validate.sh --recursive --strict`, `generate-context.js`, `validate_document.py --type command|agent`, `sync-agents.cjs --check`, `sync-prompts.cjs --check`.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No child conformance work reopened; evidence: `spec.md` §3 Out of Scope holds 000–003 frozen — this phase integrates and validates, it does not re-edit their conformance work.
- [x] CHK-011 [P0] Recursive strict validate returns Errors:0; evidence: `validate.sh --recursive --strict` on the 138 packet returns Errors:0 Warnings:0 RESULT: PASSED against `skilled/v4.0.0.0` (HEAD == `origin/skilled/v4.0.0.0`, 2026-07-14).
- [x] CHK-012 [P1] Parent metadata refreshed + rolled up; evidence: `description.json` + `graph-metadata.json` regenerated with `derived.children_ids` 000–004 and status reflecting the completed children (2026-07-14).
- [x] CHK-013 [P1] Comment hygiene N/A — no code authored here; evidence: this phase produces only spec docs under `004-integrate-validate-ship/` plus regenerated parent metadata, no source with comments.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every per-file gate green on the integrated tree; evidence: `sync-prompts.cjs --check` → PASS 37 in sync (exit 0), `sync-agents.cjs --check` → PASS 13 in sync (exit 0), and `validate_document.py --type command|agent` clean, all on `skilled/v4.0.0.0` (2026-07-14).
- [x] CHK-021 [P0] This child's spec-doc structure is clean; evidence: `template-structure.js compare 2 <doc>.md <path> all` reports 0 missing / 0 out-of-order / 0 extra for `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- [x] CHK-022 [P1] Children individually re-confirmed green; evidence: each of `00{0,1,2,3}-*/` passes `validate.sh --strict` at Errors:0, the precondition for the packet-level recursive run.
- [x] CHK-023 [P1] Recursive-validate scope covers parent + 000–004; evidence: `plan.md` §5 Testing Strategy scopes `validate.sh --recursive --strict <138-folder>` over the parent and all five children.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Deliverable matches the stated finding class (integrate + validate + ship a phased packet); evidence: `spec.md` §2 frames the phase as proving the four children green as an integrated unit and rolling up the parent, not reopening child work.
- [x] CHK-FIX-002 [P0] Integration coverage is complete across all children; evidence: `spec.md` §3 and `plan.md` §4 cover children 000–003 plus this final child in the recursive validate + parent rollup.
- [x] CHK-FIX-003 [P1] Outward mutations are recorded and resolved, not dropped; evidence: `decision-record.md` ADR-001 / ADR-002 record the FF-push and `~/.codex/prompts/` install as operator-gated and now mark both performed.
- [x] CHK-FIX-004 [P1] Evidence pinned to this packet's children and commits; evidence: `implementation-summary.md` §Verification records the children's green state, the four commits, and the deferred ship items.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added; evidence: the phase produces spec-doc Markdown under `004-integrate-validate-ship/` and regenerated parent metadata JSON — no credentials or tokens.
- [x] CHK-031 [P1] No unconfirmed outward mutation; evidence: both outward mutations later proceeded under operator direction — the packet content is on `origin/skilled/v4.0.0.0` (HEAD == origin, 0/0) and the 37 prompts are installed in `~/.codex/prompts/` (0 symlinks; the stale `create` symlink was removed). ADR-001 / ADR-002 resolved.
- [x] CHK-032 [P2] Integration authored in an isolated worktree, then landed cleanly; evidence: work was staged under `.worktrees/0041-skilled-command-agent-canon` and integrated onto `skilled/v4.0.0.0`; the transient worktree is retired.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary are synchronized; evidence: all six docs under `004-integrate-validate-ship/` describe the same integration-complete-in-branch + ship-deferred state.
- [x] CHK-041 [P1] The ship is documented, not silently dropped; evidence: `decision-record.md` ADR-001 / ADR-002 record the operator-gated FF-push and `~/.codex/prompts/` install and their resolution.
- [x] CHK-042 [P2] The broken symlink is characterized precisely; evidence: `decision-record.md` ADR-002 records `~/.codex/prompts/create -> ../../.opencode/command/create` (singular "command", target absent) verbatim.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The child lives in the correct tree; evidence: this doc set is under `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship/`.
- [x] CHK-051 [P1] No stray files; evidence: the packet content is committed on `skilled/v4.0.0.0`; the transient authoring worktree `.worktrees/0041-skilled-command-agent-canon` is retired.
- [x] CHK-052 [P2] Parent metadata is regenerable, not hand-authored; evidence: `description.json` + `graph-metadata.json` are produced by `generate-context.js`, not written by hand.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2/N/A Items | 3 | 3/3 |

**Verification Date**: 2026-07-14

<!-- /ANCHOR:summary -->
