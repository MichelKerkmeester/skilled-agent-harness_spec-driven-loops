---
title: "A11y and analysis"
description: "Audit and analyze the Figma document without changing it: accessibility checks, general analysis, URL analysis, verification, and read-only gradient extraction."
trigger_phrases:
  - "figma a11y audit"
  - "figma analyze"
  - "figma analyze-url"
  - "figma gradient extract"
  - "figma verify"
version: 1.0.0.1
---

# A11y and analysis (figma-ds-cli a11y / analyze)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Audits and analyzes the document without changing it: accessibility checks, general analysis, gradient extraction (read-only when not applied), and URL analysis. All read-only.

A typical caller runs an a11y audit or analysis to learn about the document before deciding on any change. Everything in this area is READ-ONLY. The one boundary to watch: `gradient extract --apply-to` writes the gradient back and is therefore MUTATING, so the applied form belongs to the render/create surface, not here.

---

## 2. HOW IT WORKS

`figma-ds-cli a11y ...` runs accessibility checks on nodes or the document, and `figma-ds-cli analyze ...` runs general analysis. `figma-ds-cli analyze-url <url>` analyzes a design at a URL, and `figma-ds-cli verify ...` verifies the result of a prior operation. `figma-ds-cli gradient extract <node>` extracts a gradient without applying it, which keeps it READ-ONLY; only when a gradient is applied back (via `--apply-to`) does it become a mutating render/create action, which is documented in the render and create area rather than here.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/figma_cli_reference.md` | Shared | A11y, analyze, verify, and gradient verb surface |
| `references/tool_surface.md` | Shared | READ-ONLY classification and the gradient apply boundary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read_only/read_only_inspect.md` | Manual playbook | The read-only verb contract that a11y and analysis share |

---

## 4. SOURCE METADATA

- Group: A11y and Analysis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `a11y-and-analysis/a11y-and-analysis.md`

Related references:
- [inspect.md](../inspect/inspect.md) covers the read-only structure verbs a11y and analysis build on
- [render-and-create.md](../render_and_create/render_and_create.md) covers the applied gradient path, which is mutating
