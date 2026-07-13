---
title: "Verification Checklist: Codex hook/plugin parity"
description: "Level 3 verification checklist across capability spike, adapters, wiring, install, and the fixture-plus-live test matrix."
trigger_phrases: ["Codex hook parity checklist"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T18:17:53Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the Level 3 checklist"
    next_safe_action: "Implement the eight portable Codex guard adapters"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Codex hook/plugin parity
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
A check is marked only with evidence: a command output, a file diff, or a live-session observation. Deny-behavioral checks require a live `codex exec` run.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Capability spike complete; contract pinned in `decision-record.md` (ADR-001, Codex 0.144.2 event enum + output schema).
- [x] CHK-002 [P1] Neutral cores and entry functions identified per adapter in `decision-record.md` ADR-002 (`evaluateMutation`, `evaluateEdit`, `evaluateCompletionEvidence`, `evaluateNativeMcpCall`).
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Every adapter reuses its neutral core; cores are diff-unchanged.
- [ ] CHK-011 [P0] Every adapter fails open on empty and malformed stdin (exit 0, no crash).
- [ ] CHK-012 [P1] Tool-name normalization maps `exec`/`apply_patch`/`edit` correctly per core.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] Fixture stdin-pipe smoke passes for all adapters.
- [ ] CHK-021 [P0] Live `codex exec` matrix confirms firing and, for deny guards, blocking.
- [ ] CHK-022 [P1] Manual testing playbook entries exist and match observed output.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Every Claude hook / OpenCode plugin has an adapter, native equivalent, or documented gap.
- [ ] CHK-FIX-002 [P1] Dormant route-guard and folded task-guard are documented, not faked.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [ ] CHK-030 [P0] The installer backs up `~/.codex/hooks.json` and preserves Superset/user entries.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] `hook_contract.md` reflects the 0.144.2 event set and install location.
- [ ] CHK-041 [P1] The coverage map (adapter / native / gap) is recorded in the implementation summary.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-050 [P1] Codex adapters are siblings of their Claude counterparts under `runtime/hooks/codex/`.
- [ ] CHK-051 [P1] No files outside the declared scope are modified.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified | Blocked |
|---|---:|---:|---:|
| P0 | 8 | 1 | 0 |
| P1 | 8 | 1 | 0 |
| P2 | 0 | 0 | 0 |

**Overall**: In progress. Spike complete; adapters, wiring, install, and the test matrix remain.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [ ] CHK-100 [P0] Direct-core adapter model holds; lifecycle delegation model is untouched.
<!-- /ANCHOR:arch-verify -->
<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
Not applicable beyond per-hook timeouts; adapters are thin translators with short registered timeouts.
<!-- /ANCHOR:perf-verify -->
<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
The installer is the deploy step: idempotent, backed up, revertible by restoring the backup.
<!-- /ANCHOR:deploy-ready -->
<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
Scope-locked to the declared files; no secret, license, or data-handling surface touched.
<!-- /ANCHOR:compliance-verify -->
<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
Source-of-truth adapters and the hook contract agree; cross-references resolve.
<!-- /ANCHOR:docs-verify -->
<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
Ready for orchestrator gate once the fixture and live matrices pass and strict validation is clean.
<!-- /ANCHOR:sign-off -->
