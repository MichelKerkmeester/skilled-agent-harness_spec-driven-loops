---
title: "Implementation Summary: CLI Devin Code Graph SessionStart Hook + Plugin Rename + Naming Asymmetry ADR"
description: "Phase 0/A/B/C/D delivery record for the code-graph Devin SessionStart hook, mk-code-graph plugin/bridge rename, and intentional mk-code-index/mk-code-graph naming asymmetry."
trigger_phrases:
  - "implementation"
  - "summary"
  - "036-cli-devin-code-graph-hook"
  - "mk-code-graph"
  - "devin sessionstart"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/018-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T16:25:00Z"
    last_updated_by: "claude-opus-4-7-phase-e"
    recent_action: "Phase D verification + Phase E reconciliation complete"
    next_safe_action: "follow-on packet for hook-source migration if needed"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-code-graph.js"
      - ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-claude-orchestrate-cli-devin-hooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"]
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-cli-devin-code-graph-hook |
| **Completed** | 2026-05-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

A CLI Devin `SessionStart` hook variant for the `system-code-graph` data layer, plus a plugin/bridge rename and an ADR documenting the intentional MCP-name / plugin-name asymmetry. Delivered:

1. **Devin SessionStart hook**: `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` — mirrors Claude `session-prime.ts`, reads stdin `{source}`, calls `getStartupBriefFromMarker()`, emits `{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: brief}}` with the canonical `kind=startup` + `provenance` + `sectionKeys=["structural-context"]` contract. Fail-open on errors. Diagnostic JSONL tagged `runtime: "devin"`.
2. **Intentional asymmetry vs advisor pattern**: hook source stays in `system-spec-kit/mcp_server/hooks/` (NOT migrated to `system-code-graph/hooks/`) per ADR-001 — 110+ file refs, `.claude/settings.local.json:54-66` paths, and `system-spec-kit/mcp_server/scripts/finalize-dist.mjs` build dependencies would all break under migration. Documented in `system-code-graph/SKILL.md`.
3. **Plugin rename**: `.opencode/plugins/spec-kit-compact-code-graph.js` → `mk-code-graph.js` (PLUGIN_ID const flipped; no legacy env-var aliases required per Q6 finding).
4. **Bridge rename**: `system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` → `mk-code-graph-bridge.mjs` (path stays in `system-code-graph/`, no duplicate elsewhere).
5. **MCP server name unchanged**: `mk-code-index` retained (tool-prefix `mcp__mk_code_index__*`). Plugin name `mk-code-graph` matches the SKILL folder. ADR-002 documents the asymmetry rationale in `SKILL.md` and `.opencode/plugins/README.md`.
6. **Devin registration**: `.devin/hooks.v1.json` SessionStart entry routes to the compiled hook at `system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js`.
7. **Doc updates**: `system-code-graph/SKILL.md`, `feature_catalog/feature_catalog.md`, `manual_testing_playbook/manual_testing_playbook.md`, both `plugin_bridges/README.md` — stale plugin references replaced.
8. **Tests**: new `devin-session-start-hook.vitest.ts` (11 tests covering startup/resume/clear/compact sources, fail-open, env-var disable, runtime tag, parity contract).
9. **`cli-devin/references/devin_tools.md:106`** Hooks row flipped from "No" to "Yes — Claude-Code-compatible hooks via `.devin/hooks.v1.json`".
<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five-phase autonomous workflow per the approved plan at `/Users/michelkerkmeester/.claude/plans/analyze-the-system-skill-advisor-and-curious-hollerith.md`:

- **Phase 0** (cli-codex gpt-5.5 high fast): Level 3 scaffold; spec.md/plan.md/tasks.md/checklist.md/decision-record.md/handover.md/resource-map.md drafted as placeholders; generate-context.js; strict validate exit 0 ✅
- **Phase A** (cli-devin SWE-1.6, 10 iter): structured deep-research on the 10 packet-scoped questions; `research/research.md` (362 lines) + `iterations/iteration-{01..10}.md` + `findings.json` + `deep-research-state.jsonl`. Convergence: COMPLETE.
- **Phase B** (cli-codex gpt-5.5 high fast): finalized 3 ACCEPTED ADRs, authored plan.md/tasks.md/resource-map.md, refined checklist.md with finding citations. Strict validate exit 0.
- **Phase C** (cli-opencode + deepseek/deepseek-v4-pro, worktree-isolated `wt-036`): executed T1.1–T2.4 + T3.1–T3.6 — plugin rename, bridge rename, Devin SessionStart variant, dist compile, hooks.v1.json registration, tests (11/11 passing), strict validate exit 1 (worktree-local env limitation, not a defect).
- **Phase D** (Claude main): merged `wt-036` back to main (commit 47b31189c), resolved `.devin/hooks.v1.json` union conflict (commit 05a4a8e0d), recompiled spec-kit dist, smoke-tested SessionStart hook end-to-end (full structural-context block emitted correctly).

