# Focus

[D1-1 / D1] impeccable harden/optimize/polish flows: residual audit craft not yet crosswalked into `design-audit`.

This pass used the real corpus paths under `external/impeccable-main/site/content/skills/`. The prompt's shorthand paths (`harden.md`, `optimize.md`, `polish.md`) are not files at the corpus root; the actual source files are nested under `site/content/skills/`.

# Actions Taken

1. Confirmed the research strategy scope and questions. The strategy says the run is research-only, one angle per iteration, and every claim must be verified against on-disk files (`deep-research-strategy.md:20-24`, `deep-research-strategy.md:34-39`, `deep-research-strategy.md:45-48`).
2. Located the actual impeccable source files and read `harden.md`, `optimize.md`, and `polish.md` with line numbers.
3. Read the current `design-audit` packet: `SKILL.md`, `audit_contract.md`, `accessibility_performance.md`, `critique_hardening.md`, `anti_patterns_production.md`, `hardening_edge_cases.md`, `evidence_capture.md`, `audit_report_template.md`, `audit_evidence_worksheet.md`, and `corpus_map.md`.
4. Crosswalked source-flow obligations against current audit outputs and references, separating deterministic report-contract gaps from advisory runtime craft.

# Findings

## F1 - Optimize's metric proof is softened in `design-audit`

Evidence:
- `optimize.md` defines the flow around measurable performance: LCP, INP, CLS, rendering, animation, images/assets, and bundle size (`optimize.md:13-21`).
- It explicitly says the skill measures before and after, quantifies every fix, and rolls back changes that do not move a metric (`optimize.md:21`).
- Its pitfalls reject vibe-based optimization and require specific Web Vitals numbers and re-measurement (`optimize.md:54-56`).
- `design-audit` has the right performance categories and thresholds (`accessibility_performance.md:74-85`) and evidence caveats (`accessibility_performance.md:105-107`), but the audit report frame only asks for generic evidence availability (`audit_report_template.md:20-31`) and the score table has no baseline/delta fields for LCP, INP, CLS, bundle size, or static-risk status (`audit_report_template.md:112-125`).

Buildable recommendation:
- Add a `Performance Evidence` block to `design-audit/assets/audit_report_template.md` with fields for baseline metrics, post-change metrics when applicable, static-risk-only label, and "measurement needed to confirm".
- Add a rule in `design-audit/references/accessibility_performance.md`: a Performance score of 3-4 or any "performance-ready" claim requires confirmed metrics or an explicit not-assessed/static-risk caveat.
- Add a report validator later that fails full audit reports where Performance is scored above 2 without at least one numeric metric or an explicit `not-assessed/static-risk` label.

Enforceability:
- ENFORCEABLE on generated audit reports: a deterministic validator can check for metric fields, numeric values, or explicit not-assessed/static-risk labels.
- ADVISORY at runtime: actually collecting LCP/INP/CLS and bundle numbers depends on the target surface and available tooling.

## F2 - Harden's device/context dimension lost low-power and reduced-capability probes

Evidence:
- `harden.md` names four resilience dimensions, including "Device and context" with touch targets, offline behavior, slow connections, and low-power mode (`harden.md:13-20`).
- Current audit references cover touch target thresholds (`accessibility_performance.md:51-57`), offline and slow responses (`hardening_edge_cases.md:48-63`), permissions/rate limits (`hardening_edge_cases.md:67-78`), concurrency (`hardening_edge_cases.md:82-93`), i18n/RTL (`hardening_edge_cases.md:97-120`), CJK/emoji (`hardening_edge_cases.md:124-135`), and overlays/top layer (`hardening_edge_cases.md:138-147`).
- A text search across `design-audit` found no low-power, battery, data-saver, or Save-Data probe, while the source corpus explicitly names low-power mode (`harden.md:18`).

Buildable recommendation:
- Add a `Device And Constrained Context` section to `design-audit/references/hardening_edge_cases.md` with probes for low-power mode, reduced-data/data-saver behavior, CPU-throttled interaction, offline-to-online recovery, and slow-network media loading.
- Route failures to Performance when they manifest as jank/load cost, Responsive Design when the surface is unusable on device constraints, and Anti-Patterns when the design assumes ideal conditions.

Enforceability:
- ENFORCEABLE in documentation and report corpus: the hardening matrix can require rows for low-power/data-saver probes, and audit reports can require each row to be pass/fail/skip with evidence labels.
- ADVISORY in live runtime: low-power and data-saver simulation availability depends on browser/device tooling.

## F3 - Harden fix-shapes are not systematic in the audit matrix

