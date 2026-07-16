---
title: "Feature Specification: Phase 4: Release and Program Cleanup [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup/spec]"
description: "Post-release documentation alignment pass for the 028 CLI program: every README (skill, code, root), command, agent roster, skill reference/asset, feature catalog, and manual-testing playbook double-checked against the shipped dual-stack reality, plus the release changelog."
trigger_phrases:
  - "028 release and program cleanup"
  - "004 release-and-program-cleanup"
  - "cli transition doc cleanup"
  - "post-release alignment 028"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Phase complete: doc surface aligned, SC-001/SC-002 green, stress set executed"
    next_safe_action: "Parent 028 close: T9xx runtime drills then memory save"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 4: Release and Program Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Completed** | 2026-06-10 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 (release gate; follows workstreams 001-003) |
| **Predecessor** | 001-spec-memory-cli, 002-code-index-cli, 003-skill-advisor-cli (all implementation complete) |
| **Handoff Criteria** | Doc surface aligned with shipped dual-stack reality; changelog published; validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 028 program shipped three dual-stack CLIs (`spec-memory`, `code-index`, `skill-advisor`) over the existing daemons, warm-only hook fallbacks for Claude Code and Codex, OpenCode plugins (including the previously missing `mk-spec-memory.js` and the CLI-backed `mk-code-graph.js` bridge repair), and a family of new environment variables. The documentation surface still largely describes the MCP-only world: none of the new CLI env vars appear in `ENV_REFERENCE.md`, the root and skill READMEs present MCP as the only access path, and the doctor/memory/speckit command docs predate the CLI fallbacks. Without a coordinated cleanup pass — the 028 analog of 026's `000-release-and-program-cleanup` — the program closes with drifted docs.

### Purpose

