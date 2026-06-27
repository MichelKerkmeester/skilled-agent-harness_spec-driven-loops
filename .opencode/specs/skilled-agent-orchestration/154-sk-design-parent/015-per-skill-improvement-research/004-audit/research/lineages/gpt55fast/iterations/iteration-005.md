# Iteration 005 - Hardening Matrix and Probe Logging

## Focus

Assess whether production-readiness probes are repeatable enough for real audit runs.

## Evidence Read

- `references/hardening_edge_cases.md` defines probes for extreme inputs, API/network errors, permissions/rate limits, concurrency, i18n/RTL, text expansion, CJK and emoji.
- `references/critique_hardening.md` defines broader cognitive-load, heuristic, persona and hostile-data lenses.

## Findings

1. The hardening reference is rich enough. The gap is a run-log artifact that records which probes were run, skipped or inferred for the target.
2. The manual playbook accepts SKIP only when no target artifact is supplied, but the skill lacks a reusable per-probe SKIP/FAIL/PASS table for day-to-day audits.
3. A combined `audit_evidence_worksheet.md` can include hardening probe rows instead of adding a separate large hardening report template.

## Delta

- New information ratio: 0.36.
- Q2 partly answered; Q4 partly answered.

## Next

Review AI tells and anti-pattern score calibration.
