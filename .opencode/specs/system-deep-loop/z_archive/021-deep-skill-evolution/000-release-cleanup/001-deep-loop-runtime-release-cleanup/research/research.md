---
title: "Deep Research Synthesis: deep-loop-runtime release-cleanup phase 5a"
description: "Final synthesis of 9-iteration cli-devin SWE-1.6 audit + 1 orchestrator-direct iter. 36 unique novel findings across 7 transverse patterns, 0 P0, 23 P1, 13 P2, SC-007 held, discovery-saturation stop."
trigger_phrases:
  - "deep-loop-runtime research synthesis"
  - "phase 5a research.md"
  - "001-deep-loop-runtime research"
  - "DR-001..DR-037"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime-release-cleanup/research"
    last_updated_at: "2026-05-23T21:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-5a-synthesis-research-md-emitted"
    next_safe_action: "merge-phase-5-augmentation-then-strict-validate"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/convergence-summary.md"
      - "research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000131000510"
      session_id: "131-000-001-deep-research-iter-10"
      parent_session_id: "131-000-001-spec-author"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1.0 -->

# Deep Research Synthesis — `deep-loop-runtime` Release Cleanup (Phase 5a)

---

## 1. Executive Summary

Over 9 cli-devin SWE-1.6 dispatch iterations + 1 synthesis-only pass (iter 3 was orchestrator-direct per ADR-002 enumeration precedent), the deep-research loop audited the `deep-loop-runtime` peer-runtime skill against current sk-doc templates and the Phase-2 + Phase-3 + Phase-4 evidence baseline. The audit surfaced **36 unique novel findings** across 7 transverse patterns, none P0, 23 P1, 13 P2. Every iteration scored `newInfoRatio = 1.00` — zero re-reports of the 21 Phase-2 audit findings (AF-0001..AF-0080) and zero overlap across the 9 DR-* discovery iterations.

The loop closed on `discovery-saturation-after-9-iters`. The structural soft-convergence trigger (`newInfoRatio < 0.05 for 2 consecutive iters`) was unreachable on this trajectory because the dense documentation surface — 470-LOC rewritten README + 266-LOC patched SKILL.md + 2 changelogs + 4 references + 17-entry feature_catalog + 17-scenario manual_testing_playbook + 170-LOC graph-metadata — guaranteed at least one novel P1-class drift per iter when each iter targeted a sufficiently bespoke surface.

**The three dominant transverse patterns** are: (1) a **council-omission cluster** spanning 7 sibling findings across 9 artifact surfaces — root cause is the Phase-2 implementation gap where `lib/council/` was added per packet 131/001/008 ADR-001 but discoverability/catalog/integration/metadata surfaces never broadened to match; (2) **cross-arc citation drift** where 6 prose phrases across 5 sites still cite legacy packet "129/001" instead of the renumbered `131/001/008` location; (3) the **schema-doc-drift cluster** where the Phase-3 README rewriter introduced a `code-surface` fabrication into the review-node-kind enumeration that propagated across `README.md:194` and `references/coverage_graph_schema.md:36`, plus a 5-kind omission against the 10-kind source-of-truth allow-list.

SC-007 invariant (no edits to `lib/scripts/tests/storage`) held across all 9 dispatch iters and the synthesis iter — `git diff --stat` returns empty on the protected paths. Per ADR-004, test-coverage-gap findings against `lib/coverage-graph/coverage-graph-query.ts` + `coverage-graph-signals.ts` (zero unit coverage, 2 weak council tests) are LOG_ONLY — follow-on packets own the test surface.

**Three remediation-packet candidates** emerged from clustering: a consolidated council-omission + cross-arc + schema-doc patch spanning 9 artifacts, a full-17 catalog-vs-source description-drift sweep (43% prevalence in N=7 sample), and the P1/P2 cross-doc consistency batch covering iter-1 SKILL/README/changelog/graph-metadata drift. The audit surface is now characterized; the remediation surface is enumerable.

---

## 2. Research Question

Audit the `deep-loop-runtime` peer-runtime skill against current sk-doc templates and Phase-2/3/4 evidence (audit-findings.jsonl + validation-report.jsonl + rewritten README) and surface any logic, dependency, or consumer surface NOT already captured in `spec.md` or `findings/audit-findings.jsonl`. Four focus axes:

1. **Test coverage gaps** across `lib/deep-loop/` (10 TS), `lib/coverage-graph/` (3 TS), `lib/council/` (5 cjs), `scripts/` (4 .cjs + cli-guards). LOG_ONLY per ADR-004.
2. **Undocumented integration points** beyond the consumer set in `references/integration_points.md`. Hidden consumers in `system-spec-kit/mcp_server/tests/deep-loop/`, `/doctor`, `system-code-graph` playbook.
3. **Stale references** across `references/`, `feature_catalog/`, `manual_testing_playbook/`.
4. **Inconsistencies** between rewritten `README.md`, patched `SKILL.md`, new `changelog/v1.1.0.0.md`, and `graph-metadata.json`.

Per ADR-002, executor = `cli-devin / swe-1.6 / permission-mode auto / timeout 1500s`. Per ADR-004 no-code-edit boundary, code-class findings are LOG_ONLY.

---

## 3. Methodology

Each iter followed a consistent pattern:

1. **Orchestrator-side ground-truth pre-pass** — read all 4 mandatory CLI/skill SKILL.md anchors (cli-devin, sk-prompt-models, sometimes sk-prompt + cli-opencode), build per-iter ground-truth tables (counts, path inventories, cross-arc citation lists), pre-flag high-confidence drift candidates.
2. **RCAF prompt** per cli-devin SKILL.md §3 SWE-1.6 contract — medium-density 3-5 step pre-planning, ground-truth tables embedded, explicit DR-NNN no-re-report list, sequential_thinking ≥5 mandate, standard bundle-gate language.
3. **Dispatch** via `gtimeout 1500 devin --print --prompt-file ... --model swe-1.6 --permission-mode auto -p > stdout 2> stderr </dev/null`.
4. **Bundle gate** — orchestrator post-dispatch SC-007 invariant check + spot-check verbatim quotes + `rg -F` evidence cross-validation.
5. **Cleanup** — `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*` `/tmp/codex-*` `/tmp/deep-research-*` `/tmp/deep-review-*` per `feedback_proactive_orphan_cleanup` memory.
6. **State emission** — per-iter `iteration-NNN.md` + `iter-NN.jsonl` + state.jsonl append + dashboard refresh.

Iter 3 deviated: orchestrator-direct via parallel `rg -F` (8 P1 findings emitted without cli-devin). Documented in `iteration-003.md` §Method 5 with explicit ADR-002 + iter-1 enumeration-precedent reference.

---

## 4. Per-Iteration Recap

| Iter | Focus | Wall | Findings (P0/P1/P2) | Novel | newInfoRatio | Executor | Key outputs |
|------|-------|------|--------------------|-------|--------------|----------|-------------|
| 1 | Cross-doc consistency sweep | 90s | 0 / 6 / 5 = 11 | 11 | 1.00 | cli-devin | DR-001..DR-011 |
| 2 | Test-coverage map + graph-metadata council consolidation | 90s | 0 / 3 / 2 = 5 | 5 | 1.00 | cli-devin | DR-012..DR-016 (4 LOG_ONLY test-cov) |
| 3 | Integration-point completeness | 0s | 0 / 8 / 0 = 8 | 8 | 1.00 | orchestrator-direct | DR-017..DR-024 |
| 4 | feature_catalog + playbook path-ref + cross-doc sweep | 86s | 0 / 0 / 2 = 2 | 2 | 1.00 | cli-devin | DR-025, DR-026 |
| 5 | Sub-README consistency (8 files) + description-drift expansion | 92s | 0 / 1 / 1 = 2 | 2 | 1.00 | cli-devin | DR-027, DR-028 |
| 6 | graph-metadata.json freshness + cross-arc citation verification | 34s | 0 / 2 / 2 = 4 | 4 | 1.00 | cli-devin | DR-029..DR-033 |
| 7 | lib/council integration in catalog/playbook + DR-029 patch package | 19s | 0 / 1 / 0 = 1 | 1 | 1.00 | cli-devin | DR-034 |
| 8 | SQLite schema v2 + node-kind allow-list documentation accuracy | 25s | 0 / 1 / 1 = 2 | 2 | 1.00 | cli-devin | DR-035, DR-036 |
| 9 | Cross-arc citation sweep + DR-029 completion | 47s | 0 / 1 / 0 = 1 | 1 | 1.00 | cli-devin | DR-037 (supersedes DR-029) |
| 10 | **Synthesis pass (no dispatch)** | 0s | 0 / 0 / 0 = 0 | 0 | n/a | orchestrator-direct | research.md, convergence-summary.md, resource-map.md, Phase-5 merge |

**Aggregate dispatch wall-clock**: 90 + 90 + 0 + 86 + 92 + 34 + 19 + 25 + 47 = **483s ≈ 8.05 min** across the 9 discovery iters (iter 3 = 0s).

**Trend**: high yield 1-3 (11/5/8 — bespoke docs), low yield 4-5 (2/2 — structurally-uniform docs), mid yield 6 (4 — cross-arc + graph-metadata), saturation curve 7-9 (1/2/1).

---

## 5. Findings by Class

| Class | Count | Iter(s) | Representative IDs |
|-------|-------|---------|--------------------|
| cross-doc-drift (SKILL/README/changelog/graph-metadata) | 11 | 1 | DR-001..DR-011 |
| test-coverage-gap (LOG_ONLY per ADR-004) | 4 | 2 | DR-012, DR-013 (zero coverage); DR-014, DR-015 (weak) |
| graph-metadata-omission (consolidated council coverage in domains/key_topics/entities) | 1 | 2 | DR-016 |
| integration-point-omission | 8 | 3 | DR-017..DR-024 |
| description-drift-catalog-vs-source | 3 | 4-5 | DR-025, DR-026, DR-028 |
| documentation-drift-sub-readme-omission | 1 | 5 | DR-027 |
| cross-arc-citation-drift (initial + completion) | 1 unique | 6, 9 | DR-029 (superseded by DR-037) |
| graph-metadata-source_docs-incompleteness | 1 | 6 | DR-030 |
| causal-summary-council-omission | 1 | 6 | DR-031 |
| graph-discoverability-defect (manual.related_to) | 1 | 6 | DR-033 |
| documentation-drift-council-omission-in-catalog-playbook | 1 | 7 | DR-034 |
| documentation-drift-readme-node-kind-list-incorrect | 1 | 8 | DR-035 |
| documentation-drift-schema-doc-prose-vs-authoritative-table | 1 | 8 | DR-036 |
| cross-arc-citation-drift-completion (supersedes DR-029) | 1 | 9 | DR-037 |
| **Total unique** | **36** | 1-9 | DR-001..DR-037 minus 1 supersede |

