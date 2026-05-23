# Iteration 8 — SQLite schema v2 + node-kind allow-list documentation accuracy

**Spec folder**: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/` (pre-approved, skip Gate 3)
**Framework**: RCAF (Role / Context / Action / Format) per cli-devin SKILL.md §3 SWE-1.6 contract
**Iteration**: 8 of 10 — prior trail [11, 5, 8, 2, 2, 4, 1] @ newInfoRatio = [1.00 × 7]
**Bundle-gate language**: standard (do NOT tighten; SWE-1.6 over-tightens defensively)

---

## R — ROLE

You are a **schema documentation accuracy auditor** verifying whether three documentation surfaces faithfully reflect the SQLite schema actually enforced by `lib/coverage-graph/coverage-graph-db.ts` (the source of truth, 829 LOC).

The three doc surfaces (descending detail):

1. `.opencode/skills/deep-loop-runtime/storage/README.md` (36 LOC) — orientation README
2. `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md` (193 LOC) — documented schema contract
3. `.opencode/skills/deep-loop-runtime/README.md` (470 LOC) — Phase-3 rewrite §3.4 COVERAGE GRAPH (L184-194), §3.7 STORAGE (L225-229)

Your job is to perform a **three-way drift sweep** across SIX field groups (schema version, research node-kind allow-list, review node-kind allow-list, research+review edge-kind allow-lists, table-column definitions, indexes, DB lifecycle invariant) and emit findings ONLY where a documentation surface makes a FACTUAL CLAIM that drifts from source.

You are dispatched by an orchestrator that has already verified two high-confidence drifts (you must CONFIRM independently; do not silently re-emit):

- **HIGH-CONFIDENCE DRIFT A (README.md L194)**: prose says "The deep-review loop adds review nodes (dimension, file, finding, evidence, remediation, code-surface)". The source `coverage-graph-db.ts` L132-143 enforces 10 review kinds: `DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION, BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST`. The README omits 5 real kinds (`BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`) and introduces 1 fictional kind (`code-surface`) that does NOT exist in source.
- **HIGH-CONFIDENCE DRIFT B (references/coverage_graph_schema.md L36)**: the loop-type table prose says "Deep-review dimension, file, finding, evidence, remediation, and **code-surface** graph". Same `code-surface` fabrication as Drift A. HOWEVER, the authoritative §3 NODE KINDS table at L52-65 in the SAME file lists all 10 kinds correctly. So this surface has **internal contradiction**: prose-description drift only, authoritative table is correct.

Confirm both drifts via direct file reads, then emit findings.

---

## C — CONTEXT

### C.1 — Ground-truth: source-of-truth field groups (orchestrator pre-verified via direct read of `coverage-graph-db.ts`)

| Field | Source (file:line) | Verbatim |
|-------|--------------------|----------|
| Schema version constant | `coverage-graph-db.ts:96` | `export const SCHEMA_VERSION = 2;` |
| Research node kinds (4) | `coverage-graph-db.ts:131` | `['QUESTION', 'FINDING', 'CLAIM', 'SOURCE']` |
| Review node kinds (10) | `coverage-graph-db.ts:132-143` | `['DIMENSION', 'FILE', 'FINDING', 'EVIDENCE', 'REMEDIATION', 'BUG_CLASS', 'INVARIANT', 'PRODUCER', 'CONSUMER', 'TEST']` |
| Research relations (7) | `coverage-graph-db.ts:147` | `['ANSWERS', 'SUPPORTS', 'CONTRADICTS', 'SUPERSEDES', 'DERIVED_FROM', 'COVERS', 'CITES']` |
| Review relations (8) | `coverage-graph-db.ts:148` | `['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE']` |
| Tables (4) | `coverage-graph-db.ts:153-203` | `coverage_nodes`, `coverage_edges`, `coverage_snapshots`, `schema_version` |
| Indexes (10) | `coverage-graph-db.ts:205-214` | 10 `CREATE INDEX` statements, see source |
| Lifecycle invariant | `coverage-graph-db.ts:219-308` | Singleton `let db: Database | null`, `initDb` uses try/catch, `closeDb()` resets to null |

### C.2 — Documentation surfaces (orchestrator pre-verified file locations + sizes)

| Surface | Path | LOC | What it claims |
|---------|------|-----|----------------|
| 1 | `storage/README.md` | 36 | Orientation only — 4 sections (OVERVIEW, FILES, LIFECYCLE, RELATED RESOURCES). **No** node-kind, edge-kind, table, or schema-version CLAIMS — points to `lib/coverage-graph/` for schema. |
| 2 | `references/coverage_graph_schema.md` | 193 | Authoritative documented contract — §1 OVERVIEW (schema version), §2 LOOP TYPES, §3 NODE KINDS (research + review tables), §4 RELATION TYPES (research + review tables), §5 TABLES, §6 INDEXES, §7 LIFECYCLE, §8 SOURCE ANCHORS. |
| 3 | `README.md` §3.4 + §3.7 | 470 (whole file) | High-level: §3.4 L184-194 names the 3 coverage-graph modules and includes the drifted prose at L194. §3.7 L225-229 claims "Schema version 2" + "session-scoped through node and edge tagging". |

### C.3 — Prior iter findings that bear on this audit (do NOT re-report)

| Finding | Iter | Surface | Why iter 8 is not a re-report |
|---------|------|---------|------------------------------|
| AF-0050 (Phase 2) | n/a | All 8 sub-READMEs (incl. `storage/README.md`) | Phase-2 audit established sub-READMEs are intentionally terse orientation docs. Bare orientation is NOT a finding — only factually-WRONG claims are findings. `storage/README.md` makes no factual claims to drift, so it is clean. |
| DR-001..DR-034 | 1-7 | Various | None target schema-doc drift in `references/coverage_graph_schema.md` or README §3.4/§3.7 node-kind enumeration. iter 8 is structurally novel. |

### C.4 — Boundaries

- **SC-007 invariant**: NO edits to `lib/`, `scripts/`, `tests/`, `storage/` of `deep-loop-runtime/`. The schema itself is code; if `coverage-graph-db.ts` had a real defect (e.g. an enforced kind missing a CHECK constraint), that would be LOG_ONLY per ADR-004 secondary focus.
- **iter-3 DR-023 boundary**: no edits to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`.
- **ADR-004 LOG_ONLY**: code defects in `coverage-graph-db.ts` are surfaced but NOT fixed in this packet. Findings remain documentation-class (P1/P2 user-facing or internal-only).
- **NO file edits this iteration** — emit findings markdown ONLY. The remediation packet applies actual fixes later.

