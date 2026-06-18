---
title: "Output Surface-Parity: One Score, One Scale, One Name Across Every Surface"
description: "The /memory:search output stopped being non-comparable across models. The contract now mandates similarity on a 0 to 1 scale at two decimals as the sole ranking metric on every surface, bans confidence and percentage scores in rendered output, names the five core slots as mandatory, promotes requestQuality and citationPolicy to named optional trailing fields, and keeps constitutional rows out of the scored block."
trigger_phrases:
  - "002/017/007 output surface parity changelog"
  - "one score one scale one name similarity"
  - "ban confidence percentage rendered output"
  - "surface parity command direct conversation"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/007-output-surface-parity` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The same result rendered differently across models, so the output was not comparable. One model showed `confidence 0.36` for a row while another showed `similarity 0.68` for the same row. This phase makes the contract mandate one score, one scale and one name on every surface. The sole ranking metric is `similarity`, on a 0 to 1 scale at two decimals, and a percentage-scaled value is divided by one hundred before it is emitted. `confidence` as a metric name and any percentage score are banned in rendered output. The five core slots (query echo, similarity, id, title and the STATUS footer carrying RESULTS and INTENT) are named mandatory for every result on every surface. A surface-parity clause makes the core field set and the scale mandatory regardless of how the command was invoked, whether `--command` dispatch, a direct prompt or natural conversation, so two surfaces return comparable diffable rows for the same result. `requestQuality` and `citationPolicy` are promoted to named optional trailing fields so their presence or absence is unambiguous rather than left to model latitude. Constitutional rows stay out of the scored block. This phase builds on the structural arg-handling layer from the prior phase and leaves it untouched. A short COSTAR register note frames the contract as objective-first for an automated pipeline, which is the shared register weak models tolerate best, without imposing a single global prompt framework.

### Changed

- `commands/memory/assets/search_presentation.txt` - strengthened the field mapping into a hard one-score one-scale one-name mandate, added the explicit ban on `confidence` and percentages, named the five core slots mandatory, added the surface-parity clause, promoted `requestQuality` and `citationPolicy` to named optional trailing fields, and added the COSTAR register note
- `commands/memory/search.md` - aligned the inline retrieval render reminder with the mandated single metric and scale

### Fixed

- The same result now renders the same field, name and scale across models, so output is comparable
- A percentage-scaled score is normalized to the 0 to 1 similarity scale rather than emitted raw

### Verification

| Check | Result |
|-------|--------|
| Cross-file consistency | PASS: similarity 0 to 1 at two decimals mandated, `confidence` and percentages banned, five core slots named mandatory, optional fields named, surface-parity clause present, constitutional rows excluded |
| Prior structural layer | CONFIRMED untouched: the arg-resolution header, salience inversion and startup gating from phase `006` are intact |
| Strict validate | PASS: `validate.sh --strict` on the phase folder |
| Live cross-model A/B | DEFERRED: a DeepSeek, Kimi and MiMo render-consistency run under the new contract is the documented follow-up |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/commands/memory/assets/search_presentation.txt` | Modified |
| `.opencode/commands/memory/search.md` | Modified |

### Follow-Ups

- The live cross-model A/B (DeepSeek, Kimi and MiMo render-consistency under the new contract) is the documented follow-up and cannot be run from the implementing session.