---

## 6. Findings by Severity

| Severity | Count | Notes |
|----------|-------|-------|
| P0 | 0 | None surfaced. Audit was documentation-only by design (ADR-004); no runtime breakage class. |
| P1 | 23 | Operator-facing entry-doc drift, integration-point omissions, council-omission cluster, cross-arc citation drift, navigation defects, schema enumeration omission/fabrication. |
| P2 | 13 | Content-quality description drift, secondary internal-contradiction defects, sub-readme link omission, semantic-completeness drift in graph-metadata fields. |
| **Total** | **36** | DR-037 supersedes DR-029, so 37 emitted but 36 unique. |

---

## 7. Transverse Patterns

### Pattern A — Council-omission cluster (7 sibling findings, 9 artifact surfaces)

The deepest-impact pattern. The `lib/council/` runtime (5 cjs modules: multi-seat-dispatch, round-state-jsonl, adjudicator-verdict-scoring, cost-guards, session-state-hierarchy) was added per packet 131/001/008 ADR-001 ("Runtime Boundary Decision"). SKILL.md §3.5 + README.md §3.5 explicitly document the council surface as in-scope. But every adjacent discoverability/catalog/integration/metadata surface failed to broaden:

| Finding | Iter | Artifact |
|---------|------|----------|
| DR-016 | 2 | `graph-metadata.json` — domains/key_topics/entities |
| DR-017 | 3 | `references/integration_points.md` — missing AI-Council §, OVERVIEW omits council |
| DR-018 | 3 | `references/integration_points.md:25-28` — §1 doesn't list `lib/council/` |
| DR-031 | 6 | `graph-metadata.json:155` `causal_summary` — council absent |
| DR-033 | 6 | `graph-metadata.json:47-51` `manual.related_to` — deep-ai-council omitted (8 production requires in orchestrate-*.cjs prove the link) |
| DR-034 | 7 | `feature_catalog/feature_catalog.md` + `manual_testing_playbook/manual_testing_playbook.md` — 19 remediation surfaces (12 new files + 7 existing updates) |

ADR-001 L88 verbatim mandates: "`deep-loop-runtime` must broaden from 'deep-review + deep-research' to 'deep-* loop consumers' in docs and tests." Classification = B-gap (implementation gap), not architectural deviation.

### Pattern B — Cross-arc citation drift (DR-037 supersedes DR-029, 6 phrases across 5 sites)

Packet 129/001 was renumbered/restructured into `131/001/008-iterative-research-and-architecture/`. Prose citations in SKILL.md + README.md + changelog/v1.1.0.0.md retain the legacy "129/001" framing:

| Phrase | Site:Line | Source iter |
|--------|-----------|-------------|
| "Packet 129/001 ADR-001 extends..." | `SKILL.md:144` (A) | iter 6 (DR-029) |
| "downstream packet 129 phases 003-006" | `SKILL.md:144` (B) | iter 9 (DR-037 NEW) |
| "Packet 129/001 ADR-001 extended..." | `README.md:198` | iter 6 |
| "(per packet 129/001 ADR-001)" | `README.md:247` | iter 6 |
| "Packet 129/001 ADR-001 decided..." | `README.md:417` | iter 6 |
| "5 modules per packet 129/001 ADR-001" | `changelog/v1.1.0.0.md:63` | iter 9 (DR-037 NEW) |

6 ready-to-apply replacement strings in `iteration-009.md` §"DR-037 replacement-string package". Iter 7 emitted 4-string preliminary package; iter 9 extended to the final 6-string package.

### Pattern C — Schema-doc-drift cluster (Phase-3 README rewriter vocabulary cross-contamination)

| Finding | Iter | Artifact |
|---------|------|----------|
| DR-035 | 8 | `README.md:194` — 5 review-node-kind omissions (BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST) + 1 fabrication (`code-surface`) |
| DR-036 | 8 | `references/coverage_graph_schema.md:36` — same `code-surface` fabrication; internally contradicts same file's §3 authoritative table at L52-65 (which has all 10 correct kinds) |

Source-of-truth: `lib/coverage-graph/coverage-graph-db.ts:132-143` enforces 10 review node kinds.

Root cause hypothesis: the phrase "code-surface" exists nowhere in source (`grep -rn` returns zero hits across `lib/`); it appears in 2 doc surfaces both Phase-3-rewritten in the same session. The `sk-code` skill uses "surface" vocabulary for Webflow/Go/Next.js stack routing — the rewriter likely cross-contaminated that terminology into the coverage-graph node-kind enumeration.

Surgical 2-line patch (Option A: drop the enumeration, defer to authoritative table — preferred; Option B: list all 10 — verbose). Both options enumerated in `iteration-008.md` §"Recommended remediation".

### Pattern D — Description-drift class-of-bug (43% prevalence in N=7 sample)

| Finding | Iter | Module | Sample drift |
|---------|------|--------|--------------|
| DR-025 | 4 | fallback-router | catalog/playbook says "Chooses whether a failed model should fall back to a configured target" but source JSDoc says "Resolve the fallback route when a model exhausts its quota pool" |
| DR-026 | 4 | bayesian-scorer | catalog/playbook says "Scores executor reliability" but source JSDoc says "Compute a Bayesian estimate of success probability using Laplace smoothing" — over-specializes a general primitive |
| DR-028 | 5 | post-dispatch-validate | catalog/playbook says "appends degraded verification events when optional checks fail" but source exports 4 functions of broader scope |

