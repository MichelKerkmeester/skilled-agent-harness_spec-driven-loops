# Deep Review Report — DeepSeek Lane

**Session ID**: fanout-deepseek-1785216731182-5rt43x
**Review Target**: `.opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review`
**Generated**: 2026-07-28T11:15:00Z
**Lineage Mode**: new | **Generation**: 1

---

## Executive Summary

**Verdict: CONDITIONAL** — 1 active P1, 0 active P0, 16 active P2
**hasAdvisories**: true (16 P2 advisories)

The DeepSeek lane completed its 5-iteration autonomous review of the code-graph decommission's touched surfaces with all four review dimensions (correctness, security, traceability, maintainability) covered. The review found no critical blockers (P0) and one required fix (P1): the 015-verification closeout claim that "no live imports survive" is overbroad given that live code-graph signal handlers remain in `trust-tree.ts` for the external `system_code_graph` MCP server.

The decommission appears genuinely complete — the internal `system-code-graph` subsystem was fully removed, the `code_graph/` directory is deleted, no stale internal imports survive in production code, doctor commands are clean, and agent mirrors have no residual code-graph references. However, 17 findings across all dimensions document residual tool references, security-fix gap contracts, and documentation scaffold completeness.

The grok lane completed its review before this DeepSeek lane, confirming the fan-out mechanism operates correctly.

---

## Planning Trigger

**Route**: `/speckit:plan` — CONDITIONAL verdict routes to remediation planning.

F010 (P1) requires the 015-verification-and-closeout `implementation-summary.md` to be amended to explicitly distinguish "no decommissioned internal imports" from "no external-server code-graph references." This is a one-line wording correction, not a code change. All 16 P2 advisories can be deferred or resolved at the operator's discretion.

---

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Iteration |
|----|----------|-----------|-------|----------|-----------|
| F001 | P2 | correctness | Missing plugin file breaks test imports | `tests/opencode-plugin.vitest.ts:13` | 001 |
| F002 | P2 | correctness | Session-prime injects potentially stale code-graph tool guidance | `hooks/claude/session-prime.ts:212` | 001 |
| F003 | P2 | correctness | Compact-inject regex matches potentially nonexistent tool names | `hooks/claude/compact-inject.ts:121` | 001 |
| F004 | P2 | correctness | Layer-definitions lists code_graph tools without namespace prefix | `lib/architecture/layer-definitions.ts:115` | 001 |
| F005 | P2 | correctness | External code-graph contract imports in test-only code | `tests/opencode-transport.vitest.ts:6` | 001 |
| F006 | P2 | security | cli-opencode executor grants full OS write access with no sandbox enforcement | `references/protocol/loop-protocol.md:280` | 002 |
| F007 | P2 | security | Security-sensitive fix overrides are SPEC-ONLY with no runtime enforcement | `references/convergence/convergence.md:77-86` | 002 |
| F008 | P2 | security | Fable-subagent-guard fails open when transcript is unreadable | `hooks/claude/fable-subagent-guard.mjs:13` | 002 |
| F009 | P2 | security | Session-prime emits code-graph tool guidance without server-health validation | `hooks/claude/session-prime.ts:212` | 002 |
| **F010** | **P1** | traceability | 015 closeout claim "no live imports survive" is misleading — live signal handlers remain | `015-verification/implementation-summary.md:64` vs `trust-tree.ts:104-116` | 003 |
| F011 | P2 | traceability | Layer-definitions tool list not refreshed post-decommission | `lib/architecture/layer-definitions.ts:115` | 003 |
| F012 | P2 | traceability | Spec wording "unrelated external models" could imply different access surfaces | `016-deep-review/spec.md:84` | 003 |
| F013 | P2 | traceability | implementation-summary.md is an unpopulated scaffold | `016-deep-review/implementation-summary.md:1` | 003 |
| F014 | P2 | maintainability | Agent mirror permission models differ (deny-list vs allow-list) | `.opencode/agents/orchestrate.md:4-15` vs `.claude/agents/orchestrate.md:4` | 004 |
| F015 | P2 | maintainability | Orchestrator agent mirrors have expected per-runtime divergences | `.opencode/agents/orchestrate.md:157` vs `.claude/agents/orchestrate.md:146` | 004 |
| F016 | P2 | maintainability | plan.md, tasks.md, implementation-summary.md are scaffold templates | `016-deep-review/plan.md:1` + `tasks.md:1` + `implementation-summary.md:1` | 004 |
| F017 | P2 | maintainability | 016-deep-review lacks checklist.md (Level 1, not required) | `016-deep-review/spec.md:39` | 004 |
| F018 | P2 | maintainability | Grok lane completed before DeepSeek lane — cross-lane timing observation | `review/lineages/grok/review-report.md` exists | 005 |

