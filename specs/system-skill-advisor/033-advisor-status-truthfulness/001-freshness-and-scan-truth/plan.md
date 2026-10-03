---
title: "Implementation Plan: Phase 1: freshness-and-scan-truth"
description: "Make advisor_status surface index-level staleness from stored content hashes, count skill roots instead of recursive metadata fixtures, and teach the doctor freshness panel to report a compiled graph older than its sources and a degraded absent-SQLite diff."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: freshness-and-scan-truth

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ESM in the advisor runtime (Node 20+, `better-sqlite3`, Zod); plain CommonJS in the doctor panel |
| **Framework** | In-repo handler + CLI shim (`skill-advisor.cjs`) over a local daemon; report-only doctor script |
| **Storage** | Read-only SQLite (`skill_nodes.content_hash`) plus on-disk `graph-metadata.json` files |
| **Testing** | Vitest for the runtime handler; plain `node` test scripts for the doctor panel |

### Overview
Align the two freshness models by surfacing the content-hash comparison the graph status already performs, then fix the two counting and visibility defects in the panel. The status handler reads the index read-only and reports the disagreement; the panel compares the compiled graph's `generated_at` against the newest disk source stamp and marks the degraded state when the SQLite source is absent. All three surfaces stay read-only and report the repair action rather than performing it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered handler over read-only evidence, extending the existing advisor runtime rather than introducing a new service.

### Key Components
- **`readAdvisorStatus`** (`runtime/handlers/advisor-status.ts`): computes the status facts and returns the schema-valid envelope.
- **Content-hash staleness** (`runtime/handlers/skill-graph/status.ts`): the reference comparison of stored `content_hash` against the current file hash; it becomes the shared truth signal.
- **`scanSkillMetadataFiles`** (`runtime/handlers/advisor-status.ts`): the bounded walk; its counting rule changes from recursive metadata files to depth-1 skill roots.
- **`AdvisorStatusOutputSchema`** (`runtime/schemas/advisor-tool-schemas.ts`): the strict contract the new optional fields must pass through.
- **`skill-graph-freshness.cjs`** (`doctor/scripts/`): the report-only panel; gains compiled-staleness and degraded-state lines.

### Data Flow
CLI call → daemon/CLI handler → `readAdvisorStatus` reads the generation metadata and (new) the index's `skill_nodes` rows read-only → comparison produces freshness plus the index staleness facts → schema parse → JSON envelope. Independently, the doctor panel reads the compiled JSON, the SQLite file and the disk metadata, then prints a three-way diff with explicit degraded and stale markers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `readAdvisorStatus` (`handlers/advisor-status.ts`) | Produces `freshness` and `skillCount` | update | live CLI pair plus `tests/handlers/advisor-status.vitest.ts` |
| `summarizeSourceStaleness` (`handlers/skill-graph/status.ts`) | Owns the content-hash comparison | unchanged (reference) | `rg -n 'freshSourceFiles|changedSourceFiles'` shows the same semantics reused |
| `AdvisorStatusOutputSchema` (`schemas/advisor-tool-schemas.ts`) | Strict output contract | update (additive optional) | schema parse in the new unit tests |
| `scanSkillMetadataFiles` (`handlers/advisor-status.ts`) | Recursive metadata counter | update to root-only counting | `skillCount` equals `skill_graph_status.totalSkills` |
| `skill-graph-freshness.cjs` `fromCompiledJson`/`fromSqlite`/`fromDisk` | Three-way diff producers | update | new `scripts/tests/skill-graph-freshness.test.cjs` and live runs |
| Doctor route asset `doctor-skill-graph-freshness.yaml` | Displays panel stdout | unchanged | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| Feature-catalog status and freshness docs | Describe the old semantics | update | `rg -n 'skillCount|freshness' .skilled/skills/system-skill-advisor/feature-catalog` |

