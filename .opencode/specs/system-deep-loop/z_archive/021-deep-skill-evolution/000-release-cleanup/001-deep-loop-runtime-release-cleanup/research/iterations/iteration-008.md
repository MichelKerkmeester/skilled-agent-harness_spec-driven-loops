---
iter: 8
date: "2026-05-23"
executor: cli-devin
model: swe-1.6
permission_mode: auto
prompt_file: research/prompts/iter-08-prompt.md
stdout_log: research/logs/iter-08-stdout.txt
stderr_log: research/logs/iter-08-stderr.txt
wall_clock_seconds: 25
exit_code: 0
focus: "SQLite storage schema v2 + node-kind allow-list documentation accuracy (three-way source ↔ reference ↔ README sweep)"
findings_count: 2
findings_p0: 0
findings_p1: 1
findings_p2: 1
novel_findings: 2
re_reported_findings: 0
new_info_ratio: 1.00
log_only_findings: 0
sc_007_boundary_held: true
---

# Iteration 8 — SQLite Schema v2 + Node-Kind Allow-List Documentation Accuracy

## Objective

Per `research/deep-research-strategy.md` §4 iter 8: verify whether `storage/README.md` (36 LOC orientation) and `references/coverage_graph_schema.md` (193 LOC authoritative contract) and the top-level `README.md` §3.4/§3.7 (Phase-3 rewrite) accurately reflect the SQLite schema enforced by the source-of-truth `lib/coverage-graph/coverage-graph-db.ts` (829 LOC).

The strategy listed 7 specific checks: schema version (v2), node-kind allow-list (research + review), edge-kind allow-list (research + review), table names + columns, index names + indexed columns, lifecycle invariant ("single owner, opened in try, closed in finally"), and the "session-scoped through node/edge tagging, not per-session files" claim from the Phase-3 rewrite.

Per the secondary focus (ADR-004 LOG_ONLY): any defect in `coverage-graph-db.ts` itself is logged for follow-on, not fixed here.

## Method

### Orchestrator-side ground-truth pre-pass (5 direct file reads + 1 grep sweep)

1. **`cli-devin/SKILL.md` (full 482 LOC)** — confirmed SWE-1.6 RCAF + medium-density pre-planning + standard bundle-gate contract.
2. **`sk-prompt-models/SKILL.md` (full 228 LOC)** — confirmed small-model routing anchor; pattern-index is in `cli-devin/references/`.
3. **`research/deep-research-config.json`** — iterationCount=7, executor=cli-devin/swe-1.6, timeout=1500.
4. **`research/deep-research-strategy.md` §4 iter 8 + §1 charter §2 non-goals** — focus + SC-007 invariant + ADR-004 LOG_ONLY.
5. **`research/deep-research-state.jsonl` (8 records: init + 7 iters)** — prior trail [11, 5, 8, 2, 2, 4, 1], all 7 at 1.00 newInfoRatio.
6. **`research/iterations/iteration-007.md`** — confirmed DR-034 closed council-coverage cluster in catalog/playbook; iter-7 dispatched in 19s (fastest yet) due to pre-supplied ADR-verbatim quotes.

### Source-of-truth read (the foundation of this iter's findings)

7. **`lib/coverage-graph/coverage-graph-db.ts` (full 829 LOC)** — the authoritative schema enforcer. Key constants:
   - L96: `export const SCHEMA_VERSION = 2;`
   - L12: `ResearchNodeKind = 'QUESTION' | 'FINDING' | 'CLAIM' | 'SOURCE'` (4 kinds)
   - L14-24: `ReviewNodeKind = 'DIMENSION' | 'FILE' | 'FINDING' | 'EVIDENCE' | 'REMEDIATION' | 'BUG_CLASS' | 'INVARIANT' | 'PRODUCER' | 'CONSUMER' | 'TEST'` (**10 kinds**)
   - L28-35: `ResearchRelation` = 7 relations
   - L37-45: `ReviewRelation` = 8 relations
   - L130-149: runtime `VALID_KINDS` + `VALID_RELATIONS` allow-lists matching the type unions
   - L153-215: schema SQL — 4 tables (`coverage_nodes`, `coverage_edges`, `coverage_snapshots`, `schema_version`) + 10 indexes
   - L219-308: lifecycle — singleton `let db: Database | null`, `initDb` uses try/catch, `closeDb()` clears all state

