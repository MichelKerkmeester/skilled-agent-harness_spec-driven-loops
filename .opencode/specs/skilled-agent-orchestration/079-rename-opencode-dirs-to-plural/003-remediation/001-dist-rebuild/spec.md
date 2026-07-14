---
title: "Feature Specification: Phase 001 - dist rebuild"
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
    blockers: []
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
# Feature Specification: Phase 001 - dist rebuild

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Parent** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation` |
| **Findings Resolved** | P0-001, P2-002, P2-008 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
096 ran a 670k-occurrence bulk-sed across the repo but did not rebuild `mcp_server/dist/`. Source TypeScript was correctly plural; generated JavaScript was stale singular. Live runtime path runs through dist (`opencode.json:23`, `.codex/config.toml:11`, `.gemini/settings.json:29`, `.claude/settings.local.json:37` all route through `dist/context-server.js`), so stale generated globs silently miscoped the code-graph indexer.

### Purpose
Rebuild stale system-spec-kit MCP dist output after the 096 plural-directory rename and document generated-output drift evidence.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Run `npm run build`, repair the TS1127 regex literal at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185`, rebuild dist, verify plural generated globs, and classify residual singular hits as historical jsonl logs.

### Out of Scope
CI guard for future singular-root literals; cleanup of `shadow-deltas.jsonl*` historical runtime logs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:16` | Modify | Phase-owned remediation surface |
| `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:19` | Modify | Phase-owned remediation surface |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `npm run build` exits 0 in `.opencode/skills/system-spec-kit/mcp_server/`. | Evidence captured in checklist or implementation summary |
| REQ-002 | `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19` shows `skill`, `agent`, and `command` globs as plural roots. | Evidence captured in checklist or implementation summary |
| REQ-003 | `rg '\.opencode/(skill|agent|command)/' .opencode/skills/system-spec-kit/mcp_server/dist/` returns only `shadow-deltas.jsonl*` historical logs. | Evidence captured in checklist or implementation summary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run build` exits 0 in `.opencode/skills/system-spec-kit/mcp_server/`.
- **SC-002**: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19` shows `skill`, `agent`, and `command` globs as plural roots.
- **SC-003**: `rg '\.opencode/(skill|agent|command)/' .opencode/skills/system-spec-kit/mcp_server/dist/` returns only `shadow-deltas.jsonl*` historical logs.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild` | Required for phases 002-007 | Phase 001 is complete before draft phases execute |
| Risk | Over-broad remediation edits historical context | Medium | Use targeted edits and explicit allowlists |
| Risk | Verification misses one runtime surface | Medium | Run phase-specific grep, build, smoke, or validator checks |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Verification should use targeted commands and avoid broad repo rewrites.

### Security
- **NFR-S01**: Runtime path, hook, or review-doctrine changes must fail closed where applicable.

### Reliability
- **NFR-R01**: Documentation, generated output, and metadata must agree with the actual runtime surface.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Historical archives and iteration logs may intentionally contain old strings.
- File:line evidence must point at current repo state, not inferred history.

### Error Scenarios
- Validator exit 2 is a failure and must be repaired before completion claims.
- Zero-coverage scans must fail closed instead of passing vacuously.

### Concurrent Operations
- This child can be planned independently, but final parent completion depends on all seven phases.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

Level 2: verification-focused remediation across multiple files or runtime surfaces, with concrete evidence required before completion.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None; implementation questions are resolved or captured as followup advisories.

<!-- /ANCHOR:questions -->
