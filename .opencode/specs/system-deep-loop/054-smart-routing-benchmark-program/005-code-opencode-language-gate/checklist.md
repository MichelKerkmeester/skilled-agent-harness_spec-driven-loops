---
title: "Checklist: code-opencode Language-Slice Intent Gate"
description: "QA checklist with evidence for the code-opencode per-language intent split."
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/005-code-opencode-language-gate"
    last_updated_at: "2026-07-09T10:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Commit code + packet"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Checklist: code-opencode Language-Slice Intent Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Each item is checked only with concrete evidence (benchmark numbers, guard results, routed counts).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Before baselines captured — evidence: code-opencode PASS 84, sk-code hub PASS 85; ts/py/shell routed 18/14/14.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Split is a regroup with no path loss — evidence: same 12 code-opencode language files, now under 4 intents; drift guard confirms parent == union(children).
- [x] No code comments carry ephemeral artifact ids — evidence: only router data (INTENT_SIGNALS/RESOURCE_MAP) edited.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] `sk-code-router-sync` + `surface-slice-sync` + `parent-hub-vocab-sync` green — evidence: 3 files, 20 tests, all pass.
- [x] Child benchmark re-run — evidence: PASS 84 → 87 (D5 100, D1intra 100).
- [x] Hub benchmark re-run, no regression — evidence: PASS 85 → 85.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Single-language task routes only its trio — evidence: ts 18→9 (12→3 language files), py/shell 14→5 (3 each).
- [x] Language scenarios' gold matches — evidence: gold-lang-match ✓ 3/3.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] No security surface — routing-data only, no execution path changed.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Parent prose already documented the per-language rows — evidence: `smart_routing.md` rows for JAVASCRIPT/TYPESCRIPT/PYTHON/SHELL predate this change; the machine block now matches.
- [x] Residual co-activation + code-webflow keyword mismatch documented in `implementation-summary.md`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Change confined to code-opencode `SKILL.md`, parent `smart_routing.md`, and the three scenarios.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:sign-off -->
## Sign-off
Author-verified against deterministic guards + benchmarks; ready to commit.
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary
Cross-language over-routing eliminated (ts 18→9, language files 12→3); all 3 drift guards 20/20;
child 84→87; hub 85→85; gold 3/3. Residual keyword co-activation deferred and documented.
<!-- /ANCHOR:summary -->
