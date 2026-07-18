---
title: design-audit
description: "The sk-design QA and critique mode that reviews built or planned interfaces, files severity-ranked findings and scores five dimensions out of 20."
trigger_phrases:
  - "design audit"
  - "critique UI"
  - "accessibility audit"
  - "design quality score"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# design-audit

> Tells you exactly what is wrong with an interface, how bad each issue is and who owns the fix, without touching the code.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Reviewing a UI for accessibility, performance, responsive, theming and AI-slop problems |
| **Invoke with** | `audit design`, `critique UI`, `design review`, `accessibility audit`, `looks AI-generated` |
| **Works on** | A source file, a rendered URL, a screenshot or a design plan |
| **Produces** | Severity-ranked P0-P3 findings, a five-dimension `/20` score and an owner map |

---

## 2. OVERVIEW

### Why This Mode Exists

An interface can pass every automated scan and still fail real users: a focus trap a mouse never hits, a cream body background that screams machine-generated, a form that loses work when the network drops. Those gaps hide in the space between a green check and what a person actually experiences. Without a structured review, they ship.

`audit` closes that gap. It walks a surface against accessibility, performance, responsive, theming and anti-slop checks, names each defect with evidence and ranks it by user impact. It is the critic in the `sk-design` family, the sibling that judges rather than creates.

### What It Does

`audit` produces a findings-first report: concrete findings come first, then a five-dimension score that summarizes them. Each finding carries evidence, user impact, a recommended direction and an owner. When an intended or contextual corpus reference is useful, a separate comparison lane can add zero to two non-authoritative rows; those rows never assign severity, score or proof. The mode reviews and routes, it does not implement. Accepted fixes go to `sk-code`, while direction goes to `interface`, tokens go to `foundations` and choreography goes to `motion`. If you want a new visual direction instead of a critique, reach for `interface`.

---

## 3. QUICK START

**Step 1: Invoke it.** Routing keywords like `audit design` or `accessibility audit` reach this mode through `sk-design`. You can also point it at a target directly.

**Step 2: Run the audit.**

```text
Audit src/pages/checkout.tsx for release readiness and give me a design quality score.
```

A findings-first report ordered P0, P1, P2, P3, then a `/20` score with a rating band and an owner map.

**Step 3: Verify the docs.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-audit/README.md --type readme
```

Reports zero issues.

---

## 4. HOW IT WORKS

The audit runs the same shape every time. It resolves the surface to one concrete target, then states what evidence is available and what is missing, so a visual claim never rests on evidence that was never gathered. Findings come next, each with evidence and a severity, ordered worst-first. Only then does the five-dimension score appear, as a summary of the findings rather than a replacement for them. The report closes by mapping every finding to an owner and naming the residual risk if the surface ships as-is.

### Register-Gated Severity

Before scoring, the audit reads the Brand-vs-Product register. That one call sets the audit-severity dial. On a Brand surface, a generic-but-functional result is a real finding, so blandness scores against Anti-Patterns. On a Product surface, an expressive-but-unclear result is a real finding, so theatrics score against accessibility and consistency. The same observation routes to opposite verdicts depending on posture, which is why the register is resolved first.

### The AI-Tell Catalog

The anti-patterns dimension leans on a model-specific tell catalog. A ghost-card border plus shadow, over-rounded cards, a diagonal stripe background, an image-hover transform, a cream body background: each is a structural pattern a generator reaches for by reflex, turned into a checkable rule. One isolated tell is polish. Three or more on one surface is the dimension failing.

### Styles-Library Utilization

Audit consumes the shared zero-hydration plan through the comparison adapter in [`corpus/`](./corpus/README.md). The mode may select zero to two source-attested references, but the adapter can emit only comparison context and limitations. It cannot represent a severity, score, accessibility or performance proof, copying decision, exact-reuse permission or fix owner.

The authority order is user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. A corpus comparison can sharpen critique, but only target evidence supports an audit verdict.

### Corpus Comparison Lane

The maintainer-only adapter in [`corpus/`](./corpus/README.md) consumes the shared neutral context seam and styles engine without creating another finding class. It returns zero to two source-aware comparison rows labelled non-authoritative context. Intended-anchor drift requires target evidence; no eligible reference becomes `comparison-unavailable`, and the normal audit continues. Corpus material never supplies severity, the `/20` score, accessibility or performance proof, a copying determination, exact-reuse permission or a fix owner.

### Private Procedure Cards

The maintainer-facing cards in [`procedures/`](./procedures/) support mode-local audit focus after the public `audit` mode is chosen. The two cards are `accessibility_audit.md` and `ai_slop_check.md`. They are not user-selectable routes.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Mode

Reach for `audit` when you need a verdict on an existing or planned surface: a release-readiness check, an accessibility gate, a slop review or a production-hardening pass. Use it when someone says a design "looks AI-generated" and you need to prove it with named tells. Skip it when you want to invent a direction, build a token system or write motion, since those belong to the sibling modes.

### Related Skills

| Skill | Relationship |
|---|---|
| `interface` | Owns the direction changes the audit recommends |
| `foundations` | Owns color, type, layout, responsive and theming token fixes |
| `motion` | Owns motion choreography and reduced-motion fixes |
| `sk-code` | Implements every accepted fix after the user approves it |

The comparison lane and its intended-anchor-drift, comparison-unavailable and authority-attack fixtures live in [`corpus/`](./corpus/README.md). They are a maintainer atlas, never a user-facing style gallery.

---

## 6. VERIFICATION

The mode ships a manual testing playbook. Each scenario runs a prompt against the live mode and its on-disk references, then records PASS, PARTIAL, FAIL or SKIP.

| Check | Result |
|---|---|
| Manual playbook | Run the scenarios in [`manual_testing_playbook/`](./manual_testing_playbook/manual_testing_playbook.md). Release is ready when all PASS or SKIP only for a missing target |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-audit/README.md --type readme` reports zero issues |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`references/audit_contract.md`](./references/audit_contract.md) | Severity model, `/20` scoring contract and findings schema |
| [`references/accessibility_performance.md`](./references/accessibility_performance.md) | Accessibility and performance checks with pass and fail numbers |
| [`references/critique_hardening.md`](./references/critique_hardening.md) | Holistic critique, cognitive load, personas and polish |
| [`references/anti_patterns_production.md`](./references/anti_patterns_production.md) | Anti-slop signals, theming drift, copy clarity and production details |
| [`references/ai_fingerprint_tells.md`](./references/ai_fingerprint_tells.md) | Model-specific AI tells turned into checkable P0-P3 findings |
| [`references/transform_remediation.md`](./references/transform_remediation.md) | Register-gated bolder, quieter and distill verbs mapped to findings and owners |
| [`references/evidence_capture.md`](./references/evidence_capture.md) | Target resolution, the three evidence types and confirmed-or-inferred labeling |
| [`references/hardening_edge_cases.md`](./references/hardening_edge_cases.md) | Production-readiness matrix of extreme inputs, errors, concurrency and i18n |
| [`assets/audit_report_template.md`](./assets/audit_report_template.md) | Fill-in findings-first report skeleton with the five-dimension score |
| [`assets/a11y_quick_fixes.md`](./assets/a11y_quick_fixes.md) | Snippet-level accessibility fixes the report cites by reference |
| [`corpus/`](./corpus/README.md) | Maintainer-only non-authoritative comparison adapter and falsification fixtures |
| [`procedures/`](./procedures/) | Two maintainer-facing procedure cards for accessibility audit focus and AI-slop checks |
| [`../shared/register.md`](../shared/register.md) | The Brand-vs-Product register that sets the audit-severity dial |
