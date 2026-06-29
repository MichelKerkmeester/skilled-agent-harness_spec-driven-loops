---
title: "Implementation Plan: AI Fingerprint Registry for the design-audit anti-slop layer"
description: "Plan to turn the prose-only AI-tell catalog into a machine-checkable per-model registry plus a generated self-defect card and a deterministic catalog-to-registry parity validator."
trigger_phrases:
  - "ai fingerprint registry plan"
  - "design audit anti-slop registry"
  - "ai tell registry validator"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/003-ai-fingerprint-registry"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all plan phases complete after registry, card, and validator shipped"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity enforceable now vs per-tell detection needing phase 004 fixtures: resolved as a deliberate fixture_id-named forward split"
---
# Implementation Plan: AI Fingerprint Registry for the design-audit anti-slop layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Skill / mode** | `sk-design`, `design-audit` mode (anti-slop layer) |
| **Artifact types** | JSON registry asset, generated advisory markdown card, deterministic parity validator |
| **Runtime** | Node ESM validator (sibling to existing `shared/scripts/*.mjs`); plain JSON data |
| **Validation** | Deterministic catalog-to-registry parity check; the self-defect card stays advisory |

### Overview
The audit mode detects model-specific AI tells from a prose catalog only (`design-audit/references/ai_fingerprint_tells.md`). The design-authoring counterpart already has two enforceable layers for the same tells, so audit tells cannot be machine-checked or bound to fixtures. This work adds a structured per-model registry, a self-defect card generated from it, and a validator that fails any catalog tell lacking a registry row or a fixture binding. The change is additive: the prose catalog and all existing assets are preserved, and the registry mirrors the catalog rather than replacing it.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target file and registry shape fixed by spec.md (registry path plus the seven row fields)
- [x] Current catalog tell inventory enumerated from `ai_fingerprint_tells.md`
- [x] Owner and severity vocabulary sourced from the catalog and rubric
- [x] Forward dependency on the sibling fixture corpus identified

### Definition of Done
- [x] Registry exists with one row per current catalog tell, all seven fields populated
- [x] Validator fails deterministically when a catalog tell has no matching row or fixture
- [x] Self-defect card generated from the registry and readable by the audit mode
- [x] Registry, card, and validator are discoverable from the audit mode; spec/plan/tasks synchronized

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-plus-validator. A single JSON registry is the source of structured per-model tells, a deterministic validator enforces parity between the prose catalog and the registry, and a generated advisory card aggregates the self-defect prompts. The prose catalog stays the human-readable layer; the registry is the machine-checkable layer beneath it.

### Key Components
- **`ai_fingerprint_registry.json`**: rows keyed by a stable tell slug, each carrying `tell_id`, `model_family`, `self_defect_prompt`, `deterministic_check`, `fixture_id`, `severity_floor`, `owner`.
- **Parity validator**: reads the prose catalog and the registry, exits non-zero when a catalog tell lacks a row or a row lacks a fixture binding.
- **Self-defect card**: a generated advisory markdown card that collects every row `self_defect_prompt` into one self-check surface.
- **Audit-mode wiring**: resource-map entries plus a catalog cross-link so the registry and card load alongside the prose catalog.

### Data Flow
1. The prose catalog enumerates tells per model family (Codex, Gemini, 2026-general).
2. The registry mirrors each catalog tell as one structured row.
3. The generator reads the registry and emits the advisory self-defect card.
4. The validator reads the catalog and registry and fails on any missing row or missing fixture binding.
5. The audit mode loads the registry and card as conditional resources beside the catalog.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Registry schema and rows
- [x] Define the registry JSON shape with the seven required fields
- [x] Author one row per current catalog tell (Codex, Gemini, 2026-general)
- [x] Set `severity_floor` and `owner` per row from the catalog severity rule and owner mapping
- [x] Use stable tell slugs and skill-relative paths so the registry stays evergreen

### Phase 2: Validator and generated self-defect card
- [x] Add the deterministic parity validator beside the existing shared validators
- [x] Validator parses catalog tells and registry rows; fails on missing row or missing fixture binding
- [x] Add the card generator that emits the advisory self-defect card from the registry
- [x] Generate the self-defect card

### Phase 3: Audit-mode wiring and verification
- [x] Wire the registry and card into the audit mode resource map (additive)
- [x] Cross-link the prose catalog to the registry (additive pointer)
- [x] Run the validator green against the real catalog and registry
- [x] Confirm a negative case (a removed row or fixture binding) fails the validator

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parity logic: complete registry passes; a dropped row or fixture binding fails | Node ESM validator |
| Integration | Validator run against the real catalog plus the authored registry | Node ESM validator |
| Manual | Audit mode loads the registry and card; self-defect card is readable and one prompt per row | Read + audit-mode dry run |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Prose catalog `ai_fingerprint_tells.md` | Internal | Green | Registry rows cannot mirror the catalog |
| Node ESM runtime | Internal | Green | Validator and generator cannot run |
| Fixture corpus (sibling fixture-corpus phase) | Internal | Pending | `fixture_id` targets resolve once the corpus lands; validate id presence and format now, defer file resolution |
| Audit-mode resource map (`design-audit/SKILL.md`) | Internal | Green | Registry and card not discoverable by the audit mode |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Registry diverges from the catalog, validator produces false failures, or wiring breaks audit-mode loading
- **Procedure**: Remove the new registry, card, and validator files, and revert the additive wiring edits; the prose catalog and existing assets are untouched

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Registry rows) ──> Phase 2 (Validator + card) ──> Phase 3 (Wiring + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Registry rows | None | Validator + card |
| Validator + card | Registry rows | Wiring + verify |
| Wiring + verify | Validator + card | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Registry schema and rows | Medium | 1.5-2 hours |
| Validator and self-defect card | Medium | 2-3 hours |
| Wiring and verification | Low | 1 hour |
| **Total** | | **4.5-6 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Validator green against the authored registry and the real catalog
- [x] Negative case confirmed to fail (removed row or fixture binding)
- [x] Additive scope verified: prose catalog and existing assets unchanged except the additive cross-link

### Rollback Procedure
1. **Immediate**: Stop calling the validator in any build or delivery step
2. **Revert files**: Remove the registry, card, and validator; revert the resource-map and catalog cross-link edits
3. **Verify**: Confirm the audit mode still loads the prose catalog cleanly
4. **Note**: Record the divergence reason in the implementation summary

### Data Reversal
- **Has data migrations?** No (pure skill assets, no stored state)
- **Reversal procedure**: File removal only; no data to preserve or migrate

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
