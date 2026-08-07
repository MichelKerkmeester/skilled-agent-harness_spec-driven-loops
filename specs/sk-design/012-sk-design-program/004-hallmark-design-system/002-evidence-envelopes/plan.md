---
title: "Implementation Plan: Shared Evidence Envelopes"
description: "Plan for specifying and wiring the owned-asset manifest, motionCharacter handoff, and conditional measured Motion section as shared evidence contracts for existing sk-design modes."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes"
    last_updated_at: "2026-07-23T07:04:12Z"

    last_updated_by: "implementation-agent"
    recent_action: "Executed the plan and verified the delivered contracts"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/design-md-format.md"
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

# Implementation Plan: Shared Evidence Envelopes

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

sk-design's v3 DESIGN.md generator (`design-md-generator/backend/scripts/`) already runs a `MotionSystem` detector, but the v3 schema has no output section for its evidence. Asset handling has no owned-asset manifest concept, and motion "character" has no semantic vocabulary layered over the existing timing/easing bands.

### Overview

Phase 2 delivers three shared, provider-neutral evidence contracts consumed by existing modes: (1) an owned-asset manifest schema, (2) a `motionCharacter` semantic handoff mapped onto existing bands, and (3) a conditional measured Motion section wired end-to-end in the v3 schema, formatter, validator, docs, and tests. No new modes and no new motion tokens are introduced, and no binaries are bundled.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase 1 (`001-surgical-fixes`) is complete.
- The three cited wiring points (`schema-v3.ts`, `types.ts`, `design-md-format.md`) are verified against current code.
- Both Hallmark adoption research syntheses are reviewed for the manifest and motion grounding cited in spec.md.

### Definition of Done

- The owned-asset manifest schema is documented, provider-neutral, and states the never-hotlink constraint explicitly.
- The `motionCharacter` enum is documented and mapped onto existing bands, with no new tokens introduced.
- The conditional measured Motion section is wired through schema-v3, formatter/prompt, validator, docs, and tests.
- `validate.sh --strict` reports 0 errors for this spec folder.
- `checklist.md` is fully verified with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared reference contract pattern (mirrors the `012-style-database-and-interface-commands/004-interface-commands` `shared/creation-contract.md` precedent): each envelope is one owned reference document that modes and schema consume by reference, not by copying taste or duplicating fields.

### Data Flow

- **Owned-asset manifest:** asset intake -> manifest fields populated (source, rights, dimensions, role, crop/aspect, checksum, fallback) -> consuming mode reads the manifest -> the mode never reads or hotlinks a third-party binary path directly.
- **`motionCharacter` handoff:** a mode selects a semantic value (`quiet`/`snappy`/`elastic`/`static-first`) -> the value maps onto an existing timing/easing band -> interruption/reversal/async proof rules apply at handoff time, not at token definition time.
- **Measured Motion section:** the `MotionSystem` detector runs -> if real motion evidence is found, the schema-v3 Motion section is populated -> the formatter/prompt emits the section -> the validator checks it against schema-v3 -> if no evidence is found, the section is omitted entirely (conditionality is detector-driven, not phrase-driven).

### Key Components

- Owned-asset manifest schema/reference document.
- `motionCharacter` enum + band-mapping reference document.
- v3 schema Motion section fields (`schema-v3.ts`).
- Type definitions for the Motion section (`types.ts`).
- Formatter/prompt conditional-emission logic.
- Validator rule for the conditional section.
- `design-md-format.md` documentation update.
- Test coverage for conditional wiring (evidence present and absent).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Verify the three unverified wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) against current code; confirm Phase 1 (`001-surgical-fixes`) is complete; review both Hallmark adoption research syntheses for exact grounding.

### Phase 2: Implementation

Author the owned-asset manifest schema and its never-hotlink constraint; author the `motionCharacter` enum mapped onto existing timing/easing bands with interruption/reversal/async proof rules; wire the conditional measured Motion section through schema-v3, types, formatter/prompt, and validator; update `design-md-format.md`.

### Phase 3: Verification

Add or extend tests for conditional Motion section wiring (detector evidence present vs. absent); run `validate.sh --strict` on this spec folder and any touched sk-design test suites; verify the manifest and `motionCharacter` docs against the licensing note (clean-room, with a Hallmark MIT notice only if text is substantially copied).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Schema-level tests confirming the Motion section is present only when `MotionSystem` evidence exists, and absent otherwise.
- Contract-level review confirming the owned-asset manifest never references a Hallmark (or other third-party) binary path.
- Contract-level review confirming `motionCharacter` values map only onto existing bands, with no new duration-multiplier tokens introduced.
- Re-run of the existing sk-design checker suite applicable to schema/reference changes after wiring.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 (`001-surgical-fixes`) completion.
- Hallmark adoption research syntheses (`../../001-research/004-hallmark-design-skill-research/research/`).
- The existing `MotionSystem` detector (unchanged, consumed as-is).
- The existing v3 DESIGN.md schema/formatter/validator (`design-md-generator/backend/scripts/`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are additive documentation, schema, type, formatter, and validator edits gated behind detector evidence. Rollback is a revert of the files listed in spec.md's Files to Change table, with no data migration required, since nothing is built yet and no binaries are bundled.
<!-- /ANCHOR:rollback -->
