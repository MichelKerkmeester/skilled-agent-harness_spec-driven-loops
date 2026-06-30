---
title: "Implementation Summary: Phase 1 H-5 + M-6 mk-plugins config uplift"
description: "Adds loadConfig() + 4-tier config resolution to both mk-* plugins per council §10.2"
trigger_phrases:
  - "110 phase 001-mk-plugins summary"
  - "mk-plugins config uplift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/001-mk-plugins-config-uplift"
    last_updated_at: "2026-05-16T11:30:00Z"
    last_updated_by: "cli-opencode-deepseek-v4-pro"
    recent_action: "implemented_H5_4tier_config_M6_await_config_promise"
    next_safe_action: "phase_2"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-code-graph.js"
      - ".opencode/plugins/README.md"
    session_dedup:
      fingerprint: "sha256:8495361b22bb0542fdead6369f310650404e9bdac73806451ce6cfab7801f3f9"
      session_id: "2026-05-16-110-001-mk-plugins-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "4-tier precedence: rawOptions > file > env > defaults"
      - "Config file paths: ~/.config/opencode/plugin/<plugin-name>.json"
      - "Env var prefixes: MK_SKILL_ADVISOR_*, MK_CODE_GRAPH_*"
      - "Malformed JSON: silent fall-through to {}"
      - "Disable env vars preserved unchanged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | `110/001-mk-plugins-config-uplift` |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### mk-skill-advisor.js (H-5 + M-6)
- Added `import { readFile } from 'node:fs/promises'`, `import { homedir } from 'node:os'`, `import { join } from 'node:path'`
- Added `loadConfig()` async helper reading `~/.config/opencode/plugin/mk-skill-advisor.json` (silent `{}` on missing/malformed)
- Added `const configPromise = loadConfig()` at module level, started at import time
- Factory `MkSkillAdvisorPlugin()` now `await`s `configPromise`, merges `{ ...fileConfig, ...rawOptions }` before `normalizeOptions()`
- `normalizeOptions()` extended with env-var fallbacks for all fields:
  - `MK_SKILL_ADVISOR_CACHE_TTL_MS`, `MK_SKILL_ADVISOR_THRESHOLD_CONFIDENCE`, `MK_SKILL_ADVISOR_MAX_TOKENS`, `MK_SKILL_ADVISOR_NODE_BINARY`, `MK_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS`, `MK_SKILL_ADVISOR_MAX_PROMPT_BYTES`, `MK_SKILL_ADVISOR_MAX_BRIEF_CHARS`, `MK_SKILL_ADVISOR_MAX_CACHE_ENTRIES`
- Node binary resolution chain: `rawOptions.nodeBinaryOverride` > `MK_SKILL_ADVISOR_NODE_BINARY` > `SPEC_KIT_PLUGIN_NODE_BINARY` > `'node'`
- Existing disable env vars (`MK_SKILL_ADVISOR_HOOK_DISABLED=1`, `MK_SKILL_ADVISOR_PLUGIN_DISABLED=1`, legacy `SPECKIT_*`) preserved unchanged

### mk-code-graph.js (H-5 + M-6)
- Added same imports (`readFile`, `homedir`, `join`)
- Added `loadConfig()` reading `~/.config/opencode/plugin/mk-code-graph.json`
- Added `const configPromise = loadConfig()`
- Factory `mkCodeGraphPlugin()` now `await`s `configPromise`, merges `{ ...fileConfig, ...rawOptions }` before `normalizeOptions()`
- `normalizeOptions()` extended with env-var fallbacks:
  - `MK_CODE_GRAPH_CACHE_TTL_MS`, `MK_CODE_GRAPH_SPEC_FOLDER`, `MK_CODE_GRAPH_NODE_BINARY`, `MK_CODE_GRAPH_BRIDGE_TIMEOUT_MS`
- Node binary resolution chain: `rawOptions.nodeBinary` > `MK_CODE_GRAPH_NODE_BINARY` > `SPEC_KIT_PLUGIN_NODE_BINARY` > `'node'`
- Both `rawOptions` and no-rawOptions branches of `normalizeOptions()` updated

### plugins/README.md
- Added §5 "CONFIGURATION (Packet 110)" documenting:
  - 4-tier precedence: rawOptions > file > env > defaults
  - Config file paths for both plugins
  - Full field/env-var/description tables for both plugins
  - Example JSON config files
  - Failure modes (no file, malformed JSON)
- Renumbered §5→§6 (UPGRADE NOTES), §6→§7 (RELATED)
- Updated table of contents
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Single commit on `main` branch
- Edits applied via exact string matching to both plugin entrypoints and README
- Syntax checked: `node --check` passed on both `.js` files
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Module-level configPromise**: The `loadConfig()` promise is started at module evaluation time (not factory time), so the async file read is already in-flight when OpenCode invokes the factory. This minimizes the blocking `await` inside the factory.
2. **Merge before normalizeOptions**: File config is merged under rawOptions (`{ ...fileConfig, ...rawOptions }`) which gives rawOptions the win without modifying the existing `normalizeOptions()` semantics.
3. **Env vars inside normalizeOptions**: Added as fallbacks to preserve backward compatibility — if an operator moves from env-only to file+env, the existing env vars continue to work while file overrides are layered on top.
4. **Spec folder env var**: `MK_CODE_GRAPH_SPEC_FOLDER` is a simple string env var (not numeric), so it's read directly without `Number()` conversion.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Validation
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/001-mk-plugins-config-uplift --strict` — exit 0

### Scenario Tests (council §10.2)

| # | Scenario | Expected Behavior | Verification |
|---|----------|-------------------|-------------|
| (a) | No config file | Behavior unchanged; defaults + env apply | Code: `loadConfig()` returns `{}` → merge no-op |
| (b) | Malformed config file | Silent fall-through, returns `{}` from loadConfig | Code: `catch` block returns `{}` |
| (c) | Env-only configuration | Behavior unchanged; env vars read in normalizeOptions | Code: env reads in normalizeOptions |
| (d) | rawOptions-only | Explicit options win over all tiers | Code: `{ ...fileConfig, ...rawOptions }` |
| (e) | File + env present | File overrides env (rawOptions absent) | Code: `{ ...fileConfig, ...rawOptions }` where rawOptions is `{}` → file wins; env is fallback inside normalizeOptions |
| (f) | rawOptions + file present | rawOptions wins over file | Code: spread order places rawOptions last |

### Runtime Verification
Deferred to first real plugin reload — full OpenCode session restart required to exercise the factory entrypoint with a config file on disk.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Runtime acceptance test (real OpenCode session with config file) is deferred to operator validation
- Config file is read once at module load; changes require an OpenCode restart (no hot-reload)
- `MK_SKILL_ADVISOR_ENABLED` env var not added — the existing disable env var mechanism (`MK_SKILL_ADVISOR_HOOK_DISABLED=1` etc.) is preserved as-is per the contract
<!-- /ANCHOR:limitations -->
