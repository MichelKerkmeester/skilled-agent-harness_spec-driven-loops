# Iteration 3: D3 Traceability — spec_code, checklist_evidence, and overlays

## Focus
Dimension: traceability. Core protocols `spec_code` and `checklist_evidence`. Overlay `feature_catalog_code` and `playbook_capability`. Re-check REQ-001..006 against shipped code and packet completion ledgers.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.27

## Findings

### P0, Blocker
- None.

### P1, Required
- **F009**: REQ-006 still requires the shared `enforceTokenBudget` helper after ADR-005 rejected sharing it, `specs/system-speckit/034-spec-template-context-optimizations/spec.md:113`, [Evidence: acceptance says "`handleMemorySearch` applies the shared `enforceTokenBudget` / `getTokenBudget('memory_search')`". Code calls local `enforceSearchTokenBudget` then `getTokenBudget('memory_search')` (`memory-search.ts:2384`). ADR-005 (`decision-record.md:86`) explicitly keeps the two enforcers separate. Spec was not amended, so spec_code is fail for the shared-helper clause.]
- **F001** (refined): `tasks.md:65` T030 still says "Promote AC_COVERAGE to default-on (warn)" while `spec.md:112` and `validation-rules.md:76` say INFO/advisory. Additional evidence that the task list is not the completion ledger.

### P2, Suggestion
- **F010**: This Complete packet has 0/8 AC_COVERAGE evidence, `specs/system-speckit/034-spec-template-context-optimizations/checklist.md:29`, [Evidence: `validate.sh --strict` printed `AC_COVERAGE WARNING: 0/8 ACs have evidence; floor 8/8`. Checklist has CHK-* rows, not AC-id traceability rows the rule counts. RULE_STATUS stayed pass (REQ-004 behavior holds); the shortfall is still a traceability gap on a Complete packet.]
- **F011**: Under-coverage message says WARNING, not INFO, `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:223`, [Evidence: REQ-004 requires "an INFO-level message"; the emitted string is `AC_COVERAGE WARNING: ...`. Registry severity is `info`.]
- **F012**: implementation-summary still lists the REQ-005 contract as an open question after CHK-002 closed it, `specs/system-speckit/034-spec-template-context-optimizations/implementation-summary.md:24`, [Evidence: `_memory.continuity.open_questions` includes "REQ-005 scope-rule changed-files contract (MK_SCOPE_BASE) not yet formally defined"; `checklist.md:42` CHK-002 is [x] resolved; `check-scope-adherence.sh:8-14` documents the contract.]

## Claim adjudication

```json
{
  "findingId": "F009",
  "claim": "REQ-006's acceptance still requires applying the shared enforceTokenBudget helper, but shipped code plus ADR-005 use a separate search enforcer.",
  "evidenceRefs": [
    "specs/system-speckit/034-spec-template-context-optimizations/spec.md:113",
    "specs/system-speckit/034-spec-template-context-optimizations/decision-record.md:86",
    ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:2384"
  ],
  "counterevidenceSought": "Checked whether spec.md was amended after ADR-005. The shared-helper clause is still in the P0 table. getTokenBudget('memory_search') is used, so the budget-source half of the AC is met.",
  "alternativeExplanation": "ADR-005 could be read as an approved AC amendment. Rejected until spec.md itself is updated; ADRs do not silently rewrite P0 acceptance text.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If spec.md REQ-006 is rewritten to allow a search-specific enforcer plus getTokenBudget, downgrade to P2 or resolve.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:113, memory-search.ts:2384, research.md.tmpl L1=175 | REQ-001/002/003/004/005 largely met; REQ-006 shared-helper clause fails |
| checklist_evidence | partial | hard | checklist.md vs tasks.md; AC_COVERAGE 0/8 | [x] CHK rows have evidence text; tasks remain open; no AC-id rows |
| skill_agent | notApplicable | advisory | | spec-folder target |
| agent_cross_runtime | notApplicable | advisory | | spec-folder target |
| feature_catalog_code | partial | advisory | feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:64 | New rules mentioned; memory_search handler budget not catalogued as its own feature |
| playbook_capability | partial | advisory | manual-testing-playbook | No scenario for SCOPE_ADHERENCE change-set or memory_search budget truncation |

## Assessment
- New findings ratio: 0.27
- Dimensions addressed: traceability
- Novelty justification: F009 is a new spec_code contradiction (REQ-006 vs ADR-005). F010–F012 are new traceability gaps. F001 refined with T030 wording.

## Ruled Out
- REQ-001 L1 collapse: [175-line L1 render], [inline-gate-renderer.sh --level 1]
- REQ-003 missing read path: [template-guide.md:82 omits --out-dir to print STDOUT; equivalent to --stdout], [template-guide.md:77-85]
- REQ-004 hard-failing --strict: [validate.sh --strict exit 0 with AC_COVERAGE still RULE_STATUS=pass], [validate output]

## Dead Ends
- Expecting feature_catalog to list every new helper: catalog already points at validator-registry for the new rules.

## Recommended Next Focus
D4 Maintainability — template consolidation architecture vs "shared core" claim, plan.md vs tasks.md phase numbering, stale continuity frontmatter, documentation quality.

Review verdict: CONDITIONAL
