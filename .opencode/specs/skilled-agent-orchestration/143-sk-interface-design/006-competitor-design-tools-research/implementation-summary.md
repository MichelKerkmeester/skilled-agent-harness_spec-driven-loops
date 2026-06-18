---
title: "Implementation Summary: Competitor design-tools research"
description: "A web-heavy 10-iteration parallel-by-model deep-research loop surfaced net-new adoptable ideas from v0, Lovable, Figma Make, Subframe and adjacent tools: design-system adherence + reuse-before-generate (keystone), element-target revision grammar, generated/presentational boundary, build-error self-healing, and a guarded direction gate."
trigger_phrases:
  - "competitor design tools summary"
  - "v0 lovable subframe research outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/006-competitor-design-tools-research"
    last_updated_at: "2026-06-14T09:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research complete; net-new ideas synthesized and cross-checked"
    next_safe_action: "Fold into the 007 keystone build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-006-competitor-design-tools-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | skilled-agent-orchestration/143-sk-interface-design/006-competitor-design-tools-research |
| **Completed** | 2026-06-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is research, not code. It widened the 005 Claude-Design lens to the broader AI design-tool field (v0, Lovable, Bolt, Figma Make, Subframe, and adjacent tools) and surfaced net-new adoptable ideas. The deliverable is `research/research.md`. Neither skill was changed.

### The net-new ideas
The strongest (both lineages): design-system adherence + reuse-before-generate — when a design system is present, reuse its components/tokens and scan output for violations (raw colors, arbitrary spacing, inline overrides, component bypass). Plus an element-target revision grammar, a generated/presentational boundary (Subframe one-way sync), a build-error self-healing loop, and a guarded pre-build direction gate. Two findings corroborated the 005 hardening: browser/screenshot testing is unreliable for subtle visual diffs, and the field's common "pick-a-vibe" menu is exactly what to SKIP.

### Two independent lineages, reconciled
The opus lineage (web gated -> model knowledge) supplied the dedup-vs-005 mapping; the gpt lineage (web available) supplied web-verified feature facts from primary docs. gpt's verified claims take precedence on facts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Canonical cross-checked net-new ideas |
| `research/lineages/{opus48-claude2,gpt55fast}/` | Created | Per-lineage iterations, registries, syntheses |
| `research/deep-research-findings-registry.json` | Created | Merged 8-finding registry |
| `spec.md`, `plan.md`, `tasks.md`, this file | Created | Packet control docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Via the deep-research workflow's machinery: `fanout-run.cjs` spawned two web-heavy lineages; `fanout-merge.cjs` consolidated the registries; the host authored the canonical synthesis, leaning on the gpt lineage's web-cited facts and the opus lineage's mapping. Both lineages succeeded (exit 0).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Carry only net-new vs 005 | Avoid duplicating the parity findings; discovery saturated at iteration 4 |
| gpt web-verified facts win over opus model-knowledge | opus's web was gated; feature claims must rest on cited docs |
| Reconfirm SKIP the preset menu | Both lineages found it is the field's common consumer feature and the anti-default chooser to avoid |
| Feed 007, not replace 005 | This refines operational mechanics; 005 owns the broad protocol |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out completion | PASS, exit 0, 2/2 lineages succeeded |
| Lineage merge | PASS, `fanout-merge.cjs` merged 2, skipped 0, 8 findings |
| Web verification | PASS, load-bearing claims web-cited by the gpt lineage |
| Cross-lineage reconciliation | PASS, agreements + resolution in research.md |
| `validate.sh --strict` | PASS (recorded at packet completion) |
| Skills unchanged | PASS, no diff in either skill |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recommendation only.** Feeds the 007 keystone build; no skill changed here.
2. **opus lineage web gated.** Its claims were model knowledge; the load-bearing ones were independently web-verified by the gpt lineage.
3. **Competitor docs describe behavior, not internals**, and feature sets drift over time.
<!-- /ANCHOR:limitations -->
