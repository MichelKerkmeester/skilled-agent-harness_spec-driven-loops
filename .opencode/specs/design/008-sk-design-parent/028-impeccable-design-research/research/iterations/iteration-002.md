# Focus

Read the `audit`, `critique`, `polish`, and `harden` command references from the external impeccable corpus and crosswalk their design-methodology content onto current `sk-design` audit mode. The goal was to separate genuinely net-new or more specific audit refinements from material already encoded in `sk-design`, and from impeccable infrastructure such as detector execution, snapshots, trends, and sub-agent orchestration.

# Actions Taken

1. Read the prior iteration narrative and strategy. Iteration 1 already covered `skill/SKILL.src.md`, so this pass moved to the high-leverage audit command cluster named in the previous next-focus.
2. Read scoped impeccable sources: `skill/reference/audit.md`, `skill/reference/critique.md`, `skill/reference/polish.md`, and `skill/reference/harden.md`, including later sections in the longer `critique`, `polish`, and `harden` files.
3. Opened current `sk-design` targets before classifying candidates: `design-audit/SKILL.md`, `references/audit_contract.md`, `references/critique_hardening.md`, `references/hardening_edge_cases.md`, `references/accessibility_performance.md`, `references/anti_patterns_production.md`, `references/ai_fingerprint_tells.md`, `references/evidence_capture.md`, and `assets/audit_report_template.md`.
4. Ran targeted source and target searches for quality-bar intake, design-system drift taxonomy, detector/browser evidence, snapshot/trend persistence, Nielsen scoring, cognitive load, personas, internationalization, RTL, concurrency, and emotional-journey language.
5. Read the state log before appending the canonical iteration record and wrote the per-iteration delta stream for reducer reconstruction.

# Findings

## Net-New Or More Specific Adoption Candidates

| ID | Classification | Impeccable source | Verified sk-design target | Finding | Minimal surgical edit |
| --- | --- | --- | --- | --- | --- |
| I2-F001 | NET-NEW audit report refinement | `skill/reference/critique.md` lines 221-244 | `design-audit/assets/audit_report_template.md` has findings, score, owner mapping, and next actions, but no targeted question gate. `design-audit/references/critique_hardening.md` also lacks this output rule. | Impeccable's final-question gate is useful once stripped of command-runner language: after findings, either ask concrete decision questions tied to the actual issues or explicitly skip questions when the path is straightforward. | Add a short "decision questions" block to `audit_report_template.md` after owner mapping or recommended actions: ask 1-3 questions with 2-3 concrete options only when priority, tone, scope, or constraints are unresolved; otherwise write `Questions skipped: <reason>`. |
| I2-F002 | NET-NEW polish intake | `skill/reference/polish.md` lines 1 and 22-24 | `design-audit/references/critique_hardening.md` covers polish checks, drift categories, and visual consistency, but does not ask for quality bar or ship horizon. `audit_contract.md` handles severity, not effort calibration. | "MVP vs flagship" is a useful pre-polish input. It should scale P3 volume and polish depth without weakening P0/P1 release gates. | Add to `critique_hardening.md` Section 6: before polish recommendations, record quality bar and ship horizon when ambiguous; functional and release-blocking issues keep severity, but optional craft depth changes with the bar. |
| I2-F003 | NET-NEW refinement to an existing rule | `skill/reference/polish.md` line 13 | `design-audit/references/critique_hardening.md` already names drift root causes: missing token, one-off implementation, conceptual misalignment. It does not state the remedy mapping. | sk-design has the taxonomy but not the operational "fix differs by category" rule. That mapping would make audit handoffs sharper. | Extend the drift paragraph in `critique_hardening.md`: missing token -> foundations token work; one-off implementation -> shared component or `sk-code` replacement; conceptual misalignment -> interface/foundations rework of flow, IA, or hierarchy. |
| I2-F004 | NET-NEW critique specificity | `skill/reference/critique.md` lines 52 and 55 | `design-audit/references/critique_hardening.md` mentions emotional fit, but not peak-end, emotional valleys, or reassurance at high-stakes moments. `evidence_capture.md` also names emotional fit only as a judgment lens. | The emotional-journey lens is a more specific audit probe, especially for checkout, destructive actions, onboarding, medical/legal/financial flows, and error recovery. | Add a compact emotional-journey probe to `critique_hardening.md`: inspect peak/end moments, high-stakes reassurance, anxiety valleys, and recovery tone; file findings only against observable UI/copy/state evidence. |

## Already Covered