Required inventories:
- Same-class producers: `rg -n 'scanSkillMetadataFiles|skillCount' .skilled/skills/system-skill-advisor/runtime --glob '!dist'`.
- Consumers of changed symbols: `rg -n 'skillCount|lastScanAt|freshness' .skilled/skills/system-skill-advisor .skilled/commands/doctor --glob '*.ts' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: index state (agree, stale, absent rows, corrupt) × source shape (roots only, roots plus nested fixtures, empty root, truncated scan) × panel state (compiled present/stale/absent, SQLite present/absent/unreadable).
- Algorithm invariant: a status answer of `live` implies every stored source hash equals the file hash on disk at read time; adversarial cases are a missing file, an unreadable file, and a row without a stored hash.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Handler staleness decisions, root-only counting, schema parse, panel line output | `npm test -- tests/handlers/advisor-status.vitest.ts`; `node .skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs` |
| Integration | Live CLI status pair agrees; panel runs against the real artifact and against an empty database directory | `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only`; `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only`; `mkdir -p /tmp/advisor-db-absent-probe && SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/advisor-db-absent-probe node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` |
| Manual | Compare the panel's compiled-staleness line against the newest `derived.last_updated_at` on disk | `node -e` reading `graph-metadata.json` stamps, or the test fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor runtime build (`npm run build`) | Internal | Green | Handler and schema changes stay invisible to the CLI; fall back to fixture-level vitest verification and record the build as a blocker |
| `better-sqlite3` read-only access | Internal | Green | No index evidence available; the new field reports absence and the phase degrades to the generation verdict |
| Doctor panel route and validator | Internal | Green | Panel changes cannot be exercised through the route; run the script directly and note the route check as pending |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The live status pair still disagrees after the change, the panel's new lines break a route consumer, or the new read path mutates or locks the database.
- **Procedure**: Revert the touched handler, schema, panel and test files to `HEAD`; rebuild the runtime; rerun the live status pair and the panel; confirm the pre-change output is restored.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baseline capture) ──► Phase 2 (Implement: status + panel) ──► Phase 3 (Verify: live pair + tests)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implement |
| Implement | Setup | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Implement | Medium | 4-6 hours |
| Verification | Low | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop using the changed status surface; the prior build remains on disk until the runtime is rebuilt.
2. Revert the touched files with `git checkout -- <paths>` and rebuild the runtime.
3. Rerun the live status pair and the panel; confirm the old output and exit codes.
4. Record the rollback and its reason in the phase's implementation summary.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Handler staleness│────►│ Schema + contract │────►│ Tests + docs     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
┌──────────────────┐     ┌──────────────────┐            │
│ Panel pre-compile│────►│ Panel lines      │────────────┘
└──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Handler staleness | Index rows, generation metadata | Truthful freshness facts | Schema, tests |
| Schema | Handler fields | Valid strict output | Tests, docs |
| Panel lines | Compiled JSON, disk stamps | Truthful panel report | Tests, docs |
| Tests + docs | All above | Pinned semantics | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Handler staleness design and implementation** - 3-4 hours - CRITICAL
2. **Panel compiled-staleness and degraded lines** - 2-3 hours - CRITICAL
3. **Live verification pair and tests** - 2-3 hours - CRITICAL

**Total Critical Path**: 7-10 hours

**Parallel Opportunities**:
- Panel changes and handler changes touch disjoint files and can run simultaneously after the baseline capture.
- The panel test can be written against fixtures while the handler unit tests are in progress.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Live status pair and panel output recorded with the disagreement reproduced | Phase 1 |
| M2 | Status surfaces truthful | Handler and panel changes pass their unit tests | Phase 2 |
| M3 | Live verification complete | Live pair agrees, panel names staleness and degraded state, strict validation passes | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Content-hash index staleness is the truth signal the status surface reports

**Status**: Proposed

**Context**: `advisor_status` answers `live` from the generation signature while `skill_graph_status` answers changed hashes for the same files. The generation signature proves the sources have not changed since the last generation publish; it does not prove the index was built from those sources. The operator needs one answer.

**Decision**: Reuse the stored `skill_nodes.content_hash` comparison as the index-staleness evidence on the status surface. Keep `freshness` for the generation verdict and surface the index disagreement either by downgrading `live` to `stale` or by reporting an explicit staleness object; the implementation picks the shape that keeps the strict schema and the existing tests truthful, and pins it.

**Consequences**:
- A `live` answer now implies both a current generation and an index that matches disk.
- Status gains a read-only database access; it must be guarded so the status path never creates or migrates the database.

**Alternatives Rejected**:
- **Compare file mtimes only**: already the fallback today and exactly what failed to see the drift, because the database write was newer than the sources.
- **Recompute and compare the full generation signature only**: it matched while all 14 stored hashes differed, so it cannot express index staleness.

