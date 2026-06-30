---
title: "Implementation Summary: Phase 001 - dist rebuild"
description: "Rebuild stale system-spec-kit MCP dist output after the 096 plural-directory rename and document generated-output drift evidence."
trigger_phrases:
  - "dist rebuild"
  - "098 phase 001"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers:
          - "P2-008 CI guard for singular-root literals in dist (advisory follow-on)"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:16"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:19"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Phase 001 - dist rebuild

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Actual Effort** | Completed before child doc authoring; evidence supplied by packet 098 parent context |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Rebuilt `.opencode/skills/system-spec-kit/mcp_server/dist/` after the 096 plural-directory rename. The first `npm run build` failed with TS1127 at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185` because bulk sed damaged an escaped JS regex literal. Re-escaping the literal to `.opencode\/skills\/system-spec-kit\/mcp_server\/dist\/hooks\/claude\/` unblocked `tsc --build`, and the rebuild succeeded cleanly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185` | Modified | Re-escaped the plural skill-path regex literal. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13` | Generated | Dist policy now uses `**/.opencode/skills/**`. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:16` | Generated | Dist policy now uses `**/.opencode/agents/**`. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:19` | Generated | Dist policy now uses `**/.opencode/commands/**`. |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The remediation steps for this phase are described in §What Was Built above. The sequence
followed the spec in plan.md (Setup → Implementation → Verification phases). All edits used
direct Edit/Write tooling (see project memory: "prefer direct sed/Edit for mechanical work").
Verification ran `validate.sh --strict` on this packet plus adjacent packets; smoke tests
ran where applicable (see §Verification table).
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use `npm run build` (`tsc --build`) | Keeps generated output aligned with the project build. |
| Repair only the regex literal blocking build | The phase target was generated-output drift, not broad test refactoring. |
| Treat `shadow-deltas.jsonl*` as out of code-path scope | They are gitignored historical runtime prompt logs. |
| Defer CI guard | Useful P2 followup, outside the completed P0 fix. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Build | Pass | MCP server TypeScript project | `npm run build` exited 0 after regex repair. |
| Generated dist audit | Pass | `dist/code_graph/lib/index-scope-policy.js` | Lines 13-19 show plural skills/agents/commands globs. |
| Residual grep audit | Pass with classified historical hits | Whole `mcp_server/dist/` tree | `rg '\.opencode/(skill|agent|command)/' .opencode/skills/system-spec-kit/mcp_server/dist/` returned only three `shadow-deltas.jsonl*` files. |
| Checklist | Pass | Required Phase 001 items | Required CHK-* entries are marked with evidence in `checklist.md`. |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Existing build pipeline remains sufficient | `npm run build` succeeded | Pass |
| NFR-S01 | Runtime entrypoint remains deterministic | Configured runtimes still route through `dist/context-server.js` | Pass |
| NFR-R01 | Dist policy matches source plural roots | `index-scope-policy.js:13-19` shows plural globs | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Add a CI step that fails on `rg '\.opencode/(skill|agent|command)/' .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/` hits.
2. `shadow-deltas.jsonl*` historical runtime logs still contain old prompt text but are out of code-path scope.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Rebuild generated dist | Build first failed on TS1127, then passed after regex repair | Bulk sed damaged an escaped regex literal. |
| Remove all singular-root dist hits | Residual hits remain only in `shadow-deltas.jsonl*` | Historical data logs are outside executable code paths. |

<!-- /ANCHOR:deviations -->
