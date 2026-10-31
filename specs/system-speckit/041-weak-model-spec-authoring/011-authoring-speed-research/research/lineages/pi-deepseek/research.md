---
title: "Research: Where spec-kit authoring time goes, and which changes make it faster without losing packet 054's quality"
description: "Five-iteration deep-research synthesis measuring template, validation, protection-surface and derived-metadata cost in the spec-kit authoring path, with eight ranked changes, each naming the file it touches and whether its saving is measured or inferred."
trigger_phrases:
  - "spec authoring time"
  - "authoring speed ranked changes"
  - "spec kit upkeep cost"
importance_tier: important
contextType: research
---

# Research: Where spec-kit authoring time goes

## 1. METADATA

| Field | Value |
|-------|-------|
| **Topic** | Where AI models spend time writing and maintaining spec-kit docs, and which changes make authoring and upkeep faster while keeping the quality, adherence and clarity packet 054 added |
| **Packet** | `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research` |
| **Lineage** | `pi-deepseek` (fan-out), `cli-pi` / `deepseek-v4.1-flash-1017` |
| **Iterations** | 5 (stop policy max-iterations, cap reached) |
| **Findings** | 45 |
| **Status** | Synthesis complete; no implementation performed |
| **Evidence rule** | Every number is labelled *measured* (produced by a command or a recorded benchmark) or *inferred* (derived from volume, section counts or round counts) |

---

## 2. INVESTIGATION REPORT

### Request Summary

Measure where an AI model spends time authoring and maintaining spec-kit documents, and rank concrete changes that make that work faster than the pre-054 baseline without losing the quality, adherence and clarity that packet 054 added. Required coverage: template and fill-note length per level, the authoring card, task `Verify:` clauses, required sections and level selection, validation gates and their fix loops, derived-metadata refresh after each edit (`description.json`, `graph-metadata.json` fingerprints), continuity saves, and checklists and acceptance criteria. Each change must name the file it touches and be ranked by time saved against quality risk, and planning ceremony that small work does not need must be flagged.

### Current Behavior

Authoring a packet is four documents scaffolded from level-filtered templates, filled under a card of 11 sections, and then checked by a 41-rule validator whose pass line (`RESULT: PASSED`) does not cover the two failure modes that actually recur in measurement: unplaced required anchors and unfilled hints in a Draft packet. Derived metadata and continuity are refreshed by the continuity writer, not by the validator, and the authoring card forbids the authoring worker from invoking that writer, so upkeep lands after the author's window.

### Key Findings

- Template prose is not overhead at the margin: a Level-1 author reads 14,673 bytes of composed template to produce 14,621 bytes of finished packet, and FILL notes are 33.2%–41.3% of the templates they read. (measured)
- The largest single measured authoring-speed win on record came from rewriting two fill notes: mean wall clock 252.3 s → 193.7 s, a 23% cut, with an identical brief and identical measures. (measured)
- Strict validation is fast (~108 ms) and does not catch the recurring defect: it checks no required anchors, and it treats unfilled hints as warnings while status is Draft. Three of four benchmark rounds failed on anchors that strict validation passed. (measured)
- `Verify:` clauses are demanded by the template body, omitted by the same template's frontmatter description, and absent from all three shipped examples. (measured)
- Sixteen of the 41 validator rules police derived documents, graphs or continuity; none of them judges authored content, and the refresh they demand already happens inside the continuity save. (measured)

### Recommendations

Apply the eight ranked changes in order. The first three cost almost nothing in quality risk, and the single highest-raw-saving item (a one-document quick packet) ranks fourth because it is the only one that removes a protection surface.

---

## 3. EXECUTIVE OVERVIEW

### Executive Summary

The authoring path's cost is not the validator and not the level decision. It is the volume of guidance an author must read and imitate, plus the round trips caused by checks that sit outside the gate the author trusts. The cheapest available wins are therefore of two kinds: make the examples show what the template demands, and move the recurring quality checks into the gate that runs on every pass. The expensive temptations — cutting documents, cutting levels, rewriting the rule set — buy less per unit of risk than the cheap wins and are ranked below them.

### Quick Reference

| Surface | Measured cost | Class |
|---|---|---|
| Composed Level-1 template | 14,673 bytes, 26 FILL notes | measured |
| FILL share of read volume | 33.2% spec, 35.5% plan, 41.3% tasks (L1) | measured |
| Guidance beyond templates (L1) | card 7,846 B + fill guidance 3,831 B + level guide 7,841 B | measured |
| Strict validation runtime | ~108 ms per packet | measured |
| Validator rule surface | 41 rules: 22 template, 16 metadata/continuity, 6 structural, 3 strict-only | measured |
| Level-3 authoring wall clock | 252.3 s baseline → 193.7 s after two note fixes | measured |
| Required anchors | 45 (spec 7, plan 14, tasks 21, AC 3), unchecked by the gate | measured |
| Derived graph fields recomputed per save | 17 | measured |
| Per-level task volume | 16 / 27 / 42 tasks at L1 / L2 / L3 | measured |

