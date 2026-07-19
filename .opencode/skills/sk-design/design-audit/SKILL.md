---
name: design-audit
description: Design QA and critique: accessibility, performance, responsive, theming, anti-slop detection, scoring, production hardening.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.2
metadata:
  author: OpenCode
  family: sk-design
---

<!-- Keywords: audit, design-audit, accessibility, performance, responsive, theming, critique, polish, hardening, anti-slop, P0-P3, design-quality-score -->

# Design Audit (audit)

`audit` is the cross-cutting QA and critique MODE child of the `sk-design` family. It reviews built or planned interfaces for accessibility, performance, responsive behavior, theming, anti-patterns, design quality, and production hardening. It reports severity-ranked findings and a 5-dimension `/20` score.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the request involves:
- Auditing or critiquing a UI, design plan, component, page, or design-system output.
- Checking accessibility, contrast, keyboard navigation, focus, forms, ARIA, or WCAG compliance.
- Reviewing animation performance, load performance, responsive behavior, touch targets, or production readiness.
- Detecting AI-generated design slop, theming drift, token misuse, hard-coded values, or generic patterns, including the model-specific tell catalog for OpenCode, Gemini and 2026-general fingerprints.
- Routing a bolder, quieter, distill or redesign direction to the right owner once a finding names the problem.
- Producing a findings-first design quality report with P0-P3 severity and a `/20` score, including the fill-in report template.

Keyword triggers: `audit design`, `critique UI`, `design review`, `review the UI`, `accessibility audit`, `WCAG`, `WCAG contrast`, `performance audit`, `hardening`, `polish pass`, `responsive QA`, `anti-slop`, `looks AI-generated`, `AI tell`, `should it be bolder`, `should it be quieter`, `should it be clearer`, `distill`, `quality score`, `P0`, `P1`.

### When NOT to Use

Skip this skill when:
- The user wants to invent a new visual direction. Use `interface`.
- The user wants a static token system, palette, typography, or layout plan. Use `foundations`.
- The user wants to create motion choreography. Use `motion`.
- The user wants implementation after findings are accepted. Hand off to `sk-code`.
- The user asks for a code review outside design/UI concerns. Use `sk-code`'s code-review mode.

### Family Boundary

This is an independently invokable member of the `sk-design` family. It owns review, scoring, severity, risk surfacing, and hardening. It may cite sibling standards but does not replace them.

Pairs well with:
- `interface` after a direction or build needs critique.
- `foundations` when token/theming/layout findings need a system fix.
- `motion` when motion-performance findings need choreography repair.
- `sk-code`'s code-review mode when the UI change also needs code correctness/security review.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route by audit mode:

Route here when the request is evaluative: audit, review, critique, release readiness, accessibility, WCAG contrast, quality score, AI-template risk, production hardening, or a "should it be ..." transform question. Make-frame prompts such as "make it bolder" or "make this less generic" route to `interface`; static fixes named by findings route to `foundations` or `motion` only after audit maps owners. `polish` routes here when it means a review or release gate, and to a sibling only when the user already names the fix owner.

```text
DESIGN QA TASK
    |
    +- Full audit / score / release readiness -> references/audit-contract.md
    +- A11y or motion/load perf -> references/accessibility-performance.md
    +- Critique / cognitive load / persona / polish -> references/critique-hardening.md
    +- Edge cases / copy / pseudo-elements / production -> references/anti-patterns-production.md
```

### Phase Detection

```text
DESIGN QA TASK
    |
    +- STEP 0: Detect audit mode (contract / a11y-perf / critique-harden / anti-pattern)
    +- STEP 1: Score intents (top-2 when scores are close)
    +- Phase 1: Resolve target and state evidence available vs missing
    +- Phase 2: Findings + five-dimension scoring
    +- Phase 3: Owner mapping and verification
```

### Resource Domains

