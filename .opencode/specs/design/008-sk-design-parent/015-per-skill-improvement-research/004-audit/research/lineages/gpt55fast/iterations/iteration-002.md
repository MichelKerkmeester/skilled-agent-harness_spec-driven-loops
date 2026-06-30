# Iteration 002 - Evidence Capture and Report Ergonomics

## Focus

Determine whether audit has enough structure to carry evidence quality through a full report.

## Evidence Read

- `references/evidence_capture.md` resolves targets, defines source/rendered/design-artifact evidence, browser evidence, deterministic scans, screenshot/overlay notes and fallback labels.
- `assets/audit_report_template.md` asks for surface, register, evidence available, evidence missing, findings, positive findings, `/20` score, owner mapping, next actions and residual risk.

## Findings

1. The evidence model is conceptually complete, but the report template compresses evidence into a small frame. A full audit would benefit from a reusable evidence worksheet that records each target, evidence type, attempted scan, result status and confirmed/inferred/not-assessed label before findings are written.
2. The template has owner mapping and next actions, but no backlog-shaped handoff artifact for accepted fixes. A small `audit_backlog_handoff.md` asset would preserve the review/implementation boundary while making `sk-code` handoff less lossy.
3. The evidence_capture file already says a dimension with no evidence should be `not assessed`; the score table could make that easier by adding a per-dimension evidence-status column.

## Delta

- New information ratio: 0.72.
- Open questions reduced: Q2 partly, Q4 partly.

## Next

Replay the parseable router against representative audit prompts.
