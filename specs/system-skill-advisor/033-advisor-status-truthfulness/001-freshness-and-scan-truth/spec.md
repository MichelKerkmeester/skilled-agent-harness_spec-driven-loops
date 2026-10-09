---
title: "Feature Specification: Phase 1: freshness-and-scan-truth"
description: "advisor_status answers freshness live while the skill graph reports all 14 tracked sources changed, counts 20 metadata files for 14 skills, and the doctor freshness panel cannot see a compiled graph older than its sources or a missing SQLite artifact."
trigger_phrases:
  - "advisor status freshness"
  - "skill count scan truth"
  - "skill graph freshness panel"
  - "degraded sqlite artifact"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: freshness-and-scan-truth

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The advisor answers three different questions with one word. `advisor_status` calls the data live because the generation signature still matches the sources, `skill_graph_status` calls every tracked source changed because the SQLite rows' stored content hashes do, and the doctor freshness panel reports neither plus cannot see a compiled graph older than the newest source stamp. At planning time the disagreement was reproduced live: `freshness: live` and `skillCount: 20` beside `changedSourceFiles: 14` and `totalSkills: 14`.

**Key Decisions**: Adopt the content-hash comparison as the truth signal for index staleness and surface it through `advisor_status`; count skill roots rather than recursively found metadata files; make the panel report what it cannot see instead of silently narrowing its own diff.

**Critical Dependencies**: The advisor runtime build (`npm run build` in the runtime package) must run for handler and schema changes to reach the CLI; the doctor panel is plain CommonJS with no build step; a live worktree is needed to observe the disagreement.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/001-freshness-and-scan-truth` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-router-reach-misroutes |
| **Handoff Criteria** | Freshness and staleness agree on the same content evidence; `skillCount` equals the skill-root inventory; the panel names compiled staleness and degraded artifact state; strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Make the advisor's freshness, scan and routing reports match what is on disk specification.

**Scope Boundary**: The advisor status surfaces and the doctor freshness panel. Phase 1 changes what these surfaces report and how they compute it; it does not change routing vocabulary (Phase 2) or the operator-facing contracts and embeddings surface (Phase 3).

**Dependencies**:
- The advisor runtime build: `npm run build` in `.skilled/skills/system-skill-advisor/runtime/` must run before CLI verification, because the shim refuses a stale dist.
- The doctor freshness panel at `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` and its route contract in `specs/system-speckit/048-doctor-command-audit/012-skill-graph-freshness`.
- A runtime SQLite artifact and its `skill_nodes` rows, which carry the stored content hashes the comparison needs.

**Deliverables**:
- An `advisor_status` that surfaces index-level staleness from stored content hashes and can no longer answer `live` while the index disagrees with disk.
- A `skillCount` that counts skill roots and matches `skill_graph_status.totalSkills`.
- A freshness panel that marks a compiled `skill-graph.json` older than its newest source, marks the degraded two-way diff when SQLite is absent, states its depth-1 scan rule truthfully, and disambiguates family names from skill ids.
- Tests that pin each new semantic.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four reporting defects were recorded by the doctor command audit and re-verified live while planning this phase. First, `advisor_status` and `skill_graph_status` disagree about the same data: a live `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only` answered `freshness: live`, `generation: 7`, `skillCount: 20`, while `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only` answered `trackedSkills: 14`, `freshSourceFiles: 0`, `changedSourceFiles: 14`. Freshness reads the generation metadata (`runtime/handlers/advisor-status.ts:268-318`) and compares a recomputed source signature against the stored one (`runtime/lib/freshness.ts:205-207`); staleness compares each node's stored content hash against the file on disk (`runtime/handlers/skill-graph/status.ts:155-199`). The two signatures matched at planning time even though all 14 stored hashes differed, so index-level drift is invisible on the status surface. Second, `skillCount` is 20 for 14 skills because `scanSkillMetadataFiles` walks the whole `.skilled/skills` tree counting every `graph-metadata.json` it finds (`runtime/handlers/advisor-status.ts:208-232`), which includes six fixtures under `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/` and `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/phase-validation/valid-phase/`. Third, the compiled `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` carries `generated_at: 2026-09-29T07:49:34.068437+00:00` while `.skilled/skills/cli-classifier/graph-metadata.json` carries `derived.last_updated_at: 2026-09-29T09:00:00Z`, and `fromCompiledJson` in `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:31-42` only reports ghost nodes and family mismatches, so the panel reports nothing about a compiled graph that is older than its newest source. Fourth, `*.sqlite` is gitignored (`.skilled/skills/system-skill-advisor/runtime/database/.gitignore:2`), so a fresh checkout has no database; `fromSqlite` returns `absent` (`skill-graph-freshness.cjs:44-60`), the SQLite-derived sets are skipped entirely (`:85-93`), and the panel still exits 0 with no degraded marker — verified with `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at an empty directory. Two low-severity findings also hold: the `z_archive` exclusion is inert because no such directory exists and the depth-1 scan is what actually excludes nested tiers (`:62-81`), and family names share a namespace with skill ids, as in the compiled `"sk-code": ["sk-code"]` entry.

