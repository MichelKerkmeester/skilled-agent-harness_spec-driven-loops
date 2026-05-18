---
title: "Implementation Summary: CLI Devin Skill Advisor UserPromptSubmit Hook + Plugin Rename + Post-Extraction Audit"
description: "Phase 0/A/B/C/D delivery record for the advisor Devin hook, mk-skill-advisor rename, bridge migration, and shim-pattern UserPromptSubmit registration."
trigger_phrases:
  - "implementation"
  - "summary"
  - "004-cli-devin-skill-advisor-hook"
  - "mk-skill-advisor"
  - "devin hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook"
    last_updated_at: "2026-05-15T16:25:00Z"
    last_updated_by: "claude-opus-4-7-phase-e"
    recent_action: "Phase D verification + Phase E reconciliation complete"
    next_safe_action: "follow-on packet for advisor lib transitive-import fix (out of scope here)"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.ts"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-claude-orchestrate-cli-devin-hooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: Devin hookSpecificOutput.additionalContext contract — confirmed working via direct smoke test (advisor brief flows through)"
      - "Q2: Devin variant source location — skill-owned at hooks/devin/ confirmed"
      - "Q3: Compile target + registration shape — shim pattern adopted (system-spec-kit forwards to advisor dist)"
      - "Q4: Plugin rename safety — 293 refs migrated; legacy env-var alias retained"
      - "Q5: Bridge rename + duplicate audit — bridge moved to system-skill-advisor (no duplicate)"
      - "Q6: Post-extraction surface — 20 refs categorized (most justified)"
      - "Q7: Tool-ID stability test plan — extended runtime-parity vitest"
      - "Q8: sk-code compliance gap matrix — gaps closed via Devin variant + tests"
      - "Q9: sk-doc compliance gap matrix — stale plugin refs updated"
      - "Q10: Final synthesis — Phase B docs authored, Phase C dispatched cleanly"
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `004-cli-devin-skill-advisor-hook` |
| **Completed** | 2026-05-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

A CLI Devin `UserPromptSubmit` hook variant for the `system-skill-advisor` skill, plus a plugin/bridge rename to align with `mk-*` MCP server naming. Delivered:

