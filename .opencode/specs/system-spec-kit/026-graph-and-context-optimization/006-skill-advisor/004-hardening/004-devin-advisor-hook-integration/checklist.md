---
title: "Verification Checklist: CLI Devin Skill Advisor Hook"
description: "Phase D acceptance checklist for advisor Devin hook, mk-skill-advisor rename, bridge migration, tests, docs, and live verification."
trigger_phrases:
  - "checklist"
  - "verification"
  - "skill-advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-devin-advisor-hook-integration"
    last_updated_at: "2026-05-15T17:30:00Z"
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

# Verification Checklist: CLI Devin Skill Advisor Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] **CHK-PROTO-001 [P0]** Confirm work stayed on `main` or a documented worktree branch with no commits. Evidence slot: git branch/status output.
- [ ] **CHK-PROTO-002 [P0]** Confirm no writes occurred inside `research/`. Evidence slot: git status for packet research path.
- [ ] **CHK-PROTO-003 [P0]** Confirm Phase C did not touch `.claude/` except where explicitly approved for verification evidence. Evidence slot: git status scoped output.
- [ ] **CHK-PROTO-004 [P1]** Confirm implementation-summary remained placeholder until Phase D verification. Evidence slot: file review.
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] **CHK-PRE-001 [P0]** ADR-001 accepted hybrid Devin strategy before implementation. Evidence slot: `decision-record.md#adr-001`.
- [ ] **CHK-PRE-002 [P0]** ADR-002 accepted plugin rename and env-var alias strategy. Evidence slot: `decision-record.md#adr-002`.
- [ ] **CHK-PRE-003 [P0]** ADR-003 accepted bridge ownership migration. Evidence slot: `decision-record.md#adr-003`.
- [ ] **CHK-PRE-004 [P1]** Baseline SHA recorded before Phase C. Evidence slot: `git rev-parse HEAD`.
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] **CHK-CODE-001 [P0]** Devin hook source mirrors fail-open advisor pattern. Evidence slot: source review plus F001/F002 reference.
- [ ] **CHK-CODE-002 [P0]** `PLUGIN_ID` is `mk-skill-advisor`. Evidence slot: plugin file line.
- [ ] **CHK-CODE-003 [P0]** Legacy and canonical env vars both work. Evidence slot: test output.
- [ ] **CHK-CODE-004 [P1]** Bridge import path points to advisor-owned bridge. Evidence slot: plugin source and bridge test.
- [ ] **CHK-CODE-005 [P1]** Post-extraction `system-spec-kit/mcp_server` refs are justified or cleaned. Evidence slot: grep output annotated with F006.
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [ ] **CHK-TEST-001 [P0]** `tsc --noEmit` passes. Evidence slot: command output.
- [ ] **CHK-TEST-002 [P0]** `vitest run` passes on touched advisor tests. Evidence slot: command output.
- [ ] **CHK-TEST-003 [P0]** 5-runtime parity passes for Claude/Gemini/Codex/OpenCode/Devin. Evidence slot: parity test output.
- [ ] **CHK-TEST-004 [P1]** Advisor MCP boot smoke verifies 8 public tools. Evidence slot: smoke output.
- [ ] **CHK-TEST-005 [P1]** Plugin bridge test passes after move. Evidence slot: vitest output.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] **CHK-FIX-001 [P0]** Rename finding class is cross-consumer and inventory covers plugin, bridge, docs, tests, env vars. Evidence slot: F004 grep inventory.
- [ ] **CHK-FIX-002 [P0]** Bridge move finding class is cross-consumer and import consumers are updated. Evidence slot: F005/F006 grep inventory.
- [ ] **CHK-FIX-003 [P1]** Devin hook finding class is matrix/evidence due 5-runtime parity. Evidence slot: parity matrix.
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [ ] **CHK-SEC-001 [P0]** Hook command uses `DEVIN_PROJECT_DIR`, not user-specific absolute paths. Evidence slot: `.devin/hooks.v1.json`.
- [ ] **CHK-SEC-002 [P1]** Hook input parsing handles stdin/argv safely and fails open. Evidence slot: test/source review.
- [ ] **CHK-SEC-003 [P1]** Diagnostic JSONL contains no prompt secrets beyond existing hook policy. Evidence slot: source review.
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [ ] **CHK-DOC-001 [P1]** SKILL/README/ARCHITECTURE current references use `mk-skill-advisor` where touched. Evidence slot: grep output.
- [ ] **CHK-DOC-002 [P1]** SET-UP_GUIDE and INSTALL_GUIDE stale plugin refs updated. Evidence slot: file lines.
- [ ] **CHK-DOC-003 [P1]** Feature catalog and manual playbook include Devin hook and rename coverage. Evidence slot: file lines.
- [ ] **CHK-DOC-004 [P1]** Bridge README exists under advisor ownership. Evidence slot: file path.
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [ ] **CHK-FILE-001 [P0]** Plugin file renamed to `.opencode/plugins/mk-skill-advisor.js`. Evidence slot: `ls`.
- [ ] **CHK-FILE-002 [P0]** Bridge file moved to advisor `plugin_bridges/`. Evidence slot: `ls`.
- [ ] **CHK-FILE-003 [P1]** Old current plugin/bridge files absent or intentionally shimmed with evidence. Evidence slot: `find` output.
- [ ] **CHK-FILE-004 [P1]** Frozen history paths unchanged. Evidence slot: git status exclusions.
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 0/24 |
| P1 Items | 28 | 0/28 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Phase D evidence pending.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:arch-verify -->
## Arch Verify

