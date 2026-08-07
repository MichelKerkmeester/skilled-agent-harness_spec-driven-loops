---
title: "Hook Parity Remediation: Runtime Hook Parity Findings Fix"
description: "Ten runtime hook parity defects closed across OpenCode plugin transport, Codex advisor hooks, Copilot startup routing, Codex PreToolUse safety plus documentation truth-sync."
trigger_phrases:
  - "hook parity remediation findings"
  - "opencode plugin transport diagnostic"
  - "codex pretooluse denylist"
  - "runtime hook parity fix"
  - "session bootstrap codex startup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/001-fix-runtime-hook-parity-findings` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

A 2026-04-21 deep review of runtime hook wiring found 10 defects across OpenCode, Codex and Copilot. The highest-risk issues were an OpenCode plugin path that could silently deliver no code-graph context when the transport plan was absent or unparsable. Codex advisor hook flows could also return no visible advisory on timeout.

Remediation proceeded in four phases. Phase A restored the OpenCode plugin transport path and added operator-visible diagnostics for missing or malformed bridge output. Phase B made Codex prompt hook behavior visible on timeout and replaced invalid policy detection with `.codex/settings.json` evidence. Phase C corrected Copilot startup routing to use the repo-local wrapper and documented Codex startup recovery through `session_bootstrap`. Phase D hardened Codex PreToolUse by accepting denylist aliases, handling camelCase command payloads, denying bare destructive reset commands and keeping hook execution read-only.

All 10 review findings were closed. Typecheck, build, targeted vitest suites and strict spec validation passed across the packet and its parent.

### Added

- Operator-visible diagnostic in the OpenCode plugin transform when bridge transport is absent or unparsable (`spec-kit-compact-code-graph.js`)
- stderr diagnostic in the bridge script when `opencodeTransport` is missing (`spec-kit-compact-code-graph-bridge.mjs`)
- Vitest assertions covering the new diagnostic path in `opencode-plugin.vitest.ts`
- `session_bootstrap` documented as the authoritative Codex startup recovery path in Phase 003 docs

### Changed

- OpenCode `session_resume({ minimal: true })` now returns a parseable transport plan with `transportOnly: true`
- Codex prompt hook surfaces visible advisor context or a stale diagnostic on timeout rather than returning empty
- Codex policy detection uses `.codex/settings.json` JSON validity instead of the unavailable `codex hooks list`
- Copilot startup routing updated to use the repo-local `session-start.sh` wrapper
- Phase 003 spec and decision-record docs cleaned of stale startup-agent acceptance language

### Fixed

- OpenCode plugin transform silently no-opped when the bridge transport plan was absent. It now emits a runtime-status diagnostic.
- Codex PreToolUse did not cover `bash_denylist` alias, `toolInput.command` casing variants or bare `git reset --hard`. All three gaps are now closed.
- PreToolUse hook created filesystem artifacts when the policy file was missing. Execution now stays in-memory.
- Phase 003 strict validation failures caused by missing template anchors and stale command-doc references. All repaired.

### Verification

- Phase A targeted vitest: `tests/session-resume.vitest.ts` and `tests/opencode-plugin.vitest.ts` passed 15 tests (PASS)
- Phase B targeted vitest: Codex hook policy and prompt hook suites passed 29 tests (PASS)
- Phase C targeted vitest: Copilot hook wiring passed 3 tests (PASS)
- Phase D targeted vitest: Codex PreToolUse passed 10 tests (PASS)
- `npm run typecheck` in the MCP server workspace: exit 0 (PASS)
- `npm run build` in the MCP server workspace: exit 0 (PASS)
- Phase 003 strict validation (`validate.sh --strict`): exit 0 (PASS)
- Full workspace Vitest baseline: 578 of 578 test files passed (3 skipped). Test count: 11114 passed, 31 skipped, 11 todo (PASS)
- Deep-review finding gates: 009-T-001, 009-T-002, 009-T-003, 009-C-001 all closed with evidence citations

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Added diagnostic path for absent or unparsable transport plan. Returns runtime-status entry on failure (Modified) |
| `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs` | Added stderr diagnostic when `opencodeTransport` is missing from bridge output (Modified) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | Minimal mode now returns `opencodeTransport` with `transportOnly: true` (Modified) |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Prompt hook surfaces stale advisory on timeout instead of empty result (Modified) |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Added `bash_denylist` alias, camelCase command casing, bare `git reset --hard` denial, in-memory policy default (Modified) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Policy detection rewritten to use `.codex/settings.json` JSON validity (Modified) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Added diagnostic path assertions (Modified) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/codex-pre-tool-use.vitest.ts` | Added alias, casing and bare-reset test cases (Modified) |

### Follow-Ups

- Run `codex hooks list` coverage when the Codex CLI exposes a stable hook-list command to replace the `.codex/settings.json` validity heuristic.
- Add a cluster-export column to the code graph schema when that work ships, to close the deferred T015 item from the adjacent code-graph packet.