- `references/audit-contract.md` defines the P0-P3 severity model, 5-dimension `/20` scoring contract, output format, and evidence rules.
- `references/accessibility-performance.md` covers accessible names, keyboard, focus, semantics, forms, announcements, contrast, motion performance, Core Web Vitals, and measurement.
- `references/critique-hardening.md` covers critique workflow, cognitive load, Nielsen heuristics, personas, polish, edge cases, i18n, error states, and resilience.
- `references/anti-patterns-production.md` covers slop detection, theming drift, token misuse, pseudo-elements, View Transitions, copy clarity, and production hardening.
- `assets/ai-fingerprint-registry.json` mirrors the model-specific tell catalog as one machine-checkable row per tell.
- `assets/ai-fingerprint-self-defect-card.md` carries one self-audit prompt per registry row.
- `../shared/scripts/ai-fingerprint-registry-check.mjs` validates catalog-to-registry parity and fixture-id shape before registry changes ship.
- `references/corpus-map.md` maps the source corpus.
- `../shared/sk-code-handoff.md` defines the accepted-finding backlog handoff to `sk-code`.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any audit or critique | `references/corpus-map.md`, `references/audit-contract.md` |
| ALWAYS | Set the audit-severity posture | `../shared/register.md` (the audit-severity dial weights findings by Brand-vs-Product posture) |
| ALWAYS | Any audit or design-readiness task | `../shared/context-loading-contract.md` (register-first gate, context manifest, the four proof fields incl. audit evidence, and the hard gates that block release/accessibility claims) |
| CONDITIONAL | Accessibility or performance concern | `references/accessibility-performance.md` |
| CONDITIONAL | Holistic critique, UX score, persona, polish, hardening | `references/critique-hardening.md` |
| CONDITIONAL | Slop, theming, pseudo-elements, copy clarity, production details | `references/anti-patterns-production.md` |
| CONDITIONAL | Detecting model-specific AI tells | `references/ai-fingerprint-tells.md`, `assets/ai-fingerprint-registry.json`, `assets/ai-fingerprint-self-defect-card.md` (OpenCode, Gemini, 2026-general fingerprints as checkable findings with structured rows and self-defect prompts) |
| CONDITIONAL | Routing a bolder, quieter or simpler request | `references/transform-remediation.md` (register-gated transform verbs mapped to findings and owners) |
| CONDITIONAL | Resolving the target and labeling evidence | `references/evidence-capture.md` (target resolution, browser and deterministic evidence, fallback labels) |
| CONDITIONAL | Carrying confirmed, inferred and not-assessed labels into findings and scores | `assets/audit-evidence-worksheet.md` (target, evidence inventory, dimension coverage, probes and finding handoff rows) |
| CONDITIONAL | Calibrating the Anti-Patterns dimension | `assets/anti-patterns-score-rubric.md` (0 to 4 ladder for model tells and generic design risk) |
| CONDITIONAL | Production-readiness and edge-case probes | `references/hardening-edge-cases.md` (extreme inputs, errors, permissions, concurrency, i18n and RTL, text expansion, CJK and emoji) |
| CONDITIONAL | Producing the audit report | `assets/audit-report-template.md` (fill-in 5-dimension score plus P0-P3 findings) |
| CONDITIONAL | Comparing against an intended or contextual corpus reference | `corpus/README.md` and `corpus/comparison-lane.mjs` (zero to two non-authoritative references, drift context and evidence labels) |
| CONDITIONAL | Citing the snippet-level accessibility fix | `assets/a11y-quick-fixes.md` (accessible names, keyboard, focus, semantics, forms, announcements, contrast, motion) |
| CONDITIONAL | Routing accepted findings to sk-code | `../shared/sk-code-handoff.md` (backlog handoff card, routes only and applies nothing) |
| CONDITIONAL | Internal procedure support | `procedures/accessibility-audit.md`, `procedures/ai-slop-check.md`, and `../shared/procedures/polish-gate-orchestration.md` when the trigger matches |
| ON_DEMAND | Code correctness beyond UI quality | `sk-code` code-review mode (findings-first baseline + router-selected surface evidence) |

The private procedure-card selection table in Section 3 is part of this routing contract: after the public `audit` mode is selected, choose at most one card from `procedures/` or `../shared/procedures/` and cite its relative path in the plan or proof line.

### Smart Router Pseudocode

#### Smart Router (Resilience Pattern)

> Pattern: see [sk-doc smart-router resilience template](../../sk-doc/create-skill/assets/skill/skill_smart_router.md) for the full runtime discovery, guarded load, routing-key, and fallback reference.

The router fills in this skill's a11y/perf/critique/harden `INTENT_SIGNALS`, `RESOURCE_MAP`, loading levels, and routing key while keeping the resilience mechanics unchanged: discover resources at runtime, guard every path before loading, derive a routing key from the audit mode or task, and return an `UNKNOWN_FALLBACK` checklist when confidence is too low.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards, checks `inventory`, and suppresses repeats with `seen`.
- Pattern 3: Extensible Routing Key - audit-mode intent labels route to keyed folders without static inventories.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests disambiguation and missing keyed families return a "no knowledge base" notice.

