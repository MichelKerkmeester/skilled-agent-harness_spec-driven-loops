---
title: "Verification Checklist: CLI Devin Code Graph Hook"
description: "Phase D acceptance checklist for code-graph Devin SessionStart, mk-code-graph rename, bridge rename, tests, docs, and live verification."
trigger_phrases:
  - "checklist"
  - "verification"
  - "code-graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T17:35:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 40
    open_questions: []
    answered_questions: []
---

# Verification Checklist: CLI Devin Code Graph Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] **CHK-PROTO-001 [P0]** Confirm work stayed on `main` or documented worktree branch with no commits. Evidence slot: git branch/status output.
- [ ] **CHK-PROTO-002 [P0]** Confirm no writes occurred inside `research/`. Evidence slot: git status for packet research path.
- [ ] **CHK-PROTO-003 [P0]** Confirm no hook migration to `system-code-graph/hooks/` occurred. Evidence slot: path review.
- [ ] **CHK-PROTO-004 [P1]** Confirm implementation-summary remained placeholder until Phase D verification. Evidence slot: file review.
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] **CHK-PRE-001 [P0]** ADR-001 accepted hook source location. Evidence slot: `decision-record.md#adr-001`.
- [ ] **CHK-PRE-002 [P0]** ADR-002 accepted naming asymmetry. Evidence slot: `decision-record.md#adr-002`.
- [ ] **CHK-PRE-003 [P0]** ADR-003 accepted hybrid Devin strategy. Evidence slot: `decision-record.md#adr-003`.
- [ ] **CHK-PRE-004 [P1]** Baseline SHA recorded before Phase C. Evidence slot: `git rev-parse HEAD`.
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] **CHK-CODE-001 [P0]** Devin SessionStart source calls `getStartupBriefFromMarker()`. Evidence slot: source line.
- [ ] **CHK-CODE-002 [P0]** Startup output includes `kind=startup`, provenance, and `sectionKeys=[structural-context]`. Evidence slot: test output.
- [ ] **CHK-CODE-003 [P0]** Stale marker handling warns and recommends `code_graph_scan`, no inline refresh. Evidence slot: source/test review.
- [ ] **CHK-CODE-004 [P1]** `PLUGIN_ID` is `mk-code-graph`. Evidence slot: plugin file line.
- [ ] **CHK-CODE-005 [P1]** MCP server name remains `mk-code-index`. Evidence slot: config/source review.
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [ ] **CHK-TEST-001 [P0]** `tsc --noEmit` passes. Evidence slot: command output.
- [ ] **CHK-TEST-002 [P0]** `vitest run` passes on touched code-graph tests. Evidence slot: command output.
- [ ] **CHK-TEST-003 [P0]** 5-runtime SessionStart parity passes. Evidence slot: parity test output.
- [ ] **CHK-TEST-004 [P1]** Code-graph MCP boot smoke verifies 10 public tools. Evidence slot: smoke output.
- [ ] **CHK-TEST-005 [P1]** Plugin bridge test passes after rename. Evidence slot: vitest output.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] **CHK-FIX-001 [P0]** Hook location finding class is architecture-decision and path inventory proves no migration. Evidence slot: F002 path review.
- [ ] **CHK-FIX-002 [P0]** Plugin rename finding class is cross-consumer and inventory covers plugin, bridge, docs, tests. Evidence slot: F006/F007 grep inventory.
- [ ] **CHK-FIX-003 [P1]** Startup contract finding class is matrix/evidence across 5 runtimes. Evidence slot: parity matrix.
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [ ] **CHK-SEC-001 [P0]** Hook command uses `DEVIN_PROJECT_DIR`, not user-specific absolute paths. Evidence slot: `.devin/hooks.v1.json`.
- [ ] **CHK-SEC-002 [P1]** Hook fails open on readiness marker errors. Evidence slot: test/source review.
- [ ] **CHK-SEC-003 [P1]** Startup diagnostics expose no secrets beyond existing hook policy. Evidence slot: source review.
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [ ] **CHK-DOC-001 [P1]** SKILL.md documents hook-source asymmetry. Evidence slot: file line.
- [ ] **CHK-DOC-002 [P1]** Plugin README documents `mk-code-graph` vs `mk-code-index`. Evidence slot: file line.
- [ ] **CHK-DOC-003 [P1]** Feature catalog and manual playbook include Devin SessionStart smoke. Evidence slot: file lines.
- [ ] **CHK-DOC-004 [P1]** Bridge README uses `mk-code-graph-bridge.mjs`. Evidence slot: file path.
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [ ] **CHK-FILE-001 [P0]** Plugin file renamed to `.opencode/plugins/mk-code-graph.js`. Evidence slot: `ls`.
- [ ] **CHK-FILE-002 [P0]** Bridge file renamed to `mk-code-graph-bridge.mjs`. Evidence slot: `ls`.
- [ ] **CHK-FILE-003 [P0]** No `.opencode/skills/system-code-graph/hooks/` migration path created. Evidence slot: `find` output.
- [ ] **CHK-FILE-004 [P1]** Frozen history paths unchanged. Evidence slot: git status exclusions.
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 0/25 |
| P1 Items | 27 | 0/27 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Phase D evidence pending.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] **CHK-ARCH-001 [P0]** ADR-001 hook location followed. Evidence slot: source path review.
- [ ] **CHK-ARCH-002 [P0]** ADR-002 MCP/plugin naming followed. Evidence slot: config and docs.
- [ ] **CHK-ARCH-003 [P1]** ADR-003 hybrid strategy verified live. Evidence slot: `/hooks` output.
<!-- /ANCHOR:arch-verify -->

