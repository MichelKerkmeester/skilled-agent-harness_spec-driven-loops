---
title: "Feature Specification: sqlite-to-turso [template:level_1/spec.md]"
description: "Revalidate the SQLite-to-Turso migration research (written against Turso v0.5.0) against the vendored turso-main v0.7.0-pre.6 tree and the current SQLite surfaces of the three daemon skills."
trigger_phrases:
  - "sqlite to turso"
  - "turso migration"
  - "libsql"
  - "turso revalidation"
  - "database migration research"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "z_future/sqlite-to-turso"
    last_updated_at: "2026-06-10T15:48:37Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Both loops complete: context-report.md + research.md synthesized"
    next_safe_action: "Read research/research.md; plan adapter packet when ready"
    blockers: []
    key_files:
      - "research/001 - analysis-sqlite-to-turso-migration.md"
      - "research/002 - recommendations-sqlite-to-turso-migration.md"
      - "research/003 - gaps-and-workarounds-sqlite-to-turso.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/sqlite-to-turso"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "ATTACH semantics under experimental flag (pilot-phase test)"
    answered_questions:
      - "16-gap verdict matrix complete: 2 refuted, 4 changed-better, 1 changed-worse, 9 unchanged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sqlite-to-turso

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three research documents in `research/` (001 analysis, 002 recommendations, 003 gap catalog) were written against Turso Database v0.5.0, but the vendored `external/turso-main` tree is now at v0.7.0-pre.6 and the three SQLite-backed skills (system-spec-kit, system-code-graph, system-skill-advisor) have since changed substantially (packet 027: schema v31–v34, causal tombstones, statediff reconciliation, OpenLTM observability). The migration verdicts, gap severities, and pathway recommendations may be stale on both sides of the comparison.

### Purpose
Produce a current-state context report of all SQLite usage surfaces plus a revalidated, per-item verdict delta for every claim in research docs 001–003 against Turso v0.7.0-pre.6.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deep-context loop (10 iterations, MiMo v2.5 Pro pool) over the SQLite surfaces of the three skills + packet 027 deltas → `context/context-report.md`
- Deep-research loop (17 working iterations, Fable 5 @ xhigh via claude2) re-visiting every item in research docs 001–003 → `research/research.md`
- Loop state artifacts under `context/` and `research/` per the deep-loop contracts

### Out of Scope
- Any migration implementation (driver swaps, adapter layer) — this packet is research-only
- Mutating research docs 001–003 — they remain the frozen v0.5.0 baseline
- Changes to the vendored `external/turso-main` tree — reference material only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| context/** | Create | Deep-context loop state + context report |
| research/research.md | Create | Canonical revalidation output (17 sections) |
| research/iterations/**, research/deltas/** | Create | Deep-research loop state |
| spec.md | Modify | Findings write-back fence at synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Context report covering SQLite usage of all three skills + 027 deltas | `context/context-report.md` exists; 10 iteration records in `context/deep-context-state.jsonl`; findings carry per-seat attribution |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every item in research docs 001–003 re-visited against v0.7.0-pre.6 with explicit verdict (unchanged / changed / refuted) | `research/research.md` contains per-gap verdict table covering all 16 gaps, paths A/B/C, P0–P4 priorities, and all open questions from the baseline docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Context report enumerates reuse candidates, integration points, and migration touchpoints with verified `file:symbol` citations for the three skills.
- **SC-002**: Revalidation report assigns each of the 16 gaps an explicit verdict delta vs the v0.5.0 baseline, with adversarially verified citations for every changed verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | xiaomi provider (MiMo v2.5 Pro) via opencode | Phase A seats cannot dispatch | Pre-flight `opencode models xiaomi`; fail closed, never substitute |
| Dependency | claude2 account binary (Fable 5 @ xhigh) | Phase B seats cannot dispatch | Pre-flight one cheap dispatch; surface auth errors to operator |
| Risk | Same-model agreement correlation in MiMo-only pool | Medium | Distinct seat perspectives per prompt; disclosed in report methodology |
| Risk | Vendored tree is a pre-release (v0.7.0-pre.6) | Medium | Verdicts cite the vendored tree AND current web state separately |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- ATTACH operational semantics under the experimental flag (cross-attached write transactions, attached-shard WAL behavior) — pilot-phase test.
- Exact `changes()` mis-count semantics inside trigger sub-statements — pilot test list.
- Per-segment BM25 ranking-drift magnitude under Tantivy NoMergePolicy — corpus A/B during pilot.
- Open corruption-class issue census on the Turso tracker before any pilot go/no-go.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (session res-20260610-1626-sqlt, 17 iterations, synthesized 2026-06-10):**
- HARD blocker set shrinks 4 → 3 at Turso v0.7.0-pre.6: no vector index (gap 1), no FTS5 surface (gap 2), no WITH RECURSIVE (gap 6). Gap 16 (sync→async) drops to MEDIUM via the shipped better-sqlite3-compatible `./compat` sync mode.
- REFUTED baseline gaps: 3 (`.pragma()` exists in both JS APIs) and 7 (AUTOINCREMENT works under MVCC). CHANGED-better: 8 (triggers default-on), 9 (VACUUM INTO unconditional incl. schema-qualified), 10 (CDC pragma stabilized, still opt-in), 16. CHANGED-worse: 14 (window functions are row_number-only).
- Nine context-report blocker claims refuted at source level (no-ATTACH, no-VACUUM-INTO, no-triggers, no-.pragma(), full-async-required, lease-redesign, three pragma-introspection claims). ATTACH is experimental-gated but JS-enableable via `experimental: ["attach"]`; shard architecture survives (keep-ATTACH recommendation).
- Strategy: Path A (libSQL) DEMOTED; winner is Path C-prime — five-port DatabaseAdapter (~1,200–2,000 LOC) + de-SQLite-ism pre-work (BFS rewrite of the two recursive CTEs, dimension discovery, Busy/BusySnapshot retry) + compat-mode pilot behind the adapter; full migration gated on four 1.0 signals. Canonical detail: `research/research.md` §9 verdict matrix, §11 recommendations.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