1. **Devin UserPromptSubmit hook** (skill-owned): `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` — mirrors the Claude variant pattern, fail-open, diagnostic JSONL with `runtime: "devin"` tag.
2. **System-spec-kit shim**: `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.ts` — 21-line process-boundary shim that forwards to the advisor's compiled hook. Matches the existing Claude/Gemini/Codex shim pattern.
3. **Plugin rename**: `.opencode/plugins/spec-kit-skill-advisor.js` → `mk-skill-advisor.js` (PLUGIN_ID const flipped; legacy env-var alias `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` retained for backcompat; new `MK_SKILL_ADVISOR_HOOK_DISABLED` added alongside existing `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`).
4. **Bridge ownership migration**: `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` → `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`. New bridge `README.md` authored in the advisor skill.
5. **Devin registration**: `.devin/hooks.v1.json` UserPromptSubmit entry routes through the shim (which forwards to advisor's `dist/system-skill-advisor/hooks/devin/user-prompt-submit.js`).
6. **Doc updates**: SKILL.md, README, INSTALL_GUIDE, SET-UP_GUIDE, ARCHITECTURE.md, feature_catalog/07--hooks-and-plugin/, manual_testing_playbook/02--cli-hooks-and-plugin/ — all stale `spec-kit-skill-advisor` references updated.
7. **`cli-devin/references/devin_tools.md:106`** Hooks row flipped from "No" to "Yes — Claude-Code-compatible hooks via `.devin/hooks.v1.json`".
8. **Tests**: extended `runtime-parity.vitest.ts` with 5-runtime parity smoke; renamed `spec-kit-skill-advisor-plugin.vitest.ts` → `mk-skill-advisor-plugin.vitest.ts`.
<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five-phase autonomous workflow per the approved plan at `/Users/michelkerkmeester/.claude/plans/analyze-the-system-skill-advisor-and-curious-hollerith.md`:

- **Phase 0** (cli-codex gpt-5.5 high fast): scaffold Level 3 docs from manifest templates; author spec.md head; generate-context.js; strict validate ✅
- **Phase A** (cli-devin SWE-1.6, 10 iter): structured deep-research on the 10 questions in the Phase A prompt; output `research/research.md` + `iterations/iteration-{01..10}.md` + `findings.json` + `deep-research-state.jsonl`. Convergence: COMPLETE.
- **Phase B** (cli-codex gpt-5.5 high fast): synthesis — finalized 3 ACCEPTED ADRs, authored full plan.md/tasks.md/checklist.md/resource-map.md, updated handover.md. Strict validate exit 0 after a citation-anchor patch on research.md.
- **Phase C** (cli-opencode + deepseek/deepseek-v4-pro, worktree-isolated `wt-025`): executed T1.1–T2.4 + T3.1–T3.5 — plugin rename, bridge move, Devin hook source, doc updates, tests.
- **Phase D** (Claude main): merged `wt-025` back to main (commit 044b14777), fixed `hooks.v1.json` conflict markers (commit 05a4a8e0d), relocated Devin hook to canonical `hooks/devin/` path, added system-spec-kit shim, recompiled both dist targets, smoke-tested both hooks end-to-end (advisor brief flows through shim correctly).

Wall-clock: Phase 0 ~6 min, Phase A ~6 min (parallel with 036), Phase B ~13 min, Phase C ~22 min (parallel with 036), Phase D ~30 min including merge + path fixes.
<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

- **ADR-001 (Devin variant location)**: Hybrid — explicit skill-owned variant + `.devin/config.json` `read_config_from.claude=true` retained as safety net. Phase D verified the explicit variant works via shim.
- **ADR-002 (Plugin rename strategy)**: Full rename (file + PLUGIN_ID const + bridge + all current cross-refs). Legacy env-var aliases retained for backcompat. ~293 references migrated across current code/docs/tests.
- **ADR-003 (Bridge ownership migration)**: Move bridge from `system-spec-kit/mcp_server/plugin_bridges/` to `system-skill-advisor/mcp_server/plugin_bridges/` — matches post-extraction ownership.

See `decision-record.md` for full ADR content with research evidence citations.
<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

- **Strict validate (packet)**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook --strict` → exit 0, 0 errors, 0 warnings.
- **Devin hook smoke test (shim)**: `echo '{"prompt":"...","session_id":"test"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.js` → returns `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: ..."}}`, exit 0.
- **Devin hook smoke test (direct)**: `echo '...' | node .opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` → emits proper advisor brief, exit 0.
- **Plugin rename grep**: 0 hits for `spec-kit-skill-advisor` in current code/docs (excluding z_archive + changelogs).
- **TypeScript build**: `npx tsc -p tsconfig.build.json` exit 0 (deprecation warning on `baseUrl` is pre-existing, non-fatal).

Run any of the above to re-verify.
<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

- **Dual-tsconfig dist layout (informational, not blocking)**: The advisor's `mcp_server/` has two tsconfigs — `tsconfig.json` (rootDir=`.`, outputs to `dist/lib/...`) and `tsconfig.build.json` (rootDir=`../..`, outputs to `dist/system-skill-advisor/...` AND bundles transitively-imported `system-spec-kit/mcp_server/lib/...` into `dist/system-spec-kit/...`). The active execution path uses the build-tsconfig tree, where `../../../system-spec-kit/...` imports in `dist/system-skill-advisor/mcp_server/lib/skill-advisor-brief.js` resolve correctly to the co-bundled `dist/system-spec-kit/mcp_server/lib/context/shared-payload.js`. Anyone invoking files from the OTHER tree (`dist/lib/skill-advisor-brief.js`) will hit `ERR_MODULE_NOT_FOUND` because that tree doesn't bundle shared-payload — but no production code path uses that tree. Documented for future maintainers who may try to consolidate the two build outputs.
- **Advisor's policy-driven skip**: For short / non-implementation-style prompts, the advisor's `buildSkillAdvisorBrief()` intentionally returns `{}` (status="skipped" in the diagnostic JSONL) rather than emitting a brief. This is correct designed behavior, not a defect — verified by smoke-testing: substantive prompts like "implement OAuth login flow with refresh tokens" return the full `hookSpecificOutput.additionalContext` brief, while short prompts like "hi" return `{}`. The shim faithfully forwards both responses.
- **`read_config_from.claude` double-fire risk — RESOLVED 2026-05-15**: Phase F empirical test confirmed Devin loads exactly 2 hooks from `.devin/hooks.v1.json` and zero from `.claude/settings.local.json`. Verified via Devin's own log: `chisel::config::hooks: Loaded 2 hooks from .../.devin/hooks.v1.json` followed by `Loaded 2 total hooks` (would show 4 if Claude inheritance was active). No mitigation needed — `.devin/config.json` keeps its default `read_config_from` setting (absent → Devin's print mode loads `.devin/` only).
- **Interactive TUI hook execution unverified**: Phase F's non-interactive `devin -p` run confirmed hooks LOAD but did not show execution log lines for UserPromptSubmit. The print mode may either (a) silently execute hooks without INFO/DEBUG log lines, or (b) skip hook execution entirely as a print-mode optimization. Interactive TUI verification via `/hooks` slash command + observing advisor brief in model context is the gold-standard test — see playbook scenario `CL-006` (`.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/006-devin-user-prompt-submit.md`) for the manual procedure. Not blocking acceptance because (i) deterministic smoke tests prove the compiled hook works end-to-end when invoked with Devin's exact stdin shape, and (ii) Devin's hook-loader explicitly confirms registration is correct.
<!-- /ANCHOR:limitations -->

---
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

```
Devin TUI session
  └── UserPromptSubmit event
      └── .devin/hooks.v1.json registration
          └── bash -c '...node <shim>'
              └── shim: system-spec-kit/mcp_server/dist/.../hooks/devin/user-prompt-submit.js
                  └── spawnSync(node, advisor-impl) ← fail-open on child error
                      └── impl: system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js
                          └── buildSkillAdvisorBrief() + renderAdvisorBrief()
                              └── stdout: {hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: brief}}

Plugin/Bridge ownership:
  .opencode/plugins/mk-skill-advisor.js
    └── imports: .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs (post-extraction owned by advisor)

MCP server name: mk_skill_advisor (unchanged — stable tool-prefix surface mcp__mk_skill_advisor__*)
Plugin name: mk-skill-advisor (renamed, matches SKILL folder + MCP server name)
```
<!-- /ANCHOR:architecture-summary -->
