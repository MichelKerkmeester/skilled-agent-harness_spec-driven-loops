---
title: "Implementation Summary: Regression-Harness Alias-Awareness & Stale Test Path — Complete"
description: "Both regression harnesses now match gold labels alias-aware (Python + TS), the alias groups were completed (sk-deep-* and a deep-agent-improvement group), and lane-weight-sweep.vitest.ts anchors on a stable marker with reports redirected off the deleted packet path."
trigger_phrases:
  - "harness alias impl summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Implemented and verified harness alias-awareness plus stale-path fix"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "alias-resolve in the harness layer (not relabel fixtures)"
      - "anchor findWorkspaceRoot on the skill package.json marker"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path |
| **Completed** | 2026-05-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both regression harnesses now compare gold labels alias-aware, so a renamed skill (the live `deep-*` ids) satisfies a fixture labelled with its old `sk-deep-*` alias. The alias groups were the real gap: the Python groups lacked the `sk-deep-*` entries and neither language had a `deep-agent-improvement` group, so the matcher had nothing to resolve against. Completing the groups plus switching the harness compares to the existing alias helpers (`skill_matches_alias` in Python, `skillInAliasSet` in TS) clears the deep-* alias failures without editing the ground-truth fixtures.

Separately, `lane-weight-sweep.vitest.ts` now resolves the workspace root from the skill's own `package.json` instead of a 026 packet path that the reorg removed, and its sweep reports write to a gitignored skill-local directory so the run no longer recreates deleted packet folders via `mkdir`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../lib/scorer/aliases.ts` | Modify | Add the `deep-agent-improvement` alias group (sk-deep-research/review already present) |
| `.../scripts/skill_advisor.py` | Modify | Add `sk-deep-*` to deep-research/deep-review groups + a `deep-agent-improvement` group |
| `.../scripts/skill_advisor_regression.py` | Modify | Alias-aware `top_ok` via `skill_matches_alias` |
| `.../handlers/advisor-validate.ts` | Modify | Alias-aware `passed` via `skillInAliasSet` |
| `.../tests/scorer/lane-weight-sweep.vitest.ts` | Modify | Stable `package.json` anchor + sweep-report redirect |
| `.gitignore` | Modify | Ignore generated `sweep-reports/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Completed the alias groups, switched both harness compares to the shared alias helpers, then re-anchored the sweep test. Verified the alias rows resolve and the full TS suite runs clean, watching that P0 stayed 12/12 in both scorers.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Alias-resolve in the harness layer | Keeps fixture ground-truth intact; matches the phase-001 (F1a) approach |
| Complete the alias groups in both languages | The matcher could not resolve sk-deep-* / deep-agent-improvement without the group entries |
| Anchor findWorkspaceRoot on the skill package.json | Stable across packet renumbering, unlike a spec-packet path |
| Redirect sweep reports to a gitignored skill-local dir | Avoids recreating deleted packet folders via mkdir and keeps the destination stable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Python regression P0 | 12/12 (no regression) |
| Python deep-* alias rows | RESEARCH-001/002, REVIEW-003/005, PHRASE-002/003/005 all pass; failures 13 -> 6; top1 0.95 |
| TS regression P0 | 12/12 (no regression) |
| TS deep-* alias rows | RESEARCH-001/002, REVIEW-003, PHRASE-003 pass (5 of 7 named rows) |
| Full TS vitest | 66/66 files pass, 451 passed, 4 skipped (lane-weight-sweep no longer errors) |
| tsc --noEmit | clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **TS abstains on P1-PHRASE-002 ("5d scoring") and P1-PHRASE-005 ("dynamic profile").** These still fail in the TS harness, but NOT from alias drift: the TS scorer assigns them confidence below 0.8 and abstains, so there is no top to alias-match (Python routes them via phrase boosters TS lacks). Closing this is a scorer-confidence/parity change, which this phase explicitly excludes (Out of Scope: no scorer routing/abstention change). Tracked as a separate parity item.
2. **Remaining non-alias P1s** (P1-MCP-002, P1-OPENCODE-001, P1-FULLSTACK-001, P1-REVIEW-004, P1-PHRASE-004/007) are genuine routing/abstention cases unrelated to alias drift and out of this phase's scope.
<!-- /ANCHOR:limitations -->