---

## A — ACTION

Perform a **three-pass audit** with sequential_thinking MCP enforcement (≥5 thoughts before output).

### STEP 1 — Confirm DRIFT A (README.md L194)

Read `.opencode/skills/deep-loop-runtime/README.md` L184-200 and `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` L130-145 directly.

Verify verbatim:
- README L194 contains "(dimension, file, finding, evidence, remediation, code-surface)".
- Source L132-143 enforces 10 review kinds.
- "code-surface" appears nowhere in source `VALID_KINDS.review` or `ReviewNodeKind` union type.

If both confirmed, emit **DR-035 (P1, documentation-drift-readme-node-kind-list-incorrect)** with:
- **Drift summary**: README L194 lists 6 review node kinds (5 real + 1 fabrication) where source enforces 10 real kinds.
- **5 omitted kinds**: `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`
- **1 fabricated kind**: `code-surface` (no such kind in source — possibly a confused reference to `lib/sk-code` surface tags, but unrelated to coverage-graph node kinds)
- **Recommended replacement**: either (a) drop the prose enumeration entirely and defer to `references/coverage_graph_schema.md` §3 (which is correct), or (b) update L194 to enumerate all 10 real kinds.
- **Severity rationale**: P1 because README is the operator-facing entry doc; consumers reading L194 get a materially wrong picture of what review nodes the runtime supports.

### STEP 2 — Confirm DRIFT B (references/coverage_graph_schema.md L36)

Read `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md` L31-65 directly.

Verify verbatim:
- L36 (loop-type table row for `review`) contains "code-surface" in the prose description.
- §3 NODE KINDS Review table (L52-65) lists all 10 correct kinds.

