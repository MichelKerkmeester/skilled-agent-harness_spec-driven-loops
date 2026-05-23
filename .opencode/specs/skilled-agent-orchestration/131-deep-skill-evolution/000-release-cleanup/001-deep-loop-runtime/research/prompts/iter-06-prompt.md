# Iteration 6 — graph-metadata.json freshness audit + cross-arc citation verification

**Spec folder**: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/` (pre-approved, skip Gate 3)
**Framework**: RCAF (Role / Context / Action / Format) per cli-devin SKILL.md §3 SWE-1.6 contract
**Iteration**: 6 of 10 — prior trail [11, 5, 8, 2, 2] @ newInfoRatio = [1.00, 1.00, 1.00, 1.00, 1.00]
**Target file**: `.opencode/skills/deep-loop-runtime/graph-metadata.json` (170 LOC)
**Bundle-gate language**: standard (do NOT tighten; SWE-1.6 over-tightens defensively)

---

## R — ROLE

You are a **documentation-freshness auditor** verifying that `graph-metadata.json` accurately reflects the current state of the `deep-loop-runtime` skill after Phase 3 README rewrite + Phase 2 SKILL.md surgical edits. Your job is to find NOVEL drift NOT already captured in DR-001..DR-028.

You are dispatched by an orchestrator that has already performed deterministic `ls -f` checks on every path in `key_files`, `entities.path`, `source_docs`, and `manual.depends_on`/`related_to`. The orchestrator confirmed:

- All 7 `key_files` paths resolve ✓
- All 8 `entities.path` paths resolve ✓
- All 4 `manual.depends_on` + `related_to` skill folders resolve ✓
- All 8 `source_docs` filename references resolve ✓
- 7 of 7 unique paths in graph-metadata.json are filesystem-present.

Your value-add is verifying **semantic freshness**, NOT filesystem resolution. Look for:

1. **Cross-arc references in the SKILL.md/README.md prose that are NEAR graph-metadata fields** — the file does NOT cite arcs directly, but the `causal_summary` (L155) mentions "the 118 FULL_ISOLATE_NO_MCP arc" and operator-facing prose elsewhere cites "Packet 129/001 ADR-001". Verify whether those arc citations resolve.
2. **Field completeness**: per iter-2 DR-016, `domains` is missing "council"; `key_topics` is missing 5 council module names; `entities` is missing 5 council entities + `cli-guards.cjs`. ASSUME DR-016 is the consolidated patch — DO NOT re-report DR-016. But verify whether any NEW omissions exist beyond DR-016 (e.g. `storage/README.md`, `scripts/lib/cli-guards.cjs` already in DR-016 scope, `changelog/v1.1.0.0.md` missing from `source_docs`).
3. **Metadata-vs-prose consistency**: does the `causal_summary` accurately describe the skill's current scope, or does it under-represent the council surface added in 129/001?
4. **last_updated_at staleness**: iter-1 DR-005 covered this; DO NOT re-report.

---

## C — CONTEXT

### C.1 — Ground-truth path resolution table (orchestrator pre-verified)

| graph-metadata.json field | Entries | Resolve | Findings |
|---------------------------|---------|---------|----------|
| `manual.depends_on` (L44-46) | 1 | 1/1 OK | none |
| `manual.related_to` (L47-51) | 3 | 3/3 OK | none |
| `domains` (L53-61) | 7 (runtime, deep-loop, coverage-graph, convergence, executor, state-safety, script-entry-points) | n/a (categorical) | **DR-016 covers missing "council"** |
| `derived.trigger_phrases` (L72-77) | 6 | n/a | low-risk |
| `derived.key_topics` (L79-95) | 15 (executor-config, prompt-pack, post-dispatch-validate, atomic-state, jsonl-repair, loop-lock, permissions-gate, bayesian-scorer, fallback-router, coverage-graph-{db,query,signals}, script-entry-points, executor-audit, deep-loop-runtime) | n/a | **DR-016 covers missing 5 council topics** |
| `derived.key_files` (L96-104) | 7 paths | **7/7 OK** | possibly under-sampled; verify if narrow-by-design |
| `derived.entities` (L105-154) | 9 (deep-loop-runtime, coverage-graph, deep-review, deep-research, convergence.cjs, upsert.cjs, query.cjs, status.cjs) | **8/8 unique paths OK** (1 duplicate path with deep-loop-runtime SKILL.md) | **DR-016 covers missing 5 council entities + cli-guards.cjs** |
| `derived.source_docs` (L156-164) | 8 filenames | **8/8 OK** | possibly missing `changelog/v1.1.0.0.md` |
| `derived.causal_summary` (L155) | 1 paragraph | n/a | verify scope accuracy |
| `derived.created_at` + `last_updated_at` (L166-167) | timestamps | **stale per DR-005** | DO NOT RE-REPORT |

### C.2 — Cross-arc citation map (orchestrator pre-verified)

| Citation | Document:Line | Resolve | Status |
|----------|---------------|---------|--------|
| `131-deep-skill-evolution/spec.md` | SKILL.md:261 | OK | PASS |
| `131/003-deep-loop-runtime/004-script-shim-db-relocation/decision-record.md` | README.md:459 | OK (file exists) | PASS |
| `131/003-deep-loop-runtime/005-mcp-tool-surface-removal/decision-record.md` | README.md:460 | OK (file exists) | PASS |
| `131/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` | README.md:461 + SKILL.md:265 | OK (file exists) | PASS |
| `131/003-deep-loop-runtime/008-test-migration` | SKILL.md:n/a, README.md:n/a | OK (folder exists) | n/a |
| **"Packet 129/001 ADR-001"** | SKILL.md:144, README.md:198, README.md:247, README.md:417 | **PACKET 129 DOES NOT EXIST** | **CRITICAL DRIFT** |

**Resolution research**: "129/001 ADR-001" appears to be the legacy packet ID for what is now at `131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` ADR-001 "Runtime Boundary Decision: Extend deep-loop-runtime rather than create a peer council-runtime". The continuity frontmatter of that file confirms: `recent_action: "129/001 architecture research complete, 5 ADRs authored, 002-006 scaffolded"`. The packet was renumbered/restructured from 129 → 131/001-ai-council/008.

### C.3 — Prior iter findings rollup (do NOT re-report)

- DR-001..DR-011 (iter 1): cross-doc consistency
- DR-012..DR-016 (iter 2): test-coverage gaps + graph-metadata council omission (DR-016 = consolidated patch for council additions to domains/key_topics/entities)
- DR-017..DR-024 (iter 3): integration_points.md omissions
- DR-025..DR-026 (iter 4): description-drift catalog-vs-source
- DR-027..DR-028 (iter 5): sub-README + post-dispatch-validate description drift

### C.4 — Boundaries

- **SC-007 invariant**: no edits to `lib/`, `scripts/`, `tests/`, `storage/` of `deep-loop-runtime/`
- **iter-3 DR-023 boundary**: no edits to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`
- **ADR-004 LOG_ONLY**: code-class findings are LOG_ONLY, surface them but don't propose code fixes inside this packet
- **Avoid double-reporting**: DR-016 captured council additions to graph-metadata; DR-005 captured `last_updated_at` staleness. Find genuinely NEW gaps.

