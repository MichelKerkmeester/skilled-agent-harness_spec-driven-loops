---
title: "Implementation Plan: Add Lazy On-Demand Add-On Documents Across Spec Kit Levels"
description: "Plan the manifest, template, scaffold, validator, snapshot, contract-test, and documentation wiring for level-agnostic lazy add-on documents"
trigger_phrases:
  - "lazy add-on implementation plan"
  - "spec-kit lazy templates"
  - "manifest lazyAddonDocs"
  - "create lazy add-ons"
  - "validate decision record optional"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Add Lazy On-Demand Add-On Documents Across Spec Kit Levels

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript, JSON, and Markdown |
| **Registry** | `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` |
| **Scaffold** | `.opencode/skills/system-spec-kit/scripts/spec/create.sh` |
| **Validator** | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` |
| **Contract Resolver** | `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts` |
| **Verification** | Vitest contract tests and scaffold golden snapshots |

### Overview

The later implementation step adds three manifest-backed templates, registers four lazy add-on document names at every level, and removes the decision record from level requirements. The manifest remains the source of truth for document classification. `create.sh` reads the lazy list only when `--with-lazy-addons` is present. `validate.sh` accepts registered lazy documents when they exist and never treats their absence as an error. The implementation updates the resolver tests, golden snapshots, and `CLAUDE.md` table to keep code, fixtures, and guidance aligned.

This phase writes only `spec.md`, `plan.md`, and `tasks.md`. The later implementation phase owns the code, template, snapshot, and documentation edits listed in the specification.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The three new document types and their required anchors are specified.
- [x] The all-level manifest behavior and decision-record compatibility rule are specified.
- [x] The scaffold opt-in, validator behavior, test updates, and documentation update have named files.

### Definition of Done for the Later Implementation Step

- [ ] All four lazy document names resolve at Levels 1, 2, 3, and 3+.
- [ ] The scaffold default path creates no lazy add-on documents.
- [ ] The explicit `--with-lazy-addons` path creates the four lazy documents.
- [ ] Validation accepts present lazy documents and does not require absent ones.
- [ ] Existing Level 3 and Level 3+ packets with `decision-record.md` remain valid.
- [ ] Contract tests, golden snapshots, and the `CLAUDE.md` table match the manifest.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use the existing manifest-driven document contract with an explicit lazy-document branch. Keep lazy documents level agnostic by placing their names in every level's `lazyAddonDocs` list and by using templates without level-gated sections.

### Key Components

- **Manifest registry**: Adds document metadata for the three new templates and classifies all four names as lazy at every level.
- **Template set**: Defines the fixed anchors and concise content shape for before-after, timeline, and roadmap records.
- **Scaffold path**: Adds `--with-lazy-addons` and emits the manifest's lazy document set only when the flag is present.
- **Validation path**: Treats registered lazy documents as valid-if-present and removes the decision-record absence check from Level 3 and Level 3+.
- **Contract and fixture layer**: Updates the resolver expectations, Vitest scaffold coverage, golden snapshots, and the operator-facing level table.

### Data Flow

1. The manifest declares the three new document entries and the four-name lazy list for each level.
2. The contract resolver exposes the unchanged required, optional, and lazy list shape from the manifest.
3. `create.sh` resolves the selected level and, only for `--with-lazy-addons`, renders each registered lazy template.
4. `validate.sh` checks the core and optional contract as before, then accepts any present registered lazy document without requiring it.
5. Tests compare resolver output and rendered files against the updated golden snapshots.
6. `CLAUDE.md` documents the same classification so authors see one contract.

### Document Shapes

| Document | Required Anchors | Primary Use |
|----------|------------------|-------------|
| `before-after.md` | `metadata`, `summary`, `comparison`, `net-effect`, `notes-caveats` | Capture what changed and why, pair prior and current state by aspect, explain the net effect, and record caveats |
| `timeline.md` | `metadata`, `timeline`, `milestones` | Record ordered events with when, what happened, and outcome |
| `roadmap.md` | `metadata`, `now-next-later`, `milestones-targets`, `dependencies` | Track strategic forward work with targets and dependencies, distinct from execution tasks |
| `decision-record.md` | Existing decision-record template anchors | Record material decisions at any level when needed |

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Templates and Manifest

- [ ] Create `before-after.md.tmpl` with metadata, summary, comparison, net-effect, and notes/caveats sections.
- [ ] Create `timeline.md.tmpl` with metadata, ordered timeline entries, and milestones.
- [ ] Create `roadmap.md.tmpl` with metadata, now-next-later planning, milestones/targets, and dependencies.
- [ ] Add version and document entries to `spec-kit-docs.json`.
- [ ] Add all four lazy names to each level's `lazyAddonDocs` list.
- [ ] Remove `decision-record.md` from every `requiredAddonDocs` and `optionalAddonDocs` list.

### Phase 2: Scaffold and Validator Wiring

- [ ] Add the `--with-lazy-addons` opt-in to `create.sh`.
- [ ] Keep the default scaffold output limited to the required core and existing optional behavior.
- [ ] Render the manifest's lazy templates when the explicit opt-in is present.
- [ ] Update `validate.sh` so lazy documents are valid-if-present and absent decision records do not fail Level 3 or Level 3+ validation.
- [ ] Confirm `level-contract-resolver.ts` preserves the manifest-derived list shape and does not reintroduce a level-specific decision-record rule.

### Phase 3: Regression Coverage and Documentation

- [ ] Update `level-contract-resolver.vitest.ts` for all-level lazy lists.
- [ ] Update `scaffold-golden-snapshots.vitest.ts` to render and check the new templates and opt-in behavior.
- [ ] Update `scaffold-golden-snapshots.vitest.ts.snap` with the approved output.
- [ ] Update `CLAUDE.md` to show required, optional, and lazy documents for each level.
- [ ] Run the verification matrix from REQ-009 and inspect the scoped implementation diff.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static template checks | Frontmatter, required anchors, ordered sections, and absence of placeholder text in all three templates | Shell checks and Vitest |
| Manifest contract matrix | Four lazy names at Levels 1, 2, 3, and 3+; decision record absent from required and optional lists | `level-contract-resolver.vitest.ts` |
| Scaffold behavior | No lazy files by default; four lazy files with `--with-lazy-addons` | Focused scaffold test and filesystem assertions |
| Validator behavior | Present and absent lazy files; Level 3 and Level 3+ packets with and without decision records | Focused validator matrix |
| Golden snapshots | Rendered output for the new templates and unchanged core output | `scaffold-golden-snapshots.vitest.ts` and its snapshot file |
| Documentation consistency | Level-document table matches manifest classification | Targeted text assertion and manual review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec-kit-docs.json` | Internal registry | Available | The resolver, scaffold, and validator lack a shared lazy contract |
| Existing manifest templates | Internal templates | Available | New documents cannot follow the established frontmatter and anchor format |
| `level-contract-resolver.ts` | Internal TypeScript contract layer | Available | Tests cannot confirm all-level classification |
| Vitest snapshot fixtures | Internal verification | Available | Rendered-output regressions lack a baseline |
| `CLAUDE.md` level-document table | Internal guidance | Available | Authors can receive stale level requirements |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The later implementation causes scaffold output, validation, contract resolution, or snapshot verification to fail outside the intended lazy-document behavior.
- **Procedure**:
  1. Revert only the later implementation changes in the three new manifest templates, `spec-kit-docs.json`, `create.sh`, `validate.sh`, resolver tests, snapshot tests, snapshots, and `CLAUDE.md`.
  2. Restore `decision-record.md` to the prior Level 3 and Level 3+ required lists if the decoupling change causes an unresolved compatibility failure.
  3. Re-run the focused contract, scaffold, validator, and snapshot checks before resuming the rollout.
  4. Keep existing packet `decision-record.md` files unchanged throughout rollback.

<!-- /ANCHOR:rollback -->
