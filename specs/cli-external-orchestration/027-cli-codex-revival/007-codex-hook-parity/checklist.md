---
title: "Verification Checklist: Codex hook/plugin parity"
description: "Level 3 verification checklist across capability spike, adapters, wiring, install, and the fixture-plus-live test matrix."
trigger_phrases: ["Codex hook parity checklist"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T20:11:19Z"
    last_updated_by: "claude-code"
    recent_action: "Verified all checks with fixture + live evidence"
    next_safe_action: "Re-point installer at the primary checkout once it reconciles to v4"
    blockers: []
    completion_pct: 100
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
- [x] CHK-010 [P0] Every adapter reuses its neutral core; cores are diff-unchanged. Landed diff `cae68c0d44` adds only `codex/` adapter files; no `spec-gate-core.mjs` / `freshness-core.cjs` / `dispatch-audit.mjs` change.
- [x] CHK-011 [P0] Every adapter fails open on empty and malformed stdin (exit 0, no crash). Fixture `empty-stdin` + `malformed-json` → `exit 0` for all eight (33/33 matrix).
- [x] CHK-012 [P1] Tool-name normalization maps `exec`/`apply_patch`/`edit` correctly per core. `CODEX_TOOL_MAP` in `spec-gate-enforce.mjs` and `CODEX_EDIT_TOOLS` in the PostToolUse adapters; the deny fixture drove `apply_patch`→`write`.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Fixture stdin-pipe smoke passes for all adapters. `fixture-smoke` matrix: `33/33` PASS, including a real `permissionDecision` deny envelope and a `runtime:"codex"` audit line.
- [x] CHK-021 [P0] Live `codex exec` matrix confirms firing and, for deny guards, blocking. Live Codex 0.144.2: `SessionStart`/`UserPromptSubmit` Completed, `spec-gate-classify` wrote `.spec-gate-state/<hex(session_id)>.json`, and a real `apply_patch` write was **blocked** by `spec-gate-enforce` (Codex router `Command blocked by PreToolUse hook: DENIED…`; file not created; `would-deny` logged).
- [x] CHK-022 [P1] Manual testing playbook entries exist and match observed output. `codex_hook_parity.md` under `plugins_and_hooks`, indexed in the hub playbook, with the real fixture + live captures.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Every Claude hook / OpenCode plugin has an adapter, native equivalent, or documented gap. The 11-row coverage map in `implementation-summary.md` is all `Done`.
- [x] CHK-FIX-002 [P1] Dormant route-guard and folded task-guard are documented, not faked. `mcp-route-guard.cjs` header documents dormancy; the `task-dispatch-guard` is folded into `CODEX_EXEC_SHAPE` in the dispatch adapters.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] The installer backs up `~/.codex/hooks.json` and preserves Superset/user entries. Real run wrote `hooks.json.bak-2026-07-13T18-26-29-443Z` and preserved the three `notify.sh` entries; re-run added `0`.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] The 0.144.2 event set and install location are documented. The contract lives in `decision-record.md` (ADR-001: full event enum + output schema) rather than a separate `hook_contract.md`; the install location (`~/.codex/hooks.json`) is documented there and in `install-codex-hooks.mjs`.
- [x] CHK-041 [P1] The coverage map (adapter / native / gap) is recorded in the implementation summary. The 11-row map is in `implementation-summary.md`.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] Codex adapters are siblings of their Claude counterparts under `runtime/hooks/codex/`. All eight live under a `codex/` sibling dir (`runtime/hooks/codex/`, `scripts/hooks/codex/`, `mcp_server/hooks/codex/`).
- [x] CHK-051 [P1] No files outside the declared scope are modified. Landed code diff `cae68c0d44` touches only the eight adapters, `.codex/hooks.json`, and `install-codex-hooks.mjs`; docs + playbook are in-scope authored artifacts.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified | Blocked |
|---|---:|---:|---:|
| P0 | 8 | 8 | 0 |
| P1 | 8 | 8 | 0 |
| P2 | 0 | 0 | 0 |

**Overall**: Complete. All adapters built, wired, installed, and verified by a 33/33 fixture matrix plus a live `codex exec` acceptance run — SessionStart 5/5, UserPromptSubmit 3/3, PreToolUse deny **blocked** a real `apply_patch`, and Stop 4/4 Completed (0 Failed).
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [x] CHK-100 [P0] Direct-core adapter model holds; lifecycle delegation model is untouched. Each guard adapter `import`/`require`s its neutral core directly; the child-004 lifecycle adapters keep their `runClaudeHookAdapter` delegation, and no core was modified.
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
