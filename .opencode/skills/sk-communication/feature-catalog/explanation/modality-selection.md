---
title: "Modality selection"
description: "Maps content to the smallest visual form that answers the question and applies the selection rules that keep the rendered explanation minimal."
trigger_phrases:
  - "modality selection"
  - "smallest visual form"
  - "content to visual form mapping"
  - "skip the diagram"
  - "read before you draw"
version: 1.0.0.0
---

# Modality selection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Maps content to the smallest visual form that answers the question and applies the selection rules that keep the rendered explanation minimal.

The mapping never renders a form wider than the question asked. It resolves to pseudocode, a call tree, a component tree, a file tree, Mermaid, a `diff` block, a code block, or HTML only when a denser form genuinely carries more of the answer, and it skips rendering entirely when no visual would clarify the subject.

---

## 2. HOW IT WORKS

`/rewrite:explain-visually` resolves the subject first, then walks the content-to-form table to pick the plainest form that fits what is being explained: pseudocode for logic and decision rules, a call tree for runtime control flow, a component tree for UI structure, a file tree for responsibility layout, Mermaid for interaction and sequence, a `diff` block for what changed, a code block for mostly-new code or exact syntax, and HTML only for dense multi-dimensional comparison.

Four rules bound every selection: include only what resolves the current question and omit the rest; read the actual code, file, or symbol before diagramming it, never infer structure from a name; put the visual first and keep any supporting prose beside the part it explains; and when no visual would clarify a one-line factual answer, say so and return `STATUS=NOOP REASON="nothing visual to show"` instead of forcing a diagram.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/rewrite/explain-visually.md` | Command | Step 3 ("Select The Modality") executes the mapping and the NOOP fallback against the resolved subject. |
| `.opencode/skills/sk-communication/references/visual-explanation.md` | Reference | Section 2 ("Modality") holds the content-to-form table and the selection rules. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/manual-testing-playbook/explanation/explain-visually-selects-modality.md` (COMM-010) | Manual | Operator scenario verifying a control-flow subject renders as a call tree, not prose, with protected spans reproduced byte-exact. |

No automated test exists for this lane: it is a prompt contract with no package surface, so the manual playbook scenario above is the verification surface.

---

## 4. SOURCE METADATA

- Group: Explanation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `explanation/modality-selection.md`

Related references:
- [depth-calibrated-explanation.md](depth-calibrated-explanation.md) — The second dial, applied after modality is chosen
