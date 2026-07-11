---
title: "Spec: deep-ai-council Canonical INTENT_SIGNALS Router + Type-1 Gold"
description: "Convert deep-ai-council's INTENT_MODEL (per-keyword tuple weights, unparseable by the Mode-A harness → D5=0 from 10 dead_intent_keys) to canonical INTENT_SIGNALS, add a 10-scenario Type-1 gold and a key-sync test, landing the already-designed PASS-92 conversion into the working tree."
trigger_phrases:
  - "deep-ai-council canonical router"
  - "INTENT_MODEL normalization"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/006-deep-ai-council-canonical-router"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Recover the 054 ADR-006 INTENT_SIGNALS blob or re-derive; convert + gold + test"
    blockers: []
    completion_pct: 5
    open_questions:
      - "Weight semantics: flatten to per-intent max weight vs uniform — operator decision"
    answered_questions: []
---
# Spec: deep-ai-council Canonical INTENT_SIGNALS Router + Type-1 Gold

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 006-deep-ai-council-canonical-router |
| **Level** | 1 |
| **Status** | Planned |
| **Blast radius** | Single skill; harness untouched; behavioral ~zero (weights never executed) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
deep-ai-council declares its router as `INTENT_MODEL = {...}` with per-keyword tuple weights
(`SKILL.md:145-156`). The Mode-A harness only parses `INTENT_SIGNALS` with flat keyword arrays
(`router-replay.cjs:71-87,246`), so `intentSignals` parses empty while `RESOURCE_MAP` (10 keys)
parses fine → `d5-connectivity.cjs:331-335` flags all 10 keys as `dead_intent_key` P1 → D5 = 0. Zero
orphans today; the entire D5=0 is the format mismatch. The per-keyword weights were **never executed
at runtime** (`classify_intents` is LLM-guidance + harness-parsed docs, imported nowhere). The 054
program already designed + scored this exact conversion (Mode-A PASS 92, D1intra 100) but that design
never landed in this branch's working tree — this phase lands it.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Convert the `SKILL.md` router block `INTENT_MODEL` → canonical `INTENT_SIGNALS` (keys identical to
  the 10 RESOURCE_MAP keys); sync the `classify_intents` pseudocode + the one prose reference.
- Add `manual_testing_playbook/intra-routing-recall/` with 10 single-intent scenarios,
  `expected_resources` = the router's designed load (Option G).
- Add a key-sync unit test (INTENT_SIGNALS keys == RESOURCE_MAP keys; paths exist; no orphans).
- Record the weight-flattening decision as durable-WHY prose.

**Out of scope:** harness edits; the Section-3 bash detection block; the 9-category operator playbook;
the concurrent migration edits entangled in the same file (preserve verbatim).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Router parses under `parseRouter`; D5 = 100, `deadIntentKeys: []`, `orphanReferences: []`.
- **R2:** Mode-A run over the 10-scenario corpus reaches ~PASS 92 (D1intra 100, D3 no waste).
- **R3:** Key-sync test green — the deep-loop slice of the CI drift guard (phase 012).
- **R4:** Weight decision documented; concurrent-migration lines in the file preserved.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. `d5-connectivity.cjs` → D5 100, no dead_intent_keys.
2. Each gold prompt routes only its targeted intent; routed set == expected_resources.
3. Key-sync vitest green.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Over-routing from raising a weak keyword to full intent weight* → keyword curation + one
  minimal-pair over-routing gold scenario.
- *Merge risk with the concurrent migration in the same file* → INTENT-block-scoped, disjoint edits.
- Depends on recovering the ADR-006 blob (byte-parity) or re-deriving; independent of other phases.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
**DECISION NEEDED — weight semantics.** Canonical INTENT_SIGNALS has one weight per intent, so
per-keyword weights (5/4/3) are lost (a narrow regression: loses intra-intent keyword-strength
gradient; does NOT affect Mode-A gate-passing since gold is single-intent). Options: (A2, recommended)
flatten to each intent's max original weight — COUNCIL_SETUP=4, rest=5; (A1) uniform; (B) extend the
harness to parse per-keyword weights (rejected — changes the contract for all 10 targets).
<!-- /ANCHOR:questions -->