---

## Remediation Workstreams

### Lane 1: Closeout Documentation Fix (P1 — Required)
**Finding**: F010
**Action**: Amend `015-verification-and-closeout/implementation-summary.md` line 64 to qualify "no live imports survive" as "no live imports of the decommissioned internal module survive." Add clarifying note that external `system_code_graph` MCP server signal handlers remain intentionally.
**Expected LOC**: ~5 lines changed

### Lane 2: Test Import Cleanup (P2 — Advisory)
**Finding**: F001
**Action**: Either remove the `import mkCodeGraphPlugin from '../../../../plugins/mk-code-graph.js'` from `tests/opencode-plugin.vitest.ts:13` or add a skipped/expected-to-fail test wrapper.
**Expected LOC**: ~3 lines changed

### Lane 3: Hook Guidance Refresh (P2 — Advisory)
**Findings**: F002, F003, F009
**Action**: Verify external `system_code_graph` MCP server tool names match the bare names referenced in `session-prime.ts` and `compact-inject.ts`. If the server uses `mcp__mk_code_index__code_graph_*` prefix, update the references. If bare names are valid aliases, add a note documenting that.
**Expected LOC**: ~10 lines changed or 0 if confirmed valid

### Lane 4: Security Contract Implementation (P2 — Deferred)
**Finding**: F007
**Action**: When resources permit, implement the security-sensitive fix overrides described in `convergence.md:77-86`. The contract is fully documented and awaiting runtime enforcement.
**Expected LOC**: ~50-100 lines across config, YAML, and reducer

### Lane 5: Documentation Scaffold Completion (P2 — Deferred)
**Findings**: F013, F016
**Action**: Populate `016-deep-review/plan.md`, `tasks.md`, and `implementation-summary.md` after review is complete. Use the existing `spec.md` content as the source of truth for requirements and scope.
**Expected LOC**: ~50-100 lines

### Lane 6: Cross-Runtime Mirror Documentation (P2 — Advisory)
**Findings**: F014, F015
**Action**: No code changes needed. These document expected per-runtime variation patterns. Can be noted in architecture docs for future mirror authors.

---

## Spec Seed

```markdown
### Amended: 015-verification-and-closeout §What Was Built
- REQ-CL-001: The "no live imports survive" claim in the Live-surface sweep section
  MUST explicitly distinguish decommissioned internal module imports from
  external system_code_graph MCP server signal handler references.
- REQ-CL-002: External server references in trust-tree.ts, layer-definitions.ts,
  and hook files are intentionally retained. Add a note documenting this
  to prevent future decommission sweeps from finding and removing them.
```

---

## Plan Seed

```markdown
### T001 [P] Amend 015 closeout claim (F010)
- Read 015-verification-and-closeout/implementation-summary.md:60-64
- Rewrite "no live imports survive" with qualification about external vs internal
- Verify with rg --hidden --no-ignore sweep that the amended text is accurate

### T002 [P] Clean up stale plugin test import (F001)
- Read tests/opencode-plugin.vitest.ts:13
- Remove or skip-guard the mk-code-graph plugin import

### T003 Verify hook tool name validity (F002, F003, F009)
- Read hooks/claude/session-prime.ts:212
- Read hooks/claude/compact-inject.ts:121
- Confirm external server tool prefix matches referenced names
- Update or document as needed

### T004 Populate 016-deep-review scaffold docs (F013, F016)
- Fill plan.md, tasks.md, implementation-summary.md from spec.md content
- Run validate.sh --strict on the packet
```

---

## Traceability Status

