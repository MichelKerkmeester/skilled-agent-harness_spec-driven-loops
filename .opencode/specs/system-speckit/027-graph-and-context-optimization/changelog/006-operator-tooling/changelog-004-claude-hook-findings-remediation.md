---
title: "Hook Parity Phase 004: Claude hook findings remediation"
description: "Three end-to-end findings fixed: advisor freshness stuck in stale-loop because sourceSignature was null, .claude/settings.local.json schema mixing causing surplus hook invocations, and no documented multi-turn regression harness for hook testing."
trigger_phrases:
  - "phase 009/004 changelog"
  - "claude hook findings"
  - "advisor freshness stale"
  - "sourceSignature null"
  - "settings.local.json schema"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity` (Level 2)
> Parent packet: `027-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

End-to-end Claude Code hook testing surfaced three defects. (A) The skill-advisor freshness contract was broken: `skill-graph-generation.json` reported `state: "live"` but every advisor probe returned `freshness: "stale"` because `sourceSignature` was persisted as `null`. (B) `.claude/settings.local.json` mixed Copilot-schema fields (`bash`, `timeoutSec`) with Claude-schema fields inside nested hook blocks, causing three hooks to fire per `UserPromptSubmit` event instead of the expected two. (C) No documented multi-turn regression harness existed for skill-advisor testing, making per-prompt verification expensive.

### Added

- `skill_graph_scan` now computes and persists `sourceSignature` through the atomic generation writer. The freshness and status readers prefer the persisted signature when present, avoiding reliance on SQLite main-file mtime behavior.
- Multi-turn stream-json regression harness documented in `skill-advisor-hook-validation.md` section 9: a five-prompt fixture with `claude -p --input-format stream-json`, cost rationale, and disable-flag notes.
- The manual testing playbook cross-references the new harness section.

### Changed

- `.claude/settings.local.json` hook entries now use Claude-canonical hook-group shape. The outer `bash`, `timeoutSec`, and non-canonical `type` wrapper fields were removed from the four event blocks. Nested `hooks` entries carry the executable command schema.
- `skill-advisor/lib/freshness.ts` now exports source-signature computation and reconciles freshness against the persisted signature.
- `skill-advisor/handlers/advisor-status.ts` now uses the persisted signature for status reconciliation.
- `context-server.ts` and `skill-advisor/lib/daemon/watcher.ts` now publish source signatures for skill graph indexing events.

### Fixed

- Advisor freshness now resolves to `live` after a successful `skill_graph_scan` with no intervening source changes. Previously every probe returned `stale` with `SOURCE_NEWER_THAN_SKILL_GRAPH` because `sourceSignature` was null.
- `UserPromptSubmit` now fires exactly 2 hooks per event (Spec Kit + GitKraken global). Previously 3 fired because the outer Copilot-schema wrapper was treated as a third hook entry.
- Direct hook smoke confirmed: `freshness: "live"` with `status: "ok"`.
- Disable flag (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`) confirmed: stdout `{}`, stderr `status: "skipped"`.

### Verification

- `npm run build`: PASS
- `jq` schema check: empty output (no `bash` or `timeoutSec` fields remain)
- Direct advisor hook smoke: PASS (`freshness: "live"`, `Advisor: live. Use sk-git 0.84/0.00 pass`)
- Disable-flag smoke: PASS (`freshness: "unavailable"`, status `"skipped"`)
- Advisor regression suite (3 files, 4 tests): PASS (corpus parity 200/200, cache-hit p95 0.025ms)
- Live Claude session: BLOCKED (unauthenticated in sandbox, AS-003 and AS-004 deferred)

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts` | Export source-signature computation and reconcile with persisted signatures. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts` | Preserve parsed `sourceSignature` in advisor generation snapshots. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` | Publish scan-time `sourceSignature` through the atomic writer. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Publish source signatures for context-server skill graph indexing. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts` | Publish source signatures for daemon reindex events. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts` | Use persisted signature for status freshness reconciliation. |
| `.claude/settings.local.json` | Normalize to Claude-canonical hook-group shape (removed Copilot-schema fields). |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Add section 9 with multi-turn stream-json harness. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Add section 9 cross-reference. |

### Follow-Ups

- AS-003 (hook count parity) is blocked by user-global GitKraken/SUPERSET hooks that cannot be changed from this packet.
- AS-004 (live Claude session) is blocked by sandbox authentication.
