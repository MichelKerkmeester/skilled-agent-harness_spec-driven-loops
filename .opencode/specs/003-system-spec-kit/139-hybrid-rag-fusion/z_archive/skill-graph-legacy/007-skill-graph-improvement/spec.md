# Feature Specification: Skill Graph Improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `006-skill-graph-utilization` |
| **Successor** | `008-codex-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Utilization testing of the Skill Graph (spec 006) revealed a Skill Graph Quality Score (SGQS) of 2.50 across 5 developer personas and 20 scenarios — well below the Adequate tier threshold of 3.0. Seven distinct gaps were identified across three categories: SGQS engine defects causing wrong-skill routing, node descriptions lacking domain vocabulary that search queries rely on, and skill_advisor.py missing intent boosters and synonym mappings for key developer workflows.

### Purpose

Raise the SGQS from 2.50 to an estimated 4.5–5.0 (Good to Excellent tier) by closing all 7 identified gaps across 3 parallel workstreams: engine bug fixes, graph content enrichment, and Python advisor improvements.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- SGQS engine fixes in 4 TypeScript files (executor.ts, parser.ts, types.ts, graph-builder.ts)
- Enrichment of 15 node description markdown files with domain vocabulary and LINKS_TO edges
- skill_advisor.py updates: INTENT_BOOSTERS, SYNONYM_MAP, MULTI_SKILL_BOOSTERS, CSS routing fix

### Out of Scope

- Adding new skill nodes beyond the 73 existing nodes — graph topology is not changing
- Changes to the memory MCP server or its handlers
- Modifying the graph index rebuild pipeline

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/sgqs/executor.ts` | Modify | Case-insensitive string ops, property-to-property comparison |
| `.opencode/skill/system-spec-kit/scripts/sgqs/parser.ts` | Modify | Keyword-as-alias support |
| `.opencode/skill/system-spec-kit/scripts/sgqs/types.ts` | Modify | Unknown property warnings |
| `.opencode/skill/system-spec-kit/scripts/sgqs/graph-builder.ts` | Modify | LINKS_TO edge generation from markdown links |
| `.opencode/skill/system-spec-kit/graphs/system-spec-kit/nodes/*.md` (×8) | Modify | Domain vocabulary enrichment |
| `.opencode/skill/sk-git/graphs/sk-git/nodes/*.md` (×2) | Modify | Domain vocabulary enrichment |
| `.opencode/skill/sk-documentation/graphs/sk-documentation/nodes/*.md` (×3) | Modify | Domain vocabulary enrichment |
| `.opencode/skill/sk-code--opencode/graphs/sk-code--opencode/nodes/*.md` (×2) | Modify | Domain vocabulary enrichment |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | INTENT_BOOSTERS, SYNONYM_MAP, MULTI_SKILL_BOOSTERS, CSS routing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix case-sensitive string comparison in SGQS executor | Queries like "CSS" match nodes with "css" in description |
| REQ-002 | Fix property-to-property comparison bug | SGQS queries comparing two node properties return correct results |
| REQ-003 | Add keyword-as-alias support in parser | Node `keywords` field values are treated as aliases during traversal |
| REQ-004 | Add LINKS_TO edges from markdown node links | Graph traversal follows intra-graph markdown hyperlinks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Enrich 15 node descriptions with domain vocabulary | Each node description contains domain-specific terms a developer would use in queries |
| REQ-006 | Add INTENT_BOOSTERS for css, typescript, javascript, webflow | skill_advisor.py routes frontend requests to workflows-code--web-dev at ≥0.8 confidence |
| REQ-007 | Add SYNONYM_MAP entries for css, typescript, frontend patterns | Synonym expansion covers common developer query variations |
| REQ-008 | Add MULTI_SKILL_BOOSTERS for full-stack scenarios | Full-stack queries produce multi-skill recommendations |
| REQ-009 | Add unknown property warnings in SGQS types | Console warns when a query references a non-existent node property |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SGQS score rises from 2.50 to an estimated 4.5–5.0 (Good to Excellent tier) across the 5 developer personas — **ACTUAL: 2.75/5.0 (+0.25), tier unchanged (Insufficient). Target not met.**
- **SC-002**: All 7 identified gaps closed — no gap remains open after implementation — **ACTUAL: 2 Closed, 3 Partial, 1 Open, 1 Deferred. Target not met.**
- **SC-003**: skill_advisor.py routes CSS/frontend queries to workflows-code--web-dev at ≥0.8 confidence — **ACTUAL: "css animation debugging" returns empty array. Target not met.**
- **SC-004**: SGQS engine handles case-insensitive queries without regression on existing passing scenarios — **ACTUAL: Case-insensitive `.toLowerCase()` verified in executor.ts. PASS (no regressions observed).**
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SGQS TypeScript build (tsc) | Engine fixes cannot be validated if compilation fails | Compile after each engine change; fix errors before moving to next file |
| Risk | Node description enrichment degrades unrelated queries | Med — added vocabulary may introduce false positives | Keep additions domain-specific; do not add generic stop words |
| Risk | skill_advisor.py INTENT_BOOSTERS conflict with existing entries | Low — duplicate keys silently override | Audit existing keys before adding; use distinct names |
| Dependency | Graph rebuild pipeline must re-read enriched node .md files | LINKS_TO edges and vocabulary only active after rebuild | Run graph rebuild after all node edits are complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: SGQS query execution time must not increase by more than 10% after engine changes (case-insensitive ops add minimal overhead)
- **NFR-P02**: skill_advisor.py must complete in under 500ms per query (current baseline)

