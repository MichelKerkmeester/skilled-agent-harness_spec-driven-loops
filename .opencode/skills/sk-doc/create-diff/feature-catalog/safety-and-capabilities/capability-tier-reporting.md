---
title: "Capability and fidelity reporting"
description: "Reports supported formats, their fidelity tiers, and the detected PDF extractor so limited results are never presented as complete."
trigger_phrases:
  - "Capability and fidelity reporting"
  - "supported formats and fidelity tiers"
  - "capabilities subcommand"
  - "detected PDF extractor"
version: 1.0.0.0
---

# Capability and fidelity reporting (capabilities)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Reports which formats are supported, at what fidelity tier, and which optional PDF extractor is present, so limited-fidelity results are never presented as complete.

This is the honesty layer a caller consults before trusting a comparison. `capabilities` answers "what can this compare, and how well" up front, and the same tier information is what stamps every report summary. The critical behavior is that it never overstates: a format the engine cannot handle fully is reported at its true tier, and an outright unsupported input exits `3` with an actionable message rather than fabricating a diff. The one environment-dependent answer is the PDF extractor, which is detected at runtime.

---

## 2. HOW IT WORKS

`capabilities` prints the format matrix — text and Markdown at `full`, HTML and DOCX at `text`, and PDF at the conditional `text*` — together with the PDF extractor it detected on the machine (`pdftotext`, `pypdf`, or `pdfplumber`, or none). Passing `--json` emits the same matrix in machine-readable form for automation.

The reporting is wired to the engine's actual behavior, not a static list: when a caller asks to compare an unsupported or limited format with no fallback, the run exits `3` with a message that both explains the limit and points at the explicit-pair fallback. That is what keeps a limited-fidelity or impossible comparison from being silently presented as a complete one.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | `capabilities [--json]` prints the format matrix and detected PDF extractor; unsupported/limited formats exit `3` with an actionable message pointing at the explicit-pair fallback |
| `references/capabilities-and-fidelity.md` | Shared | The format matrix, the full/text/conditional fidelity tiers, and the optional PDF extractor dependency |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | SAFE-004 (capability reporting and unsupported handling) and CMP-003 (conditional PDF) |

---

## 4. SOURCE METADATA

- Group: SAFETY AND CAPABILITIES
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `safety-and-capabilities/capability-tier-reporting.md`

Related references:
- [report-safety-validation.md](report-safety-validation.md) — the neighboring safety-and-capabilities feature: the report safety validator
