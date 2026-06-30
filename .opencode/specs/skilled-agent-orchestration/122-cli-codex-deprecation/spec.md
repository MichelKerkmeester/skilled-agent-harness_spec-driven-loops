---
title: "Feature Specification: Deprecate cli-codex skill and operational references"
description: "Retire the cli-codex skill and remove active operational references so OpenCode no longer routes, advertises, or dispatches through that CLI executor. Historical spec and changelog records remain archival unless they feed runtime behavior."
trigger_phrases:
  - "cli-codex deprecation"
  - "codex cli skill retirement"
  - "remove cli-codex references"
  - "skill executor retirement"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation"
    last_updated_at: "2026-06-30T15:05:00Z"
    last_updated_by: "opencode"
    recent_action: "Added narrow Codex Desktop App project bridge amendment"
    next_safe_action: "Validate Codex Desktop bridge symlinks and packet metadata"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/"
      - ".opencode/commands/deep/assets/"
      - ".opencode/skills/deep-loop-runtime/"
      - ".opencode/skills/system-skill-advisor/"
      - ".opencode/agents/"
      - "README.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:951b82df8b7b03d01f3aecac83cfb367798059f3291c5484a195365fe50d8a33"
      session_id: "159-cli-codex-deprecation-plan"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "Use a new packet under .opencode/specs/skilled-agent-orchestration."
      - "Run /speckit:plan:auto before implementation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deprecate cli-codex skill and operational references

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The `cli-codex` skill is still discoverable and advertised across active OpenCode docs, command assets, agents, advisor metadata, and executor code. This packet retires the active skill and removes operational `cli-codex` routing so future workflows do not offer or dispatch through a missing or deprecated executor.

**Key Decisions**: retire both the discoverable skill identity and the active executor kind; preserve historical spec, changelog, and run artifacts as archive records unless they are runtime inputs.