### Security

- **NFR-S01**: No secrets or API tokens introduced in any modified file
- **NFR-S02**: SGQS engine changes must not expose file system paths in query output

### Reliability

- **NFR-R01**: TypeScript compilation must pass with zero errors after all engine changes
- **NFR-R02**: skill_advisor.py must not raise unhandled exceptions for any query input
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty query string to skill_advisor.py: Returns empty recommendations array, no crash
- Node with zero keywords: Keyword-as-alias returns empty alias set (no error)
- Node description containing only stop words after enrichment: SGQS scores it at 0, no false positives

### Error Scenarios

- SGQS query referencing unknown node property: Emits console warning, continues with empty result (REQ-009)
- graph-builder.ts encounters a broken markdown link: Logs warning, skips edge creation, does not abort build
- skill_advisor.py receives multi-word query with all stop words: Returns zero-score results, no crash

### State Transitions

- Partial node enrichment (only some nodes updated): Graph rebuild creates LINKS_TO edges only for updated nodes; existing edges unaffected
- Engine compiled mid-enrichment: Old graph index used until rebuild completes; no state corruption
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 19 files across 3 categories; moderate LOC per file |
| Risk | 12/25 | Engine changes carry regression risk; enrichment is additive only |
| Research | 10/20 | Gaps identified in prior utilization testing (spec 006); low ambiguity |
| **Total** | **36/70** | **Level 2 — verification checklist required** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should LINKS_TO edges be bidirectional or directed? Current implementation is directed (source → target). — **ANSWERED: Directed. However, 0 cross-skill LINKS_TO edges exist in practice despite code being present in graph-builder.ts.**
- Is a formal re-run of the 5-persona test suite required to confirm the 4.5–5.0 score estimate, or is gap-closure evidence sufficient? — **ANSWERED: Re-run completed 2026-02-21. Score is 2.75/5.0, not 4.5–5.0. Gap-closure evidence alone was insufficient — the re-run exposed that many claimed fixes were not reflected in actual test performance.**
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---

## Acceptance Scenarios

1. SGQS keyword alias query path resolves expected nodes.
2. LINKS_TO traversal returns non-zero results after rebuild.
3. Frontend CSS advisor routing passes threshold >=0.8.
4. Previously failing utilization scenarios now score >=3.0.

## Acceptance Scenario Details

- **Given** keyword alias query, **When** parser maps aliases, **Then** target nodes are returned.
- **Given** LINKS_TO traversal query, **When** graph index is rebuilt, **Then** non-zero cross-skill links are returned.
- **Given** frontend advisor prompt, **When** threshold is 0.8, **Then** frontend skill is returned.
- **Given** utilization smoke scenarios, **When** benchmark runs, **Then** scores meet or exceed 3.0.
