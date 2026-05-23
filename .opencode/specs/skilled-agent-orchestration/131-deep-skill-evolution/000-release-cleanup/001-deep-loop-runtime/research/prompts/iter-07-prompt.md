# Iteration 7 — Council integration in feature_catalog + manual_testing_playbook + DR-029 path resolution

**Spec folder**: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/` (pre-approved, skip Gate 3)
**Framework**: RCAF (Role / Context / Action / Format) per cli-devin SKILL.md §3 SWE-1.6 contract
**Iteration**: 7 of 10 — prior trail [11, 5, 8, 2, 2, 4] @ newInfoRatio = [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]
**Bundle-gate language**: standard (do NOT tighten; SWE-1.6 over-tightens defensively)

---

## R — ROLE

You are a **catalog/playbook completeness auditor** verifying whether `lib/council/` (5 cjs modules added per 131/001/008 ADR-001 Runtime Boundary Decision) is surfaced in the `deep-loop-runtime/feature_catalog/` + `deep-loop-runtime/manual_testing_playbook/` documentation set. The SKILL.md (§3.5 lines 142-153) and README.md (§3.5 lines 196-208 + L79 feature row + L247 file-tree + L417 FAQ) explicitly document council primitives as in-scope of this skill. The orchestrator has already verified the catalog/playbook structurally exclude council (7 domains × 17 features; zero `council` grep hits in either index doc).

Your job is to:
1. **PRIMARY**: classify the council omission as either a **DOCUMENTED ARCHITECTURAL DEVIATION** (intentional, with an ADR carve-out) or a **DOCUMENTATION GAP** (unintentional, missed during 131/001/008 phase 002 implementation).
2. **PRIMARY**: emit a P1 finding (DR-034) if it's a gap, with full enumeration of the missing surface (5 catalog entries + 5 playbook scenarios + coverage-table row + count-claim updates).
3. **SECONDARY**: package the DR-029 cross-arc citation correction (4 sites in SKILL.md + README.md) as a ready-to-apply patch (DR-029 was emitted in iter 6 as the finding — iter 7 packages the FIX strings).

You are dispatched by an orchestrator that has already verified:

- `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` exists and contains ADR-001 "Runtime Boundary Decision" with the answer `"Extend deep-loop-runtime rather than create a peer council-runtime."`
- ADR-001 negative consequence (verbatim, decision-record.md L88): **"`deep-loop-runtime` must broaden from 'deep-review + deep-research' to 'deep-* loop consumers' in docs and tests."**
- feature_catalog has 7 domain folders (01--executor through 07--script-entry-points), NO 08--council folder.
- manual_testing_playbook has 7 domain folders (01--executor through 07--script-entry-points), NO 08--council folder.
- feature_catalog.md L31 + L33-41 explicitly enumerates: "The 17 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-review, deep-research, `/doctor`, and adjacent validation docs." Coverage table sums 3+1+1+4+1+3+4 = 17.
- manual_testing_playbook.md L47: "This playbook provides 17 deterministic scenarios across 7 categories validating the current `deep-loop-runtime` skill surface."
- Zero grep hits for `"council"` in either index doc (`grep -n "council" feature_catalog.md manual_testing_playbook.md` returned empty).

---

## C — CONTEXT

### C.1 — Council module surface (per SKILL.md §3.5 + README.md §3.5)

| # | Module path | Purpose summary |
|---|-------------|-----------------|
| 1 | `lib/council/multi-seat-dispatch.cjs` | Runs seat executors in parallel for one council round, preserves seat result order, returns fulfilled/rejected per-seat outcomes + round summary counts |
| 2 | `lib/council/round-state-jsonl.cjs` | Per-round JSONL records with lock-file single-writer guard, JSONL repair before append, fsync on write |
| 3 | `lib/council/adjudicator-verdict-scoring.cjs` | Scores Round-N → Round-N+1 verdict deltas using ADR-003 weights (option change, confidence delta, material-risk Jaccard delta, axis flip rate, blocking-disagreement delta) |
| 4 | `lib/council/cost-guards.cjs` | Enforces ADR-004 defaults for `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold`, `seats_per_round` |
| 5 | `lib/council/session-state-hierarchy.cjs` | Creates and validates the ADR-002 session→topic→round state shape with stable `topic-NNN-slug` + `round-NNN` ids |

These have paired vitest files at `tests/council/*.vitest.ts` (5 files, confirmed by iter 2 DR-012..DR-015 evidence — multi-seat-dispatch.vitest.ts + round-state-jsonl.vitest.ts both have WEAK coverage per DR-014/DR-015; the other 3 have FULL coverage).

### C.2 — Catalog/playbook structure (orchestrator pre-verified)

```text
feature_catalog/
├── feature_catalog.md          # claims "17 entries" at L31; lists 7 domains in coverage table L33-41
├── 01--executor/               # 3 features (executor-config, executor-audit, fallback-router)
├── 02--prompt-rendering/       # 1 feature (prompt-pack)
├── 03--validation/             # 1 feature (post-dispatch-validate)
├── 04--state-safety/           # 4 features (atomic-state, jsonl-repair, loop-lock, permissions-gate)
├── 05--scoring/                # 1 feature (bayesian-scorer)
├── 06--coverage-graph/         # 3 features (coverage-graph-db, coverage-graph-query, coverage-graph-signals)
└── 07--script-entry-points/    # 4 features (convergence, upsert, query, status)
                                # NO 08--council/

manual_testing_playbook/
├── manual_testing_playbook.md  # claims "17 deterministic scenarios across 7 categories" at L47
├── 01--executor/               # 3 scenarios (001..003)
├── 02--prompt-rendering/       # 1 scenario (004)
├── 03--validation/             # 1 scenario (005)
├── 04--state-safety/           # 4 scenarios (006..009)
├── 05--scoring/                # 1 scenario (010)
├── 06--coverage-graph/         # 3 scenarios (011..013)
└── 07--script-entry-points/    # 4 scenarios (014..017)
                                # NO 08--council/
```

### C.3 — Prior iter coverage of council omissions (do NOT re-report)

| Finding ID | Iter | Where the council gap was captured | Why iter 7 is NOT a re-report |
|------------|------|-----------------------------------|------------------------------|
| DR-016 | 2 | `graph-metadata.json` `domains`/`key_topics`/`entities` missing council — consolidated patch | DR-016's surface is graph-metadata.json fields, NOT catalog/playbook content |
| DR-017 | 3 | `references/integration_points.md` no AI-Council section | DR-017's surface is integration_points.md (a different reference doc) |
| DR-018 | 3 | `references/integration_points.md:25-28` §1 OVERVIEW omits `lib/council/` | Same — integration_points.md, NOT catalog/playbook |
| DR-027 | 5 | `lib/README.md:31` per-domain README list omits lib/deep-loop/README.md | Sub-README internal list — different artifact |
| DR-031 | 6 | `graph-metadata.json:155` causal_summary doesn't mention council | Same — graph-metadata.json field, NOT catalog/playbook |
| DR-033 | 6 | `graph-metadata.json:47-51` manual.related_to omits deep-ai-council | Same — graph-metadata.json field, NOT catalog/playbook |

**Iter 7 covers a DIFFERENT artifact surface** (feature_catalog.md + manual_testing_playbook.md root docs + missing 08--council/ subdirectories). The catalog/playbook gap has been ANTICIPATED by prior iters but not directly emitted as a finding.

### C.4 — ADR-001 evidence (the central architecture-vs-gap question)

Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` ADR-001 Lines 40-119. Key evidence:

- **Decision (L60-75)**: "Extend `deep-loop-runtime/lib/` with narrowly scoped council-compatible infrastructure adapters, and keep domain semantics in `deep-ai-council`."
- **Negative consequence (L88, VERBATIM)**: "`deep-loop-runtime` must broaden from 'deep-review + deep-research' to 'deep-* loop consumers' in docs and tests."
- **No mention** of carving council OUT of catalog/playbook documentation.
- **No mention** of catalog/playbook being deep-review/deep-research-only scope.

This means the ADR DIRECTLY MANDATES the docs broaden to include council. The catalog/playbook stuck at the pre-ADR 7-domain shape is a phase-002 implementation gap, not an architectural deviation.

### C.5 — DR-029 cross-arc citation correction (secondary focus)

DR-029 (iter 6) found 4 sites in SKILL.md + README.md citing the non-existent "Packet 129/001 ADR-001":
- `SKILL.md:144` — "Packet 129/001 ADR-001 extends `deep-loop-runtime/lib/` with council-compatible infrastructure primitives..."
- `README.md:198` — "Packet 129/001 ADR-001 extended this skill with council-compatible runtime primitives..."
- `README.md:247` — "│   └── council/                          # 5 cjs modules (per packet 129/001 ADR-001)"
- `README.md:417` — "Packet 129/001 ADR-001 decided that durability primitives..."

The ORCHESTRATOR HAS VERIFIED the corrected path resolves:
`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` ADR-001 "Runtime Boundary Decision".

### C.6 — Boundaries

- **SC-007 invariant**: no edits to `lib/`, `scripts/`, `tests/`, `storage/` of `deep-loop-runtime/`
- **iter-3 DR-023 boundary**: no edits to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`
- **ADR-004 LOG_ONLY**: code-class findings are LOG_ONLY; surface them but don't propose code fixes inside this packet
- **NO file edits**: emit findings markdown ONLY. The remediation packet applies actual fixes later.

---

## A — ACTION

Perform a **3-step audit pass** with sequential_thinking MCP enforcement (≥5 thoughts before output).

### STEP 1 — Classify the council omission (PRIMARY)

Read these files (orchestrator did not pre-pipe them — devin must read directly to ground the classification):

1. `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` lines 40-120 (ADR-001 Runtime Boundary Decision — full text).
2. `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md` lines 1-50 (claim "17 entries" + coverage table + scope statement).
3. `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md` lines 1-50 (claim "17 scenarios across 7 categories").
4. `.opencode/skills/deep-loop-runtime/SKILL.md` lines 142-153 (§3.5 Council Primitives).
5. `.opencode/skills/deep-loop-runtime/README.md` lines 196-208 (§3.5) and lines 75-85 (feature summary table that includes 🏛️ Council primitives at L79).

**Classify** the catalog/playbook omission of council as:
- **(A) DOCUMENTED ARCHITECTURAL DEVIATION**: ADR explicitly excludes council from catalog/playbook scope.
- **(B) DOCUMENTATION GAP**: ADR mandates docs broaden but catalog/playbook were not updated.
- **(C) PARTIAL**: ADR is silent on catalog/playbook specifically; arguable both ways.

Cite specific ADR lines for your classification. Then:
- IF (A): emit NO finding for catalog/playbook; recommend strategy.md update to record the carve-out.
- IF (B) or (C): emit ONE finding **DR-034 (P1, documentation-drift-council-omission-in-catalog-playbook)** with full enumeration.

For the finding, enumerate the missing surface:
1. Missing catalog domain folder: `feature_catalog/08--council/`
2. Missing 5 catalog entries: `08--council/01-multi-seat-dispatch.md` through `05-session-state-hierarchy.md`
3. Missing playbook domain folder: `manual_testing_playbook/08--council/`
4. Missing 5 playbook scenarios: `08--council/018-multi-seat-dispatch.md` through `022-session-state-hierarchy.md` (continuing the 001-017 numbering)
5. feature_catalog.md updates: TOC entry (currently 8 entries 1-8 — need 9; currently L25 ends at "8. SCRIPT ENTRY POINTS"); coverage table L33-41 needs new row; scope statement L31 needs "council" appended; count "17 entries" → "22 entries"
6. manual_testing_playbook.md updates: TOC L27-41 needs §13 COUNCIL inserted before §13 AUTOMATED TEST CROSS-REFERENCE (would shift section numbers); L47 "17 deterministic scenarios across 7 categories" → "22 deterministic scenarios across 8 categories"; cross-reference index in §14 needs 5 new rows

### STEP 2 — Package DR-029 correction patch (SECONDARY)

DR-029 was emitted in iter 6 as the finding. Iter 7 packages the REPLACEMENT STRINGS so the remediation packet has actionable patch text. Read the 4 sites:

```bash
sed -n '142,146p' .opencode/skills/deep-loop-runtime/SKILL.md
sed -n '196,200p' .opencode/skills/deep-loop-runtime/README.md
sed -n '245,249p' .opencode/skills/deep-loop-runtime/README.md
sed -n '415,418p' .opencode/skills/deep-loop-runtime/README.md
```

For each site, produce:
- **CURRENT** (verbatim quote, 1 line)
- **REPLACEMENT** (replace "Packet 129/001 ADR-001" with "Packet 131/001/008 ADR-001" — the short form, since the full path is too verbose for inline prose)
- One-line rationale: why the short form (not the full path)

This is NOT a new finding (DR-029 already exists). It's a **recommended_fix package** appended to DR-029 for the remediation packet.

### STEP 3 — Negative-knowledge verification (DEFENSIVE)

Verify that DR-034 candidate is NOT a re-report of DR-016/DR-017/DR-018/DR-031/DR-033:

- DR-016: surface = graph-metadata.json fields (domains/key_topics/entities) → NOT catalog/playbook.
- DR-017: surface = integration_points.md missing AI-Council section → NOT catalog/playbook.
- DR-018: surface = integration_points.md §1 OVERVIEW missing lib/council/ → NOT catalog/playbook.
- DR-031: surface = graph-metadata.json causal_summary → NOT catalog/playbook.
- DR-033: surface = graph-metadata.json manual.related_to → NOT catalog/playbook.

If DR-034 is truly novel at the catalog/playbook surface, mark it NOVEL. If it overlaps any prior DR, mark it `consolidated-with-DR-NNN` and skip.

---

## F — FORMAT

Emit a markdown report with the following exact structure:

```markdown
## §A — ADR classification (STEP 1)

**Classification**: A / B / C (one letter)

**Cited evidence** (verbatim from decision-record.md ADR-001):
- L60-75 (Decision): "<quote>"
- L88 (Negative consequence): "<quote>"
- L<other>: "<other quote if relevant>"

**Verdict**: <one sentence explanation>

**Finding emitted**: DR-034 (P1, documentation-drift-council-omission-in-catalog-playbook) — OR — NO FINDING if classification = A

## §B — DR-034 enumeration (if applicable)

| # | Missing surface | Path | Notes |
|---|----------------|------|-------|
| 1 | Catalog domain folder | `feature_catalog/08--council/` | New folder |
| 2 | Catalog entry 1 | `feature_catalog/08--council/01-multi-seat-dispatch.md` | New file |
| 3 | Catalog entry 2 | `feature_catalog/08--council/02-round-state-jsonl.md` | New file |
| 4 | Catalog entry 3 | `feature_catalog/08--council/03-adjudicator-verdict-scoring.md` | New file |
| 5 | Catalog entry 4 | `feature_catalog/08--council/04-cost-guards.md` | New file |
| 6 | Catalog entry 5 | `feature_catalog/08--council/05-session-state-hierarchy.md` | New file |
| 7 | Playbook domain folder | `manual_testing_playbook/08--council/` | New folder |
| 8 | Playbook scenario 1 | `manual_testing_playbook/08--council/018-multi-seat-dispatch.md` | New file |
| 9 | Playbook scenario 2 | `manual_testing_playbook/08--council/019-round-state-jsonl.md` | New file |
| 10 | Playbook scenario 3 | `manual_testing_playbook/08--council/020-adjudicator-verdict-scoring.md` | New file |
| 11 | Playbook scenario 4 | `manual_testing_playbook/08--council/021-cost-guards.md` | New file |
| 12 | Playbook scenario 5 | `manual_testing_playbook/08--council/022-session-state-hierarchy.md` | New file |
| 13 | catalog.md TOC | `feature_catalog.md:18-25` | Add "9. COUNCIL" entry |
| 14 | catalog.md coverage table | `feature_catalog.md:33-41` | Add `08--council` row |
| 15 | catalog.md scope statement | `feature_catalog.md:31` | Append "council" to consumer list |
| 16 | catalog.md count claim | `feature_catalog.md:31` | "17 entries" → "22 entries" |
| 17 | playbook.md TOC | `manual_testing_playbook.md:27-41` | Add §13 COUNCIL before existing §13 |
| 18 | playbook.md scope claim | `manual_testing_playbook.md:47` | "17 deterministic scenarios across 7 categories" → "22 across 8" |
| 19 | playbook.md cross-ref index | `manual_testing_playbook.md` §14 cross-reference index | Add 5 new rows |

## §C — DR-029 replacement-string package (STEP 2)

| # | File:Line | CURRENT (verbatim) | REPLACEMENT | Rationale |
|---|-----------|--------------------|-------------|-----------|
| 1 | SKILL.md:144 | "Packet 129/001 ADR-001 extends..." | "Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extends..." | Short form preserves prose readability |
| 2 | README.md:198 | "Packet 129/001 ADR-001 extended..." | "Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extended..." | Same |
| 3 | README.md:247 | "│   └── council/                          # 5 cjs modules (per packet 129/001 ADR-001)" | "│   └── council/                          # 5 cjs modules (per packet 131/001/008 ADR-001)" | File-tree comment, keep short |
| 4 | README.md:417 | "Packet 129/001 ADR-001 decided..." | "Packet 131/001/008 ADR-001 (Runtime Boundary Decision) decided..." | Same |

**Full canonical path** (for the eventual remediation packet's commit message or for any new "see-also" link):
`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md#adr-001`

## §D — Negative knowledge / non-finding verification (STEP 3)

| Prior finding | Surface | Iter-7 surface | Overlap? |
|---------------|---------|----------------|----------|
| DR-016 | graph-metadata.json (domains/key_topics/entities) | feature_catalog.md + manual_testing_playbook.md (content) | NO |
| DR-017 | integration_points.md (AI-Council section) | catalog/playbook (council domain) | NO |
| DR-018 | integration_points.md §1 (lib/council/ omitted) | catalog/playbook scope statement | NO |
| DR-031 | graph-metadata.json causal_summary | catalog/playbook overview docs | NO |
| DR-033 | graph-metadata.json manual.related_to | catalog/playbook cross-reference | NO |

**Verdict**: DR-034 is NOVEL at the catalog/playbook content surface.

## §E — Totals

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 (DR-034) or 0 (if classification=A) |
| P2 | 0 |
| **Total** | **1** or **0** |

**newInfoRatio**: 1.00 (DR-034 is novel) — OR — special case if classification=A: 0.00 with explicit "no-finding" justification.

## §F — Verdict

GAP / DEVIATION / PARTIAL (matching §A classification A/B/C with the appropriate label).
```

---

## Constraints

1. **NEVER edit any file inside `.opencode/skills/deep-loop-runtime/lib/`, `scripts/`, `tests/`, `storage/`** (SC-007 invariant).
2. **NEVER edit `.opencode/skills/system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`** (iter-3 DR-023 boundary).
3. **NEVER edit ANY file in this iteration** — emit findings markdown to stdout only. The remediation packet applies actual fixes later.
4. **Use sequential_thinking MCP** with ≥5 thoughts before producing structured output.
5. **DO NOT re-report DR-001..DR-033 or AF-0001..AF-0080**. If a candidate overlaps a prior DR, mark `consolidated-with-DR-NNN` and skip.
6. **Bundle gate**: keep grep/exec verification commands at standard density; do not embed multiple `verify | rg | wc` chains that push SWE-1.6 toward defensive output.
7. **Honest non-findings**: if §A classifies as DOCUMENTED ARCHITECTURAL DEVIATION (A), emit NO finding even though the prompt anticipated DR-034. Cite the ADR line that justifies the deviation.

Begin with sequential_thinking, then proceed step-by-step.