### Research Sources

Repository-internal only: the spec-kit templates, examples, references, validator registry and CLI sources, packet 054's phase specs and implementation summaries, and the recorded benchmark report under `benchmark/reports/2026-10-25--model-eval--authoring-baseline/`.

---

## 4. METHOD AND EVIDENCE CLASS

1. Volume was measured with `wc -lc` over templates, examples and guidance documents.
2. Per-level template volume was measured by rendering each core template through its own `<!-- IF level:N -->` gates at levels 1, 2 and 3, then counting surviving FILL notes and bytes.
3. Gate behaviour was measured by reading the validator registry and the recorded benchmark runs, not by executing the packet validator (running it writes outside this lineage).
4. Wall clock exists for one fixture only (a frozen Level-3 brief, three runs per set, four sets). Everything else is inferred from volume, section counts or round counts, and is labelled as such.
5. No authoring session for a Level-1 or Level-2 packet was ever timed anywhere in the repository. That gap is the single largest evidence limitation in this report.

---

## 5. WHERE THE TIME GOES

### Per-level template and fill-note volume (measured)

| Document | L1 bytes / FILL | L2 bytes / FILL | L3 bytes / FILL |
|---|---|---|---|
| `spec.md` | 4,449 / 7 | 6,751 / 10 | 8,306 / 14 |
| `plan.md` | 3,653 / 7 | 8,031 / 11 | 11,720 / 15 |
| `tasks.md` | 2,875 / 6 | 7,363 / 16 | 10,870 / 22 |
| `implementation-summary.md` | 3,696 / 6 | 3,701 / 6 | 3,701 / 6 |
| `acceptance-criteria.md` | not scaffolded | 3,585 / 3 | 3,585 / 3 |
| **Total** | **14,673 / 26** | **29,431 / 46** | **38,182 / 60** |

Finished level-1 examples total 14,621 bytes, so at Level 1 the template a model reads is byte-for-byte the size of the packet it writes.

### The guidance stack on top of the templates (measured)

- `references/workflows/spec-authoring-card.md`: 174 lines, 7,846 bytes, 11 numbered sections, each with an `Acceptance:` and a `Verify:` line.
- `feature-catalog/tooling-and-scripts/template-section-fill-guidance.md`: 70 lines, 3,831 bytes.
- `references/templates/level-selection-guide.md`: 220 lines, 7,841 bytes.

For a sub-100-LOC change the reading stack is therefore about 26 KB against 14.6 KB of output.

### Where the measured wall clock actually goes (measured)

The one timed fixture (frozen Level-3 brief, four runs of three) shows 217–298 s per run at baseline and 164–228 s after the two fill-note fixes, with one 1,822 s outlier whose cause is unknown. Two sentences of guidance were worth 58.7 s; four benchmark rounds were worth nothing until the note changed.

---

## 6. VALIDATION GATES AND THEIR FIX LOOPS

**What the gate covers (measured).** 41 rules: 22 authored-template rules, 13 operational-runtime rules, 6 structural rules. 32 are errors, 7 warnings, 2 informational, and 3 are strict-only.

**What the gate does not cover (measured).**
- Required anchors: absent from validation entirely, while the benchmark scores packets against 45 required anchor positions.
- Unfilled hints: a warning while `Status: Draft`, and a fresh Level-2 scaffold was measured holding 97 bracketed hints under a passing strict validation.

**Why that matters for speed.** The fix loop is what costs time, and its documented shape is "fix one rule, re-run, stop after three fixes on the same rule". When the defect is outside the rule set, the loop runs in review instead, at three authoring runs per round. Three of four observed rounds were spent that way.

**What the validator itself costs.** About 108 ms per packet, so the check is never the bottleneck and thinning the rule set would save nothing measurable.

---

## 7. DERIVED METADATA AND CONTINUITY UPKEEP

