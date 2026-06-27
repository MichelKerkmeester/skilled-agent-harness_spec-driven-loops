# Iteration 008 - Manual Tests and Benchmark Coverage

## Focus

Assess how audit improvements can be validated with existing testing artifacts.

## Evidence Read

- `manual_testing_playbook/manual_testing_playbook.md` lists nine scenarios covering score report, transform remediation, evidence capture, report template, a11y/performance, quick fixes, anti-slop, AI tells and hardening edge cases.
- `014-routing-benchmark/design-audit/**` had no files in this checkout.
- Operator context supplied an audit routing score of `82/100`, but this lineage found no checked-in audit benchmark report to cite.

## Findings

1. Manual scenarios exist and are aligned with the current resource model.
2. Missing benchmark fixtures are the clearest measurable gap. Add a design-audit benchmark report and fixtures for the five router replay prompts captured in this lineage.
3. Use deterministic router replay for parseable routing and manual playbook scenarios for report-quality behavior. Do not use a single overall score as the only acceptance gate.

## Delta

- New information ratio: 0.14.
- Q5 answered.

## Next

Cull duplicate and scope-creep recommendations.
