---
title: "Feature Specification: Runtime Surface Coverage — Enumerate pi, Cursor, and Devin Across Runtime-Support Docs and Scripts"
description: "AGENTS.md and its mirrors enumerate only Claude/Codex/OpenCode as supported runtimes, while the repo ships six runtime surfaces (.opencode, .claude, .codex, .cursor, .pi, .devin). Update every runtime enumeration, allowlist, and matrix to the six-surface reality without inventing support that does not exist (Devin MCP)."
trigger_phrases:
  - "runtime surface coverage"
  - "AGENTS.md runtimes"
  - "pi devin cursor support"
  - "runtime enumeration"
  - "runtime agent directory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/002-runtime-surface-coverage"
    last_updated_at: "2026-08-04T06:30:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Scaffolded packet; scout audit of runtime enumerations complete (gpt-5.6-sol, high thinking)"
    next_safe_action: "Implement Phase 1 (T001-T009)"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "CLAUDE.md"
      - "README.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts"
      - ".opencode/commands/scripts/validate-command-references.cjs"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime Surface Coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root framework doc (`AGENTS.md`) and its mirrors still enumerate **three** supported runtimes — Claude Code, Codex CLI, OpenCode — while the repo actively ships **six** runtime surfaces: `.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, and `.devin/`. A gpt-5.6-sol (high-thinking) scout audit found 20+ stale enumerations across root docs, MCP registration notes, agent-directory resolution tables, the advisor runtime enum (with dependent tests), a validation script's directory allowlist, and secondary skill docs. Stale runtime claims mislead agents about which surfaces exist, where to author agents, and what will be validated.

### Purpose
Every runtime enumeration in the repo reflects the true six-surface topology (OpenCode/Claude authored, Codex/Pi generated, Cursor/Devin symlinked), without claiming support that does not exist (e.g., Devin MCP registration).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root contract docs: `AGENTS.md` (MCP registration, hook-capable runtimes, agent-directory table) and its `CLAUDE.md` mirror
- `README.md` conductor/topology statements
- Advisor runtime enum: `advisor-runtime-values.ts` + dependent `metrics.ts`, tool schemas, CLI manifest, `advisor-validate.ts`, and `tests/hooks/runtime-parity.vitest.ts`
- `validate-command-references.cjs` agent-dir/runtime allowlists
- Orchestrator agent runtime-directory guidance (canonical + generated mirrors)
- Secondary docs: hook-system reference, skill-advisor docs (SKILL.md/README/hook refs), dispatch README, sk-create-agent docs, deep-loop runtime scans, per-runtime SYNC.md manifests, doctor docs, ENV-REFERENCE.md, sk-git CI docs

### Out of Scope
- Devin MCP registration — none exists in checked-in config; must not be claimed (see Decision D-001)
- Copilot legacy removal — no `.copilot/` surface; user confirmed deprecated (2026-08-04); enum fix removes it from the supported set
- Historical completed specs — past claims stay historical; not rewritten
- `sk-code` surface detection — it detects code surfaces (WEBFLOW/OPENCODE/MOTION_DEV), not host runtimes; no defect

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | MCP registration note, hook-capable runtimes line, agent-directory resolution table |
| `Barter/ai-speckit/coder/AGENTS.md` (other repo) | Modify | Same three runtime fixes applied to Barter's coder framework (six-runtime table, hook-capable set, per-runtime MCP note) — 2026-08-04 |
| `CLAUDE.md` | Replace with symlink | Root-level duplicate drifted 82 lines from AGENTS.md; converted to `CLAUDE.md -> AGENTS.md` (single source of truth, user-directed 2026-08-04) |
| `README.md` | Modify | Conductor list + agent-network topology |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts` | Modify | Stale 3-runtime enum |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts` | Modify | Enum reference |
| `.opencode/skills/system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts` | Modify | Enum reference |
| `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts` | Modify | Enum reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tools/advisor-validate.ts` | Modify | Enum reference |
| `.opencode/skills/system-skill-advisor/tests/hooks/runtime-parity.vitest.ts` | Modify | 3-runtime test set |
| `.opencode/commands/scripts/validate-command-references.cjs` | Modify | AGENT_DIRS + RUNTIME_DIR_ALLOWLIST |
| `.opencode/agents/orchestrate.md` (+ generated `.codex/agents/orchestrate.toml`, `.pi/agents/orchestrate.md`, `.claude/agents/orchestrate.md`) | Modify | Runtime path guidance |
| `.opencode/skills/system-spec-kit/references/config/hook-system.md` | Modify | Runtime source set + Pi native-extension path |
| `.opencode/skills/system-skill-advisor/{SKILL.md,README.md,hooks/skill-advisor-hook.md,references/hooks/skill-advisor-hook.md}` | Modify | Runtime lists + Pi row |
| `.opencode/hooks/dispatch/README.md` | Modify | Adapter list + Cursor asymmetry |
| `.opencode/skills/sk-doc/sk-create-agent/**` (+ sk-code agent-authoring checklist) | Modify | Two-dialect + derived-surface model |
| `.opencode/skills/system-deep-loop/runtime/README.md`, `deep-improvement/**` | Modify | Mirror counts → six surfaces |
| `.claude/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.codex/SYNC.md` | Modify | Runtime counts align with `.pi/SYNC.md` (already six) |
| `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` (+ README) | Modify | "five runtimes" → six |
| `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` | Modify | "all three runtime configs" → four configs / five MCP runtimes |
| `.opencode/skills/sk-git/references/continuous-integration.md` | Modify | "all three runtimes" → six |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGENTS.md enumerates all six runtimes in the MCP registration note, hook-capable runtimes line, and agent-directory resolution table; CLAUDE.md is a symlink to AGENTS.md so the mirror cannot drift | `grep -n "pi\|cursor\|devin" AGENTS.md` shows the six-surface claims; `readlink CLAUDE.md` returns `AGENTS.md`; `diff CLAUDE.md AGENTS.md` is empty |
| REQ-002 | Advisor runtime enum (`advisor-runtime-values.ts` + dependents) includes `codex`, `cursor`, `devin`, `pi` and documents the maintained-label policy; `copilot` removed from the supported set as deprecated; `runtime-parity.vitest.ts` updated to the real runtime set | `npx vitest run tests/hooks/runtime-parity.vitest.ts` passes; enum no longer contains the stale 3-tuple; grep shows no copilot entry in the supported set |
| REQ-003 | `validate-command-references.cjs` allowlists include `.cursor`, `.pi`, `.devin` and handle Devin's nested `AGENT.md` + Codex TOML formats | Script exits 0 on current tree; unit expectations updated |
| REQ-004 | Orchestrator runtime-directory guidance names all six paths; generated mirrors (`.codex/agents/orchestrate.toml`, `.pi/agents/orchestrate.md`) regenerated from canonical sources | `node .opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` + Codex generator rerun clean; grep of generated files shows six-surface text |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | README.md conductor list includes pi, Cursor, Devin; agent-network topology describes six surfaces with generated/symlink ownership | README lines updated; no "only Claude Code, OpenCode" phrasing remains in runtime-enumeration context |
| REQ-006 | Secondary docs (hook-system, skill-advisor docs, dispatch README, sk-create-agent, deep-loop, per-runtime SYNC.md, doctor, ENV-REFERENCE, sk-git CI) enumerate six surfaces or accurately describe their subset | Grep sweep finds no stale 3-runtime/5-surface claims outside historical specs |
| REQ-007 | Cursor dispatch asymmetry documented accurately (audit via Claude adapter, no dedicated preflight) | Dispatch README states the asymmetry; no false "full adapter" claim |
| REQ-008 | No false claims: Devin MCP registration NOT added anywhere | Grep shows Devin absent from MCP-registration claims |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Repo-wide grep sweep for stale runtime enumerations (`Claude, Codex, OpenCode` / "three runtimes" / "five runtimes") returns zero hits outside completed historical specs
- **SC-002**: All runtime-parity and reference-validation tests pass (`vitest` + `validate-command-references.cjs` + `agent-roster-mirror-check.cjs`)
- **SC-003**: Generated runtime mirrors are byte-consistent with canonical sources after regeneration (no manual edits to generated output)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime generators (pi sync-agents, Codex generator) | Regenerated mirrors must not drift | Run generators, verify with `agent-roster-mirror-check.cjs` |
| Risk | Enum change breaks advisor tests/daemon consumers | Med | Update dependents + tests in same change; run vitest |
| Risk | Copilot ambiguity misresolved as supported | Med | User confirmed deprecated (2026-08-04); enum fix removes copilot from the supported set |
| Risk | False Devin MCP claim | High (contract dishonesty) | Hard rule REQ-008; no `.devin` MCP registration exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Doc updates add no runtime cost; scripts unchanged in complexity
- **NFR-P02**: Validation scripts complete in their existing time budget

### Security
- **NFR-S01**: No config/auth claims altered; MCP registration text stays factual

### Reliability
- **NFR-R01**: All validation gates (vitest, validate-command-references, doctor roster check) pass after changes
- **NFR-R02**: Generated mirrors remain machine-generated; no hand-editing
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Devin has no command surface and no MCP registration — docs must say so rather than pad the matrix
- Cursor dispatch has no dedicated preflight adapter — documented as proxied through Claude

### Error Scenarios
- Generator fails on regenerate: do not hand-edit generated files; fix generator and rerun
- Advisor daemon consumers (CLI manifests) cache old enum: restart daemon after deploy

### State Transitions
- Partial completion: packet stays In Progress until grep sweep is clean and tests pass
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~22 files, mostly docs; two scripts + tests |
| Risk | 8/25 | Test/daemon breakage possible; no auth/system changes |
| Research | 10/20 | Audit complete (scout); copilot deprecation confirmed by user |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->

- Should Devin MCP registration be **added** (new work, out of current scope) or remain absent? Default: remain absent.

**Answered**: copilot is deprecated (user decision 2026-08-04) — removed from the supported runtime set; no `.copilot/` surface exists.
<!-- /ANCHOR:questions -->