**Critical Dependencies**: generated skill-advisor graph state must be rebuilt after source metadata changes; broad final grep must distinguish active operational paths from historical/archive records.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Branch** | current worktree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-codex` remains a first-class skill and executor in active OpenCode surfaces even though the user wants it deprecated. Leaving those references active would keep the advisor, commands, AI-council prompts, deep-loop executor config, manual playbooks, and README content pointing at a deprecated surface.

### Purpose
Deprecate the discoverable `cli-codex` skill and remove active Codex operational mentions/hooks so supported workflows advertise only current OpenCode plugin and Claude Code hook surfaces.

### Gemini Deprecation Phase Alignment

This packet follows the same practical phase sequence used by the prior Gemini deprecation effort, scaled to `cli-codex`:

| Phase | Gemini precedent | `cli-codex` execution in this packet | Status |
|-------|------------------|--------------------------------------|--------|
| 1 | Runtime surface and skill deletion | Delete the active `.opencode/skills/cli-codex/` tree from disk and preserve rollback material under `.opencode/skills/z_archive/cli-codex-retired/` | Complete |
| 2 | Command YAML cleanup | Remove `cli-codex` executor choices and prose from deep command assets and command-facing docs | Complete |
| 3 | Full executor purge | Remove runtime executor kind, matrix adapter cells, advisor routes, fixtures, graph metadata, docs, agents, mirrors, and tests | Complete |
| 4 | Runtime/model boundary review | Remove generic Codex runtime references from requested active scopes and verify exact `codex`/`cli-codex` active sweeps are clean | Complete |
| 5 | Desktop project bridge amendment | Restore a project-local Codex Desktop App config and supported symlink bridge without reintroducing `cli-codex` executor routing or Codex hook support | Complete |

The current packet remains a single Level 3 folder rather than a phase-parent migration because implementation had already completed in one coordinated packet; the phase table above is the controlling decomposition for review and closeout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete or otherwise make `.opencode/skills/cli-codex/` non-discoverable as an OpenCode skill.
- Remove active `cli-codex` options from command assets, agent prompts, executor schemas, adapter registries, advisor scoring, graph metadata, README/install docs, and manual playbooks.
- Regenerate or update checked-in metadata that would otherwise keep `cli-codex` routable.
- Remove Codex hook/runtime support from `README.md`, `.opencode/hooks`, `.opencode/commands`, and active `.opencode/skills/**` surfaces so only OpenCode plugins and Claude Code hooks remain supported.
- Add a narrow Codex Desktop App project bridge using `.codex/config.toml`, `.codex` context symlinks, `.codex/skills`, and the tracked `.agents -> .codex` symlink for Codex skill discovery, without restoring `cli-codex` delegation.

### Out of Scope
- Rewriting historical `.opencode/specs/**`, `specs/**`, archived changelogs, and prior run logs, because those are audit records rather than active runtime guidance.
- Rewriting historical `.opencode/specs/**`, archived changelogs, and prior run logs that mention Codex as audit history.
- Replacing `cli-codex` with a new OpenAI executor skill in this packet.
- Symlinking `.opencode/agents` into `.codex/agents`, because Codex custom agents require TOML files and the current canonical agents are Markdown.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-codex/` | Delete | Retire the discoverable skill package and remove residual empty directories from disk. |
| `.opencode/commands/deep/assets/*` | Modify | Remove command UX and YAML executor choices that offer `cli-codex`. |
| `.opencode/skills/deep-loop-runtime/**` | Modify | Remove executor kind support, fanout spawn handling, and tests for `cli-codex`. |
| `.opencode/skills/deep-loop-workflows/**` | Modify | Remove workflow docs, feature catalog entries, and playbooks that advertise `cli-codex` seats. |
| `.opencode/skills/system-skill-advisor/**` | Modify/regenerate | Remove advisor scoring routes, corpus expectations, graph edges, and generated skill graph entries. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/**` | Modify/delete | Remove matrix runner adapter and manifest cells for `cli-codex`. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/**` and `.opencode/skills/system-skill-advisor/hooks/codex/**` | Delete | Remove Codex hook support and associated policy/test/docs surfaces. |
| `.opencode/hooks/**` and `.opencode/commands/**` | Modify | Remove Codex runtime mirrors, command branches, and MCP doctor config support. |
| `.opencode/agents/**` and `.claude/agents/**` | Modify | Remove `cli-codex` vantage/seat guidance from canonical agents and mirrors. |
| `README.md`, `AGENTS.md`, `.opencode/install_guides/**`, `.opencode/skills/README.md` | Modify | Stop advertising `cli-codex` as an available skill or executor. |
| Other active `.opencode/skills/**` docs/tests/playbooks | Modify | Remove or retarget active references found by scoped grep. |
| `.codex/config.toml`, `.codex/README.md`, `.codex/specs`, `.codex/changelog`, `.codex/skills` | Add/modify | Restore Codex Desktop App project config, symlinked packet context, and canonical skill access. |
| `.agents` | Restore symlink | Keep Codex's documented `.agents/skills` discovery path resolving through `.agents -> .codex`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Retire discoverable skill identity | No active `.opencode/skills/cli-codex/SKILL.md` remains discoverable by the skill loader. |
| REQ-002 | Remove active routing references | Scoped grep over active operational surfaces finds no remaining `cli-codex` references except documented archival allowlist entries. |
| REQ-003 | Remove executor-kind support | Deep-loop runtime, deep command assets, model/matrix runner surfaces, and tests no longer accept or advertise `cli-codex`. |
| REQ-004 | Remove advisor routing | Skill advisor scoring, corpora, graph metadata, and checked-in graph cache no longer route Codex prompts to `cli-codex`. |
| REQ-005 | Preserve archive boundary | Historical spec, changelog, and run artifacts are left unchanged unless they are active runtime inputs. |
| REQ-006 | Verify with project gates | Spec validation, alignment drift checks, targeted tests, and final grep complete with evidence. |
| REQ-010 | Remove active generic Codex support | Scoped grep over `README.md`, `.opencode/hooks`, `.opencode/commands`, and active `.opencode/skills` finds no `codex`/`Codex`/`.codex`/`hooks/codex` references outside archive/history. |
| REQ-011 | Restore Codex Desktop App bridge only | `.codex/config.toml` parses as TOML, `.codex/specs` and `.codex/changelog` resolve to `.opencode` context, `.agents` resolves to `.codex`, and `.agents/skills` resolves to `.opencode/skills` with no `.codex/agents` Markdown symlink. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Sync runtime mirrors | `.claude/agents` mirrors match canonical `.opencode/agents` changes for affected prompts. |
| REQ-008 | Refresh metadata | Skill graph scan/rebuild or equivalent checked-in metadata update removes `cli-codex` edges. |
| REQ-009 | Update docs and playbooks | Active README, install guide, manual testing, and feature catalog references stop recommending `cli-codex`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg --hidden -i "codex|cli-codex|\.codex|hooks/codex|if_cli_codex|codex exec|CODEX_" README.md .opencode/hooks .opencode/commands .opencode/skills --glob '!**/z_archive/**' --glob '!**/changelog/**' --glob '!**/node_modules/**'` returns no output.
- **SC-002**: `skill_graph_status` or equivalent checked-in graph inspection shows no `cli-codex` skill node or inbound advisor route.
- **SC-003**: Deep-loop and advisor targeted tests pass after removing executor references.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation --strict` passes before completion is claimed.
- **SC-005**: `python3.11` parses `.codex/config.toml`, and symlink smoke tests prove `.agents/skills/system-spec-kit/SKILL.md`, `.codex/specs`, and `.codex/changelog` resolve.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Raw Codex executor references remain after skill deletion | Commands may advertise a missing safety contract | Remove executor kind references in the same packet, not just the skill folder. |
| Risk | Generated graph cache still contains `cli-codex` | Advisor may keep recommending a deleted skill | Rebuild or update skill graph artifacts after source cleanup. |
| Risk | Broad grep includes historical records | Scope may expand into audit-history rewrites | Use an explicit archive allowlist and document remaining historical hits. |
| Risk | Broad Codex removal breaks tests or schemas | Bulk retargeting may create invalid duplicate runtime entries or nonexistent hook-policy imports | Run typechecks and targeted runtime/advisor/code-graph/spec-kit tests after cleanup. |
| Risk | Desktop bridge is mistaken for restored CLI delegation | Users or agents may treat `.codex` as permission to dispatch through retired `cli-codex` | Keep bridge docs explicit: Desktop App config and skills only; no `.codex/agents` Markdown symlink and no Codex hook trees. |
| Dependency | Existing tests encode `cli-codex` examples | Test failures until fixtures are updated | Update tests and fixtures with replacement supported executors or retired-skill expectations. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target changes; deprecation should reduce, not add, executor dispatch paths.

### Security
- **NFR-S01**: Removing the skill must not weaken cross-CLI permission guidance for remaining executor skills.

### Reliability
- **NFR-R01**: Workflows must fail closed if stale configs or user prompts request `cli-codex` after deprecation.

---

## 8. EDGE CASES

### Data Boundaries
- Empty executor pool after removal: deep-loop workflows must still have native or supported CLI fallback guidance.
- Generated metadata: checked-in JSON caches must not reintroduce the retired node during validation.

### Error Scenarios
- User requests `cli-codex`: advisor and docs should route to supported alternatives or abstain, not dispatch a missing skill.
- Historical grep hit remains: classify as archival and document the exact excluded scope.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Broad active references across skills, commands, agents, docs, tests, and generated metadata. |
| Risk | 14/25 | Executor removal affects dispatch and advisor routing, but no user data or external API migration. |
| Research | 14/20 | Requires grep inventory plus targeted reads due stale code graph. |
| Multi-Agent | 6/15 | Four read-only context sweeps used during planning. |
| Coordination | 8/15 | Canonical `.opencode` files and `.claude` mirrors must stay aligned. |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Advisor still recommends `cli-codex` after folder deletion | H | M | Remove scoring edges and rebuild graph metadata. |
| R-002 | Command YAML still materializes `kind: cli-codex` | H | M | Update deep command assets and targeted tests. |
| R-003 | Manual playbooks keep stale handoff recipes | M | H | Retire or rewrite active playbook scenarios. |
| R-004 | Generic Codex hook support removed by mistake | M | L | Final review separates `cli-codex` from Codex runtime references. |

---

## 11. USER STORIES

### US-001: Remove retired executor from active workflows (Priority: P0)

**As an** OpenCode operator, **I want** active commands and agents to stop offering `cli-codex`, **so that** deprecated executor paths are not selected by mistake.

**Acceptance Criteria**:
1. Given active command and agent docs, When I search for `cli-codex`, Then only documented archival exceptions remain.
2. Given a deep-loop config, When it validates executor kinds, Then `cli-codex` is rejected or absent.

---

### US-002: Remove retired skill from advisor routing (Priority: P0)

**As a** skill-advisor user, **I want** Codex-related prompts not to route to a deleted skill, **so that** recommendations remain actionable.

**Acceptance Criteria**:
1. Given skill graph metadata, When the graph is rebuilt, Then no `cli-codex` node or edge is present.
2. Given prompt fixtures, When scorer tests run, Then no expected skill is `cli-codex`.

---

### US-003: Keep historical records stable (Priority: P1)

**As a** maintainer, **I want** old specs and changelogs to remain audit records, **so that** deprecation does not rewrite history.

**Acceptance Criteria**:
1. Given archive paths, When final grep reports remaining hits, Then each is classified as archival or intentionally preserved.
2. Given active runtime inputs, When a hit appears outside archive paths, Then it is removed or explicitly justified.

---

## 12. OPEN QUESTIONS

- None. The user selected a new packet and requested deprecation plus all operational mentions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
