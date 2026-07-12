---
title: "Checklist: Benchmark Authoring Centralization"
description: "QA verification checklist for centralizing benchmark-document authoring in create-benchmark, with evidence."
trigger_phrases:
  - "016 checklist benchmark authoring centralization"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization"
    last_updated_at: "2026-07-12T11:38:53Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Terminal gates + push"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: Benchmark Authoring Centralization

---

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries evidence: a command + result. Deterministic checkers + a git-diff audit; no live dispatch.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Benchmark-family inventory confirmed (8 types); renderer-owned + lane-local boundaries identified
- [x] Behavior-family precedent adopted as the target shape (ADR-001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] New templates carry 5-field frontmatter + 4-part version + usage headers; guides open with an OVERVIEW H2
- [x] Family table has an owns-vs-routes column; Lane A/D marked code-owned non-goals
- [x] MCP-promotion contract preserved (REQUIRED PACKAGE SHAPE / REPORT CONTRACT / ten-section / ALWAYS-NEVER intact)
- [x] Comment hygiene: no spec-folder paths / packet ids in doc prose
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] `package_skill.py --check` create-benchmark → PASS (10/10 sk-doc packets overall)
- [x] `validate_document.py` 0 issues on all 6 new + all edited create-benchmark docs
- [x] Model-benchmark template fidelity: field set is a faithful superset of the real fixture keys
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Skill-benchmark family: storage guide + hub README template authored; report .md left renderer-owned (no fill-in template)
- [x] Model-benchmark family: code-task + pattern fixture templates + profile template + fixture guide authored
- [x] create-benchmark SKILL normalized (satisfies 015 for this file) → 10/10 overall
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] Documentation-only; no scorer/runner/contract code changed; no new tool grants or capabilities
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] create-benchmark README + references/README surface the new families + template rows
- [x] changelog/v1.2.0.0.md added; spec/plan/tasks/decision-record/implementation-summary consistent
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] Rewire is pointer-only (diffs additive, 0 lines removed); ZERO paths under deep-alignment
- [x] reviewer_schema.md / scoring_contract.md / framework.md not copied or moved (linked only)
- [x] No advisor registry/router/description.json changes; no packet-local graph-metadata.json
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| New templates/guides authored | 6 | 6/6 (validate 0) |
| create-benchmark docs validate 0 issues | 12 | 12/12 |
| `package_skill.py --check` PASS | 10 | 10/10 |
| Consumer docs rewired (pointer-only) | 8 | 8/8 |
| deep-alignment / scorer / contract edits | 0 | 0 |

**Verification Date**: 2026-07-12
<!-- /ANCHOR:summary -->
