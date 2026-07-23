---
title: "Feature Specification: Shared Evidence Envelopes"
description: "Delivered three provider-neutral evidence contracts — owned-asset manifest, motionCharacter handoff, and conditional measured Motion section — for existing sk-design modes."
trigger_phrases:
  - "owned asset manifest"
  - "motion character handoff"
  - "measured motion section design.md"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes"
    last_updated_at: "2026-07-22T18:24:07Z"

    last_updated_by: "implementation-agent"
    recent_action: "Implemented and verified all three evidence envelopes"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md"
      - ".opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md"
      - ".opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts"
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

# Feature Specification: Shared Evidence Envelopes

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
| **Predecessor** | `001-surgical-fixes` |
| **Successor** | `003-authored-cards` |
| **Phase** | 2 of 4 |
| **Implements** | `../../001-research/004-hallmark-design-skill-research/research/` (Hallmark adoption research syntheses) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-design modes currently have no shared evidence contracts for three gaps that two independent Hallmark adoption research syntheses converged on as their highest-confidence findings: (1) there is no provider-neutral schema for describing owned assets without hotlinking or bundling third-party binaries; (2) there is no semantic vocabulary connecting motion "character" intent to sk-design's existing timing/easing bands; (3) the `MotionSystem` detector already produces motion evidence, but the v3 DESIGN.md schema has no output section for it — the gap is output, not detection.

### Purpose

Specify three provider-neutral, clean-room evidence envelopes — the owned-asset manifest, the motionCharacter semantic handoff, and the conditional measured Motion section — as shared contracts that existing sk-design modes and the v3 DESIGN.md pipeline can consume, without introducing new motion tokens or bundling any Hallmark (or other third-party) binary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Owned-asset manifest schema (provider-neutral): `source`, `rights`, `dimensions`, `role`, `crop`/`aspect`, `checksum`, `fallback` fields.
- An explicit never-hotlink-Hallmark-binaries constraint encoded into the manifest contract.
- A `motionCharacter` semantic enum (`quiet` / `snappy` / `elastic` / `static-first`) mapped onto sk-design's existing timing/easing bands (not new tokens).
- Interruption, reversal, and async proof requirements for the motionCharacter handoff.
- The conditional measured Motion section wired end-to-end: schema-v3, formatter/prompt, validator, docs, and tests.
- The detector-evidence-driven conditionality rule (the Motion section fires only when `MotionSystem` detects real motion, not on phrase-triggers).
- Verifying the three cited sk-design wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) against current code before any edits, since these citations are unverified (see Open Questions).

### Out of Scope

- New motion TOKENS or named-theme duration multipliers.
- Bundling, hotlinking, or shipping any Hallmark (or other third-party) binary asset.
- Rebuilding the `MotionSystem` detector itself (it already exists; only its output wiring is in scope).
- Phase 1 (`001-surgical-fixes`) concerns.
- Phase 3 (`003-authored-cards`) concerns.
- Phase 4 concerns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` | Create | Provider-neutral owned-asset manifest schema (source, rights, dimensions, role, crop/aspect, checksum, fallback) |
| `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` | Create | `motionCharacter` semantic enum mapped onto existing timing/easing bands + interruption/reversal/async proof |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts` | Modify | Add the conditional measured Motion section fields to the v3 schema (verify wiring point first) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts` | Modify | Add Motion section types (verify wiring point first) |
| `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` | Modify | Document the conditional measured Motion section (verify wiring point first) |
| Formatter/prompt output path (confirmed at implementation) | Modify | Emit the Motion section only when `MotionSystem` detector evidence is present |
| Validator path (confirmed at implementation) | Modify | Validate the conditional Motion section against schema-v3 |
| Tests under `.opencode/skills/sk-design/design-md-generator/backend/tests/` | Create/Modify | Cover conditional Motion section wiring end-to-end |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provider-neutral owned-asset manifest schema with never-hotlink constraint | Manifest defines source, rights, dimensions, role, crop/aspect, checksum, fallback fields; contains no Hallmark-specific fields; explicitly forbids hotlinking or bundling Hallmark (or other non-owned) binaries. |
| REQ-003 | `motionCharacter` semantic enum mapped onto existing bands | `quiet` / `snappy` / `elastic` / `static-first` values are defined and mapped onto sk-design's existing timing/easing bands; no new duration-multiplier tokens are introduced. |
| REQ-005 | Conditional measured Motion section wired end-to-end | The v3 DESIGN.md schema, formatter/prompt, validator, docs, and tests all support a Motion section, gated on real `MotionSystem` detector evidence. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Net-new manifest fields documented against Hallmark precedent | Manifest documents that `source`/`dimensions`/`role`/`fallback` have Hallmark precedent, `rights` is a global posture (not a per-asset column in Hallmark), and `crop`/`aspect` + `checksum` are net-new. |
| REQ-004 | Interruption/reversal/async proof for motion handoff | The `motionCharacter` handoff contract specifies interruption-safety, reversal, and async proof requirements consistent with existing hover/focus delay and optimistic-update-with-rollback patterns. |
| REQ-006 | Detector-evidence-driven conditionality, not phrase-triggered | Tests confirm the Motion section is emitted only when `MotionSystem` produces real evidence, and omitted otherwise; no phrase-based trigger is used. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All three shared evidence envelope contracts are specified: the owned-asset manifest (provider-neutral, never hotlinks Hallmark binaries), the `motionCharacter` semantic handoff (mapped onto existing bands, no new tokens), and the conditional measured Motion section (wired schema → formatter → validator → docs → tests, detector-evidence-driven).
- Phase 1 (`001-surgical-fixes`) is complete before Phase 2 implementation begins.
- `validate.sh --strict` reports 0 errors for this spec folder, both now (spec-authoring) and again after implementation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** Phase 1 (`001-surgical-fixes`) completion; the Hallmark adoption research syntheses (`../../001-research/004-hallmark-design-skill-research/research/`); the existing `MotionSystem` detector; the existing v3 DESIGN.md schema/formatter/validator under `design-md-generator/backend/scripts/`.
- **Risk:** the three cited sk-design wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) are unverified against current code — see Open Questions; a mismatch could require re-scoping the wiring task.
- **Risk:** introducing named-theme duration multipliers instead of mapping `motionCharacter` onto existing bands would violate this packet's core design constraint.
- **Licensing:** Hallmark is MIT-licensed (`external/hallmark/LICENSE`). This packet prefers clean-room adaptation; the manifest schema itself is clean-room and provider-neutral (its distinguishing fields are net-new). If any table substantially copies Hallmark's manifest or motion text, Hallmark's MIT notice must be added. External images/fonts/third-party assets are out of scope — not covered by the repo's MIT grant — and the manifest only ever references owned assets by their own rights, never Hallmark binaries.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- The manifest schema and the `motionCharacter` band mapping add no runtime cost beyond existing schema/detector paths; the conditional Motion section renders only when the detector already produced evidence, avoiding unconditional new output.

### Security

- The never-hotlink-Hallmark-binaries constraint prevents introducing untrusted remote asset references. Manifest fields (`source`, `checksum`) are evidence-only and grant no new network or execution surface.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Implementation confirmed the live motion capability at `schema-v3.ts` lines 146 and 490, the `MotionSystem` type at `types.ts` line 260 before edits, and no existing Motion content in `design-md-format.md`. The shared contracts were placed in the approved `shared/evidence-envelopes/` pair; formatter/prompt and validator ownership resolved to `scripts/formatters-v3.ts`, `scripts/build-write-prompt.ts`, and `scripts/validate.ts`.
<!-- /ANCHOR:questions -->
