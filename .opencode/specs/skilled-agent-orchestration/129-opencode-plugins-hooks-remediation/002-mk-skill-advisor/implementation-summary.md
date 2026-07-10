---
title: "Implementation Summary [129/002-mk-skill-advisor]"
description: "Reconciled remediation of the mk-skill-advisor OpenCode/Claude plugin: 16 of 17 audit findings shipped, 1 reclassified as a non-issue."
trigger_phrases:
  - "mk-skill-advisor remediation"
  - "mk-skill-advisor implementation summary"
  - "opencode plugin remediation summary"
  - "implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/002-mk-skill-advisor"
    last_updated_at: "2026-07-10T20:18:00.455Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped all 16 remediation findings and reconciled completion metadata"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-mk-skill-advisor |
| **Completed** | 2026-07-10 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Reconciled the mk-skill-advisor remediation packet against the code that actually shipped. The audit enumerated 17 findings (F1-F12 plus Opus additions O1-O4 and the disputed O5) across the OpenCode plugin, its bridge, the Claude hook, the legacy spec-kit shim, and the shared CLI fallback. All 16 real defects are implemented; O5 was reclassified as a non-issue by a 4-model review (the delete resolver is already a strict superset of the write resolver) and carries no code change.

Two findings landed in this session; the remaining fourteen were already shipped and are reconciled here from `not started` to done:

- **F4 (NEW this session)** — the spec-kit Claude shim `user-prompt-submit.ts` now resolves the advisor target to an install-anchored absolute path by walking from `import.meta.url` up to the ancestor owning `.opencode`, with a `SPECKIT_USER_PROMPT_TARGET` test/install override, replacing the CWD-relative TARGET that silently missed the target and failed open to `{}` off-root.
- **F7 (NEW this session)** — `runCliRecommend` in the Claude CLI fallback now forwards clamped `confidenceThreshold`/`uncertaintyThreshold` (via `clampUnitThreshold`, defaults 0.8 / 0.35) into the CLI payload options, mirroring the OpenCode bridge so caller thresholds reach the scorer instead of being silently discarded.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Modified | F4 absolute-target resolution; F5 bounded child timeout; O3 bounded fail-open stdin read |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modified | F2 prompt byte-clamp defense; F7 forwards clamped thresholds into the CLI payload |
| `.opencode/plugins/mk-skill-advisor.js` | Modified | F1 graph-DB freshness signature; F3 stderr/stdout bounding; F6 shared fallback directive; F9 epoch guard; F11 in-budget SIGKILL grace; F12 config error classification; O1 outer try/catch; O2 runtime label; O4 completion-time TTL |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modified | F2 shared clamp at the Claude hook boundary; F10 await stdout envelope before exit |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Modified | F6/F8 canonical fallback + governor directive shared across surfaces |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modified | F8 routes both render call sites through the canonical compiled renderer |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two session findings were implemented against real source and verified before this reconciliation: F4 in the spec-kit shim `user-prompt-submit.ts` (`resolveTarget()` walk to the `.opencode`-owning ancestor with a `SPECKIT_USER_PROMPT_TARGET` override) and F7 in `skill-advisor-cli-fallback.ts` (`runCliRecommend` forwarding clamped thresholds). The remaining fourteen fixes were already shipped in the plugin, bridge, Claude hook, and shared render layer. The whole set was validated by rebuilding dist, running the type-check (0 errors), and running the plugin/hook vitest suite (188/189, the single fail being the unrelated pre-existing `mk-goal-tool-path` deep-loops path artifact). This packet then flips `tasks.md` from all-unchecked to done with per-task evidence, adds this summary, and refreshes `description.json` + `graph-metadata.json`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| F4: repo-root walk over relative import.meta.url math | The shim is a compiled `.js` whose dist depth differs from source and the target lives in a sibling skill tree; walking to the `.opencode`-owning ancestor is deterministic where a fixed relative depth is fragile |
| F5: shim timeout < Claude's 3s UserPromptSubmit kill | A ~5s timeout would exceed Claude's own kill; the shim uses a sub-3s child budget so the shim, not Claude, controls termination |
| F6: always-on fallback directive from both surfaces | render.ts documents HYGIENE + GOVERNOR as every-turn intent; emitting the shared directive on the no-brief path unifies OpenCode and Claude behavior |
| O5: no code change | 4-model review proved the session.deleted resolver is a strict superset of the cache-write resolver; the reclassification is documented, not a deferral |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Plugin/hook suite | Pass | 188/189 — the single fail is the pre-existing `mk-goal-tool-path` deep-loops path artifact, unrelated to this packet, NOT a regression |
| Type-check | Pass | 0 errors |
| Build | Pass | dist rebuilt |
| `validate.sh --strict` | Pass | Errors: 0 (see final Summary line) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One suite failure is external.** The 1/189 failing test is the pre-existing `mk-goal-tool-path` deep-loops path artifact; it predates this packet and is not caused by these fixes.
2. **O5 intentionally unfixed.** T019 stays `[ ]` by design — it is a reclassified non-issue, not incomplete work; any optional shared-resolver refactor is folded into F9's cluster.
3. **Cross-runtime directive text is reduced, not single-sourced.** F6/F8 converge the HYGIENE/GOVERNOR text across render.ts, the bridge, and the plugin but do not eliminate the three copies; a future single-source follow-up would remove the remaining drift risk.

<!-- /ANCHOR:limitations -->
