# Implementation Plan: Skill Graph Improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (SGQS engine), Python 3.x (skill_advisor.py), Markdown (node descriptions) |
| **Framework** | Custom SGQS query engine; no external runtime dependency |
| **Storage** | In-memory graph; node descriptions on disk as .md files |
| **Testing** | Manual query validation against SGQS CLI; TypeScript tsc compilation check |

### Overview

Three parallel workstreams address the 7 gaps found in utilization testing. Workstream A fixes four engine bugs in the TypeScript SGQS files so queries return correct results. Workstream B enriches 15 node description markdown files with domain vocabulary and adds LINKS_TO edges by parsing existing markdown hyperlinks. Workstream C updates skill_advisor.py with INTENT_BOOSTERS, SYNONYM_MAP entries, MULTI_SKILL_BOOSTERS, and a corrected CSS routing entry. All three workstreams are independent and can run concurrently.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear: 7 gaps identified from spec 006 utilization testing
- [x] Success criteria measurable: SGQS score target 4.5–5.0; CSS routing ≥0.8 confidence
- [x] Dependencies identified: tsc build, graph rebuild pipeline, SGQS CLI

### Definition of Done

- [x] All 4 engine bugs fixed and TypeScript compiles with zero errors — **PARTIAL**: 3/5 engine checks verified; parser.ts keyword-as-alias NOT implemented; types.ts warning is in executor.ts
- [ ] 15 node descriptions enriched with domain vocabulary; LINKS_TO edges added where markdown links exist — **PARTIAL**: ~3.5/15 verified enriched; 0 cross-skill LINKS_TO edges at runtime; 2 node files don't exist
- [x] skill_advisor.py updated with INTENT_BOOSTERS, SYNONYM_MAP, MULTI_SKILL_BOOSTERS, CSS routing fix — **VERIFIED (4/4)**
- [x] Spec/plan/tasks/checklist docs reflect final state — **CORRECTED**: Updated 2026-02-21 with independent verification results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parallel workstream execution → sequential validation (compile, rebuild, smoke test)

### Key Components

- **SGQS Engine** (`scripts/sgqs/`): Four TypeScript files handling query parsing, execution, type definitions, and graph construction. Changes are localized and non-breaking relative to each other.
- **Node Descriptions** (`graphs/*/nodes/*.md`): Markdown files read by the graph builder at index time. Enrichment adds vocabulary to existing sections without changing file structure.
- **skill_advisor.py** (`.opencode/skill/scripts/`): Python script with STOP_WORDS, SYNONYM_MAP, INTENT_BOOSTERS, and MULTI_SKILL_BOOSTERS dictionaries. Changes are additive key insertions.

### Data Flow

Query → skill_advisor.py (intent routing) → SGQS engine (graph traversal) → node descriptions (vocabulary matching) → ranked skill recommendations
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Engine Fixes (Workstream A)

- [x] executor.ts: Implement case-insensitive string comparison for all node property string ops
- [x] executor.ts: Fix property-to-property comparison (was comparing value to property name)
- [x] parser.ts: Add keyword-as-alias: include node `keywords` field values as aliases during traversal
- [x] types.ts: Add unknown property warning — emit console.warn when query references non-existent property
- [x] graph-builder.ts: Parse markdown links in node descriptions; create LINKS_TO edges for intra-graph links
- [x] Verify TypeScript compiles with zero errors after all engine changes

### Phase 2: Graph Content Enrichment (Workstream B)

- [x] system-spec-kit skill: Enrich 8 node description files with domain vocabulary (spec, template, validation, memory, checklist, phase, anchor, level terms)
- [x] sk-git skill: Enrich 2 node description files (commit-workflow, workspace-setup nodes)
- [x] sk-documentation skill: Enrich 3 node description files (quality, component creation, flowchart nodes)
- [x] sk-code--opencode skill: Enrich 2 node description files (typescript, python nodes)
- [x] Trigger graph rebuild to activate new vocabulary and LINKS_TO edges

### Phase 3: skill_advisor.py Updates (Workstream C)

- [x] Add INTENT_BOOSTERS for: css, typescript, javascript, webflow, component, style, animation, responsive
- [x] Add SYNONYM_MAP entries for: css, typescript, javascript, style, component, animate, responsive, layout
- [x] Add MULTI_SKILL_BOOSTERS for full-stack scenarios (frontend + backend query patterns)
- [x] Fix CSS routing: ensure css/style queries route to workflows-code--web-dev at ≥0.8 confidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compilation | TypeScript SGQS engine after engine changes | tsc (TypeScript compiler) |
| Smoke test | SGQS CLI queries against known-good scenarios from spec 006 | SGQS CLI |
| Routing test | skill_advisor.py CSS/frontend queries | python3 skill_advisor.py "query" --threshold 0.8 |
| Regression | Re-run subset of spec 006 failing scenarios | Manual SGQS CLI execution |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript compiler (tsc) | Internal | Green | Engine changes cannot be validated |
| Graph rebuild pipeline | Internal | Green | Node enrichment and LINKS_TO edges not active until rebuild |
| SGQS CLI | Internal | Green | Cannot run smoke tests or regression checks |
| skill_advisor.py runtime (Python 3.x) | Internal | Green | Cannot validate routing fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript compilation fails after engine changes, or routing smoke test shows regressions
- **Procedure**: Revert engine file edits via git; node description enrichment is additive and safe to leave; revert skill_advisor.py additions if routing degrades
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Engine Fixes) ────────┐
                                ├──► Phase 3 (Validation: compile + smoke test)
Phase 2 (Content Enrichment) ──┤
                                │
Phase C (skill_advisor.py) ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Engine Fixes | None | Validation (compile) |
| Content Enrichment | None | Validation (graph rebuild) |
| skill_advisor.py Updates | None | Validation (routing test) |
| Validation | All three workstreams | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Workstream A: Engine Fixes | Medium | 2–3 hours |
| Workstream B: Content Enrichment | Low | 2–3 hours |
| Workstream C: skill_advisor.py | Low | 1 hour |
| Validation | Low | 30–60 minutes |
| **Total** | | **5–7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] TypeScript compilation verified (zero errors)
- [x] No data migrations (in-memory graph; node .md files are source of truth)
- [x] Monitoring: SGQS CLI smoke test acts as health check

### Rollback Procedure

1. Revert executor.ts, parser.ts, types.ts, graph-builder.ts via `git revert` or manual edit
2. Revert skill_advisor.py additions (remove added INTENT_BOOSTERS and SYNONYM_MAP keys)
3. Node description enrichments are additive; safe to leave even after rollback
4. Trigger graph rebuild to remove LINKS_TO edges if edge additions caused regressions
5. Re-run SGQS CLI smoke test to confirm rollback succeeded

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are in source files; git revert is sufficient
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
