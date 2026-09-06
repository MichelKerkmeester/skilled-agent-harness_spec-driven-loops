---
title: "Research Report: Workstream A — Template Reduction & Optimization (system-spec-kit)"
trigger_phrases: []
---
# Research Report: Workstream A — Template Reduction & Optimization (system-spec-kit)

**Lineage:** `ox-alpha-a` | **Session:** `fanout-ox-alpha-a-1787723389999-m6mva1` | **Iterations:** 10/10 | **Stop reason:** max_iterations (stopPolicy)
**Scope note:** Per dispatch directive this report covers Workstream A (templates) ONLY. Workstream B (constitutional memory deprecation) is owned by a sibling lineage; B observations are not recorded here.
**Shared fact accepted (not re-derived):** validate.sh delegates to a Node orchestrator; ANCHORS (`<!-- ANCHOR:id -->`), not headings, are the contract; anchor/frontmatter/required-doc changes are VERSIONED (manifest + content-router + spec-doc-structure.ts + golden snapshot + dist move together).

---

## 1. Executive Overview
The 13 template sources in `templates/manifest/*.md.tmpl` (3,926 raw lines) carry three measured waste classes: ~505 duplicated body lines in checklist.md.tmpl plus a near-total L3=L3+ copy in decision-record.md.tmpl; ~8.3KB (~15.5%) of instructional HTML comments that render into every packet; and 7 redundant `_memory.continuity` frontmatter copies that no consumer reads. All are reclaimable without violating any untouchable constraint, and the first class is reclaimable with ZERO rendered-byte change under the existing ADR-004 byte-identical gate. The owner-directed tasks+checklist merge is feasible but touches five validator surfaces and requires a legacy read-path to avoid regressing every shipped L2+ packet's derived status.

## 2. Background
Packet 033 (COMPLETE) render-optimized 4 templates via inline `<!-- IF level:N -->` gates and REJECTED cutting raw LOC (byte-identical gate = reader view unchanged = maintainability win only). This run re-examines what 033 left behind, under a new owner directive (merge tasks+checklist) and new external evidence that rendered-byte waste is an agent-quality tax, not a neutral cost.

## 3. Methodology
10 sequential single-focus iterations: direct source reads with file:line citations, line-diff measurement of template level bodies, a faithful re-implementation of `renderInlineGates` for byte measurement (later cross-checked against committed ground truth), negative greps for consumers, targeted web research (spec-kit reference, controlled instruction-density/context-length studies, ADR practice), and analytical ranking. State externalized in `iterations/iteration-001..010.md` + `deep-research-state.jsonl`.

## 4. Detailed Findings

