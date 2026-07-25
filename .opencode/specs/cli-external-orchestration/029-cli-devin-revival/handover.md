---
title: "Session Handover Document: cli-devin revival (029)"
description: "Phase 011 reconciled current Devin hook truth, aligned eleven runtime READMEs, restored the Cursor route-guard discovery mirror, and removed obsolete secret-bearing Zed MCP registrations. Provider-side credential rotation remains an operator action."
trigger_phrases: ["cli-devin handover", "029 handover", "Devin hook truth", "runtime README parity"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival"
    last_updated_at: "2026-07-25T09:57:33Z"
    last_updated_by: "opencode"
    recent_action: "Completed phase 011 hook-truth, runtime README, Cursor mirror and local Zed MCP reconciliation"
    next_safe_action: "Rotate the removed credentials at their providers, then select the next planned revival phase"
    blockers: []
    key_files: ["hook-testing-results.md", "011-hook-truth-and-runtime-readmes/implementation-summary.md", ".devin/hooks.v1.json", ".cursor/hooks/mcp-route-guard.mjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-hook-truth-closeout", parent_session_id: null }
    completion_pct: 36
    open_questions: ["Have the removed provider credentials been revoked and rotated?", "Do PermissionRequest and PostCompaction fire when those events occur?", "Does run_subagent produce the registered tool name and expected payload shape?"]
    answered_questions: ["The earlier packet-wide dormancy conclusion came from an unsupported hooks.v1.json wrapper schema.", "Six lifecycle events fire under devin -p with the corrected top-level schema.", "Phase 011 removed stale current-state claims and local Zed credential copies."]
---
# Session Handover Document: cli-devin Revival (029)

## 1. Handover Summary

Phase 011 is complete. Current documentation now treats the corrected top-level `.devin/hooks.v1.json` schema and tests 10-14 as authoritative while retaining tests 1-9 as explicitly superseded history. Eleven hook and runtime discovery READMEs align with the filesystem and pass the shared README validator.

The Cursor discovery mirror now exposes `mcp-route-guard.mjs` through a relative symlink without changing `.cursor/hooks.json`. The user-local Zed configuration retains only Sequential Thinking and Code Mode; the three approved obsolete registrations and their local credential copies are gone, and Code Mode points to the existing canonical entrypoint.

No phase 011 changes have been committed or pushed. The shared branch still contains extensive unrelated concurrent changes that must remain untouched.

## 2. Confirmed Hook Truth

- Devin CLI version: `3000.2.17`.
- Registration shape: eight top-level events, eleven matcher groups and nineteen commands, with no `version` or `hooks` wrapper keys.
- Observed live under `devin -p`: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `SessionEnd`.
- Model-visible injection confirmation: the bounded rerun returned `YES` for receipt of `SPEC FOLDER QUESTION` context.
- Registered but not observed end to end: `PermissionRequest` and `PostCompaction`.
- Structurally covered but not observed end to end: `run_subagent` and the dispatch deny branch.
- True interactive mode remains untested in the headless environment.

Tests 1-9 remain in `hook-testing-results.md` because their observations explain the failure. Their packet-wide dormancy inference is superseded because those tests used an unsupported registration shape.

## 3. Phase 011 Delivery

| Surface | Result |
|---|---|
| Parent and affected phase docs | Corrected to event-specific current truth while preserving historical evidence. |
| Seven Devin adapter READMEs | Updated to live, unobserved or independently dormant status as supported by evidence. |
| Four discovery READMEs | Claude, Codex, Cursor and Devin inventories aligned and validator-conformant. |
| Cursor route-guard mirror | Relative symlink resolves to the shared source; execution wiring remains unchanged. |
| Zed context servers | Obsolete `figma`, `web-to-mcp` and `spec_kit_memory` blocks removed; Code Mode path corrected. |
| Local credential exposure | Provider credential keys and values removed from Zed settings without copying them into repository artifacts. |
| Upgrade residue | Failed-upgrade backup moved to the approved temporary area for reversible cleanup. |

Canonical delivery evidence and exact commands are recorded in `011-hook-truth-and-runtime-readmes/implementation-summary.md` and `checklist.md`.

## 4. Current Packet Status

| Phase | Status | Note |
|---|---|---|
| 001 contract pin | Complete | Live Devin CLI contract remains authoritative. |
| 002 deep-loop executor | Planned | Restore the fifth deep-loop executor kind. |
| 003 skill packet | Planned | Add `cli-devin` as a hub mode. |
| 004 hook adapter layer | Complete | Session and prompt adapters are built and observed live. |
| 005 model registry | Planned | Restore model and executor registrations. |
| 006 manual-testing playbook | Planned | Requirements now use event-specific observation states. |
| 007 docs and governance | Planned | Restore broader roster and governance surfaces. |
| 008 hook parity | Complete | Full lifecycle registration is built; six event categories are observed live. |
| 009 MCP host integration | Planned | Independent of phase 011; preserve its deny-by-default policy. |
| 010 feature catalog | Planned | Future catalog must retain observed and unobserved event distinctions. |
| 011 hook truth and runtime READMEs | Complete | Current truth, mirrors and local MCP configuration reconciled. |

## 5. Operator Action

The local copies of the exposed provider credentials are gone, but repository access cannot prove remote revocation. Revoke and replace the affected credentials in their provider dashboards before treating the exposure as fully closed. Do not restore the removed values from shell history, logs or old editor snapshots.

## 6. Safe Continuation

1. Complete provider-side credential revocation and rotation.
2. Select one of the still-planned revival phases based on the dependency map in `spec.md`; folder numbering alone does not define dependency order.
3. Re-read the selected child spec before implementation and preserve its explicit scope.
4. Keep using target allowlists because concurrent sessions are modifying this clone.
5. Run the child strict gate and the recursive parent gate before any completion claim.

## 7. Operational Safeguards

- Do not replay archived deprecation diffs mechanically; current paths and product behavior have changed.
- Do not describe an event as broken merely because it did not occur in a test session.
- Do not alter `.devin/hooks.v1.json` unless new evidence contradicts the verified eight-event, eleven-group, nineteen-command contract.
- Do not stage with `git add -A` or `git add .`; use explicit phase paths only if the operator later requests a commit.
- Do not revert unrelated dirty files or archive moves in the shared worktree.

## Related Documents

- `spec.md`: parent purpose, phase map and dependencies.
- `hook-testing-results.md`: canonical live evidence and superseded tests.
- `011-hook-truth-and-runtime-readmes/implementation-summary.md`: phase 011 delivery and verification receipts.
- `004-devin-hook-adapter-layer/implementation-summary.md`: corrected two-event adapter status.
- `008-devin-hook-parity/implementation-summary.md`: corrected lifecycle parity status and caveats.
- `.devin/hooks.v1.json`: current registration authority.