---

## A — ACTION

Perform a **3-step audit pass** with sequential_thinking MCP enforcement (≥5 thoughts before output):

### STEP 1 — Cross-arc citation drift (PRIMARY focus)

Read SKILL.md L144 + README.md L198, L247, L417. For each "Packet 129/001 ADR-001" citation:

- **Acceptance**: confirm the citation references a packet that DOES NOT EXIST at the cited path (`.opencode/specs/skilled-agent-orchestration/129*` returns no matches).
- **Resolve**: confirm the equivalent ADR exists at `131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` ADR-001 "Runtime Boundary Decision" (verify by reading L40-50 of that file).
- **Emit**: ONE consolidated P1 finding (DR-029) with all 4 citation sites + the correct path for remediation.

### STEP 2 — graph-metadata.json field completeness (verify novel gaps)

Beyond DR-016 (already-known council omissions):

a. Does `source_docs` (L156-164) include `changelog/v1.0.0.0.md` or `changelog/v1.1.0.0.md`? Check what's currently listed (orchestrator already counted 8: SKILL.md, README.md, feature_catalog.md, manual_testing_playbook.md, 4 references/). Changelog files are NOT in `source_docs`. Is this a defect for graph-discoverability of the changelog?
   - **Acceptance**: emit a P2 finding (DR-030) IF you judge changelog files SHOULD be in `source_docs` for memory-MCP discoverability. SKIP if you judge `source_docs` is intentionally restricted to non-changelog operational docs.

b. Does `causal_summary` (L155) accurately scope the skill's current state? It mentions "executor configuration, audit provenance, prompt rendering, post-dispatch validation, state safety, Bayesian scoring, fallback routing, coverage-graph storage/query/signals, script entry points, SQLite storage, and runtime tests" — does it mention the council surface (5 cjs modules added in 129/001)?
   - **Acceptance**: if causal_summary misses the council surface, that's a P2 finding (DR-031) — semantic under-representation of the current scope. If it's covered by DR-016's domains gap consolidation, SKIP as duplicate.

