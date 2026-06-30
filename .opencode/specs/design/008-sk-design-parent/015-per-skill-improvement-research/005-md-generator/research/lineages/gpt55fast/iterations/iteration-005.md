# Iteration 5: Examples And Manual Testing Usefulness

## Focus

Assess whether references, assets, examples, and manual testing increase user usefulness without bloating the mode.

## Findings

- The manual testing playbook is comprehensive: 13 scenarios across extract, validate, fidelity, dark mode, setup, escalation, report, interaction, cluster, accessibility, detectors, boundary, and provenance [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:23-40].
- Preconditions and evidence requirements are strong but heavy for routine operator use [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:63-75], [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:79-92].
- The release readiness rule requires all critical paths pass or be explicitly skipped [SOURCE: .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md:131-141]. That should remain for release validation, but not every run needs the full suite.
- Existing examples are strong v3 Style References, but all four are developer/SaaS-adjacent: Stripe, Vercel, Linear, Supabase [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/stripe/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/vercel/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/linear/DESIGN.md:1-6], [SOURCE: .opencode/skills/sk-design/design-md-generator/references/examples/supabase/DESIGN.md:1-6].

## Recommendations From This Iteration

- Split testing guidance into `smoke` and `release` lanes. Smoke: preflight, extract a simple URL, validate a known good/bad pair. Release: full 13 scenarios.
- Align manual probes to current schema fields: `meta.framework`, `iconSystem`, `motionSystem`, `a11yTokens`, `darkMode`, `breakpoints`, `components[].variants.*Changes` [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:337-410], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:461-478].
- Add one non-SaaS example only after setup/routing fixes.

## What Was Tried And Failed

- Tried to justify more generic reference docs. Prior research and live state show this would duplicate existing format, taxonomy, workflow, and boundary docs.
- Tried to rank a fifth exemplar as P1. It is useful, but less urgent than setup/routing/playbook correctness.

## Assessment

- newInfoRatio: 0.34
- Novelty: medium-low. Most evidence confirms a narrow useful addition rather than broad expansion.
- Next focus: final prioritization and do-not list.
