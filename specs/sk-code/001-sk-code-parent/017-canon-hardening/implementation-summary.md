---
title: "Implementation Summary: Phase 17 canon hardening"
description: "Executed summary for phase 017: the parent-hub bundleRules vocabulary was reconciled to one canonical shape and sk-code registry/router hygiene shipped in 3a76f99ccb; the placeholder-tail cleanup was resolved by the 016 metadata refresh; sk-code parent-skill-check STRICT is 0/0."
trigger_phrases:
  - "phase 017 implementation summary"
  - "canon hardening executed summary"
  - "bundleRules canon reconciled"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
parent: "sk-code/001-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T09:43:04.210Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; bundleRules canon reconciled, STRICT 0/0"
    next_safe_action: "124 rollup"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/sk-code/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is this phase executed?"
        answer: "Yes. bundleRules canon + sk-code registry/router hygiene shipped in 3a76f99ccb; sk-code parent-skill-check STRICT is 0/0."
      - question: "Was the placeholder-tail cleanup done in 017?"
        answer: "No. It was resolved by the 016 metadata refresh (af1170c663); 017 does not re-do it."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-canon-hardening |
| **Status** | Complete |
| **Level** | 3 |
| **Completion** | 100% |
| **Created** | 2026-07-05 |
| **Shipped In** | `3a76f99ccb` (placeholder-tail resolved by `af1170c663`) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 017 reconciled the parent-hub `bundleRules[]` vocabulary to one canonical shape and tidied the sk-code reference hub. The template and the validator (`parent-skill-check.cjs` check 5f) previously disagreed with the schema — the template used `when`/`primary`/`surfaces` and the validator read `modes`/`primary`/`evidence`, so a real bundle rule's mode references were invisible to the checker. Both moved to the schema's canonical `name`/`whenPrimary`/`includeSurfaces`/`whenAll`/`outcome` shape. sk-code's `surface-axis` packet list was renamed `surfacePackets` -> `surfaces`, and its registry and router versions were bumped from the 3-part `1.1.0` to the 4-part `4.1.0.0` (aligning with the hub identity). Shipped in `3a76f99ccb`.

### Files Changed

| File | Action | Purpose | Commit |
|------|--------|---------|--------|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Updated | Check 5f collects bundle-rule mode refs from the canonical `whenPrimary`/`includeSurfaces`/`whenAll` fields; absent fields are not punished | `3a76f99ccb` |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json` | Updated | `bundleRules` example rewritten to the canonical shape; ships one surfaceBundle and one orderedBundle example | `3a76f99ccb` |
| `.opencode/skills/sk-code/mode-registry.json` | Updated | `extensions.surface-axis.surfacePackets` -> `surfaces`; version `1.1.0` -> `4.1.0.0` | `3a76f99ccb` |
| `.opencode/skills/sk-code/hub-router.json` | Updated | Version `1.1.0` -> `4.1.0.0` | `3a76f99ccb` |

The planned schema-doc edit needed no change: the canonical shape was chosen to match `parent_hub_router_schema.md`, which already used `whenPrimary`/`includeSurfaces` — so only the template and validator moved to it. The planned placeholder-tail cleanup (three stale `"internal design notes"` fields in sk-code `description.json`/`graph-metadata.json`) was resolved by the 016 metadata refresh (`af1170c663`), so 017 does not re-do it.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three bundleRules authorities were read first, then the canonical shape was settled on the schema's already-documented `whenPrimary`/`includeSurfaces` fields. The template and validator were edited to that shape, keeping the validator additive: check 5f collects references only from the canonical fields and does not fail on absent bundleRules. sk-code's `surfaces` rename and 4-part version bumps landed alongside, and JSON validity plus both parent-skill-check runs were confirmed before commit `3a76f99ccb`. No deep-loop-workflows files were touched.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adopt the schema's `whenPrimary`/`includeSurfaces` shape as canonical | It is the clearest public contract and already documented; the template and validator moved to it rather than inventing a fourth shape |
| Keep check 5f additive/tolerant | The shared validator serves sk-code, sk-design, and deep-loop; 5f collects refs only from canonical fields and never fails on absent bundleRules, so deep-loop's 26 known failures did not increase |
| Leave the placeholder-tail to phase 016 | The 016 metadata refresh (`af1170c663`) had already dropped the three stale `"internal design notes"` fields; re-doing it in 017 would be redundant |
| Reconcile only the generic canon shape, not concrete hub rules | Declarative sk-code/sk-design surfaceBundle rules are left to later phases; 017 shipped the shape, not the hub-specific rules |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Evidence |
|-----------|--------|----------|
| `parent-skill-check` STRICT (sk-code) | Pass | 0 failures / 0 warnings, EXIT 0; 5f "bundleRules reference real modes" and 3f "surface-axis internally consistent" both PASS |
| deep-loop STRICT collision guard | Pass | deep-loop STRICT held at 26 failures — no regression from the validator change |
| Changed JSON validity | Pass | template, `mode-registry.json`, and `hub-router.json` parse as valid JSON |
| vocab-sync (sk-code) | Pass | drift false, 0/0 |
| Placeholder cleanup | Pass | zero `"internal design notes"` hits in the three named sk-code fields (removed by `af1170c663`) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Phase 019 owns the validator WARN->FAIL promotion (parent-skill-check checks 5-9) and the 124 packet rollup; 017 hardened consistency only and promoted no check.
2. Concrete declarative sk-code/sk-design surfaceBundle rules are not encoded yet; 017 reconciled only the generic canon shape, leaving hub-specific rules to later phases.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Edit `parent_hub_router_schema.md` to the canonical shape | No schema edit | The schema already used `whenPrimary`/`includeSurfaces`; the canonical choice matched it, so only the template + validator moved (`3a76f99ccb`) |
| Remove the three stale placeholder fields in this phase | Done by phase 016 | The 016 metadata refresh (`af1170c663`) dropped the stale merger/motion placeholders; 017 does not re-do it |

<!-- /ANCHOR:deviations -->
