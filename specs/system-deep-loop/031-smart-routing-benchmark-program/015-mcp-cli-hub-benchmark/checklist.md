---
title: "Checklist: mcp-tooling + cli-external Hub Benchmark & Router Improvements"
description: "Verification checklist for benchmark enablement + the five per-child router fixes + the integrity gate."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/015-mcp-cli-hub-benchmark"
    last_updated_at: "2026-07-10T22:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checklist complete with evidence"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-tooling + cli-external Hub Benchmark & Router Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries benchmark or router-replay evidence; keyword-broadening integrity checked adversarially.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Confirmed all 5 children NO-SCENARIOS and mcp-figma unparseable (router probe: intents=[]).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] mcp-figma runtime selector byte-unchanged (mirror approach); comment-hygiene clean on touched files.
- [x] No harness engine changes.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] Each child scores real Type-1 (no NO-SCENARIOS); final Mode-A matrix captured (figma 98, chrome-devtools 91, cli-claude-code 92, click-up 78, cli-opencode 85; hubs 92/87).
- [x] Genuine Mode-B live dispatch proven (holdout 31 deterministic -> 66 live).
- [x] mcp-figma key-sync vitest 4/4.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Five per-child fixes landed; T1 rows byte-identical (no regression) on every one.
- [x] Integrity gate: zero over-firing on adjacent negatives; fresh-phrasing generalization miss documented as the keyword-ceiling finding.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] No auto-allowlist / gate bypass involved; keyword broadening authored blind to holdout prompts (no overfitting).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] The keyword-ceiling finding + semantic-routing recommendation recorded in the implementation-summary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Gold under each child's `manual_testing_playbook/intra-routing-recall/`; router edits in each child SKILL.md; mcp-figma key-sync test under the harness tests dir.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Both hubs and all five children are now properly benchmarkable; the honest finding is that per-child keyword
routing cannot generalize and needs a semantic layer.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Benchmark enablement + normalization + five safe, honest, bounded router fixes; integrity gate run; findings
recorded. Deferred: D1inter advisor probe + full Mode-B matrix.
<!-- /ANCHOR:sign-off -->