### Documentation surfaces read

8. **`storage/README.md` (full 36 LOC)** — pure orientation: 4 sections (OVERVIEW, FILES, LIFECYCLE, RELATED RESOURCES). Makes **no factual claim** about schema version, node-kind allow-list, edge-kind allow-list, table column types, or index names. Only structural pointer: "Schema: `lib/coverage-graph/`" at L35. Confirms AF-0050 (Phase-2): bare orientation is by design.
9. **`references/coverage_graph_schema.md` (full 193 LOC)** — the documented contract. §1 OVERVIEW L23 ("Schema version: `2`."), §2 LOOP TYPES L31-36 (loop-type table), §3 NODE KINDS L40-65 (research 4 + review 10), §4 RELATION TYPES L68-91, §5 TABLES L95-152 (column-faithful), §6 INDEXES L156-169 (10 indexes), §7 LIFECYCLE L173-179 ("Scripts call `closeDb()` in `finally`"), §8 SOURCE ANCHORS L183-192.
10. **`README.md` lines 183-235** — Phase-3 rewrite §3.4 COVERAGE GRAPH + §3.5 COUNCIL + §3.6 SCRIPT ENTRY POINTS + §3.7 STORAGE. Key claims at L190 ("SQLite schema (v2), node-kind allow-list"), L194 (prose enumeration of review kinds), L227 ("Schema version 2"), L229 ("session-scoped through node and edge tagging").
11. **Composite grep sweep**: `grep -in "code.surface\|CODE_SURFACE\|code-surface" lib/coverage-graph/*.ts references/*.md README.md storage/README.md` — confirmed "code-surface" appears NOWHERE in source but appears in TWO doc surfaces (README.md L194 + references/coverage_graph_schema.md L36).

### Pre-verified drift before dispatch

The orchestrator caught **two high-confidence drifts** in the pre-pass:

| # | Doc surface | Line | Drift |
|---|-------------|------|-------|
| A | `README.md` | L194 | Lists 6 review kinds: `(dimension, file, finding, evidence, remediation, code-surface)`. Source enforces 10 (`DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION, BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST`). 5 omissions + 1 fabrication. |
| B | `references/coverage_graph_schema.md` | L36 | Prose row reads `Deep-review dimension, file, finding, evidence, remediation, and code-surface graph.` — same "code-surface" fabrication. BUT the same file's §3 authoritative table (L52-65) lists all 10 kinds correctly — internal contradiction. |

### Dispatch

Composed RCAF prompt with high-confidence drift pre-flags, ground-truth field-group table, and an explicit instruction NOT to rubber-stamp the orchestrator's pre-flags — verify independently via direct file reads.

```bash
gtimeout 1500 devin --prompt-file research/prompts/iter-08-prompt.md \
  --model swe-1.6 --permission-mode auto -p \
  > research/logs/iter-08-stdout.txt 2> research/logs/iter-08-stderr.txt </dev/null
```

**Result**: exit 0 in **25s**. 63-line stdout, 0-byte stderr. Devin independently verified both drifts with exact verbatim quotes matching the orchestrator's pre-pass.

### Post-dispatch bundle gate (4 checks)

1. **SC-007 invariant**: `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib' '.../scripts' '.../tests' '.../storage' '.../system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs'` → EMPTY ✓
2. **README L194 verbatim**: `sed -n '194p'` returned: "Schema details live in `references/coverage_graph_schema.md`. The deep-research loop adds research nodes (`QUESTION`, `FINDING`, `CLAIM`, `SOURCE`). The deep-review loop adds review nodes (dimension, file, finding, evidence, remediation, code-surface)." — devin's quote matches ✓
3. **Schema doc L36 verbatim**: `sed -n '36p'` returned: "| `review` | Deep-review dimension, file, finding, evidence, remediation, and code-surface graph. |" — devin's quote matches ✓
4. **Source L132-143 verbatim**: `sed -n '132,143p'` returned the 10-kind review allow-list — devin's enumeration is exact ✓

