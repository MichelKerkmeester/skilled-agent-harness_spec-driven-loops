---
title: "Changelog: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots [006-runtime-docs-and-integrity-hardening/029-improvement-promotion-authority]"
description: "Changelog for the improvement-promotion authority phase: binding promotion, rollback and council persistence to authenticated receipts and authorized roots so mutable local JSON is never the sole authority."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/029-improvement-promotion-authority` (Level 3)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening`

### Summary

This phase bound promotion, rollback and council persistence to authenticated evidence and authorized roots: promotion checks `score.candidate`, `score.target` and `score.inputHash`, ship and rollback verify against an authenticated append-only acceptance receipt, evaluator identity resolves from the manifest profile rather than candidate frontmatter, and council persistence rejects packet-root and topic-id escapes before any `mkdir`. All 13 implementation findings landed on `skilled/v4.0.0.0` (ten as `0d1827eef5`, the three-finding tail as `f6cdf604a2`). Status is in progress: the evidence checklist remains unchecked and the ADR dispositions remain Proposed.