---
<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] **CHK-PERF-001 [P1]** Hook completes inside timeout. Evidence slot: smoke timing.
- [ ] **CHK-PERF-002 [P1]** No inline graph scan occurs. Evidence slot: source review.
- [ ] **CHK-PERF-003 [P2]** OpenCode plugin cold-start remains acceptable. Evidence slot: smoke timing.
<!-- /ANCHOR:perf-verify -->

---
<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] **CHK-DEPLOY-001 [P0]** `.devin/hooks.v1.json` includes code-graph hook without clobbering packet 025. Evidence slot: JSON review.
- [ ] **CHK-DEPLOY-002 [P1]** `.devin/config.json` `read_config_from.claude` setting verified. Evidence slot: JSON review.
- [ ] **CHK-DEPLOY-003 [P1]** Rollback commands recorded with baseline SHA. Evidence slot: plan plus shell output.
<!-- /ANCHOR:deploy-ready -->

---
<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] **CHK-COMP-001 [P0]** Strict packet validation exits 0 or frozen research warning is escalated. Evidence slot: command output.
- [ ] **CHK-COMP-002 [P1]** sk-code verification evidence attached. Evidence slot: typecheck/vitest outputs.
- [ ] **CHK-COMP-003 [P1]** sk-doc DQI >= 4.0 for touched docs. Evidence slot: DQI output.
- [ ] **CHK-COMP-004 [P1]** Legacy grep cleanup excludes only approved frozen history. Evidence slot: grep command and output.
<!-- /ANCHOR:compliance-verify -->

---
<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] **CHK-DOCV-001 [P1]** `resource-map.md` lists TS source, dist, JSON config, Markdown docs, tests, hands-off paths. Evidence slot: file review.
- [ ] **CHK-DOCV-002 [P1]** `decision-record.md` ADRs remain ACCEPTED after implementation. Evidence slot: file review.
- [ ] **CHK-DOCV-003 [P1]** `handover.md` continuity reflects Phase C/D state after verification. Evidence slot: file review.
<!-- /ANCHOR:docs-verify -->

---
<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] **CHK-SIGN-001 [P0]** No unresolved HALT conditions remain. Evidence slot: issue list.
- [ ] **CHK-SIGN-002 [P0]** Packet owner reviewed Phase D evidence. Evidence slot: sign-off note.
- [ ] **CHK-SIGN-003 [P1]** Ready for Phase E cross-packet integration. Evidence slot: combined hooks JSON review.
<!-- /ANCHOR:sign-off -->

## Completion Rollup

- [ ] **CHK-SUM-001 [P0]** All P0 checks complete.
- [ ] **CHK-SUM-002 [P1]** All P1 checks complete or explicitly deferred by user.
- [ ] **CHK-SUM-003 [P2]** P2 observations recorded as follow-ons if not completed.