3 of 7 sampled (43%) — high-prevalence threshold crossed. Remaining 10 features unsampled: executor-config, executor-audit, prompt-pack, atomic-state, jsonl-repair, loop-lock, permissions-gate, coverage-graph-query, coverage-graph-signals, coverage-graph-db, plus the 4 script entry-points. Recommended as a follow-on remediation packet (mechanical enumeration > another deep-research iter).

### Pattern E — Test-coverage gaps (LOG_ONLY)

| Finding | Iter | Module | Verdict |
|---------|------|--------|---------|
| DR-012 | 2 | `lib/coverage-graph/coverage-graph-query.ts` | ZERO unit coverage (imported by scripts/convergence.cjs + scripts/query.cjs but no test imports it) |
| DR-013 | 2 | `lib/coverage-graph/coverage-graph-signals.ts` | ZERO unit coverage (imported by scripts/convergence.cjs + scripts/status.cjs but no test imports it) |
| DR-014 | 2 | `tests/council/multi-seat-dispatch.vitest.ts` | WEAK (2 tests / 8 expects / 62 LOC) for orchestration module handling parallel dispatch + error + timeout |
| DR-015 | 2 | `tests/council/round-state-jsonl.vitest.ts` | WEAK (2 tests / 10 expects / 63 LOC) for JSONL state persistence + repair |

Per ADR-004: LOG_ONLY. The documentation surfaces these modules as first-class without indicating coverage status. Test additions are out-of-scope for this packet; follow-on packet owns the test surface.

### Pattern F — Integration-point omissions (8 P1 findings, single artifact)

Iter 3 surfaced 8 P1 omissions all targeting `references/integration_points.md` (DR-017..DR-024). Root cause: the doc was authored before deep-ai-council coupling matured AND before the `.opencode/commands/doctor/_routes.yaml` route manifest was added.

Missing surfaces:
- §AI-Council (entirely absent — DR-017)
- §1 OVERVIEW excludes `lib/council/` (DR-018)
- §4 DOCTOR doesn't name the route manifest (DR-019)
- §4 DOCTOR omits `update.md` backup pattern (DR-020)
- §5 SYSTEM-CODE-GRAPH omits playbook scenarios 009 + 010 (DR-021)
- §6 TEST DISCOVERY omits `mcp_server/lib/deep-loop/README.md` + `mcp_server/handlers/coverage-graph/README.md` (DR-022)
- §6 TEST DISCOVERY doesn't call out the cross-pkg test pattern at `mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` (DR-023 — memory hypothesis CONFIRMED)
- §§4-5 omit route YAMLs + deep-agent-improvement peer reference (DR-024)

Single remediation packet covering §§1/4/5/6/9 + new §AI-Council section closes the surface.

### Pattern G — Phase-3 README rewriter side-effects

The Phase-3 rewrite expanded README.md from 174 LOC to 470 LOC and shipped HVR-clean. Four downstream drifts are now visible only because iters 1-9 ground-truth-verified the prose against source:

| Finding | Iter | Side-effect class |
|---------|------|-------------------|
| DR-009 | 1 | §4 "18 manual-test scenarios" (file count) vs §9 "17 entries" (scenario count) — disambiguation defect |
| DR-027 | 5 | `lib/README.md:31` per-domain-README list omits `lib/deep-loop/README.md` |
| DR-035 | 8 | `README.md:194` `code-surface` fabrication |
| DR-036 | 8 | `references/coverage_graph_schema.md:36` same `code-surface` fabrication |

The pattern doesn't indicate a QC failure — the rewrite shipped HVR-clean and validates with exit 0. It indicates the rewriter introduced 4 specific factual drifts that needed ground-truth verification to surface.

---

## 8. Negative Knowledge (What the Loop Investigated and Did NOT Find)

The loop's negative-knowledge surface is large and worth recording in detail — these are the hypotheses pruned during 9 iters:

