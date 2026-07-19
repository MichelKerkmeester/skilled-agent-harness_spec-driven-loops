---
title: "Temporal-structural coherence scoring"
description: "Describes the coherence dimension in the quality loop that scores basic content structure, future-dated completion claims, and unresolved or self-referential causal links."
trigger_phrases:
  - "temporal-structural coherence scoring"
  - "quality loop coherence dimension"
  - "future-dated completion claim penalty"
  - "self-referential causal link detection"
  - "structural content quality score"
version: 3.6.0.15
---

# Temporal-structural coherence scoring

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the coherence dimension in the quality loop that scores basic content structure, future-dated completion claims, and unresolved or self-referential causal links.

This checks whether a spec-doc record clears a few structural basics and avoids a narrow set of temporal and causal-link problems. If content is empty, too short, missing headings, or claims completion dates that are later than its last-modified time, the score drops. Self-referential or unresolved causal links also reduce the score. Think of it like a lightweight intake checklist rather than a full chronology engine.

## 2. HOW IT WORKS

The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The implementation starts with four structural checks: non-empty content, length over 50 characters, at least one Markdown heading, and length over 200 characters. It then applies bounded penalties for future-dated completion claims and for causal-link metadata that points back to the same spec-doc record or to unresolved references. The handler does not perform broader spec-folder chronology analysis or predecessor inference.

The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing structurally weak or narrowly inconsistent content from entering the index.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/handlers/quality-loop.ts` | Handler | Quality loop with coherence scoring |

### RETRY BEHAVIOR (QUALITY LOOP)

The verify-fix-verify retry cycle in `mcp-server/handlers/quality-loop.ts` is **immediate by design** (no backoff delay between attempts). Retries are bounded by `maxRetries` (default: `2`) and run synchronously because the auto-fix steps are deterministic local transforms (trigger re-extraction, anchor normalization, token-budget trimming). This keeps ingestion latency predictable while still allowing corrective passes.

---

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/quality-loop.vitest.ts` | Automated test | Quality loop tests |

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring-and-calibration/temporal-structural-coherence-scoring.md`
Related references:
- [access-driven-popularity-scoring.md](../../feature-catalog/scoring-and-calibration/access-driven-popularity-scoring.md) — Access-driven popularity scoring
- [adaptive-shadow-ranking-bounded-proposals-and-rollback.md](../../feature-catalog/scoring-and-calibration/adaptive-shadow-ranking-bounded-proposals-and-rollback.md) — Adaptive shadow ranking, bounded proposals, and rollback