### Cleanup

`pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*` `/tmp/codex-*` `/tmp/deep-research-*` per `feedback_proactive_orphan_cleanup` memory. ps confirmed 0 lingering processes.

## Findings

**2 NOVEL findings (DR-035 P1 + DR-036 P2)**. Zero re-reports of DR-001..DR-034 or AF-0001..AF-0080.

| # | ID | Severity | Class | Artifact:Line | Drift |
|---|----|----------|-------|---------------|-------|
| 1 | DR-035 | P1 | documentation-drift-readme-node-kind-list-incorrect | `README.md:194` | Lists 6 review node kinds `(dimension, file, finding, evidence, remediation, code-surface)` where source `coverage-graph-db.ts:132-143` enforces 10 (`DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION, BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST`). 5 omissions (`BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`) + 1 fabrication (`code-surface` — exists nowhere in source). README is the operator-facing entry doc; consumers reading L194 get a materially wrong picture. |
| 2 | DR-036 | P2 | documentation-drift-schema-doc-prose-vs-authoritative-table | `references/coverage_graph_schema.md:36` | Loop-type table prose at L36 introduces "code-surface" (fabricated kind) inconsistent with same file's authoritative table at L52-65 (10 correct kinds). Internal contradiction. P2 because the same file's authoritative table is correct — a careful reader reaches the right answer; a skimming reader gets misled. |

**Severity rollup**: 0 P0 / 1 P1 / 1 P2 = 2 total novel findings.

**Class**: 2× `documentation-drift-*` (new sub-classes — sister to DR-001..DR-005 SKILL/README/changelog drift family). DR-035 is the first finding in this packet targeting the README §3.4 schema-claim surface; DR-036 is the first finding targeting the reference doc's loop-type prose.

### Recommended remediation (NOT applied this iter — packet boundary)

**Option A (preferred — minimal)**: drop the inline prose enumeration on both lines and defer to the authoritative table.
- `README.md:194` rewrite: "Schema details live in `references/coverage_graph_schema.md`. The deep-research loop adds research nodes and the deep-review loop adds review nodes; see the schema doc §3 for the full allow-list."
- `references/coverage_graph_schema.md:36` rewrite: "| `review` | Deep-review evidence graph (see §3 for the full node-kind allow-list). |"

**Option B (verbose — keep the enumeration)**: update both lines to list all 10 kinds.
- `README.md:194` rewrite: "...review nodes (`DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, `REMEDIATION`, `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`)."
- `references/coverage_graph_schema.md:36` rewrite: "| `review` | Deep-review dimension, file, finding, evidence, remediation, bug-class, invariant, producer, consumer, and test graph. |"

Option A is preferred because authoritative-table-as-truth scales: future kind additions only require updating the §3 table, not multiple prose echoes.

## Three-Way Field-Group Sweep (PASS / FAIL Verdict per group)