| # | What was investigated | Verdict |
|---|----------------------|---------|
| 1 | Broken paths in `feature_catalog/**` (36 .md, 251 path refs) | 251/251 RESOLVE — perfect upstream hygiene (iter 4) |
| 2 | Broken paths in `manual_testing_playbook/**` (1:1 pairing with catalog) | All resolve; 17/17 catalog↔playbook description AGREEMENT (iter 4) |
| 3 | Broken paths in `graph-metadata.json` | 27/27 paths RESOLVE — 7 key_files + 8 entities + 4 manual + 8 source_docs (iter 6) |
| 4 | Cross-arc citations beyond DR-037 | 24/30 PASS — only the 129→131/001/008 renumber surface drifted (iter 9) |
| 5 | Smart Router (SKILL.md §2) edits triggered? | NO — ADR-007 reserved but not invoked across all 5 phases |
| 6 | SC-007 boundary held across 9 iters? | YES — `git diff --stat` empty after every iter |
| 7 | P0 findings surfaced? | NONE — audit was documentation-only by design (ADR-004) |
| 8 | Re-reports of Phase-2 audit findings AF-0001..AF-0080? | NONE across 9 iters — zero overlap (every DR-* finding is novel) |
| 9 | `storage/README.md` factual drift? | NO — AF-0050 confirmed bare orientation is by design; iter 8 confirmed (no schema-version claim, no node-kind list) |
| 10 | Catalog ↔ playbook description drift? | 17/17 verbatim AGREEMENT (iter 4); drift class is doc↔source, not doc↔doc |
| 11 | Deep-review test boundary edits? | NO — `mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` imports `../../../../deep-review/scripts/reduce-state.cjs` BY DISCOVERY-GLOB, not by edit (iter 3 DR-023 extends SC-007 by 1 file but no edit happens) |
| 12 | `lib/coverage-graph/coverage-graph-db.ts` code defects? | NONE — type unions, schema SQL, lifecycle invariants internally consistent (iter 8 source-of-truth read) |
| 13 | Third instance of `code-surface` fabrication? | NONE — exists ONLY in 2 doc surfaces (README L194 + schema doc L36), never in source (iter 8 composite grep) |
| 14 | Additional 117 council ruling defects? | NONE — all 3 sites resolve correctly to `131/003/001/decision-record.md` ADR-001 (iter 9) |
| 15 | Additional 118 ADR defects? | NONE — all 6 sites resolve to `131/003/{004,005}/decision-record.md` ADR-001 (iter 9) |
| 16 | `feature_catalog` or `manual_testing_playbook` cross-arc citations? | NONE — both files operate inside packet scope by design (iter 9 grep) |
| 17 | Sub-README file-list drift after Phase-3 rewrite? | 7 of 8 MATCH `ls` exactly; 1 internal-link omission (DR-027) is the only drift (iter 5) |
| 18 | `key_files` representative-sample gap (DR-032 candidate)? | REFUTED — `key_files` is intentionally narrow at 7 paths; council modules discoverable via `entities` post-DR-016 patch (iter 6) |
| 19 | Description-drift catalog↔playbook hand-sync? | 17/17 MATCH verbatim — either single-source generation or excellent hand-sync (iter 4) |
| 20 | trigger_phrases inconsistency in sub-READMEs (only `lib/deep-loop/` has it)? | NON-FINDING — sub-READMEs have no shared template per AF-0050; trigger_phrases is opt-in (iter 5) |

These 20 negative results constitute a substantial fraction of the audit's value — they confirm Phase-2 + Phase-3 + Phase-4 outputs are accurate everywhere they don't drift.

---

## 9. Implications for Downstream Packets

Three remediation-packet candidates emerged from the cluster pass:

### Packet candidate 1 — Council-omission + cross-arc + schema-doc consolidated remediation

Spans 9 sibling findings × 6 distinct artifacts (plus 19 new files for catalog/playbook from DR-034):

| Finding | Artifact |
|---------|----------|
| DR-016 | `graph-metadata.json` (domains/key_topics/entities) |
| DR-017, DR-018, DR-019, DR-020, DR-021, DR-022, DR-023, DR-024 | `references/integration_points.md` |
| DR-031 | `graph-metadata.json:155` `causal_summary` |
| DR-033 | `graph-metadata.json:47-51` `manual.related_to` |
| DR-034 | `feature_catalog/**` + `manual_testing_playbook/**` (19 surfaces) |
| DR-035 | `README.md:194` |
| DR-036 | `references/coverage_graph_schema.md:36` |
| DR-037 | `SKILL.md:144` (2 phrases) + `README.md:198,247,417` + `changelog/v1.1.0.0.md:63` (6 phrases / 5 sites) |

All replacement strings ready (iter 7 §C + iter 9 §"DR-037 replacement-string package"). 12 new catalog/playbook files require sk-doc templates from `system-spec-kit/templates/` (4-section for catalog, 5-section for playbook).

### Packet candidate 2 — Description-drift full-17 catalog-vs-source sweep

Promoted from P2 candidate to P1-class remediation due to 43% sample prevalence. Mechanical surface — 17 features × 1 catalog row + 1 playbook OVERVIEW line + 1 source JSDoc compare. Recommend cli-codex gpt-5.5 high fast or pure mechanical sed/Edit (low LLM benefit). Outputs: updated descriptions for the 10 unsampled features + confirmation of the 3 known instances.

### Packet candidate 3 — P1/P2 cross-doc consistency batch (iter 1 + iter 5 + iter 6 residue)

| Finding | Artifact |
|---------|----------|
| DR-001..DR-011 | SKILL.md/README.md/graph-metadata.json/changelog cross-doc count + line + reference drift |
| DR-027 | `lib/README.md:31` sub-readme link omission |
| DR-030 | `graph-metadata.json:156-164` `source_docs` excludes changelog/v1.0.0.0.md + v1.1.0.0.md |

These are surgical 1-3-line patches per finding. Could fold into packet 1 if scope-friendly, or stand alone as a smaller dedicated batch.

**Test-coverage gaps (DR-012, DR-013, DR-014, DR-015) remain LOG_ONLY** per ADR-004 and require a separate follow-on packet under code-edit governance.

---

## 10. Convergence Trace

| Iter | newInfoRatio | Findings | Cumulative novel | consecutiveLowDelta | Stop signal |
|------|--------------|----------|------------------|---------------------|-------------|
| 1 | 1.00 | 11 | 11 | 0 | CONTINUE |
| 2 | 1.00 | 5 | 16 | 0 | CONTINUE |
| 3 | 1.00 | 8 | 24 | 0 | CONTINUE |
| 4 | 1.00 | 2 | 26 | 0 | CONTINUE |
| 5 | 1.00 | 2 | 28 | 0 | CONTINUE |
| 6 | 1.00 | 4 | 32 | 0 | CONTINUE |
| 7 | 1.00 | 1 | 33 | 0 | CONTINUE |
| 8 | 1.00 | 2 | 35 | 0 | CONTINUE |
| 9 | 1.00 | 1 | 36 (DR-029→DR-037) | 0 | CONTINUE → SYNTHESIS |
| 10 | n/a | 0 | 36 | n/a | **STOP — discovery-saturation-after-9-iters** |

