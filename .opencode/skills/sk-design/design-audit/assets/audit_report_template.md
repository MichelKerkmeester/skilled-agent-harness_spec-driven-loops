---
title: Audit Report Template
description: Fill-in audit report skeleton. Findings-first, with a five-dimension score out of 20, an AI-default verdict, P0-P3 issues, owner mapping and evidence caveats.
trigger_phrases:
  - "audit report template"
  - "design audit report"
  - "fill in audit report"
  - "design quality report skeleton"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Audit Report Template

Copy this skeleton and fill it in for one audited surface. Findings come first, the score is a summary of the findings, and the deliverable stops at reporting. The audit names what is wrong and who owns the fix. It does not implement the fix, which belongs to `sk-code` after the user accepts the recommendations. Severity and scoring rules live in `../references/audit_contract.md`. Resolve the surface register before scoring so dimension weighting is correct: `../../shared/assets/register_card.md`.

---

## 1. SET THE FRAME

Fill this before any finding so the reader knows what was looked at and what was not.

| Field | Answer |
|---|---|
| Surface audited (page / route / file) | `__________` |
| Register (Brand or Product) | [ ] Brand (design IS the product) [ ] Product (design SERVES the product) |
| Evidence available | [ ] source code [ ] rendered page [ ] screenshot [ ] design plan only |
| Evidence missing | `__________` (state what could not be checked) |
| Audit date | `__________` |

Register sets the audit-severity weighting. Brand weights distinctiveness and voice, so a generic-but-functional surface is a real finding. Product weights affordance, accessibility and consistency, so an expressive-but-unclear surface is a real finding.

---

## 2. ANTI-PATTERNS VERDICT

Start here, because it is the question the rest of the report answers. Be blunt.

| Question | Answer |
|---|---|
| Could someone say "AI made that" with no doubt? | [ ] yes (fail) [ ] borderline [ ] no (pass) |
| Tell count | `____` tells |
| Named tells observed | `__________` |

Map tells to findings using `../references/ai_fingerprint_tells.md`. A clean verdict here is not proof of a strong design, only proof of no obvious tells. Distinctiveness, hierarchy and flow still need judgment.

---

## 3. FINDINGS BY SEVERITY

List findings before the score. Order P0, then P1, then P2, then P3. Use the findings schema from `../references/audit_contract.md`. One finding per issue. Do not bury a P0 under polish.

### P0 Critical

```markdown
### P0 - <short title>
- Evidence: <file/line, rendered observation, design-artifact note>
- Category: <Accessibility / Performance / Responsive / Theming / Anti-Patterns>
- Impact: <how a real user fails, is blocked or abandons>
- Recommended fix: <the change, not the implementation>
- Owner: <foundations / motion / interface / sk-code>
```

### P1 High

```markdown
### P1 - <short title>
- Evidence: <...>
- Category: <...>
- Impact: <...>
- Recommended fix: <...>
- Owner: <...>
```

### P2 Medium

```markdown
### P2 - <short title>
- Evidence: <...>
- Category: <...>
- Impact: <...>
- Recommended fix: <...>
- Owner: <...>
```

### P3 Polish

```markdown
### P3 - <short title>
- Evidence: <...>
- Category: <...>
- Impact: <...>
- Recommended fix: <...>
- Owner: <...>
```

If a finding rests on an inference rather than direct observation, label it inferred and state what would confirm it. Do not claim a browser scan, overlay or detector ran unless it actually ran.

---

## 4. POSITIVE FINDINGS

Name what works so the team knows what to keep. Two to four items is enough.

- `__________`
- `__________`
- `__________`

---

## 5. FIVE-DIMENSION SCORE

Score each dimension 0 to 4 from the findings above. The score summarizes the findings, it does not replace them. Full rubric is in `../references/audit_contract.md`.

| # | Dimension | Score (0-4) | Key finding |
|---|---|---|---|
| 1 | Accessibility | `__` | `__________` |
| 2 | Performance | `__` | `__________` |
| 3 | Responsive Design | `__` | `__________` |
| 4 | Theming | `__` | `__________` |
| 5 | Anti-Patterns | `__` | `__________` |
| | **Total** | **`__`/20** | **`__________`** (rating band) |

Rating bands: `18-20` Excellent, `14-17` Good, `10-13` Acceptable, `6-9` Poor, `0-5` Critical. Do not score generously to soften the report. A 4 means genuinely excellent.

### Performance Evidence

Fill this whenever the Performance dimension above scores higher than 2. A Performance score above 2 is an optimize claim, and an optimize claim needs a measured number or an honest not-assessed label. Prose alone is not enough.

| Field | Answer |
|---|---|
| Metric | `__________` (LCP, INP, CLS, frame time, bundle weight, request count or another named metric) |
| Baseline | `__________` (number + unit, or `not-assessed`) |
| Post-change | `__________` (number + unit, `not-assessed`, or `n/a - report only`) |
| Evidence type | [ ] measured (name the tool and run) [ ] static-risk (no metric captured) |
| Static-risk label | `__________` (the static risk to record when no metric was measured) |
| Measurement needed | `__________` (the exact measurement that would confirm the claim) |

Rule: a Performance score above 2 must carry a numeric metric in Baseline or Post-change, or the explicit `not-assessed` label in the filled evidence fields. The deterministic check confirms that the number or label is present; whether the number is a true measurement stays a judgment call. Evidence model: `../references/accessibility_performance.md` §5 and `../references/evidence_capture.md` §6.

Deterministic check: `../scripts/perf_evidence_check.py <filled-report.md>`.

---

## 6. OWNER MAPPING

Group the findings by who owns the fix. The audit routes work, it does not do the work.

| Owner | What they own | Findings routed here |
|---|---|---|
| `interface` | Overall direction, signature visual concept | `__________` |
| `foundations` | Color, type, spacing, layout, responsive, theming tokens | `__________` |
| `motion` | Choreography, micro-interactions, reduced motion | `__________` |
| `sk-code` | Implementation of every accepted fix | `__________` |

Direction findings go to interface. Color, type, layout and theming findings go to foundations. Motion findings go to motion. All implementation goes to sk-code once the user accepts the recommendations. For directional remediation verbs (bolder, quieter, distill), route through `../references/transform_remediation.md` first, because the correct direction depends on the register.

---

## 7. RECOMMENDED NEXT ACTIONS

List the actions in priority order, P0 first. Each action names one owner and one concrete next step.

1. `__________`
2. `__________`
3. `__________`

---

## 8. EVIDENCE LIMITS AND RESIDUAL RISK

Close honestly. State what the audit could not verify and what would close the gap.

- Could not verify: `__________`
- Would confirm with: `__________`
- Residual risk if shipped as-is: `__________`

A report that hides its blind spots is worse than a report that names them.
