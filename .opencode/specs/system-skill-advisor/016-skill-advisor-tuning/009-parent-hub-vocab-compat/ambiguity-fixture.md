---
title: "Labeled Cross-Hub Ambiguity Fixture (Dataset)"
description: "A labeled dataset of ambiguous cross-hub routing prompts (sk-code vs sk-design vs deep-loop-workflows vs deep-loop-runtime) with gold hub + ambiguousWith labels, plus a gold-none abstain slice. This is a DATASET only — its harness wiring and the 007 ratchet recapture are gated on the atomic advisor reindex. Baselined at today's 15/25 = 0.60."
trigger_phrases:
  - "cross-hub ambiguity fixture"
  - "labeled routing ambiguity dataset"
  - "parent-hub gold labels"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/009-parent-hub-vocab-compat"
    last_updated_at: "2026-07-07T18:33:59.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored labeled cross-hub ambiguity dataset (25 rows + gold-none slice)"
    next_safe_action: "Wire fixture to harness in gated WU-3 after reindex + ratchet recapture"
---
# Labeled Cross-Hub Ambiguity Fixture (Dataset)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: reference | v2.2 -->

## Purpose & status

This is a **labeled dataset**, not a wired test. It exists so the gated Layer-1b vocabulary patch (WU-3) has an *empirical* target: does correcting the half-landed deep-loop code-audit vocabulary actually improve cross-hub routing, and by how much?

- **Why a new fixture:** the existing `ambiguity_slice_stable` gate measures **synthetic stability**, not empirical FP/FN correctness (`advisor-validate.ts:548`; runtime ambiguity is only a `0.05` score/confidence window, `ambiguity.ts:7`). Stability ≠ correctness, so the current gate structurally cannot answer parent-hub compatibility. This dataset carries **gold labels**, so it measures correctness.
- **Baseline anchor:** the 007 ambiguity slice sits at **15/25 top-1 = 0.60** — the weakest measured area (`007-eval-hardening/implementation-summary.md:129`; figure at `scorer-eval-baseline.json:30`). The 25 cross-hub rows below are sized to that denominator so the 0.60 baseline stays comparable.
- **Gated:** wiring this into the harness and feeding measured survivors into 007's frozen slice recapture requires the atomic reindex + ratchet recapture (WU-3). This packet ships the dataset only — **no test wiring, no baseline recapture here.**
- **Caveat:** gold labels are authored from source-truth hub ownership; the advisor runs a compiled `dist`, so measured accuracy is only meaningful **after** a healthy reindex (not the degraded filesystem fallback, `projection.ts:695`).

## Label schema

Each row carries: `ID | prompt | gold_hub | ambiguousWith | family | rationale`.
- `gold_hub` — the single correct owner, or `none` for a deliberate abstain.
- `ambiguousWith` — the hub(s) the prompt is *designed* to be confusable with (the routing trap). `—` = not a hub confusion (explicit-invocation or clearly-scoped).
- Ownership basis: `sk-code` owns single-pass code audit / review / quality-gate; `sk-design` owns design/accessibility/UI audit; `deep-loop-workflows` owns the **iterative** review/research loop; `deep-loop-runtime` owns the backend internals.

## Metrics this dataset is designed to score (at wiring time)

1. **Top-1 accuracy** — gold_hub is the #1 routed skill (the headline 15/25 → target).
2. **Top-2 score/confidence margin** — separation between #1 and #2 on the ambiguous rows.
3. **`ambiguousWith` correctness** — the runtime's declared ambiguity set matches the labeled trap.
4. **Strict abstain correctness** — the `none` rows abstain rather than over-route.

## Dataset — cross-hub ambiguity (25 rows)