| Protocol | Level | Status | Details |
|----------|-------|--------|---------|
| spec_code | core (hard) | partial | Iteration 003 found F010: 015 closeout claim of "no live imports" is overbroad. Trust-tree.ts:104-116 has live codeGraphSignal() processing external server signals. The claim is technically correct for decommissioned internal paths but the wording is misleading without qualification. |
| checklist_evidence | core (hard) | partial | 015-verification-and-closeout honestly reports 3 accounted-for full-suite failures. No checklist fabrication detected. Packet 016-deep-review is Level 1 (checklist not required). The parent 036 phase map marks all phases Complete except 016, which is accurate. |

---

## Deferred Items

- **F005**: External code-graph contract import in test — valid integration test, no action needed.
- **F006**: cli-opencode sandbox enforcement — documented design constraint, not a defect.
- **F007**: Security fix overrides — deferred to future implementation (spec-only).
- **F008**: Fable-subagent-guard fail-open — documented project-wide guard policy.
- **F011**: Layer-definitions tool list refresh — deferred until external server audit.
- **F012**: Spec wording ambiguity — minor, does not affect execution.
- **F017**: Checklist.md absence — Level 1 packet, not required.
- **F018**: Cross-lane timing observation — fan-out expected behavior.

---

## Audit Appendix

### Iteration Summary

| Run | Dimension | Findings | New P0 | New P1 | New P2 | Ratio | Status |
|-----|-----------|----------|--------|--------|--------|-------|--------|
| 1 | correctness | 5 | 0 | 0 | 5 | 0.636 | PASS |
| 2 | security | 4 | 0 | 0 | 4 | 0.444 | PASS |
| 3 | traceability | 4 | 0 | 1 | 3 | 0.400 | **CONDITIONAL** |
| 4 | maintainability | 4 | 0 | 0 | 4 | 0.160 | PASS |
| 5 | coverage-verification | 1 | 0 | 0 | 1 | 0.043 | PASS |

### Convergence Signal Replay

| Signal | Value | Vote |
|--------|-------|------|
| Rolling average (runs 4-5) | 0.102 | Continue (above 0.08 threshold) |
| MAD noise floor | 0.059 | Continue |
| Dimension coverage | 100% (4/4 dims, 2/2 core protocols) | Stop |
| Composite stop score | 0.45 | Below 0.60 threshold |

Stop reason: `maxIterationsReached` (5/5 iterations completed). If convergence-driven, more iterations would have been warranted based on the rolling average signal.

### Dimension Coverage

| Dimension | Iterations | Status |
|-----------|-----------|--------|
| Correctness | 001 | Covered |
| Security | 002 | Covered |
| Traceability | 003 | Covered |
| Maintainability | 004, 005 | Covered |

### File Coverage Matrix

| Surface | Files Reviewed | Key Files |
|---------|---------------|-----------|
| system-spec-kit/mcp-server | 15 | trust-tree.ts, layer-definitions.ts, session-prime.ts, compact-inject.ts, context-server.ts, tool-schemas.ts, hybrid-search.ts |
| system-skill-advisor | 3 | metrics.ts, trust-state.ts, scorer fixtures |
| deep-loop runtime | 5 | executor-config.ts, fable-subagent-guard.mjs, coverage-graph-db.vitest.ts |
| commands/doctor | 3 | _routes.yaml, agent-roster-mirror-check.cjs, parent-skill-check.cjs |
| agent mirrors | 4 | .opencode/agents/orchestrate.md, .claude/agents/orchestrate.md |
| spec docs | 6 | 016-deep-review/spec.md, 015-verification/implementation-summary.md, parent spec.md |

### Verification Summary

- **Decommission completeness**: Internal `system-code-graph` subsystem fully removed. `code_graph/` directory absent. `speckit-deep-loop.cjs` absent. No stale internal imports in production code.
- **Residual references**: 17 findings documented. 1 P1 (wording), 16 P2 (advisory). All references to code-graph tools found are to the external standalone `system_code_graph` MCP server, not the decommissioned internal subsystem.
- **Closeout honesty**: No fabrication detected. 015 closeout openly states 3 accounted-for failures. Packet status fields are accurate.
- **Cross-lane**: The grok lane completed its review independently with its own review-report.md, confirming the two-lane fan-out mechanism.