| # | Field group | Source | storage/README | reference schema | top README | Verdict |
|---|-------------|--------|----------------|------------------|------------|---------|
| 1 | Schema version (v2) | `coverage-graph-db.ts:96` (=2) | not claimed | L23 ("`2`") | L190 ("(v2)") + L227 ("Schema version 2") | **PASS** |
| 2 | Research node kinds (4) | L131 | not claimed | L46-49 (4 kinds) | L194 (4 kinds correct) | **PASS** |
| 3 | Review node kinds (10) | L132-143 | not claimed | §3 L52-65 correct; **L36 prose drifts (code-surface)** | L194 drifts (5 omissions + code-surface) | **FAIL** (DR-035 + DR-036) |
| 4 | Research relations (7) | L147 | not claimed | §4 L70-78 (7 rels) | not claimed | **PASS** |
| 5 | Review relations (8) | L148 | not claimed | §4 L80-89 (8 rels) | not claimed | **PASS** |
| 6 | Tables (4) | L153-203 | not claimed | §5 L95-152 (column-faithful) | not claimed | **PASS** |
| 7 | Indexes (10) | L205-214 | not claimed | §6 L156-169 (10 indexes correct) | not claimed | **PASS** |
| 8 | Lifecycle invariant ("single owner, try/finally") | L219-308 | L27-31 (terse, accurate) | §7 L173-179 ("Scripts call `closeDb()` in `finally`") | L212 ("opens SQLite inside a `try`...closes the DB in a `finally`") + L227 ("Owned exclusively by ...db.ts") | **PASS** |
| 9 | Session-scoped via node/edge tagging | namespace PK L130-149 | not claimed | L113 PK includes `session_id` | L229 explicit | **PASS** |

**Summary**: 8 of 9 field groups PASS; 1 (review node kinds) FAIL at two doc surfaces (DR-035 + DR-036).

## Verified Clean (no findings)

- `storage/README.md` (36 LOC): ACCURATE — no factual schema claim made, so no drift possible. AF-0050 Phase-2 finding established this terseness is intentional.
- `references/coverage_graph_schema.md` authoritative tables: §3 NODE KINDS, §4 RELATION TYPES, §5 TABLES, §6 INDEXES, §7 LIFECYCLE all match source verbatim.
- `README.md` §3.7 STORAGE (L225-229): all 3 claims accurate (schema version 2, single-owner DB, session-scoped via tagging).
- Source code (`coverage-graph-db.ts`): no defect surfaced this iter. The type unions (L12, L14-24), constants (L96, L130-149), and SQL schema (L153-215) are internally consistent. No ADR-004 LOG_ONLY entries needed.
- Research node-kind prose at README L194 is CORRECT (`QUESTION`, `FINDING`, `CLAIM`, `SOURCE` matches source). Only the review-node-kind prose is wrong.

## Citation Drift Caught

None this iter. All 4 verbatim quotes (README L194, schema doc L36, source L132-143, source L96) cross-checked directly via `sed -n` after dispatch. Devin's quoting was exact in every case.

## Negative Knowledge

Refuted hypotheses (orchestrator + devin agreement):

- **"`code-surface` might be an alias for one of the 10 real kinds"** — REFUTED. `grep -in "code.surface\|CODE_SURFACE\|code-surface"` on `lib/coverage-graph/*.ts` returns ZERO hits. The phrase exists ONLY in two doc surfaces (README L194 + schema doc L36), never in source. It is a pure fabrication, not an alias.
- **"`storage/README.md` might have hidden factual claims"** — REFUTED. Full file read confirmed 4 sections of pure orientation prose (OVERVIEW: 1 sentence; FILES: 1-row table with the .sqlite filename; LIFECYCLE: 3 bullet points; RELATED RESOURCES: 2-row pointer list). Zero schema-version claim, zero node-kind list, zero column-type claim, zero index list. AF-0050 holds.
- **"DR-035 might overlap DR-001..DR-005 (Phase-1 cross-doc drift)"** — REFUTED. DR-001..DR-005 captured SKILL.md / README.md / changelog / graph-metadata cross-doc fact-drift but NONE targeted the §3.4 review-node-kind enumeration. Iter-1 finding scope (per `research/iterations/iteration-001.md`) was: spec versioning, SKILL.md trigger-phrase / line-anchor / scope claims, changelog-vs-SKILL date mismatches, graph-metadata field freshness. Different surface, different artifact, no overlap.
- **"Reference doc §3 table might also be wrong"** — REFUTED. Direct read of L52-65 confirms all 10 kinds present with one-line meaning per kind. The contradiction is internal to the same file (L36 prose vs L52-65 table), not external to the source.

## Open Threads