| Impeccable slice | Verified sk-design coverage |
| --- | --- |
| Five-dimension audit score, P0-P3 severity, rating bands, findings schema, and findings-first report order | `design-audit/references/audit_contract.md` and `design-audit/assets/audit_report_template.md` already define the `/20` score, P0-P3 ladder, report order, evidence schema, owner mapping, positive findings, and residual-risk close. |
| Positive findings in the report | `design-audit/assets/audit_report_template.md` has a dedicated Positive Findings section with a two-to-four item limit. |
| A11y, performance, responsive, theming, and anti-pattern audit dimensions | `design-audit/SKILL.md`, `audit_contract.md`, `accessibility_performance.md`, and `anti_patterns_production.md` already own these dimensions. |
| Deterministic scan honesty, browser evidence, overlay honesty, clean-scan caveat, and evidence fallback labels | `design-audit/references/evidence_capture.md` already says target resolution comes first, source/rendered/design-artifact evidence are distinct, clean scans are not proof of strong design, overlay claims require a real overlay, and missing evidence must be labeled. |
| Cognitive-load checklist, working-memory limit, Nielsen heuristics, and persona checks | `design-audit/references/critique_hardening.md` already has single focus, chunking, groups of four or fewer, minimal visible choices, no memory bridge, progressive disclosure, all 10 Nielsen heuristics as a diagnostic lens, and concrete personas. |
| Hardening against long/short text, empty states, large datasets, API/network errors, permissions, concurrency, i18n, RTL, translation expansion, CJK, and emoji | `design-audit/references/hardening_edge_cases.md` already contains a matrix with probes, symptoms, findings, severity rules, and routing for these cases. `anti_patterns_production.md` also summarizes production-readiness detectors. |
| "Automation is evidence, not proof of polish" | `evidence_capture.md`, `critique_hardening.md`, and `audit_report_template.md` all carry this rule in sk-design terms. |
| Functional vs cosmetic triage | `audit_contract.md` severity and `hardening_edge_cases.md` user-impact rule already encode this without adding a separate triage system. |

## Out Of Scope Or Ruled Out

| Impeccable slice | Classification | Reason |
| --- | --- | --- |
| Separate `/40` Nielsen heuristic score | RULED OUT | `critique_hardening.md` deliberately keeps Nielsen as a diagnostic lens feeding P0-P3 findings and the existing `/20` score. Adding `/40` would create the parallel scoring system the research brief forbids. |
| Required dual sub-agent critique assessment | OUT-OF-SCOPE-INFRA | This is command orchestration. sk-design can preserve the useful judgment-order invariant through `evidence_capture.md` without requiring sub-agents or duplicating executor mechanics. |
| Bundled detector CLI invocation, browser overlay injection, live-server lifecycle, and console-log plumbing | OUT-OF-SCOPE-INFRA | These are impeccable runtime mechanics. The reusable design rule is already present in `evidence_capture.md`: cite deterministic evidence honestly and do not claim scans or overlays that did not run. Detector rule semantics still need a later iteration via `cli/engine/detect-antipatterns.mjs`. |
| Critique snapshot persistence, trend history, slug generation, and `.impeccable/critique` archive | OUT-OF-SCOPE-INFRA | This is storage/backlog infrastructure, not sk-design methodology. sk-design's audit report template and handoff already route accepted findings without needing a parallel archive. |
| Command recommendation lists using `{{available_commands}}` and forced `impeccable polish` final step | OUT-OF-SCOPE-INFRA | sk-design routes by owner and hands accepted implementation to `sk-code`; it should not import impeccable's command runner contract. |
| Progressive enhancement without JavaScript, memory-leak cleanup, throttling/debouncing snippets, DRYness after polish | MOSTLY OUT-OF-SCOPE OR ALREADY ROUTED | Some are valid UI implementation concerns, but the sk-design audit boundary is to file evidence-backed findings and route implementation to `sk-code` or `sk-code-review`. Existing performance and hardening references already cover the design-facing parts. |

# Questions Answered

- Q1 is partially answered for four command references. The command cluster is mostly already covered in sk-design audit mode, with four net-new refinements: targeted post-report questions, quality-bar intake, remedy mapping for drift causes, and emotional-journey specificity.
- Q2 is partially answered with target homes. All four candidates belong inside existing audit references or assets: no hub change, no new mode, no new detector system.
- Q3 is partially answered for structural ideas in this cluster. The `/40` heuristic score, required sub-agent split, detector overlay plumbing, snapshot archive, and command recommendation machinery should not be adopted. The useful ideas should be crosswalked into the existing `/20`, evidence, and report-template system.

# Questions Remaining

- Q1 remains open for the remaining command references outside this audit cluster, plus `docs/STYLE.md` and the anti-pattern rule catalog semantics in `cli/engine/detect-antipatterns.mjs`.
- Q2 remains open for prose-denylist placement and anti-pattern rule semantics after the next source slices are read.
- Q3 remains open for the detector engine's rule catalog: the implementation is out of scope, but the IDs/categories/semantics may still sharpen `ai_fingerprint_tells.md`, `anti_patterns_production.md`, or foundations.
- Q4 remains open until the backlog is prioritized across all external slices.

# Next Focus

Read `cli/engine/detect-antipatterns.mjs` for rule-catalog semantics only, then `docs/STYLE.md` for the prose denylist. Crosswalk detector rules into existing `design-audit` targets and prose rules into `design-interface/references/design-process/copy_and_mock_data.md` or the shared register. Avoid the detector implementation, CLI wiring, test plumbing, provider duplicate trees, and command storage mechanics.
