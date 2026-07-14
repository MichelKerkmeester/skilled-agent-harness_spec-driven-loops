---
title: "Phase 1: mk-* plugins config uplift (H-5 3-tier config + M-6 async init)"
description: "Add 3-tier config resolution (~/.config/opencode/plugin/<name>.json > env vars > defaults) and async config init to mk-skill-advisor and mk-code-graph plugins. Matches upstream auto-review pattern for runtime-tunable plugin behavior without rebuilds."
trigger_phrases:
  - "h5 3-tier config"
  - "m6 async config init"
  - "mk-plugins config uplift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/001-mk-plugins-config-uplift"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "claude-opus-4-7-110-scaffold"
    recent_action: "phase_1_spec_scaffolded_awaiting_council"
    next_safe_action: "await_council_approval_then_implement"
    blockers:
      - "Awaiting deep-ai-council verdict in parent ai-council/council-report.md"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-110-001-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: H-5 3-tier config + M-6 async init for mk-* plugins

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `110-auto-review-stretch-config-dedup-gates` |
| **Source teachings** | H-5 + M-6 from `106/research/review-report.md` §5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our OpenCode plugins (`mk-skill-advisor.js` + `mk-code-graph.js`) use env-only or hardcoded config. Operators can't override behavior at runtime without editing source (which requires a rebuild). Upstream auto-review demonstrates a 3-tier resolution (`~/.config/opencode/plugin/<name>.json` > env vars > hardcoded defaults) that lets operators tune debug flags, thresholds, and target paths without source edits.

### Purpose
Add 3-tier config resolution + async config init to both mk-* plugins. File tier is OPTIONAL (silent-fail on missing/malformed); env + defaults remain working unchanged (no backward-incompatible break). Async config init awaits the file read BEFORE registering tools/handlers (no race conditions at plugin bootstrap).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (REVISED per council §10.2 + §6)

**H-5 — 4-tier config resolution (council-mandated precedence)**:
- Add `loadConfig()` async function to each plugin that reads `~/.config/opencode/plugin/<plugin-name>.json` and returns `{}` on any error
- **Precedence (4 tiers, highest wins)**: `rawOptions (existing plugin-level options) > config file > env vars > defaults`
- Resolve each config field via: `rawOptions.X ?? config.X ?? process.env.<PREFIX>_X ?? default`
- Why include `rawOptions`: council §6 verified both plugins ALREADY consume plugin-level options through a normalization layer — `mk-skill-advisor.js:107-127` and `mk-code-graph.js:122-142`. Without including this tier, file-tier would silently override explicit plugin-level options.
- Plugin name → config-file path mapping:
  - `mk-skill-advisor.js` → `~/.config/opencode/plugin/mk-skill-advisor.json`
  - `mk-code-graph.js` → `~/.config/opencode/plugin/mk-code-graph.json`
- Env-var prefixes: `MK_SKILL_ADVISOR_*` and `MK_CODE_GRAPH_*` respectively
- **Preserve existing env-var disable handling** at `mk-skill-advisor.js:35-39` (no regression)
- Define each plugin's overridable fields after reading the current `rawOptions` shape; document each field's tier behavior

**M-6 — Await config promise BEFORE option-readers (council §6 reframe)**:
- Both plugin factories are ALREADY async (`mk-skill-advisor.js:387`, `mk-code-graph.js:361`). M-6 is NOT "make factory async" — it is "load a config promise at module-init time and await it before any code reads options."
- Implementation: `const configPromise = loadConfig();` at module init (top-level), then `const config = await configPromise;` inside the factory BEFORE any option-normalization runs.
- All field reads happen after the await — no synchronous fallback path required

### Required Tests (council §10.2)
- (a) No config file present → behavior unchanged (env + defaults)
- (b) Malformed config file (invalid JSON) → silent fall-through to env + defaults
- (c) Env-only configuration → behavior unchanged
- (d) `rawOptions`-only (no file, no env) → explicit plugin options win
- (e) File-plus-env → file overrides env where field is present in both
- (f) `rawOptions`-plus-file → `rawOptions` wins (operator-explicit beats file-tier)

### Out of Scope
- Documenting all possible config fields exhaustively — start with high-value overrides (debug flag, paths) and iterate
- Migrating existing operators to file-based config — env + defaults remain default
- Plugin restart automation for config changes — manual restart required
- Touching mk-spec-memory plugin bridge or other plugins (out of 110 scope)

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Add `loadConfig()` + async init + per-field resolution chain |
| `.opencode/plugins/mk-code-graph.js` | Modify | Mirror of mk-skill-advisor pattern |
| `.opencode/plugins/README.md` | Modify (optional) | Document new config-file paths + env-var prefixes + overridable fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | `loadConfig()` async returns `{}` on missing/malformed file | Test: rename config file, plugin still loads |
| REQ-002 | Per-field resolution order: file > env > default | Test: each tier overrides the next |
| REQ-003 | No backward-incompatible changes for env-only or default users | Test: with no file present, behavior identical to current |
| REQ-004 | Plugin factory awaits config before registering tools | No timing race at startup |
| REQ-005 | TypeScript-friendly types if plugins use TS (currently JS — keep JSDoc) | No runtime type errors |
| REQ-006 | At least 1 example config file in `assets/` or `examples/` per plugin | Operators can copy + customize |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both plugins have `loadConfig()` + 3-tier resolution working.
- **SC-002**: Smoke test: with `~/.config/opencode/plugin/mk-skill-advisor.json` containing `{"debug": true}`, plugin emits debug logs; with file absent + `MK_SKILL_ADVISOR_DEBUG=1` env var, same behavior; with neither, no debug logs.
- **SC-003**: Plugin startup no longer races with config (await config promise before tool registration).
- **SC-004**: Strict validate exit 0 on this packet + phase parent.
- **SC-005**: No regressions in existing `mk_skill_advisor.*` + `mk-code-index.*` MCP tool behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Awaiting config at module init slows plugin load | Slightly slower OpenCode startup | Config read is small (~few KB); read async and parallelize where possible |
| Risk | File schema not documented; operators write invalid JSON | Plugin silently falls back to defaults (correct behavior) | Document schema in plugins/README.md + provide example files |
| Risk | Env-var naming collisions across plugins | One plugin's env var triggers another | Use distinct prefixes: `MK_SKILL_ADVISOR_*` vs `MK_CODE_GRAPH_*` |
| Dependency | Plugins are JS not TS; closure pattern + `async () =>` factory required | Plugin loader handles async factory? Verify at start | Test with a minimal stub before refactoring real plugins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Should config schema be Zod-validated at load time (TypeScript-ish runtime) or trust JSON? Council to advise — Zod adds dep + overhead but catches malformed configs early.
2. **Q2**: Should the loadConfig helper be extracted to a shared module (e.g. `.opencode/plugins/shared/load-config.js`) used by both plugins, or duplicated? Council to advise.
3. **Q3**: Field naming convention — camelCase (`logPath`) or snake_case (`log_path`) in the JSON file? Match upstream auto-review which uses camelCase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Read current `mk-skill-advisor.js` + `mk-code-graph.js` to identify config-tunable fields |
| 2 | Add `loadConfig()` helper (per-plugin OR shared module — per council §10) |
| 3 | Refactor plugin factory to async, awaiting config before tool registration |
| 4 | Replace each hardcoded/env-only config read with 3-tier resolution chain |
| 5 | Smoke test: 4 scenarios (file present, env only, both, neither) |
| 6 | Document new config schema + env-var prefixes in plugins/README.md |
| 7 | Strict validate this packet + phase parent + commit + push |
<!-- /ANCHOR:iteration-plan -->