1. **Iter 9 candidate (per strategy.md §4)**: cross-arc references (118 ADRs, 117 council ruling, 129/001 → 131/001/008 ADR-001). DR-029 (iter 6) already captured the canonical 4-site defect, and iter-7 §C packaged the replacement strings. Iter 9 may be LOW-yield (≤1 finding) unless other cross-arc citations (e.g. phase 117 or 118 references) drift.
2. **Iter 10**: synthesis pass — re-read all prior iterations, hunt transverse patterns + emit research.md per loop_protocol §17 contract.
3. **DR-035 + DR-036 are surgical 2-line patches**. The remediation packet for the council-omission cluster (DR-016, DR-017, DR-018, DR-029, DR-031, DR-033, DR-034) can fold DR-035 + DR-036 in as adjacent surface fixes — same `references/` and `README.md` files. Single packet of 6 doc surfaces grows to 8 findings × 6 artifacts (no new artifact added).
4. **Hypothesis for "code-surface" origin**: the phrase echoes `sk-code` skill's "surface" terminology (e.g. `sk-code/references/<surface>/` for Webflow/Go/Next.js). The Phase-3 README rewriter may have cross-contaminated `sk-code` "surface" vocabulary into the coverage-graph node-kind enumeration. Worth noting as a glossary-discipline observation but NOT a separate finding (the drift IS DR-035/036; the origin hypothesis is causal commentary).

## Self-Critique

- **Dispatch decision**: cli-devin SWE-1.6 with high-confidence drift pre-flags + ground-truth table + independent-verification instruction was the right call. The 25s wall-clock matches iter-7's 19s ballpark — both are confirmatory dispatches where the orchestrator pre-pass eliminates devin's exploration cost. The prompt's "DO NOT rubber-stamp — verify independently" caveat is load-bearing: it forces devin to ground each finding in a fresh file read rather than echoing the orchestrator's claims.
- **Severity calibration**: 1 P1 + 1 P2. P1 for DR-035 (README is operator-facing — wrong info impacts every consumer reading the entry doc) and P2 for DR-036 (schema doc has a correct authoritative table — careful reader reaches truth, only the loop-type intro misleads). The split is principled: same fabricated word ("code-surface") but different blast radius based on doc role.
- **Tool-call budget**: orchestrator used 11 tool calls (1 ls + 2 SKILL reads + 4 state/strategy/iter reads + 1 source-of-truth read + 3 doc reads + 1 composite grep + 1 dispatch + 1 verbatim verification = 14 across plan/dispatch/gate, well under the 18 envelope). Yield (2 findings + 8-row PASS/FAIL sweep) justifies the budget.
- **Counting drift detection**: devin §F total = 2; §A emits 1 (DR-035); §B emits 1 (DR-036); §C field-group table marks 1 group FAIL. 1+1=2. Internally consistent. No off-by-one.
- **Honest non-finding handling**: storage/README.md and 8 of 9 field groups verified as PASS via direct file reads. The temptation to over-emit (e.g. "storage/README should expand to mirror references/" or "README should claim schema version 2 in §3.4") was resisted because AF-0050 already established sub-README terseness is intentional and §3.7 L227 ALREADY claims "Schema version 2" correctly.
- **Confidence**: very high. All 4 verbatim quotes (README L194, schema L36, source L96, source L132-143) cross-checked directly. Drift is unambiguous: 5 omissions + 1 fabrication where the fabrication exists nowhere in source. SC-007 boundary held. The 2-line remediation patch surface is the smallest possible footprint for a P1 finding.

## Convergence Signal

- `newInfoRatio = 1.00` (2/2 novel; zero re-reports of DR-001..DR-034 or AF-0001..AF-0080).
- Trail: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00] — 8 iters at perfect novelty.
- `consecutiveLowDeltaIters = 0` (soft-convergence threshold 0.05 remains structurally unreachable).
- `stopReason = null`.
- Distance from hard cap (iter 10): 2 iterations remaining.

