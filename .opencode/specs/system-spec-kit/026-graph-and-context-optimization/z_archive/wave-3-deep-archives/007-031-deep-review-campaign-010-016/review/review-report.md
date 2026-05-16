# Deep Review Report — Campaign 010-016

**Session:** rvw-2026-05-14T18-33-47Z  
**Topic:** MCP rename (system_code_graph → mk-code-index), documentation alignment, verification  
**Scope:** 7 packets (010-016) under 013-system-code-graph-extraction  
**Iterations:** 10  
**Verdict:** **CONDITIONAL** — 0 P0, 1 P1, 19 P2

---

## 1. EXECUTIVE SUMMARY

The 7-packet code-graph remediation campaign successfully renamed the MCP server from `system_code_graph` to `mk-code-index`, aligned skill documentation, created a new architecture.md, updated READMEs, and established a manual testing playbook. The rename is **complete and correct** in all production code paths.

One P1 finding remains: the SKILL.md `name` field (`system-code-graph`) differs from the MCP server namespace (`mk-code-index`), which could confuse consumers. This is an intentional design decision (skill slug = directory name, MCP server = technical namespace) but merits a clarifying note.

19 P2 findings are documentation clarity and discoverability gaps — none affect runtime correctness or security.

**Recommendation:** Ship as-is. Address P1 and batch-resolve P2s in a follow-up documentation packet.

---

## 2. FINDINGS SUMMARY

| Severity | Count | Description |
|----------|-------|-------------|
| P0 (Critical) | 0 | — |
| P1 (Major) | 1 | SKILL.md name vs MCP namespace confusion |
| P2 (Minor) | 19 | Documentation clarity and discoverability gaps |

### P1 Findings (1)

| ID | Title | File:Line | Dimension |
|----|-------|-----------|-----------|
| F002 | SKILL.md `name: system-code-graph` vs MCP namespace `mk-code-index` confuses consumers | `.opencode/skills/system-code-graph/SKILL.md:2` | Correctness |

### P2 Findings (19)

