---
title: "Hook Parity Phase 005: OpenCode Plugin Loader Remediation"
description: "OpenCode TUI crash remediation: helper modules relocated out of the plugin discovery folder, parseTransportPlan fail-opened against legacy loader invocation, skill-advisor plugin remapped to OpenCode-recognized hooks. Status accuracy and defensive guards added in Phase 5."
trigger_phrases:
  - "opencode plugin loader crash fix"
  - "plugin2.auth null fix"
  - "opencode plugin bridge isolation"
  - "skill-advisor hook remap opencode"
  - "plugin_bridges relocation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity`

### Summary

OpenCode 1.3.17 crashed immediately on TUI launch in every directory that resolved `.opencode/plugins/` from this repo. The bun TUI worker printed a JSON error envelope: `TypeError: null is not an object (evaluating 'plugin2.auth')`. OpenCode was entirely non-functional until this was fixed.

The root cause was the named export `parseTransportPlan` in `spec-kit-compact-code-graph.js`. The installed 1.3.17 loader's legacy plugin-function path can invoke named function exports from a discovered `.js` file as plugin factories. When called with a plugin context object instead of a bridge response string, `parseTransportPlan` returned `null`, producing a null hook entry that crashed on the auth read. The fix hardened the parser to return `{}` for non-string input. As a structural cleanup, the three bridge and schema helper modules were relocated from `.opencode/plugins/` to `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/`, making the plugin folder an entrypoints-only directory.

Two later phases extended the fix. Phase 4 remapped the skill-advisor plugin from ignored Claude-Code-style lifecycle hook names to the OpenCode-recognized `experimental.chat.system.transform` and `event` surfaces, so advisor briefs now reach model context. Phase 5 corrected runtime readiness conflation, cache metric accounting, defensive output guards and session ID normalization, with focused vitest and direct Node smokes confirming each correction.

### Added

- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/` target folder containing the three relocated helper modules (NEW)
- `spec-kit-opencode-message-schema.mjs` as the first occupant of `plugin_bridges/` after relocation
- `.opencode/plugins/README.md` documenting the entrypoints-only convention and listing current plugin entrypoints
- `opencode-plugins-folder-purity.vitest.ts` regression guard that fails when any file in `.opencode/plugins/` lacks a default export (NEW)
- `advisor_lookups` field exposed in the status tool so cache accounting is explicit

### Changed

- `.opencode/plugins/spec-kit-compact-code-graph.js`: `parseTransportPlan` now returns `{}` for non-string input instead of `null`. Bridge path updated to resolve relocated helper via `import.meta.url`
- `.opencode/plugins/spec-kit-skill-advisor.js`: `onUserPromptSubmitted` replaced by `experimental.chat.system.transform`. `onSessionStart`/`onSessionEnd` replaced by an `event` listener. First transform call also flips `runtime_ready` as a pragmatic fallback
- `opencode-plugin.vitest.ts` updated to reflect helper relocation and the `parseTransportPlan` guard behavior
- `spec-kit-skill-advisor-plugin.vitest.ts` extended to cover hook shape, system prompt injection, fail-open behavior, session-message prompt fallback, event readiness and scoped cache cleanup, cache invariant, output guard and object session ID normalization

### Fixed

- `TypeError: null is not an object (evaluating 'plugin2.auth')` TUI crash caused by `parseTransportPlan` returning `null` when called with a plugin context object
- Skill-advisor hook names that OpenCode never invoked (`onUserPromptSubmitted`, `onSessionStart`, `onSessionEnd`) replaced with the actual OpenCode hooks, so advisor briefs now land in `output.system[]`
- `runtime_ready` flag was incorrectly tied to advisor bridge success rather than lifecycle or handler readiness
- Cache metric accounting bug where `bridge_invocations` and `advisor_lookups` were conflated
- `appendAdvisorBrief()` threw when `output.system` was absent or null, now defensively initialized
- Session ID normalization: object-typed session IDs were serialized as `[object Object]`, causing cache misses for identical sessions

### Verification

- `opencode --version`: PASS, returned `1.3.17` during the probe
- Pre-fix XDG-isolated probe: PASS, reproduced `TypeError: null is not an object (evaluating 'plugin2.auth')`
- `ls .opencode/plugins/`: PASS, shows only `README.md`, `spec-kit-compact-code-graph.js`, `spec-kit-skill-advisor.js`
- `ls .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/`: PASS, shows relocated helper files
- `node --check` on both plugin entrypoints: PASS
- Public exact smoke: PASS, no `plugin2.auth` error
- Barter exact smoke: PASS, no `plugin2.auth` error
- Public XDG-writable smoke: PASS, reached OpenCode TUI/server bootstrap logs
- Barter XDG-writable smoke: PASS, reached OpenCode TUI/server bootstrap logs
- Advisor bridge direct smoke: PASS, returned live advisor response
- Legacy parser guard direct smoke: PASS, plugin-like object input returned `{}`
- Regression guard: negative test with no-default-export stub caused vitest red. Removal restored green.
- Focused plugin-loader vitest: PASS, 3 files / 15 tests
- Focused skill-advisor hook vitest Phase 4: PASS, 18/18 tests
- Focused skill-advisor hook vitest Phase 5: PASS, 23/23 tests
- Direct system-transform smoke: PASS, `output.system[0]` received advisor brief
- Direct event smoke: PASS, mock `session.created` yielded `runtime_ready=true`
- Direct cache invariant smoke: PASS, `cache_hits=1`, `cache_misses=1`, `bridge_invocations=1`, `advisor_lookups=2`
- `npm run build` in `mcp_server`: PASS
- Strict packet validation (`validate.sh --strict`): PASS, 0 errors / 0 warnings
- Full `npx vitest run`: BLOCKED on unrelated `copilot-hook-wiring.vitest.ts` mismatch against `.github/hooks/superset-notify.json`

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/plugins/spec-kit-compact-code-graph.js` | `parseTransportPlan` hardened to return `{}` for non-string input. Bridge import path updated to `plugin_bridges/` |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Hook names remapped to `experimental.chat.system.transform` and `event`. Status accuracy, cache accounting, output guard and session ID normalization applied |
| `.opencode/plugins/README.md` (NEW) | Documents entrypoints-only convention and OpenCode 1.3.17 upgrade probe findings |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs` | Relocated from `.opencode/plugins/`. Top-of-file comment added explaining why it lives outside the plugin folder |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts` (NEW) | Regression guard that fails if any file in `.opencode/plugins/` lacks a default export |
| `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Updated to reflect helper relocation and `parseTransportPlan` guard |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Extended with Phase 4 and Phase 5 focused vitest cases |

### Follow-Ups

- Resolve the `copilot-hook-wiring.vitest.ts` blocker so the full `npx vitest run` gate can pass. The test expects repo-local Copilot hook commands while `.github/hooks/superset-notify.json` routes through Superset hook commands.
- Confirm that two bridge helper files (`spec-kit-skill-advisor-bridge.mjs` and `spec-kit-compact-code-graph-bridge.mjs`) were staged correctly as delete/add pairs after the `git mv` sandbox denial prevented atomic rename commits.
- Regenerate memory embeddings for this packet after an embedding provider becomes available. The `generate-context.js` run exited 0 but embedding-provider calls failed. Entries are BM25/FTS-searchable but not vector-searchable.
- Review the module-global state design in the skill-advisor plugin. The current single-module cache and status object is adequate for one OpenCode session but may cause state leaks in multi-instance scenarios.