- [ ] **CHK-ARCH-001 [P0]** Explicit Devin hook and inherited Claude safety net behavior verified. Evidence slot: `/hooks` plus prompt smoke.
- [ ] **CHK-ARCH-002 [P1]** Double-firing outcome recorded and mitigated if observed. Evidence slot: smoke notes.
- [ ] **CHK-ARCH-003 [P1]** Advisor bridge ownership now matches extraction boundary. Evidence slot: ADR-003 plus file paths.
<!-- /ANCHOR:arch-verify -->

---
<!-- ANCHOR:perf-verify -->
## Perf Verify

- [ ] **CHK-PERF-001 [P1]** Hook completes inside timeout. Evidence slot: smoke timing.
- [ ] **CHK-PERF-002 [P1]** No heavy scan/build happens inside UserPromptSubmit. Evidence slot: source review.
- [ ] **CHK-PERF-003 [P2]** OpenCode plugin cold-start remains acceptable. Evidence slot: smoke timing.
<!-- /ANCHOR:perf-verify -->

---
<!-- ANCHOR:deploy-ready -->
## Deploy Ready

- [ ] **CHK-DEPLOY-001 [P0]** `.devin/hooks.v1.json` includes advisor hook without clobbering packet 036. Evidence slot: JSON review.
- [ ] **CHK-DEPLOY-002 [P1]** `.devin/config.json` `read_config_from.claude` setting verified. Evidence slot: JSON review.
- [ ] **CHK-DEPLOY-003 [P1]** Rollback commands are recorded with baseline SHA. Evidence slot: plan plus shell output.
<!-- /ANCHOR:deploy-ready -->

---
<!-- ANCHOR:compliance-verify -->
## Compliance Verify

- [ ] **CHK-COMP-001 [P0]** Strict packet validation exits 0. Evidence slot: command output.
- [ ] **CHK-COMP-002 [P1]** sk-code verification evidence attached. Evidence slot: typecheck/vitest outputs.
- [ ] **CHK-COMP-003 [P1]** sk-doc DQI >= 4.0 for touched docs. Evidence slot: DQI output.
- [ ] **CHK-COMP-004 [P1]** Legacy grep cleanup excludes only approved frozen history. Evidence slot: grep command and output.
<!-- /ANCHOR:compliance-verify -->

---
<!-- ANCHOR:docs-verify -->
## Docs Verify

- [ ] **CHK-DOCV-001 [P1]** `resource-map.md` lists TS source, dist, JSON config, Markdown docs, tests, hands-off paths. Evidence slot: file review.
- [ ] **CHK-DOCV-002 [P1]** `decision-record.md` ADRs remain ACCEPTED after implementation. Evidence slot: file review.
- [ ] **CHK-DOCV-003 [P1]** `handover.md` continuity reflects Phase C/D state after verification. Evidence slot: file review.
<!-- /ANCHOR:docs-verify -->

---
<!-- ANCHOR:sign-off -->
## Sign-Off

- [ ] **CHK-SIGN-001 [P0]** No HALT conditions remain unresolved. Evidence slot: issue list.
- [ ] **CHK-SIGN-002 [P0]** Packet owner reviewed Phase D evidence. Evidence slot: sign-off note.
- [ ] **CHK-SIGN-003 [P1]** Ready for Phase E cross-packet integration. Evidence slot: combined hooks JSON review.
<!-- /ANCHOR:sign-off -->

## Completion Rollup

- [ ] **CHK-SUM-001 [P0]** All P0 checks complete.
- [ ] **CHK-SUM-002 [P1]** All P1 checks complete or explicitly deferred by user.
- [ ] **CHK-SUM-003 [P2]** P2 observations recorded as follow-ons if not completed.
