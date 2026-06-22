---
title: "Feature Specification: Validator semantic checks (make the checker see prose) [template:level_2/spec.md]"
description: "Extend validate.ts beyond hex/section-header checks so it can detect prose fabrication: a section-coverage report, a prose-discipline check, non-color stability gating, source-sentinel provenance, and a values-vs-claims score split."
trigger_phrases:
  - "validator prose checks"
  - "section coverage report"
  - "non-color stability gating"
  - "source sentinel provenance"
  - "dual score split"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/004-validator-semantic-checks"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 004 from research Phase 3"
    next_safe_action: "Implement checkSectionCoverage first (mechanical hallucination detector)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Validator semantic checks (make the checker see prose)

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Today a 99/100 score can hide wholesale fabrication because the validator reads only colors and headings, never sentences. This phase teaches it to (a) flag sections with no backing data, (b) flag ungrounded prose, and (c) report a separate 'claims supported' score so values-fidelity can't mask invented prose.

Parent packet: `skilled-agent-orchestration/152-sk-design-md-generator` (phase parent). Evidence base: `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Phase** | 004 of 006 |
| **Parent** | `skilled-agent-orchestration/152-sk-design-md-generator` |
| **Level** | 2 |
| **Research source** | research.md §6 Phase 3 |
| **Status** | planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`validate.ts` runs 6 mechanical checks; none reads a prose sentence. The score conflates value-fidelity with prose-provenance, so a doc with real hexes and invented prose scores 99/100. Stability gating only applies to colors, so an L4 shadow/gradient passes.

### Purpose

Give the validator mechanical visibility into the prose-fabrication surface, while keeping false-positives controlled (prose-word checks are WARNING-tier only; the reliable signal is the structural section-coverage report + citation counting).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `checkSectionCoverage()`: map each section to its backing DesignTokens fields; report per-section token count + isEmpty + inventionRisk (the cheap mechanical hallucination detector that powers phase 003's data-driven requirements).
- Prose-discipline check: banned-adjective / interpretive-phrase scan with numeric-anchor suppression — WARNING-tier only (never a hard fail; the lists are inherently brittle).
- Extend `checkStabilityGating` to non-color tokens (shadows, gradients, components, radii, typography).
- Source-sentinel provenance: parse `<!-- source: tokens.<path> -->` markers (reuse `stripHtmlComments`), resolve the dotted path against DesignTokens, verify non-empty — WARNING-tier.
- Dual-score split: `valuesScore` (mechanical hex/section fidelity) + `claimsScore` (prose provenance) so 99/100 can't be earned on hex-tracing while prose is unverified.

### Out of Scope

- The deterministic renderer that removes prose entirely (phase 005).
- DTCG typed-token schema (phase 006).

### Files to Change

| File | Why |
|------|-----|
| `tool/scripts/validate.ts` | new checks: section coverage, prose discipline, non-color stability, source sentinels, dual score |
| `tool/scripts/types.ts` | SectionCoverageReport; stability field on non-color tokens |
| `tool/scripts/__tests__/validate.test.ts` | regression tests for each new check incl. false-positive guards |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-004-1** [P0] `checkSectionCoverage()` reports, per section, the backing token count + isEmpty; an empty required section is flagged (this is what makes phase 003's data-driven requirements enforceable).
- **REQ-004-2** [P0] The score is split into valuesScore + claimsScore; a doc with unverified prose cannot reach a passing combined score on hex-fidelity alone.

### P1 - Required (complete OR user-approved deferral)

- **REQ-004-3** [P1] Prose-discipline + source-sentinel checks exist as WARNING-tier (weight ≤1pt) with numeric-anchor suppression; no legitimate value-bound prose false-fails.
- **REQ-004-4** [P1] Stability gating extended to shadows/gradients/components/radii/typography (an L4 non-color token no longer passes).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Running the validator on the OLD anobel stub (the one that scored 99/100 with fabrications) now flags the empty §6 and the unverified prose; the combined score drops below pass.
- Running it on the corrected anobel DESIGN.md passes cleanly (no false-positives on grounded prose).
- vitest covers every new check + its false-positive guard.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood/Impact | Mitigation / Guard |
|------|-------------------|--------------------|
| Banned-adjective check false-positives on legitimate prose | High / Med | WARNING-tier only (never hard-fail); numeric-anchor (±50 char) suppression; words like 'robust'/'clean' allowed when token-adjacent |
| Section-coverage detection mis-maps a section to the wrong fields | Med / Med | Explicit section→field map reviewed against the format spec; tested on anobel + gold-standard |
| Self-review-style prose check is unreliable | Med / Low | Prefer structural citation-counting over LLM self-honesty (iter-036); self-review is advisory only |

**Depends on:** Phases 002 (accurate tokens to map) + 003 (the data-driven section contract these checks enforce).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
Every change keeps the anobel example (`output/anobel-com/`) and the 4 gold-standard examples extracting and validating; capture the baseline before, report the delta after.

### Performance
Validator-only; runs in the existing VALIDATE step; negligible cost.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A grounded doc with token-cited prose → passes (no false-fail).
- A doc citing a token that resolves empty → source-sentinel warning.
- A non-color L4 token in the doc → stability-gating flag.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

~220 LOC of new validate.ts checks + types + tests. Medium risk (false-positive surface). Level 2.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions block this phase; the research (`research/research.md`) resolved the design questions. Implementation-time questions are tracked in `tasks.md`.
<!-- /ANCHOR:questions -->

---