- Each packet carries `description.json` and `graph-metadata.json`; the graph's derived block holds 17 fields, including `source_fingerprint`, `source_doc_hashes`, `causal_summary` and three wall-clock stamps. (measured)
- 16 of 41 rules police those files, the graph or continuity, and none of them polices prose. (measured)
- The refresh is owned by the continuity writer: every planner mode refreshes `description.json`, `graph-metadata.json` and the phase-parent pointers, and only `--full-auto` writes continuity fields. (measured, from the save workflow)
- The authoring card forbids the authoring worker from calling that writer, so the refresh happens after the worker stops. (measured)
- `CONTINUITY_FRESHNESS` is inert unless `SPECKIT_COMPLETION_FRESHNESS=true`, and its fingerprint invalidates on every later edit to `implementation-summary.md`. (measured)
- Every save rewrites `lastUpdated`, `last_save_at`, `last_accessed_at` and `last_active_at`, guaranteeing a diff per save. (measured)

**Conclusion.** No derived refresh is mandatory per edit. The per-edit refresh a strict check can appear to demand is one command away and already runs at save time; the real cost is that it runs outside the author's window, where nobody reads the resulting diff.

---

## 8. RANKED CHANGES

Ranked by time saved per unit of quality risk.

| # | Change | Time saved | Quality risk | File it touches | Evidence |
|---|---|---|---|---|---|
| 1 | Add a required-anchor check to the strict gate | One re-run round per occurrence; 3 of 4 observed rounds | Low — surfaces a defect review already finds | `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` + the rule script it names | measured recurrence, inferred time |
| 2 | Make the examples demonstrate the `Verify:` clause, and fix the template's own frontmatter description | 16–42 command-plus-output pairs become copyable | Low — additive; the example drift guard holds it | `templates/core/tasks.md.tmpl` line 15; `templates/examples/level-1|2|3/tasks.md` | measured gap, inferred time |
| 3 | Cut FILL notes to one imperative line plus one good example | 33.2%–41.3% of read volume; the precedent rewrite was worth 23% wall clock | Medium — the good/weak contrast is what cut leftover hints | `templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl` | measured volume, measured precedent, inferred transfer |
| 4 | Add a single-document quick packet for sub-25-point work | Four documents to one: roughly three quarters of the Level-1 write volume | High — the only change that removes a protection surface | `runtime/cli/spec/create.sh` (new `--level` value), `references/structure/folder-structure.md`, `references/templates/level-specifications.md` | measured volume, inferred time |
| 5 | Give the card a Level-1 short path and retire the "more than 4 plan steps" tripwire | Six sections and one stop-and-ask loop for small work | Low to medium — the card is the surface the weak-model runs passed on | `references/workflows/spec-authoring-card.md`, with `runtime/cli/spec/check-card-sync.sh` | measured section count, inferred time |
| 6 | Stop writing wall-clock stamps into derived files on every save | Review and merge time only | Low — find the consumers of those stamps first | `runtime/cli/spec-folder/generate-description.ts` and the graph writer it feeds | measured churn, inferred saving |
| 7 | Delete the published LOC targets | One invented conformance check per packet | Low — no validator reads them | `references/templates/level-specifications.md` lines 55–61 | measured inconsistency, inferred time |
| 8 | Resolve the inert `CONTINUITY_FRESHNESS` rule, enforce or retire | Small; removes a false assurance | Low | `references/validation/validation-rules.md` line 150 and its registry entry | measured inertness |

### Ordering rationale

Changes 1–3 share a property: they add or clarify a demonstration and cost no gate. Change 4 saves the most raw time and ranks behind them because its saving is bought with protection. Changes 5–8 are tidy-ups that remove invented work rather than measured work, and are ranked in that spirit.

---

## 9. PLANNING CEREMONY SMALL WORK DOES NOT NEED

Each item below is inherited by a sub-100-LOC change and protects nothing that change can break:

- **Architecture, quality-gates and rollback sections at Level 1.** The Level-1 `plan.md` example carries all three, so the level model says "essential what/why/how" while the artefact a model imitates says something larger.
- **The 13-row acceptance table for a handful of requirements.** Row count should follow the requirement count, not the template's example.
- **Four documents with four overlapping verification surfaces.** `spec.md` names success criteria, `plan.md` a testing strategy, `tasks.md` a verification phase and completion criteria, and `implementation-summary.md` a verification section; the same proof is authored up to four times.
- **The 45-anchor contract.** Anchors are a structural device for tools, and no validator checks them; an author who has to satisfy an unchecked contract is doing invented work.
- **The ten-section card path and its "more than 4 plan steps" stop rule.** Both are sized for a packet, not for a one-file change.
- **The published LOC targets.** Unenforced, internally inconsistent (Level 3 ~1090, Level 3+ ~1075), and the only number an author can self-check against.

---

## 10. RISKS TO THIS RANKING

