---
title: "Feature Specification: Deferred enhancements & external-tool borrows (TIER-3 / future) [template:level_2/spec.md]"
description: "The TIER-3 items the research explicitly deferred plus the lower-priority borrow-list techniques: DTCG typed tokens + tokens.css, multi-viewport breakpoints, gradient decomposition, CIEDE2000 contrast, MCP token endpoint, composite/aliased tokens, semantic component tagging, hybrid clustering, and the semantic-data section gaps."
trigger_phrases:
  - "deferred enhancements"
  - "DTCG typed tokens"
  - "tokens.css output"
  - "gradient decomposition"
  - "MCP token endpoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/006-deferred-enhancements"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 006 (deferred bucket) from research TIER-3"
    next_safe_action: "Revisit after phases 002-005 ship; each item is independently optional"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Deferred enhancements & external-tool borrows (TIER-3 / future)

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

A holding pen for the valuable-but-not-now work: a typed-token schema, extra output formats, new extraction capabilities, and the borrow-list techniques the research scoped as high-cost or low anti-fabrication ROI. Each is independently optional and gated behind phases 002-005.

Parent packet: `design/004-sk-design-md-generator` (phase parent). Evidence base: `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Phase** | 006 of 006 |
| **Parent** | `design/004-sk-design-md-generator` |
| **Level** | 2 |
| **Research source** | research.md §3 TIER-3 + §4 borrow list + §7 open questions |
| **Status** | planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Several improvements are real but were deferred to avoid blocking the anti-fabrication fixes: DTCG migration is high-disruption and does NOT itself fix prose fabrication; some sections (§0/§1/§7/§8) need semantic data the tokens don't carry; and several borrow-list techniques are medium-cost niceties.

### Purpose

Capture every deferred recommendation so nothing is lost, with the research's rationale for deferral, so a future maintainer can pick any item up with full context.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- DTCG `$type`/`$value` typed-token layer (parallel `tokens.dtcg.json` first, native later) + `tokens.css` (`:root{}`) output for direct agent consumption.
- Composite/aliased tokens (typography/shadow/border/transition as one typed object; role = alias-with-provenance) to cut writer re-assembly fabrication.
- Multi-viewport DOM re-extraction for §10 breakpoint 'Key Changes'; gradient structural decomposition (`GradientToken` with stops/angle/type).
- CIEDE2000 contrast + nearest-WCAG-compliant-shade remediation (Stark-style); MCP token endpoint (Supernova-style) + CLI fallback.
- Semantic component tagging (ARIA/role/class) over geometry; hybrid occurrence+perceptual clustering; deltaE per-corpus calibration.
- Accept-open: §0/§1/§7/§8 need semantic/interpretive source data DesignTokens has no fields for — documented as a future extraction-capability question.

### Out of Scope

- Anything on the anti-fabrication critical path (phases 002-005).

### Files to Change

| File | Why |
|------|-----|
| `tool/scripts/dtcg-wrap.ts` | NEW — parallel DTCG output |
| `tool/scripts/emit-css.ts` | NEW — tokens.css |
| `tool/scripts/types.ts` | GradientToken, composite tokens |
| `tool/scripts/css-analyzer.ts` | CIEDE2000 contrast |
| `tool/scripts/cluster.ts` | hybrid clustering, semantic tagging, per-corpus deltaE |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-006-1** [P0] Every deferred research recommendation is captured here with its deferral rationale; none is silently dropped.

### P1 - Required (complete OR user-approved deferral)

- **REQ-006-2** [P1] Each item is independently scoped (file target + estimate + the phase it depends on) so it can be picked up without re-deriving context.
- **REQ-006-3** [P1] DTCG is documented as a parallel `tokens.dtcg.json` first (not a breaking native migration), per the iter-024 verdict that it does NOT fix prose fabrication.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A future maintainer can select any TIER-3 item and find its rationale, file target, dependency, and the research iteration that justified it.
- No deferred recommendation from research.md §3/§4/§7 is missing from this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood/Impact | Mitigation / Guard |
|------|-------------------|--------------------|
| Deferred items get treated as required and bloat the critical path | Low / Med | Explicitly marked TIER-3/optional; each gated behind 002-005; DTCG flagged as non-fixing-prose per iter-024 |
| DTCG native migration breaks the pipeline | Med / High | Parallel tokens.dtcg.json first; never a blocking native migration |

**Depends on:** Phases 002-005 (each enhancement assumes the hardened baseline).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
Every change keeps the anobel example (`output/anobel-com/`) and the 4 gold-standard examples extracting and validating; capture the baseline before, report the delta after.

### Performance
Per-item; most are additive outputs or optional capabilities behind flags.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- DTCG output requested by a downstream agent → parallel file, source-of-truth stays tokens.json.
- Multi-viewport extraction → new capability, off by default.
- §0/§1 semantic sections → remain bounded-prose [INFERRED] until a semantic-extraction capability exists.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Variable; a structured backlog of independently-optional items, each gated behind the hardened baseline. Level 2.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions block this phase; the research (`research/research.md`) resolved the design questions. Implementation-time questions are tracked in `tasks.md`.
<!-- /ANCHOR:questions -->

---

