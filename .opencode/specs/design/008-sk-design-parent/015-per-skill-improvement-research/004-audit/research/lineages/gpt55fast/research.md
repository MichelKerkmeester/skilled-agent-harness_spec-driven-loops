---
title: "Lineage Research: sk-design audit mode improvements (gpt55fast)"
description: "gpt55fast fan-out lineage synthesis for audit-mode improvement research. Prioritizes small, evidence-backed improvements to routing, benchmark fixtures, evidence worksheets, backlog handoff and score calibration. Research-only; no live skill changes."
trigger_phrases:
  - "gpt55fast audit improvement research"
  - "sk-design audit improvements"
  - "design-audit routing evidence worksheet"
importance_tier: "important"
contextType: "implementation"
---

# Lineage Research: sk-design Audit Mode Improvements (gpt55fast)

This is the `gpt55fast` fan-out lineage synthesis for audit-mode improvement research. It writes only inside this lineage artifact directory and does not modify the live skill.

## 1. Executive Summary

`design-audit` is already one of the most complete `sk-design` children. It has severity-ranked findings, `/20` scoring, evidence rules, a report template, accessibility/performance checks, AI fingerprint tells, hardening probes, transform remediation and shared-register integration. The highest-value improvements are therefore not new broad references. They are small operational fixes that make the existing material load reliably, score consistently and hand off cleanly.

Recommended order:

1. **Fix router correctness first.** The parseable pseudocode keyword loop is not executable as written, and router replay did not load `../shared/register.md` even though audit scoring and transform remediation require it.
2. **Add `design-audit` benchmark fixtures.** Manual scenarios exist, but no checked-in `014-routing-benchmark/design-audit` report was found in this checkout. The operator-provided `82/100` score needs fixtures to become actionable.
3. **Add an audit evidence worksheet.** Existing evidence rules are strong, but audits need a reusable target/evidence/probe ledger that carries confirmed, inferred and not-assessed labels into findings and scores.
4. **Add a backlog handoff asset.** Audit should route accepted findings to `sk-code` without implementing them. A small handoff card would reduce loss between report and implementation.
5. **Add Anti-Patterns score calibration.** The AI tell catalog is concrete; a 0-4 ladder would make the Anti-Patterns dimension more repeatable.

## 2. Method and Provenance

| Item | Value |
| --- | --- |
| Lineage | `gpt55fast` |
| Session | `fanout-gpt55fast-1782532104406-avrwmk` |
| Executor | `cli-opencode` / `openai/gpt-5.5-fast` |
| Iterations | 10/10, converged at configured cap |
| Write boundary | Artifact directory only; parent spec write-back skipped |
| Artifact root handling | Bound directly to configured lineage path; `resolveArtifactRoot` not run |
| Evidence classes | Live audit files, prior 009 research, manual playbook, router replay stdout, benchmark directory check |

Router replay was run against five representative audit prompts:

| Prompt class | Replayed intent(s) | Replayed resources | Result |
| --- | --- | --- | --- |
| Full audit score | `AUDIT_CONTRACT` | `corpus_map`, `audit_contract`, `audit_report_template` | correct core route; missing shared register |
| AI fingerprint | `ANTI_PATTERNS_PRODUCTION` | `corpus_map`, `anti_patterns_production`, `ai_fingerprint_tells` | correct focused route |
| A11y/performance | `ACCESSIBILITY_PERFORMANCE` | `corpus_map`, `accessibility_performance`, `a11y_quick_fixes` | correct focused route |
| Transform after audit | `AUDIT_CONTRACT`, `TRANSFORM_REMEDIATION` | `corpus_map`, `audit_contract`, `audit_report_template`, `transform_remediation` | correct multi-intent route; missing shared register |
| Screenshot-only evidence | `EVIDENCE_CAPTURE` | `corpus_map`, `evidence_capture` | correct focused route |

## 3. Current-State Evidence

`design-audit` already has the core contract:

| Existing capability | Evidence |
| --- | --- |
| Cross-cutting audit purpose with severity findings and `/20` score | `design-audit/SKILL.md:13-16`, `design-audit/SKILL.md:23-31` |
| Resource loading levels for audit contract, shared register, a11y/perf, critique, anti-patterns, AI tells, transform remediation, evidence capture, hardening, report template and quick fixes | `design-audit/SKILL.md:91-104` |
| Workflow: resolve target/register, label evidence, score five dimensions, report by severity, map owners, do not implement during review | `design-audit/SKILL.md:252-266` |
| Rules: evidence for every finding, do not claim accessibility or browser/detector evidence without proof, never bury P0/P1 | `design-audit/SKILL.md:290-319` |
| Severity, five-dimension score, findings schema, evidence rules and report order | `references/audit_contract.md:16-76` |
| Target resolution, source/rendered/design-artifact evidence, browser evidence, deterministic scans and fallback labels | `references/evidence_capture.md:22-109` |
| Fill-in report template with frame, findings, score, owner mapping and residual risks | `assets/audit_report_template.md:20-162` |
| A11y/performance thresholds and quick-fix snippets | `references/accessibility_performance.md:18-91`, `assets/a11y_quick_fixes.md:16-166` |
| AI tell catalog and hardening matrix | `references/ai_fingerprint_tells.md:16-129`, `references/hardening_edge_cases.md:16-143` |
| Register-gated transform remediation | `references/transform_remediation.md:16-108`, `shared/register.md:49-60` |