1. **One timed fixture.** All wall-clock claims rest on a single Level-3 brief on one model. A Level-1 timing would likely change ranks 3 and 5.
2. **Volume is not time.** Reading and writing volume correlate with time but were not measured as time except in the one fixture.
3. **The fill-note precedent is confounded.** The two note fixes shipped together with a label fix, and the report itself says the result is a range and not an effect size.
4. **Example drift is a moving target.** Any change to examples must satisfy the drift guard that was added to stop examples rotting, so a cheap-looking change carries a maintenance contract.
5. **Rank 4 could regress adherence invisibly.** A quick packet with one document would not disturb any current rule, which is exactly why a regression would go unnoticed.

---

## 11. ELIMINATED ALTERNATIVES

- **Thin the validator rule set to save time.** Rejected: the validator costs ~108 ms; the round trips are the cost, and 16 of its rules police files that a save refreshes anyway.
- **Have authors run `repair-derived.cjs` after each edit.** Rejected: the continuity save already refreshes the same files, and the repair CLI is dry-run by default for structural moves.
- **Use the published LOC targets as a time model.** Rejected: they are soft, inconsistent at L3/L3+, and read by no validator.
- **Count raw template bytes as the author's read cost.** Rejected: level gates remove about 46% of the spec at Level 1, so raw counts overstate small-work cost.
- **Treat a passing strict validation as proof of packet quality.** Rejected by measurement: unfilled hints and missing anchors both survive a pass.
- **Rewrite templates to be shorter without touching examples.** Rejected: the strongest measured effect came from example-and-note wording, and examples are what a model imitates.

---

## 12. DIVERGENCE MAP

- **Saturated directions:** none. This lineage ran one focus per iteration with no pivot, because the topic's five surfaces stayed productive to the cap.
- **Pivots taken:** none (0 completed, 0 failed, 0 overrides).
- **Evidence-breadth note:** coverage came from one repository's internal artefacts plus one recorded benchmark series. No external source was consulted, and no authoring session was re-run.
- **Remaining frontier:** (a) a timed Level-1 and Level-2 authoring brief, which would convert three rankings from inferred to measured; (b) an instrumented count of validator round trips per packet in real use; (c) the effect of dropping the good/weak contrast in FILL notes on leftover-hint counts, which is testable with the existing benchmark harness.

---

## 13. OPEN QUESTIONS

1. What is the measured authoring wall clock for a Level-1 packet? No such measurement exists, and ranks 3 and 5 depend on it.
2. How many validator round trips does a real packet take? The card bounds a single rule at three fixes; no counter exists for the whole packet.
3. Which consumers read `last_accessed_at` and `last_active_at`? Rank 6 needs that list before any stamp is dropped.
4. Would removing the weak-example half of each FILL note raise leftover-hint counts? The answer decides whether rank 3 is safe at its current position.
5. Does an unvalidated anchor contract catch the same defects as a validated one when a stronger model authors the packet? All anchor evidence here comes from one weaker model.

---

## 14. REFERENCES

- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`, `research.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/examples/level-1`, `level-2`, `level-3`
- `.skilled/skills/system-spec-kit/references/templates/level-specifications.md`, `level-selection-guide.md`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md`, `phase-definitions.md`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, `quick-reference.md`
- `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`, `create.sh`, `recommend-level.sh`, `repair-derived.cjs`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md`, `004-template-section-fill-guidance/spec.md`, `009-authoring-benchmark-and-closeout/implementation-summary.md`

---

## APPENDIX: CONVERGENCE REPORT

- **Stop reason:** maxIterationsReached
- **Total iterations:** 5
- **Questions answered:** 6 / 6
- **Remaining key questions:** 0
- **Last 3 iteration summaries:** run 3: protection surfaces and level selection (0.72); run 4: derived metadata and continuity (0.78); run 5: ranked list and ceremony (0.55)
- **newInfoRatio trend:** 0.95 → 0.82 → 0.72 → 0.78 → 0.55 (mean 0.764)
- **Convergence threshold:** 0.05 (telemetry only under stopPolicy max-iterations)
- **Findings:** 45 across five iterations
- **Divergence summary:** no pivots; no saturated directions; frontier listed in section 12

### Containment note

Two workflow steps write outside this lineage and were therefore not executed here: the pre-init and post-synthesis `spec.md` mutations, and the packet-level `validate.sh` runs. One step did write outside the lineage: `step_emit_resource_map` in fan-out mode resolves the packet's own `research/` root, so it wrote `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/research/resource-map.md`. That file did not exist before this run; it is the artefact the parent loop's synthesis writes from the same lineage deltas, but this lineage wrote it, and the breach is recorded rather than hidden. Nothing was deleted or reverted.