### 4.1 Unified tasks+checklist merge (Q-A1)
- `deriveStatus` ranks implementation-summary > checklist > tasks > plan > spec; when checklist.md EXISTS only its checkboxes count — tasks checkboxes are ignored (`mcp-server/lib/graph/graph-metadata-parser.ts:1178-1266`). The L1 branch combines impl-summary completion_pct + open tasks items instead.
- `detectLevel` infers L2 from checklist.md file presence, L3 from decision-record.md (`orchestrator.ts:157-171`).
- Manifest models checklist.md as ADDON at L2/3/3+ only (`templates/manifest/spec-kit-docs.json`; resolver at `level-contract-resolver.ts:39-41,192`).
- PRIORITY_TAGS scans checklist.md exclusively (`orchestrator.ts:550-561`).
- Merge design: merged doc keeps notation/phase/completion anchors at all levels; verification protocol + CHK sections gated at L2+ (preserves today's manifest semantics and L1 deriveStatus path). Legacy standalone checklist.md must keep a read-path in deriveStatus.
- Overlap proof: tasks T008-T010 duplicate CHK-020/021 intent (`tasks.md.tmpl:96-140` vs `checklist.md.tmpl:79`).

### 4.2 Remaining dedup after 033 (Q-A2)
- Renderer grammar is IF-level gates ONLY; no cross-file includes (`scripts/templates/inline-gate-renderer.ts:33-35,182`). Shared-core = ungated lines within each file.
- MEASURED checklist.md.tmpl: level bodies L2=147/L3=219/L3+=219 lines (585 total), unique union = 80 → ~505 duplicated lines; L3 differs from L3+ by ~5 lines.
- MEASURED decision-record.md.tmpl: L3 and L3+ bodies 138/142 identical lines.
- Byte-identical gate mechanics: `scripts/tests/scaffold-golden-snapshots.vitest.ts:31-52` renders every level×doc, asserts no residual IF markers, snapshots per `${level}-${docName}`. Refactors must produce EMPTY diffs (ADR-004, `033/decision-record.md:72-85`); shape changes get a reviewed `-u` re-baseline.
- research.md.tmpl: 948 lines, 40 anchors, already level-gated by 033 T010 (L1 renders 175 lines; `research-template-gating.vitest.ts`). Remaining cost is the fixed 14-widget taxonomy itself — domain-neutralization changes anchors/rendered bytes → content-router coupling (research_finding routes to research/research.md, `content-router.ts:1080-1105`).

### 4.3 _memory.continuity duplication (Q-A3)
- 8 templates carry `_memory:` frontmatter (51/34/42/17/48/17/42/44 lines). L2 packet renders ~227 near-identical lines across 5 docs; baseline-proven: 22 packet_pointer copies in the committed snap file.
- Resume ladder reads continuity from implementation-summary.md ONLY (`resume-ladder.ts:961-964,1012-1019`; SPEC_DOC_PRIORITY puts it first, :127-136).
- deriveStatus reads completion_pct from impl-summary only (`graph-metadata-parser.ts:1237-1239`).
- BUT two validators consume the copies: FRONTMATTER_MEMORY_BLOCK validates all contract docs (`spec-doc-structure.ts:189-210`, codes at :109-119); SESSION_LINEAGE scans session ids across level docs (`orchestrator.ts:563-577,625-634`).
- Continuity freshness gate also keys on impl-summary only (`scripts/validation/continuity-freshness.ts:24,356-371`).
- Verdict: consolidate to ONE canonical block in implementation-summary; validator expectations relaxed FIRST or strict validation fails fleet-wide.

### 4.4 Instructional HTML comment leakage (Q-A4)
- MEASURED (L2 renders): total 53,660B rendered across 12 docs; 8,299B instructional comments = 15.5%. Worst: implementation-summary 43.6%. Baseline-proven independent of simulation: 11 SELF-CHECK blocks inside the committed snapshot file.
- Renderer strips only IF gates; golden test enforces nothing about other comments (`inline-gate-renderer.ts:182+`; `scaffold-golden-snapshots.vitest.ts:44-46`).
- Zero consumers: grep of SELF-CHECK/FAILURE-MODES prose across mcp-server/lib + scripts returns nothing.
- SPECKIT_LEVEL/SPECKIT_TEMPLATE_SOURCE markers are NOT leakage (detectLevel + snapshot test consume them).

### 4.5 Small-model legibility (Q-A5) [external]
- Instruction-following degrades non-linearly with instruction density ([arXiv 2608.02639]; [arXiv 2507.11538]).
- Context length alone hurts performance even with perfect retrieval ([EMNLP 2025 Findings 1264]) → comment bytes are a quality tax; contradicts 033's maintainability-only framing.
- Lost-in-the-middle U-shaped attention bias ([arXiv 2307.03172]) → machine contracts at doc ends; mid-doc prose guidance is where attention dies.
- github/spec-kit tasks template ≈230-250 lines; agent instructions consumed by the filling command, not shipped in the artifact ([github/spec-kit tasks-template.md]).
- ADR norm is short single-decision docs with status/supersession ([martinfowler.com ADR]; Google Cloud/AWS guides) → decision-record.tmpl exceeds norms.
- Draft budgets (rendered): spec ≤3.5KB, plan ≤5KB, merged tasks ≤5KB, impl-summary ≤2.5KB; enforce as additive snapshot-suite assertions.

### 4.6 Acceptance criteria restatement (Q-A6)
- AC_COVERAGE consumes exactly TWO homes: definition tables in spec.md + traceability matrix in checklist.md (`scripts/rules/check-ac-coverage.sh:100-166`); lifecycle requires level≥2 AND both files exist (:53-58), filename bindings at :54,57,198-200.
- Other restatements (plan.md:128 checkbox, CHK-020 ×3 copies, impl-summary narrative) have NO validator consumer (negative grep across scripts/rules/*.sh).
- Model: spec.md = single source of DEFINITION; one derived EVIDENCE matrix in the merged doc's L2+ verification section. Advisory severity (033 ADR-003) limits regression blast radius.

### 4.7 Versioned-change surface map
- Content-router defaults: `adr-NNN`, `what-built`, `how-delivered` anchors; category→(docPath, anchorId) mapping (`content-router.ts:48-50,1080-1105`). Tasks anchors untouched by merge → zero routing impact.
- Golden renders live in ONE snapshot file (3,955 lines).
- Full co-update matrix per change in iteration-007 §F-G1.4 (reproduced below in Recommendations).

## 5. Key Questions Summary
| Q | Answer |
|---|--------|
| Q-A1 merge design? | Feasible; verification section = L2+-gated addendum; 5 validator surfaces + legacy read-path required |
| Q-A2 remaining dedup? | ~505 checklist lines + 138-line decision-record copy removable byte-identically; research widget taxonomy deferred (routing-coupled) |
| Q-A3 drop 4+ _memory copies? | Yes, but validator-first (FRONTMATTER_MEMORY_BLOCK relaxation precedes template edits) |
| Q-A4 comments out-of-band? | Yes — sidecar guidance files; ~15.5% packet bytes reclaimed; renderer untouched |
| Q-A5 small-model budgets? | Evidence-backed per-doc byte budgets + ordering discipline; enforce via snapshot assertions |
| Q-A6 AC single-source? | Definition stays in spec.md; ONE derived matrix moves into merged doc; decorative copies deleted |

## 6. Sources
Codebase (file:line throughout Sections 4 and 9); external: arxiv.org/html/2608.02639v1; ar5iv.labs.arxiv.org/html/2507.11538; aclanthology.org/anthology-files/pdf/findings/2025.findings-emnlp.1264.pdf; arxiv.org/abs/2307.03172; aclanthology.org/2024.findings-acl.890.pdf; github.com/github/spec-kit/blob/main/templates/tasks-template.md (+ deepwiki 12.1); martinfowler.com/bliki/ArchitectureDecisionRecord.html; cloud.google.com/architecture/architecture-decision-records; AWS Prescriptive Guidance ADRs; Microsoft Azure Well-Architected ADR guidance; ThoughtWorks Lightweight ADRs.

## 7. Research Boundaries Compliance
Non-Goals honored: no Workstream B findings recorded; no repo tooling executed; no implementation performed. Stop Conditions honored: ran to maxIterations=10 under stopPolicy=max-iterations; convergence signals treated as telemetry only (ratios 0.9→0.7→0.6→0.6→0.55→0.5→0.45→0.3(thought)→0.25→0.25) and angles were broadened rather than synthesizing early.

## 8. Analysis & Interpretation
The binding constraint is not ideas but SEQUENCING against the versioned contract. The cheapest change proves the pipeline (empty-diff dedup), then byte-reclaiming changes share one snapshot re-baseline window, then the merge lands with its five co-updates, then consolidation changes run validator-first. Every recommendation below names exact files so the implementation packet can lift them directly.

## 9. Recommendations (ranked by value × risk)

**R1 — Checklist + decision-record shared-core dedup.** Value HIGH (~505 dup lines; kills variant drift) / Risk LOW (empty diff proves byte-identity). Co-update: templates only. Regression flag: none by construction. Files: `templates/manifest/checklist.md.tmpl`, `templates/manifest/decision-record.md.tmpl`.

**R2 — Comment out-of-band relocation.** Value HIGH (~15.5% packet bytes; small-model quality lever) / Risk MEDIUM-LOW. Co-update: new `templates/manifest/guidance/*` sidecars; renderer untouched. Regression flag: golden snapshots only (one reviewed re-baseline). Files: all 12 `.md.tmpl` carrying non-marker comments; `scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`.

**R3 — tasks+checklist merge (owner directive).** Value HIGHEST strategic / Risk MEDIUM. Co-update set: `templates/manifest/spec-kit-docs.json` addon rows→sectionGates; `orchestrator.ts:163` detectLevel signal; `orchestrator.ts:550-561` PRIORITY_TAGS retarget; `graph-metadata-parser.ts:1178-1266` deriveStatus combined evaluation + LEGACY checklist read-path; `check-ac-coverage.sh:54,57,198-200` filename bindings preferring merged matrix when present, legacy checklist otherwise. Regression flag: shipped L2+ packets flip status if legacy read-path omitted; AC gate goes dark-but-non-blocking on old packets if legacy preference omitted (acceptable, flag it).

**R4 — _memory consolidation to implementation-summary.** Value MEDIUM (~227 lines/packet; aligns resume ladder + deriveStatus + freshness gate + verify-index-identity on one doc) / Risk MEDIUM. Co-update: `spec-doc-structure.ts` FRONTMATTER_MEMORY_BLOCK expectations FIRST; session-lineage scan scope review (`orchestrator.ts:625-634`). UNKNOWN carried: full-save multi-doc rewrite behavior behind workflow.ts — verify during implementation planning before landing. Regression flag: FRONTMATTER_MEMORY_BLOCK errors fleet-wide if templates edited first.

**R5 — research.md widget taxonomy domain-neutralization.** Value MEDIUM-HIGH (lazy-addon scope) / Risk MEDIUM-HIGH (anchor-set ↔ content-router research_finding coupling). Defer to separate decision record.

**R6 — Byte-budget assertions.** Value MEDIUM / Risk NEAR-ZERO (additive assertions in `scaffold-golden-snapshots.vitest.ts`). Land with R2.

Sequencing: R1 → R6 → R2 → R3 → R4 → R5. Each lands as its own versioned manifest bump + dist rebuild (both `scripts/dist` and `mcp-server/dist` trees).

## 10. Implementation Approach (non-binding sketch)
Per recommendation: branch → template edit → targeted vitest (renderer/gating suites) → authoritative gate (golden snapshots; empty diff for R1) → dist rebuild → fleet spot-check validate.sh --strict on representative packets (L1/L2/L3/shipped legacy) BEFORE claiming completion. (This research ran no repo tooling per dispatch constraint.)

## 11. Quality & Verification (how to trust this)
Every load-bearing claim carries file:line or URL citations in Section 4; measurements are reproducible from the cited sources; the two simulation-derived claims were upgraded to baseline-proven against the committed snapshot file (iteration-009). Residual UNKNOWNs are listed in Section 12 rather than smoothed over.

## 12. Open Questions
1. UNKNOWN: does a full generate-context.js save rewrite `_memory` blocks in multiple docs, or only implementation-summary? (Affects R4 mechanics, not direction.)
2. Exact rendered-byte totals should be recomputed with the real renderer at change time (my simulator is faithful to the gate grammar but not blank-line normalization edge cases).
3. Whether research widget neutralization can reuse content-router's fallback anchor behavior to avoid versioning churn (needs a dedicated spike before R5).

## Eliminated Alternatives
| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Naive tasks+checklist merge (delete checklist.md outright) | Regresses deriveStatus for ALL shipped L2+ packets → status flips to in_progress | graph-metadata-parser.ts:1178-1266 | 001, 008 |
| Verification section required at L1 | Contradicts manifest (no L1 addon); taxes most common packet type | spec-kit-docs.json levels | 001 |
| Cross-file template includes/partials | Renderer has no such feature; expanding trusted render surface unjustified | inline-gate-renderer.ts:33-182 | 002 |
| Dropping _memory copies with zero code changes | FRONTMATTER_MEMORY_BLOCK fails validate.sh --strict fleet-wide | spec-doc-structure.ts:189-210 | 003, 007 |
| Renderer feature to strip designated comments | Sidecar files achieve zero-rendered-bytes with no render-path changes | F-D1.4 analysis | 004 |
| Removing SPECKIT_LEVEL/SOURCE markers | Consumed by detectLevel and snapshot test | orchestrator.ts:161; snapshots :42 | 004 |
| "LOC cuts don't matter" (033 stance, extended to bytes) | Context growth alone degrades performance; rendered-byte cuts are a quality lever | EMNLP 2025 Findings 1264 | 005 |
| Ultra-minimal no-sample templates | spec-kit evidence shows worked examples aid agents | github/spec-kit tasks-template | 005 |
| Moving AC evidence matrix INTO spec.md | Couples requirements to implementation detail; bloats most-read doc | F-F1.2, F-E1.2 | 006 |
| Deleting traceability matrix entirely | Zeroes out AC_COVERAGE, the one machine-checked adherence gate | check-ac-coverage.sh | 006 |
| Snapshot `-u` without diff review | Defeats ADR-004's purpose; reviewed diff IS the gate for shape changes | ADR-004 | 007 |
| Bundling merge + _memory consolidation into one landing | Two independent validator surfaces multiply rollback cost | R3/R4 risk analysis | 008 |
| Folding handover.md into implementation-summary | Destroys resume ladder's fresher-source arbitration | resume-ladder.ts:590-620 | 010 |

## 13. Cross-Context Pointers (Workstream B)
Excluded per dispatch. Note for sibling lineage only: constitutional-memory claims in the shared prompt were NOT verified here; no B evidence exists in this packet.

## 14. Convergence Report
- Stop reason: max_iterations (10) per config.stopPolicy=max-iterations
- Questions answered: 6/6 (all with draft-or-final recommendations)
- newInfoRatio trend: 0.90, 0.70, 0.60, 0.60, 0.55, 0.50, 0.45, 0.30 (thought), 0.25, 0.25
- Dead ends consolidated in Eliminated Alternatives (13 entries)
- Quality guards: source diversity satisfied (codebase + peer-reviewed + industry references); focus alignment maintained (zero B findings recorded); no single-weak-source findings (weakest claims re-verified against committed baseline)

## 15. Artifacts Index
- `deep-research-config.json` (status: complete)
- `deep-research-state.jsonl` (config record + 10 iteration records + lifecycle events)
- `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`
- `iterations/iteration-001.md` … `iteration-010.md`