Prior 009 research already identified and then later phases built most of the obvious audit additions: AI tell catalog, report template, transform remediation, evidence capture, a11y quick fixes and hardening edge cases. Treating those as still-missing would be stale.

## 4. Ranked Improvements

### R1 - Fix Router Keyword Loop and Shared-Register Loading

| Field | Value |
| --- | --- |
| Priority | P1 |
| Effort | S |
| Type | `SKILL.md` routing correctness plus benchmark coverage |
| Evidence | `SKILL.md:126-142` defines weighted keyword lists; `SKILL.md:182-188` loops as if keywords were `(keyword, weight)` tuples; `SKILL.md:91-100` says shared register is ALWAYS loaded; router replay omitted it. |

Why it matters:

- The pseudocode should be executable documentation. As written, `for keyword, weight in cfg["keywords"]:` is incompatible with a list of strings and ignores the configured `weight` field.
- Full audits and transform remediation require register posture. If router output omits `../shared/register.md`, the audit can score a Brand surface like a Product surface or vice versa.
- `_guard_in_skill()` is scoped to `SKILL_ROOT`, so parent shared loading needs an explicit design rather than a naive path entry.

Suggested change shape:

```python
for intent, cfg in INTENT_SIGNALS.items():
    for keyword in cfg["keywords"]:
        if keyword in text:
            scores[intent] += cfg["weight"]
```

For the register, choose one explicit mechanism:

1. Add a parent-shared loader exception for `../shared/register.md` and test it.
2. Have the hub load the register before mode child routing.
3. Add a local audit reference that points to the shared register without duplicating its content.

### R2 - Add `design-audit` Routing Benchmark Fixtures

| Field | Value |
| --- | --- |
| Priority | P1 |
| Effort | S |
| Type | Benchmark/report artifacts |
| Evidence | Manual playbook lists nine scenario families at `manual_testing_playbook.md:11-24`; no files were found under `014-routing-benchmark/design-audit/**` in this checkout. |

Use the five prompts from this lineage as seed fixtures:

| Fixture | Expected intents | Must-load resources |
| --- | --- | --- |
| Full release audit score | `AUDIT_CONTRACT` | `corpus_map`, `audit_contract`, `audit_report_template`, shared register |
| Looks AI-generated | `ANTI_PATTERNS_PRODUCTION` | `anti_patterns_production`, `ai_fingerprint_tells` |
| Keyboard/focus/contrast/jank | `ACCESSIBILITY_PERFORMANCE` | `accessibility_performance`, `a11y_quick_fixes` |
| Make it bolder after audit | `AUDIT_CONTRACT`, `TRANSFORM_REMEDIATION` | `audit_contract`, `transform_remediation`, shared register |
| Screenshot-only evidence | `EVIDENCE_CAPTURE` | `evidence_capture` |

This directly converts the operator-provided `82/100` context into reproducible evidence.

### R3 - Add an Audit Evidence Worksheet

| Field | Value |
| --- | --- |
| Priority | P2 |
| Effort | S-M |
| Type | New asset or report-template adjunct |
| Evidence | Evidence rules are strong in `evidence_capture.md:22-109`; report template has a compact frame at `audit_report_template.md:20-32`; dimensions are scored at `audit_report_template.md:112-125`. |

Recommended asset: `assets/audit_evidence_worksheet.md`.

Minimum fields:

| Section | Fields |
| --- | --- |
| Target | resolved file/URL/screenshot/design artifact; register; why this target was chosen |
| Evidence inventory | source/rendered/design-artifact; available/missing; timestamp; command/tool if any |
| Deterministic scans | scan name; target; result; pass/fail/error/skipped; cited measurement |
| Hardening probes | probe; pass/fail/skip/inferred; evidence; impact if failed |
| Dimension coverage | Accessibility, Performance, Responsive, Theming, Anti-Patterns evidence status |
| Finding handoff | finding id; confirmed/inferred; source lines or rendered observation; what would confirm remaining uncertainty |

Why it matters:

- It prevents a score from being written before evidence status is known.
- It makes `not assessed` an explicit outcome instead of an afterthought.
- It gives reviewers a durable audit trail without adding automation.

### R4 - Add an Audit Backlog Handoff Asset

| Field | Value |
| --- | --- |
| Priority | P2 |
| Effort | S |
| Type | New asset |
| Evidence | Report template has owner mapping at `audit_report_template.md:129-140`; quick fixes state audit cites fixes and `sk-code` applies them at `a11y_quick_fixes.md:161-166`. |

Recommended asset: `assets/audit_backlog_handoff.md`.

Minimum fields:

| Field | Purpose |
| --- | --- |
| Finding id and severity | preserves priority |
| Owner | `interface`, `foundations`, `motion`, `sk-code`, or `sk-code-review` |
| Target | file/route/component/selector |
| Evidence | source/rendered/design artifact plus confirmed/inferred label |
| Accepted fix shape | one-sentence change, not implementation details |
| Verification | manual check, deterministic scan, package/test command or residual risk |

