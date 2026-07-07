---
title: "Feature Specification: CLI Devin Code Graph SessionStart Hook + Plugin Rename + Post-Extraction Audit"
description: "Port the code-graph SessionStart hook to Devin CLI, keep hook source under system-spec-kit per ADR-001, rename the OpenCode code-graph plugin to mk-code-graph, and verify post-extraction parity."
trigger_phrases:
  - "cli-devin"
  - "code-graph"
  - "sessionstart"
  - "startup brief"
  - "plugin rename"
  - "mk-code-graph"
  - "post-extraction audit"
  - "036-cli-devin-code-graph-hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/018-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T17:35:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "checklist.md"
      - "handover.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-phase-b-036-cli-devin-code-graph-hook"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "F001/Q1: Devin SessionStart context injection remains empirically unverified; hybrid strategy accepted."
      - "F002/Q2: Hook source migration to system-code-graph/hooks deferred as too high-risk."
      - "F003/Q3: Devin variant follows hybrid strategy at system-spec-kit hook location."
      - "F004/Q4: Startup payload contract verified."
      - "F005/Q5: Freshness handling mirrors Claude stale warning pattern."
      - "F006/Q6: Plugin rename scope identified; no legacy env vars required."
      - "F007/Q7: Bridge rename is simple; no duplicate found."
      - "F008/Q8: mk-code-index MCP name remains stable while plugin becomes mk-code-graph."
      - "F009/Q9: Post-extraction audit clean."
      - "F010/Q10: sk-doc gaps and Phase B/C synthesis complete."
---

# Feature Specification: CLI Devin Code Graph SessionStart Hook + Plugin Rename + Post-Extraction Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

Phase A research resolved the code-graph packet with one deliberate asymmetry: unlike advisor hooks, code-graph SessionStart hook sources stay under `.opencode/skills/system-spec-kit/mcp_server/hooks/`. Moving them to `system-code-graph/hooks/` would touch 110+ references, `.claude/settings.local.json` registrations, and build/finalize paths; ADR-001 accepts keeping the current source location and adding Devin beside the existing Claude/Gemini/Codex variants (F002/Q2).

The plugin rename is still direct: `spec-kit-compact-code-graph` becomes `mk-code-graph`, while the MCP server name remains `mk-code-index` because it is the stable tool-prefix surface (`mcp__mk_code_index__*`). ADR-002 documents this naming asymmetry so future readers do not "fix" it accidentally (F008/Q8).

**Key Decisions**: ADR-001 keeps hook source in `system-spec-kit/mcp_server/hooks/`; ADR-002 keeps MCP name `mk-code-index` while renaming plugin/bridge to `mk-code-graph`; ADR-003 accepts the hybrid Devin strategy.