| ID | Title | File:Line | Dimension |
|----|-------|-----------|-----------|
| F001 | Old state file cleanup verified complete (downgraded from P1) | `.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json:1` | Correctness |
| F003 | Residual system-code-graph directory references in SKILL.md | `.opencode/skills/system-code-graph/SKILL.md:116` | Correctness |
| F004 | system-spec-kit README.md references system-code-graph without MCP namespace clarification | `.opencode/skills/system-spec-kit/README.md:111` | Correctness |
| F005 | system-spec-kit SKILL.md references system-code-graph without namespace note | `.opencode/skills/system-spec-kit/SKILL.md:375` | Correctness |
| F006 | architecture.md §9 stale open question claims 12 tools | `.opencode/skills/system-code-graph/architecture.md:288` | Correctness |
| F007 | Launcher error message says 'system-code-graph not found' | `.opencode/bin/mk-code-index-launcher.cjs:162` | Correctness |
| F008 | TOOL_DEFINITIONS alias undocumented in skill docs | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:233` | Maintainability |
| F009 | Launcher loadEnvFile has no env value format validation | `.opencode/bin/mk-code-index-launcher.cjs:13` | Security |
| F010 | MCP config key underscore vs server hyphen convention undocumented | `.claude/mcp.json:38` | Security |
| F011 | architecture.md §9 stale open question (duplicate of F006) | `.opencode/skills/system-code-graph/architecture.md:288` | Traceability |
| F012 | Launcher buildIfNeeded fallback uses old package structure name | `.opencode/bin/mk-code-index-launcher.cjs:171` | Traceability |
| F013 | Feature catalog 17 features vs 10 MCP tools not reconciled | `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:33` | Traceability |
| F014 | Deep-loop tools in feature catalog not in mk-code-index surface | `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:89` | Traceability |
| F015 | Playbook scenario 011 lacks schema cross-reference | `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:134` | Traceability |
| F016 | SPECKIT_CODE_GRAPH_DB_DIR not in README config table | `.claude/mcp.json:45` | Traceability |
| F017 | Dist source maps reference system-code-graph paths (expected) | `.opencode/skills/system-code-graph/mcp_server/tools/index.js.map:1` | Maintainability |
| F018 | Missing test scenarios for some tool parameter combos | `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:1` | Maintainability |
| F019 | Bootstrap lock lacks staleness detection for SIGKILL | `.opencode/bin/mk-code-index-launcher.cjs:183` | Security |
| F020 | SPECKIT_CODE_GRAPH_DB_DIR override not documented (security) | `.claude/mcp.json:45` | Security |

Note: F011 duplicates F006 (same stale open question). Both are listed for complete traceability but reference the same underlying issue.

---

## 3. DIMENSION VERDICTS

| Dimension | Verdict | Key Findings |
|------------|---------|--------------|
| D1 Correctness | **PASS (advisory)** | MCP rename is complete. P1: SKILL.md name confusion. P2s: stale arch question, error message naming, compat alias, directory references. |
| D2 Security | **PASS** | No P0/P1 findings. P2s: env validation gap, key convention undocumented, lock staleness, DB override not documented. |
| D3 Traceability | **PASS (advisory)** | P2s: stale open questions, legacy build paths, feature/tool count gap, deep-loop boundary, playbook cross-ref, config discoverability. |
| D4 Maintainability | **PASS** | P2s: build artifact source maps, test scenario coverage gaps. No regressions found. |

---

## 4. CONVERGENCE ANALYSIS

| Iteration | New Findings | P0 | P1 | P2 | Ratio | Cumulative |
|-----------|-------------|----|----|----|-------|------------|
| 1 | 5 | 0 | 1→0 | 3→4 | 0.71 | 5 |
| 2 | 3 | 0 | 0 | 3 | 0.50 | 8 |
| 3 | 2 | 0 | 0 | 2 | 0.50 | 10 |
| 4 | 2 | 0 | 0 | 2 | 0.40 | 12 |
| 5 | 2 | 0 | 0 | 2 | 0.50 | 14 |
| 6 | 2 | 0 | 0 | 2 | 0.67 | 16 |
| 7 | 2 | 0 | 0 | 2 | 0.50 | 18 |
| 8 | 1 | 0 | 0 | 1 | 0.50 | 19 |
| 9 | 2 | 0 | 0 | 2 | 0.67 | 20 |
| 10 | 0 | 0 | 0 | 0 | **0.00** | 20 |

Convergence achieved at iteration 10: zero new findings, all dimensions covered.

---

## 5. CLAIM ADJUDICATION

### F002 Claim Adjudication Packet
```json
{
  "findingId": "F002",
  "claim": "SKILL.md name field 'system-code-graph' conflicts with MCP namespace 'mk-code-index', creating consumer confusion risk",
  "evidenceRefs": [".opencode/skills/system-code-graph/SKILL.md:2", ".opencode/skills/system-code-graph/mcp_server/index.ts:9", ".claude/mcp.json:38"],
  "counterevidenceSought": "Checked SKILL.md §4 Rules and §7 Integration Points — both clarify the dual naming convention",
  "alternativeExplanation": "The dual naming is intentional: skill slug = directory name, MCP server = technical namespace. Both are correct in their respective scopes.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If a naming convention doc explicitly documents this dual-naming pattern, downgrade to P2 advisory.",
  "transitions": [{"iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

---

## 6. RISK ASSESSMENT

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Consumer confusion about skill name vs MCP namespace | Medium | Low | Add a naming convention note to SKILL.md §4 or architecture.md |
| Operator unable to discover SPECKIT_CODE_GRAPH_DB_DIR override | Low | Low | Add to README.md §5 config table |
| Stale lockdir blocks MCP startup for 120s after SIGKILL | Low | Low | Add lock staleness detection to launcher |
| architecture.md open questions become stale documentation | High | Low | Resolve open questions in follow-up packet |

---

## 7. RECOMMENDATIONS

1. **P1 (F002):** Add a clarifying note in SKILL.md §4 Rules: "The skill directory name and `name` field use `system-code-graph` (the filesystem slug). The MCP server name and client namespace use `mk-code-index` (the runtime identity)."
2. **P2 batch (F006/F011, F007, F010, F016/F020):** Resolve in a follow-up documentation packet covering: stale architecture open questions, launcher error message naming convention, MCP key convention documentation, and config table updates.
3. **P2 (F019):** Consider adding lock staleness detection (`mtime` check) to the launcher's `acquireBootstrapLock` function.
4. **P2 (F013/F014):** Add a reconciliation note in the feature catalog explaining feature-to-tool granularity.
5. **All other P2s:** Document or accept as-is in follow-up docs packets.

---

## 8. RESOURCE MAP

- **Iteration files:** `review/iterations/iteration-001.md` through `iteration-010.md`
- **Findings registry:** `review/deep-review-findings-registry.json`
- **Strategy:** `review/deep-review-strategy.md`
- **State log:** `review/deep-review-state.jsonl`
- **Primary targets reviewed:** 6 production files, 7 documentation files
- **Total files inspected:** 13+

---

## 9. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | PASS | MCP server name matches mcp.json; tool names match schema/dispatch |
| `checklist_evidence` | core | N/A | No checklist.md for this review scope |
| `feature_catalog_code` | overlay | PARTIAL | 17 features vs 10 tools gap documented (F013/F014) |
| `playbook_capability` | overlay | PARTIAL | Scenario 011 missing schema cross-ref (F015) |

---

## 10. CONCLUSION

The MCP rename from `system_code_graph` to `mk-code-index` is **complete and correct** across all production code paths. The 1 P1 finding is a documentation clarity issue about dual naming (skill directory vs MCP server), not a functional defect. All 19 P2 findings are documentation discoverability or clarity gaps that can be batch-resolved in a follow-up packet. The review converges at iteration 10 with zero new findings.

**Verdict: CONDITIONAL** — Ship with P1 advisory, batch-resolve P2s in follow-up.