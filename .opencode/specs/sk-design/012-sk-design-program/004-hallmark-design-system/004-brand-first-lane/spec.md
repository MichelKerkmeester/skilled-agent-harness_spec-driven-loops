---
title: "Feature Specification: Brand-First Authoring Lane"
description: "Implemented brand-first authoring lane that generates palette, type, and voice into distinct authored exports behind measured-path refusal and a manual reviewed-conversion gate."
trigger_phrases:
  - "brand first authoring lane"
  - "authored design artifact"
  - "authored to measured conversion gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane"
    last_updated_at: "2026-07-22T19:01:14Z"

    last_updated_by: "spec-author"
    recent_action: "Implemented and strictly verified the authored-versus-measured boundary"
    next_safe_action: "Use the shared brand-first procedure for an explicitly requested authored brand"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/shared/references/brand-first-lane.md"
      - ".opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Brand-First Authoring Lane

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-sk-design-program/004-hallmark-design-system` |
| **Predecessor** | `003-authored-cards` |
| **Phase** | 4 of 4 |
| **Implements** | `../../001-research/004-hallmark-design-skill-research/research/` (Hallmark adoption research syntheses) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-design's five modes are measured/evidence-first by design, and Phases 1-3 of this packet only fold Hallmark heuristics into that existing, measured surface. Hallmark's own `ROADMAP.md` names a capability none of the five modes own: from a short product description, generate a complete brand — palette, type system, voice — and lock it into a design.md so the whole site builds against it. Adding that capability without an explicit, enforced boundary risks an authored/invented value silently entering the measured DESIGN.md/tokens.json/styles corpus that every other sk-design mode treats as ground truth.

### Purpose

Specify a brand-first authoring lane — the one genuinely new, user-facing capability in the Hallmark-adoption roadmap — that authors palette/type/voice into a distinct, clearly labeled artifact. The lane is governed by an overwrite policy and a single reviewed-conversion gate, so invented design values can never silently reach the measured corpus that the rest of sk-design's evidence-first retrieval depends on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A distinct authored artifact (e.g. `AUTHORED-DESIGN.md` + authored tokens) with a name/schema that cannot be confused with the measured `DESIGN.md`/`tokens.json`/styles corpus.
- Exact `origin: authored` labels and provenance (source description, date, confidence note) on every authored palette/type/voice value.
- An overwrite policy: the lane never clobbers a measured artifact; re-running it refreshes only the authored artifact's own exports.
- A reviewed-conversion gate: the sole, explicit, human-reviewed path by which an authored value may later enter the measured corpus.
- The HARD BOUNDARY invariant itself (authored never enters measured without reviewed conversion), stated as P0 and repeated in Risks and the requirements table.
- Licensing note: Hallmark is MIT-licensed (`external/hallmark/LICENSE`); this lane adopts the *concept* clean-room, not Hallmark code or assets.

### Out of Scope

- Changing the measured extraction pipeline itself.
- Auto-converting authored values into measured values — the conversion gate is manual/reviewed only, never automatic.
- Phase 1 (`001-surgical-fixes`), Phase 2 (`002-evidence-envelopes`), and Phase 3 (`003-authored-cards`) concerns; this phase depends on Phase 3's authored-vs-measured precedent but does not redo that work.
- A sixth design mode, a new public command, or an automated authored-to-measured conversion command.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/authored-brand/authored-design-template.md` | Create | Distinct-schema `AUTHORED-DESIGN.md` and `authored-tokens.json` templates |
| `.opencode/skills/sk-design/shared/authored-brand/authored-provenance-schema.md` | Create | Shared origin-label/provenance schema for authored values |
| `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs` | Create | Enforce authored-only paths, provenance completeness, and conversion-record structure |
| `.opencode/skills/sk-design/shared/references/brand-first-lane.md` | Create | Lane workflow, overwrite policy, and manual reviewed-conversion procedure |
| `.opencode/skills/sk-design/SKILL.md` | Modify | Register the brand-first lane capability and document the hard boundary |
| `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs` | Create | Adversarial tests proving no silent authored-to-measured write path exists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Brand-first lane authors a complete brand into a distinct artifact | Given a short product description, the lane emits palette, type system, and voice into one distinctly named/schema'd artifact, never into the measured DESIGN.md/tokens.json/styles corpus. |
| REQ-002 | HARD BOUNDARY — authored never enters measured without reviewed conversion | No code path writes an authored/invented value into DESIGN.md, tokens.json, or the styles corpus except through the reviewed-conversion gate (REQ-005); adversarial tests confirm no silent write path exists. |
| REQ-005 | Reviewed-conversion gate is the sole authored-to-measured path | A single, explicit, human-reviewed conversion step is the only mechanism that may promote an authored value into the measured corpus; no automatic promotion exists. |
| REQ-006 | Distinct name/schema prevents ingestion confusion | The authored artifact's filename and schema are structurally distinguishable from measured artifacts so no ingestion or ingestion-adjacent tooling can mistake one for the other. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Origin labels and provenance on every authored value | Each authored palette/type/voice value carries exact `origin: authored` plus provenance (source description, date, confidence note). |
| REQ-004 | Overwrite policy protects measured artifacts | The lane never overwrites or clobbers a measured artifact; re-running the lane refreshes only the authored artifact's own exports section. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The brand-first authoring lane exists as an isolated capability that authors palette/type/voice into a distinctly named/schema'd artifact with per-value origin labels and provenance; the measured DESIGN.md/tokens.json/styles corpus is provably unreachable from the lane except through the single reviewed-conversion gate; re-running the lane never clobbers measured artifacts; `validate.sh --strict` on this spec folder reports 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** Phase 3 (`003-authored-cards`) completing and establishing the authored-vs-measured card precedent this lane reuses; the existing `sk-design` mode surface and the measured DESIGN.md/tokens.json/styles corpus (packet `012-style-database-and-interface-commands`) this lane must never mutate directly; Hallmark's `ROADMAP.md`/`study.md` as external, read-only, MIT-licensed reference material.
- **Risk:** An authored/invented value leaking into the measured corpus would corrupt sk-design's evidence-first retrieval for every future extraction — this is why both 014 research syntheses rank the brand-first lane last in the phased plan. Mitigated by the distinct-artifact requirement (REQ-001/REQ-006), the reviewed-conversion gate as the sole promotion path (REQ-005), and adversarial tests proving no silent write path exists.
- **Risk:** Licensing — Hallmark is MIT (`external/hallmark/LICENSE`). The lane's concept is adopted clean-room; if the authored artifact's schema substantially copies Hallmark's design.md/provenance format, the MIT notice must be added. External images/fonts/third-party assets are out of scope — this lane authors design values, it does not redistribute Hallmark binaries.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- The lane's authoring step completes within normal single-mode invocation latency; no new persistent services or background processes are introduced.

### Security

- The reviewed-conversion gate requires an explicit human review action, never an automated `verified=true` claim; the distinct artifact name/schema is the primary structural defense against ingestion tooling mistaking authored content for measured content.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The reviewed-conversion gate is a documented manual-review checklist plus a structurally validated companion record, not a command; user demand was confirmed by the operator directive authorizing implementation.
<!-- /ANCHOR:questions -->