### Purpose
Make the recorded truth visible: `advisor_status` reports index staleness from the same content-hash evidence the graph status uses, `skillCount` means skills, and the doctor panel names compiled staleness, an absent SQLite artifact and its own scan rule instead of reporting a narrower diff as if it were complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Index-level staleness on the advisor status surface, computed from the SQLite `skill_nodes` stored content hashes and reflected in `freshness` or an explicit staleness field.
- Skill-root counting in the advisor status scan, with the recursion bounded to the fixture-free skill inventory.
- Compiled-graph staleness detection in the doctor freshness panel, comparing `generated_at` against the newest on-disk source stamp.
- A degraded marker for the absent-SQLite two-way diff while the panel keeps its always-exit-0 report-only contract.
- Truthful wording for the depth-1 scan rule and disambiguated family/id output.
- Tests and documentation for the changed surfaces.

### Out of Scope
- Routing vocabulary and misroute fixes - those are Phase 2 findings in a different subsystem surface.
- Scoring lane behavior, phrase bounds and embeddings health - those are Phase 3 contracts.
- Building, repairing or reindexing the SQLite database; the panel and status surfaces stay read-only and report the repair action instead.
- Changing the meaning of `skill_graph_status` staleness itself; the phase aligns status with it rather than redefining it.
- The doctor command layer's routes and workflows, which the source audit already fixed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modify | Add index-level staleness evidence and switch `skillCount` to the skill-root inventory |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | Add the optional status fields the handler now reports |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modify | Pin stale-index downgrade, root-only counting and the absent-artifact path |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | Compiled `generated_at` staleness, degraded marker, scan-rule wording, family/id clarity |
| `.skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs` | Create | Pin the panel's normal, stale-compiled, absent-database and no-audit states |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | Modify | Document the staleness and count semantics the status now reports |
| `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/rebuild-from-source.md` | Modify | Keep the freshness narrative aligned with the content-hash truth signal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `advisor_status` must not report `freshness: live` while the artifact's stored `skill_nodes` content hashes disagree with the files on disk. It either downgrades `freshness` to `stale` or reports the index disagreement in an explicit field that consumers can read, and the behavior is pinned by a test. |
| REQ-002 | `advisor_status.skillCount` must count skill roots (depth-1 directories carrying the skill's metadata), not every `graph-metadata.json` found recursively. The value equals `skill_graph_status.totalSkills` on a clean checkout. |
| REQ-003 | The doctor freshness panel must report when the compiled `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` is older than the newest `derived` source stamp on disk, naming both timestamps. |
| REQ-004 | With no SQLite artifact, the panel must print a degraded marker naming the absent artifact and the reduced comparison, while preserving its documented always-exit-0 report-only behavior. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The panel's `z_archive` claim must match what the code does (depth-1 scan), and family comparisons must not read ambiguously against skill ids that share a family's name. |
| REQ-006 | The handler's scan cap (`maxMetadataFiles`) must still bound the walk and report truncation, and the edited feature-catalog and freshness docs must describe the semantics the code now implements. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a checkout whose index hashes differ from disk, `advisor_status` and `skill_graph_status` agree about the staleness; neither surface can answer `live` while the other reports changed sources.
- **SC-002**: `advisor_status.skillCount` equals the skill-root count (14 on the audit checkout) and the fixture paths no longer contribute to it.
- **SC-003**: The freshness panel's normal run names a compiled graph older than its newest source, and its absent-database run prints a degraded marker instead of a silently narrowed diff.
- **SC-004**: `npm test` in the advisor runtime including the advisor-status suite passes, the new panel test passes, and the phase validates strict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor runtime build pipeline (`npm run build` in the runtime package) | Handler and schema changes do not reach the CLI shim, so live verification reports old behavior | Run the build before any CLI verification and confirm the shim's dist-freshness guard accepts the build |
| Dependency | `better-sqlite3` read-only access to `skill_nodes` | The status path could create, migrate or lock the database as a side effect | Read through the existing read-only accessor guarded by an existence check, as `skill_graph_status` does; never call the initializing accessor |
| Risk | SQLite rows may be absent even when the artifact file exists | A new required field would hard-fail status on partial databases | Treat absent rows as "no index evidence", keep the field optional, and leave freshness at the generation verdict with an explicit reason |
| Risk | The panel's always-exit-0 contract is mistaken for pass/fail signal | A degraded marker could be read as a gate change | Keep the exit code and the report-only footer unchanged; the marker is text, and the test pins both |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The added staleness comparison reuses the per-row hash read the graph status already performs and stays bounded by the 14 tracked nodes; it adds no full-tree walk beyond the existing bounded metadata scan.

### Security
- **NFR-S01**: All new reads are read-only. The status path must not create, migrate, quarantine or write the database, and it must not log file contents or prompt data.

### Reliability
- **NFR-R01**: Absent, unreadable or partially populated artifacts degrade to a reported state, never to an exception; the panel always exits 0 and the status handler keeps returning a schema-valid envelope.

---

## 8. EDGE CASES

### Data Boundaries
- Empty skill root: status reports `skillCount: 0` and a missing-sources state rather than an error.
- Scan cap: a tree larger than `maxMetadataFiles` still returns a truncated marker and the bounded count.
- Database exists but `skill_nodes` is empty: treat as no index evidence rather than staleness.

### Error Scenarios
- Database locked by the daemon: a read failure degrades the staleness field, never the whole status call.
- Corrupt artifact file: the existing integrity path keeps reporting corruption; the new code must not mask it.
- Compiled JSON missing or unparseable: the panel reports `absent` or `unreadable` for that source and keeps the rest of the diff.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 7, LOC: ~250, Systems: advisor runtime, doctor panel |
| Risk | 10/25 | Auth: N, API: N, Breaking: N; schema-additive status fields and a read-only database access path |
| Research | 8/20 | Two freshness models must be reconciled against live behavior before choosing the surface |
| Multi-Agent | 3/15 | Workstreams: 1; single executor across handler, panel and tests |
| Coordination | 5/15 | Dependencies: 2 (runtime build, doctor panel contract) |
| **Total** | **38/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The new staleness field duplicates or contradicts `skill_graph_status` wording | M | M | Name the field for what it measures, cite the same comparison, and pin the pair in a live verification step |
| R-002 | Skill-root counting drops a legitimate nested skill | M | L | Count the same depth-1 rule the freshness signature and `listSkillSlugs` already use, and assert against the 14-root checkout |
| R-003 | The panel's new lines break a consumer that parses its output | L | L | Keep existing line order and wording, append new lines, and pin the full output in the new test |

---

## 11. USER STORIES

### US-001: Trust the advisor's live verdict (Priority: P0)

**As an** operator reading `advisor_status` before running the advisor, **I want** a `live` verdict to mean the index matches the files on disk, **so that** I do not act on stale routing data.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: See the panel's blind spots (Priority: P1)

**As a** maintainer running the doctor freshness panel, **I want** it to name a compiled graph older than its sources and to say when a missing database narrowed the diff, **so that** a clean report means the check ran whole.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does the staleness signal belong in `freshness` itself or in a sibling field such as `indexStaleness` with counts? The plan records the recommended shape and the tests pin it.
- Should the panel's compiled-staleness line also gate any doctor route, or stay informational like the rest of the panel?
- Which timestamp is authoritative for the compiled comparison when a source carries both `derived.generated_at` and `derived.last_updated_at`? The plan picks the newest of the two per the existing disk parser.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