**Critical Dependencies**: Phase C must preserve startup payload shape (`kind=startup`, provenance, `sectionKeys=[structural-context]`), mirror Claude stale handling, merge `.devin/hooks.v1.json` with packet 025, and verify parity through sk-code, sk-doc, MCP boot, strict validation, and live Devin `/hooks`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planning Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Phase** | B synthesis complete; ready for Phase C implementation |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system-code-graph` is extracted as a skill and MCP surface, but its runtime startup hooks still live in `system-spec-kit/mcp_server/hooks/`. Phase A proved that migration would be riskier than the asymmetry: the current hook path is wired into settings, dist generation, and many docs/tests (F002/Q2). Devin has no explicit SessionStart variant, and the OpenCode plugin still uses the extraction-era `spec-kit-compact-code-graph` name.

### Purpose

Prepare a scoped Phase C implementation that adds Devin SessionStart support without moving existing hook source, renames the plugin and bridge to `mk-code-graph`, preserves `mk-code-index` MCP naming, updates current docs/tests, and verifies startup parity across all five runtimes.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. Create explicit Devin SessionStart source at `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts`, mirroring Claude `session-prime.ts` and calling `getStartupBriefFromMarker()` (F003/Q3, F004/Q4).
2. Keep existing Claude/Gemini/Codex hook source under `.opencode/skills/system-spec-kit/mcp_server/hooks/`; do not migrate to `system-code-graph/hooks/` in this packet (F002/Q2).
3. Mirror Claude stale freshness handling: warn and recommend `code_graph_scan`; do not run inline refresh inside the hook (F005/Q5).
4. Rename `.opencode/plugins/spec-kit-compact-code-graph.js` to `.opencode/plugins/mk-code-graph.js` and update `PLUGIN_ID` (F006/Q6).
5. Rename `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` to `mk-code-graph-bridge.mjs`; no duplicate cleanup required (F007/Q7).
6. Keep MCP server name `mk-code-index`; do not rename it to `mk-code-graph` (F008/Q8).
7. Update current docs, tests, plugin README entries, feature catalog, manual testing playbook, and bridge README references for plugin rename and naming asymmetry (F010/Q10).
8. Add 5-runtime SessionStart parity covering Claude, Gemini, Codex, OpenCode, Devin with startup block equivalence.

### Out of Scope

- Migrating code-graph hook source to `.opencode/skills/system-code-graph/hooks/`; deferred per ADR-001 as too high-risk.
- Renaming MCP server `mk-code-index` or tool prefix `mcp__mk_code_index__*`; rejected per ADR-002.
- Adding legacy env-var aliases for code-graph plugin rename; Phase A found no legacy code-graph env vars (F006/Q6).
- Writing inside `research/`; Phase A outputs are frozen.
- Modifying `.opencode/skills/`, `.devin/`, or `.claude/` during Phase B.
- Touching `z_archive/`, changelogs, or historical spec refs during grep cleanup.
- Filling `implementation-summary.md` before Phase D verification.

### Files to Change in Phase C

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` | Create | Devin SessionStart variant at accepted hook source location. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js` | Generate | Compiled hook output. |
| `.opencode/plugins/spec-kit-compact-code-graph.js` -> `.opencode/plugins/mk-code-graph.js` | Rename | OpenCode plugin file and `PLUGIN_ID` update. |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` -> `mk-code-graph-bridge.mjs` | Rename | Bridge rename in existing code-graph ownership location. |
| `.devin/hooks.v1.json` | Create/Update | Shared final merge with packet 025; code-graph SessionStart entry. |
| `.devin/config.json` | Verify | Keep `read_config_from.claude=true` safety net. |
| `.opencode/skills/system-code-graph/**` | Modify | Current docs, tests, bridge README, feature catalog, playbook refs. |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep hook source at `system-spec-kit/mcp_server/hooks/`. | Devin source is created at `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts`; no `system-code-graph/hooks/` migration occurs. Evidence: F002/Q2, ADR-001. |
| REQ-002 | Preserve startup payload contract. | Devin output includes `kind=startup`, provenance fields, and `sectionKeys=[structural-context]` matching `readiness-marker.ts` contract. Evidence: F004/Q4. |
| REQ-003 | Mirror Claude freshness behavior. | Stale state warns and recommends `code_graph_scan`; no inline scan in hook. Evidence: F005/Q5. |
| REQ-004 | Rename plugin to `mk-code-graph`. | Plugin file and `PLUGIN_ID` are renamed, with current grep clean for `spec-kit-compact-code-graph` outside frozen history. Evidence: F006/Q6. |
| REQ-005 | Rename bridge to `mk-code-graph-bridge.mjs`. | Bridge file renamed in `system-code-graph/mcp_server/plugin_bridges/` and all current imports updated. Evidence: F007/Q7. |
| REQ-006 | Keep MCP server name stable. | No `mk-code-index` server/tool-prefix rename occurs; docs explain plugin/MCP asymmetry. Evidence: F008/Q8, ADR-002. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Implement hybrid Devin safety net. | Explicit Devin hook plus verified `read_config_from.claude=true`; double-firing outcome recorded. Evidence: F001/Q1, F003/Q3. |
| REQ-008 | Maintain clean post-extraction surface. | Current cross-boundary references remain justified by `code-graph-boundary.ts`; no accidental refs added. Evidence: F009/Q9. |
| REQ-009 | Add 5-runtime startup parity. | Claude/Gemini/Codex/OpenCode/Devin produce equivalent structural-context blocks. |
| REQ-010 | Update stale docs. | SKILL.md, feature catalog, manual playbook, and bridge README reflect `mk-code-graph` and `mk-code-index` asymmetry; DQI >= 4.0. Evidence: F010/Q10. |
| REQ-011 | Verify all 10 code-graph public tools. | MCP boot smoke verifies code graph, detect changes, CCC, and apply surfaces. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict packet validation exits 0, except frozen research citation warnings are reported as issues if the validator refuses strict clean output.
- **SC-002**: Devin `/hooks` lists code-graph SessionStart from `.devin/hooks.v1.json`.
- **SC-003**: Devin startup smoke emits structural-context content matching `kind=startup` contract.
- **SC-004**: 5-runtime SessionStart parity passes for Claude, Gemini, Codex, OpenCode, Devin.
- **SC-005**: `tsc --noEmit` passes for touched hook/build surfaces.
- **SC-006**: `vitest run` passes for touched code-graph/session-start tests.
- **SC-007**: MCP server boot smoke verifies all 10 public code-graph tools.
- **SC-008**: Grep for `spec-kit-compact-code-graph` returns zero current hits outside frozen history.
- **SC-009**: Grep for old bridge filename returns zero current hits outside frozen history.
- **SC-010**: No migration to `system-code-graph/hooks/` occurs in this packet.
- **SC-011**: sk-doc DQI is >= 4.0 for touched code-graph docs.
- **SC-012**: `.devin/config.json` `read_config_from.claude` setting is verified and double-firing status recorded.
- **SC-013**: `checklist.md` Phase D evidence slots are filled before completion.
- **SC-014**: `implementation-summary.md` remains placeholder until Phase D verification.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Devin may not honor inherited Claude SessionStart output. | High | Explicit Devin variant plus inherited safety net; live `/hooks` and startup smoke. Evidence: F001/Q1. |
| Risk | Hook source asymmetry confuses future maintainers. | Medium | ADR-001 and docs explicitly explain why code-graph differs from advisor. Evidence: F002/Q2. |
| Risk | Plugin/MCP name asymmetry confuses tool consumers. | Medium | ADR-002, SKILL.md, plugins README explain `mk-code-index` is stable MCP name. Evidence: F008/Q8. |
| Risk | Plugin rename breaks OpenCode cache. | High | Rename current refs, cold-start smoke, grep cleanup. Evidence: F006/Q6. |
| Risk | Bridge import path update missed. | Medium | Rename bridge and update imports/tests in Phase 1. Evidence: F007/Q7. |
| Risk | Inline graph refresh slows hook. | Medium | Mirror Claude warn-only stale behavior. Evidence: F005/Q5. |
| Risk | `.devin/hooks.v1.json` merge clobbers packet 025. | High | Phase E shared merge review. |
| Risk | Empty/stale docs miss DQI threshold. | Medium | Update code-graph docs and rescore. Evidence: F010/Q10. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Maintain startup parity across Claude, Gemini, Codex, OpenCode, and Devin.
- **NFR-002**: Hooks fail open and do not block session start on graph errors.
- **NFR-003**: Hook runtime remains lightweight; no inline full graph scan.
- **NFR-004**: MCP tool prefix remains stable as `mcp__mk_code_index__*`.
- **NFR-005**: sk-code typecheck and vitest are green for touched surfaces.
- **NFR-006**: sk-doc DQI is >= 4.0 for each touched authored code-graph doc.
<!-- /ANCHOR:nfr -->

