---
title: "Verification Checklist: cli-codex model roster + codex-hook doc alignment"
description: "Level 3 verification checklist across the live model×effort matrix, the four-model roster docs, the CX-002 reframe, the changelog, and the stale codex-surface claim fix."
trigger_phrases: ["cli-codex model roster checklist"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/008-cli-codex-model-roster-and-alignment"
    last_updated_at: "2026-07-14T04:11:03Z"
    last_updated_by: "claude-code"
    recent_action: "Verified all checks with live-matrix and doc-diff evidence"
    next_safe_action: "Reindex renamed cli-codex docs after primary reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-codex model roster + codex-hook doc alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
A check is marked only with evidence: a live matrix cell, a file diff, or a documented roster line. Callability checks require a real `codex exec` return, not an assertion.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Candidate roster enumerated: four models on `fast` with per-model ceilings recorded in `decision-record.md` ADR-001 (`gpt-5.5` ≤ `xhigh`; `luna`/`terra` ≤ `max`; `sol` ≤ `ultra`).
- [x] CHK-002 [P1] Verify-then-document order fixed in `decision-record.md` ADR-003 — no model documented before its cell passes the live matrix.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] The roster is identical across the three authority docs. Same four models and ceilings in `SKILL.md`, `README.md`, and `cli_reference.md` (Supported Models table).
- [x] CHK-011 [P0] The default dispatch is unchanged. `SKILL.md` still resolves "nothing specified" to `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`.
- [x] CHK-012 [P1] The effort scale is extended coherently. `max` and `ultra` added above `xhigh` in the `cli_reference.md` effort-value table with correct per-model applicability.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] The full model×effort matrix returned correctly live. `20/20` PASS via `codex exec` (ChatGPT OAuth, `service_tier=fast`, read-only, ~5s latency).
- [x] CHK-021 [P0] Each model reached its documented ceiling live. `gpt-5.5` 4/4, `gpt-5.6-luna` 5/5, `gpt-5.6-terra` 5/5, `gpt-5.6-sol` 6/6 (only `gpt-5.6-sol` reached `ultra`).
- [x] CHK-022 [P1] Manual testing playbook captures the matrix and matches observed output. `gpt_5_5_model_lock.md` (CX-002) carries the 20-cell result.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] The stale codex-surface claim is corrected. `agent_authoring.md` no longer says "`.codex/` is not present"; it now describes the live mirror (`hooks.json`, `config.toml`, `.codex/agents/*.toml` ↔ `.opencode/agents/`).
- [x] CHK-FIX-002 [P1] `gpt-5.6-terra` documented callable despite no profile. `cli_reference.md` notes it is reachable directly via `-m gpt-5.6-terra` with no dedicated config profile.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] Verification touched no write or credential surface. The 20-cell matrix ran in `read-only` sandbox under existing ChatGPT OAuth; no config or secret was modified.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] The release is recorded. `changelog/v1.6.0.0.md` documents the roster expansion and the unchanged default dispatch.
- [x] CHK-041 [P1] CX-002 reframed without breaking the index. Filename `gpt_5_5_model_lock.md` and id `CX-002` kept; `manual_testing_playbook.md` index entry + global precondition #6 updated.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] The changed files match the declared scope. Six cli-codex docs + new `v1.6.0.0.md` changelog + one `agent_authoring.md` line.
- [x] CHK-051 [P1] No out-of-scope file changed. No codex hook adapter, installer, or `.codex/hooks.json` was touched (those are owned by `007-codex-hook-parity`).
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified | Blocked |
|---|---:|---:|---:|
| P0 | 8 | 8 | 0 |
| P1 | 8 | 8 | 0 |
| P2 | 0 | 0 | 0 |

**Overall**: Complete. The four-model roster is documented with per-model ceilings across `SKILL.md` `1.6.0.0`, `README.md`, and `cli_reference.md`; all twenty model×effort cells were confirmed callable live (`20/20`); CX-002 was reframed in place; and the stale `.codex/` claim was corrected.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [x] CHK-100 [P0] The per-model ceiling contract holds end-to-end. The documented ceilings (`gpt-5.5` ≤ `xhigh`; `luna`/`terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`) match the live matrix exactly — each model reached its ceiling and no further.
<!-- /ANCHOR:arch-verify -->
<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
Not applicable beyond the verification cost: read-only `codex exec` cells returned in roughly 5 seconds each on the `fast` tier, so re-running the matrix is cheap.
<!-- /ANCHOR:perf-verify -->
<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
No deploy step: this is a documentation change. The default dispatch is unchanged, so consuming AIs see additive roster options with no migration.
<!-- /ANCHOR:deploy-ready -->
<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
Scope-locked to the eight declared files; no secret, license, or data-handling surface touched.
<!-- /ANCHOR:compliance-verify -->
<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
The roster authority docs agree on the four models and their ceilings; the changelog and CX-002 playbook cross-reference the same 20-cell evidence.
<!-- /ANCHOR:docs-verify -->
<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
Ready for the orchestrator gate: the live matrix passed `20/20`, the roster is consistent across docs, and strict validation is clean.
<!-- /ANCHOR:sign-off -->
