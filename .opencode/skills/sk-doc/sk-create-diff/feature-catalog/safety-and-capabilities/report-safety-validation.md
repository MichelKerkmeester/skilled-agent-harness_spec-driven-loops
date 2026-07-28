---
title: "Report safety validation"
description: "Asserts a generated report is safe and self-contained before hand-off, inspecting real markup only."
trigger_phrases:
  - "Report safety validation"
  - "validate diff report safety"
  - "validate_report.py check"
  - "self-contained report validator"
version: 1.0.0.0
---

# Report safety validation (validate_report.py)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Asserts a generated report is safe and self-contained before it is handed off.

This is the independent safety gate for the HTML report. A caller runs it after generating any report to confirm the file is offline-safe and script-free before sharing or opening it. It is deliberately a separate script from the engine so the check is adversarial to the renderer rather than trusting it, and it is careful to inspect only real markup — escaped hostile text inside document content never trips it. It returns a plain pass/fail so it can gate a workflow.

---

## 2. HOW IT WORKS

`scripts/validate_report.py <report.html>` parses the generated report and asserts the structural safety markers: a `<!doctype html>` declaration, an `<html lang>` attribute, and a Content-Security-Policy meta tag. It then checks the live markup for anything unsafe — `<script>` tags, inline event handlers, or remote `href`/`src` references — and fails if any are present.

The key subtlety is that it distinguishes real markup from escaped content. A document body that literally contains `<script>alert(1)</script>` is escaped to inert text by the renderer, so the validator sees `&lt;script&gt;` as content and does not false-positive on it. The script exits `0` on pass and `1` on fail, which lets it act as a gate in a manual or automated workflow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/validate_report.py` | Script | Checks `<!doctype html>`, `<html lang>`, and a CSP meta tag, and — on real markup only — the absence of `<script>` tags, inline event handlers, and remote `href`/`src`; exits `0` pass / `1` fail |
| `references/accessibility-contract.md` | Shared | The self-containment and accessibility guarantees the validator enforces |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | SAFE-001 (self-contained zero-JS report) and SAFE-002 (escaped hostile content never false-positives) |

---

## 4. SOURCE METADATA

- Group: SAFETY AND CAPABILITIES
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `safety-and-capabilities/report-safety-validation.md`

Related references:
- [capability-tier-reporting.md](capability-tier-reporting.md) — the neighboring safety-and-capabilities feature: supported formats and fidelity reporting