This keeps the audit deliverable actionable while preserving the rule that audit does not apply fixes.

### R5 - Add Anti-Patterns Score Calibration

| Field | Value |
| --- | --- |
| Priority | P2 |
| Effort | S |
| Type | Section in `ai_fingerprint_tells.md`, `anti_patterns_production.md`, or small asset |
| Evidence | AI tell catalog has clear severity rules at `ai_fingerprint_tells.md:22-30`; `/20` score contract defines Anti-Patterns 0/2/4 bands at `audit_contract.md:29-47`. |

Proposed ladder:

| Anti-Patterns score | Calibration |
| --- | --- |
| 4 | No obvious model-specific tells, no generic layout grammar, distinctive enough for the resolved register. |
| 3 | One isolated P3 tell or minor generic choice, not identity-defining. |
| 2 | One P2 tell, repeated low-grade generic pattern, or weak register fit with workaround. |
| 1 | Three or more tells, systemic generic identity, or register mismatch that materially weakens trust or clarity. |
| 0 | Anti-pattern directly blocks task completion, causes accessibility failure, or makes the UI unusable/untrustworthy. |

This does not replace severity. It only makes the Anti-Patterns dimension repeatable.

### R6 - Update Manual Playbook to Require Replay and Worksheet Evidence

| Field | Value |
| --- | --- |
| Priority | P3 |
| Effort | S |
| Type | Manual testing playbook update |
| Evidence | Manual playbook currently requires prompt, target, resources, findings, score, owner mapping and caveats at `manual_testing_playbook.md:35-44`. |

Suggested addition:

- For routing scenarios, record router replay input, intents, resources and missing resources.
- For report scenarios, attach or fill the evidence worksheet.
- For hardening scenarios, mark each probe pass/fail/skip/inferred.
- For transform scenarios, record the resolved register and why the chosen verb follows from it.

## 5. Eliminated Alternatives

| Approach | Reason eliminated |
| --- | --- |
| Add another accessibility basics reference | Existing a11y/performance and quick-fix coverage is already detailed and numerically grounded. |
| Duplicate critique or hardening prose | Existing narrative and matrix references split the job well. |
| Build overlay/detector automation into audit | Evidence rules forbid claiming browser, overlay or detector results unless actually run; automation is separate from this research. |
| Let audit implement fixes | Violates the audit boundary; accepted implementation belongs to `sk-code`. |
| Bulk-import the external corpus | Prior 009 research already rejected volume in favor of cards, checklists and decision references. |
| Create a new audit child skill | Current audit mode already owns the cross-cutting QA surface; new taxonomy would fragment ownership. |
| Treat clean scans as release proof | Current rules correctly state a clean scan is not proof of strong design. Keep that limitation. |

## 6. Open Implementation Questions

1. **Shared register loading mechanism.** Should `design-audit` router get an explicit parent-shared resource exception, should the hub pre-load the register, or should audit keep a local pointer asset? Recommendation: prefer a parent-shared loader or hub pre-load so the register remains authored once.
2. **Benchmark scoring target.** Once fixtures exist, decide whether the target is restoring the operator-provided `82/100` to a higher threshold or simply preventing known regressions. Recommendation: use per-fixture pass criteria first, aggregate score second.
3. **Worksheet home.** `audit_evidence_worksheet.md` could be a standalone asset or folded into `audit_report_template.md`. Recommendation: standalone asset, then reference it from the report template, to avoid bloating the common report skeleton.

## 7. Recommended Implementation Sequence

1. **Router correctness patch.** Fix the keyword loop and choose/register-test shared-register loading.
2. **Benchmark fixture packet.** Add `014-routing-benchmark/design-audit` fixtures for the five replay prompts and capture the new score.
3. **Evidence worksheet asset.** Add `assets/audit_evidence_worksheet.md` and wire it into loading levels/manual playbook.
4. **Backlog handoff asset.** Add `assets/audit_backlog_handoff.md` and cite it from report template owner mapping.
5. **Anti-Patterns score ladder.** Add the compact ladder to the AI tell or anti-pattern reference.
6. **Manual playbook update.** Require replay output, worksheet evidence and register rationale where relevant.

## 8. Source Notes and Limitations

- The exact `82/100` routing score is operator-provided context. This lineage did not find a checked-in `design-audit` benchmark report under packet 014.
- Router replay stdout was captured in `logs/fanout-lineage.out` and state JSONL.
- The broad grep over `.opencode/specs` failed earlier with `Ripgrep JSON record exceeded 65536 bytes`; targeted reads/globs were used for load-bearing claims.
- No live skill files were modified by this lineage.

## 9. Final Lineage Output

This lineage recommends a small, high-leverage follow-up packet. The safest P1 bundle is router correctness plus benchmark fixtures. The strongest P2 bundle is evidence worksheet plus backlog handoff plus Anti-Patterns score ladder. Avoid broader content expansion unless new benchmark evidence shows a specific gap.
