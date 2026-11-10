---
title: "Implementation Plan: Phase 2: tasks-checklist-merge"
description: "Migrate the tasks and checklist pair to one level-gated document while preserving the framework contract, legacy packet reads, status derivation, acceptance coverage, and unchanged golden renders."
trigger_phrases:
  - "tasks checklist merge"
  - "unified verification document"
  - "legacy checklist read path"
  - "level contract migration"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 2: tasks-checklist-merge

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates, JSON, TypeScript, Bash, and Node.js |
| **Framework** | system-spec-kit scaffold, level-contract, validation, status, and coverage contracts |
| **Storage** | Template sources, generated distributions, golden snapshots, and existing specification packets |
| **Testing** | Golden snapshots, status comparison, targeted rule checks, and `validate.sh --strict` |

### Overview
Replace the separate authoring pair with a unified `tasks.md` document that carries tasks at every level and verification/testing sections at L2 and above. Treat the change as a framework-contract migration across `create.sh`, `validate.sh`, the level-gated document table, all five reader surfaces, and existing packets, with a legacy `checklist.md` read path until shipped packets age out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase spec defines level-gated output, legacy compatibility, reader surfaces, snapshot rules, dist rebuilds, and strict validation.
- [x] The generator, validator, level-document manifest, reader surfaces, and representative existing packets are named.
- [x] The check-anchors versus compare divergence is isolated before the template merge is attempted.

### Definition of Done
- [ ] The unified template renders tasks only at L1 and adds verification/testing sections at L2, L3, and L3+.
- [ ] New scaffolds and existing packets resolve the merged document while legacy standalone checklists still derive the original status.
- [ ] Snapshot, dist, and strict-validation gates pass with only the reviewed merged-document diff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Versioned contract migration with a compatibility read path: write the new document shape, update every producer and reader, and continue reading legacy packets during rollout.

### Key Components
- **Unified document source**: `.opencode/skills/system-spec-kit/templates/core/tasks.md.tmpl`; retire `.opencode/skills/system-spec-kit/templates/addons/checklist.md.tmpl` only after the legacy read path is proven.
- **Level contract**: `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh`, and `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` define creation, detection, and level-gated document requirements.
- **Reader surfaces**: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts`, `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts`, `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh`, and `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh` must resolve the merged document without losing legacy behavior.
- **Compatibility evidence**: Existing packets such as `specs/sk-git/011-feature-catalog-and-manual-playbook/` and `specs/sk-git/008-research-and-requirements/`, plus the golden snapshot file, prove the migration boundary.

### Data Flow
The level contract creates the unified document for new packets. Status, priority, anchor, and acceptance-coverage readers prefer the merged content and fall back to a standalone legacy checklist. Snapshot comparisons and representative packet validation prove that the reader transition does not change shipped status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture fresh L1/L2/L3/L3+ render baselines and legacy packet status before edits.
- [ ] Isolate the `check-anchors.sh` and `template-structure.js compare` divergence before changing the unified template.
- [ ] Inventory every `checklist.md` reference in the level-document table, `create.sh`, `validate.sh`, and the five reader surfaces.

### Phase 2: Core Implementation
- [ ] Move tasks, verification, testing, notation, completion, and required anchors into `tasks.md.tmpl`, gating verification/testing at L2+.
- [ ] Update the level-document table, `create.sh`, and `validate.sh` so new scaffolds and level detection use the merged contract.
- [ ] Retarget status, priority-tag, anchor, and acceptance-coverage readers to the merged document with a legacy checklist fallback.
- [ ] Rebuild both distribution trees and review the generated contract against representative existing packets.

### Phase 3: Verification
- [ ] Confirm merged renders at every supported level and empty diffs for every unchanged level-by-document render.
- [ ] Compare derived status before and after the migration across the shipped legacy packet set.
- [ ] Run the fresh L1/L2/L3 and legacy strict-validation gates and record the reviewed snapshot result.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Manifest rows, level gates, create/validate behavior, and anchor expectations | Targeted `rg`, `check-anchors.sh`, and `template-structure.js compare` |
| Compatibility | Before/after status for fresh and existing legacy packets | `deriveStatus` comparison and representative packet sweep |
| Snapshot | Byte identity for unchanged renders and reviewed diff for the merged document | `scaffold-golden-snapshots.vitest.ts` |
| Validation | Fresh L1/L2/L3 scaffolds and shipped legacy packets | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `templates/spec-kit-docs.json` level table | Internal contract | Green | New scaffolds can create the wrong document set |
| `scripts/spec/create.sh` and `scripts/spec/validate.sh` | Internal tools | Green | Creation and level detection can diverge |
| `scripts/rules/check-anchors.sh` and `template-structure.js` | Internal verification | Yellow | The merge cannot pass anchor validation until their divergence is understood |
| Existing packets under `specs/` | Compatibility corpus | Green | Legacy status and validation regressions can go undetected |
| `scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Internal evidence | Green | Byte-identity proof is incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any status change in an existing packet, unexpected anchor failure, dangling level-contract reference, non-empty unchanged snapshot diff, or strict-validation failure.
- **Procedure**:
  1. Restore the prior separate `tasks.md.tmpl` and `checklist.md.tmpl` contract, manifest rows, `create.sh`, `validate.sh`, and reader bindings.
  2. Restore the prior snapshot baseline and both distribution trees from the restored sources.
  3. Re-run the representative existing-packet status and validation checks before reopening the migration.
<!-- /ANCHOR:rollback -->
