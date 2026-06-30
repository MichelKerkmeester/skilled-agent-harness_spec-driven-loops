---
title: "Feature Specification: Doc, prompt & routing fixes (remove the fabrication mandates) [template:level_2/spec.md]"
description: "Remove the structural instructions in the format spec, style guide, prompt template, and SKILL.md that REQUIRE the AI to write content with no backing data. Adds the ABSENT-stamp path, the AP-29 anti-pattern, the per-section anti-fabrication ruleset, and loads the cardinal-rules card as a pre-write gate."
trigger_phrases:
  - "fabrication mandate removal"
  - "absent stamp"
  - "named principle evidence gate"
  - "comparative framing removal"
  - "per-section anti-fabrication ruleset"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/003-doc-prompt-routing-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 003 from research Phase 2"
    next_safe_action: "Implement T-section requirements data-driven first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Doc, prompt & routing fixes (remove the fabrication mandates)

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The instructions actively TELL the AI to invent: mandatory 'named principles', mandatory 'philosophy' paragraphs, mandatory 'compared to other systems' claims, and 15 required sections even when 5 are usually empty. This phase removes those mandates and gives the AI a legal way to say 'no data here' (ABSENT).

Parent packet: `design/004-sk-design-md-generator` (phase parent). Evidence base: `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Phase** | 003 of 006 |
| **Parent** | `design/004-sk-design-md-generator` |
| **Level** | 2 |
| **Research source** | research.md §6 Phase 2 + iter-037/040 |
| **Status** | planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`design_md_format.md` requires a named depth principle (§9) and motion philosophy (§10) even with zero data; §3.4/style-guide §15 require a comparison to other systems the tool knows nothing about; the validator demands 15 sections while gold-standard docs use ~9-10. The style guide (§10 'a value-less paragraph is an opinion') directly contradicts the format spec's mandatory philosophy. There is no supported 'I have no data' output, so the model fabricates.

### Purpose

Make every interpretive requirement conditional on real evidence, add an explicit ABSENT-stamp output, and codify a per-section rule (FORBID / CITE-TOKEN / GATE-ON-EVIDENCE / LABEL-INFERENCE) so the prompt and docs stop soliciting invention.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Section requirements data-driven: demote §0/§7/§11/§12 (and §6.5/§9) to conditional-on-data; the spec demands 15, gold-standard uses ~9-10.
- Add anti-pattern AP-29 'Interpretive Fabrication' + a NEVER rule prohibiting qualitative claims without token traceability (`anti_patterns.md`, `SKILL.md §4`).
- Remove the comparative-framing mandate (`design_md_format.md §3.4`, `writing_style_guide.md §15`); replace with intra-system comparison.
- Named principle conditional-on-evidence (≥3 backing tokens across ≥2 pages, else ABSENT) (`design_md_format.md §9`, §1, §3).
- Motion fallback split into hard-labeled OBSERVED / RECOMMENDED blocks (`design_md_format.md §10`).
- ABSENT-stamp output + ESCALATE-IF for zero-data sections (`SKILL.md §4`, `design_md_format.md §22`, prompt template).
- Resolve the style-guide §10 vs format-spec mandatory-philosophy contradiction.
- Load `cardinal_rules_card.md` as a pre-write gate (it is currently loaded under no tier); single source of truth for the cardinal rules.
- Per-section anti-fabrication ruleset (iter-037) + prompt-template audit (iter-040): which sections are deterministic vs prose.

### Out of Scope

- Code-level validator enforcement of these rules (phase 004).
- The deterministic renderer that makes sections un-fabricatable (phase 005).

### Files to Change

| File | Why |
|------|-----|
| `tool/resources/design_md_format.md` | section requirements, named-principle, comparative-framing, motion fallback, ABSENT path |
| `tool/resources/writing_style_guide.md` | comparative-framing, the §10 contradiction, named-principle vocabulary |
| `tool/resources/anti_patterns.md` | add AP-29 Interpretive Fabrication |
| `assets/design_md_prompt_template.md` | cardinal-rules gate, ABSENT-stamp, section-determinism |
| `assets/cardinal_rules_card.md` | elevate to pre-write gate |
| `SKILL.md` | ALWAYS-load cardinal rules; ESCALATE-IF zero-data; NEVER-qualitative rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-003-1** [P0] Section requirements are data-driven: a section is only required when its backing tokens exist, else it is stamped ABSENT (removes the structural pressure to fabricate — the single highest-leverage doc change).
- **REQ-003-2** [P0] Named principles, philosophy paragraphs, and comparative framing are conditional-on-evidence or removed; no instruction requires content without backing data.
- **REQ-003-3** [P0] AP-29 'Interpretive Fabrication' + the NEVER-qualitative-without-token rule are documented and loaded at WRITE and VALIDATE.

### P1 - Required (complete OR user-approved deferral)

- **REQ-003-4** [P1] ABSENT-stamp + ESCALATE-IF path exists for zero-data sections; motion fallback uses OBSERVED/RECOMMENDED labels.
- **REQ-003-5** [P1] cardinal_rules_card.md is loaded as a pre-write gate (single source of truth); the style-guide vs format-spec contradiction is resolved.
- **REQ-003-6** [P1] Per-section anti-fabrication ruleset (FORBID/CITE-TOKEN/GATE/LABEL) documented in the format spec.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Re-authoring the anobel DESIGN.md, §6 Depth (0 shadow tokens) is stamped ABSENT instead of inventing 'gradient-as-depth'.
- No section requires content the tokens.json cannot support; the doc drops to ~9-10 data-backed sections.
- A reviewer cannot find an instruction that solicits an ungrounded claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood/Impact | Mitigation / Guard |
|------|-------------------|--------------------|
| Removing mandatory philosophy loses genuinely useful prose | Med / Med | Keep evidence-backed named principles (≥3 tokens / ≥2 pages) — the highest-value prose per iter-024; only the ungrounded ones are gated |
| Section demotion wrongly omits a legitimately-present section | Med / Med | The data-driven check (built in phase 004) must not false-ABSENT; until then, conditional sections render when ANY backing field is non-empty |
| Doc/prompt drift across the 3 copies of cardinal rules | Low / Med | Single source of truth in cardinal_rules_card.md; remove the inline duplicates |

**Depends on:** Phase 002 (the ABSENT path is only honest once extraction reports real emptiness, not fake defaults).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
Every change keeps the anobel example (`output/anobel-com/`) and the 4 gold-standard examples extracting and validating; capture the baseline before, report the delta after.

### Performance
Documentation/prompt only — no runtime cost; if anything, fewer fabricated sections shorten the WRITE.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A data-rich site → named principles allowed (evidence gate passes).
- A flat site (no shadows) → §6 stamped ABSENT.
- Motion detected on some pages only → OBSERVED for measured, RECOMMENDED clearly labeled.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

~155 LOC of doc/prompt/routing edits across 6 resource + SKILL.md files. Low runtime risk (removes mandates, adds no logic). Level 2.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions block this phase; the research (`research/research.md`) resolved the design questions. Implementation-time questions are tracked in `tasks.md`.
<!-- /ANCHOR:questions -->

---