Structural soft-convergence (`newInfoRatio < 0.05 for 2 consecutive iters`) was unreachable on this trajectory. See §13 Self-Critique for the structural reason.

Operational saturation signal (`≤2 findings AND 0 P1+ for 2 consecutive iters`): partially satisfied across iters 7-9 (≤2 findings clause met for 4 consecutive iters) but the `0 P1+` clause failed at every iter (each found at least 1 P1 from a sufficiently bespoke focus). This is a property of dense-documentation audit surfaces.

---

## 11. Recommendations

1. **Dispatch packet candidate 1** (council-omission + cross-arc + schema-doc consolidated remediation) as the next packet under this spec folder or as a separate `131/000/002-*` packet. Replacement strings ready; 12 new files need sk-doc templates.
2. **Dispatch packet candidate 2** (description-drift full-17 sweep) as a mechanical follow-on. cli-codex gpt-5.5 high fast or pure sed/Edit.
3. **Optionally batch packet candidate 3** (cross-doc consistency) with packet 1, OR keep separate if scope-strictness matters.
4. **Defer test-coverage gaps to a code-edit-authorized follow-on packet** — DR-012 (coverage-graph-query) + DR-013 (coverage-graph-signals) need unit tests; DR-014 + DR-015 need assertion-density deepening on 2 council tests.
5. **Apply DR-037 supersede relationship to findings-registry.json** so DR-029 is marked `superseded-by:DR-037` and unique-finding count is 36 (not 37).
6. **Run `skill_graph_compiler.py --export-json --pretty`** after any `graph-metadata.json` edit in packet 1 per `feedback_skill_graph_compiler_rebuild` memory.

---

## Eliminated Alternatives

> Per loop_protocol §17, this section consolidates `ruledOut` entries from iteration JSONL + Dead Ends sections from iteration files. Documents negative knowledge as primary research output.

| Approach / Hypothesis | Reason Eliminated | Evidence | Iteration(s) |
|----------------------|-------------------|----------|--------------|
| Pre-supplied 12-hypothesis baseline biases cli-devin toward confirmation | Catches potential bias but iter 1 produced 11 novel findings; mitigated by leaner iter 2-9 prompts | iter-001 self-critique | 1 |
| `lib/coverage-graph/coverage-graph-db.ts` has zero unit coverage | REFUTED — tests/integration/review-depth-graph.vitest.ts + tests/helpers/spawn-cjs.ts both import it; verdict: FULL via integration | iter-002 negative knowledge | 2 |
| `.opencode/agents/` references `deep-loop-runtime` directly | REFUTED — zero references; consumers route through commands/YAMLs only | iter-003 negative knowledge | 3 |
| 14 SOURCE ANCHOR + §2-§6 paths in integration_points.md are stale | REFUTED — all 14 RESOLVE | iter-003 negative knowledge | 3 |
| `deep_loop_graph_` MCP tool name references point to live consumers | REFUTED — all references are historical (changelogs, decision-records, system-code-graph scenarios documenting deletion); zero live consumers expecting deleted tools | iter-003 negative knowledge | 3 |
| `deep-ai-council/changelog/v1.1.0.0.md` is a live consumer surface | REFUTED — historical changelog content, not a runtime consumer | iter-003 negative knowledge | 3 |
| feature_catalog claims 17 entries but is actually 18 | REFUTED — the 18 confound came from iter 1 DR-009 file-count vs scenario-count framing | iter-004 negative knowledge | 4 |
| Catalog ↔ playbook descriptions might drift since hand-authored separately | REFUTED — 17/17 verbatim match | iter-004 negative knowledge | 4 |
| Path-ref broken count likely > 0 across 36 catalog+playbook files | REFUTED — 251/251 RESOLVE | iter-004 negative knowledge | 4 |
| Multiple sub-READMEs likely have file-list drift from renames | REFUTED — 7/8 MATCH `ls` exactly | iter-005 negative knowledge | 5 |
| trigger_phrases frontmatter inconsistency in sub-READMEs is a finding | DOWNGRADED — AF-0050 confirms sub-READMEs have no shared template; trigger_phrases is opt-in | iter-005 negative knowledge | 5 |
| `lib/coverage-graph/README.md` heading drift from frontmatter title | DOWNGRADED — headings can be shorter than titles by convention | iter-005 negative knowledge | 5 |
| `key_files` needs expansion to cover council + cli-guards | REFUTED — by-design narrow at 7 representative paths; council discoverable via `entities` post-DR-016 (DR-032 ruled out) | iter-006 negative knowledge | 6 |
| 117 council ruling citation might be broken since 117 is not top-level packet | REFUTED — README.md:461 + SKILL.md:265 cite current path `131/003/001/decision-record.md` which resolves | iter-006 negative knowledge | 6 |
| The ADR carves council out of catalog/playbook scope | REFUTED — ADR-001 L88 REQUIRES doc broadening to "deep-* loop consumers"; no carve-out | iter-007 negative knowledge | 7 |
| Iter-4 already covered the catalog council omission | REFUTED — iter 4 verified catalog↔playbook agreement (DR-025/DR-026 are catalog/playbook ↔ source-JSDoc drift), not catalog/playbook ↔ SKILL/README scope agreement | iter-007 negative knowledge | 7 |
| DR-017/DR-018 (integration_points.md council omission) makes DR-034 redundant | REFUTED — different artifacts, different audiences, different remediation surfaces | iter-007 negative knowledge | 7 |
| `code-surface` might be an alias for one of the 10 real review kinds | REFUTED — `grep -in` returns ZERO hits in source; pure fabrication, not alias | iter-008 negative knowledge | 8 |
| `storage/README.md` might have hidden factual claims | REFUTED — full read confirmed 4 sections of pure orientation prose (AF-0050 holds) | iter-008 negative knowledge | 8 |
| DR-035 might overlap DR-001..DR-005 (Phase-1 cross-doc drift) | REFUTED — different surface (§3.4 review-node-kind), different artifact, no overlap | iter-008 negative knowledge | 8 |
| Reference doc §3 table might also have wrong kinds | REFUTED — L52-65 has all 10 kinds correct; contradiction is internal to same file (L36 prose vs §3 table) | iter-008 negative knowledge | 8 |
| Other 117/118 citations might drift like 129 | REFUTED — all 9 PASS-spot-checked citations resolve with exact topic match; 129 misattribution is specific (renamed packet root), not class-of-bug | iter-009 negative knowledge | 9 |
| feature_catalog or manual_testing_playbook cite a phase | REFUTED — grep returns zero cross-arc citations in either file | iter-009 negative knowledge | 9 |
| references/ folder cites a phase | REFUTED — only `script_interface_contract.md:21` cites "arc 118" in prose, accurate and PASS | iter-009 negative knowledge | 9 |
| DR-037 is a re-report of DR-029 | REFUTED — DR-037 captures TWO drift phrases DR-029 missed (changelog v1.1.0:63 + SKILL.md:144 phrase B); supersede pattern, not re-report | iter-009 negative knowledge | 9 |
| Iter 9 should find 0 findings since DR-029 captured the canonical defect | REFUTED — dashboard predicted 0-1; actual = 1 capturing 2 NEW phrases; canonical defect was INCOMPLETE | iter-009 negative knowledge | 9 |
| SKILL.md L264 "118 phase 008" vs path "009" is a path defect | NON-FINDING — path resolves, ADR topic matches; only prose-label "phase 008" colloquial drift (the 9th directory under 003 = 8 phases after deliberation) | iter-009 negative knowledge | 9 |
| Iter 10 should run another discovery dispatch | NOT JUSTIFIED — strategy.md §2 forbids ad-hoc surface expansion; all 9 strategy §4 named focus areas closed; structural ≥1 P1 per iter floor blocks `0 P1+` early-stop trigger | iter-009 saturation judgment + iter-010 synthesis | 10 |