The full implementation — the keyword-weighted `classify_intents()`, `INTENT_SIGNALS`/`RESOURCE_MAP`/`LOAD_LEVELS` tables, the routing-key-derived keyed-folder lookup, and the existence-guarded `_guard_in_skill()`/`load_if_available()` loader (which routes both `.md` references and the `.json` fingerprint registry) — lives in [`references/smart-router-pseudocode.md`](references/smart-router-pseudocode.md). Read it before implementing or modifying routing logic; this section is the contract, that file is the code.

---

## 3. HOW IT WORKS

### Audit Workflow

1. Resolve the target and the register: source files, URL, screenshot, design plan or rendered UI evidence, then read `../shared/register.md` so the audit-severity dial weights findings by Brand-vs-Product posture. `references/evidence-capture.md` owns target resolution.
   **Ready-claim gate:** before any ready, release, or accessibility claim, complete the five-dimension score with evidence labels (`confirmed`, `inferred`, `not-assessed`) per `references/audit-contract.md`; reuse `assets/audit-evidence-worksheet.md` to carry those labels into findings and scores.
2. State evidence available and evidence missing. A visual claim needs visual evidence or a clear caveat. A finding read from real evidence is confirmed, while a finding from a screenshot alone is inferred.
3. Score the five audit dimensions 0-4 each:
   - Accessibility.
   - Performance.
   - Responsive Design.
   - Theming.
   - Anti-Patterns. Detect model-specific tells with `references/ai-fingerprint-tells.md` and probe production readiness with `references/hardening-edge-cases.md`.
4. Produce a findings-first report ordered by P0, P1, P2, P3. Use `assets/audit-report-template.md` for the fill-in skeleton.
5. Map each finding to the owning sibling or implementation skill. Route a bolder, quieter, distill or redesign direction through `references/transform-remediation.md` first, because the correct direction depends on the register.
6. End with recommended next actions; do not silently implement fixes during a review-only request.

### Procedure Card Selection

After the hub selects the public `audit` mode, choose at most one primary private procedure card and cite it by relative path in the plan or proof line. These cards support audit focus; they are not public routes.

| Request shape | Procedure card | Proof to cite |
| --- | --- | --- |
| Accessibility, WCAG, inclusive design, contrast, keyboard, focus, form, or release-readiness review | `procedures/accessibility-audit.md` | Coverage of contrast/color, semantics, keyboard/focus, motion/forms/miscellaneous, evidence labels, and unresolved confirmation needs. |
| AI-template risk, generic visual language, over-decoration, slop, or model-tell review | `procedures/ai-slop-check.md` | Detected pattern, evidence location or artifact, severity, owner, and concrete fix direction. |
| Full pre-delivery polish spanning multiple design dimensions | `../shared/procedures/polish-gate-orchestration.md` | Consolidated blockers, quality issues, polish notes, and owner mapping. |

If no procedure card matches, state `Procedure applied: none - baseline audit workflow` and continue with the audit contract, five-dimension score, and findings-first report. Do not load every procedure card for a single request.

### Context, Proof, And Direct Fallback

Record the context basis before findings: public mode `audit`, loaded references, selected procedure card or no-procedure fallback, target artifact, available evidence, missing evidence, audit bar, and whether the score is full or focused. Before a ready, release, or accessibility claim, include proof naming the selected procedure card, evidence labels, dimensions covered, and what remains not assessed.

This mode must run directly with Read, Glob, and Grep only. If subagents are unavailable or disallowed, do not dispatch; execute the same procedure selection, context capture, and proof checks in the current session. The fallback keeps the same proof bar and cannot rely on Write, Edit, Bash, or Task. This includes `scripts/perf_evidence_check.py` and `scripts/polish_readiness_check.py`: they need Bash and are never invoked by this mode, direct or subagent; they run downstream, whenever a human reviewer, CI job, or Bash-capable skill has a saved copy of the filled-in report.

### Backlog Handoff To sk-code

When accepted findings move to implementation, emit the shared handoff envelope from `../shared/sk-code-handoff.md` as a backlog card. Each finding includes id, severity, owner, target, evidence label, one-line fix shape and verification. An audit with zero accepted findings emits an empty valid backlog. The audit never applies fixes, edits files or grants write authority.

### Non-Authoritative Corpus Comparison

`corpus/comparison-lane.mjs` is a distinct context lane, not a target-evidence class. It validates the neutral shared context plan, queries the styles engine, and accepts zero to two mode-selected comparison references. Every reference carries generation, content identity, provenance, rights state and an explicit non-authoritative evidence label. Hydrated prose, token values, assets and screenshots are discarded before output.