---
<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Devin ignores inherited Claude SessionStart output; explicit hook must still work (F001/Q1).
- Devin fires both inherited Claude and explicit Devin SessionStart; Phase D must record dedupe/disable decision.
- Readiness marker is stale; hook warns and recommends `code_graph_scan`, no inline refresh (F005/Q5).
- Readiness marker is empty or error; hook fails open with actionable startup context.
- Future maintainer tries to move hooks to `system-code-graph/hooks/`; ADR-001 documents deferral.
- Future maintainer tries to rename MCP server to `mk-code-graph`; ADR-002 rejects that.
- `.devin/hooks.v1.json` contains advisor and code-graph hooks; packet 036 must not overwrite packet 025.
- Current grep finds historical `spec-kit-compact-code-graph` refs in frozen history; excluded.
- `SET-UP_GUIDE.md` may be empty; Phase C must populate or document deferral with DQI evidence (F010/Q10).
- Boundary layer imports are intentional; post-extraction audit should remain clean, not eliminate valid boundaries (F009/Q9).
<!-- /ANCHOR:edge-cases -->

---
<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Hook variant, plugin rename, bridge rename, docs, tests, shared `.devin` merge. |
| Risk | 22/25 | Startup contract, hook-source asymmetry, plugin/MCP naming asymmetry. |
| Research | 18/20 | 10 findings complete; Q1 low confidence due empirical constraint. |
| Multi-Agent | 8/15 | Later phases use external CLI dispatch; Phase B does not dispatch. |
| Coordination | 14/15 | Cross-packet `.devin/hooks.v1.json` and 5-runtime parity. |
| **Total** | **86/100** | **Level 3; cross-runtime startup hook and plugin rename scope** |
<!-- /ANCHOR:complexity -->