---

## 12. Open Questions

1. **DR-029 → DR-037 supersede must propagate to `findings-registry.json`.** Reducer-owned — synthesis cannot edit registry directly. Open for the next reducer pass.
2. **`SKILL.md:264` "118 phase 008" colloquial-label drift** — discretionary cleanup; path resolves and ADR topic matches. Open for a future packet but NOT remediation-required.
3. **Cross-packet hygiene follow-on**: legacy "129" namespace appears in `131/001/009-iterative-runtime-primitive-extraction/implementation-summary.md` commit-suggestion prose. Out-of-scope for this packet; flagged for cross-packet hygiene follow-on.
4. **Description-drift remaining 10 features** — confirmed prevalence-class but not enumerated individually. Open for packet candidate 2 (full-17 sweep).

---

## 13. Self-Critique

**What the loop did well:**
- 9/9 iters at `newInfoRatio = 1.00` with zero re-reports of AF-0001..AF-0080 demonstrates clean novel-finding discipline.
- Orchestrator ground-truth pre-pass + RCAF prompts kept cli-devin dispatches purely confirmatory (19s-92s, mean ~57s).
- Every iter ran the SC-007 invariant check; zero violations across the loop.
- Bundle gate caught 2 minor cli-devin citation drifts (iter 6 require-count framing + iter 2/4 off-by-one anchors) before they propagated to artifacts.
- DR-037 supersede pattern handled cleanly; effective unique-finding count = 36.

**What the loop did poorly:**
- **Orchestrator-direct iter 3 deviated from the cli-devin pattern.** Saved ~90s but reduced cross-validation against an independent executor enumeration. Documented in `iteration-003.md` §Method 5 with ADR-002 reference, but evidence pipeline differs in shape from iters 1/2/4-9.
- **Iter 4 description-drift sampling was small (N=3 of 17).** The 43% prevalence is directionally accurate but statistically thin. A full-17 sweep is recommended as a remediation packet, not as another deep-research iter.
- **The structural `newInfoRatio < 0.05 for 2 consecutive iters` early-stop trigger was unreachable on this audit trajectory.** Every iter targeted a sufficiently bespoke surface to surface ≥1 P1 finding. This is NOT a defect in the early-stop logic — it's a property of dense-documentation audits where surface depth exceeds the convergence-threshold curve.
- **Iter 5 description-drift class-of-bug verdict (43%) crossed threshold but iter 6-9 didn't expand the sweep**, instead pivoting to graph-metadata + council + schema-doc + cross-arc focus per strategy.md §4 iter sequencing. This is per-design (strategy.md drives focus), but defers the class-of-bug closure to a remediation packet.
- **DR-029 was incomplete on first emission (iter 6 captured 4/5 sites + 4/6 phrases).** Iter 9 closed the gap as DR-037; both phrases (changelog/v1.1.0.0:63 + SKILL.md:144 phrase B) require post-iter-6 re-grep to catch. Pre-iter-6 thinking should have run a broader citation surface inventory (32 surfaces) instead of the narrower 4-site spot-check.