If both confirmed, emit **DR-036 (P2, documentation-drift-schema-doc-prose-vs-authoritative-table)** with:
- **Drift summary**: reference doc's loop-type prose at L36 introduces "code-surface" (fabricated kind) inconsistent with the SAME file's authoritative table at L52-65.
- **Severity rationale**: P2 because the same file's authoritative table is correct — a careful reader reaches the right answer; a skimming reader (only the loop-type intro) gets misled. Lower impact than DR-035 (consumer-facing README).
- **Recommended replacement**: rewrite L36 description to say "Deep-review dimension, file, finding, evidence, remediation, bug-class, invariant, producer, consumer, and test graph" OR drop the enumeration entirely and let §3 carry it.

### STEP 3 — Field-group three-way sweep (PASS / FAIL / PARTIAL per group)

For each of the 6 field groups, classify:

| Field group | Source | storage/README | reference schema | README §3.4/§3.7 | Verdict |
|-------------|--------|----------------|------------------|------------------|---------|
| Schema version (v2) | `coverage-graph-db.ts:96` (=2) | not claimed | L23 ("`2`") | L227 ("Schema version 2") + L190 ("schema (v2)") | PASS |
| Research node kinds (4) | L131 | not claimed | L46-49 (4 kinds) | L194 (4 kinds correct) | PASS |
| Review node kinds (10) | L132-143 | not claimed | §3 table L52-65 correct; **L36 prose drifts** | L194 drifts | **FAIL** (DR-035 + DR-036) |
| Research relations (7) | L147 | not claimed | §4 L70-78 (7 rels) | not claimed | PASS |
| Review relations (8) | L148 | not claimed | §4 L80-89 (8 rels) | not claimed | PASS |
| Tables (4: nodes/edges/snapshots/schema_version) | L153-203 | not claimed | §5 L95-152 (4 tables, column-faithful) | not claimed | PASS |
| Indexes (10) | L205-214 | not claimed | §6 L156-169 (10 indexes correct) | not claimed | PASS |
| Lifecycle invariant ("single owner, try/finally") | L219-308 | L27-31 (terse: "Backed by atomic-write and flock locking") | §7 L173-179 ("Scripts call `closeDb()` in `finally`") | L227 ("Owned exclusively by `lib/coverage-graph/coverage-graph-db.ts`") + L212 ("opens SQLite inside a `try`...closes the DB in a `finally`") | PASS |
| Session-scoped via node/edge tagging | L131-143 (PK includes session_id) | not claimed | L113 PK includes `session_id` | L229 explicit | PASS |

For any group classified `FAIL` or `PARTIAL`, the finding (DR-035 / DR-036) already covers it. No additional findings unless a third drift surfaces.

### STEP 4 — Negative-knowledge verification (DEFENSIVE)

Verify these are NOT findings:
- **storage/README.md bareness**: AF-0050 (Phase 2) established sub-README terseness is by design. Confirm: storage/README.md makes NO factual claim that could drift. If it makes NO claim, it cannot drift, ergo no finding.
- **README L227 "Schema version 2"**: matches source `SCHEMA_VERSION = 2`. PASS.
- **Reference doc §5 column types**: spot-check that `coverage_nodes` column list (spec_folder, loop_type, session_id, id, kind, name, content_hash, iteration, metadata, created_at, updated_at) matches source L155-167 verbatim. PASS expected.
- **Reference doc §6 index list**: spot-check that all 10 indexes in source L205-214 appear in reference table L156-169. PASS expected.

If any of these checks REVEAL a third drift, emit a third finding. Otherwise STOP at 2 findings (DR-035 + DR-036).

---

## F — FORMAT

Emit a markdown report with the following exact structure:

```markdown
## §A — DRIFT A confirmation (STEP 1)

**README.md L194 verbatim**: "<quote>"

**Source `coverage-graph-db.ts:132-143` verbatim review kinds**: <10 kinds>

**Drift verdict**: CONFIRMED (5 omissions: BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST; 1 fabrication: code-surface)

**Finding emitted**: DR-035 (P1, documentation-drift-readme-node-kind-list-incorrect)

## §B — DRIFT B confirmation (STEP 2)

**references/coverage_graph_schema.md L36 verbatim**: "<quote>"

**Same file §3 table (L52-65)** correctness check: 10 kinds present? YES / NO

**Internal contradiction verdict**: CONFIRMED (prose-only drift; authoritative table correct)

**Finding emitted**: DR-036 (P2, documentation-drift-schema-doc-prose-vs-authoritative-table)

## §C — Three-way field-group sweep (STEP 3)

| Field group | Source ref | storage README | schema reference | top README | Verdict |
|-------------|-----------|----------------|------------------|-----------|---------|
| Schema version | L96 (=2) | n/a | L23 | L190, L227 | PASS |
| Research node kinds | L131 | n/a | L46-49 | L194 | PASS |
| Review node kinds | L132-143 | n/a | §3 L52-65 PASS; L36 prose FAIL | L194 FAIL | **FAIL** |
| Research relations | L147 | n/a | L70-78 | n/a | PASS |
| Review relations | L148 | n/a | L80-89 | n/a | PASS |
| Tables (4) | L153-203 | n/a | §5 | n/a | PASS |
| Indexes (10) | L205-214 | n/a | §6 | n/a | PASS |
| Lifecycle invariant | L219-308 | L27-31 (terse OK) | §7 explicit | L212, L227 explicit | PASS |
| Session-scoping | namespace PK | n/a | L113 PK | L229 | PASS |

## §D — Negative knowledge / non-finding verification (STEP 4)

| Check | Verdict |
|-------|---------|
| storage/README.md makes no factual schema claim | PASS (no drift possible — orientation only) |
| Reference §5 column types match source | PASS / FAIL with detail |
| Reference §6 index list matches source 10 indexes | PASS / FAIL with detail |
| README L227 schema version | PASS (matches source) |

## §E — Documentation accuracy verdict

- **storage/README.md (36 LOC)**: ACCURATE (no claims to drift; bare orientation by design per AF-0050).
- **references/coverage_graph_schema.md (193 LOC)**: AUTHORITATIVE TABLES ACCURATE, PROSE DESCRIPTION DRIFTED (L36). Sub-finding DR-036 is P2.
- **README.md §3.4 + §3.7 (relevant 50 LOC)**: §3.4 L194 review-node-kind enumeration MATERIALLY INCORRECT (5 omissions + 1 fabrication). Sub-finding DR-035 is P1. §3.7 storage-section claims are accurate.

## §F — Totals

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 (DR-035) |
| P2 | 1 (DR-036) |
| **Total** | **2** |

**newInfoRatio**: 1.00 (both findings novel; no prior DR targets schema-doc node-kind list).

## §G — Verdict

**Iter 8 verdict**: DOCUMENTATION DRIFT — README + reference doc both propagate fabricated "code-surface" kind. Source code is correct; documentation needs surgical patch (drop or fix L194 in README, fix L36 in reference). Remediation surface = 2 lines.
```

---

## Constraints

1. **NEVER edit any file inside `.opencode/skills/deep-loop-runtime/lib/`, `scripts/`, `tests/`, `storage/`** (SC-007 invariant).
2. **NEVER edit `.opencode/skills/system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`** (iter-3 DR-023 boundary).
3. **NEVER edit ANY file in this iteration** — emit findings markdown to stdout only. The remediation packet applies actual fixes later.
4. **Use sequential_thinking MCP** with ≥5 thoughts before producing structured output.
5. **DO NOT re-report DR-001..DR-034 or AF-0001..AF-0080**. If a candidate overlaps a prior DR, mark `consolidated-with-DR-NNN` and skip.
6. **Bundle gate**: keep grep/exec verification commands at standard density; do not embed multiple `verify | rg | wc` chains that push SWE-1.6 toward defensive output.
7. **Honest non-findings**: if any of the two pre-flagged drifts (A or B) FAILS verification on direct read (e.g. the text differs from what the orchestrator quoted), DO emit a different finding capturing the actual drift OR emit NO finding for that surface and explain why. Do NOT rubber-stamp the orchestrator's pre-flags — verify independently.

Begin with sequential_thinking, then proceed step-by-step.
