---
title: "Completion-verdict freshness validation"
description: "Default-off strict validation rule that recomputes packet continuity fingerprints and flags stale completion claims after in-scope edits."
trigger_phrases:
  - "completion-verdict freshness validation"
  - "SPECKIT_COMPLETION_FRESHNESS"
  - "CONTINUITY_FRESHNESS validator"
  - "completion fingerprint freshness"
version: 3.6.0.1
---

# Completion-verdict freshness validation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Completion freshness validation detects when a previously green completion claim becomes stale after packet-local edits.

The feature is default-off. `SPECKIT_COMPLETION_FRESHNESS` enables warn-first strict validation, and `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` promotes stale freshness findings to blocking errors.

---

## 2. HOW IT WORKS

The validation helper recomputes a normalized continuity fingerprint from packet content, compares it with `_memory.continuity.session_dedup.fingerprint`, and checks packet-scoped dirty paths. Clean recomputes pass; stale fingerprints warn unless enforcement is enabled. Clock-drift cases are recognized as pass conditions.

`validate.sh --strict` wires the rule behind the flag, keeps flag-off output byte-identical, and uses the existing spec-doc structure helper to compute normalized fingerprint material.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/validation/continuity-freshness.ts` | Script | Fingerprint recompute, packet-scoped dirty paths, warn/enforce behavior |
| `mcp-server/lib/validation/spec-doc-structure.ts` | Shared | Normalized continuity fingerprint helper |
| `scripts/spec/validate.sh` | Script | Strict validation rule wiring and flag gate |
| `references/validation/validation-rules.md` | Reference | Operator documentation for the rule and flags |
| `mcp-server/ENV-REFERENCE.md` | Reference | Documents completion freshness flags |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/continuity-freshness.vitest.ts` | Automated test | Flag-off, stale warn, enforce error, clean recompute, and dirty-path coverage |
| `mcp-server/tests/spec-doc-structure.vitest.ts` | Automated test | Spec-doc fingerprint helper coverage |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/completion-verdict-freshness-validation.md`

Related references:
- [strict-validation-addons-continuity-freshness-and-evidence-markers.md](../../feature-catalog/tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md) - Strict validation add-ons
- [completion-verification-workflow.md](../../feature-catalog/tooling-and-scripts/completion-verification-workflow.md) - Completion verification workflow
