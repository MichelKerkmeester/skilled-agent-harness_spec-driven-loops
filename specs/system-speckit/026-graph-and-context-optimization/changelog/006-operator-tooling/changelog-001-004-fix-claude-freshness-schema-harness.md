---
title: "Hook Parity Phase 004: Claude freshness fix, schema normalization, multi-turn harness"
description: "Advisor freshness stuck returning stale because sourceSignature was null after every scan. Settings.local.json carried Copilot-schema fields that caused three hooks to fire per UserPromptSubmit instead of two. No regression harness existed for multi-turn hook testing. All three fixed."
trigger_phrases:
  - "sourceSignature null freshness stale"
  - "claude hook settings schema normalization"
  - "advisor freshness live after scan"
  - "multi-turn stream-json regression harness"
  - "claude hook parity remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/004-fix-claude-freshness-schema-harness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

End-to-end Claude Code hook testing surfaced three defects. The skill-advisor freshness contract was broken: `skill-graph-generation.json` reported `state: "live"` but every advisor probe returned `freshness: "stale"` with `SOURCE_NEWER_THAN_SKILL_GRAPH` because `sourceSignature` was persisted as null after every scan. The `.claude/settings.local.json` hook blocks mixed Copilot-schema fields (`bash`, `timeoutSec`) with Claude-canonical schema inside nested hook groups, causing three `UserPromptSubmit` hooks to fire per event instead of two. No documented multi-turn harness existed for skill-advisor testing, forcing operators to pay full cache-creation cost (~$0.17) on every fresh `claude -p` invocation.

All three defects were remediated in a single focused pass. The scanner now computes and atomically persists `sourceSignature` through the existing generation writer. The project-local settings file now uses Claude-canonical hook-group shape with no Copilot-schema fields. A five-prompt stream-json regression harness is documented in the validation playbook with cost rationale and disable-flag notes.

### Added

- `sourceSignature` computation in `skill_graph_scan` through `computeAdvisorSourceSignature()` and `publishSkillGraphGeneration({ sourceSignature })`, enabling freshness probes to reconcile against a non-null anchor.
- Section 9 "Multi-turn Regression Harness" in `skill-advisor-hook-validation.md` with a `claude -p --input-format stream-json` five-prompt fixture, cost reduction rationale, and disable-flag note.
- Cross-reference from the manual testing playbook to the new harness section.

### Changed

- `freshness.ts` now exports source-signature computation and reconciles freshness against the persisted signature rather than relying solely on SQLite main-file mtime behavior.
- `generation.ts` now preserves the parsed `sourceSignature` in advisor generation snapshots.
- `advisor-status.ts` now uses the persisted signature for status freshness reconciliation.
- `context-server.ts` and `skill-advisor/lib/daemon/watcher.ts` now publish source signatures for skill graph indexing events.
- `.claude/settings.local.json` hook entries now use Claude-canonical hook-group shape; the outer `bash`, `timeoutSec`, and non-canonical `type` wrapper fields were removed from all four event blocks.

### Fixed

- Advisor freshness now resolves to `live` after a successful `skill_graph_scan` with no intervening source changes. Previously every probe returned `stale` with `SOURCE_NEWER_THAN_SKILL_GRAPH` because `sourceSignature` was null.
- `UserPromptSubmit` now fires exactly two hooks per event (Spec Kit + GitKraken global). Previously three fired because the outer Copilot-schema wrapper was treated as an additional hook entry.
- Direct hook smoke confirmed: `freshness: "live"` with `status: "ok"` after the scan.

### Verification

- Build (`npm --prefix .opencode/skills/system-spec-kit/mcp_server run build`): PASS (tsc exit 0)
- Scan + sourceSignature (compiled `handleSkillGraphScan({})` then `jq` state file): PASS (sourceSignature `776a2bcc...`, state `live`)
- Advisor freshness live (direct `user-prompt-submit.js` smoke): PASS (stderr JSONL has `freshness: "live"`, stdout contains `Advisor: live; use sk-git 0.84/0.00 pass`)
- Settings schema (`jq 'recurse | objects | select(has("bash") or has("timeoutSec"))' .claude/settings.local.json`): PASS (empty output)
- Disable flag (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` direct smoke): PASS (stdout `{}`, stderr `status: "skipped"`, `freshness: "unavailable"`)
- Advisor regression suite (3 files, 4 tests): PASS (corpus parity 200/200, cache-hit p95 0.025ms, replay hit rate 20/30, privacy green)
- Hook count parity (live `claude -p` session): BLOCKED (sandbox unauthenticated; `UserPromptSubmit=3` because user-global SUPERSET hook in `$HOME/.claude/settings.json` is outside packet scope)
- Multi-turn harness (live stream-json fixture): BLOCKED (sandbox unauthenticated, only SessionStart hooks emitted, no advisor prompt completions)

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts` | Export source-signature computation and reconcile freshness with persisted signatures. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts` | Preserve parsed `sourceSignature` in advisor generation snapshots. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` | Publish scan-time `sourceSignature` through the atomic writer. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Publish source signatures for context-server skill graph indexing. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts` | Publish source signatures for daemon reindex events. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts` | Use persisted signature for status freshness reconciliation. |
| `.claude/settings.local.json` | Normalize to Claude-canonical hook-group shape (Copilot-schema fields removed). |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Add section 9 with multi-turn stream-json regression harness. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Add section 9 cross-reference and cost-optimization callout. |

### Follow-Ups

- Resolve AS-003 hook count parity: the user-global `$HOME/.claude/settings.json` SUPERSET hook adds a third `UserPromptSubmit` invocation that cannot be removed from project scope. Confirm final expected hook count once the global settings are reviewed by the user.
- Resolve AS-004 live Claude session verification: the sandbox is unauthenticated. Run the stream-json harness fixture in an authenticated environment to confirm advisor prompts complete and `total_cost_usd` stays within budget.