c. Does the `key_files` array (L96-104) reflect representative paths from the council surface (5 cjs modules added 129/001) and the cli-guards.cjs script? Currently shows 7 paths: 2 docs + 2 lib/deep-loop + 1 lib/coverage-graph + 1 script + 1 storage + 1 test. Missing: lib/council/* (5 modules), scripts/lib/cli-guards.cjs.
   - **Acceptance**: emit a P2 finding (DR-032) IF DR-016 didn't already cover `key_files` (DR-016 covered `entities`, `key_topics`, `domains` — verify by reading DR-016 in delta iter-02). DR-016's recommended_patch likely DOES NOT touch `key_files`. So `key_files` representative-sample gap is genuinely novel.

### STEP 3 — `manual.related_to` currency (secondary focus)

`manual.related_to` lists 3 skills: deep-review, deep-research, system-code-graph (L47-51).

- **Acceptance**: confirm each is a current, non-archived peer skill. ALSO verify there's no missing related skill given the 129/001 council primitive extraction — should `deep-ai-council` be in `manual.related_to`?
- **Resolve**: read `.opencode/skills/deep-ai-council/SKILL.md` head to confirm it exists and consumes deep-loop-runtime council primitives. If yes, missing `deep-ai-council` in `manual.related_to` is a P1 finding (DR-033) — graph-discoverability defect.

---

## F — FORMAT

Emit a markdown report with the following exact structure:

```markdown
## §A — Cross-arc citation drift (STEP 1)

| Site | File:Line | Citation text | Resolves? | Recommended fix |
|------|-----------|---------------|-----------|------------------|
| 1 | SKILL.md:144 | "Packet 129/001 ADR-001 extends..." | NO | replace with `131-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md ADR-001` |
| 2 | README.md:198 | ... | NO | ... |
| 3 | README.md:247 | ... | NO | ... |
| 4 | README.md:417 | ... | NO | ... |

**Verdict**: DRIFT / NOT-DRIFT
**Finding emitted**: DR-029 (P1, cross-arc-citation-drift)

## §B — graph-metadata.json field completeness (STEP 2)

Per-field verdict:
- `source_docs` changelog inclusion: MATCH / DRIFT (verdict)
- `causal_summary` council surface: MATCH / DRIFT (verdict)
- `key_files` representative-sample: MATCH / DRIFT (verdict)

**Findings emitted**: DR-030 / DR-031 / DR-032 (subset)

## §C — manual.related_to currency (STEP 3)

| Listed skill | Current? | Justification |
|--------------|----------|---------------|
| deep-review | YES | ... |
| deep-research | YES | ... |
| system-code-graph | YES/NO | ... |

**Missing**: deep-ai-council (justify)
**Finding emitted**: DR-033 (P1, graph-discoverability-defect)

## §D — Totals

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | N |
| P2 | N |
| **Total** | **N** |

**newInfoRatio**: 1.00 if all findings genuinely novel (DR-029+).

## §E — Recommended JSON patch

(Single JSON patch object showing additions/removals to graph-metadata.json, plus replacement strings for the "129/001" → "131/001/008" prose drift.)

## §F — Verdict

PASS / FAIL / PARTIAL per the 7 graph-metadata.json field groups verified.
```

---

## ⚠️ Constraints

1. **NEVER edit any file inside `.opencode/skills/deep-loop-runtime/lib/`, `scripts/`, `tests/`, `storage/`** (SC-007 invariant).
2. **NEVER edit `.opencode/skills/system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`** (iter-3 DR-023 boundary).
3. **Emit findings ONLY as DR-NNN markdown — DO NOT write to graph-metadata.json directly** (LOG_ONLY per ADR-004; this audit packet emits findings for a follow-on remediation packet to apply).
4. **Use sequential_thinking MCP** with ≥5 thoughts before producing structured output.
5. **DO NOT re-report DR-001..DR-028 or AF-0001..AF-0080**. If a finding overlaps a prior DR-NNN, mark it as `consolidated-with-DR-NNN` and skip.
6. **Bundle gate**: keep grep/exec verification commands at standard density; do not embed multiple `verify | rg | wc` chains that push SWE-1.6 toward defensive output.
7. **Honest non-findings**: if §B step-2c (key_files representative sample) is judged "by-design narrow", report MATCH and explain why; do not invent a P2.

Begin with sequential_thinking, then proceed step-by-step.