---
<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Likelihood | Impact | Mitigation | Evidence |
|---------|-------------|------------|--------|------------|----------|
| R-001 | Devin inherited SessionStart no-ops. | M | H | Explicit Devin hook plus live startup smoke. | F001/Q1 |
| R-002 | Hook migration accidentally attempted. | L | H | ADR-001 keeps source in system-spec-kit. | F002/Q2 |
| R-003 | Startup payload loses `kind=startup` contract. | L | H | Test `getStartupBriefFromMarker()` output and section keys. | F004/Q4 |
| R-004 | Stale graph triggers heavy hook refresh. | L | M | Mirror Claude warn-only stale behavior. | F005/Q5 |
| R-005 | `mk-code-graph` rename breaks plugin load. | M | H | Atomic rename, cold-start smoke, grep cleanup. | F006/Q6 |
| R-006 | Bridge rename misses import path. | M | M | Bridge tests and grep old filename. | F007/Q7 |
| R-007 | MCP name renamed accidentally. | L | H | ADR-002 forbids `mk-code-index` rename. | F008/Q8 |
| R-008 | Cross-boundary audit overcorrects. | L | M | Keep justified boundary layer refs. | F009/Q9 |
| R-009 | sk-doc DQI < 4.0 due stale docs. | M | M | Update docs and rescore. | F010/Q10 |
| R-010 | Shared `.devin/hooks.v1.json` clobbers advisor. | M | H | Phase E merge review across packets. | Plan |
<!-- /ANCHOR:risk-matrix -->

---
<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Devin Startup Brief (Priority: P0)

**As a** Devin user, **I want** structural code-graph context injected at SessionStart, **so that** the model begins with graph freshness, highlights, and startup provenance like other runtimes.

**Acceptance Criteria**:
1. Given a Devin SessionStart event, when the hook runs, then output includes the startup brief contract (`kind=startup`, provenance, `sectionKeys=[structural-context]`) or fails open with diagnostics (F004/Q4).
2. Given a stale graph marker, when the hook runs, then it warns and recommends `code_graph_scan` without inline refresh (F005/Q5).

### US-002: Stable Hook Ownership (Priority: P1)

**As a** maintainer, **I want** code-graph hooks to stay where current build/config paths expect them, **so that** Devin support does not require a risky migration.

**Acceptance Criteria**:
1. Given Phase C changes, when paths are reviewed, then no migration to `system-code-graph/hooks/` occurred.
2. Given docs review, when ADR-001 is read, then the asymmetry versus advisor is explicit and justified (F002/Q2).

### US-003: Naming Clarity (Priority: P1)

**As a** repo operator, **I want** the plugin named `mk-code-graph` while MCP remains `mk-code-index`, **so that** OpenCode plugin identity matches the skill without breaking tool consumers.

**Acceptance Criteria**:
1. Given plugin docs, when current refs are searched, then `spec-kit-compact-code-graph` is gone outside frozen history (F006/Q6).
2. Given MCP config, when server names are searched, then `mk-code-index` remains stable and documented (F008/Q8).
<!-- /ANCHOR:user-stories -->

---
<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- ANSWERED: Devin SessionStart context injection? Devin docs are silent; hybrid explicit variant plus inheritance safety net accepted (F001/Q1, F003/Q3).
- ANSWERED: Hook source migration? Keep under `system-spec-kit/mcp_server/hooks/`; migration deferred as high-risk (F002/Q2).
- ANSWERED: Startup payload contract? `getStartupBriefFromMarker()` and `readiness-marker.ts` contract verified (F004/Q4).
- ANSWERED: Freshness behavior? Mirror Claude stale warning and `code_graph_scan` recommendation (F005/Q5).
- ANSWERED: Plugin rename scope? Direct `spec-kit-compact-code-graph` to `mk-code-graph`; no env aliases required (F006/Q6).
- ANSWERED: Bridge duplicate? No duplicate; simple rename (F007/Q7).
- ANSWERED: MCP name? Keep `mk-code-index`; document plugin/MCP asymmetry (F008/Q8).
- ANSWERED: Post-extraction audit? Clean; no remediation needed beyond standard verification (F009/Q9).
- ANSWERED: sk-doc gaps? Update plugin refs, bridge README, feature catalog, manual playbook, and empty setup guide if touched (F010/Q10).
<!-- /ANCHOR:questions -->

---
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Target**: See `research/research.md`
- **Resource Map**: See `resource-map.md`