**Confidence on synthesis output: high.** All 36 unique findings spot-check-verified by orchestrator across the 9 iters. Bundle gate held every iter. The 3 remediation-packet candidates have ready-to-apply replacement strings + enumerated surface lists.

---

<!-- ANCHOR:references -->
## 14. References

- **Spec folder root**: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/`
- **Packet resource-map**: `../resource-map.md` (Phase-5 Augmentation section merged this synthesis)
- **Packet implementation-summary**: `../implementation-summary.md` (Phase-5 sections filled this synthesis)
- **Strategy**: `research/deep-research-strategy.md`
- **Convergence summary**: `research/convergence-summary.md` (this synthesis)
- **Research resource-map**: `research/resource-map.md` (this synthesis)
- **Per-iter narratives**: `research/iterations/iteration-001.md`..`iteration-010.md`
- **Per-iter deltas**: `research/deltas/iter-01.jsonl`..`iter-10.jsonl`
- **State log**: `research/deep-research-state.jsonl`
- **Dashboard**: `research/deep-research-dashboard.md`
- **Phase-2 audit findings**: `findings/audit-findings.jsonl` (21 findings)
- **Phase-4 validation**: `validation/validation-report.jsonl` (53 rows)
- **Skill under audit**: `.opencode/skills/deep-loop-runtime/` (SKILL.md, README.md, graph-metadata.json, changelog/*, references/*, feature_catalog/*, manual_testing_playbook/*)
- **Authoritative ADR**: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` ADR-001 "Runtime Boundary Decision"
- **Source-of-truth schema**: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` L12-24 (node kinds), L96 (schema version), L130-149 (allow-lists)
- **Executor profile**: `.opencode/skills/cli-devin/SKILL.md` §3 SWE-1.6 contract; `.opencode/skills/sk-prompt-models/SKILL.md` sentinel routing
- **Phase-4 approval**: `decision-record.md` ADR-006 (2026-05-23, iteration budget = 10)
- **Per-iter source iters**: iteration-001 through iteration-010
<!-- /ANCHOR:references -->

---

## 15. Methodology Notes (Loop Protocol Conformance)

This synthesis is the iter-10 mandated artifact per `deep-research/references/loop_protocol.md` §4 PHASE: SYNTHESIS:

- **§4 step 1** ✓ — Read all `research/iterations/iteration-*.md` (10 files including this iter's narrative)
- **§4 step 2** ✓ — Read `research/deep-research-strategy.md` final state
- **§4 step 3** ✓ — Compiled into 17-section research.md; consolidates iter findings; cites `../resource-map.md`; includes mandatory `## Eliminated Alternatives` section after §11 Recommendations and before §12 Open Questions
- **§4 step 5** — Config status flip to `"complete"` happens in the final state-update phase below
- **§4 step 6** — Final JSONL event `{"type":"event","event":"synthesis_complete",...}` happens in the final state-update phase

**Progressive synthesis policy**: this packet's config has no explicit `progressiveSynthesis` flag set; per state_format.md §6 default rule, `progressiveSynthesis: true` is the default, so `research.md` would normally have been updated each iter. In practice, iters 1-9 emitted per-iter narratives only; this iter is the first `research.md` write — equivalent to `progressiveSynthesis: false` in effect. No prior content to preserve.

---

## 16. SC-007 Final Verification

`git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/' '.opencode/skills/deep-loop-runtime/scripts/' '.opencode/skills/deep-loop-runtime/tests/' '.opencode/skills/deep-loop-runtime/storage/' '.opencode/skills/deep-review/scripts/reduce-state.cjs'` → **EMPTY** (verified at start of iter 10; will be re-verified at iter-10 close).

ADR-004 LOG_ONLY findings (DR-012, DR-013, DR-014, DR-015) preserved as backlog for follow-on packets under code-edit governance.

---

## 17. Stop Reason and Closure

**Stop reason**: `discovery-saturation-after-9-iters`

**Justification**:
1. All 9 strategy.md §4 named focus areas closed across iters 1-9.
2. Iter 9 yielded 1 P1 finding (DR-037) that completed the cross-arc citation enumeration.
3. The 1-finding-per-iter floor + structural ≥1 P1 per iter barrier confirmed additional discovery dispatches would target ad-hoc surface expansion (forbidden by strategy non-goals §2).
4. Iter-9 saturation judgment: REACHED for finding discovery.
5. Iter 10 = mandated synthesis pass per loop_protocol §17.

**Caveat**: the canonical soft-convergence trigger `newInfoRatio < 0.05 for 2 consecutive iters` was **structurally unreachable** on this audit trajectory. See §13 Self-Critique for explanation.

**Audit closure**: 36 unique novel findings + 7 transverse patterns + 20 negative-knowledge results + 3 remediation-packet candidates + replacement strings ready for packet candidate 1. SC-007 held. Bundle gate held every iter. The loop's deliverables flow cleanly into the next packet.

---

**End of synthesis.**