| ID | Prompt | gold_hub | ambiguousWith | Family | Rationale |
|----|--------|----------|---------------|--------|-----------|
| A1 | audit this auth module for security vulnerabilities | sk-code | deep-loop-workflows | single-pass code audit | Single-pass code security audit is sk-code; "audit" tempts the deep-loop review-loop. |
| A2 | do a code audit on the payment changes before merge | sk-code | deep-loop-workflows | single-pass code audit | Pre-merge single-pass audit; the stale deep-loop `code audit` vocab is the trap. |
| A3 | review my PR for p0 and p1 issues | sk-code | deep-loop-workflows | single-pass code audit | PR review + p0/p1 is sk-code's `p0 p1 p2 review`; not an iterative loop. |
| A4 | check this diff against the quality gate | sk-code | deep-loop-workflows | single-pass code audit | Quality-gate check is sk-code; no iteration requested. |
| B1 | run a deep review loop until findings converge | deep-loop-workflows | sk-code | iterative review loop | "loop … until converge" is the deep-review workflow, not a single pass. |
| B2 | start a multi-pass iterative review of the service | deep-loop-workflows | sk-code | iterative review loop | "multi-pass iterative" is the loop; sk-code is the single-pass trap. |
| B3 | /deep:review the checkout feature | deep-loop-workflows | — | iterative review loop | Explicit command invocation; must stay deep-loop-workflows. |
| B4 | iterate a severity-weighted review across the module | deep-loop-workflows | sk-code | iterative review loop | "iterate" + severity-weighted findings across passes = the loop. |
| C1 | audit the design system for accessibility gaps | sk-design | sk-code | design audit | Design/accessibility audit is sk-design; bare "audit" tempts sk-code. |
| C2 | critique the visual hierarchy of this screen | sk-design | — | design audit | UI critique is unambiguously sk-design. |
| C3 | accessibility audit of the signup flow | sk-design | sk-code | design audit | Accessibility audit is sk-design's `accessibility audit`. |
| C4 | design audit of the marketing page | sk-design | sk-code | design audit | Explicit design audit; the 3-way "audit" trap. |
| D1 | is this implementation ready to ship — run the quality gate | sk-code | deep-loop-workflows | quality gate | Author-time quality gate is sk-code; not a review loop. |
| D2 | author quality gate before I mark this done | sk-code | — | quality gate | sk-code's `author quality gate` intent signal. |
| D3 | verify my code meets the p0/p1/p2 standards | sk-code | deep-loop-workflows | quality gate | Single-pass standards check; sk-code owns p0/p1/p2. |
| E1 | fix the fan-out reducer in the deep-loop backend | deep-loop-runtime | sk-code | runtime internals | Editing the backend primitive is runtime internals (or sk-code by action), not a workflow invocation. |
| E2 | how does the deep-loop coverage-graph scoring work | deep-loop-runtime | deep-loop-workflows | runtime internals | Backend mechanism question → runtime; not "run a loop". |
| E3 | kick off the deep research workflow on this topic | deep-loop-workflows | deep-loop-runtime | workflow invocation | Invoking the workflow → deep-loop-workflows, not the backend. |
| E4 | modify the council convergence primitive | deep-loop-runtime | deep-loop-workflows | runtime internals | Editing a primitive → runtime internals. |
| F1 | review | none | sk-code, sk-design, deep-loop-workflows | under-specified | Bare "review" has no owner; must abstain, not over-route. |
| F2 | audit | none | sk-code, sk-design, deep-loop-workflows | under-specified | Bare "audit" is the canonical 3-way trap; abstain. |
| F3 | can you look at this for me | none | — | under-specified | No actionable intent; abstain. |
| G1 | audit the quality of the advisor's skill recommendations | deep-loop-workflows | system-skill-advisor | eval-of-recommendation | Auditing recommendation quality routes to review, not advisor-self. |
| G2 | evaluate whether the routing suggestions are correct | deep-loop-workflows | system-skill-advisor | eval-of-recommendation | Evaluation of routing output → review loop, not the advisor. |
| G3 | review how well the skill advisor is scoring prompts | deep-loop-workflows | system-skill-advisor | eval-of-recommendation | Meta-review of advisor scoring → review, not advisor-self. |

## Gold-`none` abstain slice (semantic-shadow false-fire guard)

008's full-corpus ablation found **3 gold-`none` abstain rows that the `semantic_shadow` lane false-fires to `mcp-chrome-devtools`** (`008-semantic-shadow-prove-or-freeze/implementation-summary.md:79`; full 149/193 vs disabled 150/193, 6 flips: 2 help `memory:save`, 3 hurt via this false-fire, 1 neutral-wrong). Tracking these as an explicit abstain slice lets a future semantic-only false-fire count guard the lane without touching its frozen 0.05 weight.

> **Reconciliation note (honest provenance):** the three rows below are *representative* abstain-class prompts in the failure shape. The **exact** prompt strings/IDs must be imported from 008's ablation flip data (the `mcp-chrome-devtools` flip-ids) when this slice is wired — do not treat the strings below as the literal 008 rows.

| ID | Prompt | gold_hub | ambiguousWith | Family | Rationale |
|----|--------|----------|---------------|--------|-----------|
| N1 | inspect this and tell me what's off | none | mcp-chrome-devtools | gold-none abstain | Under-specified; embeds near devtools "inspect" — must abstain. |
| N2 | check what's happening here | none | mcp-chrome-devtools | gold-none abstain | No target/skill; semantic proximity to devtools debugging. |
| N3 | take a look at the current state | none | mcp-chrome-devtools | gold-none abstain | Generic; false-fires to devtools in the semantic lane. |

## Coverage & provenance note

- **Gold basis (source-truth):** `sk-code/graph-metadata.json` (code review / quality gate / p0-p1-p2 / audit packet), `sk-design/graph-metadata.json` (design/accessibility/UI audit), `deep-loop-workflows/{graph-metadata.json,mode-registry.json}` (iterative review/research loop), `deep-loop-runtime` (backend primitives).
- **Baseline:** `007-eval-hardening/implementation-summary.md:129`; `scorer-eval-baseline.json:30` (15/25 = 0.60).
- **Abstain slice:** `008-semantic-shadow-prove-or-freeze/implementation-summary.md:79`.
- **Not measured here:** no prompt was run through the scorer in this packet (read-only); the accuracy numbers are established at gated wiring time against a healthy reindex.
