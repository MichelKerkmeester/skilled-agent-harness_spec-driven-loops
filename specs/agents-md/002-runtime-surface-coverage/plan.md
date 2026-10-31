---
title: "Implementation Plan: Runtime Surface Coverage"
description: "Three phases: (1) P1 contract fixes in AGENTS.md, CLAUDE.md, README.md, advisor enum + tests, validation script, orchestrator guidance; (2) P2 soft-gap docs across skills; (3) regeneration + verification gates. Every change is text/allowlist/test updates with evidence from the scout audit; no behavioral changes to agents."
trigger_phrases:
  - "runtime surface coverage"
  - "six runtime surfaces"
  - "runtime enum"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/002-runtime-surface-coverage"
    last_updated_at: "2026-08-04T06:30:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Plan written from scout audit"
    next_safe_action: "Implement Phase 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-agents-002"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Devin MCP registration be added? Default: remain absent"
    answered_questions:
      - "copilot is deprecated (user decision 2026-08-04)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime Surface Coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, TypeScript (advisor enum + tests), Node scripts (validate-command-references.cjs) |
| **Framework** | none (repo tooling; vitest for advisor tests) |
| **Storage** | none |
| **Testing** | `npx vitest run` (advisor), `validate-command-references.cjs`, `agent-roster-mirror-check.cjs` |

### Overview
Apply the scout audit's 20+ findings as text, allowlist, and test updates. The repo's real topology: OpenCode and Claude are authored agent dialects; Codex and Pi are generated from OpenCode sources; Cursor and Devin symlink Claude-dialect agents. MCP registration exists for OpenCode, Claude/Cursor, Codex, and Pi — not Devin. Docs that enumerate runtimes must match this.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..003)
- [x] Dependencies identified (generators, daemon restart)

### Definition of Done
- [ ] All REQ-001..008 acceptance criteria met
- [ ] vitest + validation scripts pass
- [ ] Grep sweep clean; generated mirrors regenerated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime topology (single source of truth for all doc changes):

```
authored:  .opencode/agents  (OpenCode)   .claude/agents  (Claude fork)
generated: .codex/agents  .pi/agents     (from OpenCode sources)
symlinked: .cursor/agents  .devin/agents (to Claude-dialect sources)
hooks:   Claude/Codex/Cursor/Devin use hook registrations; OpenCode uses plugins; Pi uses native TS extensions
MCP:     opencode.json, .claude/mcp.json (+Cursor), .codex/config.toml, .pi/mcp.json — no Devin MCP
```

### Key Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D-001 | Do NOT add Devin MCP registration claims | No checked-in Devin MCP config exists; false claims violate honesty mandates |
| D-002 | Advisor enum gains `codex`, `cursor`, `devin`, `pi`; `copilot` removed as deprecated (user-confirmed 2026-08-04) | Enum must match maintained runtimes; copilot has no surface
| D-003 | Generated mirrors are never hand-edited; regenerate from canonical | Machine-generated output stays machine-owned |
| D-004 | CLAUDE.md is a symlink to AGENTS.md (user-directed) | The root duplicate drifted 82 lines; symlink makes the mirror concept obsolete for CLAUDE.md |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P1 Contract Fixes
| Step | Action | Files |
|------|--------|-------|
| 1.1 | Fix MCP registration note, hook-capable runtimes line, agent-directory table | `AGENTS.md` (CLAUDE.md already symlinked — no mirror edit needed) |
| 1.2 | Update advisor runtime enum + all dependents + tests | `advisor-runtime-values.ts`, `metrics.ts`, `advisor-tool-schemas.ts`, `skill-advisor-cli-manifest.ts`, `advisor-validate.ts`, `runtime-parity.vitest.ts` |
| 1.3 | Extend agent-dir/runtime allowlists (Cursor/Pi/Devin, nested AGENT.md, TOML) | `validate-command-references.cjs` |
| 1.4 | Rewrite orchestrator runtime-path guidance; regenerate mirrors | `.opencode/agents/orchestrate.md`, then Codex/Pi generators |
| 1.5 | Update conductor + topology statements | `README.md` |

### Phase 2: P2 Soft-Gap Docs

| Step | Action | Files |
|------|--------|-------|
| 2.1 | Hook-system reference: Pi native-extension path | `system-spec-kit/references/config/hook-system.md` |
| 2.2 | Skill-advisor docs: Pi row + adapter | `system-skill-advisor/**` (4 files) |
| 2.3 | Dispatch: Cursor asymmetry | `.opencode/hooks/dispatch/README.md` |
| 2.4 | Agent-authoring: two-dialect model | `sk-doc/sk-create-agent/**`, `sk-code` checklist |
| 2.5 | Deep-loop scans + counts | `system-deep-loop/runtime/README.md`, `deep-improvement/**` |
| 2.6 | Per-runtime SYNC.md counts | `.claude/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.codex/SYNC.md` |
| 2.7 | Doctor docs | `agent-roster-mirror-check.cjs` header + README |
| 2.8 | ENV-REFERENCE config list | `system-spec-kit/mcp-server/ENV-REFERENCE.md` |
| 2.9 | sk-git CI runtime list | `sk-git/references/continuous-integration.md` |

### Phase 3: Regeneration + Verification

| Step | Action |
|------|--------|
| 3.1 | Regenerate `.pi/agents` + `.codex/agents` from canonical; verify symlink surfaces intact |
| 3.2 | Run vitest (advisor), `validate-command-references.cjs`, `agent-roster-mirror-check.cjs` |
| 3.3 | Repo-wide grep sweep for stale enumerations (SC-001) |
| 3.4 | Validate packet: `validate.sh <folder> --strict`; update checklist with evidence |
<!-- /ANCHOR:phases -->

---

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| Advisor enum + dependents | `npx vitest run` in `system-skill-advisor` (runtime-parity suite updated to six-runtime set) | After T003-T005 |
| Validation script | `node .opencode/commands/scripts/validate-command-references.cjs` exits 0 | After T006 |
| Mirror surfaces | `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` reports six surfaces | After T008 |
| Repo-wide claims | `rg` sweep for stale enumeration phrases (SC-001 pattern) | After Phase 2 |
| Packet itself | `validate.sh --strict` exit 0 | After T022 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Purpose | Risk if missing |
|-----------|---------|-----------------|
| Pi agent generator (`sync-agents-pi.cjs`) | Regenerate `.pi/agents/` | Mirrors stay stale; roster check fails |
| Codex agent generator | Regenerate `.codex/agents/` (TOML) | Mirrors stay stale |
| Skill-advisor daemon | Serves enum-backed tools | Stale enum served until restart |
| User decision: copilot | Final enum wording | REQ-002 wording | Resolved: deprecated, removed from supported set |
| User decision: Devin MCP | Scope boundary | Default: remain absent (D-001) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are text/allowlist/test edits in git; revert via `git checkout -- <paths>` per file group (Phase 1 first). Generated mirrors: rerun generators to restore. No schema, auth, or config migrations.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION PATH

1. `npx vitest run` from `system-skill-advisor` — enum tests pass
2. `node .opencode/commands/scripts/validate-command-references.cjs` — exit 0
3. `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` — six surfaces reported
4. `rg -n "three runtimes|five runtimes|Claude, Codex, OpenCode" --glob '!**/z_archive/**' --glob '!**/specs/**'` — zero hits (historical specs excluded)
5. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/agents/002-runtime-surface-coverage --strict` — exit 0
<!-- /ANCHOR:verification -->
