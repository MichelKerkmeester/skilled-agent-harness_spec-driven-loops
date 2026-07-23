---
title: Structural Fingerprint Card Index
description: Load-on-demand index and evidence-envelope diversification check for seven abstract page-shape cards.
trigger_phrases:
  - "structural fingerprint cards"
  - "choose a page shape"
  - "diversify page structure"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Structural Fingerprint Card Index

Use this index to select one structural direction without loading a preset catalog.

## 1. LOAD-ON-DEMAND RULE

1. Read the existing `structuralFingerprintSelections` evidence envelope.
2. Exclude every card id already present for the current product or surface family.
3. Compare the remaining one-line applicability hints with the brief.
4. Pick one eligible card. Read only that card file; do not open the other cards for comparison.
5. If no unused card fits, record `no-unused-fit` with the reason before reusing the best-fitting card.
6. After application, append one selection entry using the envelope below.

The index is a routing aid, not a visual chooser. Card names do not authorize a style, component set, or fixed layout.

## 2. CARD INDEX

| Card id | Load only this file | One-line applicability hint |
|---|---|---|
| `heading-rail` | `card-heading-rail.md` | Use when section framing must carry orientation across varied body densities. |
| `layered-body` | `card-layered-body.md` | Use when evidence should deepen in deliberate passes instead of repeating equal panels. |
| `deliberate-seams` | `card-deliberate-seams.md` | Use when transitions between unlike content jobs need to make the page's argument legible. |
| `action-punctuation` | `card-action-punctuation.md` | Use when a small number of consequential actions should determine the page rhythm. |
| `image-counterweight` | `card-image-counterweight.md` | Use when owned imagery carries evidence and must counterbalance, not decorate, the narrative. |
| `staged-reveal` | `card-staged-reveal.md` | Use when comprehension depends on exposing complexity in a controlled sequence. |
| `reciprocal-frame` | `card-reciprocal-frame.md` | Use when navigation and footer must visibly share one information model across a multi-surface experience. |

## 3. SHARED SELECTION EVIDENCE ENVELOPE

Reuse this versioned collection in the project's existing design evidence record:

```json
{
  "version": "1.0",
  "structuralFingerprintSelections": [
    {
      "id": "pricing-heading-rail-01",
      "cardId": "heading-rail",
      "surface": "pricing",
      "rationale": "Recurring orientation is needed as comparison density changes.",
      "axisEmphasis": ["heading placement", "body composition"],
      "regionsApplied": ["opening", "comparison", "decision"],
      "responsiveGate": {
        "status": "confirmed",
        "evidence": "Reading order and heading ownership remain unambiguous in every tested state."
      },
      "proof": {
        "status": "confirmed",
        "evidence": [
          "Each major body is owned by one visible heading relationship.",
          "The closing action resolves the same hierarchy introduced at the opening."
        ]
      }
    }
  ]
}
```

## 4. FIELD CONTRACT

| Field | Required | Contract |
|---|---:|---|
| `version` | yes | Envelope schema version. |
| `structuralFingerprintSelections` | yes | Append-only selection entries for the current design evidence record. |
| `id` | yes | Stable entry identifier unique within the evidence record. |
| `cardId` | yes | One id from the card index. This is the diversification key. |
| `surface` | yes | Product area, page, flow, or view receiving the fingerprint. |
| `rationale` | yes | Brief-grounded reason this card fits better than the unused alternatives. |
| `axisEmphasis` | yes | Structural axes materially shaped by the choice. |
| `regionsApplied` | yes | Named regions where the relationship is visible. |
| `responsiveGate.status` | yes | `pending`, `confirmed`, or `blocked`; selection is not ready while pending or blocked. |
| `responsiveGate.evidence` | yes | Observation from the shared responsive gate, not a card-specific rule. |
| `proof.status` | yes | `pending`, `confirmed`, or `blocked`. |
| `proof.evidence` | yes | Visible observations that prove the selected relationship appears in the result. |

## 5. DIVERSIFICATION CHECK

Before selection, form the used-id set from every prior `cardId` in the envelope. Remove those ids from the index. Selection succeeds when one remaining card fits the brief and its entry can name concrete proof.

Dry-run example: if `heading-rail` is already recorded, the next pass starts with the other six cards. It cannot select `heading-rail` again merely because it is familiar. Reuse is allowed only after the unused set has no applicable card and the new entry's rationale starts with `no-unused-fit:` followed by the mismatch.

## 6. VALIDATION AND AUTHORITY BOUNDARY

- Reject entries whose `cardId` is absent from this index.
- Reject duplicate `id` values or empty evidence arrays.
- Treat `pending` and `blocked` as not ready; never promote them to confirmed from intent alone.
- Keep exact responsive behavior with the Interface and Foundations owners.
- Keep implementation values and runtime proof with the normal implementation handoff.
- Do not use the envelope as permission to load all cards, invent a new public mode, or turn card ids into presets.

