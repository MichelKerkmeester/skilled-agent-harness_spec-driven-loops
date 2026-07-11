# Iteration 15: Cross-Skill Test-Reference Labeling Patterns

## Focus

This iteration audited cross-skill test-reference labeling patterns across system-spec-kit, deep-loop-runtime, and deep-loop-workflows. It followed iteration 14's finding that AI-council feature catalogs sometimes label manual scenario contracts as automated tests, and broadened to check whether the same evidence-label ambiguity appears elsewhere.

Ambiguity note: a full cross-skill sweep could cover every skill. I selected the evidence-backed slice named by the prior synthesis: system-spec-kit feature catalogs, deep-loop-runtime feature catalogs, and deep-loop-workflows/deep-ai-council feature catalogs/playbooks.

## Findings

1. Deep-ai-council feature catalogs systematically mislabel manual playbook scenario files as `Automated test` even when the role column says `Manual scenario contract`; this appears in graph integration, value-comparison, depth/failure, deliberation, artifact, scope, writer, and convergence feature entries. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:51] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:51] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md:50]
2. The AI-council root manual playbook is more precise than those feature-catalog rows: it separates `council-graph-script.vitest.ts` for DAC-019..024, `council-graph-value-scenarios.vitest.ts` for DAC-027..032, operator A/B comparison, and documentation reference validation. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:399] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:411]
3. System-spec-kit feature catalogs mostly use concrete test-file references for `Automated test`, but some retrieval-enhancement entries carry placeholder rows like `| — | Automated test | — |`; examples include dual-level retrieval, graph-expanded fallback, and always-on graph context injection. Those placeholders make automated coverage look like a labeled category even when no test file is named. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:43] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/graph-expanded-fallback.md:42] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/always-on-graph-context-injection.md:42]
4. System-spec-kit also contains many well-formed examples where `Automated test` points to actual vitest files and describes specific coverage, which means the placeholder rows are not a universal catalog problem. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/discovery/health-diagnostics-memoryhealth.md:67] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/cross-document-entity-linking.md:57] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/provenance-rich-response-envelopes.md:48]
5. Deep-loop-runtime feature catalogs have a different label-precision issue: several rows use `Integration` for command YAML assets or fixture coverage rather than tests alone, and review-depth convergence is labeled as integration/fixture coverage even though iteration 13 found it is a static workflow-contract check. [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/observability/single-loop-telemetry-heartbeat.md:40] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/script-entry-points/convergence-script.md:48] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/coverage-graph/coverage-graph-signals.md:49]

## Ruled Out

- Treating all system-spec-kit automated-test references as suspect was ruled out; many entries name concrete vitest files and coverage roles. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/discovery/health-diagnostics-memoryhealth.md:67]
- Treating the AI-council root playbook as the source of the mislabel was ruled out; the root playbook separates automated, operator, and documentation-reference rows, while the feature catalogs collapse manual scenario contracts into `Automated test`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:51]

## Dead Ends

- No single shared vocabulary file for test-reference label taxonomy was found in this pass; the issue appears distributed across generated or authored catalog rows rather than centralized in one obvious source file.

## Edge Cases

- Ambiguous input: “cross-skill” could mean every skill. This iteration targeted the three skill families already implicated by prior findings.
- Contradictory evidence: System-spec-kit shows both precise concrete test rows and placeholder automated-test rows; AI-council root playbook is precise while AI-council feature catalogs are not.
- Missing dependencies: Code graph remained stale/untrusted, so direct `Read`/`Grep` evidence was used. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: This pass found patterns but did not trace whether the labels are generated from templates or authored manually.

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:51`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:51`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/council-deliberation-and-seat-diversity/three-seat-diverse-deliberation.md:50`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:399`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:411`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:43`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/graph-expanded-fallback.md:42`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/always-on-graph-context-injection.md:42`
- `.opencode/skills/system-spec-kit/feature_catalog/discovery/health-diagnostics-memoryhealth.md:67`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/cross-document-entity-linking.md:57`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/provenance-rich-response-envelopes.md:48`
- `.opencode/skills/deep-loop-runtime/feature_catalog/observability/single-loop-telemetry-heartbeat.md:40`
- `.opencode/skills/deep-loop-runtime/feature_catalog/script-entry-points/convergence-script.md:48`
- `.opencode/skills/deep-loop-runtime/feature_catalog/coverage-graph/coverage-graph-signals.md:49`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which docs/assets describe missing, stale, or over-compressed behavior?
  - Where do docs claim coverage that tests or evidence do not fully support?
  - Which gaps affect deep-loop and system-spec-kit reliability surfaces?
- Questions answered:
  - AI-council feature catalogs have a recurring manual-scenario-as-automated-test label issue.
  - System-spec-kit has localized placeholder automated-test rows, not a universal labeling failure.
  - Deep-loop-runtime uses broad Integration labels that can blur command assets, fixtures, and true script-spawn tests.

## Reflection

- What worked and why: Pattern greps across the three implicated skill families found repeated label shapes quickly.
- What did not work and why: The pass did not identify a single generator/template responsible for the label drift.
- What I would do differently: Next pass should trace feature-catalog generation or scaffolding sources to determine whether these labels come from templates, scripts, or manual authoring.

## Recommended Next Focus

Audit feature-catalog generation/scaffolding sources for test-label taxonomy: templates, create-feature-catalog command assets, and any scripts that emit `Automated test`, `Integration`, or manual scenario rows.
