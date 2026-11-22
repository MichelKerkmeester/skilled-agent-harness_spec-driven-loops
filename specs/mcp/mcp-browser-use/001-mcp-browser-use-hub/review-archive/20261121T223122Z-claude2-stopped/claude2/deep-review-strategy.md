---
title: Deep Review Strategy - mcp-browser-use hub (lineage claude2)
description: Session tracking for the claude2 fan-out lineage reviewing the browser-use parent hub packet and its edited files.
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder). Operator focus: the 8 commits main..HEAD that build the browser-use parent hub (hub scaffold, move of Chrome DevTools and Aside modes, Bladebro mode, advisor routing at both stages, nested sub-track support in system-spec-kit, end-to-end verification). Pure renames are out of scope; edited and added files are in scope. Scope list: `review-scope-files.txt` (277 paths).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Pure renames of moved spec packets and moved mode files with no content edits.
- Fixing anything: this lineage reports findings only.
- Live browser execution (no browser tools in this lineage).

---

## 5. STOP CONDITIONS
- stopPolicy=max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- (none yet)

---

## 9. WHAT FAILED
- (none yet)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A stale browser mode left in `mcp-tooling` routing: ruled out by its registry's mode list. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A stale browser mode left in `mcp-tooling` routing: ruled out by its registry's mode list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale browser mode left in `mcp-tooling` routing: ruled out by its registry's mode list.

### Discovery-only classes leaking into mode scores: ruled out. `modeVocabulary` only walks `routerSignals[mode].classes`, and the discovery classes are not referenced. `'take screenshot of the page'` deferred as designed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Discovery-only classes leaking into mode scores: ruled out. `modeVocabulary` only walks `routerSignals[mode].classes`, and the discovery classes are not referenced. `'take screenshot of the page'` deferred as designed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Discovery-only classes leaking into mode scores: ruled out. `modeVocabulary` only walks `routerSignals[mode].classes`, and the discovery classes are not referenced. `'take screenshot of the page'` deferred as designed.

### Duplicated keyword lists drifting between hub-router.json and graph-metadata.json: ruled out by the passing drift check. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Duplicated keyword lists drifting between hub-router.json and graph-metadata.json: ruled out by the passing drift check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicated keyword lists drifting between hub-router.json and graph-metadata.json: ruled out by the passing drift check.

### Mutation-class guard blind spot for the moved modes: ruled out by the matching regex and globs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Mutation-class guard blind spot for the moved modes: ruled out by the matching regex and globs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mutation-class guard blind spot for the moved modes: ruled out by the matching regex and globs.

### Secret exposure in `.utcp_config.json`: ruled out. The new manual has `"env": {}`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secret exposure in `.utcp_config.json`: ruled out. The new manual has `"env": {}`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret exposure in `.utcp_config.json`: ruled out. The new manual has `"env": {}`.

### Stage-1 mis-routing of named browser tools away from the hub: ruled out by the advisor probes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Stage-1 mis-routing of named browser tools away from the hub: ruled out by the advisor probes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stage-1 mis-routing of named browser tools away from the hub: ruled out by the advisor probes.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- (none yet)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Max iterations reached; synthesis next. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Target pointers: packet root `spec.md`, `decision-record.md`, `goal.md`; children 001-006.
- Behavior claims: hub routes three modes (chrome-devtools, aside, bladebro) via `mode-registry.json`; advisor routes browser prompts to the hub at stage 1 and the hub picks a mode at stage 2.
- Review risks: very wide scope (277 files) with many generated fixtures; this lineage samples by risk.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
See `review-scope-files.txt`.
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Session lineage: sessionId=fanout-claude2-1795299580084-7g6zan, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-21T22:20:39Z
<!-- MACHINE-OWNED: END -->
