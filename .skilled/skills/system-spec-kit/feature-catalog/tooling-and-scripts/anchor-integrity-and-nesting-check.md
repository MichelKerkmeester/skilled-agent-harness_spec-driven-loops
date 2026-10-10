---
title: "Anchor integrity and nesting check"
description: "Fails a spec document whose anchors nest, close before they open or close more times than they open, and ignores anchor markers quoted in inline code."
trigger_phrases:
  - "Anchor integrity and nesting check"
  - "ANCHORS_VALID"
  - "nested anchor error"
  - "anchor opened inside"
version: 1.0.0.0
---

# Anchor integrity and nesting check (ANCHORS_VALID)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

ANCHORS_VALID checks the anchor markers in each spec document whose template defines anchors. Retrieval chunks a document by its anchors, so a nested anchor makes retrieval return the wrong region. The rule therefore treats nesting as an error, next to the duplicate, unclosed and unopened findings that the same rule already reports.

The rule does not compare anchor order against the template. It checks that the markers form well-formed regions.

---

## 2. HOW IT WORKS

### Integrity Findings

The rule ignores fenced code blocks. A document that carries no anchors, an anchor opened twice, an anchor that is never closed, a closer with no opener, or a closer that outnumbers its opener is an error. A phase parent keeps its lean document set exemption, and the research and review workflow documents are skipped as free-form.

### Nesting Findings

A nesting finding names the anchor and the anchor it sits inside, or the anchor that is still open when a closer arrives. The check reports an anchor opened inside another anchor, a closer that arrives before its opener, and a closer for an anchor that is not the innermost open anchor. The one allowed nesting is an `adr-NNN` anchor holding `adr-NNN-*` anchors, which is the per-decision layout of a decision record. Markers quoted inside inline code are ignored by the nesting check, so a documentation example is not read as structure.

### Output

The rule reports the number of integrity issues in its summary and lists each finding beneath it. A spec document with any finding fails the rule, and `validate.sh --strict` then reports `RESULT: FAILED`. The nested questions layout is the common case, and the anchor repair in the healer moves that opener back above its heading.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Handler | Runs the ANCHORS_VALID rule, the integrity checks and the nesting scan over each spec document |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Shared | Describes the rule, its error severity and the nesting behavior it reports |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts` | Vitest | Pins each anchor rule, including the nesting error and the adr-NNN allowance |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/anchor-integrity-and-nesting-check.md`

Related references:
- [heal-spec-docs-anchor-repair.md](heal-spec-docs-anchor-repair.md) - The repair that clears a nested questions anchor
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - The rule engine that runs ANCHORS_VALID with the other spec rules
