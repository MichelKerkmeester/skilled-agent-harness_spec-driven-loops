---
title: "Hook Parity Phase 005: OpenCode plugin loader remediation"
description: "OpenCode TUI crash fixed. Plugin helper modules moved out of discovery scope. Legacy parseTransportPlan export hardened. Skill-advisor plugin remapped to OpenCode event and system.transform hooks."
trigger_phrases:
  - "phase 009/005 changelog"
  - "opencode plugin loader"
  - "opencode plugin crash"
  - "plugin2.auth null"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/005-opencode-plugin-loader-bridge-fixes` (Level 3)
> Parent packet: `026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

Running `opencode` in any directory under this repo terminated the TUI with `TypeError: null is not an object (evaluating 'plugin2.auth')`. Root cause: the installed OpenCode 1.3.17 scanner uses a flat `{plugin,plugins}/*.{ts,js}` glob and its legacy plugin-function loader path invoked the named `parseTransportPlan` export, which returned `null` when called with a plugin context object instead of a string. The null hook later crashed at `plugin2.auth`. The fix had two parts: harden `parseTransportPlan` to return `{}` for non-string input, and move the three helper modules out of `.opencode/plugins/` so they cannot become plugin candidates. Phase 4 subsequently remapped the skill-advisor plugin from ignored Claude-Code-style hook names to OpenCode-recognized `event` and `experimental.chat.system.transform` hooks. Phase 5 added status-readiness accuracy and defensive output guards.

### Added

- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/` directory containing the three relocated helper modules (bridge files and message schema).
- `.opencode/plugins/README.md` documenting the entrypoints-only convention and OpenCode 1.3.17 upgrade probe.
- `tests/opencode-plugins-folder-purity.vitest.ts` regression guard that fails if any file in `.opencode/plugins/*.{js,mjs,ts}` lacks a default export.
- Skill-advisor plugin OpenCode hook registrations: `event` (lifecycle readiness and cache cleanup) and `experimental.chat.system.transform` (advisor brief injection into `output.system[]`).
- `tool` registration unchanged. Session-message prompt fallback in the transform handler.
- Defensive output-array guard in `appendAdvisorBrief()` and stable object-sessionID cache key normalization.

### Changed

- `.opencode/plugins/spec-kit-compact-code-graph.js` import paths updated to resolve relocated helpers by relative `import.meta.url`. Named `parseTransportPlan()` export now returns `{}` for non-string input instead of `null`.
- `.opencode/plugins/spec-kit-skill-advisor.js` import paths updated. Hook registrations changed from Claude-Code-style `onUserPromptSubmitted`/`onSessionStart`/`onSessionEnd` to OpenCode `event` and `experimental.chat.system.transform`.
- The plugin folder now contains only two entrypoints plus `README.md`.
- `skill-advisor/handlers/advisor-status.ts` now exposes `advisor_lookups` so cache accounting is explicit (`bridge_invocations` counts subprocess spawns/cache misses, `advisor_lookups` equals `cache_hits + cache_misses`).

### Fixed

- OpenCode TUI no longer crashes with `plugin2.auth`. Both Public repo and Barter (symlinked) directory reach the TUI prompt.
- `parseTransportPlan()` no longer returns `null` when invoked by the legacy loader. Returns `{}` instead.
- Skill-advisor briefs now reach `output.system[]` through OpenCode's transform pipeline instead of being silently ignored.
- Plugin readiness now correctly reflects runtime/handler readiness instead of conflating bridge response success.
- Direct skill-advisor system-transform smoke confirmed: `output.system[0]` contains the advisor brief.

### Verification

- `opencode --version`: PASS (1.3.17)
- Pre-fix probe: reproduced `plugin2.auth` crash
- Post-fix: `ls .opencode/plugins/` shows only `README.md`, `spec-kit-compact-code-graph.js`, `spec-kit-skill-advisor.js`
- `node --check` on both plugin entrypoints: PASS
- Public XDG-writable smoke: PASS (TUI bootstrap, no `plugin2.auth`)
- Barter XDG-writable smoke: PASS
- Advisor bridge direct smoke: PASS (`Advisor: live. Use system-spec-kit 0.92/0.00 pass.`)
- Compact bridge direct smoke: PASS (`--minimal` returned transport JSON)
- Legacy parser guard: PASS (plugin-like object input returned `{}`)
- Regression guard negative test: PASS (temporary no-default-export stub caused vitest red)
- Regression guard positive test: PASS (removal restored green)
- Focused plugin vitest (3 files, 15 tests): PASS
- Focused skill-advisor hook vitest Phase 4 (18 tests): PASS
- Focused skill-advisor hook vitest Phase 5 (23 tests): PASS
- Direct cache-invariant smoke: PASS (`cache_hits=1`, `cache_misses=1`, `advisor_lookups=2`)
- Strict validation: PASS (0 errors, 0 warnings)

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Updated import paths. Hardened `parseTransportPlan` to return `{}` for non-string. |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Updated import paths. Remapped to OpenCode `event` + `experimental.chat.system.transform` hooks. Added defensive output guard and sessionID normalization. |
| `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs` | Moved to `mcp_server/plugin_bridges/`. |
| `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` | Moved to `mcp_server/plugin_bridges/`. |
| `.opencode/plugins/spec-kit-opencode-message-schema.mjs` | Moved to `mcp_server/plugin_bridges/`. |
| `.opencode/plugins/README.md` (NEW) | Documents entrypoints-only convention and upgrade probe. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts` (NEW) | Regression guard against future helper drift. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Updated for relocated helpers and parseTransportPlan guard. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Extended with OpenCode hook shape, transform injection, fail-open, and status coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | Updated bridge import path. |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts` | Added `advisor_lookups` field. |

### Follow-Ups

- Module-global state refactor (P2): still deferred. Per-instance closure or WeakMap for multi-instance races.
- In-flight bridge dedup (P2): still deferred.