Double-check and align every affected documentation surface with post-release reality: skill READMEs + SKILL.md for the three systems, the code READMEs (3 mcp_server + bin + bin/lib), the public root README, commands, agent rosters, skill references/assets (especially `ENV_REFERENCE.md`), feature catalogs, manual-testing playbooks (including 028 CLI stress scenarios), and the release changelog entries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verification-first sweep: every row in tasks.md is "read the doc, diff against shipped behavior, patch only real drift" — no rewrites for style.
- The three systems' skill docs: `SKILL.md` + `README.md` for system-spec-kit, system-code-graph, system-skill-advisor (3 new CLIs, warm-only fallbacks, plugins, bridge repair).
- Code READMEs: the 3 `mcp_server/README.md` files, `.opencode/bin/README.md`, `.opencode/bin/lib/README.md`.
- Top-level docs: public root `README.md`, `.opencode/skills/README.md`.
- Commands: doctor routes (already updated during workstreams — verify), `memory:*` / `speckit:*` command docs gaining CLI-fallback references where they describe MCP-only access.
- Agent rosters across 3 runtimes (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`) — verify, update only where CLI-relevant.
- Skill references/assets: `ENV_REFERENCE.md` rows for the new CLI env vars; CLI-reference-style docs in each system's `references/`.
- Feature catalog + manual-testing playbook rows for the three systems, including 028 CLI stress scenarios.
- Release changelog entries in the three changelog tracks.

### Out of Scope

- T9xx transport-down drills and the tri-daemon spawn drill — owned by the workstream phases (001-003) and the program gate, not this cleanup pass.
- MCP removal or MCP-reference migration — the separately-gated 005+ follow-on per the parent phase map.
- Code changes — this phase is documentation alignment; any code defect found is reported back to the owning workstream, not fixed here.
- Rewriting docs that are already accurate — verification rows close with "verified, no drift" evidence where applicable.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/{system-spec-kit,system-code-graph,system-skill-advisor}/{SKILL.md,README.md}` | Verify/Modify | Dual-stack CLI surfaces, warm-only fallbacks, plugins (IN-FLIGHT: concurrent agents) |
| `.opencode/skills/{system-spec-kit,system-code-graph,system-skill-advisor}/mcp_server/README.md` | Verify/Modify | CLI entry points, env vars, daemon/launcher contract |
| `.opencode/bin/README.md`, `.opencode/bin/lib/README.md` | Verify/Modify | `spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs` wrappers + shared lib |
| `README.md` (repo root), `.opencode/skills/README.md` | Verify/Modify | Topology/architecture sections naming MCP as the only access path |
| `.opencode/commands/doctor/**`, `.opencode/commands/memory/**`, `.opencode/commands/speckit/**` | Verify/Modify | Doctor CLI probes (verify); CLI-fallback references in memory/speckit docs |
| `.opencode/agents/`, `.claude/agents/`, `.codex/agents/` | Verify | Roster docs; update only where CLI-relevant |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Add the new CLI env var rows (confirmed absent) |
| `.opencode/skills/*/feature_catalog/**`, `.opencode/skills/*/manual_testing_playbook/**` | Verify/Modify | Catalog + playbook rows incl. CLI stress scenarios (IN-FLIGHT: concurrent agents) |
| `.opencode/changelog/{system-spec-kit,system-code-graph,system-skill-advisor}/` | Create | Release changelog entries (via skill-local symlink targets) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill, code, and root READMEs aligned with the shipped dual-stack reality | Each doc in groups (a)-(c) of tasks.md read and diffed against shipped behavior; drift patched or "no drift" recorded; no remaining claim that memory/code-graph/advisor access is MCP-only |
| REQ-002 | `ENV_REFERENCE.md` documents the new CLI env vars | All shipped vars present with defaults + semantics: `SPECKIT_SPEC_MEMORY_CLI_{WARM_ONLY,PROMPT_TIME,DEV_ALLOW_STALE}`, `SPECKIT_CODE_INDEX_CLI_{WARM_ONLY,PROMPT_TIME,DEV_ALLOW_STALE}`, `MK_SKILL_ADVISOR_CLI_{WARM_ONLY,PROMPT_TIME,TRUSTED,DEV_ALLOW_STALE}`, `MK_SKILL_ADVISOR_TRUST_DEFAULT` |
| REQ-003 | Release changelog entries published | New version file in each of the three changelog tracks (next free slot after v3.5.0.4 / v1.1.0.0 / v0.6.0), written via the skill-local symlink target paths |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Command docs verified | Doctor skill-advisor/skill-budget CLI probes confirmed present; doctor memory/code-graph routes checked for CLI-probe parity (gap dispositioned with owner sign-off if deferred); memory:*/speckit:* docs reference the CLI fallback where they describe transport-sensitive flows |
| REQ-005 | Agent rosters verified across 3 runtimes | Each roster swept for MCP-only claims about the three systems; updates applied only where CLI-relevant; "no change needed" recorded otherwise |
| REQ-006 | Feature catalogs + manual-testing playbooks reconciled | Catalog sections + playbook rows for the three CLIs present (incl. 028 CLI stress scenarios); hand-maintained playbook indexes and file-count self-checks updated; in-flight concurrent-agent work reconciled, not duplicated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A grep for MCP-only access claims across the doc surfaces in scope returns no stale hits for the three systems; each tasks.md row carries verified/patched evidence.
- **SC-002**: `ENV_REFERENCE.md` matches the env var inventory grep-extracted from shipped code (no missing, no phantom vars).
- **SC-003**: Release changelog entries exist in all three tracks and follow house changelog conventions.
- **SC-004**: `validate.sh --strict` exit 0 on this folder and on the parent packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Workstreams 001-003 shipped (implementation complete, suites green) | Cleanup would document unshipped behavior | Parent phase map confirms all three workstreams complete; T9xx drills explicitly out of scope here |
| Risk | Concurrent agents already executing catalog/playbook + skill README rows | Duplicate or conflicting edits | Rows marked IN-FLIGHT in tasks.md; this phase reconciles their output instead of re-editing; re-verify before claiming |
| Risk | Changelog version-slot collision across parallel sessions | Two sessions claim the same version file | Check the track directory immediately before writing; coordinate slots per house convention |
| Risk | Shared git index across concurrent sessions | Scoped commits sweep in foreign staged files | Commit with `git commit --only -- <paths>`; verify `git show --stat HEAD` |
| Risk | Doc fixes drift into code fixes | Scope creep into workstream territory | Out-of-scope rule: report code defects to the owning workstream |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- No runtime-performance surface — documentation-only phase. Verification greps and validate.sh runs are the only executions.

### Security

- No secrets in docs: env var rows document names/defaults/semantics, never values from local environments.
- Changelog and README edits must not leak machine-local absolute paths or account identifiers.

### Reliability

- Every alignment claim is evidence-backed (file read + grep), not asserted from memory; "verified, no drift" rows cite what was checked.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- A doc surface in scope that a concurrent agent has already fully aligned: row closes as reconciled-verify, not re-edited.
- A doc surface that mixes 028 content with unrelated drift: fix only the 028-relevant drift; note the rest for a separate packet (scope lock).

### Error Scenarios

- ENV_REFERENCE drift in both directions: a var in docs but not code is removed/flagged; a var in code but not docs is added (REQ-002 requires bidirectional match).
- Doctor route parity gap (memory/code-graph routes without CLI probes) turns out intentional: disposition recorded with owner sign-off instead of forcing edits.

### State Transitions

- If a workstream re-opens (T9xx drill failure forces code changes), affected doc rows revert to pending until the workstream re-closes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~25 doc surfaces across 3 systems + commands + rosters + changelog; zero code |
| Risk | 8/25 | Doc-only, additive, git-revertible; main hazard is in-flight agent collision |
| Research | 8/20 | Truth-source inventory already pinned (env vars, bins, plugins, doctor state) |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the doctor memory/code-graph routes gain CLI probes in this phase (doc-adjacent YAML) or be deferred to the owning workstreams? Default: verify-and-disposition here, edit only with operator sign-off (REQ-004).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md` (phase map, program pairing rule, drill gates)
- **Model**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md` (the prior program's cleanup phase this mirrors)
- **Plan**: `plan.md` | **Tasks**: `tasks.md` | **Checklist**: `checklist.md`
<!-- /ANCHOR:related-docs -->