An intended-anchor row may describe `aligned`, `intentional-delta` or `unexplained-drift`, but drift requires an actually owned anchor and labelled target evidence. With no eligible reference, emit `comparison-unavailable` and continue the audit on target evidence. Corpus context never assigns P0-P3 severity, contributes to the `/20` score, proves accessibility or performance, establishes copying, authorizes exact reuse or owns remediation. When corpus context conflicts with target evidence, target evidence wins.

The audit mode remains Read/Glob/Grep-only. Execution belongs to a Bash-capable
`sk-code` OpenCode runtime consumer: that consumer imports
`corpus/comparison-lane.mjs`, calls `buildAuditComparisonLane()` with the closed
typed comparison envelope, and returns the validated JSON result to this mode.
The consumer is transport, not audit authority; it cannot add verdicts, scores,
owners, or source prose. The Node test harness imports and executes the same
public function, proving the runtime seam is reachable without granting this
mode Bash.

### Severity Model

Use the same findings-first spirit as `sk-code`'s code-review mode: concrete evidence, severity order, impact, and recommended fix.

| Severity | Meaning | Release effect |
| --- | --- | --- |
| P0 Critical | Prevents task completion, blocks access, creates severe WCAG failure, or makes UI unusable | Must fix immediately |
| P1 High | Significant user difficulty, WCAG AA violation, broken responsive behavior, severe jank, or systemic token drift | Fix before release |
| P2 Medium | Annoyance or quality issue with a workaround, localized performance issue, minor inconsistency | Fix in next pass |
| P3 Polish | Nice-to-fix detail with low user impact | Fix if time permits |

### 5-Dimension Score

Each dimension scores 0-4. Total `/20` rating:
- `18-20` Excellent: minor polish only.
- `14-17` Good: address weak dimensions.
- `10-13` Acceptable: significant work needed.
- `6-9` Poor: major overhaul.
- `0-5` Critical: fundamental issues.

---

## 4. RULES

### ✅ ALWAYS

1. Present findings before summary when doing a review or audit.
2. Include evidence for every actionable finding: file/line, rendered behavior, prompt output, screenshot observation, or explicit limitation.
3. Score all five dimensions for full audits; mark a dimension `not assessed` only when evidence is unavailable and explain why.
4. Apply accessibility minimums first: accessible names, keyboard access, focus, semantics, forms, announcements, contrast, and reduced motion.
5. Separate design critique from deterministic findings; both can matter, but label the evidence type.
6. Explain user impact, not just rule violation.
7. Map each fix to the right owner: foundations, motion, interface, spec/extraction, or code implementation.
8. Celebrate positive findings briefly so teams know what to preserve.
9. Cite the selected procedure card or no-procedure fallback before substantial audit output when a private procedure trigger matches.
10. Keep every corpus comparison labelled non-authoritative, bounded to zero to two references, and subordinate to target evidence and deterministic checks.

### ⛔ NEVER

1. Never report vague issues without location, impact, and fix.
2. Never claim a design is accessible without keyboard, focus, name, semantics, and contrast evidence.
3. Never treat a clean automated scan as proof of strong design.
4. Never score generously to avoid criticism; a `4` means genuinely excellent.
5. Never bury a P0/P1 under polish comments.
6. Never invent browser, screenshot, or detector evidence.
7. Never recommend a sibling skill when it addresses zero findings.
8. Never derive severity, score, accessibility, performance, copying, reuse authorization or fix ownership from corpus evidence.

### ⚠️ ESCALATE IF

1. The target cannot be resolved to a file, URL, screenshot, or concrete design artifact.
2. Visual evidence is required but unavailable and the score would be misleading.
3. Accessibility or performance findings imply high-impact implementation changes outside design scope.
4. Brand or legal constraints conflict with accessibility or production hardening.

---

## 5. REFERENCES

### Core References