Evidence:
- `harden.md` says the flow identifies a failure mode and applies the concrete fix: overflow handling, informative error UI, i18n-safe layouts, pluralization, and fallbacks (`harden.md:20`).
- Its example output names fix shapes, not just symptoms: ellipsis with tooltip, `max-height` plus disclosure, empty state, skeleton loader, and name-length tests (`harden.md:30-37`).
- `design-audit` correctly preserves the audit/implementation boundary: it reports gaps and routes fixes instead of applying them (`design-audit/SKILL.md:280-282`, `hardening_edge_cases.md:150-155`).
- But `hardening_edge_cases.md` mostly has `Probe -> Expected symptom -> Finding to file` rows (`hardening_edge_cases.md:36-43`, `hardening_edge_cases.md:52-61`, `hardening_edge_cases.md:86-91`) and only one row has an explicit "Fix shape" paragraph for overlays (`hardening_edge_cases.md:144-147`).

Buildable recommendation:
- Add a fourth `Fix shape to recommend` column to `hardening_edge_cases.md`, or add a companion `hardening_fix_shapes.md` reference.
- Keep the boundary: the audit report recommends the fix shape and owner; `sk-code` implements only after accepted handoff.
- Seed fix-shapes from the source corpus: overflow handling, tooltip/full-value disclosure, "show more", skeleton/loading, field-level validation errors, retry/backoff, read-only reason, optimistic rollback, portal/popover/top-layer overlay escape, locale-aware formatting, pluralization, and pseudo-localization.

Enforceability:
- ENFORCEABLE in the reference corpus: every hardening matrix row can be validated to include a fix-shape field and owner.
- ADVISORY in audit execution: the recommended fix quality remains a design judgment until implemented and verified.

## F4 - Polish readiness is present as prose but not a gate

Evidence:
- `polish.md` says polish is for functionally complete work, when nothing is broken but something still feels off (`polish.md:7-9`).
- It says polish is the last step and is wasted if the feature is not functionally complete (`polish.md:22`).
- It specifically treats TODOs as a readiness blocker (`polish.md:44-46`) and includes copy/TODO cleanup in its six polish dimensions (`polish.md:13-20`).
- `design-audit` routes polish/hardening concerns into critique resources (`design-audit/SKILL.md:63-67`, `design-audit/SKILL.md:96-105`), and `critique_hardening.md` covers polish checks (`critique_hardening.md:78-86`) and polish-as-trust (`critique_hardening.md:101-105`), but there is no explicit "polish readiness" gate in the audit workflow (`design-audit/SKILL.md:267-278`) or report frame (`audit_report_template.md:20-31`).

Buildable recommendation:
- Add a `Polish Readiness` subsection to `critique_hardening.md`: before filing P3 polish recommendations as the main outcome, check whether the surface is functionally complete, blocker-free, and free of unresolved TODO/placeholders in user-visible paths.
- Add an `Audit report` frame row: "Polish readiness: ready / blocked / not assessed" with blocker evidence.
- If blocked, the report should promote functional/accessibility/responsive issues ahead of polish and label polish findings as deferred.

Enforceability:
- ENFORCEABLE in report shape: generated audit reports can be required to include a polish-readiness field before P3-only recommendations.
- PARTLY ENFORCEABLE in source-backed audits: static scans can detect TODO/FIXME/placeholders in target files.
- ADVISORY for semantic readiness: "functionally complete" requires human or test evidence beyond static text matching.

# Questions Answered

- Q5 partially: D1 backlog items should be split into report-contract enforcement (metric proof, evidence labels, readiness field), reference-corpus enforcement (hardening fix-shape and low-power rows), and advisory runtime judgment (actual metric collection, low-power simulation, semantic completion).
- Q2 partially: the enforceable unit here is not "the model cared about polish"; it is whether generated audit artifacts contain required fields, evidence labels, metrics or caveats, and owner/fix-shape rows.

# Questions Remaining

- Should performance proof be enforced by a generic audit-report validator or by a dedicated `design-audit` skill-benchmark corpus?
- Should low-power/data-saver probes live in `hardening_edge_cases.md`, `accessibility_performance.md`, or both with a single owner map?
- Should polish readiness block only P3-only audit outcomes, or should every full audit report include it as a standard frame row?
- The corpus map uses shorthand source paths like `external/optimize.md` (`corpus_map.md:21-25`), while this repository's actual corpus files are nested under `external/impeccable-main/site/content/skills/`. A later implementation pass should decide whether to normalize those paths in the map or keep them conceptual.

# Next Focus

Advance to the next D1 angle in the bank. Recommended next D1 thread: compare impeccable `audit.md` and `critique.md` against `design-audit` severity/scoring to find residual judgment and report-shape gaps before moving to D2 command design.
