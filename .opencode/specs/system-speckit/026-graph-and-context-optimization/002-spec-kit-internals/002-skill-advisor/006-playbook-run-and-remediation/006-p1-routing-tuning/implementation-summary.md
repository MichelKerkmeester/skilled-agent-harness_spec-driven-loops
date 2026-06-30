---
title: "Implementation Summary: Skill Advisor P1 Routing & Abstention Tuning — Pending"
description: "Planned, not yet implemented. Scopes the residual non-alias P1 fixes into 5 root-cause classes with per-case evidence, approach, and a regression guard."
trigger_phrases:
  - "p1 routing tuning impl summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/006-p1-routing-tuning"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p1-tuning"
    recent_action: "Scoped; pending implementation"
    next_safe_action: "Implement class by class via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-006"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 006-playbook-run-and-remediation/006-p1-routing-tuning |
| **Completed** | 2026-05-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Complete. The residual non-alias P1 regression failures, fixed across both scorers in 5 root-cause classes (scoped + designed with a cli-codex gpt-5.5 xhigh read-only review). Both regression harnesses now report **0 failures across all 50 cases** (P0 12/12 each).

- **Class A — terse-phrase routing:** domain anchors in the direct-evidence lane (TS `explicit.ts` PHRASE_BOOSTS / Python `PHRASE_INTENT_BOOSTERS`) lift a strong multi-token phrase's CONFIDENCE past threshold, paired with `primaryIntentBonus` for rank. "webflow cms"/"cms collection" → mcp-code-mode; "structural search"/"find code that" → system-code-graph; "5d scoring"/"integration scan"/"dynamic profile" → deep-agent-improvement.
- **Class B — CLI-vs-skill:** Python code-edit disambiguator caps sk-code uncertainty when code-edit verbs + a code-surface noun are present and no explicit CLI invocation. Fixes "update python script following opencode standards" → sk-code.
- **Class C — breadth abstention:** broad greenfield builds and multi-concern optimizations floor their code-like top's uncertainty so strict callers abstain. Narrowly gated (top must be code-like; narrow-anchor + single-concern bypass), with adversarial routable guards.
- **Class D — deep-loop syntax:** `:review:auto` colon syntax → deep-review (both scorers); bare "auto review" stays sk-code-review per the documented decision (codex confirmed the split).
- **Class E — review-target:** "code audit" → sk-code-review over deep-review; "audit ... recommendations" → sk-code-review over system-skill-advisor.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../lib/scorer/lanes/explicit.ts` | Modify | Class A/D direct-evidence phrase anchors |
| `.../lib/scorer/fusion.ts` | Modify | Class A/C/D/E ranking + breadth abstention |
| `.../lib/scorer/scoring-constants.ts` | Modify | new routing constants |
| `.../scripts/skill_advisor.py` | Modify | Class A booster calibration, B code-edit disambiguator, C breadth abstention, D phrases |
| `.../scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modify | adversarial routable guards P2-BREADTH-GUARD-001/002 |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented class by class in the codex-recommended order (B, D, A, C-last), re-running both regression harnesses + the full vitest after each class and committing in batches (A/B/D together, then C). Class C — the highest over-abstention risk — was gated narrowly and shipped with two adversarial routable guards so a future change cannot silently turn valid code work into "no recommendation".
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate phase from 005 finding-remediation | These are scorer routing/abstention gaps, not the 5 playbook findings or alias drift |
| Implement class by class with verify-after-each | Bounds regression risk; each class is independently revertable |
| Class C (abstention) done last | Highest over-abstention risk; needs adversarial routable guards |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression suite (both scorers) | 0 failures / 50 cases; P0 12/12 each |
| Adversarial routable guards | route to sk-code (no over-abstention) |
| Targets abstain | "build full stack typescript service" + the multi-concern optimize both abstain |
| Parity + corpus tests | green (full vitest 66/66, 4 skipped) |
| Python unit suite | 57/57 |
| tsc --noEmit / alignment verifier | clean / PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Class C abstention is intentionally narrow.** It fires only when the would-be top is code-like AND the prompt is a broad greenfield build (no narrow anchor) or a multi-concern optimization (two distinct concern classes). Genuinely terse prompts that the scorer already can't route confidently (e.g. "optimize skill_advisor.py startup latency") abstain for low-confidence reasons unrelated to this gate.
2. **Signals are domain-meaningful, but the corpus is small.** Anchors target specific multi-token phrases; verified against the 50-case regression suite + the 193-row corpus parity tests, not just the failing rows. The adversarial guards (P2-BREADTH-GUARD-001/002) lock in the over-abstention boundary.
<!-- /ANCHOR:limitations -->