- [`references/audit-contract.md`](references/audit-contract.md) - Severity, `/20` score, findings schema, and audit output contract.
- [`references/accessibility-performance.md`](references/accessibility-performance.md) - Accessibility and performance checks.
- [`references/critique-hardening.md`](references/critique-hardening.md) - Holistic critique, cognitive load, personas, polish, and hardening.
- [`references/anti-patterns-production.md`](references/anti-patterns-production.md) - Anti-slop, theming, pseudo-elements, copy clarity, and production details.
- [`references/ai-fingerprint-tells.md`](references/ai-fingerprint-tells.md) - Model-specific AI tells turned into checkable P0-P3 findings.
- [`references/transform-remediation.md`](references/transform-remediation.md) - Register-gated directional verbs mapped to findings and owners.
- [`references/evidence-capture.md`](references/evidence-capture.md) - Target resolution, browser and deterministic evidence, screenshot and overlay notes, fallback labels.
- [`references/hardening-edge-cases.md`](references/hardening-edge-cases.md) - Production-readiness matrix of extreme inputs, errors, permissions, concurrency, i18n and RTL, text expansion, CJK and emoji.
- [`references/corpus-map.md`](references/corpus-map.md) - Source traceability for the distilled corpus.
- [`references/smart-router-pseudocode.md`](references/smart-router-pseudocode.md) - Implementation behind Section 2's smart router: intent classifier, resource map, and the `.md`/`.json` existence-guarded loader.
- [`../shared/sk-code-handoff.md`](../shared/sk-code-handoff.md) - Shared sk-code handoff envelope. Audit uses it for accepted-finding backlog handoff without applying fixes.
- [`corpus/README.md`](corpus/README.md) - Maintainer-only comparison-lane contract, drift/unavailable fixture atlas, non-authority guards and verification command.
- [`procedures/accessibility-audit.md`](procedures/accessibility-audit.md) - Private support for accessibility-focused audit passes.
- [`procedures/ai-slop-check.md`](procedures/ai-slop-check.md) - Private support for AI-template and generic-design risk review.
- [`../shared/procedures/polish-gate-orchestration.md`](../shared/procedures/polish-gate-orchestration.md) - Shared private final-polish orchestration when audit owns the review verdict.

### Assets

- [`assets/audit-report-template.md`](assets/audit-report-template.md) - Fill-in findings-first report with the five-dimension `/20` score, anti-pattern verdict, owner mapping, and evidence caveats.
- [`assets/a11y-quick-fixes.md`](assets/a11y-quick-fixes.md) - Snippet-level accessibility fixes the report cites by reference; the audit names the fix, `sk-code` applies it.
- [`assets/audit-evidence-worksheet.md`](assets/audit-evidence-worksheet.md) - Fill-in worksheet that carries confirmed, inferred and not-assessed labels into findings and scores.
- [`assets/anti-patterns-score-rubric.md`](assets/anti-patterns-score-rubric.md) - Anti-Patterns 0 to 4 calibration ladder for full audits.

### Parent Shared Base

Use, do not duplicate, the parent references for shared vocabulary:
- [`../shared/register.md`](../shared/register.md) - The Brand-vs-Product register that sets the audit-severity dial; outside this mode's scope, so cited explicitly.
- `../shared/anti-slop-principles.md`
- `../shared/design-token-vocabulary.md`
- `../shared/cognitive-laws.md`

---

## 6. SUCCESS CRITERIA

- Audit output is findings-first, severity-ordered and evidence-backed, with each finding labeled confirmed or inferred.
- The register is resolved before scoring so the audit-severity dial weights findings by Brand-vs-Product posture.
- Full audits include the five-dimension `/20` score or explicit caveats for unassessed dimensions. The fill-in report template carries the structure when a full report is requested.
- Accessibility, performance, responsive, theming and anti-patterns are all considered, with model-specific tells and production-readiness edge cases checked where they apply.
- Findings map to concrete next actions and owning skills, with directional remediation routed by register.
- No positive completion or release-readiness claim is made from missing evidence.
- Accepted findings route through a backlog handoff card and preserve the audit-never-fixes boundary.
- The selected private procedure card is cited by relative path, or the no-procedure fallback is explicitly stated.
- Direct execution with Read, Glob, and Grep can produce the same context/proof result without subagent dispatch.
- Corpus comparison, when used, stays at zero to two references, labels drift as context requiring target evidence, and treats `comparison-unavailable` as valid evidence.

---

## 7. INTEGRATION POINTS

- `sk-design` routes audit, critique, and hardening prompts here.
- `interface` owns direction changes recommended by critique.
- `foundations` owns color, type, layout, responsive, and theming fixes.
- `motion` owns motion choreography fixes.
- `sk-code` implements accepted fixes.
- `sk-code`'s code-review mode handles broader code correctness, security, and test-quality review.

---

## 8. REFERENCES AND RELATED RESOURCES

Manual validation scenarios live in `manual-testing-playbook/manual-testing-playbook.md`. Release notes live in `changelog/`; the latest is `changelog/v1.0.0.0.md`.