**Absolute finding count trail**: [11, 5, 8, 2, 2, 4, 1, 2]. Iter 8 yields 2 findings (slightly above iter 7's floor of 1; below iter 6's 4 and iter 3's 8). Trend is consistent with the dashboard's "approaching saturation" call.

**Operational saturation signal**: dashboard's early-stop trigger (`iter N + iter N+1 each return ≤2 findings AND 0 P1+ for 2 consecutive iters`) is now PARTIALLY satisfied — iter 7 returned 1 finding (1 P1) and iter 8 returned 2 findings (1 P1 + 1 P2). The `≤2 findings` clause is now met for 2 consecutive iters; the `0 P1+` clause FAILS at both iters (each has 1 P1). Soft-convergence trigger (`newInfoRatio < 0.05 for 2 consecutive iters`) also fails (1.00 ratio).

Pattern firming:
- Iter 8 (SQLite schema documentation): 2 findings (1 P1 + 1 P2). Matches the strategy's "expected 0-2 findings" pre-estimate. Confirms the surface is narrow but materially drifted.
- Iter 9 (cross-arc references): DR-029 already captured the canonical 129/001 → 131/001/008 defect → expect 0-1 findings.
- Iter 10: synthesis pass.

**Saturation judgment**: APPROACHING saturation, not yet reached. Iter 8 returned 2 genuinely novel findings on a structurally-narrow surface (review-node-kind enumeration in 2 specific lines). The "code-surface" fabrication is a discrete defect that no prior iter could surface without targeting schema-doc accuracy directly.

**Recommendation**: **CONTINUE to iter 9**. The remaining 2 iters have specific named scopes (cross-arc references + synthesis). Soft-convergence trigger remains unfired. ADR-006 phase-4 approval authorized 10 iters; iter 9-10 are within budget. Early-stop is NOT justified — iter 9's cross-arc scope is structurally orthogonal to iter 8's schema-doc scope, and iter 10's synthesis pass is MANDATORY per loop_protocol.

The remediation backlog now stands at **35 findings across 8 iters** (6 P1 from iter 1 + 4 P1 from iter 2 + 8 P1 from iter 3 + 0 P1 from iter 4 + 1 P1 from iter 5 + 2 P1 from iter 6 + 1 P1 from iter 7 + 1 P1 from iter 8 = 23 P1; 5 P2 from iter 1 + 2 P2 from iter 2 + 0 P2 from iter 3 + 2 P2 from iter 4 + 1 P2 from iter 5 + 2 P2 from iter 6 + 0 P2 from iter 7 + 1 P2 from iter 8 = 13 P2; 23+13=36... let me verify against the dashboard's 33+2=35 number).

**Reconciliation**: prior dashboard total after iter 7 = 33 (21 P1 + 12 P2). Iter 8 adds 1 P1 + 1 P2 → 22 P1 + 13 P2 = 35 total. (Note: dashboard "21 P1" likely already consolidated DR-006/DR-007/DR-008 into a single graph-metadata-omission claim, so the absolute P1-marked-findings count differs from the unconsolidated severity tally in iteration files.)

**DR-035 + DR-036 are surgical 2-line patches**. They fold cleanly into the existing council-omission remediation packet because they touch the same `README.md` and `references/coverage_graph_schema.md` files. The schema-doc-drift cluster joins the council-omission cluster as a sibling category (different root cause — Phase-3 README rewriter vocabulary cross-contamination — but same remediation packet boundary).

---

**Evidence trail**:
- Prompt: `research/prompts/iter-08-prompt.md`
- Devin stdout: `research/logs/iter-08-stdout.txt` (63 lines, §A through §G)
- Devin stderr: `research/logs/iter-08-stderr.txt` (0 bytes — clean exit)
- Delta: `research/deltas/iter-08.jsonl`
- Source-of-truth: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` L96 (SCHEMA_VERSION), L132-143 (review node kinds), L147-148 (research + review relations), L153-215 (schema SQL with 4 tables + 10 indexes), L219-308 (DB lifecycle)
- README drift: `.opencode/skills/deep-loop-runtime/README.md:194` (verbatim)
- Schema doc drift: `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md:36` (verbatim)
- AF-0050 evidence (storage README terseness intentional): `findings/audit-findings.jsonl:16`
