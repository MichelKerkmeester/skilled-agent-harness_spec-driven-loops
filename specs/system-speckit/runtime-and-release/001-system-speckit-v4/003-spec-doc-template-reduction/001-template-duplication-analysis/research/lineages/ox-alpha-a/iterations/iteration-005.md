---
title: "Iteration 005 — Angle (e): small-model legibility — external evidence and token-budget grounding"
trigger_phrases: []
---
# Iteration 005 — Angle (e): small-model legibility — external evidence and token-budget grounding

**Focus:** Q-A5 — What does external evidence say about template size/structure for 7-30B models executing plan->implement->verify?

## Method
Web research: github/spec-kit reference templates; controlled studies on instruction density, context length, and positional attention; ADR industry practice.

## Findings

### F-E1.1 — Instruction-following degrades non-linearly with instruction density [SOURCE: https://arxiv.org/html/2608.02639v1 "Instruction Stacking Collapse"; https://ar5iv.labs.arxiv.org/html/2507.11538 "How Many Instructions Can LLMs Follow at Once?" (IFScale)]
Follow rates fall non-linearly as simultaneous instructions accumulate. Templates embedding dozens of standing instructions (protocol tables, self-check rules, failure-mode warnings, notation conventions) tax exactly the capability weakest in 7-30B models.
**Implication:** each doc should carry ONE primary behavioral contract (e.g., checklist priority semantics), not overlapping restatements across sections.

### F-E1.2 — Context length alone hurts performance even with perfect retrieval [SOURCE: https://aclanthology.org/anthology-files/pdf/findings/2025.findings-emnlp.1264.pdf]
Controlled experiments across 5 models show task performance drops as context grows even when all evidence is retrievable.
**Implication:** the ~8.3KB/packet of instructional comment bytes (F-D1.1) is not neutral filler — it measurably taxes completion quality. Byte reduction IS an agent-quality lever, contra 033's "maintainability win only" framing for LOC cuts (033 rejected raw-LOC cuts because rendered output was assumed constant; comment leakage means rendered output itself carries waste).

### F-E1.3 — Position matters: U-shaped attention bias ("lost in the middle") [SOURCE: https://arxiv.org/abs/2307.03172; https://aclanthology.org/2024.findings-acl.890.pdf]
Models attend strongly to beginning and end of context.
**Implication:** merged-doc ordering should place machine-consumed contracts (frontmatter, anchor blocks) at top and verification summary at bottom; mid-document prose guidance is where attention goes to die — more reason to relocate it out-of-band (F-D1.4).

### F-E1.4 — GitHub spec-kit reference: compact templates with disposable sample content [SOURCE: https://github.com/github/spec-kit/blob/main/templates/tasks-template.md]
Their tasks template runs ~230-250 lines: frontmatter, format legend (`[ID] [P?] [US] Description`), phase headings with `---` separators, checkbox tasks with inline `[P]`/story tags, centralized dependency/ordering sections, and ONE HTML comment marking sample tasks as MUST-replace. Agent instructions are consumed by the filling COMMAND (which replaces samples), not shipped in the artifact.
Comparison: system-spec-kit tasks.md.tmpl renders 101 lines / 2220B at L2 (leaner core), but ships 438B of comments into packets; the wider packet carries 15.5% comment bytes. Spec-kit validates that ~100-line task scaffolds are sufficient for full SCD workflows — supporting aggressive trimming without workflow loss.

### F-E1.5 — ADR practice prescribes brevity: 1-2 pages, context/decision/consequences [SOURCE: https://martinfowler.com/bliki/ArchitectureDecisionRecord.html; https://cloud.google.com/architecture/architecture-decision-records; AWS Prescriptive Guidance]
All major ADR guides recommend short single-decision documents with a status lifecycle and supersession links rather than modification.
Implication: decision-record.md.tmpl at 289 source lines (142-line bodies duplicated across L3/L3+, F-B1.4) exceeds industry norms; the L3+=L3 near-copy adds zero per-industry-practice value. Template should enforce one short section-set PER ADR plus a register table.

### F-E1.6 — Token budget recommendation draft [RECOMMENDATION-DRAFT]
Grounded targets for rendered per-doc budgets (7-30B executors): spec.md <= ~3.5KB (today 3474B L1 render — hold); plan.md <= ~5KB (trim 855B comments); tasks+checklist merged <= ~5KB (merge saves file overhead + dedup); implementation-summary <= ~2.5KB rendered after comment removal (from 4116B). Enforce via a new snapshot-suite assertion: `rendered_bytes <= budget` per level x doc — turning Q-A5 into a continuously-checked contract instead of aspiration.

## Ruled out this iteration
- Ruled OUT: "LOC cuts don't matter" (033 stance) — F-E1.2 shows rendered-byte cuts improve model behavior; the correct 033-compatible framing is byte-gated, not LOC-gated.
- Ruled OUT: ultra-minimal no-sample templates — spec-kit evidence shows worked examples aid agents; keep examples but mark them replaceable (they already use [placeholder] syntax, an untouchable constraint anyway).

## Dead ends hit
- None.

## Open questions carried forward
- Does any current consumer depend on acceptance criteria being restated in multiple docs? (next iteration)