Wall-clock: Phase 0 ~6 min, Phase A ~6 min (parallel with 025), Phase B ~13 min, Phase C ~27 min (parallel with 025), Phase D ~30 min including merge + path fixes.
<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

- **ADR-001 (Hook source location)**: Option B — KEEP code-graph hooks at `system-spec-kit/mcp_server/hooks/`. Migration to `system-code-graph/hooks/` would touch 110+ file refs + `.claude/settings.local.json` + build config. Intentional asymmetry vs advisor pattern, documented in `system-code-graph/SKILL.md`.
- **ADR-002 (`mk-code-index` vs `mk-code-graph` naming asymmetry)**: Keep MCP server name `mk-code-index` (stable tool-prefix surface `mcp__mk_code_index__*` — renaming breaks consumers). Rename plugin/bridge to `mk-code-graph` for SKILL-folder symmetry with `mk-skill-advisor`/`system-skill-advisor`. Documented in `SKILL.md` and `plugins/README.md`.
- **ADR-003 (Devin variant strategy)**: Hybrid — explicit variant at `system-spec-kit/mcp_server/hooks/devin/session-start.ts` AND `read_config_from.claude=true` retained as safety net.

See `decision-record.md` for full ADR content with research evidence citations.
<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

- **Strict validate (packet)**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook --strict` → exit 0, 0 errors, 0 warnings.
- **Devin SessionStart smoke test**: `echo '{"source":"startup","session_id":"test"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` → returns `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"## Session Context\\n..."}}`, exit 0.
- **Vitest**: `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/devin-session-start-hook.vitest.ts` → 11/11 passed.
- **Plugin rename grep**: 0 hits for `spec-kit-compact-code-graph` in current code/docs (excluding z_archive + changelogs).
- **TypeScript build**: `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc` → exit 0.
- **Devin live `/hooks` listing** (manual, optional): start `devin` and run `/hooks` slash command — expect to see both UserPromptSubmit and SessionStart entries loaded from `.devin/hooks.v1.json`.
<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

- **Future hook-source migration (Option A)**: ADR-001 chose to KEEP code-graph hooks under `system-spec-kit/mcp_server/hooks/`. If symmetry with the advisor pattern becomes important later (e.g. multiple skills extracting their own hooks), a separate packet can migrate `system-spec-kit/mcp_server/hooks/{claude,gemini,codex,devin}/session-prime|session-start.ts` → `system-code-graph/hooks/{runtime}/`. That packet would also need to atomically update `.claude/settings.local.json:54-66` and `system-spec-kit/mcp_server/scripts/finalize-dist.mjs` build paths.
- **`read_config_from.claude` double-fire risk — RESOLVED 2026-05-15**: Phase F empirical test (advisor packet 025) confirmed Devin loads exactly 2 hooks from `.devin/hooks.v1.json` (UserPromptSubmit + SessionStart) and zero from `.claude/settings.local.json`. Devin's log: `chisel::config::hooks: Loaded 2 hooks ... Loaded 2 total hooks` — would show 4 if Claude inheritance was active. SessionStart inherits the same conclusion: no double-fire, no mitigation needed.
- **Interactive TUI hook execution unverified**: `devin -p` non-interactive mode confirmed hooks LOAD but no execution log lines surfaced for SessionStart. Manual interactive verification via playbook scenario `DH-001` (`10--devin-hooks/025-devin-session-start.md`) — launch `devin`, run `/hooks`, observe `## Session Context` block in model context — remains the gold-standard final acceptance.
<!-- /ANCHOR:limitations -->

---
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

```
Devin TUI session start
  └── SessionStart event {source: "startup"|"resume"|"clear"|"compact"}
      └── .devin/hooks.v1.json registration
          └── bash -c '...node session-start.js'
              └── system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js
                  └── getStartupBriefFromMarker() (reads .code-graph-readiness.json)
                      └── buildStartupBrief() (assembles kind=startup payload)
                          └── stdout: {hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: "## Session Context\n..."}}

Plugin/Bridge ownership (post-rename):
  .opencode/plugins/mk-code-graph.js
    └── imports: .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs

Naming asymmetry (intentional, ADR-002):
  MCP server name: mk-code-index           (stable; tool prefix mcp__mk_code_index__*)
  Plugin name:     mk-code-graph           (matches SKILL folder system-code-graph)
  Skill folder:    .opencode/skills/system-code-graph/
```
<!-- /ANCHOR:architecture-summary -->
