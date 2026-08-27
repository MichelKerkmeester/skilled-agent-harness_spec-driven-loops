---
title: "Implementation Plan: Phase 5: comment-extraction"
description: "Move instructional HTML comments out of authoring templates into discoverable sidecars while preserving load-bearing markers. Add additive per-document byte budgets and review the reduced golden snapshots without changing the renderer."
trigger_phrases:
  - "comment extraction plan"
  - "instructional comment leakage"
  - "template guidance sidecar"
  - "rendered byte budget"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 5: comment-extraction

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates, HTML comments, TypeScript, Vitest, and Node.js |
| **Framework** | system-spec-kit inline-gate renderer and scaffold contracts |
| **Storage** | Template sidecar guidance and golden snapshot output |
| **Testing** | Fresh scaffolds, comment scans, marker checks, byte-budget assertions, and snapshot review |

### Overview
Move SELF-CHECK, FAILURE-MODES, voice-guide, and footer-size comments from `.md.tmpl` files into sidecar guidance under `templates/manifest/guidance/`. Preserve `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE`, add the measured 90% byte ceilings, link the sidecars from the template guide, and leave the renderer unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The spec distinguishes instructional comments from load-bearing template markers.
- [x] The measured baselines and 90% byte ceilings are recorded.
- [x] The template, sidecar, snapshot, test, and author-guide paths are identified.

### Definition of Done
- [ ] Fresh scaffolds contain no targeted instructional comments and retain both required markers.
- [ ] Level 1 spec.md, Level 1 implementation-summary.md, and Level 2 spec.md stay at or below 3,852 B, 3,028 B, and 5,964 B.
- [ ] Sidecar guidance is linked from the template guide and the reviewed snapshot re-baseline contains only intended reductions.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sidecar author guidance with additive rendered-byte budgets. The renderer continues to process only the templates and never needs to load the sidecars.

### Key Components
- **Authoring templates**: `.opencode/skills/system-spec-kit/templates/manifest/*.md.tmpl` lose instructional comments but retain `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE`.
- **Guidance sidecars**: `.opencode/skills/system-spec-kit/templates/manifest/guidance/` stores the relocated author instructions.
- **Snapshot assertions**: `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` enforces per-document byte ceilings and marker preservation.
- **Snapshot evidence**: `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` records the reviewed reduced renders.
- **Author discoverability**: `.opencode/skills/system-spec-kit/references/templates/template-guide.md` links authors to the sidecar guidance.

### Data Flow
Authoring instructions move from inline comments to sidecars. The unchanged inline-gate renderer emits templates without those comments. Fresh scaffold output is scanned for comment leakage, checked for markers, measured against the byte budgets, and compared with the reviewed snapshot re-baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory instructional comments in every manifest template and separate them from the two load-bearing markers.
- [ ] Recompute the real renderer baselines for Level 1 spec.md, Level 1 implementation-summary.md, and Level 2 spec.md before setting the 90% ceilings.

### Phase 2: Core Implementation
- [ ] Create sidecar guidance files and link them from `template-guide.md`.
- [ ] Remove only SELF-CHECK, FAILURE-MODES, voice-guide, and footer-size comments from the manifest templates.
- [ ] Add additive byte-budget assertions and update the golden snapshot baseline for the reduced renders.

### Phase 3: Verification
- [ ] Render fresh scaffolds at each supported level and confirm no targeted instructional comment remains.
- [ ] Confirm `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE` still resolve in level detection and snapshots.
- [ ] Review the snapshot diff, confirm the renderer source is unchanged, and verify all byte ceilings.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template scan | Targeted instructional comments versus load-bearing markers | `rg` across `.opencode/skills/system-spec-kit/templates/manifest/` |
| Byte budget | Level 1 spec.md, Level 1 implementation-summary.md, and Level 2 spec.md | `scaffold-golden-snapshots.vitest.ts` |
| Snapshot | Reduced renders and marker output at supported levels | Vitest and `scaffold-golden-snapshots.vitest.ts.snap` |
| Discoverability | Sidecar links and author guidance | `template-guide.md` link inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Inline-gate renderer | Internal render contract | Green | Comment extraction could require an out-of-scope renderer change |
| `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE` markers | Level and snapshot contract | Green | Fresh scaffolds could fail detection |
| Golden snapshot harness | Internal verification | Green | The byte reduction and output scope cannot be reviewed |
| Template guide | Author guidance surface | Green | Sidecars would be difficult to discover |
| Measured rendered-byte baselines | Acceptance thresholds | Yellow | The 90% limits could be inaccurate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A marker failure, a byte-budget failure, an unintended snapshot diff, missing sidecar guidance, or any renderer change.
- **Procedure**:
  1. Restore the prior manifest templates, snapshot baseline, byte assertions, and guide links as one phase change set.
  2. Remove the phase sidecar files if the prior template contract is restored.
  3. Confirm the original scaffold output and renderer behavior before reopening extraction.
<!-- /ANCHOR:rollback -->
